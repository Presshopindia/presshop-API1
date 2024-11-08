const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");
const { v4: uuidv4 } = require('uuid');
const addUserSchema = new mongoose.Schema(
  {
    admin_password: {
      type: String,
      // required: true,
    },
    full_name: {
      type: String,
      //   required: true,
    },
    type: {
      type: String,
      //   required: true,
    },
    allow_to_chat_externally:{
      type: Boolean,
      default: false,
    },
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
    // address: String,
    country_code:String,
    pin_code: String,
    // profile_image:String,
    city: String,
    country: String,
    phone_no: String,
    website: String,
    user_name: String,
    user_first_name: String,
    user_last_name: String,
    designation: String,
    designation_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    select_office_name: String,
    select_user_office_department: String,
    // user_email: String,
    // phone_no: String,
    min_price:String,
    max_price:String,
    reason_for_delete:String,
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
    user_id: {
      type: mongoose.Types.ObjectId,
    //   ref: "Admin",
    },
    department_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    office_id: {
      type: mongoose.Types.ObjectId,
      ref: "OfficeDetail",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);
const Adduser = User.discriminator("Adduser", addUserSchema);

module.exports = mongoose.model("Adduser");

// module.exports = mongoose.model("Adduser", addUserSchema);
