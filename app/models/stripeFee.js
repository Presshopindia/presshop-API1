const mongoose = require("mongoose");
const stripefee = new mongoose.Schema(
  {
    amatuerPercentage: {
      type: Number,
    },
    ProPercentage: {
        type: Number,
      },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("stripefee", stripefee);
