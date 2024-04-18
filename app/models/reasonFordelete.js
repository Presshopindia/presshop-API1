const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const reason = new mongoose.Schema(
  {


    reason: String,
    
   
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// reason.insertMany(["sasas","asas"],);
module.exports = mongoose.model("reason", reason);
