import React, { useEffect } from "react";
import { User } from "../pages/Home.js";
import FriendCard from "./FriendCard.jsx";
import axios from "axios";
import { useFriends } from "../context/friendsContext.js";

type Props = {

	user: User;
};

function FriendsList(props: Props) {
	console.log("FriendsList is being rendered");

	const { friends, setFriends } = useFriends();
	// const following = props.following;
	const user = props.user;
	useEffect(() => {
		console.log("FriendsList is being rendered");

		async function getFriends() {
			const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${user.spotifyID}`);
			console.log("userProfile is", userProfile);

			setFriends(userProfile?.data?.friends);
		}

		getFriends();
	}, []);

	console.log("following in FriendsList is", friends);
	return (
		<div className="friends-list flex h-full w-full flex-col rounded-xl bg-palette-100">
			<div className="friends-list-card-container flex flex-col items-center overflow-scroll py-6">
				{friends.map((friendID, idx) => {
					return (
						<>
							<FriendCard key={friendID} user={user} friendID={friendID} />
						</>
					);
				})}
			</div>
		</div>
	);
}

export default FriendsList;
