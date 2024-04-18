const mongoose = require("mongoose");
const AddedContentUsers = new mongoose.Schema(
  {
    content_id: {
      type: mongoose.Types.ObjectId,
      ref:"Content"
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
    },
    room_id: String
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("addContentUsers", AddedContentUsers);
