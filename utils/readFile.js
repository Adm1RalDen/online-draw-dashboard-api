const fs = require("fs/promises");

const readFile = async (path, encoding = {}) => {
  try {
    const res = await fs.readFile(path, encoding);
    return res;
  } catch (e) {
    return null;
  }
};

module.exports = readFile;
