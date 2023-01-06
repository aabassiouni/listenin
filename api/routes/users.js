const router = require('express').Router();
const User = require("../models/User");

router.get('/', function(req, res) {


    console.log("//////////////////////////////////////////////////////")
    console.log("User route called");
    const userID = req.query.userID;
    
    console.log("userID in user route is", userID);    
        const user = User.findOne({ userID: userID }, function(err, user) {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.json(user);
            }
        });


});
module.exports = router;