const moment = require("moment-timezone");

const formatTimeToUTC = (date, timeZone) => {
  const time = moment(date).tz(timeZone).format("MMM dd yyyy HH:mm:ss")
  return time.toLocaleString()
}

module.exports = formatTimeToUTC;
