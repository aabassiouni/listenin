import React, { useState, useEffect, useContext } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react'
import { useStreamClient } from '../../hooks/UseStreamClient.js'
import { UserContext } from '../../context/userContext';

import 'stream-chat-react/dist/css/v2/index.css';
// import { useStreamClient } from 'C:\\Users\\Ali Bassiouni\\Documents\\PROJECTS\\listenin\\src\\hooks\\UseStreamClient.js';

// import './Messenger.css';

// const chatClient = new StreamChat('vvucrr6yge97');

// chatClient.connectUser(
//     {
//       id: 'test-user-1',
//       name: 'Ali Bassiouni',
//       image: 'https://getstream.io/random_png/?id=solitary-wood-9&name=solitary-wood-9',
//     },
//     chatClient.devToken('test-user-1'),
//   );

// const channel = chatClient.channel('messaging', 'custom_channel_id', {
//         // add as many custom fields as you'd like
//         image: 'https://www.drupal.org/files/project-images/react.png',
//         name: 'Talk about React',
//         members: ['test-user-1'],
// });

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
    // useEffect(() => {
    //     if (!user) {
    //     // Do something while waiting for the user to be set in context
    //     return <div>Loading...</div>;
    //     }
    // }, [user]);

    //????????????????????????????????
    const activeuser = user.user;


    try{
        console.log("user in the messenger component is", user);
        // console.log("active user in the messenger component is", activeuser);
        // console.log("stream id in the messenger component is", activeuser.streamID);
        
    } catch (error) {
        console.log("error in the messenger component is", error);
    }
    // // // console.log("user in the messenger component is", user);
    
    // console.log("userObj in the messenger component is", userObj);
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
    
    // console.log("userObj in the messenger component is", userObj);
    const chatClient = useStreamClient({ apiKey: 'vvucrr6yge97', userData: userObj, tokenOrProvider: '' });

    // const chatClient = null;
    if (!chatClient) {
        return <div>Loading...</div>;
    }
    return (
        <Chat client={chatClient} theme='str-chat__theme-dark'>
            <ChannelList />
            <Channel >
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput />
                </Window>
            <Thread />
            </Channel>
        </Chat>
    );
}







export default Messenger;