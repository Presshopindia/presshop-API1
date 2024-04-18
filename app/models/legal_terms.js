const mongoose = require("mongoose");
const LegalTermsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    for: {
      type: String,
      enum: [
        "app","marketplace"
      ],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("Legal_terms", LegalTermsSchema);
