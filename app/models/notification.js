const mongoose = require("mongoose");
const validator = require("validator");

const notificationSchema = new mongoose.Schema(
  {
 
    sender_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
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
    is_admin:{
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



module.exports = mongoose.model("notificationforadmin", notificationSchema);
