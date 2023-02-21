const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // required: true,
      max: 50,
      unique: true,
    },

    profilePicture: {
      type: String,
      default: "",
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
                artist: "" },
    },
    streamID: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);