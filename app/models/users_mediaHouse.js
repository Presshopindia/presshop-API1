const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
// const uuid = require("uuid");
const User = require("./user");
const { v4: uuidv4 } = require('uuid');
const UserMediaHouse = new mongoose.Schema(
  {
    media_house_email: {
      type: String
    },
    media_house_id: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    administator_first_name: {
      type: String
    },
    administator_last_name: {
      type: String
    },
    administator_email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "EMAIL_IS_NOT_VALID",
      },
      lowercase: true,
      // unique: true,
      required: true,
    },
    full_name: {
      type: String,
      //   required: true,
    },
    type: {
      type: String,
      //   required: true,
    },
    allow_to_chat_externally: {
      type: Boolean,
      default: false,
    },
    // address: String,
    country_code: String,
    pin_code: String,
    profile_image: String,
    city: String,
    country: String,
    phone_no: String,
    website: String,
    user_name: String,
    user_first_name: String,
    user_last_name: String,
    user_email: String,
    designation: String,
    designation_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    department_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    select_office_name: String,
    select_user_office_department: String,
    min_price: String,
    max_price: String,
    reason_for_delete: String,
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
    allow_to_chat_externally: {
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
        ref: "OfficeDetail",
    },
    media_house_status: {
      type: Boolean,
      default: false
    },
    // password:{
    //   type:String
    // },
    // encrypted_password:{
    //   type:String
    // }


    wallet_id: {
      type: String,
      default: uuidv4,
      unique: true,
  
    },
    wallet_amount: {
      type: Number,
      default:0
    },
    wallet_status: {
      type: String,
      default:"active"
    },
    admin_rignts: {
      allowed_to_onboard_users: {
        type: Boolean,
        default: false
      },
      allow_to_chat_externally:{
        type: Boolean,
        default: false
      },
      allowed_to_deregister_users: {
        type: Boolean,
        default: false
      },
      allowed_to_assign_users_rights: {
        type: Boolean,
        default: false
      },
      allowed_to_set_financial_limit: {
        type: Boolean,
        default: false
      },
      allowed_complete_access: {
        type: Boolean,
        default: false
      },
      allowed_to_broadcast_tasks: {
        type: Boolean,
        default: false
      },
      allowed_to_purchase_content: {
        type: Boolean,
        default: false
      },

      price_range: {
        minimum_price: Number,
        maximum_price: Number
      }
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
const Adduser = User.discriminator("User_mediaHouse", UserMediaHouse);
// UserMediaHouse.pre("save", function (next) {
//   const that = this;
//   const SALT_FACTOR = 5;

//   if (!that.isModified("password")) {
//     return next();
//   }
//   return genSalt(that, SALT_FACTOR, next);
// });

module.exports = mongoose.model("User_mediaHouse");
