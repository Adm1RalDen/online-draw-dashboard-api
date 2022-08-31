const { Schema, model } = require("mongoose");

const Room = Schema({
  roomName: { type: String, required: true },
  roomPassword: { type: String, default: "" },
  users: { type: [Object], default: [] },
  status: { type: Boolean, default: true },
  owner: { type: String, required: true },
  isShow: { type: Boolean, default: true },
  limit: { type: Number, default: 5 },
  roomImages: { type: [String], default: [] }
})

module.exports = model("rooms", Room);