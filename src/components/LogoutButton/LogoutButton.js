import React from 'react';
import './LogoutButton.css';
import { UserContext } from '../../context/userContext';
import { Navigate } from 'react-router-dom';

function LogoutButton (){

    const {user, dispatch} = React.useContext(UserContext);
    console.log("user in login button is", user);
    console.log("LoginButton is being rendered");

  
    function handleClick(e) {
        // e.preventDefault();
        // console.log('The link was clicked.');
        dispatch({type: 'LOGOUT'});
        // return  <Navigate replace to = {"/login"} />
    }


    return (
        
        <button type="button" className='logoutButton' onClick={handleClick}>
            <span className = 'logoutButtonText'>Logout</span>
        </button>

    );
};



export default LogoutButton;
