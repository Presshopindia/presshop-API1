const passport = require("passport");
const User = require("../app/models/user");
const Admin = require("../app/models/admin");

const auth = require("../app/middleware/auth");
const JwtStrategy = require("passport-jwt").Strategy;

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "").trim();
  } else if (req.body.token) {
    token = req.body.token.trim();
  } else if (req.query.token) {
    token = req.query.token.trim();
  }
  if (token) {
    // Decrypts token
    token = auth.decrypt(token);
  }
  console.log("token===========",req.headers.authorization)
  return token;
};

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

/**
 * Login with JWT middleware
 */
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  if (payload.data.role === "Hopper" || payload.data.role === "MediaHouse" || payload.data.role === "Adduser" || payload.data.role === "User_mediaHouse") {
    User.findById(payload.data._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      return !user ? done(null, false) : done(null, user);
    });
  } else if (
    payload.data.role === "admin" ||
    payload.data.role === "subAdmin"
  ) {
    Admin.findById(payload.data._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      return !user ? done(null, false) : done(null, user);
    });
  }
});

passport.use(jwtLogin);
