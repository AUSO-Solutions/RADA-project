const computeProdDeduction = (potentialData, flowstationData) => {
  let totalUptimeGross = 0;
  let totalUptimeNet = 0;
  let totalUptimeWater = 0;
  let totalUptimeGas = 0;

  let uptimeProduction = [];
  console.log(flowstationData);
  // Estimate Uptime Production
  potentialData.forEach((prodString) => {
    // Estimate uptime gross
    const fractionalUptime = parseFloat(prodString.uptimeProduction) / 24;
    const gross = fractionalUptime * parseFloat(prodString.gross);
    const oilRate = fractionalUptime * parseFloat(prodString.oilRate);
    const waterRate = gross - oilRate;
    const gasRate = fractionalUptime * parseFloat(prodString.gasRate);

    // Get the running subtotal
    totalUptimeGross += gross;
    totalUptimeNet += oilRate;
    totalUptimeWater += waterRate;
    totalUptimeGas += gasRate;

    // Push the data into the array
    uptimeProduction.push({
      productionString: prodString.productionString,
      reservoir: prodString.reservoir,
      status: prodString.status,
      gross,
      oilRate,
      gasRate,
      waterRate,
    });
  });

  let actualProduction = [];
  // Estimate Actual Production
  uptimeProduction.forEach((prodString) => {
    const gross = (prodString.gross / totalUptimeGross) * flowstationData.gross;
    const oilRate =
      (prodString.oilRate / totalUptimeNet) * flowstationData.netProduction;
    const waterRate =
      (prodString.waterRate / totalUptimeWater) *
      (flowstationData.gross - flowstationData.netProduction);
    const gasRate = (prodString.gasRate / totalUptimeGas) * 100;

    // Push the data into the array
    actualProduction.push({
      productionString: prodString.productionString,
      reservoir: prodString.reservoir,
      status: prodString.status,
      gross,
      oilRate,
      gasRate,
      waterRate,
    });
  });

  // Estimate Deductions
  const drainagePoints = [];
  let totalOilDeferment = 0;
  let totalGasDeferment = 0;
  let totalWaterDeferment = 0;
  let oilScheduledDeferment = { total: 0, subcategories: {} };
  let gasScheduledDeferment = { total: 0, subcategories: {} };
  let waterScheduledDeferment = { total: 0, subcategories: {} };
  let oilUnscheduledDeferment = { total: 0, subcategories: {} };
  let gasUnscheduledDeferment = { total: 0, subcategories: {} };
  let waterUnscheduledDeferment = { total: 0, subcategories: {} };
  let oilThirdPartyDeferment = { total: 0, subcategories: {} };
  let gasThirdPartyDeferment = { total: 0, subcategories: {} };
  let waterThirdPartyDeferment = { total: 0, subcategories: {} };

  for (let i = 0; i < potentialData.length; i++) {
    const gross = potentialData[i].gross - actualProduction[i].gross;
    const oilRate = potentialData[i].oilRate - actualProduction[i].oilRate;
    const waterRate =
      potentialData[i].waterRate - actualProduction[i].waterRate;
    const gasRate = potentialData[i].gasRate - actualProduction[i].gasRate;

    const productionString = potentialData[i].productionString;
    const reservoir = potentialData[i].reservoir;
    const status = potentialData[i].status;

    // Aggregation for total deferment
    totalOilDeferment += oilRate;
    totalGasDeferment += gasRate;
    totalWaterDeferment += waterRate;

    // Aggrgation for deferment categories and subcategories
    if (potentialData[i].defermentCategory === "Scheduled") {
      oilScheduledDeferment.total += oilRate;
      gasScheduledDeferment.total += gasRate;
      waterScheduledDeferment.total += waterRate;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilScheduledDeferment.deferments) {
        oilScheduledDeferment.subcategories[subCategory] += oilRate;
        gasScheduledDeferment.subcategories[subCategory] += gasRate;
        waterScheduledDeferment.subcategories[subCategory] += waterRate;
      } else {
        oilScheduledDeferment.subcategories[subCategory] = oilRate;
        gasScheduledDeferment.subcategories[subCategory] = gasRate;
        waterScheduledDeferment.subcategories[subCategory] = waterRate;
      }
    } else if (potentialData[i].defermentCategory === "Unscheduled") {
      oilUnscheduledDeferment.total += oilRate;
      gasUnscheduledDeferment.total += gasRate;
      waterUnscheduledDeferment.total += waterRate;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilUnscheduledDeferment.deferments) {
        oilUnscheduledDeferment.subcategories[subCategory] += oilRate;
        gasUnscheduledDeferment.subcategories[subCategory] += gasRate;
        waterUnscheduledDeferment.subcategories[subCategory] += waterRate;
      } else {
        oilUnscheduledDeferment.subcategories[subCategory] = oilRate;
        gasUnscheduledDeferment.subcategories[subCategory] = gasRate;
        waterUnscheduledDeferment.subcategories[subCategory] = waterRate;
      }
    } else {
      oilThirdPartyDeferment.total += oilRate;
      gasThirdPartyDeferment.total += gasRate;
      waterThirdPartyDeferment.total += waterRate;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilUnscheduledDeferment.deferments) {
        oilThirdPartyDeferment.subcategories[subCategory] += oilRate;
        gasThirdPartyDeferment.subcategories[subCategory] += gasRate;
        waterThirdPartyDeferment.subcategories[subCategory] += waterRate;
      } else {
        oilThirdPartyDeferment.subcategories[subCategory] = oilRate;
        gasThirdPartyDeferment.subcategories[subCategory] = gasRate;
        waterThirdPartyDeferment.subcategories[subCategory] = waterRate;
      }
    }

    drainagePoints.push({
      productionString,
      reservoir,
      status,
      gross,
      oilRate,
      waterRate,
      gasRate,
    });
  }

  const deferment = {
    totalOilDeferment,
    totalGasDeferment,
    totalWaterDeferment,
    oilScheduledDeferment,
    gasScheduledDeferment,
    waterScheduledDeferment,
    oilUnscheduledDeferment,
    gasUnscheduledDeferment,
    waterUnscheduledDeferment,
    oilThirdPartyDeferment,
    gasThirdPartyDeferment,
    waterThirdPartyDeferment,
    drainagePoints,
  };

  return { actualProduction, deferment };
};

const subtotal = {
  gross: 1500,
  bsw: 50,
  netProduction: 750,
  netTarget: 750,
};

module.exports = { computeProdDeduction };

const payload = {
  flowStation: "",
  date: "",
  potentialTestData: [
    {
      productionString: "",
      gross: "",
      oilRate: "",
      gasRate: " ",
      reservoir: "",
      uptimeProduction: "",
      status: "",
      defermentCategory: "",
      defermentSubCategory: "",
    },
    {
      productionString: "",
      gross: "",
      oilRate: "",
      gasRate: " ",
      reservoir: "",
      uptimeProduction: "",
      status: "",
      defermentCategory: "",
      defermentSubCategory: "",
    },
  ],
};
