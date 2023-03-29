import React from "react";

function LoginButton() {
	console.log("LoginButton is being rendered");

	return (
		<a href={import.meta.env.VITE_API_URL + "/login"}>
			<button type="button" className="loginButton bg-palette-100 cursor-pointer rounded-xl border p-3">
				<span className="loginButtonText font-['Montserrat'] text-2xl font-bold text-white">Login</span>
			</button>
		</a>
	);
}

export default LoginButton;
