import React, { useState, useEffect, useContext } from 'react'

import Card from '../components/Card/Card';
import Messenger from '../components/Messenger/Messenger';
import { Chat, ChannelList, useChatContext, ChatDown} from 'stream-chat-react';
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
import { StreamChat } from 'stream-chat';
import NavBar from '../components/NavBar/NavBar';





function Home() {



    const {user, dispatch} = useContext(UserContext);
    console.log("user value in home component from context is", user);

    var userObj = {};
    let didUserConnectInterrupt = false;

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
    const chatClient = new StreamChat('vvucrr6yge97');
    console.log("chatClient value in home component: ", chatClient);
    const stream_token = chatClient.devToken(userObj.id);
    console.log("stream_token value in home component: ", stream_token);
    
    async function connectUser() {

        await chatClient.connectUser(userObj, stream_token);
        console.log("user connected to chatClient");
        return;
    }
    connectUser();

    
    // const chatClient = useStreamClient({ apiKey: 'vvucrr6yge97', userData: userObj, tokenOrProvider: '' });
    // console.log("chatClient value in home component: ", chatClient);

    const [isLoading, setIsLoading] = useState(true);
    const [following, setFollowing] = useState([]);
    useEffect(() => {

        const getFollowing = async () => {
            
            try {
                var userID = user?.user.streamID;
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
        <>
            <NavBar />
            <div className = "messenger">
                {isLoading ? <ChatDown />:
                    
                    <Chat client = {chatClient} theme = "str-chat__theme-dark">
                        
                        <div className = "chat-menu-wrapper">
                            <div className = "chat-menu">
                                <LogoutButton className= "logout-button" />
                                <h1>{chatClient?.clientID}</h1>
                                <Card />
                                
                                <FriendsList following = {following}/>
                            </div>
                        </div>
                        <div className = "chat-box">
                            <div className = "chat-box-wrapper">
                                    <Messenger />
                            </div>
                        </div>
                    </Chat>
                    
                }
            </div>
        </>
    )
}

export default Home;