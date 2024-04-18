const mongoose = require("mongoose");
const AcceptedTaskSchema = new mongoose.Schema(
  {
    hopper_id: {
      type:  mongoose.Types.ObjectId,
      ref:"User"
    },
    task_id: {
      type:  mongoose.Types.ObjectId,
      ref:"Task"
    },
    task_status: {
      type: String,
      enum: [
        "accepted",
        "rejected",
      ],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("acceptedTask", AcceptedTaskSchema);
