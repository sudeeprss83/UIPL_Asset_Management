const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.sendMailToUser = function (options) {
  const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD,
    },
  });



  transporter.sendMail(options, (err, data) => {
    if (err) {
      console.log("error occured", err);
    } else {
      console.log("mail sent to the user");
    }
  });
};
