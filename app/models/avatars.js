const mongoose = require("mongoose");
const AvatarSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      required: true,
    },
    deletedAt:{
      type: Boolean,
      default:false,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("Avatar", AvatarSchema);
