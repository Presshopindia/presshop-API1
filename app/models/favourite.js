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
    uploaded_content: {
      type: mongoose.Types.ObjectId,
      ref: "Uploadcontent"
    },
    type: {
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
