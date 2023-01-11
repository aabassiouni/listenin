



const router = require("express").Router();
const User = require("../models/User.js");


router.get("/", async (req, res) => {

    const newUser = new User({
        email: "a@b.com"
    })
    
    const user = await newUser.update();
    res.status(200).json(user);
    res.send("Hello from register.js");

});

module.exports = router;

