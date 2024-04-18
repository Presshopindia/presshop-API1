const controller = require("../controllers/admin");
const validate = require("../controllers/admin.validate");
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
router.patch(
  "/updateCMSForHopper",
  requireAuth,
  trimRequest.all,
  validate.updateCMSForHopper,
  controller.updateCMSForHopper
);

router.get(
  "/getCMS/:type/:role",
  requireAuth,
  trimRequest.all,
  validate.getCMS,
  controller.getCMS
);

router.get(
  "/checkIfUserNameExist/:username",
  requireAuth,
  trimRequest.all,
  controller.checkIfUserNameExist
);

router.get(
  "/checkIfEmailExist/:email",
  requireAuth,
  trimRequest.all,
  controller.checkIfEmailExist
);

router.get(
  "/checkIfPhoneExist/:phone",
  requireAuth,
  trimRequest.all,
  controller.checkIfPhoneExist
);
/****************** Avatar ******* */

router.post("/addAvatar", requireAuth, trimRequest.all, controller.addAvatar);

router.patch(
  "/deleteAvatar",
  requireAuth,
  trimRequest.all,
  controller.deleteAvatar
);
router.get("/getAvatars", requireAuth, trimRequest.all, controller.getAvatars);

/****************** Category ******* */
router.post(
  "/addCategory",
  requireAuth,
  trimRequest.all,
  // validate.addCategory,
  controller.addCategory
);

router.get(
  "/getCategory/:type",
  requireAuth,
  trimRequest.all,
  controller.getCategory
);

router.get(
  "/getCategoryById/:category_id",
  requireAuth,
  trimRequest.all,
  controller.getCategoryById
);

router.delete(
  "/deleteCategory/:category_id",
  requireAuth,
  trimRequest.all,
  controller.deleteCategory
);

router.patch(
  "/editCategory",
  requireAuth,
  trimRequest.all,
  // validate.editCategory,
  controller.editCategory
);
/****************** PriceTips And FAQs ******* */

router.post(
  "/addPriceTipAndFAQs",
  requireAuth,
  trimRequest.all,
  validate.addPriceTipAndFAQs,
  controller.addPriceTipAndFAQs
);

/****************** Hopper  ******* */

router.get(
  "/getHopperList",
  // requireAuth,
  trimRequest.all,
  controller.getHopperList
);

router.patch(
  "/editHopper",
  requireAuth,
  trimRequest.all,
  validate.editHopper,
  controller.editHopper
);

router.get(
  "/getHopperById/:hopper_id",
  requireAuth,
  trimRequest.all,
  controller.getHopperById
);

router.get(
  "/getHopperMgmtHistory/:hopper_id",
  requireAuth,
  trimRequest.all,
  controller.getHopperMgmtHistory
);

/****************** Content ******* */

router.get(
  "/getContentList",
  requireAuth,
  trimRequest.all,
  controller.getContentList
);

router.patch(
  "/editContent",
  requireAuth,
  trimRequest.all,
  // validate.editContent,
  controller.editContent
);

router.get(
  "/getContentMgmtHistory/:content_id",
  requireAuth,
  trimRequest.all,
  controller.getContentMgmtHistory
);

/****************** Media House ******* */

router.get(
  "/getPublicationList",
  requireAuth,
  trimRequest.all,
  controller.getPublicationList
);

router.patch(
  "/editPublication",
  requireAuth,
  trimRequest.all,
  // validate.editContent,
  controller.editPublication
);

router.get(
  "/getPublicationMgmtHistory/:publication_id",
  requireAuth,
  trimRequest.all,
  controller.getPublicationMgmtHistory
);

/****************** Subadmin MGMT ******* */

router.post(
  "/addEmployee",
  requireAuth,
  trimRequest.all,
  // validate.addEmployee,
  controller.addEmployee
);

router.patch(
  "/editEmployee",
  requireAuth,
  trimRequest.all,
  controller.editEmployee
);

router.get(
  "/getEmployees",
  requireAuth,
  trimRequest.all,
  controller.getEmployees
);

/****************** Admin  ******* */

router.patch(
  "/editProfile",
  requireAuth,
  trimRequest.all,
  controller.editProfile
);

router.get(
  "/getTaskList",
  requireAuth,
  trimRequest.all,
  controller.getBroadCastTasks
);

router.patch(
  "/editBroadCast",
  requireAuth,
  trimRequest.all,
  controller.editBroadCast
);

router.get(
  "/getBroadCastHistory/:broadcast_id",
  requireAuth,
  trimRequest.all,
  controller.getBroadCastHistory
);

router.patch(
  "/editPublishedContent",
  requireAuth,
  trimRequest.all,
  controller.editPublishedContent
);

