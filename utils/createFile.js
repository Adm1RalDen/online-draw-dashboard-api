const fs = require('fs/promises');

const createFile = (path, file) => fs.writeFile(path, file)

module.exports = createFile