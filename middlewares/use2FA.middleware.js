const User = require("../models/user");
const Crypto = require("crypto-js");
const ApiError = require("../error/errorClass");
const speakeasy = require("speakeasy");
const Secret2FA = require("../models/user2FA");
const qrcode = require("qrcode");

const use2FAmiddleware = async (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const { email, password } = req.body;

  if (!email || !password) return next(ApiError.badRequest("Invalid data"));
  const hash_password = Crypto.SHA256(password).toString();
  const currentUser = await User.findOne({ email, password: hash_password });

  if (!currentUser) return next(ApiError.forbidden("Error auth"));
  if (!currentUser.isUse2FA) return next();

  const secret = speakeasy.generateSecret({ name: "code" });
  const isExistUserSecret2FA = await Secret2FA.findOne({
    userId: currentUser.id,
  });

  if (isExistUserSecret2FA) {
    isExistUserSecret2FA.secretKey = secret.base32;
    await isExistUserSecret2FA.save();
  } else {
    await Secret2FA.create({
      userId: currentUser.id,
      secretKey: secret.base32,
    });
  }

  qrcode.toDataURL(secret.otpauth_url, function (err, data) {
    if (err) return next(ApiError.internal("Server error"));
    if (data) {
      return res.json({
        isUse2FA: true,
        userId: currentUser.id,
        qrcode: data,
      });
    }
  });
};

module.exports = { use2FAmiddleware };
