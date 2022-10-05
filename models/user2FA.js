const { Schema, model } = require("mongoose");

const User2FASchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  secretKey: { type: String, required: true },
});

module.exports = model("secrets", User2FASchema);