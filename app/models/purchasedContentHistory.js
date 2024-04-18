const mongoose = require("mongoose");

const PurchasedContentHistorySchema = new mongoose.Schema(
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
    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content",
    },
    media_house_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    purchased_content_qty: {
      type: String,
    },
    purchased_content_value: {
      type: String,
    },
    total_payment_recieved: {
      type: String,
    },
    payment_receivable: {
      type: String,
    },
    total_presshop_commition:{
      type:String
    },
    total_amount_paid:{
      type:String
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("PurchasedContentHistory", PurchasedContentHistorySchema);
