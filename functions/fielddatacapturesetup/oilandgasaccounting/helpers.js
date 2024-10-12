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
    const oil = fractionalUptime * parseFloat(prodString.oilRate);
    const water = gross - oil;
    const gas = fractionalUptime * parseFloat(prodString.gasRate);

    // Get the running subtotal
    totalUptimeGross += gross;
    totalUptimeNet += oil;
    totalUptimeWater += water;
    totalUptimeGas += gas;

    // Push the data into the array
    uptimeProduction.push({
      productionString: prodString.productionString,
      reservoir: prodString.reservoir,
      status: prodString.status,
      gross,
      oil,
      gas,
      water,
    });
  });

  let actualProduction = [];
  // Estimate Actual Production
  uptimeProduction.forEach((prodString) => {
    const gross = (prodString.gross / totalUptimeGross) * flowstationData.gross;
    const oil =
      (prodString.oil / totalUptimeNet) * flowstationData.netProduction;
    const water =
      (prodString.water / totalUptimeWater) *
      (flowstationData.gross - flowstationData.netProduction);
    const gas = (prodString.gas / totalUptimeGas) * 100;

    // Push the data into the array
    actualProduction.push({
      productionString: prodString.productionString,
      reservoir: prodString.reservoir,
      status: prodString.status,
      gross,
      oil,
      gas,
      water,
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
    const oil = potentialData[i].oilRate - actualProduction[i].oil;
    const water = potentialData[i].waterRate - actualProduction[i].water;
    const gas = potentialData[i].gasRate - actualProduction[i].gas;

    const productionString = potentialData[i].productionString;
    const reservoir = potentialData[i].reservoir;
    const status = potentialData[i].status;

    // Aggregation for total deferment
    totalOilDeferment += oil;
    totalGasDeferment += gas;
    totalWaterDeferment += water;

    // Aggrgation for deferment categories and subcategories
    if (potentialData[i].defermentCategory === "Scheduled") {
      oilScheduledDeferment.total += oil;
      gasScheduledDeferment.total += gas;
      waterScheduledDeferment.total += water;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilScheduledDeferment.deferments) {
        oilScheduledDeferment.subcategories[subCategory] += oil;
        gasScheduledDeferment.subcategories[subCategory] += gas;
        waterScheduledDeferment.subcategories[subCategory] += water;
      } else {
        oilScheduledDeferment.subcategories[subCategory] = oil;
        gasScheduledDeferment.subcategories[subCategory] = gas;
        waterScheduledDeferment.subcategories[subCategory] = water;
      }
    } else if (potentialData[i].defermentCategory === "Unscheduled") {
      oilUnscheduledDeferment.total += oil;
      gasUnscheduledDeferment.total += gas;
      waterUnscheduledDeferment.total += water;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilUnscheduledDeferment.deferments) {
        oilUnscheduledDeferment.subcategories[subCategory] += oil;
        gasUnscheduledDeferment.subcategories[subCategory] += gas;
        waterUnscheduledDeferment.subcategories[subCategory] += water;
      } else {
        oilUnscheduledDeferment.subcategories[subCategory] = oil;
        gasUnscheduledDeferment.subcategories[subCategory] = gas;
        waterUnscheduledDeferment.subcategories[subCategory] = water;
      }
    } else {
      oilThirdPartyDeferment.total += oil;
      gasThirdPartyDeferment.total += gas;
      waterThirdPartyDeferment.total += water;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilUnscheduledDeferment.deferments) {
        oilThirdPartyDeferment.subcategories[subCategory] += oil;
        gasThirdPartyDeferment.subcategories[subCategory] += gas;
        waterThirdPartyDeferment.subcategories[subCategory] += water;
      } else {
        oilThirdPartyDeferment.subcategories[subCategory] = oil;
        gasThirdPartyDeferment.subcategories[subCategory] = gas;
        waterThirdPartyDeferment.subcategories[subCategory] = water;
      }
    }

    drainagePoints.push({
      productionString,
      reservoir,
      status,
      gross,
      oil,
      water,
      gas,
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

// const subtotal = {
//   gross: 1500,
//   bsw: 50,
//   netProduction: 750,
//   netTarget: 750,
// };

module.exports = { computeProdDeduction };

// const payload = {
//   flowStation: "",
//   date: "",
//   potentialTestData: [
//     {
//       productionString: "",
//       gross: "",
//       oilRate: "",
//       gasRate: " ",
//       reservoir: "",
//       uptimeProduction: "",
//       status: "",
//       defermentCategory: "",
//       defermentSubCategory: "",
//     },
//     {
//       productionString: "",
//       gross: "",
//       oilRate: "",
//       gasRate: " ",
//       reservoir: "",
//       uptimeProduction: "",
//       status: "",
//       defermentCategory: "",
//       defermentSubCategory: "",
//     },
//   ],
// };
