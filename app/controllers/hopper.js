const uuid = require("uuid");
const { matchedData } = require("express-validator");
const utils = require("../middleware/utils");
// const {uploadFiletoAwsS3Bucket} = require("../shared/helpers");
// const ffmpeg = require("ffmpeg");
var sox = require('sox-audio');
var command = sox()
const { exec } = require('child_process');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const db = require("../middleware/db");
const emailer = require("../middleware/emailer");
const __dir = "/var/www/html/VIIP/";
const jwt = require("jsonwebtoken");
const { addHours } = require("date-fns");
const AWS = require("aws-sdk");
const stripe = require("stripe")(
  process.env.STRIPE
);

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

const EdenSdk = require('api')('@eden-ai/v2.0#9d63fzlmkek994')
EdenSdk.auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJlNjcxYjQtYzNiNS00OWMyLThlNzItZDg0ODQ2OGMyYzgyIiwidHlwZSI6ImFwaV90b2tlbiJ9.wXT9IoUGBr6JB7OxNvC9alRy4N0jgN_kLXs5n4d4NBY');

/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */

const { uploadFiletoAwsS3Bucket ,uploadFiletoAwsS3BucketforAudiowatermark } = require("../shared/helpers");
const { Console, error } = require("console");
// const AWS = require("aws-sdk");
const ACCESS_KEY = "AKIAVOXE3E6KGIDEVH2F"; //process.env.ACCESS_KEY
const SECRET_KEY = "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";//process.env.SECRET_KEY
const Bucket = "uat-presshope";  //process.env.Bucket
const REGION = "eu-west-2";
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
            console.log("notification error in finding sender detail", error);
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
        console.log("fcmTokens--------->", fcmTokens);
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
              //   console.log(
              //     "--------------- N O T I - - O B J ------",
              //     notificationObj
              //   );
              //   await models.Notification.create(notificationObj);
              // }

              if (data.push) {
                const device_token = fcmTokens.map((ele) => ele.device_token);
                console.log(device_token);
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

                // * if push notification is required else dont send push notification just create the record
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
            console.log("notification error in finding sender detail", error);
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
  console.log(
    "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
    data
  );
  if (data) {
    User.findOne({
      _id: data.sender_id,
    }).then(
      async (senderDetail) => {
        if (senderDetail) {
          let body, title;
          console.log(
            "--------------- N O T I - - O B J ------"
          );
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
              await notification.updateOne({ _id: findnotifivation._id }, { createdAt: new Date() })
            } else {
              const create = await db.createItem(notificationObj, notification);
              console.log("create: ", create);
            }
            // await db.createItem(notificationObj, notification);
          } catch (err) {
            console.log("main err: ", err);
          }

          console.log("Before find user device");

          const log = await FcmDevice.find({
            user_id: data.receiver_id,
          })
            .then(
              (fcmTokens) => {
                console.log("fcmTokens", fcmTokens);
                if (fcmTokens) {
                  const device_token = fcmTokens.map((ele) => ele.device_token);
                  console.log(device_token);

                  const r = notify.sendPushNotificationforAdmin(
                    device_token,
                    data.title,
                    data.body,
                    notificationObj
                  );
                  return r;
                } else {
                  console.log("NO FCM TOKENS FOR THIS USER");
                }
              },
              (error) => {
                throw utils.buildErrObject(422, error);
              }
            )
            .catch((err) => {
              console.log("err: ", err);
            });
        } else {
          throw utils.buildErrObject(422, "sender detail is null");
        }
      },
      (error) => {
        console.log("notification error in finding sender detail", error);
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
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.addUserBankDetails = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    const addBank = await db.addUserBankDetails(Hopper, data);
    if(data.is_default == "true" || data.is_default == true) {

      const notiObj = {
        sender_id:  data.user_id,
        receiver_id:  data.user_id,
        // data.receiver_id,
        title: "Payment method updated",
        body: `👋🏼 Hi  ${req.user.user_name}, your payment method is successfully updated 🏦👍🏼 Cheers - Team PRESSHOP🐰 `,
      };
      const resp = await _sendPushNotification(notiObj);
    }
    // const token = await stripe.tokens.create({

    //   bank_account: {
    //     country: 'US',
    //     // currency: 'usd',
    //     account_holder_name: 'Jenny Rosen',
    //     account_holder_type: 'individual',
    //     routing_number: '110000000',
    //     account_number: '000123456789',
    //   },

    //   // bank_account: {
    //   //   country: 'US',
    //   //   // currency: 'gbp',
    //   //   account_holder_name: data.acc_holder_name,
    //   //   account_holder_type: data.bank_name,
    //   //   routing_number: "110000000",
    //   //   account_holder_type: 'individual',
    //   //   account_number: data.acc_number,
    //   // },
    // });

    // const bankAccount = await stripe.accounts.createExternalAccount(
    //   req.user.stripe_account_id,
    //   {
    //     external_account: token.id,
    //   }
    // );

    res.status(200).json({
      code: 200,
      bankDetailAdded: true,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.uploadDocToBecomePro = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    console.log("data======================================================", data)

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
    console.log('Abhishek----------------------------->', data);
    if (data.doc) data.doc = JSON.parse(data.doc);
    for (let docz of data.doc) {
      console.log('docz----->', docz);


      const hopperDocs = await HoppersUploadedDocs.findOne({
        doc_id: docz.doc_id,
        hopper_id: req.user._id
      })
      let z;
      if (hopperDocs) {
        console.log('popo====1');
        z = hopperDocs
      }
      else {
        console.log('popo====2');
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
    const allAdminList = await Admin.findOne({role:"admin"});
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


exports.deleteuploadDocToBecomePro = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    let docUploaded;
    console.log("data=====", data.user_id);
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
    console.log('data------>', data);
    const deleted = await HoppersUploadedDocs.deleteMany({ hopper_id: req.user._id, doc_id: data.doc_id })
    console.log('abhishek----------------------------------------------------------------->', deleted);
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
    if (data.bank_detail && typeof data.bank_detail === "string") {
      data.bank_detail = JSON.parse(data.bank_detail);
      if(data.bank_detail.is_default == "true" || data.bank_detail.is_default == true) {
  
        const notiObj = {
          sender_id:  data.user_id,
          receiver_id:  data.user_id,
          // data.receiver_id,
          title: "Payment method updated",
          body: `👋🏼 Hi  ${req.user.user_name}, your payment method is successfully updated 🏦👍🏼 Cheers - Team PRESSHOP🐰 `,
        };
        const resp = await _sendPushNotification(notiObj);
      }
    }
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
      bankList: bankList,
    });
  } catch (error) {
    // console.log(error);
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
        //console.log(err);
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(name);
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
    //   .then(({ data }) => console.log(data))
    //   .catch(err => console.error(err));


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

    data.content = JSON.parse(data.media);

    if (!data.firstLevelCheck) {
      let firstLevelCheck = {
        nudity: false,
        isAdult: false,
        isGDPR: false,
      };
      data.firstLevelCheck = firstLevelCheck;
    }


    const mediahouse = await userDetails(data.hopper_id)
    const addedContent = await db.createItem(data, Content);
    res.status(200).json({
      code: 200,
      data: addedContent,
    });
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
      body: `Content uploaded -${mediahouse.user_name} has uploaded a new content for £${data.ask_price}`,
    };


    const resp2 = await _sendPushNotification(notiObj2);
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

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      contentList: contentList,
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

exports.tasksRequest = async (req, res) => {
  try {
    const data = req.body;
    data.hopper_id = req.user._id;

    //  const device = await db.getItemCustom({ task_status: "accepted"}, AcceptedTasks);
    const device = await AcceptedTasks.find({
      task_status: "accepted",
      task_id: req.body.task_id,
    });
    const devices = await AcceptedTasks.find({
      // task_status: "accepted",
      task_id: req.body.task_id,
      hopper_id: data.hopper_id,
    });
    if (devices.length < 1) {
      if (device.length < 5) {
        const findsameuseracceptedtask = await AcceptedTasks.findOne({
          task_status: "accepted",
          task_id: req.body.task_id,
          hopper_id:data.hopper_id
        });
        if(findsameuseracceptedtask) {
          return res.status(400).json({code:400,data:"Already Accepted"})
        }
        const taskApproval = await AcceptedTasks.create(data);
        const mediahoused = await userDetails(data.mediahouse_id)
        const hopperD =await userDetails(data.hopper_id)
        if (data.task_status == "accepted") {
          const notiObj = {
            sender_id: data.hopper_id,
            receiver_id: data.mediahouse_id,
            // data.receiver_id,
            title: "Task accepted ",
            body: `Fab 🎯🙌🏼 You have accepted a task from ${mediahoused.first_name} . Please visit My Tasks on your app to navigate to the location, and upload pics, videos or interviews. Good luck, and if you need any support, please use the Chat module to instantly reach out to us🐰  `,
          };

          const resp = await _sendPushNotification(notiObj);

          const notiObj1 = {
            sender_id: data.hopper_id,
            receiver_id: data.mediahouse_id,
            // data.receiver_id,
            title: "Task accepted ",
            body: `🔔 🔔 Good news 👍🏼 Your task has been accepted by our Hoppers🐰 Please visit the Tasks section on the platform to view uploaded content.  If you need any assistance with your task, please call, email or use the instant chat module to speak with our helpful team 🤩`,
          };
          const resp2 = await _sendPushNotification(notiObj1);

          const allAdminList = await Admin.find({ role: "admin" });

          const notiObj11 = {
            sender_id: data.hopper_id,
            receiver_id: allAdminList._id,
            // data.receiver_id,
            title: "Task accepted ",
            body: `Task accepted - ${hopperD.user_name} has accepted the task from ${mediahoused.first_name}`,
          };
          const resp21 = await _sendPushNotification(notiObj11);


          const update = await BroadCastTask.updateOne(
            { _id: data.task_id },
            { $push: { accepted_by: data.hopper_id } }
          );

          const TaskCreated = await BroadCastTask.findOne({ _id: req.body.task_id });
          if (TaskCreated.accepted_by.length >= 5) {
            return res.json({ code: 200, data: TaskCreated, message: "Task already accepted by 5 or more users." });
          }


          // const lengthofhoppers = TaskCreated.accepted_by.length
          // const arrlength = 6 - lengthofhoppers
          // const mediaHouse = await db.getItem(TaskCreated.mediahouse_id, User);
          // var prices = await db.getMinMaxPrice(BroadCastTask, TaskCreated._id);
          // for (let i = 0; i < arrlength; i++) {
          //   const radius = 10000 * 1000


          //   var users = await User.aggregate([
          //     {
          //       $geoNear: {
          //         near: {
          //           type: "Point",
          //           coordinates: [
          //             TaskCreated.address_location.coordinates[1],
          //             TaskCreated.address_location.coordinates[0],
          //           ],
          //         },
          //         distanceField: "distance",
          //         // distanceMultiplier: 0.001, //0.001
          //         spherical: true,
          //         // includeLocs: "location",
          //         minDistance: 10 * 1000,
          //         maxDistance: 40 * 1000
          //       },
          //     },
          //     // {
          //     //   $addFields: {
          //     //     miles: { $divide: ["$distance", 1609.34] }
          //     //   }
          //     // },
          //     {
          //       $match: { role: "Hopper" },
          //     },
          //   ]);

          //   await new Promise(resolve => setTimeout(resolve, 30000));
          // }
          // console.log("user--------->", users);
          // for (let user of users) {
          //   console.log("user--------->", user);
          //   const notifcationObj = {
          //     user_id: user._id,
          //     main_type: "task",
          //     notification_type: "media_house_tasks",
          //     title: `${mediaHouse.admin_detail.full_name}`,
          //     description: `Broadcasted a new task from  Go ahead, and accept the task`,
          //     profile_img: `${mediaHouse.admin_detail.admin_profile}`,
          //     distance: user.distance.toString(),
          //     deadline_date: TaskCreated.deadline_date.toString(),
          //     lat: TaskCreated.address_location.coordinates[1].toString(),
          //     long: TaskCreated.address_location.coordinates[0].toString(),
          //     min_price: prices[0].min_price.toString(),
          //     max_price: prices[0].max_price.toString(),
          //     task_description: TaskCreated.task_description,
          //     broadCast_id: TaskCreated._id.toString(),
          //     push: true,
          //   };
          //   this._sendNotificationtohopper(notifcationObj);
          // }
          res.json({
            code: 200,
            data: taskApproval,
          });
        } else {
          console.log("error------------");
        }

        // const update = await BroadCastTask.updateOne(
        //   { _id: data.task_id },
        //   { $set: { accepted_by: data.hopper_id } }
        // );
      } else {
        const findsameuseracceptedtask = await AcceptedTasks.findOne({
          task_status: "accepted",
          task_id: req.body.task_id,
          hopper_id:data.hopper_id
        });
        if(findsameuseracceptedtask) {
          return res.status(400).json({code:400,data:"Already Accepted"})
        } else {

          const taskApproval = await AcceptedTasks.create(data);
          res.status(200).json({
            code: 200,
            data: taskApproval,
          });
        }

        // throw utils.buildErrObject(422, "unable to accept the task");
      }
    } else {

      const taskApproval = await AcceptedTasks.create(data);
      res.json({
        code: 200,
        data: taskApproval,
      });
      // throw utils.buildErrObject(422, "unable to accept the task");
    }
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
//       console.log("day back----->", days);
//       condition.createdAt = { $gte: days };
//     }


//     console.log("req.user._id", req.user._id);
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
      { device_id: data.device_id , user_id:data.user_id},
      FcmDevice
    );
    if (device) {
      await FcmDevice.updateOne(
        { device_id: data.device_id },
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
    await FcmDevice.deleteMany({user_id:data.user_id })
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
      console.log("ORIGINAL_IMAGE", ORIGINAL_IMAGE);


      const WATERMARK =
        "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";
      // result.watermark;

      // const WATERMARK =  "/var/www/html/presshop_rest_apis/public/Watermark/logo1.png"; //+ result.watermark;
      // console.log("WATERMARK here", WATERMARK);

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
          const S3_BUCKET_NAME = "uat-presshope";; // Replace with your S3 bucket name
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
              { $push: { content: { media: imageUrl, media_type: "video" } }, }
            );

            console.log("data================", addedContent)
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
        { $push: { content: { media: data.imageAndVideo.fileName, media_type: "audio" } }, }
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
      console.log("ORIGINAL_IMAGE", ORIGINAL_IMAGE);


      const WATERMARK =
        "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";
      // result.watermark;

      // const WATERMARK =  "/var/www/html/presshop_rest_apis/public/Watermark/logo1.png"; //+ result.watermark;
      // console.log("WATERMARK here", WATERMARK);

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
          const S3_BUCKET_NAME = "uat-presshope";; // Replace with your S3 bucket name
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
              { $push: { content: { media: imageUrl, media_type: "image" } }, }
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
    console.log('data------>', data);
    var response = await uploadFiletoAwsS3Bucket({
      fileData: req.files.media,
      path: `public/template/fonts`,
    });
    console.log('response=====>', response);
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
//     console.log("data=========",req.user._id);
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
      .find({ receiver_id: req.user._id })
      .populate("receiver_id sender_id").populate({
        path: "receiver_id",
        populate: {
          path: "avatar_id"
        }
      })
      .skip(Number(data.offset))
      .limit(Number(data.limit))
      .sort({ createdAt: -1 });

    const count = await notification
      .find({ receiver_id: req.user._id, is_read: false })

    res.json({
      code: 200,
      data: draftDetails,
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
      // console.log('user_id------->', req.user._id);

      // console.log('data-->>>',)
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
    console.log('response--->>', status);

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
    // console.log(error);
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
    // console.log(error);
    utils.handleError(res, error);
  }
};
function addWatermark(originalAudioPath, watermarkAudioPath, outputFilePath) {
  const interval = 1; // seconds
const startPoint = 4; // seconds
  return new Promise((resolve, reject) => {
    ffmpeg()
    .input(originalAudioPath)
    .input(watermarkAudioPath)
    .complexFilter([
      `[1:a]adelay=${startPoint}|${startPoint}[delayed_overlay]`,
      `[0:a][delayed_overlay]amix=inputs=2:duration=first:dropout_transition=0,atrim=0:${interval},atrim=start=${interval},atrim=end=${interval + startPoint}`
    ])
      .on('end', function() {
        console.log('Watermark added successfully.');
        resolve();
      })
      .on('error', function(err) {
        console.error('Error=====================:', err);
        reject(err);
      })
      .save(outputFilePath);
      console.log("addWatermark=========")
    });
 
}

const downloadFiles = async (filePaths) => {
  const downloadedFiles = [];
  const s3 = new AWS.S3();

  for (const filePath of filePaths) {
    const S3_BUCKET_NAME = "uat-presshope";
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
console.log("mixedSample=================",mixedSample)
      // Write the mixed sample back to the mixed buffer
      mixedBuffer.writeInt16LE(mixedSample, i * 2);
  }
  console.log("mixedBuffer=================",mixedBuffer)
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
          console.error(`Error: ${stderr}`,error);
          // callback(error);
      } else {
          console.log(`Mixed audio saved to ${outputFile}`);
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
  console.log(`Mixed audio saved to command`,command);
  // Run the sox command
  command.run()
      .then(() => {
          console.log(`Mixed audio saved to ${outputFile}`);
      })
      .catch((error) => {
          console.error(`Error mixing audio: ${error}`);
      });
}




function addWatermarktoAudio(inputAudioPath , watermarkAudioPath , outputAudioPath) {
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
    .on('end', function() {
      console.log('Watermark added successfully.');
      resolve();
    })
    .on('error', function(err) {
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
//           console.log('Conversion finished successfully');
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
        console.log('Conversion finished successfully');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error:', err);
        reject(err);
      })
      .save(outputFileforConversion);
  });
}



async function main1(inputAudioPath , outputAudioPath) {
  try {
  let daat =  await newaddWatermarktoAudio(inputAudioPath , outputAudioPath);
  } catch (error) {
    console.error('Error:', error);
  }
}


async function main(inputAudioPath , watermarkAudioPath , outputAudioPath) {
  try {
  let daat =  await addWatermarktoAudio(inputAudioPath , watermarkAudioPath , outputAudioPath);
  } catch (error) {
    console.error('Error:', error);
  }
}



exports.uploadMedia = async (req, res) => {
  try {
    var image_name;

    // console.log("===============================",req)
    if (req.files && req.files.image) {

      const objImage = {
        fileData: req.files.image,
        path: "public/contentData",
      };
      image_name = await uploadFiletoAwsS3Bucket(objImage);
      console.log("image_name", image_name);
    }
    // image/jpeg
    const split = image_name.media_type.split("/");
    const media_type = split[0];
    console.log("media_type", media_type);
    var data = null;
    var data1 = null;
    var mime_type = null
    let content;
    if (media_type == "image") {
      console.log("Inside image");
      // content = await EdenSdk.image_explicit_content_create({
      //   response_as_dict: true,
      //   attributes_as_list: false,
      //   show_original_response: false,
      //   providers: 'amazon,microsoft',
      //   file_url: image_name.data
      // })
      //   .then((response) => {
      //     const item = response.data.microsoft.nsfw_likelihood;
      //     if (item >= 3) {
      //       console.log("blocked");
      //       // return res.status(404).send({ code: 400, message: "This content has been blocked, and cannot be published as it violates our content guidelines.Please contact us to discuss, or seek any clarification. Thanks" });
      //       data = image_name.fileName;
      //       data1 = image_name.data
      //       mime_type = image_name.media_type
      //       const ORIGINAL_IMAGE = data1;

      //       console.log("image_name", data1);

      //       const WATERMARK =
      //         "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";

      //       const FILENAME =
      //         Date.now() + data.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
      //       // const dstnPath =
      //       //   "/var/www/html/presshop_rest_apis/public/contentData" + "/" + FILENAME;
      //       const LOGO_MARGIN_PERCENTAGE = 5;

      //       console.log("FILENAME", FILENAME);

      //       const main = async () => {
      //         console.log("Insind main");
      //         const [image, logo] = await Promise.all([
      //           Jimp.read(ORIGINAL_IMAGE),
      //           Jimp.read(WATERMARK),
      //         ]);
      //         logo.resize(image.getWidth(), image.getHeight());
      //         // return image.composite(logo, image.getWidth(), image.getHeight());
      //         return image.composite(logo, 0, 0, [
      //           {
      //             mode: Jimp.BLEND_SCREEN,
      //             opacitySource: 1,
      //             opacityDest: 0.1,
      //           },
      //         ]);
      //       };

      //       main().then((image) => {
      //         image.getBuffer(Jimp.MIME_PNG, (err, imageDataBuffer) => {
      //           if (err) {
      //             console.error('Error creating image buffer:', err);
      //             return res.status(500).json({ code: 500, error: 'Internal server error' });
      //           }

      //           const FILENAME_WITH_EXT = FILENAME;
      //           const S3_BUCKET_NAME = "uat-presshope"; // Replace with your S3 bucket name
      //           const S3_KEY = `contentData/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
      //           const s3Params = {
      //             Bucket: S3_BUCKET_NAME,
      //             Key: S3_KEY,
      //             Body: imageDataBuffer,
      //             ContentType: mime_type,
      //           };
      //           const s3 = new AWS.S3();
      //           // Upload image buffer to S3
      //           s3.upload(s3Params, (s3Err, s3Data) => {
      //             if (s3Err) {
      //               console.error('Error uploading to S3:', s3Err);
      //               return res.status(500).json({ code: 500, error: 'Internal server error' });
      //             }

      //             const imageUrl = s3Data.Location
      //             // const notiObj = {
      //             //   sender_id: req.user._id,
      //             //   receiver_id: "64bfa693bc47606588a6c807",
      //             //   // data.receiver_id,
      //             //   title: "New Content Added ",
      //             //   body: `Content published - ${req.user.first_name} has published a new content `,
      //             // };
      //             // const resp = _sendPushNotification(notiObj);
      //             console.log("data==============", imageUrl)

      //             return res.status(200).json({
      //               data: FILENAME,
      //               code: 200,
      //               watermark: imageUrl,
      //               image_name: data1,
      //               data: data,
      //               type:"blocked"
      //               // media_type: data.media_type,
      //             });
      //           });
      //         })
      //       });
      //     }
          //  else {
            data = image_name.fileName;
            data1 = image_name.data
            mime_type = image_name.media_type
            const ORIGINAL_IMAGE = data1;

            console.log("image_name", data1);

            const WATERMARK =
              "https://uat.presshop.live/presshop_rest_apis/public/Watermark/newLogo.png";

            const FILENAME =
              Date.now() + data.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
            // const dstnPath =
            //   "/var/www/html/presshop_rest_apis/public/contentData" + "/" + FILENAME;
            const LOGO_MARGIN_PERCENTAGE = 5;

            console.log("FILENAME", FILENAME);

            const main = async () => {
              console.log("Insind main");
              const [image, logo] = await Promise.all([
                Jimp.read(ORIGINAL_IMAGE),
                Jimp.read(WATERMARK),
              ]);
              logo.resize(image.getWidth(), image.getHeight());
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
                const S3_BUCKET_NAME = "uat-presshope"; // Replace with your S3 bucket name
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
                  // const notiObj = {
                  //   sender_id: req.user._id,
                  //   receiver_id: "64bfa693bc47606588a6c807",
                  //   // data.receiver_id,
                  //   title: "New Content Added ",
                  //   body: `Content published - ${req.user.first_name} has published a new content `,
                  // };
                  // const resp = _sendPushNotification(notiObj);
                  console.log("data==============", imageUrl)

                  return res.status(200).json({
                    data: FILENAME,
                    code: 200,
                    watermark: imageUrl,
                    image_name: data1,
                    data: data,
                    // media_type: data.media_type,
                  });
                });
              })
            });
          // }
          // }

        // })
        // .catch(err => {
        //   utils.handleError(res, err)
        // });
    }
    if (media_type == "image") {

      await Promise.all(content);
    }
    // if (image_name && media_type == "image") {
    //   data = image_name.fileName;
    //   data1 = image_name.data
    //   mime_type = image_name.media_type
    //   const ORIGINAL_IMAGE = data1;

    //   console.log("image_name", data1);


    //   const FILENAME =
    //     Date.now() + data.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, "_");
    //   // const dstnPath =
    //   //   "/var/www/html/presshop_rest_apis/public/contentData" + "/" + FILENAME;
    //   const LOGO_MARGIN_PERCENTAGE = 5;

    //   console.log("FILENAME", FILENAME);

    //   const main = async () => {
    //     console.log("Insind main");
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
console.log("data============",imageforStore)
      const randomname =   Math.floor(1000000000 + Math.random() * 9000000000)

      // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
      const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`
      const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;

      // Output file path (replace with desired output file path and name)
      const outputFile = 'path/to/your/outputfile.mp3';
     await  main1(inputFile ,outputFileforconvertion)
      // Perform the conversion
    //  await  ffmpeg()
    //     .input(inputFile)
    //     .audioCodec('libmp3lame') // Use the MP3 codec
    //     .on('end', () => {
    //       console.log('Conversion finished successfully');
    //     })
    //     .on('error', (err) => {
    //       console.error('Error:', err);
    //     })
    //     .save(outputFileforconvertion);
      

      // const filePaths = `/var/www/mongo/presshop_rest_apis/public/test/abc31704455329170.mp3`
      const filePaths = `/var/www/mongo/presshop_rest_apis/public/test/test.mp3`
      // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/powered.mp3`
      const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/newWatermark.mp3`
      const outputFilePaths = `/var/www/mongo/presshop_rest_apis/public/test/${date}.mp3`

      console.log("dataof file======================",fs.existsSync(outputFileforconvertion))
      // let resp = await main(filePaths, outputFilePath, outputFilePaths);
      // console.log("resp=========", resp)
      // const buffer3 = fs.readFileSync(outputFileforconvertion); 
      // let reupload = await utils.uploadFileforaudio({
      //   fileData: buffer3,
      //   path: `${STORAGE_PATH}/test/${randomname.mp3}`,
      // })
      

      // const filePat =  `${STORAGE_PATH}/test/${randomname}.mp3`
      // console.log("dataof file======================",filePat)
     
      if( fs.existsSync(outputFileforconvertion) )  {

        let resp = await main(outputFileforconvertion, outputFilePath, outputFilePaths);
     
      } else {

        console.log("error=========error")
      }
  
      const exist  =   fs.existsSync(outputFilePaths)
      console.log("buffer1" ,exist)
        const buffer1 = fs.readFileSync(outputFilePaths);

        
        let audio_description = await uploadFiletoAwsS3BucketforAudiowatermark({
          fileData: buffer1,
          path: `public/userImages`,
        });
        console.log("error===audio_description======error",audio_description)
     
      res.status(200).json({
        code: 200,
        data: image_name.fileName,
        watermark:audio_description.data
      });


    } else {
      try {
        if (media_type == "video") {

          // const datas = await uploadFiletoAwsS3Bucket({
          //   fileData: req.files.image,
          //   path: "public/contentData",
          //   // result: result,
          // })

          // const videoCheck = await EdenSdk.video_explicit_content_detection_async_create({
          //   show_original_response: false,
          //   providers: 'amazon',
          //   file_url: image_name.data
          // })
          //   .then(async (data_new) => {
          //     console.log("data video==================", data_new);
          //     const publicId = data_new.data.public_id;
          //     setTimeout(async () => {
          //       await EdenSdk.video_explicit_content_detection_async_retrieve_2({
          //         response_as_dict: 'true',
          //         show_original_response: 'true',
          //         public_id: publicId
          //       })
          //         .then(async (final_response) => {
          //           const resultObjc = final_response.data.results.amazon.original_response.ModerationLabels
          //           let loopIndex = 0;
          //           for (let index = 0; index < resultObjc.length; index++) {
          //             if ((resultObjc[index].ModerationLabel.Name == "Sexual Activity"
          //               && resultObjc[index].ModerationLabel.Confidence >= 50)
          //               || (resultObjc[index].ModerationLabel.Name == "Suggestive"
          //                 && resultObjc[index].ModerationLabel.Confidence >= 50)
          //               || (resultObjc[index].ModerationLabel.Name == "Explicit Nudity"
          //                 && resultObjc[index].ModerationLabel.Confidence >= 50)) {
          //               return res.status(404).send({
          //                 code: 404,
          //                 error: {
          //                   msg: "Inappropriate Content - Nudity Prohibited"
          //                 }
          //               })
          //             }
          //             loopIndex = index
          //           }
          //           if (loopIndex == resultObjc.length - 1) {
          //             return res.status(200).json({
          //               data: image_name.data,
          //             })
          //           }

          //         })
          //         .catch(err => {
          //           utils.handleError(res, err)
          //         });
          //     }, 60000)
          //   })
          //   .catch(error => {
          //     utils.handleError(res, error)
          //   });


          // await Promise.all(videoCheck);
          /* res.status(200).json({
            data: image_name.data,
            //         code: 200,
            //         // watermark:imageUrl,
            //         // image_name: data1,
            //         // data: data,
            //         // media_type: data.media_type,
          }) */
          //.then(async (data) => {

          //   try {
          //     mime_type = data.media_type
          //     console.log("data", data)

          //     data.data.getBuffer(data.data, (err, imageDataBuffer) => {







          //     // var process = new ffmpeg(
          //     //   // "/var/www/html/presshop_rest_apis/public/contentData/" +
          //     //   data.data
          //     // );
          //     // // console.log("The video is ready to be processed", process);
          //     // process.then(
          //     //   async  function  (video) {
          //     //     console.log(
          //     //       "The video is ready to be processed dfdfdfdfdfdf",
          //     //       video
          //     //     );
          //     //     var watermarkPath = //"https://betazone.promaticstechnologies.com/presshop_rest_apis/public/Watermark/newLogo.png"
          //     //       // "/var/www/html/presshop_rest_apis/public/Watermark/" +
          //     //       // data.;
          //     //     "/var/www/html/presshop_rest_apis/public/Watermark/newLogo.png"
          //     // console.log("result", watermarkPath);
          //     // const FILENAME =
          //     //   Date.now() +
          //     //   data.fileName.replace(
          //     //     /[&\/\\#,+()$~%'":*?<>{}\s]/g,
          //     //     "_"
          //     //   );
          //     // const dstnPath =
          //     //   "/var/www/html/presshop_rest_apis/public/contentData/" +
          //     //   FILENAME;

          //     if (err) {
          //       console.error('Error creating image buffer:', err);
          //       return res.status(500).json({ code: 500, error: 'Internal server error' });
          //     } 
          //     const FILENAME_WITH_EXT = data.fileName;
          //     const S3_BUCKET_NAME = "uat-presshope"; // Replace with your S3 bucket name
          //     const S3_KEY = `contentData/${FILENAME_WITH_EXT}`; // Define the S3 key (path) for the uploaded image
          //     const s3Params = {
          //       Bucket: S3_BUCKET_NAME,
          //       Key: S3_KEY,
          //       Body: imageDataBuffer,
          //       ContentType: mime_type,
          //     };
          //     const s3 = new AWS.S3();
          //      s3.upload(s3Params, (s3Err, s3Data) => {
          //       if (s3Err) {
          //         console.error('Error uploading to S3:', s3Err);
          //         return res.status(500).json({ code: 500, error: 'Internal server error' })
          //       }

          //       const imageUrl = s3Data.Location

          //       // newFilepath = imageUrl;
          //       // })
          //    return   res.status(200).json({
          //         data: imageUrl,
          //         code: 200,
          //         // watermark:imageUrl,
          //         // image_name: data1,
          //         // data: data,
          //         // media_type: data.media_type,
          //       })
          //     })
          //   })
          //   } catch (e) {
          //     console.log("input", e.code)
          //     console.log("out", e.msg)
          //   }
          // });

          //         settings = {
          //           position: "SE", // Position: NE NC NW SE SC SW C CE CW
          //           margin_nord: null, // Margin nord
          //           margin_sud: null, // Margin sud
          //           margin_east: null, // Margin east
          //           margin_west: null, // Margin west
          //         };
          //         var callback = function (error, files) {
          //           if (error) {
          //             console.log("ERROR: ", error);
          //           } else {
          //             // console.log("TERMINOU", files);
          // res.status(200).json({
          //   data: imageUrl,
          //   // media_type: data.media_type,
          // });
          //           }
          //         };
          //       })
          //         //add watermark
          //         video.fnAddWatermark(
          //           watermarkPath,
          //           newFilepath,
          //           settings,
          //           callback
          //         );
          //       },
          //       function (err) {
          //         console.log("Error: " + err);
          //       }
          //     );
          //      catch (e) {
          //       console.log("input",e.code)
          //       console.log("out",e.msg)
          //     }
          //  }) 

          // res.status(200).json({
          //   code: 200,
          //   data: image_name.fileName,
          // });

          // media_type,
          // media_path,
          // thumbnail

          // const postObj = {
          //         post_id: user.id,
          //         media_url: image_name.url,
          //         thumbnail:thumbnail.url
          //       };
          //       await Models.postMedia.create(postObj);
          // var data = null;
          // if (image_name) {
          //   data = image_name;
          // }
          // res.status(200).json({
          //   code: 200,
          //   data: data,
          // })
          return res.status(200).json({
                          data: image_name.data,
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


exports.getAllchat = async (req, res) => {
  try {
    const data = req.body;

    var resp = await Chat.find({ room_id: data.room_id }).populate(
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
    let condition = { paid_status: "paid" };
    if (data.posted_date) {
      data.posted_date = parseInt(data.posted_date);
      const today = new Date();
      const days = new Date(
        today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
      );
      console.log("day back----->", days);
      condition.createdAt = { $gte: days };
    }

    if (data.startdate && data.endDate) {
      // delete condition.status;
      // data.startdate = parseInt(data.startdate);
      // const today = data.endDate;
      // const days = new Date(today.getTime() - (data.startdate*24*60*60*1000));
      // console.log("day back----->",days);
      condition.createdAt = {
        $lte: new Date (data.endDate),
        $gte: new Date (data.startdate),
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
    console.log('id--------------------->', req.user._id)
    condition.hopper_id = { $nin: [req.user._id] }
    const resp = await Content.find(condition)
      .populate("purchased_publication hopper_id category_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .sort({ updatedAt: -1 })
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

exports.createStripeAccount = async (req, res) => {
  try {
    console.log("----ERRORrrrrrrr----");
    const id = req.user._id;
    // const my_acc = await getItemAccQuery(StripeAccount , {id:id});
    const my_acc = await StripeAccount.findOne({ user_id: id });
    if (my_acc) {
      console.log("----ERROR----");
      throw utils.buildErrObject(
        422,
        "You already connected with us OR check your email to verify"
      );
    } else {
      const account = await stripe.accounts.create({
        type: "express",
        country: "GB",
        email: req.user.email,
        business_type: "individual",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
          link_payments: { requested: true },
          // india_international_payments: {requested: true},
          bank_transfer_payments: { requested: true },
          card_payments: { requested: true },
        },
        // individual:{
        //   address:{
        //     city:"Mill Creek",
        //     country:"US",
        //     postal_code:"98012",
        //     state:"WA"
        //   },
        //   first_name:"test",
        //   last_name:"test",
        // }
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
      });

      await db.createItem(
        {
          user_id: id,
          account_id: account.id,
        },
        StripeAccount
      );

      return res.status(200).json({
        code: 200,
        message: accountLink,
        account_id: account.id,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.stripeStatus = async (req, res) => {
  try {
    const data = req.query;
    let user = await User.findOne({ _id: data.id });
    if (parseInt(data.status) === 1) {
      console.log("---------------", user);
      user.stripe_status = 1;
      // let account = await getItemAccQuery(Models.StripeAccount , {user_id:data.id});
      const my_acc = await StripeAccount.findOne({ user_id: data.id });
      user.stripe_account_id = my_acc.account_id;
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
    console.log("req.user._id", req.user._id)
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
        $lte: new Date (data.endDate),
        $gte: new Date (data.startdate),
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
    const getallcontent = await rating.find({
      from: mongoose.Types.ObjectId(req.user._id),
    });
    const getallcontentforrecevied = await rating.find({
      to: mongoose.Types.ObjectId(req.user._id),
    });

    const condition = {
      to: mongoose.Types.ObjectId(req.user._id),
    };

    const data = req.query;
    if (data.type == "given") {
      delete condition.to;
      condition.from = mongoose.Types.ObjectId(req.user._id);
    }
    if (data.hasOwnProperty("rating")) {

      condition.rating = Number(data.rating);
    }
    if (data.startdate && data.endDate) {
      condition.createdAt = {
        $lte: new Date (data.endDate),
        $gte: new Date (data.startdate),
      }; //{[Op.gte]: data.startdate};
    }

    if (data.hasOwnProperty("startrating") && data.hasOwnProperty("endrating")) {
      condition.rating = {
        $lt: Number(data.endrating),
        $gte: Number(data.startrating),
      }; //{[Op.gte]: data.startdate};
    }
    if (data.posted_date) {
      data.posted_date = parseInt(data.posted_date);
      const today = new Date();
      const days = new Date(
        today.getTime() - data.posted_date * 24 * 60 * 60 * 1000
      );
      console.log("day back----->", days);
      condition.createdAt = { $gte: days };
    }

    const draftDetails = await rating.aggregate([
      {
        $match: condition,
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$to" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
          ],
          as: "hopper_details",
        },
      },

      { $unwind: "$hopper_details" },

      {
        $lookup: {
          from: "users",
          let: { user_id: "$from" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
          ],
          as: "mediahouse_details",
        },
      },
      { $unwind: "$mediahouse_details" },
    ]);

    const draftDetailss = await rating.aggregate([
      {
        $match: condition,
      },
      {
        $lookup: {
          from: "users",
          let: { user_id: "$to" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$user_id"] }],
                },
              },
            },
          ],
          as: "mediahouse_details",
        },
      },

      { $unwind: "$mediahouse_details" },
    ]);
    res.json({
      code: 200,
      resp: data.type == "given" ? draftDetailss : draftDetails,
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
        $lte: new Date (data.endDate),
        $gte: new Date (data.startdate),
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
if(data.publication) {
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
    return res.status(200).json({
      code: 200,
      data: draftDetails,
      countofmediahouse: draftDetails.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updatenotification = async (req, res) => {
  try {
    const data = req.body;
    let resp = await notification.updateMany({ receiver_id: req.user._id }, { is_read: true })
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
//           // console.log("user--------->", users);
//           for (let user of users) {
//             console.log("user--------->", user);
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
//   console.log("notiObj=============", notiObj);
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
    console.log("notiObj=============", notiObj);
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
    let imageforStore = await utils.uploadFile({
      fileData: req.files.image,
      path: `${STORAGE_PATH}/test`,
    })
console.log("data============",imageforStore)
    const randomname =   Math.floor(1000000000 + Math.random() * 9000000000)

    // const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/test/new.mp3`
    const watermarkPath = `/var/www/mongo/presshop_rest_apis/public/test/powered.mp3`
    const outputFileforconvertion = `/var/www/mongo/presshop_rest_apis/public/test/${randomname}.mp3`
    const inputFile = `/var/www/mongo/presshop_rest_apis/public/test/${imageforStore.fileName}`;
    await addWatermark(inputFile,watermarkPath,outputFileforconvertion)
    // await  sendnoti(notiObj);


    res.json({
      code: 200,
      status,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};