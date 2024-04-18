const mongoose = require("mongoose");

const PublishedContentHopperHistorySchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    mode: {
      type: String,
    },
    remarks: {
      type: String,
    },
    latestAdminUpdated: {
      type: Date
    },
    hopper_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    avatar: {
      type: String
    },
    published_qty: {
      type: Number
    },
    published_content_val: {
      type: Number
    },
    total_payment_earned:{
      type: Number
    },
    payment_pending:{
      type: Number
    },
    payment_due_date:{
      type: Date
    },
    presshop_commission:{
      type:Number
    }

  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("PublishedContentHopperHistory", PublishedContentHopperHistorySchema);
