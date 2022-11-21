const path = require("path");

const createPath = (array) => path.resolve(process.cwd(), ...array);

module.exports = createPath;
