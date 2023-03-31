import React from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
	console.log("LogoutButton is being rendered");

	const { logout } = useUser();
	const navigate = useNavigate();

	function handleClick() {
		logout();
		navigate("/login");
	}

	return (
		<button type="button" onClick={handleClick} className="logoutButton rounded-lg bg-[#16DB65] p-2 sm:block sm:p-3">
			<span className="logoutButtonText text-center font-['Montserrat'] text-xl font-semibold text-white text-shadow">Logout</span>
		</button>
	);
}

export default LogoutButton;
