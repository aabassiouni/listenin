import { useEffect, useState } from "react";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import { spotifyApi } from "../spotify/spotify";
import { useUser } from "../context/userContext";
import { Song, User } from "../pages/Home";

type Props = {
	spotifyApi: any;
	user: User;
};

export default function Card(props: Props) {
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

		const interval = setInterval(async () => {
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
		}, 50000);

		return () => clearInterval(interval); //This is important
	}, []);

	async function handleClick() {
		console.log("clicked");

		const currentlyPlaying = await spotifyApi.getMyCurrentPlaybackState()

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
		<div onClick={handleClick} className="flex min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-300 p-4">
			<img className="song-img block h-24 w-24" src={song.albumArt} alt="test" />
			<div className="text-container flex w-full flex-col items-center justify-center">
				<p className="username max-w-full overflow-hidden text-ellipsis font-['Montserrat'] text-lg font-bold text-white text-shadow">{user ? user?.id + "" : "User not logged in"}</p>
				<p className="song-title max-h-7 self-start overflow-hidden text-ellipsis font-['Montserrat'] text-lg font-[450] text-white text-shadow ">{song.name}</p>
				<span className="artist-name self-start text-clip font-['Montserrat'] text-lg font-[400] text-white text-shadow ">{song.artist}</span>
			</div>
		</div>
	);
}
