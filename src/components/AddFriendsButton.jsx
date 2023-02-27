import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";

export default function AddFriendsButton() {
	return (
		<>
			<Dialog.Root>
				<Dialog.Trigger asChild={true}>
					<button type="button" className="loginButton rounded-xl bg-palette-100 p-2">
						{/* <p className="text-center font-['Gotham'] text-lg font-bold text-white text-shadow">Add Friends</p> */}
						<PlusIcon className="h-6 w-6 text-white text-shadow" />
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
					<Dialog.Content className="fixed top-3/4 left-[50%] h-1/2 max-h-[85vh] w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-t-[6px] bg-palette-100 px-[25px] py-[25px] pt-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
					    <Dialog.Close asChild></Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}
