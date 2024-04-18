const controller = require("../controllers/users");
const validate = require("../controllers/users.validate");
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
  "/checkIfUserNameExist/:username",
  trimRequest.all,
  controller.checkIfUserNameExist
);

router.get(
  "/checkIfEmailExist/:email",
  trimRequest.all,
  controller.checkIfEmailExist
);

router.get(
  "/checkIfPhoneExist/:phone",
  trimRequest.all,
  controller.checkIfPhoneExist
);
/*
 * Get items route
 */
router.get("/getAvatars", trimRequest.all, controller.getAvatars);

router.get(
  //ACCORDING TO TYPE
  "/getCMS/:type",
  trimRequest.all,
  validate.getCMSByType,
  controller.getCMSByType
);

router.get(
  //ALL CMS CONTENT
  "/getCMSForHopper",
  trimRequest.all,
  controller.getCMSForHopper
);

router.get(
  "/getPriceTipAndFAQs/:role/:type",
  requireAuth,
  trimRequest.all,
  controller.getPriceTipAndFAQs
);

router.get(
  "/getCategory",
  requireAuth,
  trimRequest.all,
  controller.getCategory
);

router.get("/getTags", 
requireAuth, 
trimRequest.all, 
controller.getTags);

router.post(
  "/addTag",
  requireAuth,
  trimRequest.all,
  validate.addTag,
  controller.addTag
);

router.post(
  "/changePassword",
  requireAuth,
  trimRequest.all,
  validate.changePassword,
  controller.changePassword
);

router.get(
  "/trendingTag",
  requireAuth,
  trimRequest.all,
  // validate.changePassword,
  controller.trendingTag
);
module.exports = router;
