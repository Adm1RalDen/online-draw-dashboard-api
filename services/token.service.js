const jwt = require("jsonwebtoken");
const {
  SECRETKEY,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require("../const/settings");
const ApiError = require("../error/errorClass");
const Token = require("../models/token");

const generateToken = (id, email, role) => {
  const access = jwt.sign({ id, email, role }, SECRETKEY, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refresh = jwt.sign({ id, email, role }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { access, refresh };
};

const saveToken = async (userId, refreshToken) => {
  const exist = await Token.findOne({ user: userId });

  if (exist) {
    exist.refreshToken = refreshToken;
    await exist.save();

    return;
  }

  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

const refresh = async (refreshToken) => {
  let tokenData;

  try {
    tokenData = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (e) {
    throw ApiError.notAuthorized("User is not authorized");
  }

  if (!tokenData) {
    throw ApiError.notAuthorized("User is not authorized");
  }

  const token = generateToken(tokenData.id, tokenData.name, tokenData.role);
  await saveToken(tokenData.id, token.refresh);

  const result = {
    token: token.access,
    refresh: token.refresh,
    user: {
      id: tokenData.id,
      name: tokenData.name,
      role: tokenData.role,
    },
  };

  return result;
};

module.exports = { generateToken, saveToken, refresh };
