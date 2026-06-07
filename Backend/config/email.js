// config/email.js
// ─────────────────────────────────────────────
// Configures Nodemailer transporter.
// A "transporter" is the object that knows HOW
// to send emails (via which SMTP server, with
// which credentials).
// ─────────────────────────────────────────────

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // e.g. smtp.gmail.com
  port: process.env.EMAIL_PORT,       // 587 for TLS
  secure: parseInt(process.env.EMAIL_PORT) === 443 || 
        parseInt(process.env.EMAIL_PORT) === 465,                      
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,     // Gmail App Password (not your real password)
  },
});

module.exports = transporter;
