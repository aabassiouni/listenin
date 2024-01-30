const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      max: 50,
      unique: true,
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
    },
    friends: {
      type: Array,
      default: [],
    },
    incomingFriendRequests: {
      type: Array,
      default: [],
    },
    outgoingFriendRequests: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);