const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {


    content_id: {
      type: mongoose.Types.ObjectId,
      ref: "Content"
    },
    category_type: {
      type: String 
    },

    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Favourite", favouriteSchema);
