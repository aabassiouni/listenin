import React, { useEffect, useState } from "react";
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
	const [isLoading, setIsLoading] = useState<Boolean>(true);
	// const following = props.following;
	const user = props.user;
	useEffect(() => {
		console.log("FriendsList is being rendered");
		console.log("friends in FriendsList is", friends);
		// async function getFriends() {
		// 	const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${user.spotifyID}`);
		// 	console.log("userProfile is", userProfile);

		// 	setFriends(userProfile?.data?.friends);
		// }

		// getFriends();
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="friends-list flex h-full w-full flex-col rounded-xl bg-palette-100">
			<div className="friends-list-card-container flex flex-col h-full items-center overflow-scroll py-6">
				{friends.map((friendID, idx) => {
					return (
					
							<FriendCard key={friendID.user} user={user} friendID={friendID.user} />
						
					);
				})}
			</div>
		</div>
	);
}

export default FriendsList;