router.get(
  "/getPublishedContentSummery/:content_id",
  requireAuth,
  trimRequest.all,
  controller.getPublishedContentSummery
);

router.get("/getProfile", requireAuth, trimRequest.all, controller.getProfile);
router.get(
  "/purchased/publication",
  requireAuth,
  trimRequest.all,
  controller.purchasedPublication
);
router.get(
  "/hopper/published/content",
  requireAuth,
  trimRequest.all,
  controller.hopperPublishedContent
);
router.post(
  "/create/office/details",
  requireAuth,
  trimRequest.all,
  controller.createOfficeDetails
);
router.get(
  "/get/office/details",
  requireAuth,
  trimRequest.all,
  controller.getOfficeDetails
);
router.post(
  "/create/genral/mgmt",
  requireAuth,
  trimRequest.all,
  controller.genralMgmt
);
router.get(
  "/genral/mgmt",
  requireAuth,
  trimRequest.all,
  controller.getGenralMgmt
);

router.patch(
  "/update/genral/mgmt",
  requireAuth,
  trimRequest.all,
  controller.updateGenralMgmt
);

router.post(
  "/upload/data",
  requireAuth,
  trimRequest.all,
  controller.uploadMultipleProjectImgs
);
router.post(
  "/purchased/content/summery",
  requireAuth,
  trimRequest.all,
  controller.purchasedContentSummery
);
router.patch(
  "/edit/purchased/content/summery",
  requireAuth,
  trimRequest.all,
  controller.editpurchasedContentSummery
);
router.get(
  "/purchased/content/history",
  requireAuth,
  trimRequest.all,
  controller.purchasedContentHistory
);
router.post(
  "/sourced/content/summery",
  requireAuth,
  trimRequest.all,
  controller.sourcedContentSummery
);
router.post(
  "/sourced/content/remarks/mode",
  requireAuth,
  trimRequest.all,
  controller.sourcedContentRemarksMode
);
router.post(
  "/sourced/content/history/:media_house_id",
  requireAuth,
  trimRequest.all,
  controller.sourcedContentHistory
);
router.post("/create/faq", requireAuth, trimRequest.all, controller.createFaq);
router.get("/get/faq", requireAuth, trimRequest.all, controller.getFaq);
router.post("/delete/faq", requireAuth, trimRequest.all, controller.deleteFaq);
router.get(
  "/genral/mgmt/app",
  requireAuth,
  trimRequest.all,
  controller.getGenralMgmtApp
);
router.post(
  "/delete/tutorials",
  requireAuth,
  trimRequest.all,
  controller.deleteTutorials
);
router.patch(
  "/update/genral/mgmt/app",
  // requireAuth,
  trimRequest.all,
  controller.updateGenralMgmtApp
);
// router.get("/getMediaHouseTask",
//   trimRequest.all,
//   controller.getMediaHouse
// );
router.patch(
  "/editMediaHouseTask",
  trimRequest.all,
  controller.editMediaHouseTask
);
router.post(
  "/createMediaHouseHistory",
  requireAuth,
  trimRequest.all,
  controller.createMediaHouseHistory
);
router.post(
  "/getMediaHouseTaskHistory",
  trimRequest.all,
  controller.getHopperDetails
);

router.post(
  "/create/docs",
  trimRequest.all,
  controller.createDocs
);

router.get(
  "/get/docs",
  trimRequest.all,
  // requireAuth,
  controller.getDocs
);


router.post(
  "/edit/delete/docs/type",
  trimRequest.all,
  // requireAuth,
  controller.editDeleteDocsType
);


router.get(
  "/roomList",
  trimRequest.all,
  requireAuth,
  controller.roomList
);



router.get(
  "/getemployeeHistory",
  trimRequest.all,
  // requireAuth,
  controller.getemployeeHistory
);

router.get(
  "/published/content/summery/hopper",
  trimRequest.all,
  // requireAuth,
  controller.publishedContentSummeryHopper
);

router.patch(
  "/edit/published/content/summery/hopper",
  requireAuth,
  trimRequest.all,
  controller.editPublishedContentSummeryHopper
);

router.get(
  "/view/published/content/summery/hopper",
  requireAuth,
  trimRequest.all,
  controller.viewPublishedContentSummeryHopper
);

router.get(
  "/uploaded/content/summery/hopper",
  trimRequest.all,
  requireAuth,
  controller.uploadedContentSummeryHopper
);


router.patch(
  "/edit/uploaded/Content/Summery/Hopper",
  trimRequest.all,
  requireAuth,
  controller.edituploadedContentSummeryHopper
);


router.get(
  "/view/uploaded/content/summery/hopper/history",
  trimRequest.all,
  // requireAuth,
  controller.viewUploadedContentSummeryHopperhistory
);



