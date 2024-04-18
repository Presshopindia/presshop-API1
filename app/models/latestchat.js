const mongoose = require("mongoose");

const lastchat = new mongoose.Schema(
    {
        mediahouse_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        hopper_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        content_id: {
            type: mongoose.Types.ObjectId
        },
        room_id:{
            type:String
        },
    
        message: String,
        type: String
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
    }
);

module.exports = mongoose.model("lastchat", lastchat);
