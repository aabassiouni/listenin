import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';

export const useStreamClient = ({ apiKey, userData, tokenOrProvider }) => {
  
    const [chatClient, setChatClient] = useState(null);
    
    

    console.log("useStreamClient is being run");
    console.log("userData in useStreamClient is", userData);

    if (userData === null) {
      return null;
    }
    
    useEffect(() => {
      const client = new StreamChat(apiKey);
      console.log("client is", client);
      tokenOrProvider = client.devToken(userData.id);
      // prevents application from setting stale client (user changed, for example)
      let didUserConnectInterrupt = false;
      
      const connectionPromise = 
        client.connectUser(userData, tokenOrProvider)
              .catch((err) => {
                console.log('error connecting user', err);
              })
              .then(() => {
                if (!didUserConnectInterrupt) {
                  setChatClient(client);
                  console.log('connection established');
                }
              });

      
      return () => {
        didUserConnectInterrupt = true;
        setChatClient(null);
        // wait for connection to finish before initiating closing sequence
        connectionPromise.then(() => {
          client
            .disconnectUser()
            .catch((err) => {
                console.log('error disconnecting user', err);
              })
            .then(() => {
              console.log('connection closed');
              });
        });
      };

    }, [apiKey, userData.streamID, tokenOrProvider]);
    
    return chatClient;
  };