const { Schema, model } = require("mongoose");

const schema = new Schema({
  link: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: String, required: true },
  expiresAt: { type: String, required: true },
})

module.exports = model("reset-password-data", schema);