const mongoose = require("mongoose");
const trending_search = new mongoose.Schema(
  {
    tag_id: {
      type: mongoose.Types.ObjectId,
      //   required: true,
      //   lowercase: true,
      ref: "tags"
    },
    mediahouse_id: {
      type: mongoose.Types.ObjectId,
      ref: "User"

    },
    tagName: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("trendingSearch", trending_search);
