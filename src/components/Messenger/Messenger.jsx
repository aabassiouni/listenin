import React from "react";
import { Channel, ChannelHeader, MessageInput, MessageList, Window, useChatContext } from "stream-chat-react";

import "./Messenger.css";

function ChatDownComponent() {
	return <div className="chat-down h-full rounded-xl">s</div>;
}
function Messenger() {
	console.log("Messenger component is being rendered");

	const { channel } = useChatContext();

	console.log("channel data is", channel?.data);

	return (
		<div className="messenger-container max-h-[50%]">
			{/* <ChannelList /> */}
			<Channel channel={channel} TypingIndicator={() => null}>
				<Window>
					<ChannelHeader />
					{/* <CustomChannelHeader /> */}
					<div className="message-list-container">
						<MessageList noGroupByUser={true} messageActions={[]} disableDateSeparator />
					</div>
					<div className="message-input-container absolute bottom-0 w-full ">
						<MessageInput />
					</div>
				</Window>
			</Channel>
		</div>
	);
}

export default Messenger;
