const https = require("https");

const checkCaptcha = async (captcha) => {
  const options = {
    hostname: "www.google.com",
    path: `/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captcha}`,
    method: "POST",
    headers: "Set-Cookie: cross-site-cookie=whatever; SameSite=None; Secure"
  };

  const isValidCaptcha = await new Promise((res, rej) => {
    const req = https.request(options, function (resp) {
      let body = "";

      resp.on("data", function (data) {
        body += data;
      });

      resp.on("end", function () {
        const data = JSON.parse(body);
        res(data);
      });

      resp.on("error", () => {
        rej(null);
      });
    });

    req.end();
  });

  
  if (!isValidCaptcha?.success || isValidCaptcha?.score < 0.5) {
    return null
  }

  return isValidCaptcha;
};

module.exports = checkCaptcha;
