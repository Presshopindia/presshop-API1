const mongoose = require("mongoose");

const PublishedContentSummerySchema = new mongoose.Schema(
  {
    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content",
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    heading: String,
    description: String,
    Asking_price:String,
    Sale_price:String,
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
module.exports = mongoose.model("PublishedContentSummery", PublishedContentSummerySchema);
