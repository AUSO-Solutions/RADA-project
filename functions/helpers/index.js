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
exports.sender = 'rada.apps@newcross.com'
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rada.apps@newcross.com',
    pass:'newcross2024#'
    // pass: 'nffa llda lyrf jzle'
  }
});


