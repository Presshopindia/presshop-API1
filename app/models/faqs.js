const mongoose = require("mongoose");
const FaqSchema = new mongoose.Schema(
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
    for: {
      type: String,
      enum: [
        "app","marketplace"
      ],
    },
    is_deleted:{
      type:Boolean,
      default:false
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("Faqs", FaqSchema);
