const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_USER,
  SMTP_PORT,
} = require("../const/settings");
const readFile = require("../utils/readFile");
const createPath = require("../utils/createPath");
const formatTimeToUTC = require("../utils/formatTimeToUTC");

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  post: SMTP_PORT,
  service: "gmail",
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

const send2FaCodeOnMail = async (email, code) => {
  const filePath = createPath(["..", "pages", "twoFaCode.html"]);
  const buf = await readFile(filePath, { encoding: "utf-8" });

  if (!buf) {
    throw "Read error";
  }

  const htmlPage = buf.replace(/{CODE}/, code);

  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Your code for enable 2FA",
    text: "",
    html: htmlPage,
  });
};

const sendActivationMail = async (email, link) => {
  const filePath = createPath(["..", "pages", "activationEmail.html"]);
  const buf = await readFile(filePath, { encoding: "utf-8" });

  if (!buf) {
    throw "Read error";
  }

  const htmlPage = buf.replace(/{LINK}/, link).replace(/{EMAIL}/, email);

  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Activation your email in DrawIO",
    text: "",
    html: htmlPage,
  });
};

const sendResetPasswordLinkOnMail = async (email, link) => {
  const filePath = createPath(["..", "pages", "resetPasswordLink.html"]);
  const buf = await readFile(filePath, { encoding: "utf-8" });

  if (!buf) {
    throw "Read error";
  }

  const htmlPage = buf.replace(/{LINK}/, link);

  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Reset password",
    text: "",
    html: htmlPage,
  });
};

const sendNotifyAboutLogin = async (
  email,
  { country_name, city, timezone }
) => {
  const filePath = createPath(["..", "pages", "notifyUserAboutLogin.html"]);
  const buf = await readFile(filePath, { encoding: "utf-8" });

  if (!buf) {
    throw "Read error";
  }

  const htmlPage = buf
    .replace(/{COUNTRY}/, country_name)
    .replace(/{CITY}/, city)
    .replace(/{DATE}/, formatTimeToUTC(new Date(), timezone));

  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Login Draw Online",
    text: "",
    html: htmlPage,
  });
};

module.exports = {
  sendActivationMail,
  send2FaCodeOnMail,
  sendResetPasswordLinkOnMail,
  sendNotifyAboutLogin,
};
