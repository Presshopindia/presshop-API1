const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const employHistory = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "subAdmin"],
      default: "subAdmin",
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    employee_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    action: {
      type: String,
      enum: ["true", "false"],
      default:"false"
    },
    remarks: {
      type: String,
    },
    is_Contractsigned: {
      type: Boolean,
      default: false,
    },
    is_Legal: {
      type: Boolean,
      default: false,
    },
    is_Checkandapprove: {
      type: Boolean,
      default: false,
    },
    isTempBlocked: {
      type: String,
      enum: ["true", "false"],
      default:"false"
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("employHistory", employHistory);
