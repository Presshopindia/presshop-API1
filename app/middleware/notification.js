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
    console.log(`user_id`, notificationData.user_id);
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


    for (const x of token) {
      // const notification = {
      //   title: title,
      //   body: message,
      //   // image: notificationData.icon
      //   //   ? notificationData.icon
      //   //   : `${process.env.NOTIFICATION_ICONS_PATH}/default.ico`,
      // };
      let message = {
        notification: notification,
        data: notificationData,
        tokens: x,
      };
      // try {
  
      // } catch (err) {
      //   console.log("main err: ", err);
      // }
      console.log("final message", message);

      admin.messaging().send(message)
        .then(async (response) => {
          console.log('response', response);
          if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
              console.log('resp-->', resp);
              console.log('idx-->', idx);
              if (!resp.success) {
                failedTokens.push(token[idx]);
              }
            });
            console.log('List of tokens that caused failures: ' + failedTokens);
          }
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
        }
        // admin
        //   .messaging()
        //   .sendMulticast(message)
        //   .then(async (response) => {
        //     console.log('response', response);
        //     if (response.failureCount > 0) {
        //       const failedTokens = [];
        //       response.responses.forEach((resp, idx) => {
        //         console.log('resp-->', resp);
        //         console.log('idx-->', idx);
        //         if (!resp.success) {
        //           failedTokens.push(token[idx]);
        //         }
        //       });
        //       console.log('List of tokens that caused failures: ' + failedTokens);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log("Error sending message:", error);
        //   });

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
    // var message = {
    //   notification: notification,
    //   data: notificationData,
    //   token: device_token,
    // };

let messages
    for (const x of device_token) {
  
    if (notificationData.image) {
   
        // message.android = {
        //   notification: {
        //     imageUrl: "https://uat-presshope.s3.eu-west-2.amazonaws.com/public/avatarImages/1725979486924IMG_3692.JPG",
        //   }
        // }
      

        messages = {
          notification: notification,
          android : {
            notification: {
              imageUrl: notificationData.image,
            }
          },
          // image: 
          data: notificationData,
          token: x,
        };
    }
    else {

      messages = {
        notification: notification,
      
        // image: 
        data: notificationData,
        token: x,
      };
    }





      admin.messaging().send(messages)
        .then((response) => {
          console.log("response", response);
          if (response.failureCount > 0) {
            const failedTokens = [];
            console.log("response.responses==========?>>>>>>: ", response.responses[0].error);
            response.responses.forEach((resp, idx) => {
              if (!resp.success) {
                failedTokens.push(device_token[idx]);
              }
            });
            console.log("List of tokens that caused failures: " + failedTokens);
          }
          return true;
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    // const message = {
    //   notification: {
    //     title: "Test Title",
    //     body: "Test Body",
    //   },
    //   token: "fzjfb0SgQ1KiYvrvF5xUne:APA91bGbaD2kkGtODRw3bp58uZRx59BLTLuOGk-nu7XNSZoeQczvbTnvw5CZnbzOqmSpANuRjlHvhAg3f3azJWkDZR-jcfpFlmWZ-ZQT-djrWUmdHfjHw-qmECdORrgXBJxDE1Dc2oK5",
    // };


  } catch (err) {
    console.log("----", err);
    return false;
  }
};
