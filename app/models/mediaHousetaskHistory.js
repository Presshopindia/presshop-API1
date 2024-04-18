const mongoose = require("mongoose");

const MediaHouseTaskHistorySchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    latestAdminUpdated: {
      type:Date
    },
    
    mediahouse_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "MediaHouse",
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
module.exports = mongoose.model("mediaHousetaskHistory", MediaHouseTaskHistorySchema);
