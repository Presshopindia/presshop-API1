const mongoose = require("mongoose");
const validator = require("validator");

const RoomSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
    },
    sender_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    task_id:{
      type: mongoose.Types.ObjectId,
      // required: true,
      // ref: "Task",
    },
    content_id:{
      type: mongoose.Types.ObjectId,
      // required: true,
      // ref: "Task",
    },
    room_type:{
      type: String,
      enum: ["HoppertoAdmin", "MediahousetoAdmin","mediaHousetoEmployee"],
      // required: true,
      // ref: "Task",
    },
    type: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);



module.exports = mongoose.model("Room", RoomSchema);
