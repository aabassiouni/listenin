import React from "react";
import { useUser } from "../../context/userContext";
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
		<button type="button" onClick={handleClick} className="logoutButton btn-ghost rounded-xl bg-[#16DB65] p-3 shadow-neomorphism ">
			<span className="logoutButtonText text-center font-['Gotham'] text-xl font-bold text-white text-shadow">Logout</span>
		</button>
	);
}

export default LogoutButton;
