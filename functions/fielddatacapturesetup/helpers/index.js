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

module.exports = {
  validateGasFlowstationData,
  validateLiquidFlowstationData,
};