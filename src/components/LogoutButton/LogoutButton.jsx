import React from 'react';
import './LogoutButton.css';
import { UserContext } from '../../context/userContext';
import { Navigate } from 'react-router-dom';

function LogoutButton (){

    const {user, dispatch} = React.useContext(UserContext);
    // console.log("user in login button is", user);
    console.log("LoginButton is being rendered");

  
    function handleClick(e) {
        // e.preventDefault();
        // console.log('The link was clicked.');
        dispatch({type: 'LOGOUT'});
        // return  <Navigate replace to = {"/login"} />
    }


    return (
        
        <button type="button" className='logoutButton rounded-xl shadow-neomorphism bg-[#16DB65] btn-ghost p-3 ' onClick={handleClick}>
            <span className = "logoutButtonText font-bold font-['Gotham'] text-shadow text-white text-center text-xl">Logout</span>
        </button>

    );
};



export default LogoutButton;
