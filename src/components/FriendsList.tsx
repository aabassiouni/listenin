import React from "react";
import { User } from "../pages/Home.js";
import FriendCard from "./FriendCard.jsx";

type Props = {
	following: string[];
	user: User;
};


function FriendsList(props : Props) {
	console.log("FriendsList is being rendered");

	const following = props.following;
	const user = props.user;

	console.log("following in FriendsList is", following);
	return (
		<div className="friends-list flex flex-col rounded-xl h-full w-full bg-palette-100">
			<div className="friends-list-card-container py-6 flex flex-col items-center overflow-scroll">
				{following.map((friendID, idx) => {
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