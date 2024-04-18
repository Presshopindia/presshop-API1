const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const uuid = require("uuid");

const contact_us_for_admin = new mongoose.Schema(
  {
    full_name: {
      type: String,
      default: null,
    },
    contact_number: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: null,
    },

    country_code:{
        type:String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contact_us_for_admin", contact_us_for_admin);
