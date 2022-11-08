const { Schema, model } = require("mongoose");

const ResetPassword = Schema({
  userId: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: String, required: true },
  expiresAt: { type: String, required: true },
})

module.exports = model("reset-passwords", ResetPassword);