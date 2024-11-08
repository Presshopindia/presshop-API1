const mongoose = require("mongoose");


const coupon = new mongoose.Schema(
    {

        id: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^[a-zA-Z0-9]{6}$/.test(v);
                },
                message: "Coupon ID must be 6 alphanumeric characters long.",
            },
        },
        active: {
            type: Boolean,
            default: true
        },
        duration: {
            type: String,
            enum: ["forever", "once", "repeating"],
            default: "once"
        },
        percent_off: {
            type: Number,
            default: 0,
            validate: {
                validator: function (v) {
                    return v > 0 && v < 100;
                },
                message: "Value must be greater than 0 and less than 100.",
            }
        },
        currency: {
            type: String,
            enum: ["USD", "EUR", "GBP"],
            default: "GBP"
        },
        max_redemptions: {
            type: Number,
            default: 0
        },
        duration_in_months: {
            type: Number,
            default: 0
        },
        applies_to: [

            {
                products: {
                    type: String,
                    // ref: "Product",
                    // default: []
                }
            }
        ]

    },



    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("coupon", coupon);
