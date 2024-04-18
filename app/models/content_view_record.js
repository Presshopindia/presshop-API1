const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const contentViewRecords = new mongoose.Schema(
  {
   
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
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("contentViewRecords", contentViewRecords);
