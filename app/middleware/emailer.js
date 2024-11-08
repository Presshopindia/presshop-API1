const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const i18n = require("i18n");
const User = require("../models/user");
const Hopper = require("../models/hopper");
const Admin = require("../models/admin");

const { itemAlreadyExists, buildErrObject } = require("../middleware/utils");
const express = require("express");
var jwt = require("jsonwebtoken");
var path = require("path");
const app = express();
const ejs = require("ejs");
app.set("views", path.join(process.env.SERVER_PATH, "views"));
app.set("view engine", "ejs");

// const __link = "http://appdevelopers.xyz:3001/"

const mailer = require("express-mailer");
const { rejects } = require("assert");
// var bcrypt = require('bcrypt');
mailer.extend(app, {
  from: `${process.env.EMAIL_FROM_APP} <no-reply@presshop.com>`,
  host: process.env.EMAIL_HOST, // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: process.env.EMAIL_TRANSPORT_METHOD, // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD, //protjmsingh//maha@321
  },
});

module.exports = {
  /**
   * Checks User model if user with an specific email exists
   * @param {string} email - user email
   */

  async emailExists(email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email,
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },



  async emailAdminExists(email) {
    return new Promise((resolve, reject) => {
      Admin.findOne(
        {
          email,
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },
  /**
   * Checks User model if user with an specific phone exists
   * @param {string} phone - user phone
   */
  async phoneExists(phone) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          phone,
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "PHONE_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },

  async userNameExists(user_name) {
    return new Promise((resolve, reject) => {
      Hopper.findOne(
        {
          user_name,
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "USERNAME_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },

  async socialIdExists(social_id, social_type) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          social_id,
          social_type,
        },
        (err, item) => {
          if (err) {
            reject(buildErrObject(422, err.message));
          }
          resolve(item);
        }
      ).populate("avatar_id");
    });
  },
  /**
   * Checks User model if user with an specific email exists but excluding user id
   * @param {string} id - user id
   * @param {string} email - user email
   */
  async emailExistsExcludingMyself(id, email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email,
          _id: {
            $ne: id,
          },
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },

  async phoneExistsExcludingMyself(id, phone) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          phone,
          _id: {
            $ne: id,
          },
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },

  async userNameExistsExcludingMyself(id, user_name) {
    return new Promise((resolve, reject) => {
      Hopper.findOne(
        {
          user_name,
          _id: {
            $ne: id,
          },
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, "EMAIL_ALREADY_EXISTS");
          resolve(false);
        }
      );
    });
  },
  async verifyEmail(locale, data) {
    app.mailer.send(`${locale}/verifyEmail`, data, function (err, message) {
      if (err) {
        console.log("There was an error sending the email" + err);
      } else {
        console.log("MAIL SEND");
      }
    });
  },

  async sendAdminResetPasswordEmailMessage(locale, data) {
    app.mailer.send(
      `${locale}/resetPasswordAdmin`,
      {
        to: data.email,
        subject: "Reset Forgot Password",
        OTP: data.forgotPassOTP,
        Link: `${process.env.ADMIN_FRONTEND_URL}#/auth/reset-password/${data._id}`,
      },
      function (err, message) {
        if (err) {
          console.log("There was an error sending the email" + err);
        } else {
          console.log("MAIL SEND");
        }
      }
    );
  },

  async sendHopperResetPasswordOTP(locale, data) {
    app.mailer.send(
      `${locale}/hopperResetPasswordOTP`,
      {
        to: data.email,
        subject: "Reset Forgot Password",
        OTP: data.forgotPassOTP,
      },
      function (err, message) {
        if (err) {
          console.log("There was an error sending the email" + err);
        } else {
          console.log("MAIL SEND");
        }
      }
    );
  },


  async sendEmail(locale, data) {
    app.mailer.send(
      `${locale}/hopperResetPasswordOTP`,
      {
        to: data.email,
        subject: "contact US",
        OTP: data.content
      },
      function (err, message) {
        if (err) {
          console.log("There was an error sending the email" + err);
        } else {
          console.log("MAIL SEND");
        }
      }
    );
  },

  async sendEmailforreply(locale, data) {
    app.mailer.send(
      `${locale}/temp-password`,
      {
        to: data.email,
        subject: "credientials for login for mediahouse employee",
        OTP: data.password,
        first_name:data.first_name
      },
      function (err, message) {
        if (err) {
          console.log("There was an error sending the email" + err);
        } else {
          console.log("MAIL SEND");
        }
      }
    );
  },


  async sendEmailforMediahousepassword(locale, data) {
    app.mailer.send(
      `${locale}/temp-password`,data,
      // {
      //   to: data.email,
      //   subject: "credientials for login for mediahouse User",
      //   OTP: data.password
      // },
      function (err, message) {
        if (err) {
          console.log("There was an error sending the email" + err);
        } else {
          console.log("MAIL SEND");
        }
      }
    );
  },

  async getCurrentDateTime() {
    const now = new Date();

    // Get the time (hours and minutes)
    const hours = now.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if needed
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed

    // Get the date (day, month, and year)
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' }); // Get the month as a full name
    const year = now.getFullYear();

    return `${hours}:${minutes}, ${day} ${month} ${year}`;
  },

  async sendSubAdminCredentials(locale, emailObj) {
    emailObj.dateAndTime = await this.getCurrentDateTime();
    app.mailer.send(
      `${locale}/subAdminCredentials`,
      emailObj,
      function (err, message) {
        if (err) {
          console.log("There was an error sending the email" + err);
        } else {
          console.log("MAIL SEND");
        }
      }
    );
  },

  async sendUserApprovaltoMediaHouse(locale, emailObj) {
    app.mailer.send(
      `${locale}/user_mediaHouse_request`,
      emailObj,
      function (err, message) {
        if (err) {
          console.log("There was an error sending the email" + err);
        } else {
          console.log("MAIL SEND");
        }
      }
    );
  },

  async sendMailToAdministator(locale, Obj) {
   return  new Promise(async (resolve,reject) => {
    app.mailer.send(
      `${locale}/sendMailToAdministator`,
      Obj,
      function (err, message) {
        if (err) {
          
          console.log("There was an error sending the email" + err);
          reject(err)
        } else {
          console.log("MAIL SEND");
          resolve(message)
        }
      }
    );
   })
    // app.mailer.send(
    //   `${locale}/sendMailToAdministator`,
    //   Obj,
    //   function (err, message) {
    //     if (err) {
          
    //       console.log("There was an error sending the email" + err);
    //     } else {
    //       console.log("MAIL SEND");
    //     }
    //   }
    // );
  },
};