router.get(
  "/taskCount",
  trimRequest.all,
  // requireAuth,
  controller.taskCount
);



router.get(
  "/liveUploadedContent",
  trimRequest.all,
  // requireAuth,
  controller.liveUploadedContent
);

router.patch(
  "/editLivePublishedContentDashboard",
  requireAuth,
  trimRequest.all,
  // validate.editContent,
  controller.editLivePublishedContentDashboard
);



router.get(
  "/liveTasks",
  trimRequest.all,
  // requireAuth,
  controller.liveTasks
);


router.patch(
  "/editLivetask",
  requireAuth,
  trimRequest.all,
  // validate.editHopper,
  controller.editLivetask
);


router.get(
  "/view/livetask/history",
  trimRequest.all,
  // requireAuth,
  controller.viewlivetaskhistory
);



router.patch(
  "/editLiveuploadedContent",
  requireAuth,
  trimRequest.all,
  // validate.editHopper,
  controller.editLiveUploadedcontentdashboard
);

router.get(
  "/viewliveuploadedcontenhistory",
  trimRequest.all,
  // requireAuth,
  controller.viewliveuploadedcontenhistory
);

router.get(
  "/getallpublishcontent",
  trimRequest.all,
  // requireAuth,
  controller.getallpublishcontent
);


router.get(
  "/getalluploadedcontent",
  trimRequest.all,
  // requireAuth,
  controller.getalluploadedcontent
);

router.get(
  "/contentInfo",
  trimRequest.all,
  // requireAuth,
  controller.contentInfo
);


router.post(
  "/addactiondetails",
  trimRequest.all,
  requireAuth,
  controller.addactiondetails
);


router.post(
  "/updatecontentinfo",
  trimRequest.all,
  // requireAuth,
  controller.updatecontentinfo
);


router.get(
  "/getactiondetails",
  trimRequest.all,
  // requireAuth,
  controller.getactiondetails
);





router.post(
  "/addcommitionstr",
  trimRequest.all,
  // requireAuth,
  controller.addcommitionstr
);


router.get(
  "/getcommition",
  trimRequest.all,
  // requireAuth,
  controller.getcommition
);


router.patch(
  "/updateCommition",
  // requireAuth,
  trimRequest.all,
  // validate.editHopper,
  controller.updateCommition
);

router.patch(
  "/editcommitionstr",
  // requireAuth,
  trimRequest.all,
  // validate.editHopper,
  controller.editcommitionstr
);

router.delete(
  "/deletecommitionstr/:id",
  requireAuth,
  trimRequest.all,
  controller.deletecommitionstr
);

router.get(
  "/contentpublished",
  trimRequest.all,
  // requireAuth,
  controller.contentpublished
);


router.patch(
  "/edithopperviewHistory",
  requireAuth,
  trimRequest.all,
  // validate.editHopper,
  controller.edithopperviewHistory
);


router.get(
  "/gethopperViewHistory/:content_id",
  trimRequest.all,
  // requireAuth,
  controller.gethopperViewHistory
);


router.get(
  "/liveUploadedContentmangeHopper",
  trimRequest.all,
  // requireAuth,
  controller.liveUploadedContentmangeHopper
);

router.get(
  "/viewdetails",
  trimRequest.all,
  // requireAuth,
  controller.viewdetails
);
router.post(
  "/viewUploadedContent/SummeryHopper/viewdetails",
  trimRequest.all,
  // requireAuth,
  controller.viewUploadedContentSummeryHopperviewdetails
);

router.patch(
  "/edithopperviewDetailsHistory",
  requireAuth,
  trimRequest.all,
  // validate.editHopper,
  controller.edithopperviewDetailsHistory
);

router.get(
  "/viewUploadedContent/SummeryHopperHistory/viewdetails",
  trimRequest.all,
  // requireAuth,
  controller.viewUploadedContentSummeryHopperHistoryviewdetails
);


router.post(
  "/viewSourcedContent/SummeryPublication/viewdetails",
  trimRequest.all,
  // requireAuth,
  controller.viewSourcedContentSummeryPublicationviewdetails
);

router.post(
  "/createpriceTipforQuestion",
  trimRequest.all,
  // requireAuth,
  controller.createpriceTipforQuestion
);

router.get(
  "/getpriceTipforQuestion",
  trimRequest.all,
  // requireAuth,
  controller.getpriceTipforQuestion
);

router.get(
  "/viewPurchasedContent/SummeryPublication/viewdetails",
  trimRequest.all,
  // requireAuth,
  controller.viewPurchasedContentSummeryPublicationviewdetails
);

