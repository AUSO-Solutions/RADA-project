/* eslint-disable no-throw-literal */
const validateLiquidFlowstationData = (flowstationsData) => {
  for (let flowstation of flowstationsData) {
    if (
      ["metering", "tankDipping"].indexOf(flowstation.measurementType) === -1
    ) {
      throw {
        code: "cancelled",
        message: `Invalid metering type for Flowstation: ${flowstation.name}`,
      };
    }

    if (["gross", "netProduction"].indexOf(flowstation.reportType) === -1) {
      throw {
        code: "cancelled",
        message: `Invalid report type for Flowstation: ${flowstation.name}`,
      };
    }

    if (flowstation.reportType === "gross") {
      let computedGross = 0;
      for (let meter of flowstation.meters) {
        const meterGross =
          (meter.finalReading - meter.initialReading) * meter.meterFactor;
        if (meterGross !== meter.gross) {
          throw {
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          };
        }

        // For metering, multiply gross by meterFactor. For Tank dipping, gross stays same
        computedGross += meterGross
          // flowstation.measurementType === "metering"
          //   ? meterGross * meter.meterFactor
          //   : meterGross
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedGross +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      if (computedGross !== flowstation.subtotal.gross) {
        throw {
          code: "cancelled",
          message: `Error computing gross for flowstation: ${flowstation.name}`,
        };
      }

      // if (computedGross * (1 - (flowstation.subtotal.bsw * 0.01))) {
      //   throw ({
      //     code: "cancelled",
      //     message: `Error computing net production for flowstation: ${flowstation.name}`,
      //   });
      // }
    } else {
      let computedNetProduction = 0;
      for (let meter of flowstation.meters) {
        const meterNetProduction =
          (meter.finalReading - meter.initialReading) *
          meter.meterFactor;
        if (meterNetProduction !== meter.netProduction) {
    
          throw {
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          };
          
        }

        // For metering, multiply gross by meterFactor. For Tank dipping, gross stays same
        computedNetProduction += meterNetProduction;
        // flowstation.measurementType === "metering"
        //   ? meterNetProduction * meter.meterFactor
        //   : meterNetProduction;
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedNetProduction +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      // if (computedNetProduction !== flowstation.subtotal.netProduction) {
      //   throw {
      //     code: "cancelled",
      //     message: `Error computing net production for flowstation: ${flowstation.name}`,
      //   };
      // }

      // if (computedNetProduction / (1 - (flowstation.subtotal.bsw * 0.01))) {
      //   throw ({
      //     code: "cancelled",
      //     message: `Error computing gross for flowstation: ${flowstation.name}`,
      //   });
      // }
    }
  }
};

const validateLiquidFlowstationData2 = (flowstationsData) => {
  for (let flowstation of flowstationsData) {
    if (
      ["metering", "tankDipping"].indexOf(flowstation.measurementType) === -1
    ) {
      throw {
        code: "cancelled",
        message: `Invalid metering type for Flowstation: ${flowstation.name}`,
      };
    }

    if (["gross", "netProduction"].indexOf(flowstation.reportType) === -1) {
      throw {
        code: "cancelled",
        message: `Invalid report type for Flowstation: ${flowstation.name}`,
      };
    }

    if (flowstation.reportType === "gross") {
      let computedGross = 0;

      for (let meter of flowstation.meters) {
        const meterFactor = meter.meterFacter ?? 1;
        const meterGross =
          (meter.finalReading - meter.initialReading) * meterFactor;
        if (meterGross !== meter.gross) {
          throw {
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          };
        }
        computedGross += meterGross;
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedGross +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      if (computedGross !== flowstation.subtotal.gross) {
        throw {
          code: "cancelled",
          message: `Error computing gross for flowstation: ${flowstation.name}`,
        };
      }

      if (
        computedGross * (1 - flowstation.subtotal.bsw * 0.01) !==
        flowstation.subtotal.netProduction
      ) {
        throw {
          code: "cancelled",
          message: `Error computing net production for flowstation: ${flowstation.name}`,
        };
      }
    } else {
      let computedNetProduction = 0;
      for (let meter of flowstation.meters) {
        const meterFactor = meter.meterFacter ?? 1;
        const meterNetProduction =
          (meter.finalReading - meter.initialReading) * meterFactor;
        if (meterNetProduction !== meter.netProduction) {
          throw {
            code: "cancelled",
            message: `Gross might have been wrongly computed for meter: ${meter.serialNumber} in flowstation: ${flowstation.name}`,
          };
        }

        computedNetProduction += meterNetProduction;
      }

      // For tank dipping, account for export line or deduction
      if (flowstation.measurementType === "tankDipping") {
        computedNetProduction +=
          (flowstation.deduction.finalReading -
            flowstation.deduction.initialReading) *
          flowstation.deduction.meterFactor;
      }

      if (computedNetProduction !== flowstation.subtotal.netProduction) {
        throw {
          code: "cancelled",
          message: `Error computing net production for flowstation: ${flowstation.name}`,
        };
      }

      if (
        computedNetProduction / (1 - flowstation.subtotal.bsw * 0.01) !==
        flowstation.subtotal.gross
      ) {
        throw {
          code: "cancelled",
          message: `Error computing gross for flowstation: ${flowstation.name}`,
        };
      }
    }
  }
};

const validateGasFlowstationData = (flowstationsData) => {
  if (flowstationsData.fluidType !== "gas") {
    throw {
      code: "cancelled",
      message: `Invalid fluid for asset: ${flowstationsData.asset}`,
    };
  }
  // for (let flowstation of flowstationsData) {

  // }
};

module.exports = {
  validateLiquidFlowstationData,
  validateLiquidFlowstationData2,
};
