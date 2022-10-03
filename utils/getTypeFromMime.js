const getTypeFromMime = (str) => {
  const sub = str.match(/\/\w+/)[0];
  if (sub) {
    return sub.replace(/\//, "");
  }
  return null;
};
module.exports = { getTypeFromMime };
