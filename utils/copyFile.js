const fs = require('fs/promises');

const copyFile = (path, destination) => fs.copyFile(path, destination);

module.exports = copyFile