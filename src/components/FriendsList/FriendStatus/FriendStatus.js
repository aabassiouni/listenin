import SpotifyWebApi from "spotify-web-api-js";
import React, { useState, useEffect, useContext } from "react";
// import { token } from "../../spotify/spotify";
import "./FriendStatus.css";
import Marquee from "react-fast-marquee";
import LikeButton from "../../LikeButton/LikeButton";
import { UserContext } from "../../../context/userContext";
import axios from 'axios';
// import "./App.css";


function FriendStatus(props) {


  console.log("Friend Status is being rendered")

  const {user} = useContext(UserContext);

  const [friend, setFriend] = useState({});

  var propsUser = props.user;
  console.log("propsUser is", props.user);

  console.log("User in friend status component from context is", user);
  // Use state to store current song information
  const [song, setSong] = useState({name: "Not Checked", 
                                    albumArt: "http://localhost:8888/images/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png",
                                    artist: "" } ); 

  function handleClick() {
    console.log("friend status clicked");
    var userID = propsUser;
    console.log("userID in friend status is", userID);
    axios.get(`http://localhost:8888/users/?userID=${userID}`).then((res) => {
      console.log("res is", res.data);
      var userFromApi = res.data;
      setFriend(userFromApi);
      setSong({
            name: res.data.lastPlayed.name,
            albumArt: res.data.lastPlayed.albumArt,
            artist: res.data.lastPlayed.artist
          });
  });
    
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
  // <div className="Status">
     <div className = "friendstatus-wrapper" onClick={handleClick}>
        
        <div class = "friendstatus-song-image-wrapper">
            <img className = "friendstatus-song-image" src={song.albumArt} alt=""/>
        </div>
        <div className = "friendstatus-song-text-wrapper">
            <p className = "friendstatus-song-text">{friend.email}</p>
            <br/>
            {
            song.name.length > 25 ?
             <Marquee delay = "2" gradient={false} speed={30} className='marq'>{song.name}</Marquee> 
             : <p>{song.name}</p>
             }
             {song.artist.length > 30 ?
             <Marquee gradient={false} speed={30} className='marq'>{song.artist}</Marquee>
             : <p>{song.artist}</p>
             }
        </div>

        

  </div>

);
}

export default FriendStatus;
