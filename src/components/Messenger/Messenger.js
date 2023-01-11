import React, { useState, useEffect, useContext } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList, ChannelHeader, MessageInput, MessageList, Thread, Window,useChatContext, InfiniteScroll } from 'stream-chat-react'
import { useStreamClient } from '../../hooks/UseStreamClient.js'
import { UserContext } from '../../context/userContext';
import { CustomPreview } from '../CustomPreview/CustomPreview.js';
import axios from 'axios';
import 'stream-chat-react/dist/css/v2/index.css';
// import { useStreamClient } from 'C:\\Users\\Ali Bassiouni\\Documents\\PROJECTS\\listenin\\src\\hooks\\UseStreamClient.js';

// import './Messenger.css';







var testuser = {
    id: 'test-user-1',
    name: 'Ali Bassiouni',
    image: 'https://getstream.io/random_png/?id=solitary-wood-9&name=solitary-wood-9',
}

function Messenger() {
    
    console.log("Messenger component is being rendered");

    //wait for user to be set in the context
    const {user, dispatch} = useContext(UserContext);
   
    
    console.log("user value in messenger component from context is", user);

    const activeuser = user.user;
    var userObj = {};


    try{
        userObj = {
            id: activeuser.streamID,
            name: activeuser.email,
            image: activeuser.profilePicture,
        };
    } catch (error) {
        console.log("error while trying to set userObj", error);
    }

    const chatClient = useStreamClient({ apiKey: 'vvucrr6yge97', userData: userObj, tokenOrProvider: '' });

    // const filters = { type: 'messaging', members: { $in: [userObj.id] } };

    const handleFollow = async () => {
        console.log("follow button clicked");
        try {
            var userID = user.user.streamID;
            const res = await axios.put(`http://localhost:8888/users/aabassiouni/follow`, {
                target_id: "test1"});

            const conversation = chatClient.channel('messaging', {
                members: ["test1-918aa4db-e8e3-4090-ab0d-64aba5a75b49", "aabassiouni"],
                });

            await conversation.watch();
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    if (!chatClient) {
            return <div>Loading: no chat client</div>;
        }
    
    return (
        <Chat client={chatClient} theme='str-chat__theme-dark'>       
            <button onClick = {handleFollow} className = "follow-button" >Follow</button>
            <ChannelList />
            <Channel>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
            <Thread />
            </Channel>
        </Chat>
    )  
}

export default Messenger;