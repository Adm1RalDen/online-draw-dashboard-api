const ApiError = require("../error/errorClass");

function ErrorHandler(err, req, res, next) {
  console.log('Error', err)

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Server errror" });
}


module.exports = ErrorHandler;
