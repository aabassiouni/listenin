import React, { useEffect, useRef, useState }  from 'react'
import { ChannelHeader, useChatContext, useChannelStateContext } from 'stream-chat-react'
import { TypingIndicator } from '../TypingIndicator/TypingIndicator'

import './CustomChannelHeader.css'

export default function CustomChannelHeader(props) {

    console.log("CustomChannelHeader is being rendered");

    const { client } = useChatContext();
    const { channel } = useChannelStateContext();
    const [title, setTitle] = useState('');

    const { name } = channel.data || {};
    console.log("props is", props);
    console.log("channel is", channel);
    console.log("title is", title);
    console.log("name is", name);

    const members = Object.values(channel.state?.members || {}).filter(
        (member) => member.user?.id !== client.user?.id,
      );
    console.log("members are", members);

    useEffect(() => {

        setTitle(members[0].user.name);
        console.log("title is", title);
    }, [members]);
    


    return (
        <>
            <div className='flex h-12 rounded-t-lg justify-center bg-[#5B8266] min-h-12'>
            
                <div className='header-title font-[1100] text-slate-50 '>
                    {title}
                </div>
                <div>
                    <TypingIndicator />
                </div>
            </div>
        </>
    )
}
