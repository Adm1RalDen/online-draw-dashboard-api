const nodemailer = require("nodemailer");

const {
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_USER,
  SMTP_PORT,
} = require("../const/settings");
const readFile = require("../utils/readFile");
const createPath = require("../utils/createPath");

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

module.exports = { sendActivationMail, send2FaCodeOnMail };
