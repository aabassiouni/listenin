import React from "react";
import { useUser } from "./context/userContext";
import Login from "./pages/Login";
import Home from "./pages/Home.jsx";
import Setup from "./pages/Setup.jsx";
import LoadingPage from "./components/LoadingPage";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate
} from "react-router-dom";

function RequireAuth({ children }) {
	const {token, isLoggedIn, isLoading} = useUser();

	console.log("token in require auth is", token);
	console.log("isLoggedIn in require auth is", isLoggedIn);
	console.log("isLoading in require auth is", isLoading);

	if (isLoading) {
		return <LoadingPage />;
	}

	return isLoggedIn  ? children : <Navigate replace to = {"/login"} />;
}

function App() {
	console.log("App.js is being rendered");

	const {token, isLoggedIn} = useUser();

	console.log("token in app is " + token);

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={
								<RequireAuth >
									<Navigate replace to = {"/home"} />
								</RequireAuth>
						} />
					<Route exact path="/login" element={
							<Login /> 
						}/>
					<Route exact path= "/setup" element={
							<RequireAuth>
								<Setup />
							</RequireAuth>
						}/>
					<Route path="/home" element={
							<RequireAuth>
								<Home />
							</RequireAuth>
						}/>
				</Routes>
			</Router>
			{/* } */}
		</div>
	);
}

export default App;
