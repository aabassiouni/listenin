import React, { useState, useEffect, useContext } from 'react'

import Card from '../components/Card/Card';
import Messenger from '../components/Messenger/Messenger';
import { ChannelList, useChatContext } from 'stream-chat-react';
import './home.css';
import { useStreamClient } from '../hooks/UseStreamClient';
import { UserContextProvider } from '../context/userContext';
import {UserContext} from '../context/userContext';
import LogoutButton from '../components/LogoutButton/LogoutButton';
import { getHashParams } from '../util/util.js';
import axios from 'axios';




function Home() {


    console.log("Home is being rendered");

    console.log("fetching user value from context");
    const {user, dispatch} = useContext(UserContext);
    console.log("user value in home component from context is", user);


    const [isLoading, setIsLoading] = useState(true);

    // if(user){
    //     setIsLoading(false);
    // };
    
    // var client = useStreamClient()

    // const {client , setActiveChannel} = useChatContext();

    // console.log(client);
    // const params = getHashParams();
    // const token = params.access_token;
    // const userID = params.userID;


    // check if there is a user before rendering the page
    useEffect(() => { 
        if(user){
            setIsLoading(false);
        };
    }, [user])

    return (
            
            <div className = "messenger">
                {isLoading ? <div>Loading...</div> :
                    <>
                    <div className = "chat-menu">
                        <div className = "chat-menu-wrapper">
                            < LogoutButton className= "logout-button" />
                            <Card className = "card"/>
                            <Card />
                            <Card />
                            {/* <ChannelList /> */}
                        </div>
                    </div>
                    <div className = "chat-box">
                        <div className = "chat-box-wrapper">
                        <Messenger />
                        </div>
                    </div>
                    <div className = "chat-online">
                        <div className = "chat-online-wrapper">
                        
                        </div>
                    </div>
                    </>
                }
            </div>
        
    )
}

export default Home;