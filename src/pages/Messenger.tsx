import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState,useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Messages from "../components/Messages";
import axios from "axios";
import { db } from "../firebase";
import { doc, getDocs, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "../firebase";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import type { Song, User } from "../pages/Home";
import { spotifyApi } from "../spotify/spotify";
import { useUser } from "../context/userContext";
import { useFriends } from "../context/friendsContext";
import LoadingPage from "../components/LoadingPage";
import SendSong from "../components/SendSong";

type Message = {
	note: string;
	song_id: string;
	sender_id: string;
	timestamp: Date;
};

interface MessageProps {
	message: Message;
}

function Message(props: MessageProps) {
	console.log("Message is being rendered");
	const { user } = useUser();
	const message = props.message;
	console.log("message is", message);

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
		<div
			className={message.sender_id == user.spotifyID ? "m-5 my-2 flex w-3/4 grow-0 flex-col self-end rounded-lg bg-palette-100" : "m-5 my-2 flex w-3/4 grow-0 flex-col rounded-lg bg-palette-100"}
		>
			<div className="relative flex flex-row items-center border-b-2 p-3">
				<img className="song-img block h-20 w-20" src={song.albumArt} />
				<div className="text-container flex w-1/2 grow flex-col justify-center px-4">
					<p className="song-title max-h-7 w-full self-start overflow-hidden text-ellipsis font-['Montserrat'] text-base font-medium text-black ">{song.name}</p>
					<p className="artist-name self-start text-clip font-['Montserrat'] text-base font-medium text-black ">{song.artist}</p>
				</div>
			</div>
			<div className="flex px-3 py-2">
				<p className="w-full rounded-full bg-white py-1 px-2 font-['Montserrat'] font-medium text-black empty:py-4">{message.note}</p>
				<p></p>
			</div>
		</div>
	);
}

export default function Messenger() {
	const { messageID } = useParams();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [conversationID, setConversationID] = useState<string>("");
	const { token, isLoggedIn, getRefreshToken, user, setUser } = useUser();
	const [friendProfile, setFriendProfile] = useState<User | null>(null);
	const { friends } = useFriends();
	const messagesEndRef = useRef<null | HTMLDivElement>(null);
	console.log("token is", token);
	console.log("friends is", friends);
	// console.log(user)

	const spotifyID = user?.spotifyID;
	const auth = getAuth(app);

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
	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user]);

	useEffect(() => {
		// 👇️ scroll to bottom every time messages change
		messagesEndRef.current?.scrollIntoView({behavior: "auto"});
	  }, [messages])

	useEffect(() => {
		if (user) {
			console.log(friends);
			const conversationID = friends?.find(({ user }) => user === messageID).conversationID;
			axios.get(import.meta.env.VITE_API_URL + `/users/${messageID}`).then((response) => {
				console.log("fetching friend from API");
				console.log("response is", response);
				const userObj: User = {
					id: response.data.username,
					name: response.data.display_name,
					email: response.data.email,
					spotifyID: response.data.spotifyID,
				};
				setFriendProfile(userObj);
			});

			// console.log("conversationID is", conversationID);
			// console.log("result is", result);
			// async function getAuth() {

			// 	const firebase_token = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/firebase_token`);

			// 		signInWithCustomToken(auth, firebase_token.data).catch((error) => {
			// 			console.log("firebase error is", error);
			// 		});
			// 	}
			// getAuth();

			// const collectionRef = collection(db, `conversations/aabassiounitest1/messages`);
			// console.log(collectionRef)
			// const q = query(collectionRef);
			// console.log("q is", q);
			// const unsub = onSnapshot(q, (snapshot) => {-
			// 	console.log("Current data: ", snapshot.docs.map((doc) => doc.data()));

			// 	// setMessages(snapshot.docs.map((doc) => doc.data()));
			// });
			const q = query(collection(db, `messages/${conversationID}/messages`), orderBy("timestamp", "asc"));
			const Docs = getDocs(q).then((querySnapshot) => {
				console.log("querySnapshot is", querySnapshot);
				querySnapshot.forEach((doc) => {
					console.log("doc is", doc.data());
				});
			});

			const unsub = onSnapshot(q, (snapshot) => {
				console.log(
					"Current data: ",
					snapshot.docs.map((doc) => doc.data())
				);
				setMessages(snapshot.docs.map((doc) => doc.data() as Message));
			});
			setConversationID(conversationID);
			setIsLoading(false);
			return unsub;
		}
	}, []);

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<div className="messenger safe-h-screen max-safe-h-screen flex flex-col">
			<div className=" flex gap-3 bg-black p-4 text-white ">
				<button
					onClick={() => {
						navigate("/");
					}}
				>
					<svg width="32" height="32" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
							fill="currentColor"
							fillRule="evenodd"
							clipRule="evenodd"
						></path>
					</svg>
				</button>
				<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
					{/* <Avatar.Image className="h-full  w-full rounded-[inherit] object-cover" src={EmptyAlbumArt} /> */}
					<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center rounded-full bg-white text-black text-xl text-">
						{friendProfile?.id ? friendProfile?.id[0].toUpperCase() : "U"}
					</Avatar.Fallback>
				</Avatar.Root>
				<p className="self-center font-['Montserrat'] text-xl">{friendProfile?.id}</p>
			</div>
			<div className="flex w-full flex-1 flex-col grow overflow-scroll bg-palette-400 ">
				<div className="flex w-full flex-col pt- ">
					{messages.map((message) => {
						return (
							<div className="flex max-w-full flex-1 flex-col">
								<Message message={message} />
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>
			</div>
			<div className="bg-black p-3">
				{/* <button className="text-shadow w-full min-w-[20rem] gap-2 rounded-xl bg-palette-100 p-4 text-center font-['Montserrat'] text-2xl text-white">Send Song</button> */}
				<SendSong />
				{/* <Messages spotifyApi={spotifyApi}/> */}
			</div>
		</div>
	);
}
