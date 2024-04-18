const mongoose = require("mongoose");
const sourcedContentHistorySchema = new mongoose.Schema(
  {
    media_house_id: {
      type: mongoose.Types.ObjectId,
      ref:"User"
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref:"Admin"
    },
    remarks:{
      type: String,
    },
    purchased_content_qty:{
      type:Number
    },
    purchased_content_value:{
      type:Number
    },
    total_payment_recieved:{
      type:Number
    },
    payment_recevable:{
      type:Number
    },
    task_broadcasted:{
      type:Number
    },
    mode:{
      type:String
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("SourcedContentHistory", sourcedContentHistorySchema);
