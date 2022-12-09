const { Schema, model } = require("mongoose");

const schema = new Schema({
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true })

module.exports = model("chat-messages", schema)