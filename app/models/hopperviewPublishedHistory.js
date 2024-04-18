const mongoose = require("mongoose");
const hopperpublishedHistory  = new mongoose.Schema(
  {
    // hopper_id: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    // },
    content_id: {
        type: mongoose.Types.ObjectId,
        ref: "Content",
      },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
   
    mode:String,
    remarks:String,
    // status:String
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("hopperpublishedHistory", hopperpublishedHistory);
