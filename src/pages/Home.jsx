import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import FriendsList from "../components/FriendsList";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import LoadingPage from "../components/LoadingPage";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../spotify/spotify";
import Messages from "../components/Messages";
import AddFriendsButton from "../components/AddFriendsButton";
import Setup from "./Setup";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import {app} from "../firebase";

function Home() {
	console.log("Home component is being rendered");

	const { token, isLoggedIn, getRefreshToken } = useUser();
	const [id, setId] = useState(null);
	const [user, setUser] = useState(null);

	const [isLoading, setIsLoading] = useState(true);
	const [following, setFollowing] = useState([]);

	// const navigate = useNavigate();
	const auth = getAuth(app);

	useEffect(() => {
		console.log("useEffect in home component is being called");

		spotifyApi.setAccessToken(token);

		async function fetchData() {
			try {
				console.log("fetchData is being called");

				console.log("fetching spotify profile");
				const spotifyProfile = await spotifyApi.getMe().catch((err) => {
					console.log("error fetching spotify profile");
					console.log("error is", err);

					getRefreshToken();
				});

				console.log("spotifyProfile:", spotifyProfile);

				const spotifyID = spotifyProfile?.id;

				console.log("fetching user profile");
				const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}`);
				console.log("userProfile:", userProfile);

				console.log("fetching following");
				const following = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/following`);
				console.log("following:", following);
				
				const firebase_token = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/firebase_token`).then((res) => {
					console.log("firebase_token is", res.data);
					// return res;
				});
				// console.log("firebase_token:", firebase_token.data);
				signInWithCustomToken(auth, firebase_token)
				.then((userCredential) => {
					// Signed in
					// const user = userCredential.user;
					console.log("firebase user is", user);
				})
				.catch((error) => {
					
					console.log("firebase error is", error);
				});

				const userObj = {
					id: userProfile?.data?.spotifyID,
					name: userProfile?.data?.email,
				};
				console.log("userObj:", userObj);

				if (userProfile.data) {
					setUser(userProfile?.data);
				}
				setFollowing(following?.data);
				setIsLoading(false);
				console.log("setting isLoading to false");
			} catch (err) {
				console.log("error in fetchData");
				console.log("error is", err);
			}
		}

		fetchData();
		// setIsLoading(false);
	}, [token]);

	if (isLoading) {
		return <LoadingPage />;
	} else if (user?.accountSetup === false) {
		return <Setup user={user} />;
	}

	return (
		<div className="Home h-screen max-h-screen overflow-clip bg-palette-400">
			<NavBar />
			<div className="Spacer p-2"></div>

			<div className="Messenger flex flex-col items-center gap-5 bg-palette-400">
				<div className="flex flex-col items-center rounded-xl bg-palette-100 p-3">
					<Card spotifyApi={spotifyApi} user={user} />
					<div className="Spacer p-1"></div>
					<Messages spotifyApi={spotifyApi} user={user}/>
				</div>
				<div className="flex gap-5">
					<div className="friends-list-header rounded-xl bg-palette-100 p-2">
						<p className="title text-center font-['Gotham'] text-lg font-bold text-white text-shadow">Friends: {following.length}</p>
					</div>
					<AddFriendsButton user={user}/>
				</div>
				<FriendsList user = {user} following={following} />
			</div>
		</div>
	);
}

export default Home;
