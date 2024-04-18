const mongoose = require("mongoose");

const HopperPaymentSchema = new mongoose.Schema(
  {

    hopper_id: {
      type: mongoose.Types.ObjectId,
      ref:"User",
      default: "User",
    },
    content_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Content",
    },

    task_content_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Uploadcontent",
    },
    media_house_id: {
      type: mongoose.Types.ObjectId,
      ref:"User",
      default: "User",
    },

    admin_id: {
      type: mongoose.Types.ObjectId,
      ref:"Admin",
      // default: "User",
    },
    amount: {
      type: Number,
    },
    remarks: {
      type: String,
    },

    Vat: {
      type: Number,
    },
    mode: {
      type: String,
      enum: ["call", "chat", "email"],
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    latestAdminUpdated: {
      type: Date
    },
    payment_latestAdminUpdated: {
      type: Date
    },
     paid_status_for_hopper:{
      type: Boolean,
      default: false
     },
     type:String,
    payable_to_hopper:Number,
    presshop_commission:Number,
    payment_remarks:String,
    latestAdminRemark:String,
    send_reminder:{
      type: Boolean,
      default: false,
    },
    send_statment:{
      type: Boolean,
      default: false,
    },
    blockaccess:{
      type:Boolean,
      default:false

    },
    invoiceNumber:{
      type:String,
      default:0
    },

    // latestAdminRemark:String,
    payment_send_reminder:{
      type: Boolean,
      default: false,
    },
    payment_send_statment:{
      type: Boolean,
      default: false,
    },
    payment_blockaccess:{
      type:Boolean,
      default:false

    },
    Due_date: {
      type: Date,
      // default: 

    },
    payment_mode:String,
    payment_admin_id:{
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    is_rated:{
      type:Boolean,
      default:false

    },
  },

  
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("HopperPayment", HopperPaymentSchema);
