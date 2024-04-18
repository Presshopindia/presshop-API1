const mongoose = require("mongoose");
const MhInternalGroupsSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    user_status: {
      type: String,
      enum: ["online", "offline"],
    },
    admin: Boolean,
    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content",
    },
    is_seen:{
      type:Boolean,
      default:false
    },
    name: String,
    room_id: String
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },

);
MhInternalGroupsSchema.virtual('chats', {
  ref: 'Chat',
  localField: 'room_id',
  foreignField: 'room_id',
  justOne: true,
})
module.exports = mongoose.model("mh_internal_groups", MhInternalGroupsSchema);
