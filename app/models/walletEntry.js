const mongoose = require("mongoose");
const walletentry = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["debit", "credit"]
        },

        post_id: {
            type: mongoose.Types.ObjectId,
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref:"User"
        },

        amount:{
            type: Number
        },
        
        // status:{
        //     type: String,
        //     enum: ["pending", "completed", "refunded"],
        //     default: "pending"
        // },


    },
    {
        versionKey: false,
        timestamps: true,
    }
);
module.exports = mongoose.model("walletentry", walletentry);
