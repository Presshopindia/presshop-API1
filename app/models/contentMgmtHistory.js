const mongoose = require("mongoose");

const contentMgmtHistorySchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
   /*  content_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Content",
    }, */

    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content",
      // type:Object
    },
    firstLevelCheck: {
      nudity: {
        type: Boolean,
        default: false,
      },
      isAdult: {
        type: Boolean,
        default: false,
      },
      isGDPR: {
        type: Boolean,
        default: false,
      },
    },
    secondLevelCheck: {
      type: String,
    },
    call_time_date: {
      type: Date,
    },
    checkAndApprove: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // enum: ["admin", "subAdmin"],
      // default: "admin",
    },
    status: {
      type: String,
      enum: ["published", "pending", "rejected"],
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
    heading: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("ContentMgmtHistory", contentMgmtHistorySchema);
