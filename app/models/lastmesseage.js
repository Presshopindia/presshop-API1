const mongoose = require("mongoose");

const lastMesseage = new mongoose.Schema(
  {
    mediahouse_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    hopper_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },

      lastmessegeofhopper:String,
      lastmessegeofMediahouse:String
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("lastMesseage", lastMesseage);
