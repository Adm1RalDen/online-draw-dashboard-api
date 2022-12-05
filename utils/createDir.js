const fs = require("fs/promises");

const createDir = async (path) => {
  try {
    await fs.mkdir(path);
  } catch (e) {
    throw e;
  }
};

module.exports = createDir;
