const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // username: {
    //   type: String,
    //   require: true,
    //   min: 3,
    //   max: 20,
    //   unique: true,
    // },
    email: {
      type: String,
      required: true,
      max: 50,
      // unique: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);