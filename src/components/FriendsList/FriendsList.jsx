import React, { useState, useEffect, useContext } from 'react';
import { Divider, Chip } from '@mui/material';
import Card from '../Card/Card.jsx';
import FriendCard from './FriendCard/FriendCard.jsx';
import './FriendsList.css';


function FriendsList(props) {

    
    console.log("FriendsList is being rendered");

    const following = props.following;
    console.log("following in FriendsList is", following);
    return (
        <div className="friends-list flex flex-col w-full overflow-hidden">
            <div className='friends-list-card-container flex flex-col justify-center items-center w-[100%] p-4 space-y-2 '>
                {following.map((friend) => {
                    return <>
                    <FriendCard user={friend} />
                    <FriendCard user={friend} />
                    </>

                })}
                {/* <h1>test</h1>
                <h1>test</h1> */}
                {/* <h1>test</h1>
                <h1>test</h1> */}
            </div>
        </div>
    );
}

export default FriendsList;