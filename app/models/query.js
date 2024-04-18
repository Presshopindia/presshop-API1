const mongoose = require("mongoose");
const validator = require("validator");

const query = new mongoose.Schema(
  {
    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content",
    },
    type: {
      type: String,
      default: null,
    },

    // is_resubmit: {
    //   type: Boolean,
    //   default: false,
    // },

    submited_time: {
      type: Date
    },
    // booked_time: {
    //   type: Date
    // },
    // is_child_added: {
    //   type: Boolean,
    //   default: null,
    // },
    // is_approved: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("query", query);
