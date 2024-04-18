const mongoose = require("mongoose");
const OfficeDetailSchema = new mongoose.Schema(
  {
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
    office_type_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    // address: {
    //   type: String,
    // },
    address: {
      pincode: {
        type: String,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      complete_address: {
        type: String,
      },
      Pin_Location: {
        lat: {
          type: Number,
        },
        long: {
          type: Number,
        },
      },
      location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ["Point"], // 'location.type' must be 'Point'
          // required: true
        },
        coordinates: {
          type: [Number],
          // required: true
        },
      },
    },
    country_code: {
      type: String,
    },
    phone: {
      type: Number,
    },
    website: {
      type: String,
    },
    is_another_office_exist: {
      type: Boolean,
      default:false
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("OfficeDetail", OfficeDetailSchema);