router.patch(
  "/editPurchasedPublicaation/viewDetails/History",
  requireAuth,
  trimRequest.all,
  controller.editPurchasedPublicaationviewDetailsHistory
);


router.get(
  "/viewPurchasedContent/SummeryPublicationrHistory/viewdetails",
  trimRequest.all,
  // requireAuth,
  controller.viewPurchasedContentSummeryPublicationrHistoryviewdetails
);

router.get(
  "/getlistofacceptedhopperbytask",
  trimRequest.all,
  // requireAuth,
  controller.getlistofacceptedhopperbytask
);


router.post(
  "/sendNotification",
  trimRequest.all,
  requireAuth,
  controller.sendNotification
);

router.get(
  "/notificationlisting",
  trimRequest.all,
  // requireAuth,
  controller.notificationlisting
);


router.post(
  "/search",
  trimRequest.all,
  // requireAuth,
  controller.search
);

router.get(
  "/listofContent/mediahousePaid",
  trimRequest.all,
  // requireAuth,
  controller.getalllistofContentthatmediahousePaid
);
router.get(
  "/getTags",
  trimRequest.all,
  // requireAuth,
  controller.getTags
);

router.patch(
  "/contentPaymentforhoppr",
  // requireAuth,
  trimRequest.all,
  // validate.editHopper,
  controller.contentPaymentforhoppr
);

router.patch(
  "/editSourcedPublicaation/viewDetails",
  requireAuth,
  trimRequest.all,
  controller.editSourcedPublicaationviewDetails
);

router.get(
  "/viewSourcedContent/SummeryPublication/viewdetailsHistory",
  trimRequest.all,
  // requireAuth,
  controller.viewSourcedContentSummeryPublicationviewdetailsHistory
);

router.get(
  "/gethopperfornotification",
  trimRequest.all,
  // requireAuth,
  controller.gethopperfornotification
);

router.get(
  "/getmediahousefornotification",
  trimRequest.all,
  // requireAuth,
  controller.getmediahousefornotification
);


router.get(
  "/getnotification",
  trimRequest.all,
  requireAuth,
  controller.getnotification
);


router.get(
  "/getallinvoise",
  trimRequest.all,
  // requireAuth,
  controller.getallinviise
);

router.get(
  "/countofInvoice",
  trimRequest.all,
  // requireAuth,
  controller.countofInvoice
);


router.get(
  "/paidtohopper",
  trimRequest.all,
  // requireAuth,
  controller.paidtohopper
);


router.get(
  "/listofcontentandtask",
  trimRequest.all,
  // requireAuth,
  controller.listofcontentandtask
);

router.post(
  "/add/fcm",
  trimRequest.all,
  requireAuth,
  controller.addFcmToken
);

router.post(
  "/invoice/payments",
  trimRequest.all,
  requireAuth,
  controller.invoiceAndPayments
);


router.post(
  "/paymenttohopperByadmin",
  trimRequest.all,
  // requireAuth,
  controller.paymenttohopperByadmin
);

router.get(
  "/ongoing/chat/count",
  trimRequest.all,
  requireAuth,
  controller.ongoingChatCount
);

router.post(
  "/download/cms",
  trimRequest.all,
  // requireAuth,
  controller.downloadCmsCsv
);


router.patch(
  "/editHopperPayment",
  requireAuth,
  trimRequest.all,
  controller.editHopperPayment
);


router.patch(
  "/editHopperPaymentforHopper",
  requireAuth,
  trimRequest.all,
  controller.editHopperPaymentforHopper
);
router.get(
  "/editHopperPaymenthistorydetails",
  trimRequest.all,
  requireAuth,
  controller.editHopperPaymenthistorydetails
);

// router.get(
//   "/ongoing/chat/count",
//   trimRequest.all,
//   requireAuth,
//   controller.ongoingChatCount
// );
router.post(
  "/sendPustNotificationtoHopper",
  trimRequest.all,
  requireAuth,
  controller.sendPustNotificationtoHopper
);

router.post("/delete/price_tip", requireAuth, trimRequest.all, controller.deletepriceTipforQuestion);
router.get("/onboard",  trimRequest.all, controller.onboard);
router.patch("/request/onboard",  trimRequest.all, controller.requestOnboard);
router.get("/getemailrecords",  trimRequest.all, controller.getemailrecords);
router.get("/getCategoryType",  trimRequest.all, controller.getCategoryType);
router.delete(
  "/deleteEmail/:id",
  requireAuth,
  trimRequest.all,
  controller.deleteCategory
);


router.get("/getDeletedContent", requireAuth, trimRequest.all, controller.getDeletedContent);
router.post("/deleteContent",  trimRequest.all, controller.deleteContent);
router.patch("/updateNotification",  trimRequest.all, controller.updateNotification);
module.exports = router;
