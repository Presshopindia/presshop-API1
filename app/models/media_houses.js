const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user");

const MediaHouseSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },  
    last_name: {
      type: String,
      required: true,
    }, 

    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "Admin"
    },
    avatar_id: {
      type: mongoose.Types.ObjectId,
      ref: "Avatar"
    },
    profile_image: {
      type: String,
    },
    user_name: {
      type: String,
      default: null
    },
    designation_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    company_name: {
      type: String,
    },
    company_number: {
      type: String,
    },
    company_vat: {
      type: String,
    },
    office_details: [
      {
        name: {
          type: String,
        },
        office_type_id: {
          type: mongoose.Types.ObjectId,
          ref: "Category",
        },
        // address: {
        //   type: String,
        // },
        address: {
          pincode: {
            type: String,
          },
          country: {
            type: String,
          },
          city: {
            type: String,
          },
          complete_address: {
            type: String,
          },
          Pin_Location: {
            lat: {
              type: Number,
            },
            long: {
              type: Number,
            },
          },
          location: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ["Point"], // 'location.type' must be 'Point'
              // required: true
            },
            coordinates: {
              type: [Number],
              // required: true
            },
          },
        },
        country_code: {
          type: String,
        },
        phone: {
          type: Number,
        },
        website: {
          type: String,
        },
        is_another_office_exist: {
          type: Boolean,
          default: false
        }
      },
    ],

    admin_detail: {
      full_name: {
        type: String,
        // required: true,
      },
      first_name: {
        type: String,
        // required: true,
      },  
      last_name: {
        type: String,
        // required: true,
      }, 
  
      office_type: {
        type: mongoose.Types.ObjectId,
      },
      office_name: {
        type: mongoose.Types.ObjectId,
      },
      department: {
        type: String
      },
      admin_profile: {
        type: String
      },
      country_code: {
        type: String,
      },
      phone: {
        type: Number,
      },
      email: {
        type: String
      },
    },
    mode: {
      type: String,
      enum: ["email", "chat", "call"],
      default: "email",
    },
    source_content_employee: {
      type: mongoose.Types.ObjectId,
      ref:"Admin"
    },
    remarks: {
      type: String,
    },
    action:
    {
      type: String
    },
    admin_rignts: {
      allowed_to_onboard_users: {
        type: Boolean,
        default: false
      },
      allowed_to_deregister_users: {
        type: Boolean,
        default: false
      },
      allowed_to_assign_users_rights: {
        type: Boolean,
        default: false
      },
      allowed_to_set_financial_limit: {
        type: Boolean,
        default: false
      },
      allowed_complete_access: {
        type: Boolean,
        default: false
      },
      allowed_to_broadcast_tasks: {
        type: Boolean,
        default: false
      },
      allowed_to_purchase_content: {
        type: Boolean,
        default: false
      },

      price_range: {
        minimum_price: Number,
        maximum_price: Number
      }
    },

    department_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    is_administator: {
      type: Boolean,
      default: false
    },
    is_responsible_for_user_rights: {
      type: Boolean,
      default: false
    },
    is_responsible_for_granting_purchasing: {
      type: Boolean,
      default: false
    },
    is_responsible_for_fixing_minimum_and_maximum_financial_limits: {
      type: Boolean,
      default: false
    },
    is_confirm: {
      type: Boolean,
      default: false
    },

    docs:[
      {
        name: {
          type: String,
        },
        type:{
          type: String,
        },
        url:String
    }

    ],
    upload_docs: {
      delete_doc_when_onboading_completed: {
        type: Boolean,
        default: false
      },

      govt_id: {
        type: String,
      },
      govt_id_mediatype:{
        type: String,
      },
      photography_licence: {
        type: String,
      },
      photography_mediatype:{
        type: String,
      },
      comp_incorporation_cert: {
        type: String,
      },
      comp_incorporation_cert_mediatype:{
        type: String,
      },
      // documents: [{
      //   // adharcard:String,
      //   content:String,
      //   url: Array,
      // }],
    },

    company_bank_details: {
      company_account_name: {
        type: String
      },
      bank_name: {
        type: String
      },
      sort_code: {
        type: String
      },
      account_number: {
        type: String
      },
      is_default: {
        type: Boolean,
        default: false
      }
    },

    sign_leagel_terms: {
      is_condition_one: {
        type: Boolean,
        default: false
      },
      is_condition_two: {
        type: Boolean,
        default: false
      },
      is_condition_three: {
        type: Boolean,
        default: false
      }
    },
    chat_status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },



  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const MediaHouse = User.discriminator("MediaHouse", MediaHouseSchema);

module.exports = mongoose.model("MediaHouse");
