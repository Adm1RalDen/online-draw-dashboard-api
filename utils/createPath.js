const path = require("path");

const createPath = (array) => path.resolve(__dirname, ...array);

module.exports = createPath;
