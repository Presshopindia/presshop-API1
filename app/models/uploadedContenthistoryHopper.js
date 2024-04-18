const mongoose = require("mongoose");

const uplodedcontenthistoryhoppers = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    mode: {
      type: String,
    },
    remarks: {
      type: String,
    },
    latestAdminUpdated: {
      type: Date
    },
    hopper_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("uplodedcontenthistoryhoppers", uplodedcontenthistoryhoppers);
