const router = require('express').Router();
const User = require("../models/User");



router.get('/', function(req, res) {


    console.log("//////////////////////////////////////////////////////")
    console.log("User route called");
    const userID = req.query.userID;
    console.log("Fetching " + userID + " from database");
    
    console.log("userID in user route is", userID);    
        const user = User.findOne({ streamID: userID }, function(err, user) {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.json(user);
            }
        });

});

router.get(":userID/lastPlayed", async (req, res) => {
    console.log("lastPlayed route called");
    console.log("Fetching" + req.params.userID + "'s LastPlayed from database");
    try {
        const user = await User.findOne({ userID: req.params.userID });
        const lastPlayed = user.lastPlayed;
        res.status(200).json(lastPlayed);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:userId/following", async (req, res) => {
    console.log("following route called");
    console.log("Fetching" + req.params.userId + "'s following from database");
    try {
      const user = await User.findOne({ userID: req.params.userId });

      console.log("user is", user);
      var following = user.following;
      console.log("following is", following);

      const friends = await Promise.all(
        following.map((friend) => {
            console.log("friend is", friend);
            return friend
        })
      );
      
      let friendList = [];
      friends.map((friend) => {
        friendList.push(friend);
      });
      res.status(200).json(friendList)
    } catch (err) {
        console.log("error in followers route", err);
      res.status(500).json(err);
    }
});

router.put("/:userID/follow", async (req, res) => {
    console.log("follow route called");
    console.log(req.body.target_id + " is following " + req.params.userID)


    if (req.body.target_id !== req.params.userID) {
        try {
          console.log("in try block");
          const user = await User.findOne({streamID: req.params.userID});
          const currentUser = await await User.findOne({streamID: req.body.target_id});

          if (!user.followers.includes(req.body.userID)) {
            await user.updateOne({ $push: { followers: req.body.target_id } });
            await currentUser.updateOne({ $push: { following: req.params.userID } });
            
            
            // const serverClient = StreamChat.getInstance('vvucrr6yge97','ngcj3ryargkfkutegjb37aspm27qpbxyppkt8zyssthryy6q7ueewbsxcmazudca');
            // console.log("server client created");
            // const channel = serverClient.channel('messaging',{ members: [req.body.target_id, req.params.userID] });
            // console.log(channel);
            // console.log("channel created");
            // await channel.create();
            
            // console.log("channel created");

            res.status(200).json("user has been followed");
          } else {
            res.status(403).json("you already follow this user");
          }
        } catch (err) {
          res.status(500)
        }
      } else {
        res.status(403).json("you cant follow yourself");
      }
    });


module.exports = router;