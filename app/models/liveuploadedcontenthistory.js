const mongoose = require("mongoose");

const liveuploadedcontenthistory = new mongoose.Schema(
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
    role: {
        type: String,
      },
    content_id: [{
      type: mongoose.Types.ObjectId,
      ref: "Uploadcontent",
    }],
    task_id:{
      type: mongoose.Types.ObjectId,
      ref: "Task",
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("liveuploadedcontenthistory", liveuploadedcontenthistory);
