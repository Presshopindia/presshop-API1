const mongoose = require("mongoose");
const TutorialSchema = new mongoose.Schema(
  {
    video: {
      type: String,
    },
    thumbnail:{
      type: String,
    },
    description: {
      type: String,
    },
    category:{
      type: String,
      // enum: [
      //   "shared","exclusive"
      // ],
    },
    is_deleted:{
      type:Boolean,
      default:false
    },
    duration:String,
    count_for_hopper:{
      type:Number,
      default:0
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
module.exports = mongoose.model("tutorial_video", TutorialSchema);
