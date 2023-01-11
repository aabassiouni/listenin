import SpotifyWebApi from "spotify-web-api-js";
import React, { useState, useEffect, useContext } from "react";
// import { token } from "../../spotify/spotify";
import "./Status.css";
import Marquee from "react-fast-marquee";
import LikeButton from "../LikeButton/LikeButton";
import { UserContext } from "../../context/userContext";
// import "./App.css";


// spotifyApi.setAccessToken(token);

function Status(props) {


  console.log("Status is being rendered")

  const {user} = useContext(UserContext);
  
  console.log("User in status component from context is", user);
  //   useEffect(() => {
  //     if (!user) {
  //     // Do something while waiting for the user to be set in context
  //     return <div>Loading...</div>;
  //     }
  // }, [user]);
  // console.log("User in status component from context is", user.user.email);

  // var access_token = localStorage.getItem('token');
  console.log("access_token", user.token);
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(user.token);



  // Use state to store current song information
  const [song, setSong] = useState({name: "Not Checked", 
                                    albumArt: "http://localhost:8888/images/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png",
                                    artist: "" } );

                        
  function handleClick() {
    console.log("clicked");
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      console.log("response is", response);
      setSong({
            name: response.item.name,
            albumArt: response.item.album.images[0].url,
            artist: response.item.artists[0].name
      });
      
    })
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
    <div className = "status-wrapper" onClick={handleClick}>
        
        <div className = "status-song-image-wrapper">
            <img className = "status-song-image" src={song.albumArt} alt=""/>
        </div>
        <div className = "status-song-text-wrapper">
            <p className = "status-song-text">Ali Bassiouni</p>
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
            {/* <Marquee gradient={false} speed={30} className='marq'>{song.nowPlaying.name} - {song.nowPlaying.artist}</Marquee> */}
            {/* <Marquee > {song.nowPlaying.name} - {song.nowPlaying.artist}</Marquee> */}
            {/* <marquee behavior="scroll" >{song.nowPlaying.name} - {song.nowPlaying.artist} </marquee> */}
        </div>

        
    {/* </div> */}
    {/* <h1>{song.nowPlaying.name.length}</h1> */}
    {/* <Marquee gradient={false} speed={30}>{song.nowPlaying.name} - {song.nowPlaying.artist}</Marquee> */}
  </div>
  //   <div>
  //     <img src={song.nowPlaying.albumArt} style={{ height: 150 }}/>
  //   </div>
  // </div>
);
}

export default Status;
