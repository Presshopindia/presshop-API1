const controller = require("../controllers/hopper");
const validate = require("../controllers/hopper.validate");
const AuthController = require("../controllers/auth");
const express = require("express");
const router = express.Router();
require("../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", {
  session: false,
});
const trimRequest = require("trim-request");

/*
 * Users routes
 */

/*
 * Get items route
 */
router.get(
  "/getUserProfile",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.getUserProfile
);

router.patch(
  "/addUserBankDetails",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.addUserBankDetails
);

router.patch(
  "/uploadDocToBecomePro",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.uploadDocToBecomePro
);

router.patch(
  "/updateBankDetail",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.updateBankDetail
);

router.patch(
  "/updateBankDetail",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  validate.updateBankDetail,
  controller.updateBankDetail
);

router.delete(
  "/deleteBankDetail/:bank_detail_id/:stripe_bank_id",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.deleteBankDetail
);

router.get(
  "/getBankList",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.getBankList
);

router.patch(
  "/editHopper",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.editHopper
);

router.post(
  "/addContent",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  // validate.addContent,
  controller.addContent
);

router.get(
  "/getContentById/:content_id",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.getContentById
);

router.get(
  "/getContentList",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.getContentList
);

router.get(
  "/getDraftContentList",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  validate.getDraftContentList,
  controller.getContentList
);

router.get(
  "/getDraftContentDetail/:content_id",
  // requireAuth,
  // AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.getDraftContentDetail
);


router.get(
  "/tasks/assigned/by/mediaHouse",
  trimRequest.all,
  requireAuth,
  controller.tasksAssignedByMediaHouse
);

router.get(
  "/tasks/assigned/by/mediaHouse/:brodcast_id",
  trimRequest.all,
  requireAuth,
  controller.tasksAssignedByMediaHouseByBroadCastId
);

router.post(
  "/tasks/request",
  trimRequest.all,
  requireAuth,
  controller.tasksRequest
);

router.post(
  "/add/task/content",
  trimRequest.all,
  requireAuth,
  controller.addTaskContent
);

router.post(
  "/uploadImage",
  trimRequest.all,
  controller.uploadImage
);

router.post(
  "/add/fcm/token",
  trimRequest.all,
  requireAuth,
  controller.addFcmToken
);

router.post(
  "/remove/fcm/token",
  trimRequest.all,
  requireAuth,
  controller.removeFcmToken
);

router.post(
  "/create/room",
  trimRequest.all,
  requireAuth,
  controller.createRoom
);

router.post(
  '/room/list',
  trimRequest.all,
  requireAuth,
  controller.roomList
)

router.post(
  '/room/details/:room_id',
  trimRequest.all,
  requireAuth,
  controller.roomDetails
)

router.patch(
  '/is/draft/:content_id',
  trimRequest.all,
  requireAuth,
  controller.isDraft
)

router.get(
  '/content/categories',
  trimRequest.all,
  // requireAuth,
  controller.contentCategories
)

router.get(
  '/getAllmyTask',
  trimRequest.all,
  requireAuth,
  controller.getAllacceptedTasks
)

router.post(
  "/addUploadedContent",
  trimRequest.all,
  requireAuth,
  controller.addUploadedContent
);

router.post(
  "/uploadS3Content",
  trimRequest.all,
  controller.uploadS3Content
);

// router.get(
//   '/getuploadedContentbyHopper',
//   trimRequest.all,
//   requireAuth,
//   controller.getuploadedContentbyHopper
// )

router.get(
  '/adminlist',
  trimRequest.all,
  requireAuth,
  controller.adminlist
)

router.get(
  '/accepted/hopper/list/data',
  trimRequest.all,
  // requireAuth,
  controller.acceptedHopperListData
)


router.get(
  '/acceptedHoppersdata',
  trimRequest.all,
  requireAuth,
  controller.acceptedHoppersdata
)

router.post(
  "/uploadMedia",
  trimRequest.all,
  requireAuth,
  controller.uploadMedia
);

router.post(
  "/getAllchat",
  trimRequest.all,
  // requireAuth,
  controller.getAllchat
);

router.post(
  "/getAllroombycontent",
  trimRequest.all,
  // requireAuth,
  controller.getAllroombycontent
);

router.post(
  "/Addcontact_us",
  trimRequest.all,
  // requireAuth,
  controller.Addcontact_us
);

router.get(
  '/getallofferMediahouse',
  trimRequest.all,
  // requireAuth,
  controller.getallofferMediahouse
)

router.get(
  '/getfeeds',
  trimRequest.all,
  requireAuth,
  controller.getfeeds
)

