const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmail = async (email, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      await transporter.sendMail({
        from: email_username,
        to: email,
        subject: subject,
        text: text,
      });
      //console.log("email sent sucessfully");
    } catch (error) {
      console.log("email not sent");
      console.log(error);
    }
  };
  
  module.exports = sendEmail;