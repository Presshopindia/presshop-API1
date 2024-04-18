const mongoose = require("mongoose");
const validator = require("validator");

const ChatSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
    },
    message: {
      type: String,
    },
    message_type: {
      type: String,
    },
    sender_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    receiver_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    addedMsg:{
      type:String,
    },
    image_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Uploadcontent",
    },
    primary_room_id:{
      type: String,
    },
    type:String,
    media:{
      // add when message_type == 'media'
      watermarkimage_url:String,
      name: String,
      mime: String,
      size: String,
      url: String,
      thumbnail_url:String,
      amount:String
    },
    rating:String,
    amount:String,
    sender_type:String,
    room_type:{
      type: String,
    },
    paid_status:{
      type:Boolean,
      default:false
    },
    request_status:{
      type:Boolean,
      default:null
    },
    request_sent:{
      type:String,
      default:null
    },

    is_hide:{
      type:Boolean,
      default:null
    },
    user_info:Object,
    initial_offer_price:String,
    
    finaloffer_price:String,
    amount_paid:String,
    review:String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);




module.exports = mongoose.model("Chat", ChatSchema);
