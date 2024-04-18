const mongoose = require("mongoose");

const BrodCastHistorySchema = new mongoose.Schema(
  {
    mediaHouse_id: {
      type: mongoose.Types.ObjectId,
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    broadCast_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Task",
    },
    role: {
      type: String,
      enum: ["admin", "subAdmin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
    },
    action: {
      type: String,
      enum: ["isTempBlocked", "isPermanentBlocked", "nothing"],
      default: "nothing",
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
module.exports = mongoose.model("BroadCastHistory", BrodCastHistorySchema);
