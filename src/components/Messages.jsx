import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Sidebar } from "primereact/sidebar";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import * as Avatar from "@radix-ui/react-avatar";
import { createClient } from "@supabase/supabase-js";

// import { Drawer } from "flowbite";

function Message() {
	return (
		<>
			<div className="flex w-full items-start gap-2 rounded-t-lg border-x-2 border-t-2 bg-palette-300 p-2 ">
				<img className="song-img block h-16 w-16" src={EmptyAlbumArt} alt="test" />
				<div className="text-container flex w-full flex-col pt-3 ">
					{/* <span className="username max-w-full overflow-hidden text-ellipsis font-['Gotham'] text-sm font-bold text-white text-shadow">
							Test User
						</span> */}
					<span className="song-title max-h-7 overflow-hidden text-ellipsis text-left font-['Gotham'] text-sm font-[500] text-white text-shadow ">Test Song</span>
					<span className="artist-name font-['Gotham'] text-sm font-extralight text-white text-shadow ">Test Artist</span>
				</div>
			</div>
			{/* <div className= "p-2"></div> */}
			<div className="flex w-full rounded-b-lg border-x-2 border-t border-b-2 bg-palette-300 p-1">
				<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
					{/* <Avatar.Image className= "h-full  w-full rounded-[inherit] object-cover" src={} /> */}
					<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-xl text-violet11">AB</Avatar.Fallback>
				</Avatar.Root>

				<p className="self-center font-['Gotham'] text-base font-medium text-white text-shadow">Ali Bassiouni</p>
			</div>
		</>
	);
}

function Messages() {
	const [messages, setMessages] = useState([]);

	const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
    // console.log(import.meta.env.VITE_SUPABASE_URL);
	// console.log("supabase is", supabase);

	const channel = supabase
		.channel("schema-db-changes")
		.on(
			"postgres_changes",
			{
				event: "*",
				schema: "public",
				table: "messages",
			},
			(payload) => {
				console.log("there is an update to the messages table");
				console.log("payload is", payload.new);
				setMessages(messages.push(payload.new));
				// console.log(payload)
			}
		)
		.subscribe();

	console.log("channel is", channel);

	useEffect(() => {
		async function fetchMessages() {
			console.log("fetching messages");
			const { data, error } = await supabase.from("messages").select();
			console.log(data);
			console.log("error is", error);
			return data;
		}
		const data = fetchMessages();
		setMessages(data);
	}, []);

	return (
		<>
			<Dialog.Root>
				<Dialog.Trigger asChild={true}>
					<button className="min-w-[20rem] max-w-xs gap-2 rounded-xl bg-palette-200 p-4 text-center font-['Gotham'] text-white text-shadow">Messages</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
					<Dialog.Content className="fixed top-3/4 left-[50%] h-1/2 max-h-[85vh] w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-t-[6px] bg-palette-100 px-[25px] py-[25px] pt-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
						<Message />

						{/* <Dialog.Title /> */}
						{/* <Dialog.Description /> */}
						{/* <div className="Spacer p-2 bg-palette-300"></div> */}
						{/* <div className="h-[55vh] w-full max-w-[450px] rounded-[6px] bg-palette-100 px-[25px] pt-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow"></div> */}
						<Dialog.Close asChild>
							<button className="fixed top-0 right-0 m-2 flex h-8 w-8 items-center justify-center ">
								<Cross1Icon />
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
