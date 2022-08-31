const { Schema, model } = require('mongoose')

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  refreshToken: { type: String,required:true }
})

module.exports = model("token", TokenSchema)