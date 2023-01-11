import React, { useState, useEffect, useContext } from 'react'

import Card from '../components/Card/Card';
import Messenger from '../components/Messenger/Messenger';
import { Chat, ChannelList, useChatContext } from 'stream-chat-react';
import './home.css';
import { useStreamClient } from '../hooks/UseStreamClient';
import { UserContextProvider } from '../context/userContext';
import {UserContext} from '../context/userContext';
import LogoutButton from '../components/LogoutButton/LogoutButton';
import { getHashParams } from '../util/util.js';
import { Divider } from '@mui/material';
import axios from 'axios';
import FriendsList from '../components/FriendsList/FriendsList';
import { Button } from 'bootstrap';




function Home() {



    const {user, dispatch} = useContext(UserContext);
    console.log("user value in home component from context is", user);

    var userObj = {};

    if (user != null) {
        const activeuser = user.user;
        userObj = {
            id: activeuser.streamID,
            name: activeuser.email,
            image: activeuser.profilePicture,
        };
    } else {
        console.log("error while trying to set userObj");
    }

    // const chatClient = useStreamClient({ apiKey: 'vvucrr6yge97', userData: userObj, tokenOrProvider: '' });
    // console.log("chatClient value in home component: ", chatClient);
    const [isLoading, setIsLoading] = useState(true);
    const [following, setFollowing] = useState([]);
    useEffect(() => {
        const getFollowing = async () => {
            
            try {
                var userID = user.user.streamID;
                const res = await axios.get(`http://localhost:8888/users/${userID}/following`);
                setFollowing(res.data);
            } catch (err) {
                console.log("error fetching friends in home component");
                console.log(err);
            }
        }
        getFollowing();
    }, [user]);
    
    // check if there is a user before rendering the page
    useEffect(() => { 
        if(user){
            setIsLoading(false);
        };
    }, [user])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
            
            <div className = "messenger">
                {isLoading ? <div>Loading...</div> :
                    <>
                    <div className = "chat-menu-wrapper">
                        <div className = "chat-menu">
                            <LogoutButton className= "logout-button" />
                            <Card />
                            
                            <FriendsList following = {following}/>
                        </div>
                    </div>
                    <div className = "chat-box">
                        <div className = "chat-box-wrapper">
                                <Messenger />
                        </div>
                    </div>
                    {/* <div className = "chat-online">
                        <div className = "chat-online-wrapper">
                            <div>{JSON.stringify(following)}</div>
                        </div>
                    </div> */}
                    </>
                }
            </div>
        
    )
}

export default Home;