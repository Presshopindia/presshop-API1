// const uuid = require("uuid");
const { matchedData } = require("express-validator");
const ffmpeg = require("fluent-ffmpeg");
// const ffmpeg = require("ffmpeg");
// var ffprobe = require('ffprobe')
// const ffprobe = require('@ffprobe-installer/ffprobe');
// ffprobeStatic = require('ffprobe-static');
const addEmailRecord = require("../models/email");
const recentactivity = require("../models/recent_activity");
const utils = require("../middleware/utils");
const { uploadFiletoAwsS3Bucket } = require("../shared/helpers");
const db = require("../middleware/admin_db");
const jwt = require("jsonwebtoken");
const { addHours } = require("date-fns");
const auth = require("../middleware/auth");
const emailer = require("../middleware/emailer");
var mongoose = require("mongoose");
const thumbsupply = require("thumbsupply");
const bcrypt = require('bcrypt');
const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 5;
const fs = require("fs");
const STORAGE_PATH = process.env.STORAGE_PATH;
const STORAGE_PATH_HTTP = process.env.STORAGE_PATH_HTTP;
var mime = require("mime-types");
const XLSX = require("xlsx");
var path = require("path");
const AWS = require('aws-sdk');
const ACCESS_KEY = "AKIAVOXE3E6KGIDEVH2F"; //process.env.ACCESS_KEY
const SECRET_KEY = "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";//process.env.SECRET_KEY
const Bucket = "uat-presshope";  //process.env.Bucket
const REGION = "eu-west-2";  //process.env.REGION


const s3Bucket = 'uat-presshope'

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION, // For example, 'us-east-1'
});

// Create an instance of the S3 service
var s3 = new AWS.S3();





// Models
const FcmDevice = require("../models/fcm_devices");
const stripe = require("stripe")(
  process.env.STRIPE
);
// ("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")


// ("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")

// (
//   "sk_test_51NITL2AKmuyBTjDNklngpSDGnQK7JQjVzXh5cZdzyeAKf0zJiloShxogUofJ8417gRCn83SmyGx0Bz5cqhusNP1S00fIDDFmW9"
// );
const notification = require("../models/notification");
const notify = require("../middleware/notification");
const User = require("../models/user");
const SourcedpublicationviewDetails = require("../models/editSourcecontentViewdetails");
const priceTipforquestion = require("../models/priceTipsforQuestion");
const purchasedpublicationviewDetailsHistoey = require("../models/historyPurchasedviewdetails");
const livetaskhistory = require("../models/livetaskHistory");
const hopperviewPublishedHistory = require("../models/hopperviewPublishedHistory");
const hopperviewPublishedHistoryforviewDetails = require("../models/historyforHopperviewDetailsuploadedcontenthistory");
const addactiondetails = require("../models/addActiondetails");
const addcommitionstr = require("../models/commissionStructure");
const MediaHouse = require("../models/media_houses");
const typeofDocs = require("../models/typeofDocs");
const Hopper = require("../models/hopper");
const Onboard = require("../models/onboard");
const Admin = require("../models/admin");
const CMS = require("../models/cms");
const employHistory = require("../models/employHistory");
const Avatar = require("../models/avatars");
const PriceTipAndFAQ = require("../models/priceTips_and_FAQS");
const Category = require("../models/categories");
const HopperMgmtHistory = require("../models/hopperMgmtHistory");
const mediaHousetaskHistory = require("../models/mediaHousetaskHistory");
const ContnetMgmtHistory = require("../models/contentMgmtHistory");
const PublicationMgmtHistory = require("../models/publicationMgmtHistory");
const Contents = require("../models/contents");
const AdminOfficeDetail = require("../models/adminOfficeDetail");
const PublishedContentSummery = require("../models/publishedContentSummery");
const hopperPayment = require("../models/hopperPayment");
const invoiceHistory = require("../models/invoiceHistory");
const Content = require("../models/contents");
const BroadCastTask = require("../models/mediaHouseTasks");
const BroadCastHistorySummery = require("../models/broadCastHistorySummery");
const Faq = require("../models/faqs");
const Tag = require("../models/tags");
const trendingSearch = require("../models/trending_search");
const Privacy_policy = require("../models/privacy_policy");
const Legal_terms = require("../models/legal_terms");
const Tutorial_video = require("../models/tutorial_video");
const Docs = require("../models/docs");
const PurchasedContentHistory = require("../models/purchasedContentHistory");
const SourceContentHistory = require("../models/sourceContentHistory");
const Price_tips = require("../models/price_tips");
const Commission_structure = require("../models/commission_structure");
const Selling_price = require("../models/selling_price");
const Room = require("../models/room");
const PublishedContentHopperHistory = require("../models/publishedContentHopperHistory");
const uploadedContenthistoryHopper = require("../models/uploadedContenthistoryHopper");
const uploadedContentHopperHistory = require("../models/uploadedContentHopperHistory");
const uploadedContent = require("../models/uploadContent");
const moment = require("moment");
const PublishedContentSummeryHistory = require("../models/LivepublishedcontentHistory");
const accepted_tasks = require("../models/acceptedTasks");
const liveuploadedcontent = require("../models/liveuploadedcontenthistory");
const { MaxKey } = require("bson");
const { PassThrough } = require("stream");
const exp = require("constants");
const { log, Console } = require("console");
const { ADDRGETNETWORKPARAMS } = require("dns");
const startOfmonth = new Date(moment().utc().startOf("month").format());
const endOfmonth = new Date(moment().utc().endOf("month").format());
const startOfPrevMonth = new Date(moment().utc().subtract(1, "month").startOf("month").format());
const endOfPrevMonth = new Date(moment().utc().subtract(1, "month").endOf("month").format());
/*********************
 * Private functions *
 *********************/
// notification function -----------------------------------------------------

