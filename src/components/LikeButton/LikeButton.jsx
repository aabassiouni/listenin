import React, { useState } from "react";

function LikeButton() {
	console.log("LikeButton is being rendered");
	const [liked, setLiked] = useState(false);

	const likeIcon = "http://localhost:8888/images/heart.svg";

	return (
		<div className="like-button flex h-full w-[40px] cursor-pointer items-center justify-center rounded-r-lg bg-[#0D2818] hover:bg-[#961a1a] active:bg-[#e93131]">
			<img className="like-button-img max-h-[26px] max-w-[26px] " src={likeIcon} alt="" />
		</div>
	);
}

export default LikeButton;
