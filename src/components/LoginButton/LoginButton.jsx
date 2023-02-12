import React from "react";

function LoginButton() {
	console.log("LoginButton is being rendered");

	return (
		<a href="http://localhost:8888/login">
			<button type="button" className="loginButton cursor-pointer rounded border bg-[#16DB65] p-3">
				<span className="loginButtonText font-gotham text-2xl font-bold text-white">Login</span>
			</button>
		</a>
	);
}

export default LoginButton;
