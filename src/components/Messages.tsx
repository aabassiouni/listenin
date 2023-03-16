import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import * as Avatar from "@radix-ui/react-avatar";
// import { createClient } from "@supabase/supabase-js";
import { db } from "../firebase";
import { doc, getDocs, collection, query, where, onSnapshot } from "firebase/firestore";
// import { Drawer } from "flowbite";
import { getAuth } from "firebase/auth";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import { Song, User } from "../pages/Home";

interface MessageProps {
	message: any;
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
		spotifyApi.getTrack(message?.song_id).then((response: { name: any; album: { images: { url: any; }[]; }; artists: { name: any; }[]; id: any; }) => {
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
		<>
			<div className="flex w-full items-start gap-2 rounded-t-lg border-x-2 border-t-2 bg-palette-300 p-2 ">
				<img className="song-img block h-16 w-16" src={song.albumArt ? song.albumArt : EmptyAlbumArt} alt="test" />
				<div className="text-container flex w-full flex-col pt-3 ">
					{/* <span className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-sm font-bold text-white text-shadow">
							Test User
						</span> */}
					<span className="song-title max-h-7 overflow-hidden text-ellipsis text-left font-['Gotham'] text-sm font-[500] text-white text-shadow ">{song.name}</span>
					<span className="artist-name font-['Gotham'] text-sm font-extralight text-white text-shadow ">{song.artist}</span>
				</div>
			</div>
			{/* <div className= "p-2"></div> */}
			<div className="flex w-full rounded-b-lg border-x-2 border-t border-b-2 bg-palette-300 p-1">
				<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
					{/* <Avatar.Image className= "h-full  w-full rounded-[inherit] object-cover" src={} /> */}
					<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-xl text-violet11">AB</Avatar.Fallback>
				</Avatar.Root>

				<p className="self-center font-['Gotham'] text-base font-medium text-white text-shadow">{message.sender_id}</p>
				<p className="ml-5 self-center rounded-full bg-white px-2 font-['Gotham'] text-base  text-shadow">{message.note}</p>
			</div>
		</>
	);
}

type MessagesProps = {
	user: User;
	spotifyApi: any;
};

function Messages(props: MessagesProps) {
	const [messages, setMessages] = useState([]);
	const user = props.user;
	const spotifyID = user.id;
	const spotifyApi = props.spotifyApi;
	// console.log("user is", user);
	// console.log("messages are", messages);
	const auth = getAuth();
	console.log("spotifyID is", spotifyID);

	// const collectionRef = collection(db, "messages");
	// console.log("collectionRef is", collectionRef);
	// const docRef = doc(db, "messages", "pBk8VrcJMq50p9nJiEjr");
	// console.log("docRef is", docRef);
	// getDocs(collectionRef).then((querySnapshot) => {
	// 	console.log("querySnapshot is", querySnapshot);
	// });

	// const document = doc(db, "messages", where("receiver_id", "==", spotifyID));
	// console.log("document is", document);
	useEffect(() => {
		// async function fetchMessages() {
		// 	const querySnapshot = await getDocs(collection(db, "messages"));
		// 	querySnapshot.forEach((doc) => {
		// 		// doc.data() is never undefined for query doc snapshots
		// 		console.log(doc.id, " => ", doc.data());
		// 	});
		// }
		// fetchMessages();
		// const q = query(collection(db, "messages"), where("receiver_id", "==", spotifyID));
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
		<>
			<Dialog.Root>
				<Dialog.Trigger asChild={true}>
					<button className="min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-200 p-4 text-center font-['Gotham'] text-white text-shadow">Messages</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
					<Dialog.Content className="fixed top-3/4 left-[50%] h-1/2 max-h-[85vh] w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-scroll rounded-t-[6px] bg-palette-100 px-[25px] py-[25px] pt-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
						{/* <Message spotifyApi = {spotifyApi} /> */}
						{messages.map((message) => (
							<Message spotifyApi={spotifyApi} message={message} />
						))}
						{/* {messages.toString()} */}
						{/* <Dialog.Title /> */}
						{/* <Dialog.Description /> */}
						{/* <div className="Spacer p-2 bg-palette-300"></div> */}
						{/* <div className="h-[55vh] w-full max-w-[450px] rounded-[6px] bg-palette-100 px-[25px] pt-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow"></div> */}
						<Dialog.Close asChild>
							<button className="fixed top-0 right-0 m-1 flex h-8 w-8 items-center justify-center ">
								<Cross1Icon className="h-6 w-6 text-white text-shadow" />
							</button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
		// <>

		// 	<button className="min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-200 p-4 text-center font-['Gotham'] text-white text-shadow">Messages</button>
		// 	{/* <Sidebar visible={true} position="right" baseZIndex={1000000} onHide={() => setVisibleRight(false)}>
		// 		<Message />
		// 	</Sidebar> */}
		// </>
	);
}

export default Messages;
