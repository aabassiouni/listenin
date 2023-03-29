import React from "react";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
	return (
		<nav className="rounded border-gray-200 bg-black px-2 py-5 dark:bg-gray-900 sm:px-5">
			<div className="container px-2 mx-auto flex flex-wrap items-center justify-between">
				<a href="" className="flex items-center">
					<span className="border-[1px] border-transparent bg-transparent font-['Montserrat'] text-3xl font-[600] normal-case text-white">ListenIn</span>
				</a>
				<LogoutButton />
			</div>
		</nav>
	);
}
