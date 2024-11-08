const User = require("../models/user");
const PreRegistrationData = require("../models/preRegistrationData");


const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const lodash = require("lodash");
const dir___2 = "/var/www/html/presshop_rest_apis/";
const mongoose = require("mongoose");
const archiver = require("archiver");
const { matchedData } = require("express-validator");
const log4js = require("log4js");
const utils = require("../middleware/utils");
const db = require("../middleware/db");
const emailer = require("../middleware/emailer");
const __dir = "/var/www/html/VIIP/";
const jwt = require("jsonwebtoken");
const moment = require("moment");
const stripe = require("stripe")(
  process.env.STRIPE
);
const promo_codes = require("../models/promo_codes")
const pre_registration_form = require("../models/pre_registration_form")
const cron = require("node-cron")
const nltk = require('nltk');
var synonyms = require("synonyms")
const { addHours } = require("date-fns");
const auth = require("../middleware/auth");
const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 5;
const STORAGE_PATH_HTTP = process.env.STORAGE_PATH_HTTP;
const STORAGE_PATH = process.env.STORAGE_PATH;
const bcrypt = require("bcrypt");
const trendingSearch = require("../models/trending_search");
const Onboard = require("../models/onboard");
//  Common Functions
const AWS = require("aws-sdk");
const axios = require("axios");
const { updateItem, createItem, getItemsCustom, getItemCustom } = require('../shared/core')
const {
  getUserIdFromToken,
  uploadFile,
  capitalizeFirstLetter,
  validateFileSize,
  objectToQueryString,
  uploadFiletoAwsS3Bucket,
  uploadFiletoAwsS3BucketforZip
} = require("../shared/helpers");
const ACCESS_KEY = "AKIAVOXE3E6KGIDEVH2F"; //process.env.ACCESS_KEY
const SECRET_KEY = "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"; //process.env.SECRET_KEY
const Bucket = process.env.Bucket ; //process.env.Bucket
const REGION = "eu-west-2";
AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
});

const formatAmountInMillion = (amount) => {
  return (Math.floor(amount)?.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  }) + receiveLastTwoDigits(amount) || "")
};


// Receive last 2 digits-
const receiveLastTwoDigits = (number) => {
  return (+(number) % 1)?.toFixed(2)?.toString()?.replace(/^0/, '') > 0 ? (+(number) % 1)?.toFixed(2)?.toString()?.replace(/^0/, '') : ""
}


const { Worker } = require('worker_threads');

//  Models
const bulkTransaction = require("../models/bulkTransaction");
const testimonial = require("../models/testimonial");
const OfficeDetails = require("../models/office_detail");
const stripeFee = require("../models/stripeFee");
const addToBasket = require("../models/addToBasket");
const query = require("../models/query");
const Employee = require("../models/admin");
const addEmailRecord = require("../models/email");
const mostviewed = require("../models/content_view_record");
const FcmDevice = require("../models/fcm_devices");
const typeofDocs = require("../models/typeofDocs");
const ManageUser = require("../models/addUser");
const Category = require("../models/categories");
const notification = require("../models/notification");
const notificationforadmin = require("../models/adminNotification");
const StripeAccount = require("../models/stripeAccount");
const rating = require("../models/rating");
const Contents = require("../models/contents");
const Uploadcontent = require("../models/uploadContent");
const Room = require("../models/room");
const Chat = require("../models/chat");
const lastchat = require("../models/latestchat");
const acceptedtask = require("../models/acceptedTasks");
const HopperPayment = require("../models/hopperPayment");
const reason = require("../models/reasonFordelete");
const contact_us = require("../models/contact_us");
const BroadCastTask = require("../models/mediaHouseTasks");
const BroadCastHistorySummery = require("../models/broadCastHistorySummery");
const Favourite = require("../models/favourite");
const MediaHouse = require("../models/media_houses");
const Hopper = require("../models/hopper");
const Faq = require("../models/faqs");
const Privacy_policy = require("../models/privacy_policy");
const Legal_terms = require("../models/legal_terms");
const Tutorial_video = require("../models/tutorial_video");
const Docs = require("../models/docs");
const notify = require("../middleware/notification");
const { Admin, ObjectId } = require("mongodb");
const exp = require("constants");
const { Console, error, log } = require("console");
const UserMediaHouse = require("../models/users_mediaHouse");
const recentactivity = require("../models/recent_activity");
const lastmesseage = require("../models/lastmesseage");
const MhInternalGroups = require("../models/mh_internal_groups");
const AddedContentUsers = require("../models/added_content_users");
const { measureMemory } = require("vm");
const Tag = require("../models/tags");
const { pipeline,  } = require("stream");


const walletEntry = require("../models/walletEntry");
const accountSid = "ACa652be94f7404b3e37430e3bac2f4cba";
const authToken = "047e84388403f4f2c882adf187b8e620";
const client = require("twilio")(accountSid, authToken);
const EdenSdk = require('api')('@eden-ai/v2.0#9d63fzlmkek994')



// const EdenAiSdk = require('edenai');

// const EdenAiSdk = import('edenai')

// const edenai = new EdenAiSdk('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJlNjcxYjQtYzNiNS00OWMyLThlNzItZDg0ODQ2OGMyYzgyIiwidHlwZSI6ImFwaV90b2tlbiJ9.wXT9IoUGBr6JB7OxNvC9alRy4N0jgN_kLXs5n4d4NBY');
/*********************
 * Private functions *
 *********************/

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */


const { io } = require("../../socket")
exports._sendNotification = async (data) => {
  // 
  //   "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
  //   data
  // );
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


              console.log("userid =====", data.user_id)
              var notificationObj = {
                title: title,
                body: data.description,
                data: {
                  // notificationId: uuid.v4(),
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
              // if (data.create) {
              //   // * create in db
              //   delete data.create;
              //   
              //     "--------------- N O T I - - O B J ------",
              //     notificationObj
              //   );
              //   await models.Notification.create(notificationObj);
              // }

              // try {
              //   // 
              //   //   "--------------- N O T I - - O B J ------",
              //   //   notificationObj
              //   // );
              //   let notificationObj = {
              //     sender_id: data.sender_id,
              //     receiver_id: mongoose.Types.ObjectId(data.user_id),
              //     title: data.title,
              //     body: data.description,
              //   };
              //   await db.createItem(notificationObj, notification);
              // } catch (err) {
              //   
              // }

              if (data.push) {
                const device_token = fcmTokens.map((ele) => ele.device_token);
                console.log("notificationData====", data)
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
  // 
  //   "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
  //   data
  // );
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
            // type:data.type
          };
          try {



            if (data.type) {
              notificationObj.type = data.type
            }

            if (data.notification_type) {
              notificationObj.notification_type = data.notification_type
            }
            if (data.dataforUser) {
              notificationObj.dataforUser = data.dataforUser
            }

            if (data.dataforUser) {
              notificationObj.dataforUser = data.dataforUser;
            }

            if (data.profile_img) {
              notificationObj.profile_img = data.profile_img;
            }

            if (data.distance) {
              notificationObj.distance = data.distance.toString();
            }

            if (data.deadline_date) {
              notificationObj.deadline_date = data.deadline_date.toString();
            }

            if (data.lat) {
              notificationObj.lat = data.lat.toString();
            }

            if (data.long) {
              notificationObj.long = data.long.toString();
            }

            if (data.min_price) {
              notificationObj.min_price = data.min_price.toString();
            }
            if (data.max_price) {
              notificationObj.max_price = data.max_price.toString();
            }

            if (data.task_description) {
              notificationObj.task_description = data.task_description;
            }

            if (data.broadCast_id) {
              notificationObj.broadCast_id = data.broadCast_id.toString();
            }



            const findnotifivation = await notification.findOne(notificationObj)

            if (findnotifivation) {
              await notification.updateOne({ _id: mongoose.Types.ObjectId(findnotifivation._id) }, { timestamp_forsorting: new Date(), is_read: false })
            } else {
              const create = await db.createItem(notificationObj, notification);

            }
            // await db.createItem(notificationObj, notification);
          } catch (err) {

          }



          const log = await FcmDevice.find({
            user_id: mongoose.Types.ObjectId(data.receiver_id),
          })
            .then(
              async (fcmTokens) => {
                console.log("fcmTokens ::::: ", fcmTokens)
                if (fcmTokens) {
                  const device_token = await fcmTokens.map((ele) => ele.device_token);

                  console.log("userid ::::: ", data.receiver_id, "tokens----------", device_token)
                  const r = notify.sendPushNotificationforAdmin(
                    device_token,
                    data.title,
                    data.body,
                    notificationObj
                  );
                  // try {
                  //     
                  //       "--------------- N O T I - - O B J ------",
                  //       notificationObj
                  //     );
                  //     const findnotifivation = await notification.findOne(notificationObj)

                  //     if (findnotifivation) {
                  //       await notification.updateOne({ _id: findnotifivation._id }, { createdAt: new Date() })
                  //     } else {
                  //       const create = await db.createItem(notificationObj, notification);
                  //       
                  //     }
                  //     // await db.createItem(notificationObj, notification);
                  //   } catch (err) {
                  //     
                  //   }
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
    );
  } else {
    throw utils.buildErrObject(422, "--* no type *--");
  }
};

async function percentageCalculation(LiveMonthDetailsCount, PreviousMonthDetailsCount) {
  return new Promise((resolve, reject) => {
    try {
      let percentage, type, diff;
      if (LiveMonthDetailsCount > PreviousMonthDetailsCount) {
        diff = LiveMonthDetailsCount / PreviousMonthDetailsCount;
        resolve({
          percentage: (diff == Infinity) ? 0 : diff * 100,
          type: "increase"
        })
      } else {
        diff = LiveMonthDetailsCount / PreviousMonthDetailsCount;
        resolve({
          percentage: (diff == Infinity) ? 0 : diff * 100,
          type: "decrease"
        })
      }
    } catch (error) {
      reject(utils.buildErrObject(422, err.message));
    }
  });
}
function calculatePercentage(live_task_count, plive_task_count) {
  let percentage = 0;
  let type = "";

  if (live_task_count === 0 && plive_task_count === 0) {
    percentage = 0;
    type = "no change";
  } else if (live_task_count === 0) {
    percentage = 100;
    type = "decrease";
  } else if (plive_task_count === 0) {
    percentage = 100;
    type = "increase";
  } else if (live_task_count > plive_task_count) {
    const diff = (live_task_count - plive_task_count) / live_task_count;
    percentage = (diff * 100);
    type = "increase";
  } else if (live_task_count < plive_task_count) {

    const diff = (plive_task_count - live_task_count) / plive_task_count;

    percentage = (diff * 100);
    type = "decrease";
  } else {
    percentage = 0;
    type = "no change";
  }

  return { percentage, type };
}
const cron_notifications_perminute = async () => {
  try {

    Notification();
    mostPopulaansviewd()
    mostviewd()

  } catch (error) {

  }
};

const cron_notifications_permonth = async () => {
  try {


    // moveToS3()
  } catch (error) {

  }
};

const Notification = async () => {
  try {



    const trialfindquery = await query.find({ type: "purchased_exclusive_content" })
    const endDate = new Date();   // Replace with your end date and time
    const matchingNannies = trialfindquery.filter(nanny => {
      const timeDifferenceMinutes = (endDate.getTime() - new Date(nanny.submited_time).getTime()) / (1000 * 60);
      return timeDifferenceMinutes > 1440
    });

    if (matchingNannies.length > 0) {

      matchingNannies.forEach(async (nanny) => {
        await Contents.updateOne({ _id: nanny.content_id }, { is_hide: false, hasShared: true, type: "shared", ask_price: 60, original_ask_price: 50 })
        // await Contents.updateOne({ _id: nanny.content_id }, { is_hide: false, hasShared: true, ask_price: 50 })


        // await Contents.updateOne(
        //   { 
        //      _id: nanny.content_id,
        //      purchased_mediahouse_time: { 
        //       $elemMatch: { 
        //         media_house_id: mongoose.Types.ObjectId(req.user._id),
        //         // is_hide: true
        //       }
        //     }

        //   },
        //   { 
        //     $set: { "purchased_mediahouse_time.$[].is_hide": false },
        //   },
        //   {
        //     arrayFilters: [{ "media_house_id": mongoose.Types.ObjectId(req.user._id) }]
        //   }
        // );

      });
    } else {

    }

  } catch (err) {

  }
};


const mostPopulaansviewd = async () => {
  try {


    const d = new Date()
    const val = d.setDate(d.getDate() - 30)
    const condition = {
      published_time_date: {
        $gte: new Date(val),
        $lte: new Date()
      },
      content_view_type: { $ne: "mostpopular" }
    }


    const mostpopular = await Contents.find({
      published_time_date: {
        $gte: new Date(val),
        $lte: new Date()
      }
    }).sort({ content_view_count: -1 }).limit(5)


    // 
    const endDate = new Date();   // Replace with your end date and time
    const mostviewed = await Contents.find(condition)
      .sort({ content_view_count: -1 })
      .limit(10);

    if (mostpopular.length > 0) {

      mostpopular.forEach(async (nanny) => {
        await Contents.updateOne({ _id: mongoose.Types.ObjectId(nanny._id) }, { $set: { content_view_type: "mostpopular" } })



      });
    } else {

    }


    // if (mostviewed.length > 0) {
    //   
    //  await mostviewed.forEach(async (nanny) => {
    //     await Contents.updateOne({ _id: nanny._id }, { $set: { content_view_type: "mostviewed"} })



    //   });
    // } else {
    //   
    // }
  } catch (err) {

  }
};


const mostviewd = async () => {
  try {


    const d = new Date()
    const val = d.setDate(d.getDate() - 30)
    const condition = {
      published_time_date: {
        $gte: new Date(val),
        $lte: new Date()
      },
      content_view_type: { $ne: "mostpopular" }
    }





    const endDate = new Date();   // Replace with your end date and time
    const mostviewed = await Contents.find(condition)
      .sort({ content_view_count: -1 })
      .limit(10);




    if (mostviewed.length > 0) {

      await mostviewed.forEach(async (nanny) => {
        await Contents.updateOne({ _id: nanny._id }, { $set: { content_view_type: "mostviewed" } })



      });
    } else {

    }
  } catch (err) {

  }
};


// const moveToS3 = async () => {
//   try {

//     
//     const d = new Date()
//     const val = d.setDate(d.getDate() - 30)
//     const condition = {
//       published_time_date: {
//         $lte: val
//       },
//     }
//     const mostviewed = await Contents.find(condition)
//       // .sort({ content_view_count: -1 })
//       // .limit(10);




//     if (mostviewed.length > 0) {
//       
//       await mostviewed.forEach(async (nanny) => {
//         const s3 = new AWS.S3();


//         const sourceBucket = 'uat-presshope';
//         const destinationBucket = 'presshop-archives';
//         const folderName = 'public/contentData'; // Name of the folder
//         const objectKey = `${folderName}/image.jpg`; // Path to the image inside the folder

//         // Define params for copying object
//         const copyParams = {
//           Bucket: destinationBucket,
//           CopySource: `/${sourceBucket}/${objectKey}`, // Source bucket and object key
//           Key: objectKey // Destination object key
//         };

//         // Copy object from source to destination bucket
//         s3.copyObject(copyParams, (copyErr, copyData) => {
//           if (copyErr) {
//             console.error("Error copying image:", copyErr);
//           } else {
//             

//             // Define params for deleting object from source bucket
//             // const deleteParams = {
//             //   Bucket: sourceBucket,
//             //   Key: objectKey // Object key to be deleted
//             // };

//             // // Delete object from source bucket
//             // s3.deleteObject(deleteParams, (deleteErr, deleteData) => {
//             //   if (deleteErr) {
//             //     console.error("Error deleting image:", deleteErr);
//             //   } else {
//             //     
//             //   }
//             // });
//           }
//         });





//         await Contents.updateOne({ _id: nanny._id }, { $set: { content_view_type: "mostviewed" } })



//       });
//     } else {
//       
//     }



//   //   const endDate = new Date();   // Replace with your end date and time
//   //   const mostviewed = await Contents.find(condition)
//   //     .sort({ content_view_count: -1 })
//   //     .limit(10);




//   //   if (mostviewed.length > 0) {
//   //     
//   //     await mostviewed.forEach(async (nanny) => {
//   //       await Contents.updateOne({ _id: nanny._id }, { $set: { content_view_type: "mostviewed" } })



//   //     });
//   //   } else {
//   //     
//   //   }
//   } catch (err) {
//     
//   }
// };
const moveToS3 = async () => {
  try {

    const d = new Date();
    const val = d.setDate(d.getDate() - 30);
    const condition = {
      published_time_date: {
        $lte: val
      },
    };
    const mostviewed = await Contents.find(condition);

    if (mostviewed.length > 0) {


      for (const x of mostviewed) {

        for (const contentItem of x.content) {
          const s3 = new AWS.S3();
          const sourceBucket = 'uat-presshope';
          const destinationBucket = 'presshop-archives';
          const folderName = 'public/contentData';
          let objectKey = `${folderName}/${contentItem.media}`

          // if (contentItem.type === 'image') {
          //   objectKey = `${folderName}/${contentItem.fileName}`;
          // } else if (contentItem.type === 'video') {
          //   objectKey = `${folderName}/${contentItem.fileName}`;
          // } else {
          //   continue; // Skip if content type is neither image nor video
          // }

          const copyParams = {
            Bucket: destinationBucket,
            CopySource: `${sourceBucket}/${objectKey}`,
            Key: objectKey
          };

          s3.copyObject(copyParams, async (copyErr, copyData) => {
            if (copyErr) {
              console.error(`Error copying ${contentItem.media}:`, copyErr);
            } else {

              // await Contents.updateOne({ _id: nanny._id }, { $set: { content_view_type: "mostviewed" } });
            }
          });
        }
      }
    } else {

    }
  } catch (err) {

  }
};
cron.schedule("* * * * *", cron_notifications_perminute, {
  // timezone: "Asia/Kolkata",
});






// This service is now turned off. Until the aws billing issue is resolved
// cron.schedule("* */3 * * *", cron_notifications_perthreeHour, {
//   // timezone: "Asia/Kolkata",
// });
async function uploadImage(object) {
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

exports.uploadUserMedia = async (req, res) => {
  try {
    if (!req.files.media || !req.body.path) {
      // check if image and path missing
      return res.status(422).json({
        code: 422,
        message: "MEDIA OR PATH MISSING",
      });
    }
    let media = await uploadFiletoAwsS3Bucket({
      fileData: req.files.media,
      path: `public/${req.body.path}`,
    });

    let mediaurl = `https://uat-presshope.s3.eu-west-2.amazonaws.com/public/${req.body.path}/${media.fileName}`;

    // const mimeType = mime.lookup(media);

    return res.status(200).json({
      code: 200,
      path: mediaurl,
      // mimeType: mimeType,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getItems = async (req, res) => {
  try {
    var respon = await db.getItems(model, user_id);
    res.status(200).json(respon);
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};

exports.addOfficeDetail = async (req, res) => {
  try {
    const data = req.body;
    var office_detai_object = {
      company_name: data.company_name,
      company_number: data.company_number,
      company_vat: data.company_vat,
      name: data.name,
      office_type_id: data.office_type_id,
      address: data.address,
      country_code: data.country_code,
      phone: data.phone,
      website: data.website,
      is_another_office_exist: data.is_another_office_exist,
    };

    const Create_Office_Detail = await db.createItem(
      office_detai_object,
      OfficeDetails
    );

    res.json({
      code: 200,
      Create_Office_Detail,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getOfficeDetail = async (req, res) => {
  try {
    const data = req.query;
    const getOfficeDetails = await OfficeDetails.find({
      company_vat: data.company_vat,
    }).populate("office_type_id").lean();

    if (!getOfficeDetails) throw buildErrObject(422, "Data Not Found");

    res.json({
      code: 200,
      data: getOfficeDetails,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getOfficeType = async (req, res) => {
  try {
    const data = req.query;

    const getOfficeDetail = await Category.find({ type: "officeType" });

    if (!getOfficeDetail) throw buildErrObject(422, "Data Not Found");

    res.json({
      code: 200,
      data: getOfficeDetail,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getDepartmentType = async (req, res) => {
  try {
    const data = req.query;

    const getDepartmentDetail = await Category.find({ type: "department" });

    if (!getDepartmentDetail) throw buildErrObject(422, "Data Not Found");

    res.json({
      code: 200,
      data: getDepartmentDetail,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getCategoryType = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      data: await Category.find({ type: req.query.type }),
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.viewPublishedContent = async (req, res) => {
  try {
    // const data = req.query;
    const data = req.body;
    const limit = data.limit ? data.limit : 4
    const offset = data.offset ? data.offset : 0
    let content, exclusiveContent, count, pipeline;
    if (data.id) {
      const pipeline = [
        {
          $match: {
            status: "published",
            _id: mongoose.Types.ObjectId(data.id),
          }
        }, // Match documents based on the given condition
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category_id"
          }
        },
        {
          $lookup: {
            from: "tags",
            localField: "tag_ids",
            foreignField: "_id",
            as: "tag_ids"
          }
        },
        {
          $unwind: { path: "$category_id", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "users",
            localField: "hopper_id",
            foreignField: "_id",
            as: "hopper_id",
            pipeline: [

              {
                $lookup: {
                  from: "avatars",
                  localField: "avatar_id",
                  foreignField: "_id",
                  as: "avatar_id"
                }
              },
              {
                $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
              },

              {
                $project: {
                  _id: 1,
                  user_name: 1,
                  first_name: 1,
                  last_name: 1,
                  avatar_id: 1,
                  email: 1,
                }
              }
            ]
          }
        },
        {
          $lookup: {
            from: "baskets",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$post_id", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "bakset_data",
          },
        },

        {
          $addFields: {
            basket_status: {
              $cond: {
                if: { $ne: [{ $size: "$bakset_data" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },
        // {
        //   $lookup: {
        //     from: "avatars",
        //     localField: "hopper_id.avatar_id",
        //     foreignField: "_id",
        //     as: "hopper_id.avatar_id"
        //   }
        // },
        {
          $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
        },
        // {
        //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
        // },

        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$content_id", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "favorate_content",
          },
        },


        {
          $addFields: {
            favourite_status: {
              $cond: {
                if: { $ne: [{ $size: "$favorate_content" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },


        // {
        //   $sort: sortBy // Sort documents based on the specified criteria
        // }
      ];
      const val = await Contents.aggregate(pipeline);

      content = val
      const contentval = await Contents.findOne({
        status: "published",
        _id: data.id,
      })

      count = content[0]
      // .populate("category_id tag_ids hopper_id avatar_id")
      // .populate({ path: "hopper_id", populate: "avatar_id" });
      // const list = content.map((x) => x._id);
      exclusiveContent = await Chat.findOne({
        // paid_status: false,
        message_type: "accept_mediaHouse_offer",
        sender_id: mongoose.Types.ObjectId(req.user._id),
        image_id: mongoose.Types.ObjectId(contentval._id)
      });
    } else {
      let sortBy = {
        // content_view_count: -1,
        createdAt: -1,
      };
      if (data.content == "latest") {
        sortBy = {
          createdAt: -1,
        };
      }
      //ask_price
      if (data.content == "lowPrice") {
        sortBy = {
          ask_price: 1,
        };
      }
      if (data.content == "highPrice") {
        sortBy = {
          ask_price: -1,
        };
      }

      if (data.sortValuesName == "lowPrice") {
        sortBy = {
          ask_price: 1,
        };
      }
      if (data.sortValuesName == "highPrice") {
        sortBy = {
          ask_price: -1,
        };
      }
      const d = new Date()
      const val = d.setDate(d.getDate() - 30)

      let condition = {
        // sale_status:
        status: "published",
        is_deleted: false,
        published_time_date: {
          $gte: new Date(val),
          $lte: new Date()
        },
        $or: [
          { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
          // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
          { purchased_mediahouse: { $exists: false } },
          { purchased_mediahouse: { $size: 0 } }
        ],
        is_hide: false,
        // $and: [
        //   { "purchased_mediahouse_time.media_house_id": mongoose.Types.ObjectId(req.user._id) },
        //   { "purchased_mediahouse_time.is_hide": false }
        // ],

        // $and: [{ Vat: { 
        //   $elemMatch: { 
        //     purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
        //     purchased_time: {$lt:new Date(Date.now() - 24 * 60 * 60 * 1000)}
        //   }
        // }
        // }],
        // $and: [
        //   { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
        //   {is_hide:false}
        // ],
        type: { $in: data.type },
        category_id: { $in: data.category_id },
        // offered_mediahouses: { $nin: [mongoose.Types.ObjectId(req.user._id)] }
      };

      // if (req.user && req.user._id) {
      //   'art_form_object': { $elemMatch: { art_form_id: data.categoy_id } }
      //   condition.purchased_mediahouse_id = { $nin: [mongoose.Types.ObjectId(req.user._id)] };
      // }
      // if (data.hasOwnProperty("category_id")) {
      //   delete condition.type;
      //   condition.category_id = data.category_id;
      // }
      if (data.maxPrice && data.minPrice) {
        delete condition.type;
        delete condition.category_id;
        condition = {
          status: "published",
          ask_price: {
            $lte: data.maxPrice,
            $gte: data.minPrice,
          },
        };
      }
      if (data.contentType) {
        delete condition.type;
        delete condition.category_id;
        condition = {
          status: "published",
          type: data.contentType,
        };
      }

      if (data.type == "all") {
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);
        let secoundry_condition = {}
        if (data.favContent == "false") {
          secoundry_condition.favourite_status = "false"
        } else if (data.favContent == "true" || data.favContent == true) {
          secoundry_condition.favourite_status = "true"
        }

        let sorval
        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          sorval = data.sortValuesName
        }


        const start = new Date(moment().utc().startOf(sorval).format());
        const end = new Date(moment().utc().endOf(sorval).format());


        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          secoundry_condition.published_time_date = {
            $gte: start,
            $lte: end
          }
        }

        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },

          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id",
          //     pipeline: [
          //       {
          //         $lookup: {
          //           from: "avatars",
          //           localField: "avatar_id",
          //           foreignField: "_id",
          //           as: "avatar_id"
          //         }
          //       },
          //       {
          //         $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
          //       },
          //     ]
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },

          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $match: secoundry_condition
          },
          // {
          //   $sort: sortBy // Sort documents based on the specified criteria
          // },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },

        ];

        content = await Contents.aggregate(pipeline);
      } else if (data.hasOwnProperty("type")) {
        // condition.type = data.type;

        if (data.favContentType) {
          delete condition.type;
          delete condition.category_id;
          condition.category_type = data.favContentType;
          content = await Favourite
            .find(condition)
            .populate("content_id")
            // .populate({ path: "hopper_id", populate: "avatar_id" })
            .sort(sortBy);
        }
        if (data.content_under_offer) {
          delete condition.category_id
          delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.content_under_offer && data.category_id) {
          // delete condition.category_id
          delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.content_under_offer && data.type) {
          delete condition.category_id
          // delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.type == "shared") {
          delete condition.type;
          delete condition.category_id;
          condition.type = "shared";
        }
        if (data.type == "exclusive") {
          delete condition.type;
          delete condition.category_id;
          condition.type = "exclusive";
        }

        if (data.hasOwnProperty("contentpurchasedonline")) {
          delete condition.type;
          delete condition.category_id;
          condition.paid_status = "paid";
        }

        if (data.hasOwnProperty("tag_id")) {
          delete condition.type;
          delete condition.category_id

          condition.tag_ids = { $in: data.tag_id };
          // condition.tag_ids = {
          //   $elemMatch: { _id: data.tag_id }
          // };
          // content = await Contents.find(condition)
          //   .populate({
          //     path: "category_id tag_ids hopper_id avatar_id",
          //     populate: { path: "hopper_id", populate: "avatar_id" },
          //     match: { "tag_ids._id": data.tag_id } // Replace with your desired tag_id value
          //   })
          //   .sort(sortBy);
        }
        if (data.hasOwnProperty("category_id")) {
          const value = data.category_id.map((x) => mongoose.Types.ObjectId(x));
          condition.category_id = { $in: value }
          // condition.category_id = data.category_id;
        }
        if (data.hasOwnProperty("hopper_id")) {
          condition.hopper_id = mongoose.Types.ObjectId(data.hopper_id)
        }
        else {
          // delete condition.type;
          delete condition.category_id;
        }


        // delete condition.category_id
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);

        let secoundry_condition = {}
        if (data.favContent == "false") {
          secoundry_condition.favourite_status = "false"
        } else if (data.favContent == "true" || data.favContent == true) {
          secoundry_condition.favourite_status = "true"
        }

        let sorval
        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          sorval = data.sortValuesName
        }


        const start = new Date(moment().utc().startOf(sorval).format());
        const end = new Date(moment().utc().endOf(sorval).format());


        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          secoundry_condition.published_time_date = {
            $gte: start,
            $lte: end
          }
        }

        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },

          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },

          // {
          //   $addFields: {
          //     totalAvg: {
          //       $cond: {
          //         if: { $eq: ["$totalAcceptedCount", 0] },
          //         then: 0, // or any other default value you prefer
          //         else: {
          //           $multiply: [
          //             { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
          //             100,
          //           ],
          //         },
          //       },
          //     },
          //   },
          // },
          // favourite_status
          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },

          {
            $lookup: {
              from: "baskets",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$post_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "bakset_data",
            },
          },

          {
            $addFields: {
              basket_status: {
                $cond: {
                  if: { $ne: [{ $size: "$bakset_data" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },





          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "image_id",
              as: "chatdata",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$message_type", "accept_mediaHouse_offer"] },
                        { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
                        { $eq: ["$paid_status", false] }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            $match: secoundry_condition
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },
        ];

        content = await Contents.aggregate(pipeline);

      }
      else if (data.isDiscount == "true" || data.isDiscount == true) {

        delete condition.type;
        delete condition.category_id
        // delete condition.status
        // condition.category_id = data.category_id;





        let secoundry_condition = {}
        if (data.favContent == "false") {
          secoundry_condition.favourite_status = "false"
        } else if (data.favContent == "true" || data.favContent == true) {
          secoundry_condition.favourite_status = "true"
        }

        let sorval
        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          sorval = data.sortValuesName
        }


        const start = new Date(moment().utc().startOf(sorval).format());
        const end = new Date(moment().utc().endOf(sorval).format());


        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          secoundry_condition.published_time_date = {
            $gte: start,
            $lte: end
          }
        }

        if (data.isDiscount == "true" || data.isDiscount == true) {
          condition.isCheck = true
        }

        //  let condition = {
        //     // sale_status:
        //     status: "published",
        //     is_deleted: false,
        //     published_time_date: {
        //       $gte: new Date(val),
        //       $lte: new Date()
        //     },
        //     $or: [
        //       { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
        //       // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
        //       { purchased_mediahouse: { $exists: false } },
        //       { purchased_mediahouse: { $size: 0 } }
        //     ],
        //     is_hide: false,
        //     isCheck:true
        //   };



        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          // {
          //   $lookup: {
          //     from: "categories",
          //     localField: "category_id",
          //     foreignField: "_id",
          //     as: "category_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "tags",
          //     localField: "tag_ids",
          //     foreignField: "_id",
          //     as: "tag_ids"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },

          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // // {
          // //   $lookup: {
          // //     from: "avatars",
          // //     localField: "hopper_id.avatar_id",
          // //     foreignField: "_id",
          // //     as: "hopper_id.avatar_id"
          // //   }
          // // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },

          {
            $lookup: {
              from: "favourites",
              localField: "_id",
              foreignField: "content_id",
              as: "favorate_content"
            }
          },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },


          {
            $lookup: {
              from: "baskets",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$post_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "bakset_data",
            },
          },

          {
            $addFields: {
              basket_status: {
                $cond: {
                  if: { $ne: [{ $size: "$bakset_data" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },

          // {
          //   $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: false }
          // },
          // {
          //   $lookup: {
          //     from: "chats",
          //     localField: "_id",
          //     foreignField: "image_id",
          //     as: "chatdata",
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $and: [
          //               { $eq: ["$message_type", "accept_mediaHouse_offer"] },
          //               { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
          //               { $eq: ["$paid_status", false] }
          //             ]
          //           }
          //         }
          //       }
          //     ]
          //   }
          // },
          // {
          //   $match: secoundry_condition
          // },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },

        ];

        content = await Contents.aggregate(pipeline);
      }

      else if (data.hasOwnProperty("search")) {
        delete condition.type;
        delete condition.category_id
        // delete condition.category_id
        // delete condition.category_id

        const findtagacctoname = await Tag.findOne({ name: { $regex: new RegExp('^' + data.search + '$'), $options: 'i' } })

        // condition.tag_ids = { $in: findtagacctoname ? findtagacctoname._id : [] };
        // condition.tag_ids = { $in: data.tag_id };
        // condition.tag_ids = {
        //   $elemMatch: { _id: data.tag_id }
        // };

        //   condition.$or= [
        //     { location: { $regex: new RegExp('^' + data.search + '$', 'i') } },
        //     { 'tag_ids.name': { $regex: new RegExp('^' + data.search + '$', 'i') } }
        // ]
        // if (data.hasOwnProperty("search")) {
        //   // condition.location = {
        //   //   $regex: new RegExp('^' + data.search + '$'),
        //   //   $options: 'i'
        //   // };

        // }


        // content = await Contents.find(condition)
        //     .populate("category_id tag_ids hopper_id avatar_id")
        //     .populate({ path: "hopper_id", populate: "avatar_id" })
        //     .sort(sortBy);


        const expres = new RegExp('^' + data.search + '$', 'i')
        pipeline = [
          // {
          //   $match: {
          //     $text: {
          //       $search: data.search,
          //     }
          //   }
          // },

          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },





          {
            $match: {
              $or: [
                { "description": { $regex: data.search, $options: "i" } },
                { "heading": { $regex: data.search, $options: "i" } },
                { "location": { $regex: data.search, $options: "i" } }, // Case-insensitive search for location
                { "tag_ids.name": { $regex: data.search, $options: "i" } },
                { "category_id.name": { $regex: data.search, $options: "i" } } // Case-insensitive search for tag names
              ]
            }
          },

          //   {
          //     $or: [
          //       { "description": { $regex: data.search, $options: "i" } },
          //       { "heading": { $regex: data.search, $options: "i" } },
          //       { "location": { $regex: data.search, $options: "i" } }, // Case-insensitive search for location
          //       { "tag_ids.name": { $regex: data.search, $options: "i" } },
          //       { "category_id.name": { $regex: data.search, $options: "i" } } // Case-insensitive search for tag names
          //     ]
          //   }
          // },
          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
        //       const filteredContents =await  content.filter(content => {
        //         // Check if the content matches the search criteria
        //         return (content.location && content.location.match(new RegExp('^' + data.search + '$', 'i'))) ||
        //             content.tag_ids.some(tag => tag.name.match(new RegExp('^' + data.search + '$', 'i')));
        //     })


        //  return  res.json({
        //       code: 200,
        //       room_id: await MhInternalGroups.findOne({ content_id: data.id }).select('room_id'),
        //       content:filteredContents,
        //       // count:content.length || 0
        //     });
      }
      else if (data.hasOwnProperty("tag_id")) {
        delete condition.type;
        delete condition.category_id

        // const findtagacctoname = await Tag.findOne({name:{ $regex: new RegExp('^' + data.search + '$'), $options: 'i' }})

        // condition.tag_ids = { $in:findtagacctoname ? findtagacctoname._id :[] };
        condition.tag_ids = { $in: data.tag_id };
        // condition.tag_ids = {
        //   $elemMatch: { _id: data.tag_id }
        // };
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);
        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id"
            }
          },
          {
            $lookup: {
              from: "avatars",
              localField: "hopper_id.avatar_id",
              foreignField: "_id",
              as: "hopper_id.avatar_id"
            }
          },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },

          // {
          //   $addFields: {
          //     totalAvg: {
          //       $cond: {
          //         if: { $eq: ["$totalAcceptedCount", 0] },
          //         then: 0, // or any other default value you prefer
          //         else: {
          //           $multiply: [
          //             { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
          //             100,
          //           ],
          //         },
          //       },
          //     },
          //   },
          // },
          // favourite_status
          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
      }
      else if (data.hasOwnProperty("category_id")) {

        delete condition.type;
        delete condition.category_id
        // condition.category_id = data.category_id;





        let secoundry_condition = {}
        if (data.favContent == "false") {
          secoundry_condition.favourite_status = "false"
        } else if (data.favContent == "true" || data.favContent == true) {
          secoundry_condition.favourite_status = "true"
        }

        let sorval
        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          sorval = data.sortValuesName
        }


        const start = new Date(moment().utc().startOf(sorval).format());
        const end = new Date(moment().utc().endOf(sorval).format());


        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          secoundry_condition.published_time_date = {
            $gte: start,
            $lte: end
          }
        }
        // condition.category_id = data.category_id;
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);

        const ids = data.category_id.map((x) => mongoose.Types.ObjectId(x))
        condition.category_id = { $in: ids };
        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },

          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },

          {
            $lookup: {
              from: "favourites",
              localField: "_id",
              foreignField: "content_id",
              as: "favorate_content"
            }
          },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },


          {
            $lookup: {
              from: "baskets",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$post_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "bakset_data",
            },
          },

          {
            $addFields: {
              basket_status: {
                $cond: {
                  if: { $ne: [{ $size: "$bakset_data" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },

          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: false }
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "image_id",
              as: "chatdata",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$message_type", "accept_mediaHouse_offer"] },
                        { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
                        { $eq: ["$paid_status", false] }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            $match: secoundry_condition
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },

        ];

        content = await Contents.aggregate(pipeline);
      } else if (data.hasOwnProperty("category_id") && data.hasOwnProperty("type")) {

        const value = data.category_id.map((x) => mongoose.Types.ObjectId(x));
        condition.category_id = { $in: value }


        let secoundry_condition = {}
        if (data.favContent == "false") {
          secoundry_condition.favourite_status = "false"
        } else if (data.favContent == "true" || data.favContent == true) {
          secoundry_condition.favourite_status = "true"
        }


        let sorval
        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          sorval = data.sortValuesName
        }


        const start = new Date(moment().utc().startOf(sorval).format());
        const end = new Date(moment().utc().endOf(sorval).format());


        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          secoundry_condition.published_time_date = {
            $gte: start,
            $lte: end
          }
        }
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);



        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id"
            }
          },
          {
            $lookup: {
              from: "avatars",
              localField: "hopper_id.avatar_id",
              foreignField: "_id",
              as: "hopper_id.avatar_id"
            }
          },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },

          // {
          //   $addFields: {
          //     totalAvg: {
          //       $cond: {
          //         if: { $eq: ["$totalAcceptedCount", 0] },
          //         then: 0, // or any other default value you prefer
          //         else: {
          //           $multiply: [
          //             { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
          //             100,
          //           ],
          //         },
          //       },
          //     },
          //   },
          // },
          // favourite_status
          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },

          {
            $lookup: {
              from: "baskets",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$post_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "bakset_data",
            },
          },

          {
            $addFields: {
              basket_status: {
                $cond: {
                  if: { $ne: [{ $size: "$bakset_data" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },

          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "image_id",
              as: "chatdata",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$message_type", "accept_mediaHouse_offer"] },
                        { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
                        { $eq: ["$paid_status", false] }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            $match: secoundry_condition
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
      } else if (data.content == "hopper_who_contribute") {
        delete condition.type;
        delete condition.category_id;



        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          {
            $group: {
              _id: "$hopper_id",
              data: { $push: "$$ROOT" },
            },
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $and: [{ $eq: ["$content_id", "$$id"] },
          //             { $eq: ["$user_id", "$$user_id"] }

          //             ],
          //           },
          //         },
          //       },

          //     ],
          //     as: "favorate_content",
          //   },
          // },


          // {
          //   $addFields: {
          //     favourite_status: {
          //       $cond: {
          //         if: { $ne: [{ $size: "$favorate_content" }, 0] },
          //         then: "true",
          //         else: "false"
          //       }
          //     }
          //   }
          // },

          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },
        ];

        content = await Contents.aggregate(pipeline);
      } else if (data.hasOwnProperty("favContent")) {

        delete condition.type;
        delete condition.category_id
        // const value = data.category_id.map((x) => mongoose.Types.ObjectId(x));
        // condition.category_id = { $in: value }


        let secoundry_condition = {}
        if (data.favContent == "false") {
          secoundry_condition.favourite_status = "false"
        } else if (data.favContent == "true" || data.favContent == true) {
          secoundry_condition.favourite_status = "true"
        }

        let sorval
        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          sorval = data.sortValuesName
        }


        const start = new Date(moment().utc().startOf(sorval).format());
        const end = new Date(moment().utc().endOf(sorval).format());


        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          secoundry_condition.published_time_date = {
            $gte: start,
            $lte: end
          }
        }
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);



        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id"
            }
          },
          {
            $lookup: {
              from: "avatars",
              localField: "hopper_id.avatar_id",
              foreignField: "_id",
              as: "hopper_id.avatar_id"
            }
          },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },

          // {
          //   $addFields: {
          //     totalAvg: {
          //       $cond: {
          //         if: { $eq: ["$totalAcceptedCount", 0] },
          //         then: 0, // or any other default value you prefer
          //         else: {
          //           $multiply: [
          //             { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
          //             100,
          //           ],
          //         },
          //       },
          //     },
          //   },
          // },
          // favourite_status
          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "image_id",
              as: "chatdata",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$message_type", "accept_mediaHouse_offer"] },
                        { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
                        { $eq: ["$paid_status", false] }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            $match: secoundry_condition
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
      }

      else {
        delete condition.type;
        delete condition.category_id;

        let secoundry_condition = {}
        if (data.favContent == "false") {
          secoundry_condition.favourite_status = "false"
        } else if (data.favContent == "true" || data.favContent == true) {
          secoundry_condition.favourite_status = "true"
        }

        let sorval
        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          sorval = data.sortValuesName
        }


        const start = new Date(moment().utc().startOf(sorval).format());
        const end = new Date(moment().utc().endOf(sorval).format());


        if (data.sortValuesName && data.sortValuesName != "lowPrice" && data.sortValuesName != "highPrice") {
          secoundry_condition.published_time_date = {
            $gte: start,
            $lte: end
          }
        }



        if (data.hasOwnProperty("hopper_id")) {
          condition.hopper_id = mongoose.Types.ObjectId(data.hopper_id)
        }

        pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },

          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "baskets",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$post_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "bakset_data",
            },
          },

          {
            $addFields: {
              basket_status: {
                $cond: {
                  if: { $ne: [{ $size: "$bakset_data" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $match: secoundry_condition
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
          // {
          //   $limit: data.limit ? parseInt(data.limit) : 4
          // },
          // {
          //   $skip: data.offset ? parseInt(data.offset) : 0
          // },
        ];

        content = await Contents.aggregate(pipeline);
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);
      }
      pipeline.push(
        {
          $skip: data.offset ? parseInt(data.offset) : 0
        },
        {
          $limit: data.limit ? parseInt(data.limit) : 4
        },
      )
      count = await Contents.aggregate(pipeline);
    }

    res.json({
      code: 200,
      room_id: await MhInternalGroups.findOne({ content_id: mongoose.Types.ObjectId(data.id), user_id: mongoose.Types.ObjectId(req.user._id) }).select('room_id'),
      content: count,
      chatdata: exclusiveContent,
      count: content.length
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};


exports.archivecontentold = async (req, res) => {
  try {
    // const data = req.query;
    const data = req.body;
    let content;
    if (data.id) {
      content = await Contents.findOne({
        status: "published",
        _id: data.id,
      })
        .populate("category_id tag_ids hopper_id avatar_id")
        .populate({ path: "hopper_id", populate: "avatar_id" });
    } else {
      let sortBy = {
        // content_view_count: -1,
        published_time_date: -1,
      };
      if (data.content == "latest") {
        sortBy = {
          published_time_date: -1,
        };
      }
      //ask_price
      if (data.content == "lowPrice") {
        sortBy = {
          ask_price: 1,
        };
      }
      if (data.content == "highPrice") {
        sortBy = {
          ask_price: -1,
        };
      }

      let condition = {
        is_deleted: false,
        status: "published",
        published_time_date: {
          $lte: new Date(data.end),
          $gte: new Date(data.start)
        },
        type: { $in: data.type },
        category_id: { $in: data.category_id },
      };
      // if (data.hasOwnProperty("category_id")) {
      //   delete condition.type;
      //   condition.category_id = data.category_id;
      // }
      if (data.maxPrice && data.minPrice) {
        delete condition.type;
        delete condition.category_id;
        condition = {
          status: "published",
          ask_price: {
            $lte: data.maxPrice,
            $gte: data.minPrice,
          },
        };
      }
      if (data.contentType) {
        delete condition.type;
        delete condition.category_id;
        condition = {
          status: "published",
          type: data.contentType,
        };
      }

      if (data.type == "all") {
        content = await Contents.find(condition)
          .populate("category_id tag_ids hopper_id avatar_id")
          .populate({ path: "hopper_id", populate: "avatar_id" })
          .sort(sortBy);
      } else if (data.hasOwnProperty("type")) {
        // condition.type = data.type;

        if (data.favContentType) {
          delete condition.type;
          delete condition.category_id;
          condition.category_type = data.favContentType;
          content = await Favourite
            .find(condition)
            .populate("content_id")
            // .populate({ path: "hopper_id", populate: "avatar_id" })
            .sort(sortBy);
        }
        if (data.content_under_offer) {
          delete condition.category_id
          delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.content_under_offer && data.category_id) {
          // delete condition.category_id
          delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.content_under_offer && data.type) {
          delete condition.category_id
          // delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.type == "shared") {
          delete condition.type;
          delete condition.category_id;
          condition.type = "shared";
        }
        if (data.type == "exclusive") {
          delete condition.type;
          delete condition.category_id;
          condition.type = "exclusive";
        }

        if (data.hasOwnProperty("contentpurchasedonline")) {
          delete condition.type;
          delete condition.category_id;
          condition.paid_status = "paid";
        }

        if (data.hasOwnProperty("tag_id")) {
          delete condition.type;
          delete condition.category_id

          condition.tag_ids = { $in: data.tag_id };
          // condition.tag_ids = {
          //   $elemMatch: { _id: data.tag_id }
          // };
          // content = await Contents.find(condition)
          //   .populate({
          //     path: "category_id tag_ids hopper_id avatar_id",
          //     populate: { path: "hopper_id", populate: "avatar_id" },
          //     match: { "tag_ids._id": data.tag_id } // Replace with your desired tag_id value
          //   })
          //   .sort(sortBy);
        }
        if (data.hasOwnProperty("category_id")) {
          condition.category_id = data.category_id;
        }


        delete condition.category_id
        content = await Contents.find(condition)
          .populate("category_id tag_ids hopper_id avatar_id")
          .populate({ path: "hopper_id", populate: "avatar_id" })
          .sort(sortBy);
      } else if (data.hasOwnProperty("tag_id")) {
        delete condition.type;
        delete condition.category_id

        condition.tag_ids = { $in: data.tag_id };
        // condition.tag_ids = {
        //   $elemMatch: { _id: data.tag_id }
        // };
        content = await Contents.find(condition)
          .populate("category_id tag_ids hopper_id avatar_id")
          .populate({ path: "hopper_id", populate: "avatar_id" })
          .sort(sortBy);
      }
      else if (data.hasOwnProperty("tagName")) {


        delete condition.type;
        delete condition.category_id
        condition.tag_ids = { $in: data.tagName };
        content = await Contents.find(condition).populate("category_id tag_ids hopper_id avatar_id").populate({ path: "hopper_id", populate: "avatar_id" }).sort(sortBy);
      }
      else if (data.hasOwnProperty("category_id")) {
        delete condition.type;
        condition.category_id = data.category_id;
        content = await Contents.find(condition)
          .populate("category_id tag_ids hopper_id avatar_id")
          .populate({ path: "hopper_id", populate: "avatar_id" })
          .sort(sortBy);
      } else if (data.hasOwnProperty("category_id") && data.hasOwnProperty("type")) {
        condition.category_id = data.category_id;
        content = await Contents.find(condition)
          .populate("category_id tag_ids hopper_id avatar_id")
          .populate({ path: "hopper_id", populate: "avatar_id" })
          .sort(sortBy);
      }

      else {
        delete condition.type;
        delete condition.category_id;
        content = await Contents.find(condition)
          .populate("category_id tag_ids hopper_id avatar_id")
          .populate({ path: "hopper_id", populate: "avatar_id" })
          .sort(sortBy);
      }
    }
    res.json({
      code: 200,
      room_id: await MhInternalGroups.findOne({ content_id: data.id }).select('room_id'),
      content,
      // count:content.length || 0
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.archivecontent = async (req, res) => {
  try {
    // const data = req.query;
    const data = req.body;
    const limit = data.limit ? data.limit : 4
    const offset = data.offset ? data.offset : 0
    let content, exclusiveContent;
    if (data.id) {
      const pipeline = [
        {
          $match: {
            status: "published",
            _id: mongoose.Types.ObjectId(data.id),
          }
        }, // Match documents based on the given condition
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category_id"
          }
        },
        {
          $lookup: {
            from: "tags",
            localField: "tag_ids",
            foreignField: "_id",
            as: "tag_ids"
          }
        },
        {
          $unwind: { path: "$category_id", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "users",
            localField: "hopper_id",
            foreignField: "_id",
            as: "hopper_id",
            pipeline: [
              {
                $lookup: {
                  from: "avatars",
                  localField: "avatar_id",
                  foreignField: "_id",
                  as: "avatar_id"
                }
              },
              {
                $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
              },
            ]
          }
        },
        // {
        //   $lookup: {
        //     from: "avatars",
        //     localField: "hopper_id.avatar_id",
        //     foreignField: "_id",
        //     as: "hopper_id.avatar_id"
        //   }
        // },
        {
          $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
        },
        // {
        //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
        // },

        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$content_id", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "favorate_content",
          },
        },


        {
          $addFields: {
            favourite_status: {
              $cond: {
                if: { $ne: [{ $size: "$favorate_content" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },
        {
          $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
        },

        // {
        //   $sort: sortBy // Sort documents based on the specified criteria
        // }
      ];
      const val = await Contents.aggregate(pipeline);

      content = val[0]
      const contentval = await Contents.findOne({
        status: "published",
        _id: data.id,
      })
      // .populate("category_id tag_ids hopper_id avatar_id")
      // .populate({ path: "hopper_id", populate: "avatar_id" });
      // const list = content.map((x) => x._id);
      exclusiveContent = await Chat.findOne({
        paid_status: false,
        message_type: "accept_mediaHouse_offer",
        receiver_id: mongoose.Types.ObjectId(req.user._id),
        image_id: mongoose.Types.ObjectId(contentval._id)
      });
    } else {
      let sortBy = {
        // content_view_count: -1,
        published_time_date: -1,
      };
      if (data.content == "latest") {
        sortBy = {
          published_time_date: -1,
        };
      }
      //ask_price
      if (data.content == "lowPrice") {
        sortBy = {
          ask_price: 1,
        };
      }
      if (data.content == "highPrice") {
        sortBy = {
          ask_price: -1,
        };
      }

      if (data.sortValuesName == "lowPrice") {
        sortBy = {
          ask_price: 1,
        };
      }
      if (data.sortValuesName == "highPrice") {
        sortBy = {
          ask_price: -1,
        };
      }
      const d = new Date()
      const val = d.setDate(d.getDate() - 30)

      // let condition = {
      //   // sale_status:
      //   status: "published",
      //   is_deleted: false,
      //   published_time_date: {
      //     $gte: new Date(val),
      //     $lte: new Date()
      //   },
      //   $or: [
      //     { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
      //     // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
      //     { purchased_mediahouse: { $exists: false } },
      //     { purchased_mediahouse: { $size: 0 } }
      //   ],
      //   is_hide: false,
      //   // $and: [
      //   //   { "purchased_mediahouse_time.media_house_id": mongoose.Types.ObjectId(req.user._id) },
      //   //   { "purchased_mediahouse_time.is_hide": false }
      //   // ],

      //   // $and: [{ Vat: { 
      //   //   $elemMatch: { 
      //   //     purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      //   //     purchased_time: {$lt:new Date(Date.now() - 24 * 60 * 60 * 1000)}
      //   //   }
      //   // }
      //   // }],
      //   // $and: [
      //   //   { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
      //   //   {is_hide:false}
      //   // ],
      //   type: { $in: data.type },
      //   category_id: { $in: data.category_id },
      //   offered_mediahouses: { $nin: [mongoose.Types.ObjectId(req.user._id)] }
      // };

      // data.category_id = data.category_id.map((x) => mongoose.Types.ObjectId(x))
      let condition = {
        is_deleted: false,
        status: "published",
        published_time_date: {
          $lte: new Date(data.end),
          $gte: new Date(data.start)
        },
        // type: { $in: data.type },
        // category_id: { $in: data.category_id },
      };

      // if (req.user && req.user._id) {
      //   'art_form_object': { $elemMatch: { art_form_id: data.categoy_id } }
      //   condition.purchased_mediahouse_id = { $nin: [mongoose.Types.ObjectId(req.user._id)] };
      // }
      // if (data.hasOwnProperty("category_id")) {
      //   delete condition.type;
      //   condition.category_id = data.category_id;
      // }
      if (data.maxPrice && data.minPrice) {
        delete condition.type;
        delete condition.category_id;
        condition = {
          status: "published",
          ask_price: {
            $lte: data.maxPrice,
            $gte: data.minPrice,
          },
        };
      }
      if (data.contentType) {
        delete condition.type;
        delete condition.category_id;
        condition = {
          status: "published",
          type: data.contentType,
        };
      }

      if (data.type == "all") {
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);


        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },

          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id",
          //     pipeline: [
          //       {
          //         $lookup: {
          //           from: "avatars",
          //           localField: "avatar_id",
          //           foreignField: "_id",
          //           as: "avatar_id"
          //         }
          //       },
          //       {
          //         $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
          //       },
          //     ]
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },

          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $limit: data.limit ? parseInt(data.limit) : 4
          },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
        ];

        content = await Contents.aggregate(pipeline);
      } else if (data.hasOwnProperty("type")) {
        // condition.type = data.type;

        if (data.favContentType) {
          delete condition.type;
          delete condition.category_id;
          condition.category_type = data.favContentType;
          content = await Favourite
            .find(condition)
            .populate("content_id")
            // .populate({ path: "hopper_id", populate: "avatar_id" })
            .sort(sortBy);
        }
        if (data.content_under_offer) {
          delete condition.category_id
          delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.content_under_offer && data.category_id) {
          // delete condition.category_id
          delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.content_under_offer && data.type) {
          delete condition.category_id
          // delete condition.type;
          condition.content_under_offer = true;
        }
        if (data.type == "shared") {
          delete condition.type;
          delete condition.category_id;
          condition.type = "shared";
        }
        if (data.type == "exclusive") {
          delete condition.type;
          delete condition.category_id;
          condition.type = "exclusive";
        }

        if (data.hasOwnProperty("contentpurchasedonline")) {
          delete condition.type;
          delete condition.category_id;
          condition.paid_status = "paid";
        }

        if (data.hasOwnProperty("tag_id")) {
          delete condition.type;
          delete condition.category_id

          condition.tag_ids = { $in: data.tag_id };
          // condition.tag_ids = {
          //   $elemMatch: { _id: data.tag_id }
          // };
          // content = await Contents.find(condition)
          //   .populate({
          //     path: "category_id tag_ids hopper_id avatar_id",
          //     populate: { path: "hopper_id", populate: "avatar_id" },
          //     match: { "tag_ids._id": data.tag_id } // Replace with your desired tag_id value
          //   })
          //   .sort(sortBy);
        }
        if (data.hasOwnProperty("category_id")) {
          const value = data.category_id.map((x) => mongoose.Types.ObjectId(x));
          condition.category_id = { $in: value }
          // condition.category_id = data.category_id;
        }
        if (data.hasOwnProperty("hopper_id")) {
          condition.hopper_id = mongoose.Types.ObjectId(data.hopper_id)
        }
        else {
          // delete condition.type;
          delete condition.category_id;
        }


        // delete condition.category_id
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);



        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },

          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },

          // {
          //   $addFields: {
          //     totalAvg: {
          //       $cond: {
          //         if: { $eq: ["$totalAcceptedCount", 0] },
          //         then: 0, // or any other default value you prefer
          //         else: {
          //           $multiply: [
          //             { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
          //             100,
          //           ],
          //         },
          //       },
          //     },
          //   },
          // },
          // favourite_status
          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "image_id",
              as: "chatdata",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$message_type", "accept_mediaHouse_offer"] },
                        { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
                        { $eq: ["$paid_status", false] }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
          },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
        ];

        content = await Contents.aggregate(pipeline);

      }
      else if (data.hasOwnProperty("search")) {
        delete condition.type;
        delete condition.category_id
        // delete condition.category_id
        // delete condition.category_id

        const findtagacctoname = await Tag.findOne({ name: { $regex: new RegExp('^' + data.search + '$'), $options: 'i' } })

        // condition.tag_ids = { $in: findtagacctoname ? findtagacctoname._id : [] };
        // condition.tag_ids = { $in: data.tag_id };
        // condition.tag_ids = {
        //   $elemMatch: { _id: data.tag_id }
        // };

        //   condition.$or= [
        //     { location: { $regex: new RegExp('^' + data.search + '$', 'i') } },
        //     { 'tag_ids.name': { $regex: new RegExp('^' + data.search + '$', 'i') } }
        // ]
        // if (data.hasOwnProperty("search")) {
        //   // condition.location = {
        //   //   $regex: new RegExp('^' + data.search + '$'),
        //   //   $options: 'i'
        //   // };

        // }


        // content = await Contents.find(condition)
        //     .populate("category_id tag_ids hopper_id avatar_id")
        //     .populate({ path: "hopper_id", populate: "avatar_id" })
        //     .sort(sortBy);


        const expres = new RegExp('^' + data.search + '$', 'i')
        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id"
            }
          },
          {
            $lookup: {
              from: "avatars",
              localField: "hopper_id.avatar_id",
              foreignField: "_id",
              as: "hopper_id.avatar_id"
            }
          },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $match: {
              $or: [
                { "description": { $regex: data.search, $options: "i" } },
                { "heading": { $regex: data.search, $options: "i" } },
                { "location": { $regex: data.search, $options: "i" } }, // Case-insensitive search for location
                { "tag_ids.name": { $regex: data.search, $options: "i" } },
                { "category_id.name": { $regex: data.search, $options: "i" } } // Case-insensitive search for tag names
              ]
            }
          },
          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
        //       const filteredContents =await  content.filter(content => {
        //         // Check if the content matches the search criteria
        //         return (content.location && content.location.match(new RegExp('^' + data.search + '$', 'i'))) ||
        //             content.tag_ids.some(tag => tag.name.match(new RegExp('^' + data.search + '$', 'i')));
        //     })


        //  return  res.json({
        //       code: 200,
        //       room_id: await MhInternalGroups.findOne({ content_id: data.id }).select('room_id'),
        //       content:filteredContents,
        //       // count:content.length || 0
        //     });
      }
      else if (data.hasOwnProperty("tag_id")) {
        delete condition.type;
        delete condition.category_id

        // const findtagacctoname = await Tag.findOne({name:{ $regex: new RegExp('^' + data.search + '$'), $options: 'i' }})

        // condition.tag_ids = { $in:findtagacctoname ? findtagacctoname._id :[] };
        condition.tag_ids = { $in: data.tag_id };
        // condition.tag_ids = {
        //   $elemMatch: { _id: data.tag_id }
        // };
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);
        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id"
            }
          },
          {
            $lookup: {
              from: "avatars",
              localField: "hopper_id.avatar_id",
              foreignField: "_id",
              as: "hopper_id.avatar_id"
            }
          },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },

          // {
          //   $addFields: {
          //     totalAvg: {
          //       $cond: {
          //         if: { $eq: ["$totalAcceptedCount", 0] },
          //         then: 0, // or any other default value you prefer
          //         else: {
          //           $multiply: [
          //             { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
          //             100,
          //           ],
          //         },
          //       },
          //     },
          //   },
          // },
          // favourite_status
          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $limit: data.limit ? parseInt(data.limit) : 4
          },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
      }
      else if (data.hasOwnProperty("category_id")) {

        delete condition.type;
        delete condition.category_id
        // condition.category_id = data.category_id;

        // condition.category_id = data.category_id;
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);

        const ids = data.category_id.map((x) => mongoose.Types.ObjectId(x))
        condition.category_id = { $in: ids };
        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },

          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },

          {
            $lookup: {
              from: "favourites",
              localField: "_id",
              foreignField: "content_id",
              as: "favorate_content"
            }
          },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: false }
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "image_id",
              as: "chatdata",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$message_type", "accept_mediaHouse_offer"] },
                        { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
                        { $eq: ["$paid_status", false] }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            $limit: data.limit ? parseInt(data.limit) : 4
          },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
      } else if (data.hasOwnProperty("category_id") && data.hasOwnProperty("type")) {

        const value = data.category_id.map((x) => mongoose.Types.ObjectId(x));
        condition.category_id = { $in: value }



        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);



        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id"
            }
          },
          {
            $lookup: {
              from: "avatars",
              localField: "hopper_id.avatar_id",
              foreignField: "_id",
              as: "hopper_id.avatar_id"
            }
          },
          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },


          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },

          // {
          //   $addFields: {
          //     totalAvg: {
          //       $cond: {
          //         if: { $eq: ["$totalAcceptedCount", 0] },
          //         then: 0, // or any other default value you prefer
          //         else: {
          //           $multiply: [
          //             { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
          //             100,
          //           ],
          //         },
          //       },
          //     },
          //   },
          // },
          // favourite_status
          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "chats",
              localField: "_id",
              foreignField: "image_id",
              as: "chatdata",
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$message_type", "accept_mediaHouse_offer"] },
                        { $eq: ["$receiver_id", mongoose.Types.ObjectId(req.user._id)] },
                        { $eq: ["$paid_status", false] }
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            $limit: data.limit ? parseInt(data.limit) : 4
          },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          }
        ];

        content = await Contents.aggregate(pipeline);
      } else if (data.content == "hopper_who_contribute") {
        delete condition.type;
        delete condition.category_id;



        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },
          {
            $group: {
              _id: "$hopper_id",
              data: { $push: "$$ROOT" },
            },
          },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          //     pipeline: [
          //       {
          //         $match: {
          //           $expr: {
          //             $and: [{ $eq: ["$content_id", "$$id"] },
          //             { $eq: ["$user_id", "$$user_id"] }

          //             ],
          //           },
          //         },
          //       },

          //     ],
          //     as: "favorate_content",
          //   },
          // },


          // {
          //   $addFields: {
          //     favourite_status: {
          //       $cond: {
          //         if: { $ne: [{ $size: "$favorate_content" }, 0] },
          //         then: "true",
          //         else: "false"
          //       }
          //     }
          //   }
          // },

          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
          {
            $limit: data.limit ? parseInt(data.limit) : 4
          },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },
        ];

        content = await Contents.aggregate(pipeline);
      }

      else {
        delete condition.type;
        delete condition.category_id;

        if (data.hasOwnProperty("hopper_id")) {
          condition.hopper_id = mongoose.Types.ObjectId(data.hopper_id)
        }

        const pipeline = [
          { $match: condition }, // Match documents based on the given condition
          {
            $lookup: {
              from: "categories",
              localField: "category_id",
              foreignField: "_id",
              as: "category_id"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tag_ids",
              foreignField: "_id",
              as: "tag_ids"
            }
          },
          // {
          //   $lookup: {
          //     from: "users",
          //     localField: "hopper_id",
          //     foreignField: "_id",
          //     as: "hopper_id"
          //   }
          // },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },
          // {
          //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          // },
          // {
          //   $lookup: {
          //     from: "favourites",
          //     localField: "_id",
          //     foreignField: "content_id",
          //     as: "favorate_content"
          //   }
          // },
          {
            $lookup: {
              from: "users",
              localField: "hopper_id",
              foreignField: "_id",
              as: "hopper_id",
              pipeline: [
                {
                  $lookup: {
                    from: "avatars",
                    localField: "avatar_id",
                    foreignField: "_id",
                    as: "avatar_id"
                  }
                },
                {
                  $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                },
              ]
            }
          },
          // {
          //   $lookup: {
          //     from: "avatars",
          //     localField: "hopper_id.avatar_id",
          //     foreignField: "_id",
          //     as: "hopper_id.avatar_id"
          //   }
          // },

          {
            $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
          },

          {
            $lookup: {
              from: "favourites",
              let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$content_id", "$$id"] },
                      { $eq: ["$user_id", "$$user_id"] }

                      ],
                    },
                  },
                },

              ],
              as: "favorate_content",
            },
          },


          {
            $addFields: {
              favourite_status: {
                $cond: {
                  if: { $ne: [{ $size: "$favorate_content" }, 0] },
                  then: "true",
                  else: "false"
                }
              }
            }
          },
          {
            $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
          },
          {
            $sort: sortBy // Sort documents based on the specified criteria
          },
          {
            $limit: data.limit ? parseInt(data.limit) : 4
          },
          {
            $skip: data.offset ? parseInt(data.offset) : 0
          },
        ];

        content = await Contents.aggregate(pipeline);
        // content = await Contents.find(condition)
        //   .populate("category_id tag_ids hopper_id avatar_id")
        //   .populate({ path: "hopper_id", populate: "avatar_id" })
        //   .sort(sortBy);
      }
    }
    res.json({
      code: 200,
      room_id: await MhInternalGroups.findOne({ content_id: mongoose.Types.ObjectId(data.id), admin_id: mongoose.Types.ObjectId(req.user._id) }),
      content,
      chatdata: exclusiveContent
      // count:content.length || 0
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};





async function fetchSynonyms(tagId) {
  // Assuming you have a Synonyms model/schema
  const name = await Tag.findOne({ _id: tagId });

  // const synonyms = thesaurus.getSynonyms(name.name) 
  const synony = await synonyms(name.name, "v");

  if (synony) {
    return synony; // Return an array of synonyms
  } else {
    return []; // Return an empty array if no synonyms found
  }
}
exports.relatedContent = async (req, res) => {
  try {
    // const data = req.query;
    const data = req.body;

    const tagSynonyms = []; // Assuming you have a function to fetch synonyms for a tag_id
    if (typeof data.tag_id == "string") {
      data.tag_id = JSON.parse(data.tag_id)
    }


    if (data.tag_id && data.tag_id.length > 0) {

      for (const tagId of data?.tag_id) {
        const synonymsall = await fetchSynonyms(tagId); // Fetch synonyms for each tag_id

        tagSynonyms.push(...synonymsall); // Accumulate synonyms
      }
    }
    let findcontent
    if (data.content_id) {

      findcontent = await Contents.findOne({ _id: mongoose.Types.ObjectId(data.content_id) }).select("heading")
    }

    if (findcontent?.heading && findcontent) {

      EdenSdk.auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWJlNjcxYjQtYzNiNS00OWMyLThlNzItZDg0ODQ2OGMyYzgyIiwidHlwZSI6ImFwaV90b2tlbiJ9.wXT9IoUGBr6JB7OxNvC9alRy4N0jgN_kLXs5n4d4NBY');
      await EdenSdk.text_keyword_extraction_create({
        settings: '{"amazon":"boto3"}',
        response_as_dict: true,
        attributes_as_list: false,
        show_base_64: false,
        show_original_response: false,
        text: findcontent.heading,
        providers: ['ibm']
      })
        .then(async ({ data }) => {
          if (data.ibm.items.length > 0) {

            for (const x of data.ibm.items) {
              // const text = x.keyword.split(" ")
              // 
              tagSynonyms.push(x.keyword)
              // for (const j of text) {

              //   const synony = await synonyms(j, "v");

              //   
              //   if (synony == undefined || synony == "undefined" || typeof synony == "undefined") {
              //     
              //   }else{
              //     
              //       tagSynonyms.push(synony[0])

              //   }



              // }
            }
          }
        })
        .catch(err => console.error("edenerr--------------", err));
    }




    // const synonyms = thesaurus.getSynonyms('big');
    let content;
    const d = new Date()
    const val = d.setDate(d.getDate() - 30)

    data.tag_id = data.tag_id.map((x) => mongoose.Types.ObjectId(x))
    // content = await Contents.find({
    //   is_deleted: false,
    //   status: "published",
    //   hopper_id: { $ne: data.hopper_id },
    //   // tag_ids: { $in: data.tag_id },
    //   category_id: { $eq: data.category_id },
    //   $or: [
    //     { tag_ids: { $in: data.tag_id } }, // Including original tag_ids
    //     { description: { $in: tagSynonyms } },
    //     { heading: { $in: tagSynonyms } } // Including synonyms from description
    //   ],
    //   createdAt: {
    //     $gte: new Date(val),
    //     $lte: new Date()
    //   },
    // })
    // .populate("category_id tag_ids hopper_id avatar_id")
    // .populate({ path: "hopper_id", populate: "avatar_id" }).sort({ createdAt: -1 });



    let condition = {
      // sale_status:
      status: "published",
      is_deleted: false,
      // hopper_id: { $ne: mongoose.Types.ObjectId(data.hopper_id) },
      category_id: { $eq: mongoose.Types.ObjectId(data.category_id) },
      published_time_date: {
        $gte: new Date(val),
        $lte: new Date()
      },

      $or: [
        { tag_ids: { $in: data.tag_id } }, // Including original tag_ids
        { description: { $in: tagSynonyms } },
        { heading: { $in: tagSynonyms } } // Including synonyms from description
      ],
      _id: { $ne: data.content_id ? mongoose.Types.ObjectId(data.content_id) : new ObjectId() },
      $or: [
        { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
        // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
        { purchased_mediahouse: { $exists: false } },
        { purchased_mediahouse: { $size: 0 } }
      ],
    };

    const pipeline = [
      { $match: condition }, // Match documents based on the given condition
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tag_ids",
          foreignField: "_id",
          as: "tag_ids"
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id",
          pipeline: [
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_id"
              }
            },
            {
              $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
            },
          ]
        }
      },
      // {
      //   $lookup: {
      //     from: "avatars",
      //     localField: "hopper_id.avatar_id",
      //     foreignField: "_id",
      //     as: "hopper_id.avatar_id"
      //   }
      // },

      {
        $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "hopper_id",
      //     foreignField: "_id",
      //     as: "hopper_id",
      //     pipeline: [
      //       {
      //         $lookup: {
      //           from: "avatars",
      //           localField: "avatar_id",
      //           foreignField: "_id",
      //           as: "avatar_id"
      //         }
      //       },
      //       {
      //         $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
      //       },
      //     ]
      //   }
      // },
      // {
      //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      // },

      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
      },


      {
        $lookup: {
          from: "baskets",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$post_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "bakset_data",
        },
      },

      {
        $addFields: {
          basket_status: {
            $cond: {
              if: { $ne: [{ $size: "$bakset_data" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 } // Sort documents based on the specified criteria
      },
      // {
      //   $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
      // },
      // {
      //   $skip: data.offset ? parseInt(data.offset) : 0
      // },

    ];

    let count = await Contents.aggregate(pipeline);




    pipeline.push(
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
      },
    )

    content = await Contents.aggregate(pipeline);


    content = await Contents.aggregate(pipeline);

    res.json({
      code: 200,
      content,
      totalCount: count.length
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.MoreContent = async (req, res) => {
  try {
    // const data = req.query;
    const data = req.body;
    let content;
    const d = new Date()
    const val = d.setDate(d.getDate() - 30)

    let condition = {
      // sale_status:
      status: "published",
      is_deleted: false,
      hopper_id: mongoose.Types.ObjectId(data.hopper_id),
      published_time_date: {
        $gte: new Date(val),
        $lte: new Date()
      },
      _id: { $ne: data.content_id ? mongoose.Types.ObjectId(data.content_id) : new ObjectId() },
      $or: [
        { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
        // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
        { purchased_mediahouse: { $exists: false } },
        { purchased_mediahouse: { $size: 0 } }
      ],
    };

    const pipeline = [
      { $match: condition }, // Match documents based on the given condition
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tag_ids",
          foreignField: "_id",
          as: "tag_ids"
        }
      },
      {
        $lookup: {
          from: "baskets",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$post_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "bakset_data",
        },
      },

      {
        $addFields: {
          basket_status: {
            $cond: {
              if: { $ne: [{ $size: "$bakset_data" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id",
          pipeline: [
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_id"
              }
            },
            {
              $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
            },
          ]
        }
      },
      // {
      //   $lookup: {
      //     from: "avatars",
      //     localField: "hopper_id.avatar_id",
      //     foreignField: "_id",
      //     as: "hopper_id.avatar_id"
      //   }
      // },

      {
        $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "hopper_id",
      //     foreignField: "_id",
      //     as: "hopper_id",
      //     pipeline: [
      //       {
      //         $lookup: {
      //           from: "avatars",
      //           localField: "avatar_id",
      //           foreignField: "_id",
      //           as: "avatar_id"
      //         }
      //       },
      //       {
      //         $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
      //       },
      //     ]
      //   }
      // },
      // {
      //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      // },

      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
      },
      {
        $sort: { createdAt: -1 } // Sort documents based on the specified criteria
      },


    ];
    let count = await Contents.aggregate(pipeline);




    pipeline.push(
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
      },
    )

    content = await Contents.aggregate(pipeline);

    // content = await Contents.find({
    //   status: "published",
    //   hopper_id: data.hopper_id,
    //   is_deleted: false,
    //   published_time_date: {
    //     $gte: new Date(val),
    //     $lte: new Date()
    //   },
    //   _id:{$ne:data.content_id ? mongoose.Types.ObjectId(data.content_id) :new ObjectId()},

    //   $or: [
    //     { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
    //     // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
    //     { purchased_mediahouse: { $exists: false } },
    //     { purchased_mediahouse: { $size: 0 } }
    //   ],
    // })
    //   .populate("category_id tag_ids hopper_id avatar_id")
    //   .populate({ path: "hopper_id", populate: "avatar_id" }).sort({ createdAt: -1 });
    res.json({
      code: 200,
      content,
      totalCount: count.length
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.contentPayment = async (req, res) => {
  try {
    const data = req.body;

    data.media_house_id = req.user._id;
    data.content_id = data.id;
    await db.updateItem(data.id, Contents, {
      sale_status: "sold",
      paid_status: data.paid_status,
      amount_paid: data.amount,
      purchased_publication: data.media_house_id,
    });
    const payment = await db.createItem(data, HopperPayment);
    res.json({
      code: 200,
      payment,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.createBroadCastTask = async (req, res) => {
  try {
    const data = req.body;

    data.user_id = req.user._id;
    data.role = req.user.role;

    if (req.user.admin_rignts.allowed_to_broadcast_tasks == false || req.user.admin_rignts.allowed_to_broadcast_tasks == "false") {
      return res.status(422).json({
        code: 422, errors: {
          msg: "You are not allowed to broadcast task"
        }
      })

      // utils.handleError(res, "You are not allowed to broadcast task");
    }


    const TaskCreated = await db.createItem(data, BroadCastTask);
    var prices = await db.getMinMaxPrice(BroadCastTask, TaskCreated._id);
    const mediaHouse = await db.getItem(TaskCreated.mediahouse_id, User);
    const subuser = await User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) }).populate("media_house_id");
    const users = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              TaskCreated.address_location.coordinates[1],
              TaskCreated.address_location.coordinates[0],
            ],
          },
          distanceField: "distance",
          // distanceMultiplier: 0.001, //0.001
          spherical: true,
          includeLocs: "location",
          maxDistance: 200 * 1000,
        },
      },
      {
        $match: { role: "Hopper" },
      },
    ]);

    for (let user of users) {
      const notifcationObj = {
        user_id: user._id,
        main_type: "task",
        notification_type: "media_house_tasks",
        title: "New task from PRESSHOP", //`${mediaHouse.admin_detail.full_name}`,
        description: `Broadcasted a new task from £${prices[0].min_price}-£${prices[0].max_price} Go ahead, and accept the task`,
        profile_img: `${req.user.role == "User_mediaHouse" ? subuser.media_house_id.profile_image : mediaHouse.admin_detail.admin_profile}`,
        distance: user.distance.toString(),
        deadline_date: TaskCreated.deadline_date.toString(),
        lat: TaskCreated.address_location.coordinates[1].toString(),
        long: TaskCreated.address_location.coordinates[0].toString(),
        min_price: prices[0].min_price.toString(),
        max_price: prices[0].max_price.toString(),
        task_description: TaskCreated.task_description,
        broadCast_id: TaskCreated._id.toString(),
        push: true,
        // notification_id: uuid.v4()
      };
      // await this._sendNotification(notifcationObj);
      const findallHopper = await User.findOne({ _id: mongoose.Types.ObjectId(user._id) })
      const notiObj = {
        sender_id: user._id,
        receiver_id: user._id,
        title: "New task posted",
        body: `👋🏼 Hi ${findallHopper.user_name}, check this new task out from ${req.user.company_name}. Press accept & go to activate the task. Good luck 🚀`,
        // is_admin:true
        notification_type: "media_house_tasks",
        // title: "New task from PRESSHOP", //`${mediaHouse.admin_detail.full_name}`,
        // description: `Broadcasted a new task from £${prices[0].min_price}-£${prices[0].max_price} Go ahead, and accept the task`,
        profile_img: `${req.user.role == "User_mediaHouse" ? subuser.media_house_id.profile_image : mediaHouse.admin_detail.admin_profile}`,
        distance: user.distance.toString(),
        deadline_date: TaskCreated.deadline_date.toString(),
        lat: TaskCreated.address_location.coordinates[1].toString(),
        long: TaskCreated.address_location.coordinates[0].toString(),
        min_price: prices[0].min_price.toString(),
        max_price: prices[0].max_price.toString(),
        task_description: TaskCreated.task_description,
        broadCast_id: TaskCreated._id.toString(),
        push: true,
        // dataforUser:notifcationObj
      };

      await _sendPushNotification(notiObj);
      // 
    }

    const notiObj = {
      sender_id: req.user._id,
      receiver_id: req.user._id,
      title: "New task posted",
      body: `👋🏼 Hey team, thank you for posting the task. You can keep a track of your live tasks from the Tasks section on the platform. If you need any assistance with your task, please call, email or use the instant chat module to speak with our helpful team 🤩`,
      // is_admin:true
    };

    await _sendPushNotification(notiObj);
    const allAdminList = await Employee.findOne({ role: "admin" });
    const notiObj2 = {
      sender_id: req.user._id,
      receiver_id: allAdminList._id,
      title: "New task posted",
      body: `New task posted - The Daily Mail ${req.user.first_name} has posted a new task (Pic £${data.need_photos == true ? formatAmountInMillion(data.photo_price) : 0}/ Interview £${data.need_interview == true ? formatAmountInMillion(data.interview_price) : 0}/ Video £${data.need_videos == true ? formatAmountInMillion(data.videos_price) : 0}) `,
      // is_admin:true
    };

    await _sendPushNotification(notiObj2);
    res.json({
      code: 200,
      task: TaskCreated,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.liveExpiredTasks = async (req, res) => {
  try {
    const data = req.query;
    let condition = { mediahouse_id: req.user._id };
    let count, tasks;

    if (data.miles && data.status == "live") {
      condition.deadline_date = { $gte: new Date() };
      tasks = await BroadCastTask.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(data.latitude), Number(data.longitude)],
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: parseInt(data.miles) * 1000,
          },
        },
        {
          $match: condition,
        },

        {
          $lookup: {
            from: "users",
            let: { hopper_id: "$hopper_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
            ],
            as: "hopper_details",
          },
        },
        {
          $lookup: {
            from: "contents",
            let: { id: "$content_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$id"] }],
                  },
                },
              },
              {
                $lookup: {
                  from: "categories",
                  let: { category_id: "$category_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$category_id"] },
                      },
                    },
                  ],
                  as: "category_ids",
                },
              },
            ],
            as: "content_ids",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category_details",
          },
        },
      ]);
    } else if (data.miles && data.status == "expired" && !data.id) {
    } else if (data.status == "live") {
      condition.deadline_date = { $gte: new Date() };
      if (data.id) {
        tasks = await db.getItem(data.id, BroadCastTask);
      } else {
        tasks = await db.getItems(BroadCastTask, condition);
        count = tasks.length;
      }
    } else if (data.status == "expired") {
      condition.deadline_date = { $lte: new Date() };
      if (data.id) {
        tasks = await db.getItem(data.id, BroadCastTask);
      } else {
        tasks = await db.getItems(BroadCastTask, condition);
        count = tasks.length;
      }
    } else {
      tasks = await db.getItems(BroadCastTask, condition);
      count = tasks.length;
    }
    res.json({
      code: 200,
      tasks,
      count,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getBroadCastTasks = async (req, res) => {
  try {
    const data = req.query;
    let task;

    const condition = {
      mediahouse_id: req.user._id,
    };
    if (data.task_id) {
      condition._id = data.task_id;
      task = await db.getItem(condition, BroadCastTask);
    } else {
      task = await db.getItems(BroadCastTask, condition);
    }
    res.status(200).json({
      code: 200,
      task,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.publishedContent = async (req, res) => {
  try {
    const data = req.query;
    let content, exclusiveContent;
    let condition = {
      is_deleted: false,
      sale_status: "sold",
      paid_status: "paid",
    };
    let val = "monthly";




    if (data.type && data.is_sold == "false") {
      let sortBy = {
        createdAt: -1,
      };
      if (data.content == "latest") {
        sortBy = {
          createdAt: -1,
        };
      }
      //ask_price
      if (data.content == "lowPrice") {
        sortBy = {
          ask_price: 1,
        };
      }
      if (data.content == "highPrice") {
        sortBy = {
          ask_price: -1,
        };
      }

      condition = {
        is_deleted: false,
        // sale_status: "sold",
        // paid_status: "paid",
        status: "published",
      };

      if (data.maxPrice && data.minPrice) {
        condition = {
          is_deleted: false,
          sale_status: "sold",
          paid_status: "paid",
          status: "published",
          ask_price: {
            $lte: data.maxPrice,
            $gte: data.minPrice,
          },
        };
      }
      if (data.type) {
        condition = {
          is_deleted: false,
          // sale_status: "sold",
          // paid_status: "paid",
          status: "published",
          type: data.type,
        };
      }

      condition.type = data.type;
      content = await Contents.find(condition).populate("category_id tag_ids").populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 });

      const list = content.map((x) => x._id);
      exclusiveContent = await Chat.find({
        paid_status: false,
        message_type: "accept_mediaHouse_offer",
        receiver_id: req.user._id,
        image_id: { $in: list }
      });
    } else if (data.is_sold == "true" || data.is_sold == true) {
      condition = {
        is_deleted: false,
        status: "published",
        $and: [
          { purchased_mediahouse: { $in: [mongoose.Types.ObjectId(req.user._id)] } },
          // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
          { purchased_mediahouse: { $exists: true } },
          // { purchased_mediahouse: { $size: 0 } }
        ]
      };

      let secoundry_condition = {
        // favourite_status:false
      }
      if (data.soldtype == "exclusive") {
        // condition = {
        //   is_deleted: false,
        //   status: "published",
        //   $and: [
        //     { purchased_mediahouse: { $in: [mongoose.Types.ObjectId(req.user._id)] } },
        //     // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
        //     { purchased_mediahouse: { $exists: true } },
        //     // { purchased_mediahouse: { $size: 0 } }
        //   ],
        //   // "Vat": {
        //   //   $elemMatch: {
        //   //     purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString(),
        //   //     purchased_content_type: "exclusive"
        //   //   }
        //   // }
        // };
        // condition.IsExclusive = true

        secoundry_condition["Vat"] = {
          $elemMatch: {
            purchased_content_type: "exclusive",
            purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
          }
        };
      }
      if (data.soldtype == "shared") {

        secoundry_condition["Vat"] = {
          $elemMatch: {
            purchased_content_type: "shared",
            purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
          }
        };

        // condition = {
        //   is_deleted: false,
        //   status: "published",
        //   "Vat": {
        //     $elemMatch: {
        //       purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString(),
        //       purchased_content_type: "shared"
        //     }
        //   }
        // };
      }


      if (data.favContent == "false") {
        secoundry_condition.favourite_status = "false"
      } else if (data.favContent == "true" || data.favContent == true) {
        secoundry_condition.favourite_status = "true"
      }


      if (data.type) {
        data.type = data.type.split(",")
        secoundry_condition.payment_content_type = { $in: data.type }
      }


      if (data.category) {
        data.category = data.category.split(",")
        data.category = data.category.map((x) => mongoose.Types.ObjectId(x))
        secoundry_condition.category = { $in: data.category }
      }
      let conditionforsort = { createdAt: -1 }

      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }

      const start = new Date(moment().utc().startOf(val).format());
      const end = new Date(moment().utc().endOf(val).format());


      // if (data.hasOwnProperty("weekly")) {
      //   secoundry_condition["Vat.purchased_time"] = {
      //     $gte: start,
      //     $lte: end
      //   };
      // }

      if (data.hasOwnProperty("weekly")) {
        secoundry_condition["Vat"] = {
          $elemMatch: {
            purchased_time: {
              $gte: start,
              $lte: end
            },
            purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
          }
        };
      }

      if (data.hasOwnProperty("monthly")) {
        secoundry_condition["Vat"] = {
          $elemMatch: {
            purchased_time: {
              $gte: start,
              $lte: end
            },
            purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
          }
        };
      }

      if (data.hasOwnProperty("daily")) {
        secoundry_condition["Vat"] = {
          $elemMatch: {
            purchased_time: {
              $gte: start,
              $lte: end
            },
            purchased_mediahouse_id: req.user._id.toString()// Assuming req.mediahouse_id contains the mediahouse_id to match
          }
        };
      }

      if (data.hasOwnProperty("yearly")) {
        secoundry_condition["Vat"] = {
          $elemMatch: {
            purchased_time: {
              $gte: start,
              $lte: end
            },
            purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
          }
        };
      }

      if (data.start && data.end) {
        const start = new Date(moment(data.start).utc().startOf("day").format());
        const end = new Date(moment(data.end).utc().endOf("day").format());
        secoundry_condition["Vat"] = {
          $elemMatch: {
            purchased_time: {
              $gte: start,
              $lte: end
            },
            purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
          }
        };
      }


      const pipeline = [
        { $match: condition }, // Match documents based on the given condition
        {
          $lookup: {
            from: "categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category_id"
          }
        },
        {
          $unwind: { path: "$category_id", }
        },


        {
          $lookup: {
            from: "users",
            localField: "hopper_id",
            foreignField: "_id",
            as: "hopper_id",
            pipeline: [
              {
                $lookup: {
                  from: "avatars",
                  localField: "avatar_id",
                  foreignField: "_id",
                  as: "avatar_id"
                }
              },
              {
                $unwind: { path: "$avatar_id", }
              },
            ]
          }
        },
        // {
        //   $lookup: {
        //     from: "avatars",
        //     localField: "hopper_id.avatar_id",
        //     foreignField: "_id",
        //     as: "hopper_id.avatar_id"
        //   }
        // },

        {
          $unwind: { path: "$hopper_id", }
        },

        {
          $unwind: { path: "$hopper_id.avatar_id", }
        },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "hopper_id",
        //     foreignField: "_id",
        //     as: "hopper_id",
        //     pipeline: [
        //       {
        //         $lookup: {
        //           from: "avatars",
        //           localField: "avatar_id",
        //           foreignField: "_id",
        //           as: "avatar_id"
        //         }
        //       },
        //       {
        //         $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
        //       },
        //     ]
        //   }
        // },
        // {
        //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
        // },

        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$content_id", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "favorate_content",
          },
        },


        {
          $addFields: {
            favourite_status: {
              $cond: {
                if: { $ne: [{ $size: "$favorate_content" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },

        // {
        //   $lookup: {
        //     from: "hopperpayments",
        //     localField: "_id",
        //     foreignField: "content_id",
        //     as: "vat_data"
        //   }
        // },
        // {
        //   $unwind: { path: "$vat_data" }
        // },
        {
          $addFields: {
            // payment_content_type: "$vat_data.payment_content_type",
            category: "$category_id._id",


          }

        },

        {
          $match: secoundry_condition
        },
        {
          $sort: conditionforsort // Sort documents based on the specified criteria
        },
        // {
        //   $group: {
        //     _id: "$_id", // You can use a unique identifier field here
        //     // Add other fields you want to preserve
        //     firstDocument: { $first: "$$ROOT" },
        //   },
        // },
        // {
        //   $replaceRoot: { newRoot: "$firstDocument" },
        // },
        {
          $limit: data.limit ? parseInt(data.limit) : 4
        },
        {
          $skip: data.offset ? parseInt(data.offset) : 0
        },
        // {
        //   $sort: sortBy // Sort documents based on the specified criteria
        // },
      ];

      content = await Contents.aggregate(pipeline);
      const list = content.map((x) => x._id);
      exclusiveContent = await Chat.find({
        paid_status: false,
        message_type: "accept_mediaHouse_offer",
        receiver_id: req.user._id,
        image_id: { $in: list }
      });
    } else if (data.is_sold == "false" || data.is_sold == false) {

      const d = new Date()
      const val = d.setDate(d.getDate() - 30)

      let condition = {
        // sale_status:
        status: "published",
        is_deleted: false,
        published_time_date: {
          $gte: new Date(val),
          $lte: new Date()
        },
        $or: [
          { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
          // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
          { purchased_mediahouse: { $exists: false } },
          { purchased_mediahouse: { $size: 0 } }
        ],
        is_hide: false,
        type: data.soldtype,
        offered_mediahouses: { $nin: [mongoose.Types.ObjectId(req.user._id)] }
      };



      content = await Contents.find(condition).populate("category_id tag_ids").populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 });
      const list = content.map((x) => x._id);
      exclusiveContent = await Chat.find({
        paid_status: false,
        message_type: "accept_mediaHouse_offer",
        receiver_id: req.user._id,
        image_id: { $in: list }
      });
    }
    else if (data.id) {
      condition._id = data.id;
      content = await Contents.findOne(condition).populate(
        "category_id tag_ids"
      );
      const list = content.map((x) => x._id);
      exclusiveContent = await Chat.find({
        paid_status: false,
        message_type: "accept_mediaHouse_offer",
        receiver_id: req.user._id,
        image_id: { $in: list }
      });
    } else {
      content = await Contents.find(condition).populate("category_id tag_ids").populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 });
      // const list = content.map((x) => x._id);
      //  exclusiveContent = await Chat.find({
      //   paid_status: false,
      //   message_type: "accept_mediaHouse_offer",
      //   receiver_id: req.user._id,
      //   image_id:{ $in: list }
      // });
    }


    res.status(200).json({
      code: 200,
      content,
      chatdata: exclusiveContent
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.addToFavourites = async (req, res) => {
  try {
    let status;
    let response;
    const data = req.body;
    data.user_id = req.user._id;

    if (data.content_id) {
      response = await Favourite.findOneAndDelete({ content_id: mongoose.Types.ObjectId(data.content_id), user_id: data.user_id })
      status = `removed from favourites..`;

      if (response == null) {
        response = await db.createItem(data, Favourite);
        status = `added to favourites..`;
      }


    } else if (data.uploaded_content) {
      response = await Favourite.findOneAndDelete({ uploaded_content: mongoose.Types.ObjectId(data.uploaded_content), user_id: data.user_id })
      status = `removed from favourites..`;

      if (response == null) {
        response = await db.createItem(data, Favourite);
        status = `added to favourites..`;
      }

    }




    // if (data.favourite_status == "true") {
    //   // await db.updateItem(data.content_id, Contents, {
    //   //   favourite_status: data.favourite_status,
    //   // });
    //   response = await db.createItem(data, Favourite);
    //   status = `added to favourites..`;
    // } else if (data.favourite_status == "false") {
    //   // await db.updateItem(data.content_id, Contents, {
    //   //   favourite_status: data.favourite_status,
    //   // });
    //   await Favourite.deleteOne({ content_id: data.content_id });
    //   status = `removed from favourites..`;
    // }
    res.status(200).json({
      code: 200,
      status,
      response,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.favouritesListing = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = mongoose.Types.ObjectId(req.user._id)
    let response;
    if (data.id) {
      response = await db.favourites(Favourite, data);
    } else {
      response = await db.favourites(Favourite, data);
    }
    res.status(200).json({
      code: 200,
      response,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
const findUserById = async (_id) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        _id,
      },
      (err, item) => {
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    ).populate("designation_id")
  });
};
exports.getProfile = async (req, res) => {
  try {
    const response = await User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) }).populate("media_house_id user_id office_id user_type_id").lean();//await findUserById(req.user._id).populate("media_house_id")
    const notificationPromises = [];
    const findnotification = await notification.findOne({
      type: "MediahouseDocUploaded",
      receiver_id: mongoose.Types.ObjectId(req.user._id.toString()),
    });
    if (!findnotification && response.role == "MediaHouse") {
      const notificationObjUser = {
        sender_id: req.user._id.toString(),
        receiver_id: req.user._id.toString(),
        type: "MediahouseDocUploaded",
        title: "Documents successfully uploaded",
        body: `👋🏼 Hi ${req.user.company_name}, thank you for updating your documents 👍🏼 Team PRESSHOP🐰`,
      };
      await Promise.all([_sendPushNotification(notificationObjUser)]);
    } else {

    }

    return res.status(200).json({
      code: 200,
      profile: response,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const data = req.body;

    const id = req.user._id;
    let status
    if (req.user.role == "User_mediaHouse") {
      status = await db.updateItem(id, User, data);
    } else {

      status = await db.updateItem(id, MediaHouse, data);
    }
    const notiObj = {
      sender_id: id,
      receiver_id: id,
      title: "Your profile is updated",
      body: `👋🏼 Hi ${req.user.first_name}, your updated profile is looking fab🤩 Cheers - Team PRESSHOP 🐰`,
      // is_admin:true
    };

    await _sendPushNotification(notiObj);
    res.status(200).json({
      code: 200,
      status,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getGenralMgmt = async (req, res) => {
  try {
    const data = req.query;
    let status;
    if (data.faq == "faq") {
      let condition = {
        for: "marketplace", is_deleted: false
      }
      if (data.search) {
        const like = { $regex: data.search, $options: "i" };
        // const like = new RegExp(data.search, 'i') 

        condition.$or = [
          {
            ques: like
          },
          {
            ans: like
          },
        ];
        // condition.ques = like;
        // condition.ans = like;
      }
      status = await Faq.find(condition).sort({ createdAt: -1 });
    } else if (data.privacy_policy == "privacy_policy") {
      status = await Privacy_policy.findOne({
        _id: "6451fdba1cf5bd37568f92d7",
      });
    } else if (data.legal == "legal") {
      status = await Legal_terms.findOne({ _id: "6451fe39826b6b396ab2f5fb" });
    } else if (data.videos == "videos") {
      status = await Tutorial_video.find({ for: "marketplace", is_deleted: false }).sort({ createdAt: -1 });
    } else if (data.doc == "doc") {
      status = await Docs.findOne({ _id: "644fa4a4c19f6460bd384eb7" });
    }

    res.status(200).json({
      code: 200,
      status,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.taskCount = async (req, res) => {
  try {
    const data = req.query

    const obj = {
      limit: data.limit,
      offset: data.offset
    }
    // new Date(TODAY_DATE.startOf("day").format())
    const yesterdayStart = new Date(moment().utc().startOf("day").format());
    const yesterdayEnd = new Date(moment().utc().endOf("day").format());
    const today = new Date(
      moment().utc().subtract(1, "day").startOf("day").format()
    );
    const todayend = new Date(
      moment().utc().subtract(1, "day").endOf("day").format()
    );

    // foe week ------------------------------------------------

    const weeks = new Date(moment().utc().startOf("week").format());
    const weeke = new Date(moment().utc().endOf("week").format());
    const prevw = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const prevwe = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );

    // month======================================================
    const month = new Date(moment().utc().startOf("month").format());
    const monthe = new Date(moment().utc().endOf("month").format());
    const prevm = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );
    const prevme = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );

    let yesterday = {
      paid_status: true,
      updatedAt: {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      },
    };
    const coinditionforlive = {
      // type: req.query.type,
      mediahouse_id: req.user._id,
      deadline_date: {
        // $gte: yesterdayStarts,
        $gte: new Date(),
      },
    };
    // if (data.type == "Broadcasted") {
    let val = "monthly";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year"
    }

    const Brocastcond = new Date(moment().utc().startOf(val).format());
    const BrocastcondEnd = new Date(moment().utc().endOf(val).format());
    coinditionforlive.deadline_date = { $lte: BrocastcondEnd, $gte: Brocastcond }
    // }
    let live = {
      deadline_date: { $gte: new Date() },
      mediahouse_id: req.user._id
    };
    let plive = {
      deadline_date: { $lte: todayend, $gte: today },
      mediahouse_id: req.user._id
    };

    const sort = {
      createdAt: -1,
    };

    const live_task = await db.getItemswithsort(BroadCastTask, live, sort, obj);
    const live_task_count = await BroadCastTask.countDocuments(live)
    // const live_task_count = live_task.length;

    // const plive_task = await db.getItemswithsort(BroadCastTask, plive, sort);
    // const plive_task_count = plive_task.length;
    const plive_task_count = await BroadCastTask.countDocuments(plive)

    let percentage5, type5;
    if (live_task_count > plive_task_count) {
      (percentage5 = (plive_task_count / live_task_count) * 100),
        (type5 = "increase");
    } else {
      (percentage5 = (live_task_count / plive_task_count) * 100),
        (type5 = "decrease");
    }

    // todat fund inv. ==================================
    const today_fund_investeds = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { type: "task_content" },
            { media_house_id: mongoose.Types.ObjectId(req.user._id) },
            { updatedAt: { $gte: yesterdayStart } },
            { updatedAt: { $lt: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
        },
      },
      {
        $sort: sort,
      },
    ]);

    const hopperUsedTasks = await Uploadcontent.find(yesterday)
      .populate("hopper_id task_id  purchased_publication")
      .populate({ path: "hopper_id", populate: "avatar_id" })
      .populate({ path: "task_id", populate: "category_id" })
      .sort(sort);
    const hopperUsed_task_count = hopperUsedTasks.length;
    let todays = {
      paid_status: true,
      updatedAt: {
        $lte: weeke,
        $gte: weeks,
      },
    };

    let yesterdays = {
      paid_status: true,
      updatedAt: {
        $lte: prevwe,
        $gte: prevw,
      },
    };

    const hopperUsedTaskss = await db.getItemswithsort(
      Uploadcontent,
      yesterdays,
      sort,
      obj
    );
    const hopperUsed_task_counts = hopperUsedTaskss.length;

    const today_invested = await db.getItemswithsort(
      Uploadcontent,
      todays,
      sort,
      obj
    );
    const today_investedcount = today_invested.length;

    let percentage, type;
    if (today_investedcount > hopperUsed_task_count) {
      (percentage = hopperUsed_task_count / today_investedcount),
        (type = "increase");
    } else if (hopperUsed_task_count == today_investedcount) {
      (percentage = 0), (type = "neutral");
    } else {
      (percentage = today_investedcount / hopperUsed_task_count),
        (type = "decrease");
    }

    var arr;
    if (hopperUsedTasks.length < 1) {
      arr = 0;
    } else {
      arr = hopperUsedTasks
        .map((element) => element.amount_paid)
        .reduce((a, b) => a + b, 0);
    }


    const coinditionforTotalFundInvested = {
      $and: [
        { type: "task_content" },
        { media_house_id: mongoose.Types.ObjectId(req.user._id) },

      ],
    }

    // if (data.type == "Broadcasted") {
    // let val = "monthly";

    // if (data.hasOwnProperty("weekly")) {
    //   val = "week";
    // }

    // if (data.hasOwnProperty("monthly")) {
    //   val = "month";
    // }

    // if (data.hasOwnProperty("daily")) {
    //   val = "day";
    // }

    // if (data.hasOwnProperty("yearly")) {
    //   val = "year"
    // }

    const coinditionforTotalFundInvestedstart = new Date(moment().utc().startOf(val).format());
    const coinditionforTotalFundInvestedend = new Date(moment().utc().endOf(val).format());
    // coinditionforTotalFundInvested.createdAt = { $lte: BrocastcondEnd, $gte: Brocastcond }
    let conditionforsort = {};

    // conditionforsort = {
    //   // user_id:mongoose.Types.ObjectId(req.user._id),
    //   createdAt: {
    //     $lte: BrocastcondEnd,
    //     $gte: Brocastcond,
    //   },
    // };


    if (data.type == "daily") {
      conditionforsort = {
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    }

    if (data.type == "weekly") {
      conditionforsort = {
        createdAt: {
          $gte: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          $lte: yesterdayEnd,
        },
      };
    }

    if (data.type == "monthly") {
      conditionforsort = {
        createdAt: {
          $gte: moment().subtract(1, 'months').format('YYYY-MM-DD'),
          $lte: yesterdayEnd,
        },
      };
    }

    if (data.type == "yearly") {
      conditionforsort = {
        createdAt: {
          $gte: moment().subtract(1, 'years').format('YYYY-MM-DD'),
          $lte: yesterdayEnd,
        },
      };
    }

    // if (req.query.sourcetype == "weekly") {
    // } else if (req.query.sourcetype == "daily") {
    //   conditionforsort = {
    //     // user_id:mongoose.Types.ObjectId(req.user._id),
    //     updatedAt: {
    //       $lte: yesterdayEnd,
    //       $gte: yesterdayStart,
    //     },
    //   };
    // } else if (req.query.sourcetype == "yearly") {
    //   conditionforsort = {
    //     // user_id:mongoose.Types.ObjectId(req.user._id),
    //     updatedAt: {
    //       $lte: yearend,
    //       $gte: year,
    //     },
    //   };
    // } else if (req.query.sourcetype == "monthly") {
    //   conditionforsort = {
    //     updatedAt: {
    //       $lte: yesterdayEnd,
    //       $gte: yesterdayStart,
    //     },
    //   };
    // }
    const total = await HopperPayment.aggregate([
      {
        $match: conditionforsort
      },
      {
        $match: {
          media_house_id: mongoose.Types.ObjectId(req.user._id),
          type: "task_content",
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "puschases",
        },
      },

      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
        },
      },
      { $sort: sort },
    ]);

    const today_fund_invested = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { type: "task_content" },
            { media_house_id: mongoose.Types.ObjectId(req.user._id) },
            { updatedAt: { $gte: month } },
            { updatedAt: { $lt: monthe } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
        },
      },
      { $sort: sort },
    ]);
    const todaytotalinv = await Contents.aggregate([
      {
        $match: {
          $and: [
            { updatedAt: { $gte: month } },
            { updatedAt: { $lt: monthe } },
          ],
        },
      },
      {
        $group: {
          _id: "$purchased_publication",
          totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },

      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      {
        $sort: sort,
      },
    ]);

    const prevtotalinv = await Contents.aggregate([
      {
        $match: {
          $and: [
            { updatedAt: { $gte: prevm } },
            { updatedAt: { $lt: prevme } },
          ],
        },
      },
      {
        $group: {
          _id: "$purchased_publication",
          totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      {
        $sort: sort,
      },
    ]);

    const totaltoda = todaytotalinv.length;
    const prevtotalinvt = prevtotalinv.length;
    let percentage2, type2;
    if (totaltoda > prevtotalinvt) {
      (percentage2 = prevtotalinvt / totaltoda), (type2 = "increase");
    } else {
      (percentage2 = totaltoda / prevtotalinvt), (type2 = "decrease");
    }

    const todayhoppers = await Uploadcontent.aggregate([
      {
        $group: {
          _id: "$hopper_id",
        },
      },

      {
        $match: {
          $and: [{ updatedAt: { $gte: weeks } }, { updatedAt: { $lt: weeke } }],
        },
      },
      { $sort: sort },
    ]);

    const prevweekhoppers = await Uploadcontent.aggregate([
      {
        $group: {
          _id: "$hopper_id",
        },
      },

      {
        $match: {
          $and: [
            { updatedAt: { $gte: prevw } },
            { updatedAt: { $lt: prevwe } },
          ],
        },
      },
      { $sort: sort },
    ]);

    let percentage1, type1;
    if (todayhoppers.length > prevweekhoppers.length) {
      (percentage1 = prevweekhoppers / todayhoppers), (type1 = "increase");
    } else {
      (percentage1 = todayhoppers / prevweekhoppers), (type1 = "decrease");
    }

    const users = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "testdata",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }],
                },
              }
            }
          ]
        },
      },
      {
        $match: {
          testdata: { $ne: [] } // Filter out documents with empty testdata array
        }
      },
      {
        $addFields: {
          taskIds: {
            $map: {
              input: "$testdata",
              as: "task",
              in: "$$task._id"
            }
          }
        }
      },
      {
        $match: {
          $expr: {
            $in: ["$task_id", "$taskIds"] // Match task_id with the array of taskIds
          }
        }
      },
      {
        $sort: sort,
      },
      {
        $group: {
          _id: "$hopper_id",
          records: {
            $push: "$$ROOT",
          },
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "records.task_id",
          foreignField: "_id",
          as: "task_details",
        },
      },

      {
        $addFields: {
          task_is_fordetail: "$records.task_id",
          hopper_is_fordetail: "$records.hopper_id",
          hopper_id: "$_id",
        },
      },

      // {
      //   $lookup: {
      //     from: "tasks",
      //     let: {
      //       task_id: "$task_is_fordetail",
      //       new_id: "$hopper_is_fordetail",
      //       hopper_id:"$hopper_id"
      //     },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $in: ["$_id", "$$task_id"] },
      //               { $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }
      //             ],
      //           },
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "users",
      //           let: { hopper_id: "$new_id" },
      //           pipeline: [
      //             {
      //               $match: {
      //                 $expr: {
      //                   $and: [{ $in: ["$_id", "$$new_id"] }],
      //                 },
      //               },
      //             },
      //             {
      //               $addFields: {
      //                 console: "$$new_id",
      //               },
      //             },
      //             {
      //               $lookup: {
      //                 from: "avatars",
      //                 localField: "avatar_id",
      //                 foreignField: "_id",
      //                 as: "avatar_details",
      //               },
      //             },
      //           ],
      //           as: "hopper_details",
      //         },
      //       },
      //     ],
      //     as: "task_details",
      //   },
      // },

      {
        $unwind: "$task_details",
      },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$new_id", new_id: "$hopper_id", },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$new_id"] }],
                },
              },
            },
            // {
            //   $addFields: {
            //     console: "$$new_id",
            //   },
            // },
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_details",
              },
            },
          ],
          as: "task_details.hopper_details",
        },
      },
      // {
      //   $addFields:{
      //     content:"$task_details.content"
      //   }
      // },
      {
        $group: {
          _id: "$_id", // You can use a unique identifier field here
          // Add other fields you want to preserve
          firstDocument: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$firstDocument" },
      },

    ]);
    const coinditionforsourcefromtask = {}

    // if (data.type == "Broadcasted") {


    const contentsourcedfromtaskstart = new Date(moment().utc().startOf(val).format());
    const contentsourcedfromtaskEnd = new Date(moment().utc().endOf(val).format());
    coinditionforsourcefromtask.createdAt = { $lte: contentsourcedfromtaskEnd, $gte: contentsourcedfromtaskstart }
    // }
    // const contentsourcedfromtask = await Uploadcontent.aggregate([
    //   { $match: coinditionforsourcefromtask },

    //   {
    //     $lookup: {
    //       from: "tasks",
    //       let: { hopper_id: "$task_id" },

    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [{ $eq: ["$_id", "$$hopper_id"] }],
    //             },
    //           },
    //         },

    //         {
    //           $lookup: {
    //             from: "categories",
    //             localField: "category_id",
    //             foreignField: "_id",
    //             as: "category_id",
    //           },
    //         },

    //         { $unwind: "$category_id" },
    //       ],
    //       as: "task_id",
    //     },
    //   },

    //   { $unwind: "$task_id" },

    //   {
    //     $match: {
    //       "task_id.mediahouse_id": req.user._id,
    //       paid_status: true,
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "purchased_publication",
    //       foreignField: "_id",
    //       as: "purchased_publication_details",
    //     },
    //   },
    //   { $unwind: "$purchased_publication_details" },
    //   {
    //     $lookup: {
    //       from: "users",
    //       let: { hopper_id: "$hopper_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [{ $eq: ["$_id", "$$hopper_id"] }],
    //             },
    //           },
    //         },

    //         {
    //           $lookup: {
    //             from: "avatars",
    //             localField: "avatar_id",
    //             foreignField: "_id",
    //             as: "avatar_details",
    //           },
    //         },
    //       ],
    //       as: "hopper_details",
    //     },
    //   },
    //   { $unwind: "$hopper_details" },
    //   {
    //     $sort: sort,
    //   },
    // ]);
    const contentsourcedfromtask = await Uploadcontent.aggregate([
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
          let: { hopper_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_id",
              },
            },

            { $unwind: "$category_id" },

            // {
            //   $addFields:{
            //     console:"$$task_id"
            //   }
            // }
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          "task_id.mediahouse_id": req.user._id,
          paid_status: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "purchased_publication_details",
        },
      },
      { $unwind: "$purchased_publication_details" },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
              $unwind: "$avatar_details",
            },
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $match: conditionforsort,
      },
      // {
      //   $sort: sort1,
      // },
      // {
      //   $lookup:{
      //     from:"tasks",
      //     let :{
      //       _id: "$task_id",
      //     },
      //     pipeline:[
      //       {
      //         $match: { $expr: [{
      //           $and: [{
      //             $eq:["_id" , "$$_id"],
      //         }]
      //         }] },
      //       },
      //       {
      //         $lookup:{
      //           from:"Category",
      //           localField:"category_id",
      //           foreignField:"_id",
      //           as:"category_ids"
      //         }
      //       }
      //     ],
      //     as:"category"
      //   }
      // }
    ]);



    const contentsourcedfromtaskprevweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: prevw } },
            { updatedAt: { $lt: prevwe } },
          ],
        },
      },
      { $sort: sort },
    ]);

    const contentsourcedfromtaskthisweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: weeks } },
            { updatedAt: { $lt: weeke } },
          ],
        },
      },
      {
        $sort: sort,
      },
    ]);

    let percentage6, type6;
    if (
      contentsourcedfromtaskthisweekend.length >
      contentsourcedfromtaskprevweekend.length
    ) {
      (percentage6 =
        contentsourcedfromtaskprevweekend / contentsourcedfromtaskthisweekend),
        (type6 = "increase");
    } else {
      (percentage6 =
        contentsourcedfromtaskthisweekend / contentsourcedfromtaskprevweekend),
        (type6 = "decrease");
    }

    const yesterdayEnds = new Date();
    let last_month = {
      deadline_date: {
        $lte: yesterdayEnds,
      },
    };

    let thismonth = {
      deadline_date: {
        $gte: month,
        $lte: monthe,
      },
    };

    let prev_month = {
      deadline_date: {
        $gte: prevm,
        $lte: prevme,
      },
    };

    const last_monthcc = {
      // type: req.query.type,
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      deadline_date: {
        // $gte: yesterdayStarts,
        $lte: new Date(),
      },
    };
    const BroadCastedTasks = await db.getItemswithsort(
      BroadCastTask,
      last_monthcc,
      sort,
      obj
    );
    const broadcasted_task_count = BroadCastedTasks.length;
    const BroadCastedTasks_this_month = await db.getItemswithsort(
      BroadCastTask,
      thismonth,
      sort,
      obj
    );
    const broadcasted_task_counts_a = BroadCastedTasks_this_month.length;
    const BroadCastedTasksss = await db.getItemswithsort(
      BroadCastTask,
      prev_month,
      sort,
      obj
    );
    const broadcasted_task_count_prev_month = BroadCastedTasksss.length;

    let percentage3, type3;
    if (broadcasted_task_counts_a > broadcasted_task_count_prev_month) {
      (percentage3 =
        broadcasted_task_count_prev_month / broadcasted_task_counts_a),
        (type3 = "increase");
    } else {
      (percentage3 =
        broadcasted_task_counts_a / broadcasted_task_count_prev_month),
        (type3 = "decrease");
    }

    const resp = await Contents.find({
      content_under_offer: true,
      sale_status: "unsold",
    }).sort(sort);
    //=========================================deadline_met===========================================//
    const currentWeekStart = new Date(moment().utc().startOf("week").format());
    const currentWeekEnd = new Date(moment().utc().endOf("week").format());
    const previousWeekStart = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const previousWeekEnd = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );
    const currentWeakCondition = {
      mediahouse_id: req.user._id,
      createdAt: {
        $lte: currentWeekEnd,
        $gte: currentWeekStart,
      },
    };
    const previousWeakCondition = {
      mediahouse_id: req.user._id,
      createdAt: {
        $lte: previousWeekEnd,
        $gte: previousWeekStart,
      },
    };
    const currentWeekTaskDetails = await BroadCastTask.aggregate([
      {
        $match: currentWeakCondition,
      },
      {
        $group: {
          _id: null,
          totalAcceptedCount: {
            $sum: {
              $cond: [
                { $isArray: "$accepted_by" },
                { $size: "$accepted_by" },
                0,
              ],
            },
          },
          totalCompletedCount: {
            $sum: {
              $cond: [
                { $isArray: "$completed_by" },
                { $size: "$completed_by" },
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          totalAvg: {
            $cond: {
              if: { $eq: ["$totalAcceptedCount", 0] },
              then: 0, // or any other default value you prefer
              else: {
                $multiply: [
                  { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
                  100,
                ],
              },
            },
          },
        },
      },
      {
        $sort: sort,
      },
    ]);

    const previousWeekTaskDetails = await BroadCastTask.aggregate([
      {
        $match: previousWeakCondition,
      },
      {
        $group: {
          _id: null,
          totalAcceptedCount: {
            $sum: {
              $cond: [
                { $isArray: "$accepted_by" },
                { $size: "$accepted_by" },
                0,
              ],
            },
          },
          totalCompletedCount: {
            $sum: {
              $cond: [
                { $isArray: "$completed_by" },
                { $size: "$completed_by" },
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          totalAvg: {
            $cond: {
              if: { $eq: ["$totalAcceptedCount", 0] },
              then: 0, // or any other default value you prefer
              else: {
                $multiply: [
                  { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
                  100,
                ],
              },
            },
          },
        },
      },
      {
        $sort: sort,
      },
    ]);

    let deadlineDifference, differenceType;
    // if (currentWeekTaskDetails.length > 0 ? currentWeekTaskDetails[0].totalAvg : 0 > previousWeekTaskDetails[0].totalAvg
    // ) {
    //   deadlineDifference =
    //     currentWeekTaskDetails[0].totalAvg -
    //     previousWeekTaskDetails[0].totalAvg;
    //   differenceType = "increase";
    // } else {
    //   deadlineDifference =
    //     currentWeekTaskDetails.length > 0 ? currentWeekTaskDetails[0].totalAvg : 0 -
    //       previousWeekTaskDetails[0].totalAvg;
    //   differenceType = "decrease";
    // }

    const totalDeadlineDetails = await BroadCastTask.aggregate([
      {
        $match: {
          mediahouse_id: req.user._id,
        },
      },
      // {
      //   $group: {
      //     _id: null,
      //     totalAcceptedCount: {
      //       $sum: {
      //         $cond: [
      //           { $isArray: "$accepted_by" },
      //           { $size: "$accepted_by" },
      //           0,
      //         ],
      //       },
      //     },
      //     totalCompletedCount: {
      //       $sum: {
      //         $cond: [
      //           { $isArray: "$completed_by" },
      //           { $size: "$completed_by" },
      //           0,
      //         ],
      //       },
      //     },
      //   },
      // },
      {
        $group: {
          _id: null,
          totalAcceptedCount: {
            $sum: {
              $cond: [
                { $isArray: "$accepted_by" },
                { $size: "$accepted_by" },
                { $ifNull: ["$accepted_by", 0] } // Handle null values
              ]
            }
          },
          totalCompletedCount: {
            $sum: {
              $cond: [
                { $isArray: "$completed_by" },
                { $size: "$completed_by" },
                { $ifNull: ["$completed_by", 0] } // Handle null values
              ]
            }
          }
        }
      },
      {
        $addFields: {
          totalAvg: {
            $cond: {
              if: { $eq: ["$totalAcceptedCount", 0] },
              then: 0, // or any other default value you prefer
              else: {
                $multiply: [
                  { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
                  100,
                ],
              },
            },
          },
        },
      },
      // {
      //   $sort: sort,
      // },
    ]);
    const deadlinedetails = await BroadCastTask.aggregate([
      {
        $match: {
          mediahouse_id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "uploadcontents",
          let: { taskId: "$_id", deadline: "$deadline_date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$task_id", "$$taskId"] },
                    { $lte: ["$createdAt", "$$deadline"] },
                  ],
                },
              },
            },
          ],
          as: "content_details",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    //=========================================deadline_met===========================================//
    const userstest = await Uploadcontent.aggregate([
      // {
      //   $lookup: {
      //     from: "tasks",
      //     localField: "task_id",
      //     foreignField: "_id",
      //     as: "testdata",
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }],
      //           },
      //         }
      //       }
      //     ]
      //   },
      // },
      {
        $group: {
          _id: "$hopper_id",
          data: {
            $push: "$$ROOT",
          },
        },
      },

      {
        $unwind: "$data", // Unwind the data array
      },
      {
        $lookup: {
          from: "users",
          localField: "data.hopper_id",
          foreignField: "_id",
          as: "data.hopper_id", // Rename the result to "hopper_id" within the data object
        },
      },
      {
        $unwind: "$data.hopper_id", // Unwind the hopper_id array
      },
      {
        $lookup: {
          from: "avatars", // Replace "avatars" with the actual collection name where avatars are stored
          localField: "data.hopper_id.avatar_id",
          foreignField: "_id",
          as: "data.hopper_id.avatar_id", // Rename the result to "avatar_id" within the hopper_id object
        },
      },
      {
        $unwind: "$data.hopper_id.avatar_id", // Unwind the hopper_id array
      },

      {
        $lookup: {
          from: "categories", // Replace "avatars" with the actual collection name where avatars are stored
          localField: "data.category_id",
          foreignField: "_id",
          as: "data.category_id", // Rename the result to "avatar_id" within the hopper_id object
        },
      },
      {
        $unwind: "$data.category_id", // Unwind the hopper_id array
      },
      {
        $group: {
          _id: "$_id",
          data: { $push: "$data" }, // Reassemble the data array
        },
      },
      // {
      //   $lookup: {
      //     from: "tasks",
      //     localField: "records.task_id",
      //     foreignField: "_id",
      //     as: "task_details",
      //   },
      // },

      // {
      //   $addFields: {
      //     task_is_fordetail: "$records.task_id",
      //     hopper_is_fordetail: "$records.hopper_id",
      //   },
      // },

      // {
      //   $lookup: {
      //     from: "tasks",
      //     let: {
      //       hopper_id: "$task_is_fordetail",
      //       new_id: "$hopper_is_fordetail",
      //     },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $in: ["$_id", "$$hopper_id"] },
      //               { $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }
      //             ],
      //           },
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "users",
      //           let: { hopper_id: "$new_id" },
      //           pipeline: [
      //             {
      //               $match: {
      //                 $expr: {
      //                   $and: [{ $in: ["$_id", "$$new_id"] }],
      //                 },
      //               },
      //             },
      //             {
      //               $addFields: {
      //                 console: "$$new_id",
      //               },
      //             },
      //             {
      //               $lookup: {
      //                 from: "avatars",
      //                 localField: "avatar_id",
      //                 foreignField: "_id",
      //                 as: "avatar_details",
      //               },
      //             },
      //           ],
      //           as: "hopper_details",
      //         },
      //       },
      //     ],
      //     as: "task_details",
      //   },
      // },
      // {
      //   $unwind: "$task_details",
      // },
      // {
      //   $group: {
      //     _id: "$_id", // You can use a unique identifier field here
      //     // Add other fields you want to preserve
      //     firstDocument: { $first: "$$ROOT" },
      //   },
      // },
      // {
      //   $replaceRoot: { newRoot: "$firstDocument" },
      // },
      // {
      //   $sort: sort,
      // },
    ]);
    res.json({
      code: 200,
      live_tasks_details: {
        task: live_task,
        count: live_task_count,
        type: type5,
        percentage: percentage5 || 0,
      },

      broad_casted_tasks_details: {
        task: BroadCastedTasks,
        count: broadcasted_task_count,
        type: type3,
        percentage: percentage3 || 0,
      },

      sourced_content_from_tasks: {
        task: contentsourcedfromtask,
        count: contentsourcedfromtask.length,
        type: type6,
        percentage: percentage6 || 0,
      },

      hopper_used_for_tasks: {
        task: users,
        count: users.length,
        type: type1,
        percentage: percentage1 || 0,
        data: hopperUsedTaskss,
        data2: today_invested,
      },
      today_fund_invested: {
        task: hopperUsedTasks,
        count:
          today_fund_investeds.length < 1
            ? 0
            : today_fund_investeds[0].totalamountpaid,
        type: type,
        percentage: percentage || 0,
        resp: today_fund_invested[0],
      },
      total_fund_invested: {
        // task: total,
        count: total.length > 0 ? total[0].totalamountpaid : 0,
        data: contentsourcedfromtask,
        type: type2,
        percentage: percentage2 || 0,
      },
      content_under_offer: {
        task: resp,
        count: resp.length,
      },
      deadline_met: {
        task: totalDeadlineDetails.length > 0 ? totalDeadlineDetails[0].totalAvg : 0,
        type: differenceType,
        // percentage: deadlineDifference,
        data: deadlinedetails,
      },
      test: userstest
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.checkEmailAvailability = async (req, res) => {
  try {
    const doesEmailExists = await emailer.emailExists(req.body.email);
    // let user = await User.findOne({ email: req.body.email });
    // if (user) {
    //   return res.status(422).json({ errors: { msg: "EMAIL_ALREADY_EXISTS" },code:422 })
    // }
    res.status(201).json({ code: 200, status: doesEmailExists });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.addCotactUs = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    if (data.type == "register") {
      const Create_Office_Detail = await db.createItem(data, contact_us);
      return res.json({
        code: 200,
        response: Create_Office_Detail,
      });
    } else {
      // hello@presshop.co.uk
      data.email = "support@presshop.news"
      await emailer.sendEmail(locale, data);
      return res.json({
        code: 200,
        msg: "email sent",
      });
    }
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getuploadedContentbyHopper = async (req, res) => {
  try {
    const data = req.query
    const draftDetails = await Uploadcontent.find({
      hopper_id: mongoose.Types.ObjectId(data.hopper_id),
    }).populate("task_id").sort({ createdAt: -1 });
    res.json({
      code: 200,
      data: draftDetails,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getallcontentList = async (req, res) => {
  try {
    const data = req.params;

    const draftDetails = await Uploadcontent.find({
      hopper_id: mongoose.Types.ObjectId(req.user._id),
    }).sort({ createdAt: -1 });

    res.json({
      code: 200,
      data: draftDetails,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getallOfficeList = async (req, res) => {
  try {
    const data = req.params;

    const draftDetails = await OfficeDetails.find({}).sort({ createdAt: -1 });

    res.json({
      code: 200,
      data: draftDetails,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getalltypeOfdocList = async (req, res) => {
  try {
    const data = req.params;

    const draftDetails = await typeofDocs.find({ type: "marketplace", is_deleted: false }).sort({ createdAt: -1 });

    res.json({
      code: 200,
      data: draftDetails,
    });
  } catch (err) {
    utils.handleError(res, error);
  }
};

function generateRandomPassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

exports.ManageUser = async (req, res) => {
  try {
    const data = req.body;

    const passwordLength = 12;
    const randomPassword = generateRandomPassword(passwordLength);
    data.password = randomPassword;
    data.decoded_password = randomPassword
    data.role = 'Adduser'
    const locale = req.getLocale();
    // if (req.files) {
    //   if (req.files.profile_image) {
    //     var govt_id = await uploadFiletoAwsS3Bucket({
    //       fileData: req.files.profile_image,
    //       path: `public/mediahouseUser`,
    //     });
    //   }
    // }
    // data.profile_image = govt_id.fileName;

    // let media = await uploadFiletoAwsS3Bucket({
    //   fileData: req.files.media,
    //   path: `public/mediahouseUser`,
    // });

    // let mediaurl = `https://uat-presshope.s3.eu-west-2.amazonaws.com/public/${req.body.path}/${media.fileName}`;

    const Create_Office_Detail = await db.createItem(data, User);

    await emailer.sendEmailforreply(locale, data);
    res.json({
      code: 200,
      response: Create_Office_Detail,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getdesignatedUSer = async (req, res) => {
  try {
    const data = req.query;
    const condition = {}

    if (data.role) {
      condition.office_id = mongoose.Types.ObjectId(data.role);
      condition.is_deleted = false
    }
    // if (data.role) {
    //   const finddesignatedUser = await User.find({
    //     role: data.role,
    //     // is_deleted: false,
    //   }).sort({ createdAt: -1 });
    //   res.status(200).json({
    //     code: 200,
    //     response: finddesignatedUser,
    //   });
    // } else if (data.allow_to_chat_externally) {
    const finddesignatedUser = await User.find({
      // role: data.role,
      // allow_to_chat_externally: data.allow_to_chat_externally,
      // is_deleted: false,
      ...condition,
      role: "Adduser"
    }).sort({ createdAt: -1 });
    const finddesignatedUser2 = await User.find({
      // role: data.role,
      // allow_to_chat_externally: data.allow_to_chat_externally,
      // is_deleted: false,
      media_house_id: req.user._id,
      role: "User_mediaHouse"
    }).sort({ createdAt: -1 });

    const all = [...finddesignatedUser, ...finddesignatedUser2]
    res.status(200).json({
      code: 200,
      response: all,
    });
    // } else if (data.user_id) {
    //   const finddesignatedUser = await ManageUser.find({
    //     user_id: data.user_id,
    //     is_deleted: false,
    //   }).sort({ createdAt: -1 });
    //   res.status(200).json({
    //     code: 200,
    //     response: finddesignatedUser,
    //   });
    // } else {
    //   const finddesignatedUser = await ManageUser.find({
    //     is_deleted: false,
    //   }).sort({ createdAt: -1 });
    //   res.status(200).json({
    //     code: 200,
    //     response: finddesignatedUser,
    //   });
    // }
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.getMediahouseUser = async (req, res) => {
  try {
    const data = req.query;
    // const getOfficeDetails = await OfficeDetails.find({
    //   company_vat: req.user.company_vat,
    // })

    // const officeids = getOfficeDetails.map((x) => mongoose.Types.ObjectId(x._id))
    // const condition = { office_id: { $in: officeids } }
    // // if (data.role) {
    // //   condition.office_id = {$in:officeids}
    // //   // mongoose.Types.ObjectId(data.role);
    // //   condition.is_deleted = false
    // // }

    // const finddesignatedUser = await User.find({
    //   // role: data.role,
    //   // allow_to_chat_externally: data.allow_to_chat_externally,
    //   // is_deleted: false,
    //   ...condition,
    //   role: "Adduser"
    // }).sort({ createdAt: -1 });
    const finddesignatedUser2 = await User.find({
      // role: data.role,
      // allow_to_chat_externally: data.allow_to_chat_externally,
      // is_deleted: false,
      media_house_id: await getUserMediaHouseId(req.user._id),
      role: "User_mediaHouse",
      status: "approved"
    }).sort({ createdAt: -1 });

    // const user1 = finddesignatedUser2?.map((el) => {
    //   return {
    //     first_name: el?.user_first_name,
    //     last_name: el?.user_last_name,
    //     role: "User_mediaHouse",
    //     _id: el?._id,
    //   }
    // })


    // const user2 = finddesignatedUser?.map((el) => {
    //   return {
    //     first_name: el?.first_name,
    //     last_name: el?.last_name,
    //     role: "Adduser",
    //     _id: el?._id,
    //   }
    // })

    // const all = [...finddesignatedUser, ...finddesignatedUser2]
    // const all = [...user1, ...user2]
    res.status(200).json({
      code: 200,
      response: finddesignatedUser2,
    });

  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.deleteadduser = async (req, res) => {
  try {
    const data = req.body;
    const obj = {
      is_deleted: true,
      reason_for_delete: req.body.reason_for_removal,
    };

    const finddesignatedUser = await User.updateOne(
      { _id: req.body.user_id },
      obj
    );
    res.status(200).json({
      code: 200,
      response: finddesignatedUser,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getuploadedContentbyHoppers = async (req, res) => {
  try {
    const data = req.query;

    if (data.hopper_id) {
      const users = await Uploadcontent.aggregate([
        {
          $match: { hopper_id: mongoose.Types.ObjectId(req.query.hopper_id) },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "task_id",
            foreignField: "_id",
            as: "task_id",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }],
                  },
                }
              }
            ]
          },
        },

        { $unwind: "$task_id" },

        {
          $match: { "task_id.mediahouse_id": req.user._id },
        },

        {
          $lookup: {
            from: "categories",
            let: { task_id: "$task_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                  },
                },
              },
            ],
            as: "category_details",
          },
        },

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
          $lookup: {
            from: "avatars",
            let: { hopper_id: "$hopper_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                  },
                },
              },
            ],
            as: "avatar_detals",
          },
        },
        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$uploaded_content", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "favorate_content",
          },
        },


        {
          $addFields: {
            favourite_status: {
              $cond: {
                if: { $ne: [{ $size: "$favorate_content" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
      res.json({
        code: 200,
        data: users,
      });
    } else if (data.task_id) {
      const users = await Uploadcontent.aggregate([
        {
          $match: { task_id: mongoose.Types.ObjectId(req.query.task_id) },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "task_id",
            foreignField: "_id",
            as: "task_id",
          },
        },

        { $unwind: "$task_id" },

        {
          $match: { "task_id.mediahouse_id": req.user._id },
        },

        {
          $lookup: {
            from: "categories",
            let: { task_id: "$task_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                  },
                },
              },
            ],
            as: "category_details",
          },
        },

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
          $lookup: {
            from: "avatars",
            let: { hopper_id: "$hopper_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                  },
                },
              },
            ],
            as: "avatar_detals",
          },
        },
        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$uploaded_content", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "favorate_content",
          },
        },


        {
          $addFields: {
            favourite_status: {
              $cond: {
                if: { $ne: [{ $size: "$favorate_content" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
      res.json({
        code: 200,
        data: users,
      });
    }
    else if (data._id) {
      const users = await Uploadcontent.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.query._id) },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "task_id",
            foreignField: "_id",
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
          $lookup: {
            from: "avatars",
            let: { hopper_id: "$hopper_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                  },
                },
              },
            ],
            as: "avatar_detals",
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { task_id: "$task_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                  },
                },
              },
            ],
            as: "category_details",
          },
        },
        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$uploaded_content", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "favorate_content",
          },
        },


        {
          $addFields: {
            favourite_status: {
              $cond: {
                if: { $ne: [{ $size: "$favorate_content" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },
        {
          $lookup: {
            from: "rooms",
            let: {
              hopper_id: "$hopper_id._id",
              task_id: "$task_id._id",
              user_id: "$task_id.mediahouse_id"
            },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$sender_id", "$$hopper_id"] },
                      { $eq: ["$receiver_id", "$$user_id"] },
                      { $eq: ["$type", "external_task"] },
                      { $eq: ["$task_id", "$$task_id"] },
                    ],
                  },
                },
              },
            ],
            as: "roomsdetails",
          },
        },
        { $unwind: "$roomsdetails" },
        {
          $sort: { createdAt: -1 }
        }
      ]);

      res.json({
        code: 200,
        data: users
      });
    }
    else {

      let secoundry_condition = {
        // favourite_status:false
      }
      let val;
      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }

      const start = new Date(moment().utc().startOf(val).format());
      const end = new Date(moment().utc().endOf(val).format());


      // if (data.hasOwnProperty("weekly")) {
      //   secoundry_condition["Vat.purchased_time"] = {
      //     $gte: start,
      //     $lte: end
      //   };
      // }

      if (data.hasOwnProperty("weekly")) {
        secoundry_condition.createdAt = {
          $lte: end,
          $gte: start,
        }
      }

      if (data.hasOwnProperty("monthly")) {
        secoundry_condition.createdAt = {
          $lte: end,
          $gte: start,
        }
      }

      if (data.hasOwnProperty("daily")) {
        secoundry_condition.createdAt = {
          $lte: end,
          $gte: start,
        }
      }

      if (data.hasOwnProperty("yearly")) {
        secoundry_condition.createdAt = {
          $lte: end,
          $gte: start,
        }
      }


      if (data.favContent == "false") {
        secoundry_condition.favourite_status = "false"
      } else if (data.favContent == "true" || data.favContent == true) {
        secoundry_condition.favourite_status = "true"
      }


      if (data.type) {
        secoundry_condition.payment_content_type = { $in: [data.type] }
      }


      if (data.category) {
        data.category = data.category.split(",")
        data.category = data.category.map((x) => mongoose.Types.ObjectId(x))
        secoundry_condition.category = { $in: data.category }
      }


      const users = await Uploadcontent.aggregate([
        {
          $match: {
            // paid_status: true 
            $expr: {
              $and: [{ $eq: ["$paid_status", false] }],
            },
          }
        },
        {
          $lookup: {
            from: "tasks",
            localField: "task_id",
            foreignField: "_id",
            as: "task_id",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }],
                  },
                }
              }
            ]
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
          $lookup: {
            from: "avatars",
            let: { hopper_id: "$hopper_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                  },
                },
              },
            ],
            as: "avatar_detals",
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { task_id: "$task_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                  },
                },
              },
            ],
            as: "category_details",
          },
        },
        {
          $sort: { "task_id.createdAt": -1 }
        },
        {
          $lookup: {
            from: "favourites",
            let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$uploaded_content", "$$id"] },
                    { $eq: ["$user_id", "$$user_id"] }

                    ],
                  },
                },
              },

            ],
            as: "favorate_content",
          },
        },


        {
          $addFields: {
            favourite_status: {
              $cond: {
                if: { $ne: [{ $size: "$favorate_content" }, 0] },
                then: "true",
                else: "false"
              }
            }
          }
        },
        {
          $addFields: {
            // payment_content_type: "$vat_data.payment_content_type",
            category: "$task_id.category_id",


          }

        },


        {
          $match: secoundry_condition
        },

        // const findroom = await Room.findOne({
        //   receiver_id: session.metadata.user_id,
        //   sender_id: findreceiver.hopper_id._id.toString(),
        //   type: "external_task",
        //   task_id: session.metadata.task_id
        // })

        {
          $limit: data.limit ? parseInt(data.limit) : 5
        },
        {
          $skip: data.offset ? parseInt(data.offset) : 0
        }
      ]);

      res.json({
        code: 200,
        data: users
      });
    }
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getSourcedContent = async (req, res) => {
  try {
    const getall = await HopperPayment.findOne({ type: "task_content", media_house_id: mongoose.Types.ObjectId(req.user._id), task_content_id: req.query._id })
      .populate("media_house_id hopper_id content_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .populate({
        path: "task_content_id",
        populate: {
          path: "task_id",
          populate: {
            path: "category_id",
          }
        }
      })
      .populate({
        path: "content_id",
        populate: {
          path: "tag_ids",
        },
      })
      .populate("payment_admin_id admin_id").sort({ createdAt: -1 });

    return res.json({
      code: 200,
      data: getall
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getSourcedContentbytask = async (req, res) => {
  try {


    const users = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },
      {
        $lookup: {
          from: "hopperpayments",
          let: { purchased_publication: "$purchased_publication", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$media_house_id", "$$purchased_publication"] },
                    { $eq: ["$task_content_id", "$$list"] },
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
      { $unwind: "$transictions" },
      {
        $lookup: {
          from: "admins",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", mongoose.Types.ObjectId("64bfa693bc47606588a6c807")] }],
                },
              },
            },

            // {
            //   $lookup: {
            //     from: "avatars",
            //     localField: "avatar_id",
            //     foreignField: "_id",
            //     as: "avatar_details",
            //   },
            // },
            // {
            //   $unwind: "$avatar_details",
            // },
          ],
          as: "admin_details",
        },
      },
      { $unwind: "$admin_details" },

      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
              $unwind: "$avatar_details",
            },
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "purchased_publication_details",
        },
      },

      { $unwind: "$purchased_publication_details" },
      {
        $match: {
          "task_id.mediahouse_id": req.user._id,
          paid_status: true,
          // "task_id.paid_status": "paid",
        },
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);


    const usersbyid = await Uploadcontent.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.body._id)
        },
      },

      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $lookup: {
          from: "categories",
          localField: "task_id.category_id",
          foreignField: "_id",
          as: "category_details",
        },
      },

      { $unwind: "$category_details" },
      {
        $lookup: {
          from: "hopperpayments",
          let: { purchased_publication: "$purchased_publication", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$media_house_id", "$$purchased_publication"] },
                    { $eq: ["$task_content_id", "$$list"] },
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
      { $unwind: "$transictions" },
      {
        $lookup: {
          from: "admins",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", mongoose.Types.ObjectId("64bfa693bc47606588a6c807")] }],
                },
              },
            },

            // {
            //   $lookup: {
            //     from: "avatars",
            //     localField: "avatar_id",
            //     foreignField: "_id",
            //     as: "avatar_details",
            //   },
            // },
            // {
            //   $unwind: "$avatar_details",
            // },
          ],
          as: "admin_details",
        },
      },
      { $unwind: "$admin_details" },

      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
              $unwind: "$avatar_details",
            },
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },

      // { $unwind: "$hopper_details" },
      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "purchased_publication_details",
        },
      },

      { $unwind: "$purchased_publication_details" },

      {
        $match: {
          "task_id.mediahouse_id": req.user._id,
          paid_status: true,
          // "task_id.paid_status": "paid",
        },
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    res.json({
      code: 200,
      data: req.body._id ? usersbyid : users,
      countOfSourced: req.body._id ? usersbyid.length : users.length, // details:draftDetails
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.ContentCount = async (req, res) => {
  try {
    const weekStart = new Date(moment().utc().startOf("week").format());
    const weekEnd = new Date(moment().utc().endOf("week").format());
    // ------------------------------------today fund invested -----------------------------------
    const yesterdayStart = new Date(moment().utc().startOf("day").format());
    const yesterdayEnd = new Date(moment().utc().endOf("day").format());
    const month = new Date(moment().utc().startOf("month").format());
    const monthend = new Date(moment().utc().endOf("month").format());
    const year = new Date(moment().utc().startOf("day").format());
    const yearend = new Date(moment().utc().endOf("day").format());
    // let condition = { paid_status: "paid"}
    let yesterday;
    const data = req.query;
    const objforlimit = {
      limit: data.limit,
      offset: data.offset
    }
    if (data.startdate && data.endDate) {
      yesterday = {
        media_house_id: req.user._id,
        createdAt: {
          $gte: data.startdate,
          $lte: data.endDate,
        },
      };
    } else if (data.posted_date) {
      yesterday = {
        media_house_id: req.user._id,
        createdAt: {
          $gte: data.posted_date,
        },
      };
    } else {
      yesterday = {
        // paid_status: "paid",
        media_house_id: req.user._id,
        type: "content",
        updatedAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    }


    const obj = {}
    let sort1 = { createdAt: -1 };
    // const weekStart = new Date(moment().utc().startOf("day").format());
    // const weekEnd = new Date(moment().utc().endOf("day").format());
    const getcontentonlines = await Contents.find({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: yesterdayEnd,
            $gte: yesterdayStart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    }).populate({
      path: "hopper_id",
      populate: {
        path: "avatar_id"
      }
    }).populate("category_id")

    const listofid = getcontentonlines.map((x) => x._id)
    const listofallcontentpaidfortoday = await Contents.aggregate([
      {
        $match:
        {
          _id: { $in: listofid }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper_id", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // { $eq: ["$hopper_id", "$$list"] },
                    { $eq: ["$media_house_id", mongoose.Types.ObjectId(req.user._id)] },
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
      { $unwind: "$transictions" },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_details",
        },
      },

      {
        $addFields: {
          total_earining: { $sum: "$transictions.amount" },
        },
      },
      {
        $match: obj

      },

      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
      },
    ]);


    const listofallcontentpaidfortodayCount = await Contents.aggregate([
      {
        $match:
        {
          _id: { $in: listofid }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper_id", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // { $eq: ["$hopper_id", "$$list"] },
                    { $eq: ["$media_house_id", mongoose.Types.ObjectId(req.user._id)] },
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
      { $unwind: "$transictions" },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_details",
        },
      },

      {
        $addFields: {
          total_earining: { $sum: "$transictions.amount" },
        },
      },
      {
        $match: obj

      },

      {
        $count: "count"
      }

    ]);




    let arr1
    if (getcontentonlines.length < 1) {
      arr1 = 0;
    } else {
      arr1 = getcontentonlines
        .map((element) => element.amount_paid)
        .reduce((a, b) => a + b);
    }
    // const hopperUsedTasks = await db.getItems(Contents, yesterday);
    const hopperUsedTasks = await db.getItemswithsort(
      HopperPayment,
      yesterday,
      sort1,
      objforlimit
    );
    const hopperUsed_task_count = hopperUsedTasks.length;
    console;
    var arr;
    if (hopperUsedTasks.length < 1) {
      arr = 0;
    } else {
      arr = hopperUsedTasks
        .map((element) => element.amount_paid)
        .reduce((a, b) => a + b);
    }

    // -------------------------------------------------end----------------------------------------
    const totalFundInvested = await db.getItemswithsort(
      Contents,
      yesterday,
      sort1,
      objforlimit
    );
    const totalFundInvestedlength = totalFundInvested.length;

    const prev_month = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );

    const prev_monthend = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );

    const totalpreviousMonth = await Contents.aggregate([
      {
        $group: {
          _id: "$purchased_publication",
          totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      {
        $match: {
          $and: [
            { _id: { $eq: req.user._id } },
            { updatedAt: { $gte: prev_month } },
            { updatedAt: { $lt: prev_monthend } },
          ],
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      {
        $sort: sort1,
      },
    ]);

    let conditionfortotal;
    if (req.query.type == "weekly") {
      conditionfortotal = {
        updatedAt: {
          $lte: weekEnd,
          $gte: weekStart,
        },
      };
    } else if (req.query.type == "daily") {
      conditionfortotal = {
        // media_house_id: mongoose.Types.ObjectId(req.user._id),
        // type : "content",
        updatedAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else if (req.query.type == "yearly") {
      conditionfortotal = {
        // media_house_id: mongoose.Types.ObjectId(req.user._id),
        // type : "content",
        updatedAt: {
          $lte: yearend,
          $gte: year,
        },
      };
    } else {
      conditionfortotal = {
        // media_house_id: mongoose.Types.ObjectId(req.user._id),
        // type : "content"
        updatedAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    }

    const total = await Contents.aggregate([
      {
        $group: {
          _id: "$purchased_publication",
          totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      {
        $match: {
          _id: req.user._id,
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      { $match: conditionfortotal },
      {
        $sort: sort1,
      },
    ]);


    const listofallcontentpaid = await Contents.aggregate([
      {
        $match:
        {
          purchased_mediahouse: { $in: [mongoose.Types.ObjectId(req.user._id)] }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper_id", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // { $eq: ["$hopper_id", "$$list"] },
                    { $eq: ["$media_house_id", mongoose.Types.ObjectId(req.user._id)] },
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
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_details",
        },
      },

      {
        $addFields: {
          total_earining: { $sum: "$transictions.amount" },
        },
      },
    ]);
    let yesterdays;
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
      };
    }




    const totals = await HopperPayment.aggregate([

      {
        $match: yesterdays,
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "puschases",
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_detailssss",
        },
      },

      // {
      //   $lookup: {
      //     from: "contents",
      //     let: { id: "$data.content_id" },

      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$_id", "$$id"] }],
      //           },
      //         },
      //       },


      //     ],
      //     as: "content_details",
      //   },
      // },
      // {$unwind:"$content_details"},
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          data: 1,
          vat: 1,
          content_details: 1
          // netVotes: { $subtract: ["$totalupvote", "$totaldownvote"] },
        },
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);


    const curr_mStart = new Date(moment().utc().startOf("week").format());
    const curr_m_emd = new Date(moment().utc().endOf("week").format());

    const totalcurrentMonth = await Contents.aggregate([
      {
        $group: {
          _id: "$purchased_publication",
          totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      {
        $match: {
          $and: [
            { _id: { $eq: req.user._id } },
            { updatedAt: { $gte: curr_mStart } },
            { updatedAt: { $lt: curr_m_emd } },
          ],
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      {
        $sort: sort1,
      },
    ]);

    const content_counts = totalcurrentMonth.length;
    const prev_total_content = totalpreviousMonth.length;
    let percent5;
    var type5;
    if (content_counts > prev_total_content) {
      const diff = prev_total_content / content_counts;
      percent5 = diff * 100;
      type5 = "increase";
    } else {
      const diff = content_counts / prev_total_content;
      percent5 = diff * 100;
      type5 = "decrease";
    }
    // ------------------------------------- // code of online content start ---------------------------------------------

    let coindition;
    if (req.query.type == "weekly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: weekEnd,
          $gte: weekStart,
        },
      };
    } else if (req.query.type == "daily") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else if (req.query.type == "yearly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yearend,
          $gte: year,
        },
      };
    } else if (req.query.type == "monthly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: monthend,
          $gte: month,
        },
      };
    } else if (data.month && data.year) {
      const value = await getStartAndEndDate(data.month, parseInt(data.year))


      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: new Date(value.endDate),
          $gte: new Date(value.startDate),
        }
      };

    }
    else {

      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        // updatedAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }
    let sort = { createdAt: -1 }
    if (data.content == "lowPrice") {
      sort = { amount: 1 }
    } else if (data.content == "highPrice") {
      sort = { amount: -1 }
    } else {
      sort = { createdAt: -1 }
    }
    // const getcontentonline = await Contents.find({ paid_status: "paid" });

    const getcontentonline = await HopperPayment.find(coindition)
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
          populate: {
            path: "avatar_id",
          },
        },
        // select: { _id: 1, content: 1, createdAt: 1, updatedAt: 1 },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "category_id",
        },
      })
      .sort(sort).limit(req.query.limit ? parseInt(req.query.limit) : Number.MAX_SAFE_INTEGER).skip(req.query.offset ? parseInt(req.query.offset) : 0);


    const getcontentonlineCount = await HopperPayment.countDocuments(coindition)

    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: coindition,
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $sort: sort//{ createdAt: -1 }, // Sort by month in ascending order (optional)
      },
    ]);

    /////---------------------------------------------------------------------------//////
    // const getfavarateContent = await Favourite.find({user_id:mongoose.Types.ObjectId(req.user._id)});

    let weekday = {
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      type: "content",
      updatedAt: {
        $lte: weekEnd,
        $gte: weekStart,
      },
    };

    const prev_weekStart = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const prev_weekEnd = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );
    let lastweekday = {
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      type: "content",
      updatedAt: {
        $lte: prev_weekEnd,
        $gte: prev_weekStart,
      },
    };

    const content = await db.getItemswithsort(HopperPayment, weekday, sort1, objforlimit);
    const content_count = content.length;
    const curr_week_percent = content_count / 100;
    const prevcontent = await db.getItemswithsort(
      HopperPayment,
      lastweekday,
      sort1,
      objforlimit
    );
    const prevcontent_count = prevcontent.length;
    const prev_week_percent = prevcontent_count / 100;
    let percent1;
    var type1;
    if (content_count > prevcontent_count) {
      const diff = prevcontent_count / content_count;
      percent1 = diff * 100;
      type1 = "increase";
    } else {
      const diff = content_count / prevcontent_count;
      percent1 = diff * 100;
      type1 = "decrease";
    }

    // ------------------end---------------------------------------
    // ---------------------------------------favarrate start------------------------------------

    let coinditionforfavourate = { user_id: mongoose.Types.ObjectId(req.user._id), sale_status: "unsold" };
    if (req.query.favtype == "weekly") {
      coinditionforfavourate = {
        user_id: mongoose.Types.ObjectId(req.user._id),
        updatedAt: {
          $lte: weekEnd,
          $gte: weekStart,
        },
      };
    } else if (req.query.favtype == "daily") {
      coinditionforfavourate = {
        user_id: mongoose.Types.ObjectId(req.user._id),
        updatedAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else if (req.query.favtype == "yearly") {
      coinditionforfavourate = {
        user_id: mongoose.Types.ObjectId(req.user._id),
        updatedAt: {
          $lte: yearend,
          $gte: year,
        },
      };
    } else if (req.query.favtype == "monthly") {
      coinditionforfavourate = {
        user_id: mongoose.Types.ObjectId(req.user._id),
        updatedAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    }
    const getfavarateContent = await Favourite.find(coinditionforfavourate)
      .populate({
        path: "content_id",
        // select: { _id: 1, content: 1, updatedAt: 1, createdAt: 1 }
      })
      .sort({ createdAt: -1 });

    let fav_weekday = {
      user_id: mongoose.Types.ObjectId(req.user._id),
      updatedAt: {
        $lte: weekEnd,
        $gte: weekStart,
      },
    };
    let Favourite_week_end = {
      user_id: mongoose.Types.ObjectId(req.user._id),
      updatedAt: {
        $lte: prev_weekEnd,
        $gte: prev_weekStart,
      },
    };
    const fav_content = await db.getItemswithsort(
      Favourite,
      fav_weekday,
      sort1,
      objforlimit
    );
    const favcontent_count = fav_content.length;
    const fcurr_week_percent = favcontent_count / 100;
    const fprevcontent = await db.getItemswithsort(
      Favourite,
      Favourite_week_end,
      sort1,
      objforlimit
    );
    const fprevcontent_count = fprevcontent.length;

    const fprev_week_percent = fprevcontent_count / 100;
    let percent2;
    let type2;
    if (favcontent_count > fprevcontent_count) {
      const diff = fprevcontent_count / favcontent_count;
      percent2 = diff * 100;
      type2 = "increase";
    } else {
      const diff = favcontent_count / fprevcontent_count;
      percent2 = diff * 100;
      type2 = "decrease";
    }
    //  ------------------------------------------------end-------------------------------------------

    // const hopperbycontent = await Contents.aggregate([
    //   {
    //     $group: {
    //       _id: "$hopper_id",
    //       data: { $push: "$$ROOT" },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       value: "$_id",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "users",
    //       let: { id: "$value" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [{ $eq: ["$_id", "$$id"] }],
    //             },
    //           },
    //         },

    //         {
    //           $lookup: {
    //             from: "avatars",
    //             localField: "avatar_id",
    //             foreignField: "_id",
    //             as: "avatar_id",
    //           },
    //         },
    //         { $unwind: "$avatar_id" },
    //       ],
    //       as: "hopper_details",
    //     },
    //   },
    //   { $unwind: "$hopper_details" },
    //   {
    //     $sort: sort1,
    //   },
    // ]);
    const hopperbycontent = await Uploadcontent.aggregate([
      {
        $group: {
          _id: "$hopper_id",
          records: {
            $push: "$$ROOT",
          },
        },
      },
      // {
      //   $lookup: {
      //     from: "tasks",
      //     localField: "records.task_id",
      //     foreignField: "_id",
      //     as: "task_details",
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      // $and: [{ $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }],
      //           },
      //         }
      //       }
      //     ]
      //   },
      // },

      {
        $addFields: {
          task_is_fordetail: "$records.task_id",
          hopper_is_fordetail: "$records.hopper_id",
        },
      },

      {
        $lookup: {
          from: "tasks",
          let: {
            task_id: "$task_is_fordetail",
            new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$task_id"] },
                    { $eq: ["$mediahouse_id", mongoose.Types.ObjectId(req.user._id)] }
                  ],
                },
              },
            },

            {
              $lookup: {
                from: "users",
                let: { hopper_id: "$new_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $in: ["$_id", "$$new_id"] }],
                      },
                    },
                  },
                  {
                    $addFields: {
                      console: "$$new_id",
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
                ],
                as: "hopper_details",
              },
            },
          ],
          as: "task_details",
        },
      },
      {
        $unwind: "$task_details",
      },
      {
        $group: {
          _id: "$_id", // You can use a unique identifier field here
          // Add other fields you want to preserve
          firstDocument: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$firstDocument" },
      },
      {
        $sort: sort,
      },
    ]);
    const hopperbycontentprevweek = await Contents.aggregate([
      {
        $match: {
          createdAt: {
            $gte: prev_weekStart,
            $lt: prev_weekEnd,
          },
        },
      },

      {
        $group: {
          _id: "$hopper_id",
          // totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      // {
      //   $addFields: {
      //     console: "$amount_paid",
      //   },
      // },
      // {
      //   $project: {
      //     paid_status: 1,
      //     purchased_publication: 1,
      //     amount_paid: 1,
      //     totalamountpaid: 1,
      //     console: 1,
      //     paid_status: 1,
      //   },
      // },
    ]);

    const hopperbycontentcurrweek = await Contents.aggregate([
      {
        $match: {
          createdAt: {
            $gte: weekStart,
            $lt: weekEnd,
          },
        },
      },

      {
        $group: {
          _id: "$hopper_id",
          // totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      // {
      //   $addFields: {
      //     console: "$amount_paid",
      //   },
      // },
      // {
      //   $project: {
      //     paid_status: 1,
      //     purchased_publication: 1,
      //     amount_paid: 1,
      //     totalamountpaid: 1,
      //     console: 1,
      //     paid_status: 1,
      //   },
      // },
    ]);

    const h_count = hopperbycontentcurrweek.length;
    const hcurr_week_percent = h_count / 100;
    const hprevcontent_count = hopperbycontentprevweek.length;
    const hprev_week_percent = hprevcontent_count / 100;
    var percent;
    var type;
    if (h_count > hprevcontent_count) {
      const diff = hprevcontent_count / h_count;
      percent = diff * 100;
      type = "increase";
    } else {
      const diff = h_count / hprevcontent_count;
      percent = diff * 100;
      type = "decrease";
    }

    // ---------------------------------------------------------------------------------------------

    let currw = {
      paid_status: "paid",
      updatedAt: {
        $lte: weekEnd,
        $gte: weekStart,
      },
    };
    const chopper = await db.getItemswithsort(Contents, currw, sort1, objforlimit);
    const chopperUsed_task_count = hopperUsedTasks.length;


    let curr_prev = {
      paid_status: "paid",
      updatedAt: {
        $lte: prev_weekEnd,
        $gte: prev_weekStart,
      },
    };
    const phopper = await db.getItemswithsort(Contents, curr_prev, sort1, objforlimit);
    const phopperUsed_task_count = phopper.length;

    var percent3;
    var type3;
    if (chopperUsed_task_count > phopperUsed_task_count) {
      const diff = phopperUsed_task_count / chopperUsed_task_count;
      percent3 = diff * 100;
      type3 = "increase";
    } else {
      const diff = chopperUsed_task_count / phopperUsed_task_count;
      percent3 = diff * 100;
      type3 = "decrease";
    }

    let conditionforsort = {};
    if (req.query.sourcetype == "weekly") {
      conditionforsort = {
        // user_id:mongoose.Types.ObjectId(req.user._id),
        updatedAt: {
          $lte: weekEnd,
          $gte: weekStart,
        },
      };
    } else if (req.query.sourcetype == "daily") {
      conditionforsort = {
        // user_id:mongoose.Types.ObjectId(req.user._id),
        updatedAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else if (req.query.sourcetype == "yearly") {
      conditionforsort = {
        // user_id:mongoose.Types.ObjectId(req.user._id),
        updatedAt: {
          $lte: yearend,
          $gte: year,
        },
      };
    } else if (req.query.sourcetype == "monthly") {
      conditionforsort = {
        updatedAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    }

    const contentsourcedfromtask = await Uploadcontent.aggregate([
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
          let: { hopper_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_id",
              },
            },

            { $unwind: "$category_id" },

            // {
            //   $addFields:{
            //     console:"$$task_id"
            //   }
            // }
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          "task_id.mediahouse_id": req.user._id,
          paid_status: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "purchased_publication_details",
        },
      },
      { $unwind: "$purchased_publication_details" },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
              $unwind: "$avatar_details",
            },
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $match: conditionforsort,
      },
      {
        $sort: sort1,
      },
      // {
      //   $lookup:{
      //     from:"tasks",
      //     let :{
      //       _id: "$task_id",
      //     },
      //     pipeline:[
      //       {
      //         $match: { $expr: [{
      //           $and: [{
      //             $eq:["_id" , "$$_id"],
      //         }]
      //         }] },
      //       },
      //       {
      //         $lookup:{
      //           from:"Category",
      //           localField:"category_id",
      //           foreignField:"_id",
      //           as:"category_ids"
      //         }
      //       }
      //     ],
      //     as:"category"
      //   }
      // }
    ]);

    const contentsourcedfromtaskprevweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      // {
      //   $match: { "task_id.mediahouse_id": req.user._id },
      // },

      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: prev_weekStart } },
            { updatedAt: { $lt: prev_weekEnd } },
          ],
        },
      },
      {
        $sort: sort1,
      },
    ]);

    const contentsourcedfromtaskthisweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      // {
      //   $match: { "task_id.mediahouse_id": req.user._id },
      // },

      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: weekStart } },
            { updatedAt: { $lt: weekEnd } },
          ],
        },
      },
      {
        $sort: sort1,
      },
    ]);
    let percentage6, type6;
    if (
      contentsourcedfromtaskthisweekend.length >
      contentsourcedfromtaskprevweekend.length
    ) {
      (percentage6 =
        contentsourcedfromtaskprevweekend / contentsourcedfromtaskthisweekend),
        (type6 = "increase");
    } else {
      (percentage6 =
        contentsourcedfromtaskthisweekend / contentsourcedfromtaskprevweekend),
        (type6 = "decrease");
    }
    const resp = await Contents.find({
      offered_mediahouses: { $in: [mongoose.Types.ObjectId(req.user._id)] },
      // content_under_offer: true,
      // sale_status: "unsold",
      is_deleted: false
    })
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .populate("category_id")
      .sort(sort1);


    const content_underOffer = await Chat.find({
      sender_id: req.user._id,
      Mediahouse_initial_offer: "Mediahouse_initial_offer",
    }).populate("image_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .populate("category_id")






    res.json({
      code: 200,
      content_online: {
        task: getcontentonline,
        count: getcontentonlineCount,
        type: type1,
        percent: percent1,
      },
      sourced_content_from_tasks: {
        task: contentsourcedfromtask,
        count: contentsourcedfromtask.length,
        type: type6,
        percentage: percentage6 || 0,
      },
      hopper: {
        task: hopperbycontent,
        count: hopperbycontent.length,
        type: type,
        percent: percent,
      },
      favourite_Content: {
        task: getfavarateContent,
        count: getfavarateContent.length,
        type: type2,
        percent: percent2,
      },
      today_fund_invested: {
        task: listofallcontentpaidfortoday,
        count: arr1,
        totalCount: listofallcontentpaidfortodayCount.length > 0 ? listofallcontentpaidfortodayCount[0].count : 0,
        type: type3,
        percent: percent3,
      },
      total_fund_invested: {
        task: total,
        total_for_content: listofallcontentpaid,
        count: totals.length > 0 ? totals[0].totalamountpaid : 0,//totals.length,
        data: getcontentonline1,
        type: type5,
        percent: totals.length > 0 ? totals[0].totalamountpaid : 0//percent5 || 0,
      },

      content_under_offer: {
        task: resp,
        count: resp.length,
      },
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.createreason = async (req, res) => {
  try {
    const data = req.body;
    // 
    // data.media_house_id = req.user._id;
    // data.content_id = data.id;
    // await db.updateItem(data.id, Contents, {
    //   paid_status: data.paid_status,
    //   amount_paid: data.amount,
    //   purchased_publication: data.media_house_id,
    // });
    const payment = await db.createItem(data, reason);
    res.json({
      code: 200,
      payment,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.dindreason = async (req, res) => {
  try {
    const data = req.body;
    // 
    // data.media_house_id = req.user._id;
    // data.content_id = data.id;
    // await db.updateItem(data.id, Contents, {
    //   paid_status: data.paid_status,
    //   amount_paid: data.amount,
    //   purchased_publication: data.media_house_id,
    // });
    // const payment = await db.createItem(data, reason);
    const payment = await reason.find({});
    res.json({
      code: 200,
      payment,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};


function getStartAndEndDate(month, year) {
  const startDate = new Date(`${month} 1, ${year}`);
  const endDate = new Date(year, startDate.getMonth() + 1, 0); // last day of the month
  const yesterdayStart = new Date(moment(startDate).utc().startOf("month").format());
  const yesterdayEnd = new Date(moment(endDate).utc().endOf("month").format());

  console.log("yesterdayStart===========", yesterdayStart)
  return ({

    startDate: yesterdayStart,
    endDate: yesterdayEnd
  });
}


exports.dashboardCount = async (req, res) => {
  try {
    let data = req.body;


    let objforlimit = {
      limit: req.body.limit,
      offset: req.body.offset,
    }
    let val = "day";

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }
    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    let yesterday = {
      paid_status: "paid",
      updatedAt: {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      },
    };
    const sorted = { updatedAt: -1 };

    const hopperUsedTasks = await db.getItemswithsort(
      Contents,
      yesterday,
      sorted,
      objforlimit
    );



    const hopperUsed_task_count = hopperUsedTasks.length;
    console;
    var arr = hopperUsedTasks.reduce((acc, task) => acc + task.amount_paid, 0);
    // ;

    // if (hopperUsedTasks.length < 1) {
    //   arr = 0;
    // } else {
    //   arr = hopperUsedTasks
    //     .map((element) => element.amount_paid)
    //     .reduce((a, b) => a + b);
    // }

    let conditiontotal = { media_house_id: mongoose.Types.ObjectId(req.user._id) };
    // if (req.query.posted_date) {
    //   req.query.posted_date = parseInt(req.query.posted_date);
    //   const today = new Date();
    //   const days = new Date(
    //     today.getTime() - req.query.posted_date * 24 * 60 * 60 * 1000
    //   );
    //   conditiontotal = {
    //     $expr: {
    //       $and: [{ $gte: ["$createdAt", days] }],
    //     },
    //   };
    // }


    if ((data.daily || data.yearly || data.monthly || data.weekly) && data.type == "funds_invested") {
      conditiontotal.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      }

    }



    const total = await HopperPayment.aggregate([
      {
        $match: conditiontotal
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          totalVat: { $sum: "$Vat" },
        },
      },

      {
        $addFields: {
          console: "$amount",
        },
      },
      // { $match: conditiontotal },
      {
        $sort: { createdAt: -1 }
      },
      // {
      //   $skip: data.offset ? parseInt(data.offset) :0
      // },
      // {
      //   $limit: data.limit ? parseInt(data.limit) :Number.MAX_SAFE_INTEGER
      // },
    ]);



    let condition = {
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      type: "content",
    };



    let sortBy = {
      createdAt: -1,
    };
    if (data.content == "latest") {
      sortBy = {
        createdAt: -1,
      };
    }
    if (data.content == "lowPrice") {
      sortBy = {
        amount: 1,
      };
    }
    if (data.content == "highPrice") {
      sortBy = {
        amount: -1,
      };
    }

    let condition1 = {};
    if (data.maxPrice && data.minPrice) {
      condition1 = {
        $expr: {
          $and: [
            { $gte: ["$ask_price", data.minPrice] },
            { $lte: ["$ask_price", data.maxPrice] },
          ],
        },
      };
    }

    if ((data.daily || data.yearly || data.monthly || data.weekly) && data.type == "content_purchased_online" && data.year) {



      const value = await getStartAndEndDate(data.monthly, parseInt(data.year))
      console.log("data---------in side-----", value, value.startDate, value.endDate)
      condition.createdAt = {
        $lte: new Date(value.endDate),
        $gte: new Date(value.startDate),
      }
    }

    if ((data.daily || data.yearly || data.monthly || data.weekly) && data.type == "content_purchased_online" && !data.year) {

      condition.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      }

    }



    const total_fund_invested_data = await HopperPayment.aggregate([
      {
        $match: condition,
      },

      {
        $lookup: {
          from: "contents",
          // localField: "content_id",
          // foreignField: "_id",
          let: { id: "$content_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$id"] }],
                },
              },
            },
            {
              $lookup: {
                from: "categories",
                let: { category_id: "$category_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$category_id"] },
                    },
                  },
                ],
                as: "category_ids",
              },
            },
          ],
          as: "content_ids",
        },
      },
      {
        $addFields: {
          ask_price: "$content_ids.ask_price",
        },
      },
      {
        $unwind: "$ask_price",
      },
      {
        $match: condition1,
      },
      {
        $lookup: {
          from: "contents",
          let: { id: "$contents" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$type", data.contentType] }],
                },
              },
            },
          ],
          as: "content_details",
        },
      },

      {
        $lookup: {
          from: "users",
          let: { id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                let: { avatar_id: "$avatar_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$avatar_id"] },
                    },
                  },
                ],
                as: "avatar_details",
              },
            },
          ],
          as: "hopper_ids",
        },
      },

      {
        $unwind: "$hopper_ids",
      },
      {
        $sort: sortBy,
      },

      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
      },
    ]);



    const totalCount = await HopperPayment.aggregate([
      {
        $match: condition,
      },

      {
        $lookup: {
          from: "contents",
          // localField: "content_id",
          // foreignField: "_id",
          let: { id: "$content_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$id"] }],
                },
              },
            },
            {
              $lookup: {
                from: "categories",
                let: { category_id: "$category_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$category_id"] },
                    },
                  },
                ],
                as: "category_ids",
              },
            },
          ],
          as: "content_ids",
        },
      },
      {
        $addFields: {
          ask_price: "$content_ids.ask_price",
        },
      },
      {
        $unwind: "$ask_price",
      },
      {
        $match: condition1,
      },
      {
        $lookup: {
          from: "contents",
          let: { id: "$contents" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$type", data.contentType] }],
                },
              },
            },
          ],
          as: "content_details",
        },
      },

      {
        $lookup: {
          from: "users",
          let: { id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                let: { avatar_id: "$avatar_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$avatar_id"] },
                    },
                  },
                ],
                as: "avatar_details",
              },
            },
          ],
          as: "hopper_ids",
        },
      },

      {
        $unwind: "$hopper_ids",
      },
      {
        $sort: sortBy,
      },
    ]);
    const yesterdayEnds = new Date();
    let last_month = {
      // limit:req.body.limit,
      // offset:req.body.offset,
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      deadline_date: {
        // $gte: yesterdayStarts,
        $lte: yesterdayEnds,
      },
    };
    if (data.type == "broadcast_task") {
      let val = "year";

      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }

      const yesterdayStart = new Date(moment().utc().startOf(val).format());
      const yesterdayEnd = new Date(moment().utc().endOf(val).format());
      last_month.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart

      }
    }




    if (req.body.type == "live") {
      last_month = {
        // limit:req.body.limit,
        // offset:req.body.offset,
        // type: req.query.type,
        mediahouse_id: req.user._id,
        deadline_date: {
          // $gte: yesterdayStarts,
          $gte: yesterdayEnds,
        },
      };
    }

    const sort = {
      createdAt: -1,
    };

    const obj = {
      limit: req.body.limit,
      offset: req.body.offset
    }

    const obj2 = {
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0
    }
    const BroadCastedTasks = await db.getItemswithsort(
      BroadCastTask,
      last_month,
      sort,
      obj
    );

    delete last_month.limit
    delete last_month.offset
    const BroadCasted = await db.getItemswithsortOnlyCount(
      BroadCastTask,
      last_month,
      sort,
    );
    const broadcasted_task_count = BroadCasted.length;
    const tasktotal = await BroadCastTask.aggregate([
      {
        $group: {
          _id: "$mediahouse_id",
          totalamountpaid: { $sum: "$amount_paid" },
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
    ]);

    const getcontentonline = await HopperPayment.find({
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      type: "content",
    });
    let condition2 = {
      user_id: mongoose.Types.ObjectId(req.user._id),
      // type:"content"
    };
    let sortBy2 = {
      createdAt: -1,
    };
    if (data.favcontent == "latest") {
      sortBy2 = {
        createdAt: -1,
      };
    }
    //ask_price
    if (data.favcontent == "lowPrice") {
      sortBy = {
        ask_price: 1,
      };
    }
    if (data.favcontent == "highPrice") {
      sortBy2 = {
        ask_price: -1,
      };
    }

    if (data.type == "favourited_content") {
      let val = "year";

      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }

      const yesterdayStart = new Date(moment().utc().startOf(val).format());
      const yesterdayEnd = new Date(moment().utc().endOf(val).format());
      condition2.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart

      }
    }

    let condition3 = {};
    if (data.favMaxPrice && data.favMinPrice) {
      condition3 = {
        $expr: {
          $and: [
            { $gte: ["$ask_price", data.favMinPrice] },
            { $lte: ["$ask_price", data.favMaxPrice] },
          ],
        },
      };
    }

    let filterforinternalcontentunderOffer = {}
    if (data.search && data.type == "content_under_offer") {

      filterforinternalcontentunderOffer.$or = [

        { "category_id.name": { $regex: data.search, $options: "i" } },
      ]
      // filterforinternalcontentunderOffer.content_under_offer = {$eq : data.content_under_offer}
    }

    if (data.content_under_offer && data.type == "content_under_offer") {


      filterforinternalcontentunderOffer.content_under_offer = { $eq: data.content_under_offer }
    }

    if (data.category && data.type == "content_under_offer") {


      filterforinternalcontentunderOffer.$or = [

        { "content_ids.type": { $regex: data.category, $options: "i" } },
      ]
    }
    const get_favourite_content_online = await Favourite.aggregate([
      {
        $match: condition2,
      },
      {
        $match: {
          sale_status: "unsold"
        }
      },
      {
        $lookup: {
          from: "contents",
          localField: "content_id",
          foreignField: "_id",
          as: "content_ids",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      },
      {
        $addFields: {
          ask_price: "$content_ids.ask_price",
        },
      },
      {
        $unwind: "$ask_price",
      },
      {
        $match: condition1,
      },
      // {
      //   $lookup: {
      //     from: "contents",
      //     let: { id: "$contents" },

      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$type", data.favContentType] }],
      //           },
      //         },
      //       },
      //     ],
      //     as: "content_details",
      //   },
      // },
      // {
      //   $match: filterforinternalcontentunderOffer,
      // },
      {
        $project: {
          _id: 1,
          content_id: 1,
          content_details: 1,
          // content:1,
          ask_price: 1,
          image: 1,
          "content_ids._id": 1,
          "content_ids.content": 1,
          "content_ids.createdAt": 1,
          "content_ids.updatedAt": 1,
          "content_ids.type": 1,
          "content_ids.category_id": 1,
          "content_ids.content_under_offer": 1
        },
      },

      {
        $sort: sortBy2,
      },
    ]);

    let conditionforunderOffer = {
      offered_mediahouses: { $in: [mongoose.Types.ObjectId(req.user._id)] },
      purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] },
      is_deleted: false,
      type: { $in: req.body.type },
      category_id: { $in: data.category_id }
    };

    let conditionforsort = { createdAt: -1 };
    if (req.body.sort_for_under_offer == "low_price_content") {
      conditionforsort = { ask_price: 1 };
    } else if (req.body.sort_for_under_offer == "high_price_content") {
      conditionforsort = { ask_price: -1 };
    } else if (req.body.startPrice && req.body.endPrice) {
      conditionforunderOffer = {
        is_deleted: false,
        ask_price: {
          $lte: req.query.endPrice,
          $gte: req.query.startPrice,
        },
      };
    }
    // if (req.body.type == "content_under_offer") {
    //   conditionforunderOffer = {
    //     is_deleted: false,
    //     offered_mediahouses: { $in: [mongoose.Types.ObjectId(req.user._id)] },
    //     purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] },
    //     // sale_status: "unsold",
    //     type: req.body.type,
    //     // createdAt :{
    //     //   $lte: yesterdayEnd,
    //     //   $gte: yesterdayStart

    //     // }
    //   };
    // }

    // if (data.type == "content_under_offer") {
    //   let val = "year";

    //   if (data.hasOwnProperty("weekly")) {
    //     val = "week";
    //   }

    //   if (data.hasOwnProperty("monthly")) {
    //     val = "month";
    //   }

    //   if (data.hasOwnProperty("daily")) {
    //     val = "day";
    //   }

    //   if (data.hasOwnProperty("yearly")) {
    //     val = "year"
    //   }

    //   const yesterdayStart = new Date(moment().utc().startOf(val).format());
    //   const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    //   delete conditionforunderOffer.type
    //   conditionforunderOffer.createdAt = {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart

    //   }
    // }

    // const resp = await Contents.find(conditionforunderOffer).sort(
    //   conditionforsort
    // ).populate({
    //   path: "hopper_id",
    //   populate: {
    //     path: "avatar_id",
    //   },
    // });
    if (!data.type || data.type.length == 0 || typeof (data.type) == "string") {

      delete conditionforunderOffer.type
    }

    if ((!data.type || data.type.length == 0) && (!data.category_id || data.category_id.length == 0)) {

      console.log("notyle--------------and category found")
      delete conditionforunderOffer.category_id
      delete conditionforunderOffer.type
    }

    if (!data.category_id || data.category_id.length == 0) {

      delete conditionforunderOffer.category_id
    } else {

      //  delete conditionforunderOffer.category_id
      let value = data.category_id.map((x) => mongoose.Types.ObjectId(x))


      conditionforunderOffer.category_id = { $in: value }
    }
    const pipeline = [
      { $match: conditionforunderOffer }, // Match documents based on the given condition
      // {
      //   $lookup: {
      //     from: "categories",
      //     localField: "category_id",
      //     foreignField: "_id",
      //     as: "category_id"
      //   }
      // },

      {
        $lookup: {
          from: "tags",
          localField: "tag_ids",
          foreignField: "_id",
          as: "tag_ids"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id"
        }
      },
      {
        $lookup: {
          from: "avatars",
          localField: "hopper_id.avatar_id",
          foreignField: "_id",
          as: "hopper_id.avatar_id"
        }
      },
      {
        $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      },

      {
        $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
      },

      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      // {
      //   $match: {
      //     $or: [
      //       { "type": { $regex: data.search, $options: "i" } }, // Case-insensitive search for location
      //       { "category_id.name": { $regex: data.search, $options: "i" } }, // Case-insensitive search for location
      //       // { "tag_ids.name": { $regex: data.search, $options: "i" } } // Case-insensitive search for tag names
      //     ]
      //   }
      // },
      {
        $sort: conditionforsort // Sort documents based on the specified criteria
      }
    ];

    const resp = await Contents.aggregate(pipeline);
    const offeredConrent = await Chat.find({ message_type: "Mediahouse_initial_offer", sender_id: mongoose.Types.ObjectId(req.user._id) })
    const todaytotalinv = await Contents.aggregate([
      {
        $match: conditionforunderOffer
      },
      {
        $lookup: {
          from: "chats",
          let: {
            content_id: "$_id",
            // new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$message_type", "Mediahouse_initial_offer"] },
                  { $eq: ["$image_id", "$$content_id"] },
                  { $eq: ["$sender_id", mongoose.Types.ObjectId(req.user._id)] }],
                },
              },
            },
          ],
          as: "offered_price",
        },
      },



      {
        $addFields: {
          console: {
            $cond: {
              if: { $gt: [{ $size: "$offered_price" }, 0] },  // Check if offered_price array has elements
              then: {
                $toDouble: {
                  $ifNull: [
                    {
                      $cond: {
                        if: { $or: [{ $eq: [{ $arrayElemAt: ["$offered_price.initial_offer_price", -1] }, ""] }, { $eq: [{ $arrayElemAt: ["$offered_price.initial_offer_price", -1] }, null] }] },  // Check if the last element is "" or null
                        then: 0,  // Replace empty string or null with 0
                        else: { $arrayElemAt: ["$offered_price.initial_offer_price", -1] }  // Use the actual value if it's not empty or null
                      }
                    },
                    0  // Fallback value if offered_price or initial_offer_price is completely missing
                  ]
                }
              },
              else: 0  // Default value if offered_price is not present or empty
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                let: { avatar_id: "$avatar_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$avatar_id"] },
                    },
                  },
                ],
                as: "avatar_details",
              },
            },
          ],
          as: "hopper_id",
        },
      },

      {
        $unwind: "$hopper_id",
      },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      // {
      //   $project: {
      //     paid_status: 1,
      //     offered_price:1,
      //     purchased_publication: 1,
      //     amount_paid: 1,
      //     totalamountpaid: 1,
      //     console: 1,
      //     paid_status: 1,
      //   },
      // },
      {
        $sort: conditionforsort,
      },
    ]);
    const img = { message_type: "Mediahouse_initial_offer", sender_id: mongoose.Types.ObjectId(req.user._id) }


    if (data.locationArr) {
      const content_purchase_online_for_location =
        await HopperPayment.aggregate([
          {
            $match: condition,
          },

          {
            $lookup: {
              from: "contents",
              localField: "content_id",
              foreignField: "_id",
              as: "content_ids",
            },
          },
          {
            $addFields: {
              ask_price: "$content_ids.ask_price",
            },
          },
          {
            $unwind: "$ask_price",
          },
          {
            $match: condition1,
          },
          {
            $lookup: {
              from: "contents",
              let: { id: "$contents" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$type", data.contentType] }],
                    },
                  },
                },
              ],
              as: "content_details",
            },
          },
          {
            $lookup: {
              from: "contents",
              // let: { lat: "$miles", long: "$milesss" },

              pipeline: [
                {
                  $geoNear: {
                    near: {
                      type: "Point",
                      coordinates: [72.223, 32.234], // first long then, lat
                    },
                    distanceField: "distance",
                    // distanceMultiplier: 0.001, //0.001
                    spherical: true,
                    // includeLocs: "location",
                    maxDistance: 2000 * 1000,
                  },
                },
              ],
              as: "assignmorehopperList",
            },
          },
          {
            $sort: sortBy,
          },
        ]);

      res.json({
        code: 200,
        content_online: {
          task: content_purchase_online_for_location,
          count: getcontentonline.length,
        },
        favourite_Content: {
          // task: getfavarateContent,
          task: get_favourite_content_online,
          count: get_favourite_content_online.length,
        },
        broad_casted_tasks_details: {
          task: BroadCastedTasks,
          count: broadcasted_task_count,
        },
        total_fund_invested: {
          task: total,
          count: totalCount.length,
          data: total_fund_invested_data,
        },
        content_under_offer: {
          task: resp,
          newdata: todaytotalinv,
          count: resp.length,
        },
      });
    } else if (data.favLocArr) {
      const get_favourite_content_online_for_location =
        await Favourite.aggregate([
          {
            $match: condition2,
          },

          {
            $lookup: {
              from: "contents",
              localField: "content_id",
              foreignField: "_id",
              as: "content_ids",
            },
          },
          {
            $addFields: {
              ask_price: "$content_ids.ask_price",
            },
          },
          {
            $unwind: "$ask_price",
          },
          {
            $match: condition1,
          },
          {
            $lookup: {
              from: "contents",
              let: { id: "$contents" },

              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$type", data.favContentType] }],
                    },
                  },
                },
              ],
              as: "content_details",
            },
          },
          {
            $lookup: {
              from: "contents",
              // let: { lat: "$miles", long: "$milesss" },

              pipeline: [
                {
                  $geoNear: {
                    near: {
                      type: "Point",
                      coordinates: [72.223, 32.234], // first long then, lat
                    },
                    distanceField: "distance",
                    // distanceMultiplier: 0.001, //0.001
                    spherical: true,
                    // includeLocs: "location",
                    maxDistance: 2000 * 1000,
                  },
                },
              ],
              as: "assignmorehopperList",
            },
          },
          {
            $project: {
              _id: 1,
              content_id: 1,
              content_details: 1,
              // content:1,
              ask_price: 1,
              image: 1,
              "content_ids._id": 1,
              "content_ids.content": 1,
              "content_ids.createdAt": 1,
              "content_ids.updatedAt": 1,
              "content_ids.type": 1,
              "content_ids.latitude": 1,
              "content_ids.longitude": 1,
              assignmorehopperList: 1,
            },
          },
          {
            $sort: sortBy2,
          },
        ]);

      res.json({
        code: 200,
        content_online: {
          task: total_fund_invested_data,
          count: total_fund_invested_data.length
        },
        favourite_Content: {
          // task: getfavarateContent,
          task: get_favourite_content_online_for_location,
          count: get_favourite_content_online_for_location.length,
        },
        broad_casted_tasks_details: {
          task: BroadCastedTasks,
          count: broadcasted_task_count,
        },
        total_fund_invested: {
          task: total,
          count: total.length,
          data: total_fund_invested_data,
        },
        content_under_offer: {
          task: resp,
          newdata: todaytotalinv,
          count: resp.length,
        },
      });
    } else {
      res.json({
        code: 200,
        content_online: {
          task: total_fund_invested_data,
          count: total_fund_invested_data.length//getcontentonline.length,
        },
        favourite_Content: {
          // task: getfavarateContent,

          task: get_favourite_content_online,
          count: get_favourite_content_online.length,
        },
        broad_casted_tasks_details: {
          task: BroadCastedTasks,
          count: broadcasted_task_count,
        },
        total_fund_invested: {
          task: total,
          count: totalCount.length,
          data: total_fund_invested_data,
        },
        content_under_offer: {
          task: resp,
          newdata: todaytotalinv,
          count: resp.length,
        },
      });
    }


  } catch (error) {

    utils.handleError(res, error);
  }
};

exports.addFCMDevice = async (req, res) => {
  try {
    const data = req.body;

    data.user_id = req.user._id;
    let FcmDevice = {
      user_id: data.user_id,
      device_id: data.device_id,
      device_type: data.device_type,
    };

    const isDeviceExist = await db.getItems(FcmDevice, FcmDevice);

    if (isDeviceExist) {
      // update the token

      isDeviceExist.device_token = data.device_token;
      await isDeviceExist.save();
    } else {
      //add the token
      // 
      const item = await createItem(FcmDevice, data);
    }

    res.json({
      code: 200,
    });
  } catch (err) {
    handleError(res, err);
  }
};

exports.addFcmToken = async (req, res) => {
  try {
    const data = req.body;
    let response;
    data.user_id = req.user._id;
    const device = await db.getItemCustom(
      { device_id: data.device_id, user_id: data.user_id },
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

exports.reportCount = async (req, res) => {
  try {
    const prev_month = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );

    const prev_monthend = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );

    const curr_mStart = new Date(moment().utc().startOf("month").format());
    const curr_m_emd = new Date(moment().utc().endOf("month").format());
    // ------------------------------------today fund invested -----------------------------------
    const weekStart = new Date(moment().utc().startOf("day").format());
    const weekEnd = new Date(moment().utc().endOf("day").format());
    const prevdaystart = new Date(moment().utc().subtract(1, "day").startOf("day").format());
    const prevdayend = new Date(moment().utc().subtract(1, "day").endOf("day").format());


    const getcontentonlines = await Contents.find({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: weekEnd,
            $gte: weekStart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    }).populate("category_id")
      .populate({
        path: "hopper_id",
        select: "avatar_id",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 })



    // const getcontentonline = await Contents.find({
    //   // paid_status: "paid",
    //   // status:
    //   updatedAt: {
    //     $lte: weekEnd,
    //     $gte: weekStart,
    //   },
    //   purchased_mediahouse: { $in: req.user._id }
    // })
    //   .populate("category_id")
    //   .populate({
    //     path: "hopper_id",
    //     populate: {
    //       path: "avatar_id",
    //     },
    //   }).sort({ createdAt: -1 });

    let weekday = {
      paid_status: "paid",
      updatedAt: {
        $lte: weekEnd,
        $gte: weekStart,
      },
    };

    const prev_weekStart = new Date(
      moment().utc().subtract(1, "day").startOf("day").format()
    );
    const prev_weekEnd = new Date(
      moment().utc().subtract(1, "day").endOf("day").format()
    );
    let lastweekday = {
      paid_status: "paid",
      updatedAt: {
        $lte: prev_monthend,
        $gte: prev_month,
      },
    };

    // const content = await db.getItems(Contents, weekday);
    const content_count = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: weekEnd,
            $gte: weekStart,
          }
        }
      },

    })
    // old code
    // getcontentonlines.length;
    const curr_week_percent = content_count / 100;
    const prevcontent = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: prevdayend,
            $gte: prevdaystart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })

    const thiscontentMonthly = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: curr_m_emd,
            $gte: curr_mStart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })

    const prevcontentMonthly = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: prev_monthend,
            $gte: prev_month,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })

    const prevcontent_count = prevcontent;
    // await db.getItems(Contents, lastweekday);
    // const prevcontent_count = prevcontent.length;
    const prev_week_percent = prevcontent_count / 100;
    let percent1;
    var type1;
    if (content_count > prevcontent_count) {
      const diff = prevcontent_count / content_count;
      percent1 = diff * 100;
      type1 = "increase";
    } else {
      const diff = content_count / prevcontent_count;
      percent1 = diff * 100;
      type1 = "decrease";
    }


    const total = await HopperPayment.aggregate([

      {
        $match: {
          media_house_id: req.user._id,
          type: "content",
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "puschases",
        },
      },

      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          data: 1,
          vat: 1,
          // netVotes: { $subtract: ["$totalupvote", "$totaldownvote"] },
        },
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // const totalpreviousMonth = await Contents.aggregate([
    //   {
    //     $group: {
    //       _id: "$purchased_publication",
    //       totalamountpaid: { $sum: "$amount_paid" },
    //     },
    //   },

    //   {
    //     $match: {
    //       $and: [
    //         { _id: { $eq: req.user._id } },
    //         { updatedAt: { $gte: prev_month } },
    //         { updatedAt: { $lt: prev_monthend } },
    //       ],
    //     },
    //   },
    //   {
    //     $addFields: {
    //       console: "$amount_paid",
    //     },
    //   },
    //   {
    //     $project: {
    //       paid_status: 1,
    //       purchased_publication: 1,
    //       amount_paid: 1,
    //       totalamountpaid: 1,
    //       console: 1,
    //       paid_status: 1,
    //     },
    //   },
    //   {
    //     $sort: { createdAt: -1 }
    //   }
    // ]);


    // const totalcurrentMonth = await Contents.aggregate([
    //   {
    //     $group: {
    //       _id: "$purchased_publication",
    //       totalamountpaid: { $sum: "$amount_paid" },
    //       data: { $push: "$$ROOT" },
    //     },
    //   },

    //   {
    //     $match: {
    //       $and: [
    //         { _id: { $eq: req.user._id } },
    //         { updatedAt: { $gte: curr_mStart } },
    //         { updatedAt: { $lt: curr_m_emd } },
    //       ],
    //     },
    //   },

    //   {
    //     $addFields: {
    //       console: "$amount_paid",
    //     },
    //   },
    //   {
    //     $project: {
    //       paid_status: 1,
    //       purchased_publication: 1,
    //       amount_paid: 1,
    //       totalamountpaid: 1,
    //       console: 1,
    //       paid_status: 1,
    //     },
    //   },
    //   {
    //     $sort: { createdAt: -1 }
    //   }
    // ]);

    const todaycontentpurchasess = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
          purchased_time: {
            $lte: curr_m_emd,
            $gte: curr_mStart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })

    const yesterdaycontentpurchases = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
          purchased_time: {
            $lte: prev_monthend,
            $gte: prev_month,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })
    const content_counts = todaycontentpurchasess//totalcurrentMonth.length;
    const prev_total_content = yesterdaycontentpurchases//totalpreviousMonth.length;

    let percent5;
    var type5;
    if (content_counts > prev_total_content) {
      const diff = prev_total_content / content_counts;
      percent5 = diff * 100;
      type5 = "increase";
    } else {
      const diff = content_counts / prev_total_content;
      percent5 = diff * 100;
      type5 = "decrease";
    }

    let yesterday = {

      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: weekEnd,
            $gte: weekStart,
          }
        }
      },

    };



    const hopperUsedTasks = await db.getItems(Contents, yesterday);
    // const datas = hopperUsedTasks.Vat.map((c) => c.accepted_by);
    const todaytodalfundinvestedbymediahouse = await Contents.aggregate([
      // // {
      // //   $group: {
      // //     _id: "$purchased_publication",
      // //     totalamountpaid: { $sum: "$amount_paid" },
      // //   },
      // // },
      // {
      //   $match: {
      //     $match: {
      //       "Vat": {
      //         $elemMatch: {
      //           purchased_mediahouse_id: req.user._id,
      //           purchased_time: {
      //             $lte: weekEnd,
      //             $gte: weekStart,
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
      // {
      //   $addFields: {
      //     console: "$amount_paid",
      //   },
      // },
      // {
      //   $unwind: "$Vat"
      // },
      {
        $match: {
          "Vat.purchased_mediahouse_id": mongoose.Types.ObjectId(req.user._id)?.toString(),
          "Vat.purchased_time": {
            $lte: weekEnd,
            $gte: weekStart
          }
        }
      },
      // {
      //   $group: {
      //     _id: null,
      //     totalAmount: { $sum: "$Vat.amount" }
      //   }
      // }


    ]);
    // const hopperUsed_task_count = hopperUsedTasks.length;
    // console;
    var arr;

    if (hopperUsedTasks.length < 1) {
      arr = 0;
    } else {
      arr = hopperUsedTasks
        .map((element) => element.amount_paid)
        .reduce((a, b) => a + b);
    }



    const todaycontentpurchase = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
          purchased_time: {
            $lte: weekEnd,
            $gte: weekStart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })

    const yesterdaycontentpurchase = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
          purchased_time: {
            $lte: prevdayend,
            $gte: prevdaystart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })



    // let currw = {
    //   paid_status: "paid",
    //   updatedAt: {
    //     $lte: weekEnd,
    //     $gte: weekStart,
    //   },
    // };


    // let currw = {

    //   "Vat": {
    //     $elemMatch: {
    //       purchased_mediahouse_id: req.user._id,
    //       purchased_time: {
    //         $lte: weekEnd,
    //         $gte: weekStart,
    //       }
    //     }
    //   },

    // };
    // const chopper = await db.getItems(Contents, currw);
    // const chopperUsed_task_count = hopperUsedTasks.length;
    // 

    // let curr_prev = {
    //   paid_status: "paid",
    //   updatedAt: {
    //     $lte: prev_weekEnd,
    //     $gte: prev_weekStart,
    //   },
    // };
    // const phopper = await db.getItems(Contents, curr_prev);
    // const phopperUsed_task_count = phopper.length;
    // 
    // var percent3;
    // var type3;
    // if (chopperUsed_task_count > phopperUsed_task_count) {
    //   const diff = phopperUsed_task_count / chopperUsed_task_count;
    //   percent3 = diff * 100;
    //   type3 = "increase";
    // } else {
    //   const diff = chopperUsed_task_count / phopperUsed_task_count;
    //   percent3 = diff * 100;
    //   type3 = "decrease";
    // }

    // const totals = await Contents.aggregate([

    //   {
    //     $group: {
    //       _id: "$purchased_publication",
    //       totalamountpaid: { $avg: "$amount_paid" },
    //       data: { $push: "$$ROOT" },
    //     },
    //   },
    //   {
    //     $match: {
    //       _id: req.user._id,
    //     },
    //   },

    //   // {
    //   //   $match: {
    //   //     purchased_mediahouse: { $in: [mongoose.Types.ObjectId(req.user._id)] }
    //   //   },
    //   // },
    //   // {
    //   //   $group: {
    //   //     _id: "$purchased_mediahouse",
    //   //     totalamountpaid: { $avg: "$amount_paid" },
    //   //     data: { $push: "$$ROOT" },
    //   //   },
    //   // },
    //   {
    //     $unwind: "$data", // Unwind the data array
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "data.hopper_id",
    //       foreignField: "_id",
    //       as: "data.hopper_id", // Rename the result to "hopper_id" within the data object
    //     },
    //   },

    //   {
    //     $unwind: "$data.hopper_id", // Unwind the hopper_id array
    //   },
    //   {
    //     $lookup: {
    //       from: "hopperpayments",
    //       localField: "data.transaction_id",
    //       foreignField: "_id",
    //       as: "data.transaction_id", // Rename the result to "hopper_id" within the data object
    //     },
    //   },
    //   {
    //     $unwind: "$data.transaction_id", // Unwind the hopper_id array
    //   },
    //   {
    //     $lookup: {
    //       from: "avatars", // Replace "avatars" with the actual collection name where avatars are stored
    //       localField: "data.hopper_id.avatar_id",
    //       foreignField: "_id",
    //       as: "data.hopper_id.avatar_id", // Rename the result to "avatar_id" within the hopper_id object
    //     },
    //   },
    //   {
    //     $unwind: "$data.hopper_id.avatar_id", // Unwind the hopper_id array
    //   },

    //   {
    //     $lookup: {
    //       from: "categories", // Replace "avatars" with the actual collection name where avatars are stored
    //       localField: "data.category_id",
    //       foreignField: "_id",
    //       as: "data.category_id", // Rename the result to "avatar_id" within the hopper_id object
    //     },
    //   },
    //   {
    //     $unwind: "$data.category_id", // Unwind the hopper_id array
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       totalamountpaid: { $first: "$totalamountpaid" }, // Keep the totalamountpaid field
    //       data: { $push: "$data" }, // Reassemble the data array
    //     },
    //   },



    //   {
    //     $addFields: {
    //       console: "$amount_paid",
    //       totalAcceptedCount: { $size: "$data" },
    //     },
    //   },

    //   {
    //     $addFields: {
    //       totalAvg: {
    //         $multiply: [
    //           { $divide: ["$totalamountpaid", "$totalAcceptedCount"] },
    //           1,
    //         ],
    //       },
    //     },
    //   },


    //   {
    //     $project: {
    //       paid_status: 1,
    //       purchased_publication: 1,
    //       totalAvg: 1,
    //       amount_paid: 1,
    //       totalamountpaid: 1,
    //       totalAcceptedCount: 1,
    //       console: 1,
    //       data: {
    //         $map: {
    //           input: "$data",
    //           as: "item",
    //           in: {
    //             $mergeObjects: [
    //               "$$item",
    //               {
    //                 totalAcceptedCount: { $size: "$$item.content" } // Calculate the length of items.content
    //               },
    //               {
    //                 totalAvg: {
    //                   $cond: [

    //                     { $eq: ["$$item.totalAcceptedCount", 0] }, // Check if totalAcceptedCount is 0 for each document
    //                     0, // If true, set totalAvg to 0 for that document
    //                     {
    //                       $multiply: [
    //                         { $divide: ["$$item.item.amount_paid", "$$item.item.totalAcceptedCount"] },
    //                         100,
    //                       ],
    //                     } // If false, calculate the totalAvg for that document
    //                   ]
    //                 }
    //               }
    //             ]
    //           }
    //         }
    //       },
    //     },
    //   },
    //   // {
    //   //   $project: {
    //   //     paid_status: 1,
    //   //     purchased_publication: 1,
    //   //     totalAvg: 1,
    //   //     amount_paid: 1,
    //   //     totalamountpaid: 1,
    //   //     console: 1,
    //   //     data: 1,
    //   //     paid_status: 1,
    //   //   },
    //   // },
    //   {
    //     $sort: { createdAt: -1 }
    //   }
    // ]);


    const newaveragetesttotals = await Contents.aggregate([

      {
        $match: {
          "Vat.purchased_mediahouse_id": mongoose.Types.ObjectId(req.user._id)?.toString(),
        }
      },



      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id",
        },
      },

      {
        $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }, // Unwind the hopper_id array
      },
      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     localField: "data.transaction_id",
      //     foreignField: "_id",
      //     as: "data.transaction_id", // Rename the result to "hopper_id" within the data object
      //   },
      // },
      // {
      //   $unwind: "$data.transaction_id", // Unwind the hopper_id array
      // },
      {
        $lookup: {
          from: "avatars", // Replace "avatars" with the actual collection name where avatars are stored
          localField: "hopper_id.avatar_id",
          foreignField: "_id",
          as: "hopper_id.avatar_id", // Rename the result to "avatar_id" within the hopper_id object
        },
      },
      {
        $unwind: "$hopper_id.avatar_id", // Unwind the hopper_id array
      },

      {
        $lookup: {
          from: "categories", // Replace "avatars" with the actual collection name where avatars are stored
          localField: "category_id",
          foreignField: "_id",
          as: "category_id", // Rename the result to "avatar_id" within the hopper_id object
        },
      },
      {
        $unwind: "$category_id", // Unwind the hopper_id array
      },



      {
        $sort: { createdAt: -1 }
      }
    ]);

    const totalpreviousMonths = await Contents.aggregate([
      {
        $group: {
          _id: "$purchased_publication",
          totalamountpaid: { $avg: "$amount_paid" },
        },
      },
      // {
      //   $match: {
      //     _id: req.user._id,
      //   },
      // },

      // {
      //   $match: {
      //     _id: req.user._id,
      //     updatedAt: {
      //       $gte: prev_month,
      //       $lt: prev_monthend,
      //     },
      //   },
      // },

      {
        $match: {
          $and: [
            { _id: { $eq: req.user._id } },
            { updatedAt: { $gte: prev_month } },
            { updatedAt: { $lt: prev_monthend } },
          ],
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);



    const totalcurrentMonths = await Contents.aggregate([
      {
        $group: {
          _id: "$purchased_publication",
          totalamountpaid: { $avg: "$amount_paid" },
          // vat:{$sum:"$"}
        },
      },
      {
        $match: {
          $and: [
            { _id: { $eq: req.user._id } },
            { updatedAt: { $gte: curr_mStart } },
            { updatedAt: { $lt: curr_m_emd } },
          ],
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);




    const content_countss = totalcurrentMonths.length;
    const prev_total_contents = totalpreviousMonths.length;

    let percent6;
    var type6;
    if (content_countss > prev_total_content) {
      const diff = prev_total_contents / content_countss;
      percent6 = diff * 100;
      type6 = "increase";
    } else {
      const diff = content_countss / prev_total_contents;
      percent6 = diff * 100;
      type6 = "decrease";
    }

    res.json({
      code: 200,
      content_online: {
        task: getcontentonlines,//getcontentonline,
        count: getcontentonlines.length,
        getcontentonlines: getcontentonlines,
        type: await calculatePercentage(content_count, prevcontent).type,
        percent: await calculatePercentage(content_count, prevcontent).percentage,
        // type: type1,
        // percent: percent1 || 0,
      },
      total_fund_invested: {
        task: total[0],
        count: total.length > 0
          ? total[0].totalamountpaid
          : 0,

        console: content_counts,
        console2: prev_total_content,
        type: await calculatePercentage(content_counts, prev_total_content).type,
        percent: await calculatePercentage(content_counts, prev_total_content).percentage,
        // type: type5,
        // percent: percent5 || 0,
      },
      average_content_price: {
        task: newaveragetesttotals,
        // console:newaveragetesttotals,
        count: newaveragetesttotals.length > 0
          ? newaveragetesttotals[0].overallAverage
          : 0,// totals[0].totalamountpaid || 0,
        type: await calculatePercentage(content_counts, prev_total_content).type,
        percent: await calculatePercentage(content_counts, prev_total_content).percentage,
        // type: type6,
        // percent: percent6 || 0,
      },
      content_purchase_moment: {
        task: percent1,
        count: await calculatePercentage(thiscontentMonthly, prevcontentMonthly).percentage,
        type: await calculatePercentage(thiscontentMonthly, prevcontentMonthly).type,
        percent: await calculatePercentage(thiscontentMonthly, prevcontentMonthly).percentage,
        // type: type1,
        // percent: percent1 || 0,
      },
      today_fund_invested: {
        task: hopperUsedTasks,
        task1: todaytodalfundinvestedbymediahouse,
        count: arr,
        type: await calculatePercentage(todaycontentpurchase, yesterdaycontentpurchase).type,
        percent: await calculatePercentage(todaycontentpurchase, yesterdaycontentpurchase).percentage,
        // type: type3,
        // percent: percent3 || 0,
      },
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.findacceptedtasks = async (req, res) => {
  try {
    const data = req.body;
    const users = await acceptedtask.aggregate([

      {
        $match: { task_id: mongoose.Types.ObjectId(req.query.task_id) },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
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
        $lookup: {
          from: "avatars",
          let: { hopper_id: "$hopper_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                },
              },
            },
          ],
          as: "avatar_detals",
        },
      },

      {
        $lookup: {
          from: "rooms",
          let: {
            hopper_id: "$hopper_id._id",
            task_id: mongoose.Types.ObjectId(req.query.task_id),
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$sender_id", "$$hopper_id"] },
                    { $eq: ["$task_id", "$$task_id"] },
                  ],
                },
              },
            },
          ],
          as: "roomsdetails",
        },
      },
      { $unwind: "$roomsdetails" },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    var resp = await Room.findOne({
      $or: [
        {
          $and: [
            {
              task_id: mongoose.Types.ObjectId(req.query.task_id),
            },
            {
              sender_id: mongoose.Types.ObjectId(req.query.receiver_id),
            },
          ],
        },
        {
          $and: [
            {
              task_id: mongoose.Types.ObjectId(req.query.task_id),
            },
            {
              receiver_id: mongoose.Types.ObjectId(req.query.receiver_id),
            },
          ],
        },
      ],
    });
    res.json({
      code: 200,
      response: users,
      room_id: resp.room_id,
    });
  } catch (err) {
    utils.handleError(res, err);
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

exports.getAllchat = async (req, res) => {
  try {
    const data = req.body;

    if (data.hasOwnProperty("room_id")) {

      var resp = await Chat.find({
        $or: [
          {
            $and: [
              {
                room_id: data.room_id,
              },
            ],
          },
          {
            $and: [
              {
                room_id: data.room_id,
              },
              {
                receiver_id: data.sender_id,
              },
              {
                sender_id: data.receiver_id,
              },
            ],
          },
        ],
      })
        .populate("receiver_id sender_id")
        .populate([
          {
            path: "receiver_id",
            populate: {
              path: "avatar_id",
            },
          },
          "sender_id",
        ]).sort({ createdAt: -1 });
      return res.json({
        code: 200,
        response: resp,
      });
    } else {
      return res.json({
        code: 200,
        response: [],
      });
    }

  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.adminlist = async (req, res) => {
  try {
    // const data = req.params;

    const draftDetails = await Employee.find({}).sort({ createdAt: -1 });

    res.json({
      code: 200,
      data: draftDetails,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.avgRating = async (req, res) => {
  try {
    const data = req.query;
    const value = mongoose.Types.ObjectId(req.user._id);
    // 


    let filters = {
      from: value,
    }
    let val

    if (data.hasOwnProperty("weekly")) {
      val = "week";


    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year"
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    let prevcontent, content_count
    if (data.hasOwnProperty(val)) {
      filters.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart

      }


      prevcontent = await rating.countDocuments({
        from: value,
        createdAt: {
          $gte: new Date(moment().utc().subtract(1, val).startOf(val).format()),
          $lte: new Date(moment().utc().subtract(1, val).endOf(val).format()),
        },
      })

      content_count = await rating.countDocuments({
        from: value,
        createdAt: {
          $gte: new Date(moment().utc().startOf(val).format()),
          $lte: new Date(moment().utc().endOf(val).format()),
        },
      })
    }
    else {
      prevcontent = await rating.countDocuments({
        from: value,
        createdAt: {
          $gte: new Date(moment().utc().subtract(1, "month").startOf("month").format()),
          $lte: new Date(moment().utc().subtract(1, "month").endOf("month").format()),
        },
      })

      content_count = await rating.countDocuments({
        from: value,
        createdAt: {
          $gte: new Date(moment().utc().startOf("month").format()),
          $lte: new Date(moment().utc().endOf("month").format()),
        },
      })
    }



    const draftDetails = await rating.aggregate([
      {
        $match: filters
      },
      {
        $group: {
          _id: "$from",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);




    return res.json({
      code: 200,
      data: draftDetails,
      type: await calculatePercentage(content_count, prevcontent).type,
      percentage: await calculatePercentage(content_count, prevcontent).percentage,
      // type: "increase",
      // percentage: 0,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.allratedcontent = async (req, res) => {
  try {
    const data = req.query
    const weeks = new Date(moment().utc().startOf("week").format());
    const weeke = new Date(moment().utc().endOf("week").format());
    const prevw = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const prevwe = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );
    let filters = { to: mongoose.Types.ObjectId(req.user._id) }
    if (data.hasOwnProperty("received")) {
      filters.rating = {
        $eq: Number(data.received),
        // $gte: Number(data.startrating),
      }; //{[Op.gte]: data.startdate};
    }
    if (data.type == "received") {
      let val = "year";

      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }

      const yesterdayStart = new Date(moment().utc().startOf(val).format());
      const yesterdayEnd = new Date(moment().utc().endOf(val).format());
      filters.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart

      }
    }





    let filtersCount = { to: mongoose.Types.ObjectId(req.user._id) }
    if (data.type == "received" && data.hasOwnProperty("endrating")) {
      filtersCount.rating = {
        $eq: Number(data.endrating),
        // $gte: Number(data.startrating),
      }; //{[Op.gte]: data.startdate};
    }
    if (data.type == "receivedcount") {
      let val = "year";
      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }
      // if (data.receivedcount == "weekly") {
      //   val = "week";
      // }

      // if (data.receivedcount == "monthly" ) {
      //   val = "month";
      // }

      // if (data.receivedcount  == "daily") {
      //   val = "day";
      // }

      // if (data.receivedcount == "yearly" ) {
      //   val = "year"
      // }

      const yesterdayStart = new Date(moment().utc().startOf(val).format());
      const yesterdayEnd = new Date(moment().utc().endOf(val).format());
      filtersCount.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart

      }
    }

    let plive = {
      from: mongoose.Types.ObjectId(req.user._id),
      createdAt: { $lte: weeke, $gte: weeks },
    };
    const currentWeekfrom = await rating.find(plive);
    const currentWeekfromCount = currentWeekfrom.length;
    let plive2 = {
      from: mongoose.Types.ObjectId(req.user._id),
      createdAt: { $lte: prevwe, $gte: prevw },
    };
    const previousWeekfrom = await rating.find(plive2);
    const previousWeekfromCount = previousWeekfrom.length;
    let percentage5, type5;
    if (currentWeekfromCount > previousWeekfromCount) {
      (percentage5 = (previousWeekfromCount / currentWeekfromCount) * 100),
        (type5 = "increase");
    } else {
      (percentage5 = (currentWeekfromCount / previousWeekfromCount) * 100),
        (type5 = "decrease");
    }


    // const condition1 = { from: mongoose.Types.ObjectId(req.user._id) }

    // if (data.hasOwnProperty("send") && data.hasOwnProperty("endrating")) {
    //   condition1.rating = {
    //     $eq: Number(data.endrating),
    //     // $gte: Number(data.startrating),
    //   }; //{[Op.gte]: data.startdate};
    // }
    let senderfilters = { from: mongoose.Types.ObjectId(req.user._id) }
    if (data.hasOwnProperty("send")) {
      senderfilters.rating = {
        $eq: Number(data.send),
        // $gte: Number(data.startrating),
      }; //{[Op.gte]: data.startdate};
    }
    if (data.type == "send") {
      let val = "year";

      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }

      const yesterdayStart = new Date(moment().utc().startOf(val).format());
      const yesterdayEnd = new Date(moment().utc().endOf(val).format());
      senderfilters.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart

      }
    }





    let sendfiltersCount = { to: mongoose.Types.ObjectId(req.user._id) }
    if (data.type == "send" && data.hasOwnProperty("endrating")) {
      sendfiltersCount.rating = {
        $eq: Number(data.endrating),
        // $gte: Number(data.startrating),
      }; //{[Op.gte]: data.startdate};
    }
    if (data.type == "sendcount") {
      let val = "year";

      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year"
      }

      const yesterdayStart = new Date(moment().utc().startOf(val).format());
      const yesterdayEnd = new Date(moment().utc().endOf(val).format());
      sendfiltersCount.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart

      }
    }
    // let senderfilters2 = { }
    // const getallcontent = await rating
    //   .find({})
    //   .populate("to from content_id task_content_id")
    //   .populate({
    //     path: "to",
    //     populate: {
    //       path: "avatar_id",
    //     },
    //   }).sort({ createdAt: -1 }).limit(data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER).skip(data.offset ? parseInt(data.offset) : 0);

    //   const getallcontent2 = await rating.countDocuments({})

    // const [getallcontent, getallcontentCount] = await Promise.all([
    //   rating
    //     .find({})
    //     .populate("to from content_id task_content_id")
    //     .populate({
    //       path: "from",

    //       populate: {
    //         path: "avatar_id",
    //       },
    //     }).sort({ createdAt: -1 }).limit(data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER).skip(data.offset ? parseInt(data.offset) : 0),

    //   rating.countDocuments({})
    // ])



    const [getallcontent, total] = await Promise.all([
      rating
        .find({ sender_type: "Mediahouse", rating: { $gt: 0 } })
        .populate("from content_id task_content_id")
        .populate({
          path: "from",
          populate: {
            path: "avatar_id",
          },
        })
        .sort({ createdAt: -1 })
        .limit(data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER)
        .skip(data.offset ? parseInt(data.offset) : 0)
        .then(results => results.filter(rating => rating.from !== null)), // Filter out null 'from'

      rating.countDocuments({}) // Total count without filtering
    ]);

    const getallcontentCount = getallcontent.length;
    const getallcontentcount = await rating
      .find(senderfilters).count()
    let condition = {
      to: mongoose.Types.ObjectId(req.user._id),
      createdAt: { $lte: weeke, $gte: weeks },
    };
    const currentWeekto = await rating.find(condition);
    const currentWeektoCount = currentWeekto.length;
    let condition2 = {
      to: mongoose.Types.ObjectId(req.user._id),
      createdAt: { $lte: prevwe, $gte: prevw },
    };
    const previousWeekto = await rating.find(condition2);
    const previousWeektoCount = previousWeekto.length;
    let percentage, type;
    if (currentWeekfromCount > previousWeektoCount) {
      (percentage = (previousWeektoCount / currentWeektoCount) * 100),
        (type = "increase");
    } else {
      (percentage = (currentWeektoCount / previousWeektoCount) * 100),
        (type = "decrease");
    }


    // const condition21 = { to: mongoose.Types.ObjectId(req.user._id) }

    // if (data.hasOwnProperty("received") && data.hasOwnProperty("endrating")) {
    //   condition21.rating = {
    //     $eq: Number(data.endrating),
    //     // $gte: Number(data.startrating),
    //   }; //{[Op.gte]: data.startdate};
    // }
    const getallcontentforrecevied = await rating
      .find(filters)
      .populate("to from content_id task_content_id")
      .populate({
        path: "from",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 });

    const getallcontentforreceviedCount = await rating
      .find(filters).count()





    const prevcontent = await rating.countDocuments({
      from: mongoose.Types.ObjectId(req.user._id),
      createdAt: {
        $gte: new Date(moment().utc().subtract(1, "month").startOf("month").format()),
        $lte: new Date(moment().utc().subtract(1, "month").endOf("month").format()),
      },
    })

    const content_count = await rating.countDocuments({
      from: mongoose.Types.ObjectId(req.user._id),
      createdAt: {
        $gte: new Date(moment().utc().startOf("month").format()),
        $lte: new Date(moment().utc().endOf("month").format()),
      },
    })




    const prevcontent1 = await rating.countDocuments({
      to: mongoose.Types.ObjectId(req.user._id),
      createdAt: {
        $gte: new Date(moment().utc().subtract(1, "day").startOf("day").format()),
        $lte: new Date(moment().utc().subtract(1, "day").endOf("day").format()),
      },
    })

    const content_count1 = await rating.countDocuments({
      to: mongoose.Types.ObjectId(req.user._id),
      createdAt: {
        $gte: new Date(moment().utc().startOf("day").format()),
        $lte: new Date(moment().utc().endOf("day").format()),
      },
    })
    return res.json({
      code: 200,
      allsendrating: {
        data: getallcontent,
        type: await calculatePercentage(content_count, prevcontent).type,
        percentage: await calculatePercentage(content_count, prevcontent).percentage,
        // type: type5,
        // percentage: percentage5 || 0,
      },
      allrecievedrating: {
        data: getallcontentforrecevied,
        type: await calculatePercentage(content_count1, prevcontent1).type,
        percentage: await calculatePercentage(content_count1, prevcontent1).percentage,
        // type: type,
        // percentage: percentage || 0,
      },
      review_recivedcount: getallcontentforreceviedCount,
      review_given_count: getallcontentcount,
      getallcontentCount
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.buyuploadedcontent = async (req, res) => {
  try {
    const data = req.body;

    const added = await Chat.updateMany(
      {
        image_id: req.body.image_id,
      },
      { paid_status: true }
    );

    data.paid_status = true;

    const Create_Office_Detail = await db.createItem(data, Chat);

    const added1 = await Uploadcontent.update(
      {
        _id: req.body.image_id,
      },
      {
        purchased_publication: req.user._id,
        paid_status: true,
        amount_paid: req.body.amount_paid,
      }
    );

    res.json({
      code: 200,
      data: added,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.payout = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",
      payment_method: "pm_card_visa",
    });

    return res.status(200).json({
      code: 200,
      message: paymentIntent,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

const downloadZip = async (data, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ImagesUrl = "";
      const archiveFiles = [];

      const zipName = Date.now() + "_images.zip";
      const zipPath = path.join(__dir, "downloads", zipName);

      const archive = archiver("zip", {
        zlib: { level: 9 },
      });

      const output = fs.createWriteStream(zipPath);
      output.on("close", () => {


        // delete all files which bind up in zip
        archiveFiles.forEach((r) => {
          try {
            fs.unlink(r.path, (err) => {
              if (err) {
                throw err;
              }
              // 
            });
          } catch (err) {

          }
        });

        res.setHeader("Content-disposition", `attachment; filename=${zipName}`);
        res.setHeader("Content-type", "application/zip");

        const filestream = fs.createReadStream(zipPath);

        filestream.on("open", () => {
          filestream.pipe(res);
        });

        filestream.on("end", async () => {


          fs.unlink(zipPath, (err) => {
            if (err) {
              throw err;
            }
          });
        });

        filestream.on("error", (err) => {

        });
      });

      output.on("end", () => {

      });

      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {

        } else {
          throw err;
        }
      });

      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output);

      const batch = data;

      for (let i = 0; i < batch.length; i++) {
        const original_image = await db.getCustomItem(CollectionOriginalImage, {
          collection_image_id: batch[i].collection_img_id,
        });

        var height = original_image.height;
        var width = original_image.width;

        var w = width; //  width of the image
        var h = height; // height of the image

        if (h < w) {
          // Vertical
          height = COVER_IMAGE_SIZE.height;
          width = COVER_IMAGE_SIZE.width;
        } else {
          // Horizontal
          height = COVER_IMAGE_SIZE.width;
          width = COVER_IMAGE_SIZE.height;
        }

        const preSignedURL = await utils.getSignedURL(
          original_image.original_image
        );

        const baseURL = await utils.uploadImagekit(preSignedURL);

        const { url } = await utils.resizeImage(baseURL, width, height);

        const myURL = new URL(url);



        /*const buffer = await utils.URLToBuffer(
          url,      
        ); */

        /*
  
  
        /*  const JIMP_FILE_NAME = `${__dir}jimpDownloads_zip/file.${
            download.path.split('.').reverse()[0]
          }`
  
          const img_detail = await Jimp.read(download.path)
          img_detail
            .resize(height, width) // resize
            .quality(60) // set JPEG quality
            .write(JIMP_FILE_NAME)*/

        // 

        const filename = path.basename(original_image.original_image);
        const contentType = mime.lookup(filename);

        archiveFiles.push({
          name: original_image.original_image.substring(
            original_image.original_image.lastIndexOf("/") + 1
          ),
          path: myURL,
          contentType,
        });

        /* try{
           fs.unlink(download.path, err => {
             if (err) {
               throw err
             }
             
           })
         }catch(err){
           
         }*/
      }

      for (let i = 0; i < archiveFiles.length; i++) {
        const { name, path, contentType } = archiveFiles[i];
        archive.append(fs.createReadStream(path), { name });
      }

      /*const batchSize = 3
      const batches = Math.ceil(data.length / batchSize)

      for (let j = 0; j < batches; j++) {
        const batchStart = j * batchSize
        const batchEnd = Math.min((j + 1) * batchSize, data.length)
        const batch = data.slice(batchStart, batchEnd)

        const archiveFiles = []

        
      }*/



      archive.finalize();
    } catch (err) {
      reject(buildErrObject(422, err.message));
    }
  });
};

const generateRandomName = () => {
  const randomString = Math.random().toString(36).substring(2, 15);
  const timestamp = new Date().getTime();
  return `${randomString}_${timestamp}`;
};
function createTextFile(heading, description, filePath) {
  const content = `${heading}\n\n${description}`;
  fs.writeFileSync(filePath, content, 'utf8');

}
const downloadFiles = async (filePaths, bucketPath) => {
  const downloadedFiles = [];
  const s3 = new AWS.S3();
  for (const filePath of filePaths) {
    const S3_BUCKET_NAME = process.env.Bucket ;
    // contentData
    const S3_KEY = `public/${bucketPath}/${filePath}`;
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

const downloadFilesforContent = async (filePaths, bucketPath, Content_id) => {
  const downloadedFiles = [];
  const s3 = new AWS.S3();
  let added1 = await Contents.findOne({
    _id: mongoose.Types.ObjectId(Content_id)
  });
  const randomFileName = generateRandomName();
  const outputFilePath2 = `${randomFileName}.txt`;
  // const value = createTextFile(added1.heading, added1.description, outputFilePath2)
  downloadedFiles.push({ name: outputFilePath2, data: `${added1.heading}\n\n${added1.description}` })




  for (const filePath of filePaths) {
    const S3_BUCKET_NAME = process.env.Bucket ;
    // contentData
    const S3_KEY = `public/${bucketPath}/${filePath}`;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: S3_KEY, // The S3 object key (path) of the file
    };


    const response = await s3.getObject(params).promise()

    // Save the downloaded file locally or in memory as needed
    downloadedFiles.push({ name: filePath, data: response.Body });
  }

  return downloadedFiles;
};



const createZipArchive = async (files, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream(outputFilePath);

    archive.pipe(output);

    files.forEach((file) => {
      archive.append(file.data, { name: file.name });
    });

    archive.on('error', reject);
    output.on('close', resolve);

    archive.finalize();
  });
};


exports.image_pathdownload = async (req, res) => {
  try {
    if (req.query.type == "content") {
      let added1 = await Contents.findOne({
        _id: req.query.image_id,
      });

      // const filePaths = added1.content.map((file) => file.media);

      const filePaths = added1.content.map((file) => {
        const value = file.media.split("/");
        const strforvideo = value[value.length - 1];
        return strforvideo;
      });

      const downloadedFiles = await downloadFilesforContent(filePaths, "contentData", req.query.image_id);

      const randomFileName = generateRandomName();
      const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/zip/${randomFileName}.zip`;
      const outputFilePath2 = `/var/www/mongo/presshop_rest_apis/public/zip/${randomFileName}.txt`;
      // // const value =   createTextFile(added1.heading,added1,outputFilePath2)
      // // downloadedFiles.push(value)
      await createZipArchive(downloadedFiles, outputFilePath);
      // res.setHeader(`Content-disposition', 'attachment; filename=${randomFileName}.zip`);
      //  res.setHeader('Content-type', 'application/zip');
      const contentDetails = await Contents.findOne({ _id: mongoose.Types.ObjectId(req.query.image_id) })

      if (!contentDetails.zip_url) {
        const buffer1 = await fs.readFileSync(outputFilePath);
        let media = await uploadFiletoAwsS3BucketforZip({
          fileData: buffer1,
          path: `public/zip`,
        });

        const final = media.data.replace("https://uat-presshope.s3.eu-west-2.amazonaws.com", "https://uat-cdn.presshop.news");


        const userDetails = await Contents.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.image_id) }, { $set: { zip_url: final } }, { new: true })
      }






      const response = await axios.get(contentDetails.zip_url, { responseType: 'stream' });



      res.setHeader('Content-Disposition', `attachment; filename=${randomFileName}.zip`);
      res.setHeader('Content-Type', 'application/zip');

      // Pipe the image stream to the response
      response.data.pipe(res);
      // res.download(final);

      fs.unlinkSync(outputFilePath)


      // console.log("final--------final",media.filename)
      // const S3_KEY = `public/zip/${media.filename}`;
      // const s3 = new AWS.S3();
      // const s3Stream = s3.getObject({ Bucket: Bucket, Key: S3_KEY }).createReadStream();

      // // Set response headers
      // res.setHeader('Content-Disposition', `attachment; filename="${media.filename}"`);
      // res.setHeader('Content-Type', 'application/octet-stream'); // You might need to adjust the content type based on your file type

      // s3Stream.pipe(res);

      // s3Stream.on("error", (err) => {
      //   console.log(err);
      //   res.status(500).send('Error downloading file.');
      // });

      // s3Stream.on("close", () => {
      //   console.log("Stream closed now");
      // });

      // return res.status(200).json({
      //   code: 200,
      //   // message: `https://uat.presshop.live/presshop_rest_apis/public/zip/${randomFileName}.zip`,
      //   // msg:arr2,
      // });
    } else {
      let added1 = await Uploadcontent.findOne({
        _id: req.query.image_id,
      });
      const arr = []
      await arr.push(added1.imageAndVideo)
      const image_path = `https://uat.presshop.live/presshop_rest_apis/public/uploadContent/${added1.imageAndVideo}`;
      const filePaths = arr
      const downloadedFiles = await downloadFiles(filePaths, "uploadContent");
      const randomFileName = generateRandomName();
      const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/zip/${randomFileName}.zip`;

      await createZipArchive(downloadedFiles, outputFilePath);
      // res.setHeader('Content-disposition', 'attachment; filename=download.zip');
      //  res.setHeader('Content-type', 'application/zip');

      res.setHeader('Content-Disposition', `attachment; filename=${randomFileName}.zip`);
      res.setHeader('Content-Type', 'application/zip');

      res.download(outputFilePath);
      // return res.status(200).json({
      //   code: 200,
      //   // message: `https://uat.presshop.live/presshop_rest_apis/public/zip/${randomFileName}.zip`,
      //   // msg:arr2,
      // });
      // 
      // return res.status(200).json({
      //   code: 200,
      //   message: image_path,
      //   // msg:arr2,
      // });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};


// exports.image_pathdownload = async (req, res) => {
//   try {
//     if (req.query.type == "content") {
//       let added1 = await Contents.find({
//         _id: req.query.image_id,
//       });

//       let archiveFiles = [];

//       const archive = archiver("zip", {
//         zlib: { level: 9 }, // Compression level (optional)
//       });

//       const randomFileName = generateRandomName();
//       const outputFilePath = `/var/www/mongo/presshop_rest_apis/public/zip/${randomFileName}.zip`;
//       const output = fs.createWriteStream(outputFilePath);
//       archive.pipe(output);
//       const files = added1.map((x) => x.content).flatMap((x) => x);
//       

//       const datas = files.forEach((file) => {
//         archiveFiles.push({
//           name: file.media,
//           path: `/var/www/mongo/presshop_rest_apis/public/contentData/${file.media}`,
//         });
//         // archive.file(file.media, { name: file.media });
//       });
//       for (let i = 0; i < archiveFiles.length; i++) {
//         const { name, path, contentType } = archiveFiles[i];
//         archive.append(fs.createReadStream(path), { name });
//       }

//       

//       // Finalize the ZIP archive
//       archive.finalize();
//       // });
//       return res.status(200).json({
//         code: 200,
//         message: `https://uat.presshop.live/presshop_rest_apis/public/zip/${randomFileName}.zip`,
//         // msg:arr2,
//       });
//     } else {
//       let added1 = await Uploadcontent.findOne({
//         _id: req.query.image_id,
//       });
//       const image_path = `https://uat.presshop.live/presshop_rest_apis/public/uploadContent/${added1.imageAndVideo}`;
//       
//       return res.status(200).json({
//         code: 200,
//         message: image_path,
//         // msg:arr2,
//       });
//     }
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };

exports.createPaymentIntent = async (req, res) => {
  try {
    const data = req.body;
    // const result = await stripe.customers.create({ email: data.email });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount,
      currency: "usd",
      // payment_method_types: ["card"],
      amount: data.amount * 100,
      customer: req.user.stripe_customer_id,
      payment_method: data.paymentMethod,
      confirmation_method: "manual", // For 3D Security
      description: "Buy Product",
    });
    res.json({
      code: 200,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {

    utils.handleError(res, error);
  }
};

exports.getallpublishedcontent = async (req, res) => {
  try {
    const hopperuploadedcontent = await Contents.find({
      hopper_id: req.query.hopper_id,
      status: "published",
      is_hide: false,
      $or: [
        { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
        // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
        { purchased_mediahouse: { $exists: false } },
        { purchased_mediahouse: { $size: 0 } }
      ],
    }).select("_id hopper_id content heading description createdAt").sort({ createdAt: -1 });

    res.status(200).json({
      code: 200,
      response: hopperuploadedcontent,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


const redis = require('redis');
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });


exports.getallhopperlist = async (req, res) => {
  try {




    const totalcurrentMonths = await Contents.aggregate([
      {
        $group: {
          _id: "$hopper_id",
        },
      },
      // {
      //   $lookup: {
      //     from: "rooms",
      //     let: {
      //       hopper_id: "$_id",
      //       task_id: mongoose.Types.ObjectId(req.query.task_id),
      //     },

      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$sender_id", "$$hopper_id"] },
      //               { $eq: ["$task_id", "$$task_id"] },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "roomsdetails",
      //   },
      // },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
            { $unwind: "$avatar_id" },
          ],
          as: "hopper_id",
        },
      },
      { $unwind: "$hopper_id" },
      {
        $sort: { "hopper_id.createdAt": -1 }
      }
    ]);




    let success = await myCache.set("myKey", totalcurrentMonths, 10000);

    // await redisclient.set("resp", totalcurrentMonths);

    // redisclient.setex(redisKey, 3600, JSON.stringify(totalcurrentMonths));
    res.status(200).json({
      code: 200,
      response: await myCache.get("myKey")//totalcurrentMonths,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.latestcontentbyhopper = async (req, res) => {
  try {
    const findalldata = await lastchat.findOne({ hopper_id: req.query.hopper_id, mediahouse_id: req.user._id }).sort({ createdAt: -1 }).populate("content_id")

    const findalldatachat = await Chat.find({ room_id: findalldata.room_id })

    res.status(200).json({
      code: 200,
      response: findalldata,
      findalldatachat: findalldatachat
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.gettlistoduploadedcontent = async (req, res) => {
  try {
    const data = req.query;
    let condition = { createdAt: -1 };
    let maincondition = {
      purchased_publication: req.user._id,
      paid_status: true,
    };
    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year"
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    if (data.hasOwnProperty("highpriceContent")) {
      condition = { amount_paid: -1 };
    }
    if (data.hasOwnProperty("lowpriceContent")) {
      condition = { amount_paid: 1 };
    }

    if (data.hasOwnProperty("maxPrice") && data.hasOwnProperty("minPrice")) {
      maincondition = {
        purchased_publication: req.user._id,
        paid_status: true,
        amount_paid: {
          $lte: data.maxPrice,
          $gte: data.minPrice,
        },
      };
    }

    if (data.hasOwnProperty("type")) {
      maincondition = {
        purchased_publication: req.user._id,
        paid_status: true,
        type: data.type,
      };
    } else {
      maincondition.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      };
    }

    const uploaded = await Uploadcontent.find(maincondition)
      .populate("task_id")
      .sort(condition);

    res.status(200).json({
      code: 200,
      response: uploaded,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

function addDueDate(post) {
  // Get the created date.
  const createdDate = moment(post.createdAt);

  // Calculate the due date, which is 10 days after the created date.
  const dueDate = createdDate.add(10, "days");

  // Set the due date on the post.
  post.Due_date = dueDate.format("YYYY-MM-DD");

  return post;
}

exports.challengePaymentSuccess = async (req, res) => {
  try {
    var currentData = moment().format("DD-MM-YYYY");
    const balance = await stripe.balance.retrieve();
    console.log('Account Balance:', balance);

    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    const paymentIntentId = session.payment_intent;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);


    // Step 3: Get the Charge Object
    const latestcharge = paymentIntent?.latest_charge
    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
    // const charge = paymentIntent.charges.data[0];
    // Step 4: Retrieve Fee Details from the Balance Transaction
    const balanceTransaction = await stripe.balanceTransactions.retrieve(charge.balance_transaction);
    const stripeFeeforAll = balanceTransaction.fee / 100;
    const netAmount = balanceTransaction.net / 100;

    // const customer = await stripe.customers.retrieve(session.metadata.customer);
    const finduser = await User.findOne({ _id: session.metadata.user_id })


    // finalizee the invoize
    const invoice = await stripe.invoices.finalizeInvoice(
      session.metadata.invoice_id
    );

    // const creditNote = await stripe.creditNotes.create({
    //   invoice: session.metadata.invoice_id,
    // });
    const getallinvoices = await stripe.invoices.retrieve(
      session.metadata.invoice_id
    );

    const invoice_number = getallinvoices.number;




    // main calulation ::::===============
    const vat = (session.metadata.amount * 20) / 100;
    const originalamount = session.metadata.amount
    const value = (parseFloat(session.metadata.amount) + (session.metadata.offer == true || session.metadata.offer == "true" ? 0 : parseFloat(vat))) - parseFloat(session?.total_details?.amount_discount / 100);
    // const value = (parseFloat(session.metadata.amount) + parseFloat(vat))  - parseInt(session?.total_details?.amount_discount/100);   // hopper content value + vat 144
    const newcommistionaddedVat = (session.metadata.offer == true || session.metadata.offer == "true") ? parseFloat(session?.total_details?.amount_tax / 100) : parseFloat(session?.total_details?.amount_tax / 100) //value * 0.20     // 24 for 100 rs content because vat is addedd to 120 +vat

    // const final 

    let apiUrl, apiurlfortransactiondetails


    if (session.metadata.type == "content") {
      apiUrl = `https://uat.presshop.live:5019/mediahouse/image_pathdownload?image_id=${session.metadata.product_id}&type=content`
      //  aaa       =========================================start ------======================================
      await db.updateItem(session.metadata.product_id, Contents, {
        // is_hide:true,
        sale_status: "sold",
        paid_status: "paid",
        amount_paid: value,
        purchased_publication: session.metadata.user_id,

      });
      //  aaa       =========================================end ------========================================



      const findreceiver = await Contents.findOne({
        _id: session.metadata.product_id,
      });


      const findroomforSocket = await Chat.findOne({
        paid_status: false,
        message_type: "accept_mediaHouse_offer",
        sender_id: session.metadata.user_id,
        image_id: session.metadata.product_id
      })




      if (findreceiver) {
        console.log("value-------",)


        // const valueforchat = {
        //   image_id: session.metadata.product_id,

        //   receiver_id: session.metadata.user_id,
        //   message_type: "PaymentIntentApp",
        //   presshop_commission: parseFloat(session.metadata.application_fee),
        //   stripe_fee: parseFloat(stripeFeeforAll),
        //   amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
        //   hopper_price: session.metadata.hopper_price,
        //   payable_to_hopper: (value) - (parseFloat(session.metadata.application_fee) + parseFloat(stripeFeeforAll)),
        //   paid_status: true
        // }

        // const added = await Chat.create(valueforchat);
        // io.to(session.metadata.product_id).emit("chat message", added)
      }
      if (findroomforSocket) {



        const valueforchat = {
          room_id: findroomforSocket.room_id,
          image_id: findroomforSocket.image_id,
          receiver_id: session.metadata.user_id,
          message_type: "PaymentIntent",
          amount: findroomforSocket.amount,
          hopper_price: session.metadata.hopper_price,
          payable_to_hopper: (value) - (parseFloat(session.metadata.application_fee) + parseFloat(stripeFeeforAll) + parseFloat(vat)),
          paid_status: true
        }


        const upadteaccpet = await Chat.updateMany({ room_id: findroomforSocket.room_id, message_type: "accept_mediaHouse_offer" }, { $set: { paid_status: true } })

        const added = await Chat.create(valueforchat);
        io.to(findroomforSocket.room_id).emit("chat message", added)

        io.to(findroomforSocket.image_id).emit("chat message", added)

        const valueforchat2 = {
          room_id: findroomforSocket.room_id,
          image_id: findroomforSocket.image_id,
          receiver_id: session.metadata.user_id,
          message_type: "count_with_view",
          views: findreceiver.content_view_count_by_marketplace_for_app,
          purchase_count: typeof findreceiver?.purchased_mediahouse == "string" ? JSON.parse(findreceiver?.purchased_mediahouse) ? JSON.parse(findreceiver?.purchased_mediahouse).length > 0 : 1 : findreceiver?.purchased_mediahouse.length
        }

        const added2 = await Chat.create(valueforchat2);





        io.to(findroomforSocket.room_id).emit("chat message", added2)

        io.to(findroomforSocket.image_id).emit("chat message", added2)
      }


      if (session.metadata.reconsider) {
        const valueforchat = {
          room_id: session.metadata.room_id,
          image_id: session.metadata.product_id,
          receiver_id: session.metadata.user_id,
          message_type: "PaymentIntent",
          amount: session.metadata.reconsider_amount,
          paid_status: true
        }

        const upadteaccpet = await Chat.updateMany({ room_id: session.metadata.room_id, message_type: "accept_mediaHouse_offer" }, { $set: { paid_status: true } })


        const added = await Chat.create(valueforchat);

        io.to(session.metadata.room_id).emit("chat message", added)

        io.to(session.metadata.product_id).emit("chat message", added)
      }
      //update paid status true in chat document where hopper accepted a mediahouse offer to determine which content need to pay
      const updatePaidStatusinChat = await Chat.updateMany({
        paid_status: false,
        message_type: "accept_mediaHouse_offer",
        receiver_id: session.metadata.user_id,
        image_id: session.metadata.product_id
      }, { paid_status: true });


      const newMediaHouse = {
        media_house_id: session.metadata.user_id,
        is_hide: true
      };

      const recentactivityupdate = await recentactivity.updateMany({
        content_id: session.metadata.product_id,
        user_id: session.metadata.user_id,
      }, { paid_status: true });

      // await Contents.findByIdAndUpdate(
      //   session.metadata.product_id,
      //   { $push: { purchased_mediahouse_time: newMediaHouse } },
      //   { new: true },
      //   (err, updatedDocument) => {
      //     if (err) {
      //       console.error('Error:', err);
      //     } else {
      //       
      //     }
      //   }
      // );
      // condition 2 =========================
      const findroom = await Room.findOne({
        content_id: session.metadata.product_id,
      });


      if (findroom) {
        const added = await Chat.updateMany(
          {
            room_id: findroom.room_id,
          },
          { paid_status: true, amount_paid: session.metadata.amount }
        );
      } else {
        console.error("error");
      }
      // condition 3 ===========================
      // const findreceiver = await Contents.findOne({
      //   _id: session.metadata.product_id,
      // });
      if (session.metadata.product_id) {
        const respon = await Contents.findOne({
          _id: session.metadata.product_id,
        }).populate("hopper_id");


        const purchased_mediahouse = findreceiver.purchased_mediahouse.map((hopperIds) => hopperIds);
        if (!purchased_mediahouse.includes(session.metadata.user_id)) {
          const update = await Contents.updateOne(
            { _id: session.metadata.product_id },
            {
              $push: { purchased_mediahouse: session.metadata.user_id, payment_intent: paymentIntentId, charge_ids: latestcharge },
              $pull: { offered_mediahouses: session.metadata.user_id }
            }
          );
        }
        const date = new Date()
        const Vatupdateofcontent = findreceiver.Vat.map((hopperIds) => hopperIds.purchased_mediahouse_id);
        // if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
        //   const update = await Contents.updateOne(
        //     { _id: session.metadata.product_id },
        //     { $push: { Vat: { purchased_mediahouse_id: session.metadata.user_id, Vat: vat, amount: value, purchased_time: date } }, }
        //   );
        // }
        // for pro
        const responseforcategory = await Category.findOne({
          // type: "commissionstructure",
          // _id: "64c10c7f38c5a472a78118e2",
          type: "commissionstructure",
          name: process.env.Pro
        }).populate("hopper_id");
        const commitionforpro = parseFloat(responseforcategory.percentage);
        const paybymedihousetoadmin = (session.metadata.offer == true || session.metadata.offer == "true") ? respon.amount_paid : respon.amount_paid - vat//respon.amount_paid - vat; // amout paid by mediahouse with vat


        //  end
        // for amateue
        const responseforcategoryforamateur = await Category.findOne({
          // type: "commissionstructure",
          // _id: "64c10c7538c5a472a78118c0",
          type: "commissionstructure",
          name: process.env.Amateur
        }).populate("hopper_id");
        const commitionforamateur = parseFloat(
          responseforcategoryforamateur.percentage
        );
        const paybymedihousetoadminforamateur = (session.metadata.offer == true || session.metadata.offer == "true") ? respon.amount_paid : respon.amount_paid - vat;
        const paybymedihousetoadminforPro = (session.metadata.offer == true || session.metadata.offer == "true") ? respon.amount_paid : respon.amount_paid - vat;//respon.amount_paid - vat;




        if (respon.type == "shared") {
          // old code
          // if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
          //   const update = await Contents.updateOne(
          //     { _id: session.metadata.product_id },
          //     { $push: { Vat: { amount_without_Vat: (value - vat), purchased_mediahouse_id: session.metadata.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "shared" } }, }
          //   );
          // }
          if (respon.hopper_id.category == "pro") {
            const paid = commitionforpro * paybymedihousetoadminforPro;//paybymedihousetoadmin;
            const percentage = paid / 100;
            const paidbyadmin = paybymedihousetoadmin - percentage;
            const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
            const hopperPayableAmount = paidbyadmin - stripeFee

            let data = {
              ...req.body,
              payment_intent_id: paymentIntentId,
              media_house_id: session.metadata.user_id,
              charge_id: latestcharge,
              percentage: percentage,
              original_ask_price: respon.amount_paid - vat,
              paidbyadmin: paidbyadmin,
              content_id: session.metadata.product_id,
              hopper_id: findreceiver.hopper_id,
              admin_id: "64bfa693bc47606588a6c807",
              original_Vatamount: vat,
              Vat: newcommistionaddedVat,// vat,
              amount: value + newcommistionaddedVat,// - parseFloat(session?.total_details?.amount_discount / 100),
              invoiceNumber: invoice_number,
              presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),// + parseFloat(session?.total_details?.amount_discount / 100)),
              payable_to_hopper: hopperPayableAmount,
              stripe_fee: stripeFee,
              transaction_fee: netAmount,
              type: "content",
              payment_content_type: "shared",
              category_id: respon.category_id,
              image_count: respon.image_count,
              video_count: respon.video_count,
              audio_count: respon.audio_count,
              other_count: respon.other_count

            };
            data = addDueDate(data);
            const payment = await db.createItem(data, HopperPayment);


            const transfer = await stripe.transfers.create({
              amount: Number(hopperPayableAmount) * 100,
              currency: 'gbp',
              destination: session.metadata.stripe_account_id,
              source_transaction: latestcharge,
            })


            const valueforchat = {
              image_id: session.metadata.product_id,

              receiver_id: session.metadata.user_id,
              message_type: "PaymentIntentApp",
              presshop_commission: parseFloat(session.metadata.application_fee),
              stripe_fee: parseFloat(stripeFeeforAll),
              amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
              hopper_price: session.metadata.hopper_price,
              payable_to_hopper: Number(hopperPayableAmount),
              paid_status: true
            }

            const added = await Chat.create(valueforchat);
            io.to(session.metadata.product_id).emit("chat message", added)
            // apiurlfortransactiondetails =  `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
            apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
            if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
              // (parseFloat(session?.total_details?.amount_discount / 100)
              // - parseFloat(vat)
              const update = await Contents.updateOne(
                { _id: session.metadata.product_id },
                { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - (stripeFee), invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.metadata.offer == true || session.metadata.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.metadata.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "shared" } }, }
              );
            }
            await db.updateItem(session.metadata.product_id, Contents, {
              // sale_status:"sold",
              transaction_id: payment._id,
              amount_payable_to_hopper: paidbyadmin,
              commition_to_payable: percentage,
              IsShared: true

            });
          } else if (respon.hopper_id.category == "amateur") {
            const paid = commitionforamateur * paybymedihousetoadminforamateur;
            const percentage = paid / 100;

            const paidbyadmin = paybymedihousetoadminforamateur - percentage;
            const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
            const hopperPayableAmount = paidbyadmin - stripeFee
            let data = {
              ...req.body,
              media_house_id: session.metadata.user_id,
              charge_id: latestcharge,
              payment_intent_id: paymentIntentId,
              percentage: percentage,
              original_ask_price: respon.amount_paid - vat,
              content_id: session.metadata.product_id,
              hopper_id: findreceiver.hopper_id,
              admin_id: "64bfa693bc47606588a6c807",
              original_Vatamount: vat,
              Vat: newcommistionaddedVat,// vat,
              invoiceNumber: invoice_number,
              paidbyadmin: paidbyadmin,
              amount: value + newcommistionaddedVat,// - parseFloat(session?.total_details?.amount_discount / 100),
              transaction_fee: netAmount,
              presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),// + parseFloat(session?.total_details?.amount_discount / 100)),
              payable_to_hopper: hopperPayableAmount,
              stripe_fee: stripeFee,
              type: "content",
              payment_content_type: "shared",
              category_id: respon.category_id,
              image_count: respon.image_count,
              video_count: respon.video_count,
              audio_count: respon.audio_count,
              other_count: respon.other_count
            };

            data = addDueDate(data);
            const payment = await db.createItem(data, HopperPayment);
            const transfer = await stripe.transfers.create({
              amount: Number(hopperPayableAmount) * 100,
              currency: 'gbp',
              destination: session.metadata.stripe_account_id,
              source_transaction: latestcharge,
            })


            const valueforchat = {
              image_id: session.metadata.product_id,

              receiver_id: session.metadata.user_id,
              message_type: "PaymentIntentApp",
              presshop_commission: parseFloat(session.metadata.application_fee),
              stripe_fee: parseFloat(stripeFeeforAll),
              amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
              hopper_price: session.metadata.hopper_price,
              payable_to_hopper: Number(hopperPayableAmount),
              paid_status: true
            }

            const added = await Chat.create(valueforchat);
            // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
            apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
            // if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
            //   const update = await Contents.updateOne(
            //     { _id: session.metadata.product_id },
            //     { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (value - vat), purchased_mediahouse_id: session.metadata.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "shared" } }, }
            //   );
            // }
            // + parseFloat(session?.total_details?.amount_discount / 100)
            if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
              const update = await Contents.updateOne(
                { _id: session.metadata.product_id },
                { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - (stripeFee), invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.metadata.offer == true || session.metadata.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.metadata.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "shared" } }, }
              );
            }
            await db.updateItem(session.metadata.product_id, Contents, {
              transaction_id: payment._id,
              amount_payable_to_hopper: paidbyadmin,
              commition_to_payable: percentage,
              IsShared: true
            });
          } else {
            console.error("error");
          }
        } else {

          if (respon.donot_share == false || respon.donot_share == "false") {

            const data = {
              content_id: session.metadata.product_id,
              submited_time: new Date(),
              type: "purchased_exclusive_content"
            }
            const queryforexclus = await db.createItem(data, query);
          }
          // old code
          // if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
          //   const update = await Contents.updateOne(
          //     { _id: session.metadata.product_id },
          //     { $push: { Vat: { amount_without_Vat: (value - vat), purchased_mediahouse_id: session.metadata.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "exclusive" } }, }
          //   );
          // }
          if (respon.hopper_id.category == "pro") {
            const paid = commitionforpro * paybymedihousetoadminforPro//paybymedihousetoadmin;
            const percentage = paid / 100;
            const paidbyadmin = paybymedihousetoadmin - percentage;
            const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
            const hopperPayableAmount = paidbyadmin - stripeFee
            let data = {
              ...req.body,
              media_house_id: session.metadata.user_id,
              charge_id: latestcharge,
              percentage: percentage,
              payment_intent_id: paymentIntentId,
              original_ask_price: respon.amount_paid - vat,
              content_id: session.metadata.product_id,
              hopper_id: findreceiver.hopper_id,
              admin_id: "64bfa693bc47606588a6c807",
              original_Vatamount: vat,
              Vat: newcommistionaddedVat,// vat,
              amount: value + newcommistionaddedVat,//- parseFloat(session?.total_details?.amount_discount / 100),
              invoiceNumber: invoice_number,
              transaction_fee: netAmount,
              presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),//+ parseFloat(session?.total_details?.amount_discount / 100)),
              payable_to_hopper: hopperPayableAmount,
              stripe_fee: stripeFee,
              type: "content",
              paidbyadmin: paidbyadmin,
              payment_content_type: "exclusive",
              category_id: respon.category_id,
              image_count: respon.image_count,
              video_count: respon.video_count,
              audio_count: respon.audio_count,
              other_count: respon.other_count
            };
            data = addDueDate(data);

            const payment = await db.createItem(data, HopperPayment);
            const transfer = await stripe.transfers.create({
              amount: Number(hopperPayableAmount) * 100,
              currency: 'gbp',
              destination: session.metadata.stripe_account_id,
              source_transaction: latestcharge,
            })



            const valueforchat = {
              image_id: session.metadata.product_id,

              receiver_id: session.metadata.user_id,
              message_type: "PaymentIntentApp",
              presshop_commission: parseFloat(session.metadata.application_fee),
              stripe_fee: parseFloat(stripeFeeforAll),
              amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
              hopper_price: session.metadata.hopper_price,
              payable_to_hopper: Number(hopperPayableAmount),
              paid_status: true
            }

            const added = await Chat.create(valueforchat);
            // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
            apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
            // if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
            //   const update = await Contents.updateOne(
            //     { _id: session.metadata.product_id },
            //     { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (value - vat), purchased_mediahouse_id: session.metadata.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "exclusive" } }, }
            //   );
            // }
            // ( + parseFloat(session?.total_details?.amount_discount / 100))
            //- parseFloat(session?.total_details?.amount_discount / 100)
            if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
              const update = await Contents.updateOne(
                { _id: session.metadata.product_id },
                { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - stripeFee, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.metadata.offer == true || session.metadata.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.metadata.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "exclusive" } }, }
              );
            }
            await db.updateItem(session.metadata.product_id, Contents, {
              transaction_id: payment._id,
              amount_payable_to_hopper: paidbyadmin,
              commition_to_payable: percentage,
              is_hide: true,
              IsExclusive: true
            });
          } else if (respon.hopper_id.category == "amateur") {
            const paid = commitionforamateur * paybymedihousetoadminforamateur;
            const percentage = paid / 100;

            const paidbyadmin = paybymedihousetoadminforamateur - percentage;
            const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
            const hopperPayableAmount = paidbyadmin - stripeFee
            let data = {
              ...req.body,
              media_house_id: session.metadata.user_id,
              content_id: session.metadata.product_id,
              payment_intent_id: paymentIntentId,
              charge_id: latestcharge,
              percentage: percentage,
              original_ask_price: respon.amount_paid - vat,
              hopper_id: findreceiver.hopper_id,
              admin_id: "64bfa693bc47606588a6c807",
              original_Vatamount: vat,
              Vat: newcommistionaddedVat,// vat,
              paidbyadmin: paidbyadmin,
              amount: value + newcommistionaddedVat,//- parseFloat(session?.total_details?.amount_discount / 100),
              invoiceNumber: invoice_number,
              transaction_fee: netAmount,
              presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),// + parseFloat(session?.total_details?.amount_discount / 100)),
              payable_to_hopper: hopperPayableAmount,
              stripe_fee: stripeFee,
              type: "content",
              payment_content_type: "exclusive",
              category_id: respon.category_id,
              image_count: respon.image_count,
              video_count: respon.video_count,
              audio_count: respon.audio_count,
              other_count: respon.other_count
            };
            data = addDueDate(data);
            const payment = await db.createItem(data, HopperPayment);

            const transfer = await stripe.transfers.create({
              amount: Number(hopperPayableAmount) * 100,
              currency: 'gbp',
              destination: session.metadata.stripe_account_id,
              source_transaction: latestcharge,
            })



            const valueforchat = {
              image_id: session.metadata.product_id,

              receiver_id: session.metadata.user_id,
              message_type: "PaymentIntentApp",
              presshop_commission: parseFloat(session.metadata.application_fee),
              stripe_fee: parseFloat(stripeFeeforAll),
              amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
              hopper_price: session.metadata.hopper_price,
              payable_to_hopper: Number(hopperPayableAmount),
              paid_status: true
            }

            const added = await Chat.create(valueforchat);
            // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
            apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
            // if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
            //   const update = await Contents.updateOne(
            //     { _id: session.metadata.product_id },
            //     { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (value - vat), purchased_mediahouse_id: session.metadata.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "exclusive" } }, }
            //   );
            // }
            // + parseFloat(session?.total_details?.amount_discount / 100))
            // - parseFloat(session?.total_details?.amount_discount / 100)
            if (!Vatupdateofcontent.includes(session.metadata.user_id)) {
              const update = await Contents.updateOne(
                { _id: session.metadata.product_id },
                { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - (stripeFee), invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.metadata.offer == true || session.metadata.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.metadata.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "exclusive" } }, }
              );
            }
            await db.updateItem(session.metadata.product_id, Contents, {
              transaction_id: payment._id,
              amount_payable_to_hopper: paidbyadmin,
              commition_to_payable: percentage,
              is_hide: true,  //  to hide content for all mediahouse if a mediahouse buy content 
              IsExclusive: true // which type of content is buy 
            });
          }
        }
      }
      const publication = await User.findOne({
        _id: session.metadata.user_id
      });
      const notiObj1 = {
        sender_id: findreceiver.hopper_id,
        receiver_id: findreceiver.hopper_id,
        // data.receiver_id,
        title: "Content successfully sold",
        body: `WooHoo🤩💰You have received £${formatAmountInMillion(findreceiver.ask_price)} from ${publication.first_name}. VIsit My Earnings on your app to manage and track your payments🤟🏼`
        ,
      };
      const resp1 = await _sendPushNotification(notiObj1);
      // ---------===============================end===========================================================
    } else {
      // const vat = (session.metadata.amount * 20) / 100;
      apiUrl = `https://uat.presshop.live:5019/mediahouse/image_pathdownload?image_id=${session.metadata.product_id}&type=uploaded_content`
      // const valueofuploadedcontentwithvat = parseFloat(session.metadata.amount) + parseFloat(vat);

      await db.updateItem(session.metadata.product_id, Uploadcontent, {
        paid_status: true,
        amount_paid: value,
        purchased_publication: session.metadata.user_id,
      });




      const findreceiver = await Uploadcontent.findOne({
        _id: session.metadata.product_id,
      }).populate("hopper_id");



      const date = new Date()
      const paymentdetails = findreceiver.payment_detail.map((hopperIds) => hopperIds.purchased_mediahouse_id);
      if (!paymentdetails.includes(session.metadata.user_id)) {
        const update = await Uploadcontent.updateOne(
          { _id: session.metadata.product_id },
          { $push: { payment_detail: { purchased_mediahouse_id: session.metadata.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat - parseFloat(session?.total_details?.amount_discount / 100), purchased_time: date } }, }
        );
      }

      await db.updateItem(findreceiver.task_id, BroadCastTask, {
        Vat: vat,
        totalfund_invested: value + newcommistionaddedVat - parseFloat(session?.total_details?.amount_discount / 100)
      });

      await BroadCastTask.updateOne(
        { _id: mongoose.Types.ObjectId(findreceiver.task_id) },
        { $inc: { total_vat_value_invested_in_task: newcommistionaddedVat, total_amount_with_vat_invested_in_task: value + newcommistionaddedVat - parseFloat(session?.total_details?.amount_discount / 100), total_stripefee_value_invested_in_task: stripeFeeforAll } }
      )

      if (findreceiver.hopper_id.category == "pro") {

        // const paid = commitionforpro * paybymedihousetoadminforPro;//paybymedihousetoadmin;
        // const percentage = paid / 100;
        // const paidbyadmin = paybymedihousetoadmin - percentage;


        // let data = {
        //   ...req.body,
        //   media_house_id: session.metadata.user_id,
        //   content_id: session.metadata.product_id,
        //   hopper_id: findreceiver.hopper_id,
        //   admin_id: "64bfa693bc47606588a6c807",
        //   Vat: vat,
        //   amount: value +newcommistionaddedVat,
        //   invoiceNumber: invoice_number,
        //   presshop_commission: percentage + newcommistionaddedVat - stripeFee,
        //   payable_to_hopper: hopperPayableAmount,
        //   stripe_fee: stripeFee,
        //   transaction_fee: netAmount,
        //   type: "content",
        //   payment_content_type: "shared",
        //   category_id: respon.category_id,
        //   image_count: respon.image_count,
        //   video_count: respon.video_count,
        //   audio_count: respon.audio_count,
        //   other_count: respon.other_count

        // };





        const responseforcategory = await Category.findOne({
          type: "commissionstructure",
          _id: "64c10c7f38c5a472a78118e2",
        }).populate("hopper_id");
        const commitionforpro = parseFloat(responseforcategory.percentage);
        const paybymedihousetoadmin = findreceiver.amount_paid - vat;
        const paid = commitionforpro * paybymedihousetoadmin;
        const percentage = paid / 100;
        const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
        const paidbyadmin = paybymedihousetoadmin - percentage;
        const hopperPayableAmount = paidbyadmin - stripeFee

        let data = {
          ...req.body,
          media_house_id: session.metadata.user_id,
          charge_id: latestcharge,
          payment_intent_id: paymentIntentId,
          task_content_id: session.metadata.product_id,
          hopper_id: findreceiver.hopper_id._id,
          admin_id: "64bfa693bc47606588a6c807",
          invoiceNumber: invoice_number,
          original_Vatamount: vat,
          Vat: newcommistionaddedVat,// vat,
          image_count: findreceiver.type == "image" ? 1 : 0,
          video_count: findreceiver.type == "video" ? 1 : 0,
          audio_count: findreceiver.type == "audio" ? 1 : 0,
          other_count: findreceiver.type != "image" || findreceiver.type != "video" || findreceiver.type == "audio" ? 1 : 0,
          amount: value + newcommistionaddedVat,
          presshop_commission: percentage + newcommistionaddedVat - stripeFee,
          payable_to_hopper: hopperPayableAmount,
          type: "task_content",

        };
        data = addDueDate(data);
        const payment = await db.createItem(data, HopperPayment);
        // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
        apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`

        await db.updateItem(session.metadata.product_id, Uploadcontent, {
          transaction_id: payment._id,
          amount_payable_to_hopper: hopperPayableAmount,
          commition_to_payable: percentage + newcommistionaddedVat - stripeFee,
        });
        const notiObj = {
          sender_id: session.metadata.user_id,
          receiver_id: findreceiver.hopper_id._id.toString(),
          title: " content buy ",
          body: `content buy by mediahouse`,
        };
        const resp = await _sendPushNotification(notiObj);
      } else if (findreceiver.hopper_id.category == "amateur") {

        // 
        const responseforcategoryforamateur = await Category.findOne({
          type: "commissionstructure",
          _id: "64c10c7538c5a472a78118c0",
        }).populate("hopper_id");
        const commitionforamateur = parseFloat(
          responseforcategoryforamateur.percentage
        );
        const paybymedihousetoadminforamateur = findreceiver.amount_paid - vat;
        const paid = commitionforamateur * paybymedihousetoadminforamateur;
        const percentage = paid / 100;
        const paidbyadmin = paybymedihousetoadminforamateur - percentage;
        const stripeFee = stripeFeeforAll
        const hopperPayableAmount = paidbyadmin - stripeFee
        // const paidbyadmin = paybymedihousetoadmin - percentage;

        let data = {
          ...req.body,
          media_house_id: session.metadata.user_id,
          charge_id: latestcharge,
          payment_intent_id: paymentIntentId,
          task_content_id: session.metadata.product_id,
          hopper_id: findreceiver.hopper_id._id,
          admin_id: "64bfa693bc47606588a6c807",
          original_Vatamount: vat,
          Vat: newcommistionaddedVat,// vat,
          invoiceNumber: invoice_number,
          image_count: findreceiver.type == "image" ? 1 : 0,
          video_count: findreceiver.type == "video" ? 1 : 0,
          audio_count: findreceiver.type == "audio" ? 1 : 0,
          other_count: findreceiver.type != "image" || findreceiver.type != "video" || findreceiver.type == "audio" ? 1 : 0,
          amount: value + newcommistionaddedVat,
          presshop_commission: percentage + newcommistionaddedVat - stripeFee,
          payable_to_hopper: hopperPayableAmount,
          type: "task_content",
          task_id: session.metadata.task_id,
        };
        data = addDueDate(data);
        const payment = await db.createItem(data, HopperPayment);
        // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
        apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`

        await db.updateItem(session.metadata.product_id, Uploadcontent, {
          transaction_id: payment._id,
          amount_payable_to_hopper: hopperPayableAmount,
          commition_to_payable: percentage + newcommistionaddedVat - stripeFee,
        });
        const notiObj = {
          sender_id: session.metadata.user_id,
          receiver_id: findreceiver.hopper_id._id.toString(),
          title: " content buy ",
          body: `content buy by mediahouse`,
        };
        const resp = await _sendPushNotification(notiObj);
      }
      const findroom = await Room.findOne({
        receiver_id: session.metadata.user_id,
        sender_id: findreceiver.hopper_id._id.toString(),
        type: "external_task",
        task_id: session.metadata.task_id
      });

      console.error("eror", {
        receiver_id: session.metadata.user_id,
        sender_id: findreceiver.hopper_id._id.toString(),
        type: "external_task",
        task_id: session.metadata.task_id
      }
      );
      const added = await Chat.update(
        {
          room_id: findroom.room_id,
        },
        { paid_status: true }
      );
    }
    // <a href="${process.env.INDIVIDUAL_USER_URI}">Go to Home </a>
    // res.send(
    //   `<html><body><h1>Thanks for your order,!</h1> <br/> 

    //   </body></html>`
    // );

    const apiUrls = apiUrl
    // `https://uat.presshop.live:5019/mediahouse/image_pathdownload?image_id=${session.metadata.product_id}&type=content`;
    const responseodaxios = await axios.get(apiUrl)
    // ${downloadUrl}
    //  .then(response => {
    //   var downloadUrl = response.data.message;
    //   

    //   // Now you can use the downloadUrl as needed, such as downloading the file or performing further operations
    // })
    // .catch(error => {
    //   console.error('Error fetching data:', error);
    // });
    const downloadUrl = responseodaxios.data;

    res.send(`<!DOCTYPE html>
    <html>
    
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Onboarding Success</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet" />
      <style>
        @font-face {
          font-family: "Airbnb";
          src: local("AirbnbCereal_W_Lt"),
            url("https://uat.presshop.live/presshop_rest_apis/views/en/subAdminCredential/airbnb-cereal-font/AirbnbCereal_W_Lt.ttf") format("truetype");
        }
    
        @font-face {
          font-family: "AirbnbMedium";
          src: local("AirbnbCereal_W_Md"),
            url("https://uat.presshop.live/presshop_rest_apis/views/en/subAdminCredential/airbnb-cereal-font/AirbnbCereal_W_Md.ttf") format("truetype");
        }
    
        @font-face {
          font-family: "AirbnbBold";
          src: local("AirbnbCereal_W_Bd"),
            url("https://uat.presshop.live/presshop_rest_apis/views/en/subAdminCredential/airbnb-cereal-font/AirbnbCereal_W_Bd.ttf") format("truetype");
        }
        @media (max-width:1200px) {
          .big-image{
            height: 520px !important;
            object-fit: cover;
          width: 560px !important;
}
          }
        @media (max-width:1024px) {
          .big-image{
            height: 520px !important;
            object-fit: cover;
          width: 430px !important;
          }
        }
        @media (max-width:991px) {
          .big-image{
            height: 520px !important;
            object-fit: cover;
          width: 470px !important;
          }
        }
      </style>
    </head>
    
    <body style="
          width: 100%;
          height: 100%;
          background: #e6e6e6;
          margin: 0;
          box-sizing: border-box;
          text-align: left;
          font-weight: 390;
        ">
      <table cellspacing="0" cellpadding="0" width="100%" style="
            background-color: #fff;
            padding: 0;
            border-collapse: collapse;
            margin: 0px auto;
            max-width: 100%;
            font-size: 14px;
          " border="0">
        <tbody>
          <tr style="">
            <td style="text-align: left; padding: 0 60px; background-color: #f3f5f4">
              <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/logo.png" alt="Presshop Logo" style="width: 200px; height: auto; margin: 25px 0px" />
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellspacing="0">
                <tr>
                  <td width="50%" style="padding: 60px 55.5px 40px 55.5px; vertical-align: top">
                    <p style="
                          margin-bottom: 60px;
                          margin-top: 0;
                          font-family: AirbnbBold;
                          font-size: 40px;
                          letter-spacing: 0;
                          font-weight: 600;
    
                        ">
                      Thanks, ${finduser.first_name}
                    </p>
                    <p style="
                          font-family: Airbnb;
                          font-size: 15px;
                          line-height: 24px;
                          margin-bottom: 25px;
                          text-align: justify;
                        ">
                      Here's your receipt for purchasing the <a
                        style="color: #ec4e54; font-weight: 600; font-family: AirbnbMedium">
                        content
                      </a> on PRESSHOP
                    </p>
                    <p style="
                          font-family: Airbnb;
                          font-size: 15px;
                          line-height: 24px;
                          margin-bottom: 25px;
                          text-align: justify;
                        ">
                      Your payment of £${formatAmountInMillion(parseFloat(session?.amount_total / 100))} (inc VAT) has been well received. Please check your <a href = ${apiurlfortransactiondetails}
                        style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600; text-decoration:none;">
                        transaction details
                      </a> if you
                      would like to, or visit the <a href = ${apiurlfortransactiondetails} style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600; text-decoration:none;">
                        payment summary
                      </a> to review this payment, and all other payments made.
    
                    </p>
    
                    <p style="
                    font-family: Airbnb;
                    font-size: 15px;
                    line-height: 24px;
                    margin-bottom: 25px;
                    text-align: justify;
                  ">
                      We have also sent a copy of this receipt to your registered email address
                      <a style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">
                        ${session.metadata.email}
                      </a>
                    </p>
    
                    <p style="
                    font-family: Airbnb;
                    font-size: 15px;
                    line-height: 24px;
                    margin-bottom: 25px;
                    text-align: justify;
                  ">
                      Please check our <a href="https://presshop-mediahouse.web.app/post-login-tandc" style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600; text-decoration:none;">T&Cs</a> and
                      <a href = "https://presshop-mediahouse.web.app/pre-privacy-policy" style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600; text-decoration:none;">privacy policy</a> for terms
                      of use. If you have any questions or need to speak
                      to any of our helpful team members, you can <a href = ${contact_us}
                        style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600; text-decoration:none;">contact us</a> 24x7, 365 days
                      of the year.
                      We have also sent a copy of this receipt to your registered email address
    
                    </p>
    
                    <p style="
                    font-family: Airbnb;
                    font-size: 15px;
                    line-height: 24px;
                    margin-bottom: 55px;
                    text-align: justify;
                  ">
                      Please check our T&Cs and privacy policy for terms of use. If you have any questions or need to speak
                      to any of our helpful team members, you can contact us 24x7, 365 days of the year.
                      If you are unhappy with your purchase, and wish to seek a refund, we would be happy to refund your
                      money provided you have not used the content in any which way or form. Please <a href = ${contact_us}
                        style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600; text-decoration:none;">contact us</a>, and we will
                      do the needful. You can check our <a
                        style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">refund policy</a> here. Thanks
                      🤩
                    </p>
    
                    <button style="
                          width: 100%;
                          width: 100%;
                          background: #ec4e54;
                          border: unset;
                          padding: 10px 0px;
                          border-radius: 12px;
                          color: #ffffff;
                          font-family: 'AirbnbBold';
                          font-size: 15px;
                          text-decoration:none;
                        ">
                       <a href = ${apiUrl}
                      style="color: #FFFFFF ; text-decoration:none; font-family: AirbnbMedium; font-weight: 600; text-decoration:none; ">Download</a>
                    </button>
                  </td>
                  <td width="50%" style="
                            padding: 0px 20px;
                        background: #f3f5f4;
                        vertical-align: top;
                      " align="center">
                    <table width="100%">
                      <tr>
                        <td height="30" style="background: #f3f5f4"></td>
                      </tr>
                      <tr>
                        <td style="
                              background: #f3f5f4;
                              text-align: center;
                              padding-left: 20px;
                              padding-bottom: 20px;
                            ">
                          <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/triangle.png" alt="triangle" style="width: 26px" />
                        </td>
                      </tr>
                    </table>
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/right.png" class="big-image" style="height: 520px;
              object-fit: cover;
              width: 600px;" />
                    <p style="
                          margin-top: 15px;
                          font-size: 40px;
                          font-family: 'Airbnb';
                          padding: 0px 50px;
                        ">
                      We're <span style="font-family: AirbnbBold; font-weight: 700;">
                        chuffed,
                      </span>and over the moon
    
    
                    </p>
                    <table width="100%">
                      <tr>
                        <td style="
                              background: #f3f5f4;
                              text-align: right;
                              padding-right: 50px;
                              padding-bottom: 20px;
                            ">
                          <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/Ellipse.png" alt="triangle" style="width: 26px" />
                        </td>
                      </tr>
                    </table>
    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td></td>
          </tr>
          <tr>
            <td style="background: #f3f5f4; padding: 40px 60px">
              <table width="100%">
                <tr>
                  <td width="50%">
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/footerlogo.png" alt="" width="386px" height="auto" />
                    <p style="
                          margin-top: 25px;
                          font-size: 15px;
                          font-weight: bold;
                          font-family: 'Work Sans', sans-serif;
                          margin-bottom: 3px;
                        ">
                      Presso Media UK Limited
                    </p>
                    <p style="
                          margin-top: 0px;
                          font-size: 15px;
                          font-weight: 300;
                          font-family: 'Work Sans', sans-serif;
                          margin-bottom: 5px;
                        ">
                      1 Knightsbridge Green
                      <br />
                      London
                      <br />
                      SW1X 7QA
                      <br />
                      United Kingdom
                    </p>
                    <p style="
                          margin-top: 0px;
                          font-size: 15px;
                          font-weight: 300;
                          font-family: 'Work Sans', sans-serif;
                          margin-bottom: 5px;
                        ">
                      <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/emailic.png" alt="Email icon" style="width: 15px; height: auto" />
                      support@presshop.news
                    </p>
                    <p style="
                          margin-top: 0px;
                          font-size: 15px;
                          font-weight: 300;
                          font-family: 'Work Sans', sans-serif;
                          margin-bottom: 15px;
                        ">
                      <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/websiteic.png" alt="Website icon" style="width: 15px; height: auto" />
                      www.presshop.news
                    </p>
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/twitter.png" alt="" style="width: 28px; height: auto" />
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/linkedIn.png" alt="" style="width: 28px; height: auto" />
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/instagram.png" alt="" style="width: 28px; height: auto" />
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/fb.png" alt="" style="width: 28px; height: auto" />
                  </td>
                  <td width="50%" align="right" style="vertical-align: bottom">
                    <p style="
                          font-size: 15px;
                          font-family: 'Work Sans', sans-serif;
                          margin-bottom: 15px;
                          font-weight: 500;
                          font-family: 'Work Sans', sans-serif;
                          width: 337px;
                          text-align: left;
                        ">
                      Disclaimer
                    </p>
                    <p style="
                          margin-bottom: 30px;
                          font-size: 12px;
                          font-weight: 400;
                          font-family: 'Work Sans', sans-serif;
                          width: 337px;
                          text-align: justify;
                        ">
                      If you have received this email in error please notify
                      Presso Media UK Limited immediately. This message contains
                      confidential information and is intended only for the
                      individual named. If you are not the named addressee, you
                      should not disseminate, distribute or copy this e-mail.
                    </p>
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/appStore.png" alt="Appstore" style="width: 118px; height: auto" />
                    <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/googlePlay.png" alt="googlePlay store" style="width: 118px; height: auto" />
                  </td>
                </tr>
                <!-- <tr>
            <td>
              <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/twitter.png" alt="" style="width: 28px; height: auto;">
              <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/linkedIn.png" alt="" style="width: 28px; height: auto;">
              <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/instagram.png" alt="" style="width: 28px; height: auto;">
              <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/fb.png" alt="" style="width: 28px; height: auto;">
            </td>
            </tr> -->
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    
    </html>`)
  } catch (err) {

    utils.handleError(res, err);
  }
};

exports.challengePaymentFailed = async (req, res) => {
  try {
    var currentData = moment().format("DD-MM-YYYY");
    if (fs.existsSync(dir___2 + "logs/access_failed_" + currentData + ".log")) {
    } else {
      fs.createWriteStream(
        dir___2 + "logs/access_failed_" + currentData + ".log",
        { mode: 0o777 }
      );
    }

    log4js.configure({
      appenders: {
        cheese: {
          type: "file",
          filename: dir___2 + "logs/access_failed_" + currentData + ".log",
        },
      },
      categories: { default: { appenders: ["cheese"], level: "info" } },
    });
    // receipt_url
    const logger = log4js.getLogger("access_failed_" + currentData);
    try {
      logger.info(JSON.stringify(req.body));
    } catch (e) {

    }

    try {
      logger.info(JSON.stringify(req.query));
    } catch (e) {

    }

    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    const customer = await stripe.customers.retrieve(session.metadata.customer);

    // Add challenge

    res.send(
      `<html><body><h1>${customer.name}! Your payment is failed. Please retry</h1></body></html>`
    );

    // res.send(`<!DOCTYPE html>
    // <html>

    // <head>
    //   <meta charset="utf-8" />
    //   <meta name="viewport" content="width=device-width, initial-scale=1" />
    //   <title>Onboarding Success</title>
    //   <link rel="preconnect" href="https://fonts.googleapis.com" />
    //   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    //   <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap"
    //     rel="stylesheet" />
    //   <style>
    //     @font-face {
    //       font-family: "Airbnb";
    //       src: local("AirbnbCereal_W_Lt"),
    //         url("/var/www/mongo/presshop_rest_apis/views/en/subAdminCredential/airbnb-cereal-font/AirbnbCereal_W_Lt.ttf") format("truetype");
    //     }

    //     @font-face {
    //       font-family: "AirbnbMedium";
    //       src: local("AirbnbCereal_W_Md"),
    //         url("/var/www/mongo/presshop_rest_apis/views/en/subAdminCredential/airbnb-cereal-font/AirbnbCereal_W_Md.ttf") format("truetype");
    //     }

    //     @font-face {
    //       font-family: "AirbnbBold";
    //       src: local("AirbnbCereal_W_Bd"),
    //         url("/var/www/mongo/presshop_rest_apis/views/en/subAdminCredential/airbnb-cereal-font/AirbnbCereal_W_Bd.ttf") format("truetype");
    //     }
    //   </style>
    // </head>

    // <body style="
    //       width: 100%;
    //       height: 100%;
    //       background: #e6e6e6;
    //       margin: 0;
    //       box-sizing: border-box;
    //       text-align: left;
    //       font-weight: 390;
    //     ">
    //   <table cellspacing="0" cellpadding="0" width="100%" style="
    //         background-color: #fff;
    //         padding: 0;
    //         border-collapse: collapse;
    //         margin: 0px auto;
    //         max-width: 100%;
    //         font-size: 14px;
    //       " border="0">
    //     <tbody>
    //       <tr style="">
    //         <td style="text-align: left; padding: 0 60px; background-color: #f3f5f4">
    //           <img src="logo.png" alt="Presshop Logo" style="width: 200px; height: auto; margin: 25px 0px" />
    //         </td>
    //       </tr>
    //       <tr>
    //         <td>
    //           <table width="100%" cellspacing="0">
    //             <tr>
    //               <td width="50%" style="padding: 60px 55.5px 40px 55.5px; vertical-align: top">
    //                 <p style="
    //                       margin-bottom: 60px;
    //                       margin-top: 0;
    //                       font-family: AirbnbBold;
    //                       font-size: 40px;
    //                       letter-spacing: 0;
    //                       font-weight: 600;

    //                     ">
    //                   Thanks, ${customer.name}
    //                 </p>
    //                 <p style="
    //                       font-family: Airbnb;
    //                       font-size: 15px;
    //                       line-height: 24px;
    //                       margin-bottom: 25px;
    //                       text-align: justify;
    //                     ">
    //                   Here's your receipt for purchasing the <a
    //                     style="color: #ec4e54; font-weight: 600; font-family: AirbnbMedium">
    //                     content
    //                   </a> on PRESSHOP
    //                 </p>
    //                 <p style="
    //                       font-family: Airbnb;
    //                       font-size: 15px;
    //                       line-height: 24px;
    //                       margin-bottom: 25px;
    //                       text-align: justify;
    //                     ">
    //                   Your payment of £4,000 (inc VAT) has been well received. Please check your <a
    //                     style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">
    //                     transaction details
    //                   </a> if you
    //                   would like to, or visit the <a style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">
    //                     payment summary
    //                   </a> to review this payment, and all other payments made.

    //                 </p>

    //                 <p style="
    //                 font-family: Airbnb;
    //                 font-size: 15px;
    //                 line-height: 24px;
    //                 margin-bottom: 25px;
    //                 text-align: justify;
    //               ">
    //                   We have also sent a copy of this receipt to your registered email address
    //                   <a style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">
    //                     john.smith@reuters.com
    //                   </a>
    //                 </p>

    //                 <p style="
    //                 font-family: Airbnb;
    //                 font-size: 15px;
    //                 line-height: 24px;
    //                 margin-bottom: 25px;
    //                 text-align: justify;
    //               ">
    //                   Please check our <a style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">T&Cs</a> and
    //                   <a style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">privacy policy</a> for terms
    //                   of use. If you have any questions or need to speak
    //                   to any of our helpful team members, you can <a
    //                     style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">contact us</a> 24x7, 365 days
    //                   of the year.
    //                   We have also sent a copy of this receipt to your registered email address

    //                 </p>

    //                 <p style="
    //                 font-family: Airbnb;
    //                 font-size: 15px;
    //                 line-height: 24px;
    //                 margin-bottom: 55px;
    //                 text-align: justify;
    //               ">
    //                   Please check our T&Cs and privacy policy for terms of use. If you have any questions or need to speak
    //                   to any of our helpful team members, you can contact us 24x7, 365 days of the year.
    //                   If you are unhappy with your purchase, and wish to seek a refund, we would be happy to refund your
    //                   money provided you have not used the content in any which way or form. Please <a
    //                     style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">contact us</a>, and we will
    //                   do the needful. You can check our <a
    //                     style="color: #ec4e54; font-family: AirbnbMedium; font-weight: 600;">refund policy</a> here. Thanks
    //                   🤩
    //                 </p>

    //                 <button style="
    //                       width: 100%;
    //                       width: 100%;
    //                       background: #ec4e54;
    //                       border: unset;
    //                       padding: 10px 0px;
    //                       border-radius: 12px;
    //                       color: #ffffff;
    //                       font-family: 'AirbnbBold';
    //                       font-size: 15px;
    //                     ">
    //                   Download
    //                 </button>
    //               </td>
    //               <td width="50%" style="
    //                         padding: 0px 20px;
    //                     background: #f3f5f4;
    //                     vertical-align: top;
    //                   " align="center">
    //                 <table width="100%">
    //                   <tr>
    //                     <td height="30" style="background: #f3f5f4"></td>
    //                   </tr>
    //                   <tr>
    //                     <td style="
    //                           background: #f3f5f4;
    //                           text-align: center;
    //                           padding-left: 20px;
    //                           padding-bottom: 20px;
    //                         ">
    //                       <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/triangle.png" alt="triangle" style="width: 26px" />
    //                     </td>
    //                   </tr>
    //                 </table>
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/right.png" style="height: 520px;
    //           object-fit: cover;
    //           width: 600px;" />
    //                 <p style="
    //                       margin-top: 15px;
    //                       font-size: 40px;
    //                       font-family: 'Airbnb';
    //                       padding: 0px 50px;
    //                     ">
    //                   We're <span style="font-family: AirbnbBold; font-weight: 700;">
    //                     chuffed
    //                   </span>, and over the moon


    //                 </p>
    //                 <table width="100%">
    //                   <tr>
    //                     <td style="
    //                           background: #f3f5f4;
    //                           text-align: right;
    //                           padding-right: 50px;
    //                           padding-bottom: 20px;
    //                         ">
    //                       <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/Ellipse.png" alt="triangle" style="width: 26px" />
    //                     </td>
    //                   </tr>
    //                 </table>

    //               </td>
    //             </tr>
    //           </table>
    //         </td>
    //       </tr>
    //       <tr>
    //         <td></td>
    //       </tr>
    //       <tr>
    //         <td style="background: #f3f5f4; padding: 40px 60px">
    //           <table width="100%">
    //             <tr>
    //               <td width="50%">
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/footerlogo.png" alt="" width="386px" height="auto" />
    //                 <p style="
    //                       margin-top: 25px;
    //                       font-size: 15px;
    //                       font-weight: bold;
    //                       font-family: 'Work Sans', sans-serif;
    //                       margin-bottom: 3px;
    //                     ">
    //                   Presso Media UK Limited
    //                 </p>
    //                 <p style="
    //                       margin-top: 0px;
    //                       font-size: 15px;
    //                       font-weight: 300;
    //                       font-family: 'Work Sans', sans-serif;
    //                       margin-bottom: 5px;
    //                     ">
    //                   1 Knightsbridge Green
    //                   <br />
    //                   London
    //                   <br />
    //                   SW1X 7QA
    //                   <br />
    //                   United Kingdom
    //                 </p>
    //                 <p style="
    //                       margin-top: 0px;
    //                       font-size: 15px;
    //                       font-weight: 300;
    //                       font-family: 'Work Sans', sans-serif;
    //                       margin-bottom: 5px;
    //                     ">
    //                   <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/emailic.png" alt="Email icon" style="width: 15px; height: auto" />
    //                   support@presshop.news
    //                 </p>
    //                 <p style="
    //                       margin-top: 0px;
    //                       font-size: 15px;
    //                       font-weight: 300;
    //                       font-family: 'Work Sans', sans-serif;
    //                       margin-bottom: 15px;
    //                     ">
    //                   <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/websiteic.png" alt="Website icon" style="width: 15px; height: auto" />
    //                   www.presshop.news
    //                 </p>
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/twitter.png" alt="" style="width: 28px; height: auto" />
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/linkedIn.png" alt="" style="width: 28px; height: auto" />
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/instagram.png" alt="" style="width: 28px; height: auto" />
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/fb.png" alt="" style="width: 28px; height: auto" />
    //               </td>
    //               <td width="50%" align="right" style="vertical-align: bottom">
    //                 <p style="
    //                       font-size: 15px;
    //                       font-family: 'Work Sans', sans-serif;
    //                       margin-bottom: 15px;
    //                       font-weight: 500;
    //                       font-family: 'Work Sans', sans-serif;
    //                       width: 337px;
    //                       text-align: left;
    //                     ">
    //                   Disclaimer
    //                 </p>
    //                 <p style="
    //                       margin-bottom: 30px;
    //                       font-size: 12px;
    //                       font-weight: 400;
    //                       font-family: 'Work Sans', sans-serif;
    //                       width: 337px;
    //                       text-align: justify;
    //                     ">
    //                   If you have received this email in error please notify
    //                   Presso Media UK Limited immediately. This message contains
    //                   confidential information and is intended only for the
    //                   individual named. If you are not the named addressee, you
    //                   should not disseminate, distribute or copy this e-mail.
    //                 </p>
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/appStore.png" alt="Appstore" style="width: 118px; height: auto" />
    //                 <img src="https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/googlePlay.png" alt="googlePlay store" style="width: 118px; height: auto" />
    //               </td>
    //             </tr>
    //             <!-- <tr>
    //         <td>
    //           <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/twitter.png" alt="" style="width: 28px; height: auto;">
    //           <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/linkedIn.png" alt="" style="width: 28px; height: auto;">
    //           <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/instagram.png" alt="" style="width: 28px; height: auto;">
    //           <img src="/https://uat.presshop.live/presshop_rest_apis/public/tempate-data/imgs/fb.png" alt="" style="width: 28px; height: auto;">
    //         </td>
    //         </tr> -->
    //           </table>
    //         </td>
    //       </tr>
    //     </tbody>
    //   </table>
    // </body>

    // </html>`)
  } catch (err) {
    utils.handleError(res, err);
  }
};


exports.successforBulk = async (req, res) => {
  try {





    const sessions = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    // const customer = await stripe.customers.retrieve(session.metadata.customer);
    // const lineItems = await stripe.checkout.sessions.listLineItems(
    //   'cs_test_b1AO7S81UGbxBOGOEyGAxXcSl9J4WTyPoLNhgDhMU70TM2b0FkTsKVh7gM',
    //   { limit: Number.MAX_SAFE_INTEGER }
    // )
    const paymentIntentId = sessions.payment_intent;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const bulkdataCount = await bulkTransaction.countDocuments({
      user_id: sessions.metadata.user_id,
    });
    // Step 3: Get the Charge Object
    const latestcharge = paymentIntent?.latest_charge
    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
    // const charge = paymentIntent.charges.data[0];
    // Step 4: Retrieve Fee Details from the Balance Transaction
    const balanceTransaction = await stripe.balanceTransactions.retrieve(charge.balance_transaction);
    const stripeFeeforAll = (balanceTransaction.fee / 100) / bulkdataCount
    const netAmount = balanceTransaction.net / 100;

    // const customer = await stripe.customers.retrieve(sessions.metadata.customer);




    const invoice = await stripe.invoices.finalizeInvoice(
      sessions.metadata.invoice_id
    );
    const getallinvoices = await stripe.invoices.retrieve(
      sessions.metadata.invoice_id
    );

    const invoice_number = getallinvoices.number;

    // console.log("typeof0000000000>>>>>>>>>>>>>>>>>", typeof  "data============", JSON.parse(sessions.metadata.data))


    const bulkdata = await bulkTransaction.find({
      user_id: sessions.metadata.user_id,
    }).sort({createdAt:-1});

   
    // for (const session of bulkdata)
      const promises = bulkdata.map(async (session) => {


        session.hopper_charge_ac_category =  (session.hopper_charge_ac_category * session.original_ask_price)/100
console.log("session--------------originalprice=======",session.original_ask_price, "session----hopperprice",session.hopper_charge_ac_category,"stripecharge-------",stripeFeeforAll)
      // finalizee the invoize

      // const creditNote = await stripe.creditNotes.create({
      //   invoice: session.invoice_id,
      // });


      console.log("step-----------------00000000000000", session, session.type)


      // main calulation ::::===============
      const vat = (session.amount * 20) / 100;
      const originalamount = session.amount
      const value = (parseFloat(session.amount) + (session.offer == true || session.offer == "true" ? 0 : parseFloat(vat))) - parseFloat(sessions?.total_details?.amount_discount / 100);
      // const value = (parseFloat(session) + parseFloat(vat))  - parseInt(session?.total_details?.amount_discount/100);   // hopper content value + vat 144
      const newcommistionaddedVat = (session.offer == true || session.offer == "true") ? parseFloat(sessions?.total_details?.amount_tax / 100) : parseFloat(sessions?.total_details?.amount_tax / 100) //value * 0.20     // 24 for 100 rs content because vat is addedd to 120 +vat
      console.log("step-----------------value", value)
      // const final 

      let apiUrl, apiurlfortransactiondetails


      if (session.type == "content") {
        apiUrl = `https://uat.presshop.live:5019/mediahouse/image_pathdownload?image_id=${session.product_id}&type=content`
        //  aaa       =========================================start ------======================================
        await db.updateItem(session.product_id, Contents, {
          // is_hide:true,
          sale_status: "sold",
          paid_status: "paid",
          amount_paid: Number(value),
          purchased_publication: session.user_id,

        });
        //  aaa       =========================================end ------========================================

        console.log("step-----------inside content------00000000000000")

        const findreceiver = await Contents.findOne({
          _id: session.product_id,
        });


        const findroomforSocket = await Chat.findOne({
          paid_status: false,
          message_type: "accept_mediaHouse_offer",
          sender_id: session.user_id,
          image_id: session.product_id
        })


        

        if (findreceiver) {
          console.log("value-------",)


          // const valueforchat = {
          //   image_id: session.product_id,

          //   receiver_id: session.user_id,
          //   message_type: "PaymentIntentApp",
          //   presshop_commission: parseFloat(session.application_fee),
          //   stripe_fee: parseFloat(stripeFeeforAll),
          //   amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
          //   hopper_price: session.hopper_price,
          //   payable_to_hopper: (value) - (parseFloat(session.application_fee) + parseFloat(stripeFeeforAll)),
          //   paid_status: true
          // }

          // const added = await Chat.create(valueforchat);
          // io.to(session.product_id).emit("chat message", added)
        }
        if (findroomforSocket) {



          const valueforchat = {
            room_id: findroomforSocket.room_id,
            image_id: findroomforSocket.image_id,
            receiver_id: session.user_id,
            message_type: "PaymentIntent",
            amount: findroomforSocket.amount,
            hopper_price: session.hopper_price,
            payable_to_hopper: (value) - (parseFloat(session.application_fee) + parseFloat(stripeFeeforAll) + parseFloat(vat)),
            paid_status: true
          }


          const upadteaccpet = await Chat.updateMany({ room_id: findroomforSocket.room_id, message_type: "accept_mediaHouse_offer" }, { $set: { paid_status: true } })

          const added = await Chat.create(valueforchat);
          io.to(findroomforSocket.room_id).emit("chat message", added)

          io.to(findroomforSocket.image_id).emit("chat message", added)

          const valueforchat2 = {
            room_id: findroomforSocket.room_id,
            image_id: findroomforSocket.image_id,
            receiver_id: session.user_id,
            message_type: "count_with_view",
            views: findreceiver.content_view_count_by_marketplace_for_app,
            purchase_count: typeof findreceiver?.purchased_mediahouse == "string" ? JSON.parse(findreceiver?.purchased_mediahouse) ? JSON.parse(findreceiver?.purchased_mediahouse).length > 0 : 1 : findreceiver?.purchased_mediahouse.length
          }

          const added2 = await Chat.create(valueforchat2);





          io.to(findroomforSocket.room_id).emit("chat message", added2)

          io.to(findroomforSocket.image_id).emit("chat message", added2)
        }


        if (session.reconsider) {
          const valueforchat = {
            room_id: session.room_id,
            image_id: session.product_id,
            receiver_id: session.user_id,
            message_type: "PaymentIntent",
            amount: session.reconsider_amount,
            paid_status: true
          }

          const upadteaccpet = await Chat.updateMany({ room_id: session.room_id, message_type: "accept_mediaHouse_offer" }, { $set: { paid_status: true } })


          const added = await Chat.create(valueforchat);

          io.to(session.room_id).emit("chat message", added)

          io.to(session.product_id).emit("chat message", added)
        }
        //update paid status true in chat document where hopper accepted a mediahouse offer to determine which content need to pay
        const updatePaidStatusinChat = await Chat.updateMany({
          paid_status: false,
          message_type: "accept_mediaHouse_offer",
          receiver_id: session.user_id,
          image_id: session.product_id
        }, { paid_status: true });


        const newMediaHouse = {
          media_house_id: session.user_id,
          is_hide: true
        };

        const recentactivityupdate = await recentactivity.updateMany({
          content_id: session.product_id,
          user_id: session.user_id,
        }, { paid_status: true });

        // await Contents.findByIdAndUpdate(
        //   session.product_id,
        //   { $push: { purchased_mediahouse_time: newMediaHouse } },
        //   { new: true },
        //   (err, updatedDocument) => {
        //     if (err) {
        //       console.error('Error:', err);
        //     } else {
        //       
        //     }
        //   }
        // );
        // condition 2 =========================
        const findroom = await Room.findOne({
          content_id: session.product_id,
        });

        console.log("step-----------------1")
        if (findroom) {
          const added = await Chat.updateMany(
            {
              room_id: findroom.room_id,
            },
            { paid_status: true, amount_paid: parseFloat(session.amount) }
          );
        } else {
          console.error("error");
        }
        // condition 3 ===========================
        // const findreceiver = await Contents.findOne({
        //   _id: session.product_id,
        // });

        console.log("step-----------------2")
        if (session.product_id) {
          const respon = await Contents.findOne({
            _id: session.product_id,
          }).populate("hopper_id");


          const purchased_mediahouse = findreceiver.purchased_mediahouse.map((hopperIds) => hopperIds);
          if (!purchased_mediahouse.includes(session.user_id)) {
            const update = await Contents.updateOne(
              { _id: session.product_id },
              {
                $push: { purchased_mediahouse: session.user_id, payment_intent: paymentIntentId, charge_ids: latestcharge },
                $pull: { offered_mediahouses: session.user_id }
              }
            );
          }
          const date = new Date()
          const Vatupdateofcontent = findreceiver.Vat.map((hopperIds) => hopperIds.purchased_mediahouse_id);
          // if (!Vatupdateofcontent.includes(session.user_id)) {
          //   const update = await Contents.updateOne(
          //     { _id: session.product_id },
          //     { $push: { Vat: { purchased_mediahouse_id: session.user_id, Vat: vat, amount: value, purchased_time: date } }, }
          //   );
          // }
          // for pro
          const responseforcategory = await Category.findOne({
            type: "commissionstructure",
            _id: "64c10c7f38c5a472a78118e2",
          }).populate("hopper_id");
          const commitionforpro = parseFloat(responseforcategory.percentage);
          const paybymedihousetoadmin = (session.offer == true || session.offer == "true") ? respon.amount_paid : respon.amount_paid - vat//respon.amount_paid - vat; // amout paid by mediahouse with vat


          //  end
          // for amateue
          const responseforcategoryforamateur = await Category.findOne({
            type: "commissionstructure",
            _id: "64c10c7538c5a472a78118c0",
          }).populate("hopper_id");
          const commitionforamateur = parseFloat(
            responseforcategoryforamateur.percentage
          );
          const paybymedihousetoadminforamateur = (session.offer == true || session.offer == "true") ? respon.amount_paid : respon.amount_paid - vat;
          const paybymedihousetoadminforPro = (session.offer == true || session.offer == "true") ? respon.amount_paid : respon.amount_paid - vat;//respon.amount_paid - vat;


          console.log("step-----------------3")

          if (respon.type == "shared") {
            console.log("step-----------------4")
            // old code
            // if (!Vatupdateofcontent.includes(session.user_id)) {
            //   const update = await Contents.updateOne(
            //     { _id: session.product_id },
            //     { $push: { Vat: { amount_without_Vat: (value - vat), purchased_mediahouse_id: session.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "shared" } }, }
            //   );
            // }
            if (respon.hopper_id.category == "pro") {

             
              const paid = commitionforpro * paybymedihousetoadminforPro;//paybymedihousetoadmin;
              const percentage = paid / 100;
              const paidbyadmin = paybymedihousetoadmin - percentage;
              const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
              const hopperPayableAmount =  (session.original_ask_price - session.hopper_charge_ac_category - stripeFee).toFixed(2)// paidbyadmin - stripeFee
              console.log('Paid:', paid ,paybymedihousetoadminforPro );
              console.log('hopperPayableAmount:', hopperPayableAmount );
              let data = {
                ...req.body,
                payment_intent_id: paymentIntentId,
                media_house_id: session.user_id,
                charge_id: latestcharge,
                percentage: percentage,
                original_ask_price: respon.amount_paid - vat,
                paidbyadmin: paidbyadmin,
                content_id: session.product_id,
                hopper_id: findreceiver.hopper_id,
                admin_id: "64bfa693bc47606588a6c807",
                original_Vatamount: vat,
                Vat: newcommistionaddedVat,// vat,
                amount: value + newcommistionaddedVat,// - parseFloat(session?.total_details?.amount_discount / 100),
                invoiceNumber: invoice_number,
                presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),// + parseFloat(session?.total_details?.amount_discount / 100)),
                payable_to_hopper: hopperPayableAmount,
                stripe_fee: stripeFee,
                transaction_fee: netAmount,
                type: "content",
                payment_content_type: "shared",
                category_id: respon.category_id,
                image_count: respon.image_count,
                video_count: respon.video_count,
                audio_count: respon.audio_count,
                other_count: respon.other_count

              };
              data = addDueDate(data);
              const payment = await db.createItem(data, HopperPayment);


              const transfer = await stripe.transfers.create({
                amount: Number(hopperPayableAmount) * 100,
                currency: 'gbp',
                destination: session.stripe_account_id,
                source_transaction: latestcharge,
              })


              const valueforchat = {
                image_id: session.product_id,

                receiver_id: session.user_id,
                message_type: "PaymentIntentApp",
                presshop_commission: parseFloat(session.application_fee),
                stripe_fee: parseFloat(stripeFeeforAll),
                amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
                hopper_price: session.hopper_price,
                payable_to_hopper: Number(hopperPayableAmount),
                paid_status: true
              }

              const added = await Chat.create(valueforchat);
              io.to(session.product_id).emit("chat message", added)
              // apiurlfortransactiondetails =  `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
              apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
              if (!Vatupdateofcontent.includes(session.user_id)) {
                // (parseFloat(session?.total_details?.amount_discount / 100)
                // - parseFloat(vat)
                const update = await Contents.updateOne(
                  { _id: session.product_id },
                  { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - (stripeFee), invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.offer == true || session.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "shared" } }, }
                );
              }
              await db.updateItem(session.product_id, Contents, {
                // sale_status:"sold",
                transaction_id: payment._id,
                amount_payable_to_hopper: paidbyadmin,
                commition_to_payable: percentage,
                IsShared: true

              });
            } else if (respon.hopper_id.category == "amateur") {
              const paid = commitionforamateur * paybymedihousetoadminforamateur;
              const percentage = paid / 100;

              const paidbyadmin = paybymedihousetoadminforamateur - percentage;
              const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
              const hopperPayableAmount =  (session.original_ask_price - session.hopper_charge_ac_category - stripeFee).toFixed(2)// paidbyadmin - stripeFee
              console.log('Paid:', paid ,paybymedihousetoadminforPro );
              console.log('hopperPayableAmount:', hopperPayableAmount );
              let data = {
                ...req.body,
                media_house_id: session.user_id,
                charge_id: latestcharge,
                payment_intent_id: paymentIntentId,
                percentage: percentage,
                original_ask_price: respon.amount_paid - vat,
                content_id: session.product_id,
                hopper_id: findreceiver.hopper_id,
                admin_id: "64bfa693bc47606588a6c807",
                original_Vatamount: vat,
                Vat: newcommistionaddedVat,// vat,
                invoiceNumber: invoice_number,
                paidbyadmin: paidbyadmin,
                amount: value + newcommistionaddedVat,// - parseFloat(session?.total_details?.amount_discount / 100),
                transaction_fee: netAmount,
                presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),// + parseFloat(session?.total_details?.amount_discount / 100)),
                payable_to_hopper: hopperPayableAmount,
                stripe_fee: stripeFee,
                type: "content",
                payment_content_type: "shared",
                category_id: respon.category_id,
                image_count: respon.image_count,
                video_count: respon.video_count,
                audio_count: respon.audio_count,
                other_count: respon.other_count
              };

              data = addDueDate(data);
              const payment = await db.createItem(data, HopperPayment);
              const transfer = await stripe.transfers.create({
                amount: Number(hopperPayableAmount) * 100,
                currency: 'gbp',
                destination: session.stripe_account_id,
                source_transaction: latestcharge,
              })


              const valueforchat = {
                image_id: session.product_id,

                receiver_id: session.user_id,
                message_type: "PaymentIntentApp",
                presshop_commission: parseFloat(session.application_fee),
                stripe_fee: parseFloat(stripeFeeforAll),
                amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
                hopper_price: session.hopper_price,
                payable_to_hopper: Number(hopperPayableAmount),
                paid_status: true
              }

              const added = await Chat.create(valueforchat);
              // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
              apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
              // if (!Vatupdateofcontent.includes(session.user_id)) {
              //   const update = await Contents.updateOne(
              //     { _id: session.product_id },
              //     { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (value - vat), purchased_mediahouse_id: session.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "shared" } }, }
              //   );
              // }
              // + parseFloat(session?.total_details?.amount_discount / 100)
              if (!Vatupdateofcontent.includes(session.user_id)) {
                const update = await Contents.updateOne(
                  { _id: session.product_id },
                  { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - (stripeFee), invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.offer == true || session.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "shared" } }, }
                );
              }
              await db.updateItem(session.product_id, Contents, {
                transaction_id: payment._id,
                amount_payable_to_hopper: paidbyadmin,
                commition_to_payable: percentage,
                IsShared: true
              });
            } else {
              console.error("error");
            }
          } else {

            if (respon.donot_share == false || respon.donot_share == "false") {

              const data = {
                content_id: session.product_id,
                submited_time: new Date(),
                type: "purchased_exclusive_content"
              }
              const queryforexclus = await db.createItem(data, query);
            }
            // old code
            // if (!Vatupdateofcontent.includes(session.user_id)) {
            //   const update = await Contents.updateOne(
            //     { _id: session.product_id },
            //     { $push: { Vat: { amount_without_Vat: (value - vat), purchased_mediahouse_id: session.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "exclusive" } }, }
            //   );
            // }
            if (respon.hopper_id.category == "pro") {
              const paid = commitionforpro * paybymedihousetoadminforPro//paybymedihousetoadmin;
              const percentage = paid / 100;
              const paidbyadmin = paybymedihousetoadmin - percentage;
              const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
              const hopperPayableAmount =  (session.original_ask_price - session.hopper_charge_ac_category - stripeFee).toFixed(2)// paidbyadmin - stripeFee
              console.log('hopperPayableAmount:', hopperPayableAmount );
              let data = {
                ...req.body,
                media_house_id: session.user_id,
                charge_id: latestcharge,
                percentage: percentage,
                payment_intent_id: paymentIntentId,
                original_ask_price: respon.amount_paid - vat,
                content_id: session.product_id,
                hopper_id: findreceiver.hopper_id,
                admin_id: "64bfa693bc47606588a6c807",
                original_Vatamount: vat,
                Vat: newcommistionaddedVat,// vat,
                amount: value + newcommistionaddedVat,//- parseFloat(session?.total_details?.amount_discount / 100),
                invoiceNumber: invoice_number,
                transaction_fee: netAmount,
                presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),//+ parseFloat(session?.total_details?.amount_discount / 100)),
                payable_to_hopper: hopperPayableAmount,
                stripe_fee: stripeFee,
                type: "content",
                paidbyadmin: paidbyadmin,
                payment_content_type: "exclusive",
                category_id: respon.category_id,
                image_count: respon.image_count,
                video_count: respon.video_count,
                audio_count: respon.audio_count,
                other_count: respon.other_count
              };
              data = addDueDate(data);

              const payment = await db.createItem(data, HopperPayment);
              const transfer = await stripe.transfers.create({
                amount: Number(hopperPayableAmount) * 100,
                currency: 'gbp',
                destination: session.stripe_account_id,
                source_transaction: latestcharge,
              })



              const valueforchat = {
                image_id: session.product_id,

                receiver_id: session.user_id,
                message_type: "PaymentIntentApp",
                presshop_commission: parseFloat(session.application_fee),
                stripe_fee: parseFloat(stripeFeeforAll),
                amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
                hopper_price: session.hopper_price,
                payable_to_hopper: Number(hopperPayableAmount),
                paid_status: true
              }

              const added = await Chat.create(valueforchat);
              // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
              apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
              // if (!Vatupdateofcontent.includes(session.user_id)) {
              //   const update = await Contents.updateOne(
              //     { _id: session.product_id },
              //     { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (value - vat), purchased_mediahouse_id: session.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "exclusive" } }, }
              //   );
              // }
              // ( + parseFloat(session?.total_details?.amount_discount / 100))
              //- parseFloat(session?.total_details?.amount_discount / 100)
              if (!Vatupdateofcontent.includes(session.user_id)) {
                const update = await Contents.updateOne(
                  { _id: session.product_id },
                  { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - stripeFee, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.offer == true || session.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "exclusive" } }, }
                );
              }
              await db.updateItem(session.product_id, Contents, {
                transaction_id: payment._id,
                amount_payable_to_hopper: paidbyadmin,
                commition_to_payable: percentage,
                is_hide: true,
                IsExclusive: true
              });
            } else if (respon.hopper_id.category == "amateur") {
              const paid = commitionforamateur * paybymedihousetoadminforamateur;
              const percentage = paid / 100;

              const paidbyadmin = paybymedihousetoadminforamateur - percentage;
              const stripeFee = stripeFeeforAll //paidbyadmin * (dynamicStripePercentage.ProPercentage / 100)
              const hopperPayableAmount =  (session.original_ask_price - session.hopper_charge_ac_category - stripeFee).toFixed(2)// paidbyadmin - stripeFee
              console.log('hopperPayableAmount:', hopperPayableAmount );
              let data = {
                ...req.body,
                media_house_id: session.user_id,
                content_id: session.product_id,
                payment_intent_id: paymentIntentId,
                charge_id: latestcharge,
                percentage: percentage,
                original_ask_price: respon.amount_paid - vat,
                hopper_id: findreceiver.hopper_id,
                admin_id: "64bfa693bc47606588a6c807",
                original_Vatamount: vat,
                Vat: newcommistionaddedVat,// vat,
                paidbyadmin: paidbyadmin,
                amount: value + newcommistionaddedVat,//- parseFloat(session?.total_details?.amount_discount / 100),
                invoiceNumber: invoice_number,
                transaction_fee: netAmount,
                presshop_commission: (paybymedihousetoadminforPro - paidbyadmin) + percentage + newcommistionaddedVat - (stripeFee),// + parseFloat(session?.total_details?.amount_discount / 100)),
                payable_to_hopper: hopperPayableAmount,
                stripe_fee: stripeFee,
                type: "content",
                payment_content_type: "exclusive",
                category_id: respon.category_id,
                image_count: respon.image_count,
                video_count: respon.video_count,
                audio_count: respon.audio_count,
                other_count: respon.other_count
              };
              data = addDueDate(data);
              const payment = await db.createItem(data, HopperPayment);

              const transfer = await stripe.transfers.create({
                amount: Number(hopperPayableAmount) * 100,
                currency: 'gbp',
                destination: session.stripe_account_id,
                source_transaction: latestcharge,
              })



              const valueforchat = {
                image_id: session.product_id,

                receiver_id: session.user_id,
                message_type: "PaymentIntentApp",
                presshop_commission: parseFloat(session.application_fee),
                stripe_fee: parseFloat(stripeFeeforAll),
                amount: (value + parseFloat(newcommistionaddedVat)) - parseFloat(session?.total_details?.amount_discount / 100),
                hopper_price: session.hopper_price,
                payable_to_hopper: Number(hopperPayableAmount),
                paid_status: true
              }

              const added = await Chat.create(valueforchat);
              // apiurlfortransactiondetails = `https://uat.presshop.live:5019/mediahouse/getallinvoiseforMediahouse?id=${payment._id}`
              apiurlfortransactiondetails = `${process.env.apiurlfortransactiondetails}${payment._id}`
              // if (!Vatupdateofcontent.includes(session.user_id)) {
              //   const update = await Contents.updateOne(
              //     { _id: session.product_id },
              //     { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage, invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (value - vat), purchased_mediahouse_id: session.user_id, Vat: vat, amount: value, purchased_time: date, purchased_content_type: "exclusive" } }, }
              //   );
              // }
              // + parseFloat(session?.total_details?.amount_discount / 100))
              // - parseFloat(session?.total_details?.amount_discount / 100)
              if (!Vatupdateofcontent.includes(session.user_id)) {
                const update = await Contents.updateOne(
                  { _id: session.product_id },
                  { $push: { Vat: { stripe_fee: stripeFee, paybletohopper: hopperPayableAmount, presshop_committion: percentage + newcommistionaddedVat - (stripeFee), invoice_number: invoice_number, transaction_id: payment._id, amount_without_Vat: (session.offer == true || session.offer == "true" ? (parseFloat(value)) : parseFloat(value)), purchased_mediahouse_id: session.user_id, Vat: newcommistionaddedVat, amount: value + newcommistionaddedVat, purchased_time: date, purchased_content_type: "exclusive" } }, }
                );
              }
              await db.updateItem(session.product_id, Contents, {
                transaction_id: payment._id,
                amount_payable_to_hopper: paidbyadmin,
                commition_to_payable: percentage,
                is_hide: true,  //  to hide content for all mediahouse if a mediahouse buy content 
                IsExclusive: true // which type of content is buy 
              });
            }
          }
        }
        const publication = await User.findOne({
          _id: session.user_id
        });
        const notiObj1 = {
          sender_id: findreceiver.hopper_id,
          receiver_id: findreceiver.hopper_id,
          // data.receiver_id,
          title: "Content successfully sold",
          body: `WooHoo🤩💰You have received £${formatAmountInMillion(findreceiver.ask_price)} from ${publication.first_name}. VIsit My Earnings on your app to manage and track your payments🤟🏼`
          ,
        };
        const resp1 = await _sendPushNotification(notiObj1);
        // ---------===============================end===========================================================
      }
    });

    // Execute all promises
    await Promise.all(promises);

    await addToBasket.deleteMany({user_id:sessions.metadata.user_id})
    await bulkTransaction.deleteMany({user_id:sessions.metadata.user_id})

    res.redirect(
      `https://new-presshop-mediahouse.web.app/dashboard-tables/content_purchased_online`
      // `<html><body><h1>! Your payment is success. </h1></body></html>`
    );


  } catch (err) {
    utils.handleError(res, err);
  }
};
const getPaymentPrice = async (image_id, task_content_id) => {
  const result = await Contents.findById(image_id);
  if (image_id) {
    return result.amount_paid ? result.amount_paid : null;
  } else {
    const respon = await Uploadcontent.findById(task_content_id);
    return respon.amount_paid ? respon.amount_paid : null;
  }
};
exports.createPayment = async (req, res) => {
  try {
    const data = req.body;
    const amountwithoutvat = data.amount
    const withvat = (data.amount * 0.20) + data.amount
    const minprice = parseFloat(req.user?.admin_rignts?.price_range?.minimum_price)
    const maxprice = parseFloat(req.user?.admin_rignts?.price_range?.maximum_price)


    if (req.user.admin_rignts.allowed_to_purchase_content == false || req.user.admin_rignts.allowed_to_purchase_content == "false") {
      // return utils.handleError(res, "You are not allowed to purchase content");/
      return res.status(404).json({
        code: 404, errors: {
          msg: "You are not allowed to purchase content"
        }
      })
    }
    //  1200      false     10         1200     3500

    // if ((req.user.admin_rignts.allowed_to_purchase_content == true || req.user.admin_rignts.allowed_to_purchase_content == "true") && ((withvat < minprice) || (withvat <  maxprice))) {
    //   // return utils.handleError(res, "You are not allowed to purchase content");/
    //   return res.status(404).json({
    //     code: 404, errors: {
    //       msg: "You are not allowed to purchase content"
    //     }
    //   })
    // }


    if (!req.user.admin_rignts.allowed_to_purchase_content) {
      return res.status(403).json({ code: 403, errors: { msg: "You are not allowed to purchase content" } });
    }


    const value = data.amount * 100 + ((data.amount * 20) / 100) * 100
    const value2 = data.amount * 100


    const newadded = (data.offer == false) || (data.offer == "false") ? value : value2 //  parseInt(value * 0.20) : 0
    const amountWithVAT = (newadded * 0.20) + newadded

    if (amountWithVAT / 100 < minprice || amountWithVAT / 100 > maxprice) {


      return res.status(400).json({
        code: 400,
        errors: {
          msg: `The amount with VAT (${amountWithVAT / 100}) must be between ${minprice} and ${maxprice}.`
        }
      });
    }


    const invoice = await stripe.invoices.create({
      customer: req.user.stripe_customer_id,
    });



    const contentdetails = await Contents.findOne({ _id: data.image_id })
    //    let valueforcontent
    // if(contentdetails) {
    //   valueforcontent =  contentdetails.content.map((x) => x.watermark)
    // }
    const discounts = [];
    let promovalue = false
    if (data.promoCode == "true" || data.promoCode == true) {
      promovalue = true
    }

    // Check if the promotion code is valid (not empty)
    if (data.promotionCode && data.promotionCode.trim() !== '') {
      discounts.push({ promotion_code: data.promotionCode });
    }

    if (data.coupon && data.coupon.trim() !== '') {
      discounts.push({ coupon: data.coupon });
    }











    // const account = await stripe.accounts.update(
    //   data.stripe_account_id?.toString(),
    //   {
    //     settings: {
    //       branding: {
    //         icon: '{{FILE_ID}}',
    //         logo: '{{FILE_ID}}',
    //         primary_color: '#663399',
    //         secondary_color: '#4BB543',
    //       },
    //     },
    //   }
    // );



    // data.amount * 100 + ((data.amount * 20) / 100) * 100 + newadded,

    const session = await stripe.checkout.sessions.create({
      invoice_creation: {
        enabled: true,
      },
      // currency:"gbp",
      payment_method_types: ['card', 'paypal', 'bacs_debit', "afterpay_clearpay", "klarna"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              // images:valueforcontent ?valueforcontent :[""],
              name: data.description ? data.description : "frontend is not passing description",
              metadata: {
                product_id: data.image_id,
                type: data.type,
                stripe_account_id: data.stripe_account_id
              }
            },
            // tax_behavior:"exclusive",
            unit_amount: parseFloat(newadded.toFixed(2)), // * 100, // dollar to cent
          },

          quantity: 1,
          tax_rates: ["txr_1Q54oaCf1t3diJjXVbYnv7sO"] // inclusive ["txr_1Q8IW4Cf1t3diJjXOROcUGLo"], // exclusive["txr_1Q54oaCf1t3diJjXVbYnv7sO"] //uat["txr_1PvCbmAKmuyBTjDNL4cyetOs"],
        },

      ],
      mode: "payment",
      // allow_promotion_codes: true,
      // automatic_tax: {
      //   enabled: true,
      // },
      metadata: {
        stripe_account_id: data.stripe_account_id,
        reconsider: data.reconsider,
        reconsider_amount: data.reconsider_amount,
        room_id: data.room_id,
        user_id: req.user._id.toString(),
        product_id: data.image_id,
        customer: data.customer_id,
        amount: data.amount, //+ (data.amount * 20/100),
        type: data.type,
        invoice_id: invoice.id,
        task_id: data.task_id,
        email: req.user.email,
        offer: data.offer,
        application_fee: data.application_fee,
        hopper_price: contentdetails?.original_ask_price,
        coupon: data.coupon
      },
      //   discounts:[
      //   {
      //   coupon:"",
      //   promotion_code:""
      //   }
      // ],
      // customer_creation:"if_required",
      discounts: discounts.length > 0 ? discounts : undefined,
      customer: data.customer_id,
      saved_payment_method_options: {
        payment_method_save: "enabled"
      },
      shipping_address_collection: {
        allowed_countries: ["GB", "IN"]
      },
      payment_intent_data: {
        // setup_future_usage: "off_session",
        // application_fee_amount: parseFloat(data.application_fee) * 100,
        // on_behalf_of:data.stripe_account_id,
        metadata: {
          stripe_account_id: data.stripe_account_id,
          reconsider: data.reconsider,
          reconsider_amount: data.reconsider_amount,
          room_id: data.room_id,
          user_id: req.user._id.toString(),
          product_id: data.image_id,
          customer: data.customer_id,
          amount: data.amount, //+ (data.amount * 20/100),
          type: data.type,
          invoice_id: invoice.id,
          task_id: data.task_id,
          email: req.user.email,
          offer: data.offer,
          application_fee: data.application_fee,
          hopper_price: contentdetails?.original_ask_price,
          coupon: data.coupon
        },
        // transfer_data: {
        //   destination: data.stripe_account_id,
        //   amount: newadded - parseFloat(data.application_fee) * 100,
        // },
      },
      success_url:
        process.env.API_URL +
        "/challenge/payment/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: process.env.API_URL + "/challenge/payment/failed?session_id={CHECKOUT_SESSION_ID}",
    },

    );
    // {
    //   stripeAccount: data.stripe_account_id, // Optional: For connected accounts
    // }


    res.status(200).json({
      code: 200,
      url: session.url,
    });
  } catch (error) {

    utils.handleError(res, error);
  }
};

exports.getallofferContent = async (req, res) => {
  try {
    const data = req.query;
    if (data._id) {
      const resp = await Contents.findOne({
        _id: data._id
        // content_under_offer: true,
        // sale_status: "unsold",
      }).populate("hopper_id tag_ids category_id").populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 });

      const img = { sender_id: mongoose.Types.ObjectId(req.user._id), image_id: data._id }
      const todaytotalinvs = await Chat.aggregate([
        {
          $match: img
        },
        {
          $lookup: {
            from: "contents",
            let: {
              content_id: "$image_id",
              // new_id: "$hopper_is_fordetail",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      // { $eq: ["$message_type", "Mediahouse_initial_offer"] },
                      { $eq: ["$_id", "$$content_id"] },
                      // { $eq: ["$sender_id", mongoose.Types.ObjectId(req.user._id)] }
                    ],
                  },
                },
              },
            ],
            as: "content",
          },
        },
        // {
        //   $unwind: "$content",
        //   // preserveNullAndEmptyArrays: true,
        // },
        // {
        //   $addFields: {
        //     heading: "$content.heading",
        //     description: "$content.description",

        //    content_id: "$content._id": 1,
        //    content: "$content.content": 1,
        //     "$content.createdAt": 1,
        //     "$content.updatedAt": 1,
        //     "$content.type": 1,
        //   },
        // },



      ]);

      return res.json({
        code: 200,
        response: resp,
        offeredprice: todaytotalinvs
      });
    } else {

      const resp = await Contents.find({
        is_deleted: false,
        offered_mediahouses: { $in: mongoose.Types.ObjectId(req.user._id) }
        // sale_status: "unsold",
      }).populate("hopper_id").sort({ createdAt: -1 });
      return res.json({
        code: 200,
        response: resp,
      });
    }

  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.createStripeAccount = async (req, res) => {
  try {
    const id = req.user._id;
    // const my_acc = await getItemAccQuery(StripeAccount , {id:id});
    const my_acc = await StripeAccount.findOne({ user_id: id });
    if (my_acc) {
      throw buildErrObject(
        422,
        "You already connected with us OR check your email to verify"
      );
    } else {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: req.user.email,
        business_type: "individual",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
          link_payments: { requested: true },
          bank_transfer_payments: { requested: true },
          card_payments: { requested: true },
        },
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id, //'acct_1NGd5wRhxPwgT5HS',
        refresh_url:
          "https://production.promaticstechnologies.com:3008/users/stripeStatus?status=0&id=" +
          id,
        return_url:
          "https://production.promaticstechnologies.com:3008/users/stripeStatus?status=1&id=" +
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
      user.stripe_status = 1;
      const my_acc = await StripeAccount.findOne({ user_id: data.id });
      user.stripe_account_id = account.account_id;
      await user.save();
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

exports.payouttohopper = async (req, res) => {
  try {
    const data = req.body;

    // const transfer = await stripe.transfers
    //   .create({
    //     amount: data.amount,
    //     currency: "usd",
    //     destination: data.account,
    //   })

    const transfer = await stripe.transfers.create({
      amount: parseFloat(data.amount),
      currency: 'gbp',
      source_transaction: data.source_transaction,
      destination: data.destination,
    })
      .then((response) => {

      })
      .catch((err) => {

      });

    return res.status(200).json({
      code: 200,
      message: transfer,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.uploadDocToBecomePro = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id;
    if (req.body) {
      if (
        req.body.comp_incorporation_cert ||
        req.body.photography_licence ||
        req.body.govt_id
      ) {
        const doc_to_become_pro = {
          govt_id: data.govt_id,
          govt_id_mediatype: data.govt_id_mediatype,
          photography_licence: data.photography_licence,
          photography_mediatype: data.photography_mediatype,
          comp_incorporation_cert: data.comp_incorporation_cert,
          comp_incorporation_cert_mediatype:
            data.comp_incorporation_cert_mediatype,
          delete_doc_when_onboading_completed:
            data.delete_doc_when_onboading_completed,
        };
        data.upload_docs = doc_to_become_pro;
      } else {
        throw utils.buildErrObject(422, "Please send atleast two documents");
      }
    }
    const docUploaded = await db.updateItem(data.user_id, MediaHouse, data);
    res.status(200).json({
      code: 200,
      docUploaded: true,
      docData: docUploaded.doc_to_become_pro,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.uploadmedia = async (req, res) => {
  if (req.files) {
    if (req.files.image) {
      var govt_id = await uploadFiletoAwsS3Bucket({
        fileData: req.files.image,
        path: "public/docToBecomePro",
      });
    }
  }

  res.status(200).json({
    code: 200,
    image: govt_id.fileName,
  });
};
exports.getallinviise = async (req, res) => {
  try {
    const data = req.query;
    let getall;
    let count
    if (req.query.id) {
      count = 1
      getall = await HopperPayment.findOne({
        _id: mongoose.Types.ObjectId(req.query.id),
      })
        .populate("media_house_id  content_id")
        .populate({
          path: "hopper_id",
          populate: {
            path: "avatar_id",
          },
        })
        .populate({
          path: "content_id",
          populate: {
            path: "category_id",
          },
        })
        .populate({
          path: "content_id",
          populate: {
            path: "tag_ids",
          },
        })
        .populate("payment_admin_id admin_id");

      return res.json({
        code: 200,
        resp: getall,
      });
    } else {
      data.user_id = req.user._id


      let val = "day";

      if (data.hasOwnProperty("daily")) {
        val = "day";
      }
      if (data.hasOwnProperty("weekly")) {
        val = "week";
      }

      if (data.hasOwnProperty("monthly")) {
        val = "month";
      }

      if (data.hasOwnProperty("yearly")) {
        val = "year";
      }
      const yesterdayStart = new Date(moment().utc().startOf(val).format());
      const yesterdayEnd = new Date(moment().utc().endOf(val).format());

      // let yesterdays;

      let yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
      };

      if (data.startDate && data.endDate) {
        filters.createdAt = {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        };
      }
      if (data.daily || data.yearly || data.monthly || data.weekly) {
        yesterdays.createdAt = {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        }
      }

      if (data.task == "true" || data.task == true) {
        yesterdays.$and = [
          {
            task_content_id: { $exists: true }
          },
          {
            type: "task_content"
          }
        ]
      }

      if (data.content == "true" || data.content == true) {
        yesterdays.$and = [
          {
            content_id: { $exists: true }
          },
          {
            type: "content"
          }
        ]
      }
      // else {
      //   yesterdays = {
      //     media_house_id: mongoose.Types.ObjectId(req.user._id),
      //   };
      // }


      getall = await HopperPayment.find(yesterdays)
        .populate("media_house_id hopper_id content_id")
        .populate({
          path: "hopper_id",
          select: "avatar_id user_name profile_image first_name stripe_customer_id category",
          populate: {
            path: "avatar_id",
          },
        })
        .populate({
          path: "content_id",
          populate: {
            path: "category_id",
          },
        })
        .populate({
          path: "task_content_id",
          populate: {
            path: "task_id",
            select: "location",
          },
        })
        .populate({
          path: "content_id",
          populate: {
            path: "tag_ids",
          },
        })
        .populate("payment_admin_id").sort({ createdAt: -1 }).limit(data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER).skip(data.offset ? parseInt(data.offset) : 0);

      count = await HopperPayment.countDocuments(yesterdays)
    }

    return res.json({
      code: 200,
      resp: getall,
      count: count
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.AccountbyContentCount = async (req, res) => {
  try {
    // ------------------------------------today fund invested -----------------------------------
    const yesterdayStart = new Date(moment().utc().startOf("month").format());
    const yesterdayEnd = new Date(moment().utc().endOf("month").format());

    const prev_month = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );

    const prev_monthend = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );
    // const totalpreviousMonth = await Contents.aggregate([
    //   {
    //     $group: {
    //       _id: "$purchased_publication",
    //       totalamountpaid: { $sum: "$amount_paid" },
    //     },
    //   },
    //   {
    //     $match: {
    //       $and: [
    //         { _id: { $eq: req.user._id } },
    //         { updatedAt: { $gte: prev_month } },
    //         { updatedAt: { $lt: prev_monthend } },
    //       ],
    //     },
    //   },
    //   {
    //     $addFields: {
    //       console: "$amount_paid",
    //     },
    //   },
    //   {
    //     $project: {
    //       paid_status: 1,
    //       purchased_publication: 1,
    //       amount_paid: 1,
    //       totalamountpaid: 1,
    //       console: 1,
    //       paid_status: 1,
    //     },
    //   },
    //   {
    //     $sort: {
    //       createdAt: -1,
    //     },
    //   },
    // ]);

    const total = await HopperPayment.aggregate([
      {
        $match: {
          media_house_id: mongoose.Types.ObjectId(req.user._id),
          type: "content",
        },
      },
      {
        $group: {
          _id: null,// "$purchased_publication",
          totalamountpaid: { $sum: "$amount" },
          data: { $push: "$$ROOT" },
        },
      },


      // {
      //   $project: {
      //     paid_status: 1,
      //     purchased_publication: 1,
      //     amount_paid: 1,
      //     totalamountpaid: 1,

      //     paid_status: 1,
      //     data: 1,
      //   },
      // },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    const curr_mStart = new Date(moment().utc().startOf("week").format());
    const curr_m_emd = new Date(moment().utc().endOf("week").format());

    // const totalcurrentMonth = await Contents.aggregate([
    //   {
    //     $group: {
    //       _id: "$purchased_publication",
    //       totalamountpaid: { $sum: "$amount_paid" },
    //     },
    //   },
    //   {
    //     $match: {
    //       $and: [
    //         { _id: { $eq: req.user._id } },
    //         { updatedAt: { $gte: curr_mStart } },
    //         { updatedAt: { $lt: curr_m_emd } },
    //       ],
    //     },
    //   },

    //   {
    //     $addFields: {
    //       console: "$amount_paid",
    //     },
    //   },
    //   {
    //     $project: {
    //       paid_status: 1,
    //       purchased_publication: 1,
    //       amount_paid: 1,
    //       totalamountpaid: 1,
    //       console: 1,
    //       paid_status: 1,
    //     },
    //   },
    //   {
    //     $sort: {
    //       createdAt: -1,
    //     },
    //   },
    // ]);



    const totalcurrentMonth = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: yesterdayEnd,
            $gte: yesterdayStart,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })

    const totalpreviousMonth = await Contents.countDocuments({
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: req.user._id,
          purchased_time: {
            $lte: prev_monthend,
            $gte: prev_month,
          }
        }
      },
      // purchased_mediahouse:{$in:req.user._id}
    })
    const content_counts = totalcurrentMonth;
    const prev_total_content = totalpreviousMonth;

    let percent5;
    var type5;
    if (content_counts > prev_total_content) {
      const diff = prev_total_content / content_counts;
      percent5 = diff * 100;
      type5 = "increase";
    } else {
      const diff = content_counts / prev_total_content;
      percent5 = diff * 100;
      type5 = "decrease";
    }
    // ------------------------------------- // code of online content start ---------------------------------------------


    const getcontentonline = await HopperPayment.find({
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      type: "content",
    }).populate("media_house_id content_id");

    const getcontentonlineCount = await HopperPayment.countDocuments({
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      type: "content",
    });


    const weekStart = new Date(moment().utc().startOf("week").format());
    const weekEnd = new Date(moment().utc().endOf("week").format());
    let weekday = {
      paid_status: "paid",
      updatedAt: {
        $lte: weekEnd,
        $gte: weekStart,
      },
    };

    const prev_weekStart = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const prev_weekEnd = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );
    let lastweekday = {
      paid_status: "paid",
      updatedAt: {
        $lte: prev_weekEnd,
        $gte: prev_weekStart,
      },
    };

    // const BroadCasted = await db.getItemswithsortOnlyCount(
    //   BroadCastTask,
    //   last_month,
    //   sort,
    // );
    const sort1 = { createdAt: -1 };
    const content = await db.getItemswithsortOnlyCount(Contents, weekday, sort1);
    const content_count = content.length;
    const curr_week_percent = content_count / 100;
    const prevcontent = await db.getItemswithsortOnlyCount(Contents, lastweekday.sort1);
    const prevcontent_count = prevcontent.length;
    const prev_week_percent = prevcontent_count / 100;
    let percent1;
    var type1;
    if (content_count > prevcontent_count) {
      const diff = prevcontent_count / content_count;
      percent1 = diff * 100;
      type1 = "increase";
    } else {
      const diff = content_count / prevcontent_count;
      percent1 = diff * 100;
      type1 = "decrease";
    }

    // ------------------end---------------------------------------
    // ---------------------------------------favarrate start------------------------------------

    //  ------------------------------------------------end-------------------------------------------

    // const contentsourcedfromtask = await Uploadcontent.aggregate([
    //   {
    //     $lookup: {
    //       from: "tasks",
    //       localField: "task_id",
    //       foreignField: "_id",
    //       as: "task_id",
    //     },
    //   },

    //   { $unwind: "$task_id" },

    //   {
    //     $match: { "task_id.mediahouse_id": req.user._id,
    //     paid_status:true 
    //   },
    //   },
    //   {
    //     $addFields: {
    //       total_amount_paid: "$task_id.amount_paid",

    //     },
    //   },
    //   {
    //     $sort: sort1,
    //   },
    // ]);

    const contentsourcedfromtask = await Uploadcontent.aggregate([
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
          let: { hopper_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_id",
              },
            },

            { $unwind: "$category_id" },

            // {
            //   $addFields:{
            //     console:"$$task_id"
            //   }
            // }
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          "task_id.mediahouse_id": req.user._id,
          paid_status: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "purchased_publication_details",
        },
      },
      { $unwind: "$purchased_publication_details" },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
              $unwind: "$avatar_details",
            },
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      // {
      //   $match: conditionforsort,
      // },
      {
        $sort: sort1,
      },
      // {
      //   $lookup:{
      //     from:"tasks",
      //     let :{
      //       _id: "$task_id",
      //     },
      //     pipeline:[
      //       {
      //         $match: { $expr: [{
      //           $and: [{
      //             $eq:["_id" , "$$_id"],
      //         }]
      //         }] },
      //       },
      //       {
      //         $lookup:{
      //           from:"Category",
      //           localField:"category_id",
      //           foreignField:"_id",
      //           as:"category_ids"
      //         }
      //       }
      //     ],
      //     as:"category"
      //   }
      // }
    ]);
    const contentsourcedfromtaskprevweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },
      { $unwind: "$task_id" },
      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: prev_weekStart } },
            { updatedAt: { $lt: prev_weekEnd } },
          ],
        },
      },
      {
        $sort: sort1,
      },
    ]);

    const contentsourcedfromtaskthisweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },
      { $unwind: "$task_id" },
      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: weekStart } },
            { updatedAt: { $lt: weekEnd } },
          ],
        },
      },
      {
        $sort: sort1,
      },
    ]);

    let percentage6, type6;
    if (
      contentsourcedfromtaskthisweekend.length >
      contentsourcedfromtaskprevweekend.length
    ) {
      (percentage6 =
        contentsourcedfromtaskprevweekend / contentsourcedfromtaskthisweekend),
        (type6 = "increase");
    } else {
      (percentage6 =
        contentsourcedfromtaskthisweekend / contentsourcedfromtaskprevweekend),
        (type6 = "decrease");
    }

    const totalfunfinvestedforSourcedcontent = await Uploadcontent.aggregate([
      {
        $match: {
          purchased_publication: mongoose.Types.ObjectId(req.user._id),
          // type: "task_content",
        },
      },
      {
        $group: {
          _id: "$purchased_publication",
          data: { $push: "$$ROOT" },
          totalamountpaid: { $sum: { $toDouble: "$amount_paid" } }
        },
      },

      // {
      //   $match: {
      //     _id: req.user._id,
      //   },
      // },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
        },
      },
      {
        $sort: sort1,
      },
    ]);

    const totalfunfinvestedforSourcedcontentValue = await HopperPayment.aggregate([
      {
        $match: {
          media_house_id: req.user._id,
          type: "task_content",
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          // data: { $push: "$$ROOT" },
        },
      },
      {
        $project: {

          amount_paid: 1,
          totalamountpaid: 1,
          vat: 1,
        },
      },
    ]);
    const currentmonth = new Date(moment().utc().startOf("month").format());

    const currentMonthEnd = new Date(moment().utc().endOf("month").format());
    const totalfunfinvestedforSourcedcontentthisMonth =
      await Uploadcontent.aggregate([
        {
          $group: {
            _id: "$purchased_publication",
            totalamountpaid: { $sum: "$amount_paid" },
          },
        },

        {
          $match: {
            $and: [
              { _id: req.user._id },
              { updatedAt: { $gte: currentmonth } },
              { updatedAt: { $lt: currentMonthEnd } },
            ],
          },
        },
      ]);

    const previousmonth = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );

    const previousMonthEnd = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );
    const totalfunfinvestedforSourcedcontentLastMonth =
      await Uploadcontent.aggregate([
        {
          $group: {
            _id: "$purchased_publication",
            totalamountpaid: { $sum: "$amount_paid" },
          },
        },

        {
          $match: {
            $and: [
              { _id: req.user._id },
              { updatedAt: { $gte: previousmonth } },
              { updatedAt: { $lt: previousMonthEnd } },
            ],
          },
        },
      ]);
    let percentage7, type7;
    if (
      totalfunfinvestedforSourcedcontentthisMonth.length >
      totalfunfinvestedforSourcedcontentLastMonth.length
    ) {
      (percentage7 =
        totalfunfinvestedforSourcedcontentLastMonth /
        totalfunfinvestedforSourcedcontentthisMonth),
        (type7 = "increase");
    } else {
      (percentage7 =
        totalfunfinvestedforSourcedcontentthisMonth /
        totalfunfinvestedforSourcedcontentLastMonth),
        (type7 = "decrease");
    }



    const exclusiveContent = await Chat.find({
      paid_status: false,
      message_type: "accept_mediaHouse_offer",
      sender_id: mongoose.Types.ObjectId(req.user._id), // receiver_id
    });
    const list = exclusiveContent.map((x) => x.image_id);

    const listofcontent = await Contents.find({ _id: { $in: list }, is_deleted: false }).populate({
      path: "hopper_id",
      populate: {
        path: "avatar_id",
      },
    }).sort({ createdAt: -1 });

    const paymentmade = listofcontent.map((x) => x.ask_price).reduce((a, b) => a + b, 0);
    res.json({
      code: 200,
      content_online: {
        task: getcontentonline,
        count: getcontentonlineCount,
        type: await calculatePercentage(content_counts, prev_total_content).type,
        percent: await calculatePercentage(content_counts, prev_total_content).percentage,
        // type: type1,
        // percent: percent1,
        // data1: content,
        // data2: prevcontent,
      },

      sourced_content_from_tasks: {
        task: contentsourcedfromtask,
        count: contentsourcedfromtask.length,
        type: await calculatePercentage(contentsourcedfromtaskthisweekend.length, contentsourcedfromtaskprevweekend.length).type,
        percentage: await calculatePercentage(contentsourcedfromtaskthisweekend.length, contentsourcedfromtaskprevweekend.length).percentage,
        // type: type6,
        // percentage: percentage6 || 0,
      },
      total_fund_invested: {
        task: total[0],
        count: total.length > 0
          ? total[0].totalamountpaid
          : 0,
        type: await calculatePercentage(content_counts, prev_total_content).type,
        percentage: await calculatePercentage(content_counts, prev_total_content).percentage,
        // type: type5,
        // percent: percent5 || 0,
      },
      total_fund_invested_source_content: {
        task: totalfunfinvestedforSourcedcontent[0],
        count: totalfunfinvestedforSourcedcontentValue.length > 0
          ? totalfunfinvestedforSourcedcontentValue[0].totalamountpaid
          : 0,
        console: totalfunfinvestedforSourcedcontentthisMonth.length > 0 ? totalfunfinvestedforSourcedcontentthisMonth[0].totalamountpaid : 0,
        console2: totalfunfinvestedforSourcedcontentLastMonth.length > 0 ? totalfunfinvestedforSourcedcontentLastMonth[0].totalamountpaid : 0,
        // count: totalfunfinvestedforSourcedcontent.length,
        type: await calculatePercentage(totalfunfinvestedforSourcedcontentthisMonth.length > 0 ? totalfunfinvestedforSourcedcontentthisMonth[0].totalamountpaid : 0, totalfunfinvestedforSourcedcontentLastMonth.length > 0 ? totalfunfinvestedforSourcedcontentLastMonth[0].totalamountpaid : 0).type,
        percent: await calculatePercentage(totalfunfinvestedforSourcedcontentthisMonth.length > 0 ? totalfunfinvestedforSourcedcontentthisMonth[0].totalamountpaid : 0, totalfunfinvestedforSourcedcontentLastMonth.length > 0 ? totalfunfinvestedforSourcedcontentLastMonth[0].totalamountpaid : 0).percentage,
        // type: type7,
        // percent: percentage7 || 0,
      },
      pending_payment: paymentmade,
      chatdata: exclusiveContent
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.reportTaskCount = async (req, res) => {
  try {
    // ------------------------------------today fund invested -----------------------------------
    const newtoday = new Date(moment().utc().startOf("day").format());
    const newtodayend = new Date(moment().utc().endOf("day").format());
    const today = new Date(
      moment().utc().subtract(1, "day").startOf("day").format()
    );
    const todayend = new Date(
      moment().utc().subtract(1, "day").endOf("day").format()
    );
    let plive = {
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      createdAt: { $gte: newtoday, $lte: newtodayend },
      // deadline_date: { $gte: newtoday, $lte: newtodayend },
    };
    const weeks = new Date(moment().utc().startOf("week").format());
    const weeke = new Date(moment().utc().endOf("week").format());
    const prevw = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const prevwe = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );
    const month = new Date(moment().utc().startOf("month").format());
    const monthe = new Date(moment().utc().endOf("month").format());
    const prevm = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );
    const prevme = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );
    const plive_task = await db.getItems(BroadCastTask, plive);
    const BroadCastedTasks = await db.getItemswithsortOnlyCount(
      BroadCastTask,
      plive,
      { createdAt: -1 }
    )
    const livetask = await BroadCastTask.aggregate([
      {
        $match: plive
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      },
      {
        $unwind: { path: "$category_id", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: "uploadcontents",
          let: { taskId: "$_id", deadline: "$deadline_date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$task_id", "$$taskId"] },
                    { $eq: ["$paid_status", true] },
                    // { $lte: ["$createdAt", "$$deadline"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "hopper_id",
                foreignField: "_id",
                as: "hopper_id",
                pipeline: [
                  {
                    $lookup: {
                      from: "avatars",
                      localField: "avatar_id",
                      foreignField: "_id",
                      as: "avatar_id"
                    }
                  },
                  {
                    $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                  },
                ]
              }
            },
            // {
            //   $lookup: {
            //     from: "avatars",
            //     localField: "hopper_id.avatar_id",
            //     foreignField: "_id",
            //     as: "avatar_id"
            //   }
            // },
            {
              $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
            },
            {
              $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
            },
          ],
          as: "content_details",
        },
      },
      // {
      //   $addFields: {
      //     received_amount: {
      //       $cond: { 
      //         if: { $ne: [{ $size: "$content_details" }, 0] }, 
      //         then:{$sum:{ $toInt:{ "$content_details.amount_paid"}}}, 
      //         else: 0 
      //       }
      //     }
      //   }
      // },
      {
        $addFields: {
          received_amount: {
            $cond: {
              if: { $ne: [{ $size: "$content_details" }, 0] },
              then: {
                $sum: {
                  $map: {
                    input: "$content_details",
                    in: { "$toDouble": "$$this.amount_paid" }
                  }
                }
              },
              else: 0
            }
          }
        }
      },
      // {
      //   $project:{
      //     _id:1,
      //     content_details:1,
      //     location:1,
      //     content:1,
      //     type:1,
      //     task_description:1,
      //     received_amount:1,
      //     deadline_date:1,
      //     content:1,
      //     "category_id.name": 1,
      //     createdAt:1,
      //     updatedAt:1
      //   }
      // }
      // {
      //   $addFields: {
      //     totalVat: {
      //       $sum: "$content_details.payment_detail.$.Vat",
      //     },
      //     totalAmount: {
      //       $sum: "$content_details.payment_detail.$.amount",
      //     },
      //   },
      // }
      // {
      //   $sort: {
      //     createdAt: -1,
      //   },
      // },
    ]);

    // old code
    // let pastWeekTaskConsition = {
    //   deadline_date: { $lte: prevwe, $gte: prevw },
    // };
    // let currentWeekTaskCondition = {
    //   deadline_date: { $lte: weeke, $gte: weeks },
    // };

    // new code 
    let pastWeekTaskConsition = {
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      createdAt: { $lte: todayend, $gte: today },
    };
    let currentWeekTaskCondition = {
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      createdAt: { $lte: newtodayend, $gte: newtoday },
    };
    const pastWeekTask = await db.getItems(
      BroadCastTask,
      pastWeekTaskConsition
    );
    const currentWeekTask = await db.getItems(
      BroadCastTask,
      currentWeekTaskCondition
    );


    let typeLiveTask, percentageLiveTask;
    // if (pastWeekTask > currentWeekTask) {
    //   (percentageLiveTask = (currentWeekTask / pastWeekTask) * 100),
    //     (typeLiveTask = "increase");
    // } else {
    //   (percentageLiveTask = (pastWeekTask / currentWeekTask) * 100),
    //     (typeLiveTask = "decrease");
    // }
    // let condition = {
    //   deadline_date: { $lte: todayend, $gte: today },
    // };

    const deadline_met = await BroadCastTask.find({
      mediahouse_id: req.user._id,
    });
    const id = deadline_met.map((x) => x._id);

    const val = id.forEach(async (element) => {
      const find = await Uploadcontent.find({ task_id: element });
    });

    const contentsourcedfromtask = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          let: { hopper_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_id",
              },
            },

            { $unwind: "$category_id" },
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          "task_id.mediahouse_id": req.user._id,
          paid_status: true,
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "purchased_publication_details",
        },
      },
      { $unwind: "$purchased_publication_details" },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },

      // {
      //   $project:{
      //     _id:1,
      //     hopper_details:1,
      //     location:1,
      //     content:1,
      //     type:1,
      //     task_description:1,
      //     received_amount:1,
      //     deadline_date:1,
      //     content:1,
      //     "category_id.name": 1,
      //     createdAt:1,
      //     updatedAt:1
      //   }
      // }
      {
        $sort: { createdAt: -1 }
      }
    ]);
    const contentsourcedfromtaskToday = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          let: { hopper_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_id",
              },
            },

            { $unwind: "$category_id" },

            // {
            //   $addFields:{
            //     console:"$$task_id"
            //   }
            // }
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },
      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { paid_status: true },
            { createdAt: { $gte: newtoday } },
            { createdAt: { $lte: newtodayend } },
          ],
        },
      },
      // {
      //   $match: { "task_id.mediahouse_id": req.user._id ,
      //             "paid_status":true },

      // },

      {
        $lookup: {
          from: "users",
          localField: "purchased_publication",
          foreignField: "_id",
          as: "purchased_publication_details",
        },
      },
      { $unwind: "$purchased_publication_details" },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    const contentsourcedfromtaskprevweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },
      { $unwind: "$task_id" },
      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: prevw } },
            { updatedAt: { $lt: prevwe } },
          ],
        },
      },
    ]);

    const contentsourcedfromtaskthisweekend = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },
      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: weeks } },
            { updatedAt: { $lt: weeke } },
          ],
        },
      },
    ]);

    const contentsourcedfromtaskprevday = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: today } },
            { updatedAt: { $lte: todayend } },
          ],
        },
      },
    ]);

    const contentsourcedfromtaskthisday = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          $and: [
            { "task_id.mediahouse_id": req.user._id },
            { updatedAt: { $gte: newtoday } },
            { updatedAt: { $lt: newtodayend } },
          ],
        },
      },
    ]);

    let percentage7, type7;
    if (
      contentsourcedfromtaskthisday.length >
      contentsourcedfromtaskprevday.length
    ) {
      (percentage7 =
        (contentsourcedfromtaskprevday / contentsourcedfromtaskthisday) * 100),
        (type7 = "increase");
    } else {
      (percentage7 =
        (contentsourcedfromtaskthisday / contentsourcedfromtaskprevday) * 100),
        (type7 = "decrease");
    }

    let percentage6, type6;
    if (
      contentsourcedfromtaskthisweekend.length >
      contentsourcedfromtaskprevweekend.length
    ) {
      (percentage6 =
        contentsourcedfromtaskprevweekend / contentsourcedfromtaskthisweekend),
        (type6 = "increase");
    } else {
      (percentage6 =
        contentsourcedfromtaskthisweekend / contentsourcedfromtaskprevweekend),
        (type6 = "decrease");
    }
    // ==========================   today fund invested ==========================================

    // let yesterday = {
    //   paid_status: true,
    //   updatedAt: {
    //     $lte: prevwe,
    //     $gte: prevw,
    //   },
    // };
    let todays = {
      paid_status: true,
      updatedAt: {
        $lte: newtodayend,
        $gte: newtoday,
      },
    };
    const hopperUsedTasks = await db.getItems(Uploadcontent, todays);
    const hopperUsed_task_count = hopperUsedTasks.length;

    let yesterdays = {
      paid_status: true,
      updatedAt: {
        $lte: todayend,
        $gte: today,
      },
    };

    const hopperUsedTaskss = await db.getItems(Uploadcontent, yesterdays);
    const hopperUsed_task_counts = hopperUsedTaskss.length;

    const today_invested = await db.getItems(Uploadcontent, todays);
    const today_investedcount = today_invested.length;

    let percentage, type;
    if (today_investedcount > hopperUsed_task_count) {
      (percentage = hopperUsed_task_count / today_investedcount),
        (type = "increase");
    } else if (hopperUsed_task_count == today_investedcount) {
      (percentage = 0), (type = "neutral");
    } else {
      (percentage = today_investedcount / hopperUsed_task_count),
        (type = "decrease");
    }

    var arr;
    if (hopperUsedTasks.length < 1) {
      arr = 0;
    } else {
      arr = hopperUsedTasks
        .map((element) => element.amount_paid)
        .reduce((a, b) => a + b, 0);
    }

    // ============================================ total fund fund invested ==================================
    const total = await HopperPayment.aggregate([
      {
        $match: {
          media_house_id: req.user._id,
          type: "task_content",
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          data: 1,
          vat: 1,
        },
      },
    ]);
    const totalinvestedfund = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: newtoday } },
            { updatedAt: { $lte: newtodayend } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          data: 1,
          vat: 1,
        },
      },
    ]);

    const previousMonthtotalInvested = await Contents.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: today } },
            { updatedAt: { $lt: todayend } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
        },
      },
    ]);

    const totaltoda = totalinvestedfund.length;
    const prevtotalinvt = previousMonthtotalInvested.length;
    let percentage2, type2;
    if (totaltoda > prevtotalinvt) {
      (percentage2 = (prevtotalinvt / totaltoda) * 100), (type2 = "increase");
    } else {
      (percentage2 = (totaltoda / prevtotalinvt) * 100), (type2 = "decrease");
    }
    // ============================================ total fund fund invested end ==================================

    // todayfund fund invested end ===================================================================================

    const todayfund = await HopperPayment.aggregate([
      {
        $match: {
          media_house_id: req.user._id,
          type: "task_content",
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          data: 1,
          vat: 1,
        },
      },
    ]);
    const todayinvestedfund = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: newtoday } },
            { updatedAt: { $lte: todayend } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          data: 1,
          vat: 1,
        },
      },
    ]);

    const previoustodayInvested = await Contents.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: today } },
            { updatedAt: { $lt: todayend } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
        },
      },
    ]);

    const totaltoday = totalinvestedfund.length;
    const prevtoday = previousMonthtotalInvested.length;
    let percentage9, type9;
    if (totaltoda > prevtotalinvt) {
      (percentage9 = (prevtotalinvt / totaltoda) * 100), (type9 = "increase");
    } else {
      (percentage9 = (totaltoda / prevtotalinvt) * 100), (type9 = "decrease");
    }










    // end=========================================================================================================================

    //=========================================deadline_met===========================================//
    const currentWeekStart = new Date(moment().utc().startOf("week").format());
    const currentWeekEnd = new Date(moment().utc().endOf("week").format());
    const previousWeekStart = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const previousWeekEnd = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );
    const currentWeakCondition = {
      mediahouse_id: req.user._id,
      createdAt: {
        $lte: currentWeekEnd,
        $gte: currentWeekStart,
      },
    };
    const previousWeakCondition = {
      mediahouse_id: req.user._id,
      createdAt: {
        $lte: previousWeekEnd,
        $gte: previousWeekStart,
      },
    };
    const currentWeekTaskDetails = await BroadCastTask.aggregate([
      {
        $match: currentWeakCondition,
      },
      {
        $group: {
          _id: null,
          totalAcceptedCount: {
            $sum: {
              $cond: [
                { $isArray: "$accepted_by" },
                { $size: "$accepted_by" },
                0,
              ],
            },
          },
          totalCompletedCount: {
            $sum: {
              $cond: [
                { $isArray: "$completed_by" },
                { $size: "$completed_by" },
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          totalAvg: {
            $cond: {
              if: { $eq: ["$totalAcceptedCount", 0] },
              then: 0, // or any other default value you prefer
              else: {
                $multiply: [
                  { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
                  100,
                ],
              },
            },
          },
        },
      },




    ]);
    const previousWeekTaskDetails = await BroadCastTask.aggregate([
      {
        $match: previousWeakCondition,
      },
      {
        $group: {
          _id: null,
          totalAcceptedCount: {
            $sum: {
              $cond: [
                { $isArray: "$accepted_by" },
                { $size: "$accepted_by" },
                0,
              ],
            },
          },
          totalCompletedCount: {
            $sum: {
              $cond: [
                { $isArray: "$completed_by" },
                { $size: "$completed_by" },
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          totalAvg: {
            $cond: {
              if: { $eq: ["$totalAcceptedCount", 0] },
              then: 0, // or any other default value you prefer
              else: {
                $multiply: [
                  { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
                  100,
                ],
              },
            },
          },
        },
      },
      // {
      //   $addFields: {
      //     totalAvg: {
      //       $multiply: [
      //         { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
      //         100,
      //       ],
      //     },
      //   },
      // },
    ]);

    let deadlineDifference, differenceType;

    // if (currentWeekTaskDetails.length > 0 ? currentWeekTaskDetails[0].totalAvg : 0 > previousWeekTaskDetails[0].totalAvg ||
    //   0
    // ) {
    //   deadlineDifference =
    //     currentWeekTaskDetails[0].totalAvg ||
    //     0 - previousWeekTaskDetails[0].totalAvg ||
    //     0;
    //   differenceType = "increase";
    // } else {
    //   deadlineDifference =
    //     currentWeekTaskDetails.length > 0 ? currentWeekTaskDetails[0].totalAvg : 0 - previousWeekTaskDetails[0].totalAvg ||
    //       0;
    //   differenceType = "decrease";
    // }

    // const totalDeadlineDetails = await BroadCastTask.aggregate([
    //   {
    //     $match: {
    //       mediahouse_id: req.user._id,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalAcceptedCount: {
    //         $sum: {
    //           $cond: [
    //             { $isArray: "$accepted_by" },
    //             { $size: "$accepted_by" },
    //             0,
    //           ],
    //         },
    //       },
    //       totalCompletedCount: {
    //         $sum: {
    //           $cond: [
    //             { $isArray: "$completed_by" },
    //             { $size: "$completed_by" },
    //             0,
    //           ],
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       totalAvg: {
    //         $cond: {
    //           if: { $eq: ["$totalAcceptedCount", 0] },
    //           then: 0, // or any other default value you prefer
    //           else: {
    //             $multiply: [
    //               { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
    //               100,
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // {
    //   //   $addFields: {
    //   //     totalAvg: {
    //   //       $multiply: [
    //   //         { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
    //   //         100,
    //   //       ],
    //   //     },
    //   //   },
    //   // },
    // ]);

    const totalDeadlineDetails = await BroadCastTask.aggregate([
      {
        $match: {
          mediahouse_id: req.user._id,
        },
      },

      {
        $group: {
          _id: null,
          totalAcceptedCount: {
            $sum: {
              $cond: [
                { $isArray: "$accepted_by" },
                { $size: "$accepted_by" },
                { $ifNull: ["$accepted_by", 0] } // Handle null values
              ]
            }
          },
          totalCompletedCount: {
            $sum: {
              $cond: [
                { $isArray: "$completed_by" },
                { $size: "$completed_by" },
                { $ifNull: ["$completed_by", 0] } // Handle null values
              ]
            }
          }
        }
      },
      {
        $addFields: {
          totalAvg: {
            $cond: {
              if: { $eq: ["$totalAcceptedCount", 0] },
              then: 0, // or any other default value you prefer
              else: {
                $multiply: [
                  { $divide: ["$totalCompletedCount", "$totalAcceptedCount"] },
                  100,
                ],
              },
            },
          },
        },
      },
      // {
      //   $sort: sort,
      // },
    ]);


    const deadlinedetails = await BroadCastTask.aggregate([
      {
        $match: {
          mediahouse_id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "uploadcontents",
          let: { taskId: "$_id", deadline: "$deadline_date" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$task_id", "$$taskId"] },
                    { $lte: ["$createdAt", "$$deadline"] },
                  ],
                },
              },
            },
          ],
          as: "content_details",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    let maincondition = { purchased_publication: req.user._id };
    const uploaded = await Uploadcontent.find(maincondition).populate(
      "task_id hopper_id"
    ).populate({
      path: "hopper_id",
      populate: {
        path: "avatar_id",
      },
    }).populate({
      path: "hopper_id",
      populate: {
        path: "avatar_id",
      },
    });
    //=========================================deadline_met===========================================//

    res.json({
      code: 200,
      task_broadcasted_today: {
        task: BroadCastedTasks,
        livetask: livetask,
        count: plive_task.length,
        type: await calculatePercentage(currentWeekTask.length, pastWeekTask.length).type,
        percent: await calculatePercentage(currentWeekTask.length, pastWeekTask.length).percentage,
        // type: typeLiveTask,
        // percent: percentageLiveTask || 0,
      },
      total_content_sourced_from_task: {
        task: contentsourcedfromtask,
        count: contentsourcedfromtask.length,
        type: await calculatePercentage(contentsourcedfromtaskthisweekend.length, contentsourcedfromtaskprevweekend.length).type,
        percent: await calculatePercentage(contentsourcedfromtaskthisweekend.length, contentsourcedfromtaskprevweekend.length).percentage,
        // type: type6,
        // percent: percentage6 || 0,
      },
      today_content_sourced_from_task: {
        task: contentsourcedfromtaskToday,
        count: contentsourcedfromtaskToday.length,
        type: await calculatePercentage(contentsourcedfromtaskthisday.length, contentsourcedfromtaskprevday.length).type,
        percent: await calculatePercentage(contentsourcedfromtaskthisday.length, contentsourcedfromtaskprevday.length).percentage,
        // type: type7,
        // percent: percentage7 || 0,
      },
      today_fund_invested: {
        task:
          totalinvestedfund.length > 0
            ? totalinvestedfund[0].totalamountpaid
            : 0,
        count: totalinvestedfund.length > 0
          ? totalinvestedfund[0].totalamountpaid
          : 0, //arr,
        // type: type2,
        // percentage: percentage2 || 0,
        type: await calculatePercentage(totaltoda, prevtotalinvt).type,
        percentage: await calculatePercentage(totaltoda, prevtotalinvt).percentage,
      },
      total_fund_invested: {
        task: total[0],
        count: total.length > 0
          ? total[0].totalamountpaid
          : 0,
        //total.length || 0,
        type: await calculatePercentage(totaltoda, prevtotalinvt).type,
        percentage: await calculatePercentage(totaltoda, prevtotalinvt).percentage,
        // type: type2,
        // percentage: percentage2 || 0,
      },
      deadline_met: {
        task: totalDeadlineDetails.length > 0 ? totalDeadlineDetails[0].totalAvg : 0,
        type: differenceType,
        percentage: deadlineDifference,
        type: await calculatePercentage(currentWeekTaskDetails.length, previousWeekTaskDetails.length).type,
        percentage: await calculatePercentage(currentWeekTaskDetails.length, previousWeekTaskDetails.length).percentage,
        data: deadlinedetails,
        // findhopperdedline: deadlineDifference,
        // totalDeadlineDetails: totalDeadlineDetails[0].totalAvg
      },
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

async function sendnoti(id, mid) {
  const notiObj = {
    sender_id: mid,
    receiver_id: id,
    title: " complete your task ",
    body: ` complete your task `,
  };

  const resp = await _sendPushNotification(notiObj);
}

exports.listoftask = async (req, res) => {
  try {
    const data = req.query;
    let condition = {};
    let count, tasks;
    const currentDateTime = new Date();
    const deadlineDateTime = new Date(currentDateTime.getTime() + 15 * 60000);
    condition.deadline_date = { $lt: deadlineDateTime };
    tasks = await db.getItems(BroadCastTask, condition);
    count = tasks.length;

    const datas = tasks.map((c) => c.accepted_by);
    const mediahoise_id = tasks.map((a) => a.mediahouse_id);

    for (let i = 0; i < datas.length; i++) {
      sendnoti(datas[i], mediahoise_id[i]);
    }

    res.json({
      code: 200,
      tasks,
      count,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.recentactivity = async (req, res) => {
  try {
    let data = req.query;
    let condition = {
      media_house_id: req.user._id,
    };

    // let val = "year";

    // if (data.hasOwnProperty("weekly")) {
    //   val = "week";
    // }

    // if (data.hasOwnProperty("monthly")) {
    //   val = "month";
    // }

    // if (data.hasOwnProperty("daily")) {
    //   val = "day";
    // }

    // if (data.hasOwnProperty("yearly")) {
    //   val = "year"
    // }
    // let filters = { user_id: mongoose.Types.ObjectId(req.user._id), is_deleted: false, paid_status:false }

    // const yesterdayStart = new Date(moment().utc().startOf(val).format());
    // const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    // if (data.startDate && data.endDate) {
    //   filters = {
    //     createdAt: {
    //       $gte: new Date(data.startDate),
    //       $lte: new Date(data.endDate),
    //     },
    //   };
    // }
    // else if(data.contentType == "shared"){
    //   filters.type == "shared"
    //  }else if (data.contentType == "exclusive") {
    //   filters.type == "exclusive"
    //  }
    // else {
    //   filters.createdAt = {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart,

    //   };
    // }

    // let contentType = {};
    // if (data.contentType == "shared") {
    //   filters.type == "shared"
    // } else if (data.contentType == "exclusive") {
    //   filters.type == "exclusive"
    // }

    // if (data.contentType) {
    //   contentType.content_type = data.contentType;
    // }
    let sortBy = { createdAt: -1 };
    if (data.activity == "old") {
      sortBy = { createdAt: 1 };
    }
    if (data.activity == "new") {
      sortBy = { createdAt: -1 };
    }


    const val = data.hasOwnProperty("daily") ? "day"
      : data.hasOwnProperty("weekly") ? "week"
        : data.hasOwnProperty("monthly") ? "month"
          : "year";

    // Create the initial filters object
    let filters = { user_id: mongoose.Types.ObjectId(req.user._id), is_deleted: false, paid_status: false };

    // Get start and end dates for the current period
    const periodStart = new Date(moment().utc().startOf(val).format());
    const periodEnd = new Date(moment().utc().endOf(val).format());

    // Update filters based on provided data
    if (data.startDate && data.endDate) {
      filters.createdAt = {
        $gte: new Date(data.startDate),
        $lte: new Date(data.endDate),
      };
    } else {
      if (data.contentType === "shared") {
        filters.type = "shared";
      } else if (data.contentType === "exclusive") {
        filters.type = "exclusive";
      } else if (data.daily || data.yearly || data.monthly || data.weekly) {
        filters.createdAt = {
          $lte: periodEnd,
          $gte: periodStart,
        }
      }
    }


    const findCount = await recentactivity.find(filters).populate("task_id uploaded_content_id").populate({
      path: 'content_id',
      // match: contentType//contentType},
    }).limit(req.query.limit ? parseInt(req.query.limit) : 20).skip(req.query.offset ? parseInt(req.query.offset) : 0)
      .sort(sortBy);
    //     const pipeline = [];

    // const matchStage = {
    //   $match: {
    //     media_house_id: mongoose.Types.ObjectId(req.user._id),
    //   },
    // };
    // pipeline.push(matchStage);

    // let val = "year";

    // if (data.hasOwnProperty("weekly")) {
    //   val = "week";
    // } else if (data.hasOwnProperty("monthly")) {
    //   val = "month";
    // } else if (data.hasOwnProperty("daily")) {
    //   val = "day";
    // } else if (data.hasOwnProperty("yearly")) {
    //   val = "year";
    // }

    // const currentDate = new Date();
    // const startOfVal = moment(currentDate).utc().startOf(val).toDate();
    // const endOfVal = moment(currentDate).utc().endOf(val).toDate();

    // const dateRange = {
    //   $match: {
    //     createdAt: {
    //       $gte: startOfVal,
    //       $lte: endOfVal,
    //     },
    //   },
    // };
    // pipeline.push(dateRange);

    // if (data.startDate && data.endDate) {
    //   const customDateRange = {
    //     $match: {
    //       createdAt: {
    //         $gte: new Date(data.startDate),
    //         $lte: new Date(data.endDate),
    //       },
    //     },
    //   };
    //   pipeline.push(customDateRange);
    // }

    // if (data.contentType) {
    //   const contentTypeMatch = {
    //     $match: {
    //       type: data.contentType,
    //     },
    //   };
    //   pipeline.push(contentTypeMatch);
    // }

    // let sortDirection = -1;
    // if (data.activity === "old") {
    //   sortDirection = 1;
    // }

    // const sortBy = {
    //   $sort: {
    //     createdAt: sortDirection,
    //   },
    // };
    // pipeline.push(sortBy);


    // const populateStage = {
    //   $lookup: {
    //     from: "contents", // Replace with the name of the collection to populate from
    //     localField: "content_id",
    //     foreignField: "_id",
    //     as: "content_id",
    //   },

    //   $lookup: {
    //     from: "tasks", // Replace with the name of the collection to populate from
    //     localField: "task_id",
    //     foreignField: "_id",
    //     as: "task_id",
    //   },

    //   $lookup: {
    //     from: "uploadcontents", // Replace with the name of the collection to populate from
    //     localField: "uploaded_content_id",
    //     foreignField: "_id",
    //     as: "uploaded_content_id",
    //   },
    // };
    // pipeline.push(populateStage);


    //   if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
    //     populateStage.push(
    //             {
    //               $skip: Number(data.offset),
    //             },
    //             {
    //               $limit: Number(data.limit),
    //             }
    //           );
    //         }
    // const findCount = await recentactivity.aggregate(pipeline)

    res.status(200).json({
      code: 200,
      data: findCount,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.notificationlisting = async (req, res) => {
  try {
    // const listing = await notification
    //   .find({ receiver_id: req.user._id })
    // .populate("receiver_id")
    // .populate({
    //   path: "receiver_id",
    //   select:"user_name profile_image",
    //   populate: {
    //     path: "avatar_id",
    //     select:"avatar"
    //   },
    // })
    // .populate({
    //   path: "sender_id",
    //   select: "user_name profile_image avatar_id",
    //   populate: {
    //     path: "avatar_id",
    //     select: "avatar"
    //   },
    // }).sort({ createdAt: -1 });

    const pipeline = [
      {
        $match: {
          receiver_id: { $in: [mongoose.Types.ObjectId(req.user._id)] },
          is_deleted_for_mediahoue: false
        }
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     foreignField: "_id",
      //     localField: "sender_id",
      //     as: "receiverDetails",
      //     pipeline: [
      //      {
      //       $lookup:{
      //         from:"avatars",


      //       }
      //      }
      //     ]
      //   },
      // },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "sender_id",
          as: "receiverDetails",
          pipeline: [

            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_ids"
              }
            },
            // {
            //   $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
            // },

            // {
            //   $project: {
            //     _id: 1,
            //     user_name: 1,
            //     first_name: 1,
            //     last_name: 1,
            //     avatar_id: 1,
            //     email: 1,
            //   }
            // }
          ]
        }
      },
      // {
      //   $unwind: { path: "$receiverDetails", preserveNullAndEmptyArrays: true }
      // },
      // {
      //   $unwind: { path: "$receiverDetails.avatar_id", preserveNullAndEmptyArrays: true }
      // },
      {
        $lookup: {
          from: "admins",
          foreignField: "_id",
          localField: "sender_id",
          as: "receiverDetailsadmin",
          // pipeline: [
          //   {
          //     $match: {send_by_admin:true}
          //   }
          // ]
        },
      },
      // {
      //   $addFields: {
      //     sender_ids: {
      //       $cond: {
      //         if: { $eq: [{ $size: "$receiverDetails" }, 1] },
      //         then: "$receiverDetails",
      //         else: "$receiverDetailsadmin"
      //       }
      //     }
      //   },
      // },
      {
        $addFields: {
          sender_id: {
            $arrayElemAt: [
              {
                $cond: {
                  if: { $eq: [{ $size: "$receiverDetails" }, 1] },
                  then: "$receiverDetails",
                  else: "$receiverDetailsadmin"
                }
              },
              0
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]

    const listing = await notification.aggregate(pipeline)

    const count = await notification.countDocuments({
      receiver_id: req.user._id,
      is_read: false,
      is_deleted_for_mediahoue: false
    }).count();
    return res.status(200).json({
      code: 200,
      data: listing,
      count: count,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updatenotification = async (req, res) => {
  try {
    const data = req.body;

    await db.updateItem(data.notification_id, notification, {
      is_read: "true",
    });

    res.json({
      code: 200,
      msg: "updated",
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportTaskcategory = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;

    let val = "year";

    if (data.hasOwnProperty("Weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("Monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }
    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    let condition = {
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      createdAt: {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      },
    };
    if (data.startDate && data.endDate) {
      condition = {
        mediahouse_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      condition = {
        mediahouse_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    }
    //  const listofcategory =  await Category.find({type:"content"})
    // const map = listofcategory.map()
    task = await BroadCastTask.find(condition)
      .select({ _id: 1, category_id: 1 })
      .populate({ path: "category_id" });

    let buisnesscount = 0,
      crimecount = 0,
      fashoncount = 0,
      politics = 0,
      others = 0;
    for (let i = 0; i < task.length; i++) {
      // const element = array[i];

      if (task[i].category_id.name == "Business") {
        buisnesscount++;
      } else if (task[i].category_id.name == "Crime") {
        crimecount++;
      } else if (task[i].category_id.name == "Fashion") {
        fashoncount++;
      } else if (task[i].category_id.name == "Political") {
        politics++;
      } else {
        others++;
      }
    }

    res.json({
      code: 200,
      data: {
        buisnesscount: buisnesscount,
        crimecount: crimecount,
        fashoncount: fashoncount,
        politics: politics,
        others: others,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportcontentType = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;

    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    let filters = {
      $expr: {
        $and: [
          {
            $eq: [
              "$task_id.mediahouse_id",
              mongoose.Types.ObjectId(req.user._id),
            ],
          },
          {
            $eq: [
              "$paid_status",
              true
            ],
          },
        ],
      },
    };

    if (data.startDate && data.endDate) {
      filters.createdAt = {
        $gte: new Date(data.startDate),
        $lte: new Date(data.endDate),
      };
    } else {
      filters.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      };
    }

    //  const listofcategory =  await Category.find({type:"content"})
    // const map = listofcategory.map()
    const uses = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },
      { $unwind: "$task_id" },
      {
        $match: filters,
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    // const uses = await Contents.aggregate([
    //   {
    //     $match: filters,
    //   },
    // ]);

    let buisnesscount = 0,
      crimecount = 0,
      fashoncount = 0,
      politics = 0;

    // for (let i = 0; i < uses.length; i++) {
    //   for (let j = 0; j < uses[i].content.length; j++) {
    //     if (uses[i].content[j].media_type == "image") {
    //       buisnesscount++;
    //     }else if (uses[i].content[j].media_type == "video") {
    //       crimecount++;
    //     }else if (uses[i].content[j].media_type == "interview") {
    //       fashoncount++;
    //     }else {
    //       politics++
    //     }
    //   }
    // }

    for (let i = 0; i < uses.length; i++) {
      // const element = array[i];

      if (uses[i].type == "image") {
        buisnesscount++;
      }

      if (uses[i].type == "video") {
        crimecount++;
      }

      if (uses[i].type == "interview") {
        fashoncount++;
      }
    }

    res.json({
      code: 200,
      data: {
        image: buisnesscount,
        video: crimecount,
        interview: fashoncount,
        others: politics
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportlocation = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;

    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    let filters = {
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
    };

    if (data.startDate && data.endDate) {
      filters.createdAt = {
        $gte: new Date(data.startDate),
        $lte: new Date(data.endDate),
      };
    } else {
      filters.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      };
    }

    const listofcategory = await BroadCastTask.find(filters).sort({
      createdAt: -1,
    });

    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: yesterdayStart } },
            { updatedAt: { $lte: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          // console: "$amount_paid",
          // ref:"$data.content",
          volume: { $size: "$data" },
        },
      },

      {
        $lookup: {
          from: "uploadcontents",
          localField: "data.task_content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },

      {
        $lookup: {
          from: "tasks",
          let: {
            hopper_id: "$content_id.task_id",
            // new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$_id", "$$hopper_id"] }],
                },
              },
            },


            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_details",
              },
            },
          ],
          as: "task_details",
        },
      },
      {
        $addFields: {
          north: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$latitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },

          south: {
            $cond: {
              if: {
                $and: [
                  { $lt: ["$latitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },
          east: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$longitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },

          west: {
            $cond: {
              if: {
                $and: [
                  { $lt: ["$longitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },

          // totalDislikes: { $sum: "$dislikes" }
        },
      },
      {
        $lookup: {
          from: "uploadcontents",
          localField: "data.task_content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $sort: { updatedAt: -1 } // Sort by month in ascending order (optional)
      },
    ]);
    let buisnesscount = 0,
      crimecount = 0,
      fashoncount = 0,
      politics = 0;
    for (let i = 0; i < listofcategory.length; i++) {
      // const element = array[i];

      if (listofcategory[i].address_location.coordinates[0] < 0) {
        buisnesscount++;
      }

      if (listofcategory[i].address_location.coordinates[0] > 0) {
        crimecount++;
      }

      if (listofcategory[i].address_location.coordinates[1] > 0) {
        fashoncount++;
      }

      if (listofcategory[i].address_location.coordinates[1] < 0) {
        politics++;
      }
    }

    res.json({
      code: 200,
      data: {
        data: getcontentonline1,
        north: buisnesscount,
        south: crimecount,
        west: fashoncount,
        east: politics,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportgraphoftask = async (req, res) => {
  try {
    const data = req.query;
    let task;

    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    let filters = {
      // paid_status: "un_paid",
      mediahouse_id: mongoose.Types.ObjectId(req.user._id),
      status: "published",
      createdAt: {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      },
    };

    if (data.startDate && data.endDate) {
      filters = {
        status: "published",
        mediahouse_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    }

    const hopperUsedTaskss = await BroadCastTask.find(filters).sort({
      createdAt: -1,
    });

    const map = hopperUsedTaskss.map((x) => x.createdAt);

    const arr = [];
    map.forEach((element) => {
      arr.push(element.getMonth());
    });

    let jan = 0,
      feb = 0,
      mar = 0,
      apr = 0,
      may = 0,
      june = 0,
      july = 0,
      aug = 0,
      sept = 0,
      oct = 0,
      nov = 0,
      dec = 0;

    for (let i = 0; i < arr.length; i++) {
      // const element = array[i];

      if (arr[i] == 0) {
        jan++;
      }

      if (arr[i] == 1) {
        feb++;
      }

      if (arr[i] == 2) {
        mar++;
      }

      if (arr[i] == 3) {
        apr++;
      }

      if (arr[i] == 4) {
        may++;
      }

      if (arr[i] == 5) {
        june++;
      }

      if (arr[i] == 6) {
        july++;
      }
      if (arr[i] == 7) {
        aug++;
      }
      if (arr[i] == 8) {
        sept++;
      }

      if (arr[i] == 9) {
        oct++;
      }
      if (arr[i] == 10) {
        nov++;
      }

      if (arr[i] == 11) {
        dec++;
      }
    }
    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportcontentsourced = async (req, res) => {
  try {
    const data = req.query;
    let task, yesterdays;

    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }



    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    // let yesterdays = {
    //   // paid_status: "un_paid",
    //   purchased_publication: mongoose.Types.ObjectId(req.user._id),
    //   updatedAt: {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart,
    //   },
    // };




    if (data.startDate && data.endDate) {
      yesterdays = {

        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {

        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {

      };
    }
    // const hopperUsedTaskss = await db.getItems(Uploadcontent, yesterdays);
    const contentsourcedfromtask = await Uploadcontent.aggregate([
      {
        $lookup: {
          from: "tasks",
          let: { hopper_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            // {
            //   $lookup: {
            //     from: "categories",
            //     localField: "category_id",
            //     foreignField: "_id",
            //     as: "category_id",
            //   },
            // },

            // { $unwind: "$category_id" },
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          "task_id.mediahouse_id": mongoose.Types.ObjectId(req.user._id),
          paid_status: true,
        },
      },

      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "purchased_publication",
      //     foreignField: "_id",
      //     as: "purchased_publication_details",
      //   },
      // },
      // { $unwind: "$purchased_publication_details" },
      // {
      //   $lookup: {
      //     from: "users",
      //     let: { hopper_id: "$hopper_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$_id", "$$hopper_id"] }],
      //           },
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "avatars",
      //           localField: "avatar_id",
      //           foreignField: "_id",
      //           as: "avatar_details",
      //         },
      //       },
      //     ],
      //     as: "hopper_details",
      //   },
      // },
      // { $unwind: "$hopper_details" },

      // {
      //   $project:{
      //     _id:1,
      //     hopper_details:1,
      //     location:1,
      //     content:1,
      //     type:1,
      //     task_description:1,
      //     received_amount:1,
      //     deadline_date:1,
      //     content:1,
      //     "category_id.name": 1,
      //     createdAt:1,
      //     updatedAt:1
      //   }
      // }
      // {
      //   $sort: { createdAt: -1 }
      // }
      {
        $match: yesterdays,
      },
      {
        $project: {
          createdAt: 1
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);


    const monthlyCounts = {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    };


    contentsourcedfromtask.forEach((item) => {
      switch (item._id) {
        case 1:
          monthlyCounts.jan = item.count;
          break;
        case 2:
          monthlyCounts.feb = item.count;
          break;
        case 3:
          monthlyCounts.mar = item.count;
          break;
        case 4:
          monthlyCounts.apr = item.count;
          break;
        case 5:
          monthlyCounts.may = item.count;
          break;
        case 6:
          monthlyCounts.june = item.count;
          break;
        case 7:
          monthlyCounts.july = item.count;
          break;
        case 8:
          monthlyCounts.aug = item.count;
          break;
        case 9:
          monthlyCounts.sept = item.count;
          break;
        case 10:
          monthlyCounts.oct = item.count;
          break;
        case 11:
          monthlyCounts.nov = item.count;
          break;
        case 12:
          monthlyCounts.dec = item.count;
          break;
      }
    });


    // const map = contentsourcedfromtask.map((x) => x.createdAt);

    // const arr = [];
    // map.forEach((element) => {
    //   arr.push(element.getMonth());
    // });

    // 

    // let jan = 0,
    //   feb = 0,
    //   mar = 0,
    //   apr = 0,
    //   may = 0,
    //   june = 0,
    //   july = 0,
    //   aug = 0,
    //   sept = 0,
    //   oct = 0,
    //   nov = 0,
    //   dec = 0;

    // for (let i = 0; i < arr.length; i++) {
    //   // const element = array[i];

    //   if (arr[i] == 0) {
    //     jan++;
    //   }

    //   if (arr[i] == 1) {
    //     feb++;
    //   }

    //   if (arr[i] == 2) {
    //     mar++;
    //   }

    //   if (arr[i] == 3) {
    //     apr++;
    //   }

    //   if (arr[i] == 4) {
    //     may++;
    //   }

    //   if (arr[i] == 5) {
    //     june++;
    //   }

    //   if (arr[i] == 6) {
    //     july++;
    //   }
    //   if (arr[i] == 7) {
    //     aug++;
    //   }
    //   if (arr[i] == 8) {
    //     sept++;
    //   }

    //   if (arr[i] == 9) {
    //     oct++;
    //   }
    //   if (arr[i] == 10) {
    //     nov++;
    //   }

    //   if (arr[i] == 11) {
    //     dec++;
    //   }
    // }
    res.json({
      code: 200,
      data: monthlyCounts
      // data: {
      //   jan,
      //   feb,
      //   mar,
      //   apr,
      //   may,
      //   june,
      //   july,
      //   aug,
      //   sept,
      //   oct,
      //   nov,
      //   dec,
      // },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportfundInvested = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;

    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }



    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    let yesterdays;

    //  = {
    //   // paid_status: "un_paid",
    //   media_house_id: mongoose.Types.ObjectId(req.user._id),
    //   type: "task_content",
    //   createdAt: {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart,
    //   },
    // };



    if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "task_content",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "task_content",
      };
    }
    const hopperUsedTaskss = await db.getItems(HopperPayment, yesterdays);

    let sumByMonth = {
      0: 0, // January
      1: 0, // February
      2: 0, // March
      3: 0, // April
      4: 0, // May
      5: 0, // June
      6: 0, // July
      7: 0, // August
      8: 0, // September
      9: 0, // October
      10: 0, // November
      11: 0, // December
    };
    for (let i = 0; i < hopperUsedTaskss.length; i++) {
      const item = hopperUsedTaskss[i];
      const month = item.createdAt.getMonth();
      sumByMonth[month] += item.amount;
    }

    const {
      0: jan,
      1: feb,
      2: mar,
      3: apr,
      4: may,
      5: june,
      6: july,
      7: aug,
      8: sept,
      9: oct,
      10: nov,
      11: dec,
    } = sumByMonth;

    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.AccountfundInvested = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;

    const yesterdayStart = new Date(moment().utc().startOf("year").format());
    const yesterdayEnd = new Date(moment().utc().endOf("year").format());

    let yesterdays = {
      // paid_status: "un_paid",
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      // type:"task_content",
      createdAt: {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      },
    };
    const hopperUsedTaskss = await db.getItems(HopperPayment, yesterdays);

    let sumByMonth = {
      0: 0, // January
      1: 0, // February
      2: 0, // March
      3: 0, // April
      4: 0, // May
      5: 0, // June
      6: 0, // July
      7: 0, // August
      8: 0, // September
      9: 0, // October
      10: 0, // November
      11: 0, // December
    };
    for (let i = 0; i < hopperUsedTaskss.length; i++) {
      const item = hopperUsedTaskss[i];
      const month = item.createdAt.getMonth();
      sumByMonth[month] += item.amount;
    }

    const {
      0: jan,
      1: feb,
      2: mar,
      3: apr,
      4: may,
      5: june,
      6: july,
      7: aug,
      8: sept,
      9: oct,
      10: nov,
      11: dec,
    } = sumByMonth;

    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.AccountforVat = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;

    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }



    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());


    // const yesterdayStart = new Date(moment().utc().startOf("year").format());
    // const yesterdayEnd = new Date(moment().utc().endOf("year").format());

    // let yesterdays = {
    //   // paid_status: "un_paid",
    //   media_house_id: mongoose.Types.ObjectId(req.user._id),
    //   // type:"task_content",
    //   createdAt: {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart,
    //   },
    // };



    if (data.startDate && data.endDate) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
      };
    }
    const hopperUsedTaskss = await db.getItems(HopperPayment, yesterdays);

    let sumByMonth = {
      0: 0, // January
      1: 0, // February
      2: 0, // March
      3: 0, // April
      4: 0, // May
      5: 0, // June
      6: 0, // July
      7: 0, // August
      8: 0, // September
      9: 0, // October
      10: 0, // November
      11: 0, // December
    };
    for (let i = 0; i < hopperUsedTaskss.length; i++) {
      const item = hopperUsedTaskss[i];
      const month = item.createdAt.getMonth();
      sumByMonth[month] += item.Vat;
    }

    const {
      0: jan,
      1: feb,
      2: mar,
      3: apr,
      4: may,
      5: june,
      6: july,
      7: aug,
      8: sept,
      9: oct,
      10: nov,
      11: dec,
    } = sumByMonth;

    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.AccountcontentPurchasedOnline = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;

    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }



    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    // let yesterdays = {
    //   // paid_status: "un_paid",
    //   media_house_id: mongoose.Types.ObjectId(req.user._id),
    //   createdAt: {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart,
    //   },
    // };


    if (data.startDate && data.endDate) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
      };
    }


    const hopperUsedTaskss = await db.getItems(HopperPayment, yesterdays);

    const map = hopperUsedTaskss.map((x) => x.createdAt);

    // const arr = [];
    // map.forEach((element) => {
    //   arr.push(element.getMonth());
    // });

    // // 

    // let jan = 0,
    //   feb = 0,
    //   mar = 0,
    //   apr = 0,
    //   may = 0,
    //   june = 0,
    //   july = 0,
    //   aug = 0,
    //   sept = 0,
    //   oct = 0,
    //   nov = 0,
    //   dec = 0;

    // for (let i = 0; i < arr.length; i++) {
    //   // const element = array[i];

    //   if (arr[i] == 0) {
    //     jan++;
    //   }

    //   if (arr[i] == 1) {
    //     feb++;
    //   }

    //   if (arr[i] == 2) {
    //     mar++;
    //   }

    //   if (arr[i] == 3) {
    //     apr++;
    //   }

    //   if (arr[i] == 4) {
    //     may++;
    //   }

    //   if (arr[i] == 5) {
    //     june++;
    //   }

    //   if (arr[i] == 6) {
    //     july++;
    //   }
    //   if (arr[i] == 7) {
    //     aug++;
    //   }
    //   if (arr[i] == 8) {
    //     sept++;
    //   }

    //   if (arr[i] == 9) {
    //     oct++;
    //   }
    //   if (arr[i] == 10) {
    //     nov++;
    //   }

    //   if (arr[i] == 10) {
    //     dec++;
    //   }
    // }



    let sumByMonth = {
      0: 0, // January
      1: 0, // February
      2: 0, // March
      3: 0, // April
      4: 0, // May
      5: 0, // June
      6: 0, // July
      7: 0, // August
      8: 0, // September
      9: 0, // October
      10: 0, // November
      11: 0, // December
    };
    for (let i = 0; i < hopperUsedTaskss.length; i++) {
      const item = hopperUsedTaskss[i];
      const month = item.createdAt.getMonth();
      sumByMonth[month] += item.Vat;
    }

    const {
      0: jan,
      1: feb,
      2: mar,
      3: apr,
      4: may,
      5: june,
      6: july,
      7: aug,
      8: sept,
      9: oct,
      10: nov,
      11: dec,
    } = sumByMonth;
    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportfundInvestedforContent = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;
    let condition;
    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }



    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    condition = {
      // paid_status: "un_paid",
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      type: "content",
      createdAt: {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      },
    };



    if (data.startDate && data.endDate) {
      condition = {
        // paid_status: "paid",
        // status: "published",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      condition = {
        // paid_status: "un_paid",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // status: "published",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      condition = {
        // paid_status: "paid",
        // status: "published",
        //
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // purchased_mediahouse:{$in:mongoose.Types.ObjectId(req.user._id)},
        // createdAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }
    const hopperUsedTaskss = await db.getItems(HopperPayment, condition);

    let sumByMonth = {
      0: 0, // January
      1: 0, // February
      2: 0, // March
      3: 0, // April
      4: 0, // May
      5: 0, // June
      6: 0, // July
      7: 0, // August
      8: 0, // September
      9: 0, // October
      10: 0, // November
      11: 0, // December
    };
    for (let i = 0; i < hopperUsedTaskss.length; i++) {
      const item = hopperUsedTaskss[i];
      const month = item.createdAt.getMonth();
      sumByMonth[month] += item.amount;
    }

    const {
      0: jan,
      1: feb,
      2: mar,
      3: apr,
      4: may,
      5: june,
      6: july,
      7: aug,
      8: sept,
      9: oct,
      10: nov,
      11: dec,
    } = sumByMonth;

    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.reportgraphofContentsourcedSumary = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let condition;
    let val = "year";

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    let yesterdays;



    yesterdays = {
      // paid_status: "un_paid",
      type: "task_content",
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      // status: "published",
      createdAt: {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      },
    };


    if (data.startDate && data.endDate) {
      yesterdays = {
        // paid_status: "un_paid",
        type: "task_content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // status: "published",
        createdAt: {
          $lte: new Date(data.startDate),
          $gte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {
        // paid_status: "un_paid",
        type: "task_content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // status: "published",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {
        // paid_status: "un_paid",
        type: "task_content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),


      };
    }




    const hopperUsedTaskss = await db.getItems(HopperPayment, yesterdays);
    //const hopperUsedTaskss = await db.getItems(Contents, yesterdays);

    const map = hopperUsedTaskss.map((x) => x.createdAt);
    // const resp = await HopperPayment.aggregate([
    //   {
    //     $match: {
    //       type: "task_content",
    //       media_house_id: mongoose.Types.ObjectId(req.user._id),
    //     }
    //   },
    //   {
    //     $project: {
    //       year: { $year: "$createdAt" },
    //       month: { $month: "$createdAt" }
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: { year: "$year", month: "$month" },
    //       count: { $sum: 1 }
    //     }
    //   },
    //   {
    //     $addFields: {
    //       monthName: {
    //         $arrayElemAt: [
    //           [
    //             "", "January", "February", "March", "April", "May", "June",
    //             "July", "August", "September", "October", "November", "December"
    //           ],
    //           "$_id.month"
    //         ]
    //       }
    //     }
    //   },
    //   {
    //     $sort: { "_id.year": 1, "_id.month": 1 }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       year: "$_id.year",
    //       month: "$_id.month",
    //       monthName: 1,
    //       count: 1
    //     }
    //   }
    // ])
    const arr = [];
    map.forEach((element) => {
      arr.push(element.getMonth());
    });

    // 

    let jan = 0,
      feb = 0,
      mar = 0,
      apr = 0,
      may = 0,
      june = 0,
      july = 0,
      aug = 0,
      sept = 0,
      oct = 0,
      nov = 0,
      dec = 0;

    for (let i = 0; i < arr.length; i++) {
      // const element = array[i];

      if (arr[i] == 0) {
        jan++;
      }

      if (arr[i] == 1) {
        feb++;
      }

      if (arr[i] == 2) {
        mar++;
      }

      if (arr[i] == 3) {
        apr++;
      }

      if (arr[i] == 4) {
        may++;
      }

      if (arr[i] == 5) {
        june++;
      }

      if (arr[i] == 6) {
        july++;
      }
      if (arr[i] == 7) {
        aug++;
      }
      if (arr[i] == 8) {
        sept++;
      }

      if (arr[i] == 9) {
        oct++;
      }
      if (arr[i] == 10) {
        nov++;
      }

      if (arr[i] == 11) {
        dec++;
      }
    }
    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportgraphofContentforPaid = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let condition;
    let val = "year";

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }
    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    if (data.startDate && data.endDate) {
      condition = {
        // paid_status: "paid",
        // status: "published",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      condition = {
        // paid_status: "un_paid",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // status: "published",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      condition = {
        // paid_status: "paid",
        // status: "published",
        //
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // purchased_mediahouse:{$in:mongoose.Types.ObjectId(req.user._id)},
        // createdAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }
    const hopperUsedTaskss = await db.getItems(HopperPayment, condition);
    // const hopperUsedTaskss = await db.getItems(Contents, condition);

    const map = hopperUsedTaskss.map((x) => x.createdAt);

    const arr = [];
    map.forEach((element) => {
      arr.push(element.getMonth());
    });

    let jan = 0,
      feb = 0,
      mar = 0,
      apr = 0,
      may = 0,
      june = 0,
      july = 0,
      aug = 0,
      sept = 0,
      oct = 0,
      nov = 0,
      dec = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == 0) {
        jan++;
      }

      if (arr[i] == 1) {
        feb++;
      }

      if (arr[i] == 2) {
        mar++;
      }

      if (arr[i] == 3) {
        apr++;
      }

      if (arr[i] == 4) {
        may++;
      }

      if (arr[i] == 5) {
        june++;
      }

      if (arr[i] == 6) {
        july++;
      }
      if (arr[i] == 7) {
        aug++;
      }
      if (arr[i] == 8) {
        sept++;
      }

      if (arr[i] == 9) {
        oct++;
      }
      if (arr[i] == 10) {
        nov++;
      }

      if (arr[i] == 11) {
        dec++;
      }
    }
    res.json({
      code: 200,
      data: {
        jan,
        feb,
        mar,
        apr,
        may,
        june,
        july,
        aug,
        sept,
        oct,
        nov,
        dec,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.reportContentLocation = async (req, res) => {
  try {
    const data = req.query;
    let task;
    let val = "year";
    const condition = {
      purchased_publication: mongoose.Types.ObjectId(req.user._id),
    };
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }
    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    const listofcategory = await Contents.find(condition);
    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "content" },
            { updatedAt: { $gte: yesterdayStart } },
            { updatedAt: { $lte: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          // console: "$amount_paid",
          // ref:"$data.content",
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $addFields: {
          north: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$content_id.latitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },

          south: {
            $cond: {
              if: {
                $and: [
                  { $lt: ["$content_id.latitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },
          east: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$content_id.longitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },

          west: {
            $cond: {
              if: {
                $and: [
                  { $lt: ["$content_id.longitude", 0] },
                  // { $eq: ["$paid_status", true] }, // Additional condition
                ],
              },
              then: 1,
              else: 0,
            },
          },

          // totalDislikes: { $sum: "$dislikes" }
        },
      },

      {
        $sort: { updatedAt: -1 } // Sort by month in ascending order (optional)
      },
    ]);
    if (data.startDate && data.endDate) {
      condition = {
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else {
      condition.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      };
    }

    let buisnesscount = 0,
      crimecount = 0,
      fashoncount = 0,
      politics = 0;
    for (let i = 0; i < listofcategory.length; i++) {
      if (listofcategory[i].latitude < 0) {
        buisnesscount++;
      }

      if (listofcategory[i].latitude > 0) {
        crimecount++;
      }

      if (listofcategory[i].longitude > 0) {
        fashoncount++;
      }

      if (listofcategory[i].longitude < 0) {
        politics++;
      }
    }

    res.json({
      code: 200,
      data: {
        data: getcontentonline1,
        north: buisnesscount,
        south: crimecount,
        west: fashoncount,
        east: politics,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportcontentTypeGraph = async (req, res) => {
  try {
    const data = req.query;

    let val = "year";

    if (data.hasOwnProperty("meekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());






    let filters = {
      purchased_mediahouse: { $in: mongoose.Types.ObjectId(req.user._id) },
      // $expr: {
      //   $and: [
      //     {
      //       $in: [
      //         "$purchased_mediahouse",
      //         [mongoose.Types.ObjectId(req.user._id)],
      //       ],
      //     },
      //   ],
      // },

    };

    if (data.startDate && data.endDate) {
      filters.createdAt = {
        $gte: new Date(data.startDate),
        $lte: new Date(data.endDate),
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      filters = {
        "Vat": {
          $elemMatch: {
            purchased_mediahouse_id: req.user._id,
            purchased_time: {
              $lte: yesterdayStart,
              $gte: yesterdayStart,
            }
          }
        },
      }
    } else {
      filters = {
        purchased_mediahouse: { $in: mongoose.Types.ObjectId(req.user._id) },
      };
    }



    // else {
    //   // filters.createdAt = {
    //   //   $lte: yesterdayEnd,
    //   //   $gte: yesterdayStart,
    //   // };
    // }
    // {
    //   $match: filters,
    // }
    const uses = await Contents.find(filters);

    let buisnesscount = 0,
      crimecount = 0,
      fashoncount = 0,
      politics = 0;

    for (let i = 0; i < uses.length; i++) {
      for (let j = 0; j < uses[i].content.length; j++) {
        if (uses[i].content[j].media_type == "image") {
          buisnesscount++;
        }

        if (uses[i].content[j].media_type == "video") {
          crimecount++;
        }

        if (uses[i].content[j].media_type == "interview") {
          fashoncount++;
        }
      }
    }

    res.json({
      code: 200,
      data: {
        image: buisnesscount,
        video: crimecount,
        interview: fashoncount,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};


exports.reportSplit = async (req, res) => {
  try {
    const data = req.query;
    let task;

    // const condition = {
    //   purchased_publication: mongoose.Types.ObjectId(req.user._id),
    // };
    const condition = {
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
        }
      }
    }
    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("Weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("Monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("Yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());


 const aggregationPipeline = [
  {
    $match: {
      $and: [
        { media_house_id: req.user._id },
        { type: "content" }
      ]
    }
  },
  {
    // Lookup to fetch data from content collection using content_id
    $lookup: {
      from: "contents",           // Replace with the actual content collection name
      localField: "content_id",   // The field in the current collection
      foreignField: "_id",        // The field in the contents collection
      as: "content_data"          // The name for the joined data
    }
  },
  {
    // Unwind the content_data array to handle it as individual objects
    $unwind: {
      path: "$content_data",
      preserveNullAndEmptyArrays: true // Preserve documents even if content_data is empty
    }
  },
  {
    // Group by year and month
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" }
      },
      volume: { $sum: 1 },
      shared: {
        $sum: {
          $cond: [{ $eq: ["$payment_content_type", "shared"] }, 1, 0]
        }
      },
      exclusive: {
        $sum: {
          $cond: [{ $eq: ["$payment_content_type", "exclusive"] }, 1, 0]
        }
      },
      content_id: { $push: "$content_data" } // Pushing the content data
    }
  },
  {
    // Project the desired output
    $project: {
      _id:1,
      year: "$_id.year",
      month: "$_id.month",
      volume: 1,
      shared: 1,
      exclusive: 1,
      content_id: 1
    }
  },
  {
    // Sort by year and month if needed
    $sort: { year: -1, month: -1 }
  }
];


const getcontentonline2 = await HopperPayment.aggregate(aggregationPipeline)

    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "content" },
            // { updatedAt: { $gte: yesterdayStart } },
            // { updatedAt: { $lte: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $addFields: {
          volume: { $size: "$data" },
        },
      },
      {
        $unwind: "$data",
      },

      {
        $addFields: {
          shared: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$data.payment_content_type", "shared"] },
                ],
              },
              then: 1,
              else: 0,
            },
          },
          exclusive: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$data.payment_content_type", "exclusive"] },
                ],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id", // Grouping by the original _id
          total_price: { $first: "$total_price" },
          total_vat: { $first: "$total_vat" },
          data: { $first: "$data" },
          volume: { $first: "$volume" },
          shared: { $sum: "$shared" }, // Sum the shared counts
          exclusive: { $sum: "$exclusive" }, // Sum the exclusive counts
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $sort: { updatedAt: -1 }
      },
    ]);
    if (data.startDate && data.endDate) {
      condition = {
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else {
      condition.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      };
    }

    task = await Contents.find(condition)
    // .select({ _id: 1, category_id: 1 })
    // .populate({ path: "category_id" });

    let shared = 0,
      exclusive = 0,
      others = 0;

    // for (let i = 0; i < task.length; i++) {
    //   if (task[i].type == "shared") {
    //     shared++;
    //   } else if (task[i].type == "exclusive") {
    //     exclusive++;
    //   } else {
    //     others++;
    //   }
    // }

    res.json({
      code: 200,
      data: {
        // data2: getcontentonline1,
        data:getcontentonline2,
        shared: shared,
        exclusive: exclusive,
        others: others,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.reportContentcategory = async (req, res) => {
  try {
    const data = req.query;
    let task;

    let condition = []

    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    if (data.startDate && data.endDate) {
      condition = [
        { media_house_id: mongoose.Types.ObjectId(req.user._id) },
        { type: "content" },
        { createdAt: { $gte: new Date(data.startDate) } },
        { createdAt: { $lte: new Date(data.endDate) } },
      ]
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      condition = [
        { media_house_id: mongoose.Types.ObjectId(req.user._id) },
        { type: "content" },
        { createdAt: { $gte: yesterdayStart } },
        { createdAt: { $lte: yesterdayEnd } },
      ]

    } else {
      condition = [
        { media_house_id: mongoose.Types.ObjectId(req.user._id) },
        { type: "content" },
      ];
    }
    //  else {
    //   // condition.updatedAt = {
    //   //   $lte: yesterdayEnd,
    //   //   $gte: yesterdayStart,
    //   // };
    // }
    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: {
          $and: condition,
        },
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          // console: "$amount_paid",
          // ref:"$data.content",
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $unwind: "$content_id", // Unwind the hopper_id array
      },
      {
        $lookup: {
          from: "categories", // Replace "avatars" with the actual collection name where avatars are stored
          localField: "content_id.category_id",
          foreignField: "_id",
          as: "category_id", // Rename the result to "avatar_id" within the hopper_id object
        },
      },
      {
        $unwind: "$category_id", // Unwind the hopper_id array
      },
      {
        $project: {
          _id: 1,
          category_id: 1,
          type: 1,
        }
      },
      // {
      //   $sort: { updatedAt: -1 } // Sort by month in ascending order (optional)
      // },
    ]);
    task = getcontentonline1


    // await Contents.find(condition)
    //   .select({ _id: 1, category_id: 1, type: 1 })
    //   .populate({ path: "category_id" });

    let exclusiveCount = 0,
      celebrityCount = 0,
      politicsCount = 0,
      buisnessCount = 0,
      crimeCount = 0,
      fashionCount = 0;

    for (let i = 0; i < task.length; i++) {
      if (task[i].category_id.name == "Celebrity") {
        celebrityCount++;
      } else if (task[i].category_id.name == "Politics") {
        politicsCount++;
      } else if (task[i].category_id.name == "Buisness") {
        buisnessCount++;
      } else if (task[i].category_id.name == "Crime") {
        crimeCount++;
      } else if (task[i].category_id.name == "Fashion") {
        fashionCount++;
      } else {
        exclusiveCount++;
      }
    }

    let splitcelebrityCount, splitpoliticsCount, splitexclusiveCount
    for (let i = 0; i < task.length; i++) {
      if (task[i].type == "shared") {
        splitcelebrityCount++;
      } else if (task[i].type == "exclusive") {
        splitpoliticsCount++;
      } else {
        splitexclusiveCount++;
      }
    }

    res.json({
      code: 200,
      data: {
        data: getcontentonline1,
        buisness_count: buisnessCount,
        crime_count: crimeCount,
        fashion_count: fashionCount,
        politics_count: politicsCount,
        other: exclusiveCount,
        celebrity_count: celebrityCount,
        split_shared: splitcelebrityCount,
        split_exclusive: splitpoliticsCount,
        split_others: splitexclusiveCount
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
const findUser = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
      },
      "password loginAttempts blockExpires  email role verified verification first_name last_name user_name country_code phone profile_image address bank_detail recieve_task_notification location latitude longitude is_terms_accepted status forgotPassOTP forgotPassOTPExpire admin_detail admin_rignts upload_docs company_bank_details sign_leagel_terms stripe_customer_id",
      (err, item) => {
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    );
  });
};

exports.confirmPassword = async (req, res) => {
  try {
    const data = req.body;
    const emailid = req.user.email;
    const USER = await findUser(req.user.email);
    const passwordMatch = bcrypt.compareSync(data.password, USER.password);
    if (passwordMatch) {
      //if matched successfully
      return res.status(200).json({
        code: 200,
        status: "paswword matched",
      });
    } else {
      return res.status(400).json({
        code: 400,
        error: { msg: "paswword doesn't matched" },
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.exclusiveContents = async (req, res) => {
  try {
    const exclusiveContent = await Contents.find({
      sale_status: "unsold",
      type: "exclusive",
    })
      .populate("hopper_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      });
    res.json({ code: 200, data: exclusiveContent });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.paymenttobemade = async (req, res) => {
  try {

    const exclusiveContent = await Chat.find({
      paid_status: false,
      message_type: "accept_mediaHouse_offer",
      sender_id: mongoose.Types.ObjectId(req.user._id),
    });
    const list = exclusiveContent.map((x) => x.image_id);

    const total = await Contents.find({ _id: { $in: list }, is_deleted: false }).populate({
      path: "hopper_id",
      populate: {
        path: "avatar_id",
      },
    }).sort({ createdAt: -1 });

    const paymentmade = total.map((x) => x.ask_price).reduce((a, b) => a + b, 0);
    // const total = await HopperPayment.find({
    //   media_house_id: req.user._id,
    //   is_rated: false,
    // })
    //  .populate("hopper_id media_house_id")
    //  .populate({
    //     path: "hopper_id",
    //     populate: {
    //       path: "avatar_id",
    //     },
    //   })
    //  .sort({ createdAt: -1 });

    res.json({ code: 200, data: total, paymentmade: paymentmade, chatdata: exclusiveContent });
    // res.json({ code: 200, data: contentl });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.currentchat = async (req, res) => {
  try {
    const chat = await Room.find({
      $or: [{ sender_id: req.user._id }, { receiver_id: req.user._id }],
    })
      .populate("sender_id receiver_id")
      .populate({
        path: "sender_id",
        populate: {
          path: "avatar_id",
        },
      }).limit(req.body.limit ? parseInt(req.body.limit) : 3).sort({ updatedAt: -1 });

    res.json({ code: 200, data: chat.length, chat: chat });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.listofHopperwithoutrating = async (req, res) => {
  try {
    let chats = await HopperPayment.find({
      media_house_id: req.user._id,
      is_rated: false,
    })
      .populate("hopper_id media_house_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 });

    const uniqueHopperMap = new Map();
    // Loop through each chat and store unique hopper_id with their details in the map
    chats.forEach((chat) => {
      const hopperId = chat.hopper_id; // Assuming hopper_id is an object with a unique `_id` field
      if (!uniqueHopperMap.has(hopperId)) {
        uniqueHopperMap.set(hopperId, chat.hopper_id);
      }
    });

    // Convert the map values to an array to match the original response format
    const uniqueHopperDetails = Array.from(uniqueHopperMap.values());

    res.json({ code: 200, data: uniqueHopperDetails });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.contentwithouthrating = async (req, res) => {
  try {
    const data = req.query;
    let chats = await HopperPayment.find({
      media_house_id: req.user._id,
      hopper_id: data.hopper_id,
      is_rated: false,
    }).populate("hopper_id  content_id task_content_id media_house_id").populate({
      path: "task_content_id",
      populate: {
        path: "task_id",
      },
    }).sort({ createdAt: -1 });

    res.json({ code: 200, data: chats });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.ratingforunratedcontent = async (req, res) => {
  try {
    const data = req.body;
    let response, status;
    const findCount = await HopperPayment.findOne({ content_id: data.content_id });
    if (data.content_type == "content") {
      const added = await HopperPayment.updateMany(
        {
          content_id: data.content_id,
        },
        { is_rated: true }
      );
      data.from = req.user._id
      data.to = findCount.hopper_id
      response = await db.createItem(data, rating);
      status = `added to rating`;
    } else {
      const added = await HopperPayment.updateMany(
        {
          task_content_id: data.content_id,
        },
        { is_rated: true }
      );
      const findtask = await Uploadcontent.findOne({
        _id: data.content_id,
      })
      data.from = req.user._id
      data.to = findtask.hopper_id
      response = await db.createItem(data, rating);
      status = `added to rating`;
    }
    res.json({ code: 200, data: response, status: status });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.mostviewed = async (req, res) => {
  try {
    const data = req.body;
    let response, status;
    response = await db.createItem(data, mostviewed);
    if (data.type == "content") {
      const findCount = await Contents.findOne({ _id: data.content_id });
      if (findCount) {
        const viewCount = findCount.content_view_count;
        const count = await Contents.updateOne(
          { _id: data.content_id },
          { content_view_count: viewCount + 1 }
        );
      }
    } else {
      const findContent = await Uploadcontent.findOne({
        _id: data.task_content_id,
      });
      if (findContent) {
        const viewCount = findContent.upload_view_count;
        const count = await Uploadcontent.update(
          { _id: data.task_content_id },
          { upload_view_count: viewCount + 1 }
        );
      }
    }
    status = "recently view";
    res.json({ code: 200, data: response, status });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.sendWhatsapp = async (req, res) => {
  try {
    client.messages
      .create({
        from: "whatsapp:+447795377304",
        body: "123456 is your verification code. For your security, do not share this code.",
        to: "whatsapp:+918437162320",
      })
      .then((message) =>
        res.json({ code: 200, data: "Message Sent" })
      )
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getofferContentById = async (req, res) => {
  try {
    const data = req.query;

    const resp = await Contents.findOne({
      _id: data.content_id,
      content_under_offer: true,
      // sale_status: "unsold",
    });

    res.json({
      code: 200,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.trending_search = async (req, res) => {
  try {
    const data = req.query;

    const resp = await trendingSearch.aggregate([
      {
        $group: {
          _id: "$tagName",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          _id: { $ne: null }
        }
      },
      // {
      //   $lookup: {
      //     from: "tags",
      //     localField: "_id",
      //     foreignField: "_id",
      //     as: "tags_details",
      //   },
      // },
      {
        $sort: { count: -1 },
      },
      { $limit: 25 }
    ]);

    return res.json({
      code: 200,
      response: resp,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.vatforaccount = async (req, res) => {
  try {
    const data = req.query;
    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    let yesterdays
    if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
      };
    }




    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: yesterdays

        // {
        //   $and: [
        //     { media_house_id: req.user._id },
        //     { type: "content" },
        //     { updatedAt: { $gte: yesterdayStart } },
        //     { updatedAt: { $lte: yesterdayEnd } },
        //   ],
        // },
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          console: "$amount_paid",
          // ref:"$data.content",
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $sort: { "_id.month": -1, "_id.year": 1 } // Sort by month in ascending order (optional)
      },
    ]);
    // const totalinvestedfund = await HopperPayment.aggregate([
    //   {
    //     $match: {
    //       $and: [
    //         { media_house_id: req.user._id },
    //         // { type: "task_content" },
    //         { updatedAt: { $gte: yesterdayStart } },
    //         { updatedAt: { $lte: yesterdayEnd } },
    //       ],
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$media_house_id",
    //       totalamountpaid: { $sum: "$amount" },
    //       vat: { $sum: "$Vat" },
    //       data: { $push: "$$ROOT" },
    //     },
    //   },

    //   {
    //     $addFields: {
    //       console: "$amount_paid",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "contents",
    //       localField: "data.content_id",
    //       foreignField: "_id",
    //       as: "content_id",
    //     },
    //   },
    //   {
    //     $project: {
    //       paid_status: 1,
    //       purchased_publication: 1,
    //       content_id: 1,
    //       amount_paid: 1,
    //       totalamountpaid: 1,
    //       console: 1,
    //       paid_status: 1,
    //       vat: 1,
    //       updatedAt: 1,
    //     },
    //   },
    //   {
    //     $sort: {
    //       updatedAt: -1
    //     }
    //   }
    // ]);

    res.json({
      code: 200,
      response: getcontentonline1,
      volume: getcontentonline1.length,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.contentPurchasedOnlinesummary = async (req, res) => {
  try {
    const data = req.query;
    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    const today = new Date(
      moment().utc().subtract(1, val).startOf(val).format()
    );
    const todayend = new Date(
      moment().utc().subtract(1, val).endOf(val).format()
    );


    let yesterdays, yesterdayss
    if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      yesterdays = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
      };
    }



    if (data.daily || data.yearly || data.monthly || data.weekly) {
      yesterdayss = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: todayend,
          $gte: today,
        },
      };
    } else {
      yesterdayss = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
      };
    }
    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: yesterdays
        //  {
        //   $and: [
        //     { media_house_id: req.user._id },
        //     { type: "content" },
        //     { updatedAt: { $gte: yesterdayStart } },
        //     { updatedAt: { $lte: yesterdayEnd } },
        //   ],
        // },
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          // console: "$amount_paid",
          // ref:"$data.content",
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $sort: { updatedAt: -1 } // Sort by month in ascending order (optional)
      },
    ]);
    const totalinvestedfund = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "content" },
            { updatedAt: { $gte: yesterdayStart } },
            { updatedAt: { $lte: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
          ref: "$data.content",
          // volume: { $size: "$ref" },
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          content_id: 1,
          volume: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
          updatedAt: 1,
        },
      },
    ]);

    const previoustotalinvestedfund = await HopperPayment.aggregate([
      {
        $match: yesterdayss,

        // {
        //   $and: [
        //     { media_house_id: req.user._id },
        //     { type: "content" },
        //     { updatedAt: { $gte: today } },
        //     { updatedAt: { $lte: todayend } },
        //   ],
        // },
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },

      {
        $addFields: {
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $project: {
          paid_status: 1,
          content_id: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          volume: 1,
          paid_status: 1,
          vat: 1,
          updatedAt: 1,
        },
      },
    ]);
    let percentage5, type5;
    if (totalinvestedfund > previoustotalinvestedfund) {
      (percentage5 = (previoustotalinvestedfund / totalinvestedfund) * 100),
        (type5 = "increase");
    } else {
      (percentage5 = (totalinvestedfund / previoustotalinvestedfund) * 100),
        (type5 = "decrease");
    }

    res.json({
      code: 200,
      response: getcontentonline1,
      previous: previoustotalinvestedfund,
      volume: getcontentonline1.length,
      percentage: percentage5,
      type: type5,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.taskPurchasedOnlinesummary = async (req, res) => {
  try {
    const data = req.query;
    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    const today = new Date(
      moment().utc().subtract(1, val).startOf(val).format()
    );
    const todayend = new Date(
      moment().utc().subtract(1, val).endOf(val).format()
    );

    const getcontentonline1 = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: yesterdayStart } },
            { updatedAt: { $lte: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          // console: "$amount_paid",
          // ref:"$data.content",
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "uploadcontents",
          localField: "data.task_content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $lookup: {
          from: "tasks",
          let: {
            hopper_id: "$content_id.task_id",
            // new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$_id", "$$hopper_id"] }],
                },
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_details",
              },
            },
            {
              $unwind: "$category_details",
            },
          ],
          as: "task_details",
        },
      },
      {
        $sort: { updatedAt: -1 }, // Sort by month in ascending order (optional)
      },
    ]);
    const previousgetcontentonline1 = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: today } },
            { updatedAt: { $lte: todayend } },
          ],
        },
      },
      {
        $group: {
          // _id: { $month: "$createdAt" }, // Group by month
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          // console: "$amount_paid",
          // ref:"$data.content",
          volume: { $size: "$data" },
        },
      },
      {
        $sort: { updatedAt: -1 }, // Sort by month in ascending order (optional)
      },
    ]);
    res.json({
      code: 200,
      response: getcontentonline1,
      volume: getcontentonline1.length,
      previous: previousgetcontentonline1,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.taskPurchasedOnlinesummaryforReport = async (req, res) => {
  try {
    const data = req.query;
    let val = "day";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    } else if (data.hasOwnProperty("monthly")) {
      val = "month";
    } else if (data.hasOwnProperty("daily")) {
      val = "day";
    } else if (data.hasOwnProperty("yearly")) {
      val = "year";
    }
    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    const today = new Date(
      moment().utc().subtract(1, val).startOf(val).format()
    );
    const todayend = new Date(
      moment().utc().subtract(1, val).endOf(val).format()
    );
    let condition = {
      $and: [
        { purchased_publication: mongoose.Types.ObjectId(req.user._id) },
        // { type: "task_content" },
        { updatedAt: { $gte: yesterdayStart } },
        { updatedAt: { $lte: yesterdayEnd } },
      ],
    }
    if (data.type == "all") {

      condition = {
        $and: [
          { purchased_publication: mongoose.Types.ObjectId(req.user._id) },
        ],
      }
    }

    // {
    //   $and: [
    //     { purchased_publication: req.user._id },
    //     // { type: "task_content" },
    //     { updatedAt: { $gte: yesterdayStart } },
    //     { updatedAt: { $lte: yesterdayEnd } },
    //   ],
    // }
    const getcontentonline1 = await Uploadcontent.aggregate([
      {
        $match: condition,
      },
      {
        $group: {
          _id: "$task_id",
          total_price: { $sum: "$amount_paid" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "data.hopper_id",
          foreignField: "_id",
          as: "hopper_id",
        },
      },
      {
        $unwind: "$hopper_id",
      },
      {
        $lookup: {
          from: "avatars", // Assuming avatars is the collection containing avatars
          localField: "hopper_id.avatar_id", // Assuming avatar_id is a field in the users collection
          foreignField: "_id",
          as: "hopper_id.avatar_details",
        },
      },


      {
        $addFields: {
          task_is_fordetail: "$data.task_id",
          hopper_is_fordetail: "$data.hopper_id",
        },
      },
      {
        $lookup: {
          from: "tasks",
          let: {
            hopper_id: "$task_is_fordetail",
            new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "users",
                let: { hopper_id: "$new_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $in: ["$_id", "$$new_id"] }],
                      },
                    },
                  },
                  {
                    $addFields: {
                      console: "$$new_id",
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
                    $lookup: {
                      from: "categories",
                      localField: "category_id",
                      foreignField: "_id",
                      as: "category_details",
                    },
                  },
                ],
                as: "hopper_details",
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_details",
              },
            },
            {
              $unwind: "$category_details",
            },
          ],
          as: "task_details",
        },
      },
      {
        $unwind: "$task_details",
      },
      {
        $sort: { createdAt: -1 }, // Sort by month in ascending order (optional)
      },
    ]);

    const prevggetcontentonline1 = await Uploadcontent.aggregate([
      {
        $match: {
          $and: [
            { purchased_publication: req.user._id },
            // { type: "task_content" },
            { updatedAt: { $gte: today } },
            { updatedAt: { $lte: todayend } },
          ],
        },
      },
      {
        $group: {
          _id: "$task_id",
          total_price: { $sum: "$amount_paid" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" }, // Collect documents within each group
        },
      },
      {
        $addFields: {
          volume: { $size: "$data" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "data.hopper_id",
          foreignField: "_id",
          as: "hopper_id",
        },
      },

      {
        $addFields: {
          task_is_fordetail: "$data.task_id",
          hopper_is_fordetail: "$data.hopper_id",
        },
      },
      {
        $lookup: {
          from: "tasks",
          let: {
            hopper_id: "$task_is_fordetail",
            new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "users",
                let: { hopper_id: "$new_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [{ $in: ["$_id", "$$new_id"] }],
                      },
                    },
                  },
                  {
                    $addFields: {
                      console: "$$new_id",
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
                    $lookup: {
                      from: "categories",
                      localField: "category_id",
                      foreignField: "_id",
                      as: "category_details",
                    },
                  },
                ],
                as: "hopper_details",
              },
            },
            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_details",
              },
            },
            {
              $unwind: "$category_details",
            },
          ],
          as: "task_details",
        },
      },
      {
        $unwind: "$task_details",
      },
      {
        $sort: { updatedAt: -1 } // Sort by month in ascending order (optional)
      },
    ]);
    const totalinvestedfund = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: yesterdayStart } },
            { updatedAt: { $lte: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.task_content_id",
          foreignField: "_id",
          as: "task_content_id",
        },
      },
      {
        $project: {
          paid_status: 1,
          task_content_id: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
          updatedAt: 1,
        },
      },
    ]);

    const previoustotalinvestedfund = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            { type: "task_content" },
            { updatedAt: { $gte: today } },
            { updatedAt: { $lte: todayend } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $lookup: {
          from: "uploadcontents",
          localField: "data.task_content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $project: {
          paid_status: 1,
          task_content_id: 1,
          purchased_publication: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
          updatedAt: 1,
        },
      },
    ]);
    let percentage5, type5;
    if (totalinvestedfund > previoustotalinvestedfund) {
      (percentage5 = (previoustotalinvestedfund / totalinvestedfund) * 100),
        (type5 = "increase");
    } else {
      (percentage5 = (totalinvestedfund / previoustotalinvestedfund) * 100),
        (type5 = "decrease");
    }

    res.json({
      code: 200,
      response: getcontentonline1,
      volume: getcontentonline1.length,
      previous: prevggetcontentonline1,
      percentage: percentage5,
      type: type5,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.fundInvestedTodayortotal = async (req, res) => {
  try {
    const data = req.query;
    let val = "year";

    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());
    const today = new Date(
      moment().utc().subtract(1, val).startOf(val).format()
    );
    const todayend = new Date(
      moment().utc().subtract(1, val).endOf(val).format()
    );

    const totalinvestedfund = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            // { type: "task_content" },
            { updatedAt: { $gte: yesterdayStart } },
            { updatedAt: { $lte: yesterdayEnd } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          content_id: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: {
          updatedAt: -1
        }
      }
    ]);
    const previoustotalinvestedfund = await HopperPayment.aggregate([
      {
        $match: {
          $and: [
            { media_house_id: req.user._id },
            // { type: "task_content" },
            { updatedAt: { $gte: today } },
            { updatedAt: { $lte: todayend } },
          ],
        },
      },
      {
        $group: {
          _id: "$media_house_id",
          totalamountpaid: { $sum: "$amount" },
          vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },

      {
        $addFields: {
          console: "$amount_paid",
        },
      },
      {
        $lookup: {
          from: "uploadcontents",
          localField: "data.task_content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },
      {
        $sort: {
          updatedAt: -1
        }
      },
      {
        $project: {
          paid_status: 1,
          purchased_publication: 1,
          content_id: 1,
          amount_paid: 1,
          totalamountpaid: 1,
          console: 1,
          paid_status: 1,
          vat: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.json({
      code: 200,
      response: totalinvestedfund,
      previous: previoustotalinvestedfund,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.sendPustNotificationtoHopper = async (req, res) => {
  try {
    const data = req.body;
    data.sender_id = req.user._id
    const notiObj = {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      title: data.title,
      body: data.body,
      // is_admin:true
    };
    await _sendPushNotification(notiObj);
    res.json({
      code: 200,
      msg: "sent",
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getContensLists = async (req, res) => {
  try {
    const data = req.body

    let condition = {
      media_house_id: req.user._id,
      type: "content",
    };
    let sortBy = {
      createdAt: -1,
    };
    if (data.content == "latest") {
      sortBy = {
        createdAt: -1,
      };
    }
    if (data.content == "lowPrice") {
      sortBy = {
        ask_price: 1,
      };
    }
    if (data.content == "highPrice") {
      sortBy = {
        ask_price: -1,
      };
    }

    let condition1 = {};
    if (data.maxPrice && data.minPrice) {
      condition1 = {
        $expr: {
          $and: [
            { $gte: ["$ask_price", data.minPrice] },
            { $lte: ["$ask_price", data.maxPrice] },
          ],
        },
      };
    }
    if (data.id) {
      condition.content_id = mongoose.Types.ObjectId(data.id)

      const total_fund_invested_data = await HopperPayment.aggregate([
        {
          $match: condition,
        },

        {
          $lookup: {
            from: "contents",
            let: { id: "$content_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$id"] }
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "categories",
                  let: { category_id: "$category_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$category_id"] },
                      },
                    },
                  ],
                  as: "category_ids",
                },
              },
              {
                $lookup: {
                  from: "tags",
                  let: { tag_id: "$tag_ids" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $in: ["$_id", "$$tag_id"] },
                      },
                    },
                  ],
                  as: "tag_ids_data",
                },
              },
            ],
            as: "content_ids",
          },
        },
        {
          $addFields: {
            ask_price: "$content_ids.ask_price",
            content_id: "$content_ids._id",
          },
        },
        {
          $unwind: "$content_id"
        },
        {
          $unwind: "$ask_price",
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$hopper_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$id"] },
                },
              },
              {
                $lookup: {
                  from: "avatars",
                  let: { avatar_id: "$avatar_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$avatar_id"] },
                      },
                    },
                  ],
                  as: "avatar_details",
                },
              },
            ],
            as: "hopper_ids",
          },
        },

        {
          $unwind: "$hopper_ids",
        },
        {
          $lookup: {
            from: "admins",
            localField: "admin_id",
            foreignField: "_id",
            as: "admin_ids"
          }
        },
        {
          $unwind: "$admin_ids",
        },
        {
          $lookup: {
            from: "users",
            localField: "media_house_id",
            foreignField: "_id",
            as: "media_house_ids"
          }
        },
        {
          $unwind: "$media_house_ids",
        },
      ]);

      return res.json({
        code: 200,
        data: total_fund_invested_data[0]
      })
    } else if (data.type) {

      const total_fund_invested_data = await HopperPayment.aggregate([
        {
          $match: condition,
        },

        {
          $lookup: {
            from: "contents",
            let: { id: "$content_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$id"] },
                    { $eq: ["$type", data.type] }
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "categories",
                  let: { category_id: "$category_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$category_id"] },
                      },
                    },
                  ],
                  as: "category_ids",
                },
              },
            ],
            as: "content_ids",
          },
        },
        {
          $addFields: {
            ask_price: "$content_ids.ask_price",
          },
        },
        {
          $unwind: "$ask_price",
        },
        {
          $match: condition1,
        },

        {
          $lookup: {
            from: "users",
            let: { id: "$hopper_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$id"] },
                },
              },
              {
                $lookup: {
                  from: "avatars",
                  let: { avatar_id: "$avatar_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$avatar_id"] },
                      },
                    },
                  ],
                  as: "avatar_details",
                },
              },
            ],
            as: "hopper_ids",
          },
        },

        {
          $unwind: "$hopper_ids",
        },
        {
          $sort: sortBy,
        },
      ]);
      return res.json({
        code: 200,
        count: total_fund_invested_data.length,
        data: total_fund_invested_data
      })
    } else {
      const total_fund_invested_data = await HopperPayment.aggregate([
        {
          $match: condition,
        },

        {
          $lookup: {
            from: "contents",
            let: { id: "$content_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$id"] }
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "categories",
                  let: { category_id: "$category_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$category_id"] },
                      },
                    },
                  ],
                  as: "category_ids",
                },
              },
            ],
            as: "content_ids",
          },
        },
        {
          $addFields: {
            ask_price: "$content_ids.ask_price",
          },
        },
        {
          $unwind: "$ask_price",
        },
        {
          $match: condition1,
        },

        {
          $lookup: {
            from: "users",
            let: { id: "$hopper_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$id"] },
                },
              },
              {
                $lookup: {
                  from: "avatars",
                  let: { avatar_id: "$avatar_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$avatar_id"] },
                      },
                    },
                  ],
                  as: "avatar_details",
                },
              },
            ],
            as: "hopper_ids",
          },
        },

        {
          $unwind: "$hopper_ids",
        },
        {
          $sort: sortBy,
        },
      ]);
      return res.json({
        code: 200,
        count: total_fund_invested_data.length,
        data: total_fund_invested_data
      })
    }
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.userRegisteration = async (req, res) => {
  try {
    const data = req.body
    const locale = req.getLocale();
    const passwordLength = 12;
    const randomPassword = generateRandomPassword(passwordLength);
    let currentCount = 2 + 1
    const newCount = currentCount + Math.random() * 1000000 + 1
    data.phone = data.phone ? data.phone : parseInt(newCount)// Math.floor(Math.random() * (1 - 100 + 1)) + 1
    data.email = data.user_email
    const findMediaHouse = await User.findOne({ email: data.administator_email, role: "MediaHouse" });
    if (findMediaHouse) {
      data.media_house_id = findMediaHouse._id
      const createUserRequest = await UserMediaHouse.create(data);
      const emailObjs = {

        to: findMediaHouse.email,
        temp_user_detail_id: createUserRequest._id,
        subject: "New employee Request",
        mediaHouse: findMediaHouse.first_name,
        userName: findMediaHouse.company_name,
        vat: findMediaHouse.company_vat,
        user_email: encodeURIComponent(data.email),//.const encoded = encodeURI(uri),
        user_first_name: data.user_first_name,
        user_last_name: data.user_last_name,
        company_number: findMediaHouse.company_number
      }
      await emailer.sendUserApprovaltoMediaHouse(locale, emailObjs);
      return res.json({
        code: 200,
        data: createUserRequest,
        message: "User registration request sent successfully"
      })
    } else {
      return res.status(400).send({
        code: 400,
        message: "Mediahouse doesn't exist"
      })
    }

  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.getUnApprovedUsers = async (req, res) => {
  try {
    const list = await UserMediaHouse.findAll({ media_house_id: req.user._id, is_onboard: false }).sort({ createdAt: -1 })
    return res.json({
      code: 200,
      data: list
    })
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.completeOnboardUserDetails = async (req, res) => {
  try {
    const data = req.body

    const passwordLength = 12;
    const randomPassword = generateRandomPassword(passwordLength);
    const salt = bcrypt.genSaltSync(5);
    data.password = randomPassword;
    const password = bcrypt.hashSync(data.password, salt);
    data.password = password

    const emailobj = {
      to: data.email,
      OTP: randomPassword,
      subject: "credientials for login for mediahouse User",
      first_name: data.first_name,
    }
    const locale = req.getLocale();



    // if (req.files) {
    //   if (req.files.profile_image) {
    //     var govt_id = await uploadFiletoAwsS3Bucket({
    //       fileData: req.files.profile_image,
    //       path: `public/mediahouseUser`,
    //     });
    //   }
    // }
    // data.profile_image = govt_id.fileName;

    const finduser = await User.findOne({ email: data.email })
    await db.updateItem(finduser._id, UserMediaHouse, data);
    await emailer.sendEmailforMediahousepassword(locale, emailobj);
    return res.json({
      code: 200,
      message: "Onboard process completed"
    })
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.checkImageExplicity = async (req, res) => {
  try {
    const data = req.body

    EdenSdk.auth('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzNkZTJhZDktMzJiNi00NjNjLWFhMDItMzQ1MjM5NGFhMTc1IiwidHlwZSI6ImFwaV90b2tlbiJ9.CPWqcIV2rStdtdhryNeAzGEZKpThETYESXNoLf3dE-I');
    EdenSdk.text_moderation_create({
      response_as_dict: true,
      attributes_as_list: false,
      show_original_response: false,
      providers: 'microsoft',
      language: 'en',
      text: data.description
    }).then((response) => {
      const item = response.data.microsoft.nsfw_likelihood
      if (item >= 3) {
        return res.status(404).send({ code: 404, error: { message: "Inappropriate Text" } })
      }
    })
      .catch(error => {

        utils.handleError(res, error)
      });

  } catch (error) {

    utils.handleError(res, error);
  }
}

exports.getTaskContentByHopper = async (req, res) => {
  try {
    const data = req.query
    const condition = {
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      is_rated: false,
      type: "content",
      hopper_id: data.hopper_id
    }


    const content = await HopperPayment.find(condition)
    const condition2 = {
      media_house_id: mongoose.Types.ObjectId(req.user._id),
      is_rated: false,
      type: "task_content",
      hopper_id: data.hopper_id
    }
    const task = await HopperPayment.find(condition2)
    res.json({
      code: 200,
      content: content,
      task: task
    })
  } catch (error) {
    utils.handleError(res, error);
  }
}

exports.createOnboard = async (req, res) => {
  try {
    const data = req.body;
    const response = await db.createItem(data, Onboard);
    res.json({
      code: 200,
      response
    })
  } catch (error) {
    utils.handleError(res, error);
  }
}


exports.getcreateOnboard = async (req, res) => {
  try {
    let status = await typeofDocs.aggregate([
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
    res.json({
      code: 200,
      response: status
    })
  } catch (error) {
    utils.handleError(res, error);
  }
}



exports.addUserBankDetails = async (req, res) => {
  try {
    const data = req.body;
    // data.user_id = req.user._id;
    // const addBank = await db.addUserBankDetails(Hopper, data);

    const token = await stripe.tokens.create({

      bank_account: {
        country: 'GB',
        currency: 'GBP',
        account_holder_name: data.holder_name,
        account_holder_type: 'individual',
        routing_number: data.routing_number,
        account_number: data.account_number,
      },

      // bank_account: {
      //   country: 'US',
      //   // currency: 'gbp',
      //   account_holder_name: data.acc_holder_name,
      //   account_holder_type: data.bank_name,
      //   routing_number: "110000000",
      //   account_holder_type: 'individual',
      //   account_number: data.acc_number,
      // },
    });

    const bankAccount = await stripe.accounts.createExternalAccount(
      req.user.stripe_account_id,
      {
        external_account: token.id,
      }
    );

    res.status(200).json({
      code: 200,
      bankDetailAdded: true,
    });
  } catch (error) {
    // 
    utils.handleError(res, error);
  }
};




exports.relatedContentfortask = async (req, res) => {
  try {
    // const data = req.query;
    const data = req.body;
    let content;
    // content = await Uploadcontent.find({
    //   // status: "published",
    //   hopper_id: { $ne: data.hopper_id },
    //   // tag_ids: { $in: data.tag_id },
    // })
    //   .populate("category_id tag_ids hopper_id avatar_id")
    //   .populate({ path: "hopper_id", populate: "avatar_id" }).sort({ createdAt: -1 });



    content = await Uploadcontent.aggregate([
      // {
      //   $match: { hopper_id: { $ne: mongoose.Types.ObjectId(data.hopper_id) } },
      // },
      {
        $match: { task_id: { $eq: mongoose.Types.ObjectId(data.content_id) } },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
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
        $lookup: {
          from: "avatars",
          let: { hopper_id: "$hopper_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                },
              },
            },
          ],
          as: "avatar_detals",
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { task_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                },
              },
            },
          ],
          as: "category_details",
        },
      },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$uploaded_content", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : 4
      }
    ]);


    let count = await Uploadcontent.aggregate([
      // {
      //   $match: { hopper_id: { $ne: mongoose.Types.ObjectId(data.hopper_id) } },
      // },
      {
        $match: { task_id: { $eq: mongoose.Types.ObjectId(data.content_id) } },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
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
        $lookup: {
          from: "avatars",
          let: { hopper_id: "$hopper_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                },
              },
            },
          ],
          as: "avatar_detals",
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { task_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                },
              },
            },
          ],
          as: "category_details",
        },
      },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$uploaded_content", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      // {
      //   $limit: data.limit ? parseInt(data.limit) : 4
      // }
    ]);


    res.json({
      code: 200,
      content,
      totalCount: count.length || 0
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.MoreContentfortask = async (req, res) => {
  try {
    // const data = req.query;
    const data = req.body;
    let content;
    // content = await Uploadcontent.find({
    //   // status: "published",
    //   hopper_id: data.hopper_id,
    // })
    //   .populate("category_id tag_ids hopper_id avatar_id")
    //   .populate({ path: "hopper_id", populate: "avatar_id" }).sort({ createdAt: -1 });

    content = await Uploadcontent.aggregate([
      {
        $match: { hopper_id: { $eq: mongoose.Types.ObjectId(data.hopper_id) }, task_id: { $ne: mongoose.Types.ObjectId(data.content_id) } },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
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
        $lookup: {
          from: "avatars",
          let: { hopper_id: "$hopper_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                },
              },
            },
          ],
          as: "avatar_detals",
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { task_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                },
              },
            },
          ],
          as: "category_details",
        },
      },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$uploaded_content", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : 4
      }
    ]);


    content = await Uploadcontent.aggregate([
      {
        $match: { hopper_id: { $eq: mongoose.Types.ObjectId(data.hopper_id) }, task_id: { $ne: mongoose.Types.ObjectId(data.content_id) } },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
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
        $lookup: {
          from: "avatars",
          let: { hopper_id: "$hopper_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id.avatar_id"] }],
                },
              },
            },
          ],
          as: "avatar_detals",
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { task_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$task_id.category_id"] }],
                },
              },
            },
          ],
          as: "category_details",
        },
      },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$uploaded_content", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      // {
      //   $limit: data.limit ? parseInt(data.limit) : 4
      // }
    ]);
    res.json({
      code: 200,
      content,
      totalCount: count.length || 0
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.recentactivityformediahouse = async (req, res) => {
  try {
    const data = req.body;
    let response;
    data.user_id = req.user._id
    let findcontent
    if (data.content_id) {

      findcontent = await Contents.findOne({ _id: mongoose.Types.ObjectId(data.content_id) })
      data.type = findcontent.type
      data.category = findcontent.category_id
      await Contents.updateOne(
        { _id: mongoose.Types.ObjectId(data.content_id) },
        { $inc: { content_view_count_by_marketplace_for_app: 1 } }
      )


      const added = await Contents.findOne(
        { _id: mongoose.Types.ObjectId(data.content_id) }
      )


      const obj = {
        content_id: added._id,
        message_type: "count_with_views",
        content_view_count_by_marketplace_for_app: added.content_view_count_by_marketplace_for_app,
        purchased_mediahouse: added.purchased_mediahouse.length
      }
      io.to(data.content_id).emit("chat messages", obj)
    }

    const recentActivity = await getItemCustom(recentactivity, data)
    if (recentActivity.data) {

      recentActivity.data.updatedAt = new Date();

      await recentActivity.data.save();
      response = 'updated'
    } else {

      response = await db.createItem(data, recentactivity);
    }
    res.json({ code: 200, data: response });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.lastmessege = async (req, res) => {
  try {
    const data = req.body;
    let response
    data.mediahouse_id = req.user._id
    response = await db.createItem(data, lastmesseage);
    res.json({ code: 200, data: response });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.uploadedcontenyinContentscreen = async (req, res) => {
  try {
    const data = req.body;

    const todayhoppers = await Uploadcontent.aggregate([
      {
        $group: {
          _id: "$hopper_id",
          data: { $push: "$$ROOT" },
        },
      },

      {
        $lookup: {
          from: "users",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                let: { avatar_id: "$avatar_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$avatar_id"] },
                    },
                  },
                ],
                as: "avatar_details",
              },
            },
          ],
          as: "hopper_ids",
        },
      },

      {
        $unwind: "$hopper_ids",
      },

      // { $sort: sort },
    ]);


    res.json({ code: 200, data: todayhoppers });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.internalGroupChatMH = async (req, res) => {
  try {
    const data = req.body;

    let response;

    if (data.type == 'add') {

      if (!data.room_id) {

        data.room_id = uuid.v4();
        await createItem(MhInternalGroups, {
          content_id: data.content_id,
          admin_id: req.user._id,
          user_id: req.user._id,
          room_id: data.room_id,
          admin: true
        })
        for (let user of data.users) {
          const userInfo = await User.findById(user)
          data.user_id = user
          data.admin_id = req.user._id
          response = await createItem(MhInternalGroups, data);

          data.addedMsg = `${userInfo.first_name ? userInfo.first_name : userInfo.user_first_name} ${userInfo.last_name ? userInfo.last_name : userInfo.user_last_name}`
          await createItem(Chat, data)
        }
        data.sender_id = req.user._id;
        data.message = 'You have been added for the conversation'
        await createItem(Chat, data)
      }
      else {

        for (let user of data.users) {
          const checkAlreadyAdded = await MhInternalGroups.findOne({ user_id: user, admin_id: req.user._id, content_id: data.content_id, room_id: data.room_id })
          if (checkAlreadyAdded) {
            throw utils.buildErrObject(422, "users already added");
          }
          else {
            const userInfo = await User.findById(user)

            data.user_id = user
            data.admin_id = req.user._id
            response = await createItem(MhInternalGroups, data);

            data.sender_id = req.user._id;
            data.addedMsg = `${userInfo.first_name} ${userInfo.last_name}`
            await createItem(Chat, data)
          }
        }
      }
    }
    // }

    else if (data.type == 'is_group_exists') {

      var my_groups = await MhInternalGroups.aggregate([
        {
          $match:
          {
            admin_id: await getUserMediaHouseId(req.user._id),//mongoose.Types.ObjectId(req.user._id)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "admin_id",
            foreignField: "_id",
            as: "admin_id"
          }
        },
        {
          $unwind: {
            path: "$admin_id",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_details"
          }
        },
        {
          $unwind: {
            path: "$user_details",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "chats",
            localField: "room_id",
            foreignField: "room_id",
            as: "chats"
          }
        },
        {
          $lookup: {
            from: 'mh_internal_groups',
            let: {
              room_id: "$room_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ['$room_id', '$$room_id']

                    },
                    {
                      $eq: ['$is_seen', false]

                    }
                    ]
                  }
                }
              },
            ],
            as: "datofUnreadmessege"
          }
        },
        {
          $addFields: {
            sizeofunreadmessege: { $size: "$datofUnreadmessege" }
          }
        },
        {
          $lookup: {
            from: 'lastchats',
            let: {
              room_id: "$room_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$room_id', '$$room_id']
                  }
                }
              },
              {
                $sort: {
                  createdAt: -1
                }
              },
              { $limit: 1 }
            ],
            as: "latest_messege"
          }
        },
        /* {
          $sort:{
            createdAt:-1
          }
        }, */
        {
          $group: {
            _id: "$room_id",
            admin_id: { $first: '$admin_id._id' },
            first_name: { $first: '$admin_id.first_name' },
            last_name: { $first: '$admin_id.last_name' },
            full_name: { $first: '$admin_id.full_name' },
            profile_image: { $first: '$admin_id.profile_image' },
            content_id: { $first: '$content_id' },
            user_details: { $push: '$user_details' },
            latestCreatedAt: { $max: '$chats.message' },
            latest_messege: { $first: '$latest_messege' },
            createdAt: { $first: '$createdAt' },
            datofUnreadmessege: { $first: '$sizeofunreadmessege' }
          }
        },
        {
          $project: {
            _id: 0,
            room_id: '$_id',
            admin_id: 1,
            first_name: 1,
            last_name: 1,
            full_name: 1,
            content_id: 1,
            profile_image: 1,
            user_details: 1,
            latestCreatedAt: 1,
            createdAt: 1,
            latest_messege: 1,
            datofUnreadmessege: 1
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
      ])

      var other_user_groups = await MhInternalGroups.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  user_id: await getUserMediaHouseId(req.user._id),// mongoose.Types.ObjectId(req.user._id)
                },
                {
                  admin_id: { $ne: await getUserMediaHouseId(req.user._id) }, //mongoose.Types.ObjectId(req.user._id) }
                }
              ]
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_details"
            }
          },
          {
            $unwind: {
              path: "$admin_details",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "chats",
              localField: "room_id",
              foreignField: "room_id",
              as: "chats"
            }
          },
          {
            $lookup: {
              from: 'mh_internal_groups',
              let: {
                room_id: "$room_id", user_id: await getUserMediaHouseId(req.user._id)
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{
                        $eq: ['$room_id', '$$room_id']

                      },
                      {
                        $eq: ['$user_id', '$$user_id']

                      },
                      {
                        $eq: ['$is_seen', false]

                      }
                      ]
                    }
                  }
                },
              ],
              as: "datofUnreadmessege"
            }
          },
          {
            $addFields: {
              sizeofunreadmessege: { $size: "$datofUnreadmessege" }
            }
          },
          {
            $lookup: {
              from: 'lastchats',
              let: {
                room_id: "$room_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$room_id', '$$room_id']
                    }
                  }
                },
                {
                  $sort: {
                    createdAt: -1
                  }
                },
                { $limit: 1 }
              ],
              as: "latest_messege"
            }
          },
          {
            $project: {
              // _id: 1
              // room_id: '$_id',
              first_name: "$admin_details.first_name",
              last_name: "$admin_details.last_name",
              profile_image: "$admin_details.profile_image",
              content_id: 1,
              room_id: 1,
              latestCreatedAt: { $max: '$chats.message' },
              createdAt: 1,
              datofUnreadmessege: '$sizeofunreadmessege',
              latest_messege: '$latest_messege'
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          }
        ]
      )
      response = [...my_groups, ...other_user_groups];
      // 
    }
    res.json({ code: 200, data: response });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.deleteinternalGroupChatMH = async (req, res) => {
  try {
    const data = req.body;

    let response;




    if (data.type == 'remove') {

      // if (!data.room_id) {

      // data.room_id = uuid.v4();
      for (let user of data.users) {
        const userInfo = await User.findById(user)
        data.user_id = mongoose.Types.ObjectId(user)
        data.admin_id = req.user._id
        await MhInternalGroups.deleteMany({ admin_id: mongoose.Types.ObjectId(req.user._id), user_id: data.user_id, room_id: data.room_id })
        // response = await createItem(MhInternalGroups, data);

        data.addedMsg = `${userInfo.first_name ? userInfo.first_name : userInfo.user_first_name} ${userInfo.last_name ? userInfo.last_name : userInfo.user_last_name}`
        data.sender_id = req.user._id;
        response = await createItem(Chat, data)
      }
      // data.sender_id = req.user._id;
      // data.message = 'You have been removed from the conversation'
      // await createItem(Chat, data)
    }
    // else {

    //     for (let user of data.users) {
    //       const checkAlreadyAdded = await MhInternalGroups.findOne({ user_id: user, admin_id: req.user._id, content_id: data.content_id, room_id: data.room_id })
    //       if (checkAlreadyAdded) {
    //         throw utils.buildErrObject(422, "users already added");
    //       }
    //       else {
    //         const userInfo = await User.findById(user)

    //         data.user_id = user
    //         data.admin_id = req.user._id
    //         response = await createItem(MhInternalGroups, data);

    //         data.sender_id = req.user._id;
    //         data.addedMsg = `${userInfo.first_name} ${userInfo.last_name}`
    //         await createItem(Chat, data)
    //       }
    //     }
    //   }
    // }
    // }


    res.json({ code: 200, data: response });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.presshopGroupChatMH = async (req, res) => {
  try {
    const data = req.body;

    let response;

    if (data.type == 'add') {
      const findadminlist = await Employee.find({})
      if (!data.room_id) {
        for (const user of findadminlist) {


          const checkAlreadyAdded = await MhInternalGroups.findOne({ user_id: user._id, admin_id: req.user._id, content_id: data.content_id, })
          if (checkAlreadyAdded) {
            return res.json({ data: checkAlreadyAdded })
          } else {



            data.room_id = uuid.v4();
            await createItem(MhInternalGroups, {
              content_id: data.content_id,
              admin_id: req.user._id,
              user_id: req.user._id,
              room_id: data.room_id,
              admin: true
            })
            for (let user of findadminlist) {
              const userInfo = await User.findById(user)
              data.user_id = user._id
              data.admin_id = req.user._id
              response = await createItem(MhInternalGroups, data);

              // data.addedMsg = `${userInfo.first_name} ${userInfo.last_name}`
              await createItem(Chat, data)
            }
            data.sender_id = req.user._id;
            data.message = 'You have been added for the conversation'
            await createItem(Chat, data)
          }
        }
      }
      else {

        const findadminlist = await Employee.find({})
        for (let user of findadminlist) {
          const checkAlreadyAdded = await MhInternalGroups.findOne({ user_id: user._id, admin_id: req.user._id, content_id: data.content_id, room_id: data.room_id })
          if (checkAlreadyAdded) {
            throw utils.buildErrObject(422, "users already added");
          }
          else {
            const userInfo = await User.findById(user)

            data.user_id = user
            data.admin_id = req.user._id
            response = await createItem(MhInternalGroups, data);

            data.sender_id = req.user._id;
            data.addedMsg = `${userInfo.first_name} ${userInfo.last_name}`
            await createItem(Chat, data)
          }
        }
      }
    }
    // }

    else if (data.type == 'is_group_exists') {

      var my_groups = await MhInternalGroups.aggregate([
        {
          $match:
          {
            admin_id: mongoose.Types.ObjectId(req.user._id)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "admin_id",
            foreignField: "_id",
            as: "admin_id"
          }
        },
        {
          $unwind: {
            path: "$admin_id",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user_details"
          }
        },
        {
          $unwind: {
            path: "$user_details",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "chats",
            localField: "room_id",
            foreignField: "room_id",
            as: "chats"
          }
        },
        {
          $lookup: {
            from: 'mh_internal_groups',
            let: {
              room_id: "$room_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{
                      $eq: ['$room_id', '$$room_id']

                    },
                    {
                      $eq: ['$is_seen', false]

                    }
                    ]
                  }
                }
              },
            ],
            as: "datofUnreadmessege"
          }
        },
        {
          $addFields: {
            sizeofunreadmessege: { $size: "$datofUnreadmessege" }
          }
        },
        {
          $lookup: {
            from: 'lastchats',
            let: {
              room_id: "$room_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$room_id', '$$room_id']
                  }
                }
              },
              {
                $sort: {
                  createdAt: -1
                }
              },
              { $limit: 1 }
            ],
            as: "latest_messege"
          }
        },
        /* {
          $sort:{
            createdAt:-1
          }
        }, */
        {
          $group: {
            _id: "$room_id",
            admin_id: { $first: '$admin_id._id' },
            first_name: { $first: '$admin_id.first_name' },
            last_name: { $first: '$admin_id.last_name' },
            full_name: { $first: '$admin_id.full_name' },
            profile_image: { $first: '$admin_id.profile_image' },
            content_id: { $first: '$content_id' },
            user_details: { $push: '$user_details' },
            latestCreatedAt: { $max: '$chats.message' },
            latest_messege: { $first: '$latest_messege' },
            createdAt: { $first: '$createdAt' },
            datofUnreadmessege: { $first: '$sizeofunreadmessege' }
          }
        },
        {
          $project: {
            _id: 0,
            room_id: '$_id',
            admin_id: 1,
            first_name: 1,
            last_name: 1,
            full_name: 1,
            content_id: 1,
            profile_image: 1,
            user_details: 1,
            latestCreatedAt: 1,
            createdAt: 1,
            latest_messege: 1,
            datofUnreadmessege: 1
          }
        },
        {
          $sort: {
            createdAt: -1
          }
        },
      ])

      var other_user_groups = await MhInternalGroups.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  user_id: mongoose.Types.ObjectId(req.user._id)
                },
                {
                  admin_id: { $ne: mongoose.Types.ObjectId(req.user._id) }
                }
              ]
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "admin_id",
              foreignField: "_id",
              as: "admin_details"
            }
          },
          {
            $unwind: {
              path: "$admin_details",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "chats",
              localField: "room_id",
              foreignField: "room_id",
              as: "chats"
            }
          },
          {
            $lookup: {
              from: 'mh_internal_groups',
              let: {
                room_id: "$room_id", user_id: mongoose.Types.ObjectId(req.user._id)
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: ['$room_id', '$$room_id']

                        },
                        {
                          $eq: ['$user_id', '$$user_id']

                        },
                        {
                          $eq: ['$is_seen', false]

                        }
                      ]
                    }
                  }
                },
              ],
              as: "datofUnreadmessege"
            }
          },
          {
            $addFields: {
              sizeofunreadmessege: { $size: "$datofUnreadmessege" }
            }
          },
          {
            $lookup: {
              from: 'lastchats',
              let: {
                room_id: "$room_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$room_id', '$$room_id']
                    }
                  }
                },
                {
                  $sort: {
                    createdAt: -1
                  }
                },
                { $limit: 1 }
              ],
              as: "latest_messege"
            }
          },
          {
            $project: {
              // _id: 1
              // room_id: '$_id',
              first_name: "$admin_details.first_name",
              last_name: "$admin_details.last_name",
              profile_image: "$admin_details.profile_image",
              content_id: 1,
              room_id: 1,
              latestCreatedAt: { $max: '$chats.message' },
              createdAt: 1,
              datofUnreadmessege: '$sizeofunreadmessege',
              latest_messege: '$latest_messege'
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          }
        ]
      )
      response = [...my_groups, ...other_user_groups];
      // 
    }
    res.json({ code: 200, data: response });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.updateseenforInternalchat = async (req, res) => {
  try {
    const data = req.body;

    data.media_house_id = req.user._id;
    // data.content_id = data.id;

    const updateforuser = await MhInternalGroups.updateMany({
      room_id: data.room_id
      // $or: [
      //   {
      //     $and: [
      //       {
      //         room_id: data.room_id,
      //       },
      //       {
      //         user_id: data.user_id,
      //       },
      //     ],
      //   },
      //   {
      //     $and: [
      //       {
      //         user_id: data.user_id,
      //       },
      //       {
      //         admin_id: data.media_house_id,
      //       },
      //     ],
      //   },
      // ],
    }, { is_seen: true })
    // await db.updateItem(data.id, MhInternalGroups, {
    //   sale_status: "sold",
    //   paid_status: data.paid_status,
    //   amount_paid: data.amount,
    //   purchased_publication: data.media_house_id,
    // });
    // const payment = await db.createItem(data, HopperPayment);
    res.json({
      code: 200,
      data: updateforuser,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.getunreadmessagebyid = async (req, res) => {
  try {
    const data = req.body;

    data.media_house_id = req.user._id;
    // data.content_id = data.id;

    const updateforuser = await MhInternalGroups.find({ user_id: data.media_house_id, is_seen: false, room })
    // await db.updateItem(data.id, MhInternalGroups, {
    //   sale_status: "sold",
    //   paid_status: data.paid_status,
    //   amount_paid: data.amount,
    //   purchased_publication: data.media_house_id,
    // });
    // const payment = await db.createItem(data, HopperPayment);
    res.json({
      code: 200,
      data: updateforuser,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};
exports.openChatsMH = async (req, res) => {
  try {
    const population = {
      path: 'sender_id',
      select: 'full_name first_name last_name profile_image',
    }
    const filter = { room_id: req.query.room_id }
    const admin_user = await MhInternalGroups.findOne({ admin_id: req.user._id });
    if (admin_user) filter.message = { $ne: "You have been added for the conversation" }

    res.json({
      code: 200,
      response: await getItemsCustom
        (
          Chat,
          filter,
          'sender_id message room_id type user_info addedMsg createdAt',
          population,
          { createdAt: 1 }
        )
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};


exports.openContentMH = async (req, res) => {
  try {
    const response = await Contents.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.query.content_id)
        }
      },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$hopper_id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                localField: 'avatar_id',
                foreignField: '_id',
                as: "avatar_details"
              }
            }
          ],
          as: "hopper_details",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      },
      {
        $lookup: {
          from: "tags",
          localField: "tag_ids",
          foreignField: "_id",
          as: "tag_ids"
        }
      },
      /* {
        $unwind:{
          path:"$hopper_details",
          preserveNullAndEmptyArrays:true
        }
      } */
    ])

    res.json({
      code: 200,
      response
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.openContentMH2 = async (req, res) => {
  try {
    const response = await Contents.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.query.content_id)
        }
      },
      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$hopper_id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                localField: 'avatar_id',
                foreignField: '_id',
                as: "avatar_details"
              }
            },
            {
              $unwind: {
                path: "$avatar_details",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                avatar: "$avatar_details.avatar",
                first_name: 1,
                last_name: 1,
              }
            }

          ],
          as: "hopper_details",
        },
      },
      {
        $unwind: {
          path: "$hopper_details",
          preserveNullAndEmptyArrays: true
        }
      }
    ])

    res.json({
      code: 200,
      response
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.internalGroupMembers = async (req, res) => {
  try {
    res.json({
      code: 200,
      response: await getItemCustom(MhInternalGroups, { admin_id: req.user._id })
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.addTrendingSearch = async (req, res) => {
  try {
    const data = {
      tag_id: req.body.tag_id,
      mediahouse_id: req.user._id,
      tagName: req.body.tagName
    }

    const response = await db.createItem(data, trendingSearch);
    res.json({ code: 200, data: response });
  }
  catch (error) {
    utils.handleError(res, err);
  }
}

exports.getTrendingSearch = async (req, res) => {
  try {
    const response = await trendingSearch.aggregate([
      {
        $group: {
          _id: '$tagName',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          tagName: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json({ code: 200, data: response });
  }
  catch (error) {
    utils.handleError(res, err);
  }
}

exports.getContentByTrendingSearch = async (req, res) => {
  try {
    const data = req.query;
    const condition = {};
    condition.tag_ids = { $in: data.name };
    const content = await Contents.find(condition).populate("category_id tag_ids hopper_id avatar_id").populate({ path: "hopper_id", populate: "avatar_id" })
    res.json({ code: 200, data: content });
  }
  catch (err) {
    utils.handleError(res, err);
  }
}



exports.addemail = async (req, res) => {
  try {
    const data = req.body
    // {
    //   tag_id: req.body.tag_id,
    //   mediahouse_id: req.user._id,
    //   tagName: req.body.tagName
    // }

    const response = await db.createItem(data, addEmailRecord);
    res.json({ code: 200, data: response });
  }
  catch (error) {
    utils.handleError(res, err);
  }
}
exports.checkcompanyvalidation = async (req, res) => {
  try {


    const data = req.body;
    const checkValueExist = await User.findOne(({
      [req.body.key]: req.body.value
    }))

    if (checkValueExist) {

      res.status(200).json({ code: 200, data: "Data exist" });
    }
    else {
      res.status(400).json({ code: 400, data: "no data exist" });

    }


  }
  catch (error) {
    utils.handleError(res, err);
  }
}




exports.NewContentReportSplit = async (req, res) => {
  try {
    const data = req.query;
    let task;

    // const condition = {
    //   purchased_publication: mongoose.Types.ObjectId(req.user._id),
    // };
    const exclusivecondition = {
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
          purchased_content_type: "exclusive"
        }
      }
    }

    const Sharedcondition = {
      "Vat": {
        $elemMatch: {
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id),
          purchased_content_type: "shared"
        }
      }
    }
    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("Weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("Monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("Yearly")) {
      val = "year";
    }

    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());


    if (data.startDate && data.endDate) {
      // condition = {
      //   createdAt: {
      //     $gte: new Date(data.startDate),
      //     $lte: new Date(data.endDate),
      //   },
      // };

      exclusivecondition.createdAt = {
        $lte: new Date(data.endDate),
        $gte: new Date(data.startDate),
      };
      Sharedcondition.createdAt = {
        $lte: new Date(data.endDate),
        $gte: new Date(data.startDate),
      };
    } else {
      exclusivecondition.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      };
      Sharedcondition.createdAt = {
        $lte: yesterdayEnd,
        $gte: yesterdayStart,
      };
    }

    const exclusive = await Contents.countDocuments(exclusivecondition)
    const shared = await Contents.countDocuments(Sharedcondition)
    // .select({ _id: 1, category_id: 1 })
    // .populate({ path: "category_id" });

    // let shared = 0,
    //   exclusive = 0,
    //   others = 0;

    // for (let i = 0; i < task.length; i++) {
    //   if (task[i].type == "shared") {
    //     shared++;
    //   } else if (task[i].type == "exclusive") {
    //     exclusive++;
    //   } else {
    //     others++;
    //   }
    // }

    res.json({
      code: 200,
      data: {
        // data: getcontentonline1,
        shared: shared,
        exclusive: exclusive,
        // others: others,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.NewTaskreportgraphoftask = async (req, res) => {
  try {
    const data = req.query;


    const aggregation = [
      {
        $match: {
          mediahouse_id: mongoose.Types.ObjectId(req.user._id),
          status: "published",
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const result = await BroadCastTask.aggregate(aggregation);

    const monthlyCounts = {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      june: 0,
      july: 0,
      aug: 0,
      sept: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    };


    result.forEach((item) => {
      switch (item._id) {
        case 1:
          monthlyCounts.jan = item.count;
          break;
        case 2:
          monthlyCounts.feb = item.count;
          break;
        case 3:
          monthlyCounts.mar = item.count;
          break;
        case 4:
          monthlyCounts.apr = item.count;
          break;
        case 5:
          monthlyCounts.may = item.count;
          break;
        case 6:
          monthlyCounts.june = item.count;
          break;
        case 7:
          monthlyCounts.july = item.count;
          break;
        case 8:
          monthlyCounts.aug = item.count;
          break;
        case 9:
          monthlyCounts.sept = item.count;
          break;
        case 10:
          monthlyCounts.oct = item.count;
          break;
        case 11:
          monthlyCounts.nov = item.count;
          break;
        case 12:
          monthlyCounts.dec = item.count;
          break;
      }
    });


    // const createMonthlyFilter = (monthStart, monthEnd) => ({
    //   mediahouse_id: mongoose.Types.ObjectId(req.user._id),
    //   status: "published",
    //   createdAt: {
    //     $gte: moment().utc().startOf('year').add(monthStart, 'months').toDate(),
    //     $lt: moment().utc().startOf('year').add(monthEnd, 'months').toDate()
    //   }
    // });

    // // Filters for each month
    // const janFilter = createMonthlyFilter(0, 1);
    // const febFilter = createMonthlyFilter(1, 2);
    // const marFilter = createMonthlyFilter(2, 3);
    // const aprFilter = createMonthlyFilter(3, 4);
    // const mayFilter = createMonthlyFilter(4, 5);
    // const juneFilter = createMonthlyFilter(5, 6);
    // const julyFilter = createMonthlyFilter(6, 7);
    // const augFilter = createMonthlyFilter(7, 8);
    // const septFilter = createMonthlyFilter(8, 9);
    // const octFilter = createMonthlyFilter(9, 10);
    // const novFilter = createMonthlyFilter(10, 11);
    // const decFilter = createMonthlyFilter(11, 12);

    // // Counts for each month
    // const janCount = await BroadCastTask.countDocuments(janFilter);
    // const febCount = await BroadCastTask.countDocuments(febFilter);
    // const marCount = await BroadCastTask.countDocuments(marFilter);
    // const aprCount = await BroadCastTask.countDocuments(aprFilter);
    // const mayCount = await BroadCastTask.countDocuments(mayFilter);
    // const juneCount = await BroadCastTask.countDocuments(juneFilter);
    // const julyCount = await BroadCastTask.countDocuments(julyFilter);
    // const augCount = await BroadCastTask.countDocuments(augFilter);
    // const septCount = await BroadCastTask.countDocuments(septFilter);
    // const octCount = await BroadCastTask.countDocuments(octFilter);
    // const novCount = await BroadCastTask.countDocuments(novFilter);
    // const decCount = await BroadCastTask.countDocuments(decFilter);

    res.json({
      code: 200,
      data: monthlyCounts,
      // januaryCount: janCount,
      // februaryCount: febCount,
      // marchCount: marCount,
      // aprilCount: aprCount,
      // mayCount: mayCount,
      // juneCount: juneCount,
      // julyCount: julyCount,
      // augustCount: augCount,
      // septemberCount: septCount,
      // octoberCount: octCount,
      // novemberCount: novCount,
      // decemberCount: decCount,
    });


  } catch (err) {
    utils.handleError(res, err);
  }
};



// exports.reportContentCategoryPeriodWise = async (req, res) => {
//   try {
//     // const data = req.body;

//     const data = req.query;
//     let task;
//     let condition;
//     let val = "year";
//     if (data.hasOwnProperty("daily")) {
//       val = "day";
//     }
//     if (data.hasOwnProperty("weekly")) {
//       val = "week";
//     }

//     if (data.hasOwnProperty("monthly")) {
//       val = "month";
//     }

//     if (data.hasOwnProperty("yearly")) {
//       val = "year";
//     }



//     const yesterdayStart = new Date(moment().utc().startOf(val).format());
//     const yesterdayEnd = new Date(moment().utc().endOf(val).format());

//     // condition = {
//     //   // paid_status: "un_paid",
//     //   media_house_id: mongoose.Types.ObjectId(req.user._id),
//     //   type: "content",
//     //   createdAt: {
//     //     $lte: yesterdayEnd,
//     //     $gte: yesterdayStart,
//     //   },
//     // };



//     if (data.startDate && data.endDate) {
//       condition = {
//         // paid_status: "paid",
//         // status: "published",
//         type: "content",
//         media_house_id: mongoose.Types.ObjectId(req.user._id),
//         createdAt: {
//           $gte: new Date(data.startDate),
//           $lte: new Date(data.endDate),
//         },
//       };
//     } else if (data.daily || data.yearly || data.monthly || data.weekly) {
//       condition = {
//         // paid_status: "un_paid",
//         type: "content",
//         media_house_id: mongoose.Types.ObjectId(req.user._id),
//         // status: "published",
//         createdAt: {
//           $lte: yesterdayEnd,
//           $gte: yesterdayStart,
//         },
//       };
//     } else {
//       condition = {
//         // paid_status: "paid",
//         // status: "published",
//         //
//         type: "content",
//         media_house_id: mongoose.Types.ObjectId(req.user._id),
//         // purchased_mediahouse:{$in:mongoose.Types.ObjectId(req.user._id)},
//         // createdAt: {
//         //   $lte: yesterdayEnd,
//         //   $gte: yesterdayStart,
//         // },
//       };
//     }




//     const result = await HopperPayment.aggregate([
//       {
//         $match: condition,
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" },
//           },
//           total_price: { $sum: "$amount" },
//           total_vat: { $sum: "$Vat" },
//           data: { $push: "$$ROOT" },
//         },
//       },
//       {
//         $unwind: "$data",
//       },
//       {
//         $lookup: {
//           from: "contents",
//           localField: "data.content_id",
//           foreignField: "_id",
//           as: "content",
//         },
//       },
//       {
//         $unwind: "$content",
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "content.category_id",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       {
//         $unwind: "$category",
//       },
//       {
//         $group: {
//           _id: {
//             month: "$_id.month",
//             year: "$_id.year",
//             category: "$category.name",
//           },
//           total_price: { $sum: "$total_price" },
//           total_vat: { $sum: "$total_vat" },
//           content_count: { $sum: 1 },
//         },
//       },
//       {
//         $group: {
//           _id: {
//             month: "$_id.month",
//             year: "$_id.year",
//           },
//           total_price: { $first: "$total_price" },
//           total_vat: { $first: "$total_vat" },
//           categories: {
//             $push: {
//               category_id: "$_id.category",
//               content_count: "$content_count",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           month: "$_id.month",
//           year: "$_id.year",
//           total_price: 1,
//           total_vat: 1,
//           categories: 1,
//         },
//       },
//       // {
//       //   $sort: { year: 1, month: 1 },
//       // },
//     ]);
//     // const hopperUsedTaskss = await db.getItems(HopperPayment, condition);

//     // let sumByMonth = {
//     //   0: 0, // January
//     //   1: 0, // February
//     //   2: 0, // March
//     //   3: 0, // April
//     //   4: 0, // May
//     //   5: 0, // June
//     //   6: 0, // July
//     //   7: 0, // August
//     //   8: 0, // September
//     //   9: 0, // October
//     //   10: 0, // November
//     //   11: 0, // December
//     // };
//     // result.forEach((item) => {
//     //   switch (item._id) {
//     //     case 1:
//     //       monthlyCounts.jan = item.count;
//     //       break;
//     //     case 2:
//     //       monthlyCounts.feb = item.count;
//     //       break;
//     //     case 3:
//     //       monthlyCounts.mar = item.count;
//     //       break;
//     //     case 4:
//     //       monthlyCounts.apr = item.count;
//     //       break;
//     //     case 5:
//     //       monthlyCounts.may = item.count;
//     //       break;
//     //     case 6:
//     //       monthlyCounts.june = item.count;
//     //       break;
//     //     case 7:
//     //       monthlyCounts.july = item.count;
//     //       break;
//     //     case 8:
//     //       monthlyCounts.aug = item.count;
//     //       break;
//     //     case 9:
//     //       monthlyCounts.sept = item.count;
//     //       break;
//     //     case 10:
//     //       monthlyCounts.oct = item.count;
//     //       break;
//     //     case 11:
//     //       monthlyCounts.nov = item.count;
//     //       break;
//     //     case 12:
//     //       monthlyCounts.dec = item.count;
//     //       break;
//     //   }
//     // });

//     res.json({
//       code: 200,

//       result
//       // data: {
//       //   jan,
//       //   feb,
//       //   mar,
//       //   apr,
//       //   may,
//       //   june,
//       //   july,
//       //   aug,
//       //   sept,
//       //   oct,
//       //   nov,
//       //   dec,
//       // },
//     });
//   } catch (err) {
//     utils.handleError(res, err);
//   }
// };


exports.reportContentCategoryPeriodWise = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;
    let condition;
    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }



    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    // condition = {
    //   // paid_status: "un_paid",
    //   media_house_id: mongoose.Types.ObjectId(req.user._id),
    //   type: "content",
    //   createdAt: {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart,
    //   },
    // };



    if (data.startDate && data.endDate) {
      condition = {
        // paid_status: "paid",
        // status: "published",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      condition = {
        // paid_status: "un_paid",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // status: "published",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      condition = {
        // paid_status: "paid",
        // status: "published",
        //
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // purchased_mediahouse:{$in:mongoose.Types.ObjectId(req.user._id)},
        // createdAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }




    const result = await HopperPayment.aggregate([
      {
        $match: condition,
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $unwind: "$data",
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category",
              }
            },
            {
              $unwind: { path: "$category", preserveNullAndEmptyArrays: false }
            },
          ]
        },
      },
      {
        $unwind: { path: "$content", preserveNullAndEmptyArrays: false },
      },
      {
        $sort: {
          "content.published_time_date": -1
        }
      },
      // {
      //   $lookup: {
      //     from: "categories",
      //     localField: "content.category_id",
      //     foreignField: "_id",
      //     as: "category",
      //   },
      // },
      // {
      //   $unwind: {path:"$category",preserveNullAndEmptyArrays:true}
      // },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
            category: "$content.category.name",
          },
          total_price: { $sum: "$total_price" },
          total_vat: { $sum: "$total_vat" },
          content: { $push: "$content" },
          content_count: { $sum: 1 },
        },
      },
      {
        $unwind: { path: "$content", preserveNullAndEmptyArrays: false },

      },
      {
        $sort: {
          "content.published_time_date": -1
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          category: { $push: "$_id.category" },
          total_price: { $first: "$total_price" },
          total_vat: { $first: "$total_vat" },
          content: { $push: "$content" },
          categories: {
            $push: {
              category_id: "$_id.category",
              content_count: "$content_count",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          month: "$_id.month",
          year: "$_id.year",
          content: 1,
          total_price: 1,
          total_vat: 1,
          category: 1,
          categories: 1,
          content_count: 1
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);
    // const hopperUsedTaskss = await db.getItems(HopperPayment, condition);

    // let sumByMonth = {
    //   0: 0, // January
    //   1: 0, // February
    //   2: 0, // March
    //   3: 0, // April
    //   4: 0, // May
    //   5: 0, // June
    //   6: 0, // July
    //   7: 0, // August
    //   8: 0, // September
    //   9: 0, // October
    //   10: 0, // November
    //   11: 0, // December
    // };
    // result.forEach((item) => {
    //   switch (item._id) {
    //     case 1:
    //       monthlyCounts.jan = item.count;
    //       break;
    //     case 2:
    //       monthlyCounts.feb = item.count;
    //       break;
    //     case 3:
    //       monthlyCounts.mar = item.count;
    //       break;
    //     case 4:
    //       monthlyCounts.apr = item.count;
    //       break;
    //     case 5:
    //       monthlyCounts.may = item.count;
    //       break;
    //     case 6:
    //       monthlyCounts.june = item.count;
    //       break;
    //     case 7:
    //       monthlyCounts.july = item.count;
    //       break;
    //     case 8:
    //       monthlyCounts.aug = item.count;
    //       break;
    //     case 9:
    //       monthlyCounts.sept = item.count;
    //       break;
    //     case 10:
    //       monthlyCounts.oct = item.count;
    //       break;
    //     case 11:
    //       monthlyCounts.nov = item.count;
    //       break;
    //     case 12:
    //       monthlyCounts.dec = item.count;
    //       break;
    //   }
    // });

    res.json({
      code: 200,

      result
      // data: {
      //   jan,
      //   feb,
      //   mar,
      //   apr,
      //   may,
      //   june,
      //   july,
      //   aug,
      //   sept,
      //   oct,
      //   nov,
      //   dec,
      // },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.reportContentTypePeriodWise = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.query;
    let task;
    let condition;
    let val = "year";
    if (data.hasOwnProperty("daily")) {
      val = "day";
    }
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year";
    }



    const yesterdayStart = new Date(moment().utc().startOf(val).format());
    const yesterdayEnd = new Date(moment().utc().endOf(val).format());

    // condition = {
    //   // paid_status: "un_paid",
    //   media_house_id: mongoose.Types.ObjectId(req.user._id),
    //   type: "content",
    //   createdAt: {
    //     $lte: yesterdayEnd,
    //     $gte: yesterdayStart,
    //   },
    // };



    if (data.startDate && data.endDate) {
      condition = {
        // paid_status: "paid",
        // status: "published",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        createdAt: {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        },
      };
    } else if (data.daily || data.yearly || data.monthly || data.weekly) {
      condition = {
        // paid_status: "un_paid",
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // status: "published",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else {
      condition = {
        // paid_status: "paid",
        // status: "published",
        //
        type: "content",
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        // purchased_mediahouse:{$in:mongoose.Types.ObjectId(req.user._id)},
        // createdAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }




    const result = await HopperPayment.aggregate([
      {
        $match: condition,
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total_price: { $sum: "$amount" },
          total_vat: { $sum: "$Vat" },
          data: { $push: "$$ROOT" },
        },
      },
      {
        $unwind: "$data",
      },
      {
        $lookup: {
          from: "contents",
          localField: "data.content_id",
          foreignField: "_id",
          as: "content",
        },
      },
      {
        $unwind: "$content",
      },

      {
        $addFields: {
          image_count: { $sum: "$data.image_count" },
          video_count: { $sum: "$data.video_count" },
          audio_count: { $sum: "$data.audio_count" },
          other_count: { $sum: "$data.other_count" },
        }
      },
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          total_price: { $sum: "$total_price" },
          total_vat: { $sum: "$total_vat" },
          content: { $push: "$content" },
          image_count: { $sum: "$image_count" },
          video_count: { $sum: "$video_count" },
          audio_count: { $sum: "$audio_count" },
          other_count: { $sum: "$other_count" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          content: 1,
          image_count: 1,
          video_count: 1,
          audio_count: 1,
          other_count: 1,
          total_price: 1,
          total_vat: 1,
          categories: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);
    // const hopperUsedTaskss = await db.getItems(HopperPayment, condition);

    // let sumByMonth = {
    //   0: 0, // January
    //   1: 0, // February
    //   2: 0, // March
    //   3: 0, // April
    //   4: 0, // May
    //   5: 0, // June
    //   6: 0, // July
    //   7: 0, // August
    //   8: 0, // September
    //   9: 0, // October
    //   10: 0, // November
    //   11: 0, // December
    // };
    // result.forEach((item) => {
    //   switch (item._id) {
    //     case 1:
    //       monthlyCounts.jan = item.count;
    //       break;
    //     case 2:
    //       monthlyCounts.feb = item.count;
    //       break;
    //     case 3:
    //       monthlyCounts.mar = item.count;
    //       break;
    //     case 4:
    //       monthlyCounts.apr = item.count;
    //       break;
    //     case 5:
    //       monthlyCounts.may = item.count;
    //       break;
    //     case 6:
    //       monthlyCounts.june = item.count;
    //       break;
    //     case 7:
    //       monthlyCounts.july = item.count;
    //       break;
    //     case 8:
    //       monthlyCounts.aug = item.count;
    //       break;
    //     case 9:
    //       monthlyCounts.sept = item.count;
    //       break;
    //     case 10:
    //       monthlyCounts.oct = item.count;
    //       break;
    //     case 11:
    //       monthlyCounts.nov = item.count;
    //       break;
    //     case 12:
    //       monthlyCounts.dec = item.count;
    //       break;
    //   }
    // });

    res.json({
      code: 200,

      result
      // data: {
      //   jan,
      //   feb,
      //   mar,
      //   apr,
      //   may,
      //   june,
      //   july,
      //   aug,
      //   sept,
      //   oct,
      //   nov,
      //   dec,
      // },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.contentPurchasedOnlileForcard = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.body;
    const weekStart = new Date(moment().utc().startOf("day").format());
    const weekEnd = new Date(moment().utc().endOf("day").format());

    let coindition;
    if (req.query.type == "weekly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: weekEnd,
          $gte: weekStart,
        },
      };
    } else if (req.query.type == "daily") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else if (req.query.type == "yearly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yearend,
          $gte: year,
        },
      };
    } else if (req.query.type == "monthly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: monthend,
          $gte: month,
        },
      };
    }
    else {

      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        // updatedAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }
    let sort = { createdAt: -1 }
    if (data.content == "lowPrice") {
      sort = { amount: 1 }
    } else if (data.content == "highPrice") {
      sort = { amount: -1 }
    } else {
      sort = { createdAt: -1 }
    }
    // const getcontentonline = await Contents.find({ paid_status: "paid" });

    // const getcontentonlines = await HopperPayment.find(coindition)
    //   .populate({
    //     path: "content_id",
    //     select:"type heading createdAt published_time_date timestamp ask_price content location",
    //     populate: {
    //       path: "hopper_id",
    //       select:"avatar_id user_name",
    //       populate: {
    //         path: "avatar_id",
    //       },
    //     },
    //     // select: { _id: 1, content: 1, createdAt: 1, updatedAt: 1 },
    //   })
    //   .populate({
    //     path: "content_id",
    //     select:"type heading createdAt published_time_date timestamp ask_price content location category_id",
    //     populate: {
    //       path: "category_id",
    //     },
    //   })
    //   .sort(sort);

    const getcontentonlines = await HopperPayment.aggregate([
      // Match the condition
      { $match: coindition },

      // Lookup to join with content collection
      {
        $lookup: {
          from: "contents",
          localField: "content_id",
          foreignField: "_id",
          as: "content",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "hopper_id",
                foreignField: "_id",
                as: "hopper_id",
                pipeline: [
                  {
                    $lookup: {
                      from: "avatars",
                      localField: "avatar_id",
                      foreignField: "_id",
                      as: "avatar_id"
                    }
                  },
                  {
                    $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
                  },
                ]
              }
            },
            {
              $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
            },

            {
              $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
            },
          ]
        }
      },
      { $unwind: "$content" },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$content_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      // Lookup to join with hopper collection
      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id",
          pipeline: [
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_id"
              }
            },
            {
              $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
            },
          ]
        }
      },
      // {
      //   $lookup: {
      //     from: "avatars",
      //     localField: "hopper_id.avatar_id",
      //     foreignField: "_id",
      //     as: "hopper_id.avatar_id"
      //   }
      // },

      {
        $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      },

      {
        $unwind: { path: "$hopper_id.avatar_id", preserveNullAndEmptyArrays: true }
      },

      // // Lookup to join with avatar collection
      // {
      //   $lookup: {
      //     from: "avatars",
      //     localField: "content.hopper.avatar_id",
      //     foreignField: "_id",
      //     as: "content.hopper_id.avatar"
      //   }
      // },
      // { $unwind: { path: "$content.hopper.avatar", preserveNullAndEmptyArrays: true } },

      // // Lookup to join with category collection
      // {
      //   $lookup: {
      //     from: "categories",
      //     localField: "content.category_id",
      //     foreignField: "_id",
      //     as: "content.category_id"
      //   }
      // },
      // { $unwind: { path: "$content.category_id", preserveNullAndEmptyArrays: true } },

      // // Project to select specific fields
      // {
      //   $project: {
      //     "content.type": 1,
      //     "content.heading": 1,
      //     "content.createdAt": 1,
      //     "content.published_time_date": 1,
      //     "content.timestamp": 1,
      //     "content.ask_price": 1,
      //     "content.content": 1,
      //     "content.location": 1,
      //     "content.hopper.avatar_id": 1,
      //     "content.hopper.user_name": 1,
      //     "content.category": 1
      //   }
      // },

      // Sort the results
      { $sort: sort }
    ]);
    const getcontentonlinecount = await HopperPayment.countDocuments(coindition)


    res.json({
      code: 200,
      content_online: {
        task: getcontentonlines,
        count: getcontentonlinecount,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};






exports.contentUnderOfferForcard = async (req, res) => {
  try {
    // const data = req.body;

    const data = req.body;
    let conditionforunderOffer = {
      offered_mediahouses: { $in: [mongoose.Types.ObjectId(req.user._id)] },
      purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] },
      is_deleted: false,
      // type: { $in: req.body.type },
      // category_id: { $in: data.category_id }
    };

    let conditionforsort = { createdAt: -1 };
    if (req.body.sort_for_under_offer == "low_price_content") {
      conditionforsort = { ask_price: 1 };
    } else if (req.body.sort_for_under_offer == "high_price_content") {
      conditionforsort = { ask_price: -1 };
    }
    let secoundry_condition = {
      // favourite_status:false
    }

    if (data.favContent == "false") {
      secoundry_condition.favourite_status = "false"
    } else if (data.favContent == "true" || data.favContent == true) {
      secoundry_condition.favourite_status = "true"
    }

    if (data.category && data.category.length > 0) {

      data.category = data.category.map((x) => mongoose.Types.ObjectId(x))
      secoundry_condition.category = { $in: data.category }
    }

    if (data.type && data.type.length > 0) {


      secoundry_condition.type = { $in: data.type }
    }


    let val = "year"
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year"
    }

    if (req.body.sort_for_under_offer != "high_price_content" || req.body.sort_for_under_offer != "low_price_content") {
      val = req.body.sort_for_under_offer;
    }
    const start = new Date(moment().utc().startOf(val).format());
    const end = new Date(moment().utc().endOf(val).format());


    // if (data.hasOwnProperty("weekly")) {
    //   secoundry_condition["Vat.purchased_time"] = {
    //     $gte: start,
    //     $lte: end
    //   };
    // }

    if (data.hasOwnProperty("weekly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("monthly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("daily")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString()// Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("yearly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }









    const todaytotalinv = await Contents.aggregate([
      {
        $match: conditionforunderOffer
      },
      {
        $lookup: {
          from: "chats",
          let: {
            content_id: "$_id",
            // new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$message_type", "Mediahouse_initial_offer"] },
                  { $eq: ["$image_id", "$$content_id"] },
                  { $eq: ["$sender_id", mongoose.Types.ObjectId(req.user._id)] }],
                },
              },
            },
          ],
          as: "offered_price",
        },
      },

      {
        $addFields: {
          console: {
            $cond: {
              if: { $gt: [{ $size: "$offered_price" }, 0] },  // Check if offered_price array has elements
              then: {
                $toDouble: {
                  $ifNull: [
                    {
                      $cond: {
                        if: { $or: [{ $eq: [{ $arrayElemAt: ["$offered_price.initial_offer_price", -1] }, ""] }, { $eq: [{ $arrayElemAt: ["$offered_price.initial_offer_price", -1] }, null] }] },  // Check if the last element is "" or null
                        then: 0,  // Replace empty string or null with 0
                        else: { $arrayElemAt: ["$offered_price.initial_offer_price", -1] }  // Use the actual value if it's not empty or null
                      }
                    },
                    0  // Fallback value if offered_price or initial_offer_price is completely missing
                  ]
                }
              },
              else: 0  // Default value if offered_price is not present or empty
            }
          }
        }
      },


      {
        $lookup: {
          from: "baskets",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$post_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "bakset_data",
        },
      },

      {
        $addFields: {
          basket_status: {
            $cond: {
              if: { $ne: [{ $size: "$bakset_data" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },


      // {
      //   $addFields: {
      //     console: { $toDouble: { $arrayElemAt: ["$offered_price.initial_offer_price", -1] } }
      //   }
      // },

      {
        $lookup: {
          from: "users",
          let: { id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                let: { avatar_id: "$avatar_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$avatar_id"] },
                    },
                  },
                ],
                as: "avatar_details",
              },
            },
          ],
          as: "hopper_id",
        },
      },

      {
        $unwind: "$hopper_id",
      },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     localField: "_id",
      //     foreignField: "content_id",
      //     as: "vat_data"
      //   }
      // },
      // {
      //   $unwind: { path: "$vat_data", preserveNullAndEmptyArrays: true }
      // },
      {
        $addFields: {
          // payment_content_type: "$vat_data.payment_content_type",
          category: "$category_id",


        }

      },

      {
        $match: secoundry_condition
      },
      {
        $sort: conditionforsort,
      },
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : 4
      },
    ]);



    const Count = await Contents.aggregate([
      {
        $match: conditionforunderOffer
      },
      {
        $lookup: {
          from: "chats",
          let: {
            content_id: "$_id",
            // new_id: "$hopper_is_fordetail",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$message_type", "Mediahouse_initial_offer"] },
                  { $eq: ["$image_id", "$$content_id"] },
                  { $eq: ["$sender_id", mongoose.Types.ObjectId(req.user._id)] }],
                },
              },
            },
          ],
          as: "offered_price",
        },
      },

      // {
      //   $addFields: {
      //     console: { $toDouble: { $arrayElemAt: ["$offered_price.initial_offer_price", -1] } }
      //   }
      // },

      {
        $addFields: {
          console: {
            $cond: {
              if: { $gt: [{ $size: "$offered_price" }, 0] },  // Check if offered_price array has elements
              then: {
                $toDouble: {
                  $ifNull: [
                    {
                      $cond: {
                        if: { $or: [{ $eq: [{ $arrayElemAt: ["$offered_price.initial_offer_price", -1] }, ""] }, { $eq: [{ $arrayElemAt: ["$offered_price.initial_offer_price", -1] }, null] }] },  // Check if the last element is "" or null
                        then: 0,  // Replace empty string or null with 0
                        else: { $arrayElemAt: ["$offered_price.initial_offer_price", -1] }  // Use the actual value if it's not empty or null
                      }
                    },
                    0  // Fallback value if offered_price or initial_offer_price is completely missing
                  ]
                }
              },
              else: 0  // Default value if offered_price is not present or empty
            }
          }
        }
      },

      {
        $lookup: {
          from: "users",
          let: { id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$id"] },
              },
            },
            {
              $lookup: {
                from: "avatars",
                let: { avatar_id: "$avatar_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$_id", "$$avatar_id"] },
                    },
                  },
                ],
                as: "avatar_details",
              },
            },
          ],
          as: "hopper_id",
        },
      },

      {
        $unwind: "$hopper_id",
      },
      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },
      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     localField: "_id",
      //     foreignField: "content_id",
      //     as: "vat_data"
      //   }
      // },
      // {
      //   $unwind: { path: "$vat_data", preserveNullAndEmptyArrays: true }
      // },
      {
        $addFields: {
          // payment_content_type: "$vat_data.payment_content_type",
          category: "$category_id",


        }

      },

      {
        $match: secoundry_condition
      },
      {
        $sort: conditionforsort,
      },
      {
        $count: "count",
      },
    ]);


    res.json({
      code: 200,
      content_under_offer: {
        newdata: todaytotalinv,
        count: todaytotalinv.length,
        totalCount: Count.length > 0 ? Count[0].count : 0
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.contenPurchasedOnlineMain = async (req, res) => {
  try {
    const data = req.body;

    condition = {
      // is_deleted: false,
      status: "published",
      $and: [
        { purchased_mediahouse: { $in: [mongoose.Types.ObjectId(req.user._id)] } },
        // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
        { purchased_mediahouse: { $exists: true } },
        // { purchased_mediahouse: { $size: 0 } }
      ]
    };

    let secoundry_condition = {

    }
    if (data.type == "exclusive") {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_content_type: "exclusive",
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }
    if (data.type == "shared") {

      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_content_type: "shared",
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };

      // condition = {
      //   is_deleted: false,
      //   status: "published",
      //   "Vat": {
      //     $elemMatch: {
      //       purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString(),
      //       purchased_content_type: "shared"
      //     }
      //   }
      // };
    }


    if (data.favContent == "false") {
      secoundry_condition.favourite_status = "false"
    } else if (data.favContent == "true" || data.favContent == true) {
      secoundry_condition.favourite_status = "true"
    }


    let conditionforsort = { createdAt: -1 }
    if (req.body.sort == "low_price_content") {
      conditionforsort = { amount: 1 };
    } else if (req.body.sort == "high_price_content") {
      conditionforsort = { amount: -1 };
    }

    // if (data.type) {
    //   // data.type = data.type.split(",")
    //   secoundry_condition.payment_content_type = { $eq: data.type }
    // }


    if (data.category && data.category.length > 0) {
      // data.category = data.category.split(",")
      data.category = data.category.map((x) => mongoose.Types.ObjectId(x))
      secoundry_condition.category = { $in: data.category }
    }

    let val;
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year"
    }

    if (data.sort && data.sort != "low_price_content" && data.sort != "high_price_content") {
      val = data.sort
    }


    const start = new Date(moment().utc().startOf(val).format());
    const end = new Date(moment().utc().endOf(val).format());


    // if (data.hasOwnProperty("weekly")) {
    //   secoundry_condition["Vat.purchased_time"] = {
    //     $gte: start,
    //     $lte: end
    //   };
    // }

    if (data.hasOwnProperty("weekly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("monthly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("daily")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString()// Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("yearly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }
    if (data.sort && data.sort != "low_price_content" && data.sort != "high_price_content") {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }
    if (data.start && data.end) {
      const start = new Date(moment(data.start).utc().startOf("day").format());
      const end = new Date(moment(data.end).utc().endOf("day").format());
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }


    const pipeline = [
      { $match: condition }, // Match documents based on the given condition
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      },
      {
        $unwind: { path: "$category_id", }
      },


      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id",
          pipeline: [
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_id"
              }
            },
            {
              $unwind: { path: "$avatar_id", }
            },
          ]
        }
      },
      // {
      //   $lookup: {
      //     from: "avatars",
      //     localField: "hopper_id.avatar_id",
      //     foreignField: "_id",
      //     as: "hopper_id.avatar_id"
      //   }
      // },

      {
        $unwind: { path: "$hopper_id", }
      },

      {
        $unwind: { path: "$hopper_id.avatar_id", }
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "hopper_id",
      //     foreignField: "_id",
      //     as: "hopper_id",
      //     pipeline: [
      //       {
      //         $lookup: {
      //           from: "avatars",
      //           localField: "avatar_id",
      //           foreignField: "_id",
      //           as: "avatar_id"
      //         }
      //       },
      //       {
      //         $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
      //       },
      //     ]
      //   }
      // },
      // {
      //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      // },

      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },

      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     localField: "_id",
      //     foreignField: "content_id",
      //     as: "vat_data"
      //   }
      // },
      // {
      //   $unwind: { path: "$vat_data" }
      // },
      {
        $addFields: {
          // payment_content_type: "$vat_data.payment_content_type",
          category: "$category_id._id",


        }

      },
      {
        $addFields: {
          info: {
            $filter: {
              input: "$Vat",
              as: "item",
              cond: { $eq: ["$$item.purchased_mediahouse_id", req.user._id.toString()] }
            }
          }
        }
      },
      {
        $addFields: {
          amount: { $toDouble: { $arrayElemAt: ["$info.amount", 0] } },
          // amount: { $arrayElemAt: ["$info.amount", 0] },
        }
      },
      {
        $match: secoundry_condition
      },
      // {
      //   $group: {
      //     _id: "$_id", // You can use a unique identifier field here
      //     // Add other fields you want to preserve
      //     firstDocument: { $first: "$$ROOT" },
      //   },
      // },
      // {
      //   $replaceRoot: { newRoot: "$firstDocument" },
      // },
      {
        $sort: conditionforsort // Sort documents based on the specified criteria
      },
      // {
      //   $limit: data.limit ? parseInt(data.limit) : 4
      // },
      // {
      //   $skip: data.offset ? parseInt(data.offset) : 0
      // },

    ];

    count = await Contents.aggregate(pipeline);

    pipeline.push(
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
      {
        $limit: data.limit ? parseInt(data.limit) : 4
      },
    )
    let content = await Contents.aggregate(pipeline);

    res.json({
      code: 200,
      content: content,
      count: count.length
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};




exports.DashboardcontentTypeMain = async (req, res) => {
  try {
    const data = req.body;

    const d = new Date()
    const value = d.setDate(d.getDate() - 30)

    let condition = {
      // sale_status:
      status: "published",
      is_deleted: false,
      published_time_date: {
        $gte: new Date(value),
        $lte: new Date()
      },
      $or: [
        { purchased_mediahouse: { $nin: [mongoose.Types.ObjectId(req.user._id)] } },
        // { Vat: { $elemMatch: { purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id) } } },
        { purchased_mediahouse: { $exists: false } },
        { purchased_mediahouse: { $size: 0 } }
      ],
      is_hide: false,
      type: data.soldtype,
      offered_mediahouses: { $nin: [mongoose.Types.ObjectId(req.user._id)] }
    };



    let secoundry_condition = {

    }
    if (data.type == "exclusive") {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_content_type: "exclusive",
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }
    if (data.type == "shared") {

      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_content_type: "shared",
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };

      // condition = {
      //   is_deleted: false,
      //   status: "published",
      //   "Vat": {
      //     $elemMatch: {
      //       purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString(),
      //       purchased_content_type: "shared"
      //     }
      //   }
      // };
    }


    if (data.favContent == "false") {
      secoundry_condition.favourite_status = "false"
    } else if (data.favContent == "true" || data.favContent == true) {
      secoundry_condition.favourite_status = "true"
    }


    let conditionforsort = { createdAt: -1 }
    if (req.body.sort_for_under_offer == "low_price_content") {
      conditionforsort = { ask_price: 1 };
    } else if (req.body.sort_for_under_offer == "high_price_content") {
      conditionforsort = { ask_price: -1 };
    }

    // if (data.type) {
    //   // data.type = data.type.split(",")
    //   secoundry_condition.payment_content_type = { $eq: data.type }
    // }


    if (data.category && data.category.length > 0) {
      // data.category = data.category.split(",")
      data.category = data.category.map((x) => mongoose.Types.ObjectId(x))
      secoundry_condition.category = { $in: data.category }
    }

    let val;
    if (data.hasOwnProperty("weekly")) {
      val = "week";
    }

    if (data.hasOwnProperty("monthly")) {
      val = "month";
    }

    if (data.hasOwnProperty("daily")) {
      val = "day";
    }

    if (data.hasOwnProperty("yearly")) {
      val = "year"
    }

    const start = new Date(moment().utc().startOf(val).format());
    const end = new Date(moment().utc().endOf(val).format());


    // if (data.hasOwnProperty("weekly")) {
    //   secoundry_condition["Vat.purchased_time"] = {
    //     $gte: start,
    //     $lte: end
    //   };
    // }

    if (data.hasOwnProperty("weekly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("monthly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: mongoose.Types.ObjectId(req.user._id).toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("daily")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString()// Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.hasOwnProperty("yearly")) {
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }

    if (data.start && data.end) {
      const start = new Date(moment(data.start).utc().startOf("day").format());
      const end = new Date(moment(data.end).utc().endOf("day").format());
      secoundry_condition["Vat"] = {
        $elemMatch: {
          purchased_time: {
            $gte: start,
            $lte: end
          },
          purchased_mediahouse_id: req.user._id.toString() // Assuming req.mediahouse_id contains the mediahouse_id to match
        }
      };
    }


    const pipeline = [
      { $match: condition }, // Match documents based on the given condition
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id"
        }
      },
      {
        $unwind: { path: "$category_id", }
      },


      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id",
          pipeline: [
            {
              $lookup: {
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_id"
              }
            },
            {
              $unwind: { path: "$avatar_id", }
            },
          ]
        }
      },
      // {
      //   $lookup: {
      //     from: "avatars",
      //     localField: "hopper_id.avatar_id",
      //     foreignField: "_id",
      //     as: "hopper_id.avatar_id"
      //   }
      // },

      {
        $unwind: { path: "$hopper_id", }
      },

      {
        $unwind: { path: "$hopper_id.avatar_id", }
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "hopper_id",
      //     foreignField: "_id",
      //     as: "hopper_id",
      //     pipeline: [
      //       {
      //         $lookup: {
      //           from: "avatars",
      //           localField: "avatar_id",
      //           foreignField: "_id",
      //           as: "avatar_id"
      //         }
      //       },
      //       {
      //         $unwind: { path: "$avatar_id", preserveNullAndEmptyArrays: true }
      //       },
      //     ]
      //   }
      // },
      // {
      //   $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }
      // },

      {
        $lookup: {
          from: "favourites",
          let: { id: "$_id", user_id: mongoose.Types.ObjectId(req.user._id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$content_id", "$$id"] },
                  { $eq: ["$user_id", "$$user_id"] }

                  ],
                },
              },
            },

          ],
          as: "favorate_content",
        },
      },


      {
        $addFields: {
          favourite_status: {
            $cond: {
              if: { $ne: [{ $size: "$favorate_content" }, 0] },
              then: "true",
              else: "false"
            }
          }
        }
      },


      {
        $addFields: {
          // payment_content_type: "$vat_data.payment_content_type",
          category: "$category_id._id",
        }

      },

      {
        $match: secoundry_condition
      },
      {
        $sort: conditionforsort // Sort documents based on the specified criteria
      },
      {
        $limit: data.limit ? parseInt(data.limit) : 4
      },
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },

    ];

    let content = await Contents.aggregate(pipeline);

    res.json({
      code: 200,
      content: content
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.contentPurchasedFromTask = async (req, res) => {
  try {
    const data = req.body;
    let conditionforsort = {};
    const yesterdayStart = new Date(moment().utc().startOf("day").format());
    const yesterdayEnd = new Date(moment().utc().endOf("day").format());
    // conditionforsort = {
    //   // user_id:mongoose.Types.ObjectId(req.user._id),
    //   createdAt: {
    //     $lte: BrocastcondEnd,
    //     $gte: Brocastcond,
    //   },
    // };


    if (data.type == "daily") {
      conditionforsort = {
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    }

    if (data.type == "weekly") {
      conditionforsort = {
        createdAt: {
          $gte: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          $lte: yesterdayEnd,
        },
      };
    }

    if (data.type == "monthly") {
      conditionforsort = {
        createdAt: {
          $gte: moment().subtract(1, 'months').format('YYYY-MM-DD'),
          $lte: yesterdayEnd,
        },
      };
    }

    if (data.type == "yearly") {
      conditionforsort = {
        createdAt: {
          $gte: moment().subtract(1, 'years').format('YYYY-MM-DD'),
          $lte: yesterdayEnd,
        },
      };
    }
    const contentsourcedfromtask = await Uploadcontent.aggregate([
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
          let: { hopper_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
                },
              },
            },

            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_id",
              },
            },

            { $unwind: "$category_id" },

            // {
            //   $addFields:{
            //     console:"$$task_id"
            //   }
            // }
          ],
          as: "task_id",
        },
      },

      { $unwind: "$task_id" },

      {
        $match: {
          "task_id.mediahouse_id": req.user._id,
          paid_status: true,
        },
      },


      {
        $lookup: {
          from: "users",
          let: { hopper_id: "$hopper_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$hopper_id"] }],
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
              $unwind: "$avatar_details",
            },
          ],
          as: "hopper_details",
        },
      },
      { $unwind: "$hopper_details" },
      {
        $match: conditionforsort,
      },
      {
        $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
      },
      {
        $offset: data.offset ? parseInt(data.offset) : 0
      }
      // {
      //   $sort: sort1,
      // },
      // {
      //   $lookup:{
      //     from:"tasks",
      //     let :{
      //       _id: "$task_id",
      //     },
      //     pipeline:[
      //       {
      //         $match: { $expr: [{
      //           $and: [{
      //             $eq:["_id" , "$$_id"],
      //         }]
      //         }] },
      //       },
      //       {
      //         $lookup:{
      //           from:"Category",
      //           localField:"category_id",
      //           foreignField:"_id",
      //           as:"category_ids"
      //         }
      //       }
      //     ],
      //     as:"category"
      //   }
      // }
    ]);



    res.json({
      code: 200,
      data: contentsourcedfromtask
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};





exports.createPaymentMethodforcard = async (req, res) => {
  try {
    const data = req.body
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: '4242424242424242',
        exp_month: "08",
        exp_year: "2026",
        cvc: '314',
      },
    });

    return res.status(200).json({
      code: 200,
      message: paymentIntent,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.AttachPaymentMethod = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",
      payment_method: "pm_card_visa",
    });

    return res.status(200).json({
      code: 200,
      message: paymentIntent,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.listPaymentMethod = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",
      payment_method: "pm_card_visa",
    });

    return res.status(200).json({
      code: 200,
      message: paymentIntent,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.createfee = async (req, res) => {
  try {

    const booking = new stripeFee(req.body);
    const val = await booking.save();

    return res.status(200).json({
      code: 200,
      message: val,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.addToBasket = async (req, res) => {
  try {

    const data = req.body
    let booking
    data.user_id = req.user._id
    data.vat_number = req.user.company_vat
    const addToBasketList = await addToBasket.findOne({ user_id: data.user_id, post_id: mongoose.Types.ObjectId(data.order[0].post_id) })

    if (addToBasketList) {

      booking = await addToBasket.findOneAndDelete({ _id: mongoose.Types.ObjectId(addToBasketList._id) })
    } else {

      const newarr = data.order.map((x) => (
        {
          post_id: x.post_id,
          user_id: req.user._id,
          type: x.type,
          content: x.content ? x.content : [],
          vat_number: data.vat_number,
          // total_price:x.total_price ?x.total_price:0,
          // quantity:x.quantity,
          status: 'pending',
          order_date: new Date(),


        }
      ))


      booking = await addToBasket.insertMany(newarr)

    }

    return res.status(200).json({
      code: 200,
      data: booking,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

// exports.removebasket = async (req, res) => {
//   try {

//     const data = req.body
//     let booking
//     const newarr = data.basket_id.map((x) => mongoose.Types.ObjectId(x))
//     booking = await addToBasket.deleteMany({ _id: {$in:newarr} })


//     return res.status(200).json({
//       code: 200,
//       data: booking,
//       // msg:arr2,
//     });
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };


async function getUserMediaHouseId(userId) {
  try {
    // Fetch user from user collection
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check the role of the user
    if (user.role !== 'MediaHouse') {
      // Fetch office details if the role is not 'mediaHouse'
      const office = await OfficeDetails.findById(user.office_id);

      if (!office) {
        throw new Error('Office not found');
      }


      const finaluser = await User.findOne({ company_vat: office.company_vat });

      // Return user_mediahouse_id from office
      return finaluser._id;
    } else {
      // Return req.user._id if the role is 'mediaHouse'
      return userId
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}




exports.getBasketData = async (req, res) => {
  try {
    const data = req.body
    data.user_id = await getUserMediaHouseId(req.user._id)

    const pipeline = [
      {
        $match: {
          user_id: mongoose.Types.ObjectId(req.user._id),
        }
      },
      {
        $lookup: {
          from: "contents",
          foreignField: "_id",
          localField: "post_id",
          as: "contentDetails",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "categoryDetails"
              }
            },
            {
              $unwind:{
                path: "$categoryDetails",
                preserveNullAndEmptyArrays: false,
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "hopper_id",
                foreignField: "_id",
                as: "hopperDetails",
              },

            }, 
            {
              $unwind:{path:"$hopperDetails" ,preserveNullAndEmptyArrays:false}
            },
            {
              $addFields:{
                stripe_account_id:"$hopperDetails.stripe_account_id"
              }
            }
            // {
            //   $project: {
            //     stripe_account_id:"$hopperDetails.stripe_account_id"
            //   }
            // }
          ]
        }
      },
      {
        $lookup: {
          from: "uploadcontents",
          foreignField: "_id",
          localField: "post_id",
          as: "taskDetails",
        },
      },
      {
        $addFields: {
          details: {
            $arrayElemAt: [
              {
                $cond: {
                  if: { $eq: [{ $size: "$contentDetails" }, 1] },
                  then: "$contentDetails",
                  else: "$taskDetails"
                }
              },
              0
            ]
          }
        }
      },
      {
        $project: {
          contentDetails: 0,
          taskDetails: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER
      },
      {
        $skip: data.offset ? parseInt(data.offset) : 0
      },
    ]


    const resp = await addToBasket.aggregate(pipeline)

    // const resp = await addToBasket.find({ user_id: data.user_id })

    return res.status(200).json({
      code: 200,
      data: resp,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getBasketDataCount = async (req, res) => {
  try {
    const data = req.query
    data.user_id = await getUserMediaHouseId(req.user._id)




    const resp = await addToBasket.countDocuments({ user_id: data.user_id })

    // const resp = await addToBasket.find({ user_id: data.user_id })

    return res.status(200).json({
      code: 200,
      data: resp,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.checkoutlist = async (req, res) => {
  try {
    const data = req.query
    // data.user_id = await getUserMediaHouseId(req.user._id)




    const lineItems = await stripe.checkout.sessions.listLineItems(
      'cs_test_b1AO7S81UGbxBOGOEyGAxXcSl9J4WTyPoLNhgDhMU70TM2b0FkTsKVh7gM',
      { limit: Number.MAX_SAFE_INTEGER }
    )


    // const resp = await addToBasket.find({ user_id: data.user_id })

    return res.status(200).json({
      code: 200,
      data: lineItems,
      // msg:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
async function userDetails(data) {

  let USER = await User.findOne({
    _id: data,
  });
  return USER
}


exports.updateNotificationforClearAll = async (req, res) => {
  try {
    const data = req.body;
    let resp = await notification.updateMany({ receiver_id: { $in: [req.user._id] }, is_deleted_for_mediahoue: false }, { is_deleted_for_mediahoue: true })

    res.json({ code: 200, response: resp });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.newChatFlow = async (req, res) => {
  try {

    const data = req.body;
    const contentdetails = await Contents.findOne({ _id: data.image_id })
    const originalamount = contentdetails.original_ask_price


    const userId = mongoose.Types.ObjectId(req.user._id)
    // const existingChat = await Chat.findOne({
    //   room_id: data.room_id,
    //   image_id: data.image_id,
    //   sender_id: userId,
    //   receiver_id: data.received_id,
    //   message_type: {
    //     $in: [
    //       "accept_mediaHouse_offer",
    //       "decline_mediaHouse_offer",
    //       "buy_mediaHouse_offer",
    //       "reject_mediaHouse_offer"
    //     ]
    //   },
    //   amount: data.offer_amount,
    // });

    // if (existingChat) {
    //   return res.status(400).json({ code: 400, response: "Duplicate entry detected. Operation aborted." });
    // }

    if (originalamount <= parseInt(data.offer_amount)) {
      const valueforchat = {
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: req.user._id,
        receiver_id: data.received_id,
        message_type: "accept_mediaHouse_offer",
        amount: data.offer_amount,
        hopper_price: originalamount,
        paid_status: false
      }



      const existingChat = await Chat.findOne({
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: userId,
        receiver_id: data.received_id,
        message_type: "accept_mediaHouse_offer",
        // amount: data.offer_amount,
      });

      if (existingChat) {
        return res.status(400).json({ code: 400, response: "Duplicate entry detected. Operation aborted." });
      }



      const added = await Chat.create(valueforchat);

      io.to(data.room_id).emit("chat message", added)

      io.to(data.image_id).emit("chat message", added)



      const valueforchatforApp = {
        room_id: data.room_id,
        image_id: data.image_id,
        sender_type: "Mediahouse",
        sender_id: userId,
        message_type: "Mediahouse_initial_offer",
        receiver_id: data.receiver_id,
        initial_offer_price: data.offer_amount,
        finaloffer_price: "",
      }
      const addedforapp = await Chat.create(valueforchatforApp);




      // if (msg.message_type == "Mediahouse_initial_offer") {
      let lastchats = await lastchat.create({
        room_id: data.room_id,
        content_id: data.image_id,
        mediahouse_id: data.sender_id,
        hopper_id: data.receiver_id,
      });

      // const added = await Content.update({
      //   _id: msg.content_id,
      // }, { content_under_offer: true });

      const findreceiver = await Contents.findOne({
        _id: mongoose.Types.ObjectId(data.image_id),
      });
      const purchased_mediahouse = findreceiver.offered_mediahouses.map((hopperIds) => hopperIds);
      if (!purchased_mediahouse.includes(userId)) {

        const update = await Contents.updateOne(
          { _id: mongoose.Types.ObjectId(data.image_id) },
          { $push: { offered_mediahouses: userId }, }
        );
      }

      const users = await userDetails(data.sender_id)
      const users2 = await userDetails(data.receiver_id)

      const notiObj = {
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        // data.receiver_id,
        title: "Offer received ",
        body: `BINGO 🤟🏼🤑 You have recieved an offer of £${formatAmountInMillion(data.initial_offer_price)} from the ${users.company_name}. Visit My Content to accept, reject or make a counter offer. Let's do this🚀`,
      };


      const notiObj3 = {
        sender_id: data.receiver_id,
        receiver_id: data.sender_id,
        // data.receiver_id,
        title: "Offer received ",
        body: `👋🏼 Hey guys, thank you for your generous offer of £${formatAmountInMillion(data.initial_offer_price)} . We will keep you informed when ${users2.user_name} accepts, rejects or makes a counter offer. Cheers🤩`,
      };
      const notiObj2 = {
        sender_id: data.sender_id,
        receiver_id: "64bfa693bc47606588a6c807",
        // data.receiver_id,
        title: "Offer received ",
        body: `Offer received  - ${users2.user_name} has received an offer for £${formatAmountInMillion(data.initial_offer_price)} from The ${users.user_name}`,
      };

      const resp1 = await _sendPushNotification(notiObj);
      const resp = await _sendPushNotification(notiObj2);
      const resp3 = await _sendPushNotification(notiObj3);
      // }




      io.to(data.room_id).emit("initialoffer", addedforapp)

    } else if (originalamount > parseInt(data.offer_amount) && data.type != "no") {


      const existingChat = await Chat.findOne({
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: userId,
        receiver_id: data.received_id,
        message_type: "decline_mediaHouse_offer",
        // amount: data.offer_amount,
      });

      if (existingChat) {
        return res.status(400).json({ code: 400, response: "Duplicate entry detected. Operation aborted." });
      }

      const valueforchat = {
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: userId,
        receiver_id: data.received_id,
        message_type: "decline_mediaHouse_offer",
        amount: data.offer_amount,
        paid_status: false
      }


      const findreceiver = await Contents.findOne({
        _id: mongoose.Types.ObjectId(data.image_id),
      });

      const purchased_mediahouse = findreceiver.offered_mediahouses.map((hopperIds) => hopperIds);
      if (!purchased_mediahouse.includes(userId)) {

        const update = await Contents.updateOne(
          { _id: mongoose.Types.ObjectId(data.image_id) },
          { $push: { offered_mediahouses: userId }, }
        );
      }





      const added = await Chat.create(valueforchat);




      const valueforchatforApp = {
        room_id: data.room_id,
        image_id: data.image_id,
        sender_type: "Mediahouse",
        sender_id: userId,
        message_type: "Mediahouse_initial_offer",
        receiver_id: data.receiver_id,
        initial_offer_price: data.offer_amount,
        finaloffer_price: "",
      }
      const addedforapp = await Chat.create(valueforchatforApp);

      io.to(data.room_id).emit("chat message", added)
    } else if (data.type == "buy") {
      const valueforchat = {
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: userId,
        receiver_id: data.received_id,
        message_type: "buy_mediaHouse_offer",
        amount: data.offer_amount,
        paid_status: true
      }



      const existingChat = await Chat.findOne({
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: userId,
        receiver_id: data.received_id,
        message_type: "buy_mediaHouse_offer",
        // amount: data.offer_amount,
      });

      if (existingChat) {
        return res.status(400).json({ code: 400, response: "Duplicate entry detected. Operation aborted." });
      }

      const added = await Chat.create(valueforchat);

      io.to(data.room_id).emit("chat message", added)
    } else if (data.type == "no") {
      const valueforchat = {
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: userId,
        receiver_id: data.received_id,
        message_type: "reject_mediaHouse_offer",
        amount: data.offer_amount,
        paid_status: false
      }


      const existingChat = await Chat.findOne({
        room_id: data.room_id,
        image_id: data.image_id,
        sender_id: userId,
        receiver_id: data.received_id,
        message_type: "reject_mediaHouse_offer",
        // amount: data.offer_amount,
      });

      if (existingChat) {
        return res.status(400).json({ code: 400, response: "Duplicate entry detected. Operation aborted." });
      }
      const findreceiver = await Contents.findOne({
        _id: mongoose.Types.ObjectId(data.image_id),
      });

      const purchased_mediahouse = findreceiver.offered_mediahouses.map((hopperIds) => hopperIds);
      if (!purchased_mediahouse.includes(userId)) {

        const update = await Contents.updateOne(
          { _id: mongoose.Types.ObjectId(data.image_id) },
          { $push: { offered_mediahouses: userId }, }
        );
      }

      const added = await Chat.create(valueforchat);

      io.to(data.room_id).emit("chat message", added)
    }



    res.json({ code: 200, response: "done" });
  } catch (err) {
    utils.handleError(res, err);
  }
};




async function getUserOfficesMediaHouseId(userId) {
  try {
    // Fetch user from user collection
    const user = await User.findOne({ email: userId });

    if (!user) {
      throw new Error('User not found');
    }

    // Check the role of the user
    if (user.role == 'MediaHouse') {
      // Fetch office details if the role is not 'mediaHouse'
      const office = await OfficeDetails.find({ company_vat: user.company_vat });

      if (!office) {
        throw new Error('Office not found');
      }
      return office;
    } else {


      // Return office_id of user
      return user.office_id
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

exports.getOfficeListBasedUponMediahouseEmail = async (req, res) => {
  try {
    const data = req.body



    const resp = await getUserOfficesMediaHouseId(data.email)

    return res.status(200).json({
      code: 200,
      data: resp,
      // data:arr2,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.createPaymentforBasket = async (req, res) => {
  try {
    const data = req.body;
    const amountwithoutvat = data.amount


    const invoice = await stripe.invoices.create({
      customer: req.user.stripe_customer_id,
    });
    const discounts = [];
    let promovalue = false
    if (data.promoCode == "true" || data.promoCode == true) {
      promovalue = true
    }

    // Check if the promotion code is valid (not empty)
    if (data.promotionCode && data.promotionCode.trim() !== '') {
      discounts.push({ promotion_code: data.promotionCode });
    }

    

    if (typeof data.product == "string") {
      data.product = JSON.parse(data.product)
    }

    if (typeof data.data == "string") {
      data.data = JSON.parse(data.data)
    }

    if (data.data.length > 0) {
      discounts.push({ coupon: data.data[0].coupon });
    }
    data.customer_id = req.user.stripe_customer_id
    const session = await stripe.checkout.sessions.create({
      invoice_creation: {
        enabled: true,
      },
      // currency:"gbp",
      payment_method_types: ['card', 'paypal', 'bacs_debit'],
      line_items: data.product,
      // line_items: [
      //   {
      //     price_data: {
      //       currency: "gbp",
      //       product_data: {
      //         name: "Challanges",
      //         metadata: {
      //           product_id: data.image_id,
      //           customer_id: data.customer_id,
      //           amount: amountwithoutvat, //+ (amountwithoutvat * 20/100),
      //           type: data.type,
      //         }
      //       },
      //       unit_amount: data.amount * 100 + ((data.amount * 20) / 100) * 100, // * 100, // dollar to cent
      //     },
      //     quantity: 1,
      //     tax_rates: ["txr_1Q54oaCf1t3diJjXVbYnv7sO"]
      //   },
      //   {
      //     price_data: {
      //       currency: "gbp",
      //       product_data: {
      //         name: "Challanges",
      //         metadata: {
      //           product_id: data.image_id,
      //           customer_id: data.customer_id,
      //           amount: amountwithoutvat, //+ (amountwithoutvat * 20/100),
      //           type: data.type,
      //         }
      //       },
      //       unit_amount: data.amount * 100 + ((data.amount * 20) / 100) * 100, // * 100, // dollar to cent
      //     },
      //     quantity: 1,
      //     tax_rates: ["txr_1Q54oaCf1t3diJjXVbYnv7sO"]
      //   },
      //   {
      //     price_data: {
      //       currency: "gbp",
      //       product_data: {
      //         name: "Challanges",
      //         metadata: {
      //           product_id: data.image_id,
      //           customer_id: data.customer_id,
      //           amount: amountwithoutvat, //+ (amountwithoutvat * 20/100),
      //           type: data.type,
      //         }
      //       },
      //       unit_amount: data.amount * 100 + ((data.amount * 20) / 100) * 100, // * 100, // dollar to cent
      //     },
      //     quantity: 1,
      //     tax_rates: ["txr_1Q54oaCf1t3diJjXVbYnv7sO"]
      //   },


      // ],
      mode: "payment",
      metadata: {
        // data: JSON.stringify(data.data),
        user_id: req.user._id.toString(),
        // product_id: data.image_id,
        // customer: data.customer_id,
        // amount: data.amount, //+ (data.amount * 20/100),
        // type: data.type,
        invoice_id: invoice.id,
        // task_id: data.task_id,
        // email: req.user.email
      },
      customer: data.customer_id,
      saved_payment_method_options: {
        payment_method_save: "enabled"
      },
      payment_intent_data: {
        setup_future_usage: "off_session"
      },
      discounts: discounts.length > 0 ? discounts : undefined,
      // automatic_tax: {
      //   enabled: true,
      //   // configuration: {
      //   //   tax_rate: 20
      //   // }
      // },
      success_url:
        process.env.API_URL +
        "/successforBulk?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: process.env.API_URL + "/challenge/payment/failed",
    });


    await bulkTransaction.insertMany(data.data)
    res.status(200).json({
      code: 200,
      url: session.url,
    });
  } catch (error) {

    utils.handleError(res, error);
  }
};


exports.createTax = async (req, res) => {
  try {

    const data = req.body;

    const balance = await stripe.balance.retrieve();
    console.log('Account Balance:', balance);

    // const taxRate = await stripe.taxRates.create({
    //   display_name: 'VAT',
    //   description: 'VAT UK',
    //   percentage: 20,
    //   // jurisdiction: 'DE',
    //   inclusive: true,
    // });
    // const amountwithoutvat = data.amount


    // const invoice = await stripe.invoices.create({
    //   customer: req.user.stripe_customer_id,
    // });
    // const session = await stripe.checkout.sessions.create({
    //   invoice_creation: {
    //     enabled: true,
    //   },
    //   // currency:"gbp",
    //   payment_method_types: ['card', 'paypal', 'bacs_debit'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "gbp",
    //         product_data: {
    //           name: "Challanges",
    //           type: data.type,
    //           product_id: data.image_id
    //         },
    //         unit_amount: data.amount * 100 + ((data.amount * 20) / 100) * 100, // * 100, // dollar to cent
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   metadata: {
    //     user_id: req.user._id.toString(),
    //     product_id: data.image_id,
    //     customer: data.customer_id,
    //     amount: data.amount, //+ (data.amount * 20/100),
    //     type: data.type,
    //     invoice_id: invoice.id,
    //     task_id: data.task_id,
    //     email: req.user.email
    //   },
    //   customer: data.customer_id,
    //   saved_payment_method_options: {
    //     payment_method_save: "enabled"
    //   },
    //   payment_intent_data: {
    //     setup_future_usage: "off_session"
    //   },
    //   automatic_tax: {
    //     enabled: true,
    //     // configuration: {
    //     //   tax_rate: 20
    //     // }
    //   },
    //   success_url:
    //     process.env.API_URL +
    //     "/challenge/payment/success?session_id={CHECKOUT_SESSION_ID}",
    //   cancel_url: process.env.API_URL + "/challenge/payment/failed",
    // });


    // 
    res.status(200).json({
      code: 200,
      url: balance,
    });
  } catch (error) {

    utils.handleError(res, error);
  }
};




exports.getProfileAccordingUserId = async (req, res) => {
  try {
    const response = await User.findOne({ _id: req.body.user_id }).populate("media_house_id user_id office_id user_type_id designation_id department_id").lean();//await findUserById(req.user._id).populate("media_house_id")
    // const notificationPromises = [];
    // const findnotification = await notification.findOne({
    //   type: "MediahouseDocUploaded",
    //   receiver_id: mongoose.Types.ObjectId(req.body.user_id.toString()),
    // });
    // if (!findnotification) {
    //   const notificationObjUser = {
    //     sender_id: req.body.user_id.toString(),
    //     receiver_id: req.body.user_id.toString(),
    //     type: "MediahouseDocUploaded",
    //     title: "Documents successfully uploaded",
    //     body: `👋🏼 Hi ${req.user.company_name}, thank you for updating your documents 👍🏼 Team PRESSHOP🐰`,
    //   };
    //   await Promise.all([_sendPushNotification(notificationObjUser)]);
    // } else {
    //   
    // }

    return res.status(200).json({
      code: 200,
      profile: response,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};




exports.getUserListAccordingToOfficeId = async (req, res) => {
  try {
    const response = await User.find({ office_id: req.body.office_id, is_deleted: false, status: "approved" }).sort({ createdAt: -1 }).limit(req.body.limit ? parseInt(req.body.limit) : Number.MAX_SAFE_INTEGER).skip(req.body.offset ? parseInt(req.body.offset) : 0);


    return res.status(200).json({
      code: 200,
      data: response,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.UseWallet = async (req, res) => {
  try {

    const data = req.body;
    const userDetails = await User.findOne({ _id: mongoose.Types.ObjectId(req.user._id) })
    const originalamount = userDetails.wallet_amount

    if (originalamount != 0 && originalamount < data.amount) {
      const valueforwalletEntry = {
        type: data.type,
        amount: data.amount,
        paid_status: false
      }

      const added = await walletEntry.create(valueforwalletEntry);

    }



    res.json({ code: 200, response: "done" });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.updateMultipleUser = async (req, res) => {
  try {

    const data = req.body;

    await data.user_data.map(async (x, i) => {
      delete x._id
      const userDetails = await UserMediaHouse.findOneAndUpdate({ email: x.email }, x, { new: true })


    })




    return res.json({ code: 200, response: "done" });
  } catch (err) {
    utils.handleError(res, err);
  }
};





exports.addMultipleUser = async (req, res) => {
  try {

    const data = req.body;



    const userDetails = await UserMediaHouse.insertMany(data.user_data)



    return res.json({ code: 200, data: userDetails });
  } catch (err) {
    utils.handleError(res, err);
  }
};







exports.addTestimonial = async (req, res) => {
  try {
    const data = req.body;
    data.user_id = req.user._id
    const resdata = new testimonial(data);
    await resdata.save();


    const added = await rating.create({
      from: data.user_id,
      to: mongoose.Types.ObjectId("64bfa693bc47606588a6c807"),
      // content_id: msg.image_id,
      type: "testimonial",
      features: data.features,
      review: data.description,
      rating: data.rate,
      sender_type: "Mediahouse",
      // is_rated: true
    });
    return res.status(200).json({ message: "Data saved successfully", code: 200 })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


exports.getTestimonial = async (req, res) => {
  try {
    const data = req.query;
    const weekStart = new Date(moment().utc().startOf("week").format());
    const weekEnd = new Date(moment().utc().endOf("week").format());
    // ------------------------------------today fund invested -----------------------------------
    const yesterdayStart = new Date(moment().utc().startOf("day").format());
    const yesterdayEnd = new Date(moment().utc().endOf("day").format());
    const month = new Date(moment().utc().startOf("month").format());
    const monthend = new Date(moment().utc().endOf("month").format());
    const year = new Date(moment().utc().startOf("day").format());
    const yearend = new Date(moment().utc().endOf("day").format());
    let coindition;
    if (req.query.type == "weekly") {
      coindition = {
        status: "approved",
        createdAt: {
          $lte: weekEnd,
          $gte: weekStart,
        },
      };
    } else if (req.query.type == "daily") {
      coindition = {
        status: "approved",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else if (req.query.type == "yearly") {
      coindition = {
        status: "approved",
        createdAt: {
          $lte: yearend,
          $gte: year,
        },
      };
    } else if (req.query.type == "monthly") {
      coindition = {
        status: "approved",
        createdAt: {
          $lte: monthend,
          $gte: month,
        },
      };
    }
    else {

      coindition = {
        // user_id: mongoose.Types.ObjectId(req.user._id),
        status: "approved"
        // updatedAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }



    const getcontentonline = await testimonial.find(coindition)
      .populate({
        path: "user_id",
        select: { _id: 1, company_name: 1, profile_image: 1, full_name: 1, admin_detail: 1, createdAt: 1, updatedAt: 1 },
      })
      .sort({ createdAt: -1 }).limit(data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER).skip(req.query.offset ? parseInt(req.query.offset) : 0);
    const getcontentonlineCount = await testimonial.countDocuments(coindition)
    return res.status(200).json({ data: getcontentonline, count: getcontentonlineCount, code: 200 })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// const express = require('express');
// const app = express();
// we_1PmsKDAKmuyBTjDNPp3081ya

const endpointSecret = "whsec_QyOwqdxCEqAUaVOGn2c08iIfHQie3dj4"
// "whsec_O6KNzcwrLe7bSY0JnC3KxSxCwxj3jP9s";

// const endpointSecret = "whsec_cf900a7ecb7951488a488b90fd7d9dfbbafd34e4a873703e081b981f4381838d";
// const endpointSecret = "whsec_wM6LJl0HH7wqIp76IGoZhh0LCMsJrYkS"
// b25046c1f6a21697db60653f5c8e285785af577f83289350fb9da3d720a9c67f
// eb7f1afcd915499d57904fd246a0fdc16444771967f2f9d9f56bea85c91f62be
exports.webhook = async (request, response) => {
  try {
    const sig = request.headers['stripe-signature'];

    let event;

    try {

      // const payload = {
      //   id: 'evt_test_webhook',checkout.session.expired
      //   object: 'event',
      // };

      // const payloadString = JSON.stringify(payload, null, 2);
      const buf = Buffer.isBuffer(request.body) ? request.body : Buffer.from(JSON.stringify(request.body));
      // const header = stripe.webhooks.generateTestHeaderString({
      //   payload: payloadString,
      //   endpointSecret,
      // });



      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {

      response.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // const billingPortalSessionCreated = event.data.object;
        // const value = await promo_codes.updateOne({ code: billingPortalSessionCreated.metadata.coupon }, { $push: { user_id: billingPortalSessionCreated.metadata.user_id } })
        // console.log("checkout.session.completed", billingPortalSessionCreated)

        // const findContent = await Contents.findOne({ _id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id) })
        // console.log("findContent======", findContent)


        // // async function waitForHopperPaymentContent(retries = 10, interval = 300) {
        // //   let findHopperPaymentContent;
        // //   while (retries > 0) {
        // //     findHopperPaymentContent = await HopperPayment.findOne({
        // //       content_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id),
        // //       media_house_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.user_id),
        // //     });

        // //     if (findHopperPaymentContent) {
        // //       return findHopperPaymentContent;
        // //     }

        // //     // Wait for the specified interval before trying again
        // //     await new Promise((resolve) => setTimeout(resolve, interval));
        // //     retries--;
        // //   }
        // //   return null; // Return null if no content found after retries
        // // }



        // const findHopperPaymentContent = await HopperPayment.findOne({ content_id: billingPortalSessionCreated.metadata.product_id, media_house_id:billingPortalSessionCreated.metadata.user_id })
        // console.log("findHopperPaymentContent======", findHopperPaymentContent)
        // if (findContent && findHopperPaymentContent) {
        //   const res = await db.updateItem(mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id), Contents, {
        //     // sale_status:"sold",
        //     paid_status_to_hopper: true,
        //     amount_paid_to_hopper: findHopperPaymentContent?.payable_to_hopper,
        //     presshop_committion: findHopperPaymentContent?.presshop_commission,
        //     // purchased_publication: data.media_house_id,
        //   });


        //   const res2 = await db.updateItem(mongoose.Types.ObjectId(findHopperPaymentContent?._id), HopperPayment, {
        //     paid_status_for_hopper: true,
        //   });




        //   const latestcharge = billingPortalSessionCreated?.charge_id
        //   const charge = await stripe.charges.retrieve(latestcharge);
        //   // const charge = paymentIntent.charges.data[0];
        //   // Step 4: Retrieve Fee Details from the Balance Transaction
        //   const balanceTransaction = await stripe.balanceTransactions.retrieve(charge.balance_transaction);
        //   const stripeFeeforAll = balanceTransaction.fee / 100;
        //   console.log("findHopperPaymentContents?.payable_to_hopper =====", billingPortalSessionCreated.payable_to_hopper)
        //   const valueforchat = {
        //     image_id: billingPortalSessionCreated.metadata.product_id,

        //     receiver_id: billingPortalSessionCreated.metadata.user_id,
        //     message_type: "PaymentIntentApp1",
        //     presshop_commission: parseFloat(billingPortalSessionCreated.metadata.application_fee),
        //     stripe_fee: parseFloat(stripeFeeforAll),
        //     amount: findContent.original_ask_price,//(value + parseFloat(newcommistionaddedVat)) - parseFloat(data?.total_details?.amount_discount / 100),
        //     hopper_price: billingPortalSessionCreated.metadata.hopper_price,
        //     payable_to_hopper: billingPortalSessionCreated?.payable_to_hopper ? billingPortalSessionCreated.payable_to_hopper : 0,
        //     paid_status: true
        //   }

        //   const added = await Chat.create(valueforchat);

        //   console.log("dataof 0000000=========create-----", added)
        //   io.to(billingPortalSessionCreated.metadata.product_id).emit("chat message", added)
        // }



        // Then define and call a function to handle the event account.updated
        break;
      case 'account.updated':
        const accountUpdated = event.data.object;
        // Then define and call a function to handle the event account.updated
        break;
      case 'account.application.authorized':
        const accountApplicationAuthorized = event.data.object;
        // Then define and call a function to handle the event account.application.authorized
        break;
      case 'account.application.deauthorized':
        const accountApplicationDeauthorized = event.data.object;
        // Then define and call a function to handle the event account.application.deauthorized
        break;
      case 'account.external_account.created':
        const accountExternalAccountCreated = event.data.object;
        // Then define and call a function to handle the event account.external_account.created
        break;
      case 'account.external_account.deleted':
        const accountExternalAccountDeleted = event.data.object;
        // Then define and call a function to handle the event account.external_account.deleted
        break;
      case 'account.external_account.updated':
        const accountExternalAccountUpdated = event.data.object;
        // Then define and call a function to handle the event account.external_account.updated
        break;
      case 'application_fee.created':
        const applicationFeeCreated = event.data.object;
        // Then define and call a function to handle the event application_fee.created
        break;
      case 'application_fee.refunded':
        const applicationFeeRefunded = event.data.object;
        // Then define and call a function to handle the event application_fee.refunded
        break;
      case 'application_fee.refund.updated':
        const applicationFeeRefundUpdated = event.data.object;
        // Then define and call a function to handle the event application_fee.refund.updated
        break;
      case 'billing_portal.configuration.created':
        const billingPortalConfigurationCreated = event.data.object;
        // Then define and call a function to handle the event billing_portal.configuration.created
        break;
      case 'billing_portal.configuration.updated':
        const billingPortalConfigurationUpdated = event.data.object;
        // Then define and call a function to handle the event billing_portal.configuration.updated
        break;
      case 'charge.updated':
        // const billingPortalSessionCreated = event.data.object;

        console.log("data---------------------in chargeupdated",)



        // const findContent = await Contents.findOne({ _id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id) })
        // console.log("findContent======", findContent)


        // async function waitForHopperPaymentContent(retries = 10, interval = 300) {
        //   let findHopperPaymentContent;
        //   while (retries > 0) {
        //     findHopperPaymentContent = await HopperPayment.findOne({
        //       content_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id),
        //       media_house_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.user_id),
        //     });

        //     if (findHopperPaymentContent) {
        //       return findHopperPaymentContent;
        //     }

        //     // Wait for the specified interval before trying again
        //     await new Promise((resolve) => setTimeout(resolve, interval));
        //     retries--;
        //   }
        //   return null; // Return null if no content found after retries
        // }



        // const findHopperPaymentContent = await waitForHopperPaymentContent();//await HopperPayment.findOne({ content_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id), media_house_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.user_id) })
        // console.log("findHopperPaymentContent======", findHopperPaymentContent)
        // if (findContent && findHopperPaymentContent) {
        //   const res = await db.updateItem(mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id), Contents, {
        //     // sale_status:"sold",
        //     paid_status_to_hopper: true,
        //     amount_paid_to_hopper: findHopperPaymentContent?.payable_to_hopper,
        //     presshop_committion: findHopperPaymentContent?.presshop_commission,
        //     // purchased_publication: data.media_house_id,
        //   });


        //   const res2 = await db.updateItem(mongoose.Types.ObjectId(findHopperPaymentContent?._id), HopperPayment, {
        //     paid_status_for_hopper: true,
        //   });




        //   const latestcharge = billingPortalSessionCreated?.charge_id
        //   const charge = await stripe.charges.retrieve(latestcharge);
        //   // const charge = paymentIntent.charges.data[0];
        //   // Step 4: Retrieve Fee Details from the Balance Transaction
        //   const balanceTransaction = await stripe.balanceTransactions.retrieve(charge.balance_transaction);
        //   const stripeFeeforAll = balanceTransaction.fee / 100;
        //   console.log("findHopperPaymentContents?.payable_to_hopper =====", billingPortalSessionCreated.payable_to_hopper)
        //   const valueforchat = {
        //     image_id: billingPortalSessionCreated.metadata.product_id,

        //     receiver_id: billingPortalSessionCreated.metadata.user_id,
        //     message_type: "PaymentIntentApp1",
        //     presshop_commission: parseFloat(billingPortalSessionCreated.metadata.application_fee),
        //     stripe_fee: parseFloat(stripeFeeforAll),
        //     amount: findContent.original_ask_price,//(value + parseFloat(newcommistionaddedVat)) - parseFloat(data?.total_details?.amount_discount / 100),
        //     hopper_price: billingPortalSessionCreated.metadata.hopper_price,
        //     payable_to_hopper: billingPortalSessionCreated?.payable_to_hopper ? billingPortalSessionCreated.payable_to_hopper : 0,
        //     paid_status: true
        //   }

        //   const added = await Chat.create(valueforchat);

        //   console.log("dataof 0000000=========create-----", added)
        //   io.to(billingPortalSessionCreated.metadata.product_id).emit("chat message", added)
        // }








        // const getProfessionalBookings = await hopperPayment.updateMany(
        //   { content_id: content_id },
        //   { $set: { paid_status_for_hopper: true } }
        // );

        // Then define and call a function to handle the event billing_portal.session.created
        break;
      case 'checkout.session.async_payment_failed':
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_failed

        break;
      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      case 'payment_intent.succeeded':
        const billingPortalSessionCreated = event.data.object;
        const value = await promo_codes.updateOne({ code: billingPortalSessionCreated.metadata.coupon }, { $push: { user_id: billingPortalSessionCreated.metadata.user_id } })
        console.log("checkout.session.completed", billingPortalSessionCreated)

        const findContent = await Contents.findOne({ _id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id) })
        console.log("findContent======", findContent)


        // async function waitForHopperPaymentContent(retries = 10, interval = 300) {
        //   let findHopperPaymentContent;
        //   while (retries > 0) {
        //     findHopperPaymentContent = await HopperPayment.findOne({
        //       content_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id),
        //       media_house_id: mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.user_id),
        //     });

        //     if (findHopperPaymentContent) {
        //       return findHopperPaymentContent;
        //     }

        //     // Wait for the specified interval before trying again
        //     await new Promise((resolve) => setTimeout(resolve, interval));
        //     retries--;
        //   }
        //   return null; // Return null if no content found after retries
        // }



        const findHopperPaymentContent = await HopperPayment.findOne({ content_id: billingPortalSessionCreated.metadata.product_id, media_house_id: billingPortalSessionCreated.metadata.user_id })
        console.log("findHopperPaymentContent======", findHopperPaymentContent)
        if (findContent && findHopperPaymentContent) {
          const res = await db.updateItem(mongoose.Types.ObjectId(billingPortalSessionCreated.metadata.product_id), Contents, {
            // sale_status:"sold",
            paid_status_to_hopper: true,
            amount_paid_to_hopper: findHopperPaymentContent?.payable_to_hopper,
            presshop_committion: findHopperPaymentContent?.presshop_commission,
            // purchased_publication: data.media_house_id,
          });


          const res2 = await db.updateItem(mongoose.Types.ObjectId(findHopperPaymentContent?._id), HopperPayment, {
            paid_status_for_hopper: true,
          });




          const latestcharge = billingPortalSessionCreated?.charge_id
          const charge = await stripe.charges.retrieve(latestcharge);
          // const charge = paymentIntent.charges.data[0];
          // Step 4: Retrieve Fee Details from the Balance Transaction
          const balanceTransaction = await stripe.balanceTransactions.retrieve(charge.balance_transaction);
          const stripeFeeforAll = balanceTransaction.fee / 100;
          console.log("findHopperPaymentContents?.payable_to_hopper =====", billingPortalSessionCreated.payable_to_hopper)
          const valueforchat = {
            image_id: billingPortalSessionCreated.metadata.product_id,

            receiver_id: billingPortalSessionCreated.metadata.user_id,
            message_type: "PaymentIntentApp1",
            presshop_commission: parseFloat(billingPortalSessionCreated.metadata.application_fee),
            stripe_fee: parseFloat(stripeFeeforAll),
            amount: findContent.original_ask_price,//(value + parseFloat(newcommistionaddedVat)) - parseFloat(data?.total_details?.amount_discount / 100),
            hopper_price: billingPortalSessionCreated.metadata.hopper_price,
            payable_to_hopper: billingPortalSessionCreated?.payable_to_hopper ? billingPortalSessionCreated.payable_to_hopper : 0,
            paid_status: true
          }

          const added = await Chat.create(valueforchat);

          console.log("dataof 0000000=========create-----", added)
          io.to(billingPortalSessionCreated.metadata.product_id).emit("chat message", added)
        }


        // const session = await stripe.checkout.sessions.retrieve(
        //   checkoutSessionCompleted.id?.toString()
        // );

        // const notiObj = {
        //   sender_id: user._id,
        //   receiver_id: user._id,
        //   title: "New task posted",
        //   body: `🔔 💰Hey John (insert Username of the Hopper), you have been paid £82 after deducting our commission & applicable fees🤩 Please visit My Earnings to view transactuion details. If you need any asssistance, please email, call or use the chat module on your app, to speak to our helpful team members. Cheers - Team PRESSHOP🐰`,
        //   // is_admin:true
        // };

        // await _sendPushNotification(notiObj);

        // Then define and call a function to handle the event checkout.session.completed
        break;
      case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        await bulkTransaction.deleteMany({user_id:mongoose.Types.ObjectId(checkoutSessionExpired.metadata.user_id)})
        // Then define and call a function to handle the event checkout.session.expired
        break;
      case 'coupon.created':
        const couponCreated = event.data.object;
        // Then define and call a function to handle the event coupon.created
        break;
      case 'coupon.deleted':
        const couponDeleted = event.data.object;
        // Then define and call a function to handle the event coupon.deleted
        break;
      case 'coupon.updated':
        const couponUpdated = event.data.object;
        // Then define and call a function to handle the event coupon.updated
        break;
      case 'credit_note.created':
        const creditNoteCreated = event.data.object;
        // Then define and call a function to handle the event credit_note.created
        break;
      case 'credit_note.updated':
        const creditNoteUpdated = event.data.object;
        // Then define and call a function to handle the event credit_note.updated
        break;
      case 'credit_note.voided':
        const creditNoteVoided = event.data.object;
        // Then define and call a function to handle the event credit_note.voided
        break;
      case 'customer.created':
        const customerCreated = event.data.object;
        // Then define and call a function to handle the event customer.created
        break;
      case 'customer.updated':
        const customerUpdated = event.data.object;
        // Then define and call a function to handle the event customer.updated
        break;
      case 'customer.discount.created':
        const customerDiscountCreated = event.data.object;
        // Then define and call a function to handle the event customer.discount.created
        break;
      case 'customer.discount.deleted':
        const customerDiscountDeleted = event.data.object;
        // Then define and call a function to handle the event customer.discount.deleted
        break;
      case 'customer.source.created':
        const customerSourceCreated = event.data.object;
        // Then define and call a function to handle the event customer.source.created
        break;
      case 'customer.tax_id.created':
        const customerTaxIdCreated = event.data.object;
        // Then define and call a function to handle the event customer.tax_id.created
        break;
      // ... handle other event types
      default:

    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();

  } catch (err) {



    utils.handleError(response, err);
  }
};





// const stripe = require('stripe')('sk_test_...');


// This is your Stripe CLI webhook secret for testing your endpoint locally.

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'account.updated':
//       const accountUpdated = event.data.object;
//       // Then define and call a function to handle the event account.updated
//       break;
//     case 'account.application.authorized':
//       const accountApplicationAuthorized = event.data.object;
//       // Then define and call a function to handle the event account.application.authorized
//       break;
//     case 'account.application.deauthorized':
//       const accountApplicationDeauthorized = event.data.object;
//       // Then define and call a function to handle the event account.application.deauthorized
//       break;
//     case 'account.external_account.created':
//       const accountExternalAccountCreated = event.data.object;
//       // Then define and call a function to handle the event account.external_account.created
//       break;
//     case 'account.external_account.deleted':
//       const accountExternalAccountDeleted = event.data.object;
//       // Then define and call a function to handle the event account.external_account.deleted
//       break;
//     case 'account.external_account.updated':
//       const accountExternalAccountUpdated = event.data.object;
//       // Then define and call a function to handle the event account.external_account.updated
//       break;
//     case 'application_fee.created':
//       const applicationFeeCreated = event.data.object;
//       // Then define and call a function to handle the event application_fee.created
//       break;
//     case 'application_fee.refunded':
//       const applicationFeeRefunded = event.data.object;
//       // Then define and call a function to handle the event application_fee.refunded
//       break;
//     case 'application_fee.refund.updated':
//       const applicationFeeRefundUpdated = event.data.object;
//       // Then define and call a function to handle the event application_fee.refund.updated
//       break;
//     case 'billing_portal.configuration.created':
//       const billingPortalConfigurationCreated = event.data.object;
//       // Then define and call a function to handle the event billing_portal.configuration.created
//       break;
//     case 'billing_portal.configuration.updated':
//       const billingPortalConfigurationUpdated = event.data.object;
//       // Then define and call a function to handle the event billing_portal.configuration.updated
//       break;
//     case 'billing_portal.session.created':
//       const billingPortalSessionCreated = event.data.object;
//       // Then define and call a function to handle the event billing_portal.session.created
//       break;
//     case 'checkout.session.async_payment_failed':
//       const checkoutSessionAsyncPaymentFailed = event.data.object;
//       // Then define and call a function to handle the event checkout.session.async_payment_failed
//       break;
//     case 'checkout.session.async_payment_succeeded':
//       const checkoutSessionAsyncPaymentSucceeded = event.data.object;
//       // Then define and call a function to handle the event checkout.session.async_payment_succeeded
//       break;
//     case 'checkout.session.completed':
//       const checkoutSessionCompleted = event.data.object;
//       // Then define and call a function to handle the event checkout.session.completed
//       break;
//     case 'checkout.session.expired':
//       const checkoutSessionExpired = event.data.object;
//       // Then define and call a function to handle the event checkout.session.expired
//       break;
//     case 'coupon.created':
//       const couponCreated = event.data.object;
//       // Then define and call a function to handle the event coupon.created
//       break;
//     case 'coupon.deleted':
//       const couponDeleted = event.data.object;
//       // Then define and call a function to handle the event coupon.deleted
//       break;
//     case 'coupon.updated':
//       const couponUpdated = event.data.object;
//       // Then define and call a function to handle the event coupon.updated
//       break;
//     case 'credit_note.created':
//       const creditNoteCreated = event.data.object;
//       // Then define and call a function to handle the event credit_note.created
//       break;
//     case 'credit_note.updated':
//       const creditNoteUpdated = event.data.object;
//       // Then define and call a function to handle the event credit_note.updated
//       break;
//     case 'credit_note.voided':
//       const creditNoteVoided = event.data.object;
//       // Then define and call a function to handle the event credit_note.voided
//       break;
//     case 'customer.created':
//       const customerCreated = event.data.object;
//       // Then define and call a function to handle the event customer.created
//       break;
//     case 'customer.updated':
//       const customerUpdated = event.data.object;
//       // Then define and call a function to handle the event customer.updated
//       break;
//     case 'customer.discount.created':
//       const customerDiscountCreated = event.data.object;
//       // Then define and call a function to handle the event customer.discount.created
//       break;
//     case 'customer.discount.deleted':
//       const customerDiscountDeleted = event.data.object;
//       // Then define and call a function to handle the event customer.discount.deleted
//       break;
//     case 'customer.source.created':
//       const customerSourceCreated = event.data.object;
//       // Then define and call a function to handle the event customer.source.created
//       break;
//     case 'customer.tax_id.created':
//       const customerTaxIdCreated = event.data.object;
//       // Then define and call a function to handle the event customer.tax_id.created
//       break;
//     // ... handle other event types
//     default:
//       
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });














exports.applicationfee = async (req, res) => {
  try {
    const data = req.body;
    if (data.type == "content") {







      let applicationfee = 0
      let respon

      if (data.product_id) {
        respon = await Contents.findOne({
          _id: data.product_id,
        }).populate("hopper_id");


        // for pro
        const responseforcategory = await Category.findOne({
          type: "commissionstructure",
          _id: "64c10c7f38c5a472a78118e2",
        }).populate("hopper_id");
        const commitionforpro = parseFloat(responseforcategory.percentage);
        const paybymedihousetoadmin = data.amount_paid

        //  end
        // for amateue
        const responseforcategoryforamateur = await Category.findOne({
          type: "commissionstructure",
          _id: "64c10c7538c5a472a78118c0",
        }).populate("hopper_id");
        const commitionforamateur = parseFloat(
          responseforcategoryforamateur.percentage
        );
        const paybymedihousetoadminforamateur = data.amount_paid
        const paybymedihousetoadminforPro = data.amount_paid





        if (respon.hopper_id.category == "pro") {
          const paid = commitionforpro * paybymedihousetoadminforPro;//paybymedihousetoadmin;
          const percentage = paid / 100;
          const paidbyadmin = paybymedihousetoadmin - percentage;


          applicationfee = parseFloat(percentage) + parseFloat(data.commission)

        } else if (respon.hopper_id.category == "amateur") {
          const paid = commitionforamateur * paybymedihousetoadminforamateur;
          const percentage = paid / 100;

          const paidbyadmin = paybymedihousetoadminforamateur - percentage;

          applicationfee = parseFloat(percentage) + parseFloat(data.commission)
        } else {
          console.log(" not found")
        }





      }




      return res.status(200).json({ data: applicationfee, stripe_account_id: respon.hopper_id?.stripe_account_id, code: 200 })
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



exports.contentonlineCard = async (req, res) => {
  try {
    const data = req.query;
    const weekStart = new Date(moment().utc().startOf("week").format());
    const weekEnd = new Date(moment().utc().endOf("week").format());
    // ------------------------------------today fund invested -----------------------------------
    const yesterdayStart = new Date(moment().utc().startOf("day").format());
    const yesterdayEnd = new Date(moment().utc().endOf("day").format());
    const month = new Date(moment().utc().startOf("month").format());
    const monthend = new Date(moment().utc().endOf("month").format());
    const year = new Date(moment().utc().startOf("year").format());
    const yearend = new Date(moment().utc().endOf("year").format());
    let coindition;
    if (req.query.type == "weekly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: weekEnd,
          $gte: weekStart,
        },
      };
    } else if (req.query.type == "daily") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yesterdayEnd,
          $gte: yesterdayStart,
        },
      };
    } else if (req.query.type == "yearly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: yearend,
          $gte: year,
        },
      };
    } else if (req.query.type == "monthly") {
      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        createdAt: {
          $lte: monthend,
          $gte: month,
        },
      };
    }
    else {

      coindition = {
        media_house_id: mongoose.Types.ObjectId(req.user._id),
        type: "content",
        // updatedAt: {
        //   $lte: yesterdayEnd,
        //   $gte: yesterdayStart,
        // },
      };
    }


    const getcontentonline = await HopperPayment.find(coindition)
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
          populate: {
            path: "avatar_id",
          },
        },
        // select: { _id: 1, content: 1, createdAt: 1, updatedAt: 1 },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "category_id",
        },
      })
      .sort({ createdAt: -1 }).limit(3).skip(req.query.offset ? parseInt(req.query.offset) : 0);
    const getcontentonlineCount = await HopperPayment.countDocuments(coindition)
    return res.status(200).json({ data: getcontentonline, count: getcontentonlineCount, code: 200 })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}





// const promo_codes = require("../models/promo_codes")

exports.checkPromocode = async (req, res) => {
  try {
    const data = req.body;
    const value = await promo_codes.findOne({ code: data.code })

    if (!value) {
      return res.status(400).json({ message: "Promocode not found", code: 400 })
    }

    if (value.user_id && value.user_id.includes(req.user._id)) {
      return res.status(400).json({ message: "User has already used this promocode", code: 400 });
    }

    if (value && value.expires_at > new Date().getTime()) {


      return res.status(200).json({ data: value, code: 200 })
    } else if (value.expires_at < new Date().getTime()) {
      return res.status(400).json({ message: "Promocode expired", code: 400 })
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



exports.contentaverageprice = async (req, res) => {
  try {
    const data = req.body;


    const newaveragetesttotals = await Contents.aggregate([

      {
        $match: {
          "Vat.purchased_mediahouse_id": mongoose.Types.ObjectId(req.user._id)?.toString(),
        }
      },



      {
        $lookup: {
          from: "users",
          localField: "hopper_id",
          foreignField: "_id",
          as: "hopper_id", // Rename the result to "hopper_id" within the data object
        },
      },

      {
        $unwind: { path: "$hopper_id", preserveNullAndEmptyArrays: true }, // Unwind the hopper_id array
      },
      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     localField: "data.transaction_id",
      //     foreignField: "_id",
      //     as: "data.transaction_id", // Rename the result to "hopper_id" within the data object
      //   },
      // },
      // {
      //   $unwind: "$data.transaction_id", // Unwind the hopper_id array
      // },
      {
        $lookup: {
          from: "avatars", // Replace "avatars" with the actual collection name where avatars are stored
          localField: "hopper_id.avatar_id",
          foreignField: "_id",
          as: "hopper_id.avatar_id", // Rename the result to "avatar_id" within the hopper_id object
        },
      },
      {
        $unwind: "$hopper_id.avatar_id", // Unwind the hopper_id array
      },

      {
        $lookup: {
          from: "categories", // Replace "avatars" with the actual collection name where avatars are stored
          localField: "category_id",
          foreignField: "_id",
          as: "category_id", // Rename the result to "avatar_id" within the hopper_id object
        },
      },
      {
        $unwind: "$category_id", // Unwind the hopper_id array
      },
      // {
      //   $addFields: {
      //     amountValue: {
      //       $cond: {
      //         if: { $isArray: "$Vat" }, // Check if Vat is an array
      //         then: {
      //           $map: {
      //             input: {
      //               $filter: {
      //                 input: "$Vat",
      //                 as: "v",
      //                 cond: {
      //                   $eq: ["$$v.purchased_mediahouse_id", mongoose.Types.ObjectId(req.user._id)?.toString()]
      //                 }
      //               }
      //             },
      //             as: "filteredVat",
      //             in: {
      //               $toDouble: "$$filteredVat.amount" // Convert filtered amount to double
      //             }
      //           }
      //         },
      //         else: { $toDouble: "$Vat.amount" } // If Vat is not an array, use it directly and convert to double
      //       }
      //     }
      //   },



      // },


      {
        $addFields: {
          amountValue: {
            $cond: {
              if: { $isArray: "$Vat" }, // Check if Vat is an array
              then: {
                $reduce: {
                  input: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$Vat",
                          as: "v",
                          cond: {
                            $eq: ["$$v.purchased_mediahouse_id", mongoose.Types.ObjectId(req.user._id)?.toString()]
                          }
                        }
                      },
                      as: "filteredVat",
                      in: {
                        $toDouble: "$$filteredVat.amount_without_Vat" // Convert filtered amount to double
                      }
                    }
                  },
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this"] } // Sum up all amounts in the filtered array
                }
              },
              else: { $toDouble: "$Vat.amount_without_Vat" } // If Vat is not an array, use it directly and convert to double
            }
          }
        }
      },



      {
        $addFields: {
          amountValueWithVat: {
            $cond: {
              if: { $isArray: "$Vat" }, // Check if Vat is an array
              then: {
                $reduce: {
                  input: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$Vat",
                          as: "v",
                          cond: {
                            $eq: ["$$v.purchased_mediahouse_id", mongoose.Types.ObjectId(req.user._id)?.toString()]
                          }
                        }
                      },
                      as: "filteredVat",
                      in: {
                        $toDouble: "$$filteredVat.amount" // Convert filtered amount to double
                      }
                    }
                  },
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this"] } // Sum up all amounts in the filtered array
                }
              },
              else: { $toDouble: "$Vat.amount" } // If Vat is not an array, use it directly and convert to double
            }
          }
        }
      },


      {
        $addFields: {
          contentsize: {
            $size: "$content"
          }
        }
      },
      // {
      //   $project: {
      //     _id: 1, // Replace with your group field or other identifier
      //     amountValue: {
      //       $cond: {
      //         if: { $isArray: "$Vat.amount" },
      //         then: { $arrayElemAt: ["$Vat.amount", 0] }, // Get the first element if array
      //         else: "$Vat.amount" // Use value directly if not an array
      //       }
      //     }
      //   }
      // },
      // Convert amountValue to double
      // {
      //   $addFields: {
      //     amountValue: { $toDouble: "$amountValue" } // Convert amountValue to double
      //   }
      // },
      // Group by a unique identifier (replace `content_group` with your field)
      {
        $group: {
          _id: "$_id",
          contentsize: { $sum: "$contentsize" },
          amountValue: { $sum: "$amountValueWithVat" },// Replace with the field that groups contents (e.g., category or other field)
          totalAmountPaid: { $avg: "$amountValueWithVat" }, // Calculate average after conversion
          count: { $sum: 1 } // Count the number of entries in each group
        }
      },
      // Calculate the overall average of the individual group averages
      {
        $group: {
          _id: null,
          content: { $sum: "$contentsize" },
          totalpaid: { $sum: "$amountValue" },
          totalPrics: { $sum: "$totalAmountPaid" },
          // overallAverage: {
          //   $divide: [
          //     { $ifNull: ["$totalpaid", 0] },
          //     { $ifNull: ["$content", 1] } // Prevent division by zero
          //   ]
          // },
          // overallAverage: { $avg: "$totalAmountPaid" }, // Average of all group averages
          totalGroups: { $sum: 1 },// Total number of groups
          data: { $push: "$$ROOT" }
        }
      },

      {
        $project: {
          overallAverage: {
            $divide: [
              { $ifNull: ["$totalpaid", 0] },
              { $ifNull: ["$content", 1] } // Prevent division by zero
            ]
          },
          content: 1,
          totalpaid: 1,
          data: 1
        }
      },
      // Project final result
      // {
      //   $project: {
      //     _id: 0,
      //     overallAverage: 1,
      //     totalGroups: 1,
      //   }
      // },
      {
        $sort: { createdAt: -1 }
      }
    ]);


    res.status(200).json({ data: newaveragetesttotals[0]?.overallAverage, count: newaveragetesttotals[0]?.content, totalpaid: newaveragetesttotals[0]?.totalpaid })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const notificationTemplates = {
  // Content Management
  contentUpload: {
  appUser: {
  title: "Content Upload Notification",
  body: "👋🏼 Hey {{username}}, thank you for uploading your content. Our team are reviewing the content & may need to speak to you. Please have your phone handy. Cheers - Team PRESSHOP"
  },
  adminPanel: {
  title: "New Content Upload",
  body: "Content uploaded - {{username}} has uploaded a new content for £{{price}}"
  }
  },
  contentPublished: {
  appUser: {
  title: "Content Published Successfully",
  body: "🔔 Congrats {{username}}, your content is now successfully published. Please check My Content on your app to view any offers from the publications. Happy selling"
  },
  marketplace: {
  title: "New Content Available",
  body: "🔔 Hiya guys, please check out the new {{category}} content uploaded on the platform. This content is {{licenseType}} and the asking price is £{{price}}. Please visit your Feed section on the platform to view, negiotiate, chat or instantly buy the content 🐰"
  },
  adminPanel: {
  title: "Content Published",
  body: "Content published - {{username}}'s content has been cleared and published for £{{price}}"
  }
  },
  contentRejected: {
  appUser: {
  title: "Content Rejected",
  body: "🚫 Hi {{username}}, your content was rejected as it didn't pass verification. Check our FAQs or tutorials to learn more. Please contact us if you need to speak. Cheers❤️"
  }
  },
  contentDeleted: {
  appUser: {
  title: "Content Deleted",
  body: "🚫 Hi {{username}}, your content has been deleted. If you would like to have a chat, please contact our helpful team members. Thanks - Team PRESSHOP🐰"
  },
  marketplace: {
  title: "Content Removed",
  body: "🚫 Hi guys, this content has been deleted and is no longer available. If you would like to discuss, please contact our helpful team members. Thanks - Team PRESSHOP🐰"
  }
  },
  // Offers and Transactions
  offerReceived: {
  appUser: {
  title: "New Offer Received",
  body: "🤑 You have received an offer of £{{price}} from {{publication}}. Visit My Content to accept, reject or make a counteroffer. Let's do this"
  },
  marketplace: {
  title: "Offer Sent",
  body: "👋🏼 Hey guys, thank you for your generous offer of £{{price}}. We will keep you informed when {{username}} accepts, rejects or makes a counter offer. Cheers"
  },
  adminPanel: {
  title: "New Offer",
  body: "Offer received - {{username}} has received an offer for £{{price}} from {{publication}}"
  }
  },
  counterOffer: {
  appUser: {
  title: "Counter Offer Made",
  body: "👋🏼 Hi {{username}}, thank you for making your counter offer of £{{price}} to {{publication}}. We will update you shortly with their decision. Fingers crossed 🤞🏼"
  },
  marketplace: {
  title: "Counter Offer Received",
  body: "{{username}} has made a final counter offer of £{{price}} for the content. Please accept and pay to purchase the content or reject the offer. Thanks 😊🤟🏼"
  },
  adminPanel: {
  title: "Counter Offer Made",
  body: "Counter offer made - {{username}} has made a final counter offer for £{{price}} to {{publication}} for the content"
  }
  },
  contentSold: {
  appUser: {
  title: "Content Sold Successfully",
  body: "🔔 Congrats {{username}}, you have received £{{price}} from {{publication}}. VIsit My Earnings on your app to manage and track your payments🤟🏼"
  },
  marketplace: {
  title: "Purchase Successful",
  body: "👋🏼 Hiya, congratulations on purchasing the content for £{{price}}. Please download and use the HD content without any watermark. If you have any issues, please contact Team PRESSHOP and we will be happy to assist 🐰"
  },
  adminPanel: {
  title: "Sale Complete",
  body: "Content purchased - {{username}} has received a payment of £{{price}} from {{publication}}"
  }
  },
  // Task Management
  newTask: {
  marketplace: {
  title: "New Task Posted",
  body: "👋🏼 Hey team, thank you for posting the task. You can keep a track of your live tasks from the Tasks section on the platform. If you need any assistance with your task, please call, email or use the instant chat module to speak with our helpful team 🤩"
  }
  },
  taskAccepted: {
  appUser: {
  title: "Task Accepted",
  body: "Fab 🎯🙌🏼 You have accepted a task from {{publication}}. Please visit My Tasks on your app to navigate to the location, and upload pics, videos or interviews. Good luck, and if you need any support, please use the Chat module to instantly reach out to us🐰"
  }
  },
  // User Management
  welcome: {
  appUser: {
  title: "Welcome to PRESSHOP",
  body: "👋🏼 Hi {{username}}, welcome to PRESSHOP 🐰 Thank you for joining our growing community 🙌🏼 Please check our helpful tutorials or handy FAQs to learn more about the app. If you wish to speak to our helpful team members, you can call, email or chat with us 24 x 7. Cheers🚀"
  },
  marketplace: {
  title: "Welcome to PRESSHOP",
  body: "👋🏼 Hi {{fullName}}, great to have you aboard. Thank you for joining our growing community of publications 🙌🏼 🤩 Please check our helpful tutorials, or handy FAQs to learn more about the platform. If you wish to speak to our helpful team members, you can call, email or instantly chat with us on the platform. Cheers -Team PRESSHOP 🐰"
  },
  admin: {
  title: "Welcome to PRESSHOP Team",
  body: "👋🏼 Hi {{fullName}}, welcome aboard our growing family🚀 We look forward to working closely with you, and growing together. All the best - Team PRESSHOP🐰"
  }
  },
  profileUpdated: {
  all: {
  title: "Profile Updated",
  body: "👋🏼 Hi {{name}}, your updated profile is looking fab🤩 Cheers - Team PRESSHOP 🐰"
  }
  },
  // Security
  passwordReset: {
  all: {
  title: "Password Reset",
  body: "👋🏼 Hi {{name}}, you've got mail 📩 Please check your resgistered email id, and reset your password 🔒 Thanks - Team PRESSHOP🐰"
  }
  },
  passwordChanged: {
  all: {
  title: "Password Changed",
  body: "👋🏼 Hi {{name}}, your new password is successfully updated 🔒 Thanks - Team PRESSHOP🐰"
  }
  },
  // PRO Status
  proDocuments: {
  appUser: {
  title: "PRO Documents Received",
  body: "👋🏼 Hi {{username}}, thank you for updating your documents for qualifying as a PRO. Once we finish reviewing, we will get back to you ASAP 👍🏼 Team PRESSHOP🐰"
  }
  },
  proApproved: {
  appUser: {
  title: "PRO Status Approved",
  body: "👋🏼 Congratulations {{username}}, you documents have been approved, and you are now a PRO 🤩. Please visit the FAQs section on your app, and check the PRO benefits. If you have any questions, please contact our helpful team who will be happy to assist you. Cheers - Team PRESSHOP🐰"
  }
  }
  };
  async function generateNotification(type, recipient, data) {
    // Get the template for the specified type and recipient
    const template = notificationTemplates[type]?.[recipient] || 
                    notificationTemplates[type]?.['all'];
  
    if (!template) {
      throw new Error(`Template not found for type: ${type} and recipient: ${recipient}`);
    }
  
    // Function to replace placeholders in text
    const replacePlaceholders = (text, data) => {
      return text.replace(/{{(.*?)}}/g, (_, key) => {
        const value = data[key.trim()];
        return value !== undefined ? value : '';
      });
    };
  
    // Generate notification content
    const title = replacePlaceholders(template.title, data);
    const body = replacePlaceholders(template.body, data);
  
    // Prepare notification object
    const notificationObj = {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      title,
      body,
      type,
      recipient, // Adding recipient type for tracking
      metadata: data.metadata || {}, // Optional metadata
      timestamp: new Date().toISOString()
    };
  
    try {
      const result = await _sendPushNotification(notificationObj);
      return result;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }
  
  // Example usage:
  /*
  // Content upload notification to app user
  await generateNotification('contentUpload', 'appUser', {
    sender_id: 'system',
    receiver_id: 'user123',
    username: 'John',
    metadata: {
      contentId: 'content123'
    }
  });
  
  // Welcome notification to marketplace user
  await generateNotification('welcome', 'marketplace', {
    sender_id: 'system',
    receiver_id: 'pub123',
    fullName: 'Alice Smith',
  });
  
  // Content sold notification to all parties
  const saleData = {
    sender_id: 'system',
    username: 'John',
    publication: 'Daily Mail',
    price: '200',
  };
  
  // Send to app user
  await generateNotification('contentSold', 'appUser', {
    ...saleData,
    receiver_id: 'user123'
  });
  
  // Send to marketplace
  await generateNotification('contentSold', 'marketplace', {
    ...saleData,
    receiver_id: 'pub123'
  });
  
  // Send to admin panel
  await generateNotification('contentSold', 'adminPanel', {
    ...saleData,
    receiver_id: 'admin'
  });
  */
  
  // Error handling wrapper
  async function sendNotification(type, recipient, data) {
    try {
      const result = await generateNotification(type, recipient, data);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
  }



  exports.updatePreRegistrationForm = async (req, res) => {
    try {
      const data = req.body;
      data.user_id = req.user._id
      const resdata = new pre_registration_form(data);
      await resdata.save();
  
  
      // const added = await rating.create({
      //   from: data.user_id,
      //   to: mongoose.Types.ObjectId("64bfa693bc47606588a6c807"),
      //   // content_id: msg.image_id,
      //   type: "testimonial",
      //   features: data.features,
      //   review: data.description,
      //   rating: data.rate,
      //   sender_type: "Mediahouse",
      //   // is_rated: true
      // });
      return res.status(200).json({ message: "Data saved successfully", code: 200 })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  // exports.preRegistration=async (req,res)=>{
  //   try{
  //     const email=req.query.email;
  //     const data=req.body;
  //     console.log("data",data);
  //     const promiseData=await Promise.all(data.map(async (element) => {
  //       if (element?.step1) {
  //         console.log(element?.step1)
  //         await PreRegistrationData.findOneAndUpdate(
  //           { email: email },
  //           { $set: { step1: element.step1 } }, 
  //           { new: true, upsert: true } 
  //         );
  //       }
  //       // Add similar checks for step2, step3 if required
  //     }));

  //     console.log("promiseData",promiseData)
  
  //     res.status(200).json({ message: 'Pre-registration data updated successfully.' });
  //   }catch (error) {
  //     console.log("error-----", error);
  //     utils.handleError(res, error);
  //   }
  // }

  exports.preRegistration = async (req, res) => {
    try {
      const email = req.query.email;
      const data = req.body; 
      console.log("data", data);
  
      
      const promiseData = await Promise.all(
        data.map(async (element) => {
          if (element?.step1) {
            console.log("Updating step1:", element.step1);
            return await PreRegistrationData.findOneAndUpdate(
              { email: email },
              { $set: { step1: element.step1 } },
              { new: true, upsert: true }
            );
          }
      
          return null; 
        })
      );
  
      console.log("promiseData", promiseData); // Should show results of `findOneAndUpdate` or nulls
  
      res.status(200).json({ message: 'Pre-registration data updated successfully.', data: promiseData });
    } catch (error) {
      console.log("error-----", error);
      utils.handleError(res, error);
    }
  };

  
  

// exports.getPreRegistrationData = async (req, res) => {
//   try {
    
//     const data = await PreRegistrationData.findOne({});
//        console.log("data ----->   ----->   ------>",data)
//     if (!data) {
//       return res.status(404).json({ error: "No data found for this email." });
//     }

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Error retrieving data:", error);
//     utils.handleError(res, error); // Handle the error appropriately
//   }
// };

exports.getPreRegistrationData = async (req, res) => {
  try {

    const email = req.query.email;


    console.log("myemail ----->",email)
    
    if (!email) {
      return res.status(400).json({ error: "Email is required to retrieve data." });
    }
    const data = await PreRegistrationData.find({ email: email });
    // const data = await PreRegistrationData.find({});
    console.log("data ----->", data);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No data found." });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    utils.handleError(res, error);
  }
};

