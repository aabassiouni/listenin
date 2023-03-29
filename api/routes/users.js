const router = require("express").Router();
const User = require("../models/User");
const { getAuth } = require("firebase-admin/auth");

router.get("/:userID", function (req, res) {
	console.log("//////////////// User route called //////////////////////");
	const userID = req.params.userID;
	console.log("Fetching " + userID + " from database");

	console.log("userID in user route is", userID);
	const user = User.findOne({ spotifyID: userID }, function (err, user) {
		if (err) {
			res.status(500).json({ error: err });
		} else {
			res.json(user);
		}
	});
	if (user) {
		// console.log("user is", user);
	}
	if (!user) {
		console.log("user is null");
	}
});

router.get("/:spotifyID/firebase_token", async function (req, res) {
	console.log("/////////////////////////////firebase route called/////////////////////////////");

	const spotifyID = req.params.spotifyID;
	let firebase_token = await getAuth().createCustomToken(spotifyID);
	console.log("firebase_token is:", firebase_token);

	res.status(200).json(firebase_token);
});

router.put("/:spotifyID/setup", async (req, res) => {
	console.log("//////////////// Setup route called //////////////////////");
	console.log("Updating " + req.params.spotifyID + "'s accountSetup in database");

	try {
		const spotifyID = req.params.spotifyID;
		const username = req.query.username;
		// console.log("req.body is", req.body.username)
		console.log("spotifyID is", spotifyID);
		console.log("username is", username);

		// Update the document in MongoDB using Mongoose
		const updatedDocument = await User.findOneAndUpdate(
			{ spotifyID: spotifyID },
			{
				$set: {
					accountSetup: true,
					username: username,
				},
			},
			{ new: true }
		);

		res.status(200).json({ updatedDocument });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
});

router.get("/lastPlayed", async (req, res) => {
	console.log("//////////////// lastPlayed route called //////////////////////");
	console.log("Fetching" + req.query.spotifyID + "'s LastPlayed from database");
	const spotifyID = req.query.spotifyID;

	try {
		const user = await User.findOne({ spotifyID: spotifyID });
		const lastPlayed = user.lastPlayed;
		res.status(200).json(lastPlayed);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:userID/following", async (req, res) => {
	console.log("//////////////// following route called //////////////////////");
	console.log("*********************** Deprecated ************************")
	console.log("Fetching " + req.params.userID + "'s following from database");

	try {
		const user = await User.findOne({ spotifyID: req.params.userID });

		console.log("user is", user);
		var following = user?.following;
		console.log("following is", following);

		const friends = await Promise.all(
			following.map((friend) => {
				console.log("friend is", friend);
				return friend;
			})
		);

		let friendList = [];
		friends.map((friend) => {
			friendList.push(friend);
		});
		res.status(200).json(friendList);
		// res.status(200).json([]);
	} catch (err) {
		console.log("error in followers route", err);
		res.status(500).json(err);
	}
});

// handle friend requests
router.put("/:userID/sendFriendRequest", async (req, res) => {
	console.log("//////////////// friendRequest route called //////////////////////");
	const userID = req.params.userID;
	const targetID = req.query.target_id;

	console.log(req.query)

	console.log(userID + " is sending a friend request to " + targetID);

	if (targetID !== userID) {
		try {
			console.log("in try block");
			
			//find the users
			const currentUser = await User.findOne({ spotifyID: userID });
			const targetUser = await User.findOne({ spotifyID: targetID });

			//check if users exist
			if (!currentUser || !targetUser) {
				console.log("user not found");
				res.status(200).json({ message: "user not found" });
				return;
			}
			
			//check if friend request has already been sent
			const alreadySentAtTarget = targetUser?.friendRequests.some((obj) => {
				return obj.user == userID && obj.direction == "incoming";
			});

			//check if friend request has already been sent
			const alreadySentAtSender = currentUser?.friendRequests.some((obj) => {
				return obj.user == targetID && obj.direction == "outgoing";
			});

			//if friend request has already been sent, return
			if (alreadySentAtTarget && alreadySentAtSender) {
				console.log("already sent");
				res.status(200).json({ message: "already sent" });
				return;
			}

			//if friend request has not been sent, send it
			if (!alreadySentAtTarget) {
				targetUser?.friendRequests.push({ direction: "incoming", user: userID });
				await targetUser.save();
			}

			//if friend request has not been sent, send it
			if (!alreadySentAtSender) {
				currentUser?.friendRequests.push({ direction: "outgoing", user: targetID });
				await currentUser.save();
			}

			res.status(200).json({ user: currentUser });
		} catch (err) {
			console.log("error in friendRequest route", err);
			res.status(500).json(err);
		}
	}
});

// accept friend requests
router.put("/:userID/acceptFriendRequest", async (req, res) => {
	console.log("//////////////// acceptfriendRequest route called //////////////////////");
	const userID = req.params.userID;
	const targetID = req.query.target_id;

	console.log(userID + " is accepting a friend request from " + targetID);

	if (targetID !== userID) {
		try {
			console.log("in try block");

			const currentUser = await User.findOne({ spotifyID: userID });
			const targetUser = await User.findOne({ spotifyID: targetID });

			if (
				currentUser.friendRequests.some((obj) => {
					return obj.user == targetID && obj.direction == "incoming";
				})
			) {
				console.log("removing friend request from currentUser");
				currentUser.friendRequests.pull({ direction: "incoming", user: targetID });
				currentUser.friends.push(targetID);
				await currentUser.save();
			}

			if (
				targetUser.friendRequests.some((obj) => {
					return obj.user == userID && obj.direction == "outgoing";
				})
			) {
				console.log("removing friend request from targetUser");

				targetUser.friendRequests.pull({ direction: "outgoing", user: userID });
				targetUser.friends.push(userID);
				await targetUser.save();
			}

			res.status(200).json({ user: currentUser });
		} catch (err) {
			console.log("error in acceptfriendRequest route", err);
			res.status(500).json(err);
		}
	}
});


router.put("/:userID/follow", async (req, res) => {
	console.log("//////////////// follow route called //////////////////////");
	console.log("*********************** Deprecated ************************")
	const userID = req.params.userID;
	const targetID = req.query.target_id;

	console.log(userID + " is following " + targetID);

	if (targetID !== userID) {
		try {
			console.log("in try block");
			const currentUser = await User.findOne({ spotifyID: userID });
			const targetUser = await await User.findOne({ spotifyID: targetID });
			console.log("currentUser is", currentUser);
			console.log("targetUser is", targetUser);
			console.log(!targetUser.followers.includes(currentUser));

			if (!targetUser.followers.includes(currentUser.spotifyID)) {
				await targetUser.updateOne({ $push: { followers: userID } });
				await currentUser.updateOne({ $push: { following: targetID } });

				console.log("Follow successful");
				res.status(200).json("Follow successful");
			} else {
				console.log("you already follow this user");
				res.status(403).json("you already follow this user");
			}
		} catch (err) {
			res.status(500);
		}
	} else {
		res.status(403).json("you cant follow yourself");
	}
});

module.exports = router;
