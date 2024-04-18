const mongoose = require("mongoose");
const PriceTipsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    for: {
      type: String,
      enum: [
        "app", "marketplace"
      ],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("Price_tips", PriceTipsSchema);
