const router = require("express").Router();
const User = require("../models/User");

router.get("/deleteFriendsInfo", async (req, res) => {
	console.log("//////////////// adminDeleteFriendsInfo route called //////////////////////");
	try {
		const users = await User.find({});
		console.log("there are ", users.length, " users");
		users.forEach(async (user) => {
            console.log("deleting friends info for user ", user.spotifyID);
			user.friends = [];
			user.incomingFriendRequests = [];
			user.outgoingFriendRequests = [];
			await user.save();
            console.log("Deleted", user.spotifyID, "friends info");
		});
        console.log("done deleting friends info for all users")
		res.status(200).json("success");
	} catch (err) {
		console.log("error in adminDeleteFriendsInfo route", err);
		res.status(500).json(err);
	}
});

module.exports = router;