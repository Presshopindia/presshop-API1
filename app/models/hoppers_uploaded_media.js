const mongoose = require("mongoose");
const uploadedMedia = new mongoose.Schema(
  {
    hopper_id: {
      type: mongoose.Types.ObjectId,
    },
    doc_id: {
      type: mongoose.Types.ObjectId,
      ref:"documents"
    },
    doc_name:{
        type:String
    },
    doc_type:{
        type:String
    },
    status:{
      type:Boolean,
      default:true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("hopperUploadedMedia", uploadedMedia);
