const jwt = require("jsonwebtoken");
const User = require("../models/user");

const MediaHouse = require("../models/media_houses");
const db = require("../middleware/db");
const Admin = require("../models/admin");
const stripe = require("stripe")(process.env.STRIPE)
const notify = require("../middleware/notification");
const FcmDevice = require("../models/fcm_devices");
const UserAccess = require("../models/userAccess");
const notification = require("../models/notification");
const UserVerification = require("../models/user_verification");
const STORAGE_PATH_HTTP = process.env.STORAGE_PATH_HTTP;
const ForgotPassword = require("../models/forgotPassword");
const utils = require("../middleware/utils");
const uuid = require("uuid");
const { addHours } = require("date-fns");
const { matchedData } = require("express-validator");
const auth = require("../middleware/auth");
const emailer = require("../middleware/emailer");
const { uploadFiletoAwsS3Bucket } = require("../shared/helpers");
const HOURS_TO_BLOCK = 2;
const LOGIN_ATTEMPTS = 1000000;
const TIME_FOR_OTP_EXPIRE_IN_MINUTES = 5;
const STORAGE_PATH = process.env.STORAGE_PATH;
const moment = require("moment");
const { resolve } = require("path");
const { updateItem } = require('../shared/core')
const TwilioaccountSid = process.env.Twilio_accountSid
const twilio_token = process.env.twilio_token
/*********************
 * Private functions *
 *********************/
// push notification

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
          // var message = "";
          let notificationObj = {
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            title: data.title,
            body: data.body,
          };
          try {
            console.log(
              "--------------- N O T I - - O B J ------",
              notificationObj
            );

            await db.createItem(notificationObj, notification);
          } catch (err) {
            console.log("main err: ", err);
          }

          // console.log("Before find user device");

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
    );
  } else {
    throw utils.buildErrObject(422, "--* no type *--");
  }
};






/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = (user) => {
  // Gets expiration time
  // const expiration =
  // Math.floor(Date.now() / 1000) + 2 * process.env.JWT_EXPIRATION_IN_MINUTES;

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          role: user.role,
          _id: user._id,
        },
        // exp: expiration,
      },
      process.env.JWT_SECRET
    )
  );
};

const generateAdminToken = (user) => {
  // Gets expiration time
  // const expiration =
  // Math.floor(Date.now() / 1000) + 2 * process.env.JWT_EXPIRATION_IN_MINUTES;

  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          role: user.role,
          _id: user._id,
        },
        // exp: expiration,
      },
      process.env.JWT_SECRET
    )
  );
};
/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req) => {
  let user;
  if (req.role === "Hopper") {
    user = {
      _id: req._id,
      first_name: req.first_name,
      last_name: req.last_name,
      user_name: req.user_name,
      email: req.email,
      role: req.role,
      country_code: req.country_code,
      phone: req.phone,
      profile_image: req.profile_image,
      avatar_id: req.avatar_id,
      address: req.address,
      recieve_task_notification: req.recieve_task_notification,
      bank_detail: req.bank_detail,
      doc_to_become_pro: req.doc_to_become_pro,
      latitude: req.latitude,
      longitude: req.longitude,
      verified: req.verified,
      verification: req.verification,
      is_terms_accepted: req.is_terms_accepted,
      avatar_id: req.avatar_id,
      social_id: req.social_id,
      social_type: req.social_type,
      postal_code: req.postal_code,
      post_code: req.post_code,
      stripe_account_id: req.stripe_account_id,
      stripe_customer_id: req.stripe_customer_id,
      stripe_status: req.stripe_status
    };
  } else if (req.role === "MediaHouse") {
    user = {
      _id: req._id,
      email: req.email,
      phone: req.phone,
      profile_image: req.profile_image,
      role: "MediaHouse",
      verified: req.verified,
      full_name: req.full_name,
      first_name: req.first_name,
      last_name: req.last_name,
      designation_id: req.designation_id,
      company_name: req.company_name,
      company_number: req.company_number,
      company_vat: req.company_vat,
      office_details: req.office_details,
      admin_detail: req.admin_detail,
      admin_rignts: req.admin_rignts,
      is_administator: req.is_administator,
      is_responsible_for_user_rights: req.is_responsible_for_user_rights,
      is_responsible_for_granting_purchasing:
        req.is_responsible_for_granting_purchasing,
      is_responsible_for_fixing_minimum_and_maximum_financial_limits:
        req.is_responsible_for_fixing_minimum_and_maximum_financial_limits,
      is_confirm: req.is_confirm,
      upload_docs: req.upload_docs,
      company_bank_details: req.company_bank_details,
      sign_leagel_terms: req.sign_leagel_terms,
      user_name: req.user_name,
      stripe_customer_id: req.stripe_customer_id,
      city: req.city,
      country: req.country,
      appartment:req.appartment
    };
  } else if (req.role === "Adduser") {
    user = {
      _id: req._id,
      email: req.email,
      phone: req.phone,
      role: "Adduser",
      verified: req.verified,
      full_name: req.full_name,
      first_name: req.first_name,
      last_name: req.last_name,
      designation_id: req.designation_id,
      company_name: req.company_name,
      company_number: req.company_number,
      company_vat: req.company_vat,
      office_details: req.office_details,
      admin_detail: req.admin_detail,
      admin_rignts: req.admin_rignts,
      is_administator: req.is_administator,
      is_responsible_for_user_rights: req.is_responsible_for_user_rights,
      is_responsible_for_granting_purchasing:
        req.is_responsible_for_granting_purchasing,
      is_responsible_for_fixing_minimum_and_maximum_financial_limits:
        req.is_responsible_for_fixing_minimum_and_maximum_financial_limits,
      is_confirm: req.is_confirm,
      upload_docs: req.upload_docs,
      company_bank_details: req.company_bank_details,
      sign_leagel_terms: req.sign_leagel_terms,
      user_name: req.user_name,
      admin_password: req.admin_password,
      // full_name:req.full_name,
      country_code: req.country_code,
      pin_code: req.pin_code,
      profile_image: req.profile_image,
      city: req.city,
      country: req.country,
      phone_no: req.phone_no,
      website: req.website,
      user_first_name: req.user_first_name,
      user_last_name: req.user_last_name,
      designation: req.designation,
      select_office_name: req.select_office_name,
      select_user_office_department: req.select_user_office_department,
      min_price: req.min_price,
      max_price: req.max_price,
      reason_for_delete: req.reason_for_delete,
      stripe_customer_id: req.stripe_customer_id,
    };
  } else if (req.role === "User_mediaHouse") {
    user = {
      _id: req._id,
      email: req.email,
      phone: req.phone,
      role: "User_mediaHouse",
      verified: req.verified,
      full_name: req.full_name,
      first_name: req.first_name,
      last_name: req.last_name,
      designation_id: req.designation_id,
      company_name: req.company_name,
      company_number: req.company_number,
      company_vat: req.company_vat,
      office_details: req.office_details,
      admin_detail: req.admin_detail,
      allow_to_purchased_content: req.allow_to_purchased_content,
      allow_to_broadcat: req.allow_to_broadcat,
      allow_to_complete: req.allow_to_complete,
      is_onboard: req.is_onboard,
      allow_to_chat_externally: req.allow_to_chat_externally,
      is_deleted: req.is_deleted,
      onboard_other_user: req.onboard_other_user,
      media_house_status: req.media_house_status,
      isSocialRegister: req.isSocialRegister,
      is_terms_accepted: req.is_terms_accepted,
      status: req.status,
      verification: req.verification,
      checkAndApprove: req.checkAndApprove,
      isTempBlocked: req.isTempBlocked,
      isPermanentBlocked: req.isPermanentBlocked,
      verified: req.verified,
      blockaccess: req.blockaccess,
      administator_email: req.administator_email,
      user_first_name: req.user_first_name,
      user_last_name: req.user_last_name,
      user_email: req.user_email,
      media_house_id: req.media_house_id,
      country_code: req.country_code,
      admin_rignts: req.admin_rignts,
    };




  }

  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== "production") {
    user = {
      ...user,
      verification: req.verification,
    };
  }
  return user;
};

const setAdminInfo = (req) => {
  let user = {
    id: req.id,
    name: req.name,
    email: req.email,
    role: req.role,
    verified: req.verified,
  };
  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== "production") {
    user = {
      ...user,
      verification: req.verification,
    };
  }
  return user;
};
/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: utils.getIP(req),
      browser: utils.getBrowserInfo(req),
      country: utils.getCountry(req),
    });
    userAccess.save((err) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      const userInfo = setUserInfo(user);
      // Returns data with access token
      resolve({
        token: generateToken(user),
        user: userInfo,
      });
    });
  });
};

const saveAdminAccessAndReturnToken = async (req, user) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: utils.getIP(req),
      browser: utils.getBrowserInfo(req),
      country: utils.getCountry(req),
    });
    userAccess.save((err) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      const userInfo = setAdminInfo(user);
      // Returns data with access token
      resolve({
        token: generateAdminToken(user),
        user: userInfo,
      });
    });
  });
};
/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK);
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      if (result) {
        resolve(utils.buildErrObject(409, "BLOCKED_USER_FOR_2_HOURS"));
      }
    });
  });
};

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user) => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      if (result) {
        resolve(true);
      }
    });
  });
};

/**
 * Checks that login attempts are greater than specified in constant and also that blockexpires is less than now
 * @param {Object} user - user object
 */
const blockIsExpired = (user) =>
  user.loginAttempts > LOGIN_ATTEMPTS && user.blockExpires <= new Date();

const otpTimeExpired = (otp_expire_time) => {
  return new Promise((resolve, reject) => {
    if (otp_expire_time >= new Date()) {
      resolve(false);
    } else {
      reject(utils.buildErrObject(422, "OTP_EXPIRED"));
    }
  });
};

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async (user) => {
  return new Promise((resolve, reject) => {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0;
      user.save((err, result) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message));
        }
        if (result) {
          resolve(true);
        }
      });
    } else {
      // User is not blocked, check password (normal behaviour)
      resolve(true);
    }
  });
};

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async (user) => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(
        utils.buildErrObject(
          409,
          "Your Account is Blocked For 2 Hours Try later"
        )
      );
    }
    resolve(true);
  });
};

const isTempBlocked = async (user) => {
  return new Promise((resolve, reject) => {
    if (user.isTempBlocked == "true" || user.isTempBlocked == true) {
      reject(utils.buildErrObject(409, "Your Account is temporarily blocked"));
    }
    resolve(true);
  });
};

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
/*const findUser = async email => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      'password loginAttempts blockExpires name email role verified verification',
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}*/
const findUser = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
      },
      "password loginAttempts blockExpires  email role verified verification first_name last_name user_name country_code phone profile_image address bank_detail recieve_task_notification location latitude longitude is_terms_accepted status forgotPassOTP forgotPassOTPExpire admin_detail admin_rignts upload_docs company_bank_details sign_leagel_terms stripe_customer_id chat_status",
      (err, item) => {
        console.log('item--->', item);
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    );
  });
};

const findUser2 = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
      },
      // "password loginAttempts blockExpires  email role verified verification first_name last_name user_name country_code phone profile_image address bank_detail recieve_task_notification location latitude longitude is_terms_accepted status forgotPassOTP forgotPassOTPExpire admin_detail admin_rignts upload_docs company_bank_details sign_leagel_terms stripe_customer_id chat_status",
      (err, item) => {
        console.log('item--->', item);
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    );
  });
};



const findUserWithUserName = async (user_name) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        user_name,
      },
      "password loginAttempts blockExpires  email role verified verification first_name last_name user_name country_code phone profile_image address bank_detail recieve_task_notification location latitude longitude is_terms_accepted avatar_id status doc_to_become_pro isTempBlocked isPermanentBlocked stripe_customer_id status",
      (err, item) => {
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    ).populate("avatar_id");
  });
};
const findUserWithPhone = async (phone) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        phone,
      },
      "password loginAttempts blockExpires  email role verified verification first_name last_name user_name country_code phone profile_image address bank_detail recieve_task_notification location latitude longitude is_terms_accepted avatar_id status doc_to_become_pro isTempBlocked isPermanentBlocked stripe_customer_id status",
      (err, item) => {
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    ).populate("avatar_id");
  });
};
const findAdmin = async (email) => {
  return new Promise((resolve, reject) => {
    Admin.findOne(
      {
        email,
      },
      "password loginAttempts blockExpires name email role verified verification isTempBlocked forgotPassOTP",
      (err, item) => {
        utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
        resolve(item);
      }
    );
  });
};

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
      resolve(item);
    });
  });
};

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async (user) => {
  // user.loginAttempts += 1;
  await saveLoginAttemptsToDB(user);
  return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(utils.buildErrObject(409, "WRONG_PASSWORD"));
    } else {
      resolve(blockUser(user));
    }
    reject(utils.buildErrObject(422, "ERROR"));
  });
};

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async (req) => {
  return new Promise((resolve, reject) => {
    req.verification = uuid.v4();
    console.log("register user===>", req);
    const UserData = new User(req);
    UserData.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(item);
    });
    /*{
      first_name: req.first_name,
      last_name: req.last_name,
      user_name: req.user_name,
      email: req.email,
      phone: req.role,
      country_code: req.country_code,
      phone: req.phone,
      password: req.password,
      profile_image: req.profile_image,
      avatar: req.avatar,
      address: req.address,
      recieve_task_notification: req.recieve_task_notification,
      // bank_detail: req.bank_detail,
      // doc_to_become_pro: req.doc_to_become_pro,
      latitude: req.latitude,
      longitude: req.longitude,
    }*/
  });
};

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (item, userInfo) => {
  if (process.env.NODE_ENV !== "production") {
    userInfo.verification = item.verification;
  }
  const data = {
    token: generateToken(item),
    user: userInfo,
  };
  return data;
};

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        verification: id,
        verified: false,
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, "NOT_FOUND_OR_ALREADY_VERIFIED");
        resolve(user);
      }
    );
  });
};

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.verified = true;
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve({
        email: item.email,
        verified: item.verified,
      });
    });
  });
};

/**
 * Marks a request to reset password as used
 * @param {Object} req - request object
 * @param {Object} forgot - forgot object
 */
const markResetPasswordAsUsed = async (req, forgot) => {
  return new Promise((resolve, reject) => {
    forgot.used = true;
    forgot.ipChanged = utils.getIP(req);
    forgot.browserChanged = utils.getBrowserInfo(req);
    forgot.countryChanged = utils.getCountry(req);
    forgot.save((err, item) => {
      utils.itemNotFound(err, item, reject, "NOT_FOUND");
      resolve(utils.buildSuccObject("PASSWORD_CHANGED"));
    });
  });
};

/**
 * Updates a user password in database
 * @param {string} password - new password
 * @param {Object} user - user object
 */
const updatePassword = async (password, user) => {
  return new Promise((resolve, reject) => {
    user.password = password;
    user.save((err, item) => {
      utils.itemNotFound(err, item, reject, "NOT_FOUND");
      resolve(item);
    });
  });
};

/**
 * Finds user by email to reset password
 * @param {string} email - user email
 */
const findUserToResetPassword = async (email) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        utils.itemNotFound(err, user, reject, "NOT_FOUND");
        resolve(user);
      }
    );
  });
};

/**
 * Checks if a forgot password verification exists
 * @param {string} id - verification id
 */
const findForgotPassword = async (id) => {
  return new Promise((resolve, reject) => {
    ForgotPassword.findOne(
      {
        _id: id,
        used: false,
      },
      (err, item) => {
        utils.itemNotFound(err, item, reject, "NOT_FOUND_OR_ALREADY_USED");
        resolve(item);
      }
    );
  });
};

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPassword = async (req) => {
  return new Promise(async (resolve, reject) => {
    const OTP = await generateOTP();
    // admin.forgotPassOTPExpire = new Date(
    //   moment().add(TIME_FOR_OTP_EXPIRE_IN_MINUTES, "minutes")
    // );
    const forgot = new ForgotPassword({
      email: req.body.email,
      verification: uuid.v4(),
      role: req.role,
      forgotPassOTP: OTP,
      ipRequest: utils.getIP(req),
      browserRequest: utils.getBrowserInfo(req),
      countryRequest: utils.getCountry(req),
    });
    forgot.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message));
      }
      resolve(item);
    });
  });
};

/**
 * Builds an object with created forgot password object, if env is development or testing exposes the verification
 * @param {Object} item - created forgot password object
 */
const forgotPasswordResponse = (item) => {
  let data = {
    msg: "RESET_EMAIL_SENT",
    email: item.email,
  };
  if (process.env.NODE_ENV !== "production") {
    data = {
      ...data,
      verification: item.verification,
      Otp: item.forgotPassOTP,
    };
  }
  return data;
};

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
const checkPermissions = async (data, next) => {
  return new Promise((resolve, reject) => {
    User.findById(data.id, (err, result) => {
      utils.itemNotFound(err, result, reject, "NOT_FOUND");
      if (data.roles.indexOf(result.role) > -1) {
        return resolve(next());
      }
      return reject(utils.buildErrObject(401, "UNAUTHORIZED"));
    });
  });
};

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(utils.buildErrObject(409, "BAD_TOKEN"));
      }
      resolve(decoded.data._id);
    });
  });
};

