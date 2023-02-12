
import React from 'react'
import LoginButton from '../components/LoginButton/LoginButton';


function Login() {

    console.log("Login is being rendered");
    
    
    return (
        <div className='loginContainer flex justify-center items-center h-screen bg-[#0D2818] flex-col'>
            <div className='loginWrapper flex flex-col bg-white w-3/4 p-5 sm:w-1/4 sm:p-5 min-w-fit justify-center items-center rounded-xl'>
                <p className="loginHeader font-bold font-['Gotham'] text-5xl text-black normal-case">ListenIn</p>
                <div className="Spacer h-5"></div>
                <h1>{import.meta.env.VITE_API_URL + "/login"}</h1>
                <LoginButton />
            </div>
        </div>
    );
}

export default Login;