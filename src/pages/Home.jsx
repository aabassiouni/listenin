import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import FriendsList from "../components/FriendsList";
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


	const navigate = useNavigate();



	useEffect(() => {
		console.log("useEffect in home component is being called");

		spotifyApi.setAccessToken(token);

		async function fetchData() {
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

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<div className="Home h-screen max-h-screen overflow-clip bg-palette-400">
			<NavBar />
			<div className="Spacer p-2"></div>

			<div className="Messenger flex flex-col items-center gap-5 bg-palette-400">
				{/* <Chat client={chatClient} theme="str-chat__theme-dark"> */}
				<div className="flex flex-col items-center rounded-xl bg-palette-100 p-3">
					{/* <div className="Spacer p-2"></div> */}
					<Card spotifyApi={spotifyApi} user={user} />
					<div className="Spacer p-1"></div>
					<div className="min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-200 p-4 text-center font-['Gotham'] text-white text-shadow">Messages</div>
				</div>
				<div className="friends-list-header rounded-xl bg-palette-100 p-2">
					<p className="title text-center font-['Gotham'] text-lg font-bold text-white text-shadow">Friends: {following.length}</p>
				</div>
				<FriendsList following={following} />
				{/* </Chat> */}
			</div>
		</div>
	);
}

export default Home;
