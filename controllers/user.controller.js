const UserOperations = require("../db/user.operation");
const tokenService = require("../services/token.service");
const User = require("../models/user");
const ApiError = require("../error/errorClass");
const { ORIGIN } = require("../const/settings");

const activate = async (req, res, next) => {
  try {
    const { link } = req.params;
    if (!link) return next(ApiError.badRequest("Invalid link"));
    const user = await User.findOne({ activationLink: link });
    if (user.isActivated) {
      return next(ApiError.badRequest("Link is not active"));
    }
    if (!user) return next(ApiError.notFound("Not found user with this link"));
    user.isActivated = true;
    await user.save();
    return res.redirect(ORIGIN);
  } catch (e) {
    next(e);
  }
};

const registration = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return next(ApiError.badRequest("Invalid data"));

    const userExist = await User.findOne({ email });
    if (userExist) return next(ApiError.conflict("User is exist"));

    await UserOperations.RegisterUser({
      email,
      password,
      name,
    });

    return res.json({
      message: "Letter was send in your email. Please confirm your email adress",
    });
  } catch (e) {
    await User.findOneAndDelete({ email: req.body.email });
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Invalid data"));
    }

    const user = await UserOperations.LoginUser({ email, password });
    const token = tokenService.generateToken(user._id, user.email, user.role);
    await tokenService.saveToken(user.id, token.refresh);

    res.cookie("refreshToken", token.refresh, {
      maxAge: 3600 * 24 * 1000 * 31,
      httpOnly: true,
    });

    const result = {
      token: token.access,
      user: {
        name: user.name,
        role: user.role,
        id: user._id,
      },
    };

    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next(ApiError.notAuthorized("User is not authorized"));
    }

    const userData = await tokenService.refresh(refreshToken);

    const result = {
      token: userData.token,
      user: userData.user,
    };

    res.cookie("refreshToken", userData.refresh, {
      maxAge: 3600 * 24 * 1000 * 31,
      httpOnly: true,
    });

    return res.json(result);
  } catch (e) {
    next(e);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const data = req.body;
    const files = req.files || { avatar: null, backgroundFon: null };

    if (!data.id) {
      return next(ApiError.badRequest("Invalid data in request"));
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
      return next(ApiError.badRequest("Invalid data"));
    }
    const user = await UserOperations.GetUser(id);
    if (!user) {
      return next(ApiError.notFound("User is not authorized"));
    }
    const { _id, ...data } = user._doc;
    return res.json({ ...data, id: _id });
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
};