const _sendNotification = async (data) => {
  console.log(
    "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
    data
  );
  if (data) {
    Admin.findOne({
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
            // is_admin:true
          };
          try {
            console.log(
              "--------------- N O T I - - O B J ------",
              notificationObj
            );


            
            const findnotifivation = await notification.findOne(notificationObj)

            if (findnotifivation) {
               console.log("findnotifivation: ", mongoose.Types.ObjectId(findnotifivation._id));
              await notification.updateOne({ _id: mongoose.Types.ObjectId(findnotifivation._id) }, { createdAt: new Date() })
            } else {
              const create = await db.createItem(notificationObj, notification);
              // console.log("create: ", create);
            }
          } catch (err) {
            console.log("main err: ", err);
          }

          // console.log("Before find user device");

          const log = await FcmDevice.find({
            user_id: data.receiver_id,
          })
            .then(
              async (fcmTokens) => {
                console.log("fcmTokens", fcmTokens);
                if (fcmTokens) {
                  const device_token = fcmTokens.map((ele) => ele.device_token);
                  console.log(device_token);
                  // try {
                  //   console.log(
                  //     "--------------- N O T I - - O B J ------",
                  //     notificationObj
                  //   );

                  //   await db.createItem(notificationObj, notification);
                  // } catch (err) {
                  //   console.log("main err: ", err);
                  // }



                  const r = notify.sendPushNotificationforAdmin(
                    device_token,
                    data.title,
                    data.body,
                    notificationObj
                  );

                  // try {
                  //   console.log(
                  //     "--------------- N O T I - - O B J ------",
                  //     notificationObj
                  //   );

                  //   await db.createItem(notificationObj, notification);
                  // } catch (err) {
                  //   console.log("main err: ", err);
                  // }
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
    );
  } else {
    throw utils.buildErrObject(422, "--* no type *--");
  }
};


exports._sendPushNotification = async (data) => {
  console.log(
    "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
    data
  );
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
              // if (data.create) {
              //   // * create in db
              //   delete data.create;
              //   console.log(
              //     "--------------- N O T I - - O B J ------",
              //     notificationObj
              //   );
              //   await models.Notification.create(notificationObj);
              // }

              try {
                // console.log(
                //   "--------------- N O T I - - O B J ------",
                //   notificationObj
                // );
                let notificationObj = {
                  sender_id: data.sender_id ? data.sender_id :"64bfa693bc47606588a6c807" ,
                  receiver_id: mongoose.Types.ObjectId(data.user_id),
                  title: data.title,
                  body: data.description,
                };
                await db.createItem(notificationObj, notification);
              } catch (err) {
                console.log("main err: ", err);
              }

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

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */

async function uploadImage(object) {
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

function removeHTMLTags(input) {
  return input.replace(/<[^>]+>/g, "");
}





async function downloadCsv(workSheetColumnNames, response) {
  return new Promise((resolve, reject) => {
    try {
      const data = [
        workSheetColumnNames, ...response
      ];
      const workSheetName = "user";
      const filePath = "/excel_file/" + Date.now() + ".csv";
      const workBook = XLSX.utils.book_new(); //Create a new workbook
      const worksheet = XLSX.utils.aoa_to_sheet(data); //add data to sheet
      XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
      XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
      resolve(STORAGE_PATH_HTTP + filePath);
    } catch (error) {
      reject(utils.buildErrObject(422, error.message));
    }
  });
}

/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateCMSForHopper = async (req, res) => {
  try {
    let updatedCMS;
    const data = req.body;
    const findCMS = await db.getItemCustom(
      { type: data.type, role: data.role },
      CMS
    );
    if (findCMS) {
      updatedCMS = await db.updateItem(findCMS._id, CMS, data);
    } else {
      updatedCMS = await db.createItem(data, CMS);
    }
    res.status(200).json({
      data: updatedCMS,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getCMS = async (req, res) => {
  try {
    const data = req.params;
    const findCMS = await db.getItemCustom({ type: data.type, role: data.role }, CMS);
    res.status(200).json({
      data: findCMS,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.checkIfUserNameExist = async (req, res) => {
  try {
    const data = req.params;
    const respon = await db.getItemCustom({ user_name: data.username }, Hopper);
    res.status(200).json({
      code: 200,
      userNameExist: respon ? true : false,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.checkIfEmailExist = async (req, res) => {
  try {
    const data = req.params;
    const respon = await db.getItemCustom({ email: data.email }, User);
    res.status(200).json({
      code: 200,
      emailExist: respon ? true : false,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.checkIfPhoneExist = async (req, res) => {
  try {
    const data = req.params;
    const respon = await db.getItemCustom({ phone: data.phone }, User);
    res.status(200).json({
      code: 200,
      phoneExist: respon ? true : false,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getAvatars = async (req, res) => {
  try {
    const data = req.query;
     
    const allavatarList =  await Avatar.countDocuments()
    const allavat =  await Avatar.find({ deletedAt: false }).sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);
    // const response = await db.getItemsforAvatar(
    //   Avatar,
    //   { deletedAt: false },
    //   { createdAt: -1 },
    //   data.limit,
    //   data.offset
    // );
    res.status(200).json({
      base_url: `https://uat-presshope.s3.eu-west-2.amazonaws.com/public/avatarImages`,
      count:allavatarList,
      response: allavat,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getHopperList = async (req, res) => {
  try {
    const data = req.query;

    const response = await db.getHopperList(Hopper, data);

    const workSheetColumnName = [
      "hopper details",
      "time and date ",
      "adress",
      "contact details",
      "category",
      "rating",
      "uploaded docs",
      "banking details",
      "is legal",
      "is check and approve",
      "mode",
      "status",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = response.hopperList;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        hppername,
        formattedDate,
        val.address,
        contactdetails,
        val.category,
        "4.1",
        val.doc_to_become_pro,
        val.bank_detail,
        legal,
        Checkandapprove,
        val.mode,
        val.status,
        val.latestAdminRemark,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      response: response,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getHopperById = async (req, res) => {
  try {
    const data = req.params;

    const hopperDetail = await db.getHopperById(Hopper, data);

    res.status(200).json({
      code: 200,
      hopperDetail: hopperDetail,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.addAvatar = async (req, res) => {
  try {
    const reqData = req.body;
    if (req.files && Array.isArray(req.files.avatars)) {
      for await (const data of req.files.avatars) {
        const upload = await uploadFiletoAwsS3Bucket({
          fileData: data,
          path: `public/avatarImages`,
        });
        reqData.avatar = upload.fileName
        await db.createItem(reqData, Avatar);
      }
    } else if (req.files && !Array.isArray(req.files.avatars)) {
      const upload = await uploadFiletoAwsS3Bucket({
        fileData: req.files.avatars,
        path: `public/avatarImages`,
      });
      reqData.avatar = upload.fileName
      await db.createItem(reqData, Avatar);
    } else {
      throw utils.buildErrObject(422, "Please send atleast one image");
    }
    res.status(200).json({
      code: 200,
      uploaded: true,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    // const data = req.body;
    // const ifAvatarIsAlreadyUsed = await db.getItemCustom(
    //   { avatar_id: data.avatar_id },
    //   Hopper
    // );
    // console.log("ifAvatarIsAlreadyUsed==>", ifAvatarIsAlreadyUsed);
    // if (ifAvatarIsAlreadyUsed)
    //   throw utils.buildErrObject(422, "This Avatar is taken by some users");
    // const deleteAvatar = await db.deleteItem(data.avatar_id, Avatar)

    var data = req.body;
    console.log("==================>", data);
    const respon = await db.deleteAvtarbyAdmin(Avatar, data);

    res.status(200).json({
      code: 200,
      deleted: respon,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editHopper = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updateHopperObj = {
      latestAdminUpdated: new Date(),
      category: data.category,
      status: data.status,
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      latestAdminRemark: data.latestAdminRemark,
      mode: data.mode,
      user_id: req.user._id,
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updateHopperObj.checkAndApprove = data.checkAndApprove;
    }

    if (data.status == "approved") {
      const findallpublication = await User.findOne({ _id:mongoose.Types.ObjectId(data.hopper_id)})
      const notiObj = {
        sender_id: req.user._id,
        receiver_id: data.hopper_id,
        // data.receiver_id,
        title: "Welcome to the tribe",
        body: `👋🏼 Hi ${findallpublication.user_name} Welcome to PRESSHOP 🐰 Thank you for joining our growing community 🙌🏼 Please check our helpful tutorials or handy FAQs to learn more about the app. If you wish to speak to our helpful team members, you can call, email or chat with us 24 x 7. Cheers🚀`,
      };
      console.log(notiObj);
      const resp = await _sendNotification(notiObj);
    }

    if (data.category == "pro") {
      const findallpublication = await User.findOne({ _id:mongoose.Types.ObjectId(data.hopper_id)})
      const notiObj = {
        sender_id: req.user._id,
        receiver_id: data.hopper_id,
        // data.receiver_id,
        title: "You're a PRO now",
        body: `👋🏼 Congratulations ${findallpublication.user_name}, you documents have been approved, and you are now a PRO 🤩. Please visit the FAQs section on your app, and check the PRO benefits. If you have any questions, please contact our helpful team who will be happy to assist you. Cheers - Team PRESSHOP🐰 `,
      };
      console.log(notiObj);
      const resp = await _sendNotification(notiObj);
    }

    const createAdminHistory = {
      admin_id: req.user._id,
      hopper_id: data.hopper_id,
      role: req.user.role,
      status: data.status,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    const [editHopper, history] = await Promise.all([
      db.updateItem(data.hopper_id, Hopper, updateHopperObj),
      db.createItem(createAdminHistory, HopperMgmtHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editHopper,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editContent = async (req, res) => {
  try {
    const data = req.body;
    console.log("data--------------", data);
    const locale = req.getLocale();
    const updateContentObj = {
      heading: data.heading,
      secondLevelCheck: data.secondLevelCheck,
      call_time_date: data.call_time_date,
      description: data.description,
      status: data.status,
      remarks: data.remarks,
      user_id: req.user._id,
      firstLevelCheck: data.firstLevelCheck,
      ask_price: data.ask_price
      // ...data
    };
    if (data.mode) {
      updateContentObj.mode = data.mode;
      updateContentObj.mode_updated_at = Date.now();
    }

    if (data.status == "published") {
      // updateContentObj.mode = data.mode;
      updateContentObj.published_time_date = new Date();
    }


    if (data.hasOwnProperty("checkAndApprove")) {
      updateContentObj.checkAndApprove = data.checkAndApprove;
    }

    if (data.hasOwnProperty("category_id")) {
      updateContentObj.category_id = data.category_id;
    }
    // if(data.firstLevelCheck){
    //   updateContentObj.firstLevelCheck = data.firstLevelCheck.map((check)=>check);
    // }
    // const getOldContent = await db.getItem(data.content_id, Content);
    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      secondLevelCheck: data.secondLevelCheck,
      description: data.description,
      firstLevelCheck: data.firstLevelCheck,
      call_time_date: Date.now(),
      checkAndApprove: data.checkAndApprove,
      // hopper_id: data.hopper_id,
      role: req.user.role,
      heading: data.heading,
      status: data.status,
      mode: data.mode,
      remarks: data.remarks,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    const editContent = await db.updateItem(
      data.content_id,
      Content,
      updateContentObj
    );

    const findhopper = await Content.findOne({ _id: data.content_id }).populate("hopper_id category_id")
    if (data.status == "published") {




      const notiObj = {
        sender_id: req.user._id,
        receiver_id: findhopper.hopper_id,
        // data.receiver_id,
        title: "Content successfully published",
        body: ` 🔔 Congrats ${findhopper.hopper_id.user_name}, your content is now successfully published 🤩 Please check My Content on your app to view any offers from the publications. Happy selling 💰 🙌🏼`
      };
      console.log(notiObj);
      const resp = await _sendNotification(notiObj);
      const findcontent = await Content.findOne({ _id: data.content_id })
      // if (findcontent.type == "shared") {
      //   const findallpublication = await User.find({ role: "MediaHouse" })
      //   findallpublication.forEach(async (element) => {

      //     const notiObj2 = {
      //       sender_id: req.user._id,
      //       receiver_id: element._id.toString(),
      //       // data.receiver_id,
      //       title: "Content successfully published",
      //       body: `🔔 🔔 Hiya guys, please check out the new ${findhopper.category_id.name}  content uploaded on the platform. This content is Shared (license type) and the asking price is ${findhopper.ask_price}. Please visit your Feed section on the platform to view, negiotiate, chat or instantly buy the content 🐰`
      //     };
      //     console.log(notiObj);
      //     const resp2 = await _sendNotification(notiObj);
      //   });
      // } else {

      //   const notiObj2 = {
      //     sender_id: req.user._id,
      //     receiver_id: findcontent.mediahouse_id,
      //     // data.receiver_id,
      //     title: "Content successfully published",
      //     body: `Content published -  ${findhopper.hopper_id.user_name} content has been cleared and published for ${findhopper.ask_price}`
      //   };
      //   console.log(notiObj);
      //   const resp2 = await _sendNotification(notiObj2);


      // }


    } else if (data.status == "rejected") {

      const notiObj = {
        sender_id: req.user._id,
        receiver_id: findhopper.hopper_id,
        // data.receiver_id,
        title: "Content has been rejected",
        body: `Hi ${findhopper.hopper_id.user_name}, your content had to be unfortunately rejected as it did not pass our strict legal check. Please check our FAQs & view our Tutorials to learn what type of content is not allowed. If you would still like to discuss this, please call, email or chat with our helpful team members. Thanks - Team PRESSHOP🐰`,
      };
      console.log(notiObj);
      const resp = await _sendNotification(notiObj);
      await Content.updateOne({ _id: data.content_id }, { is_deleted: true })
    } else {
      const notiObj = {
        sender_id: req.user._id,
        receiver_id: findhopper.hopper_id,
        // data.receiver_id,
        title: "Content in Review",
        body: `Hey ${findhopper.hopper_id.user_name}, thank you for uploading your content 🤳🏼 🤩 Our team are reviewing the content & may need to speak to you. Please have your phone handy 📞. Cheers - Team PRESSHOP🐰`,
      };
      console.log(notiObj);
      const resp = await _sendNotification(notiObj);
    }
    const history = await db.createItem(createAdminHistory, ContnetMgmtHistory);
    res.status(200).json({
      code: 200,
      data: editContent,
      history: history,
    });
  } catch (error) {
    console.log("error----------->", error);
    utils.handleError(res, error);
  }
};

exports.editPublication = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updatePublicationObj = {
      latestAdminUpdated: new Date(),
      category: data.category,
      status: data.status,
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      action: data.action,
      user_id: req.user._id,
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updatePublicationObj.checkAndApprove = data.checkAndApprove;
    }

    const createAdminHistory = {
      admin_id: req.user._id,
      publication_id: data.publication_id,
      role: req.user.role,
      status: data.status,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    if (data.status == "approved") {
      const findallpublication = await User.findOne({ _id:mongoose.Types.ObjectId(data.publication_id)})
      const notiObj = {
        sender_id: req.user._id,
        receiver_id: data.hopper_id,
        // data.receiver_id,
        title: "Welcome to the tribe",
        body: `👋🏼 Hi ${findallpublication.first_name} Welcome to PRESSHOP 🐰 Thank you for joining our growing community 🙌🏼 Please check our helpful tutorials or handy FAQs to learn more about the app. If you wish to speak to our helpful team members, you can call, email or chat with us 24 x 7. Cheers🚀`,
      };
      console.log(notiObj);
      const resp = await _sendNotification(notiObj);
    }
    const [editPublication, history] = await Promise.all([
      db.updateItem(data.publication_id, MediaHouse, updatePublicationObj),
      db.createItem(createAdminHistory, PublicationMgmtHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editPublication,
    });
  } catch (error) {
    console.log("error----------->", error);
    utils.handleError(res, error);
  }
};

exports.addCategory = async (req, res) => {
  try {
    const data = req.body;
    const ifCategoryExists = await db.getItemCustom(
      {
        name: data.name,
        type: data.type,
      },
      Category
    );

    if (ifCategoryExists) {
      throw utils.buildErrObject(422, "This Category is Already Added");
    }
    const addCategory = await db.createItem(data, Category);

    res.status(200).json({
      code: 200,
      category: addCategory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getCategory = async (req, res) => {
  try {
    const data = { ...req.params, ...req.query };
    const condition = {
      type: data.type,
      // is_deleted:false
    };
    const CATEGORIES = await db.getItems(Category, condition);

    res.status(200).json({
      code: 200,
      categories: CATEGORIES,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const data = req.params;

    const category = await db.getItem(data.category_id, Category);

    res.status(200).json({
      code: 200,
      category: category,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.addPriceTipAndFAQs = async (req, res) => {
  try {
    const data = req.body;

    const addPriceTipAndFAQs = await db.createItem(data, PriceTipAndFAQ);

    res.status(200).json({
      code: 200,
      priceTipAndFaq: addPriceTipAndFAQs,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getHopperMgmtHistory = async (req, res) => {
  try {
    const data = req.params;

    const { totalCount, hopperHistory } = await db.getHopperMgmtHistory(
      HopperMgmtHistory,
      data
    );

    const workSheetColumnName = [
      "Date and time",
      "Employee Name",
      "hopper details",
      "Mode",
      "Status",
      "Remarks",
      "action",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = hopperHistory;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //type
      let media_type_arr = "assa";
      // val.content_id.forEach((element) => {
      //   media_type_arr.push(element.type);
      // });

      // let media_type_str = media_type_arr.join();

      //published_by
      let published_by = val.hopperData.first_name + val.hopperData.last_name;

      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }

      return [
        formattedDate,
        val.adminData.name,
        published_by,
        val.mode,
        val.status,
        val.remarks,
        val.action,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      totalCount: totalCount,
      hopperHistory: hopperHistory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getContentMgmtHistory = async (req, res) => {
  try {
    const data = req.params;
    const data2 = req.query;
    const { contentList, totalCount } = await db.getContenthistoryList(
      ContnetMgmtHistory,
      data,
      data2
    );

    console.log("users", contentList);

    // set xls Column Name
    const workSheetColumnName = [
      "Date and time",
      "Location",
      "Heading",
      "Description",
      "Type",
      "Licence",
      "Category",
      "Volume",
      "Price",
      "Published by",
      "1st level check",
      "2nd level check & call",
      "Check & approve",
      "Mode",
      "Status",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = contentList;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //type
      let media_type_arr = "assa";
      // val.content_id.forEach((element) => {
      //   media_type_arr.push(element.type);
      // });

      // let media_type_str = media_type_arr.join();

      //published_by
      let published_by =
        val.hopper_details.first_name + val.hopper_details.last_name;
      // hopper_id
      //1st level check
      let nudity = "nudity : " + val.firstLevelCheck.nudity;
      let isAdult = "isAdult : " + val.firstLevelCheck.isAdult;
      let isGDPR = "isGDPR : " + val.firstLevelCheck.isGDPR;
      let first_check_arr = [nudity, isAdult, isGDPR];
      let first_check_str = first_check_arr.join("\n");
      // hopper_details
      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      // if (val.content_id) {
      //   volume = val.admin_details.name;
      // }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      return [
        formattedDate,
        val.content_id.location,
        val.heading,
        val.description,
        media_type_arr,
        val.content_id.type,
        val.category_details.name,
        val.content_id.content.length,
        val.content_id.ask_price,
        published_by,
        first_check_str,
        val.secondLevelCheck,
        val.checkAndApprove,
        val.mode,
        val.status,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;
    res.status(200).json({
      code: 200,
      // totalCount: totalCount,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      contnetMgmtHistory: contentList,
      count: await ContnetMgmtHistory.countDocuments({
        content_id: data.content_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getContentList = async (req, res) => {
  try {
    // ["pro", "amateur"]
    const data = req.query;

    const { contentList, totalCount } = await db.getContentList(Content, data);

    // set xls Column Name
    const workSheetColumnName = [
      "Date and time",
      "Location",
      "Heading",
      "Description",
      "Type",
      "Licence",
      "Category",
      "Volume",
      "Price",
      "sale price",
      "Published by",
      "sale staus",
      "amount recived",
      "presshop commition",
      "amount paid",
      "amount payable",
      "1st level check",
      "2nd level check & call",
      "Check & approve",
      "Mode",
      "Status",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = contentList;
    console.log("users", contentList);
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //type
      let media_type_arr = [];
      val.content.forEach((element) => {
        media_type_arr.push(element.media_type);
      });

      let media_type_str = media_type_arr.join();

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name ? val.hopper_id.first_name + val.hopper_id.last_name :val.hopper_id;

      //1st level check
      let nudity = "nudity : "; //+ val.firstLevelCheck.nudity;
      let isAdult = "isAdult : "; // + val.firstLevelCheck.isAdult;
      let isGDPR = "isGDPR : "; // + //val.firstLevelCheck.isGDPR;
      let first_check_arr = [nudity, isAdult, isGDPR];
      let first_check_str = first_check_arr.join("\n");

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, sale_status, amount_paid;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      if (val.paid_status == "un_paid") {
        sale_status = "unsold";
      } else {
        sale_status = "sold";
      }


      if (val.paid_status_to_hopper == false) {
        amount_paid = val.amount_payable_to_hopper;
      } else {
        amount_paid = val.amount_paid_to_hopper;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      return [
        formattedDate,
        val.location,
        val.heading,
        val.description,
        media_type_str,
        val.type,
        val.categoryData,
        val.content.length,
        val.ask_price,
        val.amount_paid,
        "published_by",
        sale_status,
        val.amount_paid,
        val.commition_to_payable,
        amount_paid,
        amount_paid,
        first_check_str,
        val.secondLevelCheck,
        val.checkAndApprove,
        val.mode,
        val.status,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      totalCount: totalCount,
      contentList: contentList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

// exports.getPublicationList = async (req, res) => {
//   try {
//     // ["pro", "amateur"]
//     const data = req.query;

//     const { publicationList, totalCount } = await db.getPublicationList(
//       MediaHouse,
//       data
//     );

//     res.status(200).json({
//       code: 200,
//       totalCount: totalCount,
//       data: publicationList,
//     });
//   } catch (error) {
//     // console.log(error);
//     utils.handleError(res, error);
//   }
// };
exports.getPublicationList = async (req, res) => {
  try {
    // ["pro", "amateur"]
    const data = req.query;

    const { publicationList, totalCount } = await db.getPublicationList(
      MediaHouse,
      data
    );

    const workSheetColumnName = [
      "Publication",
      "Date and time",
      "Rating",
      "Main Office",
      "Admin details",
      "upload doc",
      "banking details",
      "Mode",
      "Status",
      "Remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = publicationList;

    console.log("data--------", userList);
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //type
      // let media_type_arr = [];
      // val.content.forEach(element => {
      //   media_type_arr.push(element.media_type)
      // });

      let media_type_str = "sasa";
      let rating = "4.1";

      //published_by
      // let published_by = val.first_name + val.last_name;

      //1st level check
      // let office_details = val.office_details.country + val.office_details.city;
      // let isAdult = "isAdult : " + val.firstLevelCheck.isAdult;
      // let isGDPR = "isGDPR : " + val.firstLevelCheck.isGDPR;
      // let first_check_arr = [nudity, isAdult, isGDPR];
      // let first_check_str = first_check_arr.join("\n");

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, url;
      if (val.admin_detail) {
        admin_name = val.admin_detail.full_name;
      }

      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      // if (val.upload_docs) {
      //   url = val.upload_docs.documents.url;
      // }

      return [
        val.company_name,
        formattedDate,
        rating,
        "office_details",
        admin_name,
        "url",
        val.company_bank_details,
        val.mode,
        val.status,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;
    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      totalCount: totalCount,
      data: publicationList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getPublicationMgmtHistory = async (req, res) => {
  try {
    const data = req.params;
    const data2 = req.query;
    const { totalCount, publicationHistory } =
      await db.getPublicationMgmtHistory(PublicationMgmtHistory, data, data2);

    const workSheetColumnName = [
      "Publication",
      "Date and time",
      "employee name",
      "Admin details",
      "Mode",
      "Status",
      "Remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = publicationHistory;

    console.log("data--------", userList);
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //type
      // let media_type_arr = [];
      // val.content.forEach(element => {
      //   media_type_arr.push(element.media_type)
      // });

      let media_type_str = "sasa";
      let rating = "4.1";

      //published_by
      // let published_by = val.first_name + val.last_name;

      //1st level check
      // let office_details = val.office_details.country + val.office_details.city;
      // let isAdult = "isAdult : " + val.firstLevelCheck.isAdult;
      // let isGDPR = "isGDPR : " + val.firstLevelCheck.isGDPR;
      // let first_check_arr = [nudity, isAdult, isGDPR];
      // let first_check_str = first_check_arr.join("\n");

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, url;
      if (val.admin_detail) {
        admin_name = val.admin_detail.full_name;
      }

      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      if (val.upload_docs) {
        url = val.upload_docs.documents[0].url;
      }

      return [
        val.publicationData.company_name,
        formattedDate,
        val.adminData.name,
        val.publicationData.admin_detail.full_name,
        val.mode,
        val.status,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      publicationHistory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.editProfile = async (req, res) => {
  try {
    const data = req.body;
    data.admin_id = req.user._id;

    if (req.files && req.files.profile_image) {
      const profile_images = await uploadFiletoAwsS3Bucket({
        fileData: req.files.profile_image,
        path: `public/adminImages`,
      });
      data.profile_image = profile_images.fileName
    }
    // console.log("editProfile", data.profile_image.fileName)

    if(data.admin_password) {
      
      const saltRounds = 10
      const plainPassword = data.admin_password;
      let hashedPassword;
      let newpass = bcrypt.hash(plainPassword, saltRounds, async (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return;
        }
        //  hashedPassword
        console.log('Hashed password:', hashedPassword);
  
        data.password = hashedPassword
  
        const editedProfile = await db.updateItem(data.admin_id, Admin, data);
  
        res.status(200).json({
          code: 200,
          editedProfile: editedProfile,
        });
      });
    }else {
      data.employee_address = JSON.parse(data.employee_address) 
      const editedProfile = await db.updateItem(data.admin_id, Admin, data);
      res.status(200).json({
        code: 200,
        editedProfile: editedProfile,
      });
    }
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const data = req.body;
    data.admin_id = req.user._id;
    console.log("id==>", data.admin_id);

    const profileData = await db.getItem(data.admin_id, Admin);

    res.status(200).json({
      code: 200,
      profileData: profileData,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const locale = req.getLocale();

    const data = req.body;

    data.role = "subAdmin";

    data.creator_id = req.user._id;
    console.log('data----------->', data);

    const doesAdminEmailExists = await emailer.emailAdminExists(data.email);

    if (!doesAdminEmailExists) {
      if (req.files && req.files.profile_image) {
        const dataS = await uploadFiletoAwsS3Bucket({
          fileData: req.files.profile_image,
          path: `public/adminImages`,
        });
        data.profile_image = dataS.fileName
        console.log("ASASAS", data.profile_image);
      }
      if (data.bank_details) {
        data.bank_details = JSON.parse(data.bank_details);
      }
      if (data.subadmin_rights) {
        data.subadmin_rights = JSON.parse(data.subadmin_rights);
      }
      if (data.employee_address) {
        data.employee_address = JSON.parse(data.employee_address);
      }
      // const rights = JSON.parse(data.subadmin_rights);
      // if (allAdminList[i].subadmin_rights.onboardEmployess == true){
      //   adminRightCount += 1
      // }

      // console.log("json parsed object===========",rights);
      console.log(" object============", data.subadmin_rights);



      // data.other_rights
      const allAdminList = await Admin.find({ complete_rights: true });

      if (data.subadmin_rights.onboardEmployess == true && data.subadmin_rights.blockRemoveEmployess == true &&
        data.subadmin_rights.assignNewEmployeeRights == true &&
        data.subadmin_rights.completeAccess == true
        && data.subadmin_rights.controlHopper == true &&
        data.subadmin_rights.controlPublication == true &&
        data.subadmin_rights.controlContent == true
        && data.subadmin_rights.viewRightOnly == true
        && data.subadmin_rights.other_rights == true) {
        if (allAdminList.length == 3) {
          return res.status(400).json({
            code: 400,
            error: { msg: "You cannot give all rights to more than 3 sub-admins" }
          })
        } else {
          data.complete_rights = true
        }
      }

      const employeeAdded = await db.createItem(data, Admin);

      const emailObj = {
        to: employeeAdded.email,
        subject: "Credentials for Presshop admin Plateform",
        name: employeeAdded.name,
        email: employeeAdded.email,
        password: data.password,
      };

      await emailer.sendSubAdminCredentials(locale, emailObj);

      res.status(200).json({
        code: 200,
        employeeAdded: employeeAdded,
      });
    }
  } catch (error) {
    console.log(error);
    utils.handleError(res, error);
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const data = req.body;
    if (data.isPermanentBlocked) {
      await db.deleteItem(data.employee_id, Admin);
    } else {
      const updateHopperObj = {
        admin_id: req.user._id,
        remarks: data.latestAdminRemark,
        is_Contractsigned: data.is_Contractsigned,
        is_Legal: data.is_Legal,
        is_Checkandapprove: data.is_Checkandapprove,
        isTempBlocked: data.isTempBlocked,
        isPermanentBlocked: data.isPermanentBlocked,
        status: data.status,
      };

      const createAdminHistory = {
        admin_id: req.user._id,
        employee_id: data.employee_id,
        status: data.status,
        remarks: data.latestAdminRemark,
        is_Contractsigned: data.is_Contractsigned,
        is_Legal: data.is_Legal,
        is_Checkandapprove: data.is_Checkandapprove,
        isTempBlocked: data.isTempBlocked,
        // isPermanentBlocked: data.isPermanentBlocked,
        action: data.action,
      };

      var [editHopper, history] = await Promise.all([
        db.updateItem(data.employee_id, Admin, updateHopperObj),
        db.createItem(createAdminHistory, employHistory),
      ]);
    }

    res.status(200).json({
      code: 200,
      response: data.isPermanentBlocked ? "User deleted" : editHopper,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const locale = req.getLocale();

    const data = { ...req.params, ...req.query };

    const { emplyeeList, totalCount } = await db.getEmployees(Admin, data);

    const workSheetColumnName = [
      "admin_details",
      "Employee ID",
      "Address",
      "officeDetails",
      "bank_detail",
      "legal",
      "contractsigned",
      "check and approve",
      "Mode",
      "Remarks",
      "status",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = emplyeeList;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      if (val.bank_details) {
        bank_detail =
          val.bank_details.account_holder_name +
          " Account number => " +
          val.bank_details.account_number +
          " bank_name => " +
          val.bank_details.bank_name;
      }

      let legal, is_Contractsigned, Checkandapprove;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Contractsigned == "true") {
        is_Contractsigned = "YES";
      } else {
        is_Contractsigned = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }

      let employee = [admin_name, formattedDate2];
      let volume = [val.imagecount, val.video_count, val.interview_count];
      let employee_str = employee.join("\n");

      return [
        val.name,
        val._id,
        "val.employee_address.post_code,",
        "val.officeDetails.pincode",
        bank_detail,
        legal,
        is_Contractsigned,
        Checkandapprove,
        val.status,
        val.remarks,
        val.action,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      totalCount: totalCount,
      emplyeeList: emplyeeList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const data = req.params;
    const [
      categoryUsedInFAQAndPriceTips,
      categoryUsedInContent,
      categoryUsedAsDesignationInAdmin,
      categoryUsedAsDepartmentInAdmin,
    ] = await Promise.all([
      db.getItemCustom({ category_id: data.category_id }, PriceTipAndFAQ),
      db.getItemCustom({ category_id: data.category_id }, Content),
      db.getItemCustom({ designation_id: data.category_id }, Admin),
      db.getItemCustom({ department_id: data.category_id }, Admin),
    ]);
    if (
      categoryUsedInFAQAndPriceTips ||
      categoryUsedInContent ||
      categoryUsedAsDesignationInAdmin ||
      categoryUsedAsDepartmentInAdmin
    )
      throw utils.buildErrObject(422, "This Avatar is taken by some users");
    const deleteCategory = await db.deleteItem(data.category_id, Category);

    res.status(200).json({
      code: 200,
      deleted: true,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const data = req.body;

    // const editedCategory = await db.updateItem(
    //   data.category_id,
    //   Category,
    //   data
    // );
    const datas = await Category.findOne({ name: data.name, type: data.type });

    if (datas) {
      throw utils.buildErrObject(422, "This Category is Already exist");
    } else {
      var addCategory = await db.updateItem(data.category_id, Category, data);
    }

    res.status(200).json({
      code: 200,
      editedCategory: addCategory,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.getBroadCastTasks = async (req, res) => {
  try {
    const data = req.query;
    const { contentList, totalCount } = await db.getTaskList(
      BroadCastTask,
      data
    );

    const workSheetColumnName = [
      "Date and time",
      "Location",
      "task brodcastedby",
      "task details",
      "type",
      "Category",
      "Volume",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = contentList;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_detail.full_name;
      }
      let employee = [admin_name, formattedDate2];
      let volume = [val.imagecount, val.video_count, val.interview_count];
      let employee_str = employee.join("\n");

      return [
        formattedDate,
        val.location,
        val.mediahouse_id.company_name,
        val.task_description,
        val.type,
        val.category_id,
        volume,
        val.mode,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      totalCount: totalCount,
      contentList: contentList,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.editBroadCast = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updateBroadCastObj = {
      latestAdminUpdated: new Date(),
      category: data.category,
      status: data.status,
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      remarks: data.remarks,
      mode: data.mode,
      admin_id: req.user._id,
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updateBroadCastObj.checkAndApprove = data.checkAndApprove;
    }

    const createAdminHistory = {
      // mediaHouse_id:data.mediaHouse_id,
      admin_id: req.user._id,
      broadCast_id: data.broadCast_id,
      role: req.user.role,
      status: data.status,
      mode: data.mode,
      remarks: data.remarks,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    const [editBroadCast, history] = await Promise.all([
      db.updateItem(data.broadCast_id, BroadCastTask, updateBroadCastObj),
      db.createItem(createAdminHistory, BroadCastHistorySummery),
    ]);

    res.status(200).json({
      code: 200,
      data: editBroadCast,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editPublishedContent = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updatePublishedContentObj = {
      latestAdminUpdated: new Date(),
      isTempBlocked: data.isTempBlocked,
      isPermanentBlocked: data.isPermanentBlocked,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      user_id: req.user._id,
      heading: data.heading,
      description:data.description
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updateBroadCastObj.checkAndApprove = data.checkAndApprove;
    }

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      heading: data.heading,
      description: data.description,
      Asking_price: data.Asking_price,
      Sale_price: data.Sale_price,
      role: req.user.role,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      action: data.isTempBlocked
        ? "isTempBlocked"
        : data.isPermanentBlocked
          ? "isPermanentBlocked"
          : "nothing",
    };

    const [editPublishedContent, history] = await Promise.all([
      db.updateItem(data.content_id, Content, updatePublishedContentObj),
      db.createItem(createAdminHistory, PublishedContentSummery),
    ]);

    res.status(200).json({
      code: 200,
      data: editPublishedContent,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getPublishedContentSummery = async (req, res) => {
  try {
    const data = req.params.content_id;
    const datas = req.query;
    // const publishedContentSummery = await PublishedContentSummery.find({
    //   content_id: data
    // }).populate('admin_id')
    //   .populate(
    //     {
    //       path: "content_id",
    //       populate:
    //       {
    //         path: "hopper_id",
    //         model: "User",
    //         // populate:
    //         // {
    //         //   path: "avatar_id",
    //         //   model: "Avatar"
    //         // }
    //       },
    //       populate: { path: "category_id", model: "Category" }
    //     });

    const { publishedContentSummery, totalCount } =
      await db.publishedContentSummery(data, datas, PublishedContentSummery);

    console.log("data-------", publishedContentSummery);

    const workSheetColumnName = [
      "publication",
      "Date and time",
      "Location",
      "Heading",
      "Description",
      "Type",
      "Licence",
      "Category",
      "Volume",
      "askPrice",
      "Sale price",
      "Published by",
      "Presshop Commission",
      "Payment details",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = publishedContentSummery;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_detail.full_name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      return [
        val.content_id.hopperDetails.first_name,
        val.company_name,
        val.purchased_qty,
        val.purchased_content_value,
        val.total_payment_received,
        val.total_payment_receivable,
        val.type,
        val.content_id.categoryDetails.name,
        val.content_id.asking_price,
        val.mode,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      fullPath: STORAGE_PATH_HTTP + fullPath,
      code: 200,
      publishedContentSummery,
      count: await PublishedContentSummery.countDocuments({
        content_id: mongoose.Types.ObjectId(data),
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getBroadCastHistory = async (req, res) => {
  try {
    const data = req.params;
    const data2 = req.query;

    const { totalCount, broadCastList } = await db.getBroadCastHistory(
      BroadCastHistorySummery,
      data,
      data2
    );
    const workSheetColumnName = [
      "Date and time",
      "employe details",
      "Location",
      "task brodcastedby",
      "task details",
      "type",
      "Category",
      "Volume",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = broadCastList;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_detail.full_name;
      }
      let employee = [admin_name, formattedDate2];
      let volume = [val.imagecount, val.video_count, val.interview_count];
      let employee_str = employee.join("\n");

      return [
        formattedDate,
        val.adminData.name,
        val.broadCastData.location,
        val.broadCastData.media_house_detail.full_name,
        val.broadCastData.task_description,
        val.broadCastData.type,
        val.category_id,
        volume,
        val.mode,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;
    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      totalCount: totalCount,
      broadCastList,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.purchasedPublication = async (req, res) => {
  try {
    const data = req.query;
    let paidPublication;
    if (data.id) {
      paidPublication = await Contents.findOne({
        paid_status: "paid",
      }).populate("category_id tag_ids purchased_publication");
    } else {
      // paidPublication = await Contents.find({ paid_status: "paid" }).populate('category_id tag_ids purchased_publication')
      paidPublication = await db.purchasedContent(MediaHouse, data);
    }

    res.status(200).json({
      code: 200,
      paidPublication: paidPublication.purchasedPublication,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.hopperPublishedContent = async (req, res) => {
  try {
    const data = req.query;
    const { hopperPublishedContent, totalCount } =
      await db.hopperPublishedContent(User, data);

    res.status(200).json({
      code: 200,
      totalCount: totalCount,
      hopperPublishedContent: hopperPublishedContent,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.createOfficeDetails = async (req, res) => {
  try {
    const data = req.body;
    if (data.address) {
      data.address = JSON.parse(data.address);
    }
    const details = await db.createItem(data, AdminOfficeDetail);

    res.status(200).json({
      code: 200,
      details: details,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getOfficeDetails = async (req, res) => {
  try {
    const data = req.query;
    let details;
    if (data.id) {
      details = await AdminOfficeDetail.findOne({ _id: data.id });
    } else {
      details = await AdminOfficeDetail.find();
    }

    res.status(200).json({
      code: 200,
      office_details: details,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.genralMgmt = async (req, res) => {
  try {
    const data = req.body;
    let details;
    if (data.faq) {
      data.faqs = data.faqs.map((faq) => faq);
      details = await db.createItem(data, Faq);
    }
    if (data.policies) {
      details = await db.createItem(data, Privacy_policy);
    }
    if (data.legal_tc) {
      details = await db.createItem(data, Legal_terms);
    }
    if (data.doc) {
      details = await db.createItem(data, Docs);
    }
    if (data.comm) {
      details = await db.createItem(data, Commission_structure);
    }
    if (data.selling) {
      details = await db.createItem(data, Selling_price);
    }
    if (data.price_tips) {
      details = await db.createItem(data, Price_tips);
    }

    res.status(200).json({
      code: 200,
      genralMgmt: details,
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
      status = await Faq.findOne({
        _id: mongoose.Types.ObjectId("644f5aad4d00543ca112a0a0"),
      });
    } else if (data.privacy_policy == "privacy_policy") {
      status = await Privacy_policy.findOne({
        _id: mongoose.Types.ObjectId("6451fdba1cf5bd37568f92d7"),
      });
    } else if (data.legal == "legal") {
      status = await Legal_terms.findOne({
        _id: mongoose.Types.ObjectId("6451fe39826b6b396ab2f5fb"),
      });
    } else if (data.videos == "videos") {
      status = await Tutorial_video.find({ for: "marketplace", is_deleted: false });
    } else if (data.doc == "doc") {
      status = await Docs.findOne({
        _id: mongoose.Types.ObjectId("645630f8404bd54c0bc53f64"),
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

exports.getGenralMgmtApp = async (req, res) => {
  try {
    const data = req.query;
    let status;

    if (data.type == "privacy_policy") {
      status = await Privacy_policy.findOne({
        _id: mongoose.Types.ObjectId("6458c3c7318b303d9b4755b3"),
      });
    } else if (data.type == "faq") {
      status = await Faq.find({ for: "app" });
    } else if (data.type == "legal") {
      status = await Legal_terms.findOne({
        _id: mongoose.Types.ObjectId("6458c35c5d09013b05b94e37"),
      });
    } else if (data.type == "commissionstructure") {
      status = await Category.findOne({
        _id: mongoose.Types.ObjectId(data.category_id),
      });
    } else if (data.type == "selling_price") {
      status = await Selling_price.findOne({
        _id: mongoose.Types.ObjectId("64f013495695d1378e70446f"),
      });
    } else if (data.type == "videos") {
      status = await Tutorial_video.find({ for: "app", is_deleted: false, category: data.category });
    } else if (data.type == "doc") {
      status = await Docs.findOne({
        _id: mongoose.Types.ObjectId("6458c2c7b1574939748f24bd"),
      });
    } else if (data.type == "price_tips") {
      status = await priceTipforquestion.find({ for: "app", is_deleted: false, category: data.category });
    }

    res.status(200).json({
      code: 200,
      status,
    });
  } catch (error) {
    utils.handleError(res, error);
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
exports.updateGenralMgmtApp = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    let status;
    if (data.type == "privacy_policy") {
      status = db.updateItem("6458c3c7318b303d9b4755b3", Privacy_policy, data);
      status = "UPDATED";
    } else if (data.type == "legal") {
      status = db.updateItem("6458c35c5d09013b05b94e37", Legal_terms, data);
      status = "UPDATED";
    } else if (data.type == "commissionstructure") {
      status = await db.updateItem(data.category_id, Category, data);
      console.log("status----->", status);
      status = "UPDATED";
    } else if (data.type == "selling_price") {
      status = db.updateItem("64f013495695d1378e70446f", Selling_price, data);
      status = "UPDATED";
    } else if (data.type == "videos") {
      status = await db.createItem(data, Tutorial_video);

      //       const inputVideoPath = 'path/to/input_video.mp4';
      //       const outputThumbnailPath = 'path/to/output_thumbnail.jpg';
      //       const thumbnailTime = '00:00:05'; // Time offset for the thumbnail in HH:MM:SS format

      // ffmpeg(inputVideoPath)
      //   .set('outputOptions', ['-frames:v 1']) // Extract only one frame
      //   .on('end', () => {
      //     console.log('Thumbnail generated successfully');
      //   })
      //   .on('error', (err) => {
      //     console.error('Error generating thumbnail:', err);
      //   })
      //   .screenshots({
      //     count: 1,
      //     timestamps: [thumbnailTime],
      //     folder: '',
      //     filename: outputThumbnailPath
      //   });
    } else if (data.type == "doc") {
      const response = db.updateItem("6458c2c7b1574939748f24bd", Docs, data);
      status = response.nModified == 1 ? "updated" : "not_updated";
    } else if (data.type == "price_tips") {
      const response = await db.updateItem(
        data.price_tips_id,
        priceTipforquestion,
        data
      );
      status = "UPDATED";
    }

    res.status(200).json({
      code: 200,
      status,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.createpriceTipforQuestion = async (req, res) => {
  try {
    const data = req.body;

    const price_tips = await db.createItem(data, priceTipforquestion);

    res.status(200).json({
      code: 200,
      created: price_tips,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deletepriceTipforQuestion = async (req, res) => {
  try {
    const data = req.body;
    res.status(200).json({
      code: 200,
      status: await db.updateItem(data.id, priceTipforquestion, {
        is_deleted: true,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getpriceTipforQuestion = async (req, res) => {
  try {
    const data = req.query;
    let price_tips;
    if (data.pricetip_id) {
      price_tips = await db.getItem(data.pricetip_id, priceTipforquestion);
    } else if (data.hasOwnProperty("category")) {
      price_tips = await db.getItems(priceTipforquestion, {
        for: data.for,
        is_deleted: false,
        category: data.category
      });
    }
    else {
      price_tips = await db.getItems(priceTipforquestion, {
        for: data.for,
        is_deleted: false,
        // category:data.category
      });
    }

    res.status(200).json({
      code: 200,
      price_tips,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updateGenralMgmt = async (req, res) => {
  try {
    const data = req.body;
    let status;
    if (data.type == "faq") {
      response = await db.updateItem(data.id, Faq, data);
      status = response;
    } else if (data.type == "privacy_policy") {
      status = db.updateItem("6451fdba1cf5bd37568f92d7", Privacy_policy, data);
      status = "UPDATED";
    } else if (data.type == "legal") {
      status = db.updateItem("6451fe39826b6b396ab2f5fb", Legal_terms, data);
      status = "UPDATED";
    } else if (data.type == "videos") {
      status = await db.createItem(data, Tutorial_video);
    } else if (data.type == "doc") {
      const response = db.updateItem("645630f8404bd54c0bc53f64", Docs, data);
      status = response.nModified == 1 ? "updated" : "not_updated";
    } else if (data.type == "price_tips") {
      const response = await db.updateItem(
        data.price_tips_id,
        priceTipforquestion,
        data
      );
      status = response.nModified == 1 ? "updated" : "not_updated";
    }

    res.status(200).json({
      code: 200,
      status,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};




async function getVideoDurationFromS3(s3Link, full) {
  const bucket = Bucket; // Replace with your S3 bucket name
  const key = `appTutorials/${s3Link}`; // Replace with the actual S3 object key

  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const inputVideoPath = `/var/www/mongo/presshop_rest_apis/public/appTutorials/${s3Link}`;
    const response = await s3.getObject(params).promise();
    const outVideoPath = `https://betazone.promaticstechnologies.com/presshop_rest_apis/public/appTutorials/${s3Link}`
    //  `/var/www/html/presshop_rest_apis/public/${path}/${data}`;
    // Save the video file locally
    fs.writeFileSync(inputVideoPath, response.Body);

    // Use fluent-ffmpeg to get the duration of the video
    // return new Promise((resolve, reject) => {
    //   ffmpeg(inputVideoPath)
    //     .ffprobe((err, data) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(data.format.duration);
    //       }
    //     });
    // });


    //   return new Promise((resolve, reject) => {
    //   const ffmpegCommand = ffmpeg()
    //   .input(outVideoPath)
    //   .ffprobe((err, data) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(data.format.duration);
    //     }
    //   });
    // })
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(outVideoPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {

          resolve(metadata.format.duration);
          console.log(`Video duration: ${metadata.format.duration} seconds`);
        }
      })
    })
  } catch (error) {
    console.error('Error fetching video from S3:', error);
    throw error;
  }
}

exports.uploadMultipleProjectImgs = async (req, res) => {
  try {
    let multipleImgs = [];
    let singleImg = [], durationInSeconds;

    const path = req.body.path;
    if (req.files && Array.isArray(req.files.images)) {
      for await (const imgData of req.files.images) {
        const data = await uploadFiletoAwsS3Bucket({
          fileData: imgData,
          path: `${path}`,
        });
        multipleImgs.push(`${data.data}`
        );

        // multipleImgs.push(
        //   `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data}`
        // );
      }
    } else if (req.files && !Array.isArray(req.files.images)) {
      var data = await uploadFiletoAwsS3Bucket({
        fileData: req.files.images,
        path: `${path}`,
      });





      console.log("media_type", data.fileName, data.media_type);
      const split = data.media_type.split("/");
      const media_type = split[0];


      if (media_type == "image") {
        // var datas = await db.uploadFile({
        //   file: req.files.thumbnail,
        //   path: `${STORAGE_PATH}/${path}`,
        // });

        // singleImg.push(
        //   `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data.data}`
        // );

        singleImg.push(
          `${data.data}`
        );
      } else if (media_type == "video") {

        // let thumb = await uploadFiletoAwsS3Bucket({
        //   fileData: req.files.thumbnail,
        //   path: `${path}`,
        // });






        // singleImg.push(
        //   `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data.fileName}`
        // );
        singleImg.push(
          `${data.data}`
        );
        // const outputThumbnailPath =
        //   "/var/www/html/presshop_rest_apis/public/thumbnail/abc.jpg";
        const outputFolder = "/var/www/mongo/presshop_rest_apis/public/thumbnail";

        // const thumbnailTime = "00:00:01"; // Time offset for the thumbnail in HH:MM:SS format

        //  const thumbresp =  ffmpeg(inputVideoPath)
        //  .outputOptions('-vframes 1') // Extract only one frame
        //   .on('end', () => {
        //     console.log('Thumbnail generated successfully');
        //   })
        //   .on('error', (err) => {
        //     console.error('Error generating thumbnail:', err);
        //   })
        //   .screenshots({
        //     count: 1,
        //     timestamps: [thumbnailTime],
        //     folder: outputFolder,
        //     filename: outputThumbnailPath
        //   });

        // var datass = await thumbsupply.generateThumbnail(
        //   `${data.data}`,
        //   {
        //     size: thumbsupply.ThumbSize.MEDIUM, // or ThumbSize.LARGE
        //     timestamp: "10%", // or `30` for 30 seconds
        //     forceCreate: true,
        //     cacheDir: outputFolder,
        //     mimetype: "video/mp4",
        //   }
        // );
        // console.log("thumbresp", datass);

        //  await   ffprobe(`${data.data}`, { path: ffprobeStatic.path })
        //     .then(function (info) {
        //       console.log(info);
        //       durationInSeconds = info.streams[0].duration;
        //     })
        //     .catch(function (err) {
        //       console.error(err);
        //     })




        // await ffmpeg.ffprobe(`${data.data}`, (err, metadata) => {
        //   if (err) {
        //     console.error('Error reading video metadata:', err);
        //     return;
        //   }

        // })
        //   console.log('Video duration in inner======================>', `${data.data}`, 'seconds');

        // getVideoDurationFromS3(`${data.fileName}` ,`${data.data}` )
        // .then(duration => {
        //     durationInSeconds = duration;
        //   console.log(`Video duration: ${duration} seconds`);
        // })
        // .catch(error => {
        //   console.error('Error:', error);
        // });
        return res.status(200).json({
          code: 200,
          imgs:
            req.files && Array.isArray(req.files.images) ? multipleImgs : singleImg,
          // thumbnail: thumb.data,
          // duration:durationInSeconds,
          path: "https://uat-presshope.s3.eu-west-2.amazonaws.com/thumbnail",
        });
      }
      // console.log('Video duration in outer======================>', durationInSeconds, 'seconds');
      // var proc = new ffmpeg(inputVideoPath)
      // .takeScreenshots({
      //     count: 1,
      //     timemarks: [ '600' ] // number of seconds
      //   }, outputFolder, function(err) {
      //   console.log('screenshots were saved')
      // });
      // singleImg.push(
      //   `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${datas}`
      // );
    }
    res.status(200).json({
      code: 200,
      imgs:
        req.files && Array.isArray(req.files.images) ? multipleImgs : singleImg,
      // thumbnail: datass,
      // duration:durationInSeconds,
      path: "https://uat-presshope.s3.eu-west-2.amazonaws.com/thumbnail",
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.purchasedContentSummery = async (req, res) => {
  try {
    const data = req.query;
    console.log("data======", req.user._id);
    const { purchasedPublication, totalCount } = await db.purchasedContent(
      // hopperPayment,
      User,
      data
    );

    // set xls Column Name
    const workSheetColumnName = [
      "publication",
      "Purchased content quantity",
      "Purchased content value",
      "Total payment received",
      "Payment receivable",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = purchasedPublication;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_detail.full_name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      return [
        val.company_name,
        val.purchased_qty,
        val.purchased_content_value,
        val.total_payment_received,
        val.total_payment_recevable,
        val.mode,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      fullPath: STORAGE_PATH_HTTP + fullPath,
      code: 200,
      count: totalCount,
      purchasedPublication,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getDocs = async (req, res) => {
  try {
    const data = req.query;
    let doc;
    if (data.type == "marketplace") {
      if (data.doc_id) {
        doc = await typeofDocs.findOne({ _id: data.doc_id, is_deleted: false });
      } else {
        doc = await typeofDocs.find({ type: "marketplace", is_deleted: false });
      }
    } else if (data.type == "app") {
      if (data.doc_id) {
        doc = await typeofDocs.findOne({ _id: data.doc_id, is_deleted: false });
      } else {
        doc = await typeofDocs.find({ type: "app", is_deleted: false });
      }
    }

    res.json({
      code: 200,
      data: doc,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.editpurchasedContentSummery = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updatePurchasedContentSummeryObj = {
      // : req.user._id
      latestAdminUpdated: new Date(),
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      mode: data.mode,
      remarks: data.latestAdminRemark,
      latestAdminUpdated: new Date(),
      purchased_content_qty: data.purchased_content_qty,
      purchased_content_value: data.purchased_content_value,
      total_payment_recieved: data.total_payment_recieved,
      payment_receivable: data.payment_receivable,
      total_amount_paid: data.total_amount_paid,
      total_presshop_commition: data.total_presshop_commition,
      media_house_id: data.media_house_id,
    };

    const [updatePurchasedContent, history] = await Promise.all([
      // db.updateItem(data.content_id, User, updatePurchasedContentSummeryObj),
      db.createItem(createAdminHistory, PurchasedContentHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: history,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.purchasedContentHistory = async (req, res) => {
  try {
    const data2 = req.query;

    // filters

    let filters = { media_house_id: req.query.content_id }

    if (data2.hasOwnProperty("Paymentreceivable")) {
      filters = { payment_receivable: { $gt: "0" } }
    }

    if (data2.hasOwnProperty("Paymentpaid")) {
      filters = { total_amount_paid: { $gt: "0" } }
    }

    if (data2.hasOwnProperty("Paymentpayable")) {
      filters = { total_amount_paid: { $gt: "0" } }
    }

    if (data2.startdate && data2.endDate) {
      filters = {
        createdAt: {
          $gte: new Date(data2.startdate),
          $lte: new Date(data2.endDate)
        }

      }
    }

    // sorting

    let sorting = { createdAt: -1 }
    if (data2.hasOwnProperty("NewtoOld")) {
      sorting = { createdAt: -1 }
    }

    if (data2.hasOwnProperty("OldtoNew")) {
      sorting = { createdAt: 1 }
    }

    const data = await PurchasedContentHistory.find(filters)
      .populate("media_house_id")
      .populate("admin_id")
      .sort(sorting)
      .skip(data2.offset ? Number(data2.offset) : 0)
      .limit(data2.limit ? Number(data2.limit) : 0);

    const workSheetColumnName = [
      "Date and time",
      "employee name",
      "publication",
      "purchased_content_qty",
      "puchased content value",
      "total paymentt recived",
      "payment recevable",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = data;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_detail.full_name;
      }
      let employee = [admin_name, formattedDate2];
      let volume = [val.imagecount, val.video_count, val.interview_count];
      let employee_str = employee.join("\n");
      console.log("Val--->", val);
      return [
        formattedDate,
        val.admin_id.name,
        val.media_house_id.company_name,
        val.purchased_content_qty,
        val.purchased_content_value,
        val.total_payment_recieved,
        val.payment_receivable,
        val.mode,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      count: await PurchasedContentHistory.countDocuments({
        media_house_id: req.query.content_id,
      }),
      purchasedContentHistory: data,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.sourcedContentSummery = async (req, res) => {
  try {
    const data = req.query;
    // data.media_house_id = req.user._id;
    const { sourcedContentSummery, totalCount } =
      await db.sourcedContentSummery(BroadCastTask, data);

    const workSheetColumnName = [
      "publication",
      "Purchased content quantity",
      "Purchased content value",
      "Total payment received",
      "Payment receivable",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = sourcedContentSummery;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_detail.full_name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      return [
        val.company_name,
        val.purchased_qty,
        val.purchased_content_value,
        val.total_payment_received,
        val.total_payment_receivable,
        val.mode,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullpath: STORAGE_PATH_HTTP + fullPath,
      count: totalCount,
      data: sourcedContentSummery,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.sourcedContentRemarksMode = async (req, res) => {
  try {
    const data = req.body;
    data.admin_id = req.user._id;
    await db.updateItem(data.media_house_id, MediaHouse, {
      source_content_employee: data.admin_id,
      mode: data.mode,
      remarks: data.remarks,
    });
    res.status(200).json({
      code: 200,
      sourcedContentSummeryCreated: await db.createItem(
        data,
        SourceContentHistory
      ),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.sourcedContentHistory = async (req, res) => {
  try {
    const data = req.params;
    const data2 = req.query;
    const { sourcedContentHistory, totalCount } =
      await db.sourcedContentHistory(SourceContentHistory, data, data2);

    const workSheetColumnName = [
      "time and date",
      "publication",
      "employee name",
      "brodcasted task",
      "Purchased content quantity",
      "Purchased content value",
      "Total payment received",
      "Payment receivable",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = sourcedContentHistory;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");

      return [
        formattedDate,
        val.media_house_details.company_name,
        val.admin_details,
        val.media_house_tasks.length,
        val.purchased_qty,
        val.purchased_content_value,
        val.total_payment_received,
        val.total_payment_receivable,
        val.mode,
        val.remarks,
        employee_str,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      count: await SourceContentHistory.countDocuments({
        media_house_id: mongoose.Types.ObjectId(data.media_house_id),
      }),
      fullpath: STORAGE_PATH_HTTP + fullPath,
      data: sourcedContentHistory,
      // sourcedContentHistory: await SourceContentHistory.find({
      //   media_house_id: mongoose.Types.ObjectId(data),
      // })
      //   .populate("media_house_id admin_id")
      //   .sort({ createdAt: -1 }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.createFaq = async (req, res) => {
  try {
    const data = req.body;

    const faq = await db.createItem(data, Faq);

    res.status(200).json({
      code: 200,
      created: faq,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getFaq = async (req, res) => {
  try {
    const data = req.query;
    let faq;
    if (data.faq_id) {
      faq = await db.getItem(data.faq_id, Faq);
    } else if (data.hasOwnProperty("category")) {
      faq = await db.getItems(Faq, { for: data.for, is_deleted: false, category: data.category });
    }
    else {
      faq = await db.getItems(Faq, { for: data.for, is_deleted: false });
    }

    res.status(200).json({
      code: 200,
      faq,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const data = req.body;
    res.status(200).json({
      code: 200,
      status: await db.updateItem(data.id, Faq, { is_deleted: true }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deleteTutorials = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      status: await db.updateItem(req.body.id, Tutorial_video, {
        is_deleted: true,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

// exports.getMediaHouse = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const currentDateTime = currentDate.toISOString();
//     const ImageType = "image";
//     const data =  req.query;
//     const { livetask, totalCount } =
//     await db.livetaskfordashbord(BroadCastTask, data);

//     console.log("livetask",livetask)

//     const long = livetask.map((x) => [x.longitude , x.latitude])

//     console.log("long",long)

//     let users;

//     for (const datas of long) {
//      users = await BroadCastTask.aggregate([
//       // {
//       //   $addFields: {
//       //     miles: { $arrayElemAt: ["$address_location.coordinates", 0] },
//       //     milesss: { $arrayElemAt: ["$address_location.coordinates", 1] },
//       //   },
//       // },
//       // {
//       //   $project: {
//       //     miles: 1,
//       //     milesss: 1,
//       //   },
//       // },
//       {
//         $match: {
//           $expr: {
//             $and: [{ $gt: ["$deadline_date", currentDateTime] }],
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           let: { lat: "$miles", long: "$milesss" },

//           pipeline: [
//             {
//               $geoNear: {
//                 near: {
//                   type: "Point",
//                   coordinates: datas,
//                 },
//                 distanceField: "distance",
//                 // distanceMultiplier: 0.001, //0.001
//                 spherical: true,
//                 // includeLocs: "location",
//                 maxDistance: 20 * 1000,
//               },
//             },
//             // {
//             //   $addFields: {
//             //     sas:"$$aaa"
//             //   }
//             // },
//             // {
//             //   $match: {
//             //     $expr: {
//             //       $and: [{ $eq: ["$role", "Hopper"] }],
//             //     },
//             //   },
//             // },
//           ],
//           as: "assignmorehopperList",
//         },
//       },

//       // {
//       //   $lookup: {
//       //     from: "users",
//       //     let: { taskCoordinates: "$address_location.coordinates" },
//       //     pipeline: [
//       //       {
//       //         $match: {
//       //           $expr: {
//       //             $and: [
//       //               // { $eq: ["$role", "Hopper"] },
//       //               {
//       //                 $geoNear: {
//       //                   near: {
//       //                     type: "Point",
//       //                     coordinates: {
//       //                       $let: {
//       //                         vars: {
//       //                           coords: { $arrayElemAt: ["$$taskCoordinates", 0] }
//       //                         },
//       //                         in: ["$$coords", { $arrayElemAt: ["$$taskCoordinates", 1] }]
//       //                       }
//       //                     }
//       //                   },
//       //                   distanceField: "distance",
//       //                   spherical: true,
//       //                   maxDistance: 200 * 1000
//       //                 }
//       //               }
//       //             ]
//       //           }
//       //         }
//       //       }
//       //     ],
//       //     as: "assignmorehopperList"
//       //   }
//       // },
//       // {
//       //   $match: {
//       //     $expr: {
//       //       $and: [{ $gt: ["$deadline_date", currentDateTime] }],
//       //     },
//       //   },
//       // },

//       // {
//       //   $lookup: {
//       //     from: "categories",
//       //     localField: "category_id",
//       //     foreignField: "_id",
//       //     as: "category_id",
//       //   },
//       // },

//       // // { $unwind: "$category_id" },

//       // {
//       //   $lookup: {
//       //     from: "users",
//       //     localField: "mediahouse_id",
//       //     foreignField: "_id",
//       //     as: "mediahouse_id",
//       //   },
//       // },

//       // // { $unwind: "$mediahouse_id" },

//       // {
//       //   $lookup: {
//       //     from: "admins",
//       //     localField: "admin_id",
//       //     foreignField: "_id",
//       //     as: "admin_id",
//       //   },
//       // },

//       // // { $unwind: "$admin_id" },

//       // // {
//       // //   $match: { "task_id.mediahouse_id": req.user._id },
//       // // },

//       // {
//       //   $lookup: {
//       //     from: "uploadcontents",
//       //     let: { task_id: "$_id" },

//       //     pipeline: [
//       //       {
//       //         $match: {
//       //           $expr: {
//       //             $and: [{ $eq: ["$task_id", "$$task_id"] }],
//       //           },
//       //         },
//       //       },
//       //       {
//       //         $addFields: {
//       //           imagecount: {
//       //             $cond: {
//       //               if: { $eq: ["$type", ImageType] },
//       //               then: 1,
//       //               else: 0,
//       //             },
//       //           },

//       //           videocount: {
//       //             $cond: {
//       //               if: { $eq: ["$type", "video"] },
//       //               then: 1,
//       //               else: 0,
//       //             },
//       //           },
//       //           interviewcount: {
//       //             $cond: {
//       //               if: { $eq: ["$type", "interview"] },
//       //               then: 1,
//       //               else: 0,
//       //             },
//       //           },

//       //           // totalDislikes: { $sum: "$dislikes" }
//       //         },
//       //       },
//       //     ],
//       //     as: "task_id",
//       //   },
//       // },
//       // // { $unwind: "$task_id" },

//       // {
//       //   $lookup: {
//       //     from: "acceptedtasks",
//       //     let: { task_id: "$_id" },

//       //     pipeline: [
//       //       {
//       //         $match: {
//       //           $expr: {
//       //             $and: [{ $eq: ["$task_id", "$$task_id"] }],
//       //           },
//       //         },
//       //       },
//       //     ],
//       //     as: "acepted_task_id",
//       //   },
//       // },
//       // // { $unwind: "$acepted_task_id" },

//       // {
//       //   $addFields: {
//       //     uploadedcontent: "$task_id",
//       //     acceptedby: "$acepted_task_id",
//       //     image_count: { $sum: "$task_id.imagecount" },
//       //     video_count: { $sum: "$task_id.videocount" },
//       //     interview_count: { $sum: "$task_id.interviewcount" },

//       //     // totalDislikes: { $sum: "$dislikes" }
//       //   },
//       // },
//       // {
//       //   $lookup: {
//       //     from: "users",
//       //     localField: "hopper_id",
//       //     foreignField: "_id",
//       //     as: "hopper_id",
//       //   },
//       // },
//       // { $unwind: "$hopper_id" },
//     ]);
//   }
//     // res.json({
//     //   code: 200,
//     //   data: users,
//     //   // countOfSourced:users.length// details:draftDetails
//     // });

//     res.status(200).json({
//       code: 200,
//       status: users,
//       // console: user,
//     });
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };

/* exports.getMediaHouse = async (req, res) => {
  try {
    const users = await BroadCastTask.aggregate([

    ]);

    res.status(200).json({
      code: 200,
      status: users,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
}; */

exports.createMediaHouseHistory = async (req, res) => {
  try {
    const data = req.body;

    const obj = {
      admin_id: req.user.id,
      latestAdminUpdated: new Date(),
      mediahouse_id: data.mediahouse_id,
      remarks: data.remarks,
      role: data.role,
      mode: data.mode,
    };
    const updatePublicationObj = {
      latestAdminUpdated: new Date(),
      admin_id: req.user._id,
    };

    const getmediaHouse = await mediaHousetaskHistory.create(obj);
    const update = db.updateItem(
      data.mediahouse_id,
      mediaHousetaskHistory,
      updatePublicationObj
    );
    res.status(200).json({
      code: 200,
      response: getmediaHouse,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getHopperDetails = async (req, res) => {
  try {
    const getmediaHouse = await mediaHousetaskHistory
      .findById(req.body.id)
      .populate("admin_id")
      .populate("mediahouse_id");

    res.status(200).json({
      code: 200,
      status: getmediaHouse,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editMediaHouseTask = async (req, res) => {
  try {
    const data = req.body;

    const editedCategory = await db.updateItem(
      data.media_house_task_id,
      BroadCastTask,
      data
    );

    res.status(200).json({
      code: 200,
      response: editedCategory,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.createDocs = async (req, res) => {
  try {
    res.status(200).json({
      code: 200,
      created: await db.createItem(req.body, typeofDocs),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editDeleteDocsType = async (req, res) => {
  try {
    const data = req.body;
    let response;
    if (data.is == "edit") {
      await db.updateItem(data.doc_id, typeofDocs, data);
      response = "doc edited";
    } else {
      data.is_deleted = true;
      await db.updateItem(data.doc_id, typeofDocs, data);
      response = "doc deleted";
    }

    res.status(200).json({
      code: 200,
      response,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.roomList = async (req, res) => {
  try {
    const id = req.user._id;
    const data = req.query;
    let filters = {}

    if (data.mediahouse_search) {
      filters.$or = [
        { mediahouse_name: { $regex: new RegExp("^" + data.mediahouse_search + "$", "i") } },
        { firstname: { $regex: new RegExp("^" + data.mediahouse_search + "$", "i") } },
        { lastname: { $regex: new RegExp("^" + data.mediahouse_search + "$", "i") } },
      ]
    }

    if (data.hopper_search) {
      filters.$or = [
        { firstname: { $regex: new RegExp("^" + data.hopper_search + "$", "i") } },
        { lastname: { $regex: new RegExp("^" + data.hopper_search + "$", "i") } },
        { hopper_name: { $regex: new RegExp("^" + data.hopper_search + "$", "i") } },
      ];
    }
    const users = await Room.aggregate([
      {
        $match: {
          receiver_id: mongoose.Types.ObjectId(id),
          room_type: data.room_type,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { sender_id: "$sender_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$sender_id"] }],
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
          ],
          as: "sender_id",
        },
      },

      { $unwind: { path: "$sender_id", preserveNullAndEmptyArrays: true } },

      {
        $addFields: {
          mediahouse_name: "$sender_id.full_name",
          firstname: "$sender_id.first_name",
          lastname: "$sender_id.last_name",
          hopper_name: {
            $concat: ["$sender_id.first_name", " ", "$sender_id.last_name"]
          }
        }
      },
      {
        $match: filters
      },
      {
        $lookup: {
          from: "admins",
          localField: "receiver_id",
          foreignField: "_id",
          as: "receiver_id",
        },
      },

      { $unwind: { path: "$receiver_id", preserveNullAndEmptyArrays: true } },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      code: 200,
      data: users,
      count: users.length
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getemployeeHistory = async (req, res) => {
  try {
    const data = req.query;
    const details = await employHistory
      .find({ employee_id: data.employee_id })
      .populate("admin_id employee_id")
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "is_legal",
      "is_Contractsigned",
      "Checkandapprove",
      "remarks",
      "action",
      "role",
      "status",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = details;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      // if (val.admin_details) {
      //   admin_name = val.admin_details.name;
      // }
      // let employee = [admin_name, formattedDate2];
      // let employee_str = employee.join("\n");
      // let hppername = val.first_name + " " + val.last_name;
      let legal, is_Contractsigned, Checkandapprove;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Contractsigned == "true") {
        is_Contractsigned = "YES";
      } else {
        is_Contractsigned = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        legal,
        is_Contractsigned,
        Checkandapprove,
        val.remarks,
        val.action,
        val.role,
        val.status,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullpath: STORAGE_PATH_HTTP + fullPath,
      response: details,
      total_count: await employHistory.countDocuments({
        employee_id: data.employee_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.uploadedContentSummeryHopper = async (req, res) => {
  try {
    const data = req.query;
    const { uploadedContentSummeryHopper } =
      await db.uploadedContentSummeryHopper(data, User);

    console.log(
      "uploadedContentSummeryHopper",
      uploadedContentSummeryHopper[0].data
    );
    const workSheetColumnName = [
      "hopper details",
      "accepted_tasks",
      "uploaded_content quantity",
      "uploaded_content value",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = uploadedContentSummeryHopper[0].data;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;
      return [
        hppername,
        val.accepted_tasks,
        val.uploaded_content,
        val.uploaded_content_val,
        val.uploaded_content_admin_mode,
        val.uploaded_content_remarks,
        val.employee_name,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullpath: STORAGE_PATH_HTTP + fullPath,
      uploadedContentSummeryHopper: uploadedContentSummeryHopper, //.uploadedContentSummeryHopper.data[0],
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.publishedContentSummeryHopper = async (req, res) => {
  try {
    const data = req.query;
    const { publishedContentSummeryHopper, totalCount } =
      await db.publishedContentSummeryHopper(data, User);

    const workSheetColumnName = [
      "hopper details",
      "Purchased content quantity",
      "Purchased content value",
      "Total payment received",
      "Mode",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = publishedContentSummeryHopper;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;
      return [
        hppername,
        val.published_content_qty,
        val.published_content_val,
        val.total_payment_earned,
        val.mode,
        val.remarks,
        val.employee_name,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullpath: STORAGE_PATH_HTTP + fullPath,
      count: totalCount,
      publishedContentSummeryHopper: publishedContentSummeryHopper,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editPublishedContentSummeryHopper = async (req, res) => {
  try {
    const data = req.body;
    const editPublishedContentSummeryHopper = {
      published_content_admin_employee_id_date: new Date(),
      published_content_admin_employee_id: req.user._id,
      published_content_admin_mode: data.mode,
      published_content_remarks: data.remarks,
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      mode: data.mode,
      remarks: data.remarks,
      latestAdminUpdated: new Date(),
      hopper_id: data.hopper_id,
      avatar: data.avatar,
      published_qty: data.published_qty,
      published_content_val: data.published_content_val,
      total_payment_earned: data.total_payment_earned,
      payment_pending: data.payment_pending,
      payment_due_date: data.payment_due_date,
      presshop_commission: data.presshop_commission,
    };

    const [updatePurchasedContent, history] = await Promise.all([
      db.updateItem(data.hopper_id, Hopper, editPublishedContentSummeryHopper),
      db.createItem(createAdminHistory, PublishedContentHopperHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: history,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewPublishedContentSummeryHopper = async (req, res) => {
  try {
    const data = req.query;
    const response = await PublishedContentHopperHistory.find({
      hopper_id: data.hopper_id,
    })
      .populate("admin_id hopper_id")
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "published_content qty",
      "published_content_val",
      "total_payment_earned",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = response;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.admin_id.name,
        published_by,
        val.published_qty,
        val.published_content_val,
        val.total_payment_earned,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: response,
      total_count: await PublishedContentHopperHistory.countDocuments({
        hopper_id: data.hopper_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.edituploadedContentSummeryHopper = async (req, res) => {
  try {
    const data = req.body;
    const edituploadedContentSummeryHopper = {
      uploaded_content_admin_employee_id_date: new Date(),
      uploaded_content_admin_employee_id: req.user._id,
      uploaded_content_admin_mode: data.mode,
      uploaded_content_remarks: data.remarks,
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      mode: data.mode,
      remarks: data.remarks,
      latestAdminUpdated: new Date(),
      hopper_id: data.hopper_id,
      Tasksaccepted: data.Tasksaccepted,
      UploadedcontentValue: data.UploadedcontentValue,
      UploadedcontentQty: data.UploadedcontentQty,
      Paymentpending: data.Paymentpending,
      Totalpaymentearned: data.Totalpaymentearned,
      Presshopcommission: data.Presshopcommission,
      Paymentduedate: data.Paymentduedate,
      avtar: data.avtar,
    };

    const [uploadedContentSummeryHopper, history] = await Promise.all([
      db.updateItem(data.hopper_id, Hopper, edituploadedContentSummeryHopper),
      db.createItem(createAdminHistory, uploadedContentHopperHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: history,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewUploadedContentSummeryHopperhistory = async (req, res) => {
  try {
    const data = req.query;
    const history = await uploadedContentHopperHistory
      .find({ hopper_id: data.hopper_id })
      .populate("admin_id hopper_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "mediahouse_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "mediahouse_id",
        },
      })
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "task_details",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.hopper_id.first_name + " " + val.hopper_id.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.admin_id.name,
        hppername,
        val.content_id,
        val.admin_id,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: await uploadedContentHopperHistory.countDocuments({
        hopper_id: data.hopper_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.taskCount = async (req, res) => {
  try {
    let data = req.query;
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
    const dynamicthis = new Date(moment().utc().startOf(val).format());
    const dynamicthisend = new Date(moment().utc().endOf(val).format());

    const prevdynamicthisv = new Date(
      moment().utc().subtract(1, val).startOf(val).format()
    );
    const prevdynamicthis = new Date(
      moment().utc().subtract(1, val).endOf(val).format()
    );


    //================================= live published content =======================================
    let condition_live_published = {
      status: "published",
      is_deleted:false
    };

    if (data.sortlivePublish == "daily") {
      condition_live_published = {
        status: "published",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortlivePublish == "weekly") {
      condition_live_published = {
        status: "published",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortlivePublish == "monthly") {
      condition_live_published = {
        status: "published",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortlivePublish == "yearly") {
      condition_live_published = {
        status: "published",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }



    const LivePublishedcontent = await db.getItems(Contents, condition_live_published);
    const hopperUsed_task_count = LivePublishedcontent.length;

    let todays = {
      // paid_status: "un_paid",
      status: "published",
      updatedAt: {
        $lte: dynamicthisend,
        $gte: dynamicthis
      }
    };

    let yesterdays = {
      // paid_status: "un_paid",
      is_deleted:false,

      status: "published",
      updatedAt: {
        $lte: prevdynamicthis,
        $gte: prevdynamicthisv
      }
    };
    const value = "designation_id";
    const hopperUsedTaskss = await db.getItems(Contents, yesterdays, value);
    const livepublishthismonthcount = hopperUsedTaskss.length;

    const today_invested = await db.getItems(Contents, todays);
    const livepublishprevmonthcount = today_invested.length;

    let percentage, type;
    if (livepublishthismonthcount > livepublishprevmonthcount) {
      const diff = livepublishprevmonthcount / livepublishthismonthcount;
      percentage = diff * 100;
      type = "increase";
    } else {
      const diff = livepublishthismonthcount / livepublishprevmonthcount;
      percentage = diff * 100;
      type = "decrease";
    }
    //================================= end live published content =======================================

    let condition2 = {};
    if (data.sorttotalHopper == "daily") {
      condition2 = {
        role: "Hopper",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalHopper == "weekly") {
      condition2 = {
        role: "Hopper",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalHopper == "monthly") {
      condition2 = {
        role: "Hopper",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalHopper == "yearly") {
      condition2 = {
        role: "Hopper",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    const users = await User.find(condition2).populate("avatar_id");
    const this_month_hopper_condition = {
      role: "Hopper",
      updatedAt: {
        $lte: dynamicthisend,
        $gte: dynamicthis
      }
    };
    const thismonthhopper = await db.getItems(User, this_month_hopper_condition);
    const last_month_hopper_condition = {
      role: "Hopper",
      updatedAt: {
        $lte: prevdynamicthis,
        $gte: prevdynamicthisv
      }
    };
    const lastmonthhopper = await db.getItems(User, last_month_hopper_condition);

    let percentage3, type3;
    if (thismonthhopper.length > lastmonthhopper.length) {
      const diff = lastmonthhopper.length / thismonthhopper.length;
      percentage3 = diff * 100;
      type3 = "increase";
    } else {
      const diff = lastmonthhopper.length / thismonthhopper.length;
      percentage3 = diff * 100;
      type3 = "decrease";
    }

    // ================================== end total hopper contribute =================================


    let condition4 = { role: "MediaHouse" };
    if (data.sorttotalPublication == "daily") {
      condition4 = {
        role: "MediaHouse",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalPublication == "weekly") {
      condition4 = {
        role: "MediaHouse",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalPublication == "monthly") {
      condition4 = {
        role: "MediaHouse",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalPublication == "yearly") {
      condition4 = {
        role: "MediaHouse",
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    const publiaction = await User.find(condition4);
    // const publiaction = await User.find({ role: "MediaHouse" });

    const condi2 = {
      role: "MediaHouse",
      updatedAt: {
        $lte: dynamicthisend,
        $gte: dynamicthis
      }
    };
    const thismonthmediahouse = await db.getItems(User, condi2);
    const cond2 = {
      role: "MediaHouse",
      updatedAt: {
        $lte: prevdynamicthis,
        $gte: prevdynamicthisv
      }
    };
    const lastmonthmediahouse = await db.getItems(User, cond2);

    let percentage4, type4;
    if (thismonthmediahouse.length > lastmonthmediahouse.length) {
      const diff = lastmonthmediahouse.length / thismonthmediahouse.length;
      percentage4 = diff * 100;
      type4 = "increase";
    } else {
      const diff = lastmonthmediahouse.length / thismonthmediahouse.length;
      percentage4 = diff * 100;
      type4 = "decrease";
    }

    const currentDate = new Date();
    const currentDateTime = new Date(currentDate.toUTCString())
    const dateObj = new Date(currentDateTime);

    // Format the Date object to the desired ISO 8601 format
    const isoString = dateObj.toISOString();
    console.log("currentDateTime==========", currentDateTime)
    console.log("currentDate==========", currentDate)


    let condition3 = {
      deadline_date: { $gt: currentDateTime },
    };

    if (data.sortlivetask == "daily") {
      condition3 = {
        deadline_date: { $gt: currentDateTime },
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortlivetask == "weekly") {
      condition3 = {
        deadline_date: { $gt: currentDateTime },
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortlivetask == "monthly") {
      condition3 = {
        deadline_date: { $gt: currentDateTime },
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortlivetask == "yearly") {
      condition3 = {
        deadline_date: { $gt: currentDateTime },
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    const getmediaHouse = await BroadCastTask.find(condition3);

    // const getmediaHouse = await BroadCastTask.find({
    //   deadline_date: { $gt: currentDateTime },
    // });

    let live = {
      deadline_date: {
        $lte: dynamicthisend,
        $gte: dynamicthis
      },
    };
    let plive = {
      deadline_date: { $lte: prevdynamicthis, $gte: prevdynamicthisv },
    };
    const live_task = await db.getItems(BroadCastTask, live);
    const live_task_count = live_task.length;

    const plive_task = await db.getItems(BroadCastTask, plive);
    const plive_task_count = plive_task.length;

    let percentage5, type5;
    if (live_task_count > plive_task_count) {
      const diff = plive_task_count / live_task_count;
      percentage5 = diff * 100;
      type5 = "increase";
    } else {
      const diff = live_task_count / plive_task_count;
      percentage5 = diff * 100;
      type5 = "decrease";
    }


    let condition1 = {};
    if (data.sortliveUpload == "daily") {
      condition1 = {

        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortliveUpload == "weekly") {
      condition1 = {
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortliveUpload == "monthly") {
      condition1 = {
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sortliveUpload == "yearly") {
      condition1 = {
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }

    const uses = await uploadedContent.aggregate([
      // {
      //   $match: {
      //     $expr: {
      //       $and: [{ $gt: ["$task_id.deadline_date", currentDateTime] }],
      //     },
      //   },
      // },
      {
        $match: condition1
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
        $match: {
          $expr: {
            $and: [{ $gt: ["$task_id.deadline_date", currentDateTime] }],
          },
        },
      },
    ]);

    const usesthismonth = await uploadedContent.aggregate([
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
          $expr: {
            $and: [
              { $gt: ["$task_id.deadline_date", currentDateTime] },
              { $gte: ["$updatedAt", dynamicthis] },
              { $lte: ["$updatedAt", dynamicthisend] },
            ],
          },
        },
      },
    ]);

    const useslastmonth = await uploadedContent.aggregate([
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
          $expr: {
            $and: [
              { $gt: ["$task_id.deadline_date", currentDateTime] },
              { $gte: ["$updatedAt", prevdynamicthisv] },
              { $lte: ["$updatedAt", prevdynamicthis] },
            ],
          },
        },
      },
    ]);

    let percentage2, type2;
    if (usesthismonth.length > useslastmonth.length) {
      const diff = useslastmonth.length / usesthismonth.length;
      percentage2 = diff * 100;
      type2 = "increase";
    } else {
      const diff = useslastmonth.length / usesthismonth.length;
      percentage2 = diff * 100;
      type2 = "decrease";
    }


    let condition5 = {};
    if (data.sorttotalContentPaid == "daily") {
      condition5 = {

        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalContentPaid == "weekly") {
      condition5 = {
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalContentPaid == "monthly") {
      condition5 = {
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalContentPaid == "yearly") {
      condition5 = {
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    const total = await Contents.aggregate([
      {
        $match: condition5
      },
      {
        $group: {
          _id: null,
          totalamountpaid: { $sum: "$amount_paid" },
        },
      },
    ]);



    let condition6 = { paid_status_for_hopper: true };
    if (data.sorttotalCommision == "daily") {
      condition6 = {
        paid_status_for_hopper: true,
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalCommision == "weekly") {
      condition6 = {
        paid_status_for_hopper: true,
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalCommision == "monthly") {
      condition6 = {
        paid_status_for_hopper: true,
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    if (data.sorttotalCommision == "yearly") {
      condition6 = {
        paid_status_for_hopper: true,
        createdAt: {
          $lte: dynamicthisend,
          $gte: dynamicthis
        }
      }
    }
    const getcontentonline = await hopperPayment.find(condition6);

    // if (Array.isArray(getcontentonline)) {
    //   // Use the reduce function to calculate the sum
    //   const sumOfPresshopCommition = getcontentonline.reduce((accumulator, item) => {
    //     // Check if item has presshop_commition property and it's a number
    //     if (item.hasOwnProperty('presshop_commission') && typeof item.presshop_commission === 'number') {
    //       return accumulator + item.presshop_commission;
    //     } else {
    //       return accumulator;
    //     }
    //   }, 0); // Initialize accumulator to 0

    //   console.log('Sum of presshop_commition:', sumOfPresshopCommition);
    // } else {
    //   console.log('getcontentonline is not an array.');
    // }




    const numbet = getcontentonline.reduce(
      (a, b) => {
        return a + b.presshop_commission;
      },
      0
    );
    console.log("numbet", getcontentonline, "data=========", numbet)
    const weekStart = new Date(moment().utc().startOf("month").format());
    const weekEnd = new Date(moment().utc().endOf("month").format());
    let weekday = {
      // media_house_id: mongoose.Types.ObjectId(req.user._id),
      // type : "content",
      updatedAt: {
        $lte: weekEnd,
        $gte: weekStart,
      },
    };

    const prev_weekStart = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );
    console.log("asaas--", prev_weekStart);

    const prev_weekEnd = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );
    console.log("asaas--", prev_weekEnd);
    let lastweekday = {
      // media_house_id: mongoose.Types.ObjectId(req.user._id),
      // type : "content",
      updatedAt: {
        $lte: prev_weekEnd,
        $gte: prev_weekStart,
      },
    };

    const content = await db.getItems(hopperPayment, weekday);
    const content_count = content.length;
    const curr_week_percent = content_count / 100;
    const prevcontent = await db.getItems(hopperPayment, lastweekday);
    const prevcontent_count = prevcontent.length;
    const prev_week_percent = prevcontent_count / 100;
    let percentP;
    var typeP;
    if (content_count > prevcontent_count) {
      const diff = prevcontent_count / content_count;
      percentP = diff * 100;
      typeP = "increase";
    } else {
      const diff = content_count / prevcontent_count;
      percentP = diff * 100;
      typeP = "decrease";
    }

    

    // const Payment_received = await hopperPayment.aggregate([
    //   {
    //     $match: condition3
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       Payment_received: { $sum: "$amount" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0, // Exclude the _id field from the output
    //       Payment_received: 1,
    //     }
    //   },
    //   {
    //     $addFields: {
    //       Payment_received: "$Payment_received"
    //     }
    //   },
    // ]);

    res.json({
      code: 200,
      live_published_content: {
        task: LivePublishedcontent,
        count: LivePublishedcontent.length,
        type: type,
        percentage: percentage || 0,
      },
      live_uploaded_content: {
        task: uses,
        count: uses.length,
        type: type2,
        percentage: percentage2 || 0,
      },
      total_hopper: {
        task: users,
        count: users.length,
        type: type3,
        percentage: percentage3 || 0,
        // data: hopperUsedTaskss,
        // data2: today_invested,
      },
      live_task: {
        task: getmediaHouse,
        count: getmediaHouse.length,
        type: type5,
        percentage: percentage5 || 0,
      },
      total_publication: {
        task: publiaction,
        count: publiaction.length,
        type: type4,
        percentage: percentage4 || 0,
      },
      totalcontent_paid: {
        task: total[0].totalamountpaid || 0,
        count: total.length,
        // type: type4,
        // percentage: percentage4 || 0,
      },

      total_commision: {
        amount: numbet,
        percentage: percentP,
        type: typeP
      }
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.liveUploadedContent = async (req, res) => {
  try {
    const yesterdayEnd = new Date();

    const datas = req.query;
    let condition = {}, sortBy = { createdAt: -1 };
    console.log("datas.hopper_id", typeof datas.hopper_id);
    if (typeof datas.hopper_id !== "undefined") {
      const val = mongoose.Types.ObjectId(datas.hopper_id);
      const val2 = mongoose.Types.ObjectId(datas.task_id);
      //  delete condition
      condition = {
        $expr: {
          $and: [
            { $eq: ["$_id.hopper_id", val] },
            { $eq: ["$_id.task_id", val2] },
          ],
        },
      };
    } else {
      condition = {
        $expr: {
          $and: [{ $gt: ["$task_id.deadline_date", yesterdayEnd] }],
        },
      };
    }

    if (datas.hasOwnProperty("NewtoOld")) {
      sortBy = { created_At: -1 }
    } else if (datas.hasOwnProperty("OldtoNew")) {
      sortBy = { created_At: 1 }
    } else if (datas.hasOwnProperty("HighestPaymentReceived")) {
      sortBy = { total_amount_recieved: -1 }
    } else if (datas.hasOwnProperty("LowestPaymentReceived")) {
      sortBy = { total_amount_recieved: 1 }
    }

    if (datas.category) {
      condition["task_id.category_id"] = mongoose.Types.ObjectId(datas.category);
  }

  let coindition2 = {};
  // Add condition for location (if applicable)
  if (datas.search) {
      condition["task_id.location"] = { $regex: datas.search, $options: "i" };
  }

//   if (datas.Hopper) {
//     condition["uploaded_by.first_name"] = { $regex: datas.Hopper, $options: "i" };
// }

if (datas.Hoppers) {
  const regexPattern = datas.Hoppers;
  const regexOptions = { $regex: regexPattern, $options: "i" };
  condition["$or"] = [
      { "uploaded_by.first_name": regexOptions },
      { "uploaded_by.last_name": regexOptions },
      { "uploaded_by.user_name": regexOptions }
  ];
}
    if (datas.sale_status == "sold") {
      coindition2 = {
        sale_status: "sold"
      }
    } else {
      coindition2 = {
        sale_status: "unsold"
      }
    }

    const params = [
      {
        $group: {
          _id: { hopper_id: "$hopper_id", task_id: "$task_id" },

          //"$hopper_id",
          uploaded_content: { $push: "$$ROOT" },
        },
      },
      // {
      //   $match: {
      //     $expr: {
      //       $and: [{ $gt: ["$uploaded_content.task_id.deadline_date", yesterdayEnd] }],
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      //     imagecount: {
      //       $sum: {
      //       $cond: {
      //         if: { $eq: ["$type", "image"] },
      //         then: 1,
      //         else: 0,
      //       },
      //     },
      //     },
      //   },
      // },
      {
        $lookup: {
          from: "tasks",
          localField: "uploaded_content.task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },
      { $unwind: "$task_id" },
      // {
      //   $lookup: {
      //     from: "admins",
      //     localField: "task_id.admin_id",
      //     foreignField: "_id",
      //     as: "admin_details",
      //   },
      // },
      // { $unwind: "$admin_details" },

    

      // {
      //   $lookup: {
      //     from: "admins",
      //     localField: "task_id.admin_id",
      //     foreignField: "_id",
      //     as: "admin_details",
      //   },
      // },
      // { $unwind: "$admin_details" },
      //  {
      //   $group: {
      //     _id: "$hopper_id",
      //     uploaded_content: { $push: "$$ROOT" },
      //   },
      // },

      {
        $lookup: {
          from: "users",
          localField: "task_id.mediahouse_id",
          foreignField: "_id",
          as: "brodcasted_by",
        },
      },
      { $unwind: "$brodcasted_by" },
      {
        $lookup: {
          from: "admins",
          localField: "task_id.admin_id",
          foreignField: "_id",
          as: "admin_details",
        },
      },

      { $unwind: { path: "$admin_details", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "uploaded_content.hopper_id",
          foreignField: "_id",
          as: "uploaded_by",
        },
      },
      { $unwind: "$uploaded_by" },
      {
        $match: condition,
      },
      // {
      //   $lookup: {
      //     from: "uploadcontents",
      //     // let: { task_id: "$_id" },

      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$paid_status", true] }],
      //           },
      //         },
      //       },
      //       ,
      //     ],
      //     as: "paid_uploaded_content",
      //   },
      // },
      {
        $project: {
          _id: 1,
          task_id: 1,
          uploaded_content: 1,
          brodcasted_by: 1,
          uploaded_by: 1,
          admin_details: 1,
          // total_presshop_commission: {
          //   $sum: "$uploaded_content.commition_to_payable",
          // },
          // total_amount_payable: {
          //   $sum: "$uploaded_content.amount_payable_to_hopper",
          // },
          // total_amount_paid: {
          //   $sum: "$uploaded_content.amount_paid_to_hopper",
          // },

          sale_status: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$uploaded_content.paid_status", true] }, // Additional condition
                ],
              },
              then: "sold",
              else: "unsold",
            },
          },
          // sale_status:{
          //   $cond: {
          //     if: {
          //       $and: [
          //         { $eq: ["$uploaded_content.paid_status", true] }, // Additional condition
          //       ],
          //     },
          //     then: "sold",
          //     else: "un_sold",
          //   },
          // },
          imagecount: {
            $size: {
              $filter: {
                input: "$uploaded_content",
                as: "content",
                cond: {
                  $and: [
                    { $eq: ["$$content.type", "image"] },
                    { $eq: ["$$content.paid_status", true] },
                  ],
                },
                // { $eq: ["$$content.type", "image"] },
              },
            },
          },
          videocount: {
            $size: {
              $filter: {
                input: "$uploaded_content",
                as: "content",
                cond: {
                  $and: [
                    { $eq: ["$$content.type", "video"] },
                    { $eq: ["$$content.paid_status", true] },
                  ],
                },
                // { $eq: ["$$content.type", "video"] },
              },
            },
          },

          interviewcount: {
            $size: {
              $filter: {
                input: "$uploaded_content",
                as: "content",
                cond: { $eq: ["$$content.type", "interview"] },
              },
            },
          },

          // imagevolume: imagecount * task_id.photo_price
        },
      },

      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$_id.hopper_id", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$hopper_id", "$$contentIds"] },
                    { $eq: ["$paid_status_for_hopper", true] },
                    // { $eq: ["$content_id", "$$id"] },
                    { $eq: ["$type", "task_content"] },
                  ],
                },
              },
            },
          ],
          as: "transictions_true",
        },
      },


      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$_id.hopper_id", list: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$hopper_id", "$$contentIds"] },
                    { $eq: ["$paid_status_for_hopper", false] },
                    // { $eq: ["$content_id", "$$id"] },
                    { $eq: ["$type", "task_content"] },
                  ],
                },
              },
            },


            {
              $lookup: {
                from: "users",
                localField: "media_house_id",
                foreignField: "_id",
                as: "media_house_id",
              },
            },
            { $unwind: "$media_house_id" },


          ],
          as: "transictions_false",
        },
      },

      {
        $addFields: {
          uploaded_content_count: {
            $size: "$uploaded_content",
          },
          total_image_price: {
            $multiply: ["$imagecount", "$task_id.photo_price"],
          },
          total_video_price: {
            $multiply: ["$videocount", "$task_id.videos_price"],
          },
          total_interview_price: {
            $multiply: ["$interviewcount", "$task_id.interview_price"],
          },
          total_presshop_commission: {
            $sum: "$transictions_false.presshop_commission",
          },
          total_amount_payable: {
            $sum: "$transictions_false.payable_to_hopper",
          },
          total_amount_paid: {
            $sum: "$transictions_true.amount_paid_to_hopper",
          },
          total_amount_recieved: {
            $sum: "$transictions_false.amount",
          },
          created_At: "$task_id.createdAt",

        },
      },

      {
        $lookup: {
          from: "avatars",
          localField: "uploaded_by.avatar_id",
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
          from: "categories",
          localField: "task_id.category_id",
          foreignField: "_id",
          as: "category_details",
        },
      },
      {
        $unwind: {
          path: "$category_details",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: coindition2,
      },
      {
        $sort: sortBy,
      },
    ]

    const uses = await uploadedContent.aggregate(params);

    if (datas.hasOwnProperty("limit") && datas.hasOwnProperty("offset")) {
      params.push(
        {
          $skip: Number(datas.offset),
        },
        {
          $limit: Number(datas.limit),
        }
      );
    }


    // if (datas.hasOwnProperty("highpaymentrecived")) {
    //   params.push(
    //     {
    //         $sort: { total_amount_recieved: -1 },
    //     },
    //   );
    // }

    // if (datas.hasOwnProperty("lowpaymentrecived")) {
    //   params.push(
    //     {
    //         $sort: { amount_paid: 1 },
    //     },
    //   );
    // }



    if (datas.hasOwnProperty("Paymentpaid")) {
      params.push(
        {
          $sort: { total_amount_paid: -1 },
        },
      );
    }

    if (datas.hasOwnProperty("Paymentpaybale")) {
      params.push(
        {
          $sort: { total_amount_payable: -1 },
        },
      );
    }




    const news = await uploadedContent.aggregate(params);

    const workSheetColumnName = [
      "time and date ",
      "Location",
      "brodcasted by",
      "uploaded by",
      "task_details",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = uses;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      // let hppername =
      // val.uploaded_by.first_name + " " + val.uploaded_by.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.task_id,
        val.brodcasted_by,
        "hppername",
        val.task_id,
        val.task_id,
        val.task_id,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    // const fileContent = fs.readFileSync(path.join(process.env.STORAGE_PATH, filePath));
    // const s3Bucket = 'your-s3-bucket-name';
    // const s3FileName = `csv_files/${Date.now()}.csv`; // Modify the path and filename as needed

    // // Define the parameters for the S3 upload
    // const param = {
    //   Bucket: s3Bucket,
    //   Key: s3FileName,
    //   Body: fileContent,
    // };
    // let responce ;
    // // Upload the file to S3
    // s3.upload(param, (err, data) => {
    //   if (err) {
    //     console.error('Error uploading to S3:', err);
    //   } else {
    //     console.log('File uploaded successfully:', data.Location);

    //     // Now you can send a response with the S3 URL
    //   //   res.json({
    //   //     code: 200,
    //   //     fullPath: data.Location,
    //   //     response: datas.hopper_id ? uses[0] : news,
    //   //     // console:consoleArray,
    //   //     count: news.length,
    //   //   });

    //   responce =  data.Location
    //   }
    // });
    const fullPath = filePath;

    res.json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      response: datas.hopper_id ? uses[0] : news,
      // console:consoleArray,
      count: news.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editLiveUploadedcontentdashboard = async (req, res) => {
  try {
    const data = req.body;
    // const locale = req.getLocale();
    if (data.task_id_foredit) {
      await db.updateItem(data.task_id_foredit, BroadCastTask, data);
      res.status(200).json({
        code: 200,
        data: "updated",
      });
    } else {
      const updatePublishedContentObj = {
        timestamp: new Date(),
        // task_description:data.task_description,
        // heading:data.heading,
        remarksforliveUploaded: data.latestAdminRemark,
        modeforliveUploaded: data.mode,
        admin_id: req.user._id,
      };
      const values =
        typeof data.content_id == "string"
          ? JSON.parse(data.content_id)
          : data.content_id;
      const assignHopper = await values.map(
        (hoper) => (hoper = mongoose.Types.ObjectId(hoper))
      );

      const createAdminHistory = {
        admin_id: req.user._id,
        content_id: assignHopper,
        role: req.user.role,
        task_id: data.task_id,
        mode: data.mode,
        remarks: data.latestAdminRemark,
      };

      const [editPublishedContent, history] = await Promise.all([
        db.updateItem(data.task_id, BroadCastTask, updatePublishedContentObj),
        db.createItem(createAdminHistory, liveuploadedcontent),
      ]);

      res.status(200).json({
        code: 200,
        data: editPublishedContent,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editLivePublishedContentDashboard = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updatePublishedContentObj = {
      latestAdminUpdated: new Date(),
      // isTempBlocked: data.isTempBlocked,
      // isPermanentBlocked: data.isPermanentBlocked,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      user_id: req.user._id,
      heading: data.heading,
    };
    if (data.hasOwnProperty("checkAndApprove")) {
      updateBroadCastObj.checkAndApprove = data.checkAndApprove;
    }

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      heading: data.heading,
      description: data.description,
      Asking_price: data.Asking_price,
      Sale_price: data.Sale_price,
      role: req.user.role,
      mode: data.mode,
      remarks: data.latestAdminRemark,
    };

    const [editPublishedContent, history] = await Promise.all([
      db.updateItem(data.hopper_id, Hopper, updatePublishedContentObj),
      db.createItem(createAdminHistory, PublishedContentSummeryHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editPublishedContent,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.liveTasks = async (req, res) => {
  try {
    const datas = req.query;
    console.log("data", datas);
    const { livetask, totalCount } = await db.livetaskfordashbord(
      BroadCastTask,
      datas
    );
    let dataLimit = datas.limit
      ? parseInt(datas.limit)
      : Number.MAX_SAFE_INTEGER;
    let dataOffset = datas.offset ? parseInt(datas.offset) : 0;

    let users, sortBy;

    if (datas.hasOwnProperty("NewtoOld")) {
      sortBy = {
        createdAt: -1
      }
    } else if (datas.hasOwnProperty("OldtoNew")) {
      sortBy = {
        createdAt: 1
      }
    } else {
      sortBy = {
        createdAt: -1
      }
    }
    let condition1 = {};
    const startDate = new Date(datas.startdate);
    const endDate = new Date(datas.endDate);
    if (datas.startdate && datas.endDate) {
      condition1.createdAt = {
        $lte: endDate,
        $gte: startDate
      }
    }

    if (datas.search) {
      const like = { $regex: datas.search, $options: "i" };
      condition1.location = like;
      // condition.description = like
    }

    if (datas.category) {
      condition1.category_id = mongoose.Types.ObjectId(datas.category);
  }

    if (datas.hasOwnProperty("HighestpricedTask")) {
      sortBy = { totalPriceofTask: -1 }
    } else if (datas.hasOwnProperty("LowestpricedTask")) {
       sortBy =  { totalPriceofTask: 1 }
    }


    if (datas.sale_status == "sold") {
      condition1 = {
        $expr: {
          $and: [{ $eq: ["$paid_status", "paid"] }]
        }
      }
    }


    if (datas.sale_status == "unsold") {
      condition1 = {
        $expr: {
          $and: [{ $eq: ["$paid_status", "unpaid"] }]
        }
      }
    }
    const long = livetask.map((x) => [x.longitude, x.latitude]);
    console.log("long", long);
    // const lat = livetask.map((x) => x.latitude)
    // console.log("lat",lat);
    // for (const data of long)
    for (const [index, data] of long.entries()) {
      const currentDateTime = new Date();
      console.log("New Daet ", currentDateTime);
      let condition;
      // console.log("data.id",mongoose.Types.ObjectId(data.sassa))
      if (datas.task_id) {
        const val = mongoose.Types.ObjectId(datas.task_id);
        //  delete condition
        condition = {
          $expr: {
            $and: [{ $eq: ["$_id", val] }],
          },
        };
      } else {
        condition = {
          $expr: {
            $and: [{ $gt: ["$deadline_date", currentDateTime] }],
          },
        };
      }
      console.log("condition", condition);
      // const val = mongoose.Types.ObjectId(datas.task_id)
      // console.log("data.sassa",val);

      users = await BroadCastTask.aggregate([

        {
          $match: condition,
        },
        {
          $lookup: {
            from: "users",
            pipeline: [
              {
                $geoNear: {
                  near: {
                    type: "Point",
                    coordinates: data,
                  },
                  distanceField: "distance",
                  // distanceMultiplier: 0.001, //0.001
                  spherical: true,
                  // includeLocs: "location",
                  maxDistance: 20000 * 1000,
                },
              },
            ],
            as: "assignmorehopperList",
          },
        },

        {
          $lookup: {
            from: "uploadcontents",
            let: { task_id: "$_id" },

            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$task_id", "$$task_id"] }],
                  },
                },
              },
              {
                $addFields: {
                  imagecount: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$type", "image"] },
                          { $eq: ["$paid_status", true] }, // Additional condition
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },

                  videocount: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$type", "video"] },
                          { $eq: ["$paid_status", true] }, // Additional condition
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                  interviewcount: {
                    $cond: {
                      if: {
                        $and: [
                          { $eq: ["$type", "interview"] },
                          { $eq: ["$paid_status", true] }, // Additional condition
                        ],
                      },
                      then: 1,
                      else: 0,
                    },
                  },

                  // totalDislikes: { $sum: "$dislikes" }
                },
              },
            ],
            as: "uploaded_content",
          },
        },
        {
          $addFields: {
            // uploadedcontent: "$task_id",
            // acceptedby: "$acepted_task_id",
            image_count: { $sum: "$uploaded_content.imagecount" },
            video_count: { $sum: "$uploaded_content.videocount" },
            interview_count: { $sum: "$uploaded_content.interviewcount" },

            // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
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

        { $unwind: "$category_details" },
        {
          $lookup: {
            from: "acceptedtasks",
            localField: "_id",
            foreignField: "task_id",
            as: "acepted_Contents",
          },
        },


        {
          $addFields: {
              task_id: "$_id",
              price_of_image: { $ifNull: ["$photo_price", 0] }, // Set default value to 0 if photo_price is null
              price_of_video: { $ifNull: ["$videos_price", 0] }, // Set default value to 0 if videos_price is null
              price_of_interview: { $ifNull: ["$interview_price", 0] }, // Set default value to 0 if interview_price is null
              totalPriceofTask: { $add: [{ $ifNull: ["$photo_price", 0] }, { $ifNull: ["$videos_price", 0] }, { $ifNull: ["$interview_price", 0] }] } // Sum the prices, providing default value of 0 if any field is null
          }
      },

        {
          $lookup: {
            from: "acceptedtasks",
            // localField: "acepted_Contents.hopper_id",
            // foreignField: "_id",
            // as: "acceptedby",
            let: { taskid: "$task_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$task_id", "$$taskid"] },
                    { $eq: ["$task_status", "accepted"] }
                    ],
                  },
                },
              },

            ],
            as: "acceptedtasksforhopper",
          },
        },
        // {
        //   $lookup: {
        //     from: "users",
        //     localField: "acepted_Contents.hopper_id",
        //     foreignField: "_id",
        //     as: "acceptedby",
        //     //   let: { acceptedby :"$acepted_Contents.$.hopper_id"},
        //     // pipeline: [
        //     //   {
        //     //     $match: {
        //     //       $expr: {
        //     //         $and: [{ $eq: ["$_id", "$$acceptedby"] }

        //     //       ],
        //     //       },
        //     //     },
        //     //   },

        //     // ],
        //     // as: "acceptedby",
        //   },
        // },
        // {
        //   $lookup: {
        //     from: "avatars",
        //     localField: "acceptedby.avatar_id",
        //     foreignField: "_id",
        //     as: "avatar_details",
        //   },
        // },

        {
          $lookup: {
            from: "users",
            let: { assign_more_hopper_history: "$acceptedtasksforhopper.hopper_id" },
            // let: { assign_more_hopper_history: "$accepted_by" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $in: ["$_id", "$$assign_more_hopper_history"] }],
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
            as: "acceptedby",
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
        {
          $lookup: {
            from: "admins",
            localField: "admin_id",
            foreignField: "_id",
            as: "admin_id",
          },
        },
        // { $unwind: "$admin_id" },
        // {
        //   $project: {
        //     _id: 1,
        //     admin_id:1,
        //     mediahouse_id:1,
        //     avatar_details: 1,
        //     acceptedby: 1,
        //     uploaded_content: 1,
        //     image_count: 1,
        //     video_count: 1,
        //     acepted_Contents:1,
        //     interview_count: 1,
        //     assignmorehopperList:1

        //     // imagevolume: imagecount * task_id.photo_price
        //   },
        // },

        {
          $lookup: {
            from: "users",
            let: { assign_more_hopper_history: "$assign_more_hopper_history" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $in: ["$_id", "$$assign_more_hopper_history"] }],
                  },
                },
              },
              {
                $lookup: {
                  from: "avatars",
                  localField: "avatar_id",
                  foreignField: "_id",
                  as: "assign_more_hopper_history_hopper_details_avatar_details",
                },
              },
            ],
            as: "assign_more_hopper_history_hopper_details",
          },
        },

        {
          $lookup: {
            from: "hopperpayments",
            let: { contentIds: "$mediahouse_id._id", list: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$media_house_id", "$$contentIds"] },
                      { $eq: ["$paid_status_for_hopper", true] },
                      // { $eq: ["$content_id", "$$id"] },
                      { $eq: ["$type", "task_content"] },
                    ],
                  },
                },
              },
            ],
            as: "transictions_true",
          },
        },


        {
          $lookup: {
            from: "hopperpayments",
            let: { contentIds: "$mediahouse_id._id", list: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$media_house_id", "$$contentIds"] },
                      { $eq: ["$paid_status_for_hopper", false] },
                      // { $eq: ["$content_id", "$$id"] },
                      { $eq: ["$type", "task_content"] },
                    ],
                  },
                },
              },
            ],
            as: "transictions_false",
          },
        },

        {
          $addFields: {
            total_image_price: {
              $multiply: ["$image_count", "$photo_price"],
            },

            total_video_price: {
              $multiply: ["$video_count", "$videos_price"],
            },
            total_interview_price: {
              $multiply: ["$interview_count", "$interview_price"],
            },

            total_presshop_commission: {
              $sum: "$transictions_false.presshop_commission",
            },
            total_amount_payable: {
              $sum: "$transictions_false.payable_to_hopper",
            },
            total_amount_paid: {
              $sum: "$transictions_true.amount_paid_to_hopper",
            },
            total_amount_recieved: {
              $sum: "$transictions_false.amount",
            },
          },
        },

        {
          $match: condition1,
        },
        {
          $skip: dataOffset,
        },
        {
          $limit: dataLimit,
        },

        {
          $sort: sortBy
        }
      ]);

      dataOffset += dataLimit;
      if (dataLimit >= index) {
        break; // Exit the loop if we've reached the end of the array
      }
    }

    const workSheetColumnName = [
      "broadcasted by",
      "time and date ",
      "location",
      "task_description",
      "category",
      "deadline_date",
      "mode",
      "status",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = users;
    if (!userList) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "no live task found",
      });
    }

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        val.mediahouse_id.company_name,
        formattedDate,
        val.location,
        val.task_description,
        val.category,
        val.deadline_date,
        val.mode,
        val.status,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.json({
      fullPath: STORAGE_PATH_HTTP + fullPath,
      code: 200,
      response: datas.task_id ? users[0] : users,
      // console:nearbyHoppers,
      count: totalCount,
      // ? users[0].totalCount[0].count
      // : 0,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editLivetask = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    data.sender_id = req.user._id;
    if (data.task_id_foredit) {
      await db.updateItem(data.task_id_foredit, BroadCastTask, data);
      res.status(200).json({
        code: 200,
        data: "updated",
      });
    } else {
      const updatePublishedContentObj = {
        timestamp: new Date(),
        // isTempBlocked: data.isTempBlocked,
        // isPermanentBlocked: data.isPermanentBlocked,
        // assign_more_hopper_history: data.assign_more_hopper,
        // heading:data.heading,
        // task_description:data.task_description,
        remarks: data.latestAdminRemark,
        mode: data.mode,
        admin_id: req.user._id,
      };

      const findspecifictask = await BroadCastTask.findOne({
        _id: data.task_id,
      }).populate("mediahouse_id");

      const values =
        typeof data.assign_more_hopper == "string"
          ? JSON.parse(data.assign_more_hopper)
          : data.assign_more_hopper;
      const assignHopper = await values.map(
        (hoper) => (hoper = mongoose.Types.ObjectId(hoper))
      );
      const ids = values;
      const maping = findspecifictask.assign_more_hopper_history.map((x) =>
        ids
          .map((val) => {
            if (x == val) {
              throw utils.buildErrObject(422, "hopper already assign ");
            }
          })
          .toString()
      );

      const acceptedbylength = findspecifictask.accepted_by.length;
      const assignmorehopperLength =
        findspecifictask.assign_more_hopper_history.length;

      if (acceptedbylength + assignmorehopperLength == 5) {
        throw utils.buildErrObject(422, "no more hopper can assign ");
      }

      const createAdminHistory = {
        admin_id: req.user._id,
        task_id: data.task_id,
        role: req.user.role,
        assign_more_hopper_history: assignHopper,
        mode: data.mode,
        remarks: data.latestAdminRemark,
      };
      const lengthofhoppers = findspecifictask.accepted_by.length
      const arrlength = 6 - lengthofhoppers
      // for (let i = 0; i < arrlength; i++) {
      //   const radius = 10000 * 1000


      //   var users = await User.aggregate([
      //     {
      //       $geoNear: {
      //         near: {
      //           type: "Point",
      //           coordinates: [
      //             findspecifictask.address_location.coordinates[1],
      //             findspecifictask.address_location.coordinates[0],
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

      var prices = await db.getMinMaxPrice(BroadCastTask, findspecifictask._id);

      if (data.assign_more_hopper) {
        for (let user of assignHopper) {
          // for (let user of users) {
          const notifcationObj = {
            user_id: user,
            main_type: "task",
            notification_type: "media_house_tasks",
            title: `${findspecifictask.mediahouse_id.full_name}`,
            description: `Broadcasted a new task from €${prices[0].min_price}-€${prices[0].max_price} Go ahead, and accept the task`,
            profile_img: `${findspecifictask.mediahouse_id.profile_image}`,
            distance: "",
            deadline_date: findspecifictask.deadline_date.toString(),
            lat: findspecifictask.address_location.coordinates[1].toString(),
            long: findspecifictask.address_location.coordinates[0].toString(),
            min_price: prices[0].min_price.toString(),
            max_price: prices[0].max_price.toString(),
            task_description: findspecifictask.task_description.toString(),
            broadCast_id: findspecifictask._id.toString(),
            push: true,
          };
          await this._sendPushNotification(notifcationObj)
        }
      }
      const [editPublishedContent, history] = await Promise.all([
        await BroadCastTask.update(
          { _id: mongoose.Types.ObjectId(data.task_id) },
          {
            $push: { assign_more_hopper_history: assignHopper },
            $set: updatePublishedContentObj,
          }
        ),
        // db.updateItem(data.task_id, BroadCastTask, updatePublishedContentObj),
        db.createItem(createAdminHistory, livetaskhistory),
      ]);

      res.status(200).json({
        code: 200,
        data: editPublishedContent,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewlivetaskhistory = async (req, res) => {
  try {
    const data = req.query;
    let sortBy = {
      createdAt: -1
    };
    let condition1 = {};
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (data.startDate && data.endDate) {
      condition1 = {
        createdAt: {
          $lte: startDate,
          $gte: endDate
        }
      }
    }
    if (data.hasOwnProperty("NewtoOld")) {
      sortBy = {
        createdAt: -1
      }
    }
    if (data.hasOwnProperty("OldtoNew")) {
      sortBy = {
        createdAt: 1
      }
    }
    const users = await livetaskhistory.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$task_id", mongoose.Types.ObjectId(data.task_id)] },
            ],
          },
        },
      },

      {
        $lookup: {
          from: "admins",
          localField: "admin_id",
          foreignField: "_id",
          as: "admin_detail",
        },
      },

      { $unwind: "$admin_detail" },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_detail",
        },
      },
      { $unwind: "$task_detail" },

      {
        $lookup: {
          from: "users",
          localField: "task_detail.mediahouse_id",
          foreignField: "_id",
          as: "mediahouse_detail",
        },
      },
      { $unwind: "$mediahouse_detail" },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "assign_more_hopper_history",
      //     foreignField: "_id",
      //     as: "assign_more_hopper_detail",
      //   },
      // },
      {
        $lookup: {
          from: "users",
          let: { assign_more_hopper_history: "$assign_more_hopper_history" },
          // let: { assign_more_hopper_history: "$accepted_by" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$_id", "$$assign_more_hopper_history"] }],
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
            { $unwind: "$avatar_details" },
          ],
          as: "assign_more_hopper_detail",
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "acepted_Contents.hopper_id",
      //     foreignField: "_id",
      //     as: "acceptedby",
      //     //   let: { acceptedby :"$acepted_Contents.$.hopper_id"},
      //     // pipeline: [
      //     //   {
      //     //     $match: {
      //     //       $expr: {
      //     //         $and: [{ $eq: ["$_id", "$$acceptedby"] }

      //     //       ],
      //     //       },
      //     //     },
      //     //   },

      //     // ],
      //     // as: "acceptedby",
      //   },
      // },
      // {
      //   $lookup: {
      //     from: "avatars",
      //     localField: "acceptedby.avatar_id",
      //     foreignField: "_id",
      //     as: "avatar_details",
      //   },
      // },
      {
        $lookup: {
          from: "acceptedtasks",
          let: { task_id: "$task_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$task_id", "$$task_id"] }],
                },
              },
            },
          ],
          as: "acceptedby",
        },
      },

      {
        $lookup: {
          from: "users",
          let: { assign_more_hopper_history: "$acceptedby.hopper_id" },
          // let: { assign_more_hopper_history: "$accepted_by" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$_id", "$$assign_more_hopper_history"] }],
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
            { $unwind: "$avatar_details" },
          ],
          as: "acceptedby_hopper_detail",
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "acceptedby.hopper_id",
      //     foreignField: "_id",
      //     as: "hopper_detail",
      //   },
      // },
      // { $unwind: "$task_detail" },
      {
        $match: condition1
      },
      {
        $sort: sortBy
      },
    ]);

    // const acceptedby = await accepted_tasks
    //   .find({ task_id: data.task_id })
    //   .populate({
    //     path: "hopper_id",
    //     populate: {
    //       path: "avatar_id",
    //     },
    //   });

    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "task_details",
      "accepted by",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = users;
    // const userList1 = acceptedby;
    // const results = userList1.map((val) => val.hopper_id.first_name);
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_detail) {
        admin_name = val.admin_detail.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      // if (val.is_Checkandapprove == "true") {
      //   Checkandapprove = "yes";
      // } else {
      //   Checkandapprove = "No";
      // }
      return [
        formattedDate,
        val.admin_detail.name,
        val.mediahouse_detail.company_name,
        val.task_detail.task_description,
        "results",
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: users,
      // acceptedby: acceptedby,
      total_count: await livetaskhistory.countDocuments({
        task_id: data.task_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewliveuploadedcontenhistory = async (req, res) => {
  try {
    const data = req.query;

    // Sorting
    let sorting = { createdAt: -1 };

    if (data.hasOwnProperty("NewtoOld")) {
      sorting.createdAt = -1
    }

    if (data.hasOwnProperty("OldtoNew")) {
      sorting.createdAt = 1
    }

    // Filters

    let filters = {}

    if (data.startdate && data.endDate) {
      filters = {
        $expr: {
          $and: [
            { $gte: ["$createdAt", new Date(data.startdate)] },
            { $lte: ["$createdAt", new Date(data.endDate)] }
          ]
        }
      }
    }


    const uses = [
      // {
      //   $group: {
      //     _id: { hopper_id: "$hopper_id", task_id: "$task_id" },

      //     //"$hopper_id",
      //     uploaded_content: { $push: "$$ROOT" },
      //   },
      // },
      {
        $match: { task_id: mongoose.Types.ObjectId(data.task_id) },
      },
      {
        $lookup: {
          from: "tasks",
          let: { task_id: mongoose.Types.ObjectId(data.task_id) },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$_id", "$$task_id"] }],
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
            {
              $unwind: {
                path: "$mediahouse_id",
                preserveNullAndEmptyArrays: true,
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
            {
              $unwind: {
                path: "$category_id",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "task_id",
        },
      },
      {
        $unwind: {
          path: "$task_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "uploadcontents",
          let: { task_id: "$content_id" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$_id", "$$task_id"] }],
                },
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
            {
              $unwind: {
                path: "$hopper_id",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                from: "avatars",
                localField: "hopper_id.avatar_id",
                foreignField: "_id",
                as: "avatar_id",
              },
            },
            {
              $unwind: {
                path: "$avatar_id",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "content_id",
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "admin_id",
          foreignField: "_id",
          as: "admin_id",
        },
      },
      {
        $unwind: {
          path: "$admin_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      // {
      //   $addFields: {
      //     imagecount: {
      //       $sum: {
      //       $cond: {
      //         if: { $eq: ["$type", "image"] },
      //         then: 1,
      //         else: 0,
      //       },
      //     },
      //     },
      //   },
      // },

      {
        $project: {
          _id: 1,
          task_id: 1,
          content_id: 1,
          admin_id: 1,
          remarks: 1,
          mode: 1,
          role: 1,
          latestAdminUpdated: 1,
          createdAt: 1,
          updatedAt: 1,
          sale_status: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$content_id.paid_status", false] }, // Additional condition
                ],
              },
              then: "unsold",
              else: "sold",
            },
          },
          // sale_status:{
          //   $cond: {
          //     if: {
          //       $and: [
          //         { $eq: ["$uploaded_content.paid_status", true] }, // Additional condition
          //       ],
          //     },
          //     then: "sold",
          //     else: "un_sold",
          //   },
          // },
          imagecount: {
            $size: {
              $filter: {
                input: "$content_id",
                as: "content",
                cond: {
                  $and: [
                    { $eq: ["$$content.type", "image"] },
                    { $eq: ["$$content.paid_status", true] },
                  ],
                },
                // { $eq: ["$$content.type", "image"] },
              },
            },
          },
          videocount: {
            $size: {
              $filter: {
                input: "$content_id",
                as: "content",
                cond: {
                  $and: [
                    { $eq: ["$$content.type", "video"] },
                    { $eq: ["$$content.paid_status", true] },
                  ],
                },
                // { $eq: ["$$content.type", "video"] },
              },
            },
          },

          interviewcount: {
            $size: {
              $filter: {
                input: "$content_id",
                as: "content",
                cond: { $eq: ["$$content.type", "interview"] },
              },
            },
          },

          // imagevolume: imagecount * task_id.photo_price
        },
      },

      {
        $addFields: {
          // uploaded_content_count:{
          //   $size:"$uploaded_content"
          // },
          total_image_price: {
            $multiply: ["$imagecount", "$task_id.photo_price"],
          },
          total_video_price: {
            $multiply: ["$videocount", "$task_id.videos_price"],
          },
          total_interview_price: {
            $multiply: ["$interviewcount", "$task_id.interview_price"],
          },
        },
      },
      {
        $match: filters
      },
      {
        $sort: sorting,
      }
    ];

    const count = await liveuploadedcontent.aggregate(uses);
    if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
      uses.push(
        {
          $skip: Number(data.offset),
        },
        {
          $limit: Number(data.limit),
        }
      );
    }
    const news = await liveuploadedcontent.aggregate(uses);
    uses.push({
      $count: "createdAt",
    });
    // const response = await liveuploadedcontent.find({
    //     task_id: data.task_id ,
    //   })
    //   .populate("admin_id task_id").populate({
    //     path: "task_id",
    //     populate: {
    //       path: "mediahouse_id",
    //       // populate: {
    //       //   path: "mediahouse_id",
    //       // },
    //     },
    //   })
    //   .populate({
    //     path: "task_id",
    //     populate: {
    //       path: "category_id",
    //       // populate: {
    //       //   path: "mediahouse_id",
    //       // },
    //     },
    //   })
    //   .populate({
    //     path: "content_id",
    //     populate: {
    //       path: "task_id",
    //       populate: {
    //         path: "mediahouse_id",
    //       },
    //     },
    //   })

    //   .populate({
    //     path: "content_id",
    //     populate: {
    //       path: "hopper_id",
    //       populate: {
    //         path: "avatar_id",
    //       },
    //     },
    //   })
    //   .sort({ createdAt: -1 })
    //   .skip(data.offset ? Number(data.offset) : 0)
    //   .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "location",
      "employee name",
      "brodcasted by",
      "task_details",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = news;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.content_id,
        val.admin_id.name,
        val.task_id,
        val.task_id,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: news,
      count: count.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getallpublishcontent = async (req, res) => {
  try {
    const data = req.query
    const response = await Content.find({})
      .populate("user_id hopper_id category_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      }).sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 10);

    res.status(200).json({
      response: response,
      count: response.length,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

// exports.getalluploadedcontent = async (req, res) => {
//   try {
//     const response = await uploadedContent
//       .find({})
//       .populate("task_id hopper_id")
//       .populate({
//         path: "hopper_id",
//         populate: {
//           path: "avatar_id",
//         },
//       });

//     res.status(200).json({
//       response: response,
//       count: response.lengthss,
//     });
//   } catch (error) {
//     // console.log(error);
//     utils.handleError(res, error);
//   }
// };

exports.getalluploadedcontent = async (req, res) => {
  try {
const datas = req.query
    const params =[
      {
        $group: {
          _id: { hopper_id: "$hopper_id", task_id: "$task_id" },

          //"$hopper_id",
          uploaded_content: { $push: "$$ROOT" },
        },
      },
      // {
      //   $match: {
      //     $expr: {
      //       $and: [{ $gt: ["$uploaded_content.task_id.deadline_date", yesterdayEnd] }],
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      //     imagecount: {
      //       $sum: {
      //       $cond: {
      //         if: { $eq: ["$type", "image"] },
      //         then: 1,
      //         else: 0,
      //       },
      //     },
      //     },
      //   },
      // },
      {
        $lookup: {
          from: "tasks",
          localField: "uploaded_content.task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },
      { $unwind: "$task_id" },
      // {
      //   $match: {
      //     $expr: {
      //       $and: [{ $gt: ["$task_id.deadline_date", yesterdayEnd] }],
      //     },
      //   },
      // },
      //  {
      //   $group: {
      //     _id: "$hopper_id",
      //     uploaded_content: { $push: "$$ROOT" },
      //   },
      // },

      {
        $lookup: {
          from: "users",
          localField: "task_id.mediahouse_id",
          foreignField: "_id",
          as: "brodcasted_by",
        },
      },
      { $unwind: "$brodcasted_by" },
      {
        $lookup: {
          from: "users",
          localField: "uploaded_content.hopper_id",
          foreignField: "_id",
          as: "uploaded_by",
        },
      },
      { $unwind: "$uploaded_by" },
      {
        $project: {
          _id: 1,
          task_id: 1,
          uploaded_content: 1,
          // createdAt:1,
          brodcasted_by: 1,
          uploaded_by: 1,
          imagecount: {
            $size: {
              $filter: {
                input: "$uploaded_content",
                as: "content",
                cond: { $eq: ["$$content.type", "image"] },
              },
            },
          },
          videocount: {
            $size: {
              $filter: {
                input: "$uploaded_content",
                as: "content",
                cond: { $eq: ["$$content.type", "video"] },
              },
            },
          },

          interviewcount: {
            $size: {
              $filter: {
                input: "$uploaded_content",
                as: "content",
                cond: { $eq: ["$$content.type", "interview"] },
              },
            },
          },


          amount_paid: {
            $sum: "$uploaded_content.amount_paid"
          },

          // imagevolume: imagecount * task_id.photo_price
        },
      },

      {
        $addFields: {
          total_image_price: {
            $multiply: ["$imagecount", "$task_id.photo_price"],
          },
          total_video_price: {
            $multiply: ["$videocount", "$task_id.videos_price"],
          },
          total_interview_price: {
            $multiply: ["$interviewcount", "$task_id.interview_price"],
          },
          // total_amountof_content: {
          //   $sum: {
          //     $add: ["$total_image_price", "$total_video_price", "$total_interview_price"]
          //   }
          // }
        },
      },
      // {
      //   $addFields: {
      //     total_amountof_content: {
      //       $sum: {
      //         $add: [
      //           "$total_image_price",
      //           "$total_video_price",
      //           "$total_interview_price",
      //         ],
      //       },
      //     },
      //   },
      // },
      {
        $addFields: {
          total_amountof_content: {
            $sum: {
              $add: [
                { $ifNull: ["$total_image_price", 0] },
                { $ifNull: ["$total_video_price", 0] },
                { $ifNull: ["$total_interview_price", 0] }
              ]
            }
          },
          task_time:"$task_id.createdAt"
        }
      },
      {
        $lookup: {
          from: "avatars",
          localField: "uploaded_by.avatar_id",
          foreignField: "_id",
          as: "avatar_details",
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "task_id.category_id",
          foreignField: "_id",
          as: "category_details",
        },
      },

      {
        $sort:{task_time:-1}
      }
    ]
    const uses = await uploadedContent.aggregate(params);
    if (datas.hasOwnProperty("limit") && datas.hasOwnProperty("offset")) {
      params.push(
        {
          $skip: Number(datas.offset),
        },
        {
          $limit: Number(datas.limit),
        }
      );
    }

    const news = await uploadedContent.aggregate(params);
    // const response = await uploadedContent.aggregate([
    //     {
    //       $group: {
    //         _id: "$hopper_id",
    //         imagecount: { $sum: { $cond: [{ $eq: ["$type", "image"] }, 1, 0] } },
    //         videocount: { $sum: { $cond: [{ $eq: ["$type", "video"] }, 1, 0] } }
    //       }
    //     },
    //     {
    //       $lookup: {
    //         from: "users",
    //         localField: "_id",
    //         foreignField: "_id",
    //         as: "hopper"
    //       }
    //     },
    //     {
    //       $unwind: "$hopper"
    //     },
    //     {
    //       $lookup: {
    //         from: "avatars",
    //         localField: "hopper.avatar_id",
    //         foreignField: "_id",
    //         as: "avatar"
    //       }
    //     },
    //     {
    //       $unwind: "$avatar"
    //     },
    //     {
    //       $lookup: {
    //         from: "tasks",
    //         localField: "_id",
    //         foreignField: "_id",
    //         as: "hopper"
    //       }
    //     },
    //     {
    //       $unwind: "$hopper"
    //     },
    //   ])
    //   ;

    res.status(200).json({
      response: news,
      count: uses.length,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};


// exports.getalluploadedcontent = async (req, res) => {
//   const { limit = 10, offset = 0 } = req.query; // Assuming you're passing limit and offset as query parameters

//   try {
//     const aggregationPipeline = [
//       { $group: { _id: { hopper_id: "$hopper_id", task_id: "$task_id" }, uploaded_content: { $push: "$$ROOT" } } },
//       { $lookup: { from: "tasks", localField: "uploaded_content.task_id", foreignField: "_id", as: "task_id" } },
//       { $unwind: "$task_id" },
//       { $lookup: { from: "users", localField: "task_id.mediahouse_id", foreignField: "_id", as: "brodcasted_by" } },
//       { $unwind: "$brodcasted_by" },
//       { $lookup: { from: "users", localField: "uploaded_content.hopper_id", foreignField: "_id", as: "uploaded_by" } },
//       { $unwind: "$uploaded_by" },
//       {
//         $project: {
//           _id: 1,
//           task_id: 1,
//           uploaded_content: 1,
//           brodcasted_by: 1,
//           uploaded_by: 1,
//           imagecount: { $size: { $filter: { input: "$uploaded_content", as: "content", cond: { $eq: ["$$content.type", "image"] } } } },
//           videocount: { $size: { $filter: { input: "$uploaded_content", as: "content", cond: { $eq: ["$$content.type", "video"] } } } },
//           interviewcount: { $size: { $filter: { input: "$uploaded_content", as: "content", cond: { $eq: ["$$content.type", "interview"] } } } },
//           amount_paid: { $sum: "$uploaded_content.amount_paid" }
//         }
//       },
//       {
//         $addFields: {
//           total_image_price: { $multiply: ["$imagecount", "$task_id.photo_price"] },
//           total_video_price: { $multiply: ["$videocount", "$task_id.videos_price"] },
//           total_interview_price: { $multiply: ["$interviewcount", "$task_id.interview_price"] }
//         }
//       },
//       {
//         $addFields: {
//           total_amountof_content: { $sum: ["$total_image_price", "$total_video_price", "$total_interview_price"] }
//         }
//       },
//       { $lookup: { from: "avatars", localField: "uploaded_by.avatar_id", foreignField: "_id", as: "avatar_details" } },
//       { $lookup: { from: "categories", localField: "task_id.category_id", foreignField: "_id", as: "category_details" } },
//       { $skip: parseInt(offset) },
//       { $limit: parseInt(limit) } // Adding limit and offset
//     ];

//     const uses = await uploadedContent.aggregate(aggregationPipeline);

//     const totalAggregationPipeline = [...aggregationPipeline]; // Copying existing pipeline
//     totalAggregationPipeline.pop(); // Removing the $skip and $limit stages
//     totalAggregationPipeline.push({ $count: "total" }); // Adding a $count stage

//     const totalDocs = await uploadedContent.aggregate(totalAggregationPipeline).next();

//     const totalCount = totalDocs ? totalDocs.total : 0;

//     res.status(200).json({ response: uses, count: uses.length, totalCount });
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };
exports.contentInfo = async (req, res) => {
  try {
    const data = req.query;
    let response, workSheetColumnName, length;
    if (data.content_id) {
      response = await Content.find({ _id: data.content_id })
        .populate("user_id hopper_id category_id tag_ids")
        .populate({
          path: "hopper_id",
          populate: {
            path: "avatar_id",
          },
        }).populate({
          path: "purchased_publication",
          // populate: {
          //   path: "avatar_id",
          // },
        });

      // response = await Contents.aggregate([
      //   {
      //     $match: {
      //       $expr: {
      //         $and: [{ $eq: ["$_id",  mongoose.Types.ObjectId(data.content_id)] }],
      //       },
      //     },
      //   },

      //   {
      //     $lookup: {
      //       from: "users",
      //       let: { assign_more_hopper_history: "$hopper_id" },
      //       // let: { assign_more_hopper_history: "$accepted_by" },
      //       pipeline: [
      //         {
      //           $match: {
      //             $expr: {
      //               $and: [{ $eq: ["$_id", "$$assign_more_hopper_history"] }],
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
      //       as: "hopper_ids",
      //     },
      //   },
      //   { $unwind: "$hopper_ids" },
      //   {
      //     $lookup: {
      //       from: "categories",
      //       localField: "category_id",
      //       foreignField: "_id",
      //       as: "category_details",
      //     },
      //   },

      //   {
      //     $lookup: {
      //       from: "tags",
      //       localField: "tags_ids",
      //       foreignField: "_id",
      //       as: "tags_detail",
      //     },
      //   },

      //   {
      //     $lookup: {
      //       from: "admins",
      //       localField: "user_id",
      //       foreignField: "_id",
      //       as: "user_ids",
      //     },
      //   },

      //   {
      //     $addFields: {
      //       imagecount: {
      //         $cond: {
      //           if: { $eq: ["$content.media_type", "image"] },
      //           then: 1,
      //           else: 0,
      //         },
      //       },

      //       videocount: {
      //         $cond: {
      //           if: { $eq: ["$content.media_type", "video"] },
      //           then: 1,
      //           else: 0,
      //         },
      //       },
      //       interviewcount: {
      //         $cond: {
      //           if: { $eq: ["$content.media_type", "interview"] },
      //           then: 1,
      //           else: 0,
      //         },
      //       },

      //       // totalDislikes: { $sum: "$dislikes" }
      //     },
      //   },
      //   // { $unwind: "$category_details" },
      //   // {
      //   //   $project: {
      //   //     _id: 1,
      //   //     user_ids: 1,
      //   //     hopper_ids: 1,
      //   //     category_details: 1,
      //   //     tags_detail: 1,
      //   //     imagecount: {
      //   //       $size: {
      //   //         $filter: {
      //   //           input: "$uploaded_content",
      //   //           as: "content",
      //   //           cond: { $eq: ["$$contenttype", "image"] },
      //   //         },
      //   //       },
      //   //     },
      //   //     videocount: {
      //   //       $size: {
      //   //         $filter: {
      //   //           input: "$uploaded_content",
      //   //           as: "content",
      //   //           cond: { $eq: ["$$content.type", "video"] },
      //   //         },
      //   //       },
      //   //     },

      //   //     interviewcount: {
      //   //       $size: {
      //   //         $filter: {
      //   //           input: "$uploaded_content",
      //   //           as: "content",
      //   //           cond: { $eq: ["$$content.type", "interview"] },
      //   //         },
      //   //       },
      //   //     },

      //   //     // imagevolume: imagecount * task_id.photo_price
      //   //   },
      //   // },
      // ]);
      workSheetColumnName = [
        "approved details",
        "Volume / Type",
        "Asking price",
        "Sale price",
        "Sale status",
        "Amount received",
        "Payable to Hopper",
        "Received from",
        "payment recived details",
      ];

      length = 0;
      var length1 = 0;
      const values = response.map((x) =>
        x.content.map((val) =>
          val.media_type == "image"
            ? length++
            : val.media_type == "video"
              ? length1++
              : 0
        )
      );

      console.log("data.assign_more_hopper", values);
      // const assignHopper = await values.map( (hoper) => hoper.media_type );
      // console.log("assignmorehk---",assignHopper);
      //  if(values == "video"){
      // length++
      //        }
    } else if (data.task_id) {
      response = await uploadedContent
        .find({ _id: data.task_id })
        .populate("task_id hopper_id")
        .populate({
          path: "hopper_id",
          populate: {
            path: "avatar_id",
          },
        })
        .populate({
          path: "task_id",
          populate: {
            path: "mediahouse_id",
          },
        });

      length = 0;
      const values = response.map((x) => x.content);
      //  const assignHopper = await values.map( (hoper) => hoper.media_type );
      //    console.log("assignHopper --->",assignHopper);

      const ids = values;
      // console.log("values --->",values);
      // const values   = data.assign_more_hopper.map((x) => x)
      // console.log("values",values);
      // for (let i = 0; i < data.assign_more_hopper.length; i++) {
      //   const element = array[i];

      // }
      console.log("data.assign_more_hopper", ids);

      //  for (let i = 0; i < response.length; i++) {
      // if(assignHopper == "video"){
      //   length++
      // }

      //  }
      workSheetColumnName = [
        "Task broadcasted by",
        "Volume / Type",
        "total price",
        "Amount received",
        "Sale status",
        "Payable to Hopper",
        "Received from",
        "payment recived details",
      ];
      // .populate({
      //   path: "task_id",
      //   populate: {
      //     path: "tag_ids",
      //   },
      // });
    } else if (data.live_task_id) {
      //  const responses = await BroadCastTask
      //         .find({_id:data.live_task_id})
      response = await accepted_tasks
        .find({
          task_id: mongoose.Types.ObjectId(data.live_task_id),
          hopper_id: mongoose.Types.ObjectId(data.hopper_id),
        })
        .populate("hopper_id task_id")
        .populate({
          path: "hopper_id",
          populate: {
            path: "avatar_id",
          },
        });
      // .populate({
      //   path: "task_id",
      //   populate: {
      //     path: "tag_ids",
      //   },
      // });
    } else {
      console.log("error");
    }

    // const workSheetColumnName = [
    //   "time and date " || "",
    //   "location",
    //   "employee name",
    //   "brodcasted by",
    //   "task_details",
    //   "volume",
    //   "mode",
    //   "remarks",
    // ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = response;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      // let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      // let admin_name, legal, Checkandapprove;
      // if (val.admin_details) {
      //   admin_name = val.admin_details.name;
      // }
      // let employee = [admin_name, formattedDate2];
      // let employee_str = employee.join("\n");
      // let hppername = val.first_name + " " + val.last_name;

      let sss =
        val.photo_price == null
          ? 0
          : 0 + val.videos_price == null
            ? 0
            : 0 + val.interview_price == null
              ? 0
              : 0;

      return [
        data.content_id ? val.status : val.task_id.mediahouse_id.name,
        data.content_id ? length + " " + length1 : 0,
        data.content_id ? val.ask_price : sss,
        // val.task_id,
        data.content_id ? val.sale_status : "unsold",
        // val.mode,
        // val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    //  response = await User.findOne({ _id: data.hopper_id });
    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      response: response,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.addactiondetails = async (req, res) => {
  try {
    const reqData = req.body;
    (reqData.admin_id = req.user._id), console.log("reqdata", reqData);
    await db.createItem(reqData, addactiondetails);
    res.status(200).json({
      code: 200,
      uploaded: true,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getactiondetails = async (req, res) => {
  try {
    const data = req.query;

    let condition;
    if (data.type == "livetask") {
      condition = {
        type: data.type,
        task_id: data.task_id,
        // hopper_id: data.hopper_id,
      };
    } else if (data.type == "liveUploaded") {
      condition = {
        type: data.type,
        task_id: data.task_id,
        hopper_id: data.hopper_id,
      };
    } else if (data.type == "liveUploaded") {
      condition = {
        type: data.type,
        task_id: data.task_id,
        hopper_id: data.hopper_id,
      };
    }
    else {
      condition = {
        type: data.type,
        hopper_id: data.hopper_id,
        content_id: data.content_id,
      };
    }

    const CATEGORIES = await addactiondetails
      .find(condition)
      .populate("hopper_id admin_id")
      .populate({
        path: "admin_id",
        populate: {
          path: "designation_id",
        },
      })
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .populate({
        path: "admin_id",
        populate: {
          path: "office_id",
        },
      }).sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "employee details",
      "office_id",
      "mode",
      "contact no.",
      "conversation with hopper",
      "action taken",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = CATEGORIES;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      return [
        formattedDate,
        val.admin_id.name,
        val.admin_id.office_id,
        val.mode,
        val.hopper_id,
        val.coversationWithhopper,
        val.Actiontaken,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    // db.getItems(addactiondetails, condition)
    res.status(200).json({
      code: 200,
      count: await addactiondetails.countDocuments(condition),
      fullPath: STORAGE_PATH_HTTP + fullPath,
      response: CATEGORIES,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updatecontentinfo = async (req, res) => {
  try {
    const data = req.body;

    if (data.content_id && data.hopper_id) {
      await db.updateItem(data.content_id, Content, data);
      await db.updateItem(data.hopper_id, User, data);
    } else if (data.task_id && data.hopper_id) {
      await db.updateItem(data.task_id, BroadCastTask, data);
      await db.updateItem(data.hopper_id, User, data);
    } else {
      console.log("error");
    }

    // const responst = await   db.updateItem(data.id, User, data);

    res.status(200).json({
      code: 200,
      response: true,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.addcommitionstr = async (req, res) => {
  try {
    const reqData = req.body;

    const data = await addcommitionstr.findOne({
      category: reqData.category,
    });

    if (data) {
      throw utils.buildErrObject(422, "This Category is Already Added");
    }
    const addCategory = await db.createItem(reqData, addcommitionstr);

    res.status(200).json({
      code: 200,
      response: addCategory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getcommition = async (req, res) => {
  try {
    const reqData = req.body;

    const data = await addcommitionstr.find({});
    res.status(200).json({
      code: 200,
      uploaded: data,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.updateCommition = async (req, res) => {
  try {
    const reqData = req.body;

    const data = await addcommitionstr
      .findOne({
        category: reqData.name,
      })
      .update({ percentage: reqData.percentage });

    res.status(200).json({
      code: 200,
      uploaded: data,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editcommitionstr = async (req, res) => {
  try {
    const reqData = req.body;

    const data = await addcommitionstr.findOne({ category: reqData.name });

    if (data) {
      throw utils.buildErrObject(422, "This Category is Already exist");
    }
    const addCategory = await addcommitionstr
      .findOne({
        category: reqData.name,
      })
      .update({ category: reqData.name });

    res.status(200).json({
      code: 200,
      response: addCategory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.deletecommitionstr = async (req, res) => {
  try {
    const reqData = req.params;

    const addCategory = await db.deleteItem(reqData.id, addcommitionstr);

    res.status(200).json({
      code: 200,
      response: addCategory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.contentpublished = async (req, res) => {
  try {
    const reqData = req.query;

    const addCategory = await Content.find({
      hopper_id: reqData.hopper_id,
    }).populate("purchased_publication category_id hopper_id  user_id").skip(reqData.offset ? Number(reqData.offset) : 0)
      .limit(reqData.limit ? Number(reqData.limit) : 0);

    // const resp = await hopperPayment.aggregate([
    //   {
    //     $group: {
    //       _id: "$hopper_id",
    //       // amount:{$sum: "$amount_paid_to_hopper"}
    //       Data: { $push: "$$ROOT" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "hopper_ids",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "contents",
    //       localField: "Data.content_id",
    //       foreignField: "_id",
    //       as: "content_id",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "contents",
    //       localField: "Data.task",
    //       foreignField: "_id",
    //       as: "content_id",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "users",
    //       let: { assign_more_hopper_history: "$_id" },
    //       // let: { assign_more_hopper_history: "$accepted_by" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [{ $eq: ["$_id", "$$assign_more_hopper_history"] }],
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
    //         // { $unwind: "$avatar_details" ,
    //         // preserveNullAndEmptyArrays: true},

    //         {
    //           $lookup: {
    //             from: "categories",
    //             localField: "category_id",
    //             foreignField: "_id",
    //             as: "category_details",
    //           },
    //         },

    //         // { $unwind: "$category_details" ,
    //         // preserveNullAndEmptyArrays: true},
    //       ],
    //       as: "hopper_details",
    //     },
    //   },

    //   // {
    //   //   $addFields: {
    //   //    valueforid:"$content_details._id"
    //   //   },
    //   // },
    //   {
    //     $lookup: {
    //       from: "hopperpayments",
    //       let: { contentIds: "$hopper_id", list: "$_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$hopper_id", "$$list"] },
    //                 { $eq: ["$paid_status_for_hopper", false] },
    //                 // { $eq: ["$content_id", "$$id"] },
    //                 // { $eq: ["$type", "content"] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "transictions",
    //     },
    //   },

    //   {
    //     $addFields: {
    //       // uploadedcontent: "$task_id",
    //       // acceptedby: "$acepted_task_id",
    //       payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

    //       recived_from_mediahouse: { $sum: "$transictions.amount" },
    //       presshop_commission: { $sum: "$transictions.presshop_commission" },

    //       // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
    //     },
    //   },

    //   // {
    //   //   $addFields: {
    //   //     // uploadedcontent: "$task_id",
    //   //     // acceptedby: "$acepted_task_id",
    //   //     payable_to_hopper: { $sum: "$Data.payable_to_hopper" },

    //   //     recived_from_mediahouse: { $sum: "$Data.amount" },
    //   //     presshop_commission: { $sum: "$Data.presshop_commission" },

    //   //     // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
    //   //   },
    //   // },

    //   // {
    //   //   $lookup: {
    //   //     from: "uploaded",
    //   //     localField: "uploaded_content.task_id",
    //   //     foreignField: "_id",
    //   //     as: "task_id",
    //   //   },
    //   // },
    //   // { $unwind: "$task_id" },

    //   // {
    //   //   $match:{
    //   //     media_house_id: data.media_house_id,
    //   //     hopper_id: data.hopper_id,
    //   //     content_id: data.content_id,
    //   //   }
    //   // }
    // ]);

    const workSheetColumnName = [
      "Date and time",
      "employee name",
      "description",
      "type",
      "licence",
      "catagory",
      "purchased publication",
      "Mode",
      "Remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = addCategory;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);


      let media_type_arr = "assa";


      return [
        formattedDate,
        val.admin_id,
        "val.content_id.description",
        "val.content_id.type",
        "licence",
        "val.content_id.category_id.name",
        "val.",
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;
    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      count: await Content.countDocuments({
        hopper_id: reqData.hopper_id,
      }),
      response: addCategory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.edithopperviewHistory = async (req, res) => {
  try {
    const data = req.body;

    const updateHopperObj = {
      user_id: req.user._id,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      // status: data.status,
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      // hopper_id:data.hopper_id,
      mode: data.mode,
      // status: data.status,
      remarks: data.latestAdminRemark,
    };

    var [editHopper, history] = await Promise.all([
      db.updateItem(data.content_id, Content, updateHopperObj),
      db.createItem(createAdminHistory, hopperviewPublishedHistory),
    ]);

    res.status(200).json({
      code: 200,
      response: editHopper,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.gethopperViewHistory = async (req, res) => {
  try {
    const data = req.params;

    // const { contentList, totalCount } = await db.gethopperContenthistoryList(
    //   hopperviewPublishedHistory,
    //   data
    // );

    const contentList = await hopperviewPublishedHistory
      .find({ content_id: data.content_id })
      .populate("admin_id content_id")
      .populate({
        path: "content_id",
        populate: {
          path: "category_id",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "purchased_publication",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
        },
      })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    console.log("users", contentList);

    // set xls Column Name
    const workSheetColumnName = [
      "Date and time",
      "employee name",
      "description",
      "type",
      "licence",
      "catagory",
      "purchased publication",
      "Mode",
      "Remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = contentList;

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //type
      let media_type_arr = "assa";
      // val.content_id.forEach((element) => {
      //   media_type_arr.push(element.type);
      // });

      // let media_type_str = media_type_arr.join();

      //published_by
      // let published_by =
      //   val.hopper_details.first_name + val.hopper_details.last_name;
      // // hopper_id
      // //1st level check
      // let nudity = "nudity : " + val.firstLevelCheck.nudity;
      // let isAdult = "isAdult : " + val.firstLevelCheck.isAdult;
      // let isGDPR = "isGDPR : " + val.firstLevelCheck.isGDPR;
      // let first_check_arr = [nudity, isAdult, isGDPR];
      // let first_check_str = first_check_arr.join("\n");
      // // hopper_details
      // //Employee details
      // let dateStr2 = val.updatedAt;
      // let dateObj2 = new Date(dateStr2);

      // let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      // let admin_name;
      // if (val.admin_details) {
      //   admin_name = val.admin_details.name;
      // }
      // let employee = [admin_name, formattedDate2];
      // let employee_str = employee.join("\n");

      return [
        formattedDate,
        val.admin_id.name,
        val.content_id.description,
        val.content_id.type,
        "licence",
        val.content_id.category_id.name,
        "val.",
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;
    res.status(200).json({
      code: 200,
      // totalCount: totalCount,
      count: await hopperviewPublishedHistory.countDocuments({ content_id: data.content_id }),
      fullPath: STORAGE_PATH_HTTP + fullPath,
      contnetMgmtHistory: contentList,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.liveUploadedContentmangeHopper = async (req, res) => {
  try {
    const yesterdayEnd = new Date();
    const data = req.query;

    // const uses = await uploadedContent.aggregate([
    //   // {
    //   //   $match: {
    //   //     hopper_id: mongoose.Types.ObjectId(data.hopper_id),
    //   //     // room_type: data.room_type,
    //   //   },
    //   // },

    //   {
    //     $group: {
    //       _id: { hopper_id: "$hopper_id", task_id: "$task_id" },

    //       //"$hopper_id",
    //       uploaded_content: { $push: "$$ROOT" },
    //     },
    //   },
    //   // {
    //   //   $match: {
    //   //     $expr: {
    //   //       $and: [{ $gt: ["$uploaded_content.task_id.deadline_date", yesterdayEnd] }],
    //   //     },
    //   //   },
    //   // },
    //   // {
    //   //   $addFields: {
    //   //     imagecount: {
    //   //       $sum: {
    //   //       $cond: {
    //   //         if: { $eq: ["$type", "image"] },
    //   //         then: 1,
    //   //         else: 0,
    //   //       },
    //   //     },
    //   //     },
    //   //   },
    //   // },
    //   {
    //     $lookup: {
    //       from: "tasks",
    //       localField: "uploaded_content.task_id",
    //       foreignField: "_id",
    //       as: "task_id",
    //     },
    //   },
    //   { $unwind: "$task_id" },
    //   // {
    //   //   $match: {
    //   //     $expr: {
    //   //       $and: [{ $gt: ["$task_id.deadline_date", yesterdayEnd] }],
    //   //     },
    //   //   },
    //   // },
    //   //  {
    //   //   $group: {
    //   //     _id: "$hopper_id",
    //   //     uploaded_content: { $push: "$$ROOT" },
    //   //   },
    //   // },

    //   // {
    //   //   $lookup: {
    //   //     from: "acceptedtasks",
    //   //     localField: "_id",
    //   //     foreignField: "task_id",
    //   //     as: "acepted_Contents",
    //   //   },
    //   // },

    //   {
    //     $lookup: {
    //       from: "acceptedtasks",
    //       let: { lat: "$task_id", long: "$milesss" },

    //       pipeline: [
    //         {
    //                   $match: {
    //                     $expr: {
    //                       $and: [{ $eq: ["$task_id", "$$lat"] }

    //                     ],
    //                     },
    //                   },
    //                 },
    //       ],
    //       as: "assignmorehopperList",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "task_id.mediahouse_id",
    //       foreignField: "_id",
    //       as: "brodcasted_by",
    //     },
    //   },
    //   { $unwind: "$brodcasted_by" },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "uploaded_content.hopper_id",
    //       foreignField: "_id",
    //       as: "uploaded_by",
    //     },
    //   },
    //   { $unwind: "$uploaded_by" },
    //   // {
    //   //   $project: {
    //   //     _id: 1,
    //   //     task_id: 1,
    //   //     uploaded_content: 1,
    //   //     brodcasted_by: 1,
    //   //     uploaded_by: 1,
    //   //     imagecount: {
    //   //       $size: {
    //   //         $filter: {
    //   //           input: "$uploaded_content",
    //   //           as: "content",
    //   //           cond: { $eq: ["$$content.type", "image"] },
    //   //         },
    //   //       },
    //   //     },
    //   //     videocount: {
    //   //       $size: {
    //   //         $filter: {
    //   //           input: "$uploaded_content",
    //   //           as: "content",
    //   //           cond: { $eq: ["$$content.type", "video"] },
    //   //         },
    //   //       },
    //   //     },

    //   //     interviewcount: {
    //   //       $size: {
    //   //         $filter: {
    //   //           input: "$uploaded_content",
    //   //           as: "content",
    //   //           cond: { $eq: ["$$content.type", "interview"] },
    //   //         },
    //   //       },
    //   //     },

    //   //     // imagevolume: imagecount * task_id.photo_price
    //   //   },
    //   // },

    //   // {
    //   //   $addFields: {
    //   //     total_image_price: {
    //   //       $multiply: ["$imagecount", "$task_id.photo_price"],
    //   //     },
    //   //     total_video_price: {
    //   //       $multiply: ["$videocount", "$task_id.videos_price"],
    //   //     },
    //   //     total_interview_price: {
    //   //       $multiply: ["$interviewcount", "$task_id.interview_price"],
    //   //     },
    //   //   },
    //   // },

    //   {
    //     $lookup: {
    //       from: "avatars",
    //       localField: "uploaded_by.avatar_id",
    //       foreignField: "_id",
    //       as: "avatar_details",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "task_id.category_id",
    //       foreignField: "_id",
    //       as: "category_details",
    //     },
    //   },
    // ]);

    const users = await accepted_tasks.aggregate([
      {
        $match: {
          hopper_id: mongoose.Types.ObjectId(data.hopper_id),
          // room_type: data.room_type,
        },
      },

      // {
      //   $skip: dataOffset,
      // },
      // {
      //   $limit: dataLimit,
      // },
    ]);

    const workSheetColumnName = [
      "time and date ",
      "Location",
      "brodcasted by",
      "uploaded by",
      "task_details",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = users;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername =
        val.uploaded_by.first_name + " " + val.uploaded_by.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        "val.task_id.location",
        "val.brodcasted_by.company_name",
        hppername,
        "val.task_id.task_description",
        "val.task_id.mode",
        "val.task_id.remarks",
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      response: users,
      // console:consoleArray,
      count: users.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewUploadedContentSummeryHopperviewdetails = async (req, res) => {
  try {
    const data = req.body;
    // data.task_id = JSON.parse(data.task_id);
    const history = await uploadedContent
      .find({ hopper_id: data.hopper_id, task_id: { $in: data.task_id } })
      .populate("task_id hopper_id admin_id purchased_publication")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "category_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "mediahouse_id",
        },
      })
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "purchased publication",
      "brodcasted by",
      "task_details",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.hopper_id.first_name + " " + val.hopper_id.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.purchased_publication,
        hppername,
        val.task_id.task_description,
        val.admin_id,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: await uploadedContent.countDocuments({
        hopper_id: data.hopper_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.edithopperviewDetailsHistory = async (req, res) => {
  try {
    const data = req.body;

    const updateHopperObj = {
      admin_id: req.user._id,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      // status: data.status,
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      task_id: data.task_id,
      mode: data.mode,
      // status: data.status,
      remarks: data.latestAdminRemark,
    };

    var [editHopper, history] = await Promise.all([
      db.updateItem(data.content_id, uploadedContent, updateHopperObj),
      db.createItem(
        createAdminHistory,
        hopperviewPublishedHistoryforviewDetails
      ),
    ]);

    res.status(200).json({
      code: 200,
      response: editHopper,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.viewUploadedContentSummeryHopperHistoryviewdetails = async (
  req,
  res
) => {
  try {
    const data = req.query;
    const history = await hopperviewPublishedHistoryforviewDetails
      .find({ content_id: data.content_id })
      .populate("task_id content_id admin_id")
      .populate({
        path: "task_id",
        populate: {
          path: "category_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "admin_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "mediahouse_id",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
        },
      })
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "task_details",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      // let admin_name, legal, Checkandapprove;
      // if (val.admin_details) {
      //   admin_name = val.admin_details.name;
      // }
      // let employee = [admin_name, formattedDate2];
      // let employee_str = employee.join("\n");
      // // let hppername = val.hopper_id.first_name + " " + val.hopper_id.last_name;

      // // let contactdetails = val.phone + " " + val.email;
      // if (val.is_Legal == "true") {
      //   legal = "YES";
      // } else {
      //   legal = "No";
      // }

      // if (val.is_Checkandapprove == "true") {
      //   Checkandapprove = "yes";
      // } else {
      //   Checkandapprove = "No";
      // }
      return [
        formattedDate,
        // val.admin_id.name,
        // hppername,
        val.content_id,
        val.admin_id,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count:
        await hopperviewPublishedHistoryforviewDetails.countDocuments({
          content_id: data.content_id,
        }),
      // })
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewSourcedContentSummeryPublicationviewdetails = async (req, res) => {
  try {
    const data = req.body;

    // data.task_id = JSON.parse(data.task_id);
    let condition = { createdAt: -1 }
    let filters = { task_id: { $in: data.task_id }, paid_status: true };
    if (data.hasOwnProperty("NewtoOld")) {
      condition = { createdAt: -1 }
    } else if (data.hasOwnProperty("OldtoNew")) {
      condition = { createdAt: 1 }
    } else if (data.hasOwnProperty("Highestpricedcontent")) {
      condition = { ask_price: -1 }
    } else if (data.hasOwnProperty("Lowestpricedcontent")) {
      condition = { ask_price: 1 }
    }

    if (data.hasOwnProperty("Paymentreceived")) {
      filters.amount_paid = { $gt: 0 }
    }

    if (data.hasOwnProperty("Paymentpayable")) {
      filters.amount_payable_to_hopper = { $gt: 0 }
    }
    const history = await uploadedContent
      .find(filters)
      .populate("task_id hopper_id purchased_publication admin_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "category_id",
        },
      })
      .populate({
        path: "task_id",
        populate: {
          path: "admin_id",
        },
      })
      .sort(condition)
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    // const totalcurrentMonths = await uploadedContent.aggregate([
    //   {
    //     $match: {"task_id":{ $in: data.task_id }}
    //   },

    // {
    //   $group: {
    //     _id: "$hopper_id",
    //     // totalamountpaid: { $avg: "$amount_paid" },
    //   },
    // },
    // {
    //   $lookup: {
    //     from: "users",
    //     let: { hopper_id: "$_id" },

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
    //           as: "avatar_id",
    //         },
    //       },
    //       { $unwind: "$avatar_id" },
    //     ],
    //     as: "hopper_id",
    //   },
    // },

    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "_id",
    //     foreignField: "_id",
    //     as: "hopper_id",
    //   },
    // },
    // { $unwind: "$hopper_id" },
    // ]);

    const workSheetColumnName = [
      "time and date ",
      "task details",
      "type",
      "category",
      "published by",
      "sale price",
      "sale status",
      "amount recived",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      // if (val.admin_details) {
      //   admin_name = val.admin_details.name;
      // }
      // let employee = [admin_name, formattedDate2];
      // let employee_str = employee.join("\n");
      // let hppername = val.hopper_id.first_name + " " + val.hopper_id.last_name;

      // let contactdetails = val.phone + " " + val.email;
      // if (val.is_Legal == "true") {
      //   legal = "YES";
      // } else {
      //   legal = "No";
      // }

      if (val.paid_status == "true") {
        Checkandapprove = "sold";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.task_id.task_description,
        val.task_id.type,
        val.task_id.category_id.name,
        val.hopper_id.first_name,
        val.amount_paid,
        Checkandapprove,
        val.amount_paid,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: await uploadedContent.countDocuments({
        task_id: { $in: data.task_id },
        paid_status: true,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editSourcedPublicaationviewDetails = async (req, res) => {
  try {
    const data = req.body;

    const updateHopperObj = {
      admin_id: req.user._id,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      // status: data.status,
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      task_id: data.task_id,
      mode: data.mode,
      // status: data.status,
      remarks: data.latestAdminRemark,
    };

    var [editHopper, history] = await Promise.all([
      db.updateItem(data.content_id, uploadedContent, updateHopperObj),
      db.createItem(createAdminHistory, SourcedpublicationviewDetails),
    ]);

    res.status(200).json({
      code: 200,
      response: editHopper,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.viewSourcedContentSummeryPublicationviewdetailsHistory = async (
  req,
  res
) => {
  try {
    const data = req.query;

    let condition = { createdAt: -1 }
    let filters;
    if (data.hasOwnProperty("NewtoOld")) {
      condition = { createdAt: -1 }
    } else if (data.hasOwnProperty("OldtoNew")) {
      condition = { createdAt: 1 }
    } else if (data.hasOwnProperty("Highestpricedcontent")) {
      condition = { ask_price: -1 }
    } else if (data.hasOwnProperty("Lowestpricedcontent")) {
      condition = { ask_price: 1 }
    }

    if (data.hasOwnProperty("Paymentreceived")) {
      filters.amountpaid = { amountpaid: { $gt: 0 } }
    }

    if (data.hasOwnProperty("Paymentpayable")) {
      filters = { amountPayabletoHopper: { $gt: 0 } }
    }
    // data.task_id = JSON.parse(data.task_id)
    const history = await SourcedpublicationviewDetails.find({
      content_id: data.content_id,
      // purchased_publication: data.mediahouse_id,
    })
      .populate("content_id admin_id")
      .populate({
        path: "content_id",
        populate: {
          path: "purchased_publication",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "task_id",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "task_id",
          // path:  "avatar_id",
          populate: {
            path: "category_id",
          },
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
          // path:  "avatar_id",
          populate: {
            path: "avatar_id",
          },
        },
      })
      .sort(condition)
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "Admin Name",
      "mode",
      "remarks",
      "Created At",
      "Updated At"
    ];

    // // set xls file Name
    // const workSheetName = "user";

    // // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    // //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name = val.admin_id.name;


      return [
        admin_name,
        val.mode,
        val.remarks,
        formattedDate,
        formattedDate2,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, worksheetData); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: await SourcedpublicationviewDetails.countDocuments({
        content_id: data.content_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewPurchasedContentSummeryPublicationviewdetails = async (
  req,
  res
) => {
  try {
    const data = req.query;

    let condition = { createdAt: -1 }
    let filters;
    if (data.hasOwnProperty("NewtoOld")) {
      condition = { createdAt: -1 }
    } else if (data.hasOwnProperty("OldtoNew")) {
      condition = { createdAt: 1 }
    } else if (data.hasOwnProperty("Highestpricedcontent")) {
      condition = { ask_price: -1 }
    } else if (data.hasOwnProperty("Lowestpricedcontent")) {
      condition = { ask_price: 1 }
    }

    if (data.hasOwnProperty("Paymentreceived")) {
      filters.amountpaid = { amountpaid: { $gt: 0 } }
    }

    if (data.hasOwnProperty("Paymentpayable")) {
      filters = { amountPayabletoHopper: { $gt: 0 } }
    }

    // if (data.hopper_search) {
    //   filters.hopper_name = { $regex: new RegExp("^" + datas.hopper_search + "$", "i") }
    // }
    // data.task_id = JSON.parse(data.task_id)

    const history = await Content.find({
      paid_status: "paid",
      purchased_publication: data.mediahouse_id,
    })
      .populate("hopper_id purchased_publication category_id user_id")
      .populate({
        path: "hopper_id",
        populate: {
          path: "avatar_id",
        },
      })
      // .sort(condition)
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);



    const datas = await hopperPayment.aggregate([
      {
        $match: {
          media_house_id: mongoose.Types.ObjectId(data.mediahouse_id),
          type: "content"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "media_house_id",
          foreignField: "_id",
          as: "purchased_publication",
        },
      },
      {
        $unwind: {
          path: "$purchased_publication",
          preserveNullAndEmptyArrays: true,
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
                as: "avatar_id",
              },
            },
            {
              $unwind: {
                path: "$avatar_id",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: "hopper_id",
        },
      },
      {
        $unwind: {
          path: "$hopper_id",
          preserveNullAndEmptyArrays: true,
        },
      },

      // {
      //   $lookup: {
      //     from: "hopperpayments",
      //     let: { contentIds: "$hopper_id", list: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$media_house_id", "$$list"] },
      //               // { $eq: ["$paid_status_for_hopper", true] },
      //               // { $eq: ["$content_id", "$$id"] },
      //               { $eq: ["$type", "content"] },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "transictions_true",
      //   },
      // },
      {
        $lookup: {
          from: "content",
          localField: "content_id",
          foreignField: "_id",
          as: "content_details",
        },
      },
      {
        $unwind: {
          path: "$content_details",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          ask_price: "$content_details.ask_price",
        },
      }
    ])

    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "task_details",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.hopper_id.first_name + " " + val.hopper_id.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.user_id.name,
        hppername,
        val.description,
        val.user_id,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: await Content.countDocuments({
        paid_status: "paid",
        purchased_publication: data.mediahouse_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editPurchasedPublicaationviewDetailsHistory = async (req, res) => {
  try {
    const data = req.body;

    const updateHopperObj = {
      // user_id: req.user._id,
      remarks: data.latestAdminRemark,
      mode: data.mode,
      // status: data.status,
    };

    const createAdminHistory = {
      admin_id: req.user._id,
      content_id: data.content_id,
      mode: data.mode,
      // status: data.status,
      remarks: data.latestAdminRemark,
    };

    var [editHopper, history] = await Promise.all([
      db.updateItem(data.content_id, Content, updateHopperObj),
      db.createItem(createAdminHistory, purchasedpublicationviewDetailsHistoey),
    ]);

    res.status(200).json({
      code: 200,
      response: editHopper,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.viewPurchasedContentSummeryPublicationrHistoryviewdetails = async (
  req,
  res
) => {
  try {
    const data = req.query;
    let condition = { createdAt: -1 }
    let filters;
    if (data.hasOwnProperty("NewtoOld")) {
      condition = { createdAt: -1 }
    } else if (data.hasOwnProperty("OldtoNew")) {
      condition = { createdAt: 1 }
    } else if (data.hasOwnProperty("Highestpricedcontent")) {
      condition = { ask_price: -1 }
    } else if (data.hasOwnProperty("Lowestpricedcontent")) {
      condition = { ask_price: 1 }
    }

    if (data.hasOwnProperty("Paymentreceived")) {
      filters.amountpaid = { amountpaid: { $gt: 0 } }
    }

    if (data.hasOwnProperty("Paymentpayable")) {
      filters = { amountPayabletoHopper: { $gt: 0 } }
    }
    const history = await purchasedpublicationviewDetailsHistoey
      .find({ content_id: data.content_id })
      .populate("content_id admin_id category_id hopper_id")
      .populate({
        path: "content_id",
        populate: {
          path: "category_id",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "purchased_publication",
        },
      })
      .populate({
        path: "content_id",
        populate: {
          path: "hopper_id",
          // path:  "avatar_id",
          populate: {
            path: "avatar_id",
          },
        },
      })
      .sort(condition)
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "purchased publication",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_id.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername =
        val.content_id.hopper_id.first_name +
        " " +
        val.content_id.hopper_id.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.admin_id || "admin",
        hppername,
        val.content_id.purchased_publication.company_name,
        val.admin_id,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: await purchasedpublicationviewDetailsHistoey.countDocuments({
        content_id: data.content_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewdetails = async (req, res) => {
  try {
    const data = req.query;
    const history = await accepted_tasks
      .find({ hopper_id: data.hopper_id, task_id: data.task_id })
      .populate("hopper_id task_id")
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);


    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "purchased publication",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_id.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      // let hppername =
      //   val.content_id.hopper_id.first_name +
      //   " " +
      //   val.content_id.hopper_id.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        "val.admin_id" || "admin",
        "hppername",
        "val.content_id.purchased_publication.company_name",
        "val.admin_id",
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: history.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.viewdetailsforLivetask = async (req, res) => {
  try {
    const data = req.query;
    const history = await accepted_tasks
      .find({ task_id: data.task_id })
      .populate("hopper_id task_id")
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);


    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "purchased publication",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_id.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      // let hppername =
      //   val.content_id.hopper_id.first_name +
      //   " " +
      //   val.content_id.hopper_id.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        "val.admin_id" || "admin",
        "hppername",
        "val.content_id.purchased_publication.company_name",
        "val.admin_id",
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;


    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: history.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.getlistofacceptedhopperbytask = async (req, res) => {
  try {
    const data = req.query;
    const history = await accepted_tasks
      .find({ task_id: data.task_id })
      .populate("hopper_id task_id")
      .sort({ createdAt: -1 })
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    res.status(200).json({
      code: 200,
      // fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: history.length,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const data = req.body;
    data.sender_id = req.user._id;
    const notiObj = {
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      // data.receiver_id,
      title: data.title,
      body: data.body,
    };
    console.log(notiObj);
    const resp = await _sendNotification(notiObj);
    console.log("resp", resp);

    return res.status(200).json({
      code: 200,
      data: "sent",
    });
    // if (resp.length > 0) {

    //   return res.status(200).json({
    //     code: 200,
    //     data: "sent",
    //   });
    // } else {
    //   return res.status(400).json({
    //     code: 400,
    //     error: "error",
    //   });
    // }
  } catch (error) {
    handleError(res, error);
  }
};

exports.gethopperfornotification = async (req, res) => {
  try {
    const gethopper = await User.find({
      role: "Hopper",
      isPermanentBlocked: false,
      isTempBlocked: false,
      status: "approved",
    });
    res.status(200).json({
      code: 200,
      data: gethopper,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getmediahousefornotification = async (req, res) => {
  try {
    const gethopper = await User.find({
      role: "MediaHouse",
      isPermanentBlocked: false,
      isTempBlocked: false,
      status: "approved",
    });
    res.status(200).json({
      code: 200,
      data: gethopper,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getnotification = async (req, res) => {
  try {
    const data2 = req.query
    if (req.query.id && req.query.type == "sent") {
      const gethopper = await notification
        .findOne({
          _id: req.query.id,
          sender_id: req.user._id,
          // is_admin:true
          // role: "MediaHouse",
          // isPermanentBlocked: false, isTempBlocked : false, status:"approved"
        })
        .populate("receiver_id").sort({createdAt:-1}).skip(data2.offset ? Number(data2.offset) : 0)
        .limit(data2.limit ? Number(data2.limit) : 0);
      res.status(200).json({
        code: 200,
              data: gethopper,
      });
    } else if (req.query.id && req.query.type == "received") {
      const gethopper = await notification
        .findOne({
          _id: req.query.id,
          // receiver_id: req.user._id,
          // role: "MediaHouse",
          // isPermanentBlocked: false, isTempBlocked : false, status:"approved"
        })
        .populate("sender_id").populate({
          
          // select: { _id: 1,task_id:1  ,imageAndVideo:1 ,type:1 },
          
            path: "sender_id",
            populate: {
              path: "avatar_id"
            }
          
        }).sort({createdAt:-1}).skip(data2.offset ? Number(data2.offset) : 0)
        .limit(data2.limit ? Number(data2.limit) : 0);
      res.status(200).json({
        code: 200,
        data: gethopper,
      });
    } else if (req.query.type == "sent") {
      
      const gethopper = await notification
        .find({
          sender_id: req.user._id,
          // is_admin:true
          // role: "MediaHouse",
          // isPermanentBlocked: false, isTempBlocked : false, status:"approved"
        }).populate("receiver_id").sort({createdAt:-1}).skip(data2.offset ? Number(data2.offset) : 0)
        .limit(data2.limit ? Number(data2.limit) : 0);
      res.status(200).json({
        code: 200,
        data: gethopper,
        totalCount:await notification.countDocuments({
          sender_id: req.user._id,
        }),
        unreadCount:await notification.countDocuments({
          sender_id: req.user._id,
          is_read:false
        })
      });
    } else if (req.query.search) {
      const condition = { sender_id: req.user._id }
      if (req.query.type == "sent") {
        condition.$or = [
          { title: req.query.title },
          { body: req.query.body },
        ]
      }

      if (req.query.type == "received") {
        delete condition.sender_id
        condition.receiver_id = req.user._id
        condition.$or = [
          { title: req.query.title },
          { body: req.query.body },
        ]
      }
      const gethopper = await notification
        .find(condition)
        .populate("receiver_id sender_id").sort({createdAt:-1}).skip(data2.offset ? Number(data2.offset) : 0)
        .limit(data2.limit ? Number(data2.limit) : 0);
      res.status(200).json({
        code: 200,
        data: gethopper,
        totalCount:await notification.countDocuments(condition),
        unreadCount:await notification.countDocuments({sender_id: req.user._id ,is_read:false})
      });
    } else {
      const gethopper = await notification
        .find({
          receiver_id: req.user._id,
          // is_admin:true
          // role: "MediaHouse",
          // isPermanentBlocked: false, isTempBlocked : false, status:"approved"
        })
        .populate("sender_id").sort({createdAt:-1}).skip(data2.offset ? Number(data2.offset) : 0)
        .limit(data2.limit ? Number(data2.limit) : 0);
      res.status(200).json({
        code: 200,
        data: gethopper,
        totalCount:await notification.countDocuments({
          receiver_id: req.user._id,
        }),
        unreadCount:await notification.countDocuments({
          receiver_id: req.user._id,
          is_read:false
        })
      });
    }
    
    // const gethopper = await notification.find({
    //   sender_id: req.user._id,
    //   // role: "MediaHouse",
    //   // isPermanentBlocked: false , isTempBlocked : false , status:"approved"
    // })
    // res.status(200).json({
    //   code: 200,
    //   data: gethopper,
    // });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.notificationlisting = async (req, res) => {
  try {
    const listing = await notification.find({});
    res.status(200).json({
      code: 200,
      data: listing,
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.updateNotification = async (req, res) => {
  try {
    const data = req.body 
    const listing = await notification.updateOne({_id:data.id},{$set:{is_read:true}});
    res.status(200).json({
      code: 200,
      data: listing,
    });
  } catch (error) {
    handleError(res, error);
  }
};
exports.serch = async (req, res) => {
  try {
    // ["pro", "amateur"]
    const data = req.query;

    if (data.serch == "serch") {
      if (data.published_by) {
        const findby = await Content.find({ hopper_id: data.published_by });
        const findbyupl = await uploadedContent.find({
          hopper_id: data.published_by,
        });
        res.status(200).json({
          code: 200,
          resp: findby,
          respforup: findbyupl,
        });
      }
    }
    // set xls Column Name

    // res.status(200).json({
    //   code: 200,
    //   fullPath: STORAGE_PATH_HTTP + fullPath,
    //   totalCount: totalCount,
    //   contentList: contentList,
    // });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

// exports.search = async (req, res) => {
//   try {
//     const data = req.query;
//     let findby;
//     let findbyupl;
//     let condition = {};
//     // condition.language = new RegExp(data.search, "i");
//     // if (data.search) {
//     //   const like = { $regex: data.search, $options: "i" };
//     //   condition.heading = like;
//     //   condition.description = like;
//     // }
//     // findby = await Content.find(condition).populate("hopper_id");
//     // findbyupl = await uploadedContent.find(condition).populate("task_id");


//     const resp = await Content.aggregate([
//       {
//         $match: {
//           $or: [
//             { heading: { $regex: data.search, $options: "i" } },
//             { description: { $regex: data.search, $options: "i" } }
//           ]
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           store: 1,
//           item: 1,
//           heading: 1,
//           description: 1
//         }
//       },
//       {
//         $lookup: {
//           from: "uploadcontents",
//           let: { searchData: data.search },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $eq: ["$type", "$$searchData"]
//                 }
//               }
//             }
//           ],
//           as: "uploadMatches"
//         }
//       },
//       {
//         $project: {
//           combinedMatches: { $concatArrays: ["$contentMatches", "$uploadMatches"] }
//         }
//       },
//       {
//         $unwind: "$combinedMatches"
//       },
//       {
//         $replaceRoot: { newRoot: "$combinedMatches" }
//       },
//       {
//         $sort: { _id: 1, }
//       }
//     ]);







//     res.status(200).json({
//       code: 200,
//       resp: resp
//     });
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };

async function getContentAmount(content_id) {
  try {


    // Assuming you have a data structure containing content IDs and their corresponding amounts
    const respon = await Content.findOne({ _id: content_id }).populate(
      "hopper_id"
    );


    console.log("data=================", respon)

    const responseforcategory = await Category.findOne({
      type: "commissionstructure",
      _id: "64c10c7f38c5a472a78118e2",
    }).populate("hopper_id");
    const commitionforpro = parseFloat(responseforcategory.percentage);
    const paybymedihousetoadmin = respon.amount_paid;
    //  end
    // for amateue
    const responseforcategoryforamateur = await Category.findOne({
      type: "commissionstructure",
      _id: "64c10c7538c5a472a78118c0",
    }).populate("hopper_id");

    const commitionforamateur = parseFloat(
      responseforcategoryforamateur.percentage
    );
    const paybymedihousetoadminforamateur = respon.amount_paid;
    if (respon.hopper_id.category == "pro") {
      const paid = commitionforpro * paybymedihousetoadmin;
      const percentage = paid / 100;

      const paidbyadmin = paybymedihousetoadmin - percentage;

      // await db.updateItem(content_id, Contents, {
      //   // sale_status:"sold",
      //   paid_status_to_hopper: true,
      //   amount_paid_to_hopper: paidbyadmin,
      //   presshop_committion: percentage,
      //   // purchased_publication: data.media_house_id,
      // });

      console.log("update=================")

      if (!respon.hopper_id.stripe_account_id) {
        throw utils.buildErrObject(422, "account is not verified");
      } else {
        // const transfer = await stripe.transfers.create({
        //   amount: parseInt(paidbyadmin),
        //   currency: "gbp", //"usd"
        //   destination: respon.hopper_id.stripe_account_id,
        // });


        const res = await db.updateItem(content_id, Contents, {
          // sale_status:"sold",
          paid_status_to_hopper: true,
          amount_paid_to_hopper: paidbyadmin,
          presshop_committion: percentage,
          // purchased_publication: data.media_house_id,
        });
        console.log("error=================")
        console.log("data------", res)




        const getProfessionalBookings = await hopperPayment.updateMany(
          { content_id: content_id },
          { $set: { paid_status_for_hopper: true } }
        );
        // console.log("data=================", getProfessionalBookings)
        const transfer = await stripe.transfers.create({
          amount: parseInt(paidbyadmin),
          currency: "gbp", //"usd"
          destination: respon.hopper_id.stripe_account_id,
        });
      }

      // res.json({
      //   code: 200,
      //   resp: "Paid",
      // });
    } else if (respon.hopper_id.category == "amateur") {
      const paid = commitionforamateur * paybymedihousetoadminforamateur;
      const percentage = paid / 100;

      const paidbyadmin = paybymedihousetoadminforamateur - percentage;

      // await db.updateItem(content_id, Contents, {
      //   // sale_status:"sold",
      //   paid_status_to_hopper: true,
      //   amount_paid_to_hopper: paidbyadmin,
      //   presshop_committion: percentage,
      //   // purchased_publication: data.media_house_id,
      // });

      if (!respon.hopper_id.stripe_account_id) {
        throw utils.buildErrObject(422, "account is not verified");
      } else {
        // const transfer = await stripe.transfers.create({
        //   amount: parseInt(paidbyadmin),
        //   currency: "gbp", //"usd"
        //   destination: respon.hopper_id.stripe_account_id,
        // });


        const res = await db.updateItem(content_id, Contents, {
          // sale_status:"sold",
          paid_status_to_hopper: true,
          amount_paid_to_hopper: paidbyadmin,
          presshop_committion: percentage,
          // purchased_publication: data.media_house_id,
        });



        console.log("data------", res)
        const getProfessionalBookings = await hopperPayment.updateMany(
          { content_id: content_id },
          { $set: { paid_status_for_hopper: true } }
        );

        const transfer = await stripe.transfers.create({
          amount: parseInt(paidbyadmin),
          currency: "gbp", //"usd"
          destination: respon.hopper_id.stripe_account_id,
        });
      }

      //    const updatePublishedContentObj = {
      //    paid_status_to_hopper: true,
      //     amount_paid_to_hopper: paidbyadmin,
      //     presshop_committion: percentage,
      // };
      //    await Contents.update(
      //      { hopper_id: mongoose.Types.ObjectId(data.hopper_id) },
      //       {
      //         // $push: { assign_more_hopper_history: assignHopper },
      //        $set: updatePublishedContentObj,
      //       }
      // ),

      // res.json({
      //   code: 200,
      //   resp: "Paid",
      // });
    } else {
      console.log("error");
    }
  } catch (err) {
    console.log("error", err);
  }
  // Return a default value or handle the case when content_id is not found
  // return 0;
}

async function gettaskContentAmount(task_content_id) {
  // Assuming you have a data structure containing content IDs and their corresponding amounts
  const respon = await uploadedContent
    .findOne({ _id: task_content_id })
    .populate("hopper_id");

  console.log("respon----------", respon)
  const responseforcategory = await Category.findOne({
    type: "commissionstructure",
    _id: "64c10c7f38c5a472a78118e2",
  }).populate("hopper_id");
  const commitionforpro = parseFloat(responseforcategory.percentage);
  const paybymedihousetoadmin = respon.amount_paid;
  //  end
  // for amateue
  const responseforcategoryforamateur = await Category.findOne({
    type: "commissionstructure",
    _id: "64c10c7538c5a472a78118c0",
  }).populate("hopper_id");
  const commitionforamateur = parseFloat(
    responseforcategoryforamateur.percentage
  );
  const paybymedihousetoadminforamateur = respon.amount_paid;
  if (respon.hopper_id.category == "pro") {
    const paid = commitionforpro * paybymedihousetoadmin;
    const percentage = paid / 100;

    const paidbyadmin = paybymedihousetoadmin - percentage;



    if (!respon.hopper_id.stripe_account_id) {
      throw utils.buildErrObject(422, "account is not verified");
    } else {
      const transfer = await stripe.transfers.create({
        amount: parseInt(paidbyadmin),
        currency: "gbp", //"usd"
        destination: respon.hopper_id.stripe_account_id,
      });

      await db.updateItem(task_content_id, uploadedContent, {
        // sale_status:"sold",
        paid_status_to_hopper: true,
        amount_paid_to_hopper: paidbyadmin,
        presshop_committion: percentage,
        // purchased_publication: data.media_house_id,
      });

      const getProfessionalBookings = await hopperPayment.updateMany(
        { task_content_id: task_content_id },
        { $set: { paid_status_for_hopper: true } }
      );
    }

    // res.json({
    //   code: 200,
    //   resp: "Paid",
    // });
  } else if (respon.hopper_id.category == "amateur") {
    const paid = commitionforamateur * paybymedihousetoadminforamateur;
    const percentage = paid / 100;

    const paidbyadmin = paybymedihousetoadminforamateur - percentage;



    if (!respon.hopper_id.stripe_account_id) {
      throw utils.buildErrObject(422, "account is not verified");
    } else {
      const transfer = await stripe.transfers.create({
        amount: parseInt(paidbyadmin),
        currency: "gbp", //"usd"
        destination: respon.hopper_id.stripe_account_id,
      });


      await db.updateItem(task_content_id, uploadedContent, {
        // sale_status:"sold",
        paid_status_to_hopper: true,
        amount_paid_to_hopper: paidbyadmin,
        presshop_committion: percentage,
        // purchased_publication: data.media_house_id,
      });

      const getProfessionalBookings = await hopperPayment.updateMany(
        { task_content_id: task_content_id },
        { $set: { paid_status_for_hopper: true } }
      );
    }

    //    const updatePublishedContentObj = {
    //    paid_status_to_hopper: true,
    //     amount_paid_to_hopper: paidbyadmin,
    //     presshop_committion: percentage,
    // };
    //    await Contents.update(
    //      { hopper_id: mongoose.Types.ObjectId(data.hopper_id) },
    //       {
    //         // $push: { assign_more_hopper_history: assignHopper },
    //        $set: updatePublishedContentObj,
    //       }
    // ),

    // res.json({
    //   code: 200,
    //   resp: "Paid",
    // });
  } else {
    console.log("error");
  }

  // Return a default value or handle the case when content_id is not found
  // return 0;
}

exports.contentPaymentforhoppr = async (req, res) => {
  try {
    const data = req.body;
    // for content by id
    if (data.content_id) {
      const respon = await Content.findOne({ _id: data.content_id }).populate(
        "hopper_id"
      );

      const responseforcategory = await Category.findOne({
        type: "commissionstructure",
        _id: "648fd15727368932e35b8c2c",
      }).populate("hopper_id");

      const commitionforpro = parseFloat(responseforcategory.percentage);

      const paybymedihousetoadmin = respon.amount_paid;
      //  end

      // for amateue
      const responseforcategoryforamateur = await Category.findOne({
        type: "commissionstructure",
        _id: "648fd16127368932e35b8c4a",
      }).populate("hopper_id");

      const commitionforamateur = parseFloat(
        responseforcategoryforamateur.percentage
      );

      const paybymedihousetoadminforamateur = respon.amount_paid;

      console.log("commitionforpro", commitionforpro);
      if (respon.hopper_id.category == "pro") {
        const paid = commitionforpro * paybymedihousetoadmin;
        const percentage = paid / 100;

        const paidbyadmin = paybymedihousetoadmin - percentage;

        await db.updateItem(data.content_id, Contents, {
          // sale_status:"sold",
          paid_status_to_hopper: true,
          amount_paid_to_hopper: paidbyadmin,
          presshop_committion: percentage,
          // purchased_publication: data.media_house_id,
        });

        if (!respon.hopper_id.stripe_account_id) {
          throw utils.buildErrObject(422, "account is not verified");
        } else {
          const transfer = await stripe.transfers.create({
            amount: parseInt(paidbyadmin),
            currency: "gbp", //"usd"
            destination: respon.hopper_id.stripe_account_id,
          });

          // const update = await hopperPayment.updateMany({
          //   content_id: data.content_id,
          //   paid_status_for_hopper: true,
          // });

          // await hopperPayment.update(
          //   { content_id: mongoose.Types.ObjectId(data.content_id) },
          //   {
          //     // $push: { assign_more_hopper_history: assignHopper },
          //     $set: {paid_status_for_hopper: true},
          //   }
          // )

          const getProfessionalBookings = await hopperPayment.updateMany(
            { content_id: data.content_id },
            { $set: { paid_status_for_hopper: true } }
          );

          const notiObj = {
            sender_id: req.user._id,
            receiver_id: respon.hopper_id,
            // data.receiver_id,
            title: "payment  Done",
            body: "payment  Done by Admin",
          };
          console.log(notiObj);
          const resp = await _sendNotification(notiObj);

          //  await db.updateItem(data.task_content_id, ho, {
          //   // sale_status:"sold",
          //   paid_status_for_hopper: true,
          //   amount_paid_to_hopper: paidbyadmin,
          //   presshop_committion: percentage,
          //   // purchased_publication: data.media_house_id,
          // });
        }

        res.json({
          code: 200,
          resp: "Paid",
        });
      } else if (respon.hopper_id.category == "amateur") {
        const paid = commitionforamateur * paybymedihousetoadminforamateur;
        const percentage = paid / 100;

        const paidbyadmin = paybymedihousetoadminforamateur - percentage;

        await db.updateItem(data.content_id, Contents, {
          // sale_status:"sold",
          paid_status_to_hopper: true,
          amount_paid_to_hopper: paidbyadmin,
          presshop_committion: percentage,
          // purchased_publication: data.media_house_id,
        });

        if (!respon.hopper_id.stripe_account_id) {
          throw utils.buildErrObject(422, "account is not verified");
        } else {
          const transfer = await stripe.transfers.create({
            amount: parseInt(paidbyadmin),
            currency: "gbp", //"usd"
            destination: respon.hopper_id.stripe_account_id,
            //respon.hopper_id.stripe_account_id
          });

          const getProfessionalBookings = await hopperPayment.updateMany(
            { content_id: data.content_id },
            { $set: { paid_status_for_hopper: true } }
          );


          const notiObj = {
            sender_id: req.user._id,
            receiver_id: respon.hopper_id,
            // data.receiver_id,
            title: "payment  Done",
            body: "payment  Done by Admin",
          };
          console.log(notiObj);
          const resp = await _sendNotification(notiObj);
        }

        //    const updatePublishedContentObj = {
        //    paid_status_to_hopper: true,
        //     amount_paid_to_hopper: paidbyadmin,
        //     presshop_committion: percentage,
        // };
        //    await Contents.update(
        //      { hopper_id: mongoose.Types.ObjectId(data.hopper_id) },
        //       {
        //         // $push: { assign_more_hopper_history: assignHopper },
        //        $set: updatePublishedContentObj,
        //       }
        // ),

        res.json({
          code: 200,
          resp: "Paid",
        });
      } else {
        console.log("error");
      }
    } else if (data.hopper_id && data.type == "content") {
      const responce = await User.findOne({ _id: data.hopper_id });
      const category = responce.category;
      const findcontentofHopper = await Content.find({
        hopper_id: data.hopper_id,
      });

      const values =
        typeof data.content_id == "string"
          ? JSON.parse(data.content_id)
          : data.content_id;
      // const assignHopper = await values.map(
      //   (hoper) => (hoper = mongoose.Types.ObjectId(hoper))
      // );

      // const callfunctuion = await getContentAmount(assignHopper);


      const resp = await values.forEach((content_id) => {
        getContentAmount(content_id);
      });


      const notiObj = {
        sender_id: req.user._id,
        receiver_id: data.hopper_id,
        // data.receiver_id,
        title: "payment  Done",
        body: "payment  Done by Admin",
      };
      console.log(notiObj);
      await _sendNotification(notiObj);
      res.json({
        code: 200,
        resp: "Paid",
      });
    } else if (data.task_content_id) {
      const c = await uploadedContent
        .findOne({ _id: data.task_content_id })
        .populate("hopper_id");


      console.log("response===========", c)

      const responseforcategory = await Category.findOne({
        type: "commissionstructure",
        _id: "648fd15727368932e35b8c2c",
      }).populate("hopper_id");
      const commitionforpro = parseFloat(responseforcategory.percentage);
      const paybymedihousetoadmin = c.amount_paid;
      //  end
      // for amateue
      const responseforcategoryforamateur = await Category.findOne({
        type: "commissionstructure",
        _id: "648fd16127368932e35b8c4a",
      }).populate("hopper_id");
      const commitionforamateur = parseFloat(
        responseforcategoryforamateur.percentage
      );
      const paybymedihousetoadminforamateur = c.amount_paid;

      if (c.hopper_id.category == "pro") {
        const paid = commitionforpro * paybymedihousetoadmin;
        const percentage = paid / 100;

        const paidbyadmin = paybymedihousetoadmin - percentage;

        await db.updateItem(data.task_content_id, uploadedContent, {
          // sale_status:"sold",
          paid_status_to_hopper: true,
          amount_paid_to_hopper: paidbyadmin,
          presshop_committion: percentage,
          // purchased_publication: data.media_house_id,
        });

        if (!c.hopper_id.stripe_account_id) {
          throw utils.buildErrObject(422, "account is not verified");
        } else {
          const transfer = await stripe.transfers.create({
            amount: parseInt(paidbyadmin),
            currency: "gbp", //"usd"
            destination: c.hopper_id.stripe_account_id,
          });

          const getProfessionalBookings = await hopperPayment.updateOne(
            { task_content_id: data.task_content_id },
            { $set: { paid_status_for_hopper: true } }
          );


          const notiObj = {
            sender_id: req.user._id,
            receiver_id: c.hopper_id,
            // data.receiver_id,
            title: "payment  Done",
            body: "payment  Done by Admin",
          };
          console.log(notiObj);
          const resp = await _sendNotification(notiObj);
        }

        res.json({
          code: 200,
          resp: "Paid",
        });
      } else if (c.hopper_id.category == "amateur") {
        const paid = commitionforamateur * paybymedihousetoadminforamateur;
        const percentage = paid / 100;

        const paidbyadmin = paybymedihousetoadminforamateur - percentage;

        await db.updateItem(data.task_content_id, uploadedContent, {
          // sale_status:"sold",
          paid_status_to_hopper: true,
          amount_paid_to_hopper: paidbyadmin,
          presshop_committion: percentage,
          // purchased_publication: data.media_house_id,
        });

        if (!c.hopper_id.stripe_account_id) {
          throw utils.buildErrObject(422, "account is not verified");
        } else {
          const transfer = await stripe.transfers.create({
            amount: parseInt(paidbyadmin),
            currency: "gbp", //"usd"
            destination: c.hopper_id.stripe_account_id,
          });

          const getProfessionalBookings = await hopperPayment.updateOne(
            { task_content_id: data.task_content_id },
            { $set: { paid_status_for_hopper: true } }
          );

          const notiObj = {
            sender_id: req.user._id,
            receiver_id: c.hopper_id,
            // data.receiver_id,
            title: "payment  Done",
            body: "payment  Done by Admin",
          };
          console.log(notiObj);
          const resp = await _sendNotification(notiObj);
        }

        res.json({
          code: 200,
          resp: "Paid",
        });
      } else {
        console.log("error");
      }
    } else if (data.hopper_id && data.type == "task_content") {
      const responcefor = await User.findOne({ _id: data.hopper_id });
      const category = responcefor.category;

      const values =
        typeof data.task_content_id == "string"
          ? JSON.parse(data.task_content_id)
          : data.task_content_id;
      const assignHopper = await values.map(
        (hoper) => (hoper = mongoose.Types.ObjectId(hoper))
      );

      const resp = await values.forEach((task_content_id) => {
        gettaskContentAmount(task_content_id);
      });
      // const callfunctuion = gettaskContentAmount(assignHopper);
      const notiObj = {
        sender_id: req.user._id,
        receiver_id: data.hopper_id,
        // data.receiver_id,
        title: "payment  Done",
        body: "payment  Done by Admin",
      };
      console.log(notiObj);
      const responce = await _sendNotification(notiObj);
      res.json({
        code: 200,
        resp: "Paid",
      });
    } else {
      console.log("error");
    }
  } catch (err) {
    utils.handleError(res, err);
  }
};


// exports.paymenttohopperByadmin = async (req, res) => {
//   try {
//     const data = req.body

//     // const resp = await hopperPayment.aggregate([
//     //   {
//     //     $group: {
//     //       _id: "$hopper_id",
//     //       // amount:{$sum: "$amount_paid_to_hopper"}
//     //       Data: { $push: "$$ROOT" },
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "users",
//     //       localField: "_id",
//     //       foreignField: "_id",
//     //       as: "hopper_ids",
//     //     },
//     //   },

//     //   {
//     //     $lookup: {
//     //       from: "contents",
//     //       localField: "Data.content_id",
//     //       foreignField: "_id",
//     //       as: "content_id",
//     //     },
//     //   },

//     //   {
//     //     $lookup: {
//     //       from: "contents",
//     //       localField: "Data.task",
//     //       foreignField: "_id",
//     //       as: "content_id",
//     //     },
//     //   },

//     //   {
//     //     $lookup: {
//     //       from: "users",
//     //       let: { assign_more_hopper_history: "$_id" },
//     //       // let: { assign_more_hopper_history: "$accepted_by" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [{ $eq: ["$_id", "$$assign_more_hopper_history"] }],
//     //             },
//     //           },
//     //         },
//     //         {
//     //           $lookup: {
//     //             from: "avatars",
//     //             localField: "avatar_id",
//     //             foreignField: "_id",
//     //             as: "avatar_details",
//     //           },
//     //         },
//     //         // { $unwind: "$avatar_details" ,
//     //         // preserveNullAndEmptyArrays: true},

//     //         {
//     //           $lookup: {
//     //             from: "categories",
//     //             localField: "category_id",
//     //             foreignField: "_id",
//     //             as: "category_details",
//     //           },
//     //         },

//     //         // { $unwind: "$category_details" ,
//     //         // preserveNullAndEmptyArrays: true},
//     //       ],
//     //       as: "hopper_details",
//     //     },
//     //   },

//     //   // {
//     //   //   $addFields: {
//     //   //    valueforid:"$content_details._id"
//     //   //   },
//     //   // },
//     //   {
//     //     $lookup: {
//     //       from: "hopperpayments",
//     //       let: { contentIds: "$hopper_id", list: "$_id" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $eq: ["$hopper_id", "$$list"] },
//     //                 { $eq: ["$paid_status_for_hopper", false] },
//     //                 // { $eq: ["$content_id", "$$id"] },
//     //                 // { $eq: ["$type", "content"] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //       ],
//     //       as: "transictions",
//     //     },
//     //   },

//     //   {
//     //     $addFields: {
//     //       // uploadedcontent: "$task_id",
//     //       // acceptedby: "$acepted_task_id",
//     //       payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//     //       recived_from_mediahouse: { $sum: "$transictions.amount" },
//     //       presshop_commission: { $sum: "$transictions.presshop_commission" },

//     //       // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//     //     },
//     //   },

//     //   // {
//     //   //   $addFields: {
//     //   //     // uploadedcontent: "$task_id",
//     //   //     // acceptedby: "$acepted_task_id",
//     //   //     payable_to_hopper: { $sum: "$Data.payable_to_hopper" },

//     //   //     recived_from_mediahouse: { $sum: "$Data.amount" },
//     //   //     presshop_commission: { $sum: "$Data.presshop_commission" },

//     //   //     // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//     //   //   },
//     //   // },

//     //   // {
//     //   //   $lookup: {
//     //   //     from: "uploaded",
//     //   //     localField: "uploaded_content.task_id",
//     //   //     foreignField: "_id",
//     //   //     as: "task_id",
//     //   //   },
//     //   // },
//     //   // { $unwind: "$task_id" },

//     //   // {
//     //   //   $match:{
//     //   //     media_house_id: data.media_house_id,
//     //   //     hopper_id: data.hopper_id,
//     //   //     content_id: data.content_id,
//     //   //   }
//     //   // }
//     // ]);

//     // const draftDetails = await hopperPayment.aggregate([
//     //   {
//     //     $group: {
//     //       _id: "$hopper_id",
//     //       // paid_status_to_hopper:false,
//     //       data: { $push: "$$ROOT" },
//     //     },
//     //   },

//     //   {
//     //     $lookup: {
//     //       from: "contents",
//     //       localField: "data.content_id",
//     //       foreignField: "_id",
//     //       as: "content_id",
//     //     },
//     //   },

//     //   {
//     //     $addFields: {
//     //       value: "$content_id._id",
//     //     },
//     //   },

//     //   {
//     //     $lookup: {
//     //       from: "contents",
//     //       let: { contentIds: "$value" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $in: ["$_id", "$$contentIds"] },
//     //                 { $eq: ["$paid_status_to_hopper", false] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //       ],
//     //       as: "content_details",
//     //     },
//     //   },

//     //   {
//     //     $unwind: {
//     //       path: "$content_details",
//     //       preserveNullAndEmptyArrays: true,
//     //     },
//     //   },

//     //   {
//     //     $match: {
//     //       _id: mongoose.Types.ObjectId(data.hopper_id),
//     //       // paid_status_to_hopper: false
//     //       // room_type: data.room_type,
//     //     },
//     //   },

//     //   {
//     //     $addFields: {
//     //       valueforid: "$content_details._id",
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "hopperpayments",
//     //       let: { contentIds: "$hopper_id", id: "$valueforid" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 {
//     //                   $eq: [
//     //                     "$hopper_id",
//     //                     mongoose.Types.ObjectId(data.hopper_id),
//     //                   ],
//     //                 },
//     //                 { $eq: ["$paid_status_for_hopper", false] },
//     //                 { $eq: ["$content_id", "$$id"] },
//     //                 { $eq: ["$type", "content"] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //       ],
//     //       as: "transictions",
//     //     },
//     //   },

//     //   {
//     //     $addFields: {
//     //       // uploadedcontent: "$task_id",
//     //       // acceptedby: "$acepted_task_id",
//     //       payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//     //       recived_from_mediahouse: { $sum: "$transictions.amount" },
//     //       presshop_commission: { $sum: "$transictions.presshop_commission" },

//     //       // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//     //     },
//     //   },
//     // ]);

//     // const draftDetailss = await hopperPayment.aggregate([
//     //   {
//     //     $group: {
//     //       _id: "$hopper_id",
//     //       // paid_status_to_hopper:false,
//     //       data: { $push: "$$ROOT" },
//     //     },
//     //   },

//     //   {
//     //     $lookup: {
//     //       from: "uploadcontents",
//     //       localField: "data.task_content_id",
//     //       foreignField: "_id",
//     //       as: "task_id",
//     //     },
//     //   },

//     //   {
//     //     $addFields: {
//     //       value: "$task_id._id",
//     //     },
//     //   },

//     //   {
//     //     $lookup: {
//     //       from: "uploadcontents",
//     //       let: { contentIds: "$value" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 { $in: ["$_id", "$$contentIds"] },
//     //                 { $eq: ["$paid_status_to_hopper", false] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //       ],
//     //       as: "task_content_details",
//     //     },
//     //   },

//     //   {
//     //     $unwind: {
//     //       path: "$task_content_details",
//     //       preserveNullAndEmptyArrays: true,
//     //     },
//     //   },

//     //   {
//     //     $match: {
//     //       _id: mongoose.Types.ObjectId(data.hopper_id),
//     //       // paid_status_to_hopper: false
//     //       // room_type: data.room_type,
//     //     },
//     //   },

//     //   {
//     //     $addFields: {
//     //       valueforid: "$task_content_details._id",
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: "hopperpayments",
//     //       let: { contentIds: "$hopper_id", id: "$valueforid" },
//     //       pipeline: [
//     //         {
//     //           $match: {
//     //             $expr: {
//     //               $and: [
//     //                 {
//     //                   $eq: [
//     //                     "$hopper_id",
//     //                     mongoose.Types.ObjectId(data.hopper_id),
//     //                   ],
//     //                 },
//     //                 { $eq: ["$paid_status_for_hopper", false] },
//     //                 { $eq: ["$type", "task_content"] },
//     //                 { $eq: ["$task_content_id", "$$id"] },
//     //               ],
//     //             },
//     //           },
//     //         },
//     //       ],
//     //       as: "transictions",
//     //     },
//     //   },

//     //   {
//     //     $addFields: {
//     //       // uploadedcontent: "$task_id",
//     //       // acceptedby: "$acepted_task_id",
//     //       payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//     //       recived_from_mediahouse: { $sum: "$transictions.amount" },
//     //       presshop_commission: { $sum: "$transictions.presshop_commission" },

//     //       // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//     //     },
//     //   },
//     // ]);


//     const datas = typeof data.hopper_id == "string"
//       ? JSON.parse(data.hopper_id)
//       : data.hopper_id;

//     console.log("data.hopper_id", data.hopper_id);
//     for (let i = 0; i < datas.length; i++) {


//       let draftDetails = await hopperPayment.aggregate([
//         {
//           $group: {
//             _id: "$hopper_id",
//             // paid_status_to_hopper:false,
//             data: { $push: "$$ROOT" },
//           },
//         },

//         {
//           $lookup: {
//             from: "contents",
//             localField: "data.content_id",
//             foreignField: "_id",
//             as: "content_id",
//           },
//         },

//         {
//           $addFields: {
//             value: "$content_id._id",
//           },
//         },

//         {
//           $lookup: {
//             from: "contents",
//             let: { contentIds: "$value" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $in: ["$_id", "$$contentIds"] },
//                       { $eq: ["$paid_status_to_hopper", false] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "content_details",
//           },
//         },

//         {
//           $unwind: {
//             path: "$content_details",
//             preserveNullAndEmptyArrays: true,
//           },
//         },

//         {
//           $match: {
//             _id: mongoose.Types.ObjectId(datas[i]),
//             // paid_status_to_hopper: false
//             // room_type: data.room_type,
//           },
//         },

//         {
//           $addFields: {
//             valueforid: "$content_details._id",
//           },
//         },
//         {
//           $lookup: {
//             from: "hopperpayments",
//             let: { contentIds: "$hopper_id", id: "$valueforid" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       {
//                         $eq: [
//                           "$hopper_id",
//                           mongoose.Types.ObjectId(datas[i]),
//                         ],
//                       },
//                       { $eq: ["$paid_status_for_hopper", false] },
//                       { $eq: ["$content_id", "$$id"] },
//                       { $eq: ["$type", "content"] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "transictions",
//           },
//         },

//         {
//           $addFields: {
//             // uploadedcontent: "$task_id",
//             // acceptedby: "$acepted_task_id",
//             payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//             recived_from_mediahouse: { $sum: "$transictions.amount" },
//             presshop_commission: { $sum: "$transictions.presshop_commission" },

//             // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//           },
//         },
//       ]);
//       console.log("s===========", draftDetails)
//       const findcontent = draftDetails.map((x) => x.valueforid)
//       if(findcontent.length > 0 ) {

//         console.log("findcontentfindcontent", findcontent);

//         const values = findcontent


//       getContentAmount(mongoose.Types.ObjectId(values[i]))


//       console.log("values[i]", values[i])
//     }




//     else  {



//         const draftDetailss = await hopperPayment.aggregate([
//           {
//             $group: {
//               _id: "$hopper_id",
//               // paid_status_to_hopper:false,
//               data: { $push: "$$ROOT" },
//             },
//           },

//           {
//             $lookup: {
//               from: "uploadcontents",
//               localField: "data.task_content_id",
//               foreignField: "_id",
//               as: "task_id",
//             },
//           },

//           {
//           $addFields: {
//             value: "$task_id._id",
//           },
//         },

//         {
//           $lookup: {
//             from: "uploadcontents",
//             let: { contentIds: "$value" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $in: ["$_id", "$$contentIds"] },
//                       { $eq: ["$paid_status_to_hopper", false] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "task_content_details",
//           },
//         },

//         {
//           $unwind: {
//             path: "$task_content_details",
//             preserveNullAndEmptyArrays: true,
//           },
//         },

//         {
//           $match: {
//             _id: mongoose.Types.ObjectId(datas[i]),
//             // paid_status_to_hopper: false
//             // room_type: data.room_type,
//           },
//         },

//         {
//           $addFields: {
//             valueforid: "$task_content_details._id",
//           },
//         },
//         {
//           $lookup: {
//             from: "hopperpayments",
//             let: { contentIds: "$hopper_id", id: "$valueforid" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       {
//                         $eq: [
//                           "$hopper_id",
//                           mongoose.Types.ObjectId(datas[i]),
//                         ],
//                       },
//                       { $eq: ["$paid_status_for_hopper", false] },
//                       { $eq: ["$type", "task_content"] },
//                       { $eq: ["$task_content_id", "$$id"] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "transictions",
//           },
//         },

//         {
//           $addFields: {
//             // uploadedcontent: "$task_id",
//             // acceptedby: "$acepted_task_id",
//             payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//             recived_from_mediahouse: { $sum: "$transictions.amount" },
//             presshop_commission: { $sum: "$transictions.presshop_commission" },

//             // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//           },
//         },
//       ]);

//       const findtask = draftDetailss.map((y) => y.valueforid)
//       if(findtask.length > 0 ){


//         const valuesfortask = findtask

//         gettaskContentAmount(valuesfortask[i])
//         // continue
//       } else {
//         let draftDetails = await hopperPayment.aggregate([
//           {
//             $group: {
//               _id: "$hopper_id",
//               // paid_status_to_hopper:false,
//               data: { $push: "$$ROOT" },
//             },
//           },

//           {
//             $lookup: {
//               from: "contents",
//               localField: "data.content_id",
//               foreignField: "_id",
//               as: "content_id",
//             },
//           },

//           {
//             $addFields: {
//               value: "$content_id._id",
//             },
//           },

//           {
//             $lookup: {
//               from: "contents",
//               let: { contentIds: "$value" },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $and: [
//                         { $in: ["$_id", "$$contentIds"] },
//                         { $eq: ["$paid_status_to_hopper", false] },
//                       ],
//                     },
//                   },
//                 },
//               ],
//               as: "content_details",
//             },
//           },

//           {
//             $unwind: {
//               path: "$content_details",
//               preserveNullAndEmptyArrays: true,
//             },
//           },

//           {
//             $match: {
//               _id: mongoose.Types.ObjectId(datas[i]),
//               // paid_status_to_hopper: false
//               // room_type: data.room_type,
//             },
//           },

//           {
//             $addFields: {
//               valueforid: "$content_details._id",
//             },
//           },
//           {
//             $lookup: {
//               from: "hopperpayments",
//               let: { contentIds: "$hopper_id", id: "$valueforid" },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $and: [
//                         {
//                           $eq: [
//                             "$hopper_id",
//                             mongoose.Types.ObjectId(datas[i]),
//                           ],
//                         },
//                         { $eq: ["$paid_status_for_hopper", false] },
//                         { $eq: ["$content_id", "$$id"] },
//                         { $eq: ["$type", "content"] },
//                       ],
//                     },
//                   },
//                 },
//               ],
//               as: "transictions",
//             },
//           },

//           {
//             $addFields: {
//               // uploadedcontent: "$task_id",
//               // acceptedby: "$acepted_task_id",
//               payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//               recived_from_mediahouse: { $sum: "$transictions.amount" },
//               presshop_commission: { $sum: "$transictions.presshop_commission" },

//               // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//             },
//           },
//         ]);
//         console.log("s===========", draftDetails)
//         const findcontent = draftDetails.map((x) => x.valueforid)
//         if(findcontent.length > 0 ) {

//           console.log("findcontentfindcontent", findcontent);

//           const values = findcontent


//         getContentAmount(mongoose.Types.ObjectId(values[i]))


//         console.log("values[i]", values[i])
//       }


//       }

//     }
//   }

//     res.send({
//       code: 200,
//       msg: "payment paid"
//     })

//     // const values = typeof data.content_id == "string"
//     //   ? JSON.parse(data.content_id)
//     //   : data.content_id;


//     // const valuesfortask =
//     //   typeof data.task_content_id == "string"
//     //     ? JSON.parse(data.task_content_id)
//     //     : data.task_content_id;


//     //  const respn =  await datas.forEach((id, mid) => {
//     //   sendnoti(id , mid);
//     // });

//     //  for(let i=0; i<datas.length; i++){
//     //    getContentAmount(values[i])
//     //    gettaskContentAmount(valuesfortask[i])
//     //  }



//   } catch (err) {
//     utils.handleError(res, err);
//   }
// };





exports.paymenttohopperByadmin = async (req, res) => {
  try {
    const data = req.body

    // const resp = await hopperPayment.aggregate([
    //   {
    //     $group: {
    //       _id: "$hopper_id",
    //       // amount:{$sum: "$amount_paid_to_hopper"}
    //       Data: { $push: "$$ROOT" },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "hopper_ids",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "contents",
    //       localField: "Data.content_id",
    //       foreignField: "_id",
    //       as: "content_id",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "contents",
    //       localField: "Data.task",
    //       foreignField: "_id",
    //       as: "content_id",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "users",
    //       let: { assign_more_hopper_history: "$_id" },
    //       // let: { assign_more_hopper_history: "$accepted_by" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [{ $eq: ["$_id", "$$assign_more_hopper_history"] }],
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
    //         // { $unwind: "$avatar_details" ,
    //         // preserveNullAndEmptyArrays: true},

    //         {
    //           $lookup: {
    //             from: "categories",
    //             localField: "category_id",
    //             foreignField: "_id",
    //             as: "category_details",
    //           },
    //         },

    //         // { $unwind: "$category_details" ,
    //         // preserveNullAndEmptyArrays: true},
    //       ],
    //       as: "hopper_details",
    //     },
    //   },

    //   // {
    //   //   $addFields: {
    //   //    valueforid:"$content_details._id"
    //   //   },
    //   // },
    //   {
    //     $lookup: {
    //       from: "hopperpayments",
    //       let: { contentIds: "$hopper_id", list: "$_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$hopper_id", "$$list"] },
    //                 { $eq: ["$paid_status_for_hopper", false] },
    //                 // { $eq: ["$content_id", "$$id"] },
    //                 // { $eq: ["$type", "content"] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "transictions",
    //     },
    //   },

    //   {
    //     $addFields: {
    //       // uploadedcontent: "$task_id",
    //       // acceptedby: "$acepted_task_id",
    //       payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

    //       recived_from_mediahouse: { $sum: "$transictions.amount" },
    //       presshop_commission: { $sum: "$transictions.presshop_commission" },

    //       // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
    //     },
    //   },

    //   // {
    //   //   $addFields: {
    //   //     // uploadedcontent: "$task_id",
    //   //     // acceptedby: "$acepted_task_id",
    //   //     payable_to_hopper: { $sum: "$Data.payable_to_hopper" },

    //   //     recived_from_mediahouse: { $sum: "$Data.amount" },
    //   //     presshop_commission: { $sum: "$Data.presshop_commission" },

    //   //     // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
    //   //   },
    //   // },

    //   // {
    //   //   $lookup: {
    //   //     from: "uploaded",
    //   //     localField: "uploaded_content.task_id",
    //   //     foreignField: "_id",
    //   //     as: "task_id",
    //   //   },
    //   // },
    //   // { $unwind: "$task_id" },

    //   // {
    //   //   $match:{
    //   //     media_house_id: data.media_house_id,
    //   //     hopper_id: data.hopper_id,
    //   //     content_id: data.content_id,
    //   //   }
    //   // }
    // ]);

    // const draftDetails = await hopperPayment.aggregate([
    //   {
    //     $group: {
    //       _id: "$hopper_id",
    //       // paid_status_to_hopper:false,
    //       data: { $push: "$$ROOT" },
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
    //     $addFields: {
    //       value: "$content_id._id",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "contents",
    //       let: { contentIds: "$value" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $in: ["$_id", "$$contentIds"] },
    //                 { $eq: ["$paid_status_to_hopper", false] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "content_details",
    //     },
    //   },

    //   {
    //     $unwind: {
    //       path: "$content_details",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },

    //   {
    //     $match: {
    //       _id: mongoose.Types.ObjectId(data.hopper_id),
    //       // paid_status_to_hopper: false
    //       // room_type: data.room_type,
    //     },
    //   },

    //   {
    //     $addFields: {
    //       valueforid: "$content_details._id",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "hopperpayments",
    //       let: { contentIds: "$hopper_id", id: "$valueforid" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 {
    //                   $eq: [
    //                     "$hopper_id",
    //                     mongoose.Types.ObjectId(data.hopper_id),
    //                   ],
    //                 },
    //                 { $eq: ["$paid_status_for_hopper", false] },
    //                 { $eq: ["$content_id", "$$id"] },
    //                 { $eq: ["$type", "content"] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "transictions",
    //     },
    //   },

    //   {
    //     $addFields: {
    //       // uploadedcontent: "$task_id",
    //       // acceptedby: "$acepted_task_id",
    //       payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

    //       recived_from_mediahouse: { $sum: "$transictions.amount" },
    //       presshop_commission: { $sum: "$transictions.presshop_commission" },

    //       // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
    //     },
    //   },
    // ]);

    // const draftDetailss = await hopperPayment.aggregate([
    //   {
    //     $group: {
    //       _id: "$hopper_id",
    //       // paid_status_to_hopper:false,
    //       data: { $push: "$$ROOT" },
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "uploadcontents",
    //       localField: "data.task_content_id",
    //       foreignField: "_id",
    //       as: "task_id",
    //     },
    //   },

    //   {
    //     $addFields: {
    //       value: "$task_id._id",
    //     },
    //   },

    //   {
    //     $lookup: {
    //       from: "uploadcontents",
    //       let: { contentIds: "$value" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $in: ["$_id", "$$contentIds"] },
    //                 { $eq: ["$paid_status_to_hopper", false] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "task_content_details",
    //     },
    //   },

    //   {
    //     $unwind: {
    //       path: "$task_content_details",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },

    //   {
    //     $match: {
    //       _id: mongoose.Types.ObjectId(data.hopper_id),
    //       // paid_status_to_hopper: false
    //       // room_type: data.room_type,
    //     },
    //   },

    //   {
    //     $addFields: {
    //       valueforid: "$task_content_details._id",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "hopperpayments",
    //       let: { contentIds: "$hopper_id", id: "$valueforid" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 {
    //                   $eq: [
    //                     "$hopper_id",
    //                     mongoose.Types.ObjectId(data.hopper_id),
    //                   ],
    //                 },
    //                 { $eq: ["$paid_status_for_hopper", false] },
    //                 { $eq: ["$type", "task_content"] },
    //                 { $eq: ["$task_content_id", "$$id"] },
    //               ],
    //             },
    //           },
    //         },
    //       ],
    //       as: "transictions",
    //     },
    //   },

    //   {
    //     $addFields: {
    //       // uploadedcontent: "$task_id",
    //       // acceptedby: "$acepted_task_id",
    //       payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

    //       recived_from_mediahouse: { $sum: "$transictions.amount" },
    //       presshop_commission: { $sum: "$transictions.presshop_commission" },

    //       // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
    //     },
    //   },
    // ]);


    const datas = typeof data.hopper_id == "string"
      ? JSON.parse(data.hopper_id)
      : data.hopper_id;

    console.log("data.hopper_id", data.hopper_id);
    for (let i = 0; i < datas.length; i++) {


      let draftDetails = await hopperPayment.aggregate([
        {
          $group: {
            _id: "$hopper_id",
            // paid_status_to_hopper:false,
            data: { $push: "$$ROOT" },
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
            value: "$content_id._id",
          },
        },

        {
          $lookup: {
            from: "contents",
            let: { contentIds: "$value" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$contentIds"] },
                      { $eq: ["$paid_status_to_hopper", false] },
                    ],
                  },
                },
              },
            ],
            as: "content_details",
          },
        },

        {
          $unwind: {
            path: "$content_details",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $match: {
            _id: mongoose.Types.ObjectId(datas[i]),
            // paid_status_to_hopper: false
            // room_type: data.room_type,
          },
        },

        {
          $addFields: {
            valueforid: "$content_details._id",
          },
        },
        {
          $lookup: {
            from: "hopperpayments",
            let: { contentIds: "$hopper_id", id: "$valueforid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$hopper_id",
                          mongoose.Types.ObjectId(datas[i]),
                        ],
                      },
                      { $eq: ["$paid_status_for_hopper", false] },
                      { $eq: ["$content_id", "$$id"] },
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
          $addFields: {
            // uploadedcontent: "$task_id",
            // acceptedby: "$acepted_task_id",
            payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

            recived_from_mediahouse: { $sum: "$transictions.amount" },
            presshop_commission: { $sum: "$transictions.presshop_commission" },

            // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
          },
        },
      ]);


      const draftDetailss = await hopperPayment.aggregate([
        {
          $group: {
            _id: "$hopper_id",
            // paid_status_to_hopper:false,
            data: { $push: "$$ROOT" },
          },
        },

        {
          $lookup: {
            from: "uploadcontents",
            localField: "data.task_content_id",
            foreignField: "_id",
            as: "task_id",
          },
        },

        {
          $addFields: {
            value: "$task_id._id",
          },
        },

        {
          $lookup: {
            from: "uploadcontents",
            let: { contentIds: "$value" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$contentIds"] },
                      { $eq: ["$paid_status_to_hopper", false] },
                    ],
                  },
                },
              },
            ],
            as: "task_content_details",
          },
        },

        {
          $unwind: {
            path: "$task_content_details",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $match: {
            _id: mongoose.Types.ObjectId(datas[i]),
            // paid_status_to_hopper: false
            // room_type: data.room_type,
          },
        },

        {
          $addFields: {
            valueforid: "$task_content_details._id",
          },
        },
        {
          $lookup: {
            from: "hopperpayments",
            let: { contentIds: "$hopper_id", id: "$valueforid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$hopper_id",
                          mongoose.Types.ObjectId(datas[i]),
                        ],
                      },
                      { $eq: ["$paid_status_for_hopper", false] },
                      { $eq: ["$type", "task_content"] },
                      { $eq: ["$task_content_id", "$$id"] },
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
            // uploadedcontent: "$task_id",
            // acceptedby: "$acepted_task_id",
            payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

            recived_from_mediahouse: { $sum: "$transictions.amount" },
            presshop_commission: { $sum: "$transictions.presshop_commission" },

            // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
          },
        },
      ]);
      console.log("s===========", draftDetails)
      console.log("d===========", draftDetailss)
      const findcontent = draftDetails.map((x) => x.valueforid)
      const findtask = draftDetailss.map((y) => y.valueforid)
      console.log("task===================", findtask, findcontent, findtask[0] == undefined, findcontent[0] == undefined) // [undefined]
      if (findcontent.length > 0 && findtask[0] == undefined && findcontent[0] != undefined) {

        console.log("findcontentfindcontent", findcontent);

        const values = findcontent
        console.log("content--------------");

        getContentAmount(mongoose.Types.ObjectId(values[i]))


        console.log("values[i]", values[i])
      } else if (findcontent.length > 0 && findtask.length > 0 && findtask[0] != undefined && findcontent[0] != undefined) {
        const values = findcontent

        console.log("taskandcontent--------------");
        getContentAmount(mongoose.Types.ObjectId(values[i]))

        const valuesfortask = findtask

        gettaskContentAmount(valuesfortask[i])
      } else if (findtask.length > 0 && findtask[0] != undefined && findcontent[0] == undefined) {
        console.log("task--------------");
        const valuesfortask = findtask

        gettaskContentAmount(valuesfortask[i])
      } else {
        console.log("error======")
      }






      // else  {



      //     const draftDetailss = await hopperPayment.aggregate([
      //       {
      //         $group: {
      //           _id: "$hopper_id",
      //           // paid_status_to_hopper:false,
      //           data: { $push: "$$ROOT" },
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "uploadcontents",
      //           localField: "data.task_content_id",
      //           foreignField: "_id",
      //           as: "task_id",
      //         },
      //       },

      //       {
      //       $addFields: {
      //         value: "$task_id._id",
      //       },
      //     },

      //     {
      //       $lookup: {
      //         from: "uploadcontents",
      //         let: { contentIds: "$value" },
      //         pipeline: [
      //           {
      //             $match: {
      //               $expr: {
      //                 $and: [
      //                   { $in: ["$_id", "$$contentIds"] },
      //                   { $eq: ["$paid_status_to_hopper", false] },
      //                 ],
      //               },
      //             },
      //           },
      //         ],
      //         as: "task_content_details",
      //       },
      //     },

      //     {
      //       $unwind: {
      //         path: "$task_content_details",
      //         preserveNullAndEmptyArrays: true,
      //       },
      //     },

      //     {
      //       $match: {
      //         _id: mongoose.Types.ObjectId(datas[i]),
      //         // paid_status_to_hopper: false
      //         // room_type: data.room_type,
      //       },
      //     },

      //     {
      //       $addFields: {
      //         valueforid: "$task_content_details._id",
      //       },
      //     },
      //     {
      //       $lookup: {
      //         from: "hopperpayments",
      //         let: { contentIds: "$hopper_id", id: "$valueforid" },
      //         pipeline: [
      //           {
      //             $match: {
      //               $expr: {
      //                 $and: [
      //                   {
      //                     $eq: [
      //                       "$hopper_id",
      //                       mongoose.Types.ObjectId(datas[i]),
      //                     ],
      //                   },
      //                   { $eq: ["$paid_status_for_hopper", false] },
      //                   { $eq: ["$type", "task_content"] },
      //                   { $eq: ["$task_content_id", "$$id"] },
      //                 ],
      //               },
      //             },
      //           },
      //         ],
      //         as: "transictions",
      //       },
      //     },

      //     {
      //       $addFields: {
      //         // uploadedcontent: "$task_id",
      //         // acceptedby: "$acepted_task_id",
      //         payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

      //         recived_from_mediahouse: { $sum: "$transictions.amount" },
      //         presshop_commission: { $sum: "$transictions.presshop_commission" },

      //         // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
      //       },
      //     },
      //   ]);

      //   const findtask = draftDetailss.map((y) => y.valueforid)
      //   if(findtask.length > 0 ){


      //     const valuesfortask = findtask

      //     gettaskContentAmount(valuesfortask[i])
      //     // continue
      //   } else {
      //     let draftDetails = await hopperPayment.aggregate([
      //       {
      //         $group: {
      //           _id: "$hopper_id",
      //           // paid_status_to_hopper:false,
      //           data: { $push: "$$ROOT" },
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "contents",
      //           localField: "data.content_id",
      //           foreignField: "_id",
      //           as: "content_id",
      //         },
      //       },

      //       {
      //         $addFields: {
      //           value: "$content_id._id",
      //         },
      //       },

      //       {
      //         $lookup: {
      //           from: "contents",
      //           let: { contentIds: "$value" },
      //           pipeline: [
      //             {
      //               $match: {
      //                 $expr: {
      //                   $and: [
      //                     { $in: ["$_id", "$$contentIds"] },
      //                     { $eq: ["$paid_status_to_hopper", false] },
      //                   ],
      //                 },
      //               },
      //             },
      //           ],
      //           as: "content_details",
      //         },
      //       },

      //       {
      //         $unwind: {
      //           path: "$content_details",
      //           preserveNullAndEmptyArrays: true,
      //         },
      //       },

      //       {
      //         $match: {
      //           _id: mongoose.Types.ObjectId(datas[i]),
      //           // paid_status_to_hopper: false
      //           // room_type: data.room_type,
      //         },
      //       },

      //       {
      //         $addFields: {
      //           valueforid: "$content_details._id",
      //         },
      //       },
      //       {
      //         $lookup: {
      //           from: "hopperpayments",
      //           let: { contentIds: "$hopper_id", id: "$valueforid" },
      //           pipeline: [
      //             {
      //               $match: {
      //                 $expr: {
      //                   $and: [
      //                     {
      //                       $eq: [
      //                         "$hopper_id",
      //                         mongoose.Types.ObjectId(datas[i]),
      //                       ],
      //                     },
      //                     { $eq: ["$paid_status_for_hopper", false] },
      //                     { $eq: ["$content_id", "$$id"] },
      //                     { $eq: ["$type", "content"] },
      //                   ],
      //                 },
      //               },
      //             },
      //           ],
      //           as: "transictions",
      //         },
      //       },

      //       {
      //         $addFields: {
      //           // uploadedcontent: "$task_id",
      //           // acceptedby: "$acepted_task_id",
      //           payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

      //           recived_from_mediahouse: { $sum: "$transictions.amount" },
      //           presshop_commission: { $sum: "$transictions.presshop_commission" },

      //           // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
      //         },
      //       },
      //     ]);
      //     console.log("s===========", draftDetails)
      //     const findcontent = draftDetails.map((x) => x.valueforid)
      //     if(findcontent.length > 0 ) {

      //       console.log("findcontentfindcontent", findcontent);

      //       const values = findcontent


      //     getContentAmount(mongoose.Types.ObjectId(values[i]))


      //     console.log("values[i]", values[i])
      //   }


      //   }

      // }
    }

    res.send({
      code: 200,
      msg: "payment paid"
    })

    // const values = typeof data.content_id == "string"
    //   ? JSON.parse(data.content_id)
    //   : data.content_id;


    // const valuesfortask =
    //   typeof data.task_content_id == "string"
    //     ? JSON.parse(data.task_content_id)
    //     : data.task_content_id;


    //  const respn =  await datas.forEach((id, mid) => {
    //   sendnoti(id , mid);
    // });

    //  for(let i=0; i<datas.length; i++){
    //    getContentAmount(values[i])
    //    gettaskContentAmount(valuesfortask[i])
    //  }



  } catch (err) {
    utils.handleError(res, err);
  }
};

// exports.paymenttohopperByadmin = async (req, res) => {
//   try {
//     const data = req.body


//     const promises = [];
//     const datas = typeof data.hopper_id == "string"
//       ? JSON.parse(data.hopper_id)
//       : data.hopper_id;

//     console.log("data.hopper_id", data.hopper_id);
//     for (let i = 0; i < datas.length; i++) {

//       promises.push(
//         (async () => {
//       let draftDetails = await hopperPayment.aggregate([
//         {
//           $group: {
//             _id: "$hopper_id",
//             // paid_status_to_hopper:false,
//             data: { $push: "$$ROOT" },
//           },
//         },

//         {
//           $lookup: {
//             from: "contents",
//             localField: "data.content_id",
//             foreignField: "_id",
//             as: "content_id",
//           },
//         },

//         {
//           $addFields: {
//             value: "$content_id._id",
//           },
//         },

//         {
//           $lookup: {
//             from: "contents",
//             let: { contentIds: "$value" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $in: ["$_id", "$$contentIds"] },
//                       { $eq: ["$paid_status_to_hopper", false] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "content_details",
//           },
//         },

//         {
//           $unwind: {
//             path: "$content_details",
//             preserveNullAndEmptyArrays: true,
//           },
//         },

//         {
//           $match: {
//             _id: mongoose.Types.ObjectId(datas[i]),
//             // paid_status_to_hopper: false
//             // room_type: data.room_type,
//           },
//         },

//         {
//           $addFields: {
//             valueforid: "$content_details._id",
//           },
//         },
//         {
//           $lookup: {
//             from: "hopperpayments",
//             let: { contentIds: "$hopper_id", id: "$valueforid" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       {
//                         $eq: [
//                           "$hopper_id",
//                           mongoose.Types.ObjectId(datas[i]),
//                         ],
//                       },
//                       { $eq: ["$paid_status_for_hopper", false] },
//                       { $eq: ["$content_id", "$$id"] },
//                       { $eq: ["$type", "content"] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "transictions",
//           },
//         },

//         {
//           $addFields: {
//             // uploadedcontent: "$task_id",
//             // acceptedby: "$acepted_task_id",
//             payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//             recived_from_mediahouse: { $sum: "$transictions.amount" },
//             presshop_commission: { $sum: "$transictions.presshop_commission" },

//             // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//           },
//         },
//       ]);
//       console.log("s===========", draftDetails)
//       const findcontent = draftDetails.map((x) => x.valueforid)

//       if (findcontent && findcontent.length > 0) {
//         console.log("Executing content-related code");
//         const values = findcontent;
//         getContentAmount(mongoose.Types.ObjectId(values[i]));
//         console.log("values[i] for content", values[i]);
//       }
//       //   console.log("findcontentfindcontent", findcontent);

//       //   const values = findcontent



//       // getContentAmount(mongoose.Types.ObjectId(values[i]))


//       // console.log("values[i]", values[i])



//         const draftDetailss = await hopperPayment.aggregate([
//           {
//             $group: {
//               _id: "$hopper_id",
//               // paid_status_to_hopper:false,
//               data: { $push: "$$ROOT" },
//             },
//           },

//           {
//             $lookup: {
//               from: "uploadcontents",
//               localField: "data.task_content_id",
//               foreignField: "_id",
//               as: "task_id",
//             },
//           },

//           {
//           $addFields: {
//             value: "$task_id._id",
//           },
//         },

//         {
//           $lookup: {
//             from: "uploadcontents",
//             let: { contentIds: "$value" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $in: ["$_id", "$$contentIds"] },
//                       { $eq: ["$paid_status_to_hopper", false] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "task_content_details",
//           },
//         },

//         {
//           $unwind: {
//             path: "$task_content_details",
//             preserveNullAndEmptyArrays: true,
//           },
//         },

//         {
//           $match: {
//             _id: mongoose.Types.ObjectId(datas[i]),
//             // paid_status_to_hopper: false
//             // room_type: data.room_type,
//           },
//         },

//         {
//           $addFields: {
//             valueforid: "$task_content_details._id",
//           },
//         },
//         {
//           $lookup: {
//             from: "hopperpayments",
//             let: { contentIds: "$hopper_id", id: "$valueforid" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       {
//                         $eq: [
//                           "$hopper_id",
//                           mongoose.Types.ObjectId(datas[i]),
//                         ],
//                       },
//                       { $eq: ["$paid_status_for_hopper", false] },
//                       { $eq: ["$type", "task_content"] },
//                       { $eq: ["$task_content_id", "$$id"] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "transictions",
//           },
//         },

//         {
//           $addFields: {
//             // uploadedcontent: "$task_id",
//             // acceptedby: "$acepted_task_id",
//             payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

//             recived_from_mediahouse: { $sum: "$transictions.amount" },
//             presshop_commission: { $sum: "$transictions.presshop_commission" },

//             // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
//           },
//         },
//       ]);

//       const findtask = draftDetailss.map((y) => y.valueforid)
//       if (findtask && findtask.length > 0) {
//         console.log("Executing task-related code");
//         const valuesfortask = findtask;
//         gettaskContentAmount(valuesfortask[i]);
//         console.log("values[i] for task", valuesfortask[i]);
//       }


//         // const valuesfortask = findtask

//         // gettaskContentAmount(valuesfortask[i])
//         // continue


//       })()
//       )
//   }



//   Promise.all(promises)
//   .then(() => {
//     console.log("At least one promise resolved successfully.");
//    return res.send({
//       code: 200,
//       msg: "payment paid"
//     })
//   })
//   .catch((error) => {
//     console.error("All promises rejected:", error);
//   });




//     // res.send({
//     //   code: 200,
//     //   msg: "payment paid"
//     // })




//   } catch (err) {
//     utils.handleError(res, err);
//   }
// };






exports.paidtohopper = async (req, res) => {
  try {
    const data = req.body;



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

    const dynamicthis = new Date(moment().utc().startOf(val).format());
    const dynamicthisend = new Date(moment().utc().endOf(val).format());



    const recent = {
      updatedAt: {
        $gte: dynamicthis,
        $lte: dynamicthisend,
      },
    }

    const params = [
      {
        $match: recent,
      },
      // {
      {
        $group: {
          _id: "$hopper_id",
          // amount:{$sum: "$amount_paid_to_hopper"}
          Data: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "hopper_ids",
        },
      },

      {
        $lookup: {
          from: "contents",
          localField: "Data.content_id",
          foreignField: "_id",
          as: "content_id",
        },
      },

      // {
      //   $lookup: {
      //     from: "contents",
      //     localField: "Data.task",
      //     foreignField: "_id",
      //     as: "content_id",
      //   },
      // },

      {
        $lookup: {
          from: "users",
          let: { assign_more_hopper_history: "$_id" },
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
                from: "avatars",
                localField: "avatar_id",
                foreignField: "_id",
                as: "avatar_details",
              },
            },
            // { $unwind: "$avatar_details" ,
            // preserveNullAndEmptyArrays: true},

            {
              $lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_details",
              },
            },

            // { $unwind: "$category_details" ,
            // preserveNullAndEmptyArrays: true},
          ],
          as: "hopper_details",
        },
      },

      // {
      //   $addFields: {
      //    valueforid:"$content_details._id"
      //   },
      // },
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
                    { $eq: ["$paid_status_for_hopper", false] },
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
          // uploadedcontent: "$task_id",
          // acceptedby: "$acepted_task_id",
          payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

          recived_from_mediahouse: { $sum: "$transictions.amount" },
          presshop_commission: { $sum: "$transictions.presshop_commission" },

          // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
        },
      },

      // {
      //   $addFields: {
      //     // uploadedcontent: "$task_id",
      //     // acceptedby: "$acepted_task_id",
      //     payable_to_hopper: { $sum: "$Data.payable_to_hopper" },

      //     recived_from_mediahouse: { $sum: "$Data.amount" },
      //     presshop_commission: { $sum: "$Data.presshop_commission" },

      //     // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
      //   },
      // },

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
                    { $eq: ["$paid_status_for_hopper", false] },
                    // { $eq: ["$content_id", "$$id"] },
                    { $eq: ["$type", "content"] },
                  ],
                },
              },
            },


            {
              $lookup: {
                from: "contents",
                localField: "content_id",
                foreignField: "_id",
                as: "content_id",
              },
            },

            { $unwind: "$content_id" }


          ],
          as: "transictions_content",
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
                    { $eq: ["$paid_status_for_hopper", false] },
                    // { $eq: ["$content_id", "$$id"] },
                    { $eq: ["$type", "task_content"] },
                  ],
                },
              },
            },


            {
              $lookup: {
                from: "uploadcontents",
                localField: "task_content_id",
                foreignField: "_id",
                as: "task_content_id",
              },
            },

            { $unwind: "$task_content_id" }

          ],
          as: "transictions_task",
        },
      },


      {
        $sort: { updatedAt: 1 },
      },
      // {
      //   $match: recent,
      // },
      // {
      //   $match:{
      //     media_house_id: data.media_house_id,
      //     hopper_id: data.hopper_id,
      //     content_id: data.content_id,
      //   }
      // }
    ]







    const resp = await hopperPayment.aggregate(params);

    if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
      params.push(
        {
          $skip: Number(data.offset),
        },
        {
          $limit: Number(data.limit),
        }
      );
    }


    const news = await hopperPayment.aggregate(params);;

    console.log(news)
    // const values =
    //     typeof data.assign_more_hopper == "string"
    //       ? JSON.parse(data.assign_more_hopper)
    //       : data.assign_more_hopper;
    //   const assignHopper = await values.map(
    //     (hoper) => (hoper = mongoose.Types.ObjectId(hoper))
    //   );

    //   await BroadCastTask.update(
    //     { _id: mongoose.Types.ObjectId(data.task_id) },
    //     {
    //       $push: { assign_more_hopper_history: assignHopper },
    //       $set: updatePublishedContentObj,
    //     }
    //   ),



    // const workSheetColumnName = [

    //   "Hoppers Details",
    //   "Content details",
    //   "Type",
    //   "Payment Received from publication",
    //   "Presshop commission",
    //   "Payable to hopper",
    //   "Last paid",      
    // ];

    // // set xls file Name
    // const workSheetName = "Payment_process";

    // // set xls file path
    // const filePath = "/excel_file/" + Date.now() + ".csv";

    // const userList = news;

    // //get wanted params by mapping
    // const result = userList.map((val) => {
    //   let dateStr = val.createdAt;
    //   let dateObj = new Date(dateStr);

    //   const options = {
    //     day: "numeric",
    //     month: "short",
    //     year: "numeric",
    //     hour: "numeric",
    //     minute: "numeric",
    //     hour12: true,
    //   };

    //   let formattedDate = dateObj.toLocaleString("en-US", options);

    //   //published_by
    //   // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

    //   //1st level check

    //   //Employee details
    //   let dateStr2 = val.updatedAt;
    //   let dateObj2 = new Date(dateStr2);

    //   let formattedDate2 = dateObj2.toLocaleString("en-US", options);
    //   let admin_name, legal, Checkandapprove;
    //   if (val.admin_details) {
    //     admin_name = val.admin_details.name;
    //   }
    //   let employee = [admin_name, formattedDate2];
    //   let employee_str = employee.join("\n");
    //   let hppername = val.first_name + " " + val.last_name;

    //   let contactdetails = val.phone + " " + val.email;
    //   if (val.is_Legal == "true") {
    //     legal = "YES";
    //   } else {
    //     legal = "No";
    //   }

    //   if (val.is_Checkandapprove == "true") {
    //     Checkandapprove = "yes";
    //   } else {
    //     Checkandapprove = "No";
    //   }
    //   return [
    //     formattedDate,
    //      val.,
    //   ];
    // });
    // const workBook = XLSX.utils.book_new(); //Create a new workbook
    // const worksheetData = [workSheetColumnName, ...result];
    // const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    // XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    // XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    // const fullPath = filePath;
    res.json({
      code: 200,
      resp: news,
      count: resp.length,
    });
  } catch (err) {
    console.log('err in ----------_>', err.message);
    utils.handleError(res, err);
  }
};

exports.getalllistofContentthatmediahousePaid = async (req, res) => {
  try {
    const data = req.body;

    const getall = await Content.find({ paid_status: "paid" });

    res.json({
      code: 200,
      resp: getall,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.getallinviise = async (req, res) => {
  try {
    const data = req.body;
    const data2 = req.query;
    let getall
    let count;

    if (req.query.id) {
      getall = await hopperPayment.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        .populate("media_house_id hopper_id content_id admin_id task_content_id payment_admin_id").populate({
          path: "task_content_id",
          // select: { _id: 1,task_id:1  ,imageAndVideo:1 ,type:1 },
          populate: {
            path: "task_id",
            populate: {
              path: "category_id"
            }
          },
        }).populate({
          path: "content_id",
          // select: { _id: 1,task_id:1  ,imageAndVideo:1 ,type:1 },
          populate: {
            path: "category_id",
          },
        }).populate({
          path: "content_id",
          // select: { _id: 1,task_id:1  ,imageAndVideo:1 ,type:1 },
          populate: {
            path: "hopper_id",
            populate: {
              path: "avatar_id"
            }
          },
        })
        .populate({
          path: "hopper_id",
          // select: { _id: 1, latestAdminRemark: 1, mode: 1, category: 1, send_reminder: 1, avatar_id: 1, first_name: 1, last_name: 1, send_statment: 1, blockaccess: 1, user_id: 1, admin_id: 1, address: 1, post_code: 1, country_code: 1 ,user_name:1},
          populate: {
            path: "avatar_id",

          },
        }).skip(data2.offset ? Number(data2.offset) : 0)
        .limit(data2.limit ? Number(data2.limit) : 0);

      return res.json({
        code: 200,
        resp: getall,
      });
    } else {
      // Sorting

      let sorting = { createdAt: -1 }

      if (data2.hasOwnProperty("NewtoOld")) {
        sorting = { createdAt: -1 }
      }

      if (data2.hasOwnProperty("OldtoNew")) {
        sorting = { createdAt: 1 }
      }

      if (data2.hasOwnProperty("Highestpaymentrecevied")) {
        sorting = { amount: -1 }
      }

      if (data2.hasOwnProperty("Lowestpaymentrecevied")) {
        sorting = { amount: 1 }
      }

      // Filter

      let filters = {}

      if (data2.invoice_Number) {
        filters = { invoiceNumber: data2.invoice_Number }
      }

      if (data2.transaction_id) {
        filters = { _id: data2.transaction_id }
      }

      if (data2.hasOwnProperty("Paymentreceived")) {
        filters = { amount: { $gt: 0 } }
      }

      if (data2.Action_search) {
        if (data2.Action_search == "Remindersent") {
          filters = { send_reminder: true }
        }

        if (data2.Action_search == "Statementsend") {
          filters = { send_statment: true }
        }
      }


      getall = await hopperPayment
        .find(filters)
        .populate("media_house_id  content_id admin_id task_content_id payment_admin_id")
        .populate({
          path: "content_id",
          // select: { _id: 1,task_id:1  ,imageAndVideo:1 ,type:1 },
          populate: {
            path: "hopper_id",
            populate: {
              path: "avatar_id"
            }
          },
        })
        .populate({
          path: "hopper_id",
          // select: { _id: 1, user_name:1,latestAdminRemark: 1, mode: 1, category: 1, send_reminder: 1, avatar_id: 1, first_name: 1, last_name: 1, send_statment: 1, blockaccess: 1, user_id: 1, admin_id: 1, address: 1, post_code: 1, country_code: 1 },
          populate: {
            path: "avatar_id",
          },
        }).sort(sorting).skip(data2.offset ? Number(data2.offset) : 0)
        .limit(data2.limit ? Number(data2.limit) : 0);

      count = await hopperPayment
        .countDocuments({})
        .populate("media_house_id hopper_id content_id admin_id task_content_id payment_admin_id")
        .populate({
          path: "hopper_id",
          // select: { _id: 1, latestAdminRemark: 1, mode: 1, category: 1, send_reminder: 1, avatar_id: 1, first_name: 1, last_name: 1, send_statment: 1, blockaccess: 1, user_id: 1, admin_id: 1, address: 1, post_code: 1, country_code: 1 },
          populate: {
            path: "avatar_id",
          },
        }).sort(sorting)
    }




    const workSheetColumnName = [
      "date",
      "Vat",
      "Amount",
      "presshop_commission",
      "payable to hopper",
      "Rating",
      "is legal",
      "is check and approve",
      "mode",
      "status",
      "Remarks",
      "Employee details",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = getall

    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check
      // console.log("----------------",val.hopper_id.bank_detail)
      let filteredArray = "1"
      const valofmode = val?.content_id?.mode ? val.content_id.mode : null
   
      // = val.hopper_id.bank_detail.filter((detail) => detail.is_default === true);
      console.log("--------------filteredArray--",filteredArray)
      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_details.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");
      let hppername = val.first_name + " " + val.last_name;

      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.vat,
        val.amount,
        val.presshop_commission,
        val.payable_to_hopper,
        "4.1",
        legal,
        Checkandapprove,
        valofmode,
        val?.content_id?.status ? val.content_id.status : null  ,
        val?.content_id?.remarks ? val.content_id.remarks : null  ,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    return res.json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      count,
      resp: getall,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.countofInvoice = async (req, res) => {
  try {
    const data = req.query;
    // let getall;
    const noofcontentsold = await Content.find({ paid_status: "paid" });

    const hopperPayments = await hopperPayment.find({});
    // const publication = await User.find({role:"MediaHouse"})

    let condition = {};
    const today = new Date(
      moment().utc().subtract(1, "day").startOf("day").format()
    );
    const todayend = new Date(
      moment().utc().subtract(1, "day").endOf("day").format()
    );

    const prevw = new Date(
      moment().utc().subtract(1, "week").startOf("week").format()
    );
    const prevwe = new Date(
      moment().utc().subtract(1, "week").endOf("week").format()
    );

    const prevm = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );
    const prevme = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );

    const prevyear = new Date(
      moment().utc().subtract(1, "year").startOf("year").format()
    );
    const prevyearend = new Date(
      moment().utc().subtract(1, "year").endOf("year").format()
    );

    if (data.sortInvoice == "daily") {
      condition = {
        createdAt: {
          $lte: todayend,
          $gte: today
        }
      }
    }
    if (data.sortInvoice == "weekly") {
      condition = {
        createdAt: {
          $lte: prevwe,
          $gte: prevw
        }
      }
    }
    if (data.sortInvoice == "monthly") {
      condition = {
        createdAt: {
          $lte: prevme,
          $gte: prevm
        }
      }
    }
    if (data.sortInvoice == "yearly") {
      condition = {
        createdAt: {
          $lte: prevyearend,
          $gte: prevyear
        }
      }
    }
    const draftDetails = await hopperPayment.aggregate([
      {
        $match: condition
      },
      {
        $group: {
          _id: "$receiver_id",
          amount: { $sum: "$amount" },
          // avgRating: { $avg: "$rating" }
        },
      },
    ]);


    let condition1 = {};

    if (data.sortPublication == "daily") {
      condition1 = {
        createdAt: {
          $lte: todayend,
          $gte: today
        }
      }
    }
    if (data.sortPublication == "weekly") {
      condition1 = {
        createdAt: {
          $lte: prevwe,
          $gte: prevw
        }
      }
    }
    if (data.sortPublication == "monthly") {
      condition1 = {
        createdAt: {
          $lte: prevme,
          $gte: prevm
        }
      }
    }
    if (data.sortPublication == "yearly") {
      condition1 = {
        createdAt: {
          $lte: prevyearend,
          $gte: prevyear
        }
      }
    }


    const publication = await hopperPayment.aggregate([
      {
        $match: condition1
      },
      {
        $group: {
          _id: "$sender_id",
          amount: { $sum: "$amount" },
        },
      },
    ]);

    console.log(publication.length);

    res.json({
      code: 200,
      resp: {
        noofcontentsold: hopperPayments.length,
        noofinvoise: { count: hopperPayments.length, data: draftDetails },
        publication: { count: publication.length, data: publication },
        hopper: draftDetails.length,
      },
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.listofcontentandtask = async (req, res) => {
  try {
    const data = req.query;

    // const publication = await User.find({role:"MediaHouse"})

    const draftDetails = await hopperPayment.aggregate([
      {
        $group: {
          _id: "$hopper_id",
          // paid_status_to_hopper:false,
          data: { $push: "$$ROOT" },
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
          value: "$content_id._id",
        },
      },

      {
        $lookup: {
          from: "contents",
          let: { contentIds: "$value" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$contentIds"] },
                    { $eq: ["$paid_status_to_hopper", false] },
                  ],
                },
              },
            },
          ],
          as: "content_details",
        },
      },

      {
        $unwind: {
          path: "$content_details",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $match: {
          _id: mongoose.Types.ObjectId(data.hopper_id),
          // paid_status_to_hopper: false
          // room_type: data.room_type,
        },
      },

      {
        $addFields: {
          valueforid: "$content_details._id",
        },
      },
      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper_id", id: "$valueforid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$hopper_id",
                        mongoose.Types.ObjectId(data.hopper_id),
                      ],
                    },
                    { $eq: ["$paid_status_for_hopper", false] },
                    { $eq: ["$content_id", "$$id"] },
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
        $addFields: {
          // uploadedcontent: "$task_id",
          // acceptedby: "$acepted_task_id",
          payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

          recived_from_mediahouse: { $sum: "$transictions.amount" },
          presshop_commission: { $sum: "$transictions.presshop_commission" },

          // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
        },
      },
    ]);

    const draftDetailss = await hopperPayment.aggregate([
      {
        $group: {
          _id: "$hopper_id",
          // paid_status_to_hopper:false,
          data: { $push: "$$ROOT" },
        },
      },

      {
        $lookup: {
          from: "uploadcontents",
          localField: "data.task_content_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      {
        $addFields: {
          value: "$task_id._id",
        },
      },

      {
        $lookup: {
          from: "uploadcontents",
          let: { contentIds: "$value" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$contentIds"] },
                    { $eq: ["$paid_status_to_hopper", false] },
                  ],
                },
              },
            },
          ],
          as: "task_content_details",
        },
      },

      {
        $unwind: {
          path: "$task_content_details",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $match: {
          _id: mongoose.Types.ObjectId(data.hopper_id),
          // paid_status_to_hopper: false
          // room_type: data.room_type,
        },
      },

      {
        $addFields: {
          valueforid: "$task_content_details._id",
        },
      },
      {
        $lookup: {
          from: "hopperpayments",
          let: { contentIds: "$hopper_id", id: "$valueforid" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$hopper_id",
                        mongoose.Types.ObjectId(data.hopper_id),
                      ],
                    },
                    { $eq: ["$paid_status_for_hopper", false] },
                    { $eq: ["$type", "task_content"] },
                    { $eq: ["$task_content_id", "$$id"] },
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
          // uploadedcontent: "$task_id",
          // acceptedby: "$acepted_task_id",
          payable_to_hopper: { $sum: "$transictions.payable_to_hopper" },

          recived_from_mediahouse: { $sum: "$transictions.amount" },
          presshop_commission: { $sum: "$transictions.presshop_commission" },

          // totalPriceofImage: { $sum: "$uploaded_content..amount_paid" }
        },
      },
    ]);

    // const draftDetailss = await hopperPayment.aggregate([
    //   {
    //     $group: {
    //       _id: "$hopper_id",
    //      data:{ $push: "$$ROOT" },
    //     },

    //   },

    //   {
    //     $lookup: {
    //       from: "uploadcontents",
    //       localField: "data.task_content_id",
    //       foreignField: "_id",
    //       as: "task_id",
    //     },
    //   },

    //   {
    //     $match: {
    //       _id: mongoose.Types.ObjectId(data.hopper_id),
    //       paid_status_to_hopper: false,
    //     },
    //   },

    // ]);

    res.json({
      code: 200,
      resp: data.type == "content" ? draftDetails : draftDetailss,
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.addFcmToken = async (req, res) => {
  try {
    const data = req.body;
    let response;
    data.user_id = req.user._id;
    const device = await db.getItemCustom(
      { device_id: data.device_id ,user_id:data.user_id  },
      FcmDevice
    );
    if (device) {
      console.log("hello--------------->", data.device_token);
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

// exports.invoiceAndPayments = async (req, res) => {
//   try {
//     const data = req.body;
//     let diff, type;
//     let percentage, percentage2

//     let val = "month"

//     if (data.sortBy = "daily"){
//       val = "day"
//     }

//     if (data.sortBy = "weekly"){
//       val = "week"
//     }

//     if (data.sortBy = "month"){
//       val = "month"
//     }

//     if (data.sortBy = "yearly"){
//       val = "year"
//     }

//     const current_month = new Date(moment().utc().startOf(val).format());
//     const current_monthe = new Date(moment().utc().endOf(val).format());

//     const prevm = new Date(moment().utc().subtract(1, val).startOf(val).format());
//     const prevme = new Date(moment().utc().subtract(1, val).endOf(val).format());

//     const previous_month_first = await hopperPayment.aggregate([
//       {
//         $match: {
//           paid_status_for_hopper: false,
//           createdAt: {
//             $gte: prevm,
//             $lte: prevme
//           }
//         }
//       }
//     ])

//     console.log(previous_month_first);
//     const this_month_first = await hopperPayment.aggregate([
//       {
//         $match: {
//           paid_status_for_hopper: false,
//           createdAt: {
//             $gte: current_month,
//             $lte: current_monthe
//           }
//         }
//       }
//     ])    

//     console.log(this_month_first);

//     const previous_month_first_len = previous_month_first.length
//     const this_month_first_len = this_month_first.length



//     if (this_month_first_len > previous_month_first_len) {
//       diff = previous_month_first_len / this_month_first_len;
//       percentage = diff * 100;
//       type = "increase";
//     } else {
//       diff = this_month_first_len / previous_month_first_len;
//       percentage = diff * 100;
//       type = "decrease";
//     }

//     console.log(percentage);

//     const previous_month_second = await hopperPayment.aggregate([
//       {
//         $match: {
//           paid_status_for_hopper: true,
//           createdAt: {
//             $gte: prevm,
//             $lte: prevme
//           }
//         }
//       }
//     ])
//     const this_month_second = await hopperPayment.aggregate([
//       {
//         $match: {
//           paid_status_for_hopper: true,
//           createdAt: {
//             $gte: current_month,
//             $lte: current_monthe
//           }
//         }
//       }
//     ])

//     const previous_month_second_len = previous_month_second.length
//     const this_month_second_len = this_month_second.length

//     if (this_month_second_len > previous_month_second_len) {
//       diff = previous_month_second_len / this_month_second_len;
//       percentage2 = diff * 100;
//       type = "increase";
//     } else {
//       diff = this_month_second_len / previous_month_second_len;
//       percentage2 = diff * 100;
//       type = "decrease";
//     }

//     const content_sold = await hopperPayment.aggregate([
//       // {
//       //   $match: {
//       //     paid_status_for_hopper: false
//       //   }
//       // },
//       {
//         $group: {
//           _id: null,
//           content_sold: { $sum: "$amount" },
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the _id field from the output
//           content_sold: 1,
//         }
//       },
//       {
//         $addFields: {
//           content_sold: "$content_sold"
//         }
//       },
//     ]);

//     console.log("content_sold===========", content_sold);
//     const payment_paid = await hopperPayment.aggregate([
//       {
//         $match: {
//           paid_status_for_hopper: true
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           payment_paid: { $sum: "$payable_to_hopper" },
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the _id field from the output
//           payment_paid: 1,
//           no_of_hoppers: 1
//         }
//       },
//     ]);

//     console.log("payment_paid", payment_paid)




//     // const no_of_hoppers = await hopperPayment.aggregate([
//     //   {
//     //     $match: {
//     //       paid_status_for_hopper: true
//     //     }
//     //   },
//     //   { $count: "no_of_hoppers" }

//     // ]);




//     res.status(200).json({
//       code: 200,
//       content_sold: {
//         constentsold: content_sold.length > 0 ? content_sold[0].content_sold : 0,
//         percentage: percentage || 0,
//         type
//       },
//       payment_paid: {
//         paymentpaid: payment_paid.length > 0 ? payment_paid[0].payment_paid : 0,
//         percentage: percentage2,
//       }


//     });
//   } catch (error) {
//     utils.handleError(res, error);
//   }
// };


exports.invoiceAndPayments = async (req, res) => {
  try {
    const data = req.body;
    let diff, type;
    let percentage, percentage2


    const todat_start = new Date(moment().utc().startOf("day").format());
    const todat_end = new Date(moment().utc().endOf("day").format());

    const prevd_star = new Date(
      moment().utc().subtract(1, "day").startOf("day").format()
    );
    const prevd_end = new Date(
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

    const prems = new Date(
      moment().utc().subtract(1, "month").startOf("month").format()
    );
    const preme = new Date(
      moment().utc().subtract(1, "month").endOf("month").format()
    );

    // year======================================================

    const this_year = new Date(moment().utc().startOf("year").format());
    const this_year_end = new Date(moment().utc().endOf("year").format());

    const prevyear = new Date(
      moment().utc().subtract(1, "year").startOf("year").format()
    );
    const prevyearend = new Date(
      moment().utc().subtract(1, "year").endOf("year").format()
    );


    let conditoin = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }

    let condition_P = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: prems,
        $lte: preme
      }
    }

    let conditoin_count = {

      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }


    if (data.sortContentSold == "daily") {
      conditoin = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: todat_start,
          $lte: todat_end
        }
      },
        condition_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevd_star,
            $lte: prevd_end
          }
        },
        conditoin_count = {
          createdAt: {
            $gte: todat_start,
            $lte: todat_end
          }
        }
    }

    if (data.sortContentSold == "weekly") {
      conditoin = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: weeks,
          $lte: weeke
        }
      },
        condition_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevw,
            $lte: prevwe
          }
        },
        conditoin_count = {
          createdAt: {
            $gte: weeks,
            $lte: weeke
          }
        }
    }

    if (data.sortContentSold == "monthly") {
      conditoin = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: month,
          $lte: monthe
        }
      },
        condition_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prems,
            $lte: preme
          }
        },
        conditoin_count = {
          createdAt: {
            $gte: month,
            $lte: monthe
          }
        }
    }

    if (data.sortContentSold == "yearly") {
      conditoin = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: this_year,
          $lte: this_year_end
        }
      },
        condition_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevyear,
            $lte: prevyearend
          }
        },
        conditoin_count = {
          createdAt: {
            $gte: this_year,
            $lte: this_year_end
          }
        }
    }

    const hopperPayments = await hopperPayment.find(conditoin_count)



    const Content_Sold_pre = await hopperPayment.aggregate([
      {
        $match: condition_P

      }
    ])



    const Content_Sold_first = await hopperPayment.aggregate([
      {
        $match: conditoin
      }
    ])



    const Content_Sold_pre_len = Content_Sold_pre.length
    const Content_Sold_first_len = Content_Sold_first.length

    console.log("length", Content_Sold_first_len)


    if (Content_Sold_first_len > Content_Sold_pre_len) {
      diff = Content_Sold_pre_len / Content_Sold_first_len;
      percentage = diff * 100;
      type = "increase";
    } else {
      diff = Content_Sold_first_len / Content_Sold_pre_len;
      percentage = diff * 100;
      type = "decrease";
    }

    const content_sold = await hopperPayment.aggregate([
      {
        $match: conditoin
      },
      {
        $group: {
          _id: null,
          content_sold: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          content_sold: 1,
        }
      },
      {
        $addFields: {
          content_sold: "$content_sold"
        }
      },
    ]);

    // Invoices raised====

    let conditoin2 = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }

    let condition2_P = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: prems,
        $lte: preme
      }
    }

    let conditoin_count2 = {
      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }


    if (data.sortInvoices_raised == "daily") {

      conditoin2 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: todat_start,
          $lte: todat_end
        }
      },
        condition2_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevd_star,
            $lte: prevd_end
          }
        },
        conditoin_count2 = {
          createdAt: {
            $gte: todat_start,
            $lte: todat_end
          }
        }

    }

    if (data.sortInvoices_raised == "weekly") {

      conditoin2 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: weeks,
          $lte: weeke
        }
      },
        condition2_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevw,
            $lte: prevwe
          }
        },
        conditoin_count2 = {
          createdAt: {
            $gte: weeks,
            $lte: weeke
          }
        }

    }

    if (data.sortInvoices_raised == "month") {
      conditoin2 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: month,
          $lte: monthe
        }
      },
        condition2_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prems,
            $lte: preme
          }
        },
        conditoin_count2 = {
          createdAt: {
            $gte: month,
            $lte: monthe
          }
        }

    }

    if (data.sortInvoices_raised == "yearly") {
      conditoin2 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: this_year,
          $lte: this_year_end
        }
      },
        condition2_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevyear,
            $lte: prevyearend
          }
        }
      conditoin_count2 = {
        createdAt: {
          $gte: this_year,
          $lte: this_year_end
        }
      }
    }


    const Number_of_invoices = await hopperPayment.find(conditoin2)

    const Invoices_Raised_pre = await hopperPayment.aggregate([
      {
        $match: condition2_P

      }
    ])

    const Invoices_Raised_this = await hopperPayment.aggregate([
      {
        $match: conditoin2

      }
    ])

    const Invoices_Raised_pre_len = Invoices_Raised_pre.length
    const Invoices_Raised_this_len = Invoices_Raised_this.length



    if (Invoices_Raised_this_len > Invoices_Raised_pre_len) {
      diff = Invoices_Raised_pre_len / Invoices_Raised_this_len;
      percentage2 = diff * 100;
      type = "increase";
    } else {
      diff = Content_Sold_first_len / Content_Sold_pre_len;
      percentage2 = diff * 100;
      type = "decrease";
    }


    const invoices_Raised = await hopperPayment.aggregate([
      {
        $match: conditoin2
      },
      {
        $group: {
          _id: null,
          invoices_Raised: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          invoices_Raised: 1,
        }
      },
      {
        $addFields: {
          invoices_Raised: "$invoices_Raised"
        }
      },
    ]);



    // Payment received

    let condition3 = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }

    let condition3_P = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: prems,
        $lte: preme
      }
    }

    let conditoin_count3 = {
      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }

    if (data.sortPayment_received == "daily") {
      condition3 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: todat_start,
          $lte: todat_end
        }
      },
        condition3_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevd_star,
            $lte: prevd_end
          }
        },
        conditoin_count3 = {
          createdAt: {
            $gte: todat_start,
            $lte: todat_end
          }
        }

    }

    if (data.sortPayment_received == "weekly") {
      condition3 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: weeks,
          $lte: weeke
        }
      }
      condition3_P = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: prevw,
          $lte: prevwe
        }
      },
        conditoin_count3 = {
          createdAt: {
            $gte: weeks,
            $lte: weeke
          }
        }
    }

    if (data.sortPayment_received == "month") {
      condition3 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: month,
          $lte: monthe
        }
      },
        condition3_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prems,
            $lte: preme
          }
        },
        conditoin_count3 = {
          createdAt: {
            $gte: month,
            $lte: monthe
          }
        }
    }

    if (data.sortPayment_received == "yearly") {
      condition3 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: this_year,
          $lte: this_year_end
        }
      },
        condition3_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevyear,
            $lte: prevyearend
          }
        },
        conditoin_count3 = {
          createdAt: {
            $gte: this_year,
            $lte: this_year_end
          }
        }
    }


    const Number_of_publications = await hopperPayment.aggregate([
      {
        $match: conditoin_count3
      },
      {
        $group: {
          _id: "$media_house_id",
          amount: { $sum: "$amount" },
        },
      },
    ]);



    const Payment_received_pre = await hopperPayment.aggregate([
      {
        $match: condition3_P

      }
    ])

    const Payment_received_this = await hopperPayment.aggregate([
      {
        $match: condition3

      }
    ])

    const Payment_received_pre_len = Payment_received_pre.length
    const Payment_received_this_len = Payment_received_this.length

    console.log(Payment_received_this_len);


    let percentage3;


    if (Payment_received_this_len > Payment_received_pre_len) {
      diff = Payment_received_pre_len / Payment_received_this_len;
      percentage3 = diff * 100;
      type = "increase";
    } else {
      diff = Content_Sold_first_len / Content_Sold_pre_len;
      percentage3 = diff * 100;
      type = "decrease";
    }


    const Payment_received = await hopperPayment.aggregate([
      {
        $match: condition3
      },
      {
        $group: {
          _id: null,
          Payment_received: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          Payment_received: 1,
        }
      },
      {
        $addFields: {
          Payment_received: "$Payment_received"
        }
      },
    ]);


    // Payment paid

    let condition4 = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }

    let condition4_P = {
      paid_status_for_hopper: false,
      createdAt: {
        $gte: prems,
        $lte: preme
      }
    }

    let conditoin_count4 = {
      createdAt: {
        $gte: month,
        $lte: monthe
      }
    }

    if (data.sortPayment_paid == "daily") {
      condition4 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: todat_start,
          $lte: todat_end
        }
      },
        condition4_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevd_star,
            $lte: prevd_end
          }
        },
        conditoin_count4 = {
          createdAt: {
            $gte: todat_start,
            $lte: todat_end
          }
        }
    }

    if (data.sortPayment_paid == "weekly") {
      condition4 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: weeks,
          $lte: weeke
        }
      },
        condition4_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevw,
            $lte: prevwe
          }
        },
        conditoin_count4 = {
          createdAt: {
            $gte: weeks,
            $lte: weeke
          }
        }
    }

    if (data.sortPayment_paid == "month") {
      condition4 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: month,
          $lte: monthe
        }
      },
        condition4_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prems,
            $lte: preme
          }
        },
        conditoin_count4 = {
          createdAt: {
            $gte: month,
            $lte: monthe
          }
        }

    }

    if (data.sortPayment_paid == "yearly") {
      condition4 = {
        paid_status_for_hopper: false,
        createdAt: {
          $gte: this_year,
          $lte: this_year_end
        }
      },
        condition4_P = {
          paid_status_for_hopper: false,
          createdAt: {
            $gte: prevyear,
            $lte: prevyearend
          }
        },
        conditoin_count4 = {
          createdAt: {
            $gte: this_year,
            $lte: this_year_end
          }
        }
    }

    const Number_of_hoppers = await hopperPayment.aggregate([
      {
        $match: conditoin_count4
      },
      {
        $group: {
          _id: "$hopper_id",
          amount: { $sum: "$amount" },
        },
      },
    ]);


    const previous_month_Payment_paid = await hopperPayment.aggregate([
      {
        $match: condition4_P

      }
    ])
    const this_month_Payment_paid = await hopperPayment.aggregate([
      {
        $match: condition4

      }
    ])

    const previous_month_Payment_paid_len = previous_month_Payment_paid.length
    const this_month_Payment_paid_len = this_month_Payment_paid.length

    let percentage4;

    if (this_month_Payment_paid_len > previous_month_Payment_paid_len) {
      diff = previous_month_Payment_paid_len / this_month_Payment_paid_len;
      percentage4 = diff * 100;
      type = "increase";
    } else {
      diff = this_month_Payment_paid_len / previous_month_Payment_paid_len;
      percentage4 = diff * 100;
      type = "decrease";
    }



    const payment_paid = await hopperPayment.aggregate([
      {
        $match: condition4
      },
      {
        $group: {
          _id: null,
          payment_paid: { $sum: "$payable_to_hopper" },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          payment_paid: 1,
          no_of_hoppers: 1
        }
      },
    ]);

    // const hoper_count = await hopperPayment.aggregate([
    //   {
    //     $match: condition
    //   },
    //   {
    //     $group: {
    //       _id: "$receiver_id",
    //       amount: { $sum: "$amount" },
    //       // avgRating: { $avg: "$rating" }
    //     },
    //   },
    // ]);




    // const no_of_hoppers = await hopperPayment.aggregate([
    //   {
    //     $match: {
    //       paid_status_for_hopper: true
    //     }
    //   },
    //   { $count: "no_of_hoppers" }

    // ]);




    res.status(200).json({
      code: 200,
      content_sold: {
        constentsold: content_sold.length > 0 ? content_sold[0].content_sold : 0,
        percentage: percentage || 0,
        type,
        count: hopperPayments.length
      },
      invoices_Raised: {
        invoices_Raised: invoices_Raised.length > 0 ? invoices_Raised[0].invoices_Raised : 0,
        percentage: percentage2 || 0,
        type,
        count: Number_of_invoices.length
      },
      Payment_received: {
        Payment_received: Payment_received.length > 0 ? Payment_received[0].Payment_received : 0,
        percentage: percentage3 || 0,
        type,
        count: Number_of_publications.length
      },
      payment_paid: {
        payment_paid: payment_paid.length > 0 ? payment_paid[0].payment_paid : 0,
        percentage: percentage4 || 0,
        type,
        count: Number_of_hoppers.length
      }

    });
  } catch (error) {
    utils.handleError(res, error);
  }
};





exports.editHopperPayment = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updateHopperObj = {
      send_reminder: data.send_reminder,
      send_statment: data.send_statment,
      mode: data.mode,
      latestAdminRemark: data.latestAdminRemark,
      latestAdminUpdated: new Date(),
      user_id: req.user._id,
    };
    if (data.hasOwnProperty("blockaccsess")) {
      updateHopperObj.isPermanentBlocked = true;
    }

    if (data.hasOwnProperty("remove")) {

      await db.deleteItem(data.mediahouse_id, User);

      const findid = await hopperPayment.find({ media_house_id: data.mediahouse_id })
      const trans = findid.map((x) => x._id)

      trans.forEach(async (element) => {
        await db.deleteItem(element, hopperPayment);
      });

    }

    const createAdminHistory = {
      payment_id: data.payment_id,
      blockaccess: data.blockaccess,
      send_reminder: data.send_reminder,
      send_statment: data.send_statment,
      mode: data.mode,
      latestAdminRemark: data.latestAdminRemark,
      user_id: data.mediahouse_id,
      admin_id: req.user._id,
      type: "Mediahouse"
    };

    const [editHopper, history] = await Promise.all([
      db.updateItem(data.payment_id, hopperPayment, updateHopperObj),
      db.createItem(createAdminHistory, invoiceHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editHopper,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.editHopperPaymenthistorydetails = async (req, res) => {
  try {
    const data = req.query;
    let sortBy = { createdAt: -1 }
    if (data.history == "old") {
      sortBy = { createdAt: 1 }
    }
    if (data.history == "new") {
      sortBy = { createdAt: -1 }
    }
    let condition1 = {
      user_id: data.user_id,
      type: data.type
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    if (data.startDate && data.endDate) {
      condition1.createdAt = {
        $lte: endDate,
        $gte: startDate
      }
    }
    const history = await invoiceHistory
      // .find({ user_id: data.user_id, type: data.type })
      .find(condition1)
      .populate("user_id admin_id payment_admin_id payment_id").populate({
        path: "payment_id",

      }).populate({
        path: "payment_id",
        populate: {
          path: "media_house_id"
        }
      }).populate({
        path: "payment_id",
        populate: {
          path: "hopper_id",
          populate: {
            path: "avatar_id"
          }
        }
      })
      .sort(sortBy)
      .skip(data.offset ? Number(data.offset) : 0)
      .limit(data.limit ? Number(data.limit) : 0);

    const workSheetColumnName = [
      "time and date ",
      "employee name",
      "brodcasted by",
      "purchased publication",
      "volume",
      "mode",
      "remarks",
    ];

    // set xls file Name
    const workSheetName = "user";

    // set xls file path
    const filePath = "/excel_file/" + Date.now() + ".csv";

    const userList = history;
    //get wanted params by mapping
    const result = userList.map((val) => {
      let dateStr = val.createdAt;
      let dateObj = new Date(dateStr);

      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      let formattedDate = dateObj.toLocaleString("en-US", options);

      //published_by
      // let published_by = val.hopper_id.first_name + val.hopper_id.last_name;

      //1st level check

      //Employee details
      let dateStr2 = val.updatedAt;
      let dateObj2 = new Date(dateStr2);

      let formattedDate2 = dateObj2.toLocaleString("en-US", options);
      let admin_name, legal, Checkandapprove;
      if (val.admin_details) {
        admin_name = val.admin_id.name;
      }
      let employee = [admin_name, formattedDate2];
      let employee_str = employee.join("\n");


      let contactdetails = val.phone + " " + val.email;
      if (val.is_Legal == "true") {
        legal = "YES";
      } else {
        legal = "No";
      }

      if (val.is_Checkandapprove == "true") {
        Checkandapprove = "yes";
      } else {
        Checkandapprove = "No";
      }
      return [
        formattedDate,
        val.admin_id || "admin",
        "hppername",
        "val.user_id.full_name",
        val.admin_id,
        val.mode,
        val.remarks,
      ];
    });
    const workBook = XLSX.utils.book_new(); //Create a new workbook
    const worksheetData = [workSheetColumnName, ...result];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData); //add data to sheet

    XLSX.utils.book_append_sheet(workBook, worksheet, workSheetName); // add sheet to workbook
    XLSX.writeFile(workBook, path.join(process.env.STORAGE_PATH, filePath)); // save file to server
    const fullPath = filePath;

    res.status(200).json({
      code: 200,
      fullPath: STORAGE_PATH_HTTP + fullPath,
      data: history,
      total_count: await purchasedpublicationviewDetailsHistoey.countDocuments({
        content_id: data.content_id,
      }),
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.editHopperPaymentforHopper = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale();
    const updateHopperObj = {
      payment_send_reminder: data.send_reminder,
      payment_send_statment: data.send_statment,
      payment_mode: data.mode,
      payment_remarks: data.latestAdminRemark,
      payment_latestAdminUpdated: new Date(),
      payment_admin_id: req.user._id,
    };
    if (data.hasOwnProperty("blockaccsess")) {
      updateHopperObj.isPermanentBlocked = true;
    }

    if (data.hasOwnProperty("remove")) {

      await db.deleteItem(data.hopper_id, User);
      const findid = await hopperPayment.find({ hopper_id: data.hopper_id })
      const trans = findid.map((x) => x._id)

      trans.forEach(async (element) => {
        await db.deleteItem(element, hopperPayment);
      });
      // await db.deleteItem(data.hopper_id, User);
    }

    const createAdminHistory = {
      blockaccess: data.blockaccess,
      send_reminder: data.send_reminder,
      send_statment: data.send_statment,
      payment_id: data.payment_id,
      mode: data.mode,
      latestAdminRemark: data.latestAdminRemark,
      user_id: data.hopper_id,
      admin_id: req.user._id,
      type: "hopper"
    };

    const [editHopper, history] = await Promise.all([
      db.updateItem(data.payment_id, hopperPayment, updateHopperObj),
      db.createItem(createAdminHistory, invoiceHistory),
    ]);

    res.status(200).json({
      code: 200,
      data: editHopper,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};




exports.ongoingChatCount = async (req, res) => {
  try {

    const data = req.query;

    // const today = new Date(
    //   moment().utc().startOf("day").format()
    // );
    // const todayend = new Date(
    //   moment().utc().endOf("day").format()
    // );

    // // foe week ------------------------------------------------

    // const weeks = new Date(moment().utc().startOf("week").format());
    // const weeke = new Date(moment().utc().endOf("week").format());
    // // const prevw = new Date(
    // //   moment().utc().subtract(1, "week").startOf("week").format()
    // // );
    // // const prevwe = new Date(
    // //   moment().utc().subtract(1, "week").endOf("week").format()
    // // );



    // // month======================================================
    // const month = new Date(moment().utc().startOf("month").format());
    // const monthe = new Date(moment().utc().endOf("month").format());



    // const thisyear = new Date(moment().utc().startOf("year").format());
    // const thisyearend = new Date(moment().utc().endOf("year").format());
    // // const prevm = new Date(
    // //   moment().utc().subtract(1, "month").startOf("month").format()
    // // );





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
    const dynamicthis = new Date(moment().utc().startOf(val).format());
    const dynamicthisend = new Date(moment().utc().endOf(val).format());

    const prevdynamicthisv = new Date(
      moment().utc().subtract(1, val).startOf(val).format()
    );
    const prevdynamicthis = new Date(
      moment().utc().subtract(1, val).endOf(val).format()
    );
    const liveMonth = {
      receiver_id: req.user._id,
      createdAt: {
        $gte: startOfmonth,
        $lte: endOfmonth,
      },
      room_type: { $in: ['HoppertoAdmin', 'MediahousetoAdmin'] }
    }

    if (data.sortOngoingChat == "daily") {
      delete liveMonth.createdAt,
        liveMonth.createdAt = {
          $lte: dynamicthisend,
          $gte: dynamicthis

        }
    }
    if (data.sortOngoingChat == "weekly") {

      delete liveMonth.createdAt,
        liveMonth.createdAt = {
          $lte: dynamicthisend,
          $gte: dynamicthis

        }
    }
    if (data.sortOngoingChat == "monthly") {

      delete liveMonth.createdAt,
        liveMonth.createdAt = {
          $lte: dynamicthisend,
          $gte: dynamicthis

        }


    }
    if (data.sortOngoingChat == "yearly") {

      delete liveMonth.createdAt,
        liveMonth.createdAt = {
          $lte: dynamicthisend,
          $gte: dynamicthis

        }
    }

    const previousMonth = {
      receiver_id: req.user._id,
      createdAt: {
        $gte: prevdynamicthisv,
        $lte: prevdynamicthis,
      },
      room_type: { $in: ['HoppertoAdmin', 'MediahousetoAdmin'] }
    }

    let LiveMonthDetailsCount = (await db.getItems(Room, liveMonth)).length;
    let PreviousMonthDetailsCount = (await db.getItems(Room, previousMonth)).length;
    const percentage = await percentageCalculation(LiveMonthDetailsCount, PreviousMonthDetailsCount)
    const count = await Room.countDocuments({ room_type: { $in: ['HoppertoAdmin', 'MediahousetoAdmin'] }, receiver_id: req.user._id, })

    res.status(200).json({
      code: 200,
      details: percentage,
      count,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.downloadCmsCsv = async (req, res) => {
  try {
    const data = req.body;
    let path;
    if (data.type == 'app' || data.type == 'marketplace') {
      const docs = await typeofDocs.find({ type: "app", is_deleted: false });
      const workSheetColumnName = ["Document_name"];
      const response = docs.map((doc) => {
        return [doc.document_name];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }

    else if (data.type == 'privacy_policy') {
      const pp = await Privacy_policy.find({ _id: mongoose.Types.ObjectId("6458c3c7318b303d9b4755b3") });
      const workSheetColumnName = ["Description"];
      const response = pp.map((pp) => {
        return [removeHTMLTags(pp.description)];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }

    else if (data.type == 'selling_price') {
      const pp = await Selling_price.find({
        _id: mongoose.Types.ObjectId("64f013495695d1378e70446f"),
      });
      const workSheetColumnName = ["Shared", "Exclusive"];
      const response = pp.map((pp) => {
        return [pp.shared, pp.exclusive];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }

    else if (data.type == "faq") {
      const faq = await Faq.find({ for: data.for });
      const workSheetColumnName = ["Question", "Answer"];
      const response = faq.map((faq) => {
        return [faq.ques, faq.ans];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }

    else if (data.type == "legal") {
      const legal = await Legal_terms.find({ _id: mongoose.Types.ObjectId("6458c35c5d09013b05b94e37") });
      const workSheetColumnName = ["Description"];
      const response = legal.map((legal) => {
        return [removeHTMLTags(legal.description)];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }


    else if (data.type == "price_tips") {
      const price_tips = await db.getItems(priceTipforquestion, {
        for: data.for,
        is_deleted: false,
        // category:data.category
      });
      const workSheetColumnName = ["ques", "answer"];
      const response = price_tips.map((faq) => {
        return [faq.ques, faq.ans];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }


    else if (data.type == "email") {
      const price_tips = await addEmailRecord.find({})
      const workSheetColumnName = ["email"];
      const response = price_tips.map((faq) => {
        return [faq.email];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }

    res.status(200).json({
      code: 200,
      path,
      status: path
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.search = async (req, res) => {
  try {
    const data = req.body;
    let findby;
    let findbyupl;
    let condition = {};
    // condition.language = new RegExp(data.search, "i");
    // if (data.tag_id) {
    //   // const like = { $regex: data.search, $options: "i" };
    //   condition.tag_ids = { $in: data.tag_id };
    //   // condition.description = like;
    // }
    // findby = await Content.find(condition).populate("hopper_id").populate({
    //   path: "hopper_id",
    //   populate: {
    //     path: "avatar_id"
    //   }
    // });
    // findbyupl = await uploadedContent.find(condition).populate("task_id");




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
            { "location": { $regex: data.search, $options: "i" } }, // Case-insensitive search for location
            { "category_id.name": { $regex: data.search, $options: "i" } }, // Case-insensitive search for location
            { "tag_ids.name": { $regex: data.search, $options: "i" } } // Case-insensitive search for tag names
          ]
        }
      },
      {
        $sort: { createdAt: -1 } // Sort documents based on the specified criteria
      }
    ];

    const content = await Contents.aggregate(pipeline);





    res.status(200).json({
      code: 200,
      resp: content
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.getTags = async (req, res) => {
  try {
    let data = req.query;
    // data.mediahouse_id = req.user._id


    const condition = {};

    if (data.tagName) {
      condition.name = { $regex: data.tagName, $options: "i" };
    }

    let tags;
    tags = await db.getItems(Tag, condition);
    addTag = await db.createItem(data, trendingSearch);

    res.status(200).json({
      code: 200,
      tags: tags,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};

exports.onboard = async (req, res) => {
  try {
    let data = req.query;
    let response
    if (data.id) {
      response = await Onboard.findById(data.id)
    } else {
      response = await Onboard.find({});
    }
    res.status(200).json({
      code: 200,
      tags: response,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
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
    console.log("notiObj=============", notiObj);
    await _sendNotification(notiObj);

    // await  sendnoti(notiObj);


    res.json({
      code: 200,
      msg: "sent",
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};

exports.requestOnboard = async (req, res) => {
  try {
    let data = req.body;
    data.date = new Date(moment().add(24, 'hours'))
    data.password = 'Test@123$'
    if (data.status == 'approved') {
      await db.updateItem({ _id: data.id }, Onboard, data)

      const emailObj = {
        to: employeeAdded.email,
        subject: "Credentials for Presshop admin Plateform",
        name: employeeAdded.name,
        email: employeeAdded.email,
        password: data.password,
      };
      await emailer.sendMailToAdministator()
    }

    res.status(200).json({
      code: 200,
      tags: response,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};


exports.getemailrecords = async (req, res) => {
  try {
    let data = req.query;
    // data.mediahouse_id = req.user._id


    const condition = {};

    if (data.search) {
      condition.email = { $regex: data.search, $options: "i" };
    }

    let tags;
    tags = await db.getItems(addEmailRecord, condition);
    // addTag = await db.createItem(data, trendingSearch);

    res.status(200).json({
      code: 200,
      tags: tags,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};


exports.deleteEmail = async (req, res) => {
  try {
    const reqData = req.params;

    const addCategory = await db.deleteItem(reqData.id, addEmailRecord);

    res.status(200).json({
      code: 200,
      response: addCategory,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


exports.getDeletedContent = async (req, res) => {
  try {
    let data = req.query;
    // data.mediahouse_id = req.user._id


    const condition = {is_deleted:true}

    if (data.search) {
      condition.email = { $regex: data.search, $options: "i" };
    }
   let sorting = { createdAt: -1 }
   let tags;
  const content = await  Content.find(condition).populate({
    path: "hopper_id",
    populate: {
      path: "avatar_id",
    },
  }).sort(sorting)
    .skip(data.offset ? Number(data.offset) : 0)
    .limit(data.limit ? Number(data.limit) : 0);
    const contentCount = await  Content.countDocuments(condition)
    // tags = await db.getItems(Content, condition);
    // addTag = await db.createItem(data, trendingSearch);
    
    res.status(200).json({
      code: 200,
      count:contentCount,
      response: content,
    });
  } catch (error) {
    // console.log(error);
    utils.handleError(res, error);
  }
};


exports.deleteContent = async (req, res) => {
  try {
    const data = req.body;

    const editContent = await db.updateItem(
      data.content_id,
      Content,
      {is_deleted:data.is_deleted}
    );
     const findcontentinRecentactivity  = await recentactivity.findOne({content_id:data.content_id})

     if(findcontentinRecentactivity) {
     const updatecontent = await recentactivity.updateMany({content_id:mongoose.Types.ObjectId(data.content_id)},{$set:{is_deleted:true}})
     }

     
    res.status(200).json({
      code: 200,
      response: editContent,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};