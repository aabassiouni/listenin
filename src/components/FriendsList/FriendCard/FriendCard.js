import React, { useState, useEffect } from "react";
import LikeButton from "../../LikeButton/LikeButton";
import Status from '../../Status/Status';
import FriendStatus from "../FriendStatus/FriendStatus.js";
import "./FriendCard.css";


function FriendCard(props) {

  console.log("Card is being rendered");
  const user = props.user;

  return (
    <div className="friend-card">
      <FriendStatus user= {user}/>
      <div className = 'like-button-container'>
        <LikeButton />
      </div>
    </div>
  );
}

export default FriendCard;