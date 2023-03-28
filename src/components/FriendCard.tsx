import React, { useState, useEffect } from "react";
import SendButton from "./SendButton";
import axios from "axios";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import * as Avatar from "@radix-ui/react-avatar";
import { Song, User } from "../pages/Home";
import { useNavigate } from "react-router-dom";

type Props = {
	user: User;
	friendID: string;
};
function FriendCard(props: Props) {
	// console.log("Card is being rendered");
	const [song, setSong] = useState<Song>({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "", id: "" });
	const [friend, setFriend] = useState<User>({ id: "", email: "", name: "" });
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const user = props.user;
	var friendID = props.friendID;
	const navigate = useNavigate();

	// const friend = props.friend;

	useEffect(() => {
		// fetch friend data from api
		axios.get(import.meta.env.VITE_API_URL + `/users/${friendID}`).then((res) => {
			console.log(res.data);
			var userObj: User = {
				id: res.data.username,
				email: res.data.email,
				name: res.data.name,
			};

			console.log("userFromApi is", userObj);
			setFriend(userObj);
			setSong({
				name: res.data.lastPlayed.name,
				albumArt: EmptyAlbumArt,
				artist: res.data.lastPlayed.artist,
				id: res.data.lastPlayed.id,
			});
			setIsLoading(false);
		});
	}, []);
	// async function handleClick() {
	// 	var userID = propsUser;

	// 	await axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
	// 		var userFromApi = res.data;
	// 		setFriend(userFromApi);
	// 		setSong({
	// 			name: res.data.lastPlayed.name,
	// 			albumArt: EmptyAlbumArt,
	// 			artist: res.data.lastPlayed.artist,
	// 		});
	// 	});
	if (isLoading) return <div>Loading...</div>;
	return (
		<div onClick={() => {
			console.log("clicked");
			navigate(`/messages/${friend.id}`);
			// console.log("friend is", friend);
		}} className="friend-card flex min-w-full">
			<div className="flex w-full cursor-pointer flex-col border-b border-black bg-palette-200 p-2">
				<div className="flex">
					<Avatar.Root className="h-[45px] w-[45px] select-none items-center justify-center rounded-full bg-blackA3">
						<Avatar.Image className="rounded-full" src={song.albumArt} />
					</Avatar.Root>
					<p className="username max-w-full self-center overflow-hidden text-ellipsis pl-3 font-['Gotham'] text-sm font-bold text-white text-shadow">
						{friend?.id ? friend?.id + "" : "User not logged in"}
					</p>
				</div>
				<div className="text-container py-1 gap-2 flex w-full items-center  ">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="m12 3l.01 10.55c-.59-.34-1.27-.55-2-.55a4.001 4.001 0 1 0 0 8c2.22 0 3.99-1.79 3.99-4V7h4V3h-6zm-1.99 16c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z"
						/>
					</svg>
					{/* <span className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-sm font-bold text-white text-shadow">
						{friend?.id ? friend?.id + "" : "User not logged in"}
					</span> */}
					<span className="song-title max-h-7  overflow-hidden text-ellipsis font-['Gotham'] text-sm font-[500] text-white text-shadow ">{song.name}</span>
					<span className="artist-name  font-['Gotham'] text-sm font-extralight text-white text-shadow ">{song.artist}</span>
					{/* </div> */}
				</div>
			</div>
			{/* <div className="like-button-container"> */}
			{/* <SendButton lastPlayedSong = {song} user = {user} friend = {friend}/> */}
			{/* </div> */}
		</div>
	);
}

export default FriendCard;
