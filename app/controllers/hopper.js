const uuid = require("uuid");
const { matchedData } = require("express-validator");
const utils = require("../middleware/utils");
// const {uploadFiletoAwsS3Bucket} = require("../shared/helpers");
// const ffmpeg = require("ffmpeg");
var sox = require('sox-audio');
const path = require("path");
var command = sox()
const { exec } = require('child_process');
const ffprobepath = require('@ffprobe-installer/ffprobe').path;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobepath);
const db = require("../middleware/db");
const emailer = require("../middleware/emailer");
const __dir = "/var/www/html/VIIP/";
const jwt = require("jsonwebtoken");
const { addHours } = require("date-fns");
const AWS = require("aws-sdk");
const stripe = require("stripe")(
  process.env.STRIPE,
  {
    apiVersion: "2023-10-16",
  }
);

const moment = require("moment");
const { Worker } = require('worker_threads');
const lookup = require('country-code-lookup');
const hopperAlert = require("../models/hopperAlert");
const countrycurrency = require('iso-country-currency');
var mime = require("mime-types");
const auth = require("../middleware/auth");
const sizeOf = require("image-size");
const Jimp = require("jimp");
const fs = require("fs");
const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 5;
const { Buffer } = require("node:buffer");
var mongoose = require("mongoose");
// Models
const Chat = require("../models/chat");
const rating = require("../models/rating");
const Selling_price = require("../models/selling_price");
const hopperPayment = require("../models/hopperPayment");
const StripeAccount = require("../models/stripeAccount");
const priceTipforquestion = require("../models/priceTipsforQuestion");
const Admin = require("../models/admin");
const typeofDocs = require("../models/typeofDocs");
const Faq = require("../models/faqs");
const Privacy_policy = require("../models/privacy_policy");
const Category = require("../models/categories");
const Legal_terms = require("../models/legal_terms");
const Tutorial_video = require("../models/tutorial_video");
const Price_tips = require("../models/price_tips");
const Docs = require("../models/docs");
const User = require("../models/user");
const Hopper = require("../models/hopper");
const PriceTipAndFAQ = require("../models/priceTips_and_FAQS");
const Content = require("../models/contents");
const Uploadcontent = require("../models/uploadContent");
const BroadCastTask = require("../models/mediaHouseTasks");
const AcceptedTasks = require("../models/acceptedTasks");
const AddBrocastContent = require("../models/addBrocastContent");
const FcmDevice = require("../models/fcm_devices");
const Room = require("../models/room");
const Categories = require("../models/categories");
const contact_us = require("../models/contanct_usfor_admin");
const notification = require("../models/notification");
const mostviewed = require("../models/content_view_record_hopper");
const STORAGE_PATH = process.env.STORAGE_PATH;
const STORAGE_PATH_HTTP = process.env.STORAGE_PATH_HTTP;
const notify = require("../middleware/notification");
const { log } = require("node:util");
const HoppersUploadedDocs = require("../models/hoppers_uploaded_media")
const Charity = require("../models/Charity");
const EdenSdk = require('api')('@eden-ai/v2.0#9d63fzlmkek994')
EdenSdk.auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJlNjcxYjQtYzNiNS00OWMyLThlNzItZDg0ODQ2OGMyYzgyIiwidHlwZSI6ImFwaV90b2tlbiJ9.wXT9IoUGBr6JB7OxNvC9alRy4N0jgN_kLXs5n4d4NBY');


const formatAmountInMillion = (amount) => {
  return (Math.floor(amount)?.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  }) + receiveLastTwoDigits(amount) || "")
};


// Receive last 2 digits-
const receiveLastTwoDigits = (number) => {
  return (+(number) % 1)?.toFixed(2)?.toString()?.replace(/^0/, '') > 0 ? (+(number) % 1)?.toFixed(2)?.toString()?.replace(/^0/, '') : ""
}
/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */

const { uploadFiletoAwsS3Bucket, uploadFiletoAwsS3BucketforAudiowatermark, uploadFiletoAwsS3BucketforVideowatermark, uploadFiletoAwsS3BucketforVideowatermarkwithpath } = require("../shared/helpers");
const { Console, error } = require("console");
// const AWS = require("aws-sdk");
const ACCESS_KEY =  process.env.ACCESS_KEY ;//"AKIAVOXE3E6KGIDEVH2F";
const SECRET_KEY = process.env.SECRET_KEY//"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";//process.env.SECRET_KEY
const Bucket = process.env.Bucket ;//"uat-presshope";  //process.env.Bucket
const REGION = process.env.REGION ; //"eu-west-2";
AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});

// const s3 = new AWS.S3();

async function userDetails(data) {

  let USER = await User.findOne({
    _id: data,
  });
  return USER
}



exports._sendNotificationtohopper = async (data) => {
  if (data.notification_type) {
    await FcmDevice.find({
      user_id: mongoose.Types.ObjectId(data.user_id),
    }).then(
      async (fcmTokens) => {
        // if (fcmTokens.length > 0) {
        await User.findOne({ _id: data.user_id }).then(
          async (senderDetail) => {
            if (senderDetail != null) {
              var title = `${data.title}`;
              var message = "";
              var notificationObj = {
                title: title,
                body: data.description,
                data: {
                  user_id: data.user_id,
                  type: data.notification_type,
                  profile_img: data.profile_img,
                  deadline_date: data.deadline_date,
                  distance: data.distance,
                  lat: data.lat,
                  long: data.long,
                  min_price: data.min_price,
                  max_price: data.max_price,
                  task_description: data.task_description,
                  broadCast_id: data.broadCast_id,
                },
              };
              if (data.notification_type == "media_house_tasks") {
                message = data.description;
              }

              notificationObj.message = message;

              if (data.push) {
                const device_token = fcmTokens.map((ele) => ele.device_token);

                delete data.push;
                notificationData = data;
                notify.sendPushNotification(
                  device_token,
                  title,
                  message,
                  notificationData
                );
              }
            } else {
              throw utils.buildErrObject(422, "sender detail is null");
            }
          },
          (error) => {

            throw utils.buildErrObject(422, error);
          }
        );
        // }
      },
      (error) => {
        throw utils.buildErrObject(422, error);
      }
    );
  } else {
    throw utils.buildErrObject(422, "--* no type *--");
  }
};





async function userDetails(data) {

  let USER = await User.findOne({
    _id: data,
  });
  return USER
}




exports._sendNotification = async (data) => {
  if (data.notification_type) {
    await FcmDevice.find({
      where: {
        user_id: data.user_id,
      },
    }).then(
      async (fcmTokens) => {
        // if (fcmTokens.length > 0) {

        await User.findOne({ _id: data.user_id }).then(
          async (senderDetail) => {
            if (senderDetail != null) {
              var title = `${data.title}`;
              var message = "";
              var notificationObj = {
                user_id: data.user_id,
                type: data.notification_type,
                title: title,
              };
              if (data.notification_type == "media_house_tasks") {
                message = `assigned task.`;
              }

              notificationObj.message = message;
              // if (data.create) {
              //   // * create in db
              //   delete data.create;
              //   
              //     "--------------- N O T I - - O B J ------",
              //     notificationObj
              //   );
              //   await models.Notification.create(notificationObj);
              // }

              if (data.push) {
                const device_token = fcmTokens.map((ele) => ele.device_token);

                delete data.push;
                notificationData = data;
                // if (data.driver) {
                //   delete data.driver;
                //   notify.sendPushNotificationDriver(
                //     device_token,
                //     title,
                //     message,
                //     notificationData
                //   );
                // } else {
                notify.sendPushNotification(
                  device_token,
                  title,
                  message,
                  notificationData
                );

                // }

                // * if push notification is required else don't send push notification just create the record
                // for (var i = 0; i < fcmTokens.length; i++) {
                //   delete data.push;
                //   notificationData = data;
                //   notify.sendPushNotification(
                //     fcmTokens[i].device_token,
                //     title,
                //     message,
                //     fcmTokens[i].device_type,
                //     notificationData
                //   );
                // }
              }
            } else {
              throw utils.buildErrObject(422, "sender detail is null");
            }
          },
          (error) => {

            throw utils.buildErrObject(422, error);
          }
        );
        // }
      },
      (error) => {
        throw utils.buildErrObject(422, error);
      }
    );
  } else {
    throw utils.buildErrObject(422, "--* no type *--");
  }
};

const _sendPushNotification = async (data) => {


  if (data) {
    User.findOne({
      _id: data.sender_id,
    }).then(
      async (senderDetail) => {
        if (senderDetail) {
          let body, title;


          // var message = "";
          let notificationObj = {
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            title: data.title,
            body: data.body,
          };
          try {
            const findnotifivation = await notification.findOne(notificationObj)

            if (findnotifivation) {


              await notification.updateOne({ _id: mongoose.Types.ObjectId(findnotifivation._id) }, { timestamp_forsorting: new Date(), is_read: false })
              // const updatedvalue =   await notification.findOneAndUpdate({ _id: mongoose.Types.ObjectId(findnotifivation._id) }, { $set:{createdAt: new Date()}},{ new: true })

            } else {
              const create = await db.createItem(notificationObj, notification);

            }

            // const create = await db.createItem(notificationObj, notification);
            // await db.createItem(notificationObj, notification);
          } catch (err) {
            throw utils.buildErrObject(422, err);
          }



          const log = await FcmDevice.find({
            user_id: data.receiver_id,
          })
            .then(
              (fcmTokens) => {

                if (fcmTokens) {
                  const device_token = fcmTokens.map((ele) => ele.device_token);


                  const r = notify.sendPushNotificationforAdmin(
                    device_token,
                    data.title,
                    data.body,
                    notificationObj
                  );
                  return r;
                } else {

                }
              },
              (error) => {
                throw utils.buildErrObject(422, error);
              }
            )
            .catch((err) => {

            });
        } else {
          throw utils.buildErrObject(422, "sender detail is null");
        }
      },
      (error) => {

        throw utils.buildErrObject(422, error);
      }
    ).catch((err) => {
      throw utils.buildErrObject(422, "--* no type *--");
    })
  } else {
    throw utils.buildErrObject(422, "--* no type *--");
  }
};

async function uploadImage(object) {
  return new Promise((resolve, reject) => {
    var obj = object.image_data;
    var name = Date.now() + obj.name;
    obj.mv(object.path + "/" + name, function (err) {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(name);
    });
  });
}

exports.getUserProfile = async (req, res) => {
  try {
    const userData = await db.getUserProfile(req.user._id, User);

    res.status(200).json({
      code: 200,
      userData: userData,
    });
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};

exports.addUserBankDetails = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;




    const accountid = req.user.stripe_account_id?.toString();

    if (!accountid) {
      return res.status(400).json({ errors: "your account is not succesfully onboard" })
    }

    console.log("user------------------", accountid, "data.account_number", data)
    const bankAccount = await stripe.accounts.createExternalAccount(
      accountid,
      {
        external_account: {
          account_number: data.account_number,  // Replace with the actual account number
          country: "GB",               // Replace with the actual country code (e.g., GB for United Kingdom)
          currency: "gbp",             // Replace with the actual currency code (e.g., GBP for British Pound)
          object: "bank_account",
          account_holder_name: data.acc_holder_name,  // Replace with the actual account holder's name
          account_holder_type: "individual",  // Use "company" or "individual"
          // sort_code: data.sort_code?.toString() , 
          default_for_currency: true//data.is_default
        }
      },
    );

    console.log("bankAccount================", bankAccount)

    data.stripe_bank_id = bankAccount.id

    await Hopper.updateMany(
      {
        _id: mongoose.Types.ObjectId(data.user_id),
      },
      { $set: { "bank_detail.$[].is_default": false } } // Use the $[] operator for all elements
    );

    // await User.updateMany(
    //   {
    //     _id: mongoose.Types.ObjectId(data.user_id),
    //   },
    //   { $set: { "bank_detail.$[].is_default": false} } // Use the $[] operator for all elements
    // );

    data.acc_number = data.account_number
    const addBank = await db.addUserBankDetails(Hopper, data);
    if (data.is_default == "true" || data.is_default == true) {

      const notiObj = {
        sender_id: data.user_id,
        receiver_id: data.user_id,
        // data.receiver_id,
        title: "Payment method updated",
        body: `👋🏼 Hi  ${req.user.user_name}, your payment method is successfully updated 🏦👍🏼 Cheers - Team PRESSHOP🐰 `,
      };
      const resp = await _sendPushNotification(notiObj);
    }






    // {
    //   object: 'bank_account',
    //   country: 'GB',
    //   currency: 'gbp',
    //   account_holder_name: 'John Doe',
    //   account_holder_type: 'individual',
    //   sort_code: '108800', // Replace with actual sort code
    //   account_number: '00012345' // Replace with actual account number
    // }




    res.status(200).json({
      code: 200,
      data: addBank,
      bankDetailAdded: true,
    });
  } catch (error) {
    if (error.type === 'StripeCardError') {
      // Handle card errors (e.g., insufficient funds, invalid card details)
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      // Handle invalid requests (e.g., invalid parameters)
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else if (error.type === 'StripeAPIError') {

      // Handle errors from Stripe's API (e.g., temporary service outages)
      res.status(500).json({
        success: false,
        message: 'Stripe API error, please try again later',
      });
    } else if (error.type === 'StripeConnectionError') {
      // Handle network-related errors (e.g., failed connection to Stripe's servers)
      res.status(502).json({
        success: false,
        message: 'Network error, please try again later',
      });
    } else if (error.type === 'StripeAuthenticationError') {
      // Handle authentication errors (e.g., invalid API keys)
      res.status(401).json({
        success: false,
        message: 'Authentication with Stripe failed',
      });
    } else {

      // Handle any other type of error
      res.status(500).json({
        success: false,
        error: error,
        message: 'An unknown error occurred',
      });
    }
  }
  // 
  // utils.handleError(res, error);
  // }
};

