const cron = require("node-cron"),
  moment = require("moment");

// const db = require("../app_v1/middleware/db");
// const utils = require("../app_v1/middleware/utils");
// const {
//   POST
// } = require("../app_v1/middleware/axios");
// const emailer = require("../app_v1/middleware/emailer");
// const { _sendNotification } = require("../app_v1/controllers/users");
const mongoose = require("mongoose");

//Models
const query = require("../app/models/query");
const contents = require("../app/models/contents");



const cron_notifications_perminute = async () => {
  try {

    Notification();
  

  } catch (error) {
    console.log(error);
  }
};



const Notification = async () => {
  try {

    console.log("notificationBeforeCancelledBooking ----> C R O N")
  
    const trialfindquery = await query.find({ type: "purchased_exclusive_content" })
    const endDate = new Date();   // Replace with your end date and time
    const matchingNannies = trialfindquery.filter(nanny => {
        const timeDifferenceMinutes = (endDate.getTime() - new Date(nanny.submited_time).getTime())/ (1000 * 60 );
        return timeDifferenceMinutes > 1440
    });

    if (matchingNannies.length > 0) {
      console.log("Nanny(s) with matching submission time:");
      matchingNannies.forEach(async (nanny) => {
        await contents.updateOne({ _id: nanny.content_id }, { is_hide: false , type:"shared" })

 
    
      });
    } else {
      console.log("No nanny found with submission time equal to the current time.");
    }

  } catch (err) {
    console.log("err", err);
  }
};



cron.schedule("* * * * *", cron_notifications_perminute, {
  // timezone: "Asia/Kolkata",
});

// interviewReminder()

// cron.schedule("0 12 * * 0", cron_notifications_perweek, {
//   timezone: "Asia/Kolkata",
// });

//------------ end ------------
// ********************* Cron Job ************************
