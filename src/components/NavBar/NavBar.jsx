import React from "react";
import LogoutButton from "../LogoutButton/LogoutButton";

export default function NavBar() {
	return (
		<nav class="rounded border-gray-200 bg-palette-400 px-2 py-5 dark:bg-gray-900 sm:px-5">
			<div class="container px-2 mx-auto flex flex-wrap items-center justify-between">
				<a href="" class="flex items-center">
					<span class="border-[1px] border-transparent bg-transparent font-['Gotham'] text-3xl font-[600] normal-case text-white">ListenIn</span>
				</a>
				<div class="flex">
					<button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" class="mr-1 rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700 md:hidden">
						<svg class="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
						</svg>
						<span class="sr-only">Search</span>
					</button>
					<div class="relative hidden md:block">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
							</svg>
							<span class="sr-only">Search icon</span>
						</div>
						<input type="text" id="search-navbar" class="block w-full rounded-lg border border-gray-900 bg-gray-50 p-2 pl-10 text-sm focus:border-palette-100 focus:ring-palette-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="Search..." />
					</div>
					{/* <button data-collapse-toggle="navbar-search" type="button" class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden" aria-controls="navbar-search" aria-expanded="false">
						<span class="sr-only">Open menu</span>
						<svg class="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
						</svg>
					</button> */}
				</div>
				<LogoutButton />
			</div>
		</nav>
	);
}
