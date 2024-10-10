const computeProdDeduction = (potentialData, flowstationData) => {
  let totalUptimeGross = 0;
  let totalUptimeNet = 0;
  let totalUptimeWater = 0;
  let totalUptimeGas = 0;

  let uptimeProduction = [];
  console.log(flowstationData)
  // Estimate Uptime Production
  potentialData.forEach((prodString) => {
    // Estimate uptime gross
    const fractionalUptime = parseInt(prodString.uptimeProduction) / 24;
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
  const deferment = [];

  for (let i = 0; i < potentialData.length; i++) {
    const gross = potentialData[i].gross - actualProduction[i].gross;
    const oilRate = potentialData[i].oilRate - actualProduction[i].oilRate;
    const waterRate =
      potentialData[i].waterRate - actualProduction[i].waterRate;
    const gasRate = potentialData[i].gasRate - actualProduction[i].gasRate;

    const productionString = potentialData[i].productionString;
    const reservoir = potentialData[i].reservoir;
    const status = potentialData[i].status;

    deferment.push({
      productionString,
      reservoir,
      status,
      gross,
      oilRate,
      waterRate,
      gasRate,
    });
  }

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
      defermentCategory:"",
      defermentSubCategory:"",
    },
    {
      productionString: "",
      gross: "",
      oilRate: "",
      gasRate: " ",
      reservoir: "",
      uptimeProduction: "",
      status: "",
      defermentCategory:"",
      defermentSubCategory:"",
    },
  ],
};
