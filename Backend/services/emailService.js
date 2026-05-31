// services/emailService.js
// ─────────────────────────────────────────────
// The "service" layer handles business logic that doesn't
// belong in a controller. Email sending is a good example.
//
// Separation of concerns: controllers handle HTTP,
// services handle business operations.
// ─────────────────────────────────────────────

const transporter = require("../config/email");

/**
 * Sends an OTP email to the user.
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - The 6-digit OTP to send
 * @param {string} userName - User's name for personalization
 */
const sendOTPEmail = async (toEmail, otp, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "🔐 Your Password Reset OTP - Expense Tracker",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 30px;">
          <h2 style="color: #6366f1;">Expense Tracker</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>You requested to reset your password. Use the OTP below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="
              font-size: 36px; 
              font-weight: bold; 
              letter-spacing: 8px; 
              color: #6366f1;
              background: #f0f0ff;
              padding: 15px 25px;
              border-radius: 8px;
              display: inline-block;
            ">${otp}</span>
          </div>
          
          <p>⏰ This OTP is valid for <strong>${process.env.OTP_EXPIRES_IN_MINUTES || 10} minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">© 2024 Expense Tracker. Do not share this OTP with anyone.</p>
        </div>
      </body>
      </html>
    `,
  };

  // sendMail returns info about the sent email
  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 OTP email sent to ${toEmail}: ${info.messageId}`);
  return info;
};

module.exports = { sendOTPEmail };
