/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const {
  getDatesBetween,
  aggregateDeferment,
  aggregateActualProduction,
  getStartOfMonth,
  aggregateOperationsData,
} = require("./helper");
const dayjs = require("dayjs");

const getDefermentData = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ---", { data });
    const { asset, flowstation, startDate = dayjs(), endDate = dayjs() } = data;
    if (!asset) {
      throw {
        code: "cancelled",
        message: `Please provide an Asset name`,
      };
    }

    if (!startDate || !endDate)
      throw { code: "cancelled", message: "Please provide start or end dates" };
    if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid())
      throw { code: "cancelled", message: "Invalid start or end dates" };

    const startDate_ = dayjs(startDate).format("YYYY-MM-DD");
    const endDate_ = dayjs(endDate).format("YYYY-MM-DD");

    let dates = getDatesBetween(startDate_, endDate_);

    const start = dayjs(dates[0]).format("YYYY-MM-DD");
    const end = dayjs(dates[dates.length - 1]).format("YYYY-MM-DD");

    const db = admin.firestore();
    let query = db
      .collection("deferments")
      .where("asset", "==", asset)
      .where("date", ">=", start)
      .where("date", "<=", end);
    if (flowstation && flowstation !== "All") {
      query = query.where("flowStation", "==", flowstation);
    }
    query = query.orderBy("date");

    const deferments = (await query.get())?.docs.map(
      (doc) => doc?.data() || {}
    );
    const result = aggregateDeferment(deferments);
    return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

const getReconciledProductionData = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ---", { data });
    const { asset, flowstation, startDate = dayjs(), endDate = dayjs() } = data;
    if (!asset) {
      throw {
        code: "cancelled",
        message: `Please provide an Asset name`,
      };
    }

    if (!startDate || !endDate)
      throw { code: "cancelled", message: "Please provide start or end dates" };
    if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid())
      throw { code: "cancelled", message: "Invalid start or end dates" };

    const startDate_ = dayjs(startDate).format("YYYY-MM-DD");
    const endDate_ = dayjs(endDate).format("YYYY-MM-DD");

    let dates = getDatesBetween(startDate_, endDate_);

    const start = dayjs(dates[0]).format("YYYY-MM-DD");
    const end = dayjs(dates[dates.length - 1]).format("YYYY-MM-DD");

    const db = admin.firestore();
    let query = db
      .collection("actualProduction")
      .where("asset", "==", asset)
      .where("date", ">=", start)
      .where("date", "<=", end);
    if (flowstation && flowstation !== "All") {
      query = query.where("flowStation", "==", flowstation);
    }
    query = query.orderBy("date");

    const production = (await query.get())?.docs.map(
      (doc) => doc?.data() || {}
    );
    const result = aggregateActualProduction(production);
    return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

const getOperationsData = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ---", { data });
    const { asset, date = dayjs() } = data;
    if (!asset) {
      throw {
        code: "cancelled",
        message: `Please provide an Asset name`,
      };
    }

    if (!date) {
      throw {
        code: "cancelled",
        message: `Please provide a valid date`,
      };
    }

    const date_ = dayjs(date).format("YYYY-MM-DD");
    const start = dayjs(getStartOfMonth(date_)).format("YYYY-MM-DD");
    console.log({ start: start, end: date_ });

    const db = admin.firestore();
    const liquidVolumes = (
      await db
        .collection("liquidVolumes")
        .where("asset", "==", asset)
        .where("date", ">=", start)
        .where("date", "<=", date_)
        .orderBy("date")
        .get()
    ).docs.map((doc) => doc.data());

    const gasVolumes = (
      await db
        .collection("gasVolumes")
        .where("asset", "==", asset)
        .where("date", ">=", start)
        .where("date", "<=", date_)
        .orderBy("date")
        .get()
    ).docs.map((doc) => doc.data());

    const production = (
      await db
        .collection("actualProduction")
        .where("asset", "==", asset)
        .where("date", "==", date_)
        .get()
    ).docs.map((doc) => doc.data());

    const result = aggregateOperationsData(
      liquidVolumes,
      gasVolumes,
      production
    );

    return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

module.exports = {
  getDefermentData,
  getReconciledProductionData,
  getOperationsData,
};
