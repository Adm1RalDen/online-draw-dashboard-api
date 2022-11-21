const fs = require("fs/promises")

const deleteFile = (path) => fs.unlink(path);

module.exports = deleteFile;
