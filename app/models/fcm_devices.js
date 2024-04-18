const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const FcmDeviceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.ObjectId,
      ref: "User",
      default: null,
    },
    device_id: {
      type: String,
      required: false,
    },
    device_token: {
      type: String,
    },
    type: {
      type: String,
      enum: ["ios", "android" , "web"],
    },
  
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("FcmDevice", FcmDeviceSchema);
