import React, { useState, useEffect } from "react";
import SendButton from "./SendButton";
import axios from "axios";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import { Song, User } from "../pages/Home";

type Props = {
	user: User;
	friendID: string;
};
function FriendCard(props: Props) {
	// console.log("Card is being rendered");
	const [song, setSong] = useState<Song>({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "", id: ""});
	const [friend, setFriend] = useState<User>({ id: "", email: "", name: ""});
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const user = props.user;
	var friendID = props.friendID;



	// const friend = props.friend;

	useEffect(() => {
		
		// fetch friend data from api
		axios.get(import.meta.env.VITE_API_URL + `/users/${friendID}`).then((res) => {
			console.log(res.data);
			var userObj : User = {
				id: res.data.username,
				email: res.data.email,
				name: res.data.name,
				};


			console.log("userFromApi is", userObj)
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
		<div className="friend-card flex min-w-full">
			<div  className="flex w-full cursor-pointer items-start gap-2 rounded-l-lg bg-palette-300 p-2 ">
				<img className="song-img block h-16 w-16" src={song.albumArt} alt="test" />
				<div className="text-container flex w-full flex-col items-center justify-center ">
					<span className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-sm font-bold text-white text-shadow">{friend?.id ? friend?.id + "" : "User not logged in"}</span>
					<span className="song-title max-h-7 self-start overflow-hidden text-ellipsis font-['Gotham'] text-sm font-[500] text-white text-shadow ">{song.name}</span>
					<span className="artist-name self-start font-['Gotham'] text-sm font-extralight text-white text-shadow ">{song.artist}</span>
					{/* </div> */}
				</div>
			</div>
			{/* <div className="like-button-container"> */}
			<SendButton lastPlayedSong = {song} user = {user} friend = {friend}/>
			{/* </div> */}
		</div>
	);
}

export default FriendCard;
