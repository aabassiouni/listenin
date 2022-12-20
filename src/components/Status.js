import SpotifyWebApi from "spotify-web-api-js";
import React, { useState, useEffect } from "react";
import { token } from "../spotify/spotify";
import "./Status.css";
import Marquee from "react-fast-marquee";
// import "./App.css";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

function Status() {

  console.log("Status called")

  // Use state to store current song information
  const [song, setSong] = useState({name: "Not Checked", 
                                    albumArt: "http://localhost:8080/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png",
                                    artist: "" } );

                        
  function handleClick() {
    console.log("clicked");
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
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
    <div className = "wrapper" onClick={handleClick}> 
        <div class = "image">
            <img src={song.albumArt} alt=""/>
        </div>
        <div class = "song-text">
            <p class = "center">Ali Bassiouni</p>
            <br/>
            {/* <p >{song.nowPlaying.name}</p> */}
            {/* <p >{song.nowPlaying.artist}</p> */}
            {
            song.name.length > 30 ?
             <Marquee gradient={false} speed={30} className='marq'>{song.name}</Marquee> 
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

  //     <button onClick={() => this.getNowPlaying()}>
  //       Check Now Playing
  //     </button>
  // </div>
);
}

export default Status;
