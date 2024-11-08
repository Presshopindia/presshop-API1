const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const validator = require("validator");
const mongoosePaginate = require("mongoose-paginate-v2");


const preRegistrationDataSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required: true,
        
        },
        //onboarding process
        step1:{
            first_name : {
                type: String,
                required: true,
              },
              last_name: {
                type: String,
                required: true,
              },
              password: {
                type: String,
                required: true,
                select: false,
              },
              cnfm_password :{
                type: String,
                required: true,
                select: false,
              },
              check1: {
                type: Boolean,
                default: false,
              },
              check2: {
                type: Boolean,
                default: false,
              },
              check3: {
                type: Boolean,
                default: false,
              },
              check4: {
                type: Boolean,
                default: false,
              },
        },
  

    

    //   office_details: {
    //     company_name: {
    //       type: String,
    //     },
    //     company_number: {
    //       type: String,
    //     },
    //     company_vat: {
    //       type: String,
    //     },
    //     name: {
    //       type: String,
    //     },
    //     address: {
    //       type: String,
    //     },
    //     country_code: {
    //       type: String,
    //     },
    //     phone: {
    //       type: String,
    //     },
    //     website: {
    //       type: String,
    //     },
    //   },
    },

    {
      versionKey: false,
      timestamps: true,
    }
  );

module.exports = mongoose.model("PreRegistrationData", preRegistrationDataSchema);

  