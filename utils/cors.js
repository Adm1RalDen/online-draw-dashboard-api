const cors = require("cors");

const SetCors = () => cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
})

module.exports = { SetCors }