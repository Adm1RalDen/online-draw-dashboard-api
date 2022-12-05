const { Schema, model } = require('mongoose')

const schema = new Schema({
  refreshToken: { type: String,required:true },
  user: { type: Schema.Types.ObjectId, ref: "users" }
})

module.exports = model("tokens", schema)