/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const { HttpsError } = require("firebase-functions/v2/https");
const {
  getDatesBetween,
  aggregateDeferment,
  getStartOfMonth,
  aggregateOperationsData,
} = require("../reporting/helper");
const dayjs = require("dayjs");

const getOperationsReportData = async (asset, date) => {
  try {
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

    return result;
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
};

const getDefermentReportData = async (asset, startDate, endDate) => {
  try {
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
      .where("date", "<=", end)
      .orderBy("date");

    const deferments = (await query.get())?.docs.map(
      (doc) => doc?.data() || {}
    );

    const liquidVolumes = (
      await db
        .collection("liquidVolumes")
        .where("asset", "==", asset)
        .where("date", ">=", start)
        .where("date", "<=", end)
        .orderBy("date")
        .get()
    ).docs.map((doc) => doc.data());

    const gasVolumes = (
      await db
        .collection("gasVolumes")
        .where("asset", "==", asset)
        .where("date", ">=", start)
        .where("date", "<=", end)
        .orderBy("date")
        .get()
    ).docs.map((doc) => doc.data());

    const result = aggregateDeferment(deferments, liquidVolumes, gasVolumes);

    return result;
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
};

const getAssets = async () => {
  try {
    const db = admin.firestore();
    const docs = (await db.collectionGroup("assetList").get()).docs;

    const assets = docs.map((doc) => doc.data()).map((item) => item?.assetName);
    return assets;
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
};

module.exports = {
  getOperationsReportData,
  getDefermentReportData,
  getAssets,
};
