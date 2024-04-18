const controller = require("../controllers/auth");
const validate = require("../controllers/auth.validate");
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
 * Auth routes
 */

/*
 * Register route
 */
router.post(
  "/registerHopper",
  trimRequest.all,
  validate.registerHopper,
  controller.register
);

router.post(
  "/hopper/socialLogin",
  trimRequest.all,
  validate.socialLogin,
  controller.socialLogin
);

router.post(
  "/hopper/socialRegister",
  trimRequest.all,
  validate.hopperSocialRegister,
  controller.hopperSocialRegister
);

router.post(
  "/registerMediaHouse",
  trimRequest.all,
  validate.registerMediaHouse,
  controller.register
);

router.post(
  "/loginMediaHouse",
  trimRequest.all,
  // validate.registerMediaHouse,
  controller.loginMediaHouse
);
/*
 * Verify route
 */
router.post("/verify", trimRequest.all, validate.verify, controller.verify);

/*
 * Forgot password route
 */

/*
 * Forgot password route
 */
router.post(
  "/admin/forgotPassword",
  trimRequest.all,
  // requireAuth,
  validate.adminForgotPassword,
  controller.adminForgotPassword
);

router.post(
  "/media/house/forgotPassword",
  trimRequest.all,
  validate.mediaHosueForgotPassword,
  controller.mediaHouseForgotPassword
);

router.post(
  "/hopper/forgotPassword",
  trimRequest.all,
  validate.hopperForgotPassword,
  controller.hopperForgotPassword
);
/*
 * Reset password route
 */
router.post(
  "/hopper/resetPassword",
  trimRequest.all,
  validate.hopperResetPassword,
  controller.hopperResetPassword
);

router.post(
  "/media/house/resetPassword",
  trimRequest.all,
  validate.mediaHouseResetPassword,
  controller.mediaHouseResetPassword
);

router.post(
  "/admin/resetPassword",
  trimRequest.all,
  // validate.adminResetPassword,
  controller.adminResetPassword
);
/*
 * Get new refresh token
 */
router.get(
  "/token",
  requireAuth,
  AuthController.roleAuthorization(["user", "admin"]),
  trimRequest.all,
  controller.getRefreshToken
);

/*
 * Login route
 */
router.post("/login", trimRequest.all, validate.login, controller.login);

router.post("/sendOTP", trimRequest.all, validate.sendOTP, controller.sendOTP);

router.post(
  "/verifyOTP",
  trimRequest.all,
  validate.verifyOTP,
  controller.verifyOTP
);

router.post(
  "/admin/login",
  trimRequest.all,
  validate.adminLogin,
  controller.adminLogin
);

router.post(
  "/uploadUserMedia",
  trimRequest.all,
  requireAuth,
  controller.uploadUserMedia
);

router.patch(
  "/chatStatus",
  trimRequest.all,
  requireAuth,
  controller.chatStatus
);

module.exports = router;
