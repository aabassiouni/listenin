import React, { useState } from "react";
import { Modal } from "flowbite";
import { spotifyApi } from "../spotify/spotify";
import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import EmptyAlbumArt from "../assets/empty-album-art.png";

function SongSearchResult(props) {
	const song = props?.song;
	return (
		<div className="song-search-result flex flex-row items-center gap-3 rounded-lg bg-white p-2">
			<img src={song.albumArt} alt="album art" className="h-12 w-12" />
			<div className="song-search-result-info flex flex-col">
				<h1 className="font-['Gotham'] font-bold">{song.name}</h1>
				<h1 className="font-['Gotham'] text-gray-500">{song.artist}</h1>
			</div>
		</div>
	);
}
function LikeButton(props) {
	// const [friend, setFriend] = useState({});
	// const [song, setSong] = useState({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "" });
	const [searchResults, setSearchResults] = useState([]);
	const [selected, setSelected] = useState("select");
	const [isOpen, setIsOpen] = useState(false);

	const friend = props.friend;
	const song = props.song;
	console.log("friend is", friend);

	function handleSearchClick() {
		const options = {
			// limit: 5,
		};

		let songArr = [];
		spotifyApi.searchTracks(document.getElementById("default-search").value, options).then((response) => {
			console.log("response is", response);
			for (let i = 0; i < response.tracks.items.length; i++) {
				console.log("response.tracks.items[i] is", response.tracks.items[i]);
				let songObj = {
					name: response.tracks.items[i].name,
					albumArt: response.tracks.items[i].album.images[0].url,
					artist: response.tracks.items[i].artists[0].name,
				};
				songArr.push(songObj);
			}
			setSearchResults(songArr);
		});
	}

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={(open) => {
				setSearchResults([]);
				setIsOpen(open);
			}}
		>
			<Dialog.Trigger asChild={true}>
				<button className="like-button flex items-center justify-center rounded-r-lg border-l border-opacity-10 bg-palette-300 p-2">
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
							fill="white"
							fill-rule="evenodd"
							clip-rule="evenodd"
						></path>
					</svg>
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
				<Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-palette-100 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
					<Dialog.Title className="m-0 text-xl font-medium text-mauve12">Choose a song to send to {friend.email}</Dialog.Title>
					<Dialog.Description className="mt-[10px] mb-5 text-[15px] leading-normal text-mauve12">We'll add it to your Liked Songs playlist.</Dialog.Description>
					<form>
						<RadioGroup.Root className="flex flex-col gap-1" defaultValue="select" onValueChange={setSelected} aria-label="View density">
							<RadioGroup.Item value="select" id="r1" asChild>
								<div className="flex items-center rounded-lg border-2 border-palette-500 border-opacity-70 pl-4">
									<div className="h-4 w-4 cursor-default rounded-full bg-white shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-palette-500">
										<RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-[50%] after:bg-palette-300 after:content-['']" />
									</div>

									<label className="ml-2 w-full py-4 font-['Gotham'] text-sm font-medium text-palette-400" htmlFor="r1">
										Select Song
									</label>
								</div>
							</RadioGroup.Item>
							<RadioGroup.Item value="current" id="r2" asChild>
								<div className="flex items-center rounded-lg border-2 border-palette-500 border-opacity-70 pl-4">
									<div className="h-4 w-4 cursor-default rounded-full bg-white shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black">
										<RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-[50%] after:bg-palette-300 after:content-['']" />
									</div>
									<label className="ml-2 w-full py-4 font-['Gotham'] text-sm font-medium text-palette-400" htmlFor="r2">
										Use {friend.email}'s last played
									</label>
								</div>
							</RadioGroup.Item>
						</RadioGroup.Root>
					</form>
					<div className="Spacer p-2"></div>
					{selected === "select" ? (
						<>
							<div className="flex max-h-44 flex-col gap-2 overflow-scroll">
								<form>
									<label for="default-search" class="sr-only mb-2 font-gotham text-sm font-medium text-gray-900 dark:text-white">
										Search
									</label>
									<div class="sticky top-0">
										<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
											<svg
												aria-hidden="true"
												class="h-5 w-5 text-gray-500 dark:text-gray-400"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
											</svg>
										</div>
										<input
											type="text"
											id="default-search"
											class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
											placeholder="Search"
											required
										/>
										<button
											type="button"
											onClick={handleSearchClick}
											class="absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
										>
											Search
										</button>
									</div>
								</form>
								{/* {JSON.stringify(searchResults)} */}
							</div>
							<div className="">
								{searchResults.map((song) => {
									return (
										// <div className="h-3 overflow-scroll">
										<SongSearchResult song={song} />
										// </div>
									);
								})}
							</div>
						</>
					) : (
						<></>
					)}
					{selected === "current" ? <SongSearchResult song={song} /> : <></>}
					<Dialog.Close />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
function LikeButtonflowbite(props) {
	// console.log("LikeButton is being rendered");
	const [liked, setLiked] = useState(false);
	const [selected, setSelected] = useState("current");
	const [searchResults, SetSearchResults] = useState([]);
	const $targetEl = document.getElementById("authentication-modal");

	const friend = props.friend;
	const song = props.song;

	const options = {
		placement: "center",
		backdrop: "dynamic",
		backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
		closable: true,
		onHide: () => {
			console.log("modal is hidden");
			SetSearchResults([]);
		},
		onShow: () => {
			console.log("modal is shown");
		},
		onToggle: () => {
			console.log("modal has been toggled");
		},
	};
	console.log("friend in LikeButton is", friend);
	const modal = new Modal($targetEl, options);

	function handleSearchClick() {
		const options = {
			// limit: 5,
		};

		let songArr = [];
		spotifyApi.searchTracks(document.getElementById("default-search").value, options).then((response) => {
			console.log("response is", response);
			for (let i = 0; i < response.tracks.items.length; i++) {
				console.log("response.tracks.items[i] is", response.tracks.items[i]);
				let songObj = {
					name: response.tracks.items[i].name,
					albumArt: response.tracks.items[i].album.images[0].url,
					artist: response.tracks.items[i].artists[0].name,
				};
				songArr.push(songObj);
			}
			SetSearchResults(songArr);
		});
	}

	return (
		<>
			<button
				onClick={() => {
					modal.toggle();
				}}
				data-modal-target="authentication-modal"
				data-modal-toggle="authentication-modal"
				className="like-button flex h-full w-[40px] cursor-pointer items-center justify-center rounded-r-lg bg-[#0D2818] hover:bg-[#961a1a] active:bg-[#e93131]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-heart"
				>
					<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
				</svg>
			</button>

			<div id="authentication-modal" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full">
				<div class="relative h-full w-full max-w-md md:h-auto">
					{/* <!-- Modal content --> */}
					<div class="relative rounded-lg bg-palette-100 shadow dark:bg-gray-700">
						<button
							onClick={() => {
								modal.toggle();
							}}
							type="button"
							class="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
							data-modal-hide="authentication-modal"
						>
							<svg aria-hidden="true" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span class="sr-only">Close modal</span>
						</button>
						<div class="px-6 py-6 lg:px-8">
							<h3 class="mb-4 font-['Gotham'] text-xl font-bold text-palette-400 dark:text-white">Choose a song to send to {friend.email} </h3>
							<form class="space-y-6" action="#">
								<div class="flex items-center rounded border border-gray-200 pl-4 dark:border-gray-700">
									<input
										id="bordered-radio-1"
										type="radio"
										value="select"
										checked={selected === "select"}
										onChange={(e) => {
											setSelected(e.target.value);
										}}
										name="bordered-radio"
										class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
									/>
									<label for="bordered-radio-1" class="ml-2 w-full py-4 font-['Gotham'] text-sm font-medium text-palette-400">
										Select Song
									</label>
								</div>
								<div class="flex items-center rounded border border-gray-200 pl-4 dark:border-gray-700">
									<input
										id="bordered-radio-2"
										type="radio"
										value="current"
										checked={selected === "current"}
										onChange={(e) => {
											setSelected(e.target.value);
										}}
										class="h-4 w-4  border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
									/>
									<label for="bordered-radio-2" class="ml-2 w-full py-4 font-['Gotham'] text-sm  text-palette-500 dark:text-gray-300">
										Use Ali's current playing song
									</label>
								</div>
								{/* <h1>{selected}</h1> */}
								{selected === "select" ? (
									<>
										<div className="flex max-h-44 flex-col gap-2 overflow-scroll">
											<form>
												<label for="default-search" class="sr-only mb-2 font-gotham text-sm font-medium text-gray-900 dark:text-white">
													Search
												</label>
												<div class="sticky top-0">
													<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
														<svg
															aria-hidden="true"
															class="h-5 w-5 text-gray-500 dark:text-gray-400"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
														</svg>
													</div>
													<input
														type="text"
														id="default-search"
														class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
														placeholder="Search"
														required
													/>
													<button
														type="button"
														onClick={handleSearchClick}
														class="absolute right-2.5 bottom-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
													>
														Search
													</button>
												</div>
											</form>
											{/* {JSON.stringify(searchResults)} */}
											{searchResults.map((song) => {
												return (
													// <div className="h-3 overflow-scroll">
													<SongSearchResult song={song} />
													// </div>
												);
											})}
										</div>
									</>
								) : (
									<></>
								)}
								{selected === "current" ? (
									<>
										{/* <div className="flex rounded-xl bg-white p-2">
											<div className="flex border">
												<img className="song-img block h-16" src={song.albumArt} alt="test" />
												<div className="text-container flex w-full flex-col items-center justify-center">
													<p className="song-title max-h-7 self-start overflow-hidden text-ellipsis font-['Gotham'] text-lg font-[450] ">{song.name}</p>
													<span className="artist-name self-start text-clip font-['Gotham'] text-base ">{song.artist}</span>
												</div>
											</div>
										</div> */}
										<SongSearchResult song={song} />
									</>
								) : (
									<></>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default LikeButton;
