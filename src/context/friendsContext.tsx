import { createContext, useState, useEffect, useContext, useReducer, useMemo } from "react";


interface UserContextProps {
	token: string | null;
	isLoggedIn: boolean;
	isLoading: boolean;
	logout: () => void;
	getRefreshToken: () => Promise<void>;

}

interface FriendsContextProps {
    friends: any[];
    setFriends: any;
}


export const FriendsContext = createContext<FriendsContextProps>({
	friends: [],
    setFriends: null,
});

export function FriendsContextProvider({ children }: { children: React.ReactNode }) {

    const [friends, setFriends] = useState([]);


	useEffect(() => {
		
	}, []);



	return <FriendsContext.Provider value={{friends, setFriends  }}>{children}</FriendsContext.Provider>;
}

export function useFriends() {
	const context = useContext(FriendsContext);
	if (context === undefined) {
		throw new Error("Context must be used within a Provider");
	}
	return context;
}