const mongoose = require("mongoose");
const validator = require("validator");

const adminnotificationSchema = new mongoose.Schema(
  {
 
    sender_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Admin'
    },
    receiver_id: [{
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    }],

    is_read:{
     type:Boolean,
     default:false,
    },
    title:String,
    body:String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);



module.exports = mongoose.model("adminNotification", adminnotificationSchema);
