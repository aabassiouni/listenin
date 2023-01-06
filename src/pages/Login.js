
import React from 'react'
import LoginButton from '../components/LoginButton/LoginButton';





function Login() {

    console.log("Login is being rendered");

    
    return (
        <div className='loginContainer'>
            <div className='loginWrapper'>
                <h1 className='loginHeader'>Login using Spotify</h1>
                <LoginButton />
            </div>
        </div>
    );
}

export default Login;