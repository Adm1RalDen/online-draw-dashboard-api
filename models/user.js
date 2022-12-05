const { model, Schema } = require("mongoose");

const schema = new Schema({
  city: { type: String, default: "" },
  date: { type: String, default: "" },
  color: { type: String, default: "" },
  gender: { type: String, default: "" },
  country: { type: String, default: "" },
  rooms: { type: [String], default: [] },
  biography: { type: String, default: "" },
  limitRooms: { type: Number, default: 5 },
  isUse2FA: { type: Boolean, default: false },
  isActivated: { type: Boolean, default: false },
  isUserInRoom: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: "/users/defaultUserImage.png" },
  backgroundFon: { type: String, default: "/users/defaultUserFon.jpg" },
  originalAvatar: { type: String, default: "/users/defaultUserImage.png" },
});

module.exports = model("users", schema);
