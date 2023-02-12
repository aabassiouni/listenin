import React from "react";
import FriendCard from "./FriendCard/FriendCard.jsx";

function FriendsList(props) {
	console.log("FriendsList is being rendered");

	const following = props.following;
	console.log("following in FriendsList is", following);
	return (
		<div className="friends-list flex w-full flex-col overflow-hidden">
			<div className="friends-list-card-container flex w-[100%] flex-col items-center justify-center  space-y-2 ">
				{following.map((friend, idx) => {
					return (
						<>
							<FriendCard key={idx} user={friend} />
							<FriendCard key={idx} user={friend} />
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
