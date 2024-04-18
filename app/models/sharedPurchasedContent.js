const mongoose = require("mongoose");
const validator = require("validator");

const sharedPurchasedContent = new mongoose.Schema(
  {
    hopper_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    media_house_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    paid_status:{
        type: Boolean,
        default: false
    }
    // product_id:String,
    // review:String,
    // rating:String,
    // sender_type:String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("sharedPurchasedContent", sharedPurchasedContent);
