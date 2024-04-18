const mongoose = require("mongoose");

const HopperMgmtHistorySchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    hopper_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Hopper",
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
    latestAdminUpdated:{
      type:Date
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("HopperMgmtHistory", HopperMgmtHistorySchema);
