const speakeasy = require("speakeasy");
const Secret2FA = require("../models/user2FA");
const qrcode = require("qrcode");
const { generateToken } = require("../services/token.service");
const User = require("../models/user");
const {
  SUCCESS_GOOGLE_REDIRECT,
  GOOGLE_USE2FA_REDIRECT,
  FAILURE_GOOGLE_REDIRECT,
} = require("../const/redirects");
const ApiError = require("../error/errorClass");

const handleGoogleLogin = async (req, res) => {
  try {
    const profile = req.user;
    const user = await User.findOne({ email: profile.emails[0].value });
    if (!user) throw "User is not authorized";

    if (user.isUse2FA) {
      const secret = speakeasy.generateSecret({ name: "Draw online" });
      const isExistUserSecret2FA = await Secret2FA.findOne({
        userId: user.id,
      });

      if (isExistUserSecret2FA) {
        isExistUserSecret2FA.secretKey = secret.base32;
        await isExistUserSecret2FA.save();
      } else {
        await Secret2FA.create({
          userId: user.id,
          secretKey: secret.base32,
        });
      }

      qrcode.toDataURL(secret.otpauth_url, function (err, data) {
        if (err) return next(ApiError.internal("Server error"));
        if (data) {
          return res.redirect(
            `${GOOGLE_USE2FA_REDIRECT}?userId=${user.id}&qrcode=${data}`
          );
        }
      });
    } else {
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
    }
  } catch (e) {
    return res.redirect(
      `${FAILURE_GOOGLE_REDIRECT}?error=${
        typeof e === "string" ? e : JSON.stringify(e)
      }`
    );
  }
};

module.exports = { handleGoogleLogin };
