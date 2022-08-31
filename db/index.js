const mongoose = require("mongoose");
const { DB_PROJECT } = require("../const/settings");

const setDB = async () => {
  await mongoose.connect(DB_PROJECT);
  console.log("DB success");
};

module.exports = setDB;
