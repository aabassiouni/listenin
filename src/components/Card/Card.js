import React, { useState, useEffect } from "react";
import LikeButton from "../LikeButton/LikeButton";
import Status from '../Status/Status';
import "./Card.css";


function Card() {

  console.log("Card is being rendered");
  return (
    <div className="card">
      <Status />
      <div className = 'like-button-container'>
        <LikeButton />
      </div>
    </div>
  );
}

export default Card;