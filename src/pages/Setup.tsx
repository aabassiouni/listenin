import React, { useState, MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { User } from "./Home";

type Props = {
	user: User;
};

export default function Setup(props: Props) {
	console.log("Setup is being rendered");
	const user: User = props.user;
	console.log("user in setup is", user);
	const [username, setUsername] = useState("");
	const navigate = useNavigate();

	function handleClick( event: MouseEvent<HTMLButtonElement>)  {
		event.preventDefault();
		console.log("username is", username);

		const query = import.meta.env.VITE_API_URL + `/users/${user?.id}/setup?username=${username}`;
		console.log("query is", query);
		axios
			.put(import.meta.env.VITE_API_URL + `/users/${user?.id}/setup?username=${username}`)
			.then((response) => {
				console.log("response is", response);
			})
			.then(() => {
				console.log("username is", username);
				navigate("/");
			});
	}

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-black">
			<Dialog.Root open={true}>
				<Dialog.Trigger asChild={true}></Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
					<Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white px-[25px] pt-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
						<Dialog.Title className="spacing text-mauve12 pb-8 font-['Montserrat'] text-xl font-medium">Choose a username</Dialog.Title>
						<form className="flex flex-col gap-4">
							<input
								onChange={(event) => setUsername(event.target.value)}
								className="x-[10px] text-mauve12 h-[40px] w-full rounded-[6px] bg-gray-200 font-['Montserrat'] text-base font-light focus:ring-palette-100"
								type="text"
								placeholder="Username"
							/>
							<button onClick={handleClick} type="button" className="loginButton cursor-pointer font-['Montserrat'] font-semibold rounded-xl border bg-palette-100 p-3">
								Submit
							</button>
						</form>

						<Dialog.Close />
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	);
}
