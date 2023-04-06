import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusIcon } from "@radix-ui/react-icons";
import * as Avatar from "@radix-ui/react-avatar";
import * as Tabs from "@radix-ui/react-tabs";
import toast from "react-hot-toast";
import { useFriends } from "../context/friendsContext";
import axios from "axios";
import type { User } from "../pages/Home";

type AddFriendsButtonProps = {
	user: User;
};

function SearchResult(props: { user: User; result: User }) {
	const result = props.result;
	const [isLoading, setIsLoading] = useState<Boolean>(false);

	async function handleAddClick() {
		setIsLoading(true);
		console.log("result in search result is", result);
		const target_id = result.spotifyID;
		console.log("target_id is", target_id);
		const user = props.user;

		const url = import.meta.env.VITE_API_URL + `/users/${user.spotifyID}/sendFriendRequest?target_id=${target_id}`;
		const { data } = await axios.put(url);
		console.log("data is", data);
		if (data.message == "already sent") {
			toast.error("Already sent");
		}
		setIsLoading(false);
	}

	return (
		<div className="mt-4 flex">
			<div className="flex w-full flex-row items-center rounded-l-lg border-y border-l border-palette-500 bg-palette-200 p-2">
				<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
					{/* <Avatar.Image className= "h-full  w-full rounded-[inherit] object-cover" src={} /> */}
					<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-xl text-violet11">{result.id.charAt(0).toUpperCase()}</Avatar.Fallback>
				</Avatar.Root>
				<p className="font-gotham ml-2 text-sm font-medium text-gray-100 dark:text-white">{result.id}</p>
			</div>
			<button onClick={handleAddClick} type="button" className="flex w-8 items-center justify-center rounded-r-lg bg-palette-400">
				<PlusIcon className="h-6 w-6 text-gray-400" />
			</button>
		</div>
	);
}

function PendingRequest(props: { request: any; acceptRequest: any }) {
	const request = props.request;
	const [friend, setFriend] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	console.log("request in pending", request);
	const acceptRequest = props.acceptRequest;

	useEffect(() => {
		console.log("fetching user from api in pending request");
		axios.get(import.meta.env.VITE_API_URL + `/users/${request}`).then((res) => {
			var userObj: User = {
				id: res.data.username,
				email: res.data.email,
				name: res.data.name,
				spotifyID: res.data.spotifyID,
			};

			setFriend(userObj);
			setIsLoading(false);
		});
	}, []);

	return (
		<div className="mt-4 flex flex-row items-center justify-between rounded-lg bg-palette-300 p-2">
			<div className="flex flex-row items-center">
				<Avatar.Root className=" mx-2 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA3 align-middle">
					{/* <Avatar.Image className= "h-full  w-full rounded-[inherit] object-cover" src={} /> */}
					<Avatar.Fallback className="leading-1 flex h-full w-full items-center justify-center bg-white text-xl text-violet11">AB</Avatar.Fallback>
				</Avatar.Root>
				<p className="ml-2 font-['Montserrat'] text-sm font-medium text-white dark:text-white">{friend?.id}</p>
			</div>
			<div className="flex flex-row items-center">
				<button
					type="button"
					className="mr-2 rounded-lg bg-palette-200 px-2 py-2 font-['Montserrat'] text-sm font-medium text-white"
					onClick={() => {
						acceptRequest(request);
					}}
				>
					Accept
				</button>
			</div>
		</div>
	);
}

export default function AddFriendsButton(props: AddFriendsButtonProps) {
	const [query, setQuery] = useState<string>("");
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [requests, setRequests] = useState<any[]>([]);
	const user = props.user;
	console.log("user in add is", user);
	const { setFriends } = useFriends();

	async function acceptRequest(request: any) {
		const url = import.meta.env.VITE_API_URL + `/users/${user.spotifyID}/acceptFriendRequest?target_id=${request}`;
		const { data } = await axios.put(url);
		console.log("data in accept is", data);
		setRequests(data.user.incomingFriendRequests);
		setFriends(data.user.friends);
	}

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

			const newData = data.map((user: any): User => {
				return {
					id: user.username,
					email: user.email,
					name: user.name,
					spotifyID: user.spotifyID,
				};
			});
			console.log("newData is", newData);
			console.log("data is", data);
			setSearchResults(newData);
		}
		fetchData();
	}, [query]);

	useEffect(() => {
		async function fetchData() {
			const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${user.spotifyID}`);
			console.log("userProfile in add is", userProfile);
			console.log("requests are", userProfile.data.incomingFriendRequests);
			setRequests(userProfile.data.incomingFriendRequests);
		}
		fetchData();
	}, []);

	return (
		<>
			<Dialog.Root
				onOpenChange={(open) => {
					setSearchResults([]);
				}}
			>
				<Dialog.Trigger asChild={true}>
					<button type="button" className="loginButton rounded-xl bg-palette-100 p-2">
						<PlusIcon className="text-shadow h-6 w-6 text-white" />
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
					<Dialog.Content className="fixed top-3/4 left-[50%] h-4/6 max-h-[85vh] w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-t-[6px] bg-palette-100 px-[25px] py-[25px] pt-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
						<Tabs.Root
							onValueChange={() => {
								setSearchResults([]);
							}}
							defaultValue="add"
						>
							<Tabs.List className="flex shrink-0 border-mauve6">
								<Tabs.Trigger
									className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Montserrat'] text-[15px] font-semibold leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-100 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
									value="add"
								>
									Add Friends
								</Tabs.Trigger>

								<Tabs.Trigger
									value="pending"
									className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Montserrat'] text-[15px] font-semibold leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-100 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
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
									<label htmlFor="default-search" className="sr-only mb-2 font-['Montserrat'] text-sm font-medium text-gray-900 dark:text-white">
										Search
									</label>
									<div className="sticky top-0">
										<input
											type="text"
											id="default-search"
											className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-lg  text-gray-900 focus:border-palette-300 focus:ring-palette-300"
											placeholder="Search"
											autoComplete="off"
											required
											onChange={(event) => {
												setQuery(event.target.value);
												setSearchResults([]);
											}}
										/>
									</div>
									<div className="mt-4 overflow-scroll">
										{searchResults.length > 0 &&
											searchResults.map((result, idx) => {
												console.log("result is: ", result);
												return <SearchResult user={user} result={result} />;
											})}
									</div>
								</form>
							</Tabs.Content>
							<Tabs.Content className="mt-4" value="pending">
								<div className="flex flex-col">
									{requests &&
										requests.map((request) => {
											console.log("request is: ", request);

											return <PendingRequest request={request} acceptRequest={acceptRequest} />;
										})}
								</div>
							</Tabs.Content>
						</Tabs.Root>

						<Dialog.Close asChild></Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}
