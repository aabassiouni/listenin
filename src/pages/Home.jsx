import React, { useState, useEffect, useContext } from "react";
import Card from "../components/Card/Card";
import Messenger from "../components/Messenger/Messenger";
import { Chat, ChannelList, useChatContext, ChatDown } from "stream-chat-react";
import { useStreamClient } from "../hooks/UseStreamClient";
import { UserContextProvider } from "../context/userContext";
import { UserContext } from "../context/userContext";
import LogoutButton from "../components/LogoutButton/LogoutButton";
import { getHashParams } from "../util/util.js";
import { Divider } from "@mui/material";
import axios from "axios";
import FriendsList from "../components/FriendsList/FriendsList";
import { StreamChat } from "stream-chat";
import NavBar from "../components/NavBar/NavBar";
import TestCard from "../components/TestCard/TestCard";

function Home() {
	const { user, dispatch } = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(true);
	const [following, setFollowing] = useState([]);
	const [chatClient, setChatClient] = useState(null);

	console.log("user value in home component from context is", user);

	var userObj = {};
	let didUserConnectInterrupt = false;

	if (user != null) {
		const activeuser = user.user;
		userObj = {
			id: activeuser.streamID,
			name: activeuser.email,
			image: activeuser.profilePicture,
		};
	} else {
		console.log("error while trying to set userObj");
	}

	// const chatClient = new StreamChat('vvucrr6yge97');
	// console.log("chatClient value in home component: ", chatClient);
	// const stream_token = chatClient.devToken(userObj.id);
	// console.log("stream_token value in home component: ", stream_token);

	// const chatClient = useStreamClient({ apiKey: 'vvucrr6yge97', userData: userObj, tokenOrProvider: '' });
	// console.log("chatClient value in home component: ", chatClient);

	useEffect(() => {
		const getFollowing = async () => {
			try {
				var userID = user?.user.streamID;
				const res = await axios.get(
					`http://localhost:8888/users/${userID}/following`
				);
				setFollowing(res.data);
			} catch (err) {
				console.log("error fetching friends in home component");
				console.log(err);
			}
		};

		async function connectUser() {
			await chatClient.connectUser(userObj, stream_token);
			console.log("user connected to chatClient");
			return;
		}

		const chatClient = new StreamChat("vvucrr6yge97");
		setChatClient(chatClient);

		const stream_token = chatClient.devToken(userObj.id);

		getFollowing();
		connectUser();

		return () => {
			didUserConnectInterrupt = true;
			setChatClient(null);
			// wait for connection to finish before initiating closing sequence
			chatClient
				.disconnectUser()
				.catch((err) => {
					console.log("error disconnecting user", err);
				})
				.then(() => {
					console.log("connection closed");
				});
		};
	}, [user]);

	// check if there is a user before rendering the page
	useEffect(() => {
		if (user) {
			setIsLoading(false);
		}
	}, [user]);

	if (isLoading) {
		return (
		<div className="flex h-screen w-screen justify-center items-center bg-palette-400">
			<span className="font-bold font-['Gotham'] text-shadow text-neutral-50 text-3xl">Loading...</span>
		</div>
		)
	}

	return (
		<div className="Home bg-[#0D2818] h-screen max-w-screen max-h-screen overflow-hidden">
			<NavBar />
			<div className="Messenger flex max-h-[calc(100vh_-_77px)]">
				{isLoading ? (
					<ChatDown />
					) : (
					<Chat client={chatClient} theme='str-chat__theme-dark'>
							<div className="chat-sidebar flex flex-col flex-grow-0 justify-center items-center w-1/2">
								<div className="flex flex-col w-[80%] flex-grow-0 items-center max-h-[90%] rounded-xl overflow-scroll bg-[#16DB65] max-w-[80%]">
									<div className="Spacer p-2"></div>
									<TestCard />
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
				)}
			</div>
		</div>
	);
}

export default Home;
