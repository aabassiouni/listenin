import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./context/userContext";
import LoginButton from "./components/LoginButton/LoginButton";
import Card from "./components/Card/Card";
import Login from "./pages/Login";
import Home from "./pages/Home.js";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Redirect,
	Navigate,
} from "react-router-dom";
import { UserContextProvider } from "./context/userContext";

function App() {
	console.log("App.js is being rendered");

	const { user, dispatch } = useContext(UserContext);
	const [isLoading, setIsLoading] = useState(true);
	// console.log("user in app from context is " + user.user.email);
	// console.log("token in app from context is " + user.token);
	// console.log("isLoggedIn is " + user.isLoggedIn);

	useEffect(() => {
		try {
			if (!user.isLoggedIn) {
				setIsLoading(false);
			}
		} catch (error) {
			console.log("there is no user in app component", error);
		}
	}, [user]);

	// user.isLoggedIn ? <Home /> : <Navigate replace to = {"/login"} />
	return (
		<div>
			{/* {isLoading ? <div>Loading...</div> : */}
			<Router>
				<Routes>
					<Route exact path="/login" element={
							// isLoading ? <Navigate replace to = {"/"} /> :
							<Login />
						}/>
					<Route path="/" element={
							// isLoading ? <Navigate replace to = {"/login"} /> :
							<Home />
						}/>
				</Routes>
			</Router>
			{/* } */}
		</div>
	);
}

export default App;
