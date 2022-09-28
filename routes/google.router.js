const router = require("express").Router();
const passport = require("passport");
const { GOOGLE_AUTH_ENDPOINTS } = require("../const/endpoints");
const { FAILURE_GOOGLE_REDIRECT, SUCCESS_GOOGLE_REDIRECT } = require("../const/redirects");

const { GOOGLE_SIGN_IN_CALLBACK_URL, GOOGLE_SIGN_IN_URL } = GOOGLE_AUTH_ENDPOINTS;
router.get(
  GOOGLE_SIGN_IN_URL,
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  GOOGLE_SIGN_IN_CALLBACK_URL,
  passport.authenticate("google", {
    session: false,
    failureRedirect: FAILURE_GOOGLE_REDIRECT,
  }),
  async function (req, res) {
    return res.redirect(
      `${SUCCESS_GOOGLE_REDIRECT}?user=${JSON.stringify(req.user)}`
    );
  }
);

module.exports = router;
