const mongoose = require("mongoose");
const validator = require("validator");

const UserVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "EMAIL_IS_NOT_VALID",
      },
      lowercase: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email_otp: {
      type: Number,
      // required: true,
    },
    phone_otp: {
      type: Number,
      required: true,
    },
    is_verifed: {
      type: Number,
      // required: true,
    },
    otp_expire: {
      type: Date,
      default: new Date(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("UserVerification", UserVerificationSchema);
