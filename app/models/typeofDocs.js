const mongoose = require("mongoose");

const documentsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["marketplace", "app"],
    },
    document_name: {
      type: String,
    },
    is_deleted:{
      type:Boolean,
      default:false
    },
    hopper_id:[{
      type:mongoose.Types.ObjectId,
      ref:"hopperUploadedMedia"
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("documents", documentsSchema);
