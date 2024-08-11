const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { generateRandomID } = require("../../helpers");

const {
  validateGasFlowstationData,
  validateLiquidFlowstationData,
} = require("./helpers");

const db = admin.firestore();

const captureOilOrCondensateVolume = onCall(async (request) => {
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

    validateLiquidFlowstationData(flowstations);

    const id = generateRandomID();
    const dbData = {
      date,
      asset,
      fluidType: "oilOrCondensate",
      data: flowstations,
    };

    await db.collections("liquidVolumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const updateOilOrCondensateVolume = onCall(async (request) => {
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

    await db.collections("liquidVolumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const getOilOrCondensateVolumeByID = onCall(async (request) => {
  const { id } = request;

  try {
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

const getOilOrCondensateVolumeByAsset = onCall(async (request) => {
  const { assetName } = request;

  try {
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

    await db.collections("liquidVolumes").doc(id).delete();
    return { status: "success", message: "Volume deleted successfully" };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const captureGasVolume = onCall(async (request) => {
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

    validateGasFlowstationData(flowstations);

    const id = generateRandomID();
    const dbData = {
      date,
      asset,
      fluidType: "gas",
      data: flowstations,
    };

    await db.collections("gasVolumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const updateGasVolume = onCall(async (request) => {
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
    const record = await db.collection("GasVolumes").doc(id).get();
    if (!record.exists) {
      throw new Error({ code: "not-found", message: "Record not found" });
    }

    validateGasFlowstationData(flowstations);

    const dbData = {
      date,
      asset,
      fluidType: "oilOrCondensate",
      data: flowstations,
    };

    await db.collections("gasVolumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const getGasVolumeByID = onCall(async (request) => {
  const { id } = request;

  try {
    const record = await db.collection("gasVolumes").doc(id).get();
    if (!record.exists) {
      throw new Error({ code: "not-found", message: "Record not found" });
    }

    return { status: "success", data: record };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const getGasVolumeByAsset = onCall(async (request) => {
  const { assetName } = request;

  try {
    const records = await db
      .collection("gasVolumes")
      .where("name", "==", assetName)
      .get()
      .docs();

    return { status: "success", data: records.map((doc) => doc.data()) };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const deleteGasVolumeByID = onCall(async (request) => {
  try {
    const { data } = request;
    const { id } = data;
    if (!id) {
      throw new Error({
        code: "cancelled",
        message: "Missing volume Id",
      });
    }

    await db.collections("gasVolumes").doc(id).delete();
    return { status: "success", message: "Volume deleted successfully" };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

// Just a guide
const demo = {
  date: "12/12/2024",
  asset: "OML 99",
  flowstations: [
    {
      name: "Flowstation 1",
      reportType: "gross",
      measurementType: "metering",
      subtotal: {
        gross: 1500,
        bsw: 50,
        netProduction: 750,
        netTarget: 750,
      },
      meters: [
        {
          serialNumber: "SN-001",
          meterFactor: 1,
          initialReading: 1000,
          finalReading: 1500,
          gross: 500,
          bsw: 50,
          netProduction: 250,
          netTarget: 250,
        },
        {
          serialNumber: "SN-002",
          meterFactor: 0.98,
          initialReading: 1500,
          finalReading: 2500,
          gross: 1000,
          bsw: 50,
          netProduction: 500,
          netTarget: 250,
        },
      ],
    },
    {
      name: "Flowstation 2",
      reportType: "netOilOrCondensate",
      measurementType: "tankDipping",
      subtotal: {
        gross: 1500,
        bsw: 50,
        netProduction: 750,
        netTarget: 750,
      },
      meters: [
        {
          serialNumber: "Tank-001",
          initialReading: 1000,
          finalReading: 1500,
          gross: 500,
          bsw: 50,
          netProduction: 250,
          netTarget: 250,
        },
      ],
      deductions: {
        initialReading: 1000,
        finalReading: 1500,
        meterFactor: 0.98,
        gross: 500,
        bsw: 50,
        netProduction: 250,
        netTarget: 250,
      },
    },
  ],
};

const demoGas = {
  date: "12/12/2024",
  asset: "OML 99",
  flowstations: [
    {
      name: "Flowstation 1",
      totalGasProduced: 2223,
      gasTypes: [
        {
          type: "flaredGas",
          meterNumber: "SN-001",
          meterFactor: 1,
          initialReading: 1000,
          finalReading: 1500,
          isMetered: true,
          total: 50,
        },
        {
          serialNumber: "SN-002",
          meterFactor: 0.98,
          initialReading: 1500,
          finalReading: 2500,
          gross: 1000,
          bsw: 50,
          netProduction: 500,
          netTarget: 250,
        },
      ],
    },
    {
      name: "Flowstation 2",
      reportType: "netOilOrCondensate",
      measurementType: "tankDipping",
      subtotal: {
        gross: 1500,
        bsw: 50,
        netProduction: 750,
        netTarget: 750,
      },
      meters: [
        {
          serialNumber: "Tank-001",
          initialReading: 1000,
          finalReading: 1500,
          gross: 500,
          bsw: 50,
          netProduction: 250,
          netTarget: 250,
        },
      ],
      deductions: {
        initialReading: 1000,
        finalReading: 1500,
        meterFactor: 0.98,
        gross: 500,
        bsw: 50,
        netProduction: 250,
        netTarget: 250,
      },
    },
  ],
};

console.log({ demo, demoGas });

module.exports = {
  captureOilOrCondensateVolume,
  captureGasVolume,
  updateOilOrCondensateVolume,
  getOilOrCondensateVolumeByID,
  getOilOrCondensateVolumeByAsset,
  deleteOilOrCondensateVolumeByID,
  updateGasVolume,
  getGasVolumeByAsset,
  getGasVolumeByID,
  deleteGasVolumeByID,
};
