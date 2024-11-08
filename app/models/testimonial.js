const mongoose = require("mongoose");
const testimonial = new mongoose.Schema(
    {
        image: {
            type: String,
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            default:"pending"
        },
        rate: String,
        features: Array,
        user_id: {
            type: mongoose.Types.ObjectId,
            ref:"User"
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
module.exports = mongoose.model("testimonial", testimonial);
