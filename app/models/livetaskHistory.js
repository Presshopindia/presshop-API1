const mongoose = require("mongoose");

const livetaskhistory = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    assign_more_hopper_history: [
      {type: mongoose.Types.ObjectId,
      ref: "User",}
      ],
    role: {
      type: String,
      enum: ["admin", "subAdmin"],
      default: "admin",
    },
    mode: {
      type: String,
      enum: ["call", "chat", "email"],
    },
    remarks: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("livetask", livetaskhistory);
