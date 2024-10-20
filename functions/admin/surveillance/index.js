/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const getSurveillanceData = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const { asset = "OML 24", flowstation } = data;
    if (!asset) {
      throw { code: "cancelled", message: "Please provide asset" };
    }

    if (!flowstation) {
      throw { code: "cancelled", message: "Please provide flowstation" };
    }

    const db = admin.firestore();

    const productionData = db
      .collection("actualProduction")
      .where("asset", "==", asset)
      .where("flowstaion", "==", flowstation)
      .orderBy("date", "asc");
    const productionQuery = (await productionData.get()).docs.map(
      (doc) => doc?.data() || {}
    );

    const result = [];

    productionQuery.forEach((dailyData) => {
      let gross = 0;
      let oil = 0;
      let water = 0;
      let gas = 0;
      let date = dailyData?.date;

      const productionStrings = dailyData?.productionData.map((prodData) => {
        // Compute the running sum for the flowstation
        gross += prodData.gross;
        oil += prodData.oil;
        water += prodData.water;
        gas += prodData.gas;

        return {
          ...prodData,
          waterCut: prodData.water / prodData.gross,
          gor: prodData.gas / prodData.oil,
        };
      });

      result.push({
        date,
        flowstationData: {
          gross,
          oil,
          water,
          gas,
          waterCut: water / gross,
          gor: gas / oil,
        },
        productionStrings,
      });
    });

    return { data: JSON.stringify(result) };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

module.exports = {
  getSurveillanceData,
};
