/* eslint-disable no-unused-vars */
/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
// const { generateRandomID } = require("../../helpers");

const {
  validateGasFlowstationData,
  validateLiquidFlowstationData,
} = require("./helpers");
const { generateRandomID } = require("../helpers");

const captureOilOrCondensate = onCall(async (request) => {
  try {
    let { data } = request;
    logger.log("data ----", { data });
    const { date, asset, flowstations, fluidType } = data;
    if (!date || !asset || !flowstations) {
      throw {
        code: "cancelled",
        message: "Missing required fields",
      };
    }

    validateLiquidFlowstationData(flowstations);

    const id = generateRandomID();
    const dbData = {
      id,
      date,
      asset,
      fluidType,
      data: flowstations,
    };
    const db = admin.firestore();
    await db.collection("liquidVolumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const updateOilOrCondensate = onCall(async (request) => {
  try {
    let { data } = request;
    logger.log("data ----", { data });
    const { id, date, asset, flowstations } = data;
    if (!id || !date || !asset || !flowstations) {
      throw new Error({
        code: "cancelled",
        message: "Missing required fields",
      });
    }

    // Check out that the record exists
    const db = admin.firestore();
    const record = await db.collection("liquidVolumes").doc(id).get();
    if (!record.exists) {
      throw new Error({ code: "not-found", message: "Record not found" });
    }

    validateLiquidFlowstationData(flowstations);

    const dbData = {
      date,
      asset,
      fluidType: "oilOrCondensate",
      data: flowstations,
    };

    await db.collection("volumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const getOilOrCondensateVolumeByID = onCall(async (request) => {
  const { id } = request;

  try {
    const db = admin.firestore();
    const record = await db.collection("liquidVolumes").doc(id).get();
    if (!record.exists) {
      throw new Error({ code: "not-found", message: "Record not found" });
    }

    return { status: "success", data: record };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const getOilOrCondensateVolumesByAsset = onCall(async (request) => {
  const { assetName } = request;

  try {
    const db = admin.firestore();
    const records = await db
      .collection("liquidVolumes")
      .where("name", "==", assetName)
      .get()
      .docs();

    return { status: "success", data: records.map((doc) => doc.data()) };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const deleteOilOrCondensateVolumeByID = onCall(async (request) => {
  try {
    const { data } = request;
    const { id } = data;
    if (!id) {
      throw new Error({
        code: "cancelled",
        message: "Missing volume Id",
      });
    }
    const db = admin.firestore();
    await db.collection("liquidVolumes").doc(id).delete();
    return { status: "success", message: "Volume deleted successfully" };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const captureGas = onCall(async (request) => {
  // TODO: Refactor for Gas Capture
  try {
    let { data } = request;
    logger.log("data ----", { data });
    const { date, asset, flowstations } = data;
    if (!date || !asset || !flowstations) {
      throw new Error({
        code: "cancelled",
        message: "Missing required fields",
      });
    }

    // validateGasFlowstationData(flowstations);

    const id = generateRandomID();
    const dbData = {
      date,
      asset,
      fluidType: "gas",
      data: flowstations,
    };
    const db = admin.firestore();
    await db.collection("gasVolumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

// Just a guide
// const demo = {
//   date: "12/12/2024",
//   asset: "OML 99",
//   flowstations: [
//     {
//       name: "Flowstation 1",
//       reportType: "gross",
//       measurementType: "metering",
//       subtotal: {
//         gross: 1500,
//         bsw: 50,
//         netProduction: 750,
//         netTarget: 750,
//       },
//       meters: [
//         {
//           serialNumber: "SN-001",
//           meterFactor: 1,
//           initialReading: 1000,
//           finalReading: 1500,
//           gross: 500,
//           bsw: 50,
//           netProduction: 250,
//           netTarget: 250,
//         },
//         {
//           serialNumber: "SN-002",
//           meterFactor: 0.98,
//           initialReading: 1500,
//           finalReading: 2500,
//           gross: 1000,
//           bsw: 50,
//           netProduction: 500,
//           netTarget: 250,
//         },
//       ],
//     },
//     {
//       name: "Flowstation 2",
//       reportType: "netOilOrCondensate",
//       measurementType: "tankDipping",
//       subtotal: {
//         gross: 1500,
//         bsw: 50,
//         netProduction: 750,
//         netTarget: 750,
//       },
//       meters: [
//         {
//           serialNumber: "Tank-001",
//           initialReading: 1000,
//           finalReading: 1500,
//           gross: 500,
//           bsw: 50,
//           netProduction: 250,
//           netTarget: 250,
//         },
//       ],
//       deductions: {
//         initialReading: 1000,
//         finalReading: 1500,
//         meterFactor: 0.98,
//         gross: 500,
//         bsw: 50,
//         netProduction: 250,
//         netTarget: 250,
//       },
//     },
//   ],
// };

// const demoGas = {
//   date: "12/12/2024",
//   asset: "OML 99",
//   flowstations: [
//     {
//       name: "Flowstation 1",
//       subtotal: {
//         gross: 1500,
//         bsw: 50,
//         netProduction: 750,
//         netTarget: 750,
//       },
//       meters: [
//         {
//           serialNumber: "SN-001",
//           meterFactor: 1,
//           initialReading: 1000,
//           finalReading: 1500,
//           gross: 500,
//           bsw: 50,
//           netProduction: 250,
//           netTarget: 250,
//         },
//         {
//           serialNumber: "SN-002",
//           meterFactor: 0.98,
//           initialReading: 1500,
//           finalReading: 2500,
//           gross: 1000,
//           bsw: 50,
//           netProduction: 500,
//           netTarget: 250,
//         },
//       ],
//     },
//     {
//       name: "Flowstation 2",
//       reportType: "netOilOrCondensate",
//       measurementType: "tankDipping",
//       subtotal: {
//         gross: 1500,
//         bsw: 50,
//         netProduction: 750,
//         netTarget: 750,
//       },
//       meters: [
//         {
//           serialNumber: "Tank-001",
//           initialReading: 1000,
//           finalReading: 1500,
//           gross: 500,
//           bsw: 50,
//           netProduction: 250,
//           netTarget: 250,
//         },
//       ],
//       deductions: {
//         initialReading: 1000,
//         finalReading: 1500,
//         meterFactor: 0.98,
//         gross: 500,
//         bsw: 50,
//         netProduction: 250,
//         netTarget: 250,
//       },
//     },
//   ],
// };

// console.log({demo, demoGas})

module.exports = {
  captureOilOrCondensate,
  captureGas,
  updateOilOrCondensate,
  getOilOrCondensateVolumeByID,
  getOilOrCondensateVolumesByAsset,
  deleteOilOrCondensateVolumeByID,
};
