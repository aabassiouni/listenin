import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Avatar from "@radix-ui/react-avatar";
import EmptyAlbumArt from "../assets/empty-album-art.png";
// import EmptyProfilePic from "../assets/empty-profile-pic.png";
import { spotifyApi } from "../spotify/spotify";
import { useUser } from "../context/userContext";
import { Song, User } from "../pages/Home";

type Props = {
	spotifyApi: any;
	user: User;
};
export default function NewCard(props: Props) {
	console.log("Card is being rendered");

	const { getRefreshToken } = useUser();
	const user = props.user;
	// console.log("user is", user);

	// Use state to store current song information
	const [song, setSong] = useState<Song>({
		name: "Not Checked",
		albumArt: EmptyAlbumArt,
		artist: "",
		id: "",
	});
	const [isLoading, setIsLoading] = useState<Boolean>(true);

	useEffect(() => {
		console.log("useEffect in Card is being called");

		async function fetchSong(){
			const currentlyPlaying: SpotifyApi.CurrentPlaybackResponse | void = await spotifyApi.getMyCurrentPlaybackState().catch((err) => {
				console.log("error is", err);
				console.log("401 error");
				console.log("fetching new access token");
				console.log("refresh token is", user?.refresh_token);

				getRefreshToken();
			});
			console.log("currentPlaying is", currentlyPlaying);
			if (!currentlyPlaying) {
			} else {
				console.log("currentlyPlaying is", currentlyPlaying);
				if (currentlyPlaying.is_playing) {
					setSong({
						name: currentlyPlaying?.item?.name ?? "N/A",
						albumArt: currentlyPlaying?.item?.album.images[0].url ?? EmptyAlbumArt,
						artist: currentlyPlaying?.item?.artists[0].name ?? "N/A",
						id: currentlyPlaying?.item?.id ?? "N/A",
					});
					setIsLoading(false);
				} else {
					setSong({
						name: currentlyPlaying?.item?.name ?? "N/A",
						albumArt: currentlyPlaying?.item?.album.images[0].url ?? EmptyAlbumArt,
						artist: currentlyPlaying?.item?.artists[0].name ?? "N/A",
						id: currentlyPlaying?.item?.id ?? "N/A",
					});
					setIsLoading(false);
				}
			}
		}
		fetchSong();
		const interval = setInterval(fetchSong, 50000);

		return () => clearInterval(interval); //This is important
	}, []);

	async function handleClick() {
		console.log("clicked");

		const currentlyPlaying = await spotifyApi.getMyCurrentPlaybackState();

		console.log("currentPlaying is", currentlyPlaying);

		if (!currentlyPlaying) {
			console.log("401 error");
			console.log("fetching new access token");
			console.log("refresh token is", user?.refresh_token);

			getRefreshToken();
		} else {
			console.log("currentlyPlaying is", currentlyPlaying);
			if (currentlyPlaying.is_playing) {
				setSong({
					name: currentlyPlaying?.item?.name ?? "N/A",
					albumArt: currentlyPlaying?.item?.album.images[0].url ?? EmptyAlbumArt,
					artist: currentlyPlaying?.item?.artists[0].name ?? "N/A",
					id: currentlyPlaying?.item?.id ?? "N/A",
				});
				setIsLoading(false);
			} else {
				setSong({
					name: currentlyPlaying?.item?.name ?? "N/A",
					albumArt: currentlyPlaying?.item?.album.images[0].url ?? EmptyAlbumArt,
					artist: currentlyPlaying?.item?.artists[0].name ?? "N/A",
					id: currentlyPlaying?.item?.id ?? "N/A",
				});
				setIsLoading(false);
			}
		}
	}

	return (
		<div className="mx-6 flex flex-col rounded-xl bg-palette-100">
			<div className="flex flex-row items-center border-b-2 border-black/20 p-2 pl-2">
				<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
					{/* <Avatar.Image className="h-full  w-full rounded-[inherit] object-cover" src={user?.profilePicture ?? ""} /> */}
					<Avatar.Fallback  className="leading-1 flex h-full w-full items-center justify-center rounded-full bg-white text-xl text-violet11">{user?.id ? user?.id[0].toUpperCase() : "U"}</Avatar.Fallback>

				</Avatar.Root>
				<p className="username max-w-full overflow-hidden text-ellipsis font-['Montserrat'] text-base font-bold text-black">{user ? user?.id + "" : "User not logged in"}</p>
			</div>
			<div onClick={handleClick} className="relative flex flex-row items-center p-3">
				<p className="absolute right-0 top-0 m-2 text-base text-green-800 font-['Montserrat'] font-medium">43m</p>
				<img className="song-img block h-20 w-20" src={song.albumArt} />
				<div className="text-container grow flex w-1/2 flex-col justify-center px-4">
					<p className="song-title w-full max-h-7 self-start overflow-hidden text-ellipsis text-base font-['Montserrat'] font-medium text-black ">{song.name}</p>
					<p className="artist-name self-start text-clip text-base font-medium font-['Montserrat'] text-black ">{song.artist}</p>
				</div>
			</div>
		</div>
	);
}
