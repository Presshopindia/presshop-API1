const controller = require("../controllers/mediaHouse");
const validate = require("../controllers/mediaHouse.validate");
const AuthController = require("../controllers/auth");
const express = require("express");
const router = express.Router();
require("../../config/passport");
const passport = require("passport");
const requireAuth = passport.authenticate("jwt", {
  session: false,
});
const trimRequest = require("trim-request");
const stripe = require("stripe")(
  process.env.STRIPE
);

/*
 * Users routes
 */

/*
 * Get items route
 */
router.get(
  "/",
  requireAuth,
  AuthController.roleAuthorization(["MediaHouse"]),
  trimRequest.all,
  controller.getItems
);

router.post(
  "/checkEmailAvailability",
  trimRequest.all,
  controller.checkEmailAvailability
);

router.post(
  "/uploadUserMedia",
  trimRequest.all,
  // requireAuth,
  controller.uploadUserMedia
);

router.post("/addOfficeDetail", trimRequest.all, controller.addOfficeDetail);

router.get("/getOfficeDetail", trimRequest.all, controller.getOfficeDetail);

router.get("/getOfficeType", trimRequest.all, controller.getOfficeType);

router.get("/getDepartmentType", trimRequest.all, controller.getDepartmentType);

router.get(
  "/getCategoryType", // For all category (officeType,department,designation)
  trimRequest.all,
  controller.getCategoryType
);

router.post(
  "/view/published/content",
  requireAuth, // published contents view api
  trimRequest.all,
  controller.viewPublishedContent
);

router.patch(
  "/content/payment",
  requireAuth,
  trimRequest.all,
  controller.contentPayment
);

router.post(
  "/createTask",
  trimRequest.all,
  requireAuth,
  controller.createBroadCastTask
);

router.get(
  "/get/broadcast/tasks",
  trimRequest.all,
  requireAuth,
  controller.getBroadCastTasks
);

router.get(
  "/live/expired/tasks",
  trimRequest.all,
  requireAuth,
  controller.liveExpiredTasks
);

router.get(
  "/publish/content",
  trimRequest.all,
  requireAuth,
  controller.publishedContent
);

router.patch(
  "/add/to/favourites",
  trimRequest.all,
  requireAuth,
  controller.addToFavourites
);

// router.get(
router.post(
  "/favourites",
  trimRequest.all,
  requireAuth,
  controller.favouritesListing
);

router.get("/getProfile", trimRequest.all, requireAuth, controller.getProfile);

router.patch(
  "/editProfile",
  trimRequest.all,
  requireAuth,
  controller.editProfile
);

router.get("/getGenralMgmt", trimRequest.all, controller.getGenralMgmt);

router.get("/tasks/count", trimRequest.all, requireAuth, controller.taskCount);

router.post(
  "/addCotactUs",
  trimRequest.all,
  // requireAuth,
  controller.addCotactUs
);

router.get(
  "/getuploadedContentbyHopper",
  trimRequest.all,
  requireAuth,
  controller.getuploadedContentbyHopper
);

router.get(
  "/getallcontentList",
  trimRequest.all,
  requireAuth,
  controller.getallcontentList
);

router.get(
  "/getallOfficeList",
  trimRequest.all,
  // requireAuth,
  controller.getallOfficeList
);

router.post(
  "/ManageUser",
  trimRequest.all,
  // requireAuth,
  controller.ManageUser
);

router.get(
  "/getalltypeOfdocList",
  trimRequest.all,
  // requireAuth,
  controller.getalltypeOfdocList
);

router.get(
  "/getdesignatedUSer",
  trimRequest.all,
  requireAuth,
  controller.getdesignatedUSer
);

router.patch(
  "/deleteadduser",
  trimRequest.all,

  controller.deleteadduser
);
router.get(
  "/getuploadedContentbyHoppers",
  trimRequest.all,
  requireAuth,
  controller.getuploadedContentbyHoppers
);

router.get(
  "/getSourcedContent",
  trimRequest.all,
  requireAuth,
  controller.getSourcedContent
);
router.get(
  "/Content/Count",
  trimRequest.all,
  requireAuth,
  controller.ContentCount
);

router.post(
  "/create",
  trimRequest.all,
  // requireAuth,
  controller.createreason
);

router.get(
  "/find",
  trimRequest.all,
  // requireAuth,
  controller.dindreason
);

router.post(
  "/dashboard/Count",
  trimRequest.all,
  requireAuth,
  controller.dashboardCount
);

router.post(
  "/addFCMDevice",
  trimRequest.all,
  requireAuth,
  controller.addFCMDevice
);

router.get(
  "/report/count",
  trimRequest.all,
  requireAuth,
  controller.reportCount
);
router.get(
  "/paymenttobemade",
  trimRequest.all,
  requireAuth,
  controller.paymenttobemade
);
router.get(
  "/findacceptedtasks",
  trimRequest.all,
  // requireAuth,
  controller.findacceptedtasks
);

router.post("/createRoom", trimRequest.all, requireAuth, controller.createRoom);

router.post("/getAllchat", trimRequest.all, requireAuth, controller.getAllchat);

router.post(
  "/buyuploadedcontent",
  trimRequest.all,
  requireAuth,
  controller.buyuploadedcontent
);
router.get(
  "/adminlist",
  trimRequest.all,
  // requireAuth,
  controller.adminlist
);

router.post(
  "/payout",
  trimRequest.all,
  // requireAuth,
  controller.payout
);

router.get(
  "/image_pathdownload",
  trimRequest.all,
  // requireAuth,
  controller.image_pathdownload
);

router.get(
  "/getallpublishedcontent",
  trimRequest.all,
  // requireAuth,
  controller.getallpublishedcontent
);

router.get(
  "/getallhopperlist",
  trimRequest.all,
  requireAuth,
  controller.getallhopperlist
);

router.get(
  "/getlistoduploadedcontent",
  trimRequest.all,
  requireAuth,
  controller.gettlistoduploadedcontent
);

router.post(
  "/createPayment",
  trimRequest.all,
  requireAuth,
  controller.createPayment
);

router.all(
  "/challenge/payment/success",
  // requireAuth,
  trimRequest.all,
  controller.challengePaymentSuccess
);

router.get(
  "/challenge/payment/failed",
  trimRequest.all,
  controller.challengePaymentFailed
);

router.get(
  "/getallofferContent",
  requireAuth,
  trimRequest.all,
  controller.getallofferContent
);

router.get("/avgRating", trimRequest.all, requireAuth, controller.avgRating);
router.get(
  "/allratedcontent",
  trimRequest.all,
  requireAuth,
  controller.allratedcontent
);

router.get(
  "/createStripeAccount",
  trimRequest.all,
  // requireAuth,
  controller.createStripeAccount
);

router.post(
  "/payouttohopper",
  trimRequest.all,
  // requireAuth,
  controller.payouttohopper
);

router.patch(
  "/uploadDocToBecomePro",
  trimRequest.all,
  requireAuth,
  controller.uploadDocToBecomePro
);
router.get(
  "/getallinvoiseforMediahouse",
  trimRequest.all,
  requireAuth,
  controller.getallinviise
);

router.post(
  "/uploadMedia",
  trimRequest.all,
  // requireAuth,
  controller.uploadmedia
);

router.get(
  "/Account/count",
  trimRequest.all,
  requireAuth,
  controller.AccountbyContentCount
);

router.get(
  "/reportTaskCount",
  trimRequest.all,
  requireAuth,
  controller.reportTaskCount
);

router.post(
  "/addFcmToken",
  trimRequest.all,
  requireAuth,
  controller.addFcmToken
);

router.get(
  "/listoftask",
  trimRequest.all,
  // requireAuth,
  controller.listoftask
);

router.get(
  "/notificationlisting",
  trimRequest.all,
  requireAuth,
  controller.notificationlisting
);

router.get(
  "/recentactivity",
  trimRequest.all,
  requireAuth,
  controller.recentactivity
);

router.post(
  "/updatenotification",
  trimRequest.all,
  // requireAuth,
  controller.updatenotification
);

router.get(
  "/reportTaskcategory",
  trimRequest.all,
  requireAuth,
  controller.reportTaskcategory
);

router.get(
  "/reportcontentType",
  trimRequest.all,
  requireAuth,
  controller.reportcontentType
);

router.get(
  "/reportlocation",
  trimRequest.all,
  requireAuth,
  controller.reportlocation
);

router.get(
  "/reportgraphoftask",
  trimRequest.all,
  requireAuth,
  controller.reportgraphoftask
);

router.get(
  "/reportcontentsourced",
  trimRequest.all,
  requireAuth,
  controller.reportcontentsourced
);

router.get(
  "/report/content/location",
  trimRequest.all,
  requireAuth,
  controller.reportContentLocation
);

router.get(
  "/report/content/type",
  trimRequest.all,
  requireAuth,
  controller.reportcontentTypeGraph
);

router.get(
  "/report/content/category",
  trimRequest.all,
  requireAuth,
  controller.reportContentcategory
);

router.get(
  "/reportgraphofContentforPaid",
  trimRequest.all,
  // requireAuth,
  controller.reportgraphofContentforPaid
);

router.get(
  "/reportgraphofContent",
  trimRequest.all,
  // requireAuth,
  controller.reportgraphofContentsourcedSumary
);
router.get(
  "/reportfundInvested",
  trimRequest.all,
  requireAuth,
  controller.reportfundInvested
);

router.get(
  "/reportfundInvestedforContent",
  trimRequest.all,
  requireAuth,
  controller.reportfundInvestedforContent
);

router.get(
  "/AccountfundInvested",
  trimRequest.all,
  requireAuth,
  controller.AccountfundInvested
);

router.get(
  "/AccountforVat",
  trimRequest.all,
  requireAuth,
  controller.AccountforVat
);

router.get(
  "/AccountcontentPurchasedOnline",
  trimRequest.all,
  requireAuth,
  controller.AccountcontentPurchasedOnline
);
router.post(
  "/confirm/password",
  trimRequest.all,
  requireAuth,
  controller.confirmPassword
);

router.get(
  "/get/exclusive/content",
  trimRequest.all,
  controller.exclusiveContents
);

router.get(
  "/currentchat",
  trimRequest.all,
  requireAuth,
  controller.currentchat
);

router.get(
  "/listofHopperwithoutrating",
  trimRequest.all,
  requireAuth,
  controller.listofHopperwithoutrating
);

router.get(
  "/contentwithouthrating",
  trimRequest.all,
  requireAuth,
  controller.contentwithouthrating
);

router.patch(
  "/ratingforunratedcontent",
  trimRequest.all,
  requireAuth,
  controller.ratingforunratedcontent
);
router.post(
  "/mostviewed",
  trimRequest.all,
  // requireAuth,
  controller.mostviewed
);

router.post(
  "/create/paymet/intent",
  trimRequest.all,
  requireAuth,
  controller.createPaymentIntent
);

router.post(
  "/MoreContent",
  trimRequest.all,
  // requireAuth,
  controller.MoreContent
);

router.post(
  "/relatedContent",
  trimRequest.all,
  // requireAuth,
  controller.relatedContent
);

router.post("/sendMessage", trimRequest.all, controller.sendWhatsapp);

router.get(
  "/trending_search",
  trimRequest.all,
  // requireAuth,
  controller.trending_search
);

router.get(
  "/vatforaccount",
  trimRequest.all,
  requireAuth,
  controller.vatforaccount
);

router.get(
  "/contentPurchasedOnlinesummary",
  trimRequest.all,
  requireAuth,
  controller.contentPurchasedOnlinesummary
);

router.get(
  "/taskPurchasedOnlinesummary",
  trimRequest.all,
  requireAuth,
  controller.taskPurchasedOnlinesummary
);

router.get(
  "/taskPurchasedOnlinesummaryforReport",
  trimRequest.all,
  requireAuth,
  controller.taskPurchasedOnlinesummaryforReport
);

router.get(
  "/fundInvestedTodayortotal",
  trimRequest.all,
  requireAuth,
  controller.fundInvestedTodayortotal
);


router.get(
  "/reportSplit",
  trimRequest.all,
  requireAuth,
  controller.reportSplit
);


router.post(
  "/sendPustNotificationtoHopper",
  trimRequest.all,
  requireAuth,
  controller.sendPustNotificationtoHopper
);

router.post(
  "/getContensLists",
  requireAuth,
  trimRequest.all,
  controller.getContensLists
)

router.post(
  "/userRegisteration",
  trimRequest.all,
  controller.userRegisteration
)

router.get(
  "/getUnApprovedUsers",
  requireAuth,
  trimRequest.all,
  controller.getUnApprovedUsers
)

router.patch(
  "/complete/onboard/user/details",
  trimRequest.all,
  controller.completeOnboardUserDetails
)

router.post(
  "/checkImageExplicity",
  trimRequest.all,
  controller.checkImageExplicity
)

router.get(
  "/getTaskContentByHopper",
  trimRequest.all,
  requireAuth,
  controller.getTaskContentByHopper
)

router.post(
  "/create/onboard",
  trimRequest.all,
  // requireAuth,
  controller.createOnboard
)

router.post(
  "/addUserBankDetails",
  trimRequest.all,
  // requireAuth,
  controller.addUserBankDetails
)



router.post(
  "/MoreContentfortask",
  trimRequest.all,
  // requireAuth,
  controller.MoreContentfortask
);

router.post(
  "/relatedContentfortask",
  trimRequest.all,
  // requireAuth,
  controller.relatedContentfortask
);


router.post(
  "/recentactivityformediahouse",
  trimRequest.all,
  requireAuth,
  controller.recentactivityformediahouse
);


router.post(
  "/getSourcedContentbytask",
  trimRequest.all,
  requireAuth,
  controller.getSourcedContentbytask
);


router.post(
  "/uploadedcontenyinContentscreen",
  trimRequest.all,
  // requireAuth,
  controller.uploadedcontenyinContentscreen
);

router.post(
  "/internalGroupChatMH",
  trimRequest.all,
  requireAuth,
  controller.internalGroupChatMH
);

router.post(
  "/presshopGroupChatMH",
  trimRequest.all,
  requireAuth,
  controller.presshopGroupChatMH
);
router.get(
  "/openChatsMH",
  trimRequest.all,
  requireAuth,
  controller.openChatsMH
);

router.get(
  "/internalGroupMembers",
  trimRequest.all,
  requireAuth,
  controller.internalGroupMembers
);


router.get(
  "/openContentMH",
  trimRequest.all,
  requireAuth,
  controller.openContentMH
);

router.get(
  "/openContentMH2",
  trimRequest.all,
  requireAuth,
  controller.openContentMH2
);

 router.get(
  "/latestcontentbyhopper",
  trimRequest.all,
  requireAuth,
  controller.latestcontentbyhopper
); 

router.post(
  "/archivecontent", // published contents view api
  trimRequest.all,
  controller.archivecontent
);
router.post(
  "/addTrendingSearch",
  requireAuth,
  trimRequest.all,
  controller.addTrendingSearch
);
router.get(
  "/getContentByTrendingSearch",
  trimRequest.all,
  controller.getContentByTrendingSearch
); 

router.post(
  "/addemail",
  // requireAuth,
  trimRequest.all,
  controller.addemail
);


router.post(
  "/checkcompanyvalidation",
  // requireAuth,
  trimRequest.all,
  controller.checkcompanyvalidation
);
module.exports = router;
