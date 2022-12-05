const UserOperations = require("../db/user.operation");
const tokenService = require("../services/token.service");
const User = require("../models/user");
const ResetPassword = require("../models/reset-password-data");
const Secret2FA = require("../models/twofa-data");
const qrcode = require("qrcode");
const RegistrationTokens = require("../models/registration-data");

const ApiError = require("../error/errorClass");
const Crypto = require("crypto-js");
const TwoFA = require("../services/twoFa.service");

const emailService = require("../services/mail.service");
const { generateStrOfNumbers } = require("../utils/generateStrOfNumbers");
const { ORIGIN } = require("../const/settings");
const { nanoid } = require("nanoid");
const secondsToMiliseconds = require("../utils/secondsToMiliseconds");
const getUserGeolocation = require("../utils/getUserGeolocation");
const createDir = require("../utils/createDir");
const createPath = require("../utils/createPath");

const verify2FA = async (req, res, next) => {
  try {
    const { userId, secure2FACode } = req.body;

    if (!userId || !secure2FACode) throw ApiError.badRequest("Invalid data");

    const userSecret = await UserOperations.checkUser2FaAbility(userId);
    const isVerify = TwoFA.verify2Fa(userSecret.secretKey, secure2FACode);

    if (!isVerify) {
      userSecret.attemptsLeftCount -= 1;

      if (userSecret.attemptsLeftCount === 0) {
        userSecret.failAttemptsCommittedAt = Date.now();
      }

      await userSecret.save();
      throw next(ApiError.forbidden("Invalid code"));
    }

    const user = await User.findById(userId);
    const tokens = tokenService.generateToken(user.id, user.email, user.role);
    const userData = {
      token: tokens.access,
      refreshToken: tokens.refresh,
      user: {
        name: user.name,
        id: user.id,
      },
    };

    userSecret.failAttemptsCommittedAt = 0;
    userSecret.attemptsLeftCount = 3;

    await userSecret.save();
    return res.json(userData);
  } catch (e) {
    next(e);
  }
};

const activate = async (req, res, next) => {
  try {
    const { link } = req.params;

    if (!link) throw ApiError.badRequest("Invalid link");

    const registrationToken = await RegistrationTokens.findOne({
      activationLink: link,
    });

    if (!registrationToken) {
      throw ApiError.badRequest("Occured error");
    }

    if (new Date() > registrationToken.expiresAt) {
      await registrationToken.delete();
      throw ApiError.badRequest("Link isn`t active, try registration again");
    }

    const user = await User.create({
      name: registrationToken.name,
      email: registrationToken.email,
      password: registrationToken.password,
      isActivated: true,
    });

    await createDir(createPath(["..", "static", "users", user.id]));
    await registrationToken.delete()
    return res.json({ message: "Success" });
  } catch (e) {
    next(e);
  }
};

const registration = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      throw ApiError.badRequest("Invalid data");
    }

    const userExist = await User.findOne({ email });
    const registrationToken = await RegistrationTokens.findOne({ email });

    if (userExist) {
      throw ApiError.conflict("User is exist");
    }

    if (registrationToken) {
      throw ApiError.badRequest(
        "Letter was submit to your email, please confirm your account"
      );
    }

    await UserOperations.RegisterToken({
      email,
      password,
      name,
    });

    return res.json({
      message:
        "Letter was send in your email. Please confirm your email adress",
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw ApiError.badRequest("Invalid data");
    }

    const user = await UserOperations.LoginUser({ email, password });

    if (user.isUse2FA) {
      const userSecret = await UserOperations.checkUser2FaAbility(user.id);

      return res.json({
        userId: user.id,
        isUse2FA: true,
        attemptsLeftCount: userSecret.attemptsLeftCount,
      });
    }

    const token = tokenService.generateToken(user._id, user.email, user.role);
    await tokenService.saveToken(user.id, token.refresh);

    const result = {
      refreshToken: token.refresh,
      token: token.access,
      user: {
        name: user.name,
        role: user.role,
        id: user._id,
      },
    };

    const userGeolocation = await getUserGeolocation(
      req.header("x-forwarded-for") || req.connection.remoteAddress
    );

    if (userGeolocation) {
      await emailService.sendNotifyAboutLogin(email, userGeolocation);
    }

    return res.json(result);
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(200).json({ message: "Logout success" });
    }
    await UserOperations.Logout(refreshToken);
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Logout success" });
  } catch (e) {
    next(e);
  }
};

const handleRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(ApiError.notAuthorized("User is not authorized"));
    }

    const userData = await tokenService.refresh(refreshToken);

    const result = {
      token: userData.token,
      user: userData.user,
    };

    return res.json(result);
  } catch (e) {
    next(e);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const data = req.body;
    const files = req.files || {
      avatar: null,
      backgroundFon: null,
      originalAvatar: null,
    };

    if (!data.id) {
      throw ApiError.badRequest("Invalid data in request");
    }

    try {
      await User.findById(data.id);
    } catch {
      throw ApiError.notFound("User is not found");
    }

    await UserOperations.Update(data, files);
    return res.json({ message: "Updated" });
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest("Invalid data");
    }

    const user = await UserOperations.GetUser(id);

    if (!user) {
      throw ApiError.notAuthorized("User is not authorized");
    }

    const { _id, ...data } = user._doc;
    return res.json({ ...data, id: _id });
  } catch (e) {
    next(e);
  }
};

