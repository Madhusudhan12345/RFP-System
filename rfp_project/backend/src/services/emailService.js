const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

async function sendRfpEmail(to, subject, html, attachments = []) {
  const info = await transport.sendMail({ from: process.env.FROM_EMAIL, to, subject, html, attachments });
  return info;
}

module.exports = { sendRfpEmail };
