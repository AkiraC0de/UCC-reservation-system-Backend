const nodemailer = require("nodemailer");

const sendRejectionEmail = async (email, fullname, reason) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"University Reservation System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account Verification Result",
      html: `
        <div style="background: #f5f6fa; padding: 40px; font-family: Arial, Helvetica, sans-serif;">

          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden;">

            <!-- Header -->
            <div style="background: #e74c3c; padding: 18px 30px;">
              <h2 style="margin: 0; color: white; font-size: 22px; text-align: center;">
                Verification Status: <span style="font-weight: bold;">Rejected</span>
              </h2>
            </div>

            <!-- Body -->
            <div style="padding: 30px; color: #2c3e50; line-height: 1.6;">
              <p style="font-size: 16px;">Hi <strong>${fullname}</strong>,</p>

              <p style="font-size: 15px;">
                Thank you for applying to register in the
                <strong>University Equipment Reservation System</strong>.
              </p>

              <p style="font-size: 15px;">
                Unfortunately, after reviewing your submitted details and uploaded ID,  
                your account <strong style="color: #e74c3c;">could not be approved</strong> at this time.
              </p>

              ${
                reason
                  ? `
                <div style="background: #fdecea; padding: 15px; border-radius: 8px; border-left: 5px solid #e74c3c; margin-top: 10px;">
                  <strong style="color: #c0392b;">Reason:</strong>
                  <p style="margin: 5px 0 0;">${reason}</p>
                </div>
                `
                  : ""
              }

              <p style="font-size: 15px; margin-top: 20px;">
                If you believe this is a mistake, you may try signing up again and ensure that the uploaded ID is
                <strong>clear, readable, and valid</strong>.
              </p>

              <br/>

              <p style="font-size: 14px; color: #7f8c8d;">
                Regards, <br />
                <strong>Admin — University Reservation System</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #fafafa; padding: 12px 30px; text-align: center; font-size: 12px; color: #95a5a6;">
              This is an automated email. Please do not reply.
            </div>
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`❌ Rejection email sent to ${email}`);

    return true;

  } catch (error) {
    console.log("❌ Failed to send rejection email:", error.message);
    return false;
  }
};

module.exports = sendRejectionEmail;
