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
      default: {song_id: "", 
                timestamp: null, },
    },
    username: {
      type: String,
    },
    spotifyID: {
      type: String,
      unique: true,
      required: true,
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