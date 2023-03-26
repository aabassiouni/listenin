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
import { app } from "../firebase";
import SpotifyWebApi from "spotify-web-api-js";
import NewCard from "../components/NewCard";

export type User = {
	id: string;
	name: string;
	email: string;
	accountSetup?: boolean;
	refresh_token?: string;
};

export type Song = {
	name: string;
	albumArt: string;
	artist: string;
	id: string;
};

function Home() {
	console.log("Home component is being rendered");

	const { token, isLoggedIn, getRefreshToken } = useUser();
	const [id, setId] = useState<string | null>(null);
	const [user, setUser] = useState<User>({ id: "", name: "", email: "" });

	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const [following, setFollowing] = useState<string[]>([]);

	// const navigate = useNavigate();
	const auth = getAuth(app);

	useEffect(() => {
		console.log("useEffect in home component is being called");

		spotifyApi.setAccessToken(token);

		async function fetchData() {
			try {
				const spotifyProfile = await spotifyApi.getMe().catch((err) => {
					getRefreshToken();
				});

				const spotifyID = spotifyProfile?.id;

				const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}`);

				const following = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/following`);

				const firebase_token = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/firebase_token`);

				signInWithCustomToken(auth, firebase_token.data).catch((error) => {
					console.log("firebase error is", error);
				});

				const userObj = {
					id: userProfile?.data?.spotifyID,
					name: userProfile?.data?.email,
					email: userProfile?.data?.email,
				};

				if (userProfile.data) {
					console.log("setting user to", userObj);
					setUser(userObj);
				}
				setFollowing(following?.data);
				setIsLoading(false);
				console.log("setting isLoading to false");
			} catch (err) {
				console.log("error in fetchData", err);
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
		<div className="Home h-screen max-h-screen overflow-clip bg-black">
			<NavBar />
			<div className="Spacer p-2"></div>
			<NewCard spotifyApi={spotifyApi} user={user} />
			<div className="Spacer p-2"></div>
			<div className="flex mx-6 justify-between">
				<h1 className=" font-['Gotham'] text-4xl text-white">Chats</h1>
				<AddFriendsButton user={user} />
			</div>
			<div className="Spacer p-2"></div>
			<FriendsList user={user} following={following} />

			<div className="Messenger flex flex-col items-center gap-5 bg-black">
				{/* <div className="flex flex-col items-center rounded-xl bg-palette-100 p-3">
					<Card spotifyApi={spotifyApi} user={user} />
					<div className="Spacer p-1"></div>
					<Messages spotifyApi={spotifyApi} user={user} />
				</div> */}
				{/* <div className="flex gap-5">
					<div className="friends-list-header rounded-xl bg-palette-100 p-2">
						<p className="title text-center font-['Gotham'] text-lg font-bold text-white text-shadow">Friends: {following.length}</p>
					</div>
					<AddFriendsButton user={user} />
				</div> */}
				{/* <FriendsList user={user} following={following} /> */}
			</div>
		</div>
	);
}

export default Home;
