import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Messenger from "../components/Messenger/Messenger";
import { Chat } from "stream-chat-react";
import { useUser } from "../context/userContext";
import axios from "axios";
import FriendsList from "../components/FriendsList";
import { StreamChat } from "stream-chat";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import LoadingPage from "../components/LoadingPage";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../spotify/spotify";

function Home() {
	console.log("Home component is being rendered");

	const { token, isLoggedIn, getRefreshToken } = useUser();
	const [id, setId] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [following, setFollowing] = useState([]);
	const [chatClient, setChatClient] = useState(null);

	const navigate = useNavigate();

	// const spotifyApi = new SpotifyWebApi();

	useEffect(() => {
		console.log("useEffect in home component is being called");

		spotifyApi.setAccessToken(token);

		async function fetchData() {
			console.log("fetchData is being called");

			console.log("fetching spotify profile");
			const spotifyProfile = await spotifyApi.getMe().catch((err) => {
				console.log("error fetching spotify profile");
				console.log("error is", err);
				// navigate("/login");
				getRefreshToken();
			});
			// .then((response) => {
			// 	console.log("response is", response)
			// 	if (!response) {
			// 		getRefreshToken();
			// 	}
			// });
			console.log("spotifyProfile:", spotifyProfile);

			const spotifyID = spotifyProfile?.id;
			// setId(spotifyID);
			// console.log("id:", id);

			console.log("fetching user profile");
			const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/?userID=${spotifyID}`);
			console.log("userProfile:", userProfile);

			console.log("fetching following");
			const following = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/following`);
			console.log("following:", following);

			const userObj = {
				id: userProfile?.data?.streamID,
				name: userProfile?.data?.email,
				image: userProfile?.data?.profilePicture,
			};
			console.log("userObj:", userObj);

			if (userObj.id) {
				console.log("creating chat client");
				const chatClient = new StreamChat("vvucrr6yge97");
				const stream_token = chatClient.devToken(userObj.id);
				await chatClient.connectUser(userObj, stream_token);

				setChatClient(chatClient);
			}

			if (userProfile.data) {
				setUser(userProfile?.data);
			}
			setFollowing(following?.data);
			setIsLoading(false);
			console.log("setting isLoading to false");
		}

		fetchData();
		// setIsLoading(false);
	}, [token]);

	// check if there is a user before rendering the page
	// useEffect(() => {
	// 	if (chatClient) {
	// 		setIsLoading(false);
	// 	}
	// }, [chatClient]);

	if (isLoading) {
		return <LoadingPage />;
	}

	if (!chatClient) {
		return <LoadingPage />;
	}

	return (
		<div className="Home max-h-screen h-screen overflow-clip bg-palette-400">
			<NavBar />
			<div className="Spacer p-2"></div>

			<div className="Messenger flex flex-col items-center gap-7 bg-palette-400">
				<Chat client={chatClient} theme="str-chat__theme-dark">
					<div className="flex flex-col items-center rounded-xl bg-palette-100 ">
						<div className="Spacer p-2"></div>
						<Card spotifyApi={spotifyApi} user={user} />
						<div className="Spacer p-2"></div>
					</div>
					<div className="friends-list-header rounded-xl bg-palette-100 p-2">
						<p className="title text-center font-['Gotham'] text-lg font-bold text-white text-shadow">Friends: {following.length}</p>
					</div>
					<FriendsList following={following} />
				</Chat>
			</div>
		</div>
	);
}

export default Home;
