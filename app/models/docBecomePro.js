const mongoose = require("mongoose");
const docBecomeProSchema = new mongoose.Schema(
  {
    hopper_id: {
      type: mongoose.Types.ObjectId,
    },
    doc_id: {
      type: mongoose.Types.ObjectId,
      ref:"documents"
    },
    status:{
      type:String
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("docBecomePro", docBecomeProSchema);
