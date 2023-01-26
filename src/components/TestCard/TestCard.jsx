import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";

import "./TestCard.css";

export default function TestCard() {
    console.log("Status is being rendered");

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    // console.log("User in status component from context is", user);
    //   useEffect(() => {
    //     if (!user) {
    //     // Do something while waiting for the user to be set in context
    //     return <div>Loading...</div>;
    //     }
    // }, [user]);
    // console.log("User in status component from context is", user.user.email);

    // var access_token = localStorage.getItem('token');
    // console.log("access_token", user?.access_token);
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(user?.access_token);

    // Use state to store current song information
    const [song, setSong] = useState({
        name: "Not Checked",
        albumArt:
            "http://localhost:8888/images/acf3edeb055e7b77114f9e393d1edeeda37e50c9.png",
        artist: "",
    });

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
        <div
            onClick={handleClick}
            className="flex w-[260px] bg-gradient-r h-[95px] p-[10px] max-h-full gap-2 rounded-[10px] items-start"
        >
            <div className="testImg w-[70px]">
                <img src={song.albumArt} alt="test" />
            </div>
            <div className="frame2 flex flex-col">
                <div className="aliBassiouni">Ali Bassiouni</div>
                <div className="songTitle text-sm">{song.name}</div>
                <div className="artist text-sm">{song.artist}</div>
            </div>
        </div>
    );
}
