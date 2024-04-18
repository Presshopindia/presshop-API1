const mongoose = require("mongoose");
const AdminOfficeDetailSchema = new mongoose.Schema(
  {
    office_name: {
      type: String,
    },
    phone: {
      type: Number,
    },
    country_code: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
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
          default:'Point'
        },
        coordinates: {
          type: [Number],
          // required: true
        },
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("AdminOfficeDetail", AdminOfficeDetailSchema);
