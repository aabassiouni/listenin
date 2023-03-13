import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import * as Avatar from "@radix-ui/react-avatar";
import * as Tabs from "@radix-ui/react-tabs";

import axios from "axios";

export default function AddFriendsButton(props) {
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);

	const user = props.user;
	// console.log("user is", user)

	useEffect(() => {
		if (!query) {
			setSearchResults([]);
			return;
		}

		async function fetchData() {
			console.log("fetching search results");
			const url = import.meta.env.VITE_API_URL + "/search";
			const { data } = await axios.get(url, {
				params: {
					query: query,
				},
			});
			setSearchResults(data);
		}
		fetchData();
	}, [query]);

	const handleClick = (e) => {
		console.log("handleClick is being called");
		console.log("e.target is", e.target);
		console.log("e.target.value is", e.target.value);
	};

	const handleChange = (e) => {
		setQuery(e.target.value);
		setSearchResults([]);
		setSelectedUser(null);
	};

	async function handleAddClick() {
		console.log("handleSearchClick is being called");
		const targetUser = searchResults[selectedUser].spotifyID;
		console.log("targetUser is", targetUser);
		const { data } = await axios.put(import.meta.env.VITE_API_URL + `/users/${user.spotifyID}/follow?target_id=${targetUser}`);
		console.log(data);
	}

	function handleSearchKeyDown(e) {
		// e.preventDefault();

		if (e.key === "Enter") {
			// handleAddClick();
		}
	}

	return (
		<>
			<Dialog.Root
				onOpenChange={(open) => {
					setSearchResults([]);
					// setIsOpen(open);
				}}
			>
				<Dialog.Trigger asChild={true}>
					<button type="button" className="loginButton rounded-xl bg-palette-100 p-2">
						{/* <p className="text-center font-['Gotham'] text-lg font-bold text-white text-shadow">Add Friends</p> */}
						<PlusIcon className="h-6 w-6 text-white text-shadow" />
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
					<Dialog.Content className="fixed top-3/4 left-[50%] h-1/2 max-h-[85vh] w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-t-[6px] bg-palette-100 px-[25px] py-[25px] pt-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
						{/* <Dialog.Title className="text-center font-['Gotham'] text-lg font-bold text-gray-900 dark:text-white">
							clicked user: {JSON.stringify(searchResults[selectedUser]?.email)}
						</Dialog.Title> */}
						{/* {searchResults.map} */}
						<Tabs.Root
							onValueChange={() => {
								setSelectedUser(null);
								setSearchResults([]);
							}}
							defaultValue="add"
						>
							<Tabs.List className="flex shrink-0 border-mauve6">
								<Tabs.Trigger
									className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Gotham'] text-[15px] leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-100 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
									value="add"
								>
									Add Friends
								</Tabs.Trigger>

								<Tabs.Trigger
									value="tab2"
									className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Gotham'] text-[15px] leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-100 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
								>
									Pending Requests
								</Tabs.Trigger>
							</Tabs.List>
							<Tabs.Content className="mt-4" value="add">
								<form
									onSubmit={(e) => {
										e.preventDefault();
									}}
								>
									<label htmlFor="default-search" class="sr-only mb-2 font-gotham text-sm font-medium text-gray-900 dark:text-white">
										Search
									</label>
									<div class="sticky top-0">
										<input
											type="text"
											id="default-search"
											class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-lg  text-gray-900 focus:border-palette-300 focus:ring-palette-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
											placeholder="Search"
											autoComplete="off"
											onKeyDown={handleSearchKeyDown}
											required
											onChange={handleChange}
										/>
										<button
											type="button"
											onClick={handleAddClick}
											// disabled={selectedUser === null}
											class="absolute right-2.5 bottom-2.5 rounded-lg bg-palette-300 px-2 py-2 font-['Gotham'] text-sm font-medium text-white hover:bg-palette-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-25"
										>
											Add friend
										</button>
									</div>
									<div className="mt-4 overflow-scroll">
										{searchResults.length > 0 &&
											searchResults.map((result, idx) => {
												return (
													<button
														onFocus={() => {
															setSelectedUser(idx);
														}}
														// onBlur={() => {
														// 	setSelectedUser(null);
														// }}
														className="mt-4 flex w-full flex-row items-center justify-between rounded-lg border-2 border-palette-500 bg-palette-200 p-2  focus:border-2 focus:border-white"
													>
														<div className="flex flex-row items-center">
															{/* <img src={result.profilePicture} alt="" className="h-10 w-10 rounded-full" /> */}
															<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
																{/* <Avatar.Image className= "h-full  w-full rounded-[inherit] object-cover" src={} /> */}
																<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-xl text-violet11">
																	AB
																</Avatar.Fallback>
															</Avatar.Root>
															<p className="ml-2 font-gotham text-sm font-medium text-gray-900 dark:text-white">{result.username}</p>
														</div>
														{/* <p>{idx}</p> */}
														{/* <button
													type="button"
													className="rounded-lg bg-palette-300 px-2 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
													onClick={handleClick}
												>
													Add Friend
												</button> */}
													</button>
												);
											})}
									</div>
								</form>
							</Tabs.Content>
						</Tabs.Root>

						<Dialog.Close asChild></Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}

// {searchResults.map((result) => {
// 	return (
// 		<div className="flex flex-row items-center justify-between mt-4">
// 			<div className="flex flex-row items-center">
// 				<img src={result.profilePicture} alt="" className="h-10 w-10 rounded-full" />
// 				<p className="ml-2 font-gotham text-sm font-medium text-gray-900 dark:text-white">{result.username}</p>
// 			</div>
// 			<button
// 				type="button"
// 				className="rounded-lg bg-palette-300 px-2 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
// 			>
// 				Add
// 			</button>
// 		</div>
// 	);
