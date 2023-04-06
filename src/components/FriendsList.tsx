import { useEffect } from "react";
import { User } from "../pages/Home.js";
import FriendCard from "./FriendCard.jsx";
import { useFriends } from "../context/friendsContext.js";

type Props = {
	user: User;
};

function FriendsList(props: Props) {
	console.log("FriendsList is being rendered");

	const { friends, setFriends, isLoading } = useFriends();
	const user = props.user;

	useEffect(() => {
		console.log("FriendsList is being rendered");
		console.log("friends in FriendsList is", friends);

	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
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
	);
}

export default FriendsList;
