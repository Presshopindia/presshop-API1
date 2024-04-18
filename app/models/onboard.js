const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const uuid = require("uuid");
const OnboardSchema = new mongoose.Schema(
  {
    user_first_name: {
      type: String,
    },
    user_last_name: {
      type: String,
    },
    user_email: {
      type: String,
    },
    administator_first_name: {
      type: String,
    },
    administator_last_name: {
      type: String,
    },
    administator_email: {
      type: String,
    },
    date:{
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "reject"],
      default: "pending",
    },
    password: {
      type: String,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const hash = (user, salt, next) => {
  bcrypt.hash(user.password, salt, null, (error, newHash) => {
    if (error) {
      return next(error);
    }
    user.password = newHash;
    return next();
  });
};

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }
    return hash(user, salt, next);
  });
};

OnboardSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;

  if (!that.isModified("password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});
module.exports = mongoose.model("Onboard", OnboardSchema);
