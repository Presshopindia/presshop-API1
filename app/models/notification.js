const mongoose = require("mongoose");
const validator = require("validator");

const notificationSchema = new mongoose.Schema(
  {

    sender_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    receiver_id: [{
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    }],
    type: {
      type: String
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    timestamp_forsorting:{
      type: Date,
      default: new Date(),
    },

    send_by_admin:{
      type: Boolean,
      default: false,
    },
    is_deleted_for_mediahoue:{
      type: Boolean,
      default: false,
    },
    is_deleted_for_app:{
      type: Boolean,
      default: false,
    },
    title: String,
    body: String,
    content_link:String,
    dataforUser:String
  },
  {
    versionKey: false,
    timestamps: true,
  }
);



module.exports = mongoose.model("notificationforadmin", notificationSchema);
