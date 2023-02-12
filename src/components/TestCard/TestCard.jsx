import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";


export default function TestCard(props) {
    console.log("TestCard is being rendered");

    const spotifyApi = props.spotifyApi;
    const user = props.user;

    // Use state to store current song information
    const [song, setSong] = useState({
        name: "Not Checked",
        albumArt:
            "http://localhost:8888/images/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png",
        artist: "",
    });

    //
    async function handleClick() {
        console.log("clicked");

        spotifyApi
            .getMyCurrentPlaybackState()
            .catch((err) => {
                console.log("error is", err);
            })
            .then((response) => {
                if (!response) {
                    console.log("401 error");
                    console.log("fetching new access token");
                    console.log("refresh token is", user?.refresh_token);

                    axios
                        .get(
                            `http://localhost:8888/refresh_token/?refresh_token=${user?.refresh_token}`
                        )
                        .catch((err) => {
                            console.log("error fetching refresh token:", err);
                        })
                        .then((response) => {
                            // console.log("response is", response);
                            // var access_token = response.data.access_token;
                            // console.log("access token is", access_token);
                            spotifyApi.setAccessToken(
                                response.data.access_token
                            );
                            // localStorage.setItem('token', access_token);
                        });
                }

                console.log("response is", response);
                setSong({
                    name: response.item.name,
                    albumArt: response.item.album.images[0].url,
                    artist: response.item.artists[0].name,
                });
            });
    }
    return (
        <div onClick={handleClick} className="flex w-2/3 bg-[#04471C] px-4 py-4 shadow-lg max-h-[136px] cursor-pointer gap-2 rounded-[10px] items-start">
            <img className="song-img block mx-auto h-24" src={song.albumArt} alt="test" />
            <div className="text-container flex flex-col w-full justify-center items-center ">
                    <span className="username text-white text-lg font-['Gotham'] font-bold text-shadow max-w-full overflow-hidden text-ellipsis">{user? user?.streamID +'' : "User not logged in"}</span>
                    <span className="song-title text-white text-lg font-['Gotham'] font-[450] max-h-7 self-start overflow-hidden text-ellipsis text-shadow ">{song.name}</span>
                    <span className="artist-name text-white text-lg font-['Gotham'] font-[400] self-start text-shadow ">{song.artist}</span>
            </div>
        </div>
    );
}
