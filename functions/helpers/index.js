const dayjs = require("dayjs");
const crypto = require("crypto");

exports.currentTime = {
  pretty: dayjs().format("MMM DD, YYYY. hh:mmA"),
  time: Date.now(),
};

export const generateRandomID = (len = 8) => {
  return crypto.randomBytes(len).toString("hex");
};
