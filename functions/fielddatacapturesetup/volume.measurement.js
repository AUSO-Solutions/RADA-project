const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { generateRandomID } = require("../../helpers");

const db = admin.firestore();

const captureOilOrCondensate = onCall(async (request) => {
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

    await db.collections("volumes").doc(id).set(dbData);
    return id;
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

    validateGasFlowstationData(flowstations);

    const id = generateRandomID();
    const dbData = {
      date,
      asset,
      fluidType: "oilOrCondensate",
      data: flowstations,
    };

    await db.collections("volumes").doc(id).set(dbData);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const validateLiquidFlowstationData = (flowstationsData) => {
  for (let flowstation of flowstationsData) {
    if (
      ["metering", "tankDipping"].indexOf(flowstation.measurementType) === -1
    ) {
      throw new Error({
        code: "cancelled",
        message: `Invalid metering type for Flowstation: ${flowstation.name}`,
      });
    }

    if (["gross", "netProduction"].indexOf(flowstation.reportType) === -1) {
      throw new Error({
        code: "cancelled",
        message: `Invalid report type for Flowstation: ${flowstation.name}`,
      });
    }

    if (flowstation.reportType === "gross") {
      let computedGross = 0;
      for (let meter of flowstation.meters) {
        const meterGross = meter.finalReading - meter.initialReading;
        if (meterGross !== meter.gross) {
          throw new Error({
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          });
        }

        // For metering, multiply gross by meterFactor. For Tank dipping, gross stays same
        computedGross +=
          flowstation.measurementType === "metering"
            ? meterGross * meter.meterFactor
            : meterGross;
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedGross +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      if (computedGross !== flowstation.gross) {
        throw new Error({
          code: "cancelled",
          message: `Error computing gross for flowstation: ${flowstation.name}`,
        });
      }

      if (computedGross * (1 - flowstation.bsw)) {
        throw new Error({
          code: "cancelled",
          message: `Error computing net production for flowstation: ${flowstation.name}`,
        });
      }
    } else {
      let computedNetProduction = 0;
      for (let meter of flowstation.meters) {
        const meterNetProduction = meter.finalReading - meter.initialReading;
        if (meterNetProduction !== meter.netProduction) {
          throw new Error({
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          });
        }

        // For metering, multiply gross by meterFactor. For Tank dipping, gross stays same
        computedNetProduction +=
          flowstation.measurementType === "metering"
            ? meterNetProduction * meter.meterFactor
            : meterNetProduction;
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedNetProduction +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      if (computedNetProduction !== flowstation.netProduction) {
        throw new Error({
          code: "cancelled",
          message: `Error computing net production for flowstation: ${flowstation.name}`,
        });
      }

      if (computedNetProduction / (1 - flowstation.bsw)) {
        throw new Error({
          code: "cancelled",
          message: `Error computing gross for flowstation: ${flowstation.name}`,
        });
      }
    }
  }
};

const validateGasFlowstationData = (flowstationsData) => {
  for (let flowstation of flowstationsData) {
    if (["gross", "netProduction"].indexOf(flowstation.reportType) === -1) {
      throw new Error({
        code: "cancelled",
        message: `Invalid report type for Flowstation: ${flowstation.name}`,
      });
    }

    if (flowstation.reportType === "gross") {
      let computedGross = 0;
      for (let meter of flowstation.meters) {
        const meterGross = meter.finalReading - meter.initialReading;
        if (meterGross !== meter.gross) {
          throw new Error({
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          });
        }

        // For metering, multiply gross by meterFactor. For Tank dipping, gross stays same
        computedGross +=
          flowstation.measurementType === "metering"
            ? meterGross * meter.meterFactor
            : meterGross;
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedGross +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      if (computedGross !== flowstation.gross) {
        throw new Error({
          code: "cancelled",
          message: `Error computing gross for flowstation: ${flowstation.name}`,
        });
      }

      if (computedGross * (1 - flowstation.bsw)) {
        throw new Error({
          code: "cancelled",
          message: `Error computing net production for flowstation: ${flowstation.name}`,
        });
      }
    } else {
      let computedNetProduction = 0;
      for (let meter of flowstation.meters) {
        const meterNetProduction = meter.finalReading - meter.initialReading;
        if (meterNetProduction !== meter.netProduction) {
          throw new Error({
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          });
        }

        // For metering, multiply gross by meterFactor. For Tank dipping, gross stays same
        computedNetProduction +=
          flowstation.measurementType === "metering"
            ? meterNetProduction * meter.meterFactor
            : meterNetProduction;
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedNetProduction +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      if (computedNetProduction !== flowstation.netProduction) {
        throw new Error({
          code: "cancelled",
          message: `Error computing net production for flowstation: ${flowstation.name}`,
        });
      }

      if (computedNetProduction / (1 - flowstation.bsw)) {
        throw new Error({
          code: "cancelled",
          message: `Error computing gross for flowstation: ${flowstation.name}`,
        });
      }
    }
  }
};

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

module.exports = {
  captureOilOrCondensate,
  captureGas,
  demo,
};
