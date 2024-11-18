const nodemailer = require("nodemailer")
const dayjs = require("dayjs");
const crypto = require("crypto");
const sgMail = require('@sendgrid/mail');

const functions = require('firebase-functions');

exports.currentTime = {
  pretty: dayjs().format("MMM DD, YYYY. hh:mmA"),
  time: Date.now(),
};

exports.generateRandomID = (len = 8) => {
  return crypto.randomBytes(len).toString("hex");
};
exports.sendgridApiKey =
exports.frontendUrl = 'https://ped-application-4d196.web.app'
exports.appLogo = 'https://firebasestorage.googleapis.com/v0/b/ped-application-4d196.appspot.com/o/radaNewLogoo.svg?alt=media&token=475ebfb1-9f96-4b2d-b7f0-12390171a515'
exports.sender = 'rada.apps@gmail.com'
// exports.sender = 'rada.apps@newcross.com'
exports.supportEmail = 'rada.apps@newcross.com'
exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rada.apps@gmail.com',
    // pass:'newcross2024#'
    pass:'fyee kpsz vhnn esup'
    // pass: 'nffa llda lyrf jzle',
  }
});
// exports.transporter = () => {
//   sgMail.setApiKey(functions.config().NODE_SG_API_KEY);
//   return sgMail
// }

