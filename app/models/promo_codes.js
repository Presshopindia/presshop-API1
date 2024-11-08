const mongoose = require("mongoose");


const promocodes = new mongoose.Schema(
  {

    active: {
      type: Boolean,
      default: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    coupon: {
      type: String,
      default: 0,
    },
    percent_off: {
      type: Number,
      default: 0,
    },
    expires_at: {
      type: Number
    },
    expire_date_time: {
      type: Date,
      // default: Date.now() + 3600000 * 24 * 30, // 30 days
    },

    user_id: [{
      type: mongoose.Types.ObjectId,
      ref: "User",
    }]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("promocodes", promocodes);
