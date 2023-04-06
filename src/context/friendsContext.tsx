import { createContext, useState, useEffect, useContext, useReducer, useMemo } from "react";
import axios from "axios";
import { useUser } from "./userContext";



interface FriendsContextProps {
    friends: any[];
    setFriends: any;
	isLoading: boolean;
}


export const FriendsContext = createContext<FriendsContextProps>({
	friends: [],
    setFriends: null,
	isLoading: true,
});

export function FriendsContextProvider({ children }: { children: React.ReactNode }) {

    const [friends, setFriends] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useUser();
	console.log("user is", user);

	useEffect(() => {
		async function getFriends() {
			setIsLoading(true);
			const userProfile = await axios.get(import.meta.env.VITE_API_URL + `/users/${user?.spotifyID}`);
			console.log("userProfile is", userProfile);

			setFriends(userProfile?.data?.friends);
			setIsLoading(false);
		}

		getFriends();
	}, []);



	return <FriendsContext.Provider value={{friends, setFriends, isLoading  }}>{children}</FriendsContext.Provider>;
}

export function useFriends() {
	const context = useContext(FriendsContext);
	if (context === undefined) {
		throw new Error("Context must be used within a Provider");
	}
	return context;
}