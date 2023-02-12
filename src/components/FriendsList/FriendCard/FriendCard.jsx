import React, { useState, useEffect } from "react";
import LikeButton from "../../LikeButton/LikeButton";
import { useChatContext } from "stream-chat-react";
import axios from "axios";

function FriendCard(props) {
	console.log("Card is being rendered");

	const [friend, setFriend] = useState({});
	const { client, setActiveChannel } = useChatContext();

	console.log("friend being rendered is", friend);
	var propsUser = props.user;

	const [song, setSong] = useState({ name: "Not Checked", albumArt: "http://localhost:8888/images/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png", artist: "" });

	async function handleClick() {
		var userID = propsUser;

		await axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
			var userFromApi = res.data;
			setFriend(userFromApi);
			setSong({
				name: res.data.lastPlayed.name,
				albumArt: res.data.lastPlayed.albumArt,
				artist: res.data.lastPlayed.artist,
			});
		});

		const filter = { members: { $in: ["test-user-2"] } };
		const channels = await client.queryChannels(filter);
		console.log("channels are", channels);
		setActiveChannel(channels[0]);
	}

	return (
		<div className="friend-card flex h-[74px] w-3/5 flex-row">
			<div onClick={handleClick} className="flex max-h-20  w-full cursor-pointer items-start gap-2 rounded-l-lg bg-[#04471C] px-2 pt-2 pb-1 shadow-lg">
				<img className="song-img mx-auto block h-14 w-14" src={song.albumArt} alt="test" />
				<div className="text-container flex w-full flex-col items-center justify-center ">
					<span className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-sm font-bold text-white text-shadow">{friend.email ? friend.email + "" : "User not logged in"}</span>
					<span className="song-title max-h-7 self-start overflow-hidden text-ellipsis font-['Gotham'] text-sm font-[450] text-white text-shadow ">{song.name}</span>
					<span className="artist-name self-start font-['Gotham'] text-sm font-[400] text-white text-shadow ">{song.artist}</span>
				</div>
			</div>

			<div className="like-button-container">
				<LikeButton />
			</div>
		</div>
	);
}

export default FriendCard;
