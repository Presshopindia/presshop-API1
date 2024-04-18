const mongoose = require("mongoose");
const DocsSchema = new mongoose.Schema(
  {
    description: {
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
module.exports = mongoose.model("Doc", DocsSchema);
