const generateStrOfNumbers = (length) => {
  let code = [];

  for (let i = 0; i < length; i++) {
    code.push(Math.floor(Math.random() * 10));
  }

  return code.join('');
};

module.exports = { generateStrOfNumbers };
