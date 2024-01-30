import React, { useEffect, useState, MouseEvent } from "react";
import { spotifyApi } from "../spotify/spotify";
import * as Dialog from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Tabs from "@radix-ui/react-tabs";
import { MagnifyingGlassIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import EmptyAlbumArt from "../assets/empty-album-art.png";
import { useUser } from "../context/userContext";
import axios from "axios";
import { Song, User } from "../pages/Home";
import { useParams } from "react-router-dom";
import { useFriends } from "../context/friendsContext";

type SongSearchResultProps = {
	song: Song;
};

function SongSearchResult(props: SongSearchResultProps) {
	const song = props?.song;

	function handleClick() {
		console.log("clicked songsearchresult");
	}
	return (
		<div
			onClick={handleClick}
			className=" flex gap-3"
		>
			<img src={song.albumArt} alt="album art" className="h-12 w-12" />
			<div className="song-search-result-info flex grow-0 flex-col ">
				<span className="inline-block w-[200px] self-start truncate text-left font-['Montserrat'] font-semibold ">{song.name}</span>
				<span className="text-left font-['Montserrat'] font-medium text-gray-700">{song.artist}</span>
			</div>
		</div>
	);
}
type SendButtonProps = {
	user: User;
	friend: User;
	lastPlayedSong: Song;
};
function SendSong() {
	const { messageID } = useParams();
	const [searchResults, setSearchResults] = useState<Song[]>([]);
	const [note, setNote] = useState<string>("");
	const [search, setSearch] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
	const { user } = useUser();
	const [selectedSong, setSelectedSong] = useState<Song>({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "", id: "" });
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const { friends } = useFriends();

    useEffect(() => {
        const handleResize = () => {
          setKeyboardOpen(window.innerHeight < document.body.offsetHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [keyboardOpen]);

	
	function handleNoteChange(event: React.ChangeEvent<HTMLInputElement>) {
		setNote(event.target.value);
	}
	function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
	}

	function handleSearchClick(event: MouseEvent<HTMLButtonElement>) {
		console.log("clicked search");
		event.preventDefault();
		const options = {
		};

		let songArr: Song[] = [];
		console.log("search is", search);

		if (!search) {
			return;
		} else {
			spotifyApi.searchTracks(search, options).then((response) => {
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
	}
	function handleSendClick() {
		const friend = friends.find((friend) => friend.user === messageID);

		const data = {
			sender_id: user?.spotifyID,
			song_id: selectedSong.id,
			note: note,
			timestamp: Date.now(),
		};
		axios.put(import.meta.env.VITE_API_URL + `/send/${friend.conversationID}`, data).then(() => {
		    setIsOpen(false);

		});
	}

	return (
		<Dialog.Root open={isOpen} onOpenChange={()=>{
            setIsOpen(!isOpen);
        }}>
			<Dialog.Trigger asChild={true}>
				<button className="text-shadow w-full min-w-[20rem] gap-2 rounded-xl bg-palette-100 p-4 text-center font-['Montserrat'] font-medium text-2xl text-black">Send Song</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-blackA9 data-[state=open]:animate-overlayShow" />
				<Dialog.Content className="fixed top-1/2 left-[50%]  max-h-[70 md:w-1/3 w-full max-w-[450p translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-palette-100 px-[25px]  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
					<Dialog.Title className="pb-3 text-center font-['Montserrat'] text-lg font-medium text-mauve12"></Dialog.Title>
					<Tabs.Root
						className="flex flex-col gap-1"
						defaultValue="select"
						onValueChange={() => {
							setSelectedSong({ name: "Not Checked", albumArt: EmptyAlbumArt, artist: "", id: "" });
							setSearchResults([]);
							setSearch("");
						}}
						aria-label="View density"
					>
						<Tabs.List className="flex shrink-0 border-mauve6 pb-2">
							<Tabs.Trigger
								className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Montserrat'] text-base font-semibold leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-300 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
								value="select"
							>
								Select Song
							</Tabs.Trigger>
							<Tabs.Trigger
								value="last-played"
								className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 font-['Montserrat'] text-base font-semibold leading-none text-palette-400 outline-none first:rounded-l-md last:rounded-r-md hover:text-palette-100 data-[state=active]:text-palette-300 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
							>
								Use last played
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content
							asChild
							value="select"
						>
							<div className="flex flex-col gap-1">
								<div className="sticky top-0">
									<input
										type="text"
										id="default-search"
										className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-lg  text-gray-900 focus:border-palette-300 focus:ring-palette-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
										placeholder="Search"
										autoComplete="off"
										required
										onChange={handleSearchChange}
									/>

									<button
										type="button"
										onClick={handleSearchClick}
										className="absolute right-2.5 bottom-2.5 rounded-lg bg-palette-300 px-2 py-2 font-['Montserrat'] text-sm font-medium text-white hover:bg-palette-200 focus:outline-none focus:ring-2 focus:ring-palette-100 disabled:opacity-25"
									>
										<MagnifyingGlassIcon />
									</button>
								</div>

								<div className="my-2 h-[35vh]">
									{searchResults.length == 0 ? (
										<div className="flex h-[35vh]  items-center justify-center rounded-lg bg-palette-400/20">
											<p className="text-black/60">Search for a song!</p>
										</div>
									) : (
										<ScrollArea.Root className="overflow-hidde flex max-h-[35vh] rounded-xl   ">
											<ScrollArea.Viewport asChild>
												<div className=" flex max-h-[35vh] flex-col gap-1 overflow-scroll">
													{searchResults.map((song, idx) => {
														return (
															<>
																<button
																	onClick={() => {
																		setSelectedSong(song);
																	}}
																	className="song-search-result flex w-full grow-0 flex-row items-center gap-3 rounded-lg border-2 border-gray-700 bg-white p-2 focus:border-2 focus:border-palette-300 focus:bg-[#2fad62]"
																>
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
								</div>
								<div className="flex">
									<input
										placeholder="Send a note!"
                                        type="text"
                                        onChange={handleNoteChange}
										className=" mr-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-lg  text-gray-900 focus:border-palette-300 focus:ring-palette-300"
									></input>
									<button type="button" onClick={handleSendClick} className="rounded-lg bg-palette-300 p-4 text-white">
										<PaperPlaneIcon />
									</button>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="last-played" className="flex flex-col gap-1"></Tabs.Content>
					</Tabs.Root>
					<Dialog.Close />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export default SendSong;
