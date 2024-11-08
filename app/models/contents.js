const mongoose = require("mongoose")

const ContentSchema = new mongoose.Schema(
  {
    hopper_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    content_view_type: String,
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    donot_share: {
      type: Boolean,
      default: false,
    },
    content: [
      {
        media: {
          type: String,
          // required: true,
        },
        watermark: {
          type: String,
          // required: true,
        },

        thumbnail: {
          type: String,
          // required: true,
        },
        image_name: {
          type: String,
          required: false,
        },
        media_type: {
          type: String,
          // enum: ["image", "video", "audio", "pdf", "doc"],
          default: "image",
        },
      },
    ],

    heading: {
      type: String,
    },

    sale_price: {
      type: String,
      required: false,
    },
    sale_status: {
      type: String,
      enum: ["sold", "unsold"],
      default: "unsold",
    },

    payment_pending: {
      type: String,
      default: false,
    },
    pressshop: {
      type: String,
      default: false,
    },

    firstLevelCheck: {
      nudity: {
        type: Boolean,
        default: false,
      },
      isAdult: {
        type: Boolean,
        default: false,
      },
      isGDPR: {
        type: Boolean,
        default: false,
      },
    },
    secondLevelCheck: {
      type: String,
    },
    call_time_date: {
      type: Date,
    },
    checkAndApprove: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      // required: true,
    },
    mode: {
      type: String,
      enum: ["email", "chat", "call"],
      default: "email",
    },
    remarks: {
      type: String,
    },

    audio_description: {
      type: String,
    },
    audio_description_duration: {
      type: String,
      default: null
    },
    timestamp: {
      type: Date,
    },
    mode_updated_at: {
      type: Date,
    },
    location: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    tag_ids:
      [{
        type: mongoose.Types.ObjectId,
        ref: "Tag",
      }],

    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: String,
      enum: ["shared", "exclusive"],
      default: "shared",
    },
    status: {
      type: String,
      enum: ["published", "pending", "rejected", "blocked"],
      default: "pending",
    },
    favourite_status: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },

    ask_price: {
      type: Number,
    },
    original_ask_price: {
      type: Number,
    },
    amount_paid: {
      type: Number,
      default: 0
    },
    is_draft: {
      type: Boolean,
      default: false,
    },
    selling_price: String,
    paid_status: {
      type: String,
      enum: ["paid", "un_paid"],
      default: "un_paid",
    },
    purchased_publication: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null
    },
    purchased_content_employee_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    latestAdminUpdated: Date,
    presshop_committion: Number,
    paid_status_to_hopper: {
      type: Boolean,
      default: false,
    },
    amount_paid_to_hopper: String,
    content_under_offer: {
      type: Boolean,
      default: null
      //   required: true,
    },

    published_time_date: {
      type: Date,
    },
    is_favourite: {
      type: Boolean,
      default: false
      //   required: true,
    },
    is_liked: {
      type: Boolean,
      default: false
      //   required: true,
    },
    is_emoji: {
      type: Boolean,
      default: false
      //   required: true,
    },

    is_clap: {
      type: Boolean,
      default: false
      //   required: true,
    },
    amount_payable_to_hopper: {
      type: Number,
      default: 0,
    },
    commition_to_payable: {
      type: String,
      default: 0,
    },
    content_view_count: {
      type: Number,
      default: 0
    },
    count_for_hopper: {
      type: Number,
      default: 0
    },
    is_deleted: {
      type: Boolean,
      default: false
    },
    purchased_mediahouse_time: [
      {
        media_house_id: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          default: []
        },
        is_hide: {
          type: Boolean,
          // default: false
        },

      }
    ],
    purchased_mediahouse: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    offered_mediahouses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],
    Vat: [
      {
        purchased_mediahouse_id: {
          type: String,
          // required: true,
        },
        Vat: {
          type: String,
        },
        amount: {
          type: String,
        },
        amount_without_Vat: {
          type: Number,
        },
        purchased_time: {
          type: Date
        },

        purchased_content_type: {
          type: String
        },
        transaction_id: {
          type: String
        },
        invoice_number: {
          type: String
        },
        stripe_fee: {
          type: Number
        },
        paybletohopper: {
          type: Number
        },
        presshop_committion: {
          type: Number
        }
      },
    ],
    totalfund_invested: Array,
    is_hide: {
      type: Boolean,
      default: false
    },

    transaction_id: {
      type: mongoose.Types.ObjectId,
      ref: "HopperPayment",
    },

    hasShared: {
      type: Boolean,
      default: false,
    },
    IsExclusive: {
      type: Boolean,
      // default: false,
    },
    IsShared: {
      type: Boolean,
      // default: false,
    },
    image_count: {
      type: Number,
      default: 0
    }, video_count: {
      type: Number,
      default: 0
    },
    audio_count: {
      type: Number,
      default: 0
    },
    other_count: {
      type: Number,
      default: 0
    },
    content_view_count_by_marketplace_for_app: {
      type: Number,
      default: 0
    },

    isCheck: {
      type: Boolean,
      default: false,
    },

    product_id: {
      type: String,
      default: null
    },

    before_discount_value: {
      type: String,
      default: null
    },
    discount_valid: {
      type: String,
      default: null
    },
    discount_percent: {
      type: String,
      default: null
    },
    sales_prefix: {
      type: String,
      default: null
    },
    stripe_account_id: String,
    is_charity: {
      type: Boolean,
      default: false
    },

    payment_intent: [{
      type: String
    }],
    charge_ids: [{
      type: String
    }],
    zip_url: {
      type: String,
      // default: false
    }
  },

  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Content", ContentSchema);
