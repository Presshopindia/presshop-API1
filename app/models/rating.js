const mongoose = require("mongoose");
const validator = require("validator");

const ratingSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    to: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "User",
    },
    content_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Content",
    },
    task_content_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "UploadedContent",
    },
    type:String,
    product_id:String,
    review:String,
    rating:Number,
    sender_type:String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Rating", ratingSchema);
