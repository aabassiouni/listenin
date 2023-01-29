import React, { useState, useEffect } from "react";
import LikeButton from "../../LikeButton/LikeButton";
import Status from '../../Status/Status';
import FriendStatus from "../FriendStatus/FriendStatus.jsx";
import { useChatContext } from "stream-chat-react";
import axios from 'axios';
import "./FriendCard.css";


function FriendCard(props) {

  console.log("Card is being rendered");
  const user = props.user;

  const [friend, setFriend] = useState({});
  const {client, setActiveChannel} = useChatContext();

  console.log("friend being rendered is", friend);
  // console.log("client in friend status is", client);
  var propsUser = props.user;
  // console.log("propsUser is", props.user);

  // console.log("User in friend status component from context is", user);
  // Use state to store current song information
  const [song, setSong] = useState({name: "Not Checked", 
                                    albumArt: "http://localhost:8888/images/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png",
                                    artist: "" } ); 

  async function handleClick() {
    // console.log("friend status clicked");
    var userID = propsUser;
    // console.log("userID in friend status is", userID);
    await axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
      // console.log("res is", res.data);
      var userFromApi = res.data;
      setFriend(userFromApi);
      setSong({
            name: res.data.lastPlayed.name,
            albumArt: res.data.lastPlayed.albumArt,
            artist: res.data.lastPlayed.artist
          });
    });

    
    const filter = {members : { $in: ['test-user-2']}};
    const channels = await client.queryChannels(filter);
    console.log("channels are", channels);
    setActiveChannel(channels[0]);


    // const channel = client.channel('messaging', {members : [user.streamID, 'targetStreamID']});
    // channel.watch();
    };

  return (
    <div className="friend-card flex flex-row h-[74px] w-3/5">
    
      <div onClick={handleClick} className="flex w-full  bg-[#04471C] px-2 pt-2 pb-1 shadow-lg max-h-20 cursor-pointer gap-2 rounded-l-lg items-start">
          <img className="song-img block w-14 mx-auto h-14" src={song.albumArt} alt="test" />
          {/* <div className=""></div> */}
          <div className="text-container flex flex-col w-full justify-center items-center ">
                  <span className="username text-white text-sm font-['Gotham'] font-bold text-shadow max-w-full overflow-hidden text-ellipsis">{friend.email? friend.email +'' : "User not logged in"}</span>
                  <span className="song-title text-white text-sm font-['Gotham'] font-[450] max-h-7 self-start overflow-hidden text-ellipsis text-shadow ">{song.name}</span>
                  <span className="artist-name text-white text-sm font-['Gotham'] font-[400] self-start text-shadow ">{song.artist}</span>
          </div>
      </div>

      <div className ='like-button-container'>
        <LikeButton />
      </div>
    </div>
  );
}

export default FriendCard;