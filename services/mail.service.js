const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PASSWORD, SMTP_USER, SMTP_PORT } = require("../const/settings");

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

const sendActivationMail = async (email, link) => {
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Activation your email in DrawIO",
    text: "",
    html: `
    <div>
      <h1> 
        For activation click on the link
        <a href=${link}>${link}</a>
      </h1>
    </div>
    `,
  });
};

module.exports = { sendActivationMail };
