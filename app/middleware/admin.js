const {
  handleError,
  buildErrObject,
  itemNotFound,
  getCountryCode,
  getIP,
  sendPushNotification,
  sendIosPushNotification,
  sendAndroidPushNotification,
  sendIosPushNotificationForLanding,
  sendAndroidPushNotificationForLanding
} = require("../middleware/utils");
const {
  createItem,
  createManyItems,
  getItemThroughId,
  updateItemThroughId,
  updateItem,
  updateItems,
  getItemCustom,
  getItemsCustom,
  getItemsCustomforSelect,
  deleteItem,
  deleteMany,
  getItemsCustomforPopulate,
  aggregateCollection,
} = require("../shared/core");
const {
  uploadFile,
  uploadBase64ToS3,
  capitalizeFirstLetter,
  convertToObjectIds,
  automatedString,
  createSlug,
} = require("../shared/helpers");
const auth = require('../middleware/auth')
const report_artist = require("../models/report_artist");
const XLSX = require("xlsx");
const { checkPassword } = require("../middleware/auth");
const db = require("../middleware/admin_db");
const emailer = require("../middleware/emailer");
const { lookup } = require("geoip-lite");
const countries = require("country-state-city").Country;
const states = require("country-state-city").State;
const cities = require("country-state-city").City;
var moment = require("moment");
const jwt = require('jsonwebtoken')
const Address = require("../models/address");
const blocktimeslot = require("../models/blockslot");
const STORAGE_PATH_HTTP = process.env.STORAGE_PATH_HTTP;
const STORAGE_PATH = process.env.STORAGE_PATH;
var mongoose = require("mongoose");
const uuid = require("uuid");
const APP_NAME = process.env.APP_NAME;
const OTP_EXPIRED_TIME = 5;
const Review = require("../models/review");
const CC = require("currency-converter-lt");
let currencyConverter = new CC();
const Bank_Account = require("../models/bank_account");
const { GET, POST } = require("../middleware/axios");
const axios = require("axios");
const ArtistPayouts = require("../models/artist_payouts");
// PDF
// const fs = require("fs");
const ejs = require("ejs");
const numbertowords = require("number-to-words");
const https = require("https");
const fs = require("fs");
var pdf = require("html-pdf");
var mime = require("mime-types");
var path = require("path");
const AWS = require("aws-sdk");
const archiver = require('archiver');
const ACCESS_KEY = "AKIAZJDEDGCCRE7GP7TP"; //process.env.ACCESS_KEY
const SECRET_KEY = "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";//process.env.SECRET_KEY
// const ACCESS_KEY = process.env.ACCESS_KEY
// const SECRET_KEY = process.env.SECRET_KEY
const Bucket = "uatgetreat"
const REGION = "ap-south-1";  //process.env.REGION
const s3 = new AWS.S3();
// const cron = require("node-cron");

/********************
 ******  MODEL ******
 ********************/
const PostMedia = require("../models/post_media");
//  const EventPromotion = require("../models/event_promotion");
const Event = require("../models/event");
const Booking_requests = require("../models/booking_requests");
const TimeSlots = require("../models/time_slots");
const BookingAction = require("../models/booking_action");
const Admin = require("../models/admin");
const historyOfapprove = require("../models/historyOfapprove");
// const Address = require("../models/address");
const Steps = require("../models/steps");
// const ReportPost = require("../models/report_post");
const Report = require("../models/report_post");
const Room = require("../models/room");
const Blocked_User = require("../models/blocked_users");
const Booking = require("../models/booking");
const RoleManagement = require("../models/role");
const book_request = require("../models/booking_requests");
const coupon = require("../models/coupon");
const addPost = require("../models/add_post");
const artist_request = require("../models/artist_request");
const artist_post = require("../models/artist_post");
const Languages = require("../models/language");
const CMS = require("../models/cms");
const artist_connection = require("../models/artist_connection");
const artist_wishlist = require("../models/artist_wishlist");
const Faq = require("../models/faq");
const User = require("../models/user");
const ChooseLife = require("../models/choose_life");
const FaqTopic = require("../models/faq_topic");
const WalkThrough = require("../models/walk_through");
const Event_promotion = require("../models/event_promotion");
const WalkThroughlocation = require("../models/walk_through_location");
const WalkThrough_GOG = require("../models/walk_through_gog");
const ArtCategory = require("../models/art_category");
const SubArtCategory = require("../models/sub_art_category");
const SubSubArtCategory = require("../models/sub_sub_art_category");
const City = require("../models/city");
const popularCity = require("../models/popular_city");
const Tax = require("../models/tax");
const Headline = require("../models/headlines");
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
const FCMDevice = require("../models/fcm_devices");
const Notification = require("../models/notification");
const dashboardManagment = require("../models/dashboard_management");
const meetOurArtist = require("../models/testimonial");
const gog = require("../models/GOG");
const Slides = require("../models/slides");
const Disputes = require("../models/dispute");
const Art_forms_under_headline = require("../models/art_forms_under_headline");
const SubAdmin = require("../models/subAdmin");
const Filters = require("../models/filters");
const cms = require("../models/privacy_policy");
const recent_search = require("../models/recent_search");
const { forEach, sortBy, find } = require("lodash");
const { log } = require("util");
const { pipeline } = require("stream");
const GOG = require("../models/GOG");
const cron = require("node-cron")
const filterforadmin = require("../models/filterforadmin");
/********************
 * Public functions *
 ********************/

const generateToken = (_id, role) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          _id,
          role,
          type: 'admin'
        },
        exp: expiration
      },
      process.env.JWT_SECRET
    )
  )
}

const deletegogdates = async () => {
  try {
    console.log("request_time now------>", new Date(moment()));
    console.log("request_time now------>", new Date());
    const currentDate = new Date();
    const thresholdDate = new Date(currentDate - 36 * 60 * 60 * 1000)
    console.log("thresholdDate---->", thresholdDate);
    const formattedDate = currentDate.toISOString().split('T')[0];
    const newdate = formattedDate + "T" + "00:00:00.000";
    const query = {
      GOG_end_date: {
        $lt: new Date(newdate),
      },
    };
    const recordsToDelete = await GOG.find(query);
    const userIds = recordsToDelete.map((x) => x.user_id);
    const eventstodelete = recordsToDelete.map((x) => x._id);
    console.log("USER IDS---", userIds)
    const requests = await GOG.deleteMany(query);
    for (const userId of userIds) {
      const query = {
        user_id: userId, // Assuming user_id is the field that links GOG and User tables
      };

      // Find the count of records in GOG table for the current user
      const recordCount = await GOG.countDocuments(query);

      // If the count is 0, update the User table
      if (recordCount === 0) {
        const userUpdateQuery = { _id: userId }; // Modify according to your schema
        const userUpdateFields = {
          $set: {
            GOG_status: false,
            GOG_city: null,
            GOG_start_date: null,
            GOG_end_date: null,
            current_location_status: "away",
            isAway: true
          },
        };

        console.log("Data to be updated----", userUpdateFields)
        // Update the User table
        const userUpdateResult = await User.updateOne(userUpdateQuery, userUpdateFields);
        const finduserdetails = await User.findOne({
          _id: mongoose.Types.ObjectId(userId),
        });
        const notificationObjUser = {
          sender_id: userId.toString(),
          receiver_id: userId.toString(),
          type: "off_grid",
          user_type: "artist",
          title: `It's All About the Base... Until Your Next Adventure!`,//Your Gog is Off`,
          body: `🏠 Back and listed at ${finduserdetails.base_location}. Thinking of traveling again? Set up GOG in advance for uninterrupted bookings.`,
          sound: "get_real_sound.caf",

        };
        const notiUSer = await _sendNotification(notificationObjUser);

        const notificationObjUsers = {
          sender_id: userId.toString(),
          receiver_id: userId.toString(),
          type: "off_grid_base",
          user_type: "artist",
          title: `Touchdown at Base!`,
          body: `🚀 Home is where the art is. You're relisted at your ${finduserdetails.base_location}, If travel is on your horizon, remember to activate GOG for seamless gigging."`,
          sound: "get_real_sound.caf",

        };
        const notiUSers = await _sendNotification(notificationObjUsers);
      } else {
        const finduserdetails = await User.findOne({
          _id: mongoose.Types.ObjectId(userId),
        });
        const findGog = await GOG.findOne({ user_id: userId }).sort({ createdAt: -1 });
        const notificationObjUsers = {
          sender_id: userId.toString(),
          receiver_id: userId.toString(),
          type: "off_grid_base",
          user_type: "artist",
          title: ` You will be now be listed in “GOG" `,
          body: `Hey ${finduserdetails.stage_name} . You will be now be listed in “GOG"  from ${findGog.GOG_start_date} to ${findGog.GOG_end_date}. Please edit your GOG or Re- activate it if there has been a change of plans .`,
          sound: "get_real_sound.caf",
        };
        const notiUSers = await _sendNotification(notificationObjUsers);

        console.log("Here in else condition")
      }

      const userUpdateQuery = { _id: userId }; // Modify according to your schema
      const userUpdateFields = {
        $set: {
          current_location_status: "away",
          isAway: true
        },
      };


      await User.updateOne(userUpdateQuery, userUpdateFields);
    }
    const deletedEvents = await Event.deleteMany({ gog_id: { $in: eventstodelete } });


  } catch (error) {
    console.error("error in cron function------>", error.message);
  }
}

const gogstartnotification = async () => {
  try {

    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    console.log("Current Date in GOG Notification is---", currentDate);
    const thresholdDate = new Date(currentDate)
    thresholdDate.setDate(thresholdDate.getDate() + 1);

    const formattedDate = thresholdDate.toISOString().split('T')[0];
    const newdate = formattedDate + "T" + "00:00:00.000";
    console.log("FORMATED DATE IS---", new Date(newdate));
    const query = {
      GOG_start_date: {
        $lte: new Date(newdate),
      },
      notification_triggered: { $ne: 1 }
    };
    const recordsToFind = await GOG.find(query);

    for (const record of recordsToFind) {
      const userDetails = await User.findOne({ _id: record.user_id });
      const gog_start_date = new Date(record.GOG_start_date).toLocaleDateString('en-US', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      const gog_end_date = new Date(record.GOG_end_date).toLocaleDateString('en-US', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const notificationObjUsers = {
        sender_id: record.user_id.toString(),
        receiver_id: record.user_id.toString(),
        type: "off_grid_base",
        user_type: "artist",
        title: `GOG Location Alert!`,
        body: `Hey “${userDetails.stage_name}” . You will be now be listed in ${record.GOG_city}  from “${gog_start_date}” to “${gog_end_date}”. Please edit your GOG or Re- activate it if there has been a change of plans ."`,
        sound: "get_real_sound.caf",
      };
      const notiUSers = await _sendNotification(notificationObjUsers);
      // Assuming your recordsToFind have a method like 'updateOne' for updating
      await GOG.updateOne({ _id: record._id }, { $set: { notification_triggered: 1 } });
    }

    console.log("Records to find---", recordsToFind);



  } catch (error) {
    console.error("error in gog cron function------>", error.message);
  }
}

const senduser = async () => {
  try {


    const recordsToDelete = await User.find({ isArtistProfileComplete: false, artist_profile_page: { $gt: 1 } });
    const userIds = recordsToDelete.map((x) => x._id);


    for (const userId of userIds) {

      const userUpdateQuery = { _id: userId }; // Modify according to your schema
      const findUSer = await User.findOne({ _id: userId });
      if (findUSer.createdAt) {

      }
      const notificationObjUser = {
        sender_id: userId.toString(),
        receiver_id: userId.toString(),
        type: "pending_artist_details",
        title: `Almost There!`, //Complete your Artist Profile`,
        body: `🎭 Your stage is set, just a few more steps to bring your talent into the spotlight. Complete your GetREAL profile now!`,
        sound: "get_real_sound.caf",

      };
      const notiUSer = await _sendNotification(notificationObjUser);
      // const userUpdateFields = {
      //   $set: {
      //     GOG_status: false,
      //     GOG_city: null,
      //     GOG_start_date: null,
      //     GOG_end_date: null,
      //     current_location_status: "away",
      //     isAway:true
      //   },
      // };

      // console.log("Data to be updated----", userUpdateFields)
      // const userUpdateResult = await User.updateOne(userUpdateQuery, userUpdateFields);    
    }
  } catch (error) {
    console.error("error in cron function------>", error.message);
  }
}

const booking_action_under2hour = async () => {
  try {
    /*** SEND NOTIFICATION FIRST TIME AND WEEKLY POST APPROVAL TILL 3 MONTHS ***/
    const endDate = new Date();

    // Get users who were created within the last 24 hours and haven't received the first-time notification
    const usersFirstTime = await User.find({
      last_notification_sent: {
        $gte: new Date(endDate.getTime() - 24 * 60 * 60 * 1000),
        $lte: endDate
      },
      first_time_notification_sent: { $ne: true }
    });

    // Send first-time notification to new users
    if (usersFirstTime.length > 0) {
      usersFirstTime.forEach(async (user) => {
        const notificationObjs = {
          sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
          receiver_id: mongoose.Types.ObjectId(user._id),
          type: "PromotionalNotification",
          user_type: "artist",
          title: `Start Vibing with Artists Worldwide! `,
          body: `🌟 On GetREAL, your Tribe is your creative family. Connect, collaborate, and share your journey. Let the good vibes roll!`,
          is_admin: true
        };
        await _sendAdminNotification(notificationObjs);

        // Set the flag to indicate that the first-time notification has been sent
        await User.updateOne({ _id: user._id }, { $set: { first_time_notification_sent: true } });
      });
    }

    // Get users who were created more than 24 hours ago and have not received the weekly notification in the last 7 days
    const usersWeekly = await User.find({
      createdAt: { $lt: new Date(endDate.getTime() - 24 * 60 * 60 * 1000 * 7 * 12) }, // Check for users created within the last 3 months
      last_notification_sent: {
        $lt: new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        $gte: new Date(endDate.getTime() - 8 * 24 * 60 * 60 * 1000)
      }
    });
    // Send weekly notification to eligible users
    if (usersWeekly.length > 0) {
      usersWeekly.forEach(async (user) => {
        const notificationObjs = {
          sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
          receiver_id: mongoose.Types.ObjectId(user._id),
          type: "PromotionalNotification",
          user_type: "artist",
          title: `Your GetREAL Tribe Awaits!`,
          body: "Your GetREAL Tribe Awaits! 🎤 Send Vibes, connect with diverse artists, and expand your creative horizons. Dive into a world of collaboration and inspiration!",
          is_admin: true
        };
        await _sendAdminNotification(notificationObjs);

        // Set the flag to indicate that the weekly notification has been sent
        await User.updateOne({ _id: user._id }, { $set: { last_notification_sent: endDate } });
      });
    }
    /**************************************************************************/
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const deletepost = await artist_post.deleteMany({
      post_type: "admin",
      createdAt: {
        $lt: twentyFourHoursAgo
      }
    });






    /*************************************************************************/
    // send notification after 30 mins after approval if artist is not in base location
    const isAwayTrue = await User.find({
      isAway: true,
      last_notification_sent: {
        $gte: new Date(endDate.getTime() - 30 * 60 * 1000),
        $lte: endDate
      }
    });

    if (isAwayTrue.length > 0) {
      isAwayTrue.forEach(async (x) => {


        const findnotification = await Notification.findOne({ type: "setup_your_GOG", receiver_id: x._id })
        if (!findnotification) {
          const notificationObjUser = {
            sender_id: x._id.toString(),
            receiver_id: x._id.toString(),
            type: "setup_your_GOG",
            user_type: "artist",
            title: `Not in your base location? Perfect!`, //Activate 'GIGS ON THE GO'`,
            body: `Activate 'GIGS ON THE GO' and turn every destination into a stage. Go Far with GOG! 🚀`,
            sound: "get_real_sound.caf",

          };
          await _sendNotification(notificationObjUser);
        }
      });
    }
  } catch (error) {
    console.error("error in cron function------>", error.message);
  }
};

const approvedartist = async () => {
  try {
    const endDate = new Date();

    const recordsToDelete = await User.find({ isArtistProfileComplete: true, });




    if (recordsToDelete.length > 0) {
      recordsToDelete.forEach(async (x) => {



        const notificationObjUser = {
          sender_id: x._id.toString(),
          receiver_id: x._id.toString(),
          user_type: "artist",
          type: "approved_artist",
          title: `Promote & Support on GetREAL! 🚀`,
          body: `Promote & Support on GetREAL! 🚀 Discover events within our network. Help spotlight gigs by fellow artists and build a stronger community.`,
          sound: "get_real_sound.caf",

        };
        const notiUSer = await _sendNotification(notificationObjUser);

      });
    }


  } catch (error) {
    console.error("error in cron function------>", error.message);
  }
};
async function sendSMS(user_id, sms_template) {
  const users = await User.findOne({
    _id: mongoose.Types.ObjectId(user_id),
  });
  const apiUrl = 'https://enterprise.smsgupshup.com/GatewayAPI/rest';
  const method = 'SendMessage';
  const sendTo = "91" + users.phone_no;
  const message = sms_template;
  const msgType = 'TEXT';
  const userId = '2000236623';
  const authScheme = 'plain';
  const password = 'mRpNzD$B';
  const version = '1.1';
  const format = 'TEXT';

  const url = `${apiUrl}?method=${method}&send_to=${sendTo}&msg=${message}&msg_type=${msgType}&userid=${userId}&auth_scheme=${authScheme}&password=${password}&v=${version}&format=${format}`;

  try {
    const response = await axios.post(url);
    console.log('SMS sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
}
const updatestatuspromotion = async () => {
  try {
    console.log("update ===========request_time now------>", new Date(moment()));
    console.log("request_time now------>", new Date());
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const newdate = formattedDate + "T" + "00:00:00.000";
    const query = {
      date: {
        $lt: new Date(newdate),
      },
    };

    const recordsToDelete = await Event_promotion.find(query);
    const eventstodelete = recordsToDelete.map((x) => x._id);

    for (const userId of eventstodelete) {

      await Event_promotion.updateMany({ _id: userId }, { status: "block" });
    }
  } catch (error) {
    console.error("error in cron function------>", error.message);
  }
}

function arraysEqual(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

const offgrid = async () => {
  try {
    console.log("update ======OFF GRID =====request_time now------>", new Date(moment()));
    console.log("request_time now------>", new Date());

    const recordsToDelete = await User.find({});

  } catch (error) {
    console.error("error in cron function------>", error.message);
  }
}
// closed intentionally
// cron.schedule("0 11 * * 1", () => {
//   console.log("<_______________C R O N_________________>");
//   approvedartist()
// });



cron.schedule("*/5 * * * *", () => {
  booking_action_under2hour()
  // deletegogdates()
  updatestatuspromotion()
  gogstartnotification()
});



cron.schedule("* * * * *", () => {
  // booking_action_under2hour()
  deletegogdates()
  // updatestatuspromotion()
  // gogstartnotification()
});
const _sendNotification = async (data) => {
  console.log(
    "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
    data
  );
  if (data.type) {
    User.findOne({
      _id: data.sender_id,
    })
      .then(async (senderDetail) => {
        if (senderDetail) {
          /*   const notificationObj = {
      sender_id: req.user._id.toString(),
      receiver_id: data.artist_id.toString(),
      type: "booking",
      title: "You recieved booking request.",
      body: req.body.body,
      sound: "get_real_sound.caf",
      booking_id:booking.data._id,
      artist_id: data.artist_id,
      user_id: req.user._id
    } */
          let userInfo = await User.findOne({
            _id: data.receiver_id,
          });
          var uInfo = JSON.parse(JSON.stringify(userInfo));
          let notificationObj = {
            sender_id: data.sender_id ? data.sender_id.toString() : "",
            receiver_id: data.receiver_id ? data.receiver_id.toString() : "",
            type: data.type,
            sound: data.type == "booking" ? data.sound : "",
            body:
              data.type == "booking"
                ? "You have just received a fresh booking request. Kindly consider either accepting or declining it at your earliest convenience."
                : data.body,
            artist_id: data.artist_id ? data.artist_id.toString() : "",
            user_id: data.user_id ? data.user_id.toString() : "",
            booking_id: data.booking_id ? data.booking_id.toString() : "",
            amount: data.amount ? data.amount : "",
          };
          FCMDevice.find({
            user_id: data.receiver_id,
          })
            .then(
              async (fcmTokens) => {
                if (fcmTokens.length > 0) {
                  const iosTokens = [];
                  const androidTokens = [];
                  const webTokens = [];
                  for (const token of fcmTokens) {
                    let crObj = {
                      sender_id: data.sender_id,
                      receiver_id: token.user_id,
                      title: data.title,
                      body:
                        data.type == "booking"
                          ? "You have just received a fresh booking request. Kindly consider either accepting or declining it at your earliest convenience."
                          : data.body,
                      type: data.type,
                      user_type: data.user_type ? data.user_type : "user"
                    };

                    if (data.booking_id) {
                      crObj.booking_id = data.booking_id;
                    }
                    if (data.type_id) {
                      crObj.type_id = data.type_id;
                    }
                    await createItem(Notification, crObj);

                    if (token.device_type === "ios") {
                      iosTokens.push(token.device_token);
                    } else if (token.device_type === "android") {
                      androidTokens.push(token.device_token);
                    } else if (token.device_type === "web") {
                      webTokens.push(token.device_token);
                    }
                  }

                  await Promise.all([
                    sendIosPushNotification(
                      iosTokens,
                      data.title,
                      data.body,
                      notificationObj
                    ),
                    sendAndroidPushNotification(
                      androidTokens,
                      data.title,
                      data.body,
                      notificationObj
                    ),
                    sendAndroidPushNotification(
                      webTokens,
                      data.title,
                      data.body,
                      notificationObj
                    ),
                    emailer.sendNotificationEmail("en", uInfo, "notifyEmail"),
                  ]);
                } else {
                  console.log("NO FCM TOKENS FOR THIS USER");
                }
              },
              (error) => {
                throw buildErrObject(422, error);
              }
            )
            .catch((err) => {
              console.log("err: ", err.message);
            });
        } else {
          throw buildErrObject(422, "sender detail is null");
        }
      })
      .catch((error) => {
        console.log("notification error in finding sender detail", error);
        throw buildErrObject(422, error);
      });
  } else {
    throw buildErrObject(422, "--* no type *--");
  }
};


const _sendAdminNotification = async (data) => {
  console.log(
    "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
    data
  );
  if (data.type) {
    await Admin.findOne({
      _id: data.sender_id,
    }).then(
      async (senderDetail) => {
        if (senderDetail) {
          let notificationObj = {
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            type: data.type,
            booking_id: data.booking_id ? data.booking_id.toString() : "",
            // imageUrl: data.imageUrl,
            // landing_page: data.landing_page
          };



          FCMDevice.find({
            user_id: data.receiver_id,
          })
            .then(
              async (fcmTokens) => {
                console.log("fcmTokens", fcmTokens);
                if (fcmTokens.length > 0) {

                  const iosTokens = [];
                  const androidTokens = [];
                  for (const token of fcmTokens) {
                    let crObj = {
                      sender_id: data.sender_id,
                      receiver_id: data.receiver_id,
                      title: data.title,
                      body: data.body,
                      type: data.type,
                      // type_id: data.booking_id ? data.booking_id.toString() : "",
                      isAdmin: true
                    }

                    if (data.booking_id) {
                      crObj.booking_id = data.booking_id;
                    }
                    if (data.type_id) {
                      crObj.type_id = data.type_id;
                    }

                    const findnotification = await Notification.findOne(crObj)

                    if (findnotification) {
                      await Notification.updateOne({ _id: findnotification._id }, { createdAt: new Date() })
                    } else {
                      await createItem(Notification, crObj);

                    }
                    // await createItem(Notification, crObj);

                    if (token.device_type === "ios") {
                      iosTokens.push(token.device_token);
                    } else if (token.device_type === "android") {
                      androidTokens.push(token.device_token);
                    }
                  }

                  await Promise.any([
                    sendIosPushNotification(
                      iosTokens,
                      data.title,
                      data.body,
                      notificationObj
                    ),
                    sendAndroidPushNotification(
                      androidTokens,
                      data.title,
                      data.body,
                      notificationObj
                    )
                  ])
                } else {
                  console.log("NO FCM TOKENS FOR THIS USER");
                }
              },
              (error) => {
                throw buildErrObject(422, error);
              }
            )
            .catch((err) => {
              console.log("err: ", err);
            });
        } else {
          throw buildErrObject(422, "sender detail is null");
        }
      },
      (error) => {
        console.log("notification error in finding sender detail", error);
        throw buildErrObject(422, error);
      }
    ).catch((error) => {
      console.log("notification error in finding sender detail", error);
      throw buildErrObject(422, error);
    });
  } else {
    throw buildErrObject(422, "--* no type *--");
  }
};


const _sendAdminNotificationforLanding = async (data) => {
  console.log(
    "------------------------------------------ N O T I F I C A T I O N -----------------------------------",
    data
  );
  if (data.type) {
    await Admin.findOne({
      _id: data.sender_id,
    }).then(
      async (senderDetail) => {
        if (senderDetail) {
          let notificationObj = {
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            type: data.type,
            booking_id: data.booking_id ? data.booking_id.toString() : "",
            imageUrl: data.imageUrl,
            clickAction: data.landing_page
          };



          FCMDevice.find({
            user_id: data.receiver_id,
          })
            .then(
              async (fcmTokens) => {
                console.log("fcmTokens", fcmTokens);
                if (fcmTokens.length > 0) {

                  const iosTokens = [];
                  const androidTokens = [];
                  for (const token of fcmTokens) {
                    let crObj = {
                      sender_id: data.sender_id,
                      receiver_id: data.receiver_id,
                      title: data.title,
                      body: data.body,
                      type: data.type,
                      // type_id: data.booking_id ? data.booking_id.toString() : "",
                      isAdmin: true
                    }

                    if (data.booking_id) {
                      crObj.booking_id = data.booking_id;
                    }
                    if (data.type_id) {
                      crObj.type_id = data.type_id;
                    }

                    const findnotification = await Notification.findOne(crObj)

                    if (findnotification) {
                      await Notification.updateOne({ _id: findnotification._id }, { createdAt: new Date() })
                    } else {
                      await createItem(Notification, crObj);

                    }
                    // await createItem(Notification, crObj);

                    if (token.device_type === "ios") {
                      iosTokens.push(token.device_token);
                    } else if (token.device_type === "android") {
                      androidTokens.push(token.device_token);
                    }
                  }

                  await Promise.any([
                    sendIosPushNotificationForLanding(
                      iosTokens,
                      data.title,
                      data.body,
                      notificationObj
                    ),
                    sendPushNotification(
                      androidTokens,
                      data.title,
                      data.body,
                      notificationObj
                    )
                  ])
                } else {
                  console.log("NO FCM TOKENS FOR THIS USER");
                }
              },
              (error) => {
                throw buildErrObject(422, error);
              }
            )
            .catch((err) => {
              console.log("err: ", err);
            });
        } else {
          throw buildErrObject(422, "sender detail is null");
        }
      },
      (error) => {
        console.log("notification error in finding sender detail", error);
        throw buildErrObject(422, error);
      }
    ).catch((error) => {
      console.log("notification error in finding sender detail", error);
      throw buildErrObject(422, error);
    });
  } else {
    throw buildErrObject(422, "--* no type *--");
  }
};


const findUser = async email => {
  return new Promise((resolve, reject) => {
    Admin.findOne(
      {
        email
      },
      'password first_name last_name email role _id is_email_verified image',
      (err, item) => {
        itemNotFound(err, item, reject, 'EMAIL NOT FOUND')
        resolve(item)
      }
    )
  })
}


const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    // const userAccess = new UserAccess({
    //   phone_number: user.phone_number,
    //   ip: utils.getIP(req),
    //   browser: utils.getBrowserInfo(req),
    //   country: utils.getCountry(req),
    // })
    // userAccess.save((err) => {
    // if (err) {
    //   reject(utils.buildErrObject(422, err.message));
    // }
    // setUserInfo(user);
    resolve({
      token: generateToken(user._id, user.role),
      user: user
    })
    // });
  })
}



/********************
 * Public functions *
 ********************/

exports.login = async (req, res) => {
  try {
    const data = req.body;
    console.log("****DATA*****", data);

    const user = await findUser(data.email);

    // if (data.allowed_type && data.allowed_type != user.role) {
    //   return res.status(422).json({
    //     code: 422,
    //     success: false,
    //     errors: {
    //       msg: `Please continue with a ${data.allowed_type} account`
    //     }
    //   })
    // }

    // await userIsBlocked(user)

    // await checkLoginAttemptsAndBlockExpires(user)

    console.log("__----USER---", user);

    const isPasswordMatch = await auth.checkPassword(data.password, user.password);

    console.log(isPasswordMatch);

    if (!isPasswordMatch) {
      return res.status(422).json({
        code: 422,
        errors: {
          msg: "Wrong Password"
        }
      })
    }

    // user.loginAttempts = 0

    // await saveLoginAttemptsToDB(user)

    /* if (!user.is_email_verified) {
      return res.status(422).json({
        code: 422,
        errors: {
          msg: "Please verify your email to login"
        }
      })
    } */

    let userObj = JSON.parse(JSON.stringify(user))
    console.log("userObj**********", userObj);
    delete userObj.password;


    return res.status(200).json(await saveUserAccessAndReturnToken(req, userObj))

  } catch (error) {
    handleError(res, error)
  }
}

exports.addAdmin = async (req, res) => {
  try {
    const data = {
      name: "Prince",
      email: "promatics.prince@gmail.com",
      password: "123",
      phone_number: "+919958162754",
      role: "superAdmin",

    }
    // const item = await getItemThroughId(Admin , "64b29004376e6cb3d3c6e55c" );
    const item = await Admin.findOne({ _id: "64b29004376e6cb3d3c6e55c" });
    item.email = data.email;
    item.password = data.password;
    item.is_email_verified = true;
    await item.save();
    return res.status(200).json(item);
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};


exports.getAdminProfile = async (req, res) => {
  try {
    console.log("req.user._id===========", req.user._id);
    const item = await getItemThroughId(Admin, req.user._id, true);


    return res.status(200).json(item);
  } catch (error) {
    console.log(error);
    handleError(res, error);
  }
};

exports.editAdminProfile = async (req, res) => {
  try {
    const item = await updateItemThroughId(Admin, req.user._id, req.body);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.sendOtp = async (req, res) => {

  try {
    const data = req.body;
    const locale = req.getLocale()
    let user = await Admin.findOne(
      { email: data.email }
    );
    if (!user) {
      throw buildErrObject(422, "WRONG_EMAIL");
    }

    //send otp
    // user.OTP = Math.floor(1000 + Math.random() * 9000);
    // user.otp_expire_time = new Date(
    //   new Date().getTime() + OTP_EXPIRED_TIME * 60 * 1000
    // );

    // await user.save();

    const item = await emailer.sendForgetPasswordEmail(locale, user, 'verifyEmail');

    return res.status(200).json({
      code: 200,
      message: item,
    });

  } catch (err) {
    handleError(res, err)
  }

}

exports.changePasswordPage = async (req, res) => {
  jwt.verify(req.params.token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      console.log(err);
      res.status(422).send("<h1> Token has been expired or invalid </h1>")
    } else {
      console.log(decoded.data);
      res.redirect(`https://getrealadmin-dev.web.app/#/auth/change-password/${decoded.data}`);
      res.end();
    }
  })
}

exports.changePassword = async (req, res) => {
  try {
    const item = await Admin.findOne({ _id: mongoose.Types.ObjectId(req.body._id) });
    item.password = req.body.password;
    await item.save();
    return res.status(200).json({
      code: 200,
      message: "Password Updated",
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.matchOldPassword = async (req, res) => {
  try {
    const admin = await getItemThroughId(Admin, req.user._id, true, "password");
    const doesPasswordMatch = await checkPassword(
      req.body.old_password,
      admin.data.password
    );
    return res.status(200).json(doesPasswordMatch);
  } catch (error) {
    handleError(res, error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let admin = await getItemThroughId(Admin, req.user._id, true);
    admin = admin.data;
    admin.password = req.body.password;
    admin.save();
    return res.status(200).json({
      code: 200,
      message: "Password Updated",
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getCms = async (req, res) => {
  try {
    const item = await getItemCustom(CMS, { type: req.params.type });
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateCms = async (req, res) => {
  try {
    const item = await updateItem(
      CMS,
      {
        _id: req.body._id,
      },
      {
        content: req.body.content
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.addFaqTopic = async (req, res) => {
  try {
    const item = await createItem(FaqTopic, req.body);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getFaqTopics = async (req, res) => {
  try {
    let data = req.query;
    const item = await db.getFaqTopics(FaqTopic, data);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getFaqTopicDetails = async (req, res) => {
  try {
    const item = await getItemThroughId(FaqTopic, req.params.topic_id);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateFaqTopic = async (req, res) => {
  try {
    const item = await updateItemThroughId(
      FaqTopic,
      req.params.topic_id,
      req.body
    );
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteFaqTopic = async (req, res) => {
  try {
    const item = await deleteItem(FaqTopic, req.params.topic_id);
    await deleteMany(Faq, {
      topic_id: mongoose.Types.ObjectId(req.params.topic_id),
    });
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.addFaq = async (req, res) => {
  console.log(req.body, "dddd");
  try {
    for (let i = 0; i < req.body.question.length; i++) {
      const element = req.body.question[i];
      const answer = req.body.answer[i]
      const data = {
        question: element,
        answer: answer,
        type: req.body.type,
      }
      var item = await createItem(Faq, data);

    }
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getFaqs = async (req, res) => {
  try {
    let data = req.query;

    const item = await db.getFaqs(Faq, data);
    return res.status(200).json({ count: item.length, item });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getFaqDetails = async (req, res) => {
  try {
    const item = await getItemThroughId(Faq, req.params.faq_id);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const item = await updateItemThroughId(Faq, req.params.faq_id, req.body);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    const item = await deleteItem(Faq, req.params.faq_id);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    let data = req.query;
    const item = await db.getUsers(User, data);

    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const item = await getItemThroughId(User, req.params.user_id);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};


exports.uploadAdminMedia = async (req, res) => {
  try {
    if (!req.files.media || !req.body.path) {
      // check if image and path missing
      return res.status(422).json({
        code: 422,
        message: "MEDIA OR PATH MISSING",
      });
    }
    let media = await uploadFile({
      image_data: req.files.media,
      path: req.body.path,
    });
    let mediaurl = media.data.Location;
    return res.status(200).json({
      code: 200,
      path: mediaurl,
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.addWalkThrough = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "WalkThrough",
      });
      data.image = media.data.Location;
    }

    const walk_through = await createItem(WalkThrough, data);
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getWalkThrough = async (req, res) => {
  try {

    const data = req.query;

    const whereObj = {}

    if (data.type == "gog") {
      whereObj.type = "gog";
    } else if (data.type == "web") {
      whereObj.type = "web";
    } else {
      whereObj.type = "general";
    }

    if (data.role) {
      whereObj.role = data.role
    }

    if (data._id) {
      whereObj._id = data._id
    }
    if (data.search) {
      whereObj.$or = [
        { title: { $regex: data.search, $options: "i" } },
        { content: { $regex: data.search, $options: "i" } },
      ];
    }

    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;

    const walk_through = await getItemsCustom(WalkThrough, whereObj, "", "", { createdAt: -1 }, limit, offset);
    walk_through.count = await WalkThrough.find(whereObj).count();

    return res.status(200).json({
      code: 200,
      data: data._id ? walk_through.data[0] : walk_through
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteWalkThrough = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(WalkThrough, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateWalkThrough = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "WalkThrough",
      });
      data.image = media.data.Location;
    }

    const walk_through = await updateItemThroughId(WalkThrough, data._id, data);
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getUserListing = async (req, res) => {
  try {
    let user;
    if (req.query._id) {


      user = await getItemThroughId(User, { _id: req.query._id });
      const existingReview = await Review.find({ artist_id: mongoose.Types.ObjectId(user.data._id) })
      const ratingSum = existingReview.length > 0
        ? existingReview.map((x) => x.rating).reduce((a, b) => a + b, 0)
        : 0;
      const total = existingReview.length
      const average = ratingSum / total
      user.data.averagerating_for_admin = average
      console.log("log-------------------------", user)
      console.log("dataaverage=====================", parseInt(ratingSum / total), ratingSum / total, ratingSum, average, existingReview)
    }
    else {

      const data = req.body;
      const datas = req.query;
      let whereObj = {}

      if (data.type) {
        if (data.type == "artist") {
          whereObj.isArtistProfileComplete = true;
          whereObj.artist_status = "pending";
        }
      }
      // const inputString = 
      // data.search.split("").length;
      //   if (inputString) {

      // /^[0-9a-fA-F]{24}$/.test(data.search)

      if (data.art_form && typeof data.art_form == "object") {
        whereObj.art_form = { $in: data.art_form };
      }



      // //     const val = data.search.toString().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // //  const for_id =  new RegExp(val, "i")
      //  const value = /data.search/i
      //     whereObj.$or = [
      //       { first_name: { $regex: req.body.search, $options: "i" } },
      //       { last_name: { $regex: req.body.search, $options: "i" } },
      //       { stage_name: { $regex: req.body.search, $options: "i" } },
      //       { email: { $regex: req.body.search, $options: "i" } },
      //       { base_location: { $regex: req.body.search, $options: "i" } },
      //       { phone_number: { $regex: req.body.search, $options: "i" } },
      //        {_id:data.search.split("").length == 24 ? data.search:""  }
      //     ];
      //   }

      if (data.search) {
        if (/^[0-9a-fA-F]{24}$/.test(data.search)) {
          // If the input string length is 24, search by _id
          whereObj.$or = [{ _id: req.body.search }];
        } else {
          // If the input string length is not 24, perform a regular search on multiple fields

          whereObj.$or = [
            { first_name: { $regex: req.body.search, $options: "i" } },
            { last_name: { $regex: req.body.search, $options: "i" } },
            { stage_name: { $regex: req.body.search, $options: "i" } },
            { email: { $regex: req.body.search, $options: "i" } },
            // { base_location: { $regex: req.body.search, $options: "i" } },
            { phone_number: { $regex: req.body.search, $options: "i" } },
            //  {_id:data.search.split("").length == 24 ? data.search:""  }
          ];
        }
      }
      if (data.base_location) {
        whereObj.user_city = { $in: data.base_location };
        for (let location of data.base_location) {
          await updateItem(City, { city: location }, { user_management_status: Boolean(data.base_location_status) })
        }
        // { base_location: data.base_location }
      }

      if (data.startRange && data.endRange) {
        whereObj.$and = [
          { createdAt: { $gte: new Date(data.startRange) } },
          { createdAt: { $lte: new Date(data.endRange) } },
        ]
      }

      let order = { createdAt: -1 }
      if (data.order == "oldest") {
        order = { createdAt: 1 }
      } else if (data.order == "newest") {
        order = { createdAt: -1 }
      }


      // if (data.wishlist) {
      //   whereObj = { artist_id: { $in: data.wishlist } }
      //   const getWishlisted = await artist_wishlist.find(whereObj).populate("artist_id user_id");
      //   const userId = getWishlisted.map((x) => x.user_id)
      //   const uniqueWishlist = [...new Set(getWishlisted)];
      //   whereObj = {
      //     _id: userId
      //   }
      //   // await updateItem(artist_wishlist, { _id: "6531102f702a4e7ad64bee7d" }, { min: data.min, max: data.max })
      // }
      // if (data.gigs == 'true') {
      //   const gigsCount = await db.gigsCount(Booking);
      //   /* console.log('gigsCount---->',gigsCount.length);
      //   console.log('gigs---->',gigsCount); */
      //   const filteredGigsCount = gigsCount.filter(count => {
      //     return count.count >= parseInt(data.gigmin) && count.count <= parseInt(data.gigmax);
      //   });
      //   await updateItem(Filters, { _id: "6531102f702a4e7ad64bee7d" }, { min: data.min, max: data.max })
      //   whereObj._id = { $in: filteredGigsCount.map(count => count._id) };
      // }

      // if (data.gig_bookings == 'true') {
      //   const bookings = await Booking.find({ booking_type: { $in: data.booking_types } });
      //   /* console.log('booking_count---->', bookings.length);
      //   console.log('gig_bookings---->',bookings); */
      //   whereObj._id = { $in: bookings.map(bookings => bookings.user_id) };
      // }
      // if (data.gig_events == 'true') {
      //   const events = await Booking.find({ event_type: { $in: data.event_types } });
      //   /* console.log('event_count------>', events.length);
      //   console.log('gig_events---->',events); */
      //   whereObj._id = { $in: events.map(events => events.user_id) };
      // }

      // if (data.tota_money_spent == 'true') {
      //   const gigsCount = await db.gigsCount(Booking);
      //   const filteredArtistFeeCount = gigsCount.filter(artist_fee => {
      //     return artist_fee.artist_fee_sum >= parseInt(data.moneyspentmin) && artist_fee.artist_fee_sum <= parseInt(data.moneyspentmax);
      //   });
      //   whereObj._id = { $in: filteredArtistFeeCount.map(artist_fee => artist_fee._id) };
      //   await updateItem(Filters, { _id: "653108c12bff359e152d90f1" }, { min: data.min, max: data.max })
      // }

      // if (data.dispute == 'true') {
      //   const disputes = await Disputes.find({ status: { $in: data.dispute_status } });
      //   whereObj._id = { $in: disputes.map(dispute => dispute.user_id) };
      //   /* for (const key in data.dispute_status) {
      //     if (keyArray.includes(key)) {
      //       obj[key] = Boolean(obj[key]); // Convert to boolean
      //       await updateItem(Filters, { _id: "653108dc2bff359e152d90f3" }, { min: data.min, max: data.max })
      //     }
      //   } */
      // }

      // if (data.promotion == 'true') {
      //   const promotions = await db.event_promotions(Event_promotion);
      //   console.log("promotion------",promotions)
      //   const filteredEventPromotionCount = promotions.filter(promotion => {
      //     return promotion.count >= parseInt(data.promotionmin) && promotion.count <= parseInt(data.promotionmax);
      //   });
      //   whereObj._id = { $in: filteredEventPromotionCount.map(count => count._id) };
      //   await updateItem(Filters, { _id: "653108dc2bff359e152d90f3" }, { min: data.min, max: data.max })
      // }
      // const existingReview = await Review.find({ artist_id: mongoose.Types.ObjectId(req.query._id) })
      // const ratingSum = existingReview.length > 0
      //   ? existingReview.map((x) => x.rating).reduce((a, b) => a + b, 0)
      //   : 0;
      // const total = existingReview.length
      // const average = ratingSum / total
      // console.log("dataaverage=====================", parseInt(ratingSum / total), ratingSum / total, ratingSum, average, existingReview)
      // console.log('whereObj--->', whereObj);

      // user = await getItemsCustom(User, whereObj, "", "", order, req.query.limit, req.query.offset);
      // user.count = await User.find(whereObj).count();
      const params = [
        { $match: whereObj },
        {
          $lookup: {
            from: "eventpromotions",
            localField: "_id",
            foreignField: "user_id",
            as: "event_promotions",
          }
        },
        {
          $lookup: {
            from: "artistwishlists",
            localField: "_id",
            foreignField: "user_id",
            as: "artist_wishlists",
          }
        },


        {
          $lookup: {
            from: "artistconnections",
            localField: "_id",
            foreignField: "user_id",
            as: "connections",
          },
        },

        {
          $lookup: {
            from: "artistposts",
            localField: "_id",
            foreignField: "receiver_id",
            as: "artistposts_details",
          },
        },
        {
          $lookup: {
            from: "artistposts",
            localField: "_id",
            foreignField: "user_id",
            as: "artistpostsbyuser",
          },
        },

        {
          $lookup: {
            from: "disputes",
            localField: "_id",
            foreignField: "user_id",
            as: "dispute_details",
          },
        },

        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "user_id",
            as: "booking_details",
          },
        },
        {
          $lookup: {
            from: "bank_accounts",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$user_id", "$$userId"] }],
                  },
                },
              },
            ],
            as: "bank",
          },
        },

        // {
        //   $lookup: {

        //     from: "headlines",
        //     localField: "art_form",
        //     foreignField: "art_form",
        //     //  let: { artform: "$art_form" },
        //     as: "headline",
        //   },
        // },
        {
          $addFields: {
            base_location: "$base_location",
            //  {
            //   $arrayElemAt: ["$base_location", 0 ]
            // },
            wislistarraynew: "$artist_wishlists.artist_id",
            total_money: { $sum: "$booking_details.artist_total_fee" },
            communitysize: { $size: "$connections" },
            artistrequests_size: { $size: "$artistposts_details" },
            total_show: { $size: "$artistpostsbyuser" },
            statusPromotion: { $size: "$event_promotions" },
            dispute_count: { $size: "$dispute_details" },
            disputestatus: "$dispute_details.status",
            bookingStatus: "$booking_details.event_type",
            booking_details_count: { $size: "$booking_details" },
            offgrid: { $cond: { if: { $and: [{ $eq: ["$isAway", true] }, { $eq: ["$GOG_status", false] }] }, then: true, else: false } },
          },
        },

        {
          $sort: order
        }


      ]

      if (data.tota_money_spent == 'true') {
        params.push(
          {
            $match: {
              booking_details: { $ne: [] },
              total_money: {
                $gte: parseInt(data.moneyspentmin),
                $lte: parseInt(data.moneyspentmax)
              }
            }
          })
      }


      if (data.dispute) {
        params.push(
          {
            $match: {

              dispute_details: { $ne: [] },

              "disputestatus": { $in: data.dispute_status }

            }
          })
      }
      if (data.gigs == 'true') {
        params.push(
          {
            $match: {
              // booking_details: { $ne: [] },
              booking_details_count: {
                $gte: parseInt(data.gigmin),
                $lte: parseInt(data.gigmax)
              }
            }
          })
      }
      if (data.wishlist) {
        const newarr = data.wishlist.map((x) => mongoose.Types.ObjectId(x))
        params.push(

          {
            $match: {
              "wislistarraynew": { $in: newarr }
            }
          },
          {

            $match: {
              artist_wishlists: { $ne: [] },

            }
          });
      }

      if (data.promotion == 'true') {

        params.push(

          {
            $match: {
              // statusPromotion: { $ne: [] },
              statusPromotion: {
                $gte: parseInt(data.promotionmin),
                $lte: parseInt(data.promotionmax)
              }
            }
          }

        )
      }

      if (data.gig_events == 'true') {

        params.push(

          {
            $match: {
              booking_details: { $ne: [] },
              bookingStatus: { $in: data.event_types }

            }
          }

        )
      }
      // if(data.type == "wishlist") {

      // }

      const response = await User.aggregate(params)


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
      const responses = await User.aggregate(params)
      return res.status(200).json({ count: response.length, data: responses, success: true });
    }



    return res.status(200).json(user);
  } catch (error) {

    handleError(res, error);
  }
};

exports.artistSection = async (req, res) => {
  try {
    const data = req.query;
    let response = await db.artistBookings(Booking, data);
    res.status(200).json({ code: 200, response });
  } catch (error) {
    handleError(res, error);
  }
}
exports.tabsforadmin = async (req, res) => {
  try {
    const data = req.query;
    let response = await db.listoftabs(User, data);
    res.status(200).json({ code: 200, response });
  } catch (error) {
    handleError(res, error);
  }
}
exports.getProfile = async (req, res) => {
  try {
    let _id;
    // console.log("req.user._id===========",req.user._id);
    if (req.body.user_id) {
      _id = mongoose.Types.ObjectId(req.body.user_id)
    } else {
      _id = mongoose.Types.ObjectId(req.body.user_id);
    }


    const userInfo = await getItemThroughId(Admin, _id);
    console.log(userInfo);
    if (!userInfo.data) {
      throw buildErrObject(422, "User Does Not Exist");
    }


    return res.status(200).json({
      code: 200,
      data: userInfo
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const data = req.body;
    let _id;
    if (req.body.user_id) {
      _id = mongoose.Types.ObjectId(req.body.user_id)
    } else {
      _id = mongoose.Types.ObjectId(req.user._id);
    }

    // if (data.email) {
    //   data.is_email_verified = true;
    // }

    const userInfo = await updateItemThroughId(Admin, _id, data);
    console.log(userInfo);
    if (!userInfo.data) {
      throw buildErrObject(422, "User Does Not Exist");
    }


    return res.status(200).json({
      code: 200,
      data: userInfo
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateUsers = async (req, res) => {
  try {
    let _id = mongoose.Types.ObjectId(req.body.user_id);

    let updateObj = {
      status: req.body.status,
      reason: req.body.reason
    }

    if (req.body.type && req.body.hasOwnProperty("home_approval")) {
      if (req.body.type == "artist") {
        updateObj = {
          artist_status: req.body.artist_status,
          home_approval: req.body.home_approval,
          reason: req.body.reason
        }
      }
    } else if (req.body.hasOwnProperty("home_approval")) {
      updateObj = {
        reason: req.body.reason,
        // artist_status: req.body.artist_status,
        home_approval: req.body.home_approval
      }
    } else {
      updateObj = {
        reason: req.body.reason,
        artist_status: req.body.artist_status,
        // home_approval:req.body.home_approval
      }
    }

    const data = {
      reason: req.body.reason,
      status: req.body.artist_status,
      user_id: _id,
      admin_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4")
    }

    const user = await updateItemThroughId(User, _id, updateObj);
    await createItem(historyOfapprove, data);
    if (req.body.artist_status == "approved") {
      const finduser = await User.findOne({ _id: mongoose.Types.ObjectId(req.body.user_id) })
      const notificationObj = {
        sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
        receiver_id: mongoose.Types.ObjectId(req.body.user_id),
        type: "ProfileApproved",
        title: `Spotlight's On You ${finduser.stage_name}!`, // Congratulations , Your Profile has been ${req.body.artist_status}`,
        body: `🌟Your GetREAL journey begins now. Your profile is live, and a community of artists awaits you!`,
        is_admin: true
      }

      await _sendAdminNotification(notificationObj);

      const notificationObjs = {
        sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
        receiver_id: mongoose.Types.ObjectId(req.body.user_id),
        type: "PromotionalNotification",
        user_type: "artist",
        title: `Start Vibing with Artists Worldwide!,`,
        body: `🌟 On GetREAL, your Tribe is your creative family. Connect, collaborate, and share your journey. Let the good vibes roll!`,
        is_admin: true
      }

      await _sendAdminNotification(notificationObjs);

      const user = await updateItemThroughId(User, mongoose.Types.ObjectId(req.body.user_id), { last_notification_sent: new Date() });
      if (finduser.isAway == "true" || finduser.isAway == true) {
        const notificationObjs = {
          sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
          receiver_id: mongoose.Types.ObjectId(req.body.user_id),
          type: "PromotionalNotification",
          user_type: "artist",
          title: `Explore and Perform with GOG! 🎒 `,
          body: `🎒 Wherever you are, GOG makes you discoverable. Activate now and transform every journey into an opportunity. Click for how it works!`,
          is_admin: true
        }

        await _sendAdminNotification(notificationObjs);
      }
    }

    if (req.body.artist_status == "disapproved") {
      // 64ce2a88a4c872c004d911d2
      // 650338048d22c031a1802798
      const notificationObj = {
        sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
        receiver_id: mongoose.Types.ObjectId(req.body.user_id),
        type: "ProfileDisApproved",
        title: `Your Profile has been ${req.body.artist_status}`,
        body: "Your Profile is DisApproved by admin",
        is_admin: true
      }

      await _sendAdminNotification(notificationObj);


    }
    return res.status(200).json(user.data);
  } catch (error) {

    handleError(res, error);
  }
};

exports.addCategory = async (req, res) => {
  try {

    const data = req.body;
    let category;
    if (!data.parent_id) {
      const findtoplevelcategory = await ArtCategory.findOne({ name: data.name, parent: null });

      if (findtoplevelcategory) {
        throw buildErrObject(422, "Already_Added_category")
      } else {

        data.parent_id = null;
        category = new ArtCategory({ name: data.name, parent: data.parent_id, status: "approved" });
        await category.save();

      }
    } else {

      category = await ArtCategory.findById(data.parent_id);
      const findallchildcategory = await ArtCategory.find({ parent: data.parent_id })
      const existingNames = await findallchildcategory.map((x) => x.name)
      const regex = new RegExp(`^(${existingNames.join('|')})$`, 'i');
      const hasMatch = data.sub_category.some((value) => regex.test(value));

      if (hasMatch) {
        throw buildErrObject(422, "Already_Added_sub_category");
      }
    }




    if (typeof (data.sub_category) == "string") {
      data.sub_category = JSON.parse(data.sub_category);
    }
    let parentCategory;
    for (let i = 0; i < data.sub_category.length; i++) {
      const sub_category = {
        name: data.sub_category[i],
        status: "approved",
        parent: category._id
      }

      const findtoplevelcategoryforparent_id = await ArtCategory.findOne({ parent: data.parent_id, name: data.sub_category[i] });
      if (findtoplevelcategoryforparent_id) {
        throw buildErrObject(422, "Already_Added_category")
      }
      let subCategory = new ArtCategory(sub_category);
      await subCategory.save();

      parentCategory = await ArtCategory.findById(category._id);
      parentCategory.subCategories.push(subCategory._id);
      await parentCategory.save();

      // const filterforuser = { 'art_forms_for_hompage': { $elemMatch: { category: category._id } } };
      // const updateForUser = {
      //   $set: {
      //     "art_forms_for_hompage.$.category": subCategory._id,
      //   },
      //   $push: {
      //     "art_form": data.sub_category[i], // Replace with the actual name you want to push
      //   },
      // };
      // const updateuser = await Headline.updateMany(filterforuser,updateForUser
      // );
    }

    return res.status(200).json({
      code: 200,
      parentCategory,
    });
  } catch (error) {

    handleError(res, error);
  }
};


exports.addSubCategory = async (req, res) => {
  try {

    const data = req.body;

    let categoryModel;
    switch (parseInt(data.layer)) {
      case 1:
        categoryModel = SubArtCategory;
        break;
      case 2:
        categoryModel = SubSubArtCategory;
        break;
      default:
        throw buildErrObject(422, "Wrong_Layer")
    }

    let category = await getItemCustom(categoryModel, { name: data.name });
    if (!category.data) {
      if (req.files && req.files.icon) {
        var image_name = await uploadFile({
          image_data: req.files.icon,
          path: "categoryIcon",
        });
        data.icon = image_name.data.Location;
      }

      category = await createItem(categoryModel, data);
    }

    return res.status(200).json(category);
  } catch (error) {

    handleError(res, error);
  }
};

exports.getCategory = async (req, res) => {
  try {

    const data = req.query;
    const limit = data.limit ? parseInt(data.limit) : 100;
    const offset = data.offset ? parseInt(data.offset) : 0;
    let parent_artForm, subcategory;
    if (!data.parent_id) {
      data.parent_id = null;
    } else {
      data.parent_id = mongoose.Types.ObjectId(data.parent_id);
      parent_artForm = await ArtCategory.findOne({ _id: mongoose.Types.ObjectId(data.parent_id) });
      parent_artForm = parent_artForm._doc;
      if (data.type == "subcategory") {
        const subcategoryIds = JSON.parse(data.subcategory_ids)
        subcategory = await ArtCategory.find({ _id: { $in: subcategoryIds } });
      } else {
        subcategory
      }

    }
    let whereObj = {}
    if (data.startRange && data.endRange) {
      whereObj.$and = [
        { createdAt: { $gte: data.startRange } },
        { createdAt: { $lte: data.endRange } },
      ]
    }

    if (data.search) {
      whereObj.name = { $regex: data.search, $options: 'i' }
    }
    console.log("new Date(data.endRange )", data.endRange)
    const pipeline = [
      {
        $match: { parent: data.parent_id, status: "approved" }, // Find top-level categories (categories without a parent)
      },
      // {
      //   $match: whereObj, // Find top-level categories (categories without a parent)
      // },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },

      {
        $facet: {
          topLevelCategories: [
            //     
            { $skip: offset },
            { $limit: limit },
            { $sort: { createdAt: -1 } },
          ],
          totalCount: [
            { $count: 'count' },
          ],
        },
      },
    ];
    let result = await ArtCategory.aggregate(pipeline);
    let results = { ...{ code: 200 }, ...result[0], ...parent_artForm, subcategory: data.type == "subcategory" ? subcategory : 0 }

    return res.status(200).json(results);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getSubCategory = async (req, res) => {
  try {
    const data = req.body;
    let categoryModel;
    switch (parseInt(data.layer)) {
      case 1:
        categoryModel = SubArtCategory;
        break;
      case 2:
        categoryModel = SubSubArtCategory;
        break;
      default:
        throw buildErrObject(422, "Wrong_Layer")
    }
    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;

    let whereObj;

    if (typeof data.category_id === "string") {
      try {
        data.category_id = JSON.parse(data.category_id);
      } catch (error) {
        console.error("Error parsing category_id JSON:", error);
        // Handle the error, if necessary
      }
    }

    // Convert each element in the category_id array to mongoose.Types.ObjectId
    const categoryIds = data.category_id.map(categoryId => {
      try {
        return mongoose.Types.ObjectId(categoryId);
      } catch (error) {
        console.error("Error converting category_id to ObjectId:", error);
        // Handle the error, if necessary
        return null; // or any default value to be used as a placeholder
      }
    });

    // Filter out any null values resulting from the conversion process
    const validCategoryIds = categoryIds.filter(categoryId => categoryId !== null);
    whereObj = {
      category_id: { $in: validCategoryIds },
    };


    if (data.category) {
      whereObj.name = { $regex: data.category, $options: 'i' }
    }
    let category = await getItemsCustom(categoryModel, whereObj, '', 'category_id', { createdAt: -1 }, limit, offset);
    category.count = await categoryModel.find(whereObj).count();

    return res.status(200).json(category);
  } catch (error) {

    handleError(res, error);
  }
};


exports.uploadMedia = async (req, res) => {
  try {
    if (req.files && req.files.media && req.body.path) {
      var image_name = await uploadFile({
        image_data: req.files.media,
        path: req.body.path,
      });
      let media = image_name.data.Location;

      return res.status(200).json({
        code: 200,
        data: media
      });
    } else {
      throw buildErrObject(422, "SOMETHING_IS_MISSING");
    }

  } catch (error) {
    handleError(res, error);
  }
};


exports.addPopularCities = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "City",
      });
      data.icon = media.data.Location;
    } else {
      throw buildErrObject(422, "media is missing")
    }

    const cities = await createItem(popularCity, data);
    return res.status(200).json(cities);
  } catch (error) {

    handleError(res, error);
  }
};


exports.deletePopularCities = async (req, res) => {
  try {
    const _id = req.params._id;
    const response = await deleteItem(popularCity, _id);
    return res.status(200).json(response);
  } catch (error) {

    handleError(res, error);
  }
};

exports.getPopularCities = async (req, res) => {
  try {

    const data = req.query;

    const whereObj = {}


    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;
    if (data.search) {
      const searchRegex = { $regex: data.search, $options: 'i' };
      whereObj.$or = [
        { city: searchRegex },
      ];
    }



    const city = await getItemsCustom(popularCity, whereObj, "", "", { createdAt: -1 }, limit, offset);
    city.count = await popularCity.find(whereObj).count();

    return res.status(200).json({
      code: 200,
      data: city.data,
      count: city.count
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getPopularCitiesbyId = async (req, res) => {
  try {

    const data = req.query;


    const city = await popularCity.findOne({ _id: data._id })

    return res.status(200).json({
      code: 200,
      data: city
    });
  } catch (error) {
    handleError(res, error);
  }
};
exports.addTax = async (req, res) => {
  try {
    const data = req.body;
    const checkType = await getItemCustom(Tax, { type: data.type });
    if (checkType.data) {
      throw buildErrObject(422, "already selected for this type");
    }

    const tax = await createItem(Tax, data);
    return res.status(200).json(tax.data);
  } catch (error) {

    handleError(res, error);
  }
};

exports.updateTax = async (req, res) => {
  try {
    const data = req.body;

    const tax = await updateItemThroughId(Tax, data._id, data);
    return res.status(200).json(tax.data);
  } catch (error) {

    handleError(res, error);
  }
};

exports.getTax = async (req, res) => {
  try {
    const data = req.query;

    const tax = await getItemCustom(Tax, { type: data.type });
    return res.status(200).json(tax.data);
  } catch (error) {

    handleError(res, error);
  }
};


exports.artistList = async (req, res) => {
  try {
    const data = req.query;
    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;
    const artist = await getItemsCustom(User, { isArtistProfileComplete: true }, "", "", { createdAt: -1 }, limit, offset);
    artist.count = await User.find({ isArtistProfileComplete: true }).count();
    return res.status(200).json(artist);
  } catch (error) {

    handleError(res, error);
  }
};



exports.editHomePageHeadlines = async (req, res) => {
  try {
    const data = req.body;

    // const existingHeadlines = await Headline.findOne({
    //   art_form: data.art_form,
    //   _id: { $ne: data._id }
    // });


    // const fing = await ArtCategory.find({ _id: { $in: data.art_form, $nin: data.art_formnot } })
    // const map = fing.map((x) => x.name)
    // data.art_form = map
    const findparent = await ArtCategory.find({ _id: { $in: data.art_form } })
    const parent = findparent.map((x) => x.parent)
    let arr = [], parentarr = parent
    /*  for (let i = 0; i < data.art_forms_for_hompage.length; i++) {
       console.log("i:=============:", i) */
    // for (let ob of data.art_forms_for_hompage) {
    //   /* for (let j = 0; j < ob.category.length; j++) {
    //     // const element = array[i];
    //     console.log("j:=============:",j)
    //   } */
    //   for (let x of ob.category) {
    //     const datacreate = {
    //       headline_name: data.headline,
    //       level: ob.level,
    //       ids: x,
    //     }
    //     const findparent = await ArtCategory.findOne({ _id: x })
    //     parentarr.push(findparent.parent)
    //     const createdItem = await createItem(Art_forms_under_headline, datacreate);
    //     console.log("createdItem------------", createdItem)
    //     arr.push(createdItem.data._id)
    //   }
    // }
    // // }
    // data.art_forms_for_hompage = arr
    const uniqueCities = new Set()
    parentarr.forEach((booking) => {
      const city = booking;
      // Add the city to the uniqueCities Set if it's not null and not an empty string
      if (city !== null && city !== "") {
        uniqueCities.add(city);
      }
      // uniqueCities.add(booking.base_location);
    });
    const cities = Array.from(uniqueCities);
    // const fing = await ArtCategory.find({ _id: { $in: cities } })
    const fing = await ArtCategory.find({ _id: { $in: data.art_form, $nin: cities } })
    const map = fing.map((x) => x.name)
    data.art_form = map
    const headlines = await updateItemThroughId(Headline, data._id, data);
    return res.status(200).json(headlines);

    //  const maps = data.art_forms_for_hompage.map((x) => x.category)
    //  const fings = await ArtCategory.find({_id:{$in:maps}})
    // //  const mapforadd = await ArtCategory.find({_id:{$in:fings}})
    //  const mapforadds = await  fings.map((x) => x.name)
    //  for (let i = 0; i < data.art_forms_for_hompage.length; i++) {


    //    data.art_forms_for_hompage[i].category = mapforadds[i]
    //   //  const mapforadd = await ArtCategory.find({_id:{$in:fings}})
    //  }

    // if (existingHeadlines) {
    //   throw buildErrObject(422, "ALREADY ADDED FOR THIS ARTFORM");
    // }

  } catch (error) {

    handleError(res, error);
  }
};

exports.deleteHomePageHeadlines = async (req, res) => {
  try {
    const _id = req.params._id;

    const deleteResponse = await Headline.deleteOne({
      _id: mongoose.Types.ObjectId(_id)
    });

    console.log("***", deleteResponse);

    if (deleteResponse.deletedCount > 0) {
      return res.status(200).json({
        code: 200,
        message: "DELETED"
      });
    } else {
      return res.status(422).json({
        code: 422,
        message: "NO DATA FOUND"
      });
    }
  } catch (error) {

    handleError(res, error);
  }
};

exports.viewHomePageHeadlines = async (req, res) => {
  try {
    const _id = req.params._id;

    const data = await Headline.findOne({
      _id: mongoose.Types.ObjectId(_id)
    });


    if (data) {
      return res.status(200).json({
        code: 200,
        data
      });
    } else {
      return res.status(422).json({
        code: 422,
        message: "NO DATA FOUND"
      });
    }
  } catch (error) {

    handleError(res, error);
  }
};

exports.getHomePageHeadlines = async (req, res) => {
  try {
    const data = req.query;
    if (data._id) {
      const findoneheadline = await Headline.findOne({ _id: data._id }).populate("art_forms_for_hompage").populate({
        path: "art_forms_for_hompage", populate: {
          path: "category"
        }
      })
      return res.status(200).json({
        code: 200,
        data: findoneheadline
      });
    } else {

      let condition = {};
      const limit = data.limit ? data.limit : 20;
      const offset = data.offset ? data.offset : 0;
      if (data.search) {
        const searchRegex = { $regex: data.search, $options: 'i' };
        condition.$or = [
          { art_form: searchRegex },
          { headline: searchRegex },
        ];
      }

      if (data._id) {
        condition = {
          _id: mongoose.Types.ObjectId(data._id)
        }
      }



      const headline_list = await getItemsCustomforPopulate(Headline, condition, "", "category", "art_forms_for_hompage", "art_forms_for_hompage", { createdAt: -1 }, limit, offset);
      // await Headline.populate(headline_list, { path: 'art_forms_for_hompage.category' });
      headline_list.count = await Headline.find().count();
      // const headline_list = await db.getHeadlines(Headline, data)
      return res.status(200).json({
        code: 200,
        data: headline_list
      });
    }
  } catch (error) {

    handleError(res, error);
  }
};

exports.editCategory = async (req, res) => {
  try {
    const _id = req.body._id;

    const category = await updateItemThroughId(ArtCategory, _id, { name: req.body.name })

    return res.status(200).json(category);
  } catch (error) {

    handleError(res, error);
  }
};
async function deleteSubcategories(parentCategoryId) {
  // Find and delete all child categories with the given parentCategoryId
  const subcategories = await ArtCategory.find({ _id: parentCategoryId });
  for (const subcategory of subcategories) {
    await deleteSubcategories(subcategory._id); // Recursively delete subcategories
    await subcategory.remove(); // Delete the subcategory
  }
}
function deleteCategory(categoryId, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === categoryId) {
      arr.splice(i, 1);
      return true;
    } else if (arr[i].subCategories.length > 0) {
      const subcategoryDeleted = deleteCategory(categoryId, arr[i].subCategories);
      if (subcategoryDeleted) return true;
    }
  }
  return false;
}

async function deleteSubcategoryAndChildren(categoryId) {
  // Find the category by its ID
  const category = await ArtCategory.findById(categoryId);

  if (!category) {
    console.log("Category not found");
    return;
  }

  // Delete the category
  const deleteResult = await ArtCategory.deleteOne({ _id: categoryId });

  if (deleteResult.deletedCount > 0) {
    console.log(`Deleted category: ${category.name}`);
  } else {
    console.log(`Failed to delete category: ${category.name}`);
  }

  // Recursively delete subcategories
  for (const subcategoryId of category.subCategories) {
    await deleteSubcategoryAndChildren(subcategoryId);
  }
}
exports.deleteCategory = async (req, res) => {
  try {
    const _id = req.params._id;



    const findarrauofsubcategory = await ArtCategory.findOne({ _id: _id })
    for (let i = 0; i < findarrauofsubcategory.subCategories.length; i++) {
      const categoryId = findarrauofsubcategory.subCategories[i];
      await deleteSubcategoryAndChildren(categoryId);
    }
    const deleted = await deleteItem(ArtCategory, _id);
    await ArtCategory.updateMany(
      { subCategories: { $in: [_id] } }, // Filter to find all categories with the specified subcategory _id
      { $pull: { subCategories: _id } }, { parent: null }
    );
    // await deleteSubcategories(_id);
    return res.status(200).json(deleted);
  } catch (error) {

    handleError(res, error);
  }
};



async function searchUserAndHeadlines(userId, searchArtForm) {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'headline',
        match: { headline: searchArtForm }, // Filter headlines by the search art_form
      });

    return user;
  } catch (error) {
    throw error;
  }
}
async function checkAvailability(artistId, startDate, endDate) {
  // Call your existing logic from exports.getBusyFreeSlots here
  // Modify the logic to use artistId, startDate, and endDate
  // Return true if the user is available, false otherwise

  // Example: (replace this with your actual logic)
  const chooseLifeData = await ChooseLife.findOne({
    user_id: artistId,
    day: "Monday" // Replace with the actual day based on startDate
  });

  // Add your logic to check availability using chooseLifeData, startDate, and endDate
  // ...

  // Return true if available, false otherwise
  return true; // Modify this based on your actual logic
}
exports.getUserz = async (req, res) => {
  try {
    const data = req.body;
    const datas = req.query;
    let condition = {};
    let condition1 = {}
    if (data.status) condition.artist_status = data.status
    if (data.role == "artist") {
      console.log("data==========")
      condition.artist_status = { $eq: "approved" }
      condition.isArtistProfileComplete = { $eq: true }
      // condition.artist_stats = {data.status}
      // condition.artist_status = { $nin: ["pending"] }
    } else {
      console.log("data=======else===")
      // condition.artist_status = { $eq: "approved" }
      condition.isArtistProfileComplete = { $eq: false }
      // condition.current_role = data.role
    }
    let headline = "";
    if (data.search) {
      const searchRegex = { $regex: data.search, $options: 'i' };
      condition.$or = [
        { stage_name: searchRegex },
        { first_name: searchRegex },
        { base_location: searchRegex },
        { phone_number: searchRegex },
        { email: searchRegex },
        { headline: searchRegex },
        { art_form: searchRegex },
      ];
      headline = data.search
    }

    if (data.startRange && data.endRange) {
      condition.$and = [

        { createdAt: { $gte: new Date(moment(data.startRange).clone().startOf('day')) } },
        { createdAt: { $lte: new Date(moment(data.endRange).clone().endOf('day')) } },
      ]

    }

    const baseLocationArray = data.base_location ? data.base_location : [];
    // if (data.gog == "true" || data.gog === true && data.curr_location) {
    //   console.log("data=====gog=====")
    //   const curr_locationArray = data.curr_location ? data.curr_location : [];
    //   condition1 = {
    //     $and: [
    //       {
    //         $and: [
    //           { isAway: false },
    //           { GOG_status: true },
    //           { GOG_city: { $in: data.curr_location } },
    //           { GOG_city: { $ne: null } },
    //         ]
    //       },

    //     ]
    //   }
    // }

    if (data.curr_location && data.base_location) {
      const curr_locationArray = data.curr_location ? data.curr_location : [];
      condition1 = {
        $and: [
          {
            $and: [
              { isAway: false },
              { GOG_status: true },
              { GOG_city: { $in: data.curr_location } }
            ]
          },
          {
            base_location: { $in: data.base_location }
          }
        ]
      }
    }


    if (data.base_location) {
      console.log("data=====base_location=====")
      condition.base_location = { $in: data.base_location };

    }

    if (data.offgrid == true) {
      const curr_locationArray = data.curr_location ? data.curr_location : [];
      condition1 = {
        $and: [
          { isAway: true },

        ]
      }
    }

    if (data.offgrid == true && data.base_location) {
      const curr_locationArray = data.base_location ? data.base_location : [];
      condition1 = {
        $and: [
          { isAway: true },
          {
            base_location: { $in: curr_locationArray }
          }
        ]
      }
    }
    if (data.gog == "true" || data.gog === true) {
      console.log("data=====gog=====")

      condition1 = {
        $and: [
          {
            $and: [
              { isAway: false },
              { GOG_status: true },

            ]
          },

        ]
      }
    }
    // if (data.gog == "true" || data.gog === true ) {
    //   console.log("data=====gog=====")

    //   condition1 = {
    //     $and: [
    //       {
    //         $and: [
    //           { isAway: false },
    //           { GOG_status: true },

    //         ]
    //       },

    //     ]
    //   }
    // }
    if (data.offgrid == "true" || data.offgrid === true && data.curr_location) {
      console.log("data=====gog=====")
      const curr_locationArray = data.curr_location ? data.curr_location : [];
      condition1 = {
        $and: [
          {
            $and: [
              { isAway: true },

            ]
          },

        ]
      }
    }
    if ((data.gog == "true" || data.gog === true) && data.curr_location) {
      console.log("data=====gog=====")
      const curr_locationArray = data.curr_location ? data.curr_location : [];
      condition1 = {
        $and: [
          {
            $and: [
              { isAway: false },
              { GOG_status: true },
              { current_location_status: { $eq: "gog" } },
              { GOG_city: { $in: data.curr_location } },
              { GOG_city: { $ne: null } },
            ]
          },

        ]
      }
    }
    if (data.postmin && data.postmax) {
      condition.total_show = {
        $gte: Number(data.postmin),
        $lte: Number(data.postmax)
      }
    }
    if (data.gigmin && data.gigmax) {
      condition.booking_details_count = {
        $gte: Number(data.gigmin),
        $lte: Number(data.gigmax)
      }
    }

    if (data.promotionmin && data.promotionmax) {
      condition.statusPromotion = {
        $gte: Number(data.promotionmin),
        $lte: Number(data.promotionmax)
      }
    }


    if (data.tribemin && data.tribemax) {
      condition.communitysize = {
        $gte: Number(data.tribemin),
        $lte: Number(data.tribemax)
      }
    }

    if (data.disputemin && data.disputemax) {
      condition.dispute_count = {
        $gte: Number(data.disputemin),
        $lte: Number(data.disputemax)
      }
    }


    if (data.artist_id) {
      condition1 = {
        _id: mongoose.Types.ObjectId(data.artist_id)
      }
    }

    if (data.trainingmin && data.trainingmax) {
      condition.actual_training_fee = {
        $gte: Number(data.trainingmin),
        $lte: Number(data.trainingmax)
      }
    }

    if (data.perfomancemin && data.perfomancemax) {
      condition.actual_performance_fee = {
        $gte: Number(data.perfomancemin),
        $lte: Number(data.perfomancemax)
      }
    }


    if (data.promotionstatus) {
      condition.statusPromotion = { $in: data.promotionstatus }
    }


    if (data.base_location) {
      condition.base_location = { $in: data.base_location }
    }
    let conditions = {}

    if (data.art_form) {
      const foundCategory = await ArtCategory.findOne({
        name: { $in: data.art_form },
      }).populate("subCategories"); // Populate the subCategories field with actual documents
      console.log("ART FORM IS---", req.body.art_form);
      if (!foundCategory) {
        console.log("Category not found");
        return;
      }

      // Log the found category and its subCategories
      // console.log("Found Category:", foundCategory.name);
      //  console.log("Subcategories:", foundCategory.subCategories);
      const categoryNames = [
        foundCategory.name,
        ...foundCategory.subCategories.map((subCategory) => subCategory.name),
      ];
      condition.art_form = { $in: categoryNames }
    }
    let sortcondition;
    data.sortby == 'old' ? sortcondition = { createdAt: 1 } : sortcondition = { createdAt: -1 }

    if (data.bucket) {
      query = query.populate({
        path: populateField,
        match: { headline: condition.art_form }, // Apply art_form condition for headlines
      });
    }

    let avalable = {}
    if (data.start_time && data.end_time) {
      let timePart = data.start_time // Extract time part from start_time
      let timePart2 = data.end_time
      console.log("time-----------", timePart, "time2-----------", timePart2)
      avalable = {
        day: { $in: data.day },
        "time_slots.start_time": { $gte: timePart }, // Replace with your desired start time
        "time_slots.end_time": { $lte: timePart2 },   // Replace with your desired end time
      }
    }





    console.log("data===================", data)

    // if(data.avalable){
    //   const find = await Booking.find
    // }
    const params = [
      { $match: condition1 },
      // { $match: conditions },
      {
        $lookup: {
          from: "chooselives",
          localField: "_id",
          foreignField: "user_id",
          as: "event",
          pipeline: [
            {
              $lookup: {
                from: "timeslots",
                localField: "_id",
                foreignField: "event_id",
                as: "time_slots",
              },
            },

            {
              $match: avalable,
            },
          ]
        }
      },
      {
        $match: {
          event: { $ne: [] }
        }
      },
      {
        $lookup: {
          from: "eventpromotions",
          localField: "_id",
          foreignField: "user_id",
          as: "event_promotions",
        }
      },


      {
        $lookup: {
          from: "artistconnections",
          localField: "_id",
          foreignField: "user_id",
          as: "connections",
        },
      },

      {
        $lookup: {
          from: "artistposts",
          localField: "_id",
          foreignField: "receiver_id",
          as: "artistposts_details",
        },
      },
      {
        $lookup: {
          from: "artistposts",
          localField: "_id",
          foreignField: "user_id",
          as: "artistpostsbyuser",
        },
      },

      {
        $lookup: {
          from: "disputes",
          localField: "_id",
          foreignField: "artist_id",
          as: "dispute_details",
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: "userDetails"
              }
            },
            // {
            //   $unwind: {
            //     path: '$userDetails',
            //     preserveNullAndEmptyArrays: true
            //   }
            // },
          ]
        },
      },

      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "artist_id",
          as: "booking_details",
        },
      },
      {
        $lookup: {
          from: "bank_accounts",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$user_id", "$$userId"] }],
                },
              },
            },
          ],
          as: "bank",
        },
      },

      {
        $lookup: {

          from: "headlines",
          localField: "art_form",
          foreignField: "art_form",
          //  let: { artform: "$art_form" },
          as: "headline",
        },
      },
      {
        $addFields: {
          base_location: "$base_location",
          //  {
          //   $arrayElemAt: ["$base_location", 0 ]
          // },

          communitysize: { $size: "$connections" },
          artistrequests_size: { $size: "$artistposts_details" },
          total_show: { $size: "$artistpostsbyuser" },
          statusPromotion: { $size: "$event_promotions" },
          dispute_count: { $size: "$dispute_details" },
          booking_details_count: { $size: "$booking_details" },
          offgrid: { $cond: { if: { $and: [{ $eq: ["$isAway", true] }, { $eq: ["$GOG_status", false] }] }, then: true, else: false } },
        },
      },

      { $match: condition },
      // {$match:headlineCondition},
      { $sort: sortcondition }
      // {
      //   $project:{
      //     event:0,

      //   }
      // }

    ]
    if (data.moneyearnmin) {
      params.push(
        {
          $lookup: {
            from: "artistpayouts",
            localField: "_id",
            foreignField: "artist_id",
            as: "artist_payout"
          }
        },
        {
          $unwind: "$artist_payout" // Optional: If artist_payout is an array and you want to unwind it
        },
        {
          $match: {
            "artist_payout.amount": { $gte: data.moneyearnmin, $lte: data.moneyearnmax }
          }
        },
        {
          $group: {
            _id: "$user_id", // You can use a unique identifier field here
            // Add other fields you want to preserve
            firstDocument: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$firstDocument" },
        },
      )
    }

    // if(data.start_time){
    //   params.push( {
    //     $lookup: {
    //       from: "chooselives",
    //       localField: "_id",
    //       foreignField: "user_id",
    //       as: "event",
    //       pipeline: [
    //         {
    //           $lookup: {
    //             from: "timeslots",
    //             localField: "_id",
    //             foreignField: "event_id",
    //             as: "time_slots",
    //           },
    //         },

    //         {
    //           $match: avalable,
    //         },
    //       ]
    //     }
    //   },)
    // }
    const response = await User.aggregate(params)


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
    const responses = await User.aggregate(params)
    // const responsewithoutlimit = await getItemsCustom(User, condition, undefined, 'headline', sortcondition, undefined, undefined)
    return res.status(200).json({ code: 200, responses, count: response.length });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getUserzOld = async (req, res) => {
  try {
    const data = req.body;
    const datas = req.query;
    let condition = {};
    let condition1 = {}
    if (data.status) condition.artist_status = data.status
    if (data.role == "artist") {
      // condition.current_role = "artist"
      condition.artist_status = { $in: ["approved"] }
      // condition.artist_stats = {data.status}
      condition.artist_status = { $nin: ["pending"] }
    } else {
      condition.current_role = data.role
    }
    let headline = "";
    if (data.search) {
      const searchRegex = { $regex: data.search, $options: 'i' };
      condition.$or = [
        { stage_name: searchRegex },
        { first_name: searchRegex },
        { base_location: searchRegex },
        { phone_number: searchRegex },
        { email: searchRegex },
        { headline: searchRegex },
        { art_form: searchRegex },
      ];
      headline = data.search
    }

    if (data.startRange && data.endRange) {
      condition.$and = [

        { createdAt: { $gte: new Date(moment(data.startRange).clone().startOf('day')) } },
        { createdAt: { $lte: new Date(moment(data.endRange).clone().endOf('day')) } },
      ]

    }

    if (data.curr_location) {
      condition1 = {
        $and: [
          {
            $and: [
              { isAway: false },
              { GOG_status: true },
              { GOG_city: { $in: data.curr_location } }
            ]
          },
          {
            base_location: { $in: data.base_location }
          }
        ]
      }
    }

    if (data.base_location) {
      condition.base_location = { $in: data.base_location };

    }

    if (data.postmin && data.postmax) {
      condition.total_show = {
        $gte: Number(data.postmin),
        $lte: Number(data.postmax)
      }
    }
    if (data.gigmin && data.gigmax) {
      condition.booking_details_count = {
        $gte: Number(data.gigmin),
        $lte: Number(data.gigmax)
      }
    }

    if (data.promotionmin && data.promotionmax) {
      condition.statusPromotion = {
        $gte: Number(data.promotionmin),
        $lte: Number(data.promotionmax)
      }
    }


    if (data.tribemin && data.tribemax) {
      condition.communitysize = {
        $gte: Number(data.tribemin),
        $lte: Number(data.tribemax)
      }
    }

    if (data.disputemin && data.disputemax) {
      condition.dispute_count = {
        $gte: Number(data.disputemin),
        $lte: Number(data.disputemax)
      }
    }

    console.log("data================", condition, condition1)
    if (data.artist_id) {
      condition1 = {
        _id: mongoose.Types.ObjectId(data.artist_id)
      }
    }


    if (data.promotionstatus) {
      condition.statusPromotion = { $in: data.promotionstatus }
    }


    if (data.base_location) {
      condition = {
        $expr: {
          $in: ['$base_location', data.base_location]
        }
        // { base_location: data.base_location }
      }
    }
    let conditions = {}
    if (data.art_form) {
      condition.art_form = { $in: data.art_form }
    }
    let sortcondition;
    data.sortby == 'old' ? sortcondition = { createdAt: 1 } : sortcondition = { createdAt: -1 }

    if (data.bucket) {
      query = query.populate({
        path: populateField,
        match: { headline: condition.art_form }, // Apply art_form condition for headlines
      });
    }
    const params = [
      { $match: condition1 },
      // { $match: conditions },
      {
        $lookup: {
          from: "eventpromotions",
          localField: "_id",
          foreignField: "user_id",
          as: "event_promotions",
        }
      },
      {
        $lookup: {
          from: "artistconnections",
          localField: "_id",
          foreignField: "user_id",
          as: "connections",
        },
      },

      {
        $lookup: {
          from: "artistposts",
          localField: "_id",
          foreignField: "receiver_id",
          as: "artistposts_details",
        },
      },


      {
        $lookup: {
          from: "disputes",
          localField: "_id",
          foreignField: "artist_id",
          as: "dispute_details",
        },
      },

      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "artist_id",
          as: "booking_details",
        },
      },


      {
        $lookup: {
          from: "headlines",
          let: { art_form: "$art_form" },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$art_form", "$$art_form"] },
                  { $regexMatch: { input: "$headline", regex: headline, options: "i" } }
                  ],
                },
              },
            },
          ],
          as: "headline",
        },
      },
      {
        $addFields: {
          communitysize: { $size: "$connections" },
          artistrequests_size: { $size: "$artistposts_details" },
          total_show: { $size: "$artistposts_details" },
          statusPromotion: { $size: "$event_promotions" },
          dispute_count: { $size: "$dispute_details" },
          booking_details_count: { $size: "$booking_details" }
        },
      },

      { $match: condition },
      // {$match:headlineCondition},
      { $sort: sortcondition },


    ]
    // if(data.type == "wishlist") {

    // }

    const response = await User.aggregate(params)


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
    const responses = await User.aggregate(params)
    const responsewithoutlimit = await getItemsCustom(User, condition, undefined, 'headline', sortcondition, undefined, undefined)
    return res.status(200).json({ code: 200, responses, count: response.length });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getUserArtForm = async (req, res) => {
  try {
    const data = req.query;
    const latitude = 13.77867;
    const longitude = 13.8786;
    const whereobj = [
      {
        $lookup: {
          from: 'users',
          let: { artform: "$art_form" },
          pipeline: [
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [Number(longitude), Number(latitude)],
                },
                distanceField: "distance",
                spherical: true,
                // maxDistance: 1000* 1000,
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ["$$artform",
                        {
                          $cond: {
                            if: { $gte: ["$art_form", 0] },
                            then: "$art_form",
                            else: [],
                          },
                        },
                      ]
                    },
                    { $eq: ["$isArtistProfileComplete", true] }
                  ]
                }
              }
            },
            {
              $sort: {
                distance: -1,
              },
            },
            {
              $skip: 0,
            },
            {
              $limit: 10,
            },
          ],
          as: 'users'
        }
      },
      {
        $match: {
          users: { $ne: [] }
        }
      },


    ];

    const headline_list = await Headline.aggregate(whereobj);

    return res.status(200).json({
      code: 200,
      data: headline_list
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.citieslisting = async (req, res) => {
  try {
    const data = req.query;
    let condition = {};
    if (data.role) condition.current_role = data.role;
    if (data.status) condition.artist_status = data.status
    if (data.search) {
      const searchRegex = { $regex: data.search, $options: 'i' };
      condition.$or = [
        { city: searchRegex },
      ];
    }

    const response = await getItemsCustom(City, condition, undefined, undefined, { createdAt: -1 }, data.limit, data.offset)
    const responsewithoutlimit = await City.find(condition).count();
    //.data.length
    // const responsewithoutlimit = await getItemsCustom(City, condition, undefined, undefined, { createdAt: -1 }, undefined, undefined)
    return res.status(200).json({ code: 200, response, count: responsewithoutlimit });
  } catch (error) {
    handleError(res, error);
  }
}


exports.editProfile = async (req, res) => {
  try {
    const data = req.body;
    const user_id = req.user._id
    const headlines = await updateItemThroughId(User, user_id, data);
    return res.status(200).json(headlines);
  } catch (error) {

    handleError(res, error);
  }
};

exports.editpopularcities = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.icon) {
      var media = await uploadFile({
        image_data: req.files.icon,
        path: "City",
      });
      data.icon = media.data.Location;
    }
    const headlines = await updateItemThroughId(popularCity, data.id, data);
    return res.status(200).json(headlines);
  } catch (error) {

    handleError(res, error);
  }
};

exports.addFAQ = async (req, res) => {
  try {

    const data = req.body;

    const fAQ = await createItem(Faq, data)
    return res.status(200).json({
      code: 200,
      data: fAQ
    });


  } catch (error) {
    handleError(res, error);
  }
};

exports.editFAQ = async (req, res) => {
  try {

    const data = req.body;

    const fAQ = await updateItemThroughId(Faq, data._id, data)
    return res.status(200).json({
      code: 200,
      data: fAQ
    });


  } catch (error) {
    handleError(res, error);
  }
};


exports.deleteFAQ = async (req, res) => {
  try {

    const data = req.query;

    const fAQ = await deleteItem(Faq, data._id)
    return res.status(200).json({
      code: 200,
      data: fAQ
    });


  } catch (error) {
    handleError(res, error);
  }
};

exports.getFAQ = async (req, res) => {
  try {

    const data = req.query;

    const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
    const offset = data.offset ? parseInt(data.offset) : 0;

    const whereObj = {}

    if (data.type) {
      whereObj.type = data.type;
    }

    if (data._id) {
      whereObj._id = data._id;
    }

    if (data.search) {
      whereObj.$or = [{ question: { $regex: data.search, $options: "i" } },
      { answer: { $regex: data.search, $options: "i" } }];
    }

    const fAQ = await getItemsCustom(Faq, whereObj, "", "", { createdAt: -1 }, limit, offset)
    const length = await Faq.count();
    return res.status(200).json({ count: length, data: fAQ.data });


  } catch (error) {
    handleError(res, error);
  }
};



exports.getartistWishlist = async (req, res) => {
  try {

    const data = req.query;

    const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
    const offset = data.offset ? parseInt(data.offset) : 0;

    const whereObj = {}

    if (data.user_id) {
      whereObj.user_id = mongoose.Types.ObjectId(data.user_id);
    }
    const fAQ = await getItemsCustom(artist_wishlist, whereObj, "", "artist_id", { createdAt: -1 }, limit, offset)
    return res.status(200).json(fAQ);


  } catch (error) {
    handleError(res, error);
  }
};


exports.addUSers = async (req, res) => {

  try {
    let createUser;
    const data = req.body;
    let user = await User.findOne(
      { phone_number: data.phone_number }
    );
    const existingUserWithEmail = await User.findOne({ email: data.email });
    if (existingUserWithEmail) {
      throw buildErrObject(422, "Email  already Exist");
    }

    if (user) {
      throw buildErrObject(422, "mobile number already registered");
    }

    if (!user && !existingUserWithEmail) {
      if (req.files && req.files.profile_image) {
        var image_name = await uploadFile({
          image_data: req.files.profile_image,
          path: "profileImages",
        });
        data.profile_image = image_name.data.Location;
      }
      console.log("aaaaaaaa", data.profile_image)
      createUser = await createItem(User, data);
      user = createUser.data;
      data.email ? await User.updateOne({ phone_number: data.phone_number }, { $set: { is_email_verified: true, isUserProfileComplete: true } }) : res.send({ msg: "email is not present " })
    }
    await user.save();

    res.json({ code: 200, user });

  } catch (err) {
    handleError(res, err)
  }

}


exports.deleteuser = async (req, res) => {
  try {

    const data = req.query;

    const fAQ = await deleteItem(User, data.user_id)
    return res.status(200).json({
      code: 200,
      data: fAQ
    });


  } catch (error) {
    handleError(res, error);
  }
};

exports.updateUser = async (req, res) => {
  try {

    const data = req.body;
    if (req.files && req.files.profile_image) {
      var image_name = await uploadFile({
        image_data: req.files.profile_image,
        path: "profileImages",
      });
      data.profile_image = image_name.data.Location;
    }

    const existingUserWithEmail = await User.findOne({ email: data.email });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== data.user_id) {
      return res.status(400).json({
        code: 400,
        error: 'Email is already in use by another user.',
      });
    } else {
      console.log("data================", data)
      // data.pan
      //  const updateuser = await User.updateOne({_id:mongoose.Types.ObjectId(data.user_id)},{$set:data})
      const item = await updateItemThroughId(User, data.user_id, req.body);
      return res.status(200).json({
        code: 200,
        data: item
        // {
        //   data:updateuser,
        //   success: true,
        //   message: "ITEM UPDATED SUCCESSFULLY"
        // }
      });

    }

  } catch (error) {
    handleError(res, error);
  }
};



// location based walkthrough 
exports.addWalkThroughLocation = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "WalkThrough",
      });
      data.image = media.data.Location;
    }

    const walk_through = await createItem(WalkThroughlocation, data);
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getWalkThroughLocation = async (req, res) => {
  try {

    const data = req.query;

    const whereObj = {}

    if (data._id) {
      whereObj._id = data._id
    }

    if (data.search) {
      whereObj.$or = [
        { title: { $regex: data.search, $options: "i" } },
        { content: { $regex: data.search, $options: "i" } },
      ];
    }

    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;

    const walk_through = await getItemsCustom(WalkThroughlocation, whereObj, "", "", { createdAt: -1 }, limit, offset);
    walk_through.count = await WalkThroughlocation.find(whereObj).count();

    return res.status(200).json({
      code: 200,
      data: data._id ? walk_through.data[0] : walk_through
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteWalkThroughlocation = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(WalkThroughlocation, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateWalkThroughLocation = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "WalkThrough",
      });
      data.image = media.data.Location;
    }

    const walk_through = await updateItemThroughId(WalkThroughlocation, data._id, data);
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getartistPost = async (req, res) => {
  try {

    const data = req.query;

    const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
    const offset = data.offset ? parseInt(data.offset) : 0;

    let whereObj = {}
    if (data.search) {
      whereObj.$or = [
        { location: { $regex: data.search, $options: "i" } }, // Searching by username (case-insensitive)
        { description: { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive)
      ];
    }
    if (data.user_id) {
      whereObj = {
        $expr: {
          $and: [{ $eq: ["$user_id", mongoose.Types.ObjectId(data.user_id)] }],
        },
      }
    }

    if (data.user_id && data.search) {
      whereObj = {
        user_id: mongoose.Types.ObjectId(data.user_id),
        $or: [
          { location: { $regex: data.search, $options: "i" } },
          { description: { $regex: data.search, $options: "i" } }
        ]
      };
    }

    if (data._id) {
      whereObj = {
        $expr: {
          $and: [{ $eq: ["$_id", mongoose.Types.ObjectId(data._id)] }],
        },
      }
      // whereObj._id = data._id;
    }
    const users = await artist_post.aggregate([
      {
        $match: whereObj
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id",
        },
      },

      { $unwind: { path: "$user_id", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "postmedias",
          localField: "_id",
          foreignField: "post_id",
          as: "post_media",
        },
      },
      // {
      //   $lookup: {
      //     from: "artistrequests",
      //     let: { sender_id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
      //             { $eq: ["$type", "Collab"] }],
      //           },
      //         },
      //       },
      //       // {
      //       //   $addFields: {
      //       //     collab_status: {
      //       //       $cond: {
      //       //         if: { $eq: ["$status", "Pending"] },
      //       //         then: "Pending",
      //       //         else: "approved",
      //       //       },
      //       //     },
      //       //   },
      //       // },
      //     ],
      //     as: "collab_data",
      //   },
      // },

      // {
      //   $lookup: {
      //     from: "artistrequests",
      //     let: { sender_id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
      //             { $eq: ["$type", "Jam"] }],
      //           },
      //         },
      //       },

      //       // {
      //       //   $addFields: {
      //       //     jam_status: {
      //       //       $cond: {
      //       //         if: { $eq: ["$status", "Pending"] },
      //       //         then: "Pending",
      //       //         else: "approved",
      //       //       },
      //       //     },
      //       //   },
      //       // }
      //     ],
      //     as: "Jam_data",
      //   },
      // },

      // {
      //   $lookup: {
      //     from: "artistrequests",
      //     let: { sender_id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
      //             { $eq: ["$type", "Vibe"] }],
      //           },
      //         },
      //       },


      //       // {
      //       //   $addFields: {
      //       //     vibe_status: {
      //       //       $cond: {
      //       //         if: { $eq: ["$status", "Pending"] },
      //       //         then: "Pending",
      //       //         else: "approved",
      //       //       },
      //       //     },
      //       //   },
      //       // }
      //     ],
      //     as: "Vibe_data",
      //   },
      // },


      // {
      //   $addFields: {
      //     // artistpost_size: { $size: "$data" },
      //     collab_count: { $size: "$collab_data" },
      //     Jam_count: { $size: "$Jam_data" },
      //     invite_count: { $size: "$Vibe_data" },
      //     // createdAt: "$artist_details.createdAt"
      //   },
      // },
      //  {
      //    $match:whereObj
      //  },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]);
    const fAQ = await getItemsCustom(artist_post, whereObj, "", "user_id", { createdAt: -1 }, limit, offset)
    return res.status(200).json(data._id ? users[0] : users);


  } catch (error) {
    handleError(res, error);
  }
};



exports.getartistPostacctoId = async (req, res) => {
  try {

    const data = req.query;

    const limit = data.limit ? parseInt(data.limit) : Number.MAX_SAFE_INTEGER;
    const offset = data.offset ? parseInt(data.offset) : 0;

    let whereObj = {}

    if (data.user_id) {
      whereObj = {
        $expr: {
          $and: [{ $eq: ["$user_id", mongoose.Types.ObjectId(data.user_id)] }],
        },
      }
    }

    if (data._id) {
      whereObj = {
        $expr: {
          $and: [{ $eq: ["$_id", mongoose.Types.ObjectId(data._id)] }],
        },
      }
      // whereObj._id = data._id;
    }
    const users = await artist_post.aggregate([
      {
        $match: whereObj
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id",
        },
      },

      { $unwind: { path: "$user_id", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "postmedias",
          localField: "_id",
          foreignField: "post_id",
          as: "post_media",
        },
      },
      {
        $addFields: {
          collab_status: "$user_id._id"
        },
      },
      {
        $lookup: {
          from: "artistrequests",
          let: { sender_id: "$collab_status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
                  { $eq: ["$type", "Collab"] }],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "sender_id",
                foreignField: "_id",
                as: "sender_details",
              },
            },
            { $unwind: { path: "$sender_details", preserveNullAndEmptyArrays: true } },
            {
              $addFields: {
                artistcollab_status: {
                  $cond: {
                    if: { $eq: ["$status", "Pending"] },
                    then: "Pending",
                    else: "approved",
                  },
                },
              },
            },

            {
              $lookup: {
                from: "artistconnections",
                localField: "sender_id",
                foreignField: "_id",
                as: "sender_friend_details",
              },
            },

            {
              $addFields: {
                sender_friend_details_list: "$sender_friend_details.connection_id"
              },
            },
            {
              $lookup: {
                from: "artistconnections",
                localField: "receiver_id",
                foreignField: "_id",
                as: "reciver_friend_details",
              },
            },

            {
              $addFields: {
                reciver_friend_details_list: "$reciver_friend_details.connection_id"
              },
            },


            {
              $addFields: {
                commonToBoth: { $setIntersection: ["$sender_friend_details_list", "$reciver_friend_details_list"] }
              },
            },

            {
              $addFields: {
                commonToBothcount: { $size: "$commonToBoth" }
              },
            },
            // commonToBoth: { $setIntersection: [ "$flowerFieldA", "$flowerFieldB" ] }

          ],
          as: "collab_data",
        },
      },

      {
        $lookup: {
          from: "artistrequests",
          let: { sender_id: "$collab_status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
                  { $eq: ["$type", "Jam"] }],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "sender_id",
                foreignField: "_id",
                as: "sender_details",
              },
            },
            { $unwind: { path: "$sender_details", preserveNullAndEmptyArrays: true } },
            {
              $addFields: {
                jam_status: {
                  $cond: {
                    if: { $eq: ["$status", "Pending"] },
                    then: "Pending",
                    else: "approved",
                  },
                },
              },
            },

            {
              $lookup: {
                from: "artistconnections",
                localField: "sender_id",
                foreignField: "_id",
                as: "sender_friend_details",
              },
            },

            {
              $addFields: {
                sender_friend_details_list: "$sender_friend_details.connection_id"
              },
            },
            {
              $lookup: {
                from: "artistconnections",
                localField: "receiver_id",
                foreignField: "_id",
                as: "reciver_friend_details",
              },
            },

            {
              $addFields: {
                reciver_friend_details_list: "$reciver_friend_details.connection_id"
              },
            },


            {
              $addFields: {
                commonToBoth: { $setIntersection: ["$sender_friend_details_list", "$reciver_friend_details_list"] }
              },
            },



            {
              $addFields: {
                commonToBothcount: { $size: "$commonToBoth" }
              },
            },


          ],
          as: "Jam_data",
        },
      },

      {
        $lookup: {
          from: "artistrequests",
          let: { sender_id: "$collab_status" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
                  { $eq: ["$type", "Vibe"] }],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "sender_id",
                foreignField: "_id",
                as: "sender_details",
              },
            },
            { $unwind: { path: "$sender_details", preserveNullAndEmptyArrays: true } },
            {
              $addFields: {
                vibe_status: {
                  $cond: {
                    if: { $eq: ["$status", "Pending"] },
                    then: "Pending",
                    else: "approved",
                  },
                },
              },
            },

            {
              $lookup: {
                from: "artistconnections",
                localField: "sender_id",
                foreignField: "_id",
                as: "sender_friend_details",
              },
            },

            {
              $addFields: {
                sender_friend_details_list: "$sender_friend_details.connection_id"
              },
            },
            {
              $lookup: {
                from: "artistconnections",
                localField: "receiver_id",
                foreignField: "_id",
                as: "reciver_friend_details",
              },
            },

            {
              $addFields: {
                reciver_friend_details_list: "$reciver_friend_details.connection_id"
              },
            },


            {
              $addFields: {
                commonToBoth: { $setIntersection: ["$sender_friend_details_list", "$reciver_friend_details_list"] }
              },
            },

            {
              $addFields: {
                commonToBothcount: { $size: "$commonToBoth" }
              },
            },
          ],
          as: "Vibe_data",
        },
      },


      {
        $addFields: {
          // artistpost_size: { $size: "$data" },
          collab_count: { $size: "$collab_data" },
          Jam_count: { $size: "$Jam_data" },
          invite_count: { $size: "$Vibe_data" },
          // createdAt: "$artist_details.createdAt"
        },
      },
      //  {
      //    $match:whereObj
      //  },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]);

    const fAQ = await getItemsCustom(artist_post, whereObj, "", "user_id", { createdAt: -1 }, limit, offset)
    return res.status(200).json(data._id ? users[0] : users);


  } catch (error) {
    handleError(res, error);
  }
};
exports.getartistListaccToPost = async (req, res) => {
  try {

    const data = req.body;

    let whereObj = {}

    let sortBy;

    if (data.sortBy == "new") {
      sortBy = { createdAt: -1 }
    } else if (data.sortBy == "old") {
      sortBy = { createdAt: 1 }
    } else {
      sortBy = { createdAt: -1 }
    }


    if (data.search) {
      whereObj.$or = [
        { "artist_details.first_name": { $regex: data.search, $options: "i" } }, // Searching by username (case-insensitive)
        { "artist_details.last_name": { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive)
        { "artist_details.email": { $regex: data.search, $options: "i" } }, // Searching by username (case-insensitive)
        { "artist_details.phone_number": { $regex: data.search, $options: "i" } }, // Searching by username (case-insensitive)
        { "artist_details.stage_name": { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive)
        { "artist_details.base_location": { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive)
        { "artist_details.phone_no": { $regex: data.search, $options: "i" } },
        { "description": { $regex: data.search, $options: "i" } }// Searching by username (case-insensitive)
      ];
    }

    if (data.end && data.start) {
      whereObj.createdAt = {
        $gte: new Date(moment(data.start).add(1, 'days').startOf('day')),
        $lte: new Date(moment(data.end).add(1, 'days').endOf('day'))
      }
    }
    let condition = {}
    if (data.base_location) {
      whereObj.$or = [
        { "artist_details.base_location": { $in: data.base_location } }, // Searching by name (case-insensitive)
      ];
    }
    if (data.artistName) {
      const newarr = data.artistName.map((x) => mongoose.Types.ObjectId(x))
      condition.user_id = { $in: newarr }
    }
    if (data.post_countmin && data.post_countmax) {
      whereObj.artistpost_size = {
        $gte: Number(data.post_countmin),
        $lte: Number(data.post_countmax)
      }
    }



    if (data.collab_countmax && data.collab_countmin) {
      whereObj.collab_count = {
        $gte: Number(data.collab_countmin),
        $lte: Number(data.collab_countmax)
      }
    }
    if (data.Jam_countmax && data.Jam_countmin) {
      whereObj.Jam_count = {
        $gte: Number(data.Jam_countmin),
        $lte: Number(data.Jam_countmax)
      }
    }

    const limit = data.limit ? parseInt(data.limit) : 100;
    const offset = data.offset ? parseInt(data.offset) : 0;
    const params = [
      { $match: condition },
      {
        $group: {
          _id: "$user_id",
          data: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "artist_details",
        },
      },

      { $unwind: { path: "$artist_details", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "artistrequests",
          let: { sender_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
                  { $eq: ["$type", "Collab"] }],
                },
              },
            },
            {
              $addFields: {
                collab_status: {
                  $cond: {
                    if: { $eq: ["$status", "Pending"] },
                    then: "Pending",
                    else: "approved",
                  },
                },
              },
            },
          ],
          as: "collab_data",
        },
      },

      // {
      //   $lookup: {
      //     from: "artistconnections",
      //     let: { sender_id: "$collab_data.post_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$_id", "$$sender_id"] }],
      //           },
      //         },
      //       },
      //       {
      //         $lookup: {
      //           from: "users",
      //           localField: "user_id",
      //           foreignField: "_id",
      //           as: "users_details",
      //         },
      //       },
      //     ],
      //     as: "collab_connection",
      //   },
      // },


      // {
      //   $lookup: {
      //     from: "artistconnections",
      //     let: { sender_id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$_id", "$$sender_id"] }],
      //           },
      //         },
      //       },
      //       // {
      //       //   $lookup: {
      //       //     from: "users",
      //       //     localField: "user_id",
      //       //     foreignField: "_id",
      //       //     as: "artist_details",
      //       //   },
      //       // },
      //     ],
      //     as: "collab_req_connection",
      //   },
      // },


      {
        $lookup: {
          from: "artistrequests",
          let: { sender_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
                  { $eq: ["$type", "Jam"] }],
                },
              },
            },

            {
              $addFields: {
                jam_status: {
                  $cond: {
                    if: { $eq: ["$status", "Pending"] },
                    then: "Pending",
                    else: "approved",
                  },
                },
              },
            }
          ],
          as: "Jam_data",
        },
      },


      {
        $lookup: {
          from: "artistrequests",
          let: { sender_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$receiver_id", "$$sender_id"] },
                  { $eq: ["$type", "Vibe"] }],
                },
              },
            },


            {
              $addFields: {
                vibe_status: {
                  $cond: {
                    if: { $eq: ["$status", "Pending"] },
                    then: "Pending",
                    else: "approved",
                  },
                },
              },
            }
          ],
          as: "Vibe_data",
        },
      },


      {
        $addFields: {
          artistpost_size: { $size: "$data" },
          collab_count: { $size: "$collab_data" },
          Jam_count: { $size: "$Jam_data" },
          invite_count: { $size: "$Vibe_data" },
          createdAt: "$artist_details.createdAt"
        },
      },
      {
        $match: whereObj
      },
      {
        $sort: sortBy
      },

    ]
    const count = await artist_post.aggregate(params);
    let lengthofuser = count.length
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
    const users = await artist_post.aggregate(params);
    return res.status(200).json({ users, lengthofuser });


  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteartistPosts = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(artist_post, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.uploadMultipleProjectImgs = async (req, res) => {
  try {
    let multipleImgs = [];
    let singleImg = [];

    const path = req.body.path;
    if (req.files && Array.isArray(req.files.images)) {
      for await (const imgData of req.files.images) {
        const data = await uploadFile({
          image_data: imgData,
          path: `${path}`,
        });
        multipleImgs.push(`${data.data.Location}`
        );

        // multipleImgs.push(
        //   `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data}`
        // );
      }
    } else if (req.files && !Array.isArray(req.files.images)) {
      var data = await uploadFile({
        image_data: req.files.images,
        path: `${path}`,
      });

      // console.log("media_type", data.fileName, data.media_type);
      // const split = data.media_type.split("/");
      // const media_type = split[0];

      singleImg.push(
        `${data.data.Location}`
      );
    }
    res.status(200).json({
      code: 200,
      images:
        req.files && Array.isArray(req.files.images) ? multipleImgs : singleImg,
    });
  } catch (error) {
    handleError(res, error);
  }
};


// add  Post 
exports.addpost = async (req, res) => {
  try {
    const data = req.body;
    const multipleImgs = []
    console.log("data=======================", data)
    // if (req.files && Array.isArray(req.files.media)) {
    //   for await (const imgData of req.files.media) {
    //     const data = await uploadFile({
    //       image_data: imgData,
    //       path: "Addpost",
    //     });



    //     multipleImgs.push(`${data.data.Location}`
    //     );

    //     // multipleImgs.push(
    //     //   `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data}`
    //     // );
    //   }
    // } else {
    //   const data = await uploadFile({
    //     image_data: req.files.media,
    //     path: "Addpost",
    //   });
    //   multipleImgs.push(`${data.data.Location}`
    //   );
    // }


    // for (let i = 0; i < data.media.length; i++) {
    //   const element = data.media[i];
    //   const datas = await uploadFile({
    //     image_data: element,
    //     path: "Addpost",
    //   });

    //   multipleImgs.push(`${datas.data.Location}`
    //   );
    // }
    // data.media = multipleImgs;


    data.tags = JSON.parse(data.tags)
    data.post_type = "admin"
    // console.log("data==========", data.media)
    if (data.latitude && data.longitude) {
      data.location_coordinates = {};
      data.location_coordinates.type = "Point";
      data.location_coordinates.coordinates = [
        Number(data.longitude),
        Number(data.latitude),
      ];


    }

    data.delete_post_date = new Date(moment(new Date()).add(1, 'days'))
    console.log("date==============", new Date(), new Date(moment(new Date()).add(1, 'days')))
    // if(req.files.media)
    // if (req.files && req.files.media) {
    //   var media = await uploadFile({
    //     image_data: req.files.media,
    //     path: "Addpost",
    //   });
    //   console.log('media-------->', media);
    // }

    data.media_admin = data.media

    const walk_through = await createItem(artist_post, data);


    // data.media_for_user
    // for (let i = 0; i < multipleImgs.length; i++) {
    //   const element = multipleImgs[i];
    //   const post = mongoose.Types.ObjectId(walk_through.data._id)
    //   const datas = {
    //     post_id:post,
    //     thumbnail:element,
    //     media:element,
    //   }


    //   const walk_throughs = await createItem(PostMedia, datas);
    // }
    // const dataArray = JSON.parse(data.media_foruser);

    // Log the resulting array
    // console.log("t-------------------",dataArray);

    for (const x of data.media_foruser) {
      const post = mongoose.Types.ObjectId(walk_through.data._id)
      // const uploadMedia= await uploadFile({
      //   image_data: x.thumbnail,
      //   path: "Addpost",
      // });

      // const uploadThumbnail = await uploadFile({
      //   image_data: x.media,
      //   path: "Addpost",
      // });
      const datas = {
        post_id: post,
        thumbnail: x.thumbnail,
        media: x.media,
        media_type: x.media_type
      }


      const walk_throughs = await createItem(PostMedia, datas);

    }


    // if (data.media) {
    //   for (let i = 0; i < data.media.length; i++) {
    //     let image = data.media[i];
    //     let crObj = {
    //       post_id: post.data._id,
    //       media: image.media,
    //     };

    //     if (image.thumbnail) {
    //       crObj.thumbnail = image.thumbnail;
    //     }

    //     if (image.media_type) {
    //       crObj.media_type = image.media_type;
    //     }

    //     await createItem(PostMedia, crObj);
    //   }
    // }
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getaddPost = async (req, res) => {
  try {

    const data = req.body
    // { ...req.query, ...req.body };
    let whereObj = { post_type: "admin" }

    if (data._id) {
      whereObj._id = data._id
    }

    if (data.type) {
      whereObj.type = data.type
    }
    if (data.post_status == "all") {

      whereObj.$or = [
        { post_status: "active" },
        { post_status: "inactive" },
      ];
    } else if (data.hasOwnProperty("post_status")) {
      whereObj.post_status = data.post_status
    }
    console.log("error")

    if (data.search) {
      whereObj.$or = [
        { title: { $regex: data.search, $options: "i" } },
        { content: { $regex: data.search, $options: "i" } },
      ];
    }
    if (data.base_location) {
      whereObj.location = {
        $in: data.base_location
      }
    }



    if (data.tags) {
      whereObj.tags = {
        $in: data.tags
      }
    }

    if (data.startRange && data.endRange) {

      whereObj.createdAt = {
        $expr: {
          $and: [
            { $gte: ["$createdAt", new Date(moment(data.startRange).add(1, 'days').startOf('day')),] },
            { $lte: ["$createdAt", new Date(moment(data.endRange).add(1, 'days').endOf('day'))] }
          ]
        }
      }
    }


    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;
    // const select = { name: 1 }
    // const walk_through = await getItemsCustom(WalkThrough_GOG, whereObj, "", "", { createdAt: -1 }, limit, offset);
    // const datas = await addPost.find({type:data.type})
    const walk_through = await getItemsCustom(artist_post, whereObj, "", "", { createdAt: -1 }, limit, offset);
    // const dataNew = await addPost.findOne(whereObj);
    const count = await artist_post.find(whereObj).count();
    const active = await artist_post.find({ type: data.type, post_status: "active" }).count()
    const inactive = await artist_post.find({ type: data.type, post_status: "inactive" }).count()

    return res.status(200).json({
      code: 200,
      data: data._id ? walk_through.data[0] : walk_through,
      count: count,
      inactive: inactive,
      active: active
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.deleteaddPost = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(artist_post, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateaddPost = async (req, res) => {
  try {
    const data = req.body;
    // const multipleImgs = []
    // if (req.files && Array.isArray(req.files.media)) {
    //   for await (const imgData of req.files.media) {
    //     const data = await uploadFile({
    //       image_data: imgData,
    //       path: "Addpost",
    //     });
    //     multipleImgs.push(`${data.data.Location}`
    //     );

    //     // multipleImgs.push(ddddddddd
    //     //   `https://developers.promaticstechnologies.com/presshop_rest_apis/public/${path}/${data}`
    //     // );
    //   }
    // }else{
    //   const data = await uploadFile({
    //     image_data: req.files.media,
    //     path: "Addpost",
    //   });
    //   multipleImgs.push(`${data.data.Location}`
    //   );
    // }
    // data.media = multipleImgs;


    // data.tags = JSON.parse(data.tags)
    // data.media = JSON.parse(data.media)

    await PostMedia.deleteMany({ post_id: mongoose.Types.ObjectId(data._id) });
    for (const x of data.media_foruser) {
      const post = data._id
      // const uploadMedia= await uploadFile({
      //   image_data: x.thumbnail,
      //   path: "Addpost",
      // });

      // const uploadThumbnail = await uploadFile({
      //   image_data: x.media,
      //   path: "Addpost",
      // });
      const datas = {
        post_id: post,
        thumbnail: x.thumbnail,
        media: x.media,
        media_type: x.media_type
      }


      const walk_throughs = await createItem(PostMedia, datas);

    }
    const walk_through = await updateItemThroughId(artist_post, data._id, data);
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};

// findChildren(parentId);
async function findChildrenRecursive(categoryIds) {

  const children = await ArtCategory.find({ _id: { $in: categoryIds } })
  console.log('children----->', children);
  if (children.length === 0) {
    return [];
  }

  const childIds = children.map((child) => child.subCategories).flat();
  const allChildren = [...children];

  const grandchildren = await findChildrenRecursive(childIds);
  allChildren.push(...grandchildren);

  return allChildren;
}


exports.getcategory = async (req, res) => {
  try {
    const data = req.query;
    let categories, categoryId
    if (data.type == "parent") {
      categories = await ArtCategory.find({ parent_id: data.parent_id })
    } else {
      categories = await ArtCategory.findOne({ _id: data.parent_id })
      // categoryId = ObjectId("64d2287a27eaf9ffe5392e87");
    }
    const subCategories = await findChildrenRecursive(categories.subCategories);
    // const allCategories = findChildren(data.parent_id, categories);
    console.log("All children of subcategories:", subCategories);
    return res.status(200).json(subCategories);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getcategoryList = async (req, res) => {
  try {
    const data = req.query;
    let condition = {};
    let select = {}
    let categories
    // select = { name: 1 }
    if (data._id) {
      condition = {
        _id: data._id,
        status: "approved"
      };
      select = { name: 1 }
    }


    if (data.search) {
      condition.$or = [
        { name: { $regex: data.search, $options: "i" }, status: "approved" },
        // { content: { $regex: data.search, $options: "i" } },
      ];
    }


    categories = await ArtCategory.find(condition).populate("parent").select(select)




    return res.status(200).json(categories);
  } catch (error) {

    handleError(res, error);
  }
};


// exports.getcategoryList = async (req, res) => {
//   try {
//     const data = req.query;
//     let categories
//     categories = await ArtCategory.find({})

//     return res.status(200).json(categories);
//   } catch (error) {

//     handleError(res, error);
//   }
// };


exports.getUsersbyid = async (req, res) => {
  try {
    let data = req.query;
    const item = await User.findOne({ _id: data.artist_id });

    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};



exports.downloadContent = async (req, res) => {
  try {
    const key = `${req.query.path}/${req.query.fileName}`;

    console.log("filename==========", key);

    const s3 = new AWS.S3({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      region: REGION,
    });
    const s3Stream = s3.getObject({ Bucket: Bucket, Key: key }).createReadStream();

    // Set response headers
    res.setHeader('Content-Disposition', `attachment; filename="${req.query.fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream'); // You might need to adjust the content type based on your file type

    s3Stream.pipe(res);

    s3Stream.on("error", (err) => {
      console.log(err);
      res.status(500).send('Error downloading file.');
    });

    s3Stream.on("close", () => {
      console.log("Stream closed now");
    });
  } catch (error) {
    handleError(res, error);
  }
}







// gog Based walkthrough  
exports.addGOGWalkThrough = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "WalkThrough",
      });
      data.image = media.data.Location;
    }

    const walk_through = await createItem(WalkThrough_GOG, data);
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getGOGWalkThrough = async (req, res) => {
  try {

    const data = req.query;

    const whereObj = {}

    if (data._id) {
      whereObj._id = data._id
    }

    if (data.search) {
      whereObj.$or = [
        { title: { $regex: data.search, $options: "i" } },
        { content: { $regex: data.search, $options: "i" } },
      ];
    }

    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;

    const walk_through = await getItemsCustom(WalkThrough_GOG, whereObj, "", "", { createdAt: -1 }, limit, offset);
    walk_through.count = await WalkThrough_GOG.find(whereObj).count();

    return res.status(200).json({
      code: 200,
      data: data._id ? walk_through.data[0] : walk_through
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteGOGWalkThrough = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(WalkThrough_GOG, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateGOGWalkThrough = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "WalkThrough",
      });
      data.image = media.data.Location;
    }

    const walk_through = await updateItemThroughId(WalkThrough_GOG, data._id, data);
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};

exports.getWishList = async (req, res) => {
  try {
    let find = {}
    let user;
    if (req.query.artist_id) {
      find = {
        artist_id: req.query.artist_id
      }
    }



    if (req.query.search) {
      find.$or = [
        { "artist_id.first_name": { $regex: req.query.search, $options: "i" } }, // Searching by username (case-insensitive)
        { "artist_id.last_name": { $regex: req.query.search, $options: "i" } }, // Searching by name (case-insensitive)
      ];
    }

    const params = [
      {
        $lookup: {
          from: "users",
          localField: "artist_id",
          foreignField: "_id",
          as: "artist_id",
        },
      },
      { $unwind: { path: "$artist_id", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $and: [
            find, // Your existing find condition
            {
              $or: [
                { artist_id: { $exists: true } }, // Documents with non-null artist_id
                // { artist_id: { $exists: false } },   // Documents without artist (null artist_id)
              ],
            },
          ],
        },
      },
      // Find top-level categories (categories without a parent)


    ]


    const count = await artist_wishlist.aggregate(params);

    const getWishlisted = await artist_wishlist.find(find).populate("artist_id user_id");
    user = await getItemsCustom(User, find, "", "", undefined, undefined, undefined);
    const uniqueWishlist = [...new Set(count)];
    return res.status(200).json({ count: uniqueWishlist.length, data: count });

  } catch (error) {
    handleError(res, error);
  }
}


//   =========================    get steps ====================================

exports.getSteps = async (req, res) => {
  try {

    const data = req.query;

    const whereObj = {}

    if (data.type) {
      whereObj.type = data.type
    }



    const limit = data.limit ? data.limit : 100;
    const offset = data.offset ? data.offset : 0;

    const walk_through = await getItemsCustom(Steps, whereObj, "", "", { createdAt: -1 }, limit, offset);

    return res.status(200).json({
      code: 200,
      data: data._id ? walk_through.data[0] : walk_through.data
    });
  } catch (error) {
    handleError(res, error);
  }
};



exports.updateSteps = async (req, res) => {
  try {
    const data = req.body;
    let walk_through;
    for (let i = 0, j = 0, k = 0; i < data.title.length, j < data.desc.length, k < data._id.length; i++, j++, k++) {
      const element = data.title[i];
      const element2 = data.desc[j];
      const element3 = data._id[k]
      const arr = {
        title: element,
        desc: element2
      }
      walk_through = await updateItemThroughId(Steps, element3, arr);
    }
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};



// exports.sendNotification = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log('user_id', req.user._id);
//     for (let i = 0; i < req.body.user_id.length; i++) {
//       const element = req.body.user_id[i];
//       const finduserispromotional = await User.findOne({ _id: element, promotional_notification: true })
//       if (finduserispromotional) {

//         const notificationObj = {
//           sender_id: mongoose.Types.ObjectId(req.user._id),
//           receiver_id: finduserispromotional._id,// mongoose.Types.ObjectId(req.body.user_id),
//           type: "AdminNotification",
//           title: req.body.title,
//           body: req.body.body,
//           is_admin: true
//         }

//         const resp = await _sendAdminNotification(notificationObj);
//         console.log("resp", resp);
//       } else {
//         return res.status(400).json({
//           code: 400,
//           data: "No eligible users found with Promotional notifications enabled",
//         });
//       }
//     }
//     // const notificationObj = {
//     //   sender_id: mongoose.Types.ObjectId(req.user._id),
//     //   receiver_id: { $in: (req.body.user_id) },// mongoose.Types.ObjectId(req.body.user_id),
//     //   type: "AdminNotification",
//     //   title: req.body.title,
//     //   body: req.body.body,
//     //   is_admin: true
//     // }

//     // console.log(notiObj);
//     // const resp = await _sendAdminNotification(notificationObj);
//     // console.log("resp", resp);

//     return res.status(200).json({
//       code: 200,
//       data: "sent",
//     });
//     // if (resp.length > 0) {

//     //   return res.status(200).json({
//     //     code: 200,
//     //     data: "sent",
//     //   });
//     // } else {
//     //   return res.status(400).json({
//     //     code: 400,
//     //     error: "error",
//     //   });
//     // }
//   } catch (error) {
//     handleError(res, error);
//   }
// };





exports.sendEmailtoUser = async (req, res) => {
  try {
    const data = req.body;
    const locale = req.getLocale()
    for (let index = 0; index < req.body.user_id.length; index++) {
      const element = req.body.user_id[index];
      const finduserispromotional = await User.findOne({ email: element, promotional_notification: true })
      if (finduserispromotional) {

        // const notificationObj = {
        //   sender_id: mongoose.Types.ObjectId(req.user._id),
        //   receiver_id: finduserispromotional._id,// mongoose.Types.ObjectId(req.body.user_id),
        //   type: "AdminNotification",
        //   title: req.body.title,
        //   body: req.body.body,
        //   is_admin: true
        // }

        // const resp = await _sendAdminNotification(notificationObj);
        // console.log("resp", resp);

        const emailObj = {
          to: finduserispromotional.email,
          verification_code: data.subject,
          name: data.content,
        };
        await emailer.sendEmail(locale, emailObj, "admin");
      } else {
        return res.status(400).json({
          code: 400,
          data: "No eligible users found with Promotional notifications enabled",
        });
      }


      // const emailObj = {
      //   to: element,
      //   verification_code: data.subject,
      //   name: data.content,
      // };
      // await emailer.sendEmail(locale, emailObj, "admin");
    }




    // const item = await emailer.sendForgetPasswordEmail(locale, user, 'verifyEmail

    return res.status(200).json({
      code: 200,
      data: "sent",
    });

  } catch (error) {
    handleError(res, error);
  }
};
//   slides ==================================
exports.addSlides = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "Slides",
      });
      data.media = media.data.Location;
    }

    const slides_data = await createItem(Slides, data);
    return res.status(200).json(slides_data);
  } catch (error) {

    handleError(res, error);
  }
};

exports.getSlides = async (req, res) => {
  try {

    const data = req.query;
    let sortcoindition;
    let whereObj = {}

    if (data.type == "web") {
      whereObj.type = "web";
    } else if (data.type == "artist") {
      whereObj.type = "artist";
    }
    else {
      whereObj.type = "app";
    }


    if (data._id) {
      // whereObj._id = data._id
      const byid = await Slides.findById(data._id)
      return res.status(200).json({
        code: 200,
        data: byid
      });
    } else {
      if (data.sort == "old") {
        sortcoindition = { createdAt: 1 }
      } else {
        sortcoindition = { createdAt: -1 }
      }
      if (data.search) {
        whereObj.$or = [
          { title: { $regex: data.search, $options: "i" } },
          { content: { $regex: data.search, $options: "i" } },
        ];
      }
      if (data.type == "web") {
        whereObj.type = "web";
      } else if (data.type == "artist") {
        whereObj.type = "artist";
      } else {
        whereObj.type = "app";
      }

      const limit = data.limit ? data.limit : 100;
      const offset = data.offset ? data.offset : 0;

      let slides_data = await getItemsCustom(Slides, whereObj, "", "", sortcoindition, limit, offset);
      slides_data.count = await Slides.find(whereObj).count();
      return res.status(200).json({
        code: 200,
        data: slides_data
      });
    }


    // return res.status(200).json({
    //   code: 200,
    //   data:slides_data
    // });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteSlides = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(Slides, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateSlides = async (req, res) => {
  try {
    const data = req.body;
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "Slides",
      });
      data.media = media.data.Location;
    }

    const slide_data = await updateItemThroughId(Slides, data._id, data);
    return res.status(200).json(slide_data);
  } catch (error) {

    handleError(res, error);
  }
};





//  ==========================   coupon



exports.addcoupon = async (req, res) => {
  try {
    const data = req.body;


    const slides_data = await createItem(coupon, data);
    return res.status(200).json(slides_data);
  } catch (error) {

    handleError(res, error);
  }
};

exports.getcoupon = async (req, res) => {
  try {

    const data = req.query;
    let sortcoindition;
    let whereObj = {}

    if (data.type == "web") {
      whereObj.type = "web";
    } else {
      whereObj.type = "app";
    }


    if (data._id) {
      // whereObj._id = data._id
      const byid = await coupon.findById(data._id)
      return res.status(200).json({
        code: 200,
        data: byid
      });
    } else {
      if (data.sort == "old") {
        sortcoindition = { createdAt: 1 }
      } else {
        sortcoindition = { createdAt: -1 }
      }
      if (data.search) {
        whereObj.$or = [
          { coupon_name: { $regex: data.search, $options: "i" } },
          // { description: { $regex: data.search, $options: "i" } },
        ];
      }
      if (data.type == "web") {
        whereObj.type = "web";
      } else {
        whereObj.type = "app";
      }

      const limit = data.limit ? data.limit : 100;
      const offset = data.offset ? data.offset : 0;

      let slides_data = await getItemsCustom(coupon, whereObj, "", "", sortcoindition, limit, offset);
      slides_data.count = await coupon.find(whereObj).count();
      return res.status(200).json({
        code: 200,
        data: slides_data
      });
    }


    // return res.status(200).json({
    //   code: 200,
    //   data:slides_data
    // });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteCoupon = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(coupon, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const data = req.body;
    // if (req.files && req.files.media) {
    //   var media = await uploadFile({
    //     image_data: req.files.media,
    //     path: "Slides",
    //   });
    //   data.media = media.data.Location;
    // }

    const slide_data = await updateItemThroughId(coupon, data._id, data);
    return res.status(200).json(slide_data);
  } catch (error) {

    handleError(res, error);
  }
};





exports.sendPustNotificationtoHopper = async (req, res) => {
  try {
    const data = req.body;
    // data.sender_id = req.user._id
    const notificationObj = {
      sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
      receiver_id: mongoose.Types.ObjectId(req.body.user_id),
      type: "user_to_admin",
      title: data.title,
      body: data.message,
      is_admin: true
    }

    await _sendAdminNotification(notificationObj);

    // await  sendnoti(notiObj);



    res.json({
      code: 200,
      msg: "sent",
    });
  } catch (err) {
    utils.handleError(res, err);
  }
};



exports.createRoom = async (req, res) => {
  try {
    // req.body.room_id = uuid.v4();
    req.body.sender_id = req.user._id;
    const details = await db.createRoom(Room, req.body);
    res.status(200).json({
      details,
      code: 200,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};



exports.getroom = async (req, res) => {
  try {
    const details = await Room.aggregate([
      {
        $match: { sender_id: mongoose.Types.ObjectId(req.body.sender_id) }
      },
      {
        $group: {
          _id: "$room_id"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "receiver_id",
          foreignField: "_id",
          as: "sender_details",
        },
      },
    ])
    res.status(200).json({
      details,
      code: 200,
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};


async function downloadCsv(workSheetColumnNames, response) {
  return new Promise((resolve, reject) => {
    try {
      const data = [
        workSheetColumnNames, ...response
      ];

      const workSheetName = "user";
      const filePath = "/excel_file/" + Date.now() + ".csv";
      const resp = response
      const filteredResponse = resp.filter((column) => column);

      // Transpose the array to convert rows into columns
      const transposedResponse = filteredResponse[0].map((_, colIndex) => filteredResponse.map((row) => row[colIndex]));

      // Create a worksheet from the transposed data
      const ws = XLSX.utils.aoa_to_sheet(transposedResponse);
      const workBook = XLSX.utils.book_new(); //Create a new workbook
      // const worksheet = XLSX.utils.aoa_to_sheet(data); //add data to sheet
      // const wb = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Save the workbook to a file
      // XLSX.writeFile(wb, 'output.xlsx');
      XLSX.utils.book_append_sheet(workBook, ws, workSheetName); // add sheet to workbook
      XLSX.writeFile(workBook, "/var/www/mongo/getreal-rest-apis/public" + filePath);
      // path.join(process.env.STORAGE_PATH, filePath) // save file to server
      resolve(STORAGE_PATH_HTTP + filePath);
    } catch (error) {
      reject(console.log(error))
      // reject(handleError(response, error));
    }
  });
}


exports.downloadCmsCsv = async (req, res) => {
  try {
    const data = req.body;
    let path;
    if (data.type == 'user') {
      const condition = {}
      if (data.startRange && data.endRange) {
        condition = {
          $expr: {
            $and: [
              { $gte: ["$createdAt", +data.startRange] },
              { $lte: ["$createdAt", +data.endRange] }
            ]
          }
        }
      }
      const params = [
        { $match: condition },

        {
          $lookup: {
            from: "artistconnections",
            localField: "_id",
            foreignField: "user_id",
            as: "connections",
          },
        },
        {
          $lookup: {
            from: "artistposts",
            localField: "_id",
            foreignField: "receiver_id",
            as: "artistposts_details",
          },
        },

        // {
        //   $lookup: {
        //     from: "headlines",
        //     let: { art_form: "$art_form" },

        //     pipeline: [
        //       {
        //         $match: {
        //           $expr: {
        //             $and: [{ $in: ["$art_form", "$$art_form"] },
        //             { $regexMatch: { input: "$headline", regex: headline, options: "i" } }],
        //           },
        //         },
        //       },
        //     ],
        //     as: "headline",
        //   },
        // },
        {
          $addFields: {
            communitysize: { $size: "$connections" },
            artistrequests_size: { $size: "$artistposts_details" },
            total_show: "$artistposts_details"
          },
        },
        // { $match: condition },
        // {$match:headlineCondition},
        // { $sort: sortcondition },


      ]
      const response1 = await User.aggregate(params)
      const workSheetColumnName = ["first_name", "email", "phone", "homeapproval"];
      const response = response1.map((doc) => {
        return [doc.first_name, doc.email, doc.phone_number, doc.home_approval];
      })
      path = await downloadCsv(workSheetColumnName, response)
    }



    return res.status(200).json({
      code: 200,
      path,
      status: path
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.getreportedUserdetails = async (req, res) => {
  try {
    const data = req.query
    if (data.id) {
      const item = await Report.findOne({ _id: data.id }).populate("user_id").populate({
        path: "post_id",
        populate: {
          path: "user_id"
        }
      });
      return res.status(200).json({ code: 200, data: item });
    } else {
      console.log('pops');
      const getData = await Report.aggregate([
        {
          $match: {
            post_id: mongoose.Types.ObjectId(data.post_id)
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
          $lookup: {
            from: "artistposts",
            localField: "post_id",
            foreignField: "_id",
            as: "post_details",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "user_id",
                  foreignField: "_id",
                  as: "reportPostuser_details"
                }
              },
              { $unwind: { path: "$reportPostuser_details", preserveNullAndEmptyArrays: true } },
            ]
          }
        },


        { $unwind: { path: "$user_details", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$post_details", preserveNullAndEmptyArrays: true } },


        {
          $skip: +data.offset
        },
        {
          $limit: +data.limit
        },
      ])
      const item = await Report.find({ post_id: data.post_id }).count()
      return res.status(200).json({ data: getData, count: item });
    }

  } catch (error) {
    handleError(res, error);
  }
};
exports.unreportedPost = async (req, res) => {
  try {
    const data = req.query
    const limit = data.limit
    const offset = data.offset
    // const item = await artist_post.find({ is_reported: true }).populate("user_id").limit(limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER) // Apply the provided limit or default to 10
    //   .skip(offset ? parseInt(offset) : 0)
    // const counts = await artist_post.find({ is_reported: true }).count()
    const item = await Report.find({}).populate("user_id post_id").sort({createdAt:-1}).limit(limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER) // Apply the provided limit or default to 10
    .skip(offset ? parseInt(offset) : 0)
   const counts = await Report.find({}).count()

    return res.status(200).json({ data: item, count: counts })


  } catch (error) {
    handleError(res, error);
  }
};

exports.addBlockedUser = async (req, res) => {
  try {
    const data = req.body;

    //  data.blocker_id = req.user._id
    const alreadyExist = await Blocked_User.findOne({ block_id: mongoose.Types.ObjectId(data.block_id), blocker_id: mongoose.Types.ObjectId(data.blocker_id) })
    if (alreadyExist) {
      return res.status(404).json({ status: 404, message: "User already blocked" });
    } else {
      data.is_admin_blocked = true
      const block_user = await createItem(Blocked_User, data);
      const notificationObj = {
        sender_id: mongoose.Types.ObjectId(data.blocker_id),
        receiver_id: mongoose.Types.ObjectId(data.block_id),
        type: "user_to_admin",
        title: "Blocked by Admin",
        body: "You have been blocked by admin",
        is_admin: true
      }

      await _sendAdminNotification(notificationObj);

      return res.status(200).json({ status: 200, block_user });
    }
  } catch (error) {

    handleError(res, error);
  }
};


exports.getBlockedUser = async (req, res) => {
  try {
    const data = req.query;
    //  data.blocker_id = req.user._id

    const block_user = await Blocked_User.find({ blocker_id: data.blocker_id })
    return res.status(200).json({ status: 200, data: block_user });
  } catch (error) {

    handleError(res, error);
  }
};



exports.addFcmToken = async (req, res) => {
  try {
    const data = req.body;
    let response;
    const device = await FCMDevice.findOne({ device_id: data.device_id })
    if (device) {
      // console.log("hello--------------->", data.device_token);
      await FCMDevice.updateOne(
        { device_id: data.device_id },
        { $set: { device_token: data.device_token } }
      );
      response = "updated..";
    } else {
      response = await createItem(FCMDevice, data)
    }
    res.status(200).json({
      code: 200,
      response,
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.getbookListing = async (req, res) => {
  try {
    // let user;
    const data = req.body
    console.log('yses ');
    let whereObj = {}, whereObjloc = {}

    if (data.search) {
      whereObj.$or = [
        { "artist_details.first_name": { $regex: data.search, $options: "i" } }, // Searching by username (case-insensitive)
        { "artist_details.last_name": { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive)
        { "user_details.first_name": { $regex: data.search, $options: "i" } }, // Searching by username (case-insensitive)
        { "user_details.last_name": { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive)
        { booking_id: { $regex: data.search, $options: "i" } },
        { event_description: { $regex: data.search, $options: "i" } },
        { "user_details.email": { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive) // Searching by name (case-insensitive)
        { "user_details.phone_number": { $regex: data.search, $options: "i" } }, // Searching by name (case-insensitive)
        { "artist_details.email": { $regex: data.search, $options: "i" } }, // Searching by username (case-insensitive)
        // { "artist_details.phone_number": { $regex: phoneNumberRegex, } }, // Searching by name (case-insensitive)
      ];
    }

    if (data.user_ids) whereObj["user_details._id"] = { $in: data.user_ids.map(user => mongoose.Types.ObjectId(user)) };
    if (data.artist_ids) whereObj["artist_details._id"] = { $in: data.artist_ids.map(artist => mongoose.Types.ObjectId(artist)) };
    if (data.booking_status) whereObj.booking_status = { $in: data.booking_status };
    if (data.dispute_status) whereObj["dispute_details.status"] = { $in: data.dispute_status };
    if (data.location_ids) whereObj["location._id"] = { $in: data.location_ids.map(location => mongoose.Types.ObjectId(location)) };
    if (data.type == "active") whereObj.booking_status = { $eq: "pending" }
    if (data.type == "completed") whereObj.booking_status = { $eq: "complete" }
    if (data.type == "cancelled") whereObj.booking_status = { $eq: "cancel" }
    if (data.event_type) whereObj.event_type = { $in: data.event_type };
    if (data.booking_types) whereObj.booking_type = { $in: data.booking_types };
    if (data.startRange) {
      data.startRange = data.startRange.split('/').join('-');
    }

    if (data.endRange) {
      data.endRange = data.endRange.split('/').join('-');
    }
    if (data.startRange && data.endRange) {
      whereObj.date = {
        $gte: new Date(moment(data.startRange).clone().startOf('day')),
        $lte: new Date(moment(data.endRange).clone().endOf('day'))
      }
    }
    let filterobj = {}
    const starttime = data.gigstart
    data.start_gig_time =starttime // new Date(starttime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) 
    const endTime = data.gigend
    // const timeinindia =  new Date(endTime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) 
    data.end_gig_time = endTime;
console.log("start-------------------",new Date(new Date((data.startRange + "T" + data.start_gig_time + ":00.000Z")).getTime()))
console.log("end----------------------",new Date(new Date((data.endRange + "T" + data.end_gig_time + ":00.000Z")).getTime()))
    if (data.gigstart && data.gigend) {
      filterobj = {
        $and: [
          // { $eq: ["$action", "gig_started"] },
          // { $gte: ["$createdAt",new Date(data.startRange + "T" + data.start_gig_time)] },
          // { $lte: ["$createdAt",new Date(data.startRange + "T" + data.start_gig_time)] },
          {
            admin_date: {
              $gte: new Date(new Date((data.startRange + "T" + data.start_gig_time + ":00.000Z")).getTime()),
              $lte: new Date(new Date((data.endRange + "T" + data.end_gig_time + ":00.000Z")).getTime())
            }
          },
          {
            "booking_action.action": {
              $eq: "gig_started",

            }
          },

          {
            "booking_action.action": {
              $ne: "real_started",

            }
          },
        ],
      }
    }
    
    
    // else if (data.start_real_time && data.end_real_time) {
    //   filterobj = {
    //     $and: [
    //       {
    //         "booking_action.createdAt": {
    //           $gte: new Date(data.startRange + "T" + data.start_real_time + ":00.000Z"),
    //           $lte: new Date(data.endRange + "T" + data.end_real_time + ":00.000Z")
    //         }
    //       },
    //       {
    //         "booking_action.action": {
    //           $eq: "real_started",

    //         }
    //       },

    //     ],
    //   }
    // } else if (data.startRange && data.endRange && data.start_gig_time && data.end_gig_time && data.start_real_time && data.end_real_time) {
    //   filterobj = {
    //     $and: [
    //       {
    //         $or: [
    //           {
    //             $and: [
    //               {
    //                 "booking_action.createdAt": {
    //                   $gte: new Date(data.startRange + "T" + data.start_real_time),
    //                   $lte: new Date(data.endRange + "T" + data.end_real_time)
    //                 }
    //               },
    //               {
    //                 "booking_action.action": {
    //                   $eq: "real_started",
    //                 },
    //               },
    //             ],
    //           },
    //           {
    //             $and: [
    //               {
    //                 "booking_action.createdAt": {
    //                   $gte: new Date(data.startRange + "T" + data.start_gig_time),
    //                   $lte: new Date(data.endRange + "T" + data.end_gig_time)
    //                 }
    //               },
    //               {
    //                 "booking_action.action": {
    //                   $eq: "gig_started",
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   };
    // }



    if (data.status) {
      filterobj = {
        $and: [
          // {
          //   "booking_action.createdAt": {
          //     $gte: new Date(data.start_real_time),
          //     $lte: new Date(data.end_real_time)
          //   }
          // },
          {
            "booking_action.action": {
              $eq: data.status,

            }
          },

        ],
      }
    }

    if (data.booking_status.includes("real_started")) {
      delete whereObj
      whereObj.real_status = 1
    }

    if (data.booking_status.includes("gig_started")) {
      whereObj.gig_status = 1
    }
    // else if(data.status == "gig_started"){
    //   filterobj = {
    //     $and: [
    //       // {
    //       //   "booking_action.createdAt": {
    //       //     $gte: new Date(data.start_real_time),
    //       //     $lte: new Date(data.end_real_time)
    //       //   }
    //       // },
    //       {
    //         "booking_action.action": {
    //           $eq: "gig_started",

    //         }
    //       },

    //     ],
    //   }
    // }
    // const date1 = new Date(data.start_gig_time).getDate;
    // const date2 = new Date(data.end_gig_time);
    // const formattedDate = currentDate.toISOString().split('T')[0];
    // const newdate = formattedDate + "T" + "00:00:00.000";
    const pipeline = [
      {
        $lookup: {
          from: "bookingactions", // Assuming your collection name is "artcategories"
          localField: "_id",
          foreignField: "booking_id",
          as: "booking_action",
         
        },
      },
      {
        $addFields: {
          recent_status: {
            $arrayElemAt: [
              {
                $slice: ["$booking_action", -1]
              },
              0
            ]
          }
        }
      },
      {
        $lookup: {
          from: "booking_requests", // Assuming your collection name is "artcategories"
          localField: "_id",
          foreignField: "booking_id",
          as: "booking_req",
        },
      },

      {
        $match:  filterobj,
       
      },
      {
        $lookup: {
          from: "users", // Assuming your collection name is "artcategories"
          localField: "user_id",
          foreignField: "_id",
          as: "user_details",
        },
      },
      { $unwind: { path: "$user_details", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users", // Assuming your collection name is "artcategories"
          localField: "artist_id",
          foreignField: "_id",
          as: "artist_details",
        },
      },
      { $unwind: { path: "$artist_details", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "addresses", // Assuming your collection name is "artcategories"
          localField: "event_location",
          foreignField: "_id",
          as: "location",
        },
      },
      // {
      //   $match: whereObjloc
      // },
      { $unwind: { path: "$location", preserveNullAndEmptyArrays: true } },
      // {
      //   $addFields: {
      //     startTime: {
      //       $arrayElemAt: ["$time_slots.start_time", 0]
      //     },
      //     modifiedDateTime: {
      //       $concat: [
      //         "$date",
      //         "T",
      //         {
      //           $arrayElemAt: ["$time_slots.start_time", 0]
      //         }
      //       ]
      //     }
      //   }
      // },
      {
        $lookup: {
          from: "disputes", // Assuming your collection name is "artcategories"
          localField: "_id",
          foreignField: "booking",
          as: "dispute_details",
        },
      },
      { $unwind: { path: "$dispute_details", preserveNullAndEmptyArrays: true } },
      {
        $match: whereObj
      },

      {
        $sort: { createdAt: -1 }
      },

    ];


    let resuls = await Booking.aggregate(pipeline);
    let count = resuls.length
    if (data.hasOwnProperty("limit") && data.hasOwnProperty("offset")) {
      pipeline.push(
        {
          $skip: Number(data.offset),
        },
        {
          $limit: Number(data.limit),
        }
      );
    }
    const result = await Booking.aggregate(pipeline);
    return res.status(200).json({ result, count });
  } catch (error) {

    handleError(res, error);
  }
};

exports.getbookListingaccordingbookingid = async (req, res) => {
  try {
    /* let user;
    if (req.query._id) {
      let _id = mongoose.Types.ObjectId(req.query._id);
      user = await getItemThroughId(User, _id);
    } else {
      const data = req.query;
      let whereObj = {}

      if (data.booking_id) {
        whereObj = { _id: mongoose.Types.ObjectId(req.query.booking_id) }
      }
      const inputString = data.search;
      if (inputString) {
        whereObj.$or = [
          { "user_id.first_name": { $regex: data.search, $options: "i" } },
          { "user_id.last_name": { $regex: data.search, $options: "i" } },
          { "user_id.stage_name": { $regex: data.search, $options: "i" } },
          { "user_id.email": { $regex: data.search, $options: "i" } },
          { "user_id.base_location": { $regex: data.search, $options: "i" } },
          { "user_id.phone_number": { $regex: data.search, $options: "i" } },
        ];
      }


      if (data.startRange && data.endRange) {
        whereObj.$and = [
          { createdAt: { $gte: new Date(data.startRange) } },
          { createdAt: { $lte: new Date(data.endRange) } },
        ]
        //     ]
        //   }
        // }
        // }


        // }
        // }
      }

      let order = { createdAt: -1 }
      if (data.order == "oldest") {
        order = { createdAt: 1 }
      } else if (data.order == "newest") {
        order = { createdAt: -1 }
      }



      user = await getItemsCustom(Booking, whereObj, "", "user_id artist_id event_location", order, req.query.limit, req.query.offset);
      user.count = await Booking.find(whereObj).count();
    } */
    const user = await db.getbookListingaccordingbookingid(Booking, req.query)
    return res.status(200).json(user);





    return res.status(200).json(user);
  } catch (error) {

    handleError(res, error);
  }
};


exports.getbookListingaccordingbookingid2 = async (req, res) => {
  try {
    const user = await db.getbookListingaccordingbookingid(Booking, req.query)
    return res.status(200).json(user);
  } catch (error) {

    handleError(res, error);
  }
};



exports.getCategoryforcount = async (req, res) => {
  try {

    const data = req.query;
    const limit = data.limit ? parseInt(data.limit) : 100;
    const offset = data.offset ? parseInt(data.offset) : 0;
    let parent_artForm;
    if (!data.parent_id) {
      data.parent_id = null;
    } else {
      data.parent_id = mongoose.Types.ObjectId(data.parent_id);
      parent_artForm = await ArtCategory.findOne({ _id: mongoose.Types.ObjectId(data.parent_id) });
      parent_artForm = parent_artForm._doc;
    }
    let whereObj = {}
    if (data.startRange && data.endRange) {
      const end = new Date(data.endRange)//.setHours(0, 0);
      const start = new Date(data.startRange)//.setHours(0, 0);
      // const rep = end.toutc()
      console.log("data=========", end);
      console.log
      whereObj = {
        createdAt: {
          $gte: start, // Greater than or equal to the start date
          $lte: end,   // Less than or equal to the end date
        }
      }
    }

    // if (data.startRange && data.endRange) {
    //   whereObj = {

    //     $and: [
    //       // { type: "task_content" },
    //       // { media_house_id: mongoose.Types.ObjectId(req.user._id) },
    //       { createdAt: { $gte: new Date(data.startRange)} },
    //       { createdAt: { $lte:new Date(data.endRange) } },
    //     ]
    //   } 
    //   //     ]
    //   //   }
    //   // }
    // }

    console.log("new Date(data.endRange )", new Date(data.endRange))


    const pipeline = [
      {
        $match: whereObj
      },
      {
        $match: { parent: data.parent_id }, // Find top-level categories (categories without a parent)
      },
      {
        $lookup: {
          from: "categories", // Assuming your collection name is "artcategories"
          localField: "_id",
          foreignField: "parent",
          as: "subcategories",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          createdAt: 1,
          // subcategories:1,
          subcategoryCount: { $size: "$subcategories" },
        },
      },
      // {
      //   $match: {
      //     createdAt: {
      //       $gte: new Date(data.startRange), // Greater than or equal to the start date
      //       $lte: new Date(data.endRange),   // Less than or equal to the end date
      //     }
      //   }
      // },

      {
        $facet: {
          topLevelCategories: [
            // {
            //   $match: {
            //     createdAt: {
            //     $gte: new Date(data.startRange), // Greater than or equal to the start date
            //     $lte: new Date(data.endRange),   // Less than or equal to the end date
            //   }
            // } // Find top-level categories (categories without a parent)
            // },
            { $skip: offset },
            { $limit: limit },

          ],
          totalCount: [
            { $count: 'count' },
          ],
        },
      },

    ];

    // let result = await ArtCategory.aggregate(pipeline);


    let result = await ArtCategory.aggregate(pipeline);

    console.log("data=====================", result)
    let results = { ...{ code: 200 }, ...result[0], ...parent_artForm }

    return res.status(200).json(results);
  } catch (error) {

    handleError(res, error);
  }
};


exports.updateforacceptance = async (req, res) => {
  try {
    const data = req.body;
    let walk_through
    if (data.date) {
      walk_through = await Booking.updateMany({ _id: data.booking_id }, data)
    } else if (data.completion_extend_time) {
      const datteofcom = new Date(data.completion_extend_time)
      data.completion_extend_time = datteofcom
      console.log("data.completion_extend_time", data)
      walk_through = await Booking.updateMany({ _id: data.booking_id }, data)
    } else {
      walk_through = await book_request.updateMany({ booking_id: data.booking_id }, data)
    }
    return res.status(200).json(walk_through);
  } catch (error) {

    handleError(res, error);
  }
};


// event promotion

exports.getpromotion = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      data: await db.getPrmotion(Event_promotion, req.query),
    });
  } catch (error) {
    handleError(res, error);
  }
};



// update promotion and status
exports.editpromotion = async (req, res) => {
  try {

    const data = req.body
    // if (req.body.status == "approved") {
    //   notificationObj = {
    //     sender_id: mongoose.Types.ObjectId(req.body.user_ids),
    //     receiver_id: req.body.user_ids,// mongoose.Types.ObjectId(req.body.user_id),
    //     type: "approvedUser",
    //     title: "User has been  approved",
    //     body: "User has been  approved by Admin",
    //     is_admin: true
    //   }
    // } else if (req.body.status == "disapproved") {
    //   notificationObj = {
    //     sender_id: mongoose.Types.ObjectId(req.body.user_ids),
    //     receiver_id: req.body.user_ids,// mongoose.Types.ObjectId(req.body.user_id),
    //     type: "disapprovedUser",
    //     title: "User has been  disapproved ",
    //     body: "User has been  disapproved by Admin",
    //     is_admin: true
    //   }
    // } else {
    //   notificationObj = {
    //     sender_id: mongoose.Types.ObjectId(req.body.user_ids),
    //     receiver_id: req.body.user_ids,// mongoose.Types.ObjectId(req.body.user_id),
    //     type: "blockedUser",
    //     title: "User has been  blocked",
    //     body: "User has been  blocked by Admin",
    //     is_admin: true
    //   }
    // }
    //     const latwithlong = data.coordinates
    // if(data.address) {
    //   data.lat_long = {
    //     type:"Point",
    //     coordinates:latwithlong
    //   }
    //   const address = await createItem(Address, data.address);
    // }
    //  data.admin_event_location = data.event_location
    // const resp = await _sendAdminNotification(notificationObj);
    if (data.status === "approved") {

      console.log("data=========================")

      const findEventDetails = await Event_promotion.findOne({
        _id: mongoose.Types.ObjectId(req.body._id),
      });

      const finduserdetails = await User.findOne({
        _id: mongoose.Types.ObjectId(findEventDetails),
      });
      const notificationObj = {
        sender_id: mongoose.Types.ObjectId("64f872cc9cbf892c0279b3d4"),
        receiver_id: mongoose.Types.ObjectId(findEventDetails.user_id),
        type: "promotion",
        user_type: "user",
        title: `Congratulations , Your Promotion has been approved`,
        body: `Event Promotion Approved! 🌟 ${findEventDetails.event_name} is now live on GetREAL. Share the vibe and invite users to discover your event!`,
        is_admin: true
      }

      await _sendAdminNotification(notificationObj);
    }

    // const findeventIdBasedupon_id = await Event_promotion.findOne({_id:mongoose.Types.ObjectId(req.body._id)})

    // if(findeventIdBasedupon_id.event_id) {
    //   const findevent = await Event.findOne({_id:mongoose.Types.ObjectId(findeventIdBasedupon_id.event_id)})
    // if(findevent) {
    // const datas = {
    //   event_name :data.event_name
    // }
    //   const item = await updateItemThroughId(Event, findevent.event_id, datas);
    // } {
    //   throw buildErrObject(422, "event Does not exist");
    // }


    // }

    const item = await updateItemThroughId(Event_promotion, req.body._id, data);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};



exports.getCategoryfortoplevelcategory = async (req, res) => {
  try {

    const data = req.body;
    const limit = data.limit ? parseInt(data.limit) : 100;
    const offset = data.offset ? parseInt(data.offset) : 0;
    let parent_artForm, subcategory;
    const subcategoryIds = data._id
    subcategory = await ArtCategory.find({ _id: { $in: subcategoryIds } }).populate("parent").populate({
      path: 'subCategories',
      select: '_id name',
    });
    let whereObj = {}
    let results = { ...{ code: 200 }, subcategory: subcategory, isEmpty: subcategory.length > 0 ? false : true }
    return res.status(200).json(results);
  } catch (error) {

    handleError(res, error);
  }
};


exports.disputes = async (req, res) => {
  try {
    return res.status(200).json({ code: 200, disputes: await db.disputes(Disputes, req.body) });
  } catch (error) {

    handleError(res, error);
  }
};

exports.disapprovedArtist = async (req, res) => {
  try {
    return res.status(200).json({ code: 200, data: await db.disapprovedArtist(User, req.query) });
  } catch (error) {
    handleError(res, error);
  }
};

exports.userPrmoteEvents = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      data: await db.prmotedEvents(Event_promotion, req.body)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.userRaisedDisputes = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      data: await db.userRaisedDisputes(Disputes, req.body)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateArtistProfile = async (req, res) => {
  try {
    const data = req.body;
    if (data.latitude && data.longitude) {
      data.location = {};
      data.location.type = "Point";
      data.location.coordinates = [
        Number(data.longitude),
        Number(data.latitude),
      ];

      data.base_latitude_longitude = {};
      data.base_latitude_longitude.type = "Point";
      data.base_latitude_longitude.coordinates = [
        Number(data.longitude),
        Number(data.latitude),
      ];
    }









    if (data.art_form_object) {
      // Check if data.art_form_object is a string and parse it
      if (typeof data.art_form_object === "string") {
        data.art_form_object = JSON.parse(data.art_form_object);
      }
      // Check if data.art_form_object is an array
      if (Array.isArray(data.art_form_object)) {
        var modifiedArtFormObject = [];
        // Create a new array to store modified data

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(
          data.art_form_object.map(async (art) => {
            let artFormId = art.art_form_id;

            // Clone the original art object to avoid modifying the original data
            let modifiedArt = { ...art };
            // let modifiedArt = JSON.parse(JSON.stringify(art));
            if (artFormId && artFormId != "") {
              // If art_form_id is present, find the parent
              const findallchildcategory = await ArtCategory.findOne({
                _id: artFormId,
              });
              console.log("6307=============", findallchildcategory)
              if (findallchildcategory) {
                if (findallchildcategory.parent != null) {
                  const parenNameforchild = await ArtCategory.findOne({
                    _id: findallchildcategory.parent,
                  });
                  console.log("true0000000=============", findallchildcategory)
                  // Extract the parent information from findallchildcategory
                  let parentId = findallchildcategory
                    ? findallchildcategory.parent
                    : null;
                  let parentName = parenNameforchild
                    ? parenNameforchild.name
                    : null;

                  // Add the parent information to the current art form
                  modifiedArt.parent = parentId;
                  modifiedArt.parent_name = parentName;
                  modifiedArt.type = "auto";
                  console.log(
                    "Modified Art Form Object In artFormId != ",
                    modifiedArt
                  );
                } else {
                  const findallchildcategory = await ArtCategory.findOne({
                    _id: artFormId,
                  });
                  // Extract the parent information from findallchildcategory
                  let parentId = findallchildcategory
                    ? findallchildcategory._id
                    : null;
                  let parentName = findallchildcategory
                    ? findallchildcategory.name
                    : null;

                  // Add the parent information to the current art form
                  modifiedArt.parent = parentId;
                  // modifiedArt.parent_name = parentName;
                  modifiedArt.type = "auto";
                  console.log(
                    "Modified Art Form Object: In Else condition---",
                    modifiedArt
                  );
                }

              }
              else {
                console.log("error=======")
              }

            } else {
              // const findallchildcategory = await ArtCategory.findOne({ name: art.art_form })
              const findallchildcategory = await ArtCategory.findOne({
                name: {
                  $regex: new RegExp("^" + art.art_form + "$"),
                  $options: "i",
                },
              });

              // const findallchildcategorys = await ArtCategory.findOne({ name: art.art_form })
              if (findallchildcategory) {
                if (modifiedArt.art_form == art.art_form) {
                  modifiedArt.art_form_id = findallchildcategory._id;

                  const findallchildcategorys = await ArtCategory.findOne({
                    _id: findallchildcategory._id,
                  });
                  if (findallchildcategorys.parent != null && findallchildcategorys) {
                    const parenNameforchild = await ArtCategory.findOne({
                      _id: findallchildcategorys.parent,
                    });

                    // Extract the parent information from findallchildcategory
                    let parentId = findallchildcategorys
                      ? findallchildcategorys.parent
                      : null;
                    let parentName = parenNameforchild
                      ? parenNameforchild.name
                      : null;
                    let typeofArtform = findallchildcategorys
                      ? findallchildcategorys.type
                      : "manual";
                    // Add the parent information to the current art form
                    modifiedArt.parent = parentId;
                    modifiedArt.parent_name = parentName;
                    modifiedArt.type = typeofArtform;
                    console.log(
                      "Modified Art Form Object In artFormId != ",
                      modifiedArt
                    );
                  } else {
                    const findallchildcategorys = await ArtCategory.findOne({
                      _id: findallchildcategory._id,
                    });
                    let typeofArtform = findallchildcategorys
                      ? findallchildcategorys.type
                      : "manual";
                    // const findallchildcategory = await ArtCategory.findOne({ _id: artFormId });
                    // Extract the parent information from findallchildcategory
                    let parentId = findallchildcategorys
                      ? findallchildcategorys._id
                      : null;
                    let parentName = findallchildcategorys
                      ? findallchildcategorys.name
                      : null;

                    // Add the parent information to the current art form
                    modifiedArt.parent = parentId;
                    // modifiedArt.parent_name = parentName;
                    modifiedArt.type = typeofArtform;
                    console.log(
                      "Modified Art Form Object: In Else condition---",
                      modifiedArt
                    );
                  }
                } else {
                  console.log("testbyparteek");
                  modifiedArt.parent_id = null;
                  category = new ArtCategory({
                    name: art.art_form,
                    parent: null,
                    type: "manual",
                    status: "pending",
                    added_by: data.id,
                  });
                  await category.save();

                  modifiedArt.art_form_id = category._id;
                  modifiedArt.type = "manual";

                  console.log("category data after save", category);
                }
                // const matchingIndex = data.art_form_object.findIndex((value) => value.art_form === art.art_form);
                // if (matchingIndex !== -1) {
                //   if (modifiedArt.art_form == art.art_form) {
                //     modifiedArt.art_form_id = findallchildcategory._id
                //   }
                // } else {
                //   console.error("Matching index not found for:");
                // }
              } else {
                console.log("testbyparteek");
                modifiedArt.parent_id = null;
                category = new ArtCategory({
                  name: art.art_form,
                  parent: null,
                  type: "manual",
                  status: "pending",
                  added_by: data.id,
                });
                await category.save();

                modifiedArt.art_form_id = category._id;
                modifiedArt.type = "manual";

                console.log("category data after save", category);
              }
              // If art_form_id is not present, create a category
              // Add your logic here to create a category if needed

              // Push the modified art object to the new array
            }

            modifiedArtFormObject.push(modifiedArt);
          })
        );

        // Print the modified array
        console.log("Modified Art Form Object:", modifiedArtFormObject);
      }
    }


    console.log("Modified Art Form Object========test ==============:", modifiedArtFormObject);

    data.art_form_object = modifiedArtFormObject
    return res.status(200).json({
      code: 200,
      data: await updateItem(User, { _id: data.id }, data)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.userGigs = async (req, res) => {
  try {
    const data = req.body;
    return res.status(200).json({
      code: 200,
      data: await db.userGigs(Booking, data)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.languages = async (req, res) => {
  try {
    const data = req.query, condition = {};
    let response;
    if (data.search) {
      condition.$or = [
        { name: { $regex: data.search, $options: "i" } },
      ];
    }
    if (data.id) {
      response = await Languages.findOne({ _id: data.id })
    } else {
      response = await Languages.find(condition).skip(data.offset ? +data.offset : 0).limit(data.limit ? +data.limit : 10).sort(data.sortBy == 'old' ? { createdAt: 1 } : { createdAt: -1 })

    }
    return res.status(200).json({
      code: 200,
      data: response
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.artCategories = async (req, res) => {
  try {
    const data = req.body
    return res.status(200).json({
      code: 200,
      data: await ArtCategory.find({ _id: { $in: data.id } }).populate('parent')
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.addIds = async (req, res) => {
  try {
    const data = req.body;
    const responseArray = [];

    for (let ob of data.obj) {
      const createdItem = await createItem(Art_forms_under_headline, ob);
      responseArray.push({
        "headline_name": ob.headline_name,
        "level": ob.level,
        "ids": ob.ids,
        "_id": createdItem.data._id,
        "createdAt": createdItem.data.createdAt,
        "updatedAt": createdItem.data.updatedAt
      });
    }

    const response = {
      "success_message": "Items added successfully",
      "data": responseArray
    };

    return res.status(200).json(response);
  } catch (error) {
    handleError(res, error);
  }
};


exports.addHomePageHeadlines = async (req, res) => {
  try {
    const data = req.body;

    const existingHeadlines = await Headline.findOne({
      art_form: data.art_form
    });
    // const fing = await ArtCategory.find({ _id: { $in: data.art_form } })
    // const map = fing.map((x) => x.name)
    // data.art_form = map

    const findparent = await ArtCategory.find({ _id: { $in: data.art_form } })
    const parent = findparent.map((x) => x.parent)
    let arr = [], parentarr = parent
    // const getallids = await ArtCategory.find({ _id: { $in: data.art_form} })
    // data.art_form.forEach(async (element) => {
    //   console.log("parentarr====",element)
    // })
    // parentarr.push(findparent.parent)
    console.log("parentarr====", parent)
    /*  for (let i = 0; i < data.art_forms_for_hompage.length; i++) {
       console.log("i:=============:", i) */
    // for (let ob of data.art_forms_for_hompage) {
    //   /* for (let j = 0; j < ob.category.length; j++) {
    //     // const element = array[i];
    //     console.log("j:=============:",j)
    //   } */
    //   for (let x of ob.category) {
    //     const datacreate = {
    //       headline_name: data.headline,
    //       level: ob.level,
    //       ids: x,
    //     }
    //     const findparent = await ArtCategory.findOne({ _id: x })
    //     parentarr.push(findparent.parent)
    //     const createdItem = await createItem(Art_forms_under_headline, datacreate);
    //     console.log("createdItem------------", createdItem)
    //     arr.push(createdItem.data._id)
    //   }
    // }
    // }
    // data.art_forms_for_hompage = arr
    const uniqueCities = new Set()
    parentarr.forEach((booking) => {
      const city = booking;
      // Add the city to the uniqueCities Set if it's not null and not an empty string
      if (city !== null && city !== "") {
        uniqueCities.add(city);
      }
      // uniqueCities.add(booking.base_location);
    });
    const cities = Array.from(uniqueCities);
    // const fing = await ArtCategory.find({ _id: { $in: cities } })
    const fing = await ArtCategory.find({ _id: { $in: data.art_form, $nin: cities } })
    const map = fing.map((x) => x.name)
    data.art_form = map
    // const map = fing.map((x) => x.name)
    // data.art_form = map
    const headlines = await createItem(Headline, data);

    return res.status(200).json(headlines);
  } catch (error) {

    handleError(res, error);
  }
};

exports.headlineGet = async (req, res) => {
  try {
    const items = await db.headlineGet(Headline, req.body)
    return res.status(200).json({
      code: 200,
      data: req.body.headline_id ? items[0] : items
    });
  } catch (error) {
    handleError(res, error);
  }
};



exports.getDisputeByBookingId = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      response: await getItemCustom(Disputes, { booking: req.params.booking_id }, '', 'user_id booking')
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.roleManagement = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      data: await db.roleManagement(RoleManagement, req.body)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.subAdmin = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      data: await db.subAdmin(Admin, req.body)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateCategoryUnderHeadline = async (req, res) => {
  try {
    const data = req.body;
    return res.status(200).json({
      code: 200,
      data: await updateItem(Art_forms_under_headline, { _id: data.id }, data)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.subAdminAccess = async (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      response: await getItemCustom(Admin, { _id: req.user._id }, '', 'role_id')
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.userBookingList = async (req, res) => {
  try {
    const data = req.body
    return res.status(200).json({
      code: 200,
      response: await db.userBookingList(Booking, data)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.artistBookingList = async (req, res) => {
  try {
    const data = req.body
    return res.status(200).json({
      code: 200,
      response: await db.artistBookingList(Booking, data)
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.bookingLocations = async (req, res) => {
  try {
    const data = req.body
    return res.status(200).json({
      code: 200,
      response: await db.bookingLocations(Address, data)
    });
  } catch (error) {
    handleError(res, error);
  }
};

// exports.userMgmtFiters = async (req, res) => {
//   try {
//     const data = req.body
//     let response
//     if (data.wishlist_users) {
//       for (let x of data.wishlist_users) {
//         response = await createItem(Filters, { wishlist_users: x })
//       }
//     } else {
//       response = await createItem(Filters, data)
//     }
//     /* if (data.type == 'location') {
//       response = await updateItem(City, { city: { $in: data.city_name } }, { status: data.status })
//     }
//     if (data.type == 'gigsFilter') {
//       response = await updateItem(GigsFilter, { _id: "653106772ad5de9198be94db" }, data)
//     } */
//     return res.status(200).json({
//       code: 200,
//       response
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

exports.getUserMgmtFiters = async (req, res) => {
  try {
    const data = req.body
    let response;
    if (data.type == 'types_of_gigs') {
      response = await getItemThroughId(Filters, "653107d2fc6e9093be5f030b", false, 'performance private public training type')
    }
    if (data.type == 'no_of_gigs') {
      response = await getItemThroughId(Filters, "6531102f702a4e7ad64bee7d", false, 'min max type')
    }
    if (data.type == 'money_spent') {
      response = await getItemThroughId(Filters, "653108c12bff359e152d90f1", false, 'min max type')
    }
    if (data.type == 'promote') {
      response = await getItemThroughId(Filters, "653108dc2bff359e152d90f3", false, 'min max type')
    }
    if (data.type == 'disputes') {
      response = await getItemsCustom(Filters, { type: "dispute" }, "open close type")
    }
    return res.status(200).json({
      code: 200,
      response: response.data
    });
  } catch (error) {
    handleError(res, error);
  }
};


// const downloadFiles = async (filePaths) => {
//   const downloadedFiles = [];
//   const s3 = new AWS.S3({
//     accessKeyId: ACCESS_KEY,
//     secretAccessKey: SECRET_KEY,
//     region: REGION,
//   });
//   console.log("s3.config.credentials,", filePaths)
//   await filePaths.forEach(async (element) => {

//     console.log(s3.config.credentials)
//     // for (const filePath of filePaths) {
//     // const S3_BUCKET_NAME = "uat-presshope";
//     // const S3_KEY = `public/contentData/${element}`;
//     const S3_BUCKET_NAME = Bucket;
//     const S3_KEY = `media_path/${element}`;
//     const params = {
//       Bucket: S3_BUCKET_NAME,
//       Key: S3_KEY, // The S3 object key (path) of the file
//     };

//     const response = await s3.getObject(params).promise();

//     // Save the downloaded file locally or in memory as needed
//     downloadedFiles.push({ name: element, data: response.Body });
//     // }
//   })
//   return downloadedFiles;
// };
const downloadFiles = async (filePaths) => {
  const downloadedFiles = [];
  const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
  });

  for (const element of filePaths) {
    const S3_BUCKET_NAME = Bucket;
    const S3_KEY = `media_path/${element}`;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: S3_KEY, // The S3 object key (path) of the file
    };

    try {
      const response = await s3.getObject(params).promise();
      // Save the downloaded file locally or in memory as needed
      downloadedFiles.push({ name: element, data: response.Body });
    } catch (error) {
      console.error(`Error downloading ${element}: ${error}`);
    }
  }

  return downloadedFiles;
};

const downloadFilesd = async (filePaths, path) => {
  const downloadedFiles = [];
  const s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION,
  });

  for (const element of filePaths) {
    const S3_BUCKET_NAME = Bucket;
    const S3_KEY = `${path}/${element}`;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: S3_KEY, // The S3 object key (path) of the file
    };

    try {
      const response = await s3.getObject(params).promise();
      // Save the downloaded file locally or in memory as needed
      downloadedFiles.push({ name: element, data: response.Body });
    } catch (error) {
      console.error(`Error downloading ${element}: ${error}`);
    }
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
exports.downloadZip = async (req, res) => {
  try {
    const data = req.body;
    // let added1 = await Post.findOne({
    //   _id: req.query.image_id,
    // });

    // const filePaths = added1.content.map((file) => file.media);
    const csvFilePath = path.join('/var/www/mongo/getreal-rest-apis/public/zip', 'categories_hierarchy.csv')
    const arr = data.myArray.map((x) => x.media)
    const downloadedFiles = await downloadFiles(arr);
    console.log("downloadedFiles", downloadedFiles)
    const randomFileName = new Date();
    const outputFilePath = `/var/www/mongo/getreal-rest-apis/public/zip/${randomFileName}.zip`;

    await createZipArchive(downloadedFiles, outputFilePath);
    return res.status(200).json({
      code: 200,
      message: `https://uat.getreal.buzz/getreal-rest-apis/public/zip/${randomFileName}.zip`,
      // msg:arr2,
    });
  } catch (error) {
    handleError(res, error);
  }
};



exports.downloadZipforaddpost = async (req, res) => {
  try {
    const data = req.body;
    // let added1 = await Post.findOne({
    //   _id: req.query.image_id,
    // });

    // const filePaths = added1.content.map((file) => file.media);
    const arr = data.myArray.map((x) => x.media)
    const downloadedFiles = await downloadFilesd(arr, data.path);
    console.log("downloadedFiles", downloadedFiles)
    const randomFileName = new Date();
    const outputFilePath = `/var/www/mongo/getreal-rest-apis/public/zip/${randomFileName}.zip`;

    await createZipArchive(downloadedFiles, outputFilePath);
    return res.status(200).json({
      code: 200,
      message: `https://betazone.promaticstechnologies.com/getreal-rest-apis/public/zip/${randomFileName}.zip`,
      // msg:arr2,
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.gethistoryofapprove = async (req, res) => {
  try {
    const data = req.query
    return res.status(200).json({
      code: 200,
      response: await historyOfapprove.find({ user_id: data.user_id }).sort({ createdAt: -1 })
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.locationlistforfilter = async (req, res) => {
  try {
    const data = req.query;
    const { limit, offset, search } = data;
    const query = { post_type: "admin" };
    if (search) {
      // If a search parameter is provided, create a regular expression to match the city
      query.location = new RegExp(search, 'i');
    }

    const uniqueCities = new Set();
    if (data.type == "admin_post") {
      const booking = await artist_post.find(query)
      booking.forEach((booking) => {
        const city = booking.location;
        // Add the city to the uniqueCities Set if it's not null and not an empty string
        if (city !== null && city !== "") {
          uniqueCities.add(city);
        }
        // uniqueCities.add(booking.base_location);
      });

      // Convert the Set back to an array
      // const cities = Array.from(uniqueCities);
      const locations = await artist_post
        .find(query)
        .limit(limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER) // Apply the provided limit or default to 10
        .skip(offset ? parseInt(offset) : 0)
      const locationss = await artist_post
        .find(query)

      const uniqueCitiesswithoutlimmit = new Set(locationss.map((location) => location.location));
      // Convert the Set back to an array
      const citieswithoutlimmit = Array.from(uniqueCitiesswithoutlimmit);
      // Extract unique city values from the found locations
      const uniqueCitiess = new Set(locations.map((location) => location.location));

      // Convert the Set back to an array
      const cities = Array.from(uniqueCitiess);
      return res.status(200).json({
        code: 200,
        data: cities,
        count: citieswithoutlimmit.length
      });
    } else {
      const count = await artist_post.find({});
      const result = await artist_post.aggregate([
        {
          $group: {
            _id: '$user_id', // Group by the user_id field
            count: { $sum: 1 } // Count the number of documents in each group
          }
        }
      ]);

      const mapofuser = result.map((x) => x._id)
      console.log("data===============", new Set(mapofuser))
      const userlist = new Set(mapofuser)
      const findusersofpost = await User.find({ $in: userlist })
      findusersofpost.forEach((booking) => {
        const city = booking.base_location;
        // Add the city to the uniqueCities Set if it's not null and not an empty string
        if (city != null && city !== "") {
          uniqueCities.add(city);
        }
        // uniqueCities.add(booking.location);
      });
      // const locations = await artist_post
      //   .find(query)
      //   .limit(limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER) // Apply the provided limit or default to 10
      //   .skip(offset ? parseInt(offset) : 0)
      const locations = await User.find({ $in: userlist })
        .limit(limit ? parseInt(limit) : Number.MAX_SAFE_INTEGER) // Apply the provided limit or default to 10
        .skip(offset ? parseInt(offset) : 0)
      // const locationss = await artist_post
      //   .find(query)
      // const uniqueCitiesswithoutlimmit = new Set(locationss.map((location) => location.location));
      // Convert the Set back to an array
      const citieswithoutlimmit = Array.from(uniqueCities);
      // Extract unique city values from the found locations
      const uniqueCitiess = new Set(locations.map((location) => location.base_location));
      // Convert the Set back to an array
      const cities = Array.from(uniqueCitiess);
      return res.status(200).json({
        code: 200,
        data: cities,
        count: citieswithoutlimmit.length,

      });
    }
    // Iterate through the bookings and add unique cities to the Set


  } catch (error) {
    handleError(res, error);
  }
};


exports.acceptRejectBooking = async (req, res) => {
  try {
    const data = req.body;
    const whereObj = { _id: mongoose.Types.ObjectId(data._id) };
    const user_id = req.user._id;
    if (data.action == "cancel") {
      data.calendar_block =
        data.calendar_block == "true" || data.calendar_block == true;
      data.booking_status = "cancel";
      data.user_booking_status = "cancel";
    }
    const actionObj = {
      user_id: req.user._id,
      booking_id: data._id,
      action: data.action,
      action_by: "admin",
    };

    console.log("data before completion---", data);
    const [detail, crAction] = await Promise.all([
      updateItem(Booking, whereObj, data),
      createItem(BookingAction, actionObj),
    ]);

    let datas;
    let msg;

    // let booking_detail = await Booking.findOne({
    //   _id: data._id,
    // });
    // if (data.action == "accept") {
    //   datas = {
    //     status: "accept",
    //   };
    //   msg=`Your booking ID ${booking_detail.booking_id} is accepted for event ${booking_detail.event_name}`;
    // } else if (data.action == "reject") {
    //   datas = {
    //     status: "reject",
    //   };
    //   msg=`Your booking ID ${booking_detail.booking_id} is rejected for event ${booking_detail.event_name}`;
    // }

    // const cond = {
    //   booking_id: data._id,
    // };
    // const status = await updateItem(Booking_requests, cond, datas);


    // const receiver_id=booking_detail.user_id;
    // /********** SENDING NOTIFICATION TO USER FOR ACCEPT/REJECT BOOKING ******/
    // const notificationObj = {
    //   sender_id: req.user._id,
    //   receiver_id: receiver_id ? receiver_id.toString() : "",
    //   type: "request",
    //   title: msg,
    //   body:  msg
    // };

    // await _sendNotification(notificationObj);
    /************************************************************************ */

    return res.status(200).json({
      code: 200,
      data: detail.data,
    });
  } catch (error) {
    handleError(res, error);
  }
};



exports.gettimelinebybookingId = async (req, res) => {
  try {
    const data = req.body
    const resp = await BookingAction.find({ booking_id: mongoose.Types.ObjectId(data.booking_id) })
    return res.status(200).json({
      code: 200,
      data: resp,
    });
  } catch (error) {
    handleError(res, error);
  }
};



exports.getAdminBusyFreeSlots = async (req, res) => {
  try {
    let id;
    id = mongoose.Types.ObjectId(req.body.artist_id);
    console.log('user id--->>', id)
    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: id,
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);
    console.log('chhoselife--->>>', choose_life_data)

    return res.status(200).json({
      code: 200,
      data: choose_life_data,
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.getBusyFreeSlots = async (req, res) => {
  try {
    let id;
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    // console.log("data received here is---", req.query);
    if (req.body.artist_id) {
      console.log("by direct");
      id = mongoose.Types.ObjectId(req.body.artist_id);
    }
    const givenDate = new Date(req.body.given_date);
    const dummydate = new Date(req.body.given_date);
    dummydate.setHours(0, 0, 0, 0);

    const day = givenDate.getDay();

    console.log("given date and day is---", day);

    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: id,
          day: days[day],
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);
    const startOfDay = new Date(givenDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(givenDate);
    endOfDay.setHours(23, 59, 59, 999);

    /**************LOGIC FOR ADDITIONAL SHOW TIME IN CASE CHOOSE LIFE IS EMPTY***************/
    const event_data = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          //start_date: { $lte: dummydate },
          // end_date: { $gt: dummydate },
          start_date: { $lte: endOfDay },
          end_date: { $gte: startOfDay },
          description: { $ne: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },

      {
        $lookup: {
          from: "bookings",
          localField: "booking_id",
          foreignField: "_id",
          as: "bookings",
        },
      },
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { "bookings.booking_status": { $in: ["accept", "pending"] } },
            { "bookings.calendar_block": true },
          ],
        }
      },


    ]);

    const manual_slot = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          start_date: { $gte: dummydate },
          end_date: { $lte: dummydate },
          description: { $eq: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);


    for (const manualslot of manual_slot) {
      for (const mslot of manualslot.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {
            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlap(
                mslot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        mslot.busy_status = isBusy ? "busy" : "free";
      }
    }

    const dataObject = {
      manual_slot
    }
    const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

    // Merge and sort the time_slots arrays
    const mergedTimeSlots = timeSlotsManual;

    const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
      // Assuming start_time is in "HH:mm:ss" format
      return a.start_time.localeCompare(b.start_time);
    });



    const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
      if (slot.busy_status === 'busy') {
        indices.push(index);
      }
      return indices;
    }, []);

    // Update the adjacent slots based on the busy slots found
    /*  OLD NICE LOGIC BEFORE AM-PM busyIndices.forEach(index => {
        if (index > 0) {
          sortedTimeSlots[index - 1].busy_status = 'busy';
        }
        if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
          sortedTimeSlots[index + 1].busy_status = 'busy';
        }
      }); */
    busyIndices.forEach(index => {
      if (index > 0) {
        const currentTime = parseInt(sortedTimeSlots[index].start_time.split(":")[0]);
        const prevTime = parseInt(sortedTimeSlots[index - 1].end_time.split(":")[0]);

        // Check if the previous time slot has a one-hour difference
        if (currentTime - prevTime === 0) {
          sortedTimeSlots[index - 1].busy_status = 'busy';
        }
      }

      if (index < sortedTimeSlots.length - 1) {
        const currentTime = parseInt(sortedTimeSlots[index].end_time.split(":")[0]);
        const nextTime = parseInt(sortedTimeSlots[index + 1].start_time.split(":")[0]);

        // Check if the next time slot has a one-hour difference
        if (nextTime - currentTime === 0) {
          sortedTimeSlots[index + 1].busy_status = 'busy';
        }
      }
    });

    /****************************************************************************************/

    if (choose_life_data.length == 0) {
      if (sortedTimeSlots.length == 0) {
        return res.status(404).json({
          code: 400,
          data: "No slots available for this day"
        });
      } else {
        return res.status(200).json({
          code: 200,
          data: sortedTimeSlots,
          additional_date: givenDate
        });

      }

    } else {
      var final_available_slots_for_day = choose_life_data[0];
      console.log("new date given is---" + new Date(givenDate));

      const startOfDay = new Date(givenDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(givenDate);
      endOfDay.setHours(23, 59, 59, 999);
      /*    const event_data = await Event.aggregate([ //gagzzz
           {
             $match: {
               artist_id: id,
               start_date: { $lte: endOfDay },
               end_date: { $gte: startOfDay },
               description: { $ne: "manual" },
             },
           },
           {
             $lookup: {
               from: "timeslots",
               localField: "_id",
               foreignField: "event_id",
               as: "time_slots",
             },
           },
         ]); */


      const event_data = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $ne: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
        /* {
          $unwind: "$time_slots" // Expand the time_slots array
        },
        {
          $match: {
            "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
          }
        }, */
        /*  {
           $group: {
             _id: "$_id",
             // You can include other fields you want from the initial collection
             // Sample field inclusion: name: { $first: "$name" }
             time_slots: { $push: "$time_slots" } // Collect filtered time_slots
           }
         }, */
        {
          $lookup: {
            from: "bookings",
            localField: "booking_id",
            foreignField: "_id",
            as: "bookings",
          },
        },
        {
          $unwind: {
            path: "$bookings",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $or: [
              // { "bookings.booking_status": "accept" },
              { "bookings.booking_status": { $in: ["accept", "pending"] } },
              { "bookings.calendar_block": true },
            ],
          }
        },


      ]);


      const manual_slot = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $eq: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
      ]);
      // Extract time_slots arrays from data and manual_slot

      // Loop through each time slot in data
      //console.log(
      //"Final Available Slots For Day---",
      //final_available_slots_for_day.time_slots
      //);
      //  console.log("Event data is---", event_data);
      for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          //  console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {

            //  console.log(
            //  "eventdatatimeslot is--",
            // JSON.stringify(eventDataTimeSlot)
            //);

            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlap(
                dataTimeSlot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        dataTimeSlot.busy_status = isBusy ? "busy" : "free";
      }



      /**************************CHECK AVAILABILITY FOR MANUAL SLOTS************************************/

      // Loop through each time slot in data
      for (const manualslot of manual_slot) {
        for (const mslot of manualslot.time_slots) {
          // Initialize a flag to check if the time slot is busy
          let isBusy = false;

          // Loop through each event in event_data
          for (const event of event_data) {
            console.log("Event Data Is----", event_data);
            // Loop through each time slot in the event
            for (const eventDataTimeSlot of event.time_slots) {
              // Check if there is an overlap
              /*   if(event.type=='gog'){
      
                  if(artist_details.data.GOG_city){
                    if(artist_details.data.GOG_city!=req.query.city){
                      isBusy = true;
                      break;
                    }
                  }
      
                
                } */
              var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
              var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
              if (
                checkTimeSlotOverlap(
                  mslot,
                  eventDataTimeSlot,
                  bookingStartDate,
                  bookingEndDate
                )
              ) {
                isBusy = true;
                break; // No need to check further, we found an overlap
              }
            }
            if (isBusy) break; // No need to check further, we found an overlap
          }

          // Set the busy_status in the data time slot
          mslot.busy_status = isBusy ? "busy" : "free";
        }
      }

      if (event_data.length > 0) {
        final_available_slots_for_day.booking_id = event_data[0]._id;
      }

      // Sort the time_slots array by start_time
      final_available_slots_for_day.time_slots.sort((a, b) => {
        return a.start_time.localeCompare(b.start_time);
      });


      const timeSlots = final_available_slots_for_day.time_slots;

      const downtime = await blocktimeslot.find({
        user_id: id,
        $expr: {
          $and: [
            {
              $lte: [
                { $dateFromParts: { year: { $year: "$start_date" }, month: { $month: "$start_date" }, day: { $dayOfMonth: "$start_date" } } },
                givenDate
              ]
            },
            {
              $gte: [
                { $dateFromParts: { year: { $year: "$end_date" }, month: { $month: "$end_date" }, day: { $dayOfMonth: "$end_date" } } },
                givenDate
              ]
            }
          ]
        }
      });
      console.log("down time is----", downtime);

      /*   downtime.forEach(downtimeSlot => {
          // Extract start_date, end_date, start_time, and end_time from downtime
          const { start_date, end_date, start_time, end_time } = downtimeSlot;
      
          // Check if the given date falls within the range of start_date and end_date
          const isDateInRange = givenDate >= new Date(start_date) && givenDate <= new Date(end_date);
          console.log("is in date range----", isDateInRange);
          if (isDateInRange) {
            data.time_slots.forEach(slot => {
              if (slot.start_time === start_time && slot.end_time === end_time && slot.status === 'free') {
                slot.busy_status = 'busy';
              }
            });
          }
        }); */
      const dataObject = {
        data: final_available_slots_for_day,
        manual_slot
      }
      const timeSlotsData = dataObject.data.time_slots || [];
      const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

      // Merge and sort the time_slots arrays
      const mergedTimeSlots = [...timeSlotsData, ...timeSlotsManual];

      const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
        // Assuming start_time is in "HH:mm:ss" format
        return a.start_time.localeCompare(b.start_time);
      });

      //   sortedTimeSlots[3].busy_status="busy";

      const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
        if (slot.busy_status === 'busy') {
          indices.push(index);
        }
        return indices;
      }, []);

      // Update the adjacent slots based on the busy slots found
      /* old good logic before AM/PM  busyIndices.forEach(index => {
         if (index > 0) {
           sortedTimeSlots[index - 1].busy_status = 'busy';
         }
         if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
           sortedTimeSlots[index + 1].busy_status = 'busy';
         }
       }); */


      busyIndices.forEach(index => {
        if (index > 0) {
          const currentTime = parseInt(sortedTimeSlots[index].start_time.split(":")[0]);
          const prevTime = parseInt(sortedTimeSlots[index - 1].end_time.split(":")[0]);
          console.log("Time is----", currentTime - prevTime);
          // Check if the previous time slot has a one-hour difference
          if (currentTime - prevTime === 0) {
            sortedTimeSlots[index - 1].busy_status = 'busy';
          }
        }

        if (index < sortedTimeSlots.length - 1) {
          const currentTime = parseInt(sortedTimeSlots[index].end_time.split(":")[0]);
          const nextTime = parseInt(sortedTimeSlots[index + 1].start_time.split(":")[0]);
          console.log("Time is----", nextTime - currentTime);
          // Check if the next time slot has a one-hour difference
          if (nextTime - currentTime === 0) {
            sortedTimeSlots[index + 1].busy_status = 'busy';
          }
        }
      });

      //add logic here
      downtime.forEach(downtimeSlot => {
        sortedTimeSlots.forEach(slot => {
          console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
          if (

            formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
            formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
            slot.busy_status === 'free'
          ) {
            console.log("Yea this is true..")
            slot.busy_status = 'busy';
          }
        });
      });

      /*    if(manual_slot && manual_slot.length>0){
   
         downtime.forEach(downtimeSlot => {
           manual_slot.forEach(mSlot => {
             mSlot.time_slots.forEach(slot => {
             console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
             if (
   
               formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
               formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
               slot.busy_status === 'free'
             ) {
               //console.log("Yea this is true..")
               slot.busy_status = 'busy';
             }
           });
         });
         });
       } */



      return res.status(200).json({
        code: 200,
        data: final_available_slots_for_day,
        event_data,
        manual_slot,
        sortedTimeSlots
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};



exports.getAdminBusyFreeSlotsOld = async (req, res) => {
  try {
    let id;
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    console.log("data received here is---", req.query);

    id = mongoose.Types.ObjectId(req.body.artist_id);

    const givenDate = new Date(req.query.given_date);
    const dummydate = new Date(req.query.given_date);
    dummydate.setHours(0, 0, 0, 0);

    const day = givenDate.getDay();

    console.log("given date and day is---", day);

    //  const artist_details = await getItemThroughId(User, req.query.user_id);
    //  console.log("Artist details are----", artist_details);

    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: id,
          day: days[day],
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);
    const startOfDay = new Date(givenDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(givenDate);
    endOfDay.setHours(23, 59, 59, 999);

    /**************LOGIC FOR ADDITIONAL SHOW TIME IN CASE CHOOSE LIFE IS EMPTY***************/
    const event_data = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          //start_date: { $lte: dummydate },
          // end_date: { $gt: dummydate },
          start_date: { $lte: endOfDay },
          end_date: { $gte: startOfDay },
          description: { $ne: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },

      {
        $lookup: {
          from: "bookings",
          localField: "booking_id",
          foreignField: "_id",
          as: "bookings",
        },
      },
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { "bookings.booking_status": { $in: ["accept", "pending"] } },
            { "bookings.calendar_block": true },
          ],
        }
      },


    ]);

    const manual_slot = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          start_date: { $gte: dummydate },
          end_date: { $lte: dummydate },
          description: { $eq: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);


    for (const manualslot of manual_slot) {
      for (const mslot of manualslot.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {
            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlap(
                mslot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        mslot.busy_status = isBusy ? "busy" : "free";
      }
    }

    const dataObject = {
      manual_slot
    }
    const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

    // Merge and sort the time_slots arrays
    const mergedTimeSlots = timeSlotsManual;

    const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
      // Assuming start_time is in "HH:mm:ss" format
      return a.start_time.localeCompare(b.start_time);
    });



    const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
      if (slot.busy_status === 'busy') {
        indices.push(index);
      }
      return indices;
    }, []);

    // Update the adjacent slots based on the busy slots found
    /*  OLD NICE LOGIC BEFORE AM-PM busyIndices.forEach(index => {
        if (index > 0) {
          sortedTimeSlots[index - 1].busy_status = 'busy';
        }
        if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
          sortedTimeSlots[index + 1].busy_status = 'busy';
        }
      }); */
    busyIndices.forEach(index => {
      if (index > 0) {
        const currentTime = parseInt(sortedTimeSlots[index].start_time.split(":")[0]);
        const prevTime = parseInt(sortedTimeSlots[index - 1].end_time.split(":")[0]);

        // Check if the previous time slot has a one-hour difference
        if (currentTime - prevTime === 0) {
          sortedTimeSlots[index - 1].busy_status = 'busy';
        }
      }

      if (index < sortedTimeSlots.length - 1) {
        const currentTime = parseInt(sortedTimeSlots[index].end_time.split(":")[0]);
        const nextTime = parseInt(sortedTimeSlots[index + 1].start_time.split(":")[0]);

        // Check if the next time slot has a one-hour difference
        if (nextTime - currentTime === 0) {
          sortedTimeSlots[index + 1].busy_status = 'busy';
        }
      }
    });

    /****************************************************************************************/

    if (choose_life_data.length == 0) {
      if (sortedTimeSlots.length == 0) {
        return res.status(404).json({
          code: 400,
          data: "No slots available for this day"
        });
      } else {
        return res.status(200).json({
          code: 200,
          data: sortedTimeSlots,
          additional_date: givenDate
        });

      }

    } else {
      var final_available_slots_for_day = choose_life_data[0];
      console.log("new date given is---" + new Date(givenDate));

      const startOfDay = new Date(givenDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(givenDate);
      endOfDay.setHours(23, 59, 59, 999);
      /*    const event_data = await Event.aggregate([ //gagzzz
           {
             $match: {
               artist_id: id,
               start_date: { $lte: endOfDay },
               end_date: { $gte: startOfDay },
               description: { $ne: "manual" },
             },
           },
           {
             $lookup: {
               from: "timeslots",
               localField: "_id",
               foreignField: "event_id",
               as: "time_slots",
             },
           },
         ]); */


      const event_data = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $ne: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
        /* {
          $unwind: "$time_slots" // Expand the time_slots array
        },
        {
          $match: {
            "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
          }
        }, */
        /*  {
           $group: {
             _id: "$_id",
             // You can include other fields you want from the initial collection
             // Sample field inclusion: name: { $first: "$name" }
             time_slots: { $push: "$time_slots" } // Collect filtered time_slots
           }
         }, */
        {
          $lookup: {
            from: "bookings",
            localField: "booking_id",
            foreignField: "_id",
            as: "bookings",
          },
        },
        {
          $unwind: {
            path: "$bookings",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $or: [
              // { "bookings.booking_status": "accept" },
              { "bookings.booking_status": { $in: ["accept", "pending"] } },
              { "bookings.calendar_block": true },
            ],
          }
        },


      ]);


      const manual_slot = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $eq: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
      ]);
      // Extract time_slots arrays from data and manual_slot

      // Loop through each time slot in data
      //console.log(
      //"Final Available Slots For Day---",
      //final_available_slots_for_day.time_slots
      //);
      //  console.log("Event data is---", event_data);
      for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          //  console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {

            //  console.log(
            //  "eventdatatimeslot is--",
            // JSON.stringify(eventDataTimeSlot)
            //);

            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlap(
                dataTimeSlot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        dataTimeSlot.busy_status = isBusy ? "busy" : "free";
      }



      /**************************CHECK AVAILABILITY FOR MANUAL SLOTS************************************/

      // Loop through each time slot in data
      for (const manualslot of manual_slot) {
        for (const mslot of manualslot.time_slots) {
          // Initialize a flag to check if the time slot is busy
          let isBusy = false;

          // Loop through each event in event_data
          for (const event of event_data) {
            console.log("Event Data Is----", event_data);
            // Loop through each time slot in the event
            for (const eventDataTimeSlot of event.time_slots) {
              // Check if there is an overlap
              /*   if(event.type=='gog'){
      
                  if(artist_details.data.GOG_city){
                    if(artist_details.data.GOG_city!=req.query.city){
                      isBusy = true;
                      break;
                    }
                  }
      
                
                } */
              var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
              var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
              if (
                checkTimeSlotOverlap(
                  mslot,
                  eventDataTimeSlot,
                  bookingStartDate,
                  bookingEndDate
                )
              ) {
                isBusy = true;
                break; // No need to check further, we found an overlap
              }
            }
            if (isBusy) break; // No need to check further, we found an overlap
          }

          // Set the busy_status in the data time slot
          mslot.busy_status = isBusy ? "busy" : "free";
        }
      }

      if (event_data.length > 0) {
        final_available_slots_for_day.booking_id = event_data[0]._id;
      }

      // Sort the time_slots array by start_time
      final_available_slots_for_day.time_slots.sort((a, b) => {
        return a.start_time.localeCompare(b.start_time);
      });


      const timeSlots = final_available_slots_for_day.time_slots;
      //gagzzz

      // Find the indices of time slots with 'busy' status
      /*    const busyIndices = timeSlots.reduce((indices, slot, index) => {
           if (slot.busy_status === 'busy') {
             indices.push(index);
           }
           return indices;
         }, []);
   
         // Update the adjacent slots based on the busy slots found
         busyIndices.forEach(index => {
           if (index > 0) {
             timeSlots[index - 1].busy_status = 'busy';
           }
           if (index < timeSlots.length - 1) {
             timeSlots[index + 1].busy_status = 'busy';
           }
         }); */

      /*   const downtime = await blocktimeslot.find({
          user_id: id
        }); */
      const downtime = await blocktimeslot.find({
        user_id: id,
        $expr: {
          $and: [
            {
              $lte: [
                { $dateFromParts: { year: { $year: "$start_date" }, month: { $month: "$start_date" }, day: { $dayOfMonth: "$start_date" } } },
                givenDate
              ]
            },
            {
              $gte: [
                { $dateFromParts: { year: { $year: "$end_date" }, month: { $month: "$end_date" }, day: { $dayOfMonth: "$end_date" } } },
                givenDate
              ]
            }
          ]
        }
      });
      console.log("down time is----", downtime);

      /*   downtime.forEach(downtimeSlot => {
          // Extract start_date, end_date, start_time, and end_time from downtime
          const { start_date, end_date, start_time, end_time } = downtimeSlot;
      
          // Check if the given date falls within the range of start_date and end_date
          const isDateInRange = givenDate >= new Date(start_date) && givenDate <= new Date(end_date);
          console.log("is in date range----", isDateInRange);
          if (isDateInRange) {
            data.time_slots.forEach(slot => {
              if (slot.start_time === start_time && slot.end_time === end_time && slot.status === 'free') {
                slot.busy_status = 'busy';
              }
            });
          }
        }); */
      const dataObject = {
        data: final_available_slots_for_day,
        manual_slot
      }
      const timeSlotsData = dataObject.data.time_slots || [];
      const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

      // Merge and sort the time_slots arrays
      const mergedTimeSlots = [...timeSlotsData, ...timeSlotsManual];

      const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
        // Assuming start_time is in "HH:mm:ss" format
        return a.start_time.localeCompare(b.start_time);
      });

      //   sortedTimeSlots[3].busy_status="busy";

      const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
        if (slot.busy_status === 'busy') {
          indices.push(index);
        }
        return indices;
      }, []);

      // Update the adjacent slots based on the busy slots found
      /* old good logic before AM/PM  busyIndices.forEach(index => {
         if (index > 0) {
           sortedTimeSlots[index - 1].busy_status = 'busy';
         }
         if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
           sortedTimeSlots[index + 1].busy_status = 'busy';
         }
       }); */


      busyIndices.forEach(index => {
        if (index > 0) {
          const currentTime = parseInt(sortedTimeSlots[index].start_time.split(":")[0]);
          const prevTime = parseInt(sortedTimeSlots[index - 1].end_time.split(":")[0]);
          console.log("Time is----", currentTime - prevTime);
          // Check if the previous time slot has a one-hour difference
          if (currentTime - prevTime === 0) {
            sortedTimeSlots[index - 1].busy_status = 'busy';
          }
        }

        if (index < sortedTimeSlots.length - 1) {
          const currentTime = parseInt(sortedTimeSlots[index].end_time.split(":")[0]);
          const nextTime = parseInt(sortedTimeSlots[index + 1].start_time.split(":")[0]);
          console.log("Time is----", nextTime - currentTime);
          // Check if the next time slot has a one-hour difference
          if (nextTime - currentTime === 0) {
            sortedTimeSlots[index + 1].busy_status = 'busy';
          }
        }
      });

      //add logic here
      downtime.forEach(downtimeSlot => {
        sortedTimeSlots.forEach(slot => {
          console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
          if (

            formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
            formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
            slot.busy_status === 'free'
          ) {
            console.log("Yea this is true..")
            slot.busy_status = 'busy';
          }
        });
      });

      /*    if(manual_slot && manual_slot.length>0){
   
         downtime.forEach(downtimeSlot => {
           manual_slot.forEach(mSlot => {
             mSlot.time_slots.forEach(slot => {
             console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
             if (
   
               formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
               formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
               slot.busy_status === 'free'
             ) {
               //console.log("Yea this is true..")
               slot.busy_status = 'busy';
             }
           });
         });
         });
       } */



      return res.status(200).json({
        code: 200,
        data: final_available_slots_for_day,
        event_data,
        manual_slot,
        sortedTimeSlots
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

/* function adjustTimeByOneHour(dateTimeString, operation) {
  const date = dateTimeString; //new Date(dateTimeString);

  if (operation === "subtract") {
    date.setHours(date.getHours() - 1);
  } else if (operation === "add") {
    date.setHours(date.getHours() + 1);
  }

  // Format the adjusted date and time as "YYYY-MM-DDTHH:mm:ss"
  const adjustedDateTime = date.toISOString().split(".")[0]; // Remove milliseconds

  return new Date(adjustedDateTime);
} */

function adjustTimeByOneHour(dateTimeString, operation) {
  const date = dateTimeString; //new Date(dateTimeString);

  /*   if (operation === "subtract") {
    date.setHours(date.getHours() - 0); // change it to 1 later 
  } else if (operation === "add") {
    date.setHours(date.getHours() + 0);
  } */

  // Format the adjusted date and time as "YYYY-MM-DDTHH:mm:ss"
  const adjustedDateTime = date.toISOString().split(".")[0]; // Remove milliseconds

  return new Date(adjustedDateTime);
}

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
function checkTimeSlotOverlap(
  dataTimeSlot,
  eventDataTimeSlot,
  eventStartDate,
  eventEndDate
) {
  // Convert time strings to Date objects
  const dataStartTime = new Date(
    `${eventStartDate}T${dataTimeSlot.start_time}`
  );
  const dataEndTime = new Date(`${eventEndDate}T${dataTimeSlot.end_time}`);

  const eventStartTime = adjustTimeByOneHour(
    new Date(`${eventStartDate}T${eventDataTimeSlot.start_time}`),
    "subtract"
  );
  const eventEndTime = adjustTimeByOneHour(
    new Date(`${eventEndDate}T${eventDataTimeSlot.end_time}`),
    "add"
  );
  // Check for overlap

  console.log("event start time---", eventStartTime);
  console.log("event end time----", eventEndTime);
  console.log("data start time---", dataStartTime);
  console.log("data end time is---", dataEndTime);

  console.log(
    dataStartTime +
    "<=" +
    eventEndTime +
    "&&" +
    dataEndTime +
    ">=" +
    eventStartTime
  );
  /* if (dataStartTime <= eventEndTime && dataEndTime >= eventStartTime) {
  return true; // There is an overlap
} */

  console.log(dataStartTime.getTime(), eventStartTime.getTime());
  console.log(dataEndTime.getTime(), eventEndTime.getTime());

  if (
    dataStartTime.getTime() == eventStartTime.getTime() &&
    dataEndTime.getTime() == eventEndTime.getTime() && eventDataTimeSlot.type != "modified"
  ) {
    return true;
  }

  // No need to check further, we found an overlap

  return false; // No overlap
  //return false;

  // return dataStartTime <= eventEndTime && dataEndTime >= eventStartTime;
}

function checkTimeSlotOverlapadminslot(
  dataTimeSlot,
  eventDataTimeSlot,
  eventStartDate,
  eventEndDate
) {
  // Convert time strings to Date objects
  const dataStartTime = new Date(
    `${eventStartDate}T${dataTimeSlot.start_time}`
  );
  const dataEndTime = new Date(`${eventEndDate}T${dataTimeSlot.end_time}`);

  const eventStartTime = adjustTimeByOneHour(
    new Date(`${eventStartDate}T${eventDataTimeSlot.start_time}`),
    "subtract"
  );
  const eventEndTime = adjustTimeByOneHour(
    new Date(`${eventEndDate}T${eventDataTimeSlot.end_time}`),
    "add"
  );
  // Check for overlap

  console.log("event start time---", eventStartTime);
  console.log("event end time----", eventEndTime);
  console.log("data start time---", dataStartTime);
  console.log("data end time is---", dataEndTime);

  console.log(
    dataStartTime +
    "<=" +
    eventEndTime +
    "&&" +
    dataEndTime +
    ">=" +
    eventStartTime
  );
  /* if (dataStartTime <= eventEndTime && dataEndTime >= eventStartTime) {
  return true; // There is an overlap
} */

  console.log(dataStartTime.getTime(), eventStartTime.getTime());
  console.log(dataEndTime.getTime(), eventEndTime.getTime());

  if (
    dataStartTime.getTime() == eventStartTime.getTime() &&
    dataEndTime.getTime() == eventEndTime.getTime() && eventDataTimeSlot.type != "modified"
  ) {
    return true;
  }

  // No need to check further, we found an overlap

  return false; // No overlap
  //return false;

  // return dataStartTime <= eventEndTime && dataEndTime >= eventStartTime;
}
async function getBusyFreeSlots(body) {
  console.log('response-->>', body)
  try {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let id = body.artist_id;

    const givenDate = new Date(body.date);
    const day = givenDate.getDay();

    console.log("given date and day is---", day, id);

    const artist_details = await getItemThroughId(User, id);
    console.log("Artist details are----", artist_details.data.GOG_city);

    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: mongoose.Types.ObjectId(id),
          day: days[day],
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);
    console.log('choose_life_data', choose_life_data)

    if (choose_life_data.length == 0) {
      return {
        code: 400,
        data: "No slots available for this day",
      };
    } else {
      var final_available_slots_for_day = choose_life_data[0];
      console.log("new date given is---" + new Date(givenDate));
      const startOfDay = new Date(givenDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(givenDate);
      endOfDay.setHours(23, 59, 59, 999);
      const event_data = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
      ]);

      for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
        let isBusy = false;
        for (const event of event_data) {
          for (const eventDataTimeSlot of event.time_slots) {
            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlapadminslot(
                dataTimeSlot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break;
            } else {

              const data = body;
              console.log("data-------------------->", data);
              const random_no = String(
                parseInt(Date.now().toString().substring(0, 7)) +
                Math.floor(Math.random() * 9000000) +
                1000000
              );
              data.booking_id = "GR" + random_no.slice(0, 7);
              if (typeof data.time_slots == "string") {
                data.time_slots = JSON.parse(data.time_slots);
              }
              if (req.files && req.files.event_flyer) {
                var image_name = await uploadFile({
                  image_data: req.files.event_flyer,
                  path: "EventFlyer",
                });
                data.event_flyer = image_name.data.Location;
              }
              if (req.files && req.files.event_flyer_two) {
                var image_name_two = await uploadFile({
                  image_data: req.files.event_flyer_two,
                  path: "EventFlyer",
                });
                data.event_flyer_two = image_name_two.data.Location;
              }
              const artist = await User.findOne({
                _id: mongoose.Types.ObjectId(data.artist_id),
              });
              if (!artist) {
                throw buildErrObject(422, "ARTIST NOT FOUND");
              }
              if (typeof data.time_slots === "string") {
                data.time_slots = JSON.parse(data.time_slots);
              }

              // FIND PROMOCODE
              if (data.booking_type == "performance") {
                // Calculate the amount
                data.amount = artist.charges_per_hour * data.time_slots.length;
                // Data.final_amount has to be calculated after applying promo code
                data.final_amount = data.amount;
                if (data.ticket_price == "") {
                  data.ticket_type = "free";
                }
              } else if (data.booking_type == "training") {
                // Calculate the amount
                if (!data.total_disciples) {
                  throw buildErrObject(422, "NUMBER OF DISCIPLES IS MISSING");
                }
                data.amount =
                  artist.charges_per_hour * data.time_slots.length * data.total_disciples;
                data.final_amount = data.amount;
                delete data.event_type;
                data.event_type = "training";
              }

              function subtractTime(timeString) {
                // Parse the original time string
                const [hours, minutes, seconds] = timeString.split(":").map(Number);

                // Calculate the total time in seconds
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;

                // Subtract 5.5 hours (19800 seconds)
                let newTotalSeconds = totalSeconds - 19800;

                // Handle cases where the result may go past midnight
                if (newTotalSeconds < 0) {
                  newTotalSeconds += 86400; // 24 hours in seconds
                }

                // Calculate the new time components
                const newHours = Math.floor(newTotalSeconds / 3600);
                const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
                const newSeconds = newTotalSeconds % 60;

                // Format the result back into "hh:mm:ss.sss" format
                const formattedTime = `${newHours
                  .toString()
                  .padStart(2, "0")}:${newMinutes
                    .toString()
                    .padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}.000`;

                return formattedTime;
              }

              // Example usage
              const originalTime = "10:00:00.000";
              let newTime = subtractTime(data.time_slots[0].start_time);

              // Update the date with the new time
              data.date = data.date + "T" + newTime;

              console.log("data.date-----------------", data.date);

              // Data.final_amount has to be calculated after applying promo code
              const booking = await createItem(Booking, data);
              console.log("Booking info received is----", booking);
              const notificationObj = {
                sender_id: data.user_id.toString(),
                receiver_id: data.artist_id.toString(),
                type: "booking",
                title: "You received a booking request.",
                body: req.body.body,
                sound: "get_real_sound.caf",
                booking_id: booking?.data?._id ? booking.data._id.toString() : null,
                artist_id: data?.artist_id ? data.artist_id.toString() : null,
                user_id: data.user_id ? data.user_id : null,
                amount: data.grand_total ? data.grand_total.toString() : null,
                body: "You have just received a fresh booking request. Kindly consider either accepting or declining it at your earliest convenience.",
              };
              const response = await _sendAdminNotification(notificationObj);
              data.booking_id = booking.data._id;
              data.request_time = new Date().setMinutes(new Date().getMinutes() + 5);
              const acceptance_time = new Date(data.request_time);
              // Add one day to the current date
              acceptance_time.setDate(acceptance_time.getDate() + 1);
              data.acceptance_time = acceptance_time;
              await createItem(Booking_requests, data);

              const actionObj = {
                action: "alert",
                action_by: "user",
                booking_id: booking?.data?._id ? booking.data._id.toString() : null,
                user_id: data.user_id ? data.user_id : null,
              };
              const actions = await createItem(BookingAction, actionObj);

              const address = await getItemThroughId(Address, data.event_location);
              console.log('location --->>', address)
              const eventObj = {
                event_name: "Booking",
                user_id: data.user_id,
                artist_id: data.artist_id,
                type: "booking",
                busy_status: "busy",
                start_date: data.date,
                end_date: data.date,
                event_location: address.data.city ?? '',
                booking_id_id: booking.data._id,
              };
              const event = await createItem(Event, eventObj);
              if (typeof data.time_slots == "string") {
                const time_slots = JSON.parse(data.time_slots);
                time_slots.map(async (slots) => {
                  slots.event_id = event.data._id;
                  await createItem(TimeSlots, slots);
                });
              } else {
                const time_slots = data.time_slots;
                time_slots.map(async (slots) => {
                  slots.event_id = event.data._id;
                  await createItem(TimeSlots, slots);
                });
              }

              return {
                code: 200,
                data: booking.data,
              };
            }

          }

          if (isBusy) break;
        }
      }

      return {
        code: 200,
        data: final_available_slots_for_day,
        event_data: event_data,
      };
    }
  } catch (error) {
    throw error;
  }
}


// exports.createBooking = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("data-------------------->", data);
//     const random_no = String(
//       parseInt(Date.now().toString().substring(0, 7)) +
//       Math.floor(Math.random() * 9000000) +
//       1000000
//     );
//     data.booking_id = "GR" + random_no.slice(0, 7);
//     if (typeof data.time_slots == "string") {
//       data.time_slots = JSON.parse(data.time_slots);
//     }
//     if (req.files && req.files.event_flyer) {
//       var image_name = await uploadFile({
//         image_data: req.files.event_flyer,
//         path: "EventFlyer",
//       });
//       data.flyer_img = image_name.data.Location;
//     }
//     if (req.files && req.files.event_flyer_two) {
//       var image_name_two = await uploadFile({
//         image_data: req.files.event_flyer_two,
//         path: "EventFlyer",
//       });
//       data.event_flyer_two = image_name_two.data.Location;
//     }
//     const artist = await User.findOne({
//       _id: mongoose.Types.ObjectId(data.artist_id),
//     });
//     if (!artist) {
//       throw buildErrObject(422, "ARTIST NOT FOUND");
//     }
//     if (typeof data.time_slots === "string") {
//       data.time_slots = JSON.parse(data.time_slots);
//     }

//     // FIND PROMOCODE
//     if (data.booking_type == "performance") {
//       // Calculate the amount
//       data.amount = artist.charges_per_hour * data.time_slots.length;
//       // Data.final_amount has to be calculated after applying promo code
//       data.final_amount = data.amount;
//       if (data.ticket_price == "") {
//         data.ticket_type = "free";
//       }
//     } else if (data.booking_type == "training") {
//       // Calculate the amount
//       if (!data.total_disciples) {
//         throw buildErrObject(422, "NUMBER OF DISCIPLES IS MISSING");
//       }
//       data.amount =
//         artist.charges_per_hour * data.time_slots.length * data.total_disciples;
//       data.final_amount = data.amount;
//       delete data.event_type;
//       data.event_type = "training";
//     }

//     function subtractTime(timeString) {
//       // Parse the original time string
//       const [hours, minutes, seconds] = timeString.split(":").map(Number);

//       // Calculate the total time in seconds
//       const totalSeconds = hours * 3600 + minutes * 60 + seconds;

//       // Subtract 5.5 hours (19800 seconds)
//       let newTotalSeconds = totalSeconds - 19800;

//       // Handle cases where the result may go past midnight
//       if (newTotalSeconds < 0) {
//         newTotalSeconds += 86400; // 24 hours in seconds
//       }

//       // Calculate the new time components
//       const newHours = Math.floor(newTotalSeconds / 3600);
//       const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
//       const newSeconds = newTotalSeconds % 60;

//       // Format the result back into "hh:mm:ss.sss" format
//       const formattedTime = `${newHours
//         .toString()
//         .padStart(2, "0")}:${newMinutes
//           .toString()
//           .padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}.000`;

//       return formattedTime;
//     }

//     // Example usage
//     const originalTime = "10:00:00.000";
//     let newTime = subtractTime(data.date);
//     const dateObject = new Date(data.date);

//     // Extracting the date components
//     const year = dateObject.getFullYear();
//     const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Zero-padding for single-digit months
//     const day = String(dateObject.getDate()).padStart(2, '0'); // Zero-padding for single-digit days

//     const formattedDates = `${year}-${month}-${day}`;
//     // Update the date with the new time
//     data.admin_date = formattedDates + "T" + data.time_slots[0].start_time;
//     // data.date = data.date + "T" + newTime;

//     console.log("data.date-----------------", data.admin_date);
//     await updateItems(Address, { user_id: data.user_id }, { isDefault: false });
//     data.address.user_id = data.user_id;
//     const latwithlong = data.coordinates
//     data.lat_long = {
//       type: "Point",
//       coordinates: latwithlong
//     }
//     const address = await createItem(Address, data.address);
//     console.log('After Creting Address---->>>', address)
//     console.log('After Creting Address---->>>', address.data._id)
//     const bookingdata = data;
//     bookingdata.event_location = address.data._id
//     const dateObj = data.date;
//     const formattedDate = dateObj.split('T')[0];
//     console.log('Booking Data--->>>', bookingdata)
//     bookingdata.date = formattedDate;

//     // Data.final_amount has to be calculated after applying promo code
//     const booking = await createItem(Booking, bookingdata);
//     console.log("Booking info received is----", booking);
//     const notificationObj = {
//       sender_id: "64f872cc9cbf892c0279b3d4",
//       receiver_id: data.user_id.toString(),
//       type: "booking_request",
//       title: "Admin-Initiated Booking.",
//       body: req.body.body,
//       sound: "get_real_sound.caf",
//       booking_id: booking?.data?._id ? booking.data._id.toString() : null,
//       artist_id: data?.artist_id ? data.artist_id.toString() : null,
//       user_id: data.user_id ? data.user_id : null,
//       amount: data.grand_total ? data.grand_total.toString() : null,
//       body: "Your booking has been successfully completed by the admin on your behalf. Please make the payment to the artist at your earliest convenience",
//     };
//     const response = await _sendAdminNotification(notificationObj);
//     data.booking_id = booking.data._id;
//     data.request_time = new Date().setMinutes(new Date().getMinutes() + 5);
//     const acceptance_time = new Date(data.request_time);
//     // Add one day to the current date
//     acceptance_time.setDate(acceptance_time.getDate() + 1);
//     data.acceptance_time = acceptance_time;
//     await createItem(Booking_requests, data);

//     const actionObj = {
//       action: "alert",
//       action_by: "user",
//       booking_id: booking?.data?._id ? booking.data._id.toString() : null,
//       user_id: data.user_id ? data.user_id : null,
//     };
//     const actions = await createItem(BookingAction, actionObj);



//     // const address = await getItemThroughId(Address, data.event_location);
//     console.log('location --->>', address);
//     const eventObj = {
//       event_name: "Booking",
//       user_id: data.user_id,
//       artist_id: data.artist_id,
//       type: "booking",
//       busy_status: "busy",
//       start_date: data.date,
//       end_date: data.date,
//       event_location: address.data.city ?? '',
//       booking_id_id: booking.data._id,
//     };
//     const event = await createItem(Event, eventObj);
//     if (typeof data.time_slots == "string") {
//       try {
//         const time_slots = JSON.parse(data.time_slots);
//         time_slots.map(async (slots) => {
//           slots.event_id = event.data._id;
//           await createItem(TimeSlots, slots);
//         });

//       } catch (error) {
//         console.log("error")
//       }
//     } else {

//       const time_slots = data.time_slots;
//       time_slots.map(async (slots) => {
//         try {

//           slots.event_id = event.data._id;

//           const eventdata = {
//             event_id: slots.event_id,
//             start_time: slots.start_time,
//             end_time: slots.end_time,
//             status: slots.status,
//             type: slots.type,
//           }
//           await createItem(TimeSlots, eventdata);
//         } catch (error) {
//           console.log("error")
//         }
//       });

//     }


//     res.status(200).json({ code: 200, data: booking.data })
//   } catch (error) {
//     handleError(res, error);
//   }
// };

exports.createBooking = async (req, res) => {
  try {
    const data = req.body;
    console.log("data-------------------->", data);

    const random_no = String(
      parseInt(Date.now().toString().substring(0, 7)) +
      Math.floor(Math.random() * 9000000) +
      1000000
    );
    data.booking_id = "GR" + random_no.slice(0, 7);
    // data.user_id = req.user._id;
    if (typeof data.time_slots == "string") {
      data.time_slots = JSON.parse(data.time_slots);
    }
    if (req.files && req.files.event_flyer) {
      var image_name = await uploadFile({
        image_data: req.files.event_flyer,
        path: "EventFlyer",
      });
      data.event_flyer = image_name.data.Location;
    }
    // if (req.files && req.files.event_flyer_two) {
    //   var image_name_two = await uploadFile({
    //     image_data: req.files.event_flyer_two,
    //     path: "EventFlyer",
    //   });
    //   data.event_flyer_two = image_name_two.data.Location;
    // }

    const artist = await User.findOne({
      _id: mongoose.Types.ObjectId(data.artist_id),
    });
    if (!artist) {
      throw buildErrObject(422, "ARTIST NOT FOUND");
    }
    //FIND PROMOCODE
    if (data.booking_type == "performance") {
      // data.amount    //---> have to calculate
      data.booking_by = "admin"
      data.amount = artist.charges_per_hour * data.time_slots.length;
      //data.final_amount have to be calculated after promocode
      data.final_amount = data.amount;
      if (data.ticket_price == "") {
        data.ticket_type = "free";
      }
    } else if (data.booking_type == "training") {
      // data.amount    //---> have to calculate
      data.booking_by = "admin"
      if (!data.total_disciples) {
        throw buildErrObject(422, "NUMBER OF DISCIPLES IS MISSING");
      }
      data.amount =
        artist.charges_per_hour * data.time_slots.length * data.total_disciples;
      data.final_amount = data.amount;
      delete data.event_type;
      data.event_type = "training";
    }

    function subtractTime(timeString) {
      // Parse the original time string
      const [hours, minutes, seconds] = timeString.split(":").map(Number);

      // Calculate the total time in seconds
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      // Subtract 5.5 hours (19800 seconds)
      let newTotalSeconds = totalSeconds - 19800;

      // Handle cases where the result may go past midnight
      if (newTotalSeconds < 0) {
        newTotalSeconds += 86400; // 24 hours in seconds
      }

      // Calculate the new time components
      const newHours = Math.floor(newTotalSeconds / 3600);
      const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
      const newSeconds = newTotalSeconds % 60;

      // Format the result back into "hh:mm:ss.sss" format
      const formattedTime = `${newHours
        .toString()
        .padStart(2, "0")}:${newMinutes
          .toString()
          .padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}.000`;

      return formattedTime;
    }

    // Example usage
    const originalTime = "10:00:00.000";
    let newTime = subtractTime(data.time_slots[0].start_time);

    /*** Prateek Code ***/
    data.admin_date = data.date + "T" + newTime;

    console.log("data.date-----------------", data.date);
    /******************* */
    //data.final_amount have to be calculated after promocode

    const booking = await createItem(Booking, data);
    console.log("Booking info received is----", booking);

    // const notificationObj = {
    //   sender_id: req.body.user_id.toString(),
    //   receiver_id: data.artist_id.toString(),
    //   type: "booking",
    //   title: "You recieved booking request.",
    //   body: req.body.body,
    //   sound: "get_real_sound.caf",
    //   booking_id: booking?.data?._id ? booking.data._id.toString() : null,
    //   artist_id: data?.artist_id ? data.artist_id.toString() : null,
    //   user_id: req?.user?._id ? req?.user?._id.toString() : null,
    //   amount: data.grand_total ? data.grand_total.toString() : null,
    //   artist_total_fee: data.artist_total_fee
    //     ? data.artist_total_fee.toString()
    //     : null,
    //   body: "You have just received a fresh booking request. Kindly consider either accepting or declining it at your earliest convenience.",
    // };
    // const response = await _sendNotification(notificationObj);
    const admin = await Admin.findOne({});
    const users = await User.findOne({
      _id: mongoose.Types.ObjectId(req.body.user_id),
    });
    const notificationObjAdmin = {
      sender_id: req.body.user_id.toString(),//admin._id.toString(),
      receiver_id: req.body.user_id.toString(),
      type: "booking_request",
      user_type: "user",
      title: `Admin-Initiated Booking.`,
      body: req.body.body,
      sound: "get_real_sound.caf",
      booking_id: booking?.data?._id ? booking.data._id.toString() : null,
      artist_id: data?.artist_id ? data.artist_id.toString() : null,
      user_id: req.body.user_id ? req.body.user_id.toString() : null,
      amount: data.grand_total ? data.grand_total.toString() : null,
      artist_total_fee: data.artist_total_fee
        ? data.artist_total_fee.toString()
        : null,
      body: "You have just received a fresh booking request. Kindly consider either accepting or declining it at your earliest convenience.",
    };
    const responseAdmin = await _sendNotification(notificationObjAdmin);
    data.booking_id = booking.data._id;
    data.request_time = new Date().setMinutes(new Date().getMinutes() + 5);
    const acceptance_time = new Date(data.request_time);
    // Add one day to the current date
    acceptance_time.setDate(acceptance_time.getDate() + 1);
    data.acceptance_time = acceptance_time;
    await createItem(Booking_requests, data);
    const actionObj = {
      action: "alert",
      action_by: "user",
      booking_id: booking?.data?._id ? booking.data._id.toString() : null,
      user_id: req.body.user_id ? req.body.user_id.toString() : null,
    };
    const actions = await createItem(BookingAction, actionObj);
    const address = await getItemThroughId(Address, data.event_location);
    const eventObj = {
      event_name: "Booking",
      user_id: req.body.user_id,
      artist_id: data.artist_id,
      type: "booking",
      busy_status: "busy",
      start_date: data.date,
      end_date: data.date,
      event_location: address.data.city,
      booking_id: booking.data._id,
    };
    const template = `GetREAL: Exciting News! You are in demand for an upcoming event on ${data.admin_date} at ${address.data.city} . Confirm your availability to secure the gig. Shine on!`
    const sendupcoming = await sendSMS(data.artist_id.toString(), template)
    const event = await createItem(Event, eventObj);
    // if (typeof data.time_slots == "string") {
    //   const time_slots = JSON.parse(data.time_slots);
    //   time_slots.map(async (slots) => {
    //     slots.event_id = event.data._id;
    //     await createItem(TimeSlots, slots);
    //   });
    // } else {
    //   const time_slots = data.time_slots;
    //   time_slots.map(async (slots) => {
    //     slots.event_id = event.data._id;
    //     await createItem(TimeSlots, slots);
    //   });
    // }
    if (typeof data.time_slots == "string") {
      try {
        const time_slots = JSON.parse(data.time_slots);
        time_slots.map(async (slots) => {
          try {
            slots.event_id = event.data._id;
            await createItem(TimeSlots, slots);
          } catch (error) {
            // Handle or log the error for the specific item creation
            console.error("Error creating TimeSlot:", error);
          }
        });
      } catch (error) {
        // Handle or log the error for JSON parsing
        console.error("Error parsing time_slots JSON:", error);
      }
    } else {
      try {
        const time_slots = data.time_slots;
        time_slots.map(async (slots) => {
          try {
            slots.event_id = event.data._id;
            await createItem(TimeSlots, slots);
          } catch (error) {
            // Handle or log the error for the specific item creation
            console.error("Error creating TimeSlot:", error);
          }
        });
      } catch (error) {
        // Handle or log the error for the case when data.time_slots is not a string
        console.error("Error handling time_slots:", error);
      }
    }
    return res.status(200).json({
      code: 200,
      data: booking.data,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.checkBookingTimeslot = async (req, res) => {
  const artistId = mongoose.Types.ObjectId(req.body.artist_id);
  try {
    const bookingData = await Booking.find({ artist_id: artistId });
    console.log('bookingData', bookingData);

    const checkDate = new Date(req.body.date);
    const startTime = req.body.start_time;
    const endTime = req.body.end_time;

    let isBooked = false;

    for (const booking of bookingData) {
      const bookingDate = new Date(booking.date);

      // Check if the dates match
      if (checkDate.toDateString() === bookingDate.toDateString()) {
        console.log('date is matched')
        for (const timeSlot of booking.time_slots) {
          const bookingStartTime = timeSlot.start_time;
          const bookingEndTime = timeSlot.end_time;

          // Check if the provided time slot matches an existing booking exactly
          console.log('startTime.getTime()', startTime)
          console.log('endTime.getTime()', endTime)
          console.log('bookingStartTime.getTime() ', bookingStartTime)
          console.log('bookingEndTime.getTime()', bookingEndTime)
          if (
            startTime === bookingStartTime &&
            endTime === bookingEndTime
          ) {
            // There is an exact match; the time slot is already booked
            isBooked = true;
            break; // Exit the loop when a match is found
          }
        }
      }
      if (isBooked) {
        break; // Exit the outer loop when a match is found
      }
    }

    if (isBooked) {
      // The provided time slot is already booked
      return res.status(400).json({
        code: 400,
        data: "The time slot is already booked.",
      });
    } else {
      // The provided time slot is available
      return res.status(200).json({
        code: 200,
        data: "The time slot is available.",
      });
    }
  } catch (error) {
    handleError(res, error);
  }




};


exports.getnotificationforadmin = async (req, res) => {
  try {
    const data = req.query
    let resp, allresp, allrespun, respun
    if (data.type == "read") {

      await Notification.updateMany({ receiver_id: mongoose.Types.ObjectId(req.user._id) }, { $set: { is_seen: true } });
      allresp = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id) })
      resp = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id) }).sort({ createdAt: -1 }).limit(req.query.limit).skip(req.query.offset)
      allrespun = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id), is_seen: false, })
      respun = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id), is_seen: false, }).sort({ createdAt: -1 }).limit(req.query.limit).skip(req.query.offset)
      return res.status(200).json({
        code: 200,
        count: allresp.length,
        data: resp,
        unread: {
          count: allrespun.length,
          all: allrespun,
          allwithlimit: respun
        }
      });
    } else {

      allresp = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id) })
      resp = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id) }).sort({ createdAt: -1 }).limit(req.query.limit).skip(req.query.offset)
      allrespun = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id), is_seen: false, })
      respun = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id), is_seen: false, }).sort({ createdAt: -1 }).limit(req.query.limit).skip(req.query.offset)
      return res.status(200).json({
        code: 200,
        count: allresp.length,
        data: resp,
        unread: {
          count: allrespun.length,
          all: allrespun,
          allwithlimit: respun
        }
      });
    }

  } catch (error) {
    handleError(res, error);
  }
};

exports.citieslistingforartist = async (req, res) => {
  try {
    // const data = req.body

    const allresp = await User.find({ isAway: false, GOG_status: true })
    const map = allresp.map((x) => x.GOG_city)

    const resp = await User.find({ current_location_status: "base" })
    const map1 = resp.map((x) => x.base_location)
    const respinse = [...map, ...map1]
    return res.status(200).json({
      code: 200,
      count: respinse.length,
      data: respinse,
    });
  } catch (error) {
    handleError(res, error);
  }
};



exports.getUnreadNotificationforadmin = async (req, res) => {
  try {
    // const data = req.body
    const allresp = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id), is_seen: false, })
    const resp = await Notification.find({ receiver_id: mongoose.Types.ObjectId(req.user._id), is_seen: false, }).sort({ createdAt: -1 }).limit(req.query.limit).skip(req.query.offset)
    return res.status(200).json({
      code: 200,
      count: allresp.length,
      data: resp,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deletenotificationforadmin = async (req, res) => {
  try {
    if (req.body.type === 'all') {
      // Delete all notifications for the user
      await Notification.deleteMany({ receiver_id: mongoose.Types.ObjectId(req.user._id) });

      return res.status(200).json({
        code: 200,
        message: 'All notifications deleted successfully',
      });
    } else {
      // Delete a single notification by its ID
      if (!req.body.notificationId) {
        return res.status(400).json({
          code: 400,
          message: 'Notification ID is required for deleting a single notification',
        });
      }

      const notificationToDelete = await Notification.findOneAndDelete({
        _id: mongoose.Types.ObjectId(req.body.notificationId),
      });

      if (!notificationToDelete) {
        return res.status(404).json({
          code: 404,
          message: 'Notification not found for deletion',
        });
      }

      return res.status(200).json({
        code: 200,
        message: 'Notification deleted successfully',
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

exports.allrecentsearchforuserMAnagment = async (req, res) => {
  try {
    const data = req.query;
    let response = await recent_search.find({ user_id: data.user_id, type: "recent" })
    res.status(200).json({ code: 200, response });
  } catch (error) {
    handleError(res, error);
  }
}







exports.deletemultipleuser = async (req, res) => {
  try {

    const data = req.body;

    if (data.type == "user_managment") {

      try {

        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(User, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }

    if (data.type == "booking_managment") {


      try {


        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(Booking, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }

    }



    if (data.type == "category") {
      // const _id = req.params._id;
      try {


        data.user_id.forEach(async (_id) => {
          const findarrauofsubcategory = await ArtCategory.findOne({ _id: _id })
          for (let i = 0; i < findarrauofsubcategory.subCategories.length; i++) {
            const categoryId = findarrauofsubcategory.subCategories[i];
            await deleteSubcategoryAndChildren(categoryId);
          }
          const deleted = await deleteItem(ArtCategory, _id);
          await ArtCategory.updateMany(
            { subCategories: { $in: [_id] } }, // Filter to find all categories with the specified subcategory _id
            { $pull: { subCategories: _id } }, { parent: null }
          );
          // await deleteSubcategories(_id);
          return res.status(200).json({ code: 200, data: deleted })
        })

      } catch (error) {
        handleError(res, error);
      }

    }


    if (data.type == "headline") {
      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(Headline, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }

    if (data.type == "dispute") {
      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(Disputes, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }

    if (data.type == "sub_admin") {
      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(Admin, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }


    if (data.type == "FaqTopic") {

      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(FaqTopic, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }


    if (data.type == "notification") {
      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(Notification, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }


    if (data.type == "artist_post") {
      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(artist_post, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }

    if (data.type == "admin_post") {
      try {

        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(addPost, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }

    if (data.type == "reported_post") {
      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(Report, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }

    if (data.type == "walkthrough") {
      try {
        data.user_id.forEach(async (element) => {


          const fAQ = await deleteItem(WalkThrough, element)
          return res.status(200).json({
            code: 200,
            data: fAQ
          });
        });
      } catch (error) {
        handleError(res, error);
      }
    }

    if (data.type == "walkthroughLocation") {
      data.user_id.forEach(async (element) => {


        const fAQ = await deleteItem(WalkThroughlocation, element)
        return res.status(200).json({
          code: 200,
          data: fAQ
        });
      });
    }

    if (data.type == "popularCity") {
      data.user_id.forEach(async (element) => {


        const fAQ = await deleteItem(popularCity, element)
        return res.status(200).json({
          code: 200,
          data: fAQ
        });
      });
    }
    if (data.type == "coupon") {
      data.user_id.forEach(async (element) => {


        const fAQ = await deleteItem(coupon, element)
        return res.status(200).json({
          code: 200,
          data: fAQ
        });
      });
    }

    if (data.type == "Slides") {
      data.user_id.forEach(async (element) => {


        const fAQ = await deleteItem(Slides, element)
        return res.status(200).json({
          code: 200,
          data: fAQ
        });
      });
    }
    // else {
    //   console.log("error==========")
    // }
  } catch (error) {
    handleError(res, error);
  }

}

exports.getalluserFirstnameacctoIds = async (req, res) => {
  try {
    const data = req.body
    let map
    if (data.type == "location") {
      const findlocation = await Address.find({ _id: { $in: data.user_id } })
      map = findlocation.map((x) => x.city)
    }

    if (data.type == "user" || data.type == "artist") {
      const finduser = await User.find({ _id: { $in: data.user_id } })
      map = finduser.map((x) => data.type == "user" ? x.first_name + " " + x.last_name : x.stage_name)

    }
    res.status(200).json({ code: 200, response: map });
  } catch (error) {
    handleError(res, error);
  }
}

exports.downloadImage = async (req, res) => {
  try {

    const imageUrl = req.query.image_url;
    // Fetch the image from the public URL
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    // Set the headers to force download
    res.setHeader('Content-disposition', 'attachment; filename=image.jpg');
    res.setHeader('Content-type', 'image/jpeg');
    // Pipe the image stream to the response
    response.data.pipe(res);

  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteImage = async (req, res) => {
  try {

    const imageUrl = req.query.image_url;
    // Fetch the image from the public URL
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    // Set the headers to force download
    res.setHeader('Content-disposition', 'attachment; filename=image.jpg');
    res.setHeader('Content-type', 'image/jpeg');
    // Pipe the image stream to the response
    response.data.pipe(res);

  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteEventPromotionImage = async (req, res) => {
  const eventId = req.params.id;
  const columnToRemove = req.query.column;

  try {
    let updateQuery = {};
    if (columnToRemove === 'event_flyer') {
      // Remove the specified column
      // updateQuery[columnToRemove] = undefined;
      updateQuery.event_flyer = null
      // if (user.promotional_notification) {
      //   update = { promotional_notification: false };
      // }
    } else if (columnToRemove === "event_flyer_two") {
      updateQuery.event_flyer_two = null
    } else {
      return res.status(400).json({ error: 'Invalid column parameter' });
    }

    const updatedEventPromotion = await Event_promotion.findOneAndUpdate(
      { _id: eventId },
      updateQuery,
      { new: true }
    );

    if (!updatedEventPromotion) {
      return res.status(404).json({ error: 'Event promotion not found' });
    }

    res.status(200).json(updatedEventPromotion);
  } catch (error) {
    console.error('Error updating event promotion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// privacy_polivy 
exports.addcms = async (req, res) => {
  try {
    const data = req.body;


    const slides_data = await createItem(cms, data);
    return res.status(200).json(slides_data);
  } catch (error) {

    handleError(res, error);
  }
};

exports.getprivacyandaboutus = async (req, res) => {
  try {

    const data = req.query;
    let sortcoindition;
    let whereObj = {}

    if (data.type == "web") {
      whereObj.type = "web";
    } else {
      whereObj.type = "app";
    }


    if (data._id) {
      // whereObj._id = data._id
      const byid = await cms.findById(data._id)
      return res.status(200).json({
        code: 200,
        data: byid
      });
    } else {
      if (data.sort == "old") {
        sortcoindition = { createdAt: 1 }
      } else {
        sortcoindition = { createdAt: -1 }
      }
      if (data.search) {
        whereObj.$or = [
          { coupon_name: { $regex: data.search, $options: "i" } },
          // { description: { $regex: data.search, $options: "i" } },
        ];
      }
      if (data.type == "web") {
        whereObj.type = "web";
      } else {
        whereObj.type = "app";
      }

      const limit = data.limit ? data.limit : 100;
      const offset = data.offset ? data.offset : 0;

      let slides_data = await cms.find(whereObj).sort(sortcoindition).skip(offset).limit(limit);
      // await getItemsCustom(cms, whereObj, "", "", sortcoindition, limit, offset);
      slides_data.count = await cms.find(whereObj).count();
      return res.status(200).json({
        code: 200,
        data: slides_data
      });
    }


    // return res.status(200).json({
    //   code: 200,
    //   data:slides_data
    // });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deletecms = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(cms, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updatecms = async (req, res) => {
  try {
    const data = req.body;
    // if (req.files && req.files.media) {
    //   var media = await uploadFile({
    //     image_data: req.files.media,
    //     path: "Slides",
    //   });
    //   data.media = media.data.Location;
    // }

    const slide_data = await updateItemThroughId(cms, data._id, data);
    return res.status(200).json(slide_data);
  } catch (error) {

    handleError(res, error);
  }
};

function formatTime(inputTime) {
  if (inputTime.endsWith('.000')) {
    // Remove the trailing '.000' if it exists
    return inputTime.slice(0, -4);
  } else {
    // If the format is already 'HH:MM:SS', return as it is
    return inputTime;
  }
}

// exports.getBusyFreeSlotsLogic = async (req, res) => {
//   try {
//     let id;
//     let days = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     console.log("data received here is---", req.query);
//     if (req.query.user_id) {
//       console.log("by direct");
//       id = mongoose.Types.ObjectId(req.query.user_id);
//     } else {
//       console.log("throw token");
//       id = req.user._id;
//     }

//     const givenDate = new Date(req.query.given_date);

//     const day = givenDate.getDay();

//     console.log("given date and day is---", day);

//     const artist_details = await getItemThroughId(User, req.query.user_id);
//     console.log("Artist details are----", artist_details);

//     const choose_life_data = await ChooseLife.aggregate([
//       {
//         $match: {
//           user_id: id,
//           day: days[day],
//         },
//       },
//       {
//         $lookup: {
//           from: "timeslots",
//           localField: "_id",
//           foreignField: "event_id",
//           as: "time_slots",
//         },
//       },
//     ]);

//     if (choose_life_data.length == 0) {
//       return res.status(404).json({
//         code: 400,
//         data: "No slots available for this day",
//         //event_data
//       });
//     } 
//     else {
//       var final_available_slots_for_day = choose_life_data[0];
//       console.log("new date given is---" + new Date(givenDate));

//       const startOfDay = new Date(givenDate);
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date(givenDate);
//       endOfDay.setHours(23, 59, 59, 999);
//       /*    const event_data = await Event.aggregate([ //gagzzz
//            {
//              $match: {
//                artist_id: id,
//                start_date: { $lte: endOfDay },
//                end_date: { $gte: startOfDay },
//                description: { $ne: "manual" },
//              },
//            },
//            {
//              $lookup: {
//                from: "timeslots",
//                localField: "_id",
//                foreignField: "event_id",
//                as: "time_slots",
//              },
//            },
//          ]); */


//          const event_data = await Event.aggregate([
//           {
//             $match: {
//               artist_id: id,
//               start_date: { $lte: endOfDay },
//               end_date: { $gte: startOfDay },
//               description: { $ne: "manual" },
//             },
//           },
//           {
//             $lookup: {
//               from: "timeslots",
//               localField: "_id",
//               foreignField: "event_id",
//               as: "time_slots",
//             },
//           },
//           /* {
//             $unwind: "$time_slots" // Expand the time_slots array
//           },
//           {
//             $match: {
//               "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
//             }
//           }, */
//           /*  {
//              $group: {
//                _id: "$_id",
//                // You can include other fields you want from the initial collection
//                // Sample field inclusion: name: { $first: "$name" }
//                time_slots: { $push: "$time_slots" } // Collect filtered time_slots
//              }
//            }, */
//           {
//             $lookup: {
//               from: "bookings",
//               localField: "booking_id",
//               foreignField: "_id",
//               as: "bookings",
//             },
//           },
//           {
//             $unwind: {
//               path: "$bookings",
//               preserveNullAndEmptyArrays: true,
//             },
//           },
//           {
//             $match: {
//               $or: [
//                // { "bookings.booking_status": "accept" },
//                { "bookings.booking_status": { $in: ["accept", "pending"] } },
//                 { "bookings.calendar_block": true },
//               ],
//             }
//           },


//         ]);

//       const bookingtime = await Event.aggregate([
//         {
//           $match: {
//             artist_id: id,
//             start_date: { $lte: endOfDay },
//             end_date: { $gte: startOfDay },
//             type: { $eq: "booking" },
//           },
//         },
//         {
//           $lookup: {
//             from: "timeslots",
//             localField: "_id",
//             foreignField: "event_id",
//             as: "time_slots",
//           },
//         },
//         /* {
//           $unwind: "$time_slots" // Expand the time_slots array
//         },
//         {
//           $match: {
//             "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
//           }
//         }, */
//         /*  {
//            $group: {
//              _id: "$_id",
//              // You can include other fields you want from the initial collection
//              // Sample field inclusion: name: { $first: "$name" }
//              time_slots: { $push: "$time_slots" } // Collect filtered time_slots
//            }
//          }, */
//         {
//           $lookup: {
//             from: "bookings",
//             localField: "booking_id",
//             foreignField: "_id",
//             as: "bookings",
//           },
//         },
//         {
//           $unwind: {
//             path: "$bookings",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $match: {
//             $or: [
//              // { "bookings.booking_status": "accept" },
//              { "bookings.booking_status": { $in: ["accept", "pending"] } },
//               { "bookings.calendar_block": true },
//             ],
//           }
//         },


//       ]);

//       const manual_slot = await Event.aggregate([
//         {
//           $match: {
//             artist_id: id,
//             start_date: { $lte: endOfDay },
//             end_date: { $gte: startOfDay },
//             description: { $eq: "manual" },
//             // busy_status:{ $eq: "busy" }
//           },
//         },
//         {
//           $lookup: {
//             from: "timeslots",
//             localField: "_id",
//             foreignField: "event_id",
//             as: "time_slots",
//           },
//         },
//       ]);
//       for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
//         // Initialize a flag to check if the time slot is busy
//         let isBusy = false;

//         // Loop through each event in event_data
//         for (const event of event_data) {
//           console.log("Event Data Is----", event_data);
//           // Loop through each time slot in the event
//           for (const eventDataTimeSlot of event.time_slots) {

//             console.log(
//               "eventdatatimeslot is--",
//               JSON.stringify(eventDataTimeSlot)
//             );

//             var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
//             var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
//             if (
//               checkTimeSlotOverlapadminslot(
//                 dataTimeSlot,
//                 eventDataTimeSlot,
//                 bookingStartDate,
//                 bookingEndDate
//               )
//             ) {
//               isBusy = true;
//               break; // No need to check further, we found an overlap
//             }
//           }
//           if (isBusy) break; // No need to check further, we found an overlap
//         }

//         // Set the busy_status in the data time slot
//         dataTimeSlot.busy_status = isBusy ? "busy" : "free";
//       }


//       for (const manualslot of manual_slot) {
//         for (const mslot of manualslot.time_slots) {
//           // Initialize a flag to check if the time slot is busy
//           let isBusy = false;

//           // Loop through each event in event_data
//           for (const event of event_data) {
//             console.log("Event Data Is----", event_data);
//             // Loop through each time slot in the event
//             for (const eventDataTimeSlot of event.time_slots) {
//               // Check if there is an overlap
//               /*   if(event.type=='gog'){

//                   if(artist_details.data.GOG_city){
//                     if(artist_details.data.GOG_city!=req.query.city){
//                       isBusy = true;
//                       break;
//                     }
//                   }


//                 } */
//               var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
//               var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
//               if (
//                 checkTimeSlotOverlap(
//                   mslot,
//                   eventDataTimeSlot,
//                   bookingStartDate,
//                   bookingEndDate
//                 )
//               ) {
//                 isBusy = true;
//                 break; // No need to check further, we found an overlap
//               }
//             }
//             if (isBusy) break; // No need to check further, we found an overlap
//           }

//           // Set the busy_status in the data time slot
//           mslot.busy_status = isBusy ? "busy" : "free";
//         }
//       }
//       const gog = await Event.aggregate([
//         {
//           $match: {
//             artist_id: id,
//             // start_date: { $lte: endOfDay },
//             // end_date: { $gte: startOfDay },
//             type: { $eq: "gog" },
//           },
//         },
//         {
//           $lookup: {
//             from: "timeslots",
//             localField: "_id",
//             foreignField: "event_id",
//             as: "time_slots",
//           },
//         },
//         /* {
//           $unwind: "$time_slots" // Expand the time_slots array
//         },
//         {
//           $match: {
//             "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
//           }
//         }, */
//         /*  {
//            $group: {
//              _id: "$_id",
//              // You can include other fields you want from the initial collection
//              // Sample field inclusion: name: { $first: "$name" }
//              time_slots: { $push: "$time_slots" } // Collect filtered time_slots
//            }
//          }, */
//         {
//           $lookup: {
//             from: "bookings",
//             localField: "booking_id",
//             foreignField: "_id",
//             as: "bookings",
//           },
//         },
//         {
//           $unwind: {
//             path: "$bookings",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $match: {
//             $or: [
//              // { "bookings.booking_status": "accept" },
//              { "bookings.booking_status": { $in: ["accept", "pending"] } },
//               { "bookings.calendar_block": true },
//             ],
//           }
//         },


//       ]);

//       const downtime = await blocktimeslot.find({
//         user_id: id,
//         $expr: {
//           $and: [
//             {
//               $lte: [
//                 { $dateFromParts: { year: { $year: "$start_date" }, month: { $month: "$start_date" }, day: { $dayOfMonth: "$start_date" } } },
//                 givenDate
//               ]
//             },
//             {
//               $gte: [
//                 { $dateFromParts: { year: { $year: "$end_date" }, month: { $month: "$end_date" }, day: { $dayOfMonth: "$end_date" } } },
//                 givenDate
//               ]
//             }
//           ]
//         }
//       });
//       console.log("down time is----", downtime);

//   const dataObject={
//           data:final_available_slots_for_day,
//           manual_slot
//         }
//         const timeSlotsData = dataObject.data.time_slots || [];
//         const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

//         // Merge and sort the time_slots arrays
//         const mergedTimeSlots = [...timeSlotsData, ...timeSlotsManual];

//         const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
//           // Assuming start_time is in "HH:mm:ss" format
//           return a.start_time.localeCompare(b.start_time);
//         });


//         const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
//           if (slot.busy_status === 'busy') {
//             indices.push(index);
//           }
//           return indices;
//         }, []);

//         // Update the adjacent slots based on the busy slots found
//         busyIndices.forEach(index => {
//           if (index > 0) {
//             sortedTimeSlots[index - 1].busy_status = 'busy';
//           }
//           if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
//             sortedTimeSlots[index + 1].busy_status = 'busy';
//           }
//         });

//         //add logic here
//       downtime.forEach(downtimeSlot => {
//         sortedTimeSlots.forEach(slot => {
//           console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
//           if (

//             formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
//             formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) 
//             // slot.busy_status === 'free'
//             ) {
//             console.log( slot.busy_status)
//             //console.log("Yea this is true..")
//             slot.busy_status = 'busy';
//           }
//         });
//       });

//    /*    if(manual_slot && manual_slot.length>0){

//       downtime.forEach(downtimeSlot => {
//         manual_slot.forEach(mSlot => {
//           mSlot.time_slots.forEach(slot => {
//           console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
//           if (

//             formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
//             formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
//             slot.busy_status === 'free'
//           ) {
//             //console.log("Yea this is true..")
//             slot.busy_status = 'busy';
//           }
//         });
//       });
//       });
//     } */

//       return res.status(200).json({
//         code: 200,
//         data: final_available_slots_for_day,
//         data1: bookingtime,
//         event_data,
//         manual_slot,
//         gog,
//         downtime,
//         sortedTimeSlots
//       });
//     }
//   } catch (error) {
//     handleError(res, error);
//   }
// };


// exports.getBusyFreeSlotsLogic = async (req, res) => {
//   try {
//     let id;
//     let days = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     console.log("data received here is---", req.query);
//     if (req.query.user_id) {
//       console.log("by direct");
//       id = mongoose.Types.ObjectId(req.query.user_id);
//     } else {
//       console.log("throw token");
//       id = req.user._id;
//     }

//     const givenDate = new Date(req.query.given_date);

//     const day = givenDate.getDay();

//     console.log("given date and day is---", day);

//     const artist_details = await getItemThroughId(User, req.query.user_id);
//     console.log("Artist details are----", artist_details);

//     const choose_life_data = await ChooseLife.aggregate([
//       {
//         $match: {
//           user_id: id,
//           day: days[day],
//         },
//       },
//       {
//         $lookup: {
//           from: "timeslots",
//           localField: "_id",
//           foreignField: "event_id",
//           as: "time_slots",
//         },
//       },
//     ]);

//     if (choose_life_data.length == 0) {
//       return res.status(404).json({
//         code: 400,
//         data: "No slots available for this day",
//         //event_data
//       });
//     } else {
//       var final_available_slots_for_day = choose_life_data[0];
//       console.log("new date given is---" + new Date(givenDate));

//       const startOfDay = new Date(givenDate);
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date(givenDate);
//       endOfDay.setHours(23, 59, 59, 999);
//       /*    const event_data = await Event.aggregate([ //gagzzz
//            {
//              $match: {
//                artist_id: id,
//                start_date: { $lte: endOfDay },
//                end_date: { $gte: startOfDay },
//                description: { $ne: "manual" },
//              },
//            },
//            {
//              $lookup: {
//                from: "timeslots",
//                localField: "_id",
//                foreignField: "event_id",
//                as: "time_slots",
//              },
//            },
//          ]); */


//       const event_data = await Event.aggregate([
//         {
//           $match: {
//             artist_id: id,
//             start_date: { $lte: endOfDay },
//             end_date: { $gte: startOfDay },
//             description: { $ne: "manual" },
//           },
//         },
//         {
//           $lookup: {
//             from: "timeslots",
//             localField: "_id",
//             foreignField: "event_id",
//             as: "time_slots",
//           },
//         },
//         /* {
//           $unwind: "$time_slots" // Expand the time_slots array
//         },
//         {
//           $match: {
//             "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
//           }
//         }, */
//         /*  {
//            $group: {
//              _id: "$_id",
//              // You can include other fields you want from the initial collection
//              // Sample field inclusion: name: { $first: "$name" }
//              time_slots: { $push: "$time_slots" } // Collect filtered time_slots
//            }
//          }, */
//         {
//           $lookup: {
//             from: "bookings",
//             localField: "booking_id",
//             foreignField: "_id",
//             as: "bookings",
//           },
//         },
//         {
//           $unwind: {
//             path: "$bookings",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $match: {
//             $or: [
//              // { "bookings.booking_status": "accept" },
//              { "bookings.booking_status": { $in: ["accept", "pending"] } },
//               { "bookings.calendar_block": true },
//             ],
//           }
//         },


//       ]);


//       const manual_slot = await Event.aggregate([
//         {
//           $match: {
//             artist_id: id,
//             start_date: { $lte: endOfDay },
//             end_date: { $gte: startOfDay },
//             description: { $eq: "manual" },
//           },
//         },
//         {
//           $lookup: {
//             from: "timeslots",
//             localField: "_id",
//             foreignField: "event_id",
//             as: "time_slots",
//           },
//         },
//       ]);
//       // Extract time_slots arrays from data and manual_slot

//       // Loop through each time slot in data
//       console.log(
//         "Final Available Slots For Day---",
//         final_available_slots_for_day.time_slots
//       );
//       console.log("Event data is---", event_data);
//       for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
//         // Initialize a flag to check if the time slot is busy
//         let isBusy = false;

//         // Loop through each event in event_data
//         for (const event of event_data) {
//           console.log("Event Data Is----", event_data);
//           // Loop through each time slot in the event
//           for (const eventDataTimeSlot of event.time_slots) {

//             console.log(
//               "eventdatatimeslot is--",
//               JSON.stringify(eventDataTimeSlot)
//             );

//             var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
//             var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
//             if (
//               checkTimeSlotOverlap(
//                 dataTimeSlot,
//                 eventDataTimeSlot,
//                 bookingStartDate,
//                 bookingEndDate
//               )
//             ) {
//               isBusy = true;
//               break; // No need to check further, we found an overlap
//             }
//           }
//           if (isBusy) break; // No need to check further, we found an overlap
//         }

//         // Set the busy_status in the data time slot
//         dataTimeSlot.busy_status = isBusy ? "busy" : "free";
//       }



//       /**************************CHECK AVAILABILITY FOR MANUAL SLOTS************************************/

//       // Loop through each time slot in data
//       for (const manualslot of manual_slot) {
//         for (const mslot of manualslot.time_slots) {
//           // Initialize a flag to check if the time slot is busy
//           let isBusy = false;

//           // Loop through each event in event_data
//           for (const event of event_data) {
//             console.log("Event Data Is----", event_data);
//             // Loop through each time slot in the event
//             for (const eventDataTimeSlot of event.time_slots) {
//               // Check if there is an overlap
//               /*   if(event.type=='gog'){

//                   if(artist_details.data.GOG_city){
//                     if(artist_details.data.GOG_city!=req.query.city){
//                       isBusy = true;
//                       break;
//                     }
//                   }


//                 } */
//               var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
//               var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
//               if (
//                 checkTimeSlotOverlap(
//                   mslot,
//                   eventDataTimeSlot,
//                   bookingStartDate,
//                   bookingEndDate
//                 )
//               ) {
//                 isBusy = true;
//                 break; // No need to check further, we found an overlap
//               }
//             }
//             if (isBusy) break; // No need to check further, we found an overlap
//           }

//           // Set the busy_status in the data time slot
//           mslot.busy_status = isBusy ? "busy" : "free";
//         }
//       }

//       if (event_data.length > 0) {
//         final_available_slots_for_day.booking_id = event_data[0]._id;
//       }

//       // Sort the time_slots array by start_time
//       final_available_slots_for_day.time_slots.sort((a, b) => {
//         return a.start_time.localeCompare(b.start_time);
//       });


//       const timeSlots = final_available_slots_for_day.time_slots;
//       //gagzzz

//       // Find the indices of time slots with 'busy' status
//    /*    const busyIndices = timeSlots.reduce((indices, slot, index) => {
//         if (slot.busy_status === 'busy') {
//           indices.push(index);
//         }
//         return indices;
//       }, []);

//       // Update the adjacent slots based on the busy slots found
//       busyIndices.forEach(index => {
//         if (index > 0) {
//           timeSlots[index - 1].busy_status = 'busy';
//         }
//         if (index < timeSlots.length - 1) {
//           timeSlots[index + 1].busy_status = 'busy';
//         }
//       }); */

//       /*   const downtime = await blocktimeslot.find({
//           user_id: id
//         }); */
//       const downtime = await blocktimeslot.find({
//         user_id: id,
//         $expr: {
//           $and: [
//             {
//               $lte: [
//                 { $dateFromParts: { year: { $year: "$start_date" }, month: { $month: "$start_date" }, day: { $dayOfMonth: "$start_date" } } },
//                 givenDate
//               ]
//             },
//             {
//               $gte: [
//                 { $dateFromParts: { year: { $year: "$end_date" }, month: { $month: "$end_date" }, day: { $dayOfMonth: "$end_date" } } },
//                 givenDate
//               ]
//             }
//           ]
//         }
//       });
//       console.log("down time is----", downtime);

//       /*   downtime.forEach(downtimeSlot => {
//           // Extract start_date, end_date, start_time, and end_time from downtime
//           const { start_date, end_date, start_time, end_time } = downtimeSlot;

//           // Check if the given date falls within the range of start_date and end_date
//           const isDateInRange = givenDate >= new Date(start_date) && givenDate <= new Date(end_date);
//           console.log("is in date range----", isDateInRange);
//           if (isDateInRange) {
//             data.time_slots.forEach(slot => {
//               if (slot.start_time === start_time && slot.end_time === end_time && slot.status === 'free') {
//                 slot.busy_status = 'busy';
//               }
//             });
//           }
//         }); */
//         const dataObject={
//           data:final_available_slots_for_day,
//           manual_slot
//         }
//         const timeSlotsData = dataObject.data.time_slots || [];
//         const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

//         // Merge and sort the time_slots arrays
//         const mergedTimeSlots = [...timeSlotsData, ...timeSlotsManual];

//         const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
//           // Assuming start_time is in "HH:mm:ss" format
//           return a.start_time.localeCompare(b.start_time);
//         });

//        // sortedTimeSlots[3].busy_status="busy";


//       // sortedTimeSlots[8].busy_status="busy";
//       /*   const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
//           if (slot.busy_status === 'busy') {
//             indices.push(index);
//           }
//           return indices;
//         }, []);

//         // Update the adjacent slots based on the busy slots found
//         busyIndices.forEach(index => {
//           if (index > 0) {
//             sortedTimeSlots[index - 1].busy_status = 'busy';
//           }
//           if (index < timeSlots.length - 1) {
//             sortedTimeSlots[index + 1].busy_status = 'busy';
//           }
//         }); */


//         const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
//           if (slot.busy_status === 'busy') {
//             indices.push(index);
//           }
//           return indices;
//         }, []);

//         // Update the adjacent slots based on the busy slots found
//         busyIndices.forEach(index => {
//           if (index > 0) {
//             sortedTimeSlots[index - 1].busy_status = 'busy';
//           }
//           if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
//             sortedTimeSlots[index + 1].busy_status = 'busy';
//           }
//         });

//         //add logic here
//       downtime.forEach(downtimeSlot => {
//         sortedTimeSlots.forEach(slot => {
//           console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
//           if (

//             formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
//             formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
//             slot.busy_status === 'free'
//           ) {
//             //console.log("Yea this is true..")
//             slot.busy_status = 'busy';
//           }
//         });
//       });

//    /*    if(manual_slot && manual_slot.length>0){

//       downtime.forEach(downtimeSlot => {
//         manual_slot.forEach(mSlot => {
//           mSlot.time_slots.forEach(slot => {
//           console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
//           if (

//             formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
//             formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
//             slot.busy_status === 'free'
//           ) {
//             //console.log("Yea this is true..")
//             slot.busy_status = 'busy';
//           }
//         });
//       });
//       });
//     } */



//       return res.status(200).json({
//         code: 200,
//         data: final_available_slots_for_day,
//         event_data,
//         manual_slot,
//         sortedTimeSlots
//       });
//     }
//   } catch (error) {
//     handleError(res, error);
//   }
// };
// exports.getBusyFreeSlotsLogic = async (req, res) => {
//   try {
//     let id;
//     let days = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     console.log("data received here is---", req.query);
//     if (req.query.user_id) {
//       console.log("by direct");
//       id = mongoose.Types.ObjectId(req.query.user_id);
//     } else {
//       console.log("throw token");
//       id = req.user._id;
//     }

//     const givenDate = new Date(req.query.given_date);

//     const day = givenDate.getDay();

//     console.log("given date and day is---", day);

//     const artist_details = await getItemThroughId(User, req.query.user_id);
//     console.log("Artist details are----", artist_details);

//     const choose_life_data = await ChooseLife.aggregate([
//       {
//         $match: {
//           user_id: id,
//           day: days[day],
//         },
//       },
//       {
//         $lookup: {
//           from: "timeslots",
//           localField: "_id",
//           foreignField: "event_id",
//           as: "time_slots",
//         },
//       },
//     ]);

//     if (choose_life_data.length == 0) {
//       return res.status(404).json({
//         code: 400,
//         data: "No slots available for this day",
//         //event_data
//       });
//     } else {
//       var final_available_slots_for_day = choose_life_data[0];
//       console.log("new date given is---" + new Date(givenDate));

//       const startOfDay = new Date(givenDate);
//       startOfDay.setHours(0, 0, 0, 0);

//       const endOfDay = new Date(givenDate);
//       endOfDay.setHours(23, 59, 59, 999);
//       /*    const event_data = await Event.aggregate([ //gagzzz
//            {
//              $match: {
//                artist_id: id,
//                start_date: { $lte: endOfDay },
//                end_date: { $gte: startOfDay },
//                description: { $ne: "manual" },
//              },
//            },
//            {
//              $lookup: {
//                from: "timeslots",
//                localField: "_id",
//                foreignField: "event_id",
//                as: "time_slots",
//              },
//            },
//          ]); */


//       const event_data = await Event.aggregate([
//         {
//           $match: {
//             artist_id: id,
//             start_date: { $lte: endOfDay },
//             end_date: { $gte: startOfDay },
//             description: { $ne: "manual" },
//           },
//         },
//         {
//           $lookup: {
//             from: "timeslots",
//             localField: "_id",
//             foreignField: "event_id",
//             as: "time_slots",
//           },
//         },
//         /* {
//           $unwind: "$time_slots" // Expand the time_slots array
//         },
//         {
//           $match: {
//             "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
//           }
//         }, */
//         /*  {
//            $group: {
//              _id: "$_id",
//              // You can include other fields you want from the initial collection
//              // Sample field inclusion: name: { $first: "$name" }
//              time_slots: { $push: "$time_slots" } // Collect filtered time_slots
//            }
//          }, */
//         {
//           $lookup: {
//             from: "bookings",
//             localField: "booking_id",
//             foreignField: "_id",
//             as: "bookings",
//           },
//         },
//         {
//           $unwind: {
//             path: "$bookings",
//             preserveNullAndEmptyArrays: true,
//           },
//         },
//         {
//           $match: {
//             $or: [
//              // { "bookings.booking_status": "accept" },
//              { "bookings.booking_status": { $in: ["accept", "pending"] } },
//               { "bookings.calendar_block": true },
//             ],
//           }
//         },


//       ]);


//       const manual_slot = await Event.aggregate([
//         {
//           $match: {
//             artist_id: id,
//             start_date: { $lte: endOfDay },
//             end_date: { $gte: startOfDay },
//             description: { $eq: "manual" },
//           },
//         },
//         {
//           $lookup: {
//             from: "timeslots",
//             localField: "_id",
//             foreignField: "event_id",
//             as: "time_slots",
//           },
//         },
//       ]);
//       // Extract time_slots arrays from data and manual_slot

//       // Loop through each time slot in data
//       console.log(
//         "Final Available Slots For Day---",
//         final_available_slots_for_day.time_slots
//       );
//       console.log("Event data is---", event_data);
//       for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
//         // Initialize a flag to check if the time slot is busy
//         let isBusy = false;

//         // Loop through each event in event_data
//         for (const event of event_data) {
//           console.log("Event Data Is----", event_data);
//           // Loop through each time slot in the event
//           for (const eventDataTimeSlot of event.time_slots) {

//             console.log(
//               "eventdatatimeslot is--",
//               JSON.stringify(eventDataTimeSlot)
//             );

//             var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
//             var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
//             if (
//               checkTimeSlotOverlap(
//                 dataTimeSlot,
//                 eventDataTimeSlot,
//                 bookingStartDate,
//                 bookingEndDate
//               )
//             ) {
//               isBusy = true;
//               break; // No need to check further, we found an overlap
//             }
//           }
//           if (isBusy) break; // No need to check further, we found an overlap
//         }

//         // Set the busy_status in the data time slot
//         dataTimeSlot.busy_status = isBusy ? "busy" : "free";
//       }



//       /**************************CHECK AVAILABILITY FOR MANUAL SLOTS************************************/

//       // Loop through each time slot in data
//       for (const manualslot of manual_slot) {
//         for (const mslot of manualslot.time_slots) {
//           // Initialize a flag to check if the time slot is busy
//           let isBusy = false;

//           // Loop through each event in event_data
//           for (const event of event_data) {
//             console.log("Event Data Is----", event_data);
//             // Loop through each time slot in the event
//             for (const eventDataTimeSlot of event.time_slots) {
//               // Check if there is an overlap
//               /*   if(event.type=='gog'){

//                   if(artist_details.data.GOG_city){
//                     if(artist_details.data.GOG_city!=req.query.city){
//                       isBusy = true;
//                       break;
//                     }
//                   }


//                 } */
//               var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
//               var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
//               if (
//                 checkTimeSlotOverlap(
//                   mslot,
//                   eventDataTimeSlot,
//                   bookingStartDate,
//                   bookingEndDate
//                 )
//               ) {
//                 isBusy = true;
//                 break; // No need to check further, we found an overlap
//               }
//             }
//             if (isBusy) break; // No need to check further, we found an overlap
//           }

//           // Set the busy_status in the data time slot
//           mslot.busy_status = isBusy ? "busy" : "free";
//         }
//       }

//       if (event_data.length > 0) {
//         final_available_slots_for_day.booking_id = event_data[0]._id;
//       }

//       // Sort the time_slots array by start_time
//       final_available_slots_for_day.time_slots.sort((a, b) => {
//         return a.start_time.localeCompare(b.start_time);
//       });


//       const timeSlots = final_available_slots_for_day.time_slots;
//       //gagzzz

//       // Find the indices of time slots with 'busy' status
//    /*    const busyIndices = timeSlots.reduce((indices, slot, index) => {
//         if (slot.busy_status === 'busy') {
//           indices.push(index);
//         }
//         return indices;
//       }, []);

//       // Update the adjacent slots based on the busy slots found
//       busyIndices.forEach(index => {
//         if (index > 0) {
//           timeSlots[index - 1].busy_status = 'busy';
//         }
//         if (index < timeSlots.length - 1) {
//           timeSlots[index + 1].busy_status = 'busy';
//         }
//       }); */

//       /*   const downtime = await blocktimeslot.find({
//           user_id: id
//         }); */
//       const downtime = await blocktimeslot.find({
//         user_id: id,
//         $expr: {
//           $and: [
//             {
//               $lte: [
//                 { $dateFromParts: { year: { $year: "$start_date" }, month: { $month: "$start_date" }, day: { $dayOfMonth: "$start_date" } } },
//                 givenDate
//               ]
//             },
//             {
//               $gte: [
//                 { $dateFromParts: { year: { $year: "$end_date" }, month: { $month: "$end_date" }, day: { $dayOfMonth: "$end_date" } } },
//                 givenDate
//               ]
//             }
//           ]
//         }
//       });
//       console.log("down time is----", downtime);

//       /*   downtime.forEach(downtimeSlot => {
//           // Extract start_date, end_date, start_time, and end_time from downtime
//           const { start_date, end_date, start_time, end_time } = downtimeSlot;

//           // Check if the given date falls within the range of start_date and end_date
//           const isDateInRange = givenDate >= new Date(start_date) && givenDate <= new Date(end_date);
//           console.log("is in date range----", isDateInRange);
//           if (isDateInRange) {
//             data.time_slots.forEach(slot => {
//               if (slot.start_time === start_time && slot.end_time === end_time && slot.status === 'free') {
//                 slot.busy_status = 'busy';
//               }
//             });
//           }
//         }); */
//         const dataObject={
//           data:final_available_slots_for_day,
//           manual_slot
//         }
//         const timeSlotsData = dataObject.data.time_slots || [];
//         const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

//         // Merge and sort the time_slots arrays
//         const mergedTimeSlots = [...timeSlotsData, ...timeSlotsManual];

//         const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
//           // Assuming start_time is in "HH:mm:ss" format
//           return a.start_time.localeCompare(b.start_time);
//         });

//        // sortedTimeSlots[3].busy_status="busy";


//       // sortedTimeSlots[8].busy_status="busy";
//       /*   const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
//           if (slot.busy_status === 'busy') {
//             indices.push(index);
//           }
//           return indices;
//         }, []);

//         // Update the adjacent slots based on the busy slots found
//         busyIndices.forEach(index => {
//           if (index > 0) {
//             sortedTimeSlots[index - 1].busy_status = 'busy';
//           }
//           if (index < timeSlots.length - 1) {
//             sortedTimeSlots[index + 1].busy_status = 'busy';
//           }
//         }); */


//         const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
//           if (slot.busy_status === 'busy') {
//             indices.push(index);
//           }
//           return indices;
//         }, []);

//         // Update the adjacent slots based on the busy slots found
//         busyIndices.forEach(index => {
//           if (index > 0) {
//             sortedTimeSlots[index - 1].busy_status = 'busy';
//           }
//           if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
//             sortedTimeSlots[index + 1].busy_status = 'busy';
//           }
//         });

//         //add logic here
//       downtime.forEach(downtimeSlot => {
//         sortedTimeSlots.forEach(slot => {
//           console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
//           if (

//             formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
//             formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
//             slot.busy_status === 'free'
//           ) {
//             //console.log("Yea this is true..")
//             slot.busy_status = 'busy';
//           }
//         });
//       });

//    /*    if(manual_slot && manual_slot.length>0){

//       downtime.forEach(downtimeSlot => {
//         manual_slot.forEach(mSlot => {
//           mSlot.time_slots.forEach(slot => {
//           console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
//           if (

//             formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
//             formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
//             slot.busy_status === 'free'
//           ) {
//             //console.log("Yea this is true..")
//             slot.busy_status = 'busy';
//           }
//         });
//       });
//       });
//     } */



//       return res.status(200).json({
//         code: 200,
//         data: final_available_slots_for_day,
//         event_data,
//         manual_slot,
//         sortedTimeSlots
//       });
//     }
//   } catch (error) {
//     handleError(res, error);
//   }
// };


exports.getBusyFreeSlotsLogicBk = async (req, res) => {
  try {
    let id;
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    console.log("data received here is---", req.query);
    if (req.query.user_id) {
      console.log("by direct");
      id = mongoose.Types.ObjectId(req.query.user_id);
    } else {
      console.log("throw token");
      id = req.user._id;
    }

    const givenDate = new Date(req.query.given_date);
    const dummydate = new Date(req.query.given_date);
    dummydate.setHours(0, 0, 0, 0);

    const day = givenDate.getDay();

    console.log("given date and day is---", day);

    const artist_details = await getItemThroughId(User, req.query.user_id);
    console.log("Artist details are----", artist_details);

    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: id,
          day: days[day],
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);
    const startOfDay = new Date(givenDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(givenDate);
    endOfDay.setHours(23, 59, 59, 999);

    /**************LOGIC FOR ADDITIONAL SHOW TIME IN CASE CHOOSE LIFE IS EMPTY***************/
    const event_data = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          //start_date: { $lte: dummydate },
          // end_date: { $gt: dummydate },
          start_date: { $lte: endOfDay },
          end_date: { $gte: startOfDay },
          description: { $ne: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
      /* {
        $unwind: "$time_slots" // Expand the time_slots array
      },
      {
        $match: {
          "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
        }
      }, */
      /*  {
         $group: {
           _id: "$_id",
           // You can include other fields you want from the initial collection
           // Sample field inclusion: name: { $first: "$name" }
           time_slots: { $push: "$time_slots" } // Collect filtered time_slots
         }
       }, */
      {
        $lookup: {
          from: "bookings",
          localField: "booking_id",
          foreignField: "_id",
          as: "bookings",
        },
      },
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            // { "bookings.booking_status": "accept" },
            { "bookings.booking_status": { $in: ["accept", "pending"] } },
            { "bookings.calendar_block": true },
          ],
        }
      },


    ]);

    const manual_slot = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          start_date: { $gte: dummydate },
          end_date: { $lte: dummydate },
          // start_date: { $lte: endOfDay },
          //end_date: { $gte: startOfDay },
          description: { $eq: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);


    for (const manualslot of manual_slot) {
      for (const mslot of manualslot.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {
            // Check if there is an overlap
            /*   if(event.type=='gog'){
    
                if(artist_details.data.GOG_city){
                  if(artist_details.data.GOG_city!=req.query.city){
                    isBusy = true;
                    break;
                  }
                }
    
              
              } */
            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlapadminslot(
                mslot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        mslot.busy_status = isBusy ? "busy" : "free";
      }
    }

    const dataObject = {
      manual_slot
    }
    const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

    // Merge and sort the time_slots arrays
    const mergedTimeSlots = timeSlotsManual;

    const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
      // Assuming start_time is in "HH:mm:ss" format
      return a.start_time.localeCompare(b.start_time);
    });



    const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
      if (slot.busy_status === 'busy') {
        indices.push(index);
      }
      return indices;
    }, []);

    // Update the adjacent slots based on the busy slots found
    busyIndices.forEach(index => {
      if (index > 0) {
        sortedTimeSlots[index - 1].busy_status = 'busy';
      }
      if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
        sortedTimeSlots[index + 1].busy_status = 'busy';
      }
    });

    /****************************************************************************************/

    if (choose_life_data.length == 0) {
      if (sortedTimeSlots.length == 0) {
        return res.status(404).json({
          code: 400,
          data: "No slots available for this day"
        });
      } else {
        return res.status(200).json({
          code: 200,
          data: sortedTimeSlots,
          additional_date: givenDate
        });

      }

    } else {
      var final_available_slots_for_day = choose_life_data[0];
      console.log("new date given is---" + new Date(givenDate));

      const startOfDay = new Date(givenDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(givenDate);
      endOfDay.setHours(23, 59, 59, 999);
      /*    const event_data = await Event.aggregate([ //gagzzz
           {
             $match: {
               artist_id: id,
               start_date: { $lte: endOfDay },
               end_date: { $gte: startOfDay },
               description: { $ne: "manual" },
             },
           },
           {
             $lookup: {
               from: "timeslots",
               localField: "_id",
               foreignField: "event_id",
               as: "time_slots",
             },
           },
         ]); */


      const event_data = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $ne: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
        /* {
          $unwind: "$time_slots" // Expand the time_slots array
        },
        {
          $match: {
            "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
          }
        }, */
        /*  {
           $group: {
             _id: "$_id",
             // You can include other fields you want from the initial collection
             // Sample field inclusion: name: { $first: "$name" }
             time_slots: { $push: "$time_slots" } // Collect filtered time_slots
           }
         }, */
        {
          $lookup: {
            from: "bookings",
            localField: "booking_id",
            foreignField: "_id",
            as: "bookings",
          },
        },
        {
          $unwind: {
            path: "$bookings",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $or: [
              // { "bookings.booking_status": "accept" },
              { "bookings.booking_status": { $in: ["accept", "pending"] } },
              { "bookings.calendar_block": true },
            ],
          }
        },


      ]);


      const manual_slot = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $eq: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
      ]);
      // Extract time_slots arrays from data and manual_slot

      // Loop through each time slot in data
      console.log(
        "Final Available Slots For Day---",
        final_available_slots_for_day.time_slots
      );
      console.log("Event data is---", event_data);
      for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {

            console.log(
              "eventdatatimeslot is--",
              JSON.stringify(eventDataTimeSlot)
            );

            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlapadminslot(
                dataTimeSlot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        dataTimeSlot.busy_status = isBusy ? "busy" : "free";
        console.log("status=====================", dataTimeSlot.busy_status)
      }



      /**************************CHECK AVAILABILITY FOR MANUAL SLOTS************************************/

      // Loop through each time slot in data
      for (const manualslot of manual_slot) {
        for (const mslot of manualslot.time_slots) {
          // Initialize a flag to check if the time slot is busy
          let isBusy = false;

          // Loop through each event in event_data
          for (const event of event_data) {
            console.log("Event Data Is----", event_data);
            // Loop through each time slot in the event
            for (const eventDataTimeSlot of event.time_slots) {
              // Check if there is an overlap
              /*   if(event.type=='gog'){
      
                  if(artist_details.data.GOG_city){
                    if(artist_details.data.GOG_city!=req.query.city){
                      isBusy = true;
                      break;
                    }
                  }
      
                
                } */
              var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
              var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
              if (
                checkTimeSlotOverlapadminslot(
                  mslot,
                  eventDataTimeSlot,
                  bookingStartDate,
                  bookingEndDate
                )
              ) {
                isBusy = true;
                break; // No need to check further, we found an overlap
              }
            }
            if (isBusy) break; // No need to check further, we found an overlap
          }

          // Set the busy_status in the data time slot
          mslot.busy_status = isBusy ? "busy" : "free";
          console.log("status========mslot.busy_status=============", mslot.busy_status)
        }
      }

      if (event_data.length > 0) {
        final_available_slots_for_day.booking_id = event_data[0]._id;
      }

      // Sort the time_slots array by start_time
      final_available_slots_for_day.time_slots.sort((a, b) => {
        return a.start_time.localeCompare(b.start_time);
      });


      const timeSlots = final_available_slots_for_day.time_slots;
      //gagzzz

      // Find the indices of time slots with 'busy' status
      /*    const busyIndices = timeSlots.reduce((indices, slot, index) => {
           if (slot.busy_status === 'busy') {
             indices.push(index);
           }
           return indices;
         }, []);
   
         // Update the adjacent slots based on the busy slots found
         busyIndices.forEach(index => {
           if (index > 0) {
             timeSlots[index - 1].busy_status = 'busy';
           }
           if (index < timeSlots.length - 1) {
             timeSlots[index + 1].busy_status = 'busy';
           }
         }); */

      /*   const downtime = await blocktimeslot.find({
          user_id: id
        }); */
      const downtime = await blocktimeslot.find({
        user_id: id,
        $expr: {
          $and: [
            {
              $lte: [
                { $dateFromParts: { year: { $year: "$start_date" }, month: { $month: "$start_date" }, day: { $dayOfMonth: "$start_date" } } },
                givenDate
              ]
            },
            {
              $gte: [
                { $dateFromParts: { year: { $year: "$end_date" }, month: { $month: "$end_date" }, day: { $dayOfMonth: "$end_date" } } },
                givenDate
              ]
            }
          ]
        }
      });
      console.log("down time is----", downtime);

      /*   downtime.forEach(downtimeSlot => {
          // Extract start_date, end_date, start_time, and end_time from downtime
          const { start_date, end_date, start_time, end_time } = downtimeSlot;
      
          // Check if the given date falls within the range of start_date and end_date
          const isDateInRange = givenDate >= new Date(start_date) && givenDate <= new Date(end_date);
          console.log("is in date range----", isDateInRange);
          if (isDateInRange) {
            data.time_slots.forEach(slot => {
              if (slot.start_time === start_time && slot.end_time === end_time && slot.status === 'free') {
                slot.busy_status = 'busy';
              }
            });
          }
        }); */
      const dataObject = {
        data: final_available_slots_for_day,
        manual_slot
      }
      const timeSlotsData = dataObject.data.time_slots || [];
      const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

      // Merge and sort the time_slots arrays
      const mergedTimeSlots = [...timeSlotsData, ...timeSlotsManual];

      const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
        // Assuming start_time is in "HH:mm:ss" format
        return a.start_time.localeCompare(b.start_time);
      });



      const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
        if (slot.busy_status === 'busy') {
          indices.push(index);
        }
        return indices;
      }, []);

      // Update the adjacent slots based on the busy slots found
      busyIndices.forEach(index => {
        if (index > 0) {
          sortedTimeSlots[index - 1].busy_status = 'busy';
        }
        if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
          sortedTimeSlots[index + 1].busy_status = 'busy';
        }
      });

      //add logic here
      downtime.forEach(downtimeSlot => {
        sortedTimeSlots.forEach(slot => {
          console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
          // console.log(slot,"gggggggggggggggggggggggggg");
          if (

            formatTime(slot.start_time) === formatTime(downtimeSlot.start_time) &&
            formatTime(slot.end_time) === formatTime(downtimeSlot.end_time) &&
            slot.busy_status === 'free'
          ) {
            console.log("Yea this is true..")
            slot.busy_status = 'busy';
          }
        });
      });

      /*    if(manual_slot && manual_slot.length>0){
   
         downtime.forEach(downtimeSlot => {
           manual_slot.forEach(mSlot => {
             mSlot.time_slots.forEach(slot => {
             console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
             if (
   
               formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
               formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
               slot.busy_status === 'free'
             ) {
               //console.log("Yea this is true..")
               slot.busy_status = 'busy';
             }
           });
         });
         });
       } */



      return res.status(200).json({
        code: 200,
        data: final_available_slots_for_day,
        event_data,
        manual_slot,
        sortedTimeSlots
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

exports.getBusyFreeSlotsLogic = async (req, res) => {
  try {
    let id;
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    console.log("data received here is---", req.query);
    if (req.query.user_id) {
      console.log("by direct");
      id = mongoose.Types.ObjectId(req.query.user_id);
    } else {
      console.log("throw token");
      id = req.user._id;
    }

    const givenDate = new Date(req.query.given_date);
    const dummydate = new Date(req.query.given_date);
    dummydate.setHours(0, 0, 0, 0);

    const day = givenDate.getDay();

    console.log("given date and day is---", day);

    const artist_details = await getItemThroughId(User, req.query.user_id);
    console.log("Artist details are----", artist_details);

    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: id,
          day: days[day],
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);
    const startOfDay = new Date(givenDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(givenDate);
    endOfDay.setHours(23, 59, 59, 999);

    /**************LOGIC FOR ADDITIONAL SHOW TIME IN CASE CHOOSE LIFE IS EMPTY***************/
    const event_data = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          //start_date: { $lte: dummydate },
          // end_date: { $gt: dummydate },
          start_date: { $lte: endOfDay },
          end_date: { $gte: startOfDay },
          description: { $ne: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
      /* {
        $unwind: "$time_slots" // Expand the time_slots array
      },
      {
        $match: {
          "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
        }
      }, */
      /*  {
         $group: {
           _id: "$_id",
           // You can include other fields you want from the initial collection
           // Sample field inclusion: name: { $first: "$name" }
           time_slots: { $push: "$time_slots" } // Collect filtered time_slots
         }
       }, */
      {
        $lookup: {
          from: "bookings",
          localField: "booking_id",
          foreignField: "_id",
          as: "bookings",
        },
      },
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            // { "bookings.booking_status": "accept" },
            { "bookings.booking_status": { $in: ["accept", "pending"] } },
            { "bookings.calendar_block": true },
          ],
        }
      },


    ]);

    const manual_slot = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          start_date: { $gte: dummydate },
          end_date: { $lte: dummydate },
          // start_date: { $lte: endOfDay },
          //end_date: { $gte: startOfDay },
          description: { $eq: "manual" },
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
    ]);


    for (const manualslot of manual_slot) {
      for (const mslot of manualslot.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {
            // Check if there is an overlap
            /*   if(event.type=='gog'){
    
                if(artist_details.data.GOG_city){
                  if(artist_details.data.GOG_city!=req.query.city){
                    isBusy = true;
                    break;
                  }
                }
    
              
              } */
            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlap(
                mslot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        mslot.busy_status = isBusy ? "busy" : "free";
      }
    }

    const dataObject = {
      manual_slot
    }
    const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

    // Merge and sort the time_slots arrays
    const mergedTimeSlots = timeSlotsManual;

    const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
      // Assuming start_time is in "HH:mm:ss" format
      return a.start_time.localeCompare(b.start_time);
    });



    const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
      if (slot.busy_status === 'busy') {
        indices.push(index);
      }
      return indices;
    }, []);

    // Update the adjacent slots based on the busy slots found
    busyIndices.forEach(index => {
      if (index > 0) {
        sortedTimeSlots[index - 1].busy_status = 'busy';
      }
      if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
        sortedTimeSlots[index + 1].busy_status = 'busy';
      }
    });

    /****************************************************************************************/

    if (choose_life_data.length == 0) {
      if (sortedTimeSlots.length == 0) {
        return res.status(404).json({
          code: 400,
          data: "No slots available for this day"
        });
      } else {
        return res.status(200).json({
          code: 200,
          data: sortedTimeSlots,
          additional_date: givenDate
        });

      }

    } else {
      var final_available_slots_for_day = choose_life_data[0];
      console.log("new date given is---" + new Date(givenDate));

      const startOfDay = new Date(givenDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(givenDate);
      endOfDay.setHours(23, 59, 59, 999);
      /*    const event_data = await Event.aggregate([ //gagzzz
           {
             $match: {
               artist_id: id,
               start_date: { $lte: endOfDay },
               end_date: { $gte: startOfDay },
               description: { $ne: "manual" },
             },
           },
           {
             $lookup: {
               from: "timeslots",
               localField: "_id",
               foreignField: "event_id",
               as: "time_slots",
             },
           },
         ]); */


      const event_data = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $ne: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
        /* {
          $unwind: "$time_slots" // Expand the time_slots array
        },
        {
          $match: {
            "time_slots.type": { $ne: "modified" } // Filter where type is not "modified"
          }
        }, */
        /*  {
           $group: {
             _id: "$_id",
             // You can include other fields you want from the initial collection
             // Sample field inclusion: name: { $first: "$name" }
             time_slots: { $push: "$time_slots" } // Collect filtered time_slots
           }
         }, */
        {
          $lookup: {
            from: "bookings",
            localField: "booking_id",
            foreignField: "_id",
            as: "bookings",
          },
        },
        {
          $unwind: {
            path: "$bookings",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $or: [
              // { "bookings.booking_status": "accept" },
              { "bookings.booking_status": { $in: ["accept", "pending"] } },
              { "bookings.calendar_block": true },
            ],
          }
        },


      ]);


      const manual_slot = await Event.aggregate([
        {
          $match: {
            artist_id: id,
            start_date: { $lte: endOfDay },
            end_date: { $gte: startOfDay },
            description: { $eq: "manual" },
          },
        },
        {
          $lookup: {
            from: "timeslots",
            localField: "_id",
            foreignField: "event_id",
            as: "time_slots",
          },
        },
      ]);
      // Extract time_slots arrays from data and manual_slot

      // Loop through each time slot in data
      console.log(
        "Final Available Slots For Day---",
        final_available_slots_for_day.time_slots
      );
      console.log("Event data is---", event_data);
      for (const dataTimeSlot of final_available_slots_for_day.time_slots) {
        // Initialize a flag to check if the time slot is busy
        let isBusy = false;

        // Loop through each event in event_data
        for (const event of event_data) {
          console.log("Event Data Is----", event_data);
          // Loop through each time slot in the event
          for (const eventDataTimeSlot of event.time_slots) {

            console.log(
              "eventdatatimeslot is--",
              JSON.stringify(eventDataTimeSlot)
            );

            var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
            var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
            if (
              checkTimeSlotOverlap(
                dataTimeSlot,
                eventDataTimeSlot,
                bookingStartDate,
                bookingEndDate
              )
            ) {
              isBusy = true;
              break; // No need to check further, we found an overlap
            }
          }
          if (isBusy) break; // No need to check further, we found an overlap
        }

        // Set the busy_status in the data time slot
        dataTimeSlot.busy_status = isBusy ? "busy" : "free";
      }



      /**************************CHECK AVAILABILITY FOR MANUAL SLOTS************************************/

      // Loop through each time slot in data
      for (const manualslot of manual_slot) {
        for (const mslot of manualslot.time_slots) {
          // Initialize a flag to check if the time slot is busy
          let isBusy = false;

          // Loop through each event in event_data
          for (const event of event_data) {
            console.log("Event Data Is----", event_data);
            // Loop through each time slot in the event
            for (const eventDataTimeSlot of event.time_slots) {
              // Check if there is an overlap
              /*   if(event.type=='gog'){
      
                  if(artist_details.data.GOG_city){
                    if(artist_details.data.GOG_city!=req.query.city){
                      isBusy = true;
                      break;
                    }
                  }
      
                
                } */
              var bookingStartDate = formatDateToYYYYMMDD(event.start_date);
              var bookingEndDate = formatDateToYYYYMMDD(event.end_date);
              if (
                checkTimeSlotOverlap(
                  mslot,
                  eventDataTimeSlot,
                  bookingStartDate,
                  bookingEndDate
                )
              ) {
                isBusy = true;
                break; // No need to check further, we found an overlap
              }
            }
            if (isBusy) break; // No need to check further, we found an overlap
          }

          // Set the busy_status in the data time slot
          mslot.busy_status = isBusy ? "busy" : "free";
        }
      }

      if (event_data.length > 0) {
        final_available_slots_for_day.booking_id = event_data[0]._id;
      }

      // Sort the time_slots array by start_time
      final_available_slots_for_day.time_slots.sort((a, b) => {
        return a.start_time.localeCompare(b.start_time);
      });


      const timeSlots = final_available_slots_for_day.time_slots;
      //gagzzz

      // Find the indices of time slots with 'busy' status
      /*    const busyIndices = timeSlots.reduce((indices, slot, index) => {
           if (slot.busy_status === 'busy') {
             indices.push(index);
           }
           return indices;
         }, []);
   
         // Update the adjacent slots based on the busy slots found
         busyIndices.forEach(index => {
           if (index > 0) {
             timeSlots[index - 1].busy_status = 'busy';
           }
           if (index < timeSlots.length - 1) {
             timeSlots[index + 1].busy_status = 'busy';
           }
         }); */

      /*   const downtime = await blocktimeslot.find({
          user_id: id
        }); */
      const downtime = await blocktimeslot.find({
        user_id: id,
        $expr: {
          $and: [
            {
              $lte: [
                { $dateFromParts: { year: { $year: "$start_date" }, month: { $month: "$start_date" }, day: { $dayOfMonth: "$start_date" } } },
                givenDate
              ]
            },
            {
              $gte: [
                { $dateFromParts: { year: { $year: "$end_date" }, month: { $month: "$end_date" }, day: { $dayOfMonth: "$end_date" } } },
                givenDate
              ]
            }
          ]
        }
      });
      console.log("down time is----", downtime);

      /*   downtime.forEach(downtimeSlot => {
          // Extract start_date, end_date, start_time, and end_time from downtime
          const { start_date, end_date, start_time, end_time } = downtimeSlot;
      
          // Check if the given date falls within the range of start_date and end_date
          const isDateInRange = givenDate >= new Date(start_date) && givenDate <= new Date(end_date);
          console.log("is in date range----", isDateInRange);
          if (isDateInRange) {
            data.time_slots.forEach(slot => {
              if (slot.start_time === start_time && slot.end_time === end_time && slot.status === 'free') {
                slot.busy_status = 'busy';
              }
            });
          }
        }); */
      const dataObject = {
        data: final_available_slots_for_day,
        manual_slot
      }
      const timeSlotsData = dataObject.data.time_slots || [];
      const timeSlotsManual = dataObject.manual_slot.reduce((acc, manualSlot) => acc.concat(manualSlot.time_slots || []), []);

      // Merge and sort the time_slots arrays
      const mergedTimeSlots = [...timeSlotsData, ...timeSlotsManual];

      const sortedTimeSlots = mergedTimeSlots.sort((a, b) => {
        // Assuming start_time is in "HH:mm:ss" format
        return a.start_time.localeCompare(b.start_time);
      });



      const busyIndices = sortedTimeSlots.reduce((indices, slot, index) => {
        if (slot.busy_status === 'busy') {
          indices.push(index);
        }
        return indices;
      }, []);

      // Update the adjacent slots based on the busy slots found
      busyIndices.forEach(index => {
        if (index > 0) {
          sortedTimeSlots[index - 1].busy_status = 'busy';
        }
        if (index < sortedTimeSlots.length - 1) { // Fix: Change timeSlots.length to sortedTimeSlots.length
          sortedTimeSlots[index + 1].busy_status = 'busy';
        }
      });

      //add logic here
      downtime.forEach(downtimeSlot => {
        sortedTimeSlots.forEach(slot => {
          console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
          if (

            formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
            formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
            slot.busy_status === 'free'
          ) {
            console.log("Yea this is true..")
            slot.busy_status = 'busy';
          }
        });
      });

      /*    if(manual_slot && manual_slot.length>0){
   
         downtime.forEach(downtimeSlot => {
           manual_slot.forEach(mSlot => {
             mSlot.time_slots.forEach(slot => {
             console.log(slot.start_time, "-----", formatTime(downtimeSlot.start_time));
             if (
   
               formatTime(slot.start_time) == formatTime(downtimeSlot.start_time) &&
               formatTime(slot.end_time) == formatTime(downtimeSlot.end_time) &&
               slot.busy_status === 'free'
             ) {
               //console.log("Yea this is true..")
               slot.busy_status = 'busy';
             }
           });
         });
         });
       } */



      return res.status(200).json({
        code: 200,
        data: final_available_slots_for_day,
        event_data,
        manual_slot,
        sortedTimeSlots
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};


function getDates(startDate, endDate) {
  var dates = [];
  var currentDate = new Date(moment(startDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('day'));
  endDate = new Date(moment(endDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').startOf('day'));
  console.log("Current date is---", currentDate, "---End date is----", endDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
function getAllDates(gog_dates) {
  var allDatess = [];

  gog_dates.forEach(function (obj) {
    console.log("OBJ IS---", obj);
    var startDate = obj.GOG_start_date;
    var endDate = obj.GOG_end_date;

    allDatess = allDatess.concat(getDates(startDate, endDate));
  });

  return Array.from(new Set(allDatess)); // Remove duplicates
}

exports.getChooseLifeOld = async (req, res) => {
  try {
    let id;
    if (req.query.user_id) {
      console.log("by direct");
      id = mongoose.Types.ObjectId(req.query.user_id);
    } else {
      console.log("throw token");
      id = req.user._id;
    }

    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: id,
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
      {
        $lookup: {
          from: "timeslotdisplays",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots_display",
        },
      },
      /*  {
        $unwind: "$time_slots", // Unwind the time_slots array
      },
      {
        $unwind: "$time_slots_display", // Unwind the time_slots_display array
      },
      {
        $sort: { "time_slots.start_time": 1 }, // Sort by start_time in ascending order
      },
      {
        $group: {
          _id: "$_id",
          time_slots: { $push: "$time_slots" }, // Group the time_slots back into an array
          time_slots_display: { $push: "$time_slots_display" }, // Group the time_slots_display back into an array
          // Add other fields you want to keep in the result
        },
      }, */
    ]);

    console.log("id is-----", id);
    const gogs = await GOG.find({ user_id: mongoose.Types.ObjectId(req.query.user_id) });
    console.log("gogs are---", gogs);
    const userInfo = await User.findById(mongoose.Types.ObjectId(req.query.user_id));
    console.log("USER INFO IS---", userInfo);
    var hideGoG = null;
    if (req.query.current_city) {
      if (userInfo.current_location_status == 'gog' && userInfo.GOG_city == req.query.current_city) {
        hideGoG = false;
      } else if (userInfo.current_location_status == 'base' && userInfo.base_location == req.query.current_city) {
        hideGoG = true;
      }
    }


    var result = getAllDates(gogs);


    return res.status(200).json({
      code: 200,
      data: choose_life_data,
      gog_dates: result,
      hideGoG: hideGoG
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getChooseLife = async (req, res) => {
  try {
    let id;
    if (req.query.user_id) {
      console.log("by direct");
      id = mongoose.Types.ObjectId(req.query.user_id);
    } else {
      console.log("throw token");
      id = req.user._id;
    }

    const choose_life_data = await ChooseLife.aggregate([
      {
        $match: {
          user_id: id,
        },
      },
      {
        $lookup: {
          from: "timeslots",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots",
        },
      },
      {
        $lookup: {
          from: "timeslotdisplays",
          localField: "_id",
          foreignField: "event_id",
          as: "time_slots_display",
        },
      },
      /*  {
        $unwind: "$time_slots", // Unwind the time_slots array
      },
      {
        $unwind: "$time_slots_display", // Unwind the time_slots_display array
      },
      {
        $sort: { "time_slots.start_time": 1 }, // Sort by start_time in ascending order
      },
      {
        $group: {
          _id: "$_id",
          time_slots: { $push: "$time_slots" }, // Group the time_slots back into an array
          time_slots_display: { $push: "$time_slots_display" }, // Group the time_slots_display back into an array
          // Add other fields you want to keep in the result
        },
      }, */
    ]);


    const manual_slot = await Event.aggregate([
      {
        $match: {
          artist_id: id,
          //   start_date: { $gte: dummydate },
          // end_date: { $lte: dummydate },
          // start_date: { $lte: endOfDay },
          //end_date: { $gte: startOfDay },
          description: { $eq: "manual" },
        },
      }
    ]);

    console.log("id is-----", id);
    const gogs = await GOG.find({ user_id: mongoose.Types.ObjectId(req.query.user_id) });
    console.log("gogs are---", gogs);
    const userInfo = await User.findById(mongoose.Types.ObjectId(req.query.user_id));
    console.log("USER INFO IS---", userInfo);
    var hideGoG = null;
    if (req.query.current_city) {
      if (userInfo.current_location_status == 'gog' && userInfo.GOG_city == req.query.current_city) {
        hideGoG = false;
      } else if (userInfo.current_location_status == 'base' && userInfo.base_location == req.query.current_city) {
        hideGoG = true;
      }
    }


    var result = getAllDates(gogs);


    return res.status(200).json({
      code: 200,
      data: choose_life_data,
      gog_dates: result,
      hideGoG: hideGoG,
      manual_slots: manual_slot
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getblocktime = async (req, res) => {
  try {
    const data = req.query;
    const givenDate = new Date(req.query.given_date);
    console.log("new date given is---" + new Date(givenDate));
    const startOfDay = new Date(givenDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(givenDate);
    endOfDay.setHours(23, 59, 59, 999);

    const condition = {
      user_id: data.user_id
    }

    if (req.query.given_date) {
      condition.$and = [
        {
          start_date: { $gte: startOfDay },
          end_date: { $lte: endOfDay }
        }
      ]
    }
    let blocktimeslots = await blocktimeslot.find(condition);
    return res.status(200).json({
      code: 200,
      data: blocktimeslots,
    });
  } catch (error) {
    handleError(res, error);
  }
};





const addFilterForAdmin = async (filterforadmin, filterData) => {
  try {
    // Create a new document with the provided filter data
    const newFilter = await createItem(filterforadmin, filterData);
    // Save the new document to the collection
    // const savedFilter = await newFilter.save();
    return newFilter;
  } catch (error) {
    throw error;
  }
};
exports.addFilterforbookmanagment = async (req, res) => {
  try {
    const data = req.body;

    // Define an array of filter types
    const filterTypes = ['location', 'artist', 'status', 'dispute'];

    // Iterate over filter types
    for (const type of filterTypes) {
      if (data[type] && Array.isArray(data[type]) && data[type].length > 0) {
        try {
          // Use Promise.all to wait for all delete operations to complete
          await Promise.all(data[type].map(async (element) => {
            const filterData = {
              type,
              [type]: element,
            };

            // Delete documents based on the filter type
            await filterforadmin.deleteMany({ type });

            // Create new item
            await addFilterForAdmin(filterforadmin, filterData);
          }));
        } catch (error) {
          handleError(res, error);
        }
      } else {
        // If data[type] is not defined or is not an array, still perform delete operation
        const filterData = {
          type,
        };

        // Delete documents based on the filter type
        await filterforadmin.deleteMany({ type });

        // You can also add a message to indicate that the array is empty
        console.log(`No data provided for type: ${type}`);
      }
    }

    return res.status(200).json({
      code: 200,
      data: "Successfully processed filters",
    });
  } catch (error) {
    handleError(res, error);
  }
};




exports.getFilterforbookmanagment = async (req, res) => {
  try {
    let data = req.query
    const item = await filterforadmin.find({ type: data.type }).populate("artist");
    return res.status(200).json({ code: 200, response: item });
  } catch (error) {
    handleError(res, error);
  }
};



exports.citislistieng = async (req, res) => {
  try {
    let data = req.query;
    const cities = require('all-the-cities');

    let limit = parseInt(data.limit) || 10;
    let offset = parseInt(data.offset) || 0;
    let searchTerm = data.search || ''; // Added search parameter with a default value of an empty string

    // Filter cities based on the search term
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply limit and offset to the filtered cities array
    const paginatedCities = filteredCities.slice(offset, offset + limit);

    return res.status(200).json({ code: 200, response: paginatedCities });
  } catch (error) {
    handleError(res, error);
  }

};

const fetchSubcategoryNames = (category) => {
  if (!category.topLevelCategories || category.topLevelCategories.length === 0) {
    return [];
  }

  const val = category.topLevelCategories.map(subCategory => {
    [subCategory.name]

  }
    // ...fetchSubcategoryNames(subCategory.name)

    // Recursive call for subcategories
  );
  console.log("val======================", val)
  return val
};


async function writeCategoriesToCSV(category, csvWriter) {
  const records = [{ _id: category._id, name: category.name }];

  for (const subcategoryId of category.subCategories) {
    const subcategory = await ArtCategory.findById(subcategoryId);
    records.push({ _id: subcategory._id, name: subcategory.name });

    // Recursively write subcategories
    records.push(...await writeCategoriesToCSV(subcategory, csvWriter));
  }

  return records;
}


exports.exportCategoriesToCSV = async (req, res) => {
  try {
    const categories = await ArtCategory.find({ parent: null }); // Fetch top-level categories
    const csvFilePath = path.join('/var/www/mongo/getreal-rest-apis/public/zip', 'categories_hierarchy.csv')
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    const csvWriter = createCsvWriter({
      path: 'categories_hierarchy.csv',
      header: [
        { id: '_id', title: 'Category ID' },
        { id: 'name', title: 'Category Name' },
      ],
    });

    const allRecords = [];
    for (const category of categories) {
      const categoryRecords = await writeCategoriesToCSV(category, csvWriter);
      allRecords.push(...categoryRecords);
    }

    await csvWriter.writeRecords(allRecords);

    return res.json({
      code: 200,
      // data:response1,
      path: "https://uat.getreal.buzz/getreal-rest-apis/public/zip/categories_hierarchy.csv"
    });
  } catch (error) {
    handleError(res, error);
  }
};

// exports.downloadcategorycsv = async (req, res) => {
//   try {
//     const data = req.body;



//     const params = [
//       // { $match: condition },

//       {
//         $graphLookup: {
//           from: "categories",
//           startWith: "$_id",
//           connectFromField: "_id",
//           connectToField: "parent",
//           as: "subCategories",
//           maxDepth: 10,
//           depthField: "level",
//         },
//       },

//       {
//         $match: {
//           "subCategories": { $exists: true, $not: { $size: 0 } },
//           parent:null
//         }
//       },



//     ]
//     const response1 = await ArtCategory.aggregate(params)

//     const workSheetColumnName = ["Top Level categoty" ,"subcategory name"];
//     const response = response1.flatMap((doc) => [
//       [doc.name ,...fetchSubcategoryNames(doc)],

//       // ...fetchSubcategoryNames(doc) // Recursive call for subcategories
//   ]);
//     path = await downloadCsv(workSheetColumnName, response)



//     return res.json({
//       code: 200,
//       data:response1,
//       path:path
//     });
//   } catch (error) {
//     console.log("error")
//     // handleError(res, error);
//   }
// };



exports.downloadcategorycsv = async (req, res) => {
  try {

    const data = req.query;
    const limit = data.limit ? parseInt(data.limit) : 100;
    const offset = data.offset ? parseInt(data.offset) : 0;
    let parent_artForm, subcategory;
    if (!data.parent_id) {
      data.parent_id = null;
    } else {
      data.parent_id = mongoose.Types.ObjectId(data.parent_id);
      parent_artForm = await ArtCategory.findOne({ _id: mongoose.Types.ObjectId(data.parent_id) });
      parent_artForm = parent_artForm._doc;
      if (data.type == "subcategory") {
        const subcategoryIds = JSON.parse(data.subcategory_ids)
        subcategory = await ArtCategory.find({ _id: { $in: subcategoryIds } });
      } else {
        subcategory
      }

    }
    let whereObj = {}
    if (data.startRange && data.endRange) {
      whereObj.$and = [
        { createdAt: { $gte: data.startRange } },
        { createdAt: { $lte: data.endRange } },
      ]
    }

    console.log("new Date(data.endRange )", data.endRange)
    const pipeline = [
      {
        $match: { parent: data.parent_id }, // Find top-level categories (categories without a parent)
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
      {
        $match: whereObj, // Find top-level categories (categories without a parent)
      },
      {
        $facet: {
          topLevelCategories: [
            { $skip: offset },
            { $limit: limit },
            { $sort: { createdAt: -1 } },
          ],
          totalCount: [
            { $count: 'count' },
          ],
        },
      },
    ];
    let result = await ArtCategory.aggregate(pipeline);
    let results = [{ ...{ code: 200 }, ...result[0], ...parent_artForm, subcategory: data.type == "subcategory" ? subcategory : 0 }]
    // const response1 = await ArtCategory.aggregate(params)

    const workSheetColumnName = ["Top Level categoty", "subcategory name"];

    //   const response = results.map((doc) => [
    //     [ doc.name ,...fetchSubcategoryNames(doc) ]

    // //     // ...fetchSubcategoryNames(doc) // Recursive call for subcategories
    // ]);

    const response = results.flatMap((doc) => {
      console.log("docs=============", doc)
      let topLevelCategoryName = []
      for (let i = 0; i < doc.topLevelCategories.length; i++) {
        const element = doc.topLevelCategories[i];

        const value = Array.isArray(doc.topLevelCategories) && doc.topLevelCategories.length > 0
          ? topLevelCategoryName.push([element.name])
          : undefined;
      }

      console.log("topLevelCategoryName==========", topLevelCategoryName)
      return [topLevelCategoryName, [doc.name]]
      // topLevelCategories
      // [doc.topLevelCategories.name, ...fetchSubcategoryNames(doc)];
    })

    console.log("response=============", response)
    path = await downloadCsv(workSheetColumnName, response)
    return res.status(200).json({ results, path });
  } catch (error) {
    console.log("error in dcsc", error)
    // handleError(res, error);
  }
};


// exports.getCategoryOftypeManual = async (req, res) => {
//   try {

//     const data = req.query;
//     const limit = data.limit ? parseInt(data.limit) : 100;
//     const offset = data.offset ? parseInt(data.offset) : 0;
//     let parent_artForm, subcategory;
//     parent_artForm = await ArtCategory.find({ status: "pending", type: "manual" }).sort({ createdAt: -1 }) // Sorting by _id in descending order
//       .skip(offset)
//       .limit(limit);
//     const parent_artFormfot = await ArtCategory.find({ status: "pending", type: "manual" })
//     return res.status(200).json({ code: 200, data: parent_artForm, count: parent_artFormfot.length });
//   } catch (error) {

//     handleError(res, error);
//   }
// }
exports.getCategoryOftypeManual = async (req, res) => {
  try {
    const data = req.query;
    const limit = data.limit ? parseInt(data.limit) : 100;
    const offset = data.offset ? parseInt(data.offset) : 0;
    const searchName = data.search; // Name to search for

    let parent_artForm, parent_artFormCount;

    if (searchName) {
      // If there's a name to search for, add it to the query
      parent_artForm = await ArtCategory.find({
        status: "pending",
        type: "manual",
        name: { $regex: searchName, $options: 'i' } // Case-insensitive search
      }).sort({ createdAt: -1 }).skip(offset).limit(limit);

      parent_artFormCount = await ArtCategory.countDocuments({
        status: "pending",
        type: "manual",
        name: { $regex: searchName, $options: 'i' }
      });
    } else {
      // If no name is provided, fetch all manual art forms
      parent_artForm = await ArtCategory.find({
        status: "pending",
        type: "manual"
      }).sort({ createdAt: -1 }).skip(offset).limit(limit);

      parent_artFormCount = await ArtCategory.countDocuments({
        status: "pending",
        type: "manual"
      });
    }

    return res.status(200).json({ code: 200, data: parent_artForm, count: parent_artFormCount });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteManualArtform = async (req, res) => {
  try {
    const _id = req.params
    const findArtForm = await ArtCategory.findOne({ _id: mongoose.Types.ObjectId(_id._id) })
    console.log("data============", findArtForm)
    const finduser = await User.findOne({ _id: mongoose.Types.ObjectId(findArtForm.added_by) })

    if (finduser && finduser.Highlightartform != null) {

      const updatedArray = finduser.Highlightartform.filter(name => name !== findArtForm.name);
      console.log("updatedArray==================", updatedArray)
      await User.updateOne(
        { _id: mongoose.Types.ObjectId(findArtForm.added_by) },
        { $set: { "Highlightartform": updatedArray } }
      );
    }
    // const updatedarry = await finduser.Highlightartform.filter(name => name !== findArtForm.name);

    // const updateuser = await User.updateOne({ _id: mongoose.Types.ObjectId(findArtForm.added_by) }, {
    //   $set: {
    //     "Highlightartform": updatedarry,
    //   },
    // }
    // );

    const item = await deleteItem(ArtCategory, _id._id);
    return res.status(200).json(item);
  } catch (error) {
    handleError(res, error);
  }
};


exports.deleteAllManualArtforms = async (req, res) => {
  try {
    // Assuming you want to delete all manual art forms associated with a specific user,
    // you may need additional parameters in the request to identify the user whose art forms need to be deleted.
    const data = req.body; // Assuming userId is passed in the request parameters
    const newarr = data.manual_artform_ids.map((x) => mongoose.Types.ObjectId(x))
    // Find all art forms associated with the user
    const artFormsToDelete = await ArtCategory.find({ _id: { $in: newarr } });

    // Loop through each art form to update the user's data and delete the art form
    for (const artForm of artFormsToDelete) {
      const finduser = await User.findOne({ _id: mongoose.Types.ObjectId(artForm.added_by) });

      if (finduser && finduser.Highlightartform != null) {

        const updatedArray = finduser.Highlightartform.filter(name => name !== artForm.name);
        console.log("updatedArray==================", updatedArray)
        await User.updateOne(
          { _id: mongoose.Types.ObjectId(artForm.added_by) },
          { $set: { "Highlightartform": updatedArray } }
        );
      }


      //       const updatedArray = finduser.Highlightartform.filter(name => name !== artForm.name);
      // console.log("updatedArray==================",updatedArray)
      //       await User.updateOne(
      //         { _id: mongoose.Types.ObjectId(artForm.added_by) },
      //         { $set: { "Highlightartform": updatedArray } }
      //       );

      // Delete the art form

      console.log("artForm==================", artForm)
      const deletes = await deleteItem(ArtCategory, mongoose.Types.ObjectId(artForm._id));
    }
    return res.status(200).json({ message: "All manual art forms deleted successfully." });

  } catch (error) {
    handleError(res, error);
  }
};

exports.updateStatusOfArtformCategory = async (req, res) => {
  try {

    const data = req.body
    const filter = { _id: data.categoy_id };


    const user = await ArtCategory.findOne(filter);
    const filterforuser = { _id: mongoose.Types.ObjectId(user.added_by), 'art_form_object': { $elemMatch: { art_form_id: data.categoy_id } } };


    if (user.status == "pending" && data.parent_id != "") {
      let update = { status: "approved", parent: data.parent_id };
      const parent_artForm = await ArtCategory.findOne({ _id: mongoose.Types.ObjectId(data.parent_id) });
      const finduser = await User.findOne({ _id: mongoose.Types.ObjectId(user.added_by) })
      if (finduser.Highlightartform.length > 0) {

        var updatedarry = await finduser.Highlightartform.filter(name => name !== user.name);

        const updateuser = await User.updateOne(filterforuser, {
          $set: {
            "Highlightartform": updatedarry,
            "art_form_object.$.parent": data.parent_id,
            "art_form_object.$.parent_name": parent_artForm.name,
          },
        }
        );
      }
      console.log("updateuser=============", updateuser)
      const updatecategory = await ArtCategory.findOneAndUpdate(filter, update, {
        new: true,
      });

      return res.status(200).json({
        code: 200,
        data: updatecategory,
      });
    } else if (user.status == "pending" && data.parent_id == "") {
      let update = { status: "approved" };
      const finduser = await User.findOne({ _id: mongoose.Types.ObjectId(user.added_by) })

      const updatedarry = await finduser.Highlightartform.filter(name => name !== user.name);

      const updateuser = await User.updateOne(filterforuser, {
        $set: {
          "Highlightartform": updatedarry,
          "art_form_object.$.parent": data.categoy_id,
          "art_form_object.$.parent_name": user.name,
        },
      }
      );
      const updatecategory = await ArtCategory.findOneAndUpdate(filter, update, {
        new: true,
      });
      return res.status(200).json({
        code: 200,
        data: updatecategory,
      });
    }
    else {
      return res.status(400).json({
        code: 400,
        data: "Error",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};



exports.addAddress = async (req, res) => {
  try {
    const data = req.body;
    // data.user_id = req.user._id;
    data.isDefault = true;

    if (data.latitude && data.longitude) {
      data.lat_long = {};
      data.lat_long.type = "Point";
      data.lat_long.coordinates = [
        Number(data.longitude),
        Number(data.latitude),
      ];
    }

    await updateItems(Address, { user_id: data.user_id }, { isDefault: false });

    const addresses = await createItem(Address, data);

    return res.status(200).json({
      code: 200,
      addresses,
    });
  } catch (error) {
    handleError(res, error);
  }
};
function generateRandomFilename() {
  // Generate a random string of letters and digits
  const randomString = Math.random().toString(36).substring(7);

  // Create the final filename with the ".jpeg" extension
  const filename = `${randomString}.jpeg`;

  return filename;
}


function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
exports.uploadbase64tos3 = async (req, res) => {
  try {
    const randomname = generateRandomFilename()

    const dataofbuffer = base64ToArrayBuffer(req.body.media)
    let media = await uploadBase64ToS3({
      image_data: dataofbuffer,
      path: req.body.path,
    });
    let mediaurl = media.data.Location;
    console.log("data================", media, mediaurl)
    return res.status(200).json({
      code: 200,
      path: media,
    });
  } catch (error) {
    handleError(res, error);
  }
};



exports.reportArtist = async (req, res) => {
  try {
    const data = req.query;
    // data.user_id = req.user._id;
    const obj = {}
    if (data.id) {
      obj._id = mongoose.Types.ObjectId(data.id)
    }

    const regexPhoneNo = new RegExp(data.search, 'i');
    const regexStageName = new RegExp(data.search, 'i');
    const regexFirstName = new RegExp(data.search, 'i');

    // Constructing the $match stage to include search functionality
    const matchStage = {
      $match: {
        $and: [
          obj, // Previous conditions, if any
          data.search ? {
            $or: [
              { phone_no: { $regex: regexPhoneNo } },
              { "user_details.stage_name": { $regex: regexStageName } },
              { "artistdetails.stage_name": { $regex: regexStageName } },
              { "user_details.first_name": { $regex: regexFirstName } },
              { "artistdetails.first_name": { $regex: regexFirstName } }
            ]
          } : {}
        ]
      }
    };
    let testmatchStage

    if (data.id) {
      testmatchStage = {
        $match: {
          $and: [
            {}, // Previous conditions, if any
            data.search ? {
              $or: [
                { phone_no: { $regex: regexPhoneNo } },
                // { "data.$.user_details": { $elemMatch: { "stage_name": { $regex: regexStageName } } } },
                // { "data.$.user_details": { $elemMatch: { "first_name": { $regex: regexStageName } } } },
                // { "user_details.first_name": { $regex: regexFirstName } },
                // { "artistdetails.first_name": { $regex: regexFirstName } }
              ]
            } : {}
          ]
        }
      };
    }


    // Pipeline to get the count
    const countPipeline = [
      matchStage,
      { $count: "totalCount" }
    ];

    // const countPipeline = [
    //   { $match: obj }, // Match stage to filter documents based on criteria
    //   { $count: "totalCount" } // Count stage to get the total number of documents
    // ];

    const countResult = await report_artist.aggregate(countPipeline);
    const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0; // Extract the totalCount from the result array

    // Now, execute the pipeline to get the actual data with limit and offset
    const dataPipeline = [
      // {
      //   $group: {
      //     _id: "$user_details._id", // Group by user_id
      //     user_details: { $first: "$user_details" }, // Preserve user details
      //     data: { $push: "$$ROOT" } // Push the documents into an array
      //   }
      // }
      {
        $lookup: {
          from: "users",
          localField: "artist_id",
          foreignField: "_id",
          as: "artistdetails"
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
      { $unwind: "$user_details" },
      matchStage,
      {
        $lookup: {
          from: "reportartists",
          localField: "artist_id",
          foreignField: "artist_id",
          as: "data",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_details"
              }
            },
            // testmatchStage,
            {
              $skip: data.id ? Number(data.offset) : 0
            },
            {
              $limit: data.id ? Number(data.limit) : Number.MAX_SAFE_INTEGER,
            }
          ]
        }
      },
      {
        $match: {

          artistdetails: { $ne: [] },


        }
      },
      {
        $addFields: {
          reportCount: { $size: "$data" }
        }
      },

    ];

    if (!data.id) {
      dataPipeline.push(
        { $skip: Number(data.offset) },
        { $limit: Number(data.limit) }
      );
    }

    const dataResult = await report_artist.aggregate(dataPipeline);
    // const blocktimeslots = await reportItem(report_artist, data);
    return res.status(200).json({
      code: 200,
      count: totalCount,
      data: dataResult,
    });
  } catch (error) {
    handleError(res, error);
  }
};






// exports.blockUnBlock = async (req, res) => {
//   try {
//     const data = req.body;
//     let _id;
//     const findUSer = await User.findOne({_id:data.user_id})
//     let update = {is_block:true}
//     if(findUSer.is_block){
//       update = {is_block:false}
//     }

//     // const findandupdate = await User.findOneAndUpdate({_id:data.user_id},{$set:update},{new:true})
//     const findandupdate =  await updateItem(User,{_id:mongoose.Types.ObjectId(data.user_id)},update)
//     // if (data.email) {
//     //   data.is_email_verified = true;
//     // }

//     // const userInfo = await updateItemThroughId(Admin, _id, data);
//     // console.log(userInfo);
//     if (!findUSer) {
//       throw buildErrObject(422, "User Does Not Exist");
//     }


//     return res.status(200).json({
//       code: 200,
//       data: findandupdate
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };






exports.blockUnBlock = async (req, res) => {
  try {
    // const id = req.user._id;

    const filter = { _id: mongoose.Types.ObjectId(req.body.artist_id) };
    const filterforReport = { _id: mongoose.Types.ObjectId(req.body.id) };
    var update = { is_block: true };

    const user = await User.findOne(filter);
    if (user.is_block) {
      update = { is_block: false };
    }

    const data = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    // const updatereportedstatus = await report_artist.findOneAndUpdate(filterforReport, {status:"close"}, {
    //   new: true,
    // });
    return res.status(200).json({
      code: 200,
      data,
    });
  } catch (error) {
    handleError(res, error);
  }
};


exports.updateStatus = async (req, res) => {
  try {
    // const id = req.user._id;


    const filterforReport = { _id: mongoose.Types.ObjectId(req.body.id) };




    const updatereportedstatus = await report_artist.findOneAndUpdate(filterforReport, { status: req.body.status }, {
      new: true,
    });
    return res.status(200).json({
      code: 200,
      data: updatereportedstatus,
    });
  } catch (error) {
    handleError(res, error);
  }
};
function getStateFromGSTIN(gstin) {
  // Extract the first two characters from the GSTIN
  const stateCode = gstin.substring(0, 2);

  // Check if the state code corresponds to Karnataka
  if (stateCode === "29") {
    return "Karnataka";
  }

  // Mapping of state codes to state names
  const stateMap = {
    "01": "Jammu and Kashmir",
    "02": "Himachal Pradesh",
    "03": "Punjab",
    "04": "Chandigarh",
    "05": "Uttarakhand",
    "06": "Haryana",
    "07": "Delhi",
    "08": "Rajasthan",
    "09": "Uttar Pradesh",
    "10": "Bihar",
    "11": "Sikkim",
    "12": "Arunachal Pradesh",
    "13": "Nagaland",
    "14": "Manipur",
    "15": "Mizoram",
    "16": "Tripura",
    "17": "Meghalaya",
    "18": "Assam",
    "19": "West Bengal",
    "20": "Jharkhand",
    "21": "Odisha",
    "22": "Chhattisgarh",
    "23": "Madhya Pradesh",
    "24": "Gujarat",
    "25": "Daman and Diu",
    "26": "Dadra and Nagar Haveli",
    "27": "Maharashtra",
    "28": "Andhra Pradesh (old)",
    "30": "Goa",
    "31": "Lakshadweep",
    "32": "Kerala",
    "33": "Tamil Nadu",
    "34": "Puducherry",
    "35": "Andaman and Nicobar Islands",
    "36": "Telangana",
    "37": "Andhra Pradesh",
    "97": "Other Territory",
    "96": "Other Territory",
    "99": "Other Territory"
  };

  // Return the state corresponding to the state code, or "Unknown" if not found
  return stateMap[stateCode] || "Unknown";
}
exports.downloadinvoice = async (req, res) => {
  try {
    const data = req.query;
    const finduserdetails = await User.findOne({
      _id: mongoose.Types.ObjectId(data.user_id),
    })

    const findBankdetail = await Bank_Account.findOne({
      user_id: mongoose.Types.ObjectId(data.user_id),
      // is_primary: true,
    }).sort({ createdAt: -1 })

    const findArtistPayouts = await Booking.findOne({
      _id: mongoose.Types.ObjectId(data.booking_id),
    })


    console.log("finduserdetails==================", findBankdetail)
    if (!findArtistPayouts) {
      return res.status(404).send({ code: 404, message: "Booking not found" });
    }
    let accountNA, bankna, ifscna
    if (typeof (findBankdetail) === "object") {
      console.log("data-----------------null-")
      accountNA = "N/A"
      ifscna = "N/A"
      bankna = "N/A"
      // return res.status(404).send({ code: 404, message: "Bank details is missing" });
    } else {

      accountNA = findBankdetail.account_number
      ifscna = findBankdetail.ifsc_code
      bankna = findBankdetail.bank_name
    }


    // if (!finduserdetails.gst) {
    //   accountNA = "N/A"
    //   ifscna = "N/A"
    //   bankna ="N/A"
    //     // return res.status(404).send({ code: 404, message: "Bank details is missing" });
    //   }


    const originalTimestamp = new Date(findArtistPayouts.createdAt);

    // Add the difference in milliseconds between the two timestamps
    const convertedDate = originalTimestamp.getDate();
    const convertedMonth = originalTimestamp.getMonth();
    const convertedYear = originalTimestamp.getFullYear();
    console.log(`${convertedDate} ${convertedMonth} ${convertedYear}`);

    // {
    //   artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
    //   gst:finduserdetails.gst,
    //   pan:finduserdetails.pan,
    //   account_no:accountNA,
    //   comission_percentage: findArtistPayouts.comission_percentage ,
    //   artist_nationality: findArtistPayouts.artist_nationality,
    //   artist_fee: findArtistPayouts.artist_fee,
    //   get_real_comission: findArtistPayouts.get_real_comission,
    //   gst_on_comission: findArtistPayouts.gst_on_comission,
    //   tds_of_entire: findArtistPayouts.tds_of_entire,
    //   total_payable_amount: findArtistPayouts.grand_total ? findArtistPayouts.grand_total  : 0,
    //   gst_fee_raised_by_artist: findArtistPayouts.gst_fee_raised_by_artist,
    //   gst_percentage: findArtistPayouts.gst_percentage,
    //   tds_percentage: findArtistPayouts.tds_percentage,
    //   amountinWords:numbertowords.toWords(findArtistPayouts.grand_total),
    //   date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
    // }
    const artistcut = (findArtistPayouts.artist_total_fee * 5) / 100
    const taxcalculatedforArtistCut = (artistcut * 18) / 100

    const taxonartist_total_fee = (findArtistPayouts.artist_total_fee * 9) / 100

    if (findArtistPayouts.gst_number != "0" || findArtistPayouts.is_gst_added == true) {
      console.log("if---- gstnot zero")
      const state = getStateFromGSTIN(findArtistPayouts.gst_number);
      if (state == "Karnataka" || findArtistPayouts.billing_address.state_name == "Karnataka" || findArtistPayouts.billing_address.state_name == "KA") {
        if (data.type == "getrealinvoised") {
          console.log("inside=======",)
          //  let InvoiceObj = {
          //   artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
          //   gst:finduserdetails.gst,
          //   pan:finduserdetails.pan,
          //   account_no:findBankdetail.account_number  &&  findBankdetail ? findBankdetail.account_number : 0,
          //   comission_percentage: findArtistPayouts.comission_percentage ,
          //   artist_nationality: findArtistPayouts.artist_nationality,
          //   artist_fee: findArtistPayouts.artist_fee,
          //   get_real_comission: findArtistPayouts.get_real_comission,
          //   gst_on_comission: findArtistPayouts.gst_on_comission,
          //   tds_of_entire: findArtistPayouts.tds_of_entire,
          //   total_payable_amount: findArtistPayouts.grand_total ? findArtistPayouts.grand_total - findArtistPayouts.artist_total_fee : 0,
          //   gst_fee_raised_by_artist: findArtistPayouts.gst_fee_raised_by_artist,
          //   gst_percentage: findArtistPayouts.gst_percentage,
          //   tds_percentage: findArtistPayouts.tds_percentage,
          //   amountinWords:numbertowords.toWords(findArtistPayouts.grand_total - findArtistPayouts.artist_total_fee),
          //   date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
          //   }


          let InvoiceObj = {
            invoice: findArtistPayouts.Getreal_Invoice_Number ? findArtistPayouts.Getreal_Invoice_Number : "N/A",
            artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
            gst: finduserdetails.gst,
            pan: finduserdetails.pan,
            account_no: accountNA,
            ifsc_code: ifscna,
            bank_name: bankna,
            comission_percentage: findArtistPayouts.comission_percentage,
            artist_nationality: findArtistPayouts.artist_nationality,
            artist_fee: findArtistPayouts.artist_fee,
            get_real_comission: findArtistPayouts.get_real_comission,
            gst_on_comission: findArtistPayouts.gst_on_comission,
            tds_of_entire: findArtistPayouts.tds_of_entire,
            total_payable_amount: findArtistPayouts.grand_total ? (findArtistPayouts.artist_total_fee * 5) / 100 : "N/A",
            gst_fee_raised_by_artist: taxcalculatedforArtistCut / 2,
            gst_percentage: findArtistPayouts.gst_percentage,
            tds_percentage: findArtistPayouts.tds_percentage,
            amountinWords: numbertowords.toWords(artistcut),
            date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
          }
          const contents = fs.readFileSync("./views/en/newinvoice2.ejs", "utf8");

          var html = ejs.render(contents, InvoiceObj);
        } else if (data.type == "artistinvoiced") {


          let InvoiceObj = {
            invoice: findArtistPayouts.Artist_Invoice_Number,
            artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
            gst: finduserdetails.gst,
            pan: finduserdetails.pan,
            account_no: accountNA,
            ifsc_code: ifscna,
            bank_name: bankna,
            comission_percentage: findArtistPayouts.comission_percentage,
            artist_nationality: findArtistPayouts.artist_nationality,
            artist_fee: findArtistPayouts.artist_fee,
            get_real_comission: findArtistPayouts.get_real_comission,
            gst_on_comission: findArtistPayouts.gst_on_comission,
            tds_of_entire: findArtistPayouts.tds_of_entire,
            total_payable_amount: findArtistPayouts.artist_total_fee ? findArtistPayouts.artist_total_fee : 0,
            gst_fee_raised_by_artist: taxonartist_total_fee,
            gst_percentage: findArtistPayouts.gst_percentage,
            tds_percentage: findArtistPayouts.tds_percentage,
            amountinWords: numbertowords.toWords(findArtistPayouts.artist_total_fee + taxonartist_total_fee + taxonartist_total_fee),
            date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
          }
          const contents = fs.readFileSync("./views/en/invoice1.ejs", "utf8");

          var html = ejs.render(contents, InvoiceObj);
        }
      } else {
        if (data.type == "getrealinvoised") {
          console.log("invoive for getreal")

          let InvoiceObj = {
            invoice: findArtistPayouts.Getreal_Invoice_Number ? findArtistPayouts.Getreal_Invoice_Number : "N/A",
            artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
            gst: finduserdetails.gst,
            pan: finduserdetails.pan,
            account_no: accountNA,
            ifsc_code: ifscna,
            bank_name: bankna,
            comission_percentage: findArtistPayouts.comission_percentage,
            artist_nationality: findArtistPayouts.artist_nationality,
            artist_fee: findArtistPayouts.artist_fee,
            get_real_comission: findArtistPayouts.get_real_comission,
            gst_on_comission: findArtistPayouts.gst_on_comission,
            tds_of_entire: findArtistPayouts.tds_of_entire,
            total_payable_amount: findArtistPayouts.grand_total ? (findArtistPayouts.artist_total_fee * 5) / 100 : 0,
            gst_fee_raised_by_artist: taxcalculatedforArtistCut,
            gst_percentage: findArtistPayouts.gst_percentage,
            tds_percentage: findArtistPayouts.tds_percentage,
            amountinWords: numbertowords.toWords(artistcut + taxcalculatedforArtistCut),
            date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
          }
          const contents = fs.readFileSync("./views/en/newInvoice2forOther.ejs", "utf8");
          var html = ejs.render(contents, InvoiceObj);
        } else if (data.type == "artistinvoiced") {
          let InvoiceObj = {
            invoice: findArtistPayouts.Artist_Invoice_Number,
            artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
            gst: finduserdetails.gst,
            pan: finduserdetails.pan,
            account_no: accountNA,
            ifsc_code: ifscna,
            bank_name: bankna,
            comission_percentage: findArtistPayouts.comission_percentage,
            artist_nationality: findArtistPayouts.artist_nationality,
            artist_fee: findArtistPayouts.artist_fee,
            get_real_comission: findArtistPayouts.get_real_comission,
            gst_on_comission: findArtistPayouts.gst_on_comission,
            tds_of_entire: findArtistPayouts.tds_of_entire,
            total_payable_amount: findArtistPayouts.artist_total_fee ? findArtistPayouts.artist_total_fee : 0,
            gst_fee_raised_by_artist: taxonartist_total_fee * 2,
            gst_percentage: findArtistPayouts.gst_percentage,
            tds_percentage: findArtistPayouts.tds_percentage,
            amountinWords: numbertowords.toWords(findArtistPayouts.artist_total_fee + taxonartist_total_fee + taxonartist_total_fee),
            date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
          }
          const contents = fs.readFileSync("./views/en/newInvoice1forOther.ejs", "utf8");

          var html = ejs.render(contents, InvoiceObj);
        }
      }
    }
    if (findArtistPayouts.gst_number == "0" || findArtistPayouts.is_gst_added == false) {
      if (data.type == "getrealinvoised") {
        console.log("inside gst-----percentage")
        //  let InvoiceObj = {
        //   artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
        //   gst:finduserdetails.gst,
        //   pan:finduserdetails.pan,
        //   account_no:findBankdetail.account_number  &&  findBankdetail ? findBankdetail.account_number : 0,
        //   comission_percentage: findArtistPayouts.comission_percentage ,
        //   artist_nationality: findArtistPayouts.artist_nationality,
        //   artist_fee: findArtistPayouts.artist_fee,
        //   get_real_comission: findArtistPayouts.get_real_comission,
        //   gst_on_comission: findArtistPayouts.gst_on_comission,
        //   tds_of_entire: findArtistPayouts.tds_of_entire,
        //   total_payable_amount: findArtistPayouts.grand_total ? findArtistPayouts.grand_total - findArtistPayouts.artist_total_fee : 0,
        //   gst_fee_raised_by_artist: findArtistPayouts.gst_fee_raised_by_artist,
        //   gst_percentage: findArtistPayouts.gst_percentage,
        //   tds_percentage: findArtistPayouts.tds_percentage,
        //   amountinWords:numbertowords.toWords(findArtistPayouts.grand_total - findArtistPayouts.artist_total_fee),
        //   date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
        //   }


        let InvoiceObj = {
          invoice: findArtistPayouts.Getreal_Invoice_Number ? findArtistPayouts.Getreal_Invoice_Number : "N/A",
          artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
          gst: finduserdetails.gst,
          pan: finduserdetails.pan,
          account_no: accountNA,
          ifsc_code: ifscna,
          bank_name: bankna,
          comission_percentage: findArtistPayouts.comission_percentage,
          artist_nationality: findArtistPayouts.artist_nationality,
          artist_fee: findArtistPayouts.artist_fee,
          get_real_comission: findArtistPayouts.get_real_comission,
          gst_on_comission: findArtistPayouts.gst_on_comission,
          tds_of_entire: findArtistPayouts.tds_of_entire,
          total_payable_amount: findArtistPayouts.grand_total ? (findArtistPayouts.artist_total_fee * 5) / 100 : "N/A",
          gst_fee_raised_by_artist: taxcalculatedforArtistCut / 2,
          gst_percentage: findArtistPayouts.gst_percentage,
          tds_percentage: findArtistPayouts.tds_percentage,
          amountinWords: numbertowords.toWords(artistcut),
          date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
        }
        const contents = fs.readFileSync("./views/en/nonGstforInvoice2.ejs", "utf8");

        var html = ejs.render(contents, InvoiceObj);
      } else if (data.type == "artistinvoiced") {
        // + gst_fee_raised_by_artist + gst_fee_raised_by_artist
        // <%= gst ?gst_percentage :N/a %>%
        // <%= gst ?gst_percentage :0 %> %
        // + taxonartist_total_fee + taxonartist_total_fee
        let InvoiceObj = {
          invoice: findArtistPayouts.Artist_Invoice_Number,
          artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
          gst: finduserdetails.gst,
          pan: finduserdetails.pan,
          account_no: accountNA,
          ifsc_code: ifscna,
          bank_name: bankna,
          comission_percentage: findArtistPayouts.comission_percentage,
          artist_nationality: findArtistPayouts.artist_nationality,
          artist_fee: findArtistPayouts.artist_fee,
          get_real_comission: findArtistPayouts.get_real_comission,
          gst_on_comission: findArtistPayouts.gst_on_comission,
          tds_of_entire: findArtistPayouts.tds_of_entire,
          total_payable_amount: findArtistPayouts.artist_total_fee ? findArtistPayouts.artist_total_fee : 0,
          gst_fee_raised_by_artist: taxonartist_total_fee,
          gst_percentage: findArtistPayouts.gst_percentage,
          tds_percentage: findArtistPayouts.tds_percentage,
          amountinWords: numbertowords.toWords(findArtistPayouts.artist_total_fee ),
          date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
        }
        const contents = fs.readFileSync("./views/en/nonGstinvoice1.ejs", "utf8");

        var html = ejs.render(contents, InvoiceObj);
      }
    }


    console.log("test===", findArtistPayouts.gst_percentage == "0")

    // if(data.type == "getrealinvoised" && findArtistPayouts.billing_address.state == "karnataka"){

    //   //  let InvoiceObj = {
    //   //   artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
    //   //   gst:finduserdetails.gst,
    //   //   pan:finduserdetails.pan,
    //   //   account_no:findBankdetail.account_number  &&  findBankdetail ? findBankdetail.account_number : 0,
    //   //   comission_percentage: findArtistPayouts.comission_percentage ,
    //   //   artist_nationality: findArtistPayouts.artist_nationality,
    //   //   artist_fee: findArtistPayouts.artist_fee,
    //   //   get_real_comission: findArtistPayouts.get_real_comission,
    //   //   gst_on_comission: findArtistPayouts.gst_on_comission,
    //   //   tds_of_entire: findArtistPayouts.tds_of_entire,
    //   //   total_payable_amount: findArtistPayouts.grand_total ? findArtistPayouts.grand_total - findArtistPayouts.artist_total_fee : 0,
    //   //   gst_fee_raised_by_artist: findArtistPayouts.gst_fee_raised_by_artist,
    //   //   gst_percentage: findArtistPayouts.gst_percentage,
    //   //   tds_percentage: findArtistPayouts.tds_percentage,
    //   //   amountinWords:numbertowords.toWords(findArtistPayouts.grand_total - findArtistPayouts.artist_total_fee),
    //   //   date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
    //   //   }


    //     let InvoiceObj = {
    //       invoice_no:findArtistPayouts.Getreal_Invoice_Number ? findArtistPayouts.Getreal_Invoice_Number : "N/A",
    //       artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
    //       gst:finduserdetails.gst,
    //       pan:finduserdetails.pan,
    //       account_no:findBankdetail.account_number,
    //       ifsc_code:findBankdetail.ifsc_code,
    //       bank_name:findBankdetail.bank_name,
    //       comission_percentage: findArtistPayouts.comission_percentage ,
    //       artist_nationality: findArtistPayouts.artist_nationality,
    //       artist_fee: findArtistPayouts.artist_fee,
    //       get_real_comission: findArtistPayouts.get_real_comission,
    //       gst_on_comission: findArtistPayouts.gst_on_comission,
    //       tds_of_entire: findArtistPayouts.tds_of_entire,
    //       total_payable_amount: findArtistPayouts.grand_total ?  (findArtistPayouts.artist_total_fee * 5)/100 : "N/A",
    //       gst_fee_raised_by_artist: taxcalculatedforArtistCut/2,
    //       gst_percentage: findArtistPayouts.gst_percentage,
    //       tds_percentage: findArtistPayouts.tds_percentage,
    //       amountinWords:numbertowords.toWords(artistcut ),
    //       date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
    //       }
    //   const contents = fs.readFileSync("./views/en/newinvoice2.ejs", "utf8");

    //   var html = ejs.render(contents, InvoiceObj);
    // }
    //  if(data.type == "getrealinvoised"  && findArtistPayouts.gst_percentage !== "0") {
    // console.log("invoive for getreal")

    //   let InvoiceObj = {
    //     artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
    //     gst:finduserdetails.gst,
    //     pan:finduserdetails.pan,
    //     account_no:accountNA,
    //         ifsc_code:ifscna,
    //         bank_name:bankna,
    //     comission_percentage: findArtistPayouts.comission_percentage ,
    //     artist_nationality: findArtistPayouts.artist_nationality,
    //     artist_fee: findArtistPayouts.artist_fee,
    //     get_real_comission: findArtistPayouts.get_real_comission,
    //     gst_on_comission: findArtistPayouts.gst_on_comission,
    //     tds_of_entire: findArtistPayouts.tds_of_entire,
    //     total_payable_amount: findArtistPayouts.grand_total ?  (findArtistPayouts.artist_total_fee * 5)/100 : 0,
    //     gst_fee_raised_by_artist: taxcalculatedforArtistCut,
    //     gst_percentage: findArtistPayouts.gst_percentage,
    //     tds_percentage: findArtistPayouts.tds_percentage,
    //     amountinWords:numbertowords.toWords(artistcut + taxcalculatedforArtistCut),
    //     date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
    //     }
    // const contents = fs.readFileSync("./views/en/newInvoice2forOther.ejs", "utf8");
    // var html = ejs.render(contents, InvoiceObj);
    // }
    // else if (data.type == "artistinvoiced" && findArtistPayouts.billing_address.state == "karnataka"){


    //   let InvoiceObj = {
    //     artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
    //     gst:finduserdetails.gst,
    //     pan:finduserdetails.pan,
    //     account_no:findBankdetail.account_number,
    //       ifsc_code:findBankdetail.ifsc_code,
    //       bank_name:findBankdetail.bank_name,
    //     comission_percentage: findArtistPayouts.comission_percentage ,
    //     artist_nationality: findArtistPayouts.artist_nationality,
    //     artist_fee: findArtistPayouts.artist_fee,
    //     get_real_comission: findArtistPayouts.get_real_comission,
    //     gst_on_comission: findArtistPayouts.gst_on_comission,
    //     tds_of_entire: findArtistPayouts.tds_of_entire,
    //     total_payable_amount: findArtistPayouts.artist_total_fee ?  findArtistPayouts.artist_total_fee : 0,
    //     gst_fee_raised_by_artist: taxonartist_total_fee,
    //     gst_percentage: findArtistPayouts.gst_percentage,
    //     tds_percentage: findArtistPayouts.tds_percentage,
    //     amountinWords:numbertowords.toWords(findArtistPayouts.artist_total_fee + taxonartist_total_fee + taxonartist_total_fee) ,
    //     date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
    //     }
    //   const contents = fs.readFileSync("./views/en/invoice1.ejs", "utf8");

    //   var html = ejs.render(contents, InvoiceObj);
    // }
    // else if(data.type == "artistinvoiced"  && findArtistPayouts.gst_percentage !== "0") {
    //   let InvoiceObj = {
    //     artistName:finduserdetails.stage_name ? finduserdetails.stage_name :finduserdetails.first_name,
    //     gst:finduserdetails.gst,
    //     pan:finduserdetails.pan,
    //     account_no:accountNA,
    //         ifsc_code:ifscna,
    //         bank_name:bankna,
    //     comission_percentage: findArtistPayouts.comission_percentage ,
    //     artist_nationality: findArtistPayouts.artist_nationality,
    //     artist_fee: findArtistPayouts.artist_fee,
    //     get_real_comission: findArtistPayouts.get_real_comission,
    //     gst_on_comission: findArtistPayouts.gst_on_comission,
    //     tds_of_entire: findArtistPayouts.tds_of_entire,
    //     total_payable_amount: findArtistPayouts.artist_total_fee ?  findArtistPayouts.artist_total_fee : 0,
    //     gst_fee_raised_by_artist: taxonartist_total_fee * 2,
    //     gst_percentage: findArtistPayouts.gst_percentage,
    //     tds_percentage: findArtistPayouts.tds_percentage,
    //     amountinWords:numbertowords.toWords(findArtistPayouts.artist_total_fee + taxonartist_total_fee + taxonartist_total_fee) ,
    //     date:`${convertedDate}-${convertedMonth + 1}-${convertedYear}`
    //     }
    //   const contents = fs.readFileSync("./views/en/newInvoice1forOther.ejs", "utf8");

    //   var html = ejs.render(contents, InvoiceObj);
    // }

    if (data.type == "customer" && findArtistPayouts.booking_type == "performance") {
      const findcustomerdetails = await User.findOne({
        _id: mongoose.Types.ObjectId(findArtistPayouts.user_id),
      })

      const numberOfslot = await findArtistPayouts.time_slots
      const length = numberOfslot.length
      const value = finduserdetails.final_charges_per_hour * length
      const taxvalue = (value * 18) / 100
      console.log("length=============",numberOfslot,"=====================",length)
      let InvoiceObj = {
        invoice: findArtistPayouts.User_Invoice_Number,
        artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
        customer_name: findcustomerdetails.stage_name ? findcustomerdetails.stage_name : findcustomerdetails.first_name,
        gst: finduserdetails.gst ? finduserdetails.gst :"N/A",
        pan: finduserdetails.pan,
        account_no: accountNA,
        ifsc_code: ifscna,
        bank_name: bankna,
        comission_percentage: findArtistPayouts.comission_percentage,
        artist_nationality: findArtistPayouts.artist_nationality,
        artist_fee: findArtistPayouts.artist_fee,
        get_real_comission: findArtistPayouts.get_real_comission,
        gst_on_comission: findArtistPayouts.gst_on_comission,
        tds_of_entire: findArtistPayouts.tds_of_entire,
        total_payable_amount: finduserdetails.final_charges_per_hour ? finduserdetails.final_charges_per_hour * length : 0,
        gst_fee_raised_by_artist: taxvalue/2,
        gst_percentage: findArtistPayouts.gst_percentage,
        tds_percentage: findArtistPayouts.tds_percentage,
        amountinWords: numbertowords.toWords((finduserdetails.final_charges_per_hour * length) + (taxvalue/2) + (taxvalue/2)),
        date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
      }
      const contents = fs.readFileSync("./views/en/invoice3.ejs", "utf8");

      var html = ejs.render(contents, InvoiceObj);
    }

    if (data.type == "customer" && findArtistPayouts.booking_type == "training") {
      const findcustomerdetails = await User.findOne({
        _id: mongoose.Types.ObjectId(findArtistPayouts.user_id),
      })

      const numberOfslot = await findArtistPayouts.time_slots
      const length = numberOfslot.length
      const value = finduserdetails.final_charges_per_hour * length
      const taxvalue = (value * 18) / 100
      console.log("length=============",numberOfslot,"=====================",length)
      let InvoiceObj = {
        invoice: findArtistPayouts.User_Invoice_Number,
        artistName: finduserdetails.stage_name ? finduserdetails.stage_name : finduserdetails.first_name,
        customer_name: findcustomerdetails.stage_name ? findcustomerdetails.stage_name : findcustomerdetails.first_name,
        gst: finduserdetails.gst ? finduserdetails.gst :"N/A",
        pan: finduserdetails.pan,
        account_no: accountNA,
        ifsc_code: ifscna,
        bank_name: bankna,
        comission_percentage: findArtistPayouts.comission_percentage,
        artist_nationality: findArtistPayouts.artist_nationality,
        artist_fee: findArtistPayouts.artist_fee,
        get_real_comission: findArtistPayouts.get_real_comission,
        gst_on_comission: findArtistPayouts.gst_on_comission,
        tds_of_entire: findArtistPayouts.tds_of_entire,
        total_payable_amount: finduserdetails.final_charges_per_head ? ( finduserdetails.final_charges_per_head * findArtistPayouts.total_disciples) * length : 0,
        gst_fee_raised_by_artist: taxvalue/2,
        gst_percentage: findArtistPayouts.gst_percentage,
        tds_percentage: findArtistPayouts.tds_percentage,
        amountinWords: numbertowords.toWords((( finduserdetails.final_charges_per_head * findArtistPayouts.total_disciples)* length) + (taxvalue/2) + (taxvalue/2)),
        date: `${convertedDate}-${convertedMonth + 1}-${convertedYear}`
      }
      const contents = fs.readFileSync("./views/en/invoice3.ejs", "utf8");

      var html = ejs.render(contents, InvoiceObj);
    }

    console.log("html=========", html)
    const fileName = "invoice" + Date.now();
    var options = {
      format: "A4",
      width: "14in",
      orientation: "landscape",
      height: "21in",
      timeout: 540000,
    };
    // await  toPDF(html,options, "public/invoice/" + fileName + ".pdf")
    await pdf
      .create(html, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null',
          },
        }
      })
      .toFile(
        "public/invoice/" + fileName + ".pdf",
        async function (err, pdfV) {
          console.log("========================", pdfV);
          if (err) {
            console.log(err);
            return res.status(500).send("Error generating PDF");
          }

          const fullPath =
            process.env.API_URL + "public/invoice/" + fileName + ".pdf";

          const filename = path.basename(fullPath);
          const contentType = mime.lookup(fullPath);

          res.setHeader(
            "Content-disposition",
            "attachment; filename=" + filename
          );
          res.setHeader("Content-type", contentType);

          const filestream = fs.createReadStream(pdfV.filename);

          filestream.on("data", () => {
            console.log("reading.....");
          });

          filestream.on("open", function () {
            console.log("Open-------------------->");
            filestream.pipe(res);
          });

          filestream.on("end", () => {
            fs.unlink(pdfV.filename, (err) => {
              if (err) throw err;
              console.log("successfully deleted ", fullPath);
            });
          });

          filestream.on("error", (err) => {
            console.log(err);
            return res.status(500).send("Error reading PDF");
          });

          filestream.on("close", () => {
            console.log("Stream closed now");
          });
        }
      );


    //   const invoiceData = {
    //     invoiceNumber: 'INV-2024-001',
    //     date: 'February 26, 2024',
    //     // Add more invoice data as needed...
    // };

    // // File path where the PDF will be saved
    // const filePath = 'public/invoice.pdf';

    // // Generate and download the invoice
    // generateAndDownloadInvoice(invoiceData, filePath)
    //     .then((invoiceFilePath) => {
    //         // Log the file path where the PDF is saved
    //         console.log('Invoice saved at:', invoiceFilePath);
    //     })
    //     .catch((error) => {
    //         console.error('Error generating invoice:', error);
    //     });
  } catch (error) {
    console.log(error.message);
    return res.status(200).send({ code: 500, message: error.message });
  }
};


// exports.reportArtist = async (req, res) => {
//   try {
//     const data = req.query;
//     // data.user_id = req.user._id;
//     const obj = {}
//     if(data.id){
//       obj._id = mongoose.Types.ObjectId(data.id)
//     }

//     const regexPhoneNo = new RegExp(data.search, 'i');
//     const regexStageName = new RegExp(data.search, 'i');
//     const regexFirstName = new RegExp(data.search, 'i');

//     // Constructing the $match stage to include search functionality
//     const matchStage = {
//       $match: {
//         $and: [
//           obj, // Previous conditions, if any
//           data.search && !data.id ? {
//             $or: [
//               { phone_no: { $regex: regexPhoneNo } },
//               { "user_details.stage_name": { $regex: regexStageName } },
//               { "artistdetails.stage_name": { $regex: regexStageName } },
//               { "user_details.first_name": { $regex: regexFirstName } },
//               { "artistdetails.first_name": { $regex: regexFirstName } }
//             ]
//           } : {}
//         ]
//       }
//     };




//     // Pipeline to get the count
//     const countPipeline = [
//       matchStage,
//       { $count: "totalCount" }
//     ];

//     // const countPipeline = [
//     //   { $match: obj }, // Match stage to filter documents based on criteria
//     //   { $count: "totalCount" } // Count stage to get the total number of documents
//     // ];

//     const countResult = await report_artist.aggregate(countPipeline);
//     const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0; // Extract the totalCount from the result array

//     // Now, execute the pipeline to get the actual data with limit and offset
//     const dataPipeline = [
//       matchStage,

//       {
//         $lookup: {
//           from: "reportartists",
//           localField: "artist_id",
//           foreignField: "artist_id",
//           as: "data",
//           pipeline: [
//             {
//               $lookup: {
//                 from: "users",
//                 localField: "user_id",
//                 foreignField: "_id",
//                 as: "user_details"
//               }
//             },
//             // {
//             //   $match:
//             // }
//             {
//               $skip: data.id ? Number(data.offset) : 0
//             },
//             {
//               $limit: data.id ? Number(data.limit) : Number.MAX_SAFE_INTEGER,
//             }
//           ]
//         }
//       },
//       {
//         $addFields: {
//           reportCount: { $size: "$data" }
//         }
//       }
//     ];

//     if (!data.id) {
//       dataPipeline.push(
//         { $skip: Number(data.offset) },
//         { $limit: Number(data.limit) }
//       );
//     }

//     const dataResult = await report_artist.aggregate(dataPipeline);
//     // const blocktimeslots = await reportItem(report_artist, data);
//     return res.status(200).json({
//       code: 200,
//       count:totalCount,
//       data: dataResult,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };



exports.holdbookingPayout = async (req, res) => {
  try {
    const data = req.body;
    let walk_through
    data.on_hold = true
    walk_through = await Booking.updateMany({ _id: data.booking_id }, data)

    return res.status(200).json({ code: 200, data: walk_through });
  } catch (error) {

    handleError(res, error);
  }
};

function payOutArtist(Bank_Account, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const bankAccount = await Bank_Account.findOne({
        is_primary: true,
        user_id: data.user_id,
      });

      console.log("Data: ", data);
      console.log("bankAccount: ", bankAccount);
      let mode = "NEFT"
      if (!bankAccount) {
        mode = "UPI"
      }
      const obk = {
        account_number: "2323230042544184",
        fund_account: {
          id: bankAccount.razor_fund_account_id
        },
        amount: data.amount,
        currency: "INR",

      }
      await POST(
        `${RAZOR_PAY_URL}v1/fund_accounts/validations`,
        obk,
        {
          Authorization: "Basic " + new Buffer(KEY_ID + ":" + KEY_SECRET).toString("base64"),
          "Content-Type": "application/json",
        }
      );


      const respCONTACT = await POST(
        `${RAZOR_PAY_URL}v1/payouts`,
        {
          account_number: "2323230042544184",
          fund_account_id: bankAccount.razor_fund_account_id,
          amount: Math.round(data.amount * 100),
          // "amount": 10 * 100,
          currency: "INR",
          mode: mode,
          purpose: "payout",
          queue_if_low_balance: false,
          reference_id: "",
          narration: "",
          notes: {},
        },
        {
          Authorization:
            "Basic " +
            new Buffer(KEY_ID + ":" + KEY_SECRET).toString("base64"),
          "Content-Type": "application/json",
        }
      );

      console.log(respCONTACT.data);




      resolve(respCONTACT.data);
    } catch (err) {
      reject(buildErrObject(422, err.message));
    }
  });
}

exports.testpayout = async (req, res) => {
  try {
    const data = req.body;

    // const user_id = req.user._id;

    const post = await payOutArtist(Bank_Account, data)


    return res.status(200).json({
      code: 200,
      data: post
    });
  } catch (error) {
    handleError(res, error);
  }
};




exports.sendNotification = async (req, res) => {
  try {
    const data = req.body;
    console.log('user_id', req.user._id);
    for (let i = 0; i < req.body.user_id.length; i++) {
      const element = req.body.user_id[i];
      const finduserispromotional = await User.findOne({ _id: element, promotional_notification: true })
      if (finduserispromotional) {

        const notificationObj = {
          sender_id: mongoose.Types.ObjectId(req.user._id),
          receiver_id: finduserispromotional._id,// mongoose.Types.ObjectId(req.body.user_id),
          type: "AdminNotification",
          title: req.body.title,
          body: req.body.body,
          is_admin: true,
          // imageUrl: data.imageUrl,
          // landing_page: data.landing_page
        }

        const resp = await _sendAdminNotification(notificationObj);

        
        console.log("resp", resp);
        return res.status(200).json({
          code: 200,
          data: "sent",
        });
      } else {
        return res.status(400).json({
          code: 400,
          data: "No eligible users found with Promotional notifications enabled",
        });
      }
    }
    // const notificationObj = {
    //   sender_id: mongoose.Types.ObjectId(req.user._id),
    //   receiver_id: { $in: (req.body.user_id) },// mongoose.Types.ObjectId(req.body.user_id),
    //   type: "AdminNotification",
    //   title: req.body.title,
    //   body: req.body.body,
    //   is_admin: true
    // }

    // console.log(notiObj);
    // const resp = await _sendAdminNotification(notificationObj);
    // console.log("resp", resp);

    // return res.status(200).json({
    //   code: 200,
    //   data: "sent",
    // });
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






exports.addbannerOrhowitworks = async (req, res) => {
  try {
    const data = req.body;
    console.log('user_id', req.user._id);
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "Slides",
      });
      data.image = media.data.Location;
    }
    if (req.files && req.files.media1) {
      var media = await uploadFile({
        image_data: req.files.media1,
        path: "Slides",
      });
      data.image1 = media.data.Location;
    }
    if (req.files && req.files.media2) {
      var media = await uploadFile({
        image_data: req.files.media2,
        path: "Slides",
      });
      data.image2 = media.data.Location;
    }
    if (req.files && req.files.media3) {
      var media = await uploadFile({
        image_data: req.files.media3,
        path: "Slides",
      });
      data.image3 = media.data.Location;
    }
    const value = await createItem(dashboardManagment, data);
    return res.status(200).json(value)
  } catch (error) {
    handleError(res, error);
  }
};




exports.getdashboardManagment = async (req, res) => {
  try {

    const data = req.query;
    let sortcoindition;
    let whereObj = {}




    if (data._id) {
      // whereObj._id = data._id
      const byid = await coupon.findById(data._id)
      return res.status(200).json({
        code: 200,
        data: byid
      });
    } else {
      if (data.sort == "old") {
        sortcoindition = { createdAt: 1 }
      } else {
        sortcoindition = { createdAt: -1 }
      }
      if (data.search) {
        whereObj.$or = [
          { title: { $regex: data.search, $options: "i" } },
          // { description: { $regex: data.search, $options: "i" } },
        ];
      }
      if (data.type) {
        whereObj.type = data.type;
      }

      const limit = data.limit ? data.limit : 100;
      const offset = data.offset ? data.offset : 0;

      let slides_data = await getItemsCustom(dashboardManagment, whereObj, "", "", sortcoindition, limit, offset);
      slides_data.count = await dashboardManagment.find(whereObj).count();
      return res.status(200).json({
        code: 200,
        data: slides_data
      });
    }


    // return res.status(200).json({
    //   code: 200,
    //   data:slides_data
    // });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deletedashboardManagment = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(dashboardManagment, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updatedashboardManagment = async (req, res) => {
  try {
    const data = req.body;
    // if (req.files && req.files.media) {
    //   var media = await uploadFile({
    //     image_data: req.files.media,
    //     path: "Slides",
    //   });
    //   data.media = media.data.Location;
    // }
    if (req.files && req.files.media) {
      var media = await uploadFile({
        image_data: req.files.media,
        path: "Slides",
      });
      data.image = media.data.Location;
    }

    if (req.files && req.files.media1) {
      var media = await uploadFile({
        image_data: req.files.media1,
        path: "Slides",
      });
      data.image1 = media.data.Location;
    }
    if (req.files && req.files.media2) {
      var media = await uploadFile({
        image_data: req.files.media2,
        path: "Slides",
      });
      data.image2 = media.data.Location;
    }
    if (req.files && req.files.media3) {
      var media = await uploadFile({
        image_data: req.files.media3,
        path: "Slides",
      });
      data.image3 = media.data.Location;
    }
    const slide_data = await updateItemThroughId(dashboardManagment, data._id, data);
    return res.status(200).json(slide_data);
  } catch (error) {

    handleError(res, error);
  }
};





exports.addmeetOurArtist = async (req, res) => {
  try {
    const data = req.body;
    console.log('user_id', req.user._id);
    let value
    for (const xlsx of data.artistId) {
      data.user_id = xlsx
      value = await createItem(meetOurArtist, data);
    }
    return res.status(200).json(value)
  } catch (error) {
    handleError(res, error);
  }
};




exports.getmeetOurArtist = async (req, res) => {
  try {

    const data = req.query;
    let sortcoindition;
    let whereObj = {}




    if (data._id) {
      // whereObj._id = data._id
      const byid = await coupon.findById(data._id)
      return res.status(200).json({
        code: 200,
        data: byid
      });
    } else {
      if (data.sort == "old") {
        sortcoindition = { createdAt: 1 }
      } else {
        sortcoindition = { createdAt: -1 }
      }
      if (data.search) {
        whereObj.$or = [
          { title: { $regex: data.search, $options: "i" } },
          // { description: { $regex: data.search, $options: "i" } },
        ];
      }
      if (data.type == "how_it_works") {
        whereObj.type = "how_it_works";
      } else {
        whereObj.type = "web_banner";
      }

      const limit = data.limit ? data.limit : 100;
      const offset = data.offset ? data.offset : 0;

      let slides_data = await getItemsCustom(meetOurArtist, whereObj, "", "user_id", sortcoindition, limit, offset);
      slides_data.count = await meetOurArtist.find(whereObj).count();
      return res.status(200).json({
        code: 200,
        data: slides_data
      });
    }


    // return res.status(200).json({
    //   code: 200,
    //   data:slides_data
    // });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deletemeetOurArtist = async (req, res) => {
  try {

    const _id = req.params;

    const status = await deleteItem(meetOurArtist, _id);
    status.code = 200;
    return res.status(200).json(status);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updatemeetOurArtist = async (req, res) => {
  try {
    const data = req.body;
    // if (req.files && req.files.media) {
    //   var media = await uploadFile({
    //     image_data: req.files.media,
    //     path: "Slides",
    //   });
    //   data.media = media.data.Location;
    // }

    const slide_data = await updateItemThroughId(meetOurArtist, data._id, data);
    return res.status(200).json(slide_data);
  } catch (error) {

    handleError(res, error);
  }
};







exports.findlistOfUserforchat = async (req, res) => {
  try {
    const datas = req.query;
    let condition = {current_role: "user"};
    // let condition1 = {current_role: "user"}
    // if (datas.search) {
    //   const searchRegex = { $regex: datas.search, $options: 'i' };
    //   condition.$or = [
    //     { stage_name: searchRegex },
    //     { first_name: searchRegex },
    //     { base_location: searchRegex },
    //     { phone_number: searchRegex },
    //     { email: searchRegex },
    //     { art_form: searchRegex },
    //   ];
    //   // headline = data.search
    // }

    if (datas.search) {
      const searchRegex = new RegExp(datas.search, 'i') //{ $regex: datas.search, $options: 'i' };
      condition.$or = [
        {
          $or:[
            { stage_name: searchRegex },
            { first_name: searchRegex },
            { base_location: searchRegex },
            { phone_number: searchRegex },
            { email: searchRegex },
            // { full_name: searchRegex },
            { art_form: searchRegex },
          ]
        },{
          $expr: {
            $regexMatch: {
              input: { $concat: ["$first_name", " ", "$last_name"] },
              regex: searchRegex
            }
          }
        }
        // { stage_name: searchRegex },
        // { first_name: searchRegex },
        // { base_location: searchRegex },
        // { phone_number: searchRegex },
        // { email: searchRegex },
        // // { full_name: searchRegex },
        // { art_form: searchRegex },
      ];
      // headline = data.search
    }
    const params = [
    

      {$match:condition},
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          first_name:1,
          last_name:1,
          artist_profile_image:1
        }
      }

    ]


    const response = await User.aggregate(params)


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
    const responses = await User.aggregate(params)
    return res.status(200).json({ code: 200, responses, count: response.length });
    // return res.status(200).json({ code: 200, data: parent_artForm, count: parent_artFormCount });
  } catch (error) {
    handleError(res, error);
  }
};





exports.findlistOfArtistforchat = async (req, res) => {
  try {
    const datas = req.query;
    let condition = {current_role: "artist"};
    // let condition1 = {current_role: "user"}
    if (datas.search) {
      const searchRegex = new RegExp(datas.search, 'i') //{ $regex: datas.search, $options: 'i' };
      condition.$or = [
        {
          $or:[
            { stage_name: searchRegex },
            { first_name: searchRegex },
            { base_location: searchRegex },
            { phone_number: searchRegex },
            { email: searchRegex },
            // { full_name: searchRegex },
            { art_form: searchRegex },
          ]
        },{
          $expr: {
            $regexMatch: {
              input: { $concat: ["$first_name", " ", "$last_name"] },
              regex: searchRegex
            }
          }
        }
        // { stage_name: searchRegex },
        // { first_name: searchRegex },
        // { base_location: searchRegex },
        // { phone_number: searchRegex },
        // { email: searchRegex },
        // // { full_name: searchRegex },
        // { art_form: searchRegex },
      ];
      // headline = data.search
    }
    const params = [
     

      {$match:condition},
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 1,
          first_name:1,
          last_name:1,
          artist_profile_image:1
        }
      }

    ]


    const response = await User.aggregate(params)


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
    const responses = await User.aggregate(params)
    return res.status(200).json({ code: 200, responses, count: response.length });
    // return res.status(200).json({ code: 200, data: parent_artForm, count: parent_artFormCount });
  } catch (error) {
    handleError(res, error);
  }
};




exports.createroom = async (req, res) => {
  try {
    const data = req.body
    console.log('data---', data)
    data.sender_id = req.user._id
    const condition = {
      [Op.or]: [
        {
          sender_id: data.sender_id,
          receiver_id: data.receiver_id
        },
        {
          sender_id: data.receiver_id,
          receiver_id: data.sender_id
        }
      ]
    }
    console.log('condition---', condition)
    let roomDetail = await getItemAccQuery(Models.Room, condition)
    console.log('roomDetail---', roomDetail)

    if (!roomDetail) {
      const obj = {
        room_id: uuid.v4(),
        sender_id: data.sender_id,
        receiver_id: data.receiver_id
      }
      console.log('roomDetail---', roomDetail)
      roomDetail = await createItem(Models.Room, obj)
    }
    res.status(200).json({ code: 200, data: roomDetail })
  } catch (error) {
    utils.handleError(res, error)
  }
}
