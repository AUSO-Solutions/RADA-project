/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { generateRandomID } = require("../helpers");
const { computeProdDeduction } = require("./helpers");

const processIPSC = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const { flowStation, date, potentialTestData, asset } = data;
    if (!flowStation || !date || !potentialTestData) {
      throw {
        code: "cancelled",
        message: "Missing required fields",
      };
    }

    // Fetch flowstation volumes for the target date
    const db = admin.firestore();
    // console.log('-----')
    // const liquidVolume_ = (
    //   await db.collection("liquidVolumes").where("date", "==", date).where("asset", "==", asset).get()
    // )
    // console.log(liquidVolume_, '000000-----')
    const liquidVolume = (
      await db
        .collection("liquidVolumes")
        .where("date", "==", date)
        .where("asset", "==", asset)
        .get()
    ).docs.map((doc) => doc.data());

    // console.log(liquidVolume)
    // console.log('--------', liquidVolume.length)
    const flowstationsData = liquidVolume[liquidVolume.length - 1];
    // console.log({ flowstationsData })
    if (!flowstationsData || flowstationsData === null) {
      throw {
        code: "cancelled",
        message: "Missing flowstations data for current date",
      };
    }

    const flowstationData = flowstationsData.data.find(
      (flowstation) => flowstation.name === flowStation
    );

    if (!flowstationData) {
      throw {
        code: "cancelled",
        message: "Missing flowstation data for current date",
      };
    }
    // console.log({ flowstationData })
    const result = computeProdDeduction(
      potentialTestData,
      flowstationData.subtotal
    );
    console.log(result);

    return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

module.exports = {
  processIPSC,
};
