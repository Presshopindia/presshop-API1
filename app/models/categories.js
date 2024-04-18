const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // lowercase: true,
    },

    percentage: {
      type: String,
      default: 0,
      // lowercase: true,
    },



    type: {
      type: String,
      enum: [
        "FAQ",
        "priceTip",
        "tutorial",
        "content",
        "department",
        "commissionstructure",
        "designation",
        "officeType",
        "tasks"
      ],
      required: true,
    },
    // role: {
    //   type: String,
    //   enum: ["Hopper", "MediaHouse", "forAll"],
    //   default: "forAll",
    // },
    icon: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("Category", CategorySchema);
