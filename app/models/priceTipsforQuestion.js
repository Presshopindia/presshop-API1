const mongoose = require("mongoose");
const priceTipforquestion = new mongoose.Schema(
  {
    ques: {
      type: String,
      required: true,
    },
    ans: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    is_deleted:{
      type:Boolean,
      default:false
    },
    for: {
      type: String,
      enum: [
        "app","marketplace"
      ],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("priceTipforquestion", priceTipforquestion);
