import React, { useEffect, useState } from "react";
import axios from "axios";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import { spotifyApi } from "../spotify/spotify";

export default function Card(props) {
	console.log("Card is being rendered");

	const user = props.user;
	// console.log("user is", user);
	// Use state to store current song information
	const [song, setSong] = useState({
		name: "Not Checked",
		albumArt: EmptyAlbumArt,
		artist: "",
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		console.log("useEffect in Card is being called");
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

					axios
						.get(import.meta.env.VITE_API_URL + `/?refresh_token=${user?.refresh_token}`)
						.catch((err) => {
							console.log("error fetching refresh token:", err);
						})
						.then((response) => {
							spotifyApi.setAccessToken(response.data.access_token);
						});
				}

				console.log("response is", response);
				setSong({
					name: response.item.name,
					albumArt: response.item.album.images[0].url,
					artist: response.item.artists[0].name,
				});
				setIsLoading(false);
			});
	}, []);

	// useEffect(() => {
	// 	console.log("useEffect in Card is being called");

	// 	const interval = setInterval(() => {
	// 	spotifyApi
	// 		.getMyCurrentPlaybackState()
	// 		.catch((err) => {
	// 			console.log("error is", err);
	// 		})
	// 		.then((response) => {
	// 			if (!response) {
	// 				console.log("401 error");
	// 				console.log("fetching new access token");
	// 				console.log("refresh token is", user?.refresh_token);

	// 				axios
	// 					.get(import.meta.env.VITE_API_URL+`/?refresh_token=${user?.refresh_token}`)
	// 					.catch((err) => {
	// 						console.log("error fetching refresh token:", err);
	// 					})
	// 					.then((response) => {
	// 						spotifyApi.setAccessToken(response.data.access_token);
	// 					});
	// 			}

	// 			console.log("response is", response);
	// 			setSong({
	// 				name: response.item.name,
	// 				albumArt: response.item.album.images[0].url,
	// 				artist: response.item.artists[0].name,
	// 			});
	// 			setIsLoading(false);
	// 		});
	// 	}, 1000);

	// 	return () => clearInterval(interval); //This is important
	// }, []);

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
					console.log("refresh token is", user?.refresh_token);

					axios
						.get(`http://localhost:8888/refresh_token/?refresh_token=${user?.refresh_token}`)
						.catch((err) => {
							console.log("error fetching refresh token:", err);
						})
						.then((response) => {
							spotifyApi.setAccessToken(response.data.access_token);
						});
				}

				console.log("response is", response);
				setSong({
					name: response.item.name,
					albumArt: response.item.album.images[0].url,
					artist: response.item.artists[0].name,
				});
				setIsLoading(false);
			});
	}

	// if (isLoading) {
	// 	return (
	// 		<div className="mx-3 flex min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-300 p-4">
	// 			<div className="w-full flex h-24 items-center justify-center" role="status">
	// 				<svg aria-hidden="true" className="mr-2 h-8 w-8 animate-spin fill-palette-100 text-gray-200 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
	// 					<path
	// 						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
	// 						fill="currentColor"
	// 					/>
	// 					<path
	// 						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
	// 						fill="currentFill"
	// 					/>
	// 				</svg>
	// 				<span class="sr-only">Loading...</span>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		// <div  className="flex mx-4 bg-[#04471C] px-4 py-4 shadow-lg max-h-[136px] w-[90%] cursor-pointer gap-2 rounded-[10px] items-start">
		<div onClick={handleClick} className="flex min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-300 p-4">
			<img className="song-img block h-24 w-24" src={song.albumArt} alt="test" />
			<div className="text-container flex w-full flex-col items-center justify-center">
				<p className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-lg font-bold text-white text-shadow">{user ? user?.streamID + "" : "User not logged in"}</p>
				<p className="song-title max-h-7 self-start overflow-hidden text-ellipsis font-['Gotham'] text-lg font-[450] text-white text-shadow ">{song.name}</p>
				<span className="artist-name self-start text-clip font-['Gotham'] text-lg font-[400] text-white text-shadow ">{song.artist}</span>
			</div>
		</div>
	);
}