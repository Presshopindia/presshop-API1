const mongoose = require("mongoose");
const commisionStructureSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    percentage: {
        type: String,
        default:0
      },
    // type: {
    //   type: String,
    //   enum: [
    //     "Pro", "Amatur"
    //   ],
    // },

    
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("CommissionStrure", commisionStructureSchema);
