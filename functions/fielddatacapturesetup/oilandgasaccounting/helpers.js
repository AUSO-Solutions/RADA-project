const computeProdDeduction = (potentialData, flowstationData) => {
  let totalUptimeGross = 0;
  let totalUptimeNet = 0;
  let totalUptimeWater = 0;
  let totalUptimeGas = 0;

  let uptimeProduction = [];
  // Estimate Uptime Production
  potentialData.forEach((prodString) => {
    // Estimate uptime gross
    const fractionalUptime = parseFloat(prodString.uptimeProduction || 0) / 24;
    const gross = fractionalUptime * parseFloat(prodString.gross);
    const oil = fractionalUptime * parseFloat(prodString.oilRate);
    const water =
      fractionalUptime *
      parseFloat(prodString.gross) *
      (parseFloat(prodString.bsw) / 100);
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
      uptimeProduction: prodString.uptimeProduction,
      remark: prodString.remark,
      thp: prodString.thp,
      bean: prodString.bean,
      gross,
      oil,
      gas,
      water,
    });
  });
  // console.log(totalUptimeWater, uptimeProduction)

  let actualProduction = [];
  // Estimate Actual Production
  uptimeProduction.forEach((prodString) => {
    const gross = (prodString.gross / totalUptimeGross) * flowstationData.gross;
    const oil =
      (prodString.oil / totalUptimeNet) * flowstationData.netProduction;
    const waterRF = prodString.water / totalUptimeWater;
    const water =
      waterRF * (flowstationData.gross - flowstationData.netProduction);
    const gas = (prodString.gas / totalUptimeGas) * flowstationData.gas;

    // console.log({ water, waterRF })
    // Push the data into the array
    actualProduction.push({
      productionString: prodString.productionString,
      reservoir: prodString.reservoir,
      status: prodString.status,
      uptimeProduction: prodString.uptimeProduction,
      remark: prodString.remark,
      thp: prodString.thp,
      bean: prodString.bean,
      gross,
      oil,
      gas,
      water,
      waterRF,
    });
  });

  console.log(actualProduction);

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
    const gross_ = potentialData[i].gross - actualProduction[i].gross;
    const gross = gross_ > 0 ? gross_ : 0;
    const oil_ = potentialData[i].oilRate - actualProduction[i].oil;
    const oil = oil_ > 0 ? oil_ : 0;
    const water = potentialData[i].waterRate - actualProduction[i].water;
    const gas_ = potentialData[i].gasRate - actualProduction[i].gas;
    const gas = gas_ > 0 ? gas_ : 0;
    const downtime = 24 - potentialData[i].uptimeProduction;

    const productionString = potentialData[i].productionString;
    const defermentCategory = potentialData[i].defermentCategory;
    const defermentSubCategory = potentialData[i].defermentSubCategory;
    const reservoir = potentialData[i].reservoir;
    const status = potentialData[i].status;

    // Aggregation for total deferment
    totalOilDeferment += oil;
    totalGasDeferment += gas;
    totalWaterDeferment += water;

    // Aggrgation for deferment categories and subcategories
    if (potentialData[i].defermentCategory === "Scheduled Deferment") {
      oilScheduledDeferment.total += oil;
      gasScheduledDeferment.total += gas;
      waterScheduledDeferment.total += water;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilScheduledDeferment.subcategories) {
        oilScheduledDeferment.subcategories[subCategory] += oil;
        gasScheduledDeferment.subcategories[subCategory] += gas;
        waterScheduledDeferment.subcategories[subCategory] += water;
      } else {
        oilScheduledDeferment.subcategories[subCategory] = oil;
        gasScheduledDeferment.subcategories[subCategory] = gas;
        waterScheduledDeferment.subcategories[subCategory] = water;
      }
    } else if (potentialData[i].defermentCategory === "Unscheduled Deferment") {
      oilUnscheduledDeferment.total += oil;
      gasUnscheduledDeferment.total += gas;
      waterUnscheduledDeferment.total += water;
      let subCategory = potentialData[i].defermentSubCategory;
      if (subCategory in oilUnscheduledDeferment.subcategories) {
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
      if (subCategory in oilThirdPartyDeferment.subcategories) {
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
      defermentCategory,
      defermentSubCategory,
      status,
      downtime,
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
