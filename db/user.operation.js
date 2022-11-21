const User = require("../models/user");
const Crypto = require("crypto-js");
const { nanoid } = require("nanoid");
const { sendActivationMail } = require("../services/mail.service");
const Token = require("../models/token");
const path = require("path");
const ApiError = require("../error/errorClass");
const RegistrationTokens = require("../models/registrationTokens");
const { ORIGIN } = require("../const/settings");
const { getTypeFromMime } = require("../utils/getTypeFromMime");
const Secret2FA = require("../models/user2FA");
const secondsToMiliseconds = require("../utils/secondsToMiliseconds");
const deleteFile = require("../utils/deleteFile");
const createPath = require("../utils/createPath");
const createFile = require("../utils/createFile");

const CheckUser = async (email) => {
  const candidate = await User.findOne({ email });
  if (!candidate) throw ApiError.notFound("User is not exist");
  return candidate;
};

const RegisterToken = async (data) => {
  const { email, password, name } = data;
  const hash_password = Crypto.SHA256(password).toString();
  const activationLink = nanoid();

  await RegistrationTokens.create({
    name,
    email,
    password: hash_password,
    activationLink,
    createdAt: Date.now(),
    expiresAt: Date.now() + secondsToMiliseconds(1800),
  });

  await sendActivationMail(email, `${ORIGIN}/activate/${activationLink}`);
};

const LoginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("-__v -activationLink");

  if (!user) throw ApiError.notFound("User is not exist");

  if (user.isActivated === false) {
    throw ApiError.conflict("Please confirm your email adress");
  }

  const hash_password = Crypto.SHA256(password).toString();

  if (hash_password !== user.password) {
    throw ApiError.badRequest("Invalid password");
  }

  return user;
};

const GetUser = async (id) => {
  try {
    const user = await User.findById(id).select(
      "-__v -activationLink -isActivated -password -isUserInRoom -limitRooms -rooms"
    );
    return user;
  } catch {
    throw ApiError.notFound("User is not found");
  }
};

const Logout = async (refreshToken) => {
  const token = await Token.findOneAndDelete({ refreshToken });
  return token;
};

const Update = async (
  { id, email, password, ...data },
  { avatar, backgroundFon, originalAvatar },
  user
) => {
  let resultObject = {};

  if (avatar) {
    const ext = getTypeFromMime(avatar.mimetype);
    const avatarFileName = `${nanoid()}_avatar.${ext}`;

    await Promise.all([
      deleteFile(createPath(["static", user.avatar])),
      createFile(
        createPath(["static", "users", id, avatarFileName]),
        avatar.data
      ),
    ]);

    resultObject = { avatar: `users/${id}/${avatarFileName}` };
  }

  if (originalAvatar) {
    const ext = getTypeFromMime(originalAvatar.mimetype);
    const originalAvatarFileName = `${nanoid()}_originalAvatar.${ext}`;

    await Promise.all([
      deleteFile(createPath(["static", user.originalAvatar])),
      createFile(
        createPath(["static", "users", id, originalAvatarFileName]),
        originalAvatar.data
      ),
    ]);

    resultObject = {
      ...resultObject,
      originalAvatar: `users/${id}/${originalAvatarFileName}`,
    };
  }

  if (backgroundFon) {
    const ext = getTypeFromMime(backgroundFon.mimetype);
    const backgroundFileName = `${nanoid()}_background.${ext}`;

    await Promise.all([
      deleteFile(createPath(["static", user.backgroundFon])),
      createFile(
        createPath(["static", "users", id, backgroundFileName]),
        backgroundFon.data
      ),
    ]);

    resultObject = {
      ...resultObject,
      backgroundFon: `users/${id}/${backgroundFileName}`,
    };
  }

  await User.findByIdAndUpdate(id, { ...resultObject, ...data });

  const res = await GetUser(id);

  return res;
};

const checkUser2FaAbility = async (id) => {
  const userSecret = await Secret2FA.findOne({ userId: id });

  if (!userSecret) throw ApiError.forbidden("Occured error");

  const isExpiredTimeToNextAttempt =
    new Date(userSecret.failAttemptsCommittedAt + 600000).getTime() <
    Date.now();

  if (userSecret.attemptsLeftCount === 0 && isExpiredTimeToNextAttempt) {
    userSecret.attemptsLeftCount = 3;
    await userSecret.save();

    return userSecret;
  }

  const tryAgainAcross = new Date(
    userSecret.failAttemptsCommittedAt + 600000 - Date.now()
  );

  if (!isExpiredTimeToNextAttempt || userSecret.attemptsLeftCount === 0) {
    throw ApiError.forbidden(
      `You ran out of attempts try again across ${
        tryAgainAcross.getMinutes()
          ? tryAgainAcross.getMinutes() + " minutes"
          : tryAgainAcross.getSeconds() + " seconds"
      } `
    );
  }

  return userSecret;
};

module.exports = {
  CheckUser,
  RegisterToken,
  LoginUser,
  GetUser,
  Logout,
  Update,
  checkUser2FaAbility,
};
