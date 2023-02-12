import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Messenger from "../components/Messenger/Messenger";
import { Chat } from "stream-chat-react";
import { useUser } from "../context/userContext";
import axios from "axios";
import FriendsList from "../components/FriendsList/FriendsList";
import { StreamChat } from "stream-chat";
import NavBar from "../components/NavBar/NavBar";
import TestCard from "../components/TestCard/TestCard";
import LoadingPage from "../components/LoadingPage";

function Home() {
	console.log("Home component is being rendered");

	const {token, isLoggedIn} = useUser();
	const [id, setId] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [following, setFollowing] = useState([]);
	const [chatClient, setChatClient] = useState(null);


    const spotifyApi = new SpotifyWebApi();
	
	useEffect(() => {

		console.log("useEffect in home component is being called");
		
		spotifyApi.setAccessToken(token);
		async function fetchData(){
			
			const spotifyProfile = await spotifyApi.getMe();
			console.log("spotifyProfile:", spotifyProfile);

			const spotifyID = spotifyProfile.id;
			setId(spotifyID);
			console.log("id:", id);

			const userProfile = await axios.get(`https://listenin-cvwos.ondigitalocean.app/users/?userID=${spotifyID}`);
			setUser(userProfile.data);
			console.log("userProfile:", userProfile);

			const following = await axios.get(`https://listenin-cvwos.ondigitalocean.app/users/${spotifyID}/following`);
			setFollowing(following.data);
			console.log("following:", following);

			const userObj = {
				id: userProfile.data.streamID,
				name: userProfile.data.email,
				image: userProfile.data.profilePicture,
			};
			console.log("userObj:", userObj);

			const chatClient = new StreamChat("vvucrr6yge97");
			const stream_token = chatClient.devToken(userObj.id);
			await chatClient.connectUser(userObj, stream_token);

			setChatClient(chatClient);

		}

		fetchData()
		
	}, []);

	// check if there is a user before rendering the page
	useEffect(() => {
		if (chatClient) {			
			setIsLoading(false);
		}
	}, [chatClient]);

	if (isLoading) {
		return (
		<LoadingPage />
		)
	}

	return (
		<div className="Home bg-[#0D2818] h-screen max-w-screen max-h-screen overflow-hidden">
			<NavBar />
			<div className="Messenger flex max-h-[calc(100vh_-_77px)]">
					<Chat client={chatClient} theme='str-chat__theme-dark'>					
							<div className="chat-sidebar flex flex-col flex-grow-0 justify-center items-center w-1/2">
								<div className="flex flex-col w-[80%] flex-grow-0 items-center max-h-[90%] rounded-xl overflow-scroll bg-[#16DB65] max-w-[80%]">
									<div className="Spacer p-2"></div>
									<TestCard spotifyApi={spotifyApi} user = {user}/>
									<div className="Spacer p-3"></div>

									<div className="friends-list-header p-2 rounded-xl bg-palette-400">
										<p className="title text-center text-white font-bold font-['Gotham'] text-shadow text-lg">Friends: {following.length}</p>
									</div>

									<div className="Spacer p-2"></div>

									<div className="border overflow-scroll w-full">
										<FriendsList following={following} />
									</div>
								</div>
							</div>
						<div className=" w-4/5 chat-box grid place-items-center max-h-full">
							<div className="chat-box-wrapper w-[80%] h-[80%] max-h-full">
								<Messenger />
							</div>
						</div>
					</Chat>
			</div>
		</div>
	);
}

export default Home;
