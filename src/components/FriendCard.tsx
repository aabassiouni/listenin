import { useState, useEffect } from "react";
import axios from "axios";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import * as Avatar from "@radix-ui/react-avatar";
import { Song, User } from "../pages/Home";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import SpotifyLogo from "../assets/Spotify_Icon_RGB_Black.png";

type Props = {
	user: User;
	friendID: string;
};
function FriendCard(props: Props) {
	// console.log("Card is being rendered");
	const [song, setSong] = useState<Song>({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "", id: "" });
	const [friend, setFriend] = useState<User>({ id: "", email: "", name: "", spotifyID: "" });
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	const user = props.user;
	var friendID = props.friendID;
	const navigate = useNavigate();

	useEffect(() => {
		// fetch friend data from api
		axios.get(import.meta.env.VITE_API_URL + `/users/${friendID}`).then((res) => {
			console.log(res.data);
			var userObj: User = {
				id: res.data.username,
				email: res.data.email,
				name: res.data.name,
				spotifyID: res.data.spotifyID,
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

	if (isLoading)
		return (
			<div className="flex w-full cursor-pointer flex-col border-b border-black bg-palette-200 p-7">
				<div>Loading...</div>
			</div>
		);
	return (
		<div
			onClick={() => {
				console.log("clicked");
				if (isMobile) {
					navigate(`/messages/${friend.spotifyID}`);
				} else {
					navigate(`/home/messages/${friend.spotifyID}`);
				}

				// console.log("friend is", friend);
			}}
			className="friend-card flex w-full flex-1  justify-center"
		>
			<div className="flex w-full cursor-pointer flex-col border-b border-black bg-palette-200 p-2 ">
				<div className="flex">
					<Avatar.Root className="h-[45px] w-[45px] select-none items-center justify-center rounded-full bg-blackA3">
						{/* <Avatar.Image className="rounded-full " src={EmptyProfilePic} /> */}
						<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center rounded-full bg-white text-xl text-violet11">
							{friend?.id ? friend?.id[0].toUpperCase() : "?"}
						</Avatar.Fallback>
					</Avatar.Root>
					<p className="username text-shadow max-w-full self-center overflow-hidden text-ellipsis pl-3 font-['Montserrat'] text-sm font-medium text-white">
						{friend?.id ? friend?.id + "" : "User not logged in"}
					</p>
				</div>
				<div className="text-container flex w-full items-center gap-2 py-1  ">
					<img src={SpotifyLogo} alt="" className="h-w-5 ml-1 w-5" />

					<span className="song-title text-shadow  max-h-7 overflow-hidden text-ellipsis font-['Montserrat'] text-sm font-[500] text-white ">{song.name}</span>
					<span className="artist-name  text-shadow font-['Montserrat']  text-sm text-white ">{song.artist}</span>
				</div>
			</div>
		</div>
	);
}

export default FriendCard;
