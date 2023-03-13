const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // required: true,
      max: 50,
      unique: true,
    },
    followers: {
      type: Array,
      default: [],
    },

    following: {
      type: Array,
      default: [],
    },
    lastPlayed:{
      type: Object,
      default: {name: "Not Checked", 
                albumArt: null,
                artist: "",
                id: null,
                timestamp: null, },
    },
    username: {
      type: String,
      default: null,
    },
    spotifyID: {
      type: String,
      default: null,
    },
    accountSetup:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);