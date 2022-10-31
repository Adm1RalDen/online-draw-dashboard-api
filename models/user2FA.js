const { Schema, model } = require("mongoose");

const User2FASchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  secretKey: { type: String, required: true },
  emailCode: { type: String },
  attemptsLeftCount: { type: Number, default: 3 },
  failAttemptsCommittedAt: { type: Number, default: 0 },
});

module.exports = model("secrets", User2FASchema);
