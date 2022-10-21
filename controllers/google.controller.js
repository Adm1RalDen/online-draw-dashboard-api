const { generateToken } = require("../services/token.service");
const User = require("../models/user");
const {
  SUCCESS_GOOGLE_REDIRECT,
  GOOGLE_USE2FA_REDIRECT,
  FAILURE_GOOGLE_REDIRECT,
} = require("../const/redirects");

const handleGoogleLogin = async (req, res) => {
  try {
    const profile = req.user;
    const user = await User.findOne({ email: profile.emails[0].value });

    if (!user) throw "User is not authorized";

    if (user.isUse2FA) {
      return res.redirect(`${GOOGLE_USE2FA_REDIRECT}?userId=${user.id}`);
    }

    const tokens = generateToken(user.id, user.email, user.role);
    const defaultUser = {
      token: tokens.access,
      user: {
        id: user.id,
        name: user.name,
      },
    };

    return res.redirect(
      `${SUCCESS_GOOGLE_REDIRECT}?user=${JSON.stringify(defaultUser)}`
    );
  } catch (e) {
    return res.redirect(
      `${FAILURE_GOOGLE_REDIRECT}?error=${
        typeof e === "string" ? e : JSON.stringify(e)
      }`
    );
  }
};

module.exports = { handleGoogleLogin };
