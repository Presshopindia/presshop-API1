const mongoose = require("mongoose");

const StripeAccount = new mongoose.Schema(
  {
    account_id: {
    type: String,
    //   ref: "User",
    },

    user_id: {
      type: String,
    //   ref: "Admin",
    },


  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("StripeAccount", StripeAccount);
