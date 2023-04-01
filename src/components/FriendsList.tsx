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

	const { friends, setFriends, isLoading } = useFriends();
	// const [isLoading, setIsLoading] = useState<Boolean>(true);
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
		// setIsLoading(false);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		// <div className="friends-list flex h-full md:w-full flex-col rounded-xl max-h-[50%] overflow-scroll bg-palette-100 md: md:grow md:justify-center md:mx-6">
		// <div className="friends-list-card-container flex flex-col md:w-full items-center overflow-scroll py-6 ">
		<div className="overf ">
			{friends ? friends.map((friendID, idx) => {
				return (
					<>
						<FriendCard key={friendID.user} user={user} friendID={friendID.user} />
						{/* <FriendCard key={friendID.user} user={user} friendID={friendID.user} />
							<FriendCard key={friendID.user} user={user} friendID={friendID.user} />
							<FriendCard key={friendID.user} user={user} friendID={friendID.user} /> */}
					</>
				);
			}) : <></>}
		</div>
		// </div>
		// </div>
	);
}

export default FriendsList;
