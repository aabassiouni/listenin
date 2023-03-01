import React, { useEffect, useState } from "react";
// import { Modal } from "flowbite";
import { spotifyApi } from "../spotify/spotify";
import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Separator from "@radix-ui/react-separator";
import * as Tabs from "@radix-ui/react-tabs";
import { MagnifyingGlassIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import EmptyAlbumArt from "../assets/empty-album-art.png";

function SongSearchResult(props) {
	const song = props?.song;

	function handleClick() {
		// props.setSong(song);
		// props.setIsOpen(false);
		console.log("clicked songsearchresult");
	}
	return (
		<button onClick={handleClick} className="song-search-result flex  w-full flex-row items-center gap-3 rounded-lg border-2 border-gray-700 bg-white p-2 focus:border-2 focus:border-palette-300">
			<img src={song.albumArt} alt="album art" className="h-12 w-12" />
			<div className="song-search-result-info flex flex-col truncate ">
				<p className="self-start  font-['Gotham'] font-bold">{song.name}</p>
				<h1 className="text-left font-['Gotham'] text-gray-500">{song.artist}</h1>
			</div>
		</button>
	);
}

function SendButton(props) {
	// const [friend, setFriend] = useState({});
	// const [song, setSong] = useState({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "" });
	const [searchResults, setSearchResults] = useState([]);
	const [selected, setSelected] = useState("select");
	const [isOpen, setIsOpen] = useState(false);
	const [selectedSong, setSelectedSong] = useState({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "" });
	const [note, setNote] = useState("");
	const friend = props.friend;
	const song = props.song;

	function handleChange(event) {
		setNote(event.target.value);
	}
	function handleSearchClick(event) {
		console.log("clicked search");
		event.preventDefault();
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
					id: response.tracks.items[i].id,
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
				<Dialog.Content className="fixed top-3/4 left-[50%] h-3/4 max-h-[85vh] w-full max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-t-[6px] bg-palette-100 px-[25px] py-[25px] pt-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
					<Dialog.Title className="pb-3 text-center font-['Gotham'] text-lg font-medium text-mauve12">
						Choose a song to send to <span className="rounded border-palette-300 bg-white p-1">{friend.username}</span>
					</Dialog.Title>
					{/* <Dialog.Description className="mt-[10px] mb-5 text-[15px] leading-normal text-mauve12">We'll add it to your Liked Songs playlist.</Dialog.Description> */}
					<Tabs.Root className="flex flex-col gap-1" defaultValue="select" onValueChange={setSelected} aria-label="View density">
						<Tabs.List className="flex shrink-0 border-mauve6 pb-2">
							<Tabs.Trigger
								className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Gotham'] text-[15px] leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-300 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
								value="select"
							>
								Select Song
							</Tabs.Trigger>
							<Tabs.Trigger
								value="last-played"
								className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Gotham'] text-[15px] leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-300 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
							>
								Use last played
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="select" className="flex flex-col gap-1">
							<div class="sticky top-0">
								<input
									type="text"
									id="default-search"
									class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-lg  text-gray-900 focus:border-palette-300 focus:ring-palette-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
									placeholder="Search"
									autoComplete="off"
									// onKeyDown={handleSearchKeyDown}
									required
									// onChange={handleChange}
								/>
								<button
									type="button"
									onClick={handleSearchClick}
									// disabled={selectedUser === null}
									class="absolute right-12 bottom-2.5 rounded-lg bg-palette-300 px-2 py-2 font-['Gotham'] text-sm font-medium text-white hover:bg-palette-200 focus:outline-none focus:ring-2 focus:ring-palette-100 disabled:opacity-25"
								>
									<PaperPlaneIcon />
								</button>
								<button
									type="button"
									onClick={handleSearchClick}
									// disabled={selectedUser === null}
									class="absolute right-2.5 bottom-2.5 rounded-lg bg-palette-300 px-2 py-2 font-['Gotham'] text-sm font-medium text-white hover:bg-palette-200 focus:outline-none focus:ring-2 focus:ring-palette-100 disabled:opacity-25"
								>
									<MagnifyingGlassIcon />
								</button>
							</div>
							{/* <div className="Spacer p-1"></div> */}
							<textarea onChange={handleChange} className="w-full self-center rounded border-2"></textarea>
						
							{searchResults.length !== 0 && (
								<ScrollArea.Root className="flex max-h-[30vh] rounded-xl  ">
									<ScrollArea.Viewport asChild>
										{/* <div className="py-[15px] px-5 h-full"> */}

										<div className=" flex max-h-[25vh] w-full flex-col gap-1 overflow-scroll">
											{searchResults.map((song, idx) => {
												return (
													<>
														<button className="flex ">
															<SongSearchResult song={song} />
														</button>
													</>
												);
											})}
										</div>
									</ScrollArea.Viewport>

									<ScrollArea.Corner />
								</ScrollArea.Root>
							)}
						</Tabs.Content>
						<Tabs.Content value="last-played" className="flex flex-col gap-1">
							<div className="Spacer p-1"></div>
							<button className="song-search-result flex w-full flex-row items-center gap-3 rounded-lg border-2 border-gray-700 bg-white p-2 focus:border-2 focus:border-palette-300">
								<img src={song.albumArt} alt="album art" className="h-12 w-12" />
								<div className="song-search-result-info flex flex-col truncate ">
									<p className="self-start  font-['Gotham'] font-bold">{song.name}</p>
									<h1 className="text-left font-['Gotham'] text-gray-500">{song.artist}</h1>
								</div>
							</button>
						</Tabs.Content>
					</Tabs.Root>
					{/* <form
						onSubmit={(e) => {
							e.preventDefault();
						}}
					> */}
					{/* <Tabs.Panel value="select2" className="flex flex-col gap-1"> */}

					{/* <RadioGroup.Root className="flex flex-col gap-1" defaultValue="select" onValueChange={setSelected} aria-label="View density">
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
										Use {friend.username}'s last played
									</label>
								</div>
							</RadioGroup.Item>
						</RadioGroup.Root> */}
					{/* </form> */}
					<div className="Spacer p-2"></div>

					{selected === "current" ? <SongSearchResult song={song} /> : <></>}
					<Dialog.Close />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default SendButton;
