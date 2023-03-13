import React, { useEffect, useState } from "react";
import axios from "axios";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import { spotifyApi } from "../spotify/spotify";
import { useUser } from "../context/userContext";

export default function Card(props) {
	console.log("Card is being rendered");

	const { getRefreshToken } = useUser();
	const user = props.user;
	// console.log("user is", user);

	// Use state to store current song information
	const [song, setSong] = useState({
		name: "Not Checked",
		albumArt: EmptyAlbumArt,
		artist: "",
		id: "",
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		console.log("useEffect in Card is being called");

		const interval = setInterval(() => {
			spotifyApi
				.getMyCurrentPlaybackState()
				.catch((err) => {
					console.log("error is", err);
				})
				.then((response) => {
					if (!response) {
						console.log("401 error");
						console.log("fetching new access token");
						console.log("refresh token is", user?.refresh_token);

						getRefreshToken();
					}
					// console.log("response is", response);
					setSong({
						name: response.item.name,
						albumArt: response.item.album.images[0].url,
						artist: response.item.artists[0].name,
						id: response.item.id,
					});
					setIsLoading(false);
				});
		}, 50000);

		return () => clearInterval(interval); //This is important
	}, []);

	async function handleClick() {
		console.log("clicked");

		spotifyApi
			.getMyCurrentPlaybackState()
			.catch((err) => {
				console.log("error is", err);
			})
			.then((response) => {
				if (!response) {
					console.log("401 error");
					console.log("fetching new access token");
					console.log("refresh token is", localStorage.getItem("refresh_token"));

					getRefreshToken();
				}

				console.log("response is", response);
				setSong({
					name: response.item.name,
					albumArt: response.item.album.images[0].url,
					artist: response.item.artists[0].name,
					id: response.item.id,
				});
				setIsLoading(false);
			});
	}

	return (
		// <div  className="flex mx-4 bg-[#04471C] px-4 py-4 shadow-lg max-h-[136px] w-[90%] cursor-pointer gap-2 rounded-[10px] items-start">
		<div onClick={handleClick} className="flex min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-300 p-4">
			<img className="song-img block h-24 w-24" src={song.albumArt} alt="test" />
			<div className="text-container flex w-full flex-col items-center justify-center">
				<p className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-lg font-bold text-white text-shadow">{user ? user?.username + "" : "User not logged in"}</p>
				<p className="song-title max-h-7 self-start overflow-hidden text-ellipsis font-['Gotham'] text-lg font-[450] text-white text-shadow ">{song.name}</p>
				<span className="artist-name self-start text-clip font-['Gotham'] text-lg font-[400] text-white text-shadow ">{song.artist}</span>
			</div>
		</div>
	);
}
