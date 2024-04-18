const mongoose = require("mongoose");
const SellingPriceSchema = new mongoose.Schema(
  {
    exclusive: {
      type: String,
    },
    shared: {
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
module.exports = mongoose.model("Selling_price", SellingPriceSchema);
