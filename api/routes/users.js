const router = require("express").Router();
const User = require("../models/User");

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
		console.log("user is", user);
	}
	if (!user) {
		console.log("user is null");
	}
});
router.put("/:spotifyID/setup", async (req, res) => {
	console.log("//////////////// Setup route called //////////////////////");
	console.log("Updating " + req.params.spotifyID + "'s accountSetup in database");

	try {
		const spotifyID = req.params.spotifyID;
		const  username  = req.query.username;
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

router.get(":userID/lastPlayed", async (req, res) => {
	console.log("//////////////// lastPlayed route called //////////////////////");
	console.log("Fetching" + req.params.userID + "'s LastPlayed from database");
	try {
		const user = await User.findOne({ userID: req.params.userID });
		const lastPlayed = user.lastPlayed;
		res.status(200).json(lastPlayed);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:userID/following", async (req, res) => {
	console.log("//////////////// following route called //////////////////////");
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

router.put("/:userID/follow", async (req, res) => {
	console.log("//////////////// follow route called //////////////////////");
	const userID = req.params.userID;
	const targetID = req.query.target_id;

	console.log(userID + " is following " + targetID);

	if (targetID !== userID) {
		try {
			console.log("in try block");
			const currentUser = await User.findOne({ spotifyID: userID });
			const targetUser = await await User.findOne({ spotifyID: targetID });

			if (!targetUser.followers.includes(currentUser)) {
				await targetUser.updateOne({ $push: { followers: userID } });
				await currentUser.updateOne({ $push: { following: targetID} });

				res.status(200).json("Follow successful");
			} else {
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
