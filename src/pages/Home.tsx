import { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import FriendsList from "../components/FriendsList";
import NavBar from "../components/NavBar";
import LoadingPage from "../components/LoadingPage";
import { spotifyApi } from "../spotify/spotify";
import AddFriendsButton from "../components/AddFriendsButton";
import Setup from "./Setup";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "../firebase";
import NewCard from "../components/NewCard";
import { Toaster } from "react-hot-toast";
import { useFriends } from "../context/friendsContext";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import {Outlet} from "react-router-dom";

export type User = {
	id: string;
	name: string;
	email: string;
	spotifyID: string;
	profilePicture?: string;
	accountSetup?: boolean;
	refresh_token?: string;
};

export type Song = {
	name: string;
	albumArt: string;
	artist: string;
	id: string;
	spotifyURL?: string;
};

function Home() {
	console.log("Home component is being rendered");

	const { token, isLoggedIn, getRefreshToken, user, setUser } = useUser();
	// const [user, setUser] = useState<User>({ id: "", name: "", email: "", spotifyID: "" });
	const { friends, setFriends } = useFriends();
	const [isLoading, setIsLoading] = useState<Boolean>(true);

	const auth = getAuth(app);

	useEffect(() => {
		console.log("useEffect in home component is being called");

		spotifyApi.setAccessToken(token);

		async function fetchData() {
			try {
				const spotifyProfile = await spotifyApi.getMe().catch((err) => {
					getRefreshToken();
				});

				//typescript is so annoying
				// if(!spotifyProfile?.images) {
				// 	throw new Error("spotifyProfile is undefined");
				// }

				console.log("spotifyProfile is", spotifyProfile);

				const spotifyID = spotifyProfile?.id;

				const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}`);
				console.log("userProfile in home is", userProfile);

				const firebase_token = await axios.get(import.meta.env.VITE_API_URL + `/users/${spotifyID}/firebase_token`);

				signInWithCustomToken(auth, firebase_token.data).catch((error) => {
					console.log("firebase error is", error);
				});

				const userObj = {
					id: userProfile?.data?.username,
					name: userProfile?.data?.email,
					email: userProfile?.data?.email,
					spotifyID: userProfile?.data?.spotifyID,
					accountSetup: userProfile?.data?.accountSetup,
					// profilePicture: spotifyProfile?.images ? spotifyProfile?.images[0]?.url : "",
				};

				if (userProfile.data) {
					console.log("setting user to", userObj);
					setUser(userObj);
					setFriends(userProfile.data.friends);
				}

				setIsLoading(false);
				console.log("setting isLoading to false");
			} catch (err) {
				console.log("error in fetchData", err);
				console.log("error is", err);
			}
		}

		fetchData();
	}, [token]);

	if (isLoading) {
		return <LoadingPage />;
	} else if (user?.accountSetup === false) {
		return <Setup user={user} />;
	}

	return (
		<div className="Home safe-h-screen max-safe-h-screen flex flex-col bg-black">
			<Toaster position="bottom-center" />
			<NavBar />
			<div className=" md:flex md:overflow-clip">
				<div className="flex flex-col md:mx-3 md:basis-1/4">
					<NewCard spotifyApi={spotifyApi} user={user} />
					<div className="Spacer p-2"></div>
					<div className="md:w mx-6 flex justify-between">
						<h1 className="font-['Montserrat'] text-4xl font-semibold text-white">Chats</h1>
						<AddFriendsButton user={user} />
					</div>
					<div className="Spacer p-2"></div>
					{/* <div className="basis-1/2 overflow-scroll mx-6">
						<FriendsList user={user} />
					</div> */}
					<ScrollArea.Root className="md:fl mx-6 h-[460px] overflow-hidden rounded-lg bg-palette-100 shadow-[0_2px_10px] shadow-blackA7">
						<ScrollArea.Viewport className="h-full w-full rounded">
							<div className="">
								<FriendsList user={user} />
							</div>
						</ScrollArea.Viewport>
						<ScrollArea.Scrollbar
							className="flex touch-none select-none bg-blackA6 p-0.5 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
							orientation="vertical"
						>
							<ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-palette-300 before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
						</ScrollArea.Scrollbar>
						<ScrollArea.Corner className="bg-blackA8" />
					</ScrollArea.Root>
				</div>

				<div className="hidden grow rounded-xl h-full bg-palette-400 md:block">
					<Outlet />
					</div>
				{/* <div className="md: hidden grow w-full bg-red-800 md:block">asdf</div> */}
			</div>
			<div className="mt-4 flex w-full items-center justify-center text-xs font-['Montserrat'] text-white p-2 ">
				<p>Made by Ali Bassiouni</p>
			</div>
		</div>
	);
}

export default Home;
