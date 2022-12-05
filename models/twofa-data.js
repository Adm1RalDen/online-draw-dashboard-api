const { Schema, model } = require("mongoose");

const schema = new Schema({
  emailCode: { type: String },
  secretKey: { type: String, required: true },
  attemptsLeftCount: { type: Number, default: 3 },
  failAttemptsCommittedAt: { type: Number, default: 0 },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = model("twofa-data", schema);
