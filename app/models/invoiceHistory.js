const mongoose = require("mongoose");

const invoicepayHistorySchema = new mongoose.Schema(
  {

    user_id: {
      type: mongoose.Types.ObjectId,
      ref:"User",
      // default: "User",
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref:"Admin",
      // default: "User",
    },
    payment_id: {
      type: mongoose.Types.ObjectId,
      ref:"HopperPayment"
      // required: true,
      
    },
    mediahouse_id:{
      type: mongoose.Types.ObjectId,
      // ref:"Admin",
      // required: true,
      
    },
    send_reminder:{
      type:Boolean,
      default:false

    },
    send_statment:{
      type:Boolean,
      default:false

    },
    blockaccess:{
      type:Boolean,
      default:false

    },
    latestAdminRemark:String,
    mode:String,
    type:String
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("invoicepayHistory", invoicepayHistorySchema);
