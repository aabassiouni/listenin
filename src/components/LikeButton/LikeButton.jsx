import React, { useState} from "react";
import "./LikeButton.css";



function LikeButton() {

  console.log("LikeButton is being rendered");
  const [liked, setLiked] = useState(false);

  const likeIcon = "http://localhost:8888/images/heart.svg";

  return (
    <div className ="like-button flex justify-center items-center h-full cursor-pointer bg-[#0D2818] hover:bg-[#961a1a] active:bg-[#e93131] rounded-r-lg w-[40px]">
      <img className ="like-button-img max-w-[26px] max-h-[26px] " src={likeIcon} alt= "" /> 
    </div>
  );
}

export default LikeButton;