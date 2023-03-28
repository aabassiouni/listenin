import * as Avatar from "@radix-ui/react-avatar";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Messages from "../components/Messages";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { db } from "../firebase";
import { doc, getDocs, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import type { Song, User } from "../pages/Home";
import { spotifyApi } from "../spotify/spotify";
import { useUser } from "../context/userContext";

type Message = {
	note: string;
	song_id: string;
	sender_id: string;
};

interface MessageProps {
	message: Message;
	spotifyApi: any;
}

function Message(props: MessageProps) {
	console.log("Message is being rendered");

	const message = props.message;
	console.log("message is", message);

	const spotifyApi = props.spotifyApi;

	const [song, setSong] = useState<Song>({
		name: "Not Checked",
		albumArt: EmptyAlbumArt,
		artist: "",
		id: "",
	});
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		console.log("useEffect in Message is being called");
		spotifyApi.getTrack(message?.song_id).then((response: { name: any; album: { images: { url: any }[] }; artists: { name: any }[]; id: any }) => {
			console.log("song is", response);
			setSong({
				name: response.name,
				albumArt: response.album.images[0].url,
				artist: response.artists[0].name,
				id: response.id,
			});
			setIsLoading(false);
		});
	}, []);

	return (
		// <>
		// 	<div className="flex w-full items-start gap-2 rounded-t-lg border-x-2 border-t-2 bg-palette-300 p-2 ">
		// 		<img className="song-img block h-16 w-16" src={song.albumArt ? song.albumArt : EmptyAlbumArt} alt="test" />
		// 		<div className="text-container flex w-full flex-col pt-3 ">
		// 			{/* <span className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-sm font-bold text-white text-shadow">
		// 					Test User
		// 				</span> */}
		// 			<span className="song-title max-h-7 overflow-hidden text-ellipsis text-left font-['Gotham'] text-sm font-[500] text-white text-shadow ">{song.name}</span>
		// 			<span className="artist-name font-['Gotham'] text-sm font-extralight text-white text-shadow ">{song.artist}</span>
		// 		</div>
		// 	</div>
		// 	{/* <div className= "p-2"></div> */}
		// 	<div className="flex w-full rounded-b-lg border-x-2 border-t border-b-2 bg-palette-300 p-1">
		// 		<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
		// 			{/* <Avatar.Image className= "h-full  w-full rounded-[inherit] object-cover" src={} /> */}
		// 			<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-xl text-violet11">AB</Avatar.Fallback>
		// 		</Avatar.Root>

		// 		<p className="self-center font-['Gotham'] text-base font-medium text-white text-shadow">{message.sender_id}</p>
		// 		<p className="ml-5 self-center rounded-full bg-white px-2 font-['Gotham'] text-base  text-shadow">{message.note}</p>
		// 	</div>
		// </>

		<div className="m-5 flex w-3/4 flex-col rounded-lg bg-palette-100 ">
			<div className="relative flex flex-row items-center border-b-2 p-3">
				<img className="song-img block h-20 w-20" src={song.albumArt} />
				<div className="text-container flex w-1/2 grow flex-col justify-center px-4">
					<p className="song-title max-h-7 w-full self-start overflow-hidden text-ellipsis font-['Gotham'] text-base font-medium text-black ">{song.name}</p>
					<p className="artist-name self-start text-clip font-['Gotham'] text-base font-medium text-black ">{song.artist}</p>
				</div>
			</div>
			<div className="flex px-3 py-2">
				<p className="w-full rounded-full bg-white py-1 px-2 font-gotham font-light text-black">{message.note}</p>
				<p></p>
			</div>
		</div>
	);
}

export default function Messenger() {
	const { messageID } = useParams();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { token, isLoggedIn, getRefreshToken } = useUser();
	const spotifyID = "aabassiouni";
	const navigate = useNavigate();

	const messagesDummy = [
		{
			note: "This is a sample note",
			song_id: "6y0igZArWVi6Iz0rj35c1Y",
			sender_id: "aabassiouni",
		},
		{
			note: "This is a sample note",
			song_id: "6y0igZArWVi6Iz0rj35c1Y",
			sender_id: "aabassiouni",
		},
	];
	// useEffect(() => {
	// 	console.log("useEffect in Messenger is being called");
	// 	const doc
	useEffect(() => {
		const docRef = doc(db, "messages", spotifyID);
		console.log("docRef is", docRef);
		const unsub = onSnapshot(docRef, (snapshot) => {
			console.log("Current data: ", snapshot.data());
			// setMessages()
			console.log("messages are", snapshot.data()?.messages);
			setMessages(snapshot.data()?.messages);
		});
		return unsub;
	}, []);

	return (
		<div className="flex h-screen flex-col">
			<div className="flex gap-3 bg-black p-4 text-white ">
				<button onClick={() => {
					navigate("/");
				}}>
					<svg width="32" height="32" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
							fill="currentColor"
							fill-rule="evenodd"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>
				<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
					<Avatar.Image className="h-full  w-full rounded-[inherit] object-cover" src={EmptyAlbumArt} />
				</Avatar.Root>
				<p className="self-center font-gotham text-xl">{messageID}</p>
			</div>
			<div className="w-full flex-1 bg-palette-400">
				{messages.map((message) => {
					return <Message message={message} spotifyApi={spotifyApi} />;
				})}
			</div>
			<div className="bg-black p-3">
				<button className="w-full min-w-[20rem] gap-2 rounded-xl bg-palette-100 p-4 text-center font-['Gotham'] text-2xl text-white text-shadow">Send Song</button>
				{/* <Messages spotifyApi={spotifyApi}/> */}
			</div>
		</div>
	);
}
