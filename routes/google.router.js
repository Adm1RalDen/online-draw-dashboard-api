const router = require("express").Router();
const passport = require("passport");
const { GOOGLE_AUTH_ENDPOINTS } = require("../const/endpoints");
const { FAILURE_GOOGLE_REDIRECT } = require("../const/redirects");
const { handleGoogleLogin } = require("../controllers/google.controller");

const {
  GOOGLE_SIGN_IN_CALLBACK_ENDPOINT,
  GOOGLE_SIGN_IN_ENDPOINT,
  GOOGLE_SIGN_IN_FAILURE_ENDPOINT,
} = GOOGLE_AUTH_ENDPOINTS;

router.get(
  GOOGLE_SIGN_IN_ENDPOINT,
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  GOOGLE_SIGN_IN_CALLBACK_ENDPOINT,
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    failureRedirect: GOOGLE_SIGN_IN_FAILURE_ENDPOINT,
  }),
  handleGoogleLogin
);

router.get(GOOGLE_SIGN_IN_FAILURE_ENDPOINT, function (req, res) {
  return res.redirect(FAILURE_GOOGLE_REDIRECT);
});

module.exports = router;
