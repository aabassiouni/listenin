import React, { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';

export const useStreamClient = ({ apiKey, userData, tokenOrProvider }) => {
  
    const [chatClient, setChatClient] = useState(null);
    
    
    console.log("useStreamClient");

    useEffect(() => {
      const client = new StreamChat(apiKey);

      tokenOrProvider = client.devToken(userData.id);
      // prevents application from setting stale client (user changed, for example)
      let didUserConnectInterrupt = false;
  
      const connectionPromise = client.connectUser(userData, tokenOrProvider).then(() => {
        if (!didUserConnectInterrupt) setChatClient(client);
      });
  
      return () => {
        didUserConnectInterrupt = true;
        setChatClient(null);
        // wait for connection to finish before initiating closing sequence
        connectionPromise
          .then(() => client.disconnectUser())
          .then(() => {
            console.log('connection closed');
          });
      };
    }, [apiKey, userData.streamID, tokenOrProvider]);
  
    return chatClient;
  };