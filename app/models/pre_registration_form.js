const mongoose = require('mongoose');
const validator = require('validator');
const { v4: uuidv4 } = require('uuid');

const unifiedSchema = new mongoose.Schema({
    // Basic User Information
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: "EMAIL_IS_NOT_VALID",
        },
        lowercase: true,
        unique: true,
        required: false,
    },
    full_name: {
        type: String,
        required: false,
    },
    first_name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: false,
    },
    user_name: {
        type: String,
        default: null
    },
    dob: String,
    profile_image: {
        type: String,
    },

    // Contact Information
    country_code: {
        type: String,
    },
    phone: {
        type: Number,
        required: false,
        unique: true,
    },
    website: {
        type: String,
    },

    // Location Information
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
                type: String,
                enum: ["Point"],
            },
            coordinates: {
                type: [Number],
            },
        },
    },

    // Role and Authentication
    role: {
        type: String,
        enum: ["Hopper", "MediaHouse", "Adduser", "User_mediaHouse"],
        default: "Hopper",
    },
    password: {
        type: String,
    },
    decoded_password: String,
    social_id: {
        type: String,
    },
    social_type: {
        type: String,
        enum: ["apple", "google"],
    },
    isSocialRegister: {
        type: Boolean,
        default: false,
    },

    // Company Information
    company_name: {
        type: String,
    },
    company_number: {
        type: String,
    },
    company_vat: {
        type: String,
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

    // Office Details
    office_details: [{
        name: {
            type: String,
        },
        office_type_id: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
        },
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
                    type: String,
                    enum: ["Point"],
                },
                coordinates: {
                    type: [Number],
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
    }],

    // Administrative Details
    admin_detail: {
        full_name: {
            type: String,
        },
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
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

    // References and IDs
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "Admin"
    },
    avatar_id: {
        type: mongoose.Types.ObjectId,
        ref: "Avatar"
    },
    designation_id: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    department_id: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    office_id: {
        type: mongoose.Types.ObjectId,
        ref: "OfficeDetail",
    },
    user_type_id: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },

    // Media House Specific
    media_house_email: {
        type: String
    },
    media_house_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    media_house_status: {
        type: Boolean,
        default: false
    },

    // Administrative Rights
    admin_rignts: {
        allowed_to_onboard_users: {
            type: Boolean,
            default: false
        },
        allow_to_chat_externally: {
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

    // Documents
    docs: [{
        name: {
            type: String,
        },
        type: {
            type: String,
        },
        url: String
    }],
    upload_docs: {
        delete_doc_when_onboading_completed: {
            type: Boolean,
            default: false
        },
        govt_id: {
            type: String,
        },
        govt_id_mediatype: {
            type: String,
        },
        photography_licence: {
            type: String,
        },
        photography_mediatype: {
            type: String,
        },
        comp_incorporation_cert: {
            type: String,
        },
        comp_incorporation_cert_mediatype: {
            type: String,
        },
    },

    // Status and Settings
    mode: {
        type: String,
        enum: ["email", "chat", "call"],
        default: "email",
    },
    chat_status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending",
    },
    is_terms_accepted: {
        type: Boolean,
        default: false,
    },
    is_administator: {
        type: Boolean,
        default: false
    },
    is_onboard: {
        type: Boolean,
        default: false,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    is_confirm: {
        type: Boolean,
        default: false
    },
    verification: {
        type: String,
        default: uuidv4,
    },
    verified: {
        type: Boolean,
        default: false,
    },

    // Security
    isTempBlocked: {
        type: Boolean,
        default: false,
    },
    isPermanentBlocked: {
        type: Boolean,
        default: false,
    },
    blockaccess: {
        type: Boolean,
        default: false
    },
    loginAttempts: {
        type: Number,
        default: 0,
        select: false,
    },
    blockExpires: {
        type: Date,
        default: Date.now,
        select: false,
    },

    // Wallet
    wallet_id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    wallet_amount: {
        type: Number,
        default: 0
    },
    wallet_status: {
        type: String,
        default: "active"
    },

    // Stripe Integration
    stripe_customer_id: {
        type: String,
    },
    stripe_account_id: {
        type: String,
    },
    stripe_status: {
        type: String,
        default: "0"
    },

    // Additional Settings
    send_reminder: {
        type: Boolean,
        default: false,
    },
    send_statment: {
        type: Boolean,
        default: false,
    },

    // Legal Terms
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

    // Timestamps and Admin Updates
    latestAdminUpdated: {
        type: Date,
        default: new Date(),
    },
    latestAdminRemark: {
        type: String,
        default: null,
    }
});