// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (recipient, code) => {
  // Setup mail transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // you can change to Outlook, Yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"University Reservation System" <${process.env.EMAIL_USER}>`,
    to: recipient,
    subject: "Email Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2563eb;">Verify your email address</h2>
        <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>
        <h1 style="background: #2563eb; color: #fff; display: inline-block; padding: 10px 20px; border-radius: 8px;">
          ${code}
        </h1>
        <p style="margin-top: 10px;">This code will expire in 10 minutes.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      </div>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log(`✅ Verification email sent to ${recipient}`);
};

module.exports = { sendVerificationEmail };
