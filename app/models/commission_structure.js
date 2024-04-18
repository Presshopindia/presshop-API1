const mongoose = require("mongoose");
const CommissionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    for: {
      type: String,
      enum: [
        "app", "marketplace"
      ],
    },

    TypeFor:{
      type: String,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("Commission", CommissionSchema);
