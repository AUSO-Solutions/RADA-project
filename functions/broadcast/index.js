/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { generateRandomID } = require("../helpers");
const { computeProdDeduction } = require("./helpers");

const broadcast = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const { attachment, groups } = data;
   

    // return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    console.log({error})
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

module.exports = {
  broadcast,
};