/********************
 * Public functions *
 ********************/

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.login = async (req, res) => {
  try {
    // const data = matchedData(req)
    const data = req.body;
    console.log(req.body);
    let USER;

    if (isNaN(data.userNameOrPhone)) {
      USER = await findUserWithUserName(data.userNameOrPhone);
      console.log(USER)
    } else {
      USER = await findUserWithPhone(data.userNameOrPhone);
    }

    await userIsBlocked(USER);
    await isTempBlocked(USER);

    await checkLoginAttemptsAndBlockExpires(USER);
    const isPasswordMatch = await auth.checkPassword(data.password, USER);

    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch(USER));
    } else {
      if (USER.isTempBlocked == true || USER.isPermanentBlocked == true) {
        throw utils.buildErrObject(422, "You are blocked by Admin ");
      } 
      // else if (USER.status !== "approved") {
      //   throw utils.buildErrObject(422, "You are not approved by Admin ");
      // } 
      else {
        // all ok, register access and return token
        USER.loginAttempts = 0;
        await saveLoginAttemptsToDB(USER);
        const { token, user } = await saveUserAccessAndReturnToken(req, USER);

        res.status(200).json({
          code: 200,
          token: token,
          user: user,
        });
      }
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.loginMediaHouse = async (req, res) => {
  try {
    // const data = matchedData(req)
    const data = req.body;
    console.log(req.body);
    let USER;

    if (isNaN(data.email)) {
      USER = await findUser2(data.email);
      // if(USER.role === "User_mediaHouse" ){
      //   USER = await findUser2(USER.administator_email);
      //   console.log()
      // }
    } else {
      USER = await findUserWithPhone(data.userNameOrPhone);
    }
    console.log("USER", USER);
    await userIsBlocked(USER);

    await checkLoginAttemptsAndBlockExpires(USER);
    const isPasswordMatch = await auth.checkPassword(data.password, USER);
    console.log("data------", isPasswordMatch);
    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch(USER));
    } else {
      // all ok, register access and return token
      USER.loginAttempts = 0;
      await saveLoginAttemptsToDB(USER);
      console.log("User===================", USER)
      // if(USER.role == "User_mediaHouse" ){

      //   USER = await findUser2(USER.administator_email);
      // }
      console.log("Ussssssser===================", USER)
      const { token, user } = await saveUserAccessAndReturnToken(req, USER);
      console.log("user===================", user)
      res.status(200).json({
        code: 200,
        token: token,
        user: user,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    // const data = matchedData(req)
    const data = req.body;
    console.log(req.body);
    const admin = await findAdmin(data.email);
    // console.log(user)

    await userIsBlocked(admin);
    await isTempBlocked(admin);
    await checkLoginAttemptsAndBlockExpires(admin);
    const isPasswordMatch = await auth.checkPassword(data.password, admin);

    if (!isPasswordMatch) {
      utils.handleError(res, await passwordsDoNotMatch(admin));
    } else {
      // all ok, register access and return token
      admin.loginAttempts = 0;
      await saveLoginAttemptsToDB(admin);
      console.log("---------- Ites", isPasswordMatch);
      // return;

      res.status(200).json(await saveAdminAccessAndReturnToken(req, admin));
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.verifyEmail = async (req, res) => {
  jwt.verify(req.params.token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      res.status(422).send("<h1> Token has been expired or invalid </h1>");
      //utils.handleError(res, err)
    } else {
      console.log(decoded);

      model.User.update(
        {
          email_verified: "1",
          email_verified_at: Date.now(),
        },
        {
          where: {
            id: decoded.data,
          },
        }
      )
        .then((flag) => {
          if (flag) {
            res.status(201).send("<h1> Email Verified Successfully </h1>");
          } else {
            res
              .status(201)
              .send("<h1 style='color:red'> Something Went Wrong </h1>");
          }
        })
        .catch((err) => {
          console.log(err);
          res
            .status(201)
            .send("<h1 style='color:red'> Something Went Wrong </h1>");
        });

      //
    }
  });
};

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.register = async (req, res) => {
  try {
    const data = req.body;
    console.log("DATA ========>", data);
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    if (data.role === "Hopper") {
      const [doesEmailExists, doesPhoneExixts, doesUserNameExists] =
        await Promise.all([
          emailer.emailExists(data.email),
          emailer.phoneExists(data.phone),
          emailer.userNameExists(data.user_name),
        ]);
      if (!doesEmailExists && !doesPhoneExixts && !doesUserNameExists) {
        const customer = await stripe.customers.create({
          email: req.body.email,
          name:data.user_name
        });

        // const account = await stripe.accounts.create({
        //   type: "standard",
        //   country: "US",
        //   email: req.body.email,
        //   capabilities: {
        //     card_payments: { requested: true },
        //     transfers: { requested: true },
        //   },
        // });


        // const account = await stripe.accounts.create({
        //   type: 'express',
        //   country: 'US',
        //   email: req.user.email,
        //   business_type:'individual',
        //   capabilities: {
        //     card_payments: {requested: true},
        //     transfers: {requested: true},
        //     link_payments: {requested: true},
        //     // india_international_payments: {requested: true},
        //     bank_transfer_payments: {requested: true},
        //     card_payments: {requested: true},
        //   },
        //   // individual:{
        //   //   address:{
        //   //     city:"Mill Creek",
        //   //     country:"US",
        //   //     postal_code:"98012",
        //   //     state:"WA"
        //   //   },
        //   //   first_name:"test",
        //   //   last_name:"test",
        //   // }
        // });

        console.log("data-------", customer);
        data.stripe_customer_id = customer.id;
        // data.stripe_account_id = account.id;
        if (req.files && req.files.profile_image) {
          data.profile_image = await uploadFiletoAwsS3Bucket({
            fileData: req.files.profile_image,
            path: `public/userImages`,
          })

          // data.profile_image = await utils.uploadFile({
          //   fileData: req.files.profile_image,
          //   path: `${STORAGE_PATH}/userImages`,
          // });
        }
        const item = await registerUser(data);
        const userInfo = setUserInfo(item);
        const response = returnRegisterToken(item, userInfo);
        // emailer.sendRegistrationEmailMessage(locale, item);
        res.status(201).json({
          code: 200,
          response: response,
        });
      }
    } else if (data.role === "MediaHouse") {
      const [doesEmailExists, doesPhoneExixts] = await Promise.all([
        emailer.emailExists(data.email),
        emailer.phoneExists(data.phone),
      ]);
      if (!doesEmailExists && !doesPhoneExixts) {
        const customer = await stripe.customers.create({
          email: req.body.email,
          name:data.first_name 
        });

        console.log("data-------", customer);
        data.stripe_customer_id = customer.id;



        const item = await registerUser(data);
        const userInfo = setUserInfo(item);
        const response = returnRegisterToken(item, userInfo);
        const emailObjs = {
          to: data.email,
          name: data.first_name,
          subject: "Successfully Registered",
          // userName: `${data.user_first_name} ${data.user_last_name}`
        }
        const valu = await  emailer.sendMailToAdministator(locale, emailObjs);
        const notiObj = {
          sender_id: response.user._id,
          receiver_id: response.user._id,
          title: " Successfully registered ",
          body: `👋🏼 Congrats ${response.user.first_name}, your onboarding is now complete👍🏼 Please check your registered email id, to log onto the platform 🚀. If you need any assistance, please speak to a member of your onboarding team or call, email or chat with us on the platform. Our helpful and experienced teams will be happy to assist 🙌🏼 Welcome to PRESSHOP🐰 `,
        };
        const resp = await _sendPushNotification(notiObj);
      console.log("emailer===============",valu)
        res.status(201).json(response);
      }
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.socialLogin = async (req, res) => {
  try {
    const data = req.body;

    const socialAccount = await emailer.socialIdExists(
      data.social_id,
      data.social_type
    );
    if (socialAccount) {
      const { token, user } = await saveUserAccessAndReturnToken(
        req,
        socialAccount
      );

      res.status(200).json({
        code: 200,
        token: token,
        user: user,
      });
    } else {
      res.status(200).json({
        code: 200,
        socialAccount: socialAccount,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.hopperSocialRegister = async (req, res) => {
  try {
    const data = req.body;
    data.role = "Hopper";
    console.log("DATA ========>", data);
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();

    const [doesEmailExists, doesPhoneExixts] = await Promise.all([
      emailer.emailExists(data.email),
      emailer.phoneExists(data.phone),
    ]);
    if (!doesEmailExists && !doesPhoneExixts) {
      const doesSocialIdExists = await emailer.socialIdExists(
        data.social_id,
        data.social_type
      );
      if (!doesSocialIdExists) {
        if (req.files && req.files.profile_image) {
          data.profile_image = await utils.uploadFile({
            fileData: req.files.profile_image,
            path: `${STORAGE_PATH}/userImages`,
          });
        }
        data.isSocialRegister = true;
        const item = await registerUser(data);

        const userInfo = setUserInfo(item);
        const { token, user } = returnRegisterToken(item, userInfo);
        // emailer.sendRegistrationEmailMessage(locale, item);
        res.status(200).json({
          code: 200,
          token: token,
          user: user,
        });
      }
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res) => {
  try {
    req = matchedData(req);
    const user = await verificationExists(req.id);
    res.status(200).json(await verifyUser(user));
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.hopperForgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    const data = matchedData(req);
    const user = await findUser(data.email);
    const OTP = await generateOTP();
    user.forgotPassOTP = OTP;
    user.forgotPassOTPExpire = new Date(
      moment().add(TIME_FOR_OTP_EXPIRE_IN_MINUTES, "minutes")
    );
    user.save();
    const accountSid = TwilioaccountSid;
    const authToken = twilio_token
    const client = require('twilio')(accountSid, authToken);
    // const emailOTP = await generateOTP();
    const phoneOTP = await generateOTP();
    client.messages
          .create({
             from: '+447700174526',
             body: phoneOTP,
             to: user.country_code + user.phone
           })
          .then(message => console.log(message.sid));
    // emailer.sendHopperResetPasswordOTP(locale, user);
    const notiObj = {
      sender_id: user._id,
      receiver_id: user._id,
      title: "Reset your password",
      body: `👋🏼 Hi ${user.user_name}, you've got mail 📩  Please check your resgistered email id, and reset your password 🔒 Thanks - Team PRESSHOP🐰 `,
    };
    const resp = await _sendPushNotification(notiObj);
    res.status(200).json({
      code: 200,
      data: "OTP_SENT",
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.mediaHouseForgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    const data = matchedData(req);
    const user = await findUser(data.email);
    const OTP = await generateOTP();
    user.forgotPassOTP = OTP;
    user.forgotPassOTPExpire = new Date(
      moment().add(TIME_FOR_OTP_EXPIRE_IN_MINUTES, "minutes")
    );
    user.save();
    emailer.sendHopperResetPasswordOTP(locale, user);
    res.status(200).json({
      code: 200,
      data: "OTP_SENT",
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.adminForgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale();
    const data = matchedData(req);
    const admin = await findAdmin(data.email);

    // admin.forgotPassOTPExpire = new Date(
    //   moment().add(TIME_FOR_OTP_EXPIRE_IN_MINUTES, "minutes")
    // );

    // req.role = admin.role
    const OTP = await generateOTP();
    admin.forgotPassOTP = OTP;
    admin.save();
    emailer.sendHopperResetPasswordOTP(locale, admin);
    // const item = await saveForgotPassword(req);
    // emailer.sendAdminResetPasswordEmailMessage(locale, item);
    // res.status(200).json(forgotPasswordResponse(item));
    res.status(200).json({
      code: 200,
      data: "OTP_SENT",
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.hopperResetPassword = async (req, res) => {
  try {
    const data = matchedData(req);
    const USER = await findUser(data.email);
    console.log("USER====>", data);
    if (!(await otpTimeExpired(USER.forgotPassOTPExpire))) {
      if (USER.forgotPassOTP !== Number(data.otp)) {
        throw utils.buildErrObject(422, "WRONG_OTP");
      }
      USER.forgotPassOTPExpire = new Date();

      await updatePassword(data.password, USER);
      const notiObj = {
        sender_id: USER._id,
        receiver_id: USER._id,
        title: "Password successfully changed",
        body: `👋🏼 Hi ${USER.user_name}, your new password is successfully updated 🔒 Thanks - Team PRESSHOP🐰 `,
      };
      const resp = await _sendPushNotification(notiObj);
      res.status(200).json({
        code: 200,
        resetPassword: true,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.mediaHouseResetPassword = async (req, res) => {
  try {
    const data = matchedData(req);
    const USER = await findUser(data.email);
    console.log("USER====>", data);
    // if (!(await otpTimeExpired(USER.forgotPassOTPExpire))) {
    if (USER.forgotPassOTP !== Number(data.otp)) {
      throw utils.buildErrObject(422, "WRONG_OTP");
    }
    USER.forgotPassOTPExpire = new Date();

    await updatePassword(data.password, USER);
    res.status(200).json({
      code: 200,
      resetPassword: true,
    });
    // }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.adminResetPassword = async (req, res) => {
  try {
    // const data = matchedData(req);
    // console.log("data==>", data);
    // const forgotPassword = await findForgotPassword(data.id);
    // const admin = await findAdmin(forgotPassword.email);
    // // if (!(await otpTimeExpired(admin.forgotPassOTPExpire))) {
    // //   admin.forgotPassOTP = admin.forgotPassOTPExpire
    // //   admin.save();
    // //   await updatePassword(data.password, admin);
    // // }
    // admin.forgotPassOTP = req.body.forgotPassOTP
    //   admin.save();
    //   await updatePassword(data.password, admin);
    // const result = await markResetPasswordAsUsed(req, forgotPassword);
    // res.status(200).json(result);
    // old

    const data = req.body;
    // const data = matchedData(req);
    const USER = await findAdmin(data.email);
    console.log("USER====>", data);
    // if (!(await otpTimeExpired(USER.forgotPassOTPExpire))) {
    if (USER.forgotPassOTP != data.otp) {
      throw utils.buildErrObject(422, "WRONG_OTP");
    } else {
      USER.forgotPassOTPExpire = new Date();

      await updatePassword(data.password, USER);
      res.status(200).json({
        code: 200,
        resetPassword: true,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};
/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace("Bearer ", "")
      .trim();
    let userId = await getUserIdFromToken(tokenEncrypted);
    userId = await utils.isIDGood(userId);
    const user = await findUserById(userId);
    const token = await saveUserAccessAndReturnToken(req, user);
    // Removes user info from response
    delete token.user;
    res.status(200).json(token);
  } catch (error) {
    utils.handleError(res, error);
  }
};

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
exports.roleAuthorization = (roles) => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles,
    };
    await checkPermissions(data, next);
  } catch (error) {
    utils.handleError(res, error);
  }
};

async function generateOTP() {
  // Generate a random 4-digit number
  const otp = Math.floor(10000 + Math.random() * 90000);

  // Pad the number with leading zeros to ensure it is 4 digits long
  return ("00000" + otp).slice(-5);
}

exports.sendOTP = async (req, res) => {
  try {
    const locale = req.getLocale();
    const data = req.body;
    console.log("data",data)
    const condition = {
      email: data.email,
      phone: data.phone,
    };
    const accountSid = TwilioaccountSid;
    const authToken = twilio_token
    const client = require('twilio')(accountSid, authToken);
    // const emailOTP = await generateOTP();
    const phoneOTP = await generateOTP();
    client.messages
          .create({
             from: '+447700174526',
             body: phoneOTP,
             to: data.phone
           })
          .then(message => console.log(message.sid));
    // when client provide sms api uncomment this code
    // const phoneOTP = 12345;

    
    const User = await UserVerification.findOne(condition);
console.log("phone================",User)
    if (User) {
      console.log("phone===1=inside if============",User)
      const updateObj = {
        // email_otp: emailOTP,
        phone_otp: phoneOTP,
        otp_expire: new Date(
          moment().add(TIME_FOR_OTP_EXPIRE_IN_MINUTES, "minutes")
        ),
      };
      await UserVerification.updateOne(
        {
          _id: User._id,
        },
        updateObj
      );

      console.log("updateObj================",updateObj)
    } else {
      console.log("phone===1=inside else============")

      await UserVerification.create({
        email: data.email,
        phone: data.phone,
        // email_otp: emailOTP,
        phone_otp: phoneOTP,
        otp_expire: new Date(
          moment().add(TIME_FOR_OTP_EXPIRE_IN_MINUTES, "minutes")
        ),
      });
    }
    // await Promise.all([
    //   emailer.verifyEmail(locale, {
    //     to: data.email,
    //     subject: "OTP Verification Email",
    //     emailOTP: phoneOTP,
    //   }),
    //   //when client provide sms api put code here
    // ]);
    res.status(200).json({
      status: 200,
      data: "OTP Sent",
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    const data = req.body;
    const condition = {
      email: data.email,
      phone: data.phone,
    };
    const USER_VERFICATION = await UserVerification.findOne(condition);
    console.log("USER_VERFICATION==============",USER_VERFICATION, data)
    if (!(await otpTimeExpired(USER_VERFICATION.otp_expire))) {
      // if (USER_VERFICATION.email_otp !== Number(data.email_otp))
      //   throw utils.buildErrObject(422, "Email OTP is Not Valid");
      if (USER_VERFICATION.phone_otp !== Number(data.phone_otp))
        throw utils.buildErrObject(422, "Phone OTP is Not Valid");

      res.status(200).json({
        code: 200,
        otp_match: true,
      });
    }
  } catch (error) {
    utils.handleError(res, error);
  }
};

exports.uploadUserMedia = async (req, res) => {
  try {
    if (!req.files.media || !req.body.path) {
      // check if image and path missing
      return res.status(422).json({
        code: 422,
        message: "MEDIA OR PATH MISSING",
      });
    }
    let media = await utils.uploadFile({
      file: req.files.media,
      path: `${STORAGE_PATH}/${req.body.path}`,
    });
    let mediaurl = `${STORAGE_PATH_HTTP}/${req.body.path}/${media}`;

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

exports.chatStatus = async (req, res) => {
  try {
    /*  await User.update(
       {
         chat_status: req.body.status
       },
       {
         where: {
           _id: req.user._id,
         },
       }
     ) */
    await updateItem(User, { _id: req.user._id }, { chat_status: req.body.status })
    res.status(200).json({
      code: 200, status: req.body.status
    });
  } catch (error) {
    utils.handleError(res, error);
  }
};