const send2FaCodeOnEmail = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const code = generateStrOfNumbers(6);

    await Secret2FA.findOneAndUpdate({ userId: id }, { emailCode: code });
    await emailService.send2FaCodeOnMail(user.email, code);

    return res.json();
  } catch (e) {
    next(e);
  }
};

const disable2Fa = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password, secure2FACode } = req.body;

    if (!password || !secure2FACode) {
      throw ApiError.badRequest("Invalid data");
    }

    const user = await User.findById(userId);

    if (!user.isUse2FA) {
      throw ApiError.forbidden("Invalid request");
    }

    const hashPassword = Crypto.SHA256(password);

    if (user.password != hashPassword) {
      throw ApiError.forbidden("Invalid password");
    }

    const userSecret = await Secret2FA.findOne({ userId });

    if (!TwoFA.verify2Fa(userSecret.secretKey, secure2FACode)) {
      throw ApiError.forbidden("Invalid code");
    }

    user.isUse2FA = false;

    await user.save();
    await userSecret.delete();

    return res.json({ message: "Disabled successfully" });
  } catch (e) {
    next(e);
  }
};

const confirmCreating2Fa = async (req, res, next) => {
  try {
    const { secure2FACode, emailCode } = req.body;
    const { id } = req.user;

    const secret = await Secret2FA.findOne({ userId: id }).and({ emailCode });

    if (!secret) {
      throw ApiError.badRequest("Invalid code from Email");
    }

    const isVerified = TwoFA.verify2Fa(secret.secretKey, secure2FACode);

    if (!isVerified) {
      throw ApiError.badRequest("Invalid code from Google Authentificator");
    }

    await User.findByIdAndUpdate(id, { isUse2FA: true });
    return res.json();
  } catch (e) {
    next(e);
  }
};

const create2Fa = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const secret = TwoFA.generateSecret();

    qrcode.toDataURL(secret.otpauth_url, async function (err, data) {
      if (err) throw ApiError.internal("Server error");
      if (data) {
        const isExistSecret = await Secret2FA.findOne({ userId });

        if (isExistSecret) {
          isExistSecret.secretKey = secret.base32;
          await isExistSecret.save();
        } else {
          await Secret2FA.create({
            userId: userId,
            secretKey: secret.base32,
          });
        }

        return res.json({
          isUse2FA: true,
          userId: userId,
          secretKey: secret.base32,
          qrcode: data,
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

const recoverPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw ApiError.badRequest("Invalid data in request");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw ApiError.forbidden("You are not authorized");
    }

    const linkId = nanoid();
    const link = `${ORIGIN}/reset-password?link=${linkId}`;

    const resetPassword = await ResetPassword.findOne({ userId: user.id });

    if (resetPassword) {
      if (Date.now() >= resetPassword.expiresAt) {
        resetPassword.link = linkId;
        resetPassword.createdAt = Date.now();
        resetPassword.expiresAt = Date.now() + secondsToMiliseconds(600);
        await resetPassword.save();
      } else {
        const timeDifference = new Date(resetPassword.expiresAt - Date.now());
        const expiresAt =
          timeDifference.getMinutes() > 0
            ? timeDifference.getMinutes() + " minutes"
            : timeDifference.getSeconds() + " seconds";

        throw ApiError.forbidden(
          `You can try to repeat reset password across ${expiresAt}`
        );
      }
    } else {
      await ResetPassword.create({
        userId: user.id,
        link: linkId,
        createdAt: Date.now(),
        expiresAt: Date.now() + secondsToMiliseconds(600),
      });
    }

    await emailService.sendResetPasswordLinkOnMail(email, link);

    return res.json();
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword, link } = req.body;

    if (!password || !confirmPassword || !link) {
      throw ApiError.badRequest("Invalid data in request");
    }

    if (password !== confirmPassword || password.length < 6) {
      throw ApiError.badRequest("Invalid data in request");
    }

    const resetPassword = await ResetPassword.findOne({ link });

    if (!resetPassword) {
      throw ApiError.notFound("Link is not active");
    }

    if (Date.now() > resetPassword.createdAt + secondsToMiliseconds(1800)) {
      throw ApiError.forbidden("Reset link is expired");
    }

    const hashPassword = Crypto.SHA256(password).toString();

    await User.findByIdAndUpdate(resetPassword.userId, {
      password: hashPassword,
    });

    return res.json();
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registration,
  login,
  getUser,
  activate,
  handleRefresh,
  logout,
  updateUserData,
  verify2FA,
  create2Fa,
  confirmCreating2Fa,
  send2FaCodeOnEmail,
  disable2Fa,
  resetPassword,
  recoverPassword,
};
