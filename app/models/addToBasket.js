const mongoose = require("mongoose");
const Basket = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["content", "task"]
        },

        post_id: {
            type: mongoose.Types.ObjectId,
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },

        vat_number: {
            type: String
        },
        order_date: {
            type: Date,
            default: new Date()
        },
        status: {
            type: String,
            enum: ["pending", "completed", "refunded"],
            default: "pending"
        },
        content: [
            {
                media_type: {
                    type: String
                },
                media: {
                    type: String
                },
                content_id: {
                    type: mongoose.Types.ObjectId,
                },
                watermark:{
                    type: String
                }
            },


        ]

    },
    {
        versionKey: false,
        timestamps: true,
    }
);
module.exports = mongoose.model("Basket", Basket);
