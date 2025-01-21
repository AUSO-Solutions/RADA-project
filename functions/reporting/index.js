/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const {
  getDatesForCurrentMonth,
  getDatesBetween,
  aggregateDeferment,
} = require("./helper");

const fetchDefermentData = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ---", { data });
    const { asset, flowstation, startDate, endDate } = data;
    if (!asset || !flowstation) {
      throw {
        code: "cancelled",
        message: "Missing required fields",
      };
    }
    console.log({ asset, flowstation, startDate, endDate });

    let dates = [];
    if (!startDate || !endDate) {
      dates = getDatesForCurrentMonth();
    } else {
      dates = getDatesBetween();
    }

    const start = dates[0];
    const end = dates[dates.length - 1];

    const db = admin.firestore();
    const query = db
      .collection("deferments")
      .where("asset", "==", asset)
      .where("flowStation", "==", flowstation)
      .where("date", ">=", start)
      .where("date", "<=", end)
      .orderBy("date");

    const deferments = (await query.get())?.docs.data();
    const result = aggregateDeferment(deferments);
    return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

module.exports = {
  fetchDefermentData,
};
