import React, { useState, useEffect, useContext } from "react";
import { StreamChat } from "stream-chat";
import {
	Chat,
	ChatDown,
	SendButton,
	Channel,
	ChannelList,
	ChannelHeader,
	MessageInput,
	MessageList,
	VirtualizedMessageList,
	Thread,
	Window,
	useChatContext,
	InfiniteScroll,
} from "stream-chat-react";
import { useStreamClient } from "../../hooks/UseStreamClient.js";
import { UserContext } from "../../context/userContext";
import { CustomPreview } from "../CustomPreview/CustomPreview.jsx";
import axios from "axios";
// import 'stream-chat-react/dist/css/v2/index.css';
import CustomChannelHeader from "../CustomChannelHeader/CustomChannelHeader.jsx";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator.jsx";
// import { useStreamClient } from 'C:\\Users\\Ali Bassiouni\\Documents\\PROJECTS\\listenin\\src\\hooks\\UseStreamClient.js';

import "./Messenger.css";

var testuser = {
	id: "test-user-1",
	name: "Ali Bassiouni",
	image: "https://getstream.io/random_png/?id=solitary-wood-9&name=solitary-wood-9",
};

function ChatDownComponent() {
	return <div className="chat-down h-full rounded-xl">s</div>;
}
function Messenger() {
	console.log("Messenger component is being rendered");

	//wait for user to be set in the context
	const { user, dispatch } = useContext(UserContext);
	const { channel } = useChatContext();

	console.log("user value in messenger component from context is", user);

	const activeuser = user?.user;
	var userObj = {};

	try {
		userObj = {
			id: activeuser.streamID,
			name: activeuser.email,
			image: activeuser.profilePicture,
		};
	} catch (error) {
		console.log("error while trying to set userObj", error);
	}

	console.log("channel data is", channel?.data);
	// const chatClient = useStreamClient({ apiKey: 'vvucrr6yge97', userData: userObj, tokenOrProvider: '' });

	// const filters = { type: 'messaging', members: { $in: [userObj.id] } };

	// if (!chatClient) {
	//         return <div>Loading: no chat client</div>;
	//     }

	return (
		//     // <Chat client={chatClient} theme='str-chat__theme-dark'>

		<div className="messenger-container max-h-[50%]">
			{/* <ChannelList /> */}
			<Channel channel={channel} TypingIndicator={() => null}>
				<Window>
					<ChannelHeader />
					{/* <CustomChannelHeader /> */}
					<div className="message-list-container">
						<MessageList
							noGroupByUser={true}
							messageActions={[]}
							disableDateSeparator
						/>
					</div>
					<div className="message-input-container absolute bottom-0 w-full ">
						<MessageInput />
					</div>
				</Window>
				{/* <Thread /> */}
			</Channel>
		</div>
		// {/* </Chat> */}
	);
}

export default Messenger;
