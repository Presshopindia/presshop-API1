const mongoose = require("mongoose");

const historyforPurchased = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
   /*  content_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Content",
    }, */

    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content",
      // type:Object
    },
    // task_id: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Task",
    //     // type:Object
    //   },
    
    mode: {
      type: String,
      enum: ["call", "chat", "email"],
    },
    remarks: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("historyforPurchasedViewdetails", historyforPurchased);
