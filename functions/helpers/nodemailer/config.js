const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PWD_IS,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

export async function sendEmail(recipient, body, subject) {
  try {
    await transporter.sendMail({
      to: recipient,
      from: `"RADA Notification" <notification@rada.com>`,
      html: body,
      subject,
    });
    return true;
  } catch (e) {
    return false;
  }
}

export const generateEmail = async (data, templateName) => {
  let templateContent = fs
    .readFileSync(path.resolve("./templates/", templateName))
    .toLocaleString();
  for (let key in data) {
    templateContent = templateContent.replace("{" + key + "}", data[key]);
  }
  return templateContent;
};
