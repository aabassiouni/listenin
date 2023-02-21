import React from "react";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
	return (
		<nav class="rounded border-gray-200 bg-palette-400 px-2 py-5 dark:bg-gray-900 sm:px-5">
			<div class="container px-2 mx-auto flex flex-wrap items-center justify-between">
				<a href="" class="flex items-center">
					<span class="border-[1px] border-transparent bg-transparent font-['Gotham'] text-3xl font-[600] normal-case text-white">ListenIn</span>
				</a>
				<LogoutButton />
			</div>
		</nav>
	);
}
