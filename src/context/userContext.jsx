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
			console.log("setting token to local storage token")
			setToken(localToken);
			setIsLoggedIn(true);
		} else {
			localStorage.removeItem("access_token");
			// localStorage.removeItem("refresh_token");

			const params = getHashParams();
			const access_token = params.access_token;
			const refresh_token = params.refresh_token;

			if (access_token) {
				console.log("settting token to params token")
				setToken(access_token);
				setIsLoggedIn(true);
				localStorage.setItem("access_token", access_token);
				localStorage.setItem("refresh_token", refresh_token);
			}
		}

		setIsLoading(false);
	}, []);

	async function getRefreshToken() {
		console.log("getRefreshToken is being called")
		// setIsLoading(true);
		const refresh_token = localStorage.getItem("refresh_token");
		const response = await fetch(`http://localhost:8888/refresh_token?refresh_token=${refresh_token}`);
		const data = await response.json();
		setToken(data.access_token);
		// setIsLoading(false);
	}

	function logout() {
		setToken(null);
		setIsLoggedIn(false);
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
	}

	return <UserContext.Provider value={{ token, isLoggedIn, isLoading, logout, getRefreshToken }}>{children}</UserContext.Provider>;
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("Context must be used within a Provider");
	}
	return context;
}
