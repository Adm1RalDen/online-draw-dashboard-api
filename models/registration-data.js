const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true },
  expiresAt: { type: String, required: true },
  activationLink: { type: String, required: true }
})

module.exports = model("registration-data", schema);