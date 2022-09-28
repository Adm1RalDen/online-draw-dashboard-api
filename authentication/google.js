const passport = require("passport");
const User = require("../models/user");
const { AUTH_GOOGLE_CALLBACK } = require("../const/redirects");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { generateToken } = require("../services/token.service");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: AUTH_GOOGLE_CALLBACK,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value })
        .then((res) => {
          if (!res) {
            return cb(null, null);
          }
          const tokens = generateToken(res.id, res.email, res.role);
          const defaultUser = {
            token: tokens.access,
            user: {
              id: res.id,
              name: res.name,
            },
          };
          return cb(null, defaultUser);
        })
        .catch((e) => {
          return cb(null, null);
        });
    }
  )
);
