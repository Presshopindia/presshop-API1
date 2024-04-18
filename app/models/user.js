const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const uuid = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "EMAIL_IS_NOT_VALID",
      },
      lowercase: true,
      unique: true,
      required: true,
    },
    social_id: {
      type: String,
    },
    social_type: {
      type: String,
      enum: ["apple", "google"],
    },
    isSocialRegister: {
      type: Boolean,
      default: false,
    },
    full_name: {
      type: String,
      //   required: true,
    },
    country_code: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // select: false,
    },
    role: {
      type: String,
      enum: ["Hopper", "MediaHouse" , "Adduser", "User_mediaHouse"],
      default: "Hopper",
    },
    decoded_password:String,
    address: {
      type: String,
    },
    is_terms_accepted: {
      type: Boolean,
      default: false,
    },
    allow_to_chat_externally:{
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    verification: {
      type: String,
      default: uuid.v4(),
    },
    checkAndApprove: {
      type: Boolean,
      default: false,
    },
    isTempBlocked: {
      type: Boolean,
      default: false,
    },
    isPermanentBlocked: {
      type: Boolean,
      default: false,
    },
    latestAdminUpdated: {
      type: Date,
      default: new Date(),
    },
    latestAdminRemark: {
      type: String,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    forgotPassOTP: {
      type: Number,
      select: false,
    },
    postal_code: {
      type: Number,
    },
    appartment: {
      type: String,
    },
    forgotPassOTPExpire: {
      type: Date,
      default: new Date(),
      select: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false,
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false,
    },
   
    stripe_customer_id: {
      type: String,
    },
    stripe_account_id: {
      type: String,
    },
    stripe_status:String,
    send_reminder:{
      type: Boolean,
      default: false,
    },
    send_statment:{
      type: Boolean,
      default: false,
    },
    blockaccess:{
      type:Boolean,
      default:false

    },
    chat_status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    pin_code: String,
    profile_image:String,
    city: String,
    country: String,
    // phone_no: String,
    website: String,
    user_name: String,
    first_name: String,
    last_name: String,
    designation: String,
    select_office_name: String,
    select_user_office_department: String,
    // user_email: String,
    // phone_no: String,
    min_price:String,
    max_price:String,
    reason_for_delete:String,
    type:String,
    is_onboard: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    allow_to_broadcat: {
      type: Boolean,
      default: false,
    },
    allow_to_complete: {
      type: Boolean,
      default: false,
    },
    allow_to_purchased_content: {
      type: Boolean,
      default: false,
    },
    onboard_other_user: {
      type: Boolean,
      default: false,
    },
   
    user_id: {
      type: mongoose.Types.ObjectId,
    //   ref: "Admin",
    },

    office_id: {
      type: mongoose.Types.ObjectId,
    //   ref: "Avatar",
    },
  },
  {
    discriminatorKey: "role",
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
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

UserSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;

  if (!that.isModified("password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});

module.exports = mongoose.model("User", UserSchema);
