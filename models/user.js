const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, minlength: 2 },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, unique: true },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  color: { type: String, default: "" },
  gender: { type: String, default: "" },
  date: { type: String, default: "" },
  biography: { type: String, default: "" },
  limitRooms: { type: Number, default: 5 },
  rooms: { type: [String], default: [] },
  isUserInRoom: { type: Boolean, default: false },
  isUse2FA: { type: Boolean, default: false },
  originalAvatar: { type: String, required: true },
  avatar: { type: String, required: true },
  backgroundFon: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
});

module.exports = model("users", userSchema);
