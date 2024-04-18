const mongoose = require("mongoose");
const email = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    // latest_time:new Date(),
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
module.exports = mongoose.model("email", email);
