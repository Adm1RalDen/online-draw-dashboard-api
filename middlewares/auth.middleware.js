const jwt = require("jsonwebtoken");
const ApiError = require("../error/errorClass");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; //Bearer token
    if (!token) {
      throw "Error";
    }
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;
    next();
  } catch (e) {
    next(ApiError.notAuthorized("User is not authorized"));
  }
};
