const { Schema, model } = require("mongoose");

const schema = new Schema({
  limit: { type: Number, default: 5 },
  users: { type: [Object], default: [] },
  owner: { type: String, required: true },
  status: { type: Boolean, default: true },
  isShow: { type: Boolean, default: true },
  roomName: { type: String, required: true },
  roomImages: { type: [String], default: [] },
  roomPassword: { type: String, default: "" }
})

module.exports = model("rooms", schema);