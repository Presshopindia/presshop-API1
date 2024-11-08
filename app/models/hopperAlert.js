const mongoose = require("mongoose");


const hopperAlert = new mongoose.Schema(
    {

        image: {
            type: String
        },

        title: {
            type: String
        },

        address: {
            type: String
        },

        is_emergency:{
            type: Boolean,
            default: false
        },
        min_earning:{
            type: Number,
            default: 0
        },
        miles:{
            type: Number,
            default: 0
        },
        max_earning:{
            type: Number,
            defaul: 0
        },
        location: {
            type: {
              type: String,
              enum: ["Point"],
            },
            coordinates: {
              type: [Number],
            },
          },
    },
    {
        timestamps: true,
    }
);

hopperAlert.index({ location: "2dsphere" });

module.exports = mongoose.model("hopperAlerts", hopperAlert);
