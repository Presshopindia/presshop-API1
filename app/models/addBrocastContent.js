const mongoose = require("mongoose");
const BroadCastContentSchema = new mongoose.Schema(
  {
    hopper_id: {
      type: mongoose.Types.ObjectId,
    },
    task_id: {
      type: mongoose.Types.ObjectId,
    },
    content: [
      {
        media: {
          type: String,
          required: true,
        },
        media_type: {
          type: String,
          enum: ["image", "video", "audio"],
          default: "image",
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("BroadCastContent", BroadCastContentSchema);
