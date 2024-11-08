const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
//     {
//     date_of_extract: {
//         type: Date,
//         required:false,
//     },
//     organisation_number: {
//         type: Number,
//         required:false,
//         // unique: true,
//     },
//     registered_charity_number: {
//         type: Number,
//         required:false,
//         // unique: true,
//     },
//     linked_charity_number: {
//         type: Number,
//         default: 0,
//     },
//     charity_name: {
//         type: String,
//         required:false,
//     },
//     charity_type: {
//         type: String,
//         enum: ['Trust', 'CIO', 'Unincorporated Association', 'Company', 'Other'],
//         required:false,
//     },
//     charity_registration_status: {
//         type: String,
//         enum: ['Registered', 'Removed'],
//         required:false,
//     },
//     date_of_registration: {
//         type: Date,
//         required:false,
//     },
//     date_of_removal: {
//         type: Date,
//     },
//     charity_reporting_status: {
//         type: String,
//         enum: ['Registered', 'Removed'],
//         required:false,
//     },
//     latest_acc_fin_period_start_date: {
//         type: Date,
//     },
//     latest_acc_fin_period_end_date: {
//         type: Date,
//     },
//     latest_income: {
//         type: Number,
//     },
//     latest_expenditure: {
//         type: Number,
//     },
//     charity_contact_address1: {
//         type: String,
//     },
//     charity_contact_address2: {
//         type: String,
//     },
//     charity_contact_address3: {
//         type: String,
//     },
//     charity_contact_address4: {
//         type: String,
//     },
//     charity_contact_address5: {
//         type: String,
//     },
//     charity_contact_postcode: {
//         type: String,
//     },
//     charity_contact_phone: {
//         type: String,
//     },
//     charity_contact_email: {
//         type: String,
//     },
//     charity_contact_web: {
//         type: String,
//     },
//     charity_company_registration_number: {
//         type: String,
//     },
//     charity_insolvent: {
//         type: Boolean,
//         default: false,
//     },
//     charity_in_administration: {
//         type: Boolean,
//         default: false,
//     },
//     charity_previously_excepted: {
//         type: Boolean,
//         default: false,
//     },
//     charity_is_cdf_or_cif: {
//         type: Boolean,
//     },
//     charity_is_cio: {
//         type: Boolean,
//         default: false,
//     },
//     cio_is_dissolved: {
//         type: Boolean,
//         default: false,
//     },
//     date_cio_dissolution_notice: {
//         type: Date,
//     },
//     charity_activities: {
//         type: String,
//         required:false,
//     },
//     charity_gift_aid: {
//         type: Boolean,
//     },
//     charity_has_land: {
//         type: Boolean,
//     },
//     stripe_account_id:String
// }
{
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    taxId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/  // Simple regex to validate email format
    },
    dobDay: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    dobMonth: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    dobYear: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear() // Current year
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    post_code: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    relationshipTitle: {
        type: String,
        required: false
    },
    account_number: {
        type: String,
        required: true
    },
    sort_code: {
        type: String,
        required: true
    },
    front: {
        type: String, // Store file paths or file names
        // required: true
    },
    back: {
        type: String, // Store file paths or file names
        // required: true
    },
    organisation_number: {
        type: String,
        // required: true
    },
    bank:{
        type: String,
        // required: true
    },

    stripe_account_id:String
}
, { timestamps: true });

const Charity = mongoose.model('charity', charitySchema);

module.exports = Charity;