const mongoose = require("mongoose");
const sourcedContentHistorySchema = new mongoose.Schema(
  {
    media_house_id: {
      type: mongoose.Types.ObjectId,
    },
    admin_id: {
      type: String,
    },
    remarks:{
      type: String,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("SourcedContentHistorySchema", sourcedContentHistorySchema);
