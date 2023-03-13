import React from "react";
import FriendCard from "./FriendCard.jsx";

function FriendsList(props) {
	console.log("FriendsList is being rendered");

	const following = props.following;
	const user = props.user;

	console.log("following in FriendsList is", following);
	return (
		<div className="friends-list flex flex-col rounded-xl h-96 w-80 bg-palette-100">
			<div className="friends-list-card-container gap-3 py-3 px-3 flex flex-col items-center overflow-scroll">
				{following.map((friend, idx) => {
					return (
						<>
							<FriendCard key={idx} user = {user} friend={friend} />
							{/* <FriendCard key={idx} user={friend} /> */}
						</>
					);
				})}
				{/* <h1>test</h1>
                <h1>test</h1> */}
				{/* <h1>test</h1>
                <h1>test</h1> */}
			</div>
		</div>
	);
}

export default FriendsList;