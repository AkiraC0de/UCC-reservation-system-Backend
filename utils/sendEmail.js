// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // 1. Configure transporter (using Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // your gmail app password
      },
    });

    // 2. Create email options
    const mailOptions = {
      from: `"Reservation System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent, 
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
  }
}



module.exports = sendEmail;
