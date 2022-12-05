const https = require("https");

const getUserGeolocation = async (ip) => {
  try {
    const options = {
      path: `/${ip}/json/`,
      host: "ipapi.co",
      port: 443,
      headers: { "User-Agent": "nodejs-ipapi-v1.02" },
    };

    const res = await new Promise((res) => {
      https.get(options, (resp) => {
        let body = "";

        resp.on("data", (data) => {
          body += data;
        });

        resp.on("end", () => {
          let location = JSON.parse(body);
          res(location);
        });

        resp.on("error", () => {
          res(null);
        });
      });
    });

    if (res?.error) {
      return null;
    }

    return res;
  } catch {
    return null;
  }
};

module.exports = getUserGeolocation;
