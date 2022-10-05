const passport = require("passport");
const { AUTH_GOOGLE_CALLBACK } = require("../const/redirects");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: AUTH_GOOGLE_CALLBACK,
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);
