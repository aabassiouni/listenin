import { useEffect, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import { spotifyApi } from "../spotify/spotify";
import { useUser } from "../context/userContext";
import { Song, User } from "../pages/Home";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
	relativeTime: {
		past: "%s",
		s: "",
		m: "1m",
		mm: "%dm",
		h: "1h",
		hh: "%dh",
		d: "1d",
		dd: "%dd",
		M: "1m",
		MM: "%dm",
		y: "a year",
		yy: "%dy",
	},
});
type Props = {
	spotifyApi: any;
	user: User;
};

export default function Card(props: Props) {
	console.log("Card is being rendered");

	const { getRefreshToken } = useUser();
	const user = props.user;

	// Use state to store current song information
	const [song, setSong] = useState<Song>({
		name: "Play a song on Spotify!",
		albumArt: EmptyAlbumArt,
		artist: "",
		id: "",
	});
	const [timestamp, setTimestamp] = useState<string | null>("");
	const [isLoading, setIsLoading] = useState<Boolean>(true);

	useEffect(() => {
		console.log("useEffect in Card is being called");

		async function fetchSong() {
			console.log("clicked");

			function errorHandler(err: any) {
				console.log("in catch statement");
				console.log("error is", err);

				if (err.status === 401) {
					console.log("401 error");
					console.log("fetching new access token");
					getRefreshToken();
				}

				if (err.status === 429) {
					console.log("429 error");
					console.log("rate limit exceeded");
				}

				if (err.status === 500) {
					console.log("500 error");
					console.log("internal server error");
				}

				return;
			}
			const currentlyPlaying = await spotifyApi.getMyCurrentPlaybackState().catch((err) => {
				errorHandler(err);
			});

			console.log("currentPlaying is", currentlyPlaying);

			if (currentlyPlaying) {
				console.log("currentlyPlaying is", currentlyPlaying);
				if (currentlyPlaying.is_playing) {
					setTimestamp(null);
					setSong({
						name: currentlyPlaying?.item?.name ?? "N/A",
						albumArt: currentlyPlaying?.item?.album.images[0].url ?? EmptyAlbumArt,
						artist: currentlyPlaying?.item?.artists[0].name ?? "N/A",
						id: currentlyPlaying?.item?.id ?? "N/A",
					});
					setIsLoading(false);
				} else {
					// 1680764221782
					const timeLastPlayed = dayjs(currentlyPlaying?.timestamp).fromNow();
					console.log("timelastplayed is", timeLastPlayed);
					setTimestamp(timeLastPlayed);
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
		const interval = setInterval(fetchSong, 30000);

		return () => clearInterval(interval); //This is important
	}, []);

	async function handleClick() {
		console.log("clicked");

		function errorHandler(err: any) {
			console.log("in catch statement");
			console.log("error is", err);

			if (err.status === 401) {
				console.log("401 error");
				console.log("fetching new access token");
				getRefreshToken();
			}

			if (err.status === 429) {
				console.log("429 error");
				console.log("rate limit exceeded");
			}

			if (err.status === 500) {
				console.log("500 error");
				console.log("internal server error");
			}

			return;
		}
		const currentlyPlaying = await spotifyApi.getMyCurrentPlaybackState().catch((err) => {
			errorHandler(err);
		});

		console.log("currentPlaying is", currentlyPlaying);

		if (currentlyPlaying) {
			console.log("currentlyPlaying is", currentlyPlaying);
			if (currentlyPlaying.is_playing) {
				setTimestamp(null);
				setSong({
					name: currentlyPlaying?.item?.name ?? "N/A",
					albumArt: currentlyPlaying?.item?.album.images[0].url ?? EmptyAlbumArt,
					artist: currentlyPlaying?.item?.artists[0].name ?? "N/A",
					id: currentlyPlaying?.item?.id ?? "N/A",
				});
				setIsLoading(false);
			} else {
				// 1680764221782
				const timeLastPlayed = dayjs(currentlyPlaying?.timestamp).fromNow();
				console.log("timelastplayed is", timeLastPlayed);
				setTimestamp(timeLastPlayed);
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
					<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center rounded-full bg-white text-xl text-violet11">
						{user?.id ? user?.id[0].toUpperCase() : "U"}
					</Avatar.Fallback>
				</Avatar.Root>
				<p className="username max-w-full overflow-hidden text-ellipsis font-['Montserrat'] text-base font-bold text-black">{user ? user?.id + "" : "User not logged in"}</p>
			</div>
			<div onClick={handleClick} className="relative flex flex-row items-center p-3">
				<p className="absolute right-0 top-0 m-2 font-['Montserrat'] text-base font-medium text-green-800">
					{timestamp === null || timestamp === "" ? (
						<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" className="h-4 w-4">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
							/>
						</svg>
					) : (
						timestamp
					)}
				</p>
				<img className="song-img block h-20 w-20" src={song.albumArt} />
				<div className="text-container flex w-1/2 grow flex-col justify-center px-4">
					<p className="song-title max-h-7 w-full self-start overflow-hidden text-ellipsis font-['Montserrat'] text-base font-medium text-black ">{song.name}</p>
					<p className="artist-name self-start text-clip font-['Montserrat'] text-base font-medium text-black ">{song.artist}</p>
				</div>
			</div>
		</div>
	);
}
