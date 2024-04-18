const mongoose = require("mongoose");
const PriceTipAndFAQSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    type: {
      type: String,
      enum: ["FAQ", "priceTip"],
    },
    role: {
      type: String,
      enum: ["Hopper", "MediaHouse"],
      default: "Hopper",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("PriceTipAndFAQ", PriceTipAndFAQSchema);
