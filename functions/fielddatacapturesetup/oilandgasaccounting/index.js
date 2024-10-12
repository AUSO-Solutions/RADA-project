/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { generateRandomID } = require("../helpers");
const { computeProdDeduction } = require("./helpers");
const { generateRandomID } = require("../helpers");

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

    const db = admin.firestore();

    const liquidVolume = (
      await db
        .collection("liquidVolumes")
        .where("date", "==", date)
        .where("asset", "==", asset)
        .get()
    ).docs.map((doc) => doc.data());

    const flowstationsData = liquidVolume[liquidVolume.length - 1];
    // console.log({ flowstationsData })
    if (!flowstationsData || flowstationsData === null) {
      throw {
        code: "cancelled",
        message: "Missing flowstations data for current date",
      };
    }

    const flowstationData = flowstationsData.flowstations.find(
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

    // Persit deferment data for the flowstation
    const defermentId = generateRandomID();
    const defermentData = {
      id: defermentId,
      asset,
      date,
      flowStation,
      deferment: result.deferment,
    };
    await db.collection("deferments").doc(defermentId).set(defermentData);

    // Persist actual production data
    // let batch = db.batch()

    // result.actualProduction.forEach((doc) => {
    //   var docRef = db.collection("actualProduction").doc(); //automatically generate unique id
    //   batch.set(docRef, doc)
    // })
    // await batch.commit()

    const actualProductionId = generateRandomID();
    const actualProductionData = {
      id: actualProductionId,
      asset,
      date,
      flowStation,
      productionData: result.actualProduction,
    };
    await db
      .collection("actualProduction")
      .doc(actualProductionId)
      .set(actualProductionData);

    return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

module.exports = {
  processIPSC,
};
