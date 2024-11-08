const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    mediahouse_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    admin_id: {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: "Admin",
      default:null
    },
    user_id: {
      type: mongoose.Types.ObjectId,
    },
    task_date: {
      type: Date,
    },
    deadline_date: {
      type: Date,
    },
    task_description: {
      type: String,
    },
    any_spcl_req: {
      type: String,
    },
    location: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    heading:{
      type: String,
    },
    longitude: {
      type: Number,
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    need_photos: {
      type: Boolean,
      default: false,
    },
    photo_price: {
      type: Number,
    },
    need_videos: {
      type: Boolean,
      default: false,
    },
    videos_price: {
      type: Number,
    },
    need_interview: {
      type: Boolean,
      default: false,
    },
    interview_price: {
      type: Number,
    },
    role: {
      type: String,
    },
    content: [
      {
        media: {
          type: String,
          required: true,
        },
        thumbnail: {
          type: String,
          required: false,
        },
        media_type: {
          type: String,
          enum: ["image", "video", "audio"],
          default: "image",
        },
      },
    ],
    call_time_date: {
      type: Date,
    },
    mode: {
      type: String,
      enum: ["email", "chat", "call"],
      default: "email",
    },
    remarks: {
      type: String,
    },
    modeforliveUploaded: {
      type: String,
      enum: ["email", "chat", "call"],
      default: "email",
    },
    remarksforliveUploaded: {
      type: String,
    },
    audio_description: {
      type: String,
    },
    timestamp: {
      type: Date,
    },
    type: {
      type: String,
      enum: ["shared", "exclusive"],
      default: "shared",
    },
    status: {
      type: String,
      enum: ["published", "pending", "rejected"],
      default: "published",
    },
    ask_price: {
      type: Number,
    },
    received_amount: {
      type: Number,
      default: 0,
    },
    is_draft: {
      type: Boolean,
      default: false,
    },
    paid_status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    checkAndApprove: {
      type: Boolean,
      default: false,
    },
    address_location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
        default: "Point",
      },
      coordinates: {
        type: [Number],
        // required: true
      },
    },
    accepted_by: [

      {type: mongoose.Types.ObjectId,
        ref: "User",
      default:[]}
      // {
      //   hopper_id: {
      //     type: mongoose.Types.ObjectId,
      //     ref: "User",
      //   },
      // },
    ],
    completed_by:[
      {type: mongoose.Types.ObjectId,
        ref: "User",
      default:[]}
    ],
    assign_more_hopper_history: [
    //   {type: mongoose.Types.ObjectId,
    //   ref: "User",
    // default:[]}
      ],
      
      total_vat_value_invested_in_task:{
        type:Number,
        default:0
      },
      total_amount_with_vat_invested_in_task:{
        type:Number,
        default:0
      },
      total_stripefee_value_invested_in_task:{
        type:Number,
        default:0
      },
      total_uploaded_content_value_in_task:{
        type:Number,
        default:0
      },
      Vat:Array,
      totalfund_invested:Array
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Task", TaskSchema);
