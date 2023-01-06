import React from 'react';
import './LoginButton.css';

function LoginButton (){


  console.log("LoginButton is being rendered");

  
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }


  return (
    <a href="http://localhost:8888/login">
      <button type="button" className='loginButton'>
        <span className = 'loginButtonText'>Login</span>
      </button>
    </a>
  );
};



export default LoginButton;
