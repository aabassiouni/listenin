import { createContext, useState, useEffect, useContext, useReducer, useMemo } from "react";
import { getHashParams } from "../util/util";

export const UserContext = createContext({
	token: null,
	isLoggedIn: false,
  isLoading: true,
});

export function UserContextProvider({ children }) {
	const [token, setToken] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		let localToken = localStorage.getItem("access_token");
		let localRefreshToken = localStorage.getItem("refresh_token");

		if (localToken) {
			setToken(localToken);
			setIsLoggedIn(true);
		} else {
			localStorage.removeItem("access_token");
			// localStorage.removeItem("refresh_token");

			const params = getHashParams();
			const access_token = params.access_token;
			const refresh_token = params.refresh_token;

			if (access_token) {
				setToken(access_token);
				setIsLoggedIn(true);
				localStorage.setItem("access_token", access_token);
				localStorage.setItem("refresh_token", refresh_token);
			}
		}

		setIsLoading(false);
	}, []);

	function logout() {
		setToken(null);
		setIsLoggedIn(false);
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
	}

	return <UserContext.Provider value={{ token, isLoggedIn, isLoading, logout }}>{children}</UserContext.Provider>;
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("Context must be used within a Provider");
	}
	return context;
}
