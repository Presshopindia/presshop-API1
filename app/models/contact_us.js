const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");
const uuid = require("uuid");

const contact_us = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    contact_number: {
      type: String,
      default: null,
    },
    is_urgent: {
      type: Boolean,
      default: false,
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
    designation: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contact_us", contact_us);
