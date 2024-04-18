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
      tutorial_id:{
        type: mongoose.Types.ObjectId,
        // required: true,
        // ref: "Content",
      },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      type:String
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("HoppercontentViewRecords", contentViewRecords);