exports.uploadDocToBecomePro = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;


    if (req.files) {
      if (req.files.govt_id) {
        var govt_id = await uploadFiletoAwsS3Bucket({
          fileData: req.files.govt_id,
          path: "public/docToBecomePro",
        });
      }
      if (req.files.photography_licence) {
        var photography_licence = await uploadFiletoAwsS3Bucket({
          fileData: req.files.photography_licence,
          path: `public/docToBecomePro`,
        });
      }
      if (req.files.comp_incorporation_cert) {
        var comp_incorporation_cert = await uploadFiletoAwsS3Bucket({
          fileData: req.files.comp_incorporation_cert,
          path: `public/docToBecomePro`,
        });
      }
      // if (
      //   (req.files.comp_incorporation_cert && req.files.photography_licence) ||
      //   (req.files.photography_licence && req.files.govt_id) ||
      //   (req.files.govt_id && req.files.comp_incorporation_cert)
      // ) {
      // } else {
      //   throw utils.buildErrObject(422, "Please send atleast two documents");
      // }
      const doc_to_become_pro = {
        govt_id: req.files.govt_id ? govt_id.fileName : null,
        govt_id_mediatype: data.govt_id_mediatype ? data.govt_id_mediatype : null,
        photography_licence: req.files.photography_licence ? photography_licence.fileName : null,
        photography_mediatype: data.photography_mediatype ? data.photography_mediatype : null,
        comp_incorporation_cert: req.files.comp_incorporation_cert ? comp_incorporation_cert.fileName : null,
        comp_incorporation_cert_mediatype:
          data.comp_incorporation_cert_mediatype ? data.comp_incorporation_cert_mediatype : null,
        // photography_licence: photography_licence.fileName,
      };
      data.doc_to_become_pro = doc_to_become_pro;
    }

    const docUploaded = await db.updateItem(data.user_id, Hopper, data);

    if (data.doc) data.doc = JSON.parse(data.doc);
    for (let docz of data.doc) {



      const hopperDocs = await HoppersUploadedDocs.findOne({
        doc_id: docz.doc_id,
        hopper_id: req.user._id
      })
      let z;
      if (hopperDocs) {

        z = hopperDocs
      }
      else {

        z = await db.createItem({ hopper_id: req.user._id, doc_id: docz.doc_id }, HoppersUploadedDocs)
      }
    }


    const notiObj = {
      sender_id: req.user._id,
      receiver_id: req.user._id,
      title: "Documents successfully uploaded",
      body: `👋🏼 Hi ${req.user.user_name}, thank you for updating your documents for qualifying as a PRO. Once we finish reviewing, we will get back to you ASAP 👍🏼 Team PRESSHOP🐰`,
      // is_admin:true
    };

    await _sendPushNotification(notiObj);
    const allAdminList = await Admin.findOne({ role: "admin" });
    const notiObj2 = {
      sender_id: req.user._id,
      receiver_id: allAdminList._id,
      title: "Documents successfully uploaded",
      body: `Documents added for becoming a PRO - ${req.user.user_name},has added new documents for becoming a PRO`,
      // is_admin:true
    };

    await _sendPushNotification(notiObj2);
    res.status(200).json({
      code: 200,
      docUploaded: true,
      docData: docUploaded.doc_to_become_pro,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.uploadDocToBecomeProNew = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;


    let uploadedFiles = [];
    // if (req.files && req.files.doc_name) {
    //   let uploadedFile;
    //   let doc_to_become_pro = {};
     


    //   // Check if doc_name is an array of files (multiple files)
    //   if (Array.isArray(req.files.doc_name)) {
    //     // Upload the first file (govt_id)
    //     const govt_id = req.files.doc_name[0]
    //       ? await uploadFiletoAwsS3Bucket({
    //           fileData: req.files.doc_name[0], // First file (index 0)
    //           path: "public/docToBecomePro",
    //         })
    //       : null;
    
    //     if (govt_id) {
    //       await db.createItem({ hopper_id: req.user._id, doc_name: govt_id.fileName }, HoppersUploadedDocs);
    //     }
    
    //     // Upload the second file (photography_licence)
    //     const photography_licence = req.files.doc_name[1]
    //       ? await uploadFiletoAwsS3Bucket({
    //           fileData: req.files.doc_name[1], // Second file (index 1)
    //           path: "public/docToBecomePro",
    //         })
    //       : null;
    
    //     if (photography_licence) {
    //       await db.createItem({ hopper_id: req.user._id, doc_name: photography_licence.fileName }, HoppersUploadedDocs);
    //     }
    
    //     // Upload the third file (comp_incorporation_cert)
    //     const comp_incorporation_cert = req.files.doc_name[2]
    //       ? await uploadFiletoAwsS3Bucket({
    //           fileData: req.files.doc_name[2], // Third file (index 2), if provided
    //           path: "public/docToBecomePro",
    //         })
    //       : null;
    
    //     if (comp_incorporation_cert) {
    //       await db.createItem({ hopper_id: req.user._id, doc_name: comp_incorporation_cert.fileName }, HoppersUploadedDocs);
    //     }
    
    //     // Prepare the doc_to_become_pro object
    //     doc_to_become_pro = {
    //       govt_id: govt_id ? govt_id.fileName : null,
    //       govt_id_mediatype: govt_id ? req.files.doc_name[0].mimetype : null,
    //       photography_licence: photography_licence ? photography_licence.fileName : null,
    //       photography_mediatype: photography_licence ? req.files.doc_name[1].mimetype : null,
    //       comp_incorporation_cert: comp_incorporation_cert ? comp_incorporation_cert.fileName : null,
    //       comp_incorporation_cert_mediatype: comp_incorporation_cert ? req.files.doc_name[2].mimetype : null,
    //     };
    
    //     data.doc_to_become_pro = doc_to_become_pro;
    //     data.user_id = req.user.id;
    //     const docUploaded = await db.updateItem(data.user_id, Hopper, data);
    
    //   } else {
    //     // If doc_name contains a single file (not an array), handle it directly
    //     const govt_id = await uploadFiletoAwsS3Bucket({
    //       fileData: req.files.doc_name,
    //       path: "public/docToBecomePro",
    //     });
    
    //     if (govt_id) {
    //       await db.createItem({ hopper_id: req.user._id, doc_name: govt_id.fileName }, HoppersUploadedDocs);
    //     }
    
    //     doc_to_become_pro = {
    //       govt_id: govt_id ? govt_id.fileName : null,
    //       govt_id_mediatype: govt_id ? req.files.doc_name.mimetype : null,
    //     };
    
    //     data.doc_to_become_pro = doc_to_become_pro;
    //     data.user_id = req.user.id;
    //     const docUploaded = await db.updateItem(data.user_id, Hopper, data);
    //   }
    
    //   console.log("doc_to_become_pro:", doc_to_become_pro);
    // }
    if (req.files && req.files.doc_name) {
      let uploadedFile
console.log("req.files =======",req.files.doc_name)
      // Check if doc_name is an array of files (multiple files)
      if (Array.isArray(req.files.doc_name)) {
        let doc_to_become_pro = {};
        // const govt_id = req.files.doc_name[0]
        //   ? uploadedFile = await uploadFiletoAwsS3Bucket({
        //     fileData: req.files.doc_name[0], // First file (index 0)
        //     path: "public/docToBecomePro",
        //   })
        //    &
        //    console.log("uploadedFile=====",uploadedFile ,req.files.doc_name[0])
        //   // await db.createItem({ hopper_id: req.user._id, doc_name: uploadedFile.fileName }, HoppersUploadedDocs)
        //   : null;
        // const photography_licence = req.files.doc_name[1]
        //   ? uploadedFile = await uploadFiletoAwsS3Bucket({
        //     fileData: req.files.doc_name[1], // Second file (index 1)
        //     path: "public/docToBecomePro",
        //   })
        //   &
        //   await db.createItem({ hopper_id: req.user._id, doc_name: uploadedFile.fileName }, HoppersUploadedDocs)
        //   : null;

        // const comp_incorporation_cert = req.files.doc_name[2]
        //   ? uploadedFile = await uploadFiletoAwsS3Bucket({
        //     fileData: req.files.doc_name[2], // Third file (index 2), if provided
        //     path: "public/docToBecomePro",
        //   })
        //   &
        //   await db.createItem({ hopper_id: req.user._id, doc_name: uploadedFile.fileName }, HoppersUploadedDocs)
        //   : null;



        //   doc_to_become_pro = {
        //     govt_id: govt_id ? govt_id.fileName : null,
        //     govt_id_mediatype: govt_id ? req.files.images[0].mimetype : null,
        //     photography_licence: photography_licence ? photography_licence.fileName : null,
        //     photography_mediatype: photography_licence ? req.files.images[1].mimetype : null,
        //     comp_incorporation_cert: comp_incorporation_cert ? comp_incorporation_cert.fileName : null,
        //     comp_incorporation_cert_mediatype: comp_incorporation_cert ? req.files.images[2].mimetype : null,
        //   };
  
        //   data.doc_to_become_pro = doc_to_become_pro;
        //   data.user_id = req.user.id
        //   const docUploaded = await db.updateItem(data.user_id, Hopper, data);
  
        // Loop through each file in the doc_name array
        for (const file of req.files.doc_name) {
          const uploadedFile = await uploadFiletoAwsS3Bucket({
            fileData: file,
            path: "public/docToBecomePro",
          });

          await db.createItem({ hopper_id: req.user._id, doc_name: uploadedFile.fileName }, HoppersUploadedDocs)
          // Add each uploaded file's URL or data to the uploadedFiles array
          // uploadedFiles.push(uploadedFile);
        }
      } else {
        // If doc_name contains a single file (not an array), upload it directly


        // let doc_to_become_pro = {};
        // const govt_id = req.files.doc_name[0]
        //   ? uploadedFile = await uploadFiletoAwsS3Bucket({
        //     fileData: req.files.doc_name[0], // First file (index 0)
        //     path: "public/docToBecomePro",
        //   })
        //    &
        //   await db.createItem({ hopper_id: req.user._id, doc_id: uploadedFile.fileName }, HoppersUploadedDocs)
        //   : null;

        // const photography_licence = req.files.doc_name[1]
        //   ? uploadedFile = await uploadFiletoAwsS3Bucket({
        //     fileData: req.files.doc_name[1], // Second file (index 1)
        //     path: "public/docToBecomePro",
        //   })
        //   &
        //   await db.createItem({ hopper_id: req.user._id, doc_id: uploadedFile.fileName }, HoppersUploadedDocs)
        //   : null;

        // const comp_incorporation_cert = req.files.doc_name[2]
        //   ? uploadedFile = await uploadFiletoAwsS3Bucket({
        //     fileData: req.files.doc_name[2], // Third file (index 2), if provided
        //     path: "public/docToBecomePro",
        //   })
        //   &
        //   await db.createItem({ hopper_id: req.user._id, doc_id: uploadedFile.fileName }, HoppersUploadedDocs)
        //   : null;



        //   doc_to_become_pro = {
        //     govt_id: govt_id ? govt_id.fileName : null,
        //     govt_id_mediatype: govt_id ? req.files.images[0].mimetype : null,
        //     photography_licence: photography_licence ? photography_licence.fileName : null,
        //     photography_mediatype: photography_licence ? req.files.images[1].mimetype : null,
        //     comp_incorporation_cert: comp_incorporation_cert ? comp_incorporation_cert.fileName : null,
        //     comp_incorporation_cert_mediatype: comp_incorporation_cert ? req.files.images[2].mimetype : null,
        //   };
  
        //   data.doc_to_become_pro = doc_to_become_pro;
        //   data.user_id = req.user.id
        //   const docUploaded = await db.updateItem(data.user_id, Hopper, data);
  

        const uploadedFile = await uploadFiletoAwsS3Bucket({
          fileData: req.files.doc_name,
          path: "public/docToBecomePro",
        });
        await db.createItem({ hopper_id: req.user._id, doc_name: uploadedFile.fileName }, HoppersUploadedDocs)
        // Add the single uploaded file's URL or data to the uploadedFiles array
        // uploadedFiles.push(uploadedFile);
      }

      // Do something with the uploaded files, e.g., save their paths/URLs in the database
      // console.log("Uploaded files: ", uploadedFiles);
    }



    // if (data.doc) data.doc = JSON.parse(data.doc);
    // for (let docz of data.doc) {



    //   const hopperDocs = await HoppersUploadedDocs.findOne({
    //     doc_id: docz.doc_id,
    //     hopper_id: req.user._id
    //   })
    //   let z;
    //   if (hopperDocs) {

    //     z = hopperDocs
    //   }
    //   else {

    //     z = await db.createItem({ hopper_id: req.user._id, doc_id: docz.doc_id }, HoppersUploadedDocs)
    //   }
    // }


    const notiObj = {
      sender_id: req.user._id,
      receiver_id: req.user._id,
      title: "Documents successfully uploaded",
      body: `👋🏼 Hi ${req.user.user_name}, thank you for updating your documents for qualifying as a PRO. Once we finish reviewing, we will get back to you ASAP 👍🏼 Team PRESSHOP🐰`,
      // is_admin:true
    };

    await _sendPushNotification(notiObj);
    const allAdminList = await Admin.findOne({ role: "admin" });
    const notiObj2 = {
      sender_id: req.user._id,
      receiver_id: allAdminList._id,
      title: "Documents successfully uploaded",
      body: `Documents added for becoming a PRO - ${req.user.user_name},has added new documents for becoming a PRO`,
      // is_admin:true
    };

    await _sendPushNotification(notiObj2);
    res.status(200).json({
      code: 200,
      docUploaded: true,
      // docData: docUploaded.doc_to_become_pro,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteuploadDocToBecomePro = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    let docUploaded;

    const finduser = await Hopper.findOne({ _id: data.user_id })
    if (data.govt_id) {
      //  const datas =  {govt_id:null , govt_id_mediatype:null}
      //    docUploaded = await db.updateItem(data.user_id, Hopper, datas);
      docUploaded = await Hopper.findByIdAndUpdate({ _id: data.user_id }, { doc_to_become_pro: { govt_id: null, govt_id_mediatype: null, photography_licence: finduser.doc_to_become_pro.photography_licence, photography_mediatype: finduser.doc_to_become_pro.photography_mediatype, comp_incorporation_cert: finduser.doc_to_become_pro.comp_incorporation_cert, comp_incorporation_cert_mediatype: finduser.doc_to_become_pro.comp_incorporation_cert_mediatype } })
    } else if (data.govt_id && data.photography_licence) {
      docUploaded = await Hopper.findByIdAndUpdate({ _id: data.user_id }, { doc_to_become_pro: { govt_id: null, govt_id_mediatype: null, photography_licence: null, photography_mediatype: null, comp_incorporation_cert: finduser.doc_to_become_pro.comp_incorporation_cert, comp_incorporation_cert_mediatype: finduser.doc_to_become_pro.comp_incorporation_cert_mediatype } })
    } else if (data.govt_id && data.comp_incorporation_cert) {
      docUploaded = await Hopper.findByIdAndUpdate({ _id: data.user_id }, { doc_to_become_pro: { govt_id: null, govt_id_mediatype: null, photography_licence: finduser.doc_to_become_pro.photography_licence, photography_mediatype: finduser.doc_to_become_pro.photography_mediatype, comp_incorporation_cert: null, comp_incorporation_cert_mediatype: null } })
    } else if (data.photography_licence && data.comp_incorporation_cert) {
      docUploaded = await Hopper.findByIdAndUpdate({ _id: data.user_id }, { doc_to_become_pro: { photography_licence: null, photography_mediatype: null, comp_incorporation_cert: null, comp_incorporation_cert_mediatype: null, govt_id: finduser.doc_to_become_pro.govt_id, govt_id_mediatype: finduser.doc_to_become_pro.govt_id_mediatype } })
    } else if (data.photography_licence) {
      docUploaded = await Hopper.findByIdAndUpdate({ _id: data.user_id }, { doc_to_become_pro: { govt_id: finduser.doc_to_become_pro.govt_id, govt_id_mediatype: finduser.doc_to_become_pro.govt_id_mediatype, photography_licence: null, photography_mediatype: null, comp_incorporation_cert: finduser.doc_to_become_pro.comp_incorporation_cert, comp_incorporation_cert_mediatype: finduser.doc_to_become_pro.comp_incorporation_cert_mediatype } })
    } else if (data.comp_incorporation_cert) {
      docUploaded = await Hopper.findByIdAndUpdate({ _id: data.user_id }, { doc_to_become_pro: { govt_id: null, govt_id_mediatype: null, photography_licence: finduser.doc_to_become_pro.photography_licence, photography_mediatype: finduser.doc_to_become_pro.photography_mediatype, comp_incorporation_cert: null, comp_incorporation_cert_mediatype: null } })
    } else {
      docUploaded = await Hopper.findByIdAndUpdate({ _id: data.user_id }, { doc_to_become_pro: { photography_licence: finduser.doc_to_become_pro.photography_licence, photography_mediatype: finduser.doc_to_become_pro.photography_mediatype, comp_incorporation_cert: null, comp_incorporation_cert_mediatype: null, govt_id: null, govt_id_mediatype: null } })
    }
    // const docUploaded = await db.updateItem(data.user_id, Hopper, data);

    const deleted = await HoppersUploadedDocs.deleteMany({ hopper_id: req.user._id, doc_id: data.doc_id })

    res.status(200).json({
      code: 200,
      delete: true,
      data: docUploaded,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.updateBankDetail = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    // if (data.bank_detail && typeof data.bank_detail === "string") {
    //   data.bank_detail = JSON.parse(data.bank_detail);
    //   if (data.bank_detail.is_default == "true" || data.bank_detail.is_default == true) {

    //     const notiObj = {
    //       sender_id: data.user_id,
    //       receiver_id: data.user_id,
    //       // data.receiver_id,
    //       title: "Payment method updated",
    //       body: `👋🏼 Hi  ${req.user.user_name}, your payment method is successfully updated 🏦👍🏼 Cheers - Team PRESSHOP🐰 `,
    //     };
    //     const resp = await _sendPushNotification(notiObj);
    //   }
    // }


    if (data.is_default == "true" || data.is_default == true) {

      const notiObj = {
        sender_id: data.user_id,
        receiver_id: data.user_id,
        // data.receiver_id,
        title: "Payment method updated",
        body: `👋🏼 Hi  ${req.user.user_name}, your payment method is successfully updated 🏦👍🏼 Cheers - Team PRESSHOP🐰 `,
      };
      const resp = await _sendPushNotification(notiObj);
    }

    const accountid = req.user.stripe_account_id?.toString();

    if (!accountid) {
      return res.status(400).json({ errors: "your account is not succesfully onboard" })
    }

    // const arr =[]
    //     arr.push(data.bank_detail)

    //     const newArray = arr.map((x) => ({
    //       account_holder_name:x.acc_holder_name,
    //       bank_name:x.bank_name,
    //       account_number:x.acc_number,
    //       sort_code:x.sort_code,
    //       stripe_bank_id:x.stripe_bank_id,
    //       is_default:x.is_default
    //     }
    //   ))


    const obj = {
      metadata: {
        order_id: '6735',
      }
      // default_for_currency: false,
    }




    const externalAccount = await stripe.accounts.updateExternalAccount(
      accountid,
      data.stripe_bank_id?.toString(),
      obj
    );

    // for (const iterator of newArray) {

    // }


    await Hopper.updateMany(
      {
        _id: mongoose.Types.ObjectId(data.user_id),
      },
      { $set: { "bank_detail.$[].is_default": false } } // Use the $[] operator for all elements
    );


    const updateBank = await db.updateBankDetail(Hopper, data);
    res.status(200).json({
      code: 200,
      bankDetailUpdated: updateBank,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteBankDetail = async (req, res) => {
  try {
    const data = req.params;
    data.user_id = req.user._id;
    const updateBank = await db.deleteBankDetail(Hopper, data);
    const accountid = req.user.stripe_account_id?.toString();


    if (!accountid) {
      return res.status(400).json({ errors: "your account is not succesfully onboard" })
    }



    const deleted = await stripe.accounts.deleteExternalAccount(
      accountid,
      data.stripe_bank_id?.toString()
    );

    res.status(200).json({
      code: 200,
      bankDetailDeleted: updateBank,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getBankList = async (req, res) => {
  try {
    const data = req.params;
    data.user_id = req.user._id;
    const bankList = await db.getBankList(Hopper, data);

    res.status(200).json({
      code: 200,
      bankList: bankList ? bankList : [],
    });
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};

exports.editHopper = async (req, res) => {
  try {
    const data = req.body;
    data.hopper_id = req.user._id;
    const [
      doesEmailExistsExcludingMyself,
      doesPhoneExixtsExcludingMyself,
      doesUserNameExistsExcludingMyself,
    ] = await Promise.all([
      emailer.emailExistsExcludingMyself(data.hopper_id, data.email),
      emailer.phoneExistsExcludingMyself(data.hopper_id, data.phone),
      emailer.userNameExistsExcludingMyself(data.hopper_id, data.user_name),
    ]);
    if (
      !doesEmailExistsExcludingMyself &&
      !doesPhoneExixtsExcludingMyself &&
      !doesUserNameExistsExcludingMyself
    ) {
      if (req.files) {
        if (req.files.profile_image) {
          let audio_description = await uploadFiletoAwsS3Bucket({
            fileData: req.files.profile_image,
            path: `public/userImages`,
          });
          data.profile_image = audio_description.fileName;



          // if (req.files.profile_image) {
          //   data.profile_image = await utils.uploadFile({
          //     fileData: req.files.profile_image,
          //     path: `${STORAGE_PATH}/userImages`,
          //   });
        }
      }


      const notiObj = {
        sender_id: data.hopper_id,
        receiver_id: data.hopper_id,
        title: "Your profile is updated",
        body: `👋🏼 Hi ${req.user.user_name}, your updated profile is looking fab🤩 Cheers - Team PRESSHOP 🐰`,
        // is_admin:true
      };

      await _sendPushNotification(notiObj);

      if (data.latitude && data.longitude) {
        data.location = {};
        data.location.type = "Point";
        data.location.coordinates = [
          Number(data.longitude),
          Number(data.latitude),
        ];

        // const updatedBankAccount = await updateItem(Address, { _id: mongoose.Types.ObjectId(findEventDetails.event_location) }, data);
      }

      const editHopper = await db.updateItem(data.hopper_id, Hopper, data);

      res.status(200).json({
        code: 200,
        data: editHopper,
      });

      const filesToDelete = [];
      if (data.old_profile_image) {
        filesToDelete.push(
          utils.deleteFile({
            path: `${STORAGE_PATH}/userImages`,
            fileName: data.old_profile_image,
          })
        );
      }

      Promise.all(filesToDelete);
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};


async function explicitContent(data) {
  return new Promise((resolve, reject) => {
    var obj = object.image_data;
    var name = Date.now() + obj.name;
    obj.mv(object.path + "/" + name, function (err) {
      if (err) {
        //
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(name);
    });
  });
}



exports.generateThumbnail = async (videoPath, outputLocation) => {
  videoPath = encodeURI(videoPath)
  console.log("vidoePath", videoPath)
  return new Promise((resolve, reject) => {
    const thumbnailFilename = Date.now() + 'thumbnail.png';
    const outputDirectory = `${process.env.SERVER_STORAGE_PATH}/${outputLocation}`;
    ffmpeg(videoPath)
      .on('end', async () => {
        //comment for s3
        // resolve(path.join(outputLocation, thumbnailFilename));
        //comment for s3
        //uncomment for s3
        const filePath = path.join(outputDirectory, thumbnailFilename)
        const thumbnailBuffer = fs.readFileSync(filePath)
        fs.unlinkSync(filePath);
        const file = {
          name: thumbnailFilename,
          data: thumbnailBuffer,
          mimetype: "image/webp"
        };
        const basePath = `${process.env.STORAGE_PATH}/post`;
        let media = await uploadVideo({
          file: file,
          path: basePath,
        });
        resolve(`post/${media}`)
        //uncomment for s3
      })
      .on('error', (err) => {
        reject(err);
      })
      .screenshots({
        timestamps: ['50%'],
        filename: thumbnailFilename,
        size: '320x240',
        folder: outputDirectory
      });
  });
}

exports.addContent = async (req, res) => {
  try {
    const data = req.body;
    data.hopper_id = req.user._id;

    // EdenSdk.text_moderation_create({
    //   response_as_dict: true,
    //   attributes_as_list: false,
    //   show_original_response: false,
    //   providers: 'microsoft,openai,google,clarifai',
    //   language: 'en',
    //   text: data.description
    // })
    //   .then(({ data }) => 
    //   .catch(err => console.error(err));



    if (req.user.stripe_status == 0 || req.user.stripe_status == "0") {

      throw utils.buildErrObject(
        422,
        `not verified`
      );
    }

    if (req.files) {
      if (req.files.audio_description) {
        let audio_description = await uploadFiletoAwsS3Bucket({
          fileData: req.files.audio_description,
          path: `public/contentData`,
        });
        data.audio_description = audio_description.fileName;
      }
    }
    if (data.tag_ids && typeof data.tag_ids === "string") {
      data.tag_ids = JSON.parse(data.tag_ids);
    }
    let multipleImgs = []
    let singleImg = []

    const screenshotTime = '00:00:01'; // Default to 5 seconds
    const outputDir = 'contentData';
    const outputFileName = `${Date.now()}_screenshot.png`;
    const outputPath = path.join(outputDir, outputFileName);
    // if (req.files && Array.isArray(req.files.images)) {
    //   for await (const imgData of req.files.images) {
    //     const data = await utils.uploadFile({
    //       fileData: imgData,
    //       path:`public/contentData`,// `${path}`,
    //     });

    //     const split = data.media_type.split("/");
    //     const extention = split[1];


    // if(extention == "video"){
    //   const paths = `/var/www/mongo/presshop_rest_apis/public/contentData/${data.fileName}`
    //   await new Promise((resolve, reject) => {
    //     ffmpeg(paths)
    //       .on('end', async () => {
    //         // Remove the uploaded video file after processing
    //         fs.unlinkSync(paths);
    //         const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/${outputDir}/${outputFileName}`
    //         const buffer1 = await fs.readFileSync(outputFilePathsameduration);
    //         const value = mime.lookup(`.png`)
    //         let audio_description = await uploadFiletoAwsS3BucketforVideowatermark({
    //           fileData: buffer1,
    //           path: `public/contentData`,
    //           mime_type: value
    //         });
    //         resolve();
    //       })
    //       .on('error', (err) => {
    //         reject(err);
    //       })
    //       .takeScreenshots({
    //         count: 1,
    //         timemarks: [screenshotTime], // Specifies the time to capture the thumbnail
    //         filename: outputFileName,
    //         folder: outputDir,
    //         // size: '320x240' // Optional: Specify the size of the thumbnail
    //       });
    //   });
    // }




    //     multipleImgs.push({media:`${data.fileName}` , media_type:extention});


    //   }
    // } else if (req.files && !Array.isArray(req.files.images)) {


    //   const data = await utils.uploadFile({
    //     fileData: req.files.images,
    //     path: `public/contentData`,//`${path}`,
    //   });



    //   // const split = data.media_type.split("/");
    //   // const extention = split[1];


    //   const split = data.media_type.split("/");
    //   const media_type = split[0];

    //   singleImg.push(

    //     {media:`${data.fileName}` , media_type:media_type}
    //     // `${data.fileName}`
    //   );

    // }


    if (req.files && Array.isArray(req.files.images)) {
      // Handle multiple file uploads
      for await (const imgData of req.files.images) {
        const data = await utils.uploadFile({
          fileData: imgData,
          path: `public/contentData`,
        });

        const split = data.media_type.split("/");
        const extention = split[1];
        const media_type = split[0];
        console.log("extention====", extention)
        if (media_type == "video") {
          const videoPath = `/var/www/mongo/presshop_rest_apis/public/contentData/${data.fileName}`;
          const thumbnailPath = `/var/www/mongo/presshop_rest_apis/${outputDir}/${outputFileName}`;

          await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
              .on('end', async () => {
                // Remove the uploaded video file after processing
                fs.unlinkSync(videoPath);

                const buffer1 = await fs.readFileSync(thumbnailPath);
                const value = mime.lookup('.png');

                // Upload the thumbnail to S3 or the relevant location
                let thumbnailData = await uploadFiletoAwsS3BucketforVideowatermarkwithpath({
                  fileData: buffer1,
                  path: `public/contentData`,
                  mime_type: value,
                });

                // Add video and thumbnail to multipleImgs array
                multipleImgs.push({
                  media: `${data.fileName}`,   // Video file
                  media_type: media_type,
                  thumbnail: thumbnailData.fileName, // Thumbnail image
                });

                resolve();
              })
              .on('error', (err) => {
                reject(err);
              })
              .takeScreenshots({
                count: 1,
                timemarks: [screenshotTime], // Time to capture thumbnail
                filename: outputFileName,
                folder: outputDir,
              });
          });
        } else {
          // If it's not a video, just add the image to multipleImgs array
          multipleImgs.push({ media: `${data.fileName}`, media_type: media_type });
        }
      }
    } else if (req.files && !Array.isArray(req.files.images)) {
      // Handle single file upload
      const data = await utils.uploadFile({
        fileData: req.files.images,
        path: `public/contentData`,
      });

      const split = data.media_type.split("/");
      const media_type = split[0];

      if (media_type == "video") {
        const videoPath = `/var/www/mongo/presshop_rest_apis/public/contentData/${data.fileName}`;
        const thumbnailPath = `/var/www/mongo/presshop_rest_apis/${outputDir}/${outputFileName}`;

        await new Promise((resolve, reject) => {
          ffmpeg(videoPath)
            .on('end', async () => {
              // Remove the uploaded video file after processing
              fs.unlinkSync(videoPath);

              const buffer1 = await fs.readFileSync(thumbnailPath);
              const value = mime.lookup('.png');

              // Upload the thumbnail to S3 or the relevant location
              let thumbnailData = await uploadFiletoAwsS3BucketforVideowatermarkwithpath({
                fileData: buffer1,
                path: `public/contentData`,
                mime_type: value,
              });

              // Add video and thumbnail to multipleImgs array
              singleImg.push({
                media: `${data.fileName}`,   // Video file
                media_type: media_type,
                thumbnail: thumbnailData.fileName, // Thumbnail image
              });

              resolve();
            })
            .on('error', (err) => {
              reject(err);
            })
            .takeScreenshots({
              count: 1,
              timemarks: [screenshotTime], // Time to capture thumbnail
              filename: outputFileName,
              folder: outputDir,
            });
        });
      } else {
        // If it's not a video, just add the image to multipleImgs array
        singleImg.push({ media: `${data.fileName}`, media_type: media_type });
        // multipleImgs.push({ media: `${data.fileName}`, media_type: media_type });
      }



    }


    console.log("JSON.parse(data.media)  = ",)
    data.content = Array.isArray(req.files?.images) ? multipleImgs : singleImg //?    singleImg.length > 0 ? singleImg : JSON.parse(data.media): JSON.parse(data.media)
    // data.content = Array.isArray(req.files.images) ? multipleImgs :  !Array.isArray(req.files?.images) ? singleImg : JSON.parse(data.media)
    // const videospath = data.content.filter((x) => x.media_type == "video").map((x) => x.media)
    // if(videospath.length >0 ) {


    //   for (const x of videospath) {

    //   }
    // }


    // JSON.parse(data.media);

    const filterAndCountMediaTypes = (content) => {
      const counts = {
        image: 0,
        video: 0,
        audio: 0,
        other: 0
      };

      content.forEach(item => {
        if (item.media_type === "image" || item.media_type === "video" || item.media_type === "audio") {
          counts[item.media_type]++;
        } else {
          counts.other++;
        }
      });

      return counts;
    };

    const mediaTypeCounts = filterAndCountMediaTypes(data.content);
    data.image_count = mediaTypeCounts.image
    data.video_count = mediaTypeCounts.video,
      data.audio_count = mediaTypeCounts.audio,
      data.other_count = mediaTypeCounts.other
    // { image: 1, video: 1, audio: 1, other: 1 }

    if (!data.firstLevelCheck) {
      let firstLevelCheck = {
        nudity: false,
        isAdult: false,
        isGDPR: false,
      };
      data.firstLevelCheck = firstLevelCheck;
    }


    const mediahouse = await userDetails(data.hopper_id)
    const additionvat = parseInt(data.ask_price) * 0.20
    const askprice = parseInt(data.ask_price)
    data.ask_price = parseInt(askprice) + additionvat
    data.original_ask_price = askprice


    const product = await stripe.products.create({
      name: data.description,
      // metadata:{
      //   content_id:addedContent._id
      // }
    });
    data.product_id = product.id
    const addedContent = await db.createItem(data, Content);
    res.status(200).json({
      code: 200,
      data: addedContent,
    });


    // const imageNames = addedContent.content.filter(item => item.media_type === 'image').map(item => item.media);


    // for (const x of imageNames) {


    //   const checkexplicity = await EdenSdk.image_explicit_content_create({
    //     response_as_dict: true,
    //     attributes_as_list: false,
    //     show_original_response: false,
    //     providers: 'amazon,microsoft',
    //     file_url: `https://uat-cdn.presshop.news/public/contentData/${x}`
    //   }).then(async (response) => {
    //     const item = response?.data?.microsoft?.nsfw_likelihood;
    //     console.log("item============", item)

    //     if (item >= 3) {

    //       const updatecontectifexpicy = await Content.findOneAndUpdate({ _id: mongoose.Types.ObjectId(addedContent._id) }, { $set: { status: "blocked" } }, { new: true })
    //       // return res.status(404).send({ code: 400, message: "This content has been blocked, and cannot be published as it violates our content guidelines.Please contact us to discuss, or seek any clarification. Thanks" });
    //     } else {


    //     }
    //   })
    // }


    // const VideoNames = addedContent.content.filter(item => item.media_type === 'video').map(item => ({
    //   watermark: item.watermark,
    //   id: item._id
    // }));

    // if (VideoNames.length > 0) {

    //   for (let i = 0; i < VideoNames.length; i++) {
    //     const element = VideoNames[i];
    //     console.log("element==============>>>>>>", element)
    //     const split = element.watermark.split(".");
    //     console.log("split==============>>>>>>", split)
    //     const extention = split[1];
    //     const randomname = Math.floor(1000000000 + Math.random() * 9000000000)
    //     const randomname2 = Math.floor(100 + Math.random() * 900)
    //     // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
    //     const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp4`
    //     const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${element.watermark}`;
    //     // await  main1(inputFile ,outputFileforconvertion)
    //     // fs.unlinkSync(inputFile)

    //     const Audiowatermak = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`
    //     const imageWatermark = `/var/www/mongo/presshop_rest_apis/public/Watermark/newLogo.png`
    //     const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${randomname + randomname2}.${extention}`
    //     // 
    //     // await modify3addWatermarkToAudio(outputFileforconvertion,outputFilePath,outputFilePathsameduration)
    //     const value = mime.lookup(`.${extention}`)

    //     await addWatermarkToVideo(inputFile, imageWatermark, undefined, outputFilePathsameduration)
    //     const buffer1 = await fs.readFileSync(outputFilePathsameduration);
    //     let audio_description = await uploadFiletoAwsS3BucketforVideowatermark({
    //       fileData: buffer1,
    //       path: `public/userImages`,
    //       mime_type: value
    //     });

    //     fs.unlinkSync(outputFilePathsameduration)
    //     // fs.unlinkSync(inputFile)

    //     const final = audio_description.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);
    //     console.log("final------------------------>>>>>>>>>>", final)
    //     const updatecontectifexpicy = await Content.updateOne({
    //       _id: mongoose.Types.ObjectId(addedContent._id),
    //       "content._id": mongoose.Types.ObjectId(element.id),
    //     },
    //       { $set: { "content.$.watermark": final } }, { new: true })

    //     // fs.unlinkSync(inputFile)
    //   }

    // }
















    // const updatecontectifexpicy = await Content.findOneAndUpdate({ _id: mongoose.Types.ObjectId(addedContent._id) }, { $set: { product_id:product.id} }, { new: true })

    const allAdminList = await Admin.findOne({ role: "admin" });
    // const notiObj = {
    //   sender_id: data.hopper_id,
    //   receiver_id: data.hopper_id,
    //   // data.receiver_id,
    //   title: "Content successfully uploaded",
    //   body: `Hey ${mediahouse.user_name}, your content is successfully uploaded 🤩 Please track any offers from the publications, or receipt of funds on My Tasks . Happy selling 💰 🙌🏼`,
    // };


    // const resp = await _sendPushNotification(notiObj);
    const notiObj2 = {
      sender_id: data.hopper_id,
      receiver_id: "64bfa693bc47606588a6c807",
      // data.receiver_id,
      title: "Content uploaded",
      body: `Content uploaded -${mediahouse.user_name} has uploaded a new content for £${formatAmountInMillion(data.ask_price)}`,
    };


    const resp2 = await _sendPushNotification(notiObj2);

    // const updatecontectifexpicy = await Content.findOneAndUpdate({ _id: mongoose.Types.ObjectId(addedContent._id) }, { $set: { product_id: product } }, { new: true })

    // if (data.is_draft == true) {

    //   const addedContent = await db.createItem(data, Content);
    //   res.status(200).json({
    //     code: 200,
    //     data: addedContent,
    //   });
    // } else {

    // }
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.getContentById = async (req, res) => {
  try {
    const data = req.params;
    const contentDetail = await db.getContentById(data.content_id, Content);

    res.status(200).json({
      code: 200,
      contentDetail: contentDetail,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getContentList = async (req, res) => {
  try {
    const data = req.query;
    const role = req.user.role;
    const userId = req.user._id;
    const { contentList, totalCount } = await db.getContentListforHopper(
      Content,
      data,
      userId,
      role
    );

    let Publishedvalue, restvalue;
    if (data.is_draft == "false" || data.is_draft == false) {
      Publishedvalue = await contentList.filter((x) => x.status == "published" && x.is_deleted == false && x.paid_status == "un_paid" && x.paid_status_to_hopper == false)
      restvalue = await contentList.filter((x) => x.status == "published" && x.is_deleted == false && x.paid_status == "paid")

    } else {
      Publishedvalue = await contentList.filter((x) => x.is_draft == "true" || x.is_draft == true)
      restvalue = await contentList.filter((x) => x.status == "published" && x.is_deleted == false && x.paid_status == "paid")
    }


    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      contentList: [...Publishedvalue, ...restvalue],// contentList,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getDraftContentDetail = async (req, res) => {
  try {
    const data = req.params;
    const draftDetails = await Content.findOne({
      _id: mongoose.Types.ObjectId(data.content_id),
    });

    res.json({
      code: 200,
      data: draftDetails,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.tasksAssignedByMediaHouse = async (req, res) => {
  try {
    const data = {
      latitude: req.user.latitude,
      longitude: req.user.longitude,
      hopper_id: req.user._id,
    };
    const tasks = await db.tasksAssignedByMediaHouse(
      data,
      BroadCastTask,
      AcceptedTasks
    );

    res.json({
      code: 200,
      tasks: tasks,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.tasksAssignedByMediaHouseByBroadCastId = async (req, res) => {
  try {
    // const task = await BroadCastTask.findOne({
    //   _id: req.params.brodcast_id,
    // }).populate({ path: "mediahouse_id", select: "admin_detail _id" });
    const condition = {
      _id: mongoose.Types.ObjectId(req.params.brodcast_id),
    };
    const task = await BroadCastTask.aggregate([
      {
        $match: condition,
      },
      {
        $lookup: {
          from: "users",
          localField: "mediahouse_id",
          foreignField: "_id",
          as: "mediahouse_id",
        },
      },
      {
        $unwind: "$mediahouse_id",
      },
      {
        $lookup: {
          from: "uploadcontents",
          localField: "_id",
          foreignField: "task_id",
          as: "uploaded_content",
        },
      },
    ]);

    var resp = await Room.findOne({
      // $and: [
      //   {
      //     task_id: mongoose.Types.ObjectId(req.query.task_id),
      //   },
      //   {
      //     receiver_id: mongoose.Types.ObjectId(req.query.receiver_id),
      //   },
      // ],
      $or: [
        {
          $and: [
            {
              task_id: mongoose.Types.ObjectId(req.params.brodcast_id),
            },
            {
              sender_id: mongoose.Types.ObjectId(req.user._id),
            },
          ],
        },
      ],
    });
    res.json({
      code: 200,
      task: task[0],
      resp: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

// exports.tasksRequest = async (req, res) => {
//   try {
//     const data = req.body;
//     data.hopper_id = req.user._id;

//     //  const device = await db.getItemCustom({ task_status: "accepted"}, AcceptedTasks);
//     const device = await AcceptedTasks.find({
//       task_status: "accepted",
//       task_id: req.body.task_id,
//     });
//     const devices = await AcceptedTasks.find({
//       // task_status: "accepted",
//       task_id: req.body.task_id,
//       hopper_id: data.hopper_id,
//     });
//     if (devices.length < 1) {
//       if (device.length < 5) {
//         const findsameuseracceptedtask = await AcceptedTasks.findOne({
//           task_status: "accepted",
//           task_id: req.body.task_id,
//           hopper_id: data.hopper_id
//         });
//         if (findsameuseracceptedtask) {
//           return res.status(400).json({ code: 400, data: "Already Accepted" })
//         }
//         const taskApproval = await AcceptedTasks.create(data);
//         const mediahoused = await userDetails(data.mediahouse_id)
//         const hopperD = await userDetails(data.hopper_id)
//         if (data.task_status == "accepted") {
//           const notiObj = {
//             sender_id: data.hopper_id,
//             receiver_id: data.mediahouse_id,
//             // data.receiver_id,
//             title: "Task accepted ",
//             body: `Fab 🎯🙌🏼 You have accepted a task from ${mediahoused.first_name} . Please visit My Tasks on your app to navigate to the location, and upload pics, videos or interviews. Good luck, and if you need any support, please use the Chat module to instantly reach out to us🐰  `,
//           };

//           const resp = await _sendPushNotification(notiObj);

//           const notiObj1 = {
//             sender_id: data.hopper_id,
//             receiver_id: data.mediahouse_id,
//             // data.receiver_id,
//             title: "Task accepted ",
//             body: `🔔 🔔 Good news 👍🏼 Your task has been accepted by our Hoppers🐰 Please visit the Tasks section on the platform to view uploaded content.  If you need any assistance with your task, please call, email or use the instant chat module to speak with our helpful team 🤩`,
//           };
//           const resp2 = await _sendPushNotification(notiObj1);

//           const allAdminList = await Admin.find({ role: "admin" });

//           const notiObj11 = {
//             sender_id: data.hopper_id,
//             receiver_id: allAdminList._id,
//             // data.receiver_id,
//             title: "Task accepted ",
//             body: `Task accepted - ${hopperD.user_name} has accepted the task from ${mediahoused.first_name}`,
//           };
//           const resp21 = await _sendPushNotification(notiObj11);


//           const update = await BroadCastTask.updateOne(
//             { _id: data.task_id },
//             { $push: { accepted_by: data.hopper_id } }
//           );

//           const TaskCreated = await BroadCastTask.findOne({ _id: req.body.task_id });
//           if (TaskCreated.accepted_by.length >= 5) {
//             return res.json({ code: 200, data: TaskCreated, message: "Task already accepted by 5 or more users." });
//           }



//           res.json({
//             code: 200,
//             data: taskApproval,
//           });
//         } else {
//           
//         }

//         // const update = await BroadCastTask.updateOne(
//         //   { _id: data.task_id },
//         //   { $set: { accepted_by: data.hopper_id } }
//         // );
//       } else {
//         const findsameuseracceptedtask = await AcceptedTasks.findOne({
//           task_status: "accepted",
//           task_id: req.body.task_id,
//           hopper_id: data.hopper_id
//         });
//         if (findsameuseracceptedtask) {
//           return res.status(400).json({ code: 400, data: "Already Accepted" })
//         } else {

//           const taskApproval = await AcceptedTasks.create(data);
//           res.status(200).json({
//             code: 200,
//             data: taskApproval,
//           });
//         }

//         // throw utils.buildErrObject(422, "unable to accept the task");
//       }
//     } else {

//       const taskApproval = await AcceptedTasks.create(data);
//       res.json({
//         code: 200,
//         data: taskApproval,
//       });
//       // throw utils.buildErrObject(422, "unable to accept the task");
//     }
//   } catch (err) {
//     utils.handleError(res, err);
//   }
// };



exports.tasksRequest = async (req, res) => {
  try {
    const data = req.body;


    data.hopper_id = req.user._id;

    // Check if the task has been accepted by the same user
    const sameUserAcceptedTask = await AcceptedTasks.findOne({
      task_status: "accepted",
      task_id: data.task_id,
      hopper_id: data.hopper_id,
    });

    // Task Details 
    const taskDetails = await BroadCastTask.findOne({
      _id: mongoose.Types.ObjectId(data.task_id),
    });


    if (sameUserAcceptedTask) {
      return res.status(400).json({ code: 400, data: "Already Accepted" });
    }

    // Check how many users have accepted the task
    const acceptedTasks = await AcceptedTasks.find({
      task_status: "accepted",
      task_id: data.task_id,
    });

    if (acceptedTasks.length >= 5) {
      return res.status(200).json({ code: 200, message: "Task already accepted by 5 or more users." });
    }

    // Accept the task
    const taskApproval = await AcceptedTasks.create(data);

    // Send notifications
    if (data.task_status === "accepted") {
      const mediaHouse = await userDetails(taskDetails.mediahouse_id);
      const hopper = await userDetails(data.hopper_id);

      const notifications = [
        {
          sender_id: data.hopper_id,
          receiver_id: data.hopper_id,
          title: "Task accepted",
          body: `Fab 🎯🙌🏼 You have accepted a task from ${mediaHouse.company_name}. Please visit My Tasks on your app to navigate to the location, and upload pics, videos, or interviews. Good luck, and if you need any support, please use the Chat module to instantly reach out to us🐰`,
        },
        {
          sender_id: data.hopper_id,
          receiver_id: taskDetails.mediahouse_id,
          title: "Task accepted",
          body: `🔔 🔔 Good news 👍🏼 Your task has been accepted by our Hoppers🐰 Please visit the Tasks section on the platform to view uploaded content. If you need any assistance with your task, please call, email or use the instant chat module to speak with our helpful team 🤩`,
        },
      ];

      const allAdminList = await Admin.find({ role: "admin" });
      notifications.push({
        sender_id: data.hopper_id,
        receiver_id: allAdminList.map(admin => admin._id),
        title: "Task accepted",
        body: `Task accepted - ${hopper.user_name} has accepted the task from ${mediaHouse.company_name}`,
      });

      await Promise.all(notifications.map(noti => _sendPushNotification(noti)));

      // Update the task's accepted_by field
      await BroadCastTask.updateOne(
        { _id: data.task_id },
        { $push: { accepted_by: data.hopper_id } }
      );
    }

    res.status(200).json({ code: 200, data: taskApproval });
  } catch (err) {
    utils.handleError(res, err);
  }
};
// exports.getAllacceptedTasks = async (req, res) => {
//   try {
//     const data = req.query;
//     const condition = {
//       hopper_id: req.user._id,
//       deadline_date: {$gte: new Date()}
//     };
//     const condition1 = {
//       updatedAt: -1,
//     };

//     // data.user_id = req.user._id;
//     // const limit = data.limit ? parseInt(data.limit) : 5;
//     // const offset = data.offset ? parseInt(data.offset) : 0;

//     if (data.paid_status == "paid") {
//       //give any status results when user wants its draft results
//       // "uploaded_content.$.paid_status" = data.first_name
//       condition["uploaded_content.$.paid_status"] = true;
//     }

//     if (data.paid_status == "un_paid") {
//       //give any status results when user wants its draft results
//       // "uploaded_content.$.paid_status" = data.first_name
//       condition["uploaded_content.$.paid_status"] = false;
//     }

//     if (data.hightolow == "-1") {
//       //give any status results when user wants its draft results
//       // "uploaded_content.$.paid_status" = data.first_name
//       condition1.total_payment = -1;
//     }

//     if (data.lowtohigh == "1") {
//       //give any status results when user wants its draft results
//       // "uploaded_content.$.paid_status" = data.first_name
//       condition1.total_payment = 1;
//     }
//     if (data.posted_date) {
//       data.posted_date = parseInt(data.posted_date);
//       const today = new Date();
//       const days = new Date(
//         today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
//       );
//       
//       condition.createdAt = { $gte: days };
//     }


//     
//     // const taskApproval = await AcceptedTasks.find(condition)
//     //   .populate("task_id")
//     //   .populate({
//     //     path: "task_id",
//     //     populate: {
//     //       path: "mediahouse_id",
//     //     },
//     //   })
//     //   .sort({ updatedAt: -1 })
//     //   .limit(parseInt(data.limit))
//     //   .skip(parseInt(data.offset));

//     const uses = await AcceptedTasks.aggregate([
//       {
//         $lookup: {
//           from: "uploadcontents",
//           localField: "task_id",
//           foreignField: "task_id",
//           as: "uploaded_content",
//         },
//       },

//       {
//         $match: condition,
//       },
//       // {
//       //   $lookup: {
//       //     from: "tasks",
//       //     localField: "task_id",
//       //     foreignField: "_id",
//       //     as: "task_id",
//       //   },
//       // },

//       {
//         $lookup: {
//           from: "tasks",
//           let: { assign_more_hopper_history: "$task_id" },
//           // let: { assign_more_hopper_history: "$accepted_by" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [{ $eq: ["$_id", "$$assign_more_hopper_history"] }],
//                 },
//               },
//             },
//             {
//               $lookup: {
//                 from: "users",
//                 localField: "mediahouse_id",
//                 foreignField: "_id",
//                 as: "mediahouse_id",
//               },
//             },
//             { $unwind: "$mediahouse_id" },
//           ],
//           as: "task_id",
//         },
//       },

//       { $unwind: "$task_id" },
//       {
//         $lookup: {
//           from: "users",
//           localField: "hopper_id",
//           foreignField: "_id",
//           as: "hopper_id",
//         },
//       },
//       { $unwind: "$hopper_id" },

//       {
//         $addFields: {
//           total_payment: { $sum: "$uploaded_content.amount_paid" },
//         },
//       },
//       {
//         $sort: condition1,
//       },
//       // {
//       //   $skip: Number(data.offset),
//       // },
//       // {
//       //   $limit: Number(data.limit),
//       // },
//     ]);

//     // if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
//     //   uses.push(
//     //     {
//     //       $skip: Number(data.offset),
//     //     },
//     //     {
//     //       $limit: Number(data.limit),
//     //     },
//     //   );
//     // }
//     // uses.push()
//     res.json({
//       code: 200,
//       data: uses,
//     });
//   } catch (err) {
//     utils.handleError(res, err);
//   }
// };
exports.getAllacceptedTasks = async (req, res) => {
  try {
    const data = req.query;
    const today = new Date()



    let condition = {
      hopper_id: mongoose.Types.ObjectId(req.user._id)
    };

    let cond2 = {};
    if (data.status == "live") {
      cond2 = {
        $expr: {
          $and: [{ $gte: ["$task_id.deadline_date", today] },],
        },
      }
    }

    const condition1 = {
      updatedAt: -1,
    };

    // data.user_id = req.user._id;
    // const limit = data.limit ? parseInt(data.limit) : 5;
    // const offset = data.offset ? parseInt(data.offset) : 0;

    if (data.paid_status == "paid") {
      //give any status results when user wants its draft results
      // "uploaded_content.$.paid_status" = data.first_name
      condition["uploaded_content.$.paid_status"] = true;
    }

    if (data.paid_status == "un_paid") {
      //give any status results when user wants its draft results
      // "uploaded_content.$.paid_status" = data.first_name
      condition["uploaded_content.$.paid_status"] = false;
    }

    if (data.hightolow == "-1") {
      //give any status results when user wants its draft results
      // "uploaded_content.$.paid_status" = data.first_name
      condition1.total_payment = -1;
    }

    if (data.lowtohigh == "1") {
      //give any status results when user wants its draft results
      // "uploaded_content.$.paid_status" = data.first_name
      condition1.total_payment = 1;
    }
    if (data.posted_date) {
      data.posted_date = parseInt(data.posted_date);
      const today = new Date();
      const days = new Date(
        today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
      );
      condition.createdAt = { $gte: days };
    }
    // const taskApproval = await AcceptedTasks.find(condition)
    //   .populate("task_id")
    //   .populate({
    //     path: "task_id",
    //     populate: {
    //       path: "mediahouse_id",
    //     },
    //   })
    //   .sort({ updatedAt: -1 })
    //   .limit(parseInt(data.limit))
    //   .skip(parseInt(data.offset));

    const uses = await AcceptedTasks.aggregate([
      {
        $lookup: {
          from: "uploadcontents",
          localField: "task_id",
          foreignField: "task_id",
          as: "uploaded_content",
        },
      },
      {
        $addFields: {
          total_payment: {
            $sum: {
              $map: {
                input: "$uploaded_content",
                as: "content",
                in: { $toDouble: "$$content.amount_paid_to_hopper" },
              },
            },
          },
        },
      },
      {
        $match:
          condition,


      },
      // {
      //   $lookup: {
      //     from: "tasks",
      //     localField: "task_id",
      //     foreignField: "_id",
      //     as: "task_id",
      //   },
      // },

      {
        $lookup: {
          from: "tasks",
          let: { assign_more_hopper_history: "$task_id" },
          // let: { assign_more_hopper_history: "$accepted_by" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$assign_more_hopper_history"] }],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "mediahouse_id",
                foreignField: "_id",
                as: "mediahouse_id",
              },
            },
            { $unwind: "$mediahouse_id" },
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },
      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id",
        },
      },
      { $unwind: "$hopper_id" },

      {
        $match: cond2

      },
      {
        $sort: condition1,
      },
      {
        $skip: Number(data.offset),
      },
      {
        $limit: Number(data.limit),
      },
    ]);
    res.json({
      code: 200,
      data: uses,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.addTaskContent = async (req, res) => {
  try {
    const data = req.body;
    data.hopper_id = req.user._id;
    if (Array.isArray(data.content)) {
      // for await (const content of data.content) {
      // data.media = image,
      // data.media_type = content.media
      data.content = data.content.map((content) => content);
      await db.createItem(data, AddBrocastContent);
      // }
    }
    res.json({
      code: 200,
      data: "created",
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const imgs = req.files;
    const data = req.body;
    const response = await db.uploadImg(imgs, data.path);
    res.status(200).json({
      code: 200,
      response: response,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.addFcmToken = async (req, res) => {
  try {
    const data = req.body;
    let response;
    data.user_id = req.user._id;
    const device = await db.getItemCustom(
      { user_id: data.user_id },
      FcmDevice
    );
    if (device) {
      await FcmDevice.updateMany(
        { user_id: mongoose.Types.ObjectId(data.user_id) },
        { $set: { device_token: data.device_token } }
      );
      response = "updated..";
    } else {
      response = await db.createItem(data, FcmDevice);
    }
    res.status(200).json({
      code: 200,
      response,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.removeFcmToken = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    await FcmDevice.deleteMany({ user_id: data.user_id })
    //old device_id:data.device_id
    // await db.deleteItem(data.device_id, FcmDevice),
    res.status(200).json({
      code: 200,
      response: "Deleted"
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.createRoom = async (req, res) => {
  try {
    req.body.room_id = uuid.v4();
    req.body.sender_id = req.user._id;
    const details = await db.createRoom1(Room, req.body);
    res.status(200).json({
      details,
      code: 200,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.roomList = async (req, res) => {
  try {
    const id = req.user._id;
    req.body.user_id = id;
    const data = await db.roomList(req.body, Room);

    res.status(200).json({
      data,
      code: 200,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.roomDetails = async (req, res) => {
  try {
    req.body.room_id = req.params.room_id;
    const details = await db.roomDetails(req.body, Room);

    res.status(200).json({
      details,
      code: 200,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.isDraft = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      status: await db.updateItem(req.params.content_id, Content, req.body),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.contentCategories = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      response: await db.getItems(Categories, { type: "content" }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

function uploadMediaSingleWithWatermark(object) {
  return new Promise(async (resolve, reject) => {
    var obj = object.image_data;
    var imageName = obj.name;

    var string =
      Date.now() + imageName.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
    await obj.mv(object.path + "/" + string, function (err) {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
    });
    resolve({
      media_type: obj.mimetype,
      image: string,
    });
  });
}

exports.addUploadedContent = async (req, res) => {
  try {
    const data = req.body;
    data.hopper_id = req.user._id;

    const findTakdetailforValidation = await BroadCastTask.findOne(
      { _id: data.task_id },
    );

    if (data.type == "image" && (findTakdetailforValidation.need_photos == false || findTakdetailforValidation.need_photos == "false")) {
      return res.status(422).json({
        code: 422,
        message: "This task can't accept photos",
      });
    }

    if (data.type == "audio" && (findTakdetailforValidation.need_interview == false || findTakdetailforValidation.need_interview == "false")) {
      return res.status(422).json({
        code: 422,
        message: "This task can't accept interview",
      });
    }

    if (data.type == "video" && (findTakdetailforValidation.need_videos == false || findTakdetailforValidation.need_videos == "false")) {
      return res.status(422).json({
        code: 422,
        message: "This task can't accept videos",
      });
    }

    if (req.files) {

      if (req.files.imageAndVideo && data.type == "image") {
        var govt_id = await uploadFiletoAwsS3Bucket({
          fileData: req.files.imageAndVideo,
          path: `public/uploadContent`,
        });
        data.imageAndVideo = govt_id.fileName;


      } else if (req.files.imageAndVideo && data.type == "audio") {
        var govt_id = await uploadFiletoAwsS3Bucket({
          fileData: req.files.imageAndVideo,
          path: `public/uploadContent`,
        });
        data.imageAndVideo = govt_id.fileName;
      } else {
        if (req.files.imageAndVideo && data.type == "video") {

          var govt_id = await uploadFiletoAwsS3Bucket({
            fileData: req.files.imageAndVideo,
            path: `public/uploadContent`,
          });
          data.imageAndVideo = govt_id.fileName;
        }


        if (req.files.videothubnail) {
          var photography_licence = await uploadFiletoAwsS3Bucket({
            fileData: req.files.videothubnail,
            path: `public/uploadContent`,
          });
          data.videothubnail = photography_licence.fileName;
        }
      }
    }




    // const imageName = data.imageAndVideo.fileName
    // const VideoThumbnailName = data.videothubnail.fileName ? data.videothubnail.fileName : null
    const addedContent = await db.createItem(data, Uploadcontent);

    const findtaskdetails = await BroadCastTask.findOne({
      _id: addedContent.task_id,
    });



    const currentDate = new Date();

    if ((currentDate) < findtaskdetails.deadline_date) {
      const completedByArr = findtaskdetails.completed_by.map((hopperIds) => hopperIds);
      if (!completedByArr.includes(data.hopper_id)) {
        const update = await BroadCastTask.updateOne(
          { _id: data.task_id },
          { $push: { completed_by: data.hopper_id }, }
        );
      }
    }

    const hd = await userDetails(data.hopper_id)

    const notiObj = {
      sender_id: data.hopper_id,
      receiver_id: findtaskdetails.mediahouse_id,
      // data.receiver_id,
      title: " Content Uploaded",
      body: `Hey  ${hd.user_name}, thank you for uploading your content 🤳🏼 🤩 Our team are reviewing the content & may need to speak to you. Please have your phone handy 📞. Cheers - Team PRESSHOP🐰`,
    };
    const resp = await _sendPushNotification(notiObj);
    const notiObj1 = {
      sender_id: data.hopper_id,
      receiver_id: "64bfa693bc47606588a6c807",
      // data.receiver_id,
      title: " Content Uploaded",
      body: `Hey ${hd.user_name}, has uploaded a new content for £100 `,
    };
    const resp1 = await _sendPushNotification(notiObj);
    // const imazepath = `public/uploadContent/${data.imageAndVideo}`;
    //`${STORAGE_PATH_HTTP}/uploadContent/${data.imageAndVideo}`
    if (data.videothubnail) {
      // data.videothubnail = 
      // const vodeosize = `public/uploadContent/${data.videothubnail}`;
      // const dim = sizeOf(vodeosize);
      // const bitDepth = 8;
      // const imageSizeBytes = (dim.width * dim.height * bitDepth) / 8;

      // Convert bytes to megabytes (MB)
      // const imageSizeMB = imageSizeBytes / (1024 * 1024);

      const ORIGINAL_IMAGE = "https://uat-presshope.s3.eu-west-2.amazonaws.com/public/uploadContent/" + data.videothubnail
        // "/var/www/mongo/presshop_rest_apis/public/uploadContent/" +
        ;



      const WATERMARK =
        `${STORAGE_PATH_HTTP}/Watermark/newLogo.png`;
      // result.watermark;

      // const WATERMARK =  "/var/www/html/presshop_rest_apis/public/Watermark/logo1.png"; //+ result.watermark;
      // 

      const FILENAME =
        Date.now() +
        data.imageAndVideo.replace(
          /[&\/\\#,+()$~%'":*?<>{}\s]/g,
          "_"
        );
      // const dstnPath =
      //   "/var/www/mongo/presshop_rest_apis/public/uploadContent" +
      //   "/" +
      //   FILENAME;
      const LOGO_MARGIN_PERCENTAGE = 5;


      const main = async () => {
        const [image, logo] = await Promise.all([
          Jimp.read(ORIGINAL_IMAGE),
          Jimp.read(WATERMARK),
        ]);

        // logo.resize(image.bitmap.width / 10, Jimp.AUTO);

        const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
        const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

        const X = image.bitmap.width - logo.bitmap.width - xMargin;
        const Y = image.bitmap.height - logo.bitmap.height - yMargin;

        logo.resize(image.getWidth(), image.getHeight());

        return image.composite(logo, 0, 0, [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 0.9,
            opacityDest: 1,
          },
        ]);
      };



      main().then((image) => {
        image.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
          if (err) {
            console.error('Error creating image buffer:', err);
            return res.status(301).json({ code: 500, error: 'Internal server error' });
          }

          const FILENAME_WITH_EXT = FILENAME;
          const S3_BUCKET_NAME = process.env.Bucket ;//"uat-presshope";; // Replace with your S3 bucket name
          const S3_KEY = `uploadContent/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
          const s3Params = {
            Bucket: S3_BUCKET_NAME,
            Key: S3_KEY,
            Body: imageDataBuffer,
            // ACL: 'public-read',
            ContentType: 'image/png',
          };
          const s3 = new AWS.S3();
          // Upload image buffer to S3
          s3.upload(s3Params, async (s3Err, s3Data) => {
            if (s3Err) {
              console.error('Error uploading to S3:', s3Err);
              return res.status(302).json({ code: 500, error: 'Internal server error' });
            }

            const imageUrl = s3Data.Location;
            // data.videothubnail = imageUrl
            addedContent.videothubnail = imageUrl
            await addedContent.save();
            // const addedimage = await db.createItem(data, Uploadcontent);
            const update = await BroadCastTask.updateOne(
              { _id: data.task_id },
              { $push: { content: { media: data.imageAndVideo, media_type: "video", thumbnail: data.videothubnail } }, }
            );


            // res.status(200).json({
            //   data: FILENAME_WITH_EXT.fileName,
            //   url: FILENAME_WITH_EXT.data,
            //   code: 200,
            //   type: data.type,
            //   watermark: imageUrl, // Use the S3 URL for the uploaded image
            //   attachme_name: data.imageAndVideo,
            //   data: addedimage,
            // });
            res.json({
              code: 200,
              // image_size:dimensions,
              // video_size: imageSizeMB,
              type: data.type,
              attachme_name: data.imageAndVideo,
              videothubnail_path: `${data.videothubnail}`,
              // image_name: `${data.imageAndVideo.fileName}`,
              data: addedContent,
            });
          });
        });
      });

      // res.json({
      //   code: 200,
      //   // image_size:dimensions,
      //   // video_size: imageSizeMB,
      //   type: data.type,
      //   attachme_name: data.imageAndVideo,
      //   videothubnail_path: `${data.videothubnail}`,
      //   // image_name: `${data.imageAndVideo.fileName}`,
      //   data: addedContent,
      // });
    } else if (data.type == "audio") {


      const update = await BroadCastTask.updateOne(
        { _id: data.task_id },
        { $push: { content: { media: data.imageAndVideo, media_type: "audio" } }, }
      );
      res.json({
        code: 200,
        // image_size:dimensions,
        // video_size: imageSizeMB,
        type: data.type,
        attachme_name: data.imageAndVideo,
        videothubnail_path: `${data.videothubnail}`,
        image_name: `${data.imageAndVideo.fileName}`,
        data: addedContent,
      });
    }

    else {
      // const dimensions = sizeOf(imazepath);
      // const bitDepth = 8; // 8 bits per channel, assuming RGB color

      // Calculate the image size in bytes
      // const imageSizeBytes =
      //   (dimensions.width * dimensions.height * bitDepth) / 8;

      // // Convert bytes to megabytes (MB)
      // const imageSizeMB = imageSizeBytes / (1024 * 1024);
      // const addedContent = await db.createItem(data, Uploadcontent);


      const ORIGINAL_IMAGE = `${process.env.AWS_BASE_URL}/public/uploadContent/` + data.imageAndVideo
        // "/var/www/mongo/presshop_rest_apis/public/uploadContent/" +
        ;



      const WATERMARK =
      `${STORAGE_PATH_HTTP}/Watermark/newLogo.png`;
      // result.watermark;

      // const WATERMARK =  "/var/www/html/presshop_rest_apis/public/Watermark/logo1.png"; //+ result.watermark;
      // 

      const FILENAME =
        Date.now() +
        data.imageAndVideo.replace(
          /[&\/\\#,+()$~%'":*?<>{}\s]/g,
          "_"
        );
      // const dstnPath =
      //   "/var/www/mongo/presshop_rest_apis/public/uploadContent" +
      //   "/" +
      //   FILENAME;
      const LOGO_MARGIN_PERCENTAGE = 5;


      const main = async () => {
        const [image, logo] = await Promise.all([
          Jimp.read(ORIGINAL_IMAGE),
          Jimp.read(WATERMARK),
        ]);

        // logo.resize(image.bitmap.width / 10, Jimp.AUTO);

        const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
        const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

        const X = image.bitmap.width - logo.bitmap.width - xMargin;
        const Y = image.bitmap.height - logo.bitmap.height - yMargin;

        logo.resize(image.getWidth(), image.getHeight());

        return image.composite(logo, 0, 0, [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 0.9,
            opacityDest: 1,
          },
        ]);
      };

      //  new code ====================================

      main().then((image) => {
        image.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
          if (err) {
            console.error('Error creating image buffer:', err);
            return res.status(301).json({ code: 500, error: 'Internal server error' });
          }

          const FILENAME_WITH_EXT = FILENAME;
          const S3_BUCKET_NAME = process.env.Bucket ;// "uat-presshope";; // Replace with your S3 bucket name
          const S3_KEY = `uploadContent/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
          const s3Params = {
            Bucket: S3_BUCKET_NAME,
            Key: S3_KEY,
            Body: imageDataBuffer,
            // ACL: 'public-read',
            ContentType: 'image/png',
          };
          const s3 = new AWS.S3();
          // Upload image buffer to S3
          s3.upload(s3Params, async (s3Err, s3Data) => {
            if (s3Err) {
              console.error('Error uploading to S3:', s3Err);
              return res.status(302).json({ code: 500, error: 'Internal server error' });
            }

            const imageUrl = s3Data.Location;
            addedContent.videothubnail = imageUrl
            await addedContent.save();



            const update = await BroadCastTask.updateOne(
              { _id: data.task_id },
              { $push: { content: { media: imageUrl, media_type: "image", thumbnail: data.imageAndVideo } }, }
            );
            res.status(200).json({
              data: FILENAME_WITH_EXT.fileName,
              url: FILENAME_WITH_EXT.data,
              code: 200,
              type: data.type,
              watermark: imageUrl, // Use the S3 URL for the uploaded image
              attachme_name: data.imageAndVideo,
              data: addedContent,
            });
          });
        });
      });

    }
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.uploadS3Content = async (req, res) => {
  try {
    const data = req.body;

    var response = await uploadFiletoAwsS3Bucket({
      fileData: req.files.media,
      path: `public/template/fonts`,
    });

    res.status(200).json(response);
  } catch (error) {

  }
}

// exports.getuploadedContentbyHopper = async (req, res) => {
//   try {
//     // const data = req.params;

//     const draftDetails = await Uploadcontent.find({
//       hopper_id: mongoose.Types.ObjectId(req.user._id),
//     }).populate("task_id");
//     
//     res.json({
//       code: 200,
//       data: draftDetails,
//     });
//   } catch (err) {
//     utils.handleError(res, error);
//   }
// };

exports.adminlist = async (req, res) => {
  try {
    // const data = req.params;

    const draftDetails = await Admin.find({});
    const id = req.user._id;
    const users = await Admin.aggregate([




      {
        $lookup: {
          from: "rooms",
          let: { sender_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
                  { $eq: ["$sender_id", mongoose.Types.ObjectId(id)] },
                    //  { $eq: ["$type", "HoppertoAdmin"] }
                  ],
                },
              },
            },
          ],
          as: "room_details",
        },
      },

      { $unwind: { path: "$room_details", preserveNullAndEmptyArrays: true } },

    ]);



    res.json({
      code: 200,
      data: users,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getfaq = async (req, res) => {
  try {
    const data = req.query;

    const draftDetails = await notification
      .find({ receiver_id: req.user._id, is_deleted_for_app: false })
      .populate("receiver_id sender_id").populate({
        path: "receiver_id",
        populate: {
          path: "avatar_id"
        }
      })
      .skip(Number(data.offset))
      .limit(Number(data.limit))
      .sort({ timestamp_forsorting: -1 });

    const count = await notification
      .find({ receiver_id: req.user._id, is_read: false })
    const Totalcount = await notification
      .find({ receiver_id: req.user._id })
    res.json({
      code: 200,
      data: draftDetails,
      totalCount: Totalcount.length,
      unreadCount: count.length
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getGenralMgmtApp = async (req, res) => {
  try {
    const data = req.query;
    let status;

    if (data.type == "privacy_policy") {
      status = await Privacy_policy.findOne({
        _id: mongoose.Types.ObjectId("6458c3c7318b303d9b4755b3"),
      });
    } else if (data.type == "faq") {
      status = await Faq.find({ for: "app", is_deleted: false, category: data.category });
    }
    //  else if (data.type == "legal") {
    //   status = await Legal_terms.findOne({
    //     _id: mongoose.Types.ObjectId("6458c35c5d09013b05b94e37"),
    //   });
    // } 
    else if (data.type == "selling_price") {
      status = await Selling_price.findOne({
        _id: mongoose.Types.ObjectId("64f013495695d1378e70446f"),
      })
    } else if (data.type == "videos") {
      status = await Tutorial_video.find({
        is_deleted: false,
        for: "app",
        category: data.category,
      });
    } else if (data.type == "doc") {
      // status = await typeofDocs.find({ type: "app", is_deleted: false });
      // 

      // 
      status = await typeofDocs.aggregate([
        {
          $match: {
            type: "app",
            is_deleted: false
          }
        },
        {
          $lookup: {
            from: "hopperuploadedmedias",
            let: { doc_id: "$_id", hopper_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$doc_id", "$$doc_id"] },
                      { $eq: ["$hopper_id", "$$hopper_id"] }
                    ]
                  }
                }
              }
            ],
            as: "doc_details"
          }
        },
        {
          $unwind: {
            path: "$doc_details",
            preserveNullAndEmptyArrays: true, // Use this line if you want to preserve documents that do not have matching details in the "hopperUploadedMedia" collection.
          }
        }
      ]);
    } else if (data.type == "price_tips") {
      status = await Price_tips.findOne({
        _id: mongoose.Types.ObjectId("6458c5e949bfb13f71e1b4ac"),
      });
    }


    res.status(200).json({
      code: 200,
      status,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getpriceTipforQuestion = async (req, res) => {
  try {
    const data = req.query;
    let price_tips;
    if (data.category) {
      // price_tips = await db.getItem(data.pricetip_id, priceTipforquestion);
      price_tips = await db.getItems(priceTipforquestion, {
        for: "app",
        category: data.category,
        is_deleted: false
      });
      // price_tips = await db.getItems(priceTipforquestion, { for: "app" });
    } else {
      price_tips = await db.getItems(priceTipforquestion, { for: "app" });
    }

    res.status(200).json({
      code: 200,
      price_tips,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.acceptedHopperListData = async (req, res) => {
  try {
    const data = req.query;
    const list = await db.acceptedHopperListData(AcceptedTasks, data);

    res.status(200).json({
      code: 200,
      data: list[0],
      count: list[1],
    });
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};

exports.acceptedHoppersdata = async (req, res) => {
  try {
    const data = req.query;
    const userID = req.user._id;
    // const list  = await AcceptedTasks.findOne({task_id:data.task_id , task_status:"accepted"  })
    const list = await db.acceptedHopperListDatafortask(
      AcceptedTasks,
      data,
      userID
    );

    res.status(200).json({
      code: 200,
      data: list[0],
      count: list[0].data.length,
    });
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};
function addWatermark(originalAudioPath, watermarkAudioPath, outputFilePath) {
  const interval = 1; // seconds
  const startPoint = 4; // seconds
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(originalAudioPath)
      .audioCodec('libmp3lame')
      .input(watermarkAudioPath)
      .complexFilter([
        `[1:a]adelay=${startPoint}|${startPoint}[delayed_overlay]`,
        `[0:a][delayed_overlay]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${interval},atrim=start=${interval},atrim=end=${interval + startPoint}`
      ])
      .on('end', function () {

        resolve();
      })
      .on('error', function (err) {
        console.error('Error=====================:', err);
        reject(err);
      })
      .save(outputFilePath);

  });

}

const downloadFiles = async (filePaths) => {
  const downloadedFiles = [];
  const s3 = new AWS.S3();

  for (const filePath of filePaths) {
    const S3_BUCKET_NAME =  process.env.Bucket ;//"uat-presshope";
    const S3_KEY = `public/contentData/${filePath}`;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: S3_KEY, // The S3 object key (path) of the file
    };

    const response = await s3.getObject(params).promise();

    // Save the downloaded file locally or in memory as needed
    downloadedFiles.push({ name: filePath, data: response.Body });
  }

  return downloadedFiles;
};
function mixBuffers(buffer1, buffer2) {
  // Ensure both buffers have the same length
  if (buffer1.length !== buffer2.length) {
    throw new Error('Buffers must have the same length');
  }

  // Create a new buffer to store the mixed audio
  const mixedBuffer = Buffer.alloc(buffer1.length);

  // Iterate through each sample and mix the values
  for (let i = 0; i < buffer1.length; i++) {
    const sample1 = buffer1.readInt16LE(i * 2); // Assuming 16-bit little-endian samples
    const sample2 = buffer2.readInt16LE(i * 2);

    // Mix the samples and clip the result to prevent overflow
    const mixedSample = Math.max(-32768, Math.min(32767, sample1 + sample2));

    // Write the mixed sample back to the mixed buffer
    mixedBuffer.writeInt16LE(mixedSample, i * 2);
  }

  return mixedBuffer;
}

const createZipArchive = async (outputFilePath) => {
  return new Promise((resolve, reject) => {
    // const archive = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(outputFilePath);

    // archive.pipe(output);

    // files.forEach((file) => {
    //   archive.append(file.data, { name: file.name });
    // });

    // archive.on('error', reject);
    // output.on('close', resolve);

    // archive.finalize();
  });
};
function mixAudioFiles(inputFile1, inputFile2, outputFile, callback) {
  // Construct the SoX command
  const command = `sox ${inputFile1} ${inputFile2} ${outputFile} mix`;

  // Execute the SoX command as a child process
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${stderr}`, error);
      // callback(error);
    } else {

      // callback(null);
    }
  });
}

function mixAudioFilesnew(inputFile1, inputFile2, outputFile) {
  const inputFiles = [inputFile1, inputFile2];

  // Create a sox command to mix the input files
  const command = sox({
    input: inputFiles,
    output: outputFile,
    effects: 'mix'
  });

  // Run the sox command
  command.run()
    .then(() => {

    })
    .catch((error) => {
      console.error(`Error mixing audio: ${error}`);
    });
}




function addWatermarktoAudio(inputAudioPath, watermarkAudioPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputAudioPath)
      .input(watermarkAudioPath)
      .audioCodec('libmp3lame') // Use the appropriate codec for your output format
      .complexFilter([
        '[0:a]volume=1[a0]',   // Adjust the volume of the original audio
        '[1:a]volume=0.5[a1]',  // Adjust the volume of the watermark audio
        '[a0][a1]amix=inputs=2:duration=longest', // Mix the original and watermark audio
      ])
      .on('end', function () {

        resolve();
      })
      .on('error', function (err) {
        console.error('Error=====================:', err);
        reject(err);
      })
      .save(outputAudioPath);
  });
}



// function newaddWatermarktoAudio(inputFile ,  outputFileforconvertion) {
//   ffmpeg()
//         .input(inputFile)
//         .audioCodec('libmp3lame') // Use the MP3 codec
//         .on('end', () => {
//           
//         })
//         .on('error', (err) => {
//           console.error('Error:', err);
//         })
//         .save(outputFileforconvertion);
// }

function newaddWatermarktoAudio(inputFile, outputFileforConversion) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputFile)
      .audioCodec('libmp3lame') // Use the MP3 codec
      .on('end', () => {

        resolve();
      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .save(outputFileforConversion);
  });
}

function modify3addWatermarkToAudio(inputAudioPath, watermarkAudioPath, outputAudioPath) {
  return new Promise((resolve, reject) => {
    // Get the duration of the original audio
    ffmpeg.ffprobe(inputAudioPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const duration = metadata.format.duration;

      // Loop and pad the watermark audio
      ffmpeg()
        .input(watermarkAudioPath)
        .audioFilters(`aloop=loop=-1:size=10000000,apad`) // Ensure watermark audio is looped and padded
        .outputOptions(`-t ${duration}`) // Trim to match the main audio duration
        .save(outputAudioPath)
        .on('end', function () {
          resolve();
        })
        .on('error', function (err) {
          console.error('Error processing watermark:', err);
          reject(err);
        });
    });
  });
}

async function main1(inputAudioPath, outputAudioPath) {
  try {
    let daat = await newaddWatermarktoAudio(inputAudioPath, outputAudioPath);
  } catch (error) {
    console.error('Error:', error);
  }
}


async function main(inputAudioPath, watermarkAudioPath, outputAudioPath) {
  try {
    let daat = await addWatermarktoAudio(inputAudioPath, watermarkAudioPath, outputAudioPath);//await addWatermark(inputAudioPath , watermarkAudioPath , outputAudioPath);
    //  
  } catch (error) {
    console.error('Error:', error);
  }
}
// function addWatermarkToVideo(inputVideoPath, watermarkImagePath, watermarkAudioPath, outputVideoPath) {
//   return new Promise((resolve, reject) => {
//       ffmpeg()
//           .input(inputVideoPath)
//           .input(watermarkImagePath)
//           .input(watermarkAudioPath)
//           .complexFilter([
//               // Overlay image watermark
//               '[0:v][1:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2[video_with_watermark]',
//               // Delay the audio watermark
//               '[2:a]adelay=4000|4000[delayed_audio]',
//               // Mix the main audio and the delayed audio watermark
//               '[0:a][delayed_audio]amix=inputs=2:duration=first:dropout_transition=0[audio_with_watermark]'
//           ])
//           .outputOptions('-map [video_with_watermark]')
//           .outputOptions('-map [audio_with_watermark]')
//           .output(outputVideoPath)
//           .on('end', () => {
//               
//               resolve();
//           })
//           .on('error', (err) => {
//               console.error('Error during processing:', err);
//               reject(err);
//           })
//           .run();
//   });
// }
// '[1:v]scale=iw:ih[watermark]; [0:v][watermark]overlay=0:0[video_with_watermark]',

// for centre position
// '[0:v][1:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2[video_with_watermark]',
// Loop the watermark audio
// '[2:a]aloop=loop=-1:size=441000[looped_audio]',
// // Delay the looped audio watermark
// '[looped_audio]adelay=4000|4000[delayed_audio]',
// // Mix the main audio and the delayed, looped audio watermark
// '[0:a][delayed_audio]amix=inputs=2:duration=first:dropout_transition=0[audio_with_watermark]'












// function addWatermarkToVideo(inputVideoPath, watermarkImagePath, watermarkAudioPath ,outputVideoPath) {
//   return new Promise((resolve, reject) => {
//     ffmpeg(inputVideoPath)
//       .input(watermarkImagePath)
//       .on('error', (err) => {
//         console.error('Error during processing:', err);
//         reject(err);
//       })
//       .on('end', () => {
//         console.log('Processing finished successfully.');
//         resolve();
//       })
//       .ffprobe(inputVideoPath, (err, metadata) => {
//         if (err) {
//           console.error('Error getting metadata:', err);
//           return reject(err);
//         }

//         // Check if the input video has audio streams
//         const hasAudio = metadata.streams.some(stream => stream.codec_type === 'audio');

//         // Build the ffmpeg command
//         const command = ffmpeg(inputVideoPath)
//           .input(watermarkImagePath)
//           .complexFilter([
//             '[1][0]scale2ref=w=iw:h=ih[watermark][video]',
//             '[video][watermark]overlay=0:0[video_with_watermark]'
//           ])
//           .outputOptions([
//             '-map [video_with_watermark]', // Map the video with watermark
//           ]);

//         // Conditionally add audio mapping if it exists
//         if (hasAudio) {
//           command.outputOptions('-map 0:a'); // Map the original audio if it exists
//         }

//         // Define the output file
//         command.output(outputVideoPath).run();
//       });
//   });
// }


// old 
async function addWatermarkToVideo(inputVideoPath, watermarkImagePath, watermarkAudioPath, outputVideoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputVideoPath)
      .input(watermarkImagePath)
      // .input(watermarkAudioPath)
      .complexFilter([
        // Overlay image watermark
        // '[1:v][0:v]scale2ref=w=oh*mdar:h=ih[watermark][video]',
        // '[video][watermark]overlay=0:0[video_with_watermark]',
        '[1][0]scale2ref=w=iw:h=ih[watermark][video]',
        // Overlay the watermark on the video
        // '[video][watermark]overlay=0:0'
        '[video][watermark]overlay=0:0[video_with_watermark]'
      ])
      // .outputOptions('-map [video_with_watermark]')
      .outputOptions([
        '-map [video_with_watermark]', // Map the video with watermark
        '-map 0:a' // Map the original audio
      ])

      // .outputOptions('-map [audio_with_watermark]')
      .output(outputVideoPath)
      .on('end', () => {

        resolve();
      })
      .on('error', (err) => {
        console.error('Error during processing:', err);
        reject(err);
      })
      .run();
  });
}

exports.uploadMedia = async (req, res) => {
  try {
    var image_name;

    // 
    if (req.files && req.files.image) {

      const objImage = {
        fileData: req.files.image,
        path: "public/contentData",
      };
      image_name = await uploadFiletoAwsS3Bucket(objImage);

    }
    // image/jpeg
    const split = image_name.media_type.split("/");
    const media_type = split[0];

    var data = null;
    var data1 = null;
    var mime_type = null
    let content;
    if (media_type == "image") {


      data = image_name.fileName;
      data1 = image_name.data
      mime_type = image_name.media_type
      const ORIGINAL_IMAGE = data1;



      const WATERMARK =
        "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";

      const FILENAME =
        Date.now() + data.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
      // const dstnPath =
      //   "/var/www/html/presshop_rest_apis/public/contentData" + "/" + FILENAME;
      const LOGO_MARGIN_PERCENTAGE = 5;



      const main = async () => {

        const [image, logo] = await Promise.all([
          Jimp.read(ORIGINAL_IMAGE),
          Jimp.read(WATERMARK),
        ]);


        const isPotrait = image.bitmap.height > image.bitmap.width

        // If the image is in landscape orientation, rotate it by 90 degrees clockwise
        // if (isPotrait) {
        //   // image.rotate(90);
        //   image.resize(logo.getWidth(),logo.getHeight());
        // }


        logo.cover(image.getWidth(), image.getHeight());
        // logo.scale(1.2);

        // logo.cover(image.getWidth(),image.getHeight())
        // .write('path/to/output.jpg');
        // return image.composite(logo, image.getWidth(), image.getHeight());
        return image.composite(logo, 0, 0, [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 1,
            opacityDest: 0.1,
          },
        ]);
      };




      main().then((image) => {
        image.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
          if (err) {
            console.error('Error creating image buffer:', err);
            return res.status(500).json({ code: 500, error: 'Internal server error' });
          }








          const FILENAME_WITH_EXT = FILENAME;
          const S3_BUCKET_NAME = process.env.Bucket ;//"uat-presshope"; // Replace with your S3 bucket name
          const S3_KEY = `contentData/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
          const s3Params = {
            Bucket: S3_BUCKET_NAME,
            Key: S3_KEY,
            Body: imageDataBuffer,
            ContentType: mime_type,
          };
          const s3 = new AWS.S3();
          // Upload image buffer to S3
          s3.upload(s3Params, (s3Err, s3Data) => {
            if (s3Err) {
              console.error('Error uploading to S3:', s3Err);
              return res.status(500).json({ code: 500, error: 'Internal server error' });
            }

            const imageUrl = s3Data.Location


            //     const value = imageUrl.split("/");
            // const strforvideo = value[value.length - 1];
            const final = imageUrl.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);
            // const notiObj = {
            //   sender_id: req.user._id,
            //   receiver_id: "64bfa693bc47606588a6c807",
            //   // data.receiver_id,
            //   title: "New Content Added ",
            //   body: `Content published - ${req.user.first_name} has published a new content `,
            // };
            // const resp = _sendPushNotification(notiObj);





            return res.status(200).json({
              data: FILENAME,
              code: 200,
              watermark: final,
              image_name: data1,
              data: data,
              // media_type: data.media_type,
            });
          });
        })
      });
      ;
    }
    if (media_type == "image") {

      await Promise.all(content);
    }
    // if (image_name && media_type == "image") {
    //   data = image_name.fileName;
    //   data1 = image_name.data
    //   mime_type = image_name.media_type
    //   const ORIGINAL_IMAGE = data1;

    //   


    //   const FILENAME =
    //     Date.now() + data.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
    //   // const dstnPath =
    //   //   "/var/www/html/presshop_rest_apis/public/contentData" + "/" + FILENAME;
    //   const LOGO_MARGIN_PERCENTAGE = 5;

    //   

    //   const main = async () => {
    //     
    //     const [image, logo] = await Promise.all([
    //       Jimp.read(ORIGINAL_IMAGE),
    //       Jimp.read(WATERMARK),
    //     ]);
    //     logo.resize(image.getWidth(), image.getHeight());

    //     return image.composite(logo, 0, 0, [
    //       {
    //         mode: Jimp.BLEND_SCREEN,
    //         opacitySource: 1.1,
    //         opacityDest: 20,
    //       },
    //     ]);
    //   };

    //   main().then((image) => {
    //     image.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
    //       if (err) {
    //         console.error('Error creating image buffer:', err);
    //         return res.status(500).json({ code: 500, error: 'Internal server error' });
    //       }

    //       const FILENAME_WITH_EXT = FILENAME;
    //       const S3_BUCKET_NAME = "uat-presshope"; // Replace with your S3 bucket name
    //       const S3_KEY = `contentData/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
    //       const s3Params = {
    //         Bucket: S3_BUCKET_NAME,
    //         Key: S3_KEY,
    //         Body: imageDataBuffer,
    //         ContentType: mime_type,
    //       };
    //       const s3 = new AWS.S3();
    //       // Upload image buffer to S3
    //       s3.upload(s3Params, (s3Err, s3Data) => {
    //         if (s3Err) {
    //           console.error('Error uploading to S3:', s3Err);
    //           return res.status(500).json({ code: 500, error: 'Internal server error' });
    //         }

    //         const imageUrl = s3Data.Location
    //         const notiObj = {
    //           sender_id: req.user._id,
    //           receiver_id: "64bfa693bc47606588a6c807",
    //           // data.receiver_id,
    //           title: "New Content Added ",
    //           body: `Content published - ${req.user.first_name} has published a new content `,
    //         };
    //         const resp = _sendPushNotification(notiObj);


    //         res.status(200).json({
    //           data: FILENAME,
    //           code: 200,
    //           watermark: imageUrl,
    //           image_name: data1,
    //           data: data,
    //           // media_type: data.media_type,
    //         });
    //       });
    //     })
    //   });

    // } else
    if (media_type == "application") {
      res.status(200).json({
        code: 200,
        data: image_name.fileName,
        media_type: image_name.media_type
      });
    }

    else if (media_type == "audio") {
      const date = new Date()


      let imageforStore = await utils.uploadFile({
        fileData: req.files.image,
        path: `${STORAGE_PATH}/test`,
      })

      const randomname = Math.floor(1000000000 + Math.random() * 9000000000)

      // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
      const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`
      const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;

      // Output file path (replace with desired output file path and name)
      const outputFile = 'path/to/your/outputfile.mp3';
      // convert into mp3
      await main1(inputFile, outputFileforconvertion)
      fs.unlinkSync(inputFile)



      // const filePaths = `/var/www/mongo/presshop_rest_apis/public/test/abc31704455329170.mp3`
      const filePaths = `/var/www/mongo/presshop_rest_apis/public/test/test.mp3`
      // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/powered.mp3`
      const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`
      const outputFilePaths = `/var/www/mongo/presshop_rest_apis/public/test/${date}.mp3`
      const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${date + randomname}.mp3`
      // 
      await modify3addWatermarkToAudio(outputFileforconvertion, outputFilePath, outputFilePathsameduration)


      // let resp = await main(filePaths, outputFilePath, outputFilePaths);
      // 
      // const buffer3 = fs.readFileSync(outputFileforconvertion); 
      // let reupload = await utils.uploadFileforaudio({
      //   fileData: buffer3,
      //   path: `${STORAGE_PATH}/test/${randomname.mp3}`,
      // })


      // const filePat =  `${STORAGE_PATH}/test/${randomname}.mp3`
      // 
      //  old code 
      // if( fs.existsSync(outputFileforconvertion) )  {

      //   let resp = await main(outputFileforconvertion, outputFilePath, outputFilePaths);

      // } else {

      //   
      // }

      if (fs.existsSync(outputFilePathsameduration)) {

        let resp = await main(outputFilePathsameduration, outputFileforconvertion, outputFilePaths);

      } else {


      }

      const exist = fs.existsSync(outputFilePaths)
      // fs.unlinkSync(outputFilePathsameduration)

      const buffer1 = fs.readFileSync(outputFilePaths);

      fs.unlinkSync(outputFileforconvertion)
      let audio_description = await uploadFiletoAwsS3BucketforAudiowatermark({
        fileData: buffer1,
        path: `public/userImages`,
      });

      fs.unlinkSync(outputFilePaths)
      // 
      const final = audio_description.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);
      res.status(200).json({
        code: 200,
        data: image_name.fileName,
        watermark: final
      });


    } else {
      try {
        // if (media_type == "video") {
        //   const date = new Date()
        //   let imageforStore = await utils.uploadFile({
        //     fileData: req.files.image,
        //     path: `${STORAGE_PATH}/test`,
        //   })


        //   const split = imageforStore.fileName.split(".");
        //   const extention = split[1];

        //   const randomname = Math.floor(1000000000 + Math.random() * 9000000000)
        //   const randomname2 = Math.floor(100 + Math.random() * 900)
        //   // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
        //   const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp4`
        //   const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;
        //   // await  main1(inputFile ,outputFileforconvertion)
        //   // fs.unlinkSync(inputFile)

        //   const Audiowatermak = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`
        //   const imageWatermark = `/var/www/mongo/presshop_rest_apis/public/Watermark/newLogo.png`
        //   const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${randomname + randomname2}.${extention}`
        //   // 
        //   // await modify3addWatermarkToAudio(outputFileforconvertion,outputFilePath,outputFilePathsameduration)
        //   const value = mime.lookup(`.${extention}`)

        //   await addWatermarkToVideo(inputFile, imageWatermark, Audiowatermak, outputFilePathsameduration)

        //   const buffer1 = fs.readFileSync(outputFilePathsameduration);
        //   let audio_description = await uploadFiletoAwsS3BucketforVideowatermark({
        //     fileData: buffer1,
        //     path: `public/userImages`,
        //     mime_type: value
        //   });

        //   fs.unlinkSync(outputFilePathsameduration)
        //   fs.unlinkSync(inputFile)

        //   const final2 = image_name.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);
        //   const final = audio_description.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);
        //   return res.status(200).json({
        //     data: final2,
        //     watermark: final
        //   })
        // }


        if (media_type == "video") {

          let imageforStore = await utils.uploadFile({
            fileData: req.files.image,
            path: `${STORAGE_PATH}/test`,
          })

          const final2 = image_name.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);
          // const final = audio_description.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);
          return res.status(200).json({
            data: final2,
            watermark: imageforStore.fileName
          })

        }
      } catch (error) {
        utils.handleError(res, error)
      }
    }
  } catch (err) {
    // handleError()>
  }
};


// new worker code

// exports.uploadMedia = async (req, res) => {
//   try {
//       let image_name;

//       if (req.files && req.files.image) {
//           const objImage = {
//               fileData: req.files.image,
//               path: "public/contentData",
//           };
//           image_name = await uploadFiletoAwsS3Bucket(objImage);

//       }

//       const split = image_name.media_type.split("/");
//       const media_type = split[0];

//       if (media_type === "image") {
//           const worker = new Worker(path.resolve(__dirname, 'imageWorker.js'));
//           const ORIGINAL_IMAGE = image_name.data;
//           const WATERMARK = "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";
//           const FILENAME = Date.now() + image_name.fileName.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
//           const mime_type = image_name.media_type;

//           worker.postMessage({ ORIGINAL_IMAGE, WATERMARK, FILENAME, mime_type });

//           worker.on('message', (message) => {
//               if (message.error) {
//                   console.error('Error:', message.error);
//                   return res.status(500).json({ code: 500, error: 'Internal server error' });
//               }
//               return res.status(200).json({
//                   data: FILENAME,
//                   code: 200,
//                   watermark: message.imageUrl,
//                   image_name: ORIGINAL_IMAGE,
//                   data: image_name.fileName,
//               });
//           });
//       }


//       if (media_type === "application") {
//           res.status(200).json({
//               code: 200,
//               data: image_name.fileName,
//               media_type: image_name.media_type
//           });
//       }
//       else if (media_type == "audio") {
//       const date = new Date();

//       let imageforStore = await utils.uploadFile({
//           fileData: req.files.image,
//           path: `${STORAGE_PATH}/test`,
//       });

//       const randomname = Math.floor(1000000000 + Math.random() * 9000000000);
//       const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;
//       const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`;

//       // Worker for audio conversion
//       const conversionWorker = new Worker('./audioConversionWorker.js', {
//           workerData: { inputFile, outputFileforconvertion }
//       });

//       conversionWorker.on('message', async (message) => {
//           if (message.success) {
//               const outputFileforconvertion = message.outputFileforconvertion;
//               const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`;
//               const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${date + randomname}.mp3`;

//               // Worker for watermarking
//               const watermarkWorker = new Worker('./audioWatermarkWorker.js', {
//                   workerData: { outputFileforconvertion, outputFilePath, outputFilePathsameduration }
//               });

//               watermarkWorker.on('message', async (message) => {
//                   if (message.success) {
//                       const outputFilePathsameduration = message.outputFilePathsameduration;

//                       if (fs.existsSync(outputFilePathsameduration)) {
//                           let resp = await main(outputFilePathsameduration, outputFileforconvertion, outputFilePaths);
//                       } else {

//                       }

//                       const buffer1 = fs.readFileSync(outputFilePaths);
//                       fs.unlinkSync(outputFileforconvertion);

//                       let audio_description = await uploadFiletoAwsS3BucketforAudiowatermark({
//                           fileData: buffer1,
//                           path: `public/userImages`,
//                       });

//                       fs.unlinkSync(outputFilePaths);
//                       res.status(200).json({
//                           code: 200,
//                           data: image_name.fileName,
//                           watermark: audio_description.data
//                       });
//                   } else {

//                       utils.handleError(res, message.error);
//                   }
//               });
//           } else {

//               utils.handleError(res, message.error);
//           }
//       });
//   }

//       // else if (media_type == "audio") {
//       //   const date = new Date()


//       //   let imageforStore = await utils.uploadFile({
//       //     fileData: req.files.image,
//       //     path: `${STORAGE_PATH}/test`,
//       //   })
//       //   
//       //   const randomname = Math.floor(1000000000 + Math.random() * 9000000000)

//       //   // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
//       //   const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`
//       //   const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;

//       //   // Output file path (replace with desired output file path and name)
//       //   const outputFile = 'path/to/your/outputfile.mp3';
//       //   // convert into mp3
//       //   await main1(inputFile, outputFileforconvertion)
//       //   fs.unlinkSync(inputFile)



//       //   // const filePaths = `/var/www/mongo/presshop_rest_apis/public/test/abc31704455329170.mp3`
//       //   const filePaths = `/var/www/mongo/presshop_rest_apis/public/test/test.mp3`
//       //   // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/powered.mp3`
//       //   const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`
//       //   const outputFilePaths = `/var/www/mongo/presshop_rest_apis/public/test/${date}.mp3`
//       //   const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${date + randomname}.mp3`
//       //   // 
//       //   await modify3addWatermarkToAudio(outputFileforconvertion, outputFilePath, outputFilePathsameduration)


//       //   // let resp = await main(filePaths, outputFilePath, outputFilePaths);
//       //   // 
//       //   // const buffer3 = fs.readFileSync(outputFileforconvertion); 
//       //   // let reupload = await utils.uploadFileforaudio({
//       //   //   fileData: buffer3,
//       //   //   path: `${STORAGE_PATH}/test/${randomname.mp3}`,
//       //   // })


//       //   // const filePat =  `${STORAGE_PATH}/test/${randomname}.mp3`
//       //   // 
//       //   //  old code 
//       //   // if( fs.existsSync(outputFileforconvertion) )  {

//       //   //   let resp = await main(outputFileforconvertion, outputFilePath, outputFilePaths);

//       //   // } else {

//       //   //   
//       //   // }

//       //   if (fs.existsSync(outputFilePathsameduration)) {

//       //     let resp = await main(outputFilePathsameduration, outputFileforconvertion, outputFilePaths);

//       //   } else {

//       //     
//       //   }

//       //   const exist = fs.existsSync(outputFilePaths)
//       //   // fs.unlinkSync(outputFilePathsameduration)
//       //   
//       //   const buffer1 = fs.readFileSync(outputFilePaths);

//       //   fs.unlinkSync(outputFileforconvertion)
//       //   let audio_description = await uploadFiletoAwsS3BucketforAudiowatermark({
//       //     fileData: buffer1,
//       //     path: `public/userImages`,
//       //   });

//       //   fs.unlinkSync(outputFilePaths)
//       //   // 

//       //   res.status(200).json({
//       //     code: 200,
//       //     data: image_name.fileName,
//       //     watermark: audio_description.data
//       //   });


//       // } 

//       else {
//         try {
//           if (media_type == "video") {
//             const date = new Date()
//             let imageforStore = await utils.uploadFile({
//               fileData: req.files.image,
//               path: `${STORAGE_PATH}/test`,
//             })


//             const split = imageforStore.fileName.split(".");
//             const extention = split[1];

//             const randomname = Math.floor(1000000000 + Math.random() * 9000000000)
//             const randomname2 = Math.floor(100 + Math.random() * 900)
//             // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
//             const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp4`
//             const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;
//             // await  main1(inputFile ,outputFileforconvertion)
//             // fs.unlinkSync(inputFile)

//             const Audiowatermak = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`
//             const imageWatermark = `/var/www/mongo/presshop_rest_apis/public/Watermark/newLogo.png`
//             const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${randomname+randomname2}.${extention}`
//             // 
//             // await modify3addWatermarkToAudio(outputFileforconvertion,outputFilePath,outputFilePathsameduration)
//             const value = mime.lookup(`.${extention}`)

//             await addWatermarkToVideo(inputFile, imageWatermark, Audiowatermak, outputFilePathsameduration)

//             const buffer1 = fs.readFileSync(outputFilePathsameduration);
//             let audio_description = await uploadFiletoAwsS3BucketforVideowatermark({
//               fileData: buffer1,
//               path: `public/userImages`,
//               mime_type:value
//             });

//             fs.unlinkSync(outputFilePathsameduration)
//             fs.unlinkSync(inputFile)
//             return res.status(200).json({
//               data: image_name.data,
//               watermark: audio_description.data
//             })
//           }
//         } catch (error) {
//           utils.handleError(res, error)
//         }
//       }
//   } catch (err) {
//       console.error('Error:', err);
//       return res.status(500).json({ code: 500, error: 'Internal server error' });
//   }
// };

// modified worker code 
// exports.uploadMediaforMultipleImage = async (req, res) => {
//   try {


//     console.log("req.files------------",req.files.image)
//     if (!req.files || !req.files.image || req.files.image.length === 0) {
//       return res.status(400).json({ code: 400, error: 'No files were uploaded.' });
//     }

//     const processMediaFile = async (file) => {
//       const objImage = {
//         fileData: file,
//         path: "public/contentData",
//       };

//       const image_name = await uploadFiletoAwsS3Bucket(objImage);


//       const objImage2 = {
//         fileData: file,
//         path:  `${STORAGE_PATH}/test`,
//       }
//       let imageforStore = await utils.uploadFile(objImage2);



//       const split = image_name.media_type.split("/");
//       const media_type = split[0];

//       if (media_type === "image") {
//         const worker = new Worker(path.resolve(__dirname, 'imageWorker.js'));
//         const ORIGINAL_IMAGE = image_name.data;
//         const WATERMARK = "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";
//         const FILENAME = Date.now() + image_name.fileName.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
//         const mime_type = image_name.media_type;

//         worker.postMessage({ ORIGINAL_IMAGE, WATERMARK, FILENAME, mime_type });

//         return new Promise((resolve, reject) => {
//           worker.on('message', (message) => {
//             if (message.error) {
//               return reject(new Error('Internal server error'));
//             }
//             resolve({
//               data: FILENAME,
//               watermark: message.imageUrl,
//               image_name: ORIGINAL_IMAGE,
//             });
//           });

//           worker.on('error', (error) => {
//             console.log("error0000000000000000",error)
//             reject(error);
//           });
//         });
//       } else if (media_type === "audio") {
//         const date = new Date();
//         const randomname = Math.floor(1000000000 + Math.random() * 9000000000);
//         const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${image_name.fileName}`;
//         const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`;

//         // Worker for audio conversion
//         const conversionWorker = new Worker('./audioConversionWorker.js', {
//           workerData: { inputFile, outputFileforconvertion }
//         });

//         return new Promise((resolve, reject) => {
//           conversionWorker.on('message', async (message) => {
//             if (message.success) {
//               const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`;
//               const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${date + randomname}.mp3`;

//               // Worker for watermarking
//               const watermarkWorker = new Worker('./audioWatermarkWorker.js', {
//                 workerData: { outputFileforconvertion, outputFilePath, outputFilePathsameduration }
//               });

//               watermarkWorker.on('message', async (message) => {
//                 if (message.success) {
//                   const outputFilePathsameduration = message.outputFilePathsameduration;

//                   if (fs.existsSync(outputFilePathsameduration)) {
//                     await main(outputFilePathsameduration, outputFileforconvertion, outputFilePath);
//                   } else {

//                   }

//                   const buffer1 = fs.readFileSync(outputFilePath);
//                   fs.unlinkSync(outputFileforconvertion);

//                   const audio_description = await uploadFiletoAwsS3BucketforAudiowatermark({
//                     fileData: buffer1,
//                     path: `public/userImages`,
//                   });

//                   fs.unlinkSync(outputFilePath);
//                   resolve({
//                     data: image_name.fileName,
//                     watermark: audio_description.data,
//                   });
//                 } else {
//                   reject(new Error("Error in Watermark Worker"));
//                 }
//               });

//               watermarkWorker.on('error', (error) => {
//                 reject(error);
//               });
//             } else {
//               reject(new Error("Error in Conversion Worker"));
//             }
//           });

//           conversionWorker.on('error', (error) => {
//             reject(error);
//           });
//         });
//       } else if (media_type === "video") {
//         const date = new Date();
// const value = req.files.image.mimetype
// const splitvalue = value.split("/");
//       const media_typevalue = splitvalue[0];
// if(media_typevalue == "video") {

//   for (let i = 0; i < req.files.image.length; i++) {
//     const element = array[i];
//     let imageforStore = await utils.uploadFile({
//       fileData: i,
//       path: `${STORAGE_PATH}/test`,
//     });
//     const split = imageforStore.fileName.split(".");
//     const extention = split[1];
//     const randomname = Math.floor(1000000000 + Math.random() * 9000000000);
//     const randomname2 = Math.floor(100 + Math.random() * 900);
//     const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;
//     const Audiowatermak = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`;
//     const imageWatermark = `/var/www/mongo/presshop_rest_apis/public/Watermark/newLogo.png`;
//     const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${randomname + randomname2}.${extention}`;
//     const mime_type = mime.lookup(`.${extention}`);

//     await addWatermarkToVideo(inputFile, imageWatermark, Audiowatermak, outputFilePathsameduration);

//     const buffer1 = fs.readFileSync(outputFilePathsameduration);
//     const video_description = await uploadFiletoAwsS3BucketforVideowatermark({
//       fileData: buffer1,
//       path: `public/userImages`,
//       mime_type
//     });

//     fs.unlinkSync(outputFilePathsameduration);
//     fs.unlinkSync(inputFile);

//     return {
//       data: image_name.data,
//       watermark: video_description.data,
//     };

//   }
// }

//         // const conversionWorker = new Worker('./videoWatermarkWorker.js', {
//         //   workerData: { inputFile, outputFileforconvertion }
//         // });


//       //   try {
//       //     const imageFile = req.files.image;
//       // console.log("path-------------------",imageFile.path)
//       //     // Create a worker to handle the file processing
//       //     const worker = new Worker(path.resolve(__dirname, 'videoWatermarkWorker.js'), {
//       //       workerData: {
//       //         fileData: imageFile,
//       //         STORAGE_PATH: STORAGE_PATH,
//       //       }
//       //     });

//       //     // Listen for messages from the worker (e.g., final result or progress updates)
//       //     worker.on('message', (message) => {
//       //       if (message.error) {
//       //         return res.status(500).json({ error: message.error });
//       //       }
//       //       res.status(200).json(message);
//       //     });

//       //     // Handle worker errors
//       //     worker.on('error', (error) => {
//       //       res.status(500).json({ error: 'Worker Error: ' + error.message });
//       //     });

//       //     // Handle worker exit
//       //     worker.on('exit', (code) => {
//       //       if (code !== 0) {
//       //         console.error(`Worker stopped with exit code ${code}`);
//       //       }
//       //     });
//       //   } catch (error) {
//       //     console.log("error-------",error)
//       //     // res.status(500).json({ error: 'Internal server error' });
//       //   }
//       } else {
//         return {
//           data: image_name.fileName,
//           media_type: image_name.media_type
//         };
//       }
//     };

//     // Process all files concurrently
//     const images = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

//     const filePromises = images.map(file => processMediaFile(file));
//     // const filePromises = req.files.image.map(file => processMediaFile(file));
//     const results = await Promise.all(filePromises);

//     res.status(200).json({
//       code: 200,
//       results,
//     });
//   } catch (err) {
//     console.error('Error:', err);
//     return res.status(500).json({ code: 500, error: 'Internal server error' });
//   }
// };



exports.uploadMediaforMultipleImage = async (req, res) => {
  try {
    let imageFiles = req.files.image;
    if (!Array.isArray(imageFiles)) {
      imageFiles = [imageFiles]; // Handle the case where there's only one file
    }

    const fileUploadPromises = imageFiles.map(async (file) => {
      const objImage = {
        fileData: file,
        path: "public/contentData",
      };

      // Upload file to AWS S3 bucket
      const image_name = await uploadFiletoAwsS3Bucket(objImage);


      const objImage2 = {
        fileData: file,
        path: `${STORAGE_PATH}/test`,
      }
      let imageforStore = await utils.uploadFile(objImage2)


      const split = image_name.media_type.split("/");
      const media_type = split[0];
      const FILENAME = Date.now() + image_name.fileName.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");

      if (media_type === "image") {
        const ORIGINAL_IMAGE = image_name.data;
        const WATERMARK = "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";

        // Processing images and adding watermark
        const image = await Jimp.read(ORIGINAL_IMAGE);
        const logo = await Jimp.read(WATERMARK);

        logo.cover(image.getWidth(), image.getHeight());

        const watermarkedImage = await image.composite(logo, 0, 0, [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 1,
            opacityDest: 0.1,
          },
        ]);

        // Convert watermarked image to buffer
        const imageDataBuffer = await new Promise((resolve, reject) => {
          watermarkedImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) reject(err);
            else resolve(buffer);
          });
        });

        // Upload image buffer to S3
        const s3Params = {
          Bucket: process.env.Bucket, //"uat-presshope", // S3 bucket name
          Key: `contentData/${FILENAME}`,
          Body: imageDataBuffer,
          ContentType: image_name.media_type,
        };
        const s3 = new AWS.S3();
        const s3Data = await s3.upload(s3Params).promise();
        const finalUrl = s3Data.Location.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);

        return { type: "image", original: image_name.data, watermark: finalUrl };

      } else if (media_type === "audio") {
        // Handle audio file uploads and watermark addition
        const randomname = Math.floor(1000000000 + Math.random() * 9000000000);
        const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`;
        const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${image_name.fileName}`;

        // Convert and add watermark to audio
        await main1(inputFile, outputFileforconvertion);
        fs.unlinkSync(inputFile);

        const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${Date.now() + randomname}.mp3`;
        await modify3addWatermarkToAudio(outputFileforconvertion, outputFilePathsameduration);

        const buffer1 = fs.readFileSync(outputFilePathsameduration);
        const audio_description = await uploadFiletoAwsS3BucketforAudiowatermark({
          fileData: buffer1,
          path: `public/userImages`,
        });

        const final = audio_description.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);

        return { type: "audio", watermark: final };

      } else if (media_type === "video") {
        const split = imageforStore.fileName.split(".");
        const extention = split[1];
        const value = mime.lookup(`.${extention}`)
        // const value = req.files.image.mimetype
        // console.log("value======",value,req.files.image)
        // const splitvalue = value.split("/");
        // const media_typevalue = splitvalue[0];
        // for (const x of req.files.image.mimetype) {

        // for (const x of req.files.image) {

        // let imageforStore = await utils.uploadFile({
        //   fileData: x,
        //   path: `${STORAGE_PATH}/test`,
        // })
        // Handle video file uploads and watermark addition
        const randomname = Math.floor(1000000000 + Math.random() * 9000000000);
        const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp4`;
        const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;

        const Audiowatermak = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`;
        const imageWatermark = `/var/www/mongo/presshop_rest_apis/public/Watermark/newLogo.png`;
        const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp4`;

        await addWatermarkToVideo(inputFile, imageWatermark, Audiowatermak, outputFilePathsameduration);

        const buffer1 = fs.readFileSync(outputFilePathsameduration);
        const video_description = await uploadFiletoAwsS3BucketforVideowatermark({
          fileData: buffer1,
          path: `public/userImages`,
          mime_type: value
        });

        const final = video_description.data.replace(process.env.AWS_BASE_URL, process.env.AWS_BASE_URL_CDN);

        return { type: "video", watermark: final };
        // }
        // }
      }

      return null;
    });

    // Execute all upload promises concurrently
    const uploadResults = await Promise.all(fileUploadPromises);

    return res.status(200).json({
      code: 200,
      files: uploadResults,
    });

  } catch (err) {
    console.error("Error in uploadMedia:", err);
    return res.status(500).json({ code: 500, error: "Internal server error" });
  }
};


exports.uploadMultipleProjectImgs = async (req, res) => {
  try {
    let multipleImgs = [];
    let singleImg = [], durationInSeconds;
    if (req.user.stripe_status == 0 || req.user.stripe_status == "0") {

      throw utils.buildErrObject(
        422,
        `not verified`
      );
    }



    const path = req.body.path || "public/contentData";
    if (req.files && Array.isArray(req.files.images)) {
      for await (const imgData of req.files.images) {
        const data = await utils.uploadFile({
          fileData: imgData,
          path: `${path}`,
        });
        multipleImgs.push(`${data.fileName}`
        );


      }
    } else if (req.files && !Array.isArray(req.files.images)) {


      const data = await utils.uploadFile({
        fileData: req.files.images,
        path: `${path}`,
      });






      const split = data.media_type.split("/");
      const media_type = split[0];

      singleImg.push(
        `${data.fileName}`
      );

    }
    res.status(200).json({
      code: 200,
      imgs:
        req.files && Array.isArray(req.files.images) ? multipleImgs : singleImg,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getAllchat = async (req, res) => {
  try {
    const data = req.body;
    const isValidObjectId = (ObjectId) => {
      return mongoose.Types.ObjectId.isValid(ObjectId)
    }

    console.log("!isValidObjectId(data.room_id)", !isValidObjectId(data.room_id), "secound======", isValidObjectId(data.room_id))


    // const isObjectId = function (ObjectId) {
    //   return  mongoose.isValidObjectId(ObjectId)
    //   }
    let resp, findcontentdetails, findcontentdetailsisPayment, findcontentdetailsrating, status = null;

    if (!isValidObjectId(data.room_id)) {


      resp = await Chat.find({ $or: [{ room_id: data?.room_id }] }).populate(
        "receiver_id sender_id"
      );
      // findcontentdetails = await Content.findOne({ _id: mongoose.Types.ObjectId(data.room_id) })
      findcontentdetailsisPayment = await Chat.find({ $or: [{ room_id: data?.room_id }], message_type: "PaymentIntentApp" })
      status = true
      if (!findcontentdetailsisPayment) {
        status = false
      }


      findcontentdetailsrating = await Chat.findOne({ $or: [{ room_id: data?.room_id }], message_type: "rating_for_hopper" })
    } else {
      resp = await Chat.find({ $or: [{ image_id: data?.room_id }, { room_id: data?.room_id }] }).populate(
        "receiver_id sender_id"
      );




      // let findcontentdetails, findcontentdetailsisPayment, findcontentdetailsrating ,status = null;


      // if(data.type != "task_content"){

      findcontentdetails = await Content.findOne({ _id: mongoose.Types.ObjectId(data.room_id) })
      findcontentdetailsisPayment = await Chat.find({ $or: [{ image_id: data?.room_id }, { room_id: data?.room_id }], message_type: "PaymentIntentApp" })
      status = true
      if (!findcontentdetailsisPayment) {
        status = false
      }


      findcontentdetailsrating = await Chat.findOne({ $or: [{ image_id: data?.room_id }, { room_id: data?.room_id }], message_type: "rating_for_hopper" })
      // }
    }



    //     const resp = await Chat.find({ $or: [{ image_id: data.type == "task_content" ? new ObjectId() : data?.room_id }, { room_id: data?.room_id }] }).populate(
    //       "receiver_id sender_id"
    //     );




    //     let findcontentdetails, findcontentdetailsisPayment, findcontentdetailsrating ,status = null;


    // if(data.type != "task_content"){

    //    findcontentdetails = await Content.findOne({ _id: mongoose.Types.ObjectId(data.room_id) })
    //    findcontentdetailsisPayment = await Chat.find({ $or: [{ image_id: data.type == "task_content" ? new ObjectId() :data?.room_id }, { room_id: data?.room_id }], message_type: "PaymentIntentApp" })
    //    status = true
    //   if (!findcontentdetailsisPayment) {
    //     status = false
    //   }


    //    findcontentdetailsrating = await Chat.findOne({ $or: [{ image_id: data.type == "task_content" ? new ObjectId() :data?.room_id }, { room_id: data?.room_id }], message_type: "rating_for_hopper" })
    // }

    res.json({
      code: 200,
      rating: findcontentdetailsrating ? findcontentdetailsrating : null,
      status: status,
      views: findcontentdetails?.content_view_count_by_marketplace_for_app,
      purchased_count: findcontentdetails?.purchased_mediahouse.length,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reply = async (req, res) => {
  try {
    // const data = req.body;

    // const user = await getItem(Models.Submittion_form, data.id);

    const data = await Admin.findOne({
      role: "admin"
      // _id: mongoose.Types.ObjectId("64bfa693bc47606588a6c807"),
    });

    return res.status(200).json({
      code: 200,
      data: data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getAllroombycontent = async (req, res) => {
  try {
    const data = req.body;

    var resp = await Room.find({ content_id: data.content_id }).populate(
      "receiver_id sender_id"
    );
    res.json({
      code: 200,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.getCategory = async (req, res) => {
  try {
    const data = req.query;
    let CATEGORIES
    const condition = {
      type: data.type,
      // is_deleted:false
    };
    if (data.type) {

      CATEGORIES = await db.getItems(Category, condition);
    } else {
      CATEGORIES = await Category.find({ type: "tasks" });
    }

    res.status(200).json({
      code: 200,
      categories: CATEGORIES,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.Addcontact_us = async (req, res) => {
  try {
    const data = req.body;

    let resp = await db.createItem(data, contact_us);
    res.json({
      code: 200,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getallofferMediahouse = async (req, res) => {
  try {
    const data = req.query;

    const resp = await Chat.find({
      image_id: data.image_id,
      sender_type: "Mediahouse",
      message_type: "Mediahouse_initial_offer",
    }).populate("receiver_id sender_id");

    //     const totalcurrentMonths = await Chat.aggregate([

    //       {
    //         $match:{
    //           $expr: {
    //             $and: [{ $eq: ["$image_id", mongoose.Types.ObjectId(data.image_id)] },
    //             { $eq: ["$sender_type", "Mediahouse"] }
    //           ],
    //           },
    //         }},

    //       {
    //         $group: {
    //           _id: "$sender_id",
    //           details: { $push: "$$ROOT" },
    //         },

    //       },
    //       {
    //         $project: {
    //           _id: 1,
    //           image_id:1,
    //           room_id: 1,
    //           amount:1,
    //           sender_type:1,
    //           sender_id:1,
    //           details: 1,

    //           // uploaded_content: 1,
    //           // brodcasted_by: 1,
    //           // uploaded_by: 1,
    //           // admin_details:1,
    //           // imagevolume: imagecount * task_id.photo_price
    //         },
    //       },
    //     //   {
    //     // $match:{
    //     //   $expr: {
    //     //     $and: [{ $eq: ["$image_id", mongoose.Types.ObjectId(data.image_id)] },
    //     //     { $eq: ["$sender_type", "Mediahouse"] }
    //     //   ],
    //     //   },
    //     // }},

    //       {
    //         $lookup: {
    //           from: "chats",
    //           let: { hopper_id: "$_id" },

    //           pipeline: [
    //             {
    //               $match:{
    //                 $expr: {
    //                   $and: [{ $eq: ["$image_id", mongoose.Types.ObjectId(data.image_id)] },
    //                   { $eq: ["$sender_type", "Mediahouse"] },
    //                   { $eq: ["$messege_type", "Mediahouse_initial_offer"] }
    //                 ],
    //                 },
    //               }},
    //             // {
    //             //   $lookup: {
    //             //     from: "avatars",
    //             //     localField: "avatar_id",
    //             //     foreignField: "_id",
    //             //     as: "avatar_id",
    //             //   },
    //             // },
    //             // { $unwind: "$avatar_id" },
    //           ],
    //           as: "hopper_id",
    //         },
    //       },
    //  // { $unwind: "$receiver_id" },
    //       {
    //         $lookup: {
    //           from: "users",
    //           localField: "_id",
    //           foreignField: "_id",
    //           as: "sender_id",
    //         },
    //       },
    //       { $unwind: "$sender_id" },

    //       {
    //         $lookup: {
    //           from: "users",
    //           localField: "receiver_id",
    //           foreignField: "_id",
    //           as: "receiver_id",
    //         },
    //       },
    //       // { $unwind: "$receiver_id" },
    //     ])
    res.json({
      code: 200,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getfeeds = async (req, res) => {
  try {
    const data = req.query;

    let condition = {
      "Vat": {
        $elemMatch: {
          purchased_time: {
            $lte: new Date(moment().utc().subtract(7, "days").endOf("days").format()),
          }
        }
      },
      paid_status: "paid"
    }
    // {  };
    if (data.posted_date) {
      data.posted_date = parseInt(data.posted_date);
      const today = new Date();
      const days = new Date(
        today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
      );

      condition.createdAt = { $gte: days };
    }

    if (data.startdate && data.endDate) {
      // delete condition.status;
      // data.startdate = parseInt(data.startdate);
      // const today = data.endDate;
      // const days = new Date(today.getTime() - (data.startdate*24*60*60*1000));
      // 
      condition.createdAt = {
        $lte: new Date(data.endDate),
        $gte: new Date(data.startdate),
      }; //{[Op.gte]: data.startdate};
    }

    if (data.type == "exclusive") {
      //give any status results when user wants its draft results
      // delete condition.status;
      condition.type = "exclusive";
    }

    if (data.sharedtype == "shared") {
      //give any status results when user wants its draft results
      // delete condition.status;
      condition.type = "shared";
    }

    if (data.allContent == "allcontent") {
      //give any status results when user wants its draft results
      // delete condition.status;
      // condition.type = "shared";
      condition = { paid_status: "paid" };
    }

    if (data.paid_status == "paid") {
      //give any status results when user wants its draft results
      // delete condition.status;
      // condition.type = "shared";
      condition = { paid_status: "paid" };
    }

    if (data.paid_status == "un_paid") {
      //give any status results when user wants its draft results
      // delete condition.status;
      // condition.type = "shared";
      condition = { paid_status: "un_paid" };
    }

    condition.hopper_id = { $nin: [req.user._id] }
    const resp = await Content.find(condition)
      .populate("purchased_publication hopper_id category_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .sort({ published_time_date: -1 })
      .limit(parseInt(data.limit))
      .skip(parseInt(data.offset));

    /*  const totalcurrentMonths = await Chat.aggregate([

       {
         $match:{
           $expr: {
             $and: [{ $eq: ["$image_id", mongoose.Types.ObjectId(data.image_id)] },
             { $eq: ["$sender_type", "Mediahouse"] }
           ],
           },
         }},

       {
         $group: {
           _id: "$sender_id",
           details: { $push: "$$ROOT" },
         },

       },
       {
         $project: {
           _id: 1,
           image_id:1,
           room_id: 1,
           amount:1,
           sender_type:1,
           sender_id:1,
           details: 1,

           // uploaded_content: 1,
           // brodcasted_by: 1,
           // uploaded_by: 1,
           // admin_details:1,
           // imagevolume: imagecount * task_id.photo_price
         },
       },
     //   {
     // $match:{
     //   $expr: {
     //     $and: [{ $eq: ["$image_id", mongoose.Types.ObjectId(data.image_id)] },
     //     { $eq: ["$sender_type", "Mediahouse"] }
     //   ],
     //   },
     // }},

       {
         $lookup: {
           from: "chats",
           let: { hopper_id: "$_id" },

           pipeline: [
             {
               $match:{
                 $expr: {
                   $and: [{ $eq: ["$image_id", mongoose.Types.ObjectId(data.image_id)] },
                   { $eq: ["$sender_type", "Mediahouse"] },
                   { $eq: ["$messege_type", "Mediahouse_initial_offer"] }
                 ],
                 },
               }},
             // {
             //   $lookup: {
             //     from: "avatars",
             //     localField: "avatar_id",
             //     foreignField: "_id",
             //     as: "avatar_id",
             //   },
             // },
             // { $unwind: "$avatar_id" },
           ],
           as: "hopper_id",
         },
       },
  // { $unwind: "$receiver_id" },
       {
         $lookup: {
           from: "users",
           localField: "_id",
           foreignField: "_id",
           as: "sender_id",
         },
       },
       { $unwind: "$sender_id" },

       {
         $lookup: {
           from: "users",
           localField: "receiver_id",
           foreignField: "_id",
           as: "receiver_id",
         },
       },
       // { $unwind: "$receiver_id" },
     ]) */
    res.json({
      code: 200,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.updatefeed = async (req, res) => {
  try {
    const data = req.body;

    let resp = await db.updateItem(data.content_id, Content, data);
    res.json({
      code: 200,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getearning = async (req, res) => {
  try {
    const data = req.query;
    const condition = {
      type: data.type,
    };
    const CATEGORIES = await User.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$_id", mongoose.Types.ObjectId(req.user._id)] },
              // {$eq:["$status","active"]}
            ],
          },
        },
      },
      {
        $lookup: {
          from: "avatars",
          localField: "avatar_id",
          foreignField: "_id",
          as: "avatar_details",
        },
      },
      {
        $unwind: {
          path: "$avatar_details",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "hopperpayments",
          localField: "_id",
          foreignField: "hopper_id",
          as: "hopper_transiction",
        },
      },

      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper_id", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$hopper_id", "$$list"] },
                    { $eq: ["$paid_status_for_hopper", true] },
                    // { $eq: ["$content_id", "$$id"] },
                    // { $eq: ["$type", "content"] },
                  ],
                },
              },
            },
          ],
          as: "transictions",
        },
      },

      {
        $addFields: {
          total_earining: { $sum: "$transictions.payable_to_hopper" },
        },
      },
    ]);
    res.status(200).json({
      code: 200,
      resp: CATEGORIES[0],
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
async function uploadFile(filePath) {
  try {
    const file = await stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: filePath.data,
        name: filePath.name, // Replace with your file name
        type: 'application/octet-stream',
      },
    });


    return file.id;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
exports.createStripeAccount = async (req, res) => {
  try {

    const id = req.user._id;
    // const my_acc = await getItemAccQuery(StripeAccount , {id:id});
    const my_acc = await StripeAccount.findOne({ user_id: id });
    if (my_acc) {

      throw utils.buildErrObject(
        422,
        `You already connected with us OR check your email to verify ${my_acc._id}`
      );
    } else {



      console.log("id------", req.user._id, "req.user.dob", req.user.dob)


      // if (!req.user.dob) {
      //   throw utils.buildErrObject(
      //     400,
      //     `dob is required`
      //   );
      // }


      if (!req.user.email) {
        throw utils.buildErrObject(
          400,
          `email is required`
        );
      }



      if (!req.user.first_name) {
        throw utils.buildErrObject(
          400,
          `first_name is required`
        );
      }


      if (!req.user.last_name) {
        throw utils.buildErrObject(
          400,
          `last_name is required`
        );
      }

      if (req.user.country?.toLowerCase() == "india") {
        throw utils.buildErrObject(
          400,
          `Connected accounts in INDIA cannot be created by platforms in GB `
        );
      }

      if (!req.user.country) {
        throw utils.buildErrObject(
          400,
          `country is required`
        );
      }





      const email = req.user.email ? req.user.email : 'sample@example.com';
      const firstName = req.user.first_name ? req.user.first_name : 'John';
      const lastName = req.user.last_name ? req.user.last_name : 'Doe';
      const phone = parseInt(req.user.phone) || 7009656304;
      const dob = req.user.dob ? req.user.dob : '01/01/1999';
      const array = dob.split("/")
      const dobDay = parseInt(array[0])
      const dobMonth = parseInt(array[1])
      const dobYear = parseInt(array[2])

      // const customer = await stripe.customers.create({
      //   email: email,
      //   name:firstName
      // });

      console.log("req.body============", req.body)


      const frontfiles = await uploadFile(req.files.front)
      // const backfiles = await uploadFile(req.files.back)

      const countryName = req.user.country ? req.user.country : "United Kingdom";
      const countryCode = lookup.byCountry(countryName)?.iso2;
      const value = countrycurrency.getParamByParam('countryName', countryName, 'currency')

      // 
      // Create a new Stripe account with the provided or sample information
      const account = await stripe.accounts.create({
        type: 'custom', // Use 'custom' to handle all information collection yourself
        country: countryCode, // Change this to the appropriate country code
        email: email,
        business_type: 'individual', // or 'company'
        individual: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          verification: {
            // document:{
            document: {
              front: frontfiles,//req.body.front,//uploadFile(req.files.front), // Replace with the file ID of the front of the ID document
              // back: backfiles,//req.body.back,//uploadFile(req.files.back) // Replace with the file ID of the back of the ID document (if applicable)
            }
            // }
          },
          address: {
            city: req.user.city,
            country: countryCode,
            line1: "mainstreat",
            line2: null,
            postal_code: req.user.post_code,
            state: "WA"
          },
          dob: {
            day: parseInt(dobDay),
            month: parseInt(dobMonth),
            year: parseInt(dobYear)
          }
        },
        // requirement_collection: "application",
        business_profile: {
          mcc: '8398', // Merchant Category Code
          product_description: 'Your product description'
        },



        external_account: {
          object: 'bank_account',
          country: countryCode,
          currency: value,
          account_holder_name: req.body.account_holder_name,
          account_holder_type: 'individual',
          sort_code: req.body.sort_code, // Replace with actual sort code
          account_number: req.body.account_number // Replace with actual account number
        },

        tos_acceptance: {
          date: Math.floor(Date.now() / 1000), // Unix timestamp
          ip: req.ip // User's IP address
        },


        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
          link_payments: { requested: true },
          // india_international_payments: {requested: true},
          bank_transfer_payments: { requested: true },
        },



      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id, //'acct_1NGd5wRhxPwgT5HS',
        refresh_url:
          "https://uat.presshop.live:5019/hopper/stripeStatus?status=0&id=" +
          id,
        return_url:
          "https://uat.presshop.live:5019/hopper/stripeStatus?status=1&id=" +
          id,
        type: "account_onboarding",
        // collection_options: {
        //   fields: "eventually_due"
        // }
      });

      // await db.createItem(
      //   {
      //     user_id: id,
      //     account_id: account.id,
      //   },
      //   StripeAccount
      // );



      if (req.files && req.files.images) {
        let doc_to_become_pro = {};

        // Check if there are at least 3 files
        if (req.files.images.length < 3) {
          throw utils.buildErrObject(422, "Please upload at least two documents.");
        }

        // Assuming the first file is for govt_id, second for photography_licence, and third for comp_incorporation_cert
        // const govt_id = await uploadFiletoAwsS3Bucket({
        //   fileData: req.files.images[1], // First file (index 0) for govt_id
        //   path: "public/docToBecomePro",
        // });

        // const photography_licence = await uploadFiletoAwsS3Bucket({
        //   fileData: req.files.images[2], // Second file (index 1) for photography_licence
        //   path: "public/docToBecomePro",
        // });

        // const comp_incorporation_cert = await uploadFiletoAwsS3Bucket({
        //   fileData: req.files.images[3], // Third file (index 2) for comp_incorporation_cert
        //   path: "public/docToBecomePro",
        // });


        const govt_id = req.files.images[0]
          ? await uploadFiletoAwsS3Bucket({
            fileData: req.files.images[0], // First file (index 0)
            path: "public/docToBecomePro",
          })
          : null;

        const photography_licence = req.files.images[1]
          ? await uploadFiletoAwsS3Bucket({
            fileData: req.files.images[1], // Second file (index 1)
            path: "public/docToBecomePro",
          })
          : null;

        const comp_incorporation_cert = req.files.images[2]
          ? await uploadFiletoAwsS3Bucket({
            fileData: req.files.images[2], // Third file (index 2), if provided
            path: "public/docToBecomePro",
          })
          : null;



        const data = req.body
        // Dynamically build the doc_to_become_pro object based on available documents
        doc_to_become_pro = {
          govt_id: govt_id ? govt_id.fileName : null,
          govt_id_mediatype: govt_id ? req.files.images[0].mimetype : null,
          photography_licence: photography_licence ? photography_licence.fileName : null,
          photography_mediatype: photography_licence ? req.files.images[1].mimetype : null,
          comp_incorporation_cert: comp_incorporation_cert ? comp_incorporation_cert.fileName : null,
          comp_incorporation_cert_mediatype: comp_incorporation_cert ? req.files.images[2].mimetype : null,
        };



        // Build the doc_to_become_pro object with index-based association
        // doc_to_become_pro = {
        //   govt_id: govt_id.fileName,
        //   govt_id_mediatype:  req.files.images[1].mimetype,
        //   photography_licence: photography_licence.fileName,
        //   photography_mediatype:  req.files.images[2].mimetype,
        //   comp_incorporation_cert: comp_incorporation_cert.fileName,
        //   comp_incorporation_cert_mediatype:req.files.images[3].mimetype,
        // };

        // Update the user's documents in the database
        data.doc_to_become_pro = doc_to_become_pro;
        data.user_id = id
        const docUploaded = await db.updateItem(data.user_id, Hopper, data);

        // if (data.doc) data.doc = JSON.parse(data.doc);

        // for (let docz of data.doc) {
        //   const hopperDocs = await HoppersUploadedDocs.findOne({
        //     doc_id: docz.doc_id,
        //     hopper_id: req.user._id
        //   });

        //   let z;
        //   if (hopperDocs) {
        //     z = hopperDocs;
        //   } else {
        //     z = await db.createItem({ hopper_id: req.user._id, doc_id: docz.doc_id }, HoppersUploadedDocs);
        //   }
        // }


      }
      // const obj = {
      //   stripe_bank_id: externalAccounts.data[0].id,
      //   user_id: id,
      //   bank_name: externalAccounts.data[0].bank_name,
      //   acc_number: req.body.account_number,
      //   sort_code: req.body.sort_code,
      //   is_default: req.body.is_default,
      //   acc_holder_name: req.body.account_holder_name
      // }

      // const updateData = await Hopper.updateOne(
      //   {
      //     _id: id,
      //   },
      //   { $push: { bank_detail: obj } }
      // );

      // const updateDatas = await Hopper.updateOne(
      //   {
      //     _id: id,
      //   },
      //   { $set: { stripe_account_id: account.id } }
      // );

      return res.status(200).json({
        code: 200,
        message: accountLink,
        account_id: account,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};



// exports.createStripeAccount = async (req, res) => {
//   try {

//     const data = req.body
//     const id = req.user._id;

//     // const my_acc = await StripeAccount.findOne({ user_id: id });
//     // if (my_acc) {

//     //   throw utils.buildErrObject(
//     //     422,
//     //     `You already connected with us OR check your email to verify ${my_acc._id}`
//     //   );
//     // } else {

//     const countryName = req.body.country;
//     const countryCode = lookup.byCountry(countryName)?.iso2;
//     console.log("req.files.front=============", req.files.front)
//     const value = countrycurrency.getParamByParam('countryName', countryName, 'currency')


//     const frontfiles = await uploadFile(req.files.front)
//     const backfiles = await uploadFile(req.files.back)


//     // const logo = await uploadFiletoAwsS3Bucket({
//     //   fileData: req.files.logo,
//     //   path: `public/logo`,
//     // });


//     const account = await stripe.accounts.create({
//       type: 'custom',
//       country: countryCode, // Specify the country of the non-profit
//       email: req.body.email, // Email of the non-profit organization
//       business_type: 'individual',
//       individual: {
//         first_name: data.firstName,
//         last_name: data.lastName,
//         email: data.email,
//         phone: data.phone,
//         verification: {
//           // document:{
//           document: {
//             front: frontfiles, // Replace with the file ID of the front of the ID document
//             back: backfiles // Replace with the file ID of the back of the ID document (if applicable)
//           }
//           // }
//         },
//         address: {
//           city: req.body.city,
//           country: countryCode,
//           line1: "mainstreat",
//           line2: null,
//           postal_code: req.body.post_code,
//           state: "WA"
//         },
//         dob: {
//           day: parseInt(data.dobDay),
//           month: parseInt(data.dobMonth),
//           year: parseInt(data.dobYear)
//         }
//       },

//       business_profile: {
//         mcc: '8398', // Merchant Category Code
//         product_description: 'Your product description'
//       },
//       capabilities: {
//         card_payments: { requested: true }, // Enable card payments
//         transfers: { requested: true }, // Enable transfers (payouts) to bank accounts
//       },

//       external_account: {
//         object: 'bank_account',
//         country: countryCode,
//         currency: value,
//         account_holder_name: 'John Doe',
//         account_holder_type: 'individual',
//         sort_code: data.sort_code, // Replace with actual sort code
//         account_number: data.account_number // Replace with actual account number
//       },

//       tos_acceptance: {
//         date: Math.floor(Date.now() / 1000), // Unix timestamp
//         ip: req.ip // User's IP address
//       },
//     });


//     // data.front = frontfiles
//     // data.back = backfiles
//     // data.logo = logo.data
//     // data.stripe_account_id  =  account.id
//     // const charitycreate = await Charity.create(data)

//     // await db.createItem(
//     //   {
//     //     user_id: charitycreate._id,
//     //     account_id: account.id,
//     //   },
//     //   StripeAccount
//     // );



//     const accountLink = await stripe.accountLinks.create({
//       account: account.id, //'acct_1NGd5wRhxPwgT5HS',
//               refresh_url:
//           "https://uat.presshop.live:5019/hopper/stripeStatus?status=0&id=" +
//           id,
//         return_url:
//           "https://uat.presshop.live:5019/hopper/stripeStatus?status=1&id=" +
//           id,
//       type: "account_onboarding",
//       collection_options: {
//         fields: "eventually_due"
//       }
//     });


//     res.status(200).json({
//       code: 200,
//       data: accountLink.url,
//     });

//     // }
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };

exports.stripeStatus = async (req, res) => {
  try {
    const data = req.query;
    let user = await Hopper.findOne({ _id: data.id });
    if (parseInt(data.status) === 1) {

      // user.stripe_status = 1;
      // let account = await getItemAccQuery(Models.StripeAccount , {user_id:data.id});
      // const my_acc = await StripeAccount.findOne({ user_id: data.id });
      // user.stripe_account_id = my_acc.account_id;
      await user.save();
      // await Models.StripeAccount.destroy({
      //   where:{user_id:data.id}
      // });
      return res.status(200).json({
        code: 200,
        message: "success",
      });
    } else {
      await StripeAccount.deleteOne({ user_id: data.id });
      return res.status(200).json({
        code: 200,
        message: "try again",
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getalllistofEarning = async (req, res) => {
  try {
    // const data = req.body;

    const condition = {
      hopper_id: mongoose.Types.ObjectId(req.user._id),
    };

    const data = req.query;


    if (data.is_draft == "true") {
      delete condition.status;
      condition.is_draft = true;
    }

    if (data.type == "exclusive") {
      condition.typeofcontent = "exclusive";
    }

    if (data.sharedtype == "shared") {
      condition.typeofcontent = "shared";
    }

    if (data.allcontent == "content") {
      condition.type = "content";
    }

    if (data.alltask == "task_content") {
      condition.type = "task_content";
    }

    if (data.livecontent == "un_paid") {
      condition.paid_status = "un_paid";
    }

    if (data.sale_status == "sold") {
      condition.sale_status = "sold";
    }

    if (data.payment_pending == "true") {
      condition.payment_pending = "true";
    }

    if (data.paid_status == "paid") {
      condition.paid_status_for_hopper = true;
    }

    if (data.paid_status == "un_paid") {
      condition.paid_status_for_hopper = false;
    }

    if (data.startdate && data.endDate) {
      condition.createdAt = {
        $lte: new Date(data.endDate),
        $gte: new Date(data.startdate),
      }; //{[Op.gte]: data.startdate};
    }

    if (data.posted_date) {
      data.posted_date = parseInt(data.posted_date);
      const today = new Date();
      const days = new Date(
        today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
      );

      condition.createdAt = { $gte: days };
    }

    const draftDetails = await hopperPayment.aggregate([
      {
        $lookup: {
          from: "contents",
          localField: "content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      { $unwind: "$content_id" },
      // {
      //   $match: condition,
      // },


      // {
      //   $lookup: {
      //     from: "uploadcontents",
      //     localField: "task_content_id",
      //     foreignField: "_id",
      //     as: "task_content_id",
      //   },
      // },


      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     let: { contentIds: "$hopper_id", list: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$hopper_id", mongoose.Types.ObjectId(req.user._id)] },
      //               { $eq: ["$paid_status_for_hopper", true] },
      //               // { $eq: ["$content_id", "$$id"] },
      //               { $eq: ["$type", "task_content"] },
      //             ],
      //           },
      //         },
      //       },

      //    {
      //   $lookup: {
      //     from: "uploadcontents",
      //     localField: "task_content_id",
      //     foreignField: "_id",
      //     as: "task_content_details",
      //   },
      //    },


      //     ],
      //     as: "transictions_true",
      //   },
      // },


      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     let: { contentIds: "$hopper_id", list: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$hopper_id", mongoose.Types.ObjectId(req.user._id)] },
      //               { $eq: ["$paid_status_for_hopper", true] },
      //               // { $eq: ["$content_id", "$$id"] },
      //               { $eq: ["$type", "content"] },
      //             ],
      //           },
      //         },
      //       },

      //       {
      //           $lookup: {
      //             from: "contents",
      //             localField: "content_id",
      //             foreignField: "_id",
      //             as: "content_id",
      //           },
      //         },
      //         // {
      //         //   $addFields: {
      //         //     typeofcontent: "$content_id.type",
      //         //   },
      //         // },

      //     ],
      //     as: "transictions_true_for_content",
      //   },
      // },

      // {
      //   $addFields: { total_content:{ $concatArrays: ["$transictions_true", "$transictions_true_for_content"] }}
      // },

      {
        $addFields: {
          typeofcontent: "$content_id.type",
        },
      },

      {
        $match: condition,
      },

      {
        $lookup: {
          from: "users",
          let: { user_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
            // {
            //   $lookup: {
            //     from: "avatars",
            //     localField: "avatar_id",
            //     foreignField: "_id",
            //     as: "avatar_ids",
            //   },
            // },
            // { $unwind: "$avatar_ids" },

          ],
          as: "hopper_id",
        },
      },

      { $unwind: "$hopper_id" },
      {
        $lookup: {
          from: "users",
          localField: "media_house_id",
          foreignField: "_id",
          as: "media_house_id",
        },
      },
      { $unwind: "$media_house_id" },

      {
        $lookup: {
          from: "admins",
          localField: "payment_admin_id",
          foreignField: "_id",
          as: "payment_admin_details",
        },
      },
      // { $unwind: "$payment_admin_details" },
    ]);

    const draftDetailss = await hopperPayment.aggregate([
      // {
      //   $lookup: {
      //     from: "contents",
      //     localField: "content_id",
      //     foreignField: "_id",
      //     as: "content_id",
      //   },
      // },
      // { $unwind: "$content_id" },
      // {
      //   $match: condition,
      // },


      {
        $lookup: {
          from: "uploadcontents",
          localField: "task_content_id",
          foreignField: "_id",
          as: "task_content_id",
        },
      },

      { $unwind: "$task_content_id" },
      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     let: { contentIds: "$hopper_id", list: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$hopper_id", mongoose.Types.ObjectId(req.user._id)] },
      //               { $eq: ["$paid_status_for_hopper", true] },
      //               // { $eq: ["$content_id", "$$id"] },
      //               { $eq: ["$type", "task_content"] },
      //             ],
      //           },
      //         },
      //       },

      //    {
      //   $lookup: {
      //     from: "uploadcontents",
      //     localField: "task_content_id",
      //     foreignField: "_id",
      //     as: "task_content_details",
      //   },
      //    },


      //     ],
      //     as: "transictions_true",
      //   },
      // },


      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     let: { contentIds: "$hopper_id", list: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$hopper_id", mongoose.Types.ObjectId(req.user._id)] },
      //               { $eq: ["$paid_status_for_hopper", true] },
      //               // { $eq: ["$content_id", "$$id"] },
      //               { $eq: ["$type", "content"] },
      //             ],
      //           },
      //         },
      //       },

      //       {
      //           $lookup: {
      //             from: "contents",
      //             localField: "content_id",
      //             foreignField: "_id",
      //             as: "content_id",
      //           },
      //         },
      //         // {
      //         //   $addFields: {
      //         //     typeofcontent: "$content_id.type",
      //         //   },
      //         // },

      //     ],
      //     as: "transictions_true_for_content",
      //   },
      // },

      // {
      //   $addFields: { total_content:{ $concatArrays: ["$transictions_true", "$transictions_true_for_content"] }}
      // },

      {
        $addFields: {
          typeofcontent: "$content_id.type",
        },
      },

      {
        $match: condition,
      },

      {
        $lookup: {
          from: "users",
          let: { user_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
            // {
            //   $lookup: {
            //     from: "avatars",
            //     localField: "avatar_id",
            //     foreignField: "_id",
            //     as: "avatar_ids",
            //   },
            // },
            // { $unwind: "$avatar_ids" },

          ],
          as: "hopper_id",
        },
      },

      { $unwind: "$hopper_id" },
      {
        $lookup: {
          from: "users",
          localField: "media_house_id",
          foreignField: "_id",
          as: "media_house_id",
        },
      },
      { $unwind: "$media_house_id" },

      {
        $lookup: {
          from: "admins",
          localField: "payment_admin_id",
          foreignField: "_id",
          as: "payment_admin_details",
        },
      },
      // { $unwind: "$payment_admin_details" },
    ]);

    const arr = [...draftDetails, ...draftDetailss]


    return res.status(200).json({
      code: 200,
      data: arr,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.allratedcontent = async (req, res) => {
  try {
    // const getallcontent = await rating.find({
    //   from: mongoose.Types.ObjectId(req.user._id),
    // });
    // const getallcontentforrecevied = await rating.find({
    //   to: mongoose.Types.ObjectId(req.user._id),
    // });

    const condition = {
      sender_type: "hopper"
      // to: mongoose.Types.ObjectId(req.user._id),
    };

    // const data = req.query;
    // if (data.type == "given") {
    //   delete condition.to;
    //   condition.from = mongoose.Types.ObjectId(req.user._id);
    // }
    // if (data.hasOwnProperty("rating")) {

    //   condition.rating = Number(data.rating);
    // }
    // if (data.startdate && data.endDate) {
    //   condition.createdAt = {
    //     $lte: new Date(data.endDate),
    //     $gte: new Date(data.startdate),
    //   }; //{[Op.gte]: data.startdate};
    // }

    // if (data.hasOwnProperty("startrating") && data.hasOwnProperty("endrating")) {
    //   condition.rating = {
    //     $lt: Number(data.endrating),
    //     $gte: Number(data.startrating),
    //   }; //{[Op.gte]: data.startdate};
    // }
    // if (data.posted_date) {
    //   data.posted_date = parseInt(data.posted_date);
    //   const today = new Date();
    //   const days = new Date(
    //     today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
    //   );

    //   condition.createdAt = { $gte: days };
    // }

    const draftDetails = await rating.aggregate([
      {
        $match: { from: mongoose.Types.ObjectId(req.user._id), sender_type: "hopper" },
      },
      {
        $group: {
          _id: "$from",
          avgRating: { $avg: "$rating" },
          data: { $push: "$$ROOT" },
        },
      },


      {
        $addFields: {
          updateddata: { $arrayElemAt: ["$data", -1] },
        },
      },
      {
        $lookup: {
          from: "hopperpayments",
          let: { list: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$hopper_id", "$$list"] },
                    { $eq: ["$paid_status_for_hopper", true] },
                    // { $eq: ["$content_id", "$$id"] },
                    // { $eq: ["$type", "content"] },
                  ],
                },
              },
            },
          ],
          as: "transictions",
        },
      },
      {
        $addFields: {

          total_earining: { $sum: "$transictions.payable_to_hopper" },
        },
      },
      {
        $project: { "transictions": 0, data: 0 }
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_id",
              },
            },
            {
              $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: false }
            }
          ],
          as: "hopper_details",
        },
      },

      { $unwind: "$hopper_details" },

    ]);

    const draftDetailss = await rating.aggregate([
      {
        $match: { from: { $ne: mongoose.Types.ObjectId(req.user._id) }, sender_type: "hopper" },
      },

      {
        $group: {
          _id: "$from",
          avgRating: { $avg: "$rating" },
          data: { $push: "$$ROOT" },
        },
      },


      {
        $addFields: {
          updateddata: { $arrayElemAt: ["$data", -1] },
        },
      },
      {
        $lookup: {
          from: "hopperpayments",
          let: { list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$hopper_id", "$$list"] },
                    { $eq: ["$paid_status_for_hopper", true] },
                    // { $eq: ["$content_id", "$$id"] },
                    // { $eq: ["$type", "content"] },
                  ],
                },
              },
            },
          ],
          as: "transictions",
        },
      },
      {
        $addFields: {

          total_earining: { $sum: "$transictions.payable_to_hopper" },
        },
      },

      {
        $project: { "transictions": 0, data: 0 }
      },

      {
        $lookup: {
          from: "users",
          let: { user_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_id",
              },
            },
            {
              $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: false }
            }
          ],
          as: "hopper_details",
        },
      },

      { $unwind: "$hopper_details" },


    ]);

    // const listofrating = await rating.find(condition).populate("from content_id task_content_id").sort({ createdAt: -1 })
    //   .skip(data.offset ? Number(data.offset) : 0)
    //   .limit(data.limit ? Number(data.limit) : Number.MAX_SAFE_INTEGER);


    const allavatarList = await rating.countDocuments(condition)



    res.json({
      code: 200,
      count: allavatarList,
      resp: [...draftDetails, ...draftDetailss]//data.type == "given" ? draftDetailss : draftDetails,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.transictiondetailbycontentid = async (req, res) => {
  try {
    let condition2, condition3;
    const data = req.query;
    const condition = {
      hopper_id: mongoose.Types.ObjectId(req.user._id),
      content_id: mongoose.Types.ObjectId(data.content_id),
    };
    if (data.startdate && data.endDate) {
      condition.createdAt = {
        $lte: new Date(data.endDate),
        $gte: new Date(data.startdate),
      }; //{[Op.gte]: data.startdate};
    }
    if (data.highpaymentrecived == true) {

      condition2 = {
        amount: -1
      }
    } else {
      condition2 = {
        amount: 1
      }
    }

    if (data.firstpaymentrecived == true) {

      condition2 = {
        amount: -1
      }

    } else {
      condition2 = {
        amount: 1
      }
    }
    if (data.publication) {
      condition.media_house_id = mongoose.Types.ObjectId(data.publication)
    }

    const draftDetails = await hopperPayment.aggregate([
      {
        $match: condition,
      },

      {
        $lookup: {
          from: "contents",
          localField: "content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      { $unwind: "$content_id" },
      {
        $addFields: {
          typeofcontent: "$content_id.type",
        },
      },

      {
        $lookup: {
          from: "users",
          let: { user_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_ids",
              },
            },
            { $unwind: "$avatar_ids" },
          ],
          as: "hopper_id",
        },
      },

      { $unwind: "$hopper_id" },
      {
        $lookup: {
          from: "users",
          localField: "media_house_id",
          foreignField: "_id",
          as: "media_house_id",
        },
      },
      { $unwind: "$media_house_id" },

      {
        $addFields: {
          hopper: "$hopper_id._id",
        },
      },

      {
        $addFields: {
          content: "$content_id._id",
        },
      },

      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper", list: "$content" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$hopper_id", "$$contentIds"] },
                    { $eq: ["$paid_status_for_hopper", true] },
                    { $eq: ["$content_id", "$$list"] },
                    { $eq: ["$type", "content"] },
                  ],
                },
              },
            },
          ],
          as: "transictions",
        },
      },
      {
        $sort: condition2
      },

    ]);


    const draftDetailssummamount = await hopperPayment.aggregate([
      {
        $match: condition,
      },

      {
        $lookup: {
          from: "contents",
          localField: "content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      { $unwind: "$content_id" },
      {
        $addFields: {
          typeofcontent: "$content_id.type",
        },
      },

      {
        $lookup: {
          from: "users",
          let: { user_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_ids",
              },
            },
            { $unwind: "$avatar_ids" },
          ],
          as: "hopper_id",
        },
      },

      { $unwind: "$hopper_id" },
      {
        $lookup: {
          from: "users",
          localField: "media_house_id",
          foreignField: "_id",
          as: "media_house_id",
        },
      },
      { $unwind: "$media_house_id" },

      {
        $addFields: {
          hopper: "$hopper_id._id",
        },
      },

      {
        $addFields: {
          content: "$content_id._id",
        },
      },

      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper", list: "$content" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$hopper_id", "$$contentIds"] },
                    { $eq: ["$paid_status_for_hopper", true] },
                    { $eq: ["$content_id", "$$list"] },
                    { $eq: ["$type", "content"] },
                  ],
                },
              },
            },
          ],
          as: "transictions",
        },
      },
      // {
      //   $sort: condition2
      // },

      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      }

    ]);

    console.log("draftDetailssummamount-------->>>>>>", draftDetailssummamount)
    return res.status(200).json({
      code: 200,
      data: draftDetails,
      amount: draftDetailssummamount.length > 0 ? draftDetailssummamount[0].totalAmount : 0,
      countofmediahouse: draftDetails.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updatenotification = async (req, res) => {
  try {
    const data = req.body;
    let resp = await notification.updateMany({ receiver_id: req.user._id, is_read: false }, { is_read: true })
    // let resp = await db.updateItem(data.notification_id, notification, data);

    res.json({ code: 200, response: resp });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.getlistofmediahouse = async (req, res) => {
  try {
    const data = req.body;
    let resp = await User.find({ role: "MediaHouse" })
    res.json({ code: 200, response: resp });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.updateDraft = async (req, res) => {
  try {
    const data = req.body;
    let resp = await db.updateItem(data.content_id, Content, { is_draft: false });
    res.json({ code: 200, response: resp });
  } catch (err) {
    utils.handleError(res, err);
  }
};


exports.mostviewed = async (req, res) => {
  try {
    const data = req.body;
    let response;
    const findview = await mostviewed.findOne({ user_id: data.user_id, content_id: data.content_id, type: "feed_content" })
    const findviewoftutorial = await mostviewed.findOne({ user_id: data.user_id, tutorial_id: data.tutorial_id, type: "tutorial" })
    if (findview || findviewoftutorial) {
      return res.send({ status: 200, msg: "already viewed" })
    }
    else {
      response = await db.createItem(data, mostviewed)

      if (data.type == "tutorial") {
        const finduploaded = await Tutorial_video.findOne({ _id: data.tutorial_id })

        const valupl = finduploaded.count_for_hopper + 1

        await db.updateItem(data.tutorial_id, Tutorial_video, { count_for_hopper: valupl })
      } else {
        const find = await Content.findOne({ _id: data.content_id })
        const val = find.count_for_hopper + 1
        data.type == "feed_content" ? await db.updateItem(data.content_id, Content, { count_for_hopper: val }) : 0
      }
    }


    res.json({ code: 200, data: response, });
  } catch (err) {
    utils.handleError(res, err);
  }
};



// exports.sendNotificationToNextUsers = async (req, res) => {
//   try {
//        const TaskCreated = await BroadCastTask.findOne({ _id: req.body.task_id });
//           const mediaHouse = await db.getItem(TaskCreated.mediahouse_id, User);
//           var prices = await db.getMinMaxPrice(BroadCastTask, TaskCreated._id);
//           const users = await User.aggregate([
//             {
//               $geoNear: {
//                 near: {
//                   type: "Point",
//                   coordinates: [
//                     TaskCreated.address_location.coordinates[0],
//                     TaskCreated.address_location.coordinates[1],
//                   ],
//                 },
//                 distanceField: "distance",
//                 // distanceMultiplier: 0.001, //0.001
//                 spherical: true,
//                 // includeLocs: "location",
//                 minDistance :20000 * 1000,
//                 maxDistance: 40000 * 1000,
//               },
//             },
//             // {
//             //   $addFields: {
//             //     miles: { $divide: ["$distance", 1609.34] }
//             //   }
//             // },
//             {
//               $match: { role: "Hopper" },
//             },
//           ]);
//           // 
//           for (let user of users) {
//             
//             const notifcationObj = {
//               user_id: user._id,
//               main_type: "task",
//               notification_type: "media_house_tasks",
//               title: `${mediaHouse.admin_detail.full_name}`,
//               description: `Broadcasted a new task from  Go ahead, and accept the task`,
//               profile_img: `${mediaHouse.admin_detail.admin_profile}`,
//               distance: user.distance.toString(),
//               deadline_date: TaskCreated.deadline_date.toString(),
//               lat: TaskCreated.address_location.coordinates[1].toString(),
//               long: TaskCreated.address_location.coordinates[0].toString(),
//               min_price: prices[0].min_price.toString(),
//               max_price: prices[0].max_price.toString(),
//               task_description: TaskCreated.task_description,
//               broadCast_id: TaskCreated._id.toString(),
//               push: true,
//             };
//             this._sendNotificationtohopper(notifcationObj);
//           }


//     res.json({ code: 200, data: TaskCreated, });
//   } catch (err) {
//     utils.handleError(res, err);
//   }
// };
// async function sendnoti(id, mid ,title,body) {
//   try {

//   } catch (error) {

//   }
//   const notiObj = {
//     sender_id: mid,
//     receiver_id: id,
//     title: title,
//     body: body,
//     // is_admin:true
//   };
//   
//   const resp = await _sendPushNotification(notiObj);
// }

exports.sendPustNotificationByHopper = async (req, res) => {
  try {
    const data = req.body;
    const notiObj = {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      title: data.title,
      body: data.body,
      // is_admin:true
    };

    await _sendPushNotification(notiObj);

    // await  sendnoti(notiObj);


    res.json({
      code: 200,
      msg: "sent",
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};


exports.legal = async (req, res) => {
  try {
    const data = req.body;
    let status
    status = await Legal_terms.findOne({
      _id: mongoose.Types.ObjectId("6458c35c5d09013b05b94e37"),
    });

    // await  sendnoti(notiObj);


    res.json({
      code: 200,
      status,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.testaudiowatermark = async (req, res) => {
  try {
    const data = req.body;
    let status
    // let imageforStore = await utils.uploadFile({
    //   fileData: req.files.image,
    //   path: `${STORAGE_PATH}/test`,
    // })
    // 
    //     const randomname =   Math.floor(1000000000 + Math.random() * 9000000000)

    //     // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
    //     const watermarkPath = `/var/www/mongo/presshop_rest_apis/public/test/powered.mp3`
    //     const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`
    //     const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;
    //     await addWatermark(inputFile,watermarkPath,outputFileforconvertion)
    // await  sendnoti(notiObj);

    // 

    const date = new Date()
    let imageforStore = await utils.uploadFile({
      fileData: req.files.image,
      path: `${STORAGE_PATH}/test`,
    })


    const split = imageforStore.fileName.split(".");
    const extention = split[1];

    const randomname = Math.floor(1000000000 + Math.random() * 9000000000)

    // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
    const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp4`
    const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;
    // await  main1(inputFile ,outputFileforconvertion)
    // fs.unlinkSync(inputFile)

    const Audiowatermak = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`
    const imageWatermark = `/var/www/mongo/presshop_rest_apis/public/Watermark/newLogo.png`
    const outputFilePathsameduration = `/var/www/mongo/presshop_rest_apis/public/test/${date + randomname}.${extention}`
    // 
    // await modify3addWatermarkToAudio(outputFileforconvertion,outputFilePath,outputFilePathsameduration)


    await addWatermarkToVideo(inputFile, imageWatermark, Audiowatermak, outputFilePathsameduration)

    res.json({
      code: 200,
      // status,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.updatelocation = async (req, res) => {
  try {
    const data = req.body;
    let status
    let findEventDetails = await Hopper.findOne({
      _id: mongoose.Types.ObjectId(data.hopper_id),
    });
    if (!findEventDetails) {
      return res.send({ status: 400, msg: "Hopper not found" });
    }

    if (data.latitude && data.longitude) {
      data.location = {};
      data.location.type = "Point";
      data.location.coordinates = [
        Number(data.longitude),
        Number(data.latitude),
      ];
    }

    const editHopper = await db.updateItem(data.hopper_id, Hopper, data);
    res.json({
      code: 200,
      msg: "Hopper updated successfully",
      data: editHopper,
    });
  } catch (err) {
    console.error(err);
  }
}

// if (data.latitude && data.longitude) {
//   data.location = {};
//   data.location.type = "Point";
//   data.location.coordinates = [
//     Number(data.longitude),
//     Number(data.latitude),
//   ];

//   // const updatedBankAccount = await updateItem(Address, { _id: mongoose.Types.ObjectId(findEventDetails.event_location) }, data);
// }

// const editHopper = await db.updateItem(data.hopper_id, Hopper, data);












exports.addUploadedContentforBulkCreate = async (req, res) => {
  try {
    const data = req.body;
    data.hopper_id = req.user._id;

    const findTakdetailforValidation = await BroadCastTask.findOne(
      { _id: data.task_id },
    );

    if (data.type == "image" && (findTakdetailforValidation.need_photos == false || findTakdetailforValidation.need_photos == "false")) {
      return res.status(422).json({
        code: 422,
        message: "This task can't accept photos",
      });
    }

    if (data.type == "audio" && (findTakdetailforValidation.need_interview == false || findTakdetailforValidation.need_interview == "false")) {
      return res.status(422).json({
        code: 422,
        message: "This task can't accept interview",
      });
    }

    if (data.type == "video" && (findTakdetailforValidation.need_videos == false || findTakdetailforValidation.need_videos == "false")) {
      return res.status(422).json({
        code: 422,
        message: "This task can't accept videos",
      });
    }

    if (req.files) {

      if (req.files.imageAndVideo && data.type == "image") {
        var govt_id = await uploadFiletoAwsS3Bucket({
          fileData: req.files.imageAndVideo,
          path: `public/uploadContent`,
        });
        data.imageAndVideo = govt_id.fileName;
      } else if (req.files.imageAndVideo && data.type == "audio") {
        var govt_id = await uploadFiletoAwsS3Bucket({
          fileData: req.files.imageAndVideo,
          path: `public/uploadContent`,
        });
        data.imageAndVideo = govt_id.fileName;
      } else {
        if (req.files.imageAndVideo && data.type == "video") {

          var govt_id = await uploadFiletoAwsS3Bucket({
            fileData: req.files.imageAndVideo,
            path: `public/uploadContent`,
          });
          data.imageAndVideo = govt_id.fileName;
        }


        if (req.files.videothubnail) {
          var photography_licence = await uploadFiletoAwsS3Bucket({
            fileData: req.files.videothubnail,
            path: `public/uploadContent`,
          });
          data.videothubnail = photography_licence.fileName;
        }
      }
    }




    // const imageName = data.imageAndVideo.fileName
    // const VideoThumbnailName = data.videothubnail.fileName ? data.videothubnail.fileName : null
    const addedContent = await db.createItem(data, Uploadcontent);

    const findtaskdetails = await BroadCastTask.findOne({
      _id: addedContent.task_id,
    });
    const currentDate = new Date();

    if ((currentDate) < findtaskdetails.deadline_date) {
      const completedByArr = findtaskdetails.completed_by.map((hopperIds) => hopperIds);
      if (!completedByArr.includes(data.hopper_id)) {
        const update = await BroadCastTask.updateOne(
          { _id: data.task_id },
          { $push: { completed_by: data.hopper_id }, }
        );
      }
    }

    const hd = await userDetails(data.hopper_id)

    const notiObj = {
      sender_id: data.hopper_id,
      receiver_id: findtaskdetails.mediahouse_id,
      // data.receiver_id,
      title: " Content Uploaded",
      body: `Hey  ${hd.user_name}, thank you for uploading your content 🤳🏼 🤩 Our team are reviewing the content & may need to speak to you. Please have your phone handy 📞. Cheers - Team PRESSHOP🐰`,
    };
    const resp = await _sendPushNotification(notiObj);
    const notiObj1 = {
      sender_id: data.hopper_id,
      receiver_id: "64bfa693bc47606588a6c807",
      // data.receiver_id,
      title: " Content Uploaded",
      body: `Hey ${hd.user_name}, has uploaded a new content for £100 `,
    };
    const resp1 = await _sendPushNotification(notiObj);
    // const imazepath = `public/uploadContent/${data.imageAndVideo}`;
    //`${STORAGE_PATH_HTTP}/uploadContent/${data.imageAndVideo}`
    if (data.videothubnail) {
      // data.videothubnail = 
      // const vodeosize = `public/uploadContent/${data.videothubnail}`;
      // const dim = sizeOf(vodeosize);
      // const bitDepth = 8;
      // const imageSizeBytes = (dim.width * dim.height * bitDepth) / 8;

      // Convert bytes to megabytes (MB)
      // const imageSizeMB = imageSizeBytes / (1024 * 1024);

      const ORIGINAL_IMAGE = `${process.env.AWS_BASE_URL}/public/uploadContent/` + data.videothubnail
        // "/var/www/mongo/presshop_rest_apis/public/uploadContent/" +
        ;



      const WATERMARK =
        "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";
      // result.watermark;

      // const WATERMARK =  "/var/www/html/presshop_rest_apis/public/Watermark/logo1.png"; //+ result.watermark;
      // 

      const FILENAME =
        Date.now() +
        data.imageAndVideo.replace(
          /[&\/\\#,+()$~%'":*?<>{}\s]/g,
          "_"
        );
      // const dstnPath =
      //   "/var/www/mongo/presshop_rest_apis/public/uploadContent" +
      //   "/" +
      //   FILENAME;
      const LOGO_MARGIN_PERCENTAGE = 5;


      const main = async () => {
        const [image, logo] = await Promise.all([
          Jimp.read(ORIGINAL_IMAGE),
          Jimp.read(WATERMARK),
        ]);

        // logo.resize(image.bitmap.width / 10, Jimp.AUTO);

        const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
        const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

        const X = image.bitmap.width - logo.bitmap.width - xMargin;
        const Y = image.bitmap.height - logo.bitmap.height - yMargin;

        logo.resize(image.getWidth(), image.getHeight());

        return image.composite(logo, 0, 0, [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 0.9,
            opacityDest: 1,
          },
        ]);
      };



      main().then((image) => {
        image.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
          if (err) {
            console.error('Error creating image buffer:', err);
            return res.status(301).json({ code: 500, error: 'Internal server error' });
          }

          const FILENAME_WITH_EXT = FILENAME;
          const S3_BUCKET_NAME = process.env.Bucket ;//"uat-presshope";; // Replace with your S3 bucket name
          const S3_KEY = `uploadContent/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
          const s3Params = {
            Bucket: S3_BUCKET_NAME,
            Key: S3_KEY,
            Body: imageDataBuffer,
            // ACL: 'public-read',
            ContentType: 'image/png',
          };
          const s3 = new AWS.S3();
          // Upload image buffer to S3
          s3.upload(s3Params, async (s3Err, s3Data) => {
            if (s3Err) {
              console.error('Error uploading to S3:', s3Err);
              return res.status(302).json({ code: 500, error: 'Internal server error' });
            }

            const imageUrl = s3Data.Location;
            // data.videothubnail = imageUrl
            addedContent.videothubnail = imageUrl
            await addedContent.save();
            // const addedimage = await db.createItem(data, Uploadcontent);
            const update = await BroadCastTask.updateOne(
              { _id: data.task_id },
              { $push: { content: { media: data.imageAndVideo, media_type: "video", thumbnail: data.videothubnail } }, }
            );


            // res.status(200).json({
            //   data: FILENAME_WITH_EXT.fileName,
            //   url: FILENAME_WITH_EXT.data,
            //   code: 200,
            //   type: data.type,
            //   watermark: imageUrl, // Use the S3 URL for the uploaded image
            //   attachme_name: data.imageAndVideo,
            //   data: addedimage,
            // });
            res.json({
              code: 200,
              // image_size:dimensions,
              // video_size: imageSizeMB,
              type: data.type,
              attachme_name: data.imageAndVideo,
              videothubnail_path: `${data.videothubnail}`,
              // image_name: `${data.imageAndVideo.fileName}`,
              data: addedContent,
            });
          });
        });
      });

      // res.json({
      //   code: 200,
      //   // image_size:dimensions,
      //   // video_size: imageSizeMB,
      //   type: data.type,
      //   attachme_name: data.imageAndVideo,
      //   videothubnail_path: `${data.videothubnail}`,
      //   // image_name: `${data.imageAndVideo.fileName}`,
      //   data: addedContent,
      // });
    } else if (data.type == "audio") {


      const update = await BroadCastTask.updateOne(
        { _id: data.task_id },
        { $push: { content: { media: data.imageAndVideo, media_type: "audio" } }, }
      );
      res.json({
        code: 200,
        // image_size:dimensions,
        // video_size: imageSizeMB,
        type: data.type,
        attachme_name: data.imageAndVideo,
        videothubnail_path: `${data.videothubnail}`,
        image_name: `${data.imageAndVideo.fileName}`,
        data: addedContent,
      });
    }

    else {
      // const dimensions = sizeOf(imazepath);
      // const bitDepth = 8; // 8 bits per channel, assuming RGB color

      // Calculate the image size in bytes
      // const imageSizeBytes =
      //   (dimensions.width * dimensions.height * bitDepth) / 8;

      // // Convert bytes to megabytes (MB)
      // const imageSizeMB = imageSizeBytes / (1024 * 1024);
      // const addedContent = await db.createItem(data, Uploadcontent);


      const ORIGINAL_IMAGE = "https://uat-presshope.s3.eu-west-2.amazonaws.com/public/uploadContent/" + data.imageAndVideo
        // "/var/www/mongo/presshop_rest_apis/public/uploadContent/" +
        ;



      const WATERMARK =
        "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";
      // result.watermark;

      // const WATERMARK =  "/var/www/html/presshop_rest_apis/public/Watermark/logo1.png"; //+ result.watermark;
      // 

      const FILENAME =
        Date.now() +
        data.imageAndVideo.replace(
          /[&\/\\#,+()$~%'":*?<>{}\s]/g,
          "_"
        );
      // const dstnPath =
      //   "/var/www/mongo/presshop_rest_apis/public/uploadContent" +
      //   "/" +
      //   FILENAME;
      const LOGO_MARGIN_PERCENTAGE = 5;


      const main = async () => {
        const [image, logo] = await Promise.all([
          Jimp.read(ORIGINAL_IMAGE),
          Jimp.read(WATERMARK),
        ]);

        // logo.resize(image.bitmap.width / 10, Jimp.AUTO);

        const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
        const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

        const X = image.bitmap.width - logo.bitmap.width - xMargin;
        const Y = image.bitmap.height - logo.bitmap.height - yMargin;

        logo.resize(image.getWidth(), image.getHeight());

        return image.composite(logo, 0, 0, [
          {
            mode: Jimp.BLEND_SCREEN,
            opacitySource: 0.9,
            opacityDest: 1,
          },
        ]);
      };

      //  new code ====================================

      main().then((image) => {
        image.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
          if (err) {
            console.error('Error creating image buffer:', err);
            return res.status(301).json({ code: 500, error: 'Internal server error' });
          }

          const FILENAME_WITH_EXT = FILENAME;
          const S3_BUCKET_NAME = process.env.Bucket ; //"uat-presshope";; // Replace with your S3 bucket name
          const S3_KEY = `uploadContent/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
          const s3Params = {
            Bucket: S3_BUCKET_NAME,
            Key: S3_KEY,
            Body: imageDataBuffer,
            // ACL: 'public-read',
            ContentType: 'image/png',
          };
          const s3 = new AWS.S3();
          // Upload image buffer to S3
          s3.upload(s3Params, async (s3Err, s3Data) => {
            if (s3Err) {
              console.error('Error uploading to S3:', s3Err);
              return res.status(302).json({ code: 500, error: 'Internal server error' });
            }

            const imageUrl = s3Data.Location;
            addedContent.videothubnail = imageUrl
            await addedContent.save();



            const update = await BroadCastTask.updateOne(
              { _id: data.task_id },
              { $push: { content: { media: imageUrl, media_type: "image", thumbnail: data.imageAndVideo } }, }
            );
            res.status(200).json({
              data: FILENAME_WITH_EXT.fileName,
              url: FILENAME_WITH_EXT.data,
              code: 200,
              type: data.type,
              watermark: imageUrl, // Use the S3 URL for the uploaded image
              attachme_name: data.imageAndVideo,
              data: addedContent,
            });
          });
        });
      });

    }
  } catch (err) {
    utils.handleError(res, err);
  }
};




exports.createVerificationSession = async (req, res) => {
  const { userId, customerId, accountId } = req.body;

  try {

    // const id = req.user._id;

    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: { user_id: userId },
    });

    // Optionally, update the customer or account with the verification session ID
    if (customerId) {
      await stripe.customers.update(customerId, {
        metadata: { verification_session_id: verificationSession.id },
      });
    }

    if (accountId) {
      await stripe.accounts.update(accountId, {
        metadata: { verification_session_id: verificationSession.id },
      });
    }


    res.status(201).json(verificationSession);


  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.updateNotificationforClearAll = async (req, res) => {
  try {
    const data = req.body;
    let resp = await notification.updateMany({ receiver_id: { $in: [req.user._id] }, is_deleted_for_app: false }, { is_deleted_for_app: true })

    res.json({ code: 200, response: resp });
  } catch (err) {
    utils.handleError(res, err);
  }
};



// exports.uploadMediaforMultipleImage = async (req, res) => {
//   try {
//     let image_name;

//     if (req.files && req.files.image) {
//       const objImage = {
//         fileData: req.files.image,
//         path: "public/contentData",
//       };
//       image_name = await uploadFiletoAwsS3Bucket(objImage);

//     }

//     const split = image_name.media_type.split("/");
//     const media_type = split[0];

//     if (media_type === "image") {
//       const worker = new Worker(path.resolve(__dirname, 'imageWorker.js'));
//       const ORIGINAL_IMAGE = image_name.data;
//       const WATERMARK = "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";
//       const FILENAME = Date.now() + image_name.fileName.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
//       const mime_type = image_name.media_type;

//       worker.postMessage({ ORIGINAL_IMAGE, WATERMARK, FILENAME, mime_type });

//       worker.on('message', (message) => {
//         if (message.error) {
//           console.error('Error:', message.error);
//           return res.status(500).json({ code: 500, error: 'Internal server error' });
//         }
//         return res.status(200).json({
//           data: FILENAME,
//           code: 200,
//           watermark: message.imageUrl,
//           image_name: ORIGINAL_IMAGE,
//           data: image_name.fileName,
//         });
//       });
//     }


//     if (media_type === "application") {
//       res.status(200).json({
//         code: 200,
//         data: image_name.fileName,
//         media_type: image_name.media_type
//       });
//     }




//   } catch (err) {
//     console.error('Error:', err);
//     return res.status(500).json({ code: 500, error: 'Internal server error' });
//   }
// };



exports.uploadStipeFiles = async (req, res) => {
  try {
    let image_name;
    // 

    const fileid = await uploadFile(req.files.image)


    res.status(200).json({ data: fileid })
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};



exports.getdetailsbyid = async (req, res) => {
  try {
    const data = req.query;

    // var resp = await Chat.find({ $or:[{image_id:data?.room_id},{room_id: data?.room_id}]  }).populate(
    //   "receiver_id sender_id"
    // );
    const responseforcategoryPro = await Category.findOne({
      type: "commissionstructure",
      name: process.env.Pro
    })

    const responseforcategoryAmateur = await Category.findOne({
      type: "commissionstructure",
      name: process.env.Amateur
    })

    // if()
    var resp = await hopperPayment.aggregate([
      {
        $match: {
          content_id: mongoose.Types.ObjectId(data.content_id),
          media_house_id: mongoose.Types.ObjectId(data.media_house_id)

        },



      },




      {
        $lookup: {
          from: "users",
          let: { user_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
            // {
            //   $lookup: {
            //     from: "avatars",
            //     localField: "avatar_id",
            //     foreignField: "_id",
            //     as: "avatar_ids",
            //   },
            // },
            // { $unwind: "$avatar_ids" },

          ],
          as: "hopper_id",
        },
      },

      { $unwind: "$hopper_id" },
      {
        $lookup: {
          from: "users",          // Assuming "User" is the name of the collection
          localField: "media_house_id",
          foreignField: "_id",
          as: "media_house_id"
        }
      },

      {
        $unwind: { path: "$media_house_id", preserveNullAndEmptyArrays: true }
      },

      {
        $lookup: {
          from: "contents",          // Assuming "User" is the name of the collection
          localField: "content_id",
          foreignField: "_id",
          as: "content_id",
          pipeline: [
            {
              $addFields: {
                amount_paid: "$content_id.original_ask_price",
                ask_price: "$content_id.original_ask_price"
              }
            }
          ]
        }
      },
      {
        $unwind: { path: "$content_id", preserveNullAndEmptyArrays: true }
      },

      {
        $addFields: {
          typeofcontent: "$payment_content_type",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "payment_admin_id",
          foreignField: "_id",
          as: "payment_admin_details",
        },
      },
      {
        $addFields: {
          isPro: { $eq: ["$hopper_id.category", "pro"] },// Check if hopper_id.category is 'pro'
          isAmateur: { $eq: ["$hopper_id.category", "amateur"] },

        },
      },
      {
        $addFields: {
          // Charge percentage if hopper_id.category is 'pro', e.g., 10%
          amount_after_charge: {
            $cond: {
              if: { $eq: ["$isPro", true] },
              then: { $multiply: ["$presshop_commission", parseInt(responseforcategoryPro.percentage) / 100] }, // Apply 10% charge
              else: { $multiply: ["$presshop_commission", parseInt(responseforcategoryAmateur.percentage) / 100] }, // No charge if not 'pro'
            },
          },
          // isAmateur:{
          //   $cond: {
          //     if: { $eq: ["$isAmateur", true] },
          //     then: { $multiply: ["$content_id.amount_paid", 0.90] }, // Apply 10% charge
          //     else: "$content_id.amount_paid", // No charge if not 'pro'
          //   },
          // }
        },
      },
      {
        $addFields: {
          amount_after_charge2: {
            $cond: {
              if: { $eq: ["$isPro", true] },
              then: {
                $cond: {
                  // Check if (amount - VAT) > original_ask_price
                  if: {
                    $gt: [
                      { $subtract: [{ $multiply: ["$amount", parseInt(responseforcategoryPro.percentage) / 100] }, "$vat"] },
                      "$content_id.original_ask_price"
                    ]
                  },
                  then: { $multiply: ["$content_id.original_ask_price", parseInt(responseforcategoryPro.percentage) / 100] },// "$content_id.original_ask_price", // Use original ask price if condition is true
                  else: { $multiply: ["$amount", parseInt(responseforcategoryPro.percentage) / 100] } // Use calculated amount otherwise
                }
              },
              else: {
                $cond: {
                  // Check if (amount - VAT) > original_ask_price for amateur category
                  if: {
                    $gt: [
                      { $subtract: [{ $multiply: ["$amount", parseInt(responseforcategoryAmateur.percentage) / 100] }, "$vat"] },
                      "$content_id.original_ask_price"
                    ]
                  },
                  then: { $multiply: ["$content_id.original_ask_price", parseInt(responseforcategoryAmateur.percentage) / 100] },//"$content_id.original_ask_price", // Use original ask price if condition is true
                  else: { $multiply: ["$amount", parseInt(responseforcategoryAmateur.percentage) / 100] } // Use calculated amount otherwise
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          presshop_commission: {
            $cond: {
              if: { $eq: ["$isPro", true] }, // Check if the category is "pro"
              then: {
                $cond: {
                  // Check if (amount - VAT) > original_ask_price for pro category
                  if: {
                    $gt: [
                      { $subtract: ["$amount", "$Vat"] }, // amount - VAT
                      "$content_id.original_ask_price"
                    ]
                  },
                  then: {
                    // If condition is true, multiply original_ask_price by pro percentage
                    $multiply: ["$content_id.original_ask_price", parseInt(responseforcategoryPro.percentage) / 100]
                  },
                  else: {
                    // If condition is false, multiply amount by pro percentage
                    $multiply: ["$amount", parseInt(responseforcategoryPro.percentage) / 100]
                  }
                }
              },
              else: {
                $cond: {
                  // Check if (amount - VAT) > original_ask_price for amateur category
                  if: {
                    $gt: [
                      { $subtract: ["$amount", "$Vat"] }, // amount - VAT
                      "$content_id.original_ask_price"
                    ]
                  },
                  then: {
                    // If condition is true, multiply original_ask_price by amateur percentage
                    $multiply: ["$content_id.original_ask_price", parseInt(responseforcategoryAmateur.percentage) / 100]
                  },
                  else: {
                    // If condition is false, multiply amount by amateur percentage
                    $multiply: ["$amount", parseInt(responseforcategoryAmateur.percentage) / 100]
                  }
                }
              }
            }
          },

        }
      },
      {
        $addFields: {
          amount_without_vat: {
            $cond: {
              // Check if (amount - VAT) > original_ask_price for pro category
              if: {
                $gt: [
                  { $subtract: ["$amount", "$Vat"] }, // amount - VAT
                  "$content_id.original_ask_price"
                ]
              },
              then: "$original_ask_price",
              // {
              //   // If condition is true, multiply original_ask_price by pro percentage
              //   $multiply: ["$content_id.original_ask_price", parseInt(responseforcategoryPro.percentage) / 100]
              // },
              else: "$amount",

              // {
              //   // If condition is false, multiply amount by pro percentage
              //   $multiply: ["$amount", parseInt(responseforcategoryPro.percentage) / 100]
              // }
            }
          }
        }
      },
      {
        $addFields: {
          presshop_commission2: {
            $cond: {
              if: { $eq: ["$isPro", true] }, // Check if the category is "pro"
              then: {
                $cond: {
                  // Check if (amount - VAT) > original_ask_price for pro category
                  if: {
                    $gt: [
                      { $subtract: ["$amount", "$Vat"] }, // amount - VAT
                      "$content_id.original_ask_price"
                    ]
                  },
                  then: {
                    // If condition is true, multiply original_ask_price by pro percentage
                    $multiply: ["$content_id.original_ask_price", parseInt(responseforcategoryPro.percentage) / 100]
                  },
                  else: {
                    // If condition is false, multiply amount by pro percentage
                    $multiply: ["$amount", parseInt(responseforcategoryPro.percentage) / 100]
                  }
                }
              },
              else: {
                $cond: {
                  // Check if (amount - VAT) > original_ask_price for amateur category
                  if: {
                    $gt: [
                      { $subtract: ["$amount", "$Vat"] }, // amount - VAT
                      "$content_id.original_ask_price"
                    ]
                  },
                  then: {
                    // If condition is true, multiply original_ask_price by amateur percentage
                    $multiply: ["$content_id.original_ask_price", parseInt(responseforcategoryAmateur.percentage) / 100]
                  },
                  else: {
                    // If condition is false, multiply amount by amateur percentage
                    $multiply: ["$amount", parseInt(responseforcategoryAmateur.percentage) / 100]
                  }
                }
              }
            }
          },
          payable_to_hopper: {
            $subtract: [
              { $subtract: ["$original_ask_price", "$stripe_fee"] }, // original_ask_price - stripe_fee
              "$presshop_commission" // Subtract presshop_commission
            ]
          }
        }
      }
      // {
      //   $unwind: "$image_id"
      // },
    ]);

    const findcontentdetails = await Content.findOne({ _id: mongoose.Types.ObjectId(data.room_id) })
    var findcontentdetailsisPayment = await Chat.find({ $or: [{ image_id: data?.room_id }, { room_id: data?.room_id }], message_type: "PaymentIntentApp" })
    let status = true
    if (!findcontentdetailsisPayment) {
      status = false
    }

    res.json({
      code: 200,
      status: status,
      views: findcontentdetails?.content_view_count_by_marketplace_for_app,
      purchased_count: findcontentdetails?.purchased_mediahouse.length,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};




exports.listofcharity = async (req, res) => {
  try {
    let image_name;
    const data = req.query
    const limit = data.limit ? parseInt(data.limit) : 10;
    const offset = data.offset ? parseInt(data.offset) : 0;
    const fileid = await Charity.find({ charity_registration_status: { $ne: "Removed" } }).sort({ createdAt: -1 }).skip(Number(offset))
      .limit(Number(limit))


    res.status(200).json({ data: fileid })
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

exports.updatecontentdetails = async (req, res) => {
  try {
    const data = req.body
    const filterAndCountMediaTypes = (content) => {
      const counts = {
        image: 0,
        video: 0,
        audio: 0,
        other: 0
      };

      content.forEach(item => {
        if (item.media_type === "image" || item.media_type === "video" || item.media_type === "audio") {
          counts[item.media_type]++;
        } else {
          counts.other++;
        }
      });

      return counts;
    };

    const mediaTypeCounts = filterAndCountMediaTypes(data.content);
    data.image_count = mediaTypeCounts.image
    data.video_count = mediaTypeCounts.video,
      data.audio_count = mediaTypeCounts.audio,
      data.other_count = mediaTypeCounts.other

    const updatecontectifexpicy = await Content.findOneAndUpdate({ _id: mongoose.Types.ObjectId(data.content_id) }, { $set: data }, { new: true })
    res.status(200).json({ data: updatecontectifexpicy })
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};



exports.fetchAndupdateBankdetails = async (req, res) => {
  try {
    let image_name;


    const externalAccounts = await stripe.accounts.listExternalAccounts(
      `${req.query.id}`,
      {
        object: 'bank_account',
      }
    );

    console.log("")
    if (req.query.is_stripe_registered == "true") {
      const updateData = await Hopper.updateOne(
        {
          _id: req.user._id,
        },
        { $set: { stripe_status: 1, stripe_account_id: req.query.id } }
      );
    }

    console.log("externalAccounts000000>>>>>>>>>", externalAccounts)

    const updateData = await Hopper.updateOne(
      {
        _id: req.user._id,
      },
      { $set: { bank_detail: [] } }
    );


    for (let i = 0; i < externalAccounts.data.length; i++) {
      const element = externalAccounts.data[i];

      console.log("element======", element.id)
      if (i = 0) {


        const obj = {
          stripe_bank_id: element.id,
          user_id: req.user._id,
          bank_name: element.bank_name,
          acc_number: element.last4,
          sort_code: element.sort_code ? element.sort_code : element.routing_number ? element.routing_number : null,
          is_default: true,
          acc_holder_name: element.account_holder_name
        }

        const updateData = await Hopper.updateOne(
          {
            _id: req.user._id,
          },
          { $push: { bank_detail: obj } }
        );
      } else {

        const obj = {
          stripe_bank_id: element.id,
          user_id: req.user._id,
          bank_name: element.bank_name,
          acc_number: element.last4,
          sort_code: element.sort_code ? element.sort_code : element.routing_number ? element.routing_number : null,
          is_default: false,
          acc_holder_name: element.account_holder_name
        }

        const updateData = await Hopper.updateOne(
          {
            _id: req.user._id,
          },
          { $push: { bank_detail: obj } }
        );
      }


    }

    res.status(200).json({ data: "done" })
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};



const axios = require("axios");
const { ObjectID, ObjectId } = require("bson");

exports.justgivingapi = async (req, res) => {
  try {
    let image_name;

    const basicAuth = Buffer.from(`${"promatics.parteekjain@gmail.com"}:${"Nanu@1234567"}`).toString('base64');
    const response = await axios.post(
      'http://api.staging.justgiving.com/c1ec1dfc/v1/charity/donate/charityId/220949',
      {
        // The body of the request goes here
        // For example, donation amount, donor details, etc.
        amount: 50,  // Example donation amount
        currency: 'USD'
      },
      {
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    res.status(200).json({ data: response })
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};



exports.getHopperAlertList = async (req, res) => {
  try {

    const data = req.query;
    const allavatarList = await hopperAlert.countDocuments()


    // const value = await hopperAlert.find({}).sort({ createdAt: -1 })
    //   .skip(data.offset ? Number(data.offset) : 0)
    //   .limit(data.limit ? Number(data.limit) : 0);

    const value = await hopperAlert.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [req.user.longitude, req.user.latitude] // Replace with your longitude and latitude
          },
          distanceField: "distance",  // Field to store calculated distance
          spherical: true
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: data.offset ? Number(data.offset) : 0
      },
      {
        $limit: data.limit ? Number(data.limit) : 0
      }
    ]);

    res.status(200).json({
      code: 200,
      count: allavatarList,
      data: value
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.getuploadedDocumentList = async (req, res) => {
  try {
    const data = req.params;
    data.user_id = req.user._id;
    const bankList = await HoppersUploadedDocs.find({hopper_id:req.user._id}).sort({createdAt:-1})
    res.status(200).json({
      code: 200,
      data: bankList 
    });
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};



exports.deleteDocument = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    const bankList = await HoppersUploadedDocs.deleteOne({_id:mongoose.Types.ObjectId(data.document_id)})
    res.status(200).json({
      code: 200,
      data: bankList 
    });
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};