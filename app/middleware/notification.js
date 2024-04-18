const { admin } = require("../../config/firebase")
// const { driverAdmin } = require("../../config/driver_firebase")
const db = require("../middleware/admin_db");
const notificationmodel = require("../models/notification");
exports.sendPushNotification = async (
    token,
    title,
    message,
    notificationData
) => {
    try {
        notificationData.user_id = notificationData.user_id.toString();
        console.log(`user_id`,notificationData.user_id);
        const notification = {
            title: title,
            body: message,
            // image: notificationData.icon
            //   ? notificationData.icon
            //   : `${process.env.NOTIFICATION_ICONS_PATH}/default.ico`,
        };
        var message = {
            notification: notification,
            data: notificationData,
            tokens: token,
        };


        // try {

        // } catch (err) {
        //   console.log("main err: ", err);
        // }
        console.log("final message", message);
        admin
            .messaging()
            .sendMulticast(message)
            .then(async (response) => {
                console.log('response', response);
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.responses.forEach((resp, idx) => {
                        console.log('resp-->', resp);
                        console.log('idx-->', idx);
                        if (!resp.success) {
                            failedTokens.push(registrationTokens[idx]);
                        }
                    });
                    console.log('List of tokens that caused failures: ' + failedTokens);
                }
            })
            .catch((error) => {
                console.log("Error sending message:", error);
            });
    } catch (err) {
        console.log(err);
        // return false;
    }
};
// exports.sendPushNotificationDriver = async (
//   token,
//   title,
//   message,
//   notificationData
// ) => {
//   try {
//     notificationData.user_id = notificationData.user_id.toString();
//     const notification = {
//       title: title,
//       body: message,
//       // image: notificationData.icon
//       //   ? notificationData.icon
//       //   : `${process.env.NOTIFICATION_ICONS_PATH}/default.ico`,
//     };
//     var message = {
//       notification: notification,
//       data: notificationData,
//       tokens: token,
//     };
//     console.log("final message", message);
//     driverAdmin
//       .messaging()
//       .sendMulticast(message)
//       .then((response) => {
//         console.log('respp---response---->',response);

//         if (response.failureCount > 0) {
//           const failedTokens = [];
//           response.responses.forEach((resp, idx) => {
//             if (!resp.success) {
//               console.log('respp------->',resp);
//               // failedTokens.push(registrationTokens[idx]);
//             }
//           });
//           console.log('List of tokens that caused failures: ' + failedTokens);
//         }
//       })
//       .catch((error) => {
//         console.log("Error sending message:", error);
//       });
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };

// exports.sendPushNotificationTest = async (obj) => {
//   try {
//     var message = {
//       notification: obj.notification,
//       data: obj.data,
//       tokens: obj.token,
//     };
//     console.log("final message", message);
//     driverAdmin
//       .messaging()
//       .sendMulticast(message)
//       // .then((response) => {
//       //   // Response is a message ID string.
//       //   console.log("Successfully sent message:", response);
//       // })
//       .then((response) => {
//       console.log('response',response);
//         if (response.failureCount > 0) {
//           const failedTokens = [];
//           response.responses.forEach((resp, idx) => {
//             if (!resp.success) {
//               console.log('resp--->',resp);
//               // failedTokens.push(registrationTokens[idx]);
//             }
//           });
//           console.log('List of tokens that caused failures: ' + failedTokens);
//         }
//       })
//       .catch((error) => {
//         console.log("Error sending message:", error);
//       });
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// };






exports.sendPushNotificationforAdmin = async (
    device_token,
    title,
    message,
    notificationData
  ) => {
    try {
      if (notificationData.sender_id)
        notificationData.sender_id = notificationData.sender_id.toString();
  
      if (notificationData.receiver_id)
        notificationData.receiver_id = notificationData.receiver_id.toString();
      const notification = {
        title: title,
        body: message,
      };
      var message = {
        notification: notification,
        data: notificationData,
        tokens: device_token,
      };
      admin
        .messaging()
        .sendMulticast(message)
        .then((response) => {
          console.log("response", response);
          if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
              if (!resp.success) {
                failedTokens.push(tokens[idx]);
              }
            });
            console.log("List of tokens that caused failures: " + failedTokens);
          }
          return true;
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    } catch (err) {
      console.log("----",err);
      return false;
    }
  };
