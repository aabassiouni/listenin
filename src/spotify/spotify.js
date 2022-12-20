import { getHashParams } from "../util/util";
import SpotifyWebApi from "spotify-web-api-js";
import React, { useState, useEffect } from "react";



export const spotifyApi = new SpotifyWebApi();


const params = getHashParams();
console.log(params);
export const token = params.access_token;
if (token) {
    spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token); 
}

