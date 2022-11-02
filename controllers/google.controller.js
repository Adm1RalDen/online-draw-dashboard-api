const { generateToken } = require("../services/token.service");
const User = require("../models/user");
const {
  SUCCESS_GOOGLE_REDIRECT,
  GOOGLE_USE2FA_REDIRECT,
  FAILURE_GOOGLE_REDIRECT,
} = require("../const/redirects");
const { checkUser2FaAbility } = require("../db/user.operation");

const handleGoogleLogin = async (req, res) => {
  try {
    const profile = req.user;
    const user = await User.findOne({ email: profile.emails[0].value });

    if (!user) throw "You aren`t registrated on DrawOnline";

    if (user.isUse2FA) {
      const userSecret = await checkUser2FaAbility(user.id);
      let buff = Buffer.from(
        JSON.stringify({
          userId: user.id,
          attemptsLeftCount: userSecret.attemptsLeftCount,
        })
      );
  
      let base64data = buff.toString("base64");
      return res.redirect(`${GOOGLE_USE2FA_REDIRECT}?data=${base64data}`);
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
        typeof e === "string" ? e : e?.message || JSON.stringify(e)
      }`
    );
  }
};

module.exports = { handleGoogleLogin };
