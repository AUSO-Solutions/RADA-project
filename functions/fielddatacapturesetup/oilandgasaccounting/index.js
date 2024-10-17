/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { generateRandomID } = require("../helpers");
const { computeProdDeduction } = require("./helpers");
const { generateRandomID } = require("../../helpers");
// const { generateRandomID } = require("../helpers");

const processIPSC = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const { flowStation, date, potentialTestData, asset, type = 'calculate' } = data;
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


    const gasVolume = (
      await db
        .collection("gasVolumes")
        .where("date", "==", date)
        .where("asset", "==", asset)
        .get()
    ).docs.map((doc) => doc.data());

    const flowstationsData = liquidVolume[0];
    const flowstationsDataGas = gasVolume[0];
    if (!flowstationsData || flowstationsData === null) {
      throw {
        code: "cancelled",
        message: "No volume capture for oil this flowstation on this day",
      };
    }
    if (!flowstationsDataGas || flowstationsDataGas === null) {
      throw {
        code: "cancelled",
        message: "No volume capture for gas this flowstation on this day",
      };
    }
    const flowstationData = flowstationsData.flowstations.find(
      (flowstation) => flowstation.name === flowStation
    );
    const flowstationDataGas = flowstationsDataGas.flowstations.find(
      (flowstation) => flowstation.name === flowStation
    );

    if (!flowstationData) {
      throw {
        code: "cancelled",
        message: "Missing flowstation oil data for current date",
      };
    }
    if (!flowstationDataGas) {
      throw {
        code: "cancelled",
        message: "Missing flowstation gas data for current date",
      };
    }
    const subtotal = {
      ...flowstationData?.subtotal,
      gas: flowstationDataGas?.subtotal?.totalGas
    }
    // console.log({ flowstationData })
    const result = computeProdDeduction(
      potentialTestData,
      subtotal
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
    console.log(type)
    if (type === 'save') {
      const quer = db.collection("deferments").where('date', "==", date).where('asset', '==', asset).where('flowStation', '==', flowStation)
      const prev = (await quer.get()).docs[0]
      const exists = prev?.exists
      console.log("-------", exists, prev?.data())
      if (exists) await db.collection("deferments").doc(prev.id).set({ ...defermentData, id: prev?.id });
      if (!exists) await db.collection("deferments").doc(defermentId).set({ ...defermentData });
    }

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
    if (type === 'save') {
      const quer = db.collection("actualProduction").where('date', "==", date).where('asset', '==', asset).where('flowStation', '==', flowStation)
      const prev = (await quer.get())?.docs[0]
      const exists = prev?.exists
      console.log("-------", exists, prev?.data())
      if (exists) await db.collection("actualProduction").doc(prev.id).set({ ...actualProductionData, id: prev?.id });
      if (!exists) await db.collection("actualProduction").doc(actualProductionId).set({ ...actualProductionData });
    }

    return { status: "success", data: JSON.stringify(result) };
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});


const getOilAndGasAccounting = onCall(async (request) => {
  const { date, asset, flowStation } = request.data;

  try {
    console.log({ date, asset, flowStation })
    const db = admin.firestore();



    const querB = db.collection("deferments").where('date', "==", date).where('asset', '==', asset).where('flowStation', '==', flowStation)
    const deferment = (await querB.get())?.docs[0]?.data()


    const querA = db.collection("actualProduction").where('date', "==", date).where('asset', '==', asset).where('flowStation', '==', flowStation)
    const actualProduction = (await querA.get())?.docs[0]?.data()


    if (!actualProduction) {
      throw ({ code: "not-found", message: "Record not found" });
    }
    const record = {
      deferment, actualProduction
    }
    return { status: "success", data: JSON.stringify(record) };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});
module.exports = {
  processIPSC, getOilAndGasAccounting
};
