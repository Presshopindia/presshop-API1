const mongoose = require("mongoose");
const validator = require("validator");

const recentactivity = new mongoose.Schema(
  {
 
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
      },

    content_id: {
      type: mongoose.Types.ObjectId,
    //   required: true,
      ref: 'Content'
    },
    task_id: {
      type: mongoose.Types.ObjectId,
    //   required: true,
      ref: "Task",
    },
    uploaded_content_id: {
        type: mongoose.Types.ObjectId,
        // required: true,
        ref: "Uploadcontent",
      },
      is_deleted:{
        type:Boolean,
        default:false
      },

    type:String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);



module.exports = mongoose.model("recentactivity", recentactivity);
