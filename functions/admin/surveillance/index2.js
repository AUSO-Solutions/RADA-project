/* eslint-disable no-throw-literal */
const dayjs = require("dayjs");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const getSurveillanceData = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const { asset = "", flowstation } = data;
    // if (!asset) {
    //   throw { code: "cancelled", message: "Please provide asset" };
    // }

    // if (!flowstation) {
    //   throw { code: "cancelled", message: "Please provide flowstation" };
    // }

    const db = admin.firestore();

    let productionData = db
      .collection("actualProduction")
      .orderBy("date", "asc")

    if (asset) productionData = productionData.where("asset", "==", asset)
    if (asset && flowstation) productionData = productionData.where("flowStation", "==", flowstation)

    const productionQuery = (await productionData.get()).docs.map(
      (doc) => doc?.data() || {}
    );

    // console.log('----', productionQuery)
    const IPSCs = (await db.collection('setups').doc('IPSC').collection('setupList').where("asset", "==", asset).get())?.docs?.map(doc => doc?.data())
    console.log(IPSCs)
    const productionStrings = {};
    const flowStationData = [];

    const flowstations = Array.from(new Set(productionQuery.map(item => item?.flowStation)))
    productionQuery.forEach((dailyData) => {
      let gross = 0;
      let oil = 0;
      let water = 0;
      let gas = 0;
      let date = dailyData?.date;
      let fthp = 0;
      let chokeSize = 0;

      dailyData?.productionData?.forEach((prodData) => {
        // Compute the running sum for the flowstation

        gross += prodData.gross;
        oil += prodData.oil;
        water += prodData.water;
        gas += prodData.gas;
        fthp = IPSCs?.find(IPSC => IPSC?.month === dayjs(date).format('YYYY-MM'))?.wellTestResultData?.[prodData.productionString]?.fthp || 0
        chokeSize = IPSCs?.find(IPSC => IPSC?.month === dayjs(date).format('YYYY-MM'))?.wellTestResultData?.[prodData.productionString]?.chokeSize || 0

        const stringData = {
          date,
          ...prodData,
          waterCut: (prodData.water / prodData.gross) * 100,
          gor: (prodData.gas * 1000000) / prodData.oil,
          fthp, chokeSize
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
        waterCut: (water / gross) * 100,
        gor: (gas * 1000000) / oil,
      });
    });

    // console.log(productionStrings)
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
