const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: String, required: true },
})

module.exports = model("chats", messageSchema);