import React, { useState, useEffect } from "react";
import SendButton from "./SendButton";
import axios from "axios";
import EmptyAlbumArt from "../assets/empty-album-art.png";


function FriendCard(props) {
	// console.log("Card is being rendered");

	const [friend, setFriend] = useState({});


	// console.log("friend being rendered is", friend);
	var propsUser = props.user;

	const [song, setSong] = useState({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "" });

	useEffect(() => {
		// console.log("useEffect in Card is being called");
		var userID = propsUser;

		axios.get(import.meta.env.VITE_API_URL + `/users/?userID=${userID}`).then((res) => {
			var userFromApi = res.data;
			setFriend(userFromApi);
			setSong({
				name: res.data.lastPlayed.name,
				albumArt: EmptyAlbumArt,
				artist: res.data.lastPlayed.artist,
				// id: res.data.lastPlayed.id,
			});
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

	return (
		<div className="friend-card flex min-w-full">
			<div  className="flex w-full cursor-pointer items-start gap-2 rounded-l-lg bg-palette-300 p-2 ">
				<img className="song-img block h-16 w-16" src={song.albumArt} alt="test" />
				<div className="text-container flex w-full flex-col items-center justify-center ">
					<span className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-sm font-bold text-white text-shadow">{friend.email ? friend.email + "" : "User not logged in"}</span>
					<span className="song-title max-h-7 self-start overflow-hidden text-ellipsis font-['Gotham'] text-sm font-[500] text-white text-shadow ">{song.name}</span>
					<span className="artist-name self-start font-['Gotham'] text-sm font-extralight text-white text-shadow ">{song.artist}</span>
					{/* </div> */}
				</div>
			</div>
			{/* <div className="like-button-container"> */}
			<SendButton song = {song} friend= {friend}/>
			{/* </div> */}
		</div>
	);
}

export default FriendCard;