router.get(
  '/getNotification',
  trimRequest.all,
   requireAuth,
  controller.getfaq
)


router.get(
  '/getGenralMgmtApp',
  trimRequest.all,
  requireAuth,
  controller.getGenralMgmtApp
)


router.get(
  '/getpriceTipforQuestion',
  trimRequest.all,
  // requireAuth,
  controller.getpriceTipforQuestion
)

router.get(
  '/getCategory',
  trimRequest.all,
  // requireAuth,
  controller.getCategory
)


router.get(
  '/adminDetails',
  trimRequest.all,
  // requireAuth,
  controller.reply
)


router.patch(
  '/updatefeed',
  trimRequest.all,
  // requireAuth,
  controller.updatefeed
)




router.get(
  '/getearning',
  trimRequest.all,
  requireAuth,
  controller.getearning
)


router.post(
  "/createStripeAccount",
  trimRequest.all,
   requireAuth,
  controller.createStripeAccount
);


router.get(
  '/stripeStatus',
  trimRequest.all,
  // requireAuth,
  controller.stripeStatus
)


router.get(
  '/getalllistofEarning',
  trimRequest.all,
  requireAuth,
  controller.getalllistofEarning
)


router.get(
  '/getallrating',
  trimRequest.all,
  requireAuth,
  controller.allratedcontent
)


router.get(
  '/getallEarning/contentId',
  trimRequest.all,
  requireAuth,
  controller.transictiondetailbycontentid
)
// router.get(
//   '/paymenttobemade',
//   trimRequest.all,
//   // requireAuth,
//   controller.paymenttobemade
// )

router.patch(
  '/updatenotification',
  trimRequest.all,
  requireAuth,
  controller.updatenotification
)


router.get(
  '/getlistofmediahouse',
  trimRequest.all,
  // requireAuth,
  controller.getlistofmediahouse
)

router.patch(
  '/updateDraft',
  trimRequest.all,
  // requireAuth,
  controller.updateDraft
)


router.post(
  "/mostviewed",
  trimRequest.all,
  //  requireAuth,
  controller.mostviewed
);

router.post(
  "/sendPustNotificationByHopper",
  trimRequest.all,
  //  requireAuth,
  controller.sendPustNotificationByHopper
);

router.patch(
  '/deleteuploadDocToBecomePro',
  trimRequest.all,
  requireAuth,
  controller.deleteuploadDocToBecomePro
)
router.get(
  '/legal',
  trimRequest.all,
  // requireAuth,
  controller.legal
)


router.post(
  "/testaudiowatermark",
  trimRequest.all,
  //  requireAuth,
  controller.testaudiowatermark
);


router.post(
  "/updatelocation",
  trimRequest.all,
  //  requireAuth,
  controller.updatelocation
);


router.post(
  "/createVerificationSession",
  trimRequest.all,
  //  requireAuth,
  controller.createVerificationSession
);

router.patch(
  "/updateNotificationforClearAll",
  trimRequest.all,
   requireAuth,
  controller.updateNotificationforClearAll
);


router.post(
  "/uploadMediaforMultipleContent",
  trimRequest.all,
  //  requireAuth,
  controller.uploadMediaforMultipleImage
);


router.post(
  "/uploadStipeFiles",
  trimRequest.all,
  //  requireAuth,
  controller.uploadStipeFiles
);


router.get(
  '/getdetailsbyid',
  trimRequest.all,
  // requireAuth,
  controller.getdetailsbyid
)




router.get(
  '/listofcharity',
  trimRequest.all,
  // requireAuth,
  controller.listofcharity
)



router.get(
  '/fetchAndupdateBankdetails',
  trimRequest.all,
  requireAuth,
  controller.fetchAndupdateBankdetails
)




router.post(
  "/uploadMultipleImgs",
  trimRequest.all,
  //  requireAuth,
  controller.uploadMultipleProjectImgs
);



router.post(
  "/justgivingapi",
  trimRequest.all,
  //  requireAuth,
  controller.justgivingapi
);


router.get(
  '/getHopperAlertList',
  trimRequest.all,
  requireAuth,
  controller.getHopperAlertList
)



router.patch(
  "/uploadDocToBecomeProNew",
  requireAuth,
  AuthController.roleAuthorization(["Hopper"]),
  trimRequest.all,
  controller.uploadDocToBecomeProNew
);


router.get(
  '/getuploadedDocumentList',
  trimRequest.all,
  requireAuth,
  controller.getuploadedDocumentList
)


router.post(
  "/deleteDocument",
  trimRequest.all,
   requireAuth,
  controller.deleteDocument
);
module.exports = router;
