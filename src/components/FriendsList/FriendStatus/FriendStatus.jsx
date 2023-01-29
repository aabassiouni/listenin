import SpotifyWebApi from "spotify-web-api-js";
import React, { useState, useEffect, useContext } from "react";
// import { token } from "../../spotify/spotify";
import "./FriendStatus.css";
import Marquee from "react-fast-marquee";
import LikeButton from "../../LikeButton/LikeButton";
import { UserContext } from "../../../context/userContext";
import axios from 'axios';
import { useChatContext } from "stream-chat-react";
// import "./App.css";


function FriendStatus(props) {


  console.log("Friend Status is being rendered")

  const {user} = useContext(UserContext);

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
    // var targetStreamID = res.data.streamID;
    console.log("user is", user);
    console.log("streamID is", user.user.streamID);

    const filter = {members : { $in: ['test-user-2']}};
    const channels = await client.queryChannels(filter);
    console.log("channels are", channels);
    setActiveChannel(channels[0]);


    // const channel = client.channel('messaging', {members : [user.streamID, 'targetStreamID']});
    // channel.watch();
    };

  async function handleChannel(){

    const filter = { type: 'messaging', members: { members : [user.streamID, friend.streamID]} };

    const channel = client.queryChannels('messaging', {members : [user.streamID, friend.streamID]});
    setActiveChannel(channel);



  }
  
  
  
  
  /*  
  
  this code updates the song every 5 seconds automatically using polling

  // Use useEffect to call the Spotify API when the component is first rendered
  useEffect(() => {
    // Call the Spotify API to get the current song
    const interval = setInterval(() => {
      console.log("useEffect called")
      if (token){
        console.log("token exists and gong to fetch")
        spotifyApi.getMyCurrentPlaybackState().then((response) => {
          setSong({
                name: response.item.name, 
                albumArt: response.item.album.images[0].url,
                artist: response.item.artists[0].name
          });
        })}
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  */

  return(
     <div className = "friendstatus-wrapper flex items-center text-left cursor-pointer w-full h-[100px] bg-gradient-r rounded-l-xl" onClick={handleClick}>
        <div className = "friendstatus-song-image-wrapper">
            <img className = "friendstatus-song-image px-3 max-h-[70px]" src={song.albumArt} alt=""/>
        </div>
        <div className = "friendstatus-song-text-wrapper flex flex-col text-white text-base font-['Gotham']">
            <span className = "friendstatus-song-text ">{friend.email}</span>
            <span className="">{song.name}</span>            
            <span className="">{song.artist}</span>           
        </div>
      </div>
    // <div onClick={handleClick} className="friend-status flex w-[80%] bg-green-600 p-[10px] max-h-full cursor-pointer gap-2 rounded-[10px] items-start">
    //   <div className="testImg w-full max-w-[100px]">
    //       <img src={song.albumArt} alt="test" />
    //   </div>
    //   <div className="text-container space space-y-1 w-full justify-center items-center flex flex-col">
    //       <div className="username text-2xl font-bold text-shadow font-['Gotham'] text-white">
    //           <span>{friend.email}</span>
    //       </div>
    //       <div className="song-title text-white self-start font-[450] text-shadow text-xl font-['Gotham']">
    //           <span>{song.name}</span>
    //       </div>
    //       <div className="artist-name text-white self-start font-[400] text-shadow text-xl font-['Gotham']">
    //           {song.artist}
    //       </div>
    //   </div>
    // </div>
);
}

export default FriendStatus;
