const router = require("express").Router();
const User = require("../models/User");
const dotenv = require("dotenv");

const crypto = require("crypto");
const { getAuth } = require("firebase-admin/auth");

const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();



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


// handle friend requests
router.put("/:userID/sendFriendRequest", async (req, res) => {
	console.log("//////////////// friendRequest route called //////////////////////");
	const userID = req.params.userID;
	const targetID = req.query.target_id;

	console.log(req.query);

	console.log(userID + " is sending a friend request to " + targetID);

	if (targetID !== userID) {
		try {
			console.log("in try block");

			//find the users
			const currentUser = await User.findOne({ spotifyID: userID });
			// console.log("currentUser is", currentUser);
			const targetUser = await User.findOne({ spotifyID: targetID });
			// console.log("targetUser is", targetUser);

			//check if users exist
			if (!currentUser || !targetUser) {
				console.log("user not found");
				res.status(200).json({ message: "user not found" });
				return;
			}

			const friendExistsCurrent = currentUser.friends.some((obj) => {
				console.log("obj is", obj);
				return obj.user == targetID;
			});
			console.log("friendExistsCurrent is", friendExistsCurrent);

			const friendExistsTarget = targetUser.friends.some((obj) => {
				console.log("obj is", obj);
				return obj.user == userID;
			});
			console.log("friendExistsTarget is", friendExistsTarget);

			if (friendExistsCurrent && friendExistsTarget) {
				console.log("already friends");
				res.status(200).json({ message: "already friends" });
				return;
			}

			//check if friend request has already been sent
			const requestExistsAtTarget = targetUser?.outgoingFriendRequests.includes(userID) || targetUser?.incomingFriendRequests.includes(userID); 
			console.log("requestExistsAtTarget is", requestExistsAtTarget);

			const requestExistsAtSender = currentUser?.outgoingFriendRequests.includes(targetID) || currentUser?.incomingFriendRequests.includes(targetID);
			console.log("requestExistsAtSender is", requestExistsAtSender);


			//if friend request has already been sent, return
			if (requestExistsAtTarget && requestExistsAtSender) {
				console.log("already sent");
				res.status(200).json({ message: "already sent" });
				return;
			}

			//if friend request has not been sent, send it
			if (!requestExistsAtTarget && !requestExistsAtSender) {
				console.log("sending friend request");
				targetUser?.incomingFriendRequests.push(userID);
				currentUser?.outgoingFriendRequests.push(targetID);

				await targetUser.save();
				await currentUser.save();
				res.status(200).json({ user: currentUser });
				return;
			}

			return;
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

			const requestExistsCurrentUser = currentUser.incomingFriendRequests.includes(targetID);
			const requestExistsTargetUser = targetUser.outgoingFriendRequests.includes(userID);


			const friendExistsCurrent = currentUser.friends.some((obj) => {
				return obj.user == targetID;
			});

			const friendExistsTarget = targetUser.friends.some((obj) => {
				return obj.user == userID;
			});

			if (friendExistsCurrent){
				console.log("friend already exists at current");
				res.status(200).json({ message: "friend already exists at current" });
				return;
			}

			if(friendExistsTarget){
				console.log("friend already exists at target");
				res.status(200).json({ message: "friend already exists at target" });
				return;
			}
			if (requestExistsCurrentUser && requestExistsTargetUser && !friendExistsCurrent && !friendExistsTarget) {
				console.log("both requests exist");
				const conversationID = crypto.randomUUID();

				console.log("removing friend request from currentUser");
				currentUser.incomingFriendRequests.pull(targetID);
				if (currentUser.friends.indexOf(targetID) === -1) {
					const friendObj = {
						user: targetID,
						conversationID: conversationID,
					};
					currentUser.friends.push(friendObj);
				}

				await currentUser.save();
				
				console.log("removing friend request from targetUser");
				targetUser.outgoingFriendRequests.pull(userID);
				if (targetUser.friends.indexOf(userID) === -1) {
					const friendObj = {
						user: userID,
						conversationID: conversationID,
					};
					targetUser.friends.push(friendObj);
				}
				await targetUser.save();
				
				console.log("creating conversation");
				const messagesRef = db.collection("messages").doc(conversationID).set({
					participants: [userID, targetID],
					}); 
				console.log("conversation created successfully");

				//maybe only return friends???
				console.log("friend added successfully")
				res.status(200).json({ user: currentUser });
				return;
			}

		} catch (err) {
			console.log("error in acceptfriendRequest route", err);
			res.status(500).json(err);
		}
	}
});

module.exports = router;
