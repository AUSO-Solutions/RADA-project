const nodemailer = require("nodemailer")
const dayjs = require("dayjs");
const crypto = require("crypto");
exports.currentTime = {
  pretty: dayjs().format("MMM DD, YYYY. hh:mmA"),
  time: Date.now(),
};

exports.generateRandomID = (len = 8) => {
  return crypto.randomBytes(len).toString("hex");
};

exports.frontendUrl = 'https://ped-application-4d196.web.app'
exports.sender = 'kehindesalaudeen222@gmail.com'
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kehindesalaudeen222@gmail.com',
    pass: 'nffa llda lyrf jzle'
  }
});