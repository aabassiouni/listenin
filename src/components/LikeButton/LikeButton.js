import React, { useState} from "react";
import "./LikeButton.css";



function LikeButton() {
  console.log("LikeButton is being rendered");
  const [liked, setLiked] = useState(false);

//   useEffect(() => {
//     document.title = liked ? "You liked this." : "You didn't like this.";
//   });

  const likeIcon = "http://localhost:8888/images/like-heart-icon.png";
  return (
        <button className ="like-button" onClick={() => setLiked(!liked)}>
          {/* {liked ? "Unlike" : "Like"} */}
          <img className = "like-button-img" src={likeIcon} alt= "" />
        </button>
      
  );
}

export default LikeButton;