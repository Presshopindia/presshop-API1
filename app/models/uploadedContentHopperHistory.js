const mongoose = require("mongoose");

const UploadedContentHopperHistorySchema = new mongoose.Schema(
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
    Tasksaccepted:String,
    UploadedcontentValue:String,
    UploadedcontentQty:String,
    Paymentpending:String,
    Totalpaymentearned:String,
    Presshopcommission:String,
    Paymentduedate:String,
    avtar:mongoose.Types.ObjectId,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("UploadedContentHopperHistory", UploadedContentHopperHistorySchema);
