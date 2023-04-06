import SpotifyLogo from "../assets/Spotify_Icon_RGB_Black.png";


function LoginButton() {
	console.log("LoginButton is being rendered");

	return (
		<a href={import.meta.env.VITE_API_URL + "/login"}>
			<button type="button" className=" flex justify-center items-center loginButton bg-palette-100 cursor-pointer rounded-xl border p-3">
				<img src={SpotifyLogo} alt=""  className="w-[21px] h-[21px] mr-1"/>
				<span className="loginButtonText font-['Montserrat'] text-lg font-semibold text-black">Login with Spotify</span>
			</button>
		</a>
	);
}

export default LoginButton;
