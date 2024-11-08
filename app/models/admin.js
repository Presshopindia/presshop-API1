const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    remarks: {
      type: String,
    },
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
    password: {
      type: String,
      required: true,
      select: false,
    },
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
    creator_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    office_details: {
      company_name: {
        type: String,
      },
      company_number: {
        type: String,
      },
      company_vat: {
        type: String,
      },
      name: {
        type: String,
      },
      address: {
        type: String,
      },
      country_code: {
        type: String,
      },
      phone: {
        type: String,
      },
      website: {
        type: String,
      },
    },
    employee_address: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        default: 'Point'
      },
      coordinates: {
        type: [Number],
      },
      post_code: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    bank_details: {
      account_holder_name: {
        type: String,
      },
      account_number: {
        type: String,
      },
      bank_name: {
        type: String,
      },
      sort_code: {
        type: String,
      },
    },
    designation_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    department_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    country_code: {
      type: String,
    },
    phone: {
      type: Number,
    },
    profile_image: {
      type: String,
    },
    office_id: {
      type: mongoose.Types.ObjectId,
      ref:"AdminOfficeDetail"
    },
    subadmin_rights: {
      onboardEmployess: {
        type: Boolean,
        default: false,
      },
      blockRemoveEmployess: {
        type: Boolean,
        default: false,
      },
      assignNewEmployeeRights: {
        type: Boolean,
        default: false,
      },
      completeAccess: {
        type: Boolean,
        default: false,
      },
      controlHopper: {
        type: Boolean,
        default: false,
      },
      controlPublication: {
        type: Boolean,
        default: false,
      },
      controlContent: {
        type: Boolean,
        default: false,
      },
      viewRightOnly: {
        type: Boolean,
        default: false,
      },
      other_rights:{
        type:Boolean,
        default:false
      },
      allow_publication_chat:{
        type:Boolean,
        default:false
      },
      allow_hopper_chat:{
        type:Boolean,
        default:false
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verification: {
      type: String,
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
    is_Contractsigned:{
      type:Boolean,
      default:false
  },
  is_Legal:{
      type:Boolean,
      default:false
  },
  is_Checkandapprove:{
      type:Boolean,
      default:false
  },
  forgotPassOTPExpire: {
    type: Date,
    default: new Date(),
    select: false,
  },
  forgotPassOTP: {
    type: Number,
    select: false,
  },
  isTempBlocked: {
    type: Boolean,
    default: false,
  },
  isPermanentBlocked: {
    type: Boolean,
    default: false,
  },
 complete_rights:{
type:Boolean,
default:false
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

AdminSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;
  if (!that.isModified("password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});

AdminSchema.pre("save", function (next) {
  const that = this;
  if (that.role === "admin") {
    that.status = "approved";
  }
  next();
});
AdminSchema.methods.comparePassword = function (passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) =>
    err ? cb(err) : cb(null, isMatch)
  );
};
AdminSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Admin", AdminSchema);
