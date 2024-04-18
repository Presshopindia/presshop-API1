const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const HopperSchema = new mongoose.Schema(
  {

    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },  
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    user_name: {
      type: String,
      lowercase: true,
    },
    stripe_account_id: {
      type: String,
    },

    avatar_id: {
      type: mongoose.Types.ObjectId,
      ref: "Avatar",
    },
    recieve_task_notification: {
      type: Boolean,
      default: false,
    },
    bank_detail: [
      {
        acc_holder_name: {
          type: String,
        },
        bank_name: {
          type: String,
        },
        sort_code: {
          type: String,
        },
        acc_number: {
          type: Number,
        },
        is_default: {
          type: Boolean,
          default: false,
        },
      },
    ],
    doc_to_become_pro: {
      govt_id: {
        type: String,
      },
      govt_id_mediatype:{
        type: String,
      },
      photography_licence: {
        type: String,
      },
      photography_mediatype:{
        type: String,
      },
      comp_incorporation_cert: {
        type: String,
      },
      comp_incorporation_cert_mediatype:{
        type: String,
      },
    },
    category: {
      type: String,
      enum: ["pro", "amateur"],
      default: "amateur",
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
      },
    },
    mode: {
      type: String,
      enum: ["email", "chat", "call"],
      default: "email",
    },
    published_content_admin_employee_id: {     // for manage hopper section in admin
      type: mongoose.Types.ObjectId,
    },

    published_content_admin_employee_id_date: {     // for manage hopper section in admin
      type: Date,
    },

    published_content_admin_mode: {          // for manage hopper section in admin
      type: String,
      enum: ["email", "chat", "call"],
      default: "email",
    },

    published_content_remarks: {             // for manage hopper section in admin
      type: String,
    },

    uploaded_content_admin_employee_id: {      // for manage hopper section in admin
      type: mongoose.Types.ObjectId,
    },

    uploaded_content_admin_employee_id_date: {     // for manage hopper section in admin
      type: Date,
    },

    uploaded_content_admin_mode: {          // for manage hopper section in admin
      type: String,
      enum: ["email", "chat", "call"],
      default: "email",
    },

    uploaded_content_remarks: {             // for manage hopper section in admin
      type: String,
    },
    post_code: {             // for manage hopper section in admin
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

HopperSchema.index({ location: "2dsphere" });

HopperSchema.index(
  { user_name: 1 },
  {
    unique: true,
    partialFilterExpression: { isSocialRegister: false, role: "Hopper" },
  }
);

HopperSchema.pre("save", function (next) {
  const that = this;
  // console.log("that==>", that);
  if (that.isModified("latitude") || that.isModified("longitude")) {
    that.location = {
      type: "Point",
      coordinates: [that.longitude, that.latitude],
    };
  } 
  // else {
  //   that.location = {
  //     type: "Point",
  //     coordinates: [0, 0],
  //   };
  // }
  return next();
});
const Hopper = User.discriminator("Hopper", HopperSchema);

module.exports = mongoose.model("Hopper");
