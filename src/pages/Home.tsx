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
import toast, { Toaster } from "react-hot-toast";
import { FriendsContextProvider } from "../context/friendsContext";
import { useFriends } from "../context/friendsContext";

export type User = {
	id: string;
	name: string;
	email: string;
	spotifyID: string;
	profilePicture?: string;
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

	const { token, isLoggedIn, getRefreshToken, user, setUser } = useUser();
	// const [user, setUser] = useState<User>({ id: "", name: "", email: "", spotifyID: "" });
	const { friends, setFriends} = useFriends();
	const [isLoading, setIsLoading] = useState<Boolean>(true);

	const auth = getAuth(app);

	useEffect(() => {
		console.log("useEffect in home component is being called");

		spotifyApi.setAccessToken(token);

		async function fetchData() {
			try {
				const spotifyProfile = await spotifyApi.getMe()
				.catch((err) => {
					getRefreshToken();
				});
				
				//typescript is so annoying
				// if(!spotifyProfile?.images) {
				// 	throw new Error("spotifyProfile is undefined");
				// }

				console.log("spotifyProfile is", spotifyProfile)

				const spotifyID = spotifyProfile?.id;

				const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}`);
				console.log("userProfile in home is", userProfile);
				
				const firebase_token = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/firebase_token`);

				signInWithCustomToken(auth, firebase_token.data).catch((error) => {
					console.log("firebase error is", error);
				});
				
				
				const userObj = {
					id: userProfile?.data?.username,
					name: userProfile?.data?.email,
					email: userProfile?.data?.email,
					spotifyID: userProfile?.data?.spotifyID,
					// profilePicture: spotifyProfile?.images ? spotifyProfile?.images[0]?.url : "",
				};

				if (userProfile.data) {
					console.log("setting user to", userObj);
					setUser(userObj);
					setFriends(userProfile.data.friends);
				}

				setIsLoading(false);
				console.log("setting isLoading to false");
			} catch (err) {
				console.log("error in fetchData", err);
				console.log("error is", err);
			}
		}

		fetchData();
	}, [token]);

	if (isLoading) {
		return <LoadingPage />;
	} else if (user?.accountSetup === false) {
		return <Setup user={user} />;
	}

	return (
		<div className="Home safe-h-screen max-safe-h-screen overflow-clip bg-black">
			<Toaster position="bottom-center" />
			<NavBar />
			<div className="Spacer p-2"></div>
			<NewCard spotifyApi={spotifyApi} user={user} />
			<div className="Spacer p-2"></div>
			{/* <FriendsContextProvider> */}
				<div className="mx-6 flex justify-between">
					<h1 className="font-['Montserrat'] text-4xl font-semibold text-white">Chats</h1>
					<AddFriendsButton user={user} />
				</div>
				<div className="Spacer p-2"></div>
				<FriendsList user={user} />
			{/* </FriendsContextProvider> */}
		</div>
	);
}

export default Home;
