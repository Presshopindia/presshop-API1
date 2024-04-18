const mongoose = require("mongoose");
const requestIp = require("request-ip");
const { validationResult } = require("express-validator");
const fs = require("fs");

/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = (file) => {
  return file.split(".").slice(0, -1).join(".").toString();
};

/**
 * Gets IP from user
 * @param {*} req - request object
 */
exports.getIP = (req) => requestIp.getClientIp(req);

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
exports.getBrowserInfo = (req) => req.headers["user-agent"];

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
exports.getCountry = (req) =>
  req.headers["cf-ipcountry"] ? req.headers["cf-ipcountry"] : "XX";

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
// exports.handleError = (res, err) => {
//   // Prints error in console
//   if (process.env.NODE_ENV === "development") {
//     console.log(err);
//   }
//   // Sends error to user
//   res.status(err.code).json({
//     errors: {
//       msg: err.message,
//     },
//     code: err.code,
//   });
// };


exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
    console.log(err)
  }
  // Sends error to user
  res.status(422).json({
    errors: {
      msg: err.message
    },
    code: 422
  })
}

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message,
  };
};

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
exports.validationResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    return next();
  } catch (err) {
    return this.handleError(res, this.buildErrObject(422, err.array()));
  }
};

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = (message) => {
  return {
    msg: message,
  };
};

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
exports.isIDGood = async (id) => {
  return new Promise((resolve, reject) => {
    const goodID = mongoose.Types.ObjectId.isValid(id);
    return goodID
      ? resolve(id)
      : reject(this.buildErrObject(422, "ID_MALFORMED"));
  });
};

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemNotFound = (err, item, reject, message) => {
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (!item) {
    reject(this.buildErrObject(404, message));
  }
};

/**
 * Item already exists
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {Object} reject - reject object
 * @param {string} message - message
 */
exports.itemAlreadyExists = (err, item, reject, message) => {
  console.log(item);
  if (err) {
    reject(this.buildErrObject(422, err.message));
  }
  if (item) {
    reject(this.buildErrObject(422, message));
  }
};

exports.uploadFile = async function (obj) {
  const self = this;
  return new Promise((resolve, reject) => {
    console.log("OBJ===>", obj);
    const [fileNamePrefix, ...fileData] = obj.fileData.name.split(".");
    const fileExt = fileData.pop();
    const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
    fs.writeFile(`${obj.path}/${fileName}`, obj.fileData.data, (err) => {
      if (err) {
        console.log("ERROR WHILE WRITING FILE===>", err);
        reject(self.buildErrObject(422, "ERROR WHILE WRITING FILE"));
      }
      resolve({
          media_type: obj.fileData.mimetype,
          fileName: fileName,
        });
        // fileName
    });
  });
};
exports.uploadFileforaudio = async function (obj) {
  const self = this;
  return new Promise((resolve, reject) => {
    console.log("OBJ===>", obj);
    // const [fileNamePrefix, ...fileData] = obj.fileData.name.split(".");
    // const fileExt = fileData.pop();
    // const fileName = `${fileNamePrefix}-${Date.now()}.${fileExt}`;
    fs.writeFile(`${obj.path}`, obj.fileData, (err) => {
      if (err) {
        console.log("ERROR WHILE WRITING FILE===>", err);
        reject(self.buildErrObject(422, "ERROR WHILE WRITING FILE"));
      }
      resolve({
          // media_type: obj.fileData.mimetype,
          fileName: "abc3.mp3",
        });
        // fileName
    });
  });
};
exports.deleteFile = async function (obj) {
  const self = this;
  return new Promise((resolve, reject) => {
    fs.unlink(`${obj.path}/${obj.fileName}`, (err) => {
      if (err) {
        console.log(`ERROR WHILE WRITING FILE : ${err}`);
      }
      resolve(true);
      console.log(
        `file deleted successfully from : ${obj.path}/${obj.fileName}`
      );
    });
  });
};




// exports.sendPushNotification = async (
//   device_token,
//   title,
//   message,
//   notificationData
// ) => {
//   try {
//     if (notificationData.sender_id)
//       notificationData.sender_id = notificationData.sender_id.toString();

//     if (notificationData.receiver_id)
//       notificationData.receiver_id = notificationData.receiver_id.toString();
//     const notification = {
//       title: title,
//       body: message,
//     };
//     var message = {
//       notification: notification,
//       data: notificationData,
//       tokens: device_token,
//     };
//     admin
//       .messaging()
//       .sendMulticast(message)
//       .then((response) => {
//         console.log("response", response);
//         if (response.failureCount > 0) {
//           const failedTokens = [];
//           response.responses.forEach((resp, idx) => {
//             if (!resp.success) {
//               failedTokens.push(tokens[idx]);
//             }
//           });
//           console.log("List of tokens that caused failures: " + failedTokens);
//         }
//         return true;
//       })
//       .catch((error) => {
//         console.log("Error sending message:", error);
//       });
//   } catch (err) {
//     console.log("----",err);
//     return false;
//   }
// };
