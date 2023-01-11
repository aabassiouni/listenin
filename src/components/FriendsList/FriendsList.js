import React, { useState, useEffect, useContext } from 'react';
import { Divider, Chip } from '@mui/material';
import Card from '../Card/Card.js';
import FriendCard from './FriendCard/FriendCard.js';
import './FriendsList.css';


function FriendsList(props) {

    
    console.log("FriendsList is being rendered");

    const following = props.following;
    console.log("following in FriendsList is", following);
    return (
        <div className="friends-list">
            <div className='friends-list-header'>
                <p className='title'>Friends List</p>
                <p className='title'>num friends: {following.length}</p>
            </div>
            <Divider />
            <div className='friends-list-card-container'>
                {following.map((friend) => {
                    return <FriendCard user={friend} />
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