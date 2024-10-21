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

    // if (!flowstation) {
    //   throw { code: "cancelled", message: "Please provide flowstation" };
    // }

    const db = admin.firestore();

    let productionData = db
      .collection("actualProduction")
      .orderBy("date", "asc")
      .where("asset", "==", asset)

    if (flowstation) {
      productionData = db
        .collection("actualProduction")
        .orderBy("date", "asc")
        .where("asset", "==", asset)
        .where("flowStation", "==", flowstation)
    }

    const productionQuery = (await productionData.get()).docs.map(
      (doc) => doc?.data() || {}
    );
    console.log('----', productionQuery)
    const productionStrings = {};
    const flowStationData = [];

    productionQuery.forEach((dailyData) => {
      let gross = 0;
      let oil = 0;
      let water = 0;
      let gas = 0;
      let date = dailyData?.date;

      dailyData?.productionData?.forEach((prodData) => {
        // Compute the running sum for the flowstation
        gross += prodData.gross;
        oil += prodData.oil;
        water += prodData.water;
        gas += prodData.gas;

        const stringData = {
          date,
          ...prodData,
          waterCut: prodData.water / prodData.gross,
          gor: prodData.gas / prodData.oil,
        };

        if (prodData.productionString in productionStrings) {
          productionStrings[prodData.productionString].push(stringData);
        } else {
          productionStrings[prodData.productionString] = [stringData];
        }
      });

      flowStationData.push({
        date,
        gross,
        oil,
        water,
        gas,
        waterCut: water / gross,
        gor: gas / oil,
      });
    });

    const result = { flowStationData, productionStrings };

    return { data: JSON.stringify(result) };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

module.exports = {
  getSurveillanceData,
};
