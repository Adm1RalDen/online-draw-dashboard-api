const nodemailer = require("nodemailer");
const {
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_USER,
  SMTP_PORT,
} = require("../const/settings");

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
    <div style="font-family:Roboto">
      <div style="height: 50px; background-color: #183333; color: #fff; padding: 10px;border-top-left-radius: 5px;border-top-right-radius: 5px;">      
        <h1 style="margin:0px;">Draw Online</h1>
      </div>
      <div style="height:200px;border:2px solid #d7d7d7;border-radius: 5px; overflow:hidden; border-top-left-radius: 0px;border-top-right-radius: 0px;border-top:0px; padding: 10px">
       <p style="font-size:18px; line-height: 28px;">We are glad to welcome you to our drawing site</br>
         You have registered through our website</br>
         Your data for authorization on the site</br>
         login </br>
         follow the link to confirm <a href=${link}>link</a></br>
       </p>
      </div>
     </div>
    `,
  });
};

module.exports = { sendActivationMail };
