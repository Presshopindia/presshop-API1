const mongoose = require("mongoose");
const addactiondetails  = new mongoose.Schema(
  {
    hopper_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    task_id: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
    },
    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content",
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    type:{
        type:String,
        enum:["livepublished" , "liveuploaded","livetask" ,"invoice" , "transiction"]
    },
    send_reminder:{
      type: Boolean,
      default: false,
    },
    Payment_id:{
      type: mongoose.Types.ObjectId,
      // ref: "Admin",
    },
    send_statment:{
      type: Boolean,
      default: false,
    },
    blockaccess:{
      type:Boolean,
      default:false

    },
    removeuser:{
      type:Boolean,
      default:false

    },

    coversationWithhopper:String,
    Actiontaken:String,
    mode:String
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("addactiondetails", addactiondetails);
