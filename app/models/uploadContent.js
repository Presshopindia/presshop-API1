const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const uploadContentSchema = new mongoose.Schema(
  {
    imageAndVideo: {
      type: String,
    //   required: true,
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    videothubnail: {
        type: String,
        default:null
        // required: true,
      },
    type: {
      type: String,
    //   required: true,
    },
    task_id: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
    },
    purchased_publication:{
      type:mongoose.Types.ObjectId,
      ref: "User",
      default:null
    },
    latestAdminUpdated: {
      type: Date
    },
    remarks: {
      type: String,
    //   required: true,
    },
    hopper_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      // default: "User",
    },

    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      // default: "User",
    },
    transaction_id:{
      type: mongoose.Types.ObjectId,
        ref: "HopperPayment",
    },
    paid_status: {
      type: Boolean,
      default:false
    //   required: true,
    },
    amount_paid:{
      type: String,
      default:0
    //   required: true,
    },
    mode:String,
    paid_status_to_hopper: {
      type: Boolean,
      default: false,
    },
    amount_paid_to_hopper:{
      type: String,
      default: 0,
    },
    amount_payable_to_hopper:{
      type: String,
      default: 0,
    },
    commition_to_payable:{
      type: String,
      default: 0,
    },
    remarksforliveUploaded:String,
    upload_view_count:{
      type:Number,
      default:0
    },

    payment_detail: [
      {
        purchased_mediahouse_id: {
          type: String,
          // required: true,
        },
        Vat: {
          type: String,
        },
        amount: {
          type: String,
        },
        purchased_time:{
          type:Date
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

// const MediaHouse = User.discriminator("Uploadcontent", uploadContentSchema);

module.exports = mongoose.model("Uploadcontent" , uploadContentSchema);
