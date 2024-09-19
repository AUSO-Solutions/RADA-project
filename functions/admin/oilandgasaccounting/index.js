const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { generateRandomID } = require("../helpers");
const { computeProdDeduction } = require("./helpers");

const processIPSC = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const { flowStation, date, potentialTestData } = data;
    if (!flowStation || !date || !potentialTestData) {
      throw new Error({
        code: "cancelled",
        message: "Missing required fields",
      });
    }

    // Fetch flowstation volumes for the target date
    const db = admin.firestore();

    const flowstationsData = (
      await db.collections("liquidVolumes").where("date", "==", date).get()
    ).data();
    if (!flowstationsData || flowstationsData === null) {
      throw new Error({
        code: "cancelled",
        message: "Missing flowstations data for current date",
      });
    }

    const flowstationData = flowstationsData.find(
      (flowstation) => flowstation.name === flowStation
    );

    if (!flowstationData) {
      throw new Error({
        code: "cancelled",
        message: "Missing flowstation data for current date",
      });
    }

    const { actualProduction, deferment } = computeProdDeduction(
      potentialTestData,
      flowstationData.subtotal
    );

    return { status: "success", data: { actualProduction, deferment } };
  } catch (error) {
    logger.log("error ===> ", { error });
    throw new HttpsError(error?.code, error?.message);
  }
});

module.exports = {
  processIPSC,
};
