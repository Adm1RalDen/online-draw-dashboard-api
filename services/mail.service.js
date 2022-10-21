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

const send2FaCodeOnMail = async (email, code) => {
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Your code for enable 2FA",
    text: "",
    html: `
    <div style="font-family:Roboto">
      <div style="background-color: #183333; color: #ffffff; padding: 10px;border-top-left-radius: 5px;border-top-right-radius: 5px;">      
        <h1 style="margin:0px; color: #fff;">Draw Online</h1>
      </div>
      <div style="height:50px;border:2px solid #d7d7d7;border-radius: 5px; overflow:hidden; border-top-left-radius: 0px;border-top-right-radius: 0px;border-top:0px; padding: 10px">
      <h2> Your code: <mark>${code}</mark> </h2>
      </div>
     </div>
    `,
  });
};

const sendActivationMail = async (email, link) => {
  await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Activation your email in DrawIO",
    text: "",
    html: `
    <div style="font-family:Roboto">
      <div style="background-color: #183333; color: #ffffff; padding: 10px;border-top-left-radius: 5px;border-top-right-radius: 5px;">      
        <h1 style="margin:0px; color: #fff;">Draw Online</h1>
      </div>
      <div style="height:200px;border:2px solid #d7d7d7;border-radius: 5px; overflow:hidden; border-top-left-radius: 0px;border-top-right-radius: 0px;border-top:0px; padding: 10px">
       <p style="font-size:18px; line-height: 28px; font-weight: 300">We are glad to welcome you to our drawing site<br>
         You have registered through our website<br>
         Your data for authorization on the site<br>
         login <span style="color:#107bff">${email}</span><br>
         Follow the link to confirm your account <a href=${link} target='_blank' title='Go to DrawOnline website'>link</a><br>
       </p>
      </div>
     </div>
    `,
  });
};

module.exports = { sendActivationMail, send2FaCodeOnMail };
