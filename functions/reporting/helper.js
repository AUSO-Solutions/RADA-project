function getDatesForCurrentMonth() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();

  const dates = [];
  for (let day = 1; day <= currentDate; day++) {
    const date = new Date(currentYear, currentMonth, day);
    dates.push(date);
  }

  return dates;
}

const getStartOfMonth = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return new Date(currentYear, currentMonth, 1);
};

function getDatesBetween(startDate, endDate) {
  const dates = [];

  // Ensure that both startDate and endDate are Date objects
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // Loop through the dates from startDate to endDate
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate)); // Push a copy of the current date
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return dates;
}

function aggregateDeferment(data) {
  const monthlyMap = new Map();
  let monthlyIndex = 0;
  let monthlyData = [];

  const yearlyMap = new Map();
  let yearlyIndex = 0;
  let yearlyData = [];

  let dailyData = [];

  let dailyAggregateMap = new Map();
  let dailyAggregateIndex = 0;
  let dailyAggregate = [];
  let monthlyAggregate = [];
  let monthlyAggregateMap = new Map();
  let monthlyAggregateIndex = 0;
  let yearlyAggregate = [];
  let yearlyAggregateMap = new Map();
  let yearlyAggregateIndex = 0;

  let oilScheduledDeferment = {
    total: 0,
    subs: {},
  };

  let oilUnscheduledDeferment = {
    total: 0,
    subs: {},
  };

  let oilThirdPartyDeferment = {
    total: 0,
    subs: {},
  };

  let gasScheduledDeferment = {
    total: 0,
    subs: {},
  };

  let gasUnscheduledDeferment = {
    total: 0,
    subs: {},
  };

  let gasThirdPartyDeferment = {
    total: 0,
    subs: {},
  };

  for (let item of data) {
    for (let deferment of item.deferment.drainagePoints) {
      // Create the daily data
      dailyData.push({
        date: item.date,
        flowstation: item.flowStation,
        ...deferment,
      });

      const date = new Date(item.date);

      // Aggregation Monthly Data based on Drainage Point
      const monthYear = `${date.getFullYear()}-${date.getUTCMonth() + 1}`;
      const key = `${deferment.productionString}-${deferment.defermentCategory}-${deferment.defermentSubCategory}-${monthYear}`;
      if (!monthlyMap.has(key)) {
        monthlyData.push({
          date: `${monthYear}-01`,
          flowstation: item.flowStation,
          ...deferment,
        });
        monthlyMap.set(key, monthlyIndex);
        monthlyIndex++;
      } else {
        let index = monthlyMap.get(key);
        monthlyData[index].downtime += deferment?.downtime || 0;
        monthlyData[index].gross += deferment.gross;
        monthlyData[index].oil += deferment.oil;
        monthlyData[index].gas += deferment.gas;
      }

      // Aggregation yearly based on Drainage Point
      const year = date.getFullYear();
      const yearKey = `${deferment.productionString}-${deferment.defermentCategory}-${deferment.defermentSubCategory}-${year}`;

      if (!yearlyMap.has(yearKey)) {
        yearlyData.push({
          date: `${year}-01-01`,
          flowstation: item.flowStation,
          ...deferment,
        });
        yearlyMap.set(yearKey, yearlyIndex);
        yearlyIndex++;
      } else {
        let yearIndex = yearlyMap.get(yearKey);
        yearlyData[yearIndex].downtime += deferment.downtime || 0;
        yearlyData[yearIndex].gross += deferment.gross;
        yearlyData[yearIndex].oil += deferment.oil;
        yearlyData[yearIndex].gas += deferment.gas;
      }
    }

    // Aggregation for pie chart
    oilScheduledDeferment.total +=
      item.deferment.oilScheduledDeferment?.total || 0;
    oilUnscheduledDeferment.total +=
      item.deferment.oilUnscheduledDeferment?.total || 0;
    oilThirdPartyDeferment.total +=
      item.deferment.oilThirdPartyDeferment?.total || 0;
    gasScheduledDeferment.total +=
      item.deferment.gasScheduledDeferment?.total || 0;
    gasUnscheduledDeferment.total +=
      item.deferment.gasUnscheduledDeferment?.total || 0;
    gasThirdPartyDeferment.total +=
      item.deferment.gasThirdPartyDeferment?.total || 0;

    let keys = Object.keys(
      item.deferment.oilScheduledDeferment?.subcategories || {}
    );
    keys.forEach((key) => {
      if (key in oilScheduledDeferment.subs) {
        oilScheduledDeferment.subs[key] +=
          item.deferment.oilScheduledDeferment?.subcategories[key];
      } else {
        oilScheduledDeferment.subs[key] =
          item.deferment.oilScheduledDeferment?.subcategories[key];
      }
    });

    keys = Object.keys(
      item.deferment.oilUnscheduledDeferment?.subcategories || {}
    );
    keys.forEach((key) => {
      if (key in oilUnscheduledDeferment.subs) {
        oilUnscheduledDeferment.subs[key] +=
          item.deferment.oilUnscheduledDeferment?.subcategories[key];
      } else {
        oilUnscheduledDeferment.subs[key] =
          item.deferment.oilUnscheduledDeferment?.subcategories[key];
      }
    });

    keys = Object.keys(
      item.deferment.oilThirdPartyDeferment?.subcategories || {}
    );
    keys.forEach((key) => {
      if (key in oilThirdPartyDeferment.subs) {
        oilThirdPartyDeferment.subs[key] +=
          item.deferment.oilThirdPartyDeferment?.subcategories[key];
      } else {
        oilThirdPartyDeferment.subs[key] =
          item.deferment.oilThirdPartyDeferment?.subcategories[key];
      }
    });

    keys = Object.keys(
      item.deferment.gasScheduledDeferment?.subcategories || {}
    );
    keys.forEach((key) => {
      if (key in gasScheduledDeferment.subs) {
        gasScheduledDeferment.subs[key] +=
          item.deferment.gasScheduledDeferment?.subcategories[key];
      } else {
        gasScheduledDeferment.subs[key] =
          item.deferment.gasScheduledDeferment?.subcategories[key];
      }
    });

    keys = Object.keys(
      item.deferment.gasUnscheduledDeferment?.subcategories || {}
    );
    keys.forEach((key) => {
      if (key in gasUnscheduledDeferment.subs) {
        gasUnscheduledDeferment.subs[key] +=
          item.deferment.gasUnscheduledDeferment?.subcategories[key];
      } else {
        gasUnscheduledDeferment.subs[key] =
          item.deferment.gasUnscheduledDeferment?.subcategories[key];
      }
    });

    keys = Object.keys(
      item.deferment.gasThirdPartyDeferment?.subcategories || {}
    );
    keys.forEach((key) => {
      if (key in gasThirdPartyDeferment.subs) {
        gasThirdPartyDeferment.subs[key] +=
          item.deferment.gasThirdPartyDeferment?.subcategories[key];
      } else {
        gasThirdPartyDeferment.subs[key] =
          item.deferment.gasThirdPartyDeferment?.subcategories[key];
      }
    });

    const key = item.date;
    let prev = dailyAggregate.length - 1;
    if (!dailyAggregateMap.has(key)) {
      let res = {
        date: item.date,
        totalOil: prev > -1 ? dailyAggregate[prev]?.totalOil : 0,
        totalGas: prev > -1 ? dailyAggregate[prev]?.totalGas : 0,
        totalOilScheduled: 0,
        totalOilUnscheduled: 0,
        totalOilThirdParty: 0,
        totalGasScheduled: 0,
        totalGasUnscheduled: 0,
        totalGasThirdParty: 0,
      };

      res.totalOil += item.deferment.totalOilDeferment || 0;
      res.totalGas += item.deferment.totalGasDeferment || 0;
      res.totalOilScheduled = item.deferment.oilScheduledDeferment?.total || 0;
      res.totalOilUnscheduled =
        item.deferment.oilUnscheduledDeferment?.total || 0;
      res.totalOilThirdParty =
        item.deferment.oilThirdPartyDeferment?.total || 0;
      res.totalGasScheduled = item.deferment.gasScheduledDeferment?.total || 0;
      res.totalGasUnscheduled =
        item.deferment.gasUnscheduledDeferment?.total || 0;
      res.totalGasThirdParty =
        item.deferment.gasThirdPartyDeferment?.total || 0;

      dailyAggregate.push(res);
      dailyAggregateMap.set(key, dailyAggregateIndex);
      dailyAggregateIndex += 1;
    } else {
      let index = dailyAggregateMap.get(key);

      dailyAggregate[index].totalOil += item.deferment.totalOilDeferment || 0;
      dailyAggregate[index].totalGas += item.deferment.totalGasDeferment || 0;
      dailyAggregate[index].totalOilScheduled +=
        item.deferment.oilScheduledDeferment.total || 0;
      dailyAggregate[index].totalOilUnscheduled +=
        item.deferment.oilUnscheduledDeferment.total || 0;
      dailyAggregate[index].totalOilThirdParty +=
        item.deferment.oilThirdPartyDeferment?.total || 0;
      dailyAggregate[index].totalGasScheduled +=
        item.deferment.gasScheduledDeferment?.total || 0;
      dailyAggregate[index].totalGasUnscheduled +=
        item.deferment.gasUnscheduledDeferment?.total || 0;
      dailyAggregate[index].totalGasThirdParty +=
        item.deferment.gasThirdPartyDeferment?.total || 0;
    }
  }

  const savedDailyAggregate = JSON.parse(JSON.stringify(dailyAggregate));

  for (let item of dailyAggregate) {
    const date = new Date(item.date);
    const monthYear = `${date.getUTCMonth() + 1}-${date.getFullYear()}`;
    if (!monthlyAggregateMap.has(monthYear)) {
      monthlyAggregate.push(item);
      monthlyAggregateMap.set(monthYear, monthlyAggregateIndex);
      monthlyAggregateIndex++;
    } else {
      let index = monthlyAggregateMap.get(monthYear);
      monthlyAggregate[index].totalOil = item.totalOil;
      monthlyAggregate[index].totalGas = item.totalGas;
      monthlyAggregate[index].totalOilScheduled += item.totalOilScheduled;
      monthlyAggregate[index].totalOilUnscheduled += item.totalOilUnscheduled;
      monthlyAggregate[index].totalOilThirdParty += item.totalOilThirdParty;
      monthlyAggregate[index].totalGasScheduled += item.totalGasScheduled;
      monthlyAggregate[index].totalGasUnscheduled += item.totalGasUnscheduled;
      monthlyAggregate[index].totalGasThirdParty += item.totalGasThirdParty;
    }
  }

  for (let item of monthlyAggregate) {
    const date = new Date(item.date);
    const year = date.getFullYear();

    if (!yearlyAggregateMap.has(year)) {
      yearlyAggregate.push(item);
      yearlyAggregateMap.set(year, yearlyAggregateIndex);
      yearlyAggregateIndex++;
    } else {
      let index = yearlyAggregateMap.get(year);
      yearlyAggregate[index].totalGas = item.totalGas;
      yearlyAggregate[index].totalOil = item.totalOil;
      yearlyAggregate[index].totalOilScheduled += item.totalOilScheduled;
      yearlyAggregate[index].totalOilUnscheduled += item.totalOilUnscheduled;
      yearlyAggregate[index].totalOilThirdParty += item.totalOilThirdParty;
      yearlyAggregate[index].totalGasScheduled += item.totalGasScheduled;
      yearlyAggregate[index].totalGasUnscheduled += item.totalGasUnscheduled;
      yearlyAggregate[index].totalGasThirdParty += item.totalGasThirdParty;
    }
  }

  return {
    dailyData,
    monthlyData,
    yearlyData,
    dailyAggregate: savedDailyAggregate,
    monthlyAggregate,
    yearlyAggregate,
    oilScheduledDeferment,
    oilUnscheduledDeferment,
    oilThirdPartyDeferment,
    gasScheduledDeferment,
    gasUnscheduledDeferment,
    gasThirdPartyDeferment,
  };
}

function aggregateActualProduction(data) {
  const monthlyMap = new Map();
  let monthlyIndex = 0;
  let monthlyData = [];

  let dailyData = [];

  for (let item of data) {
    for (let production of item.productionData) {
      // Create the daily data
      dailyData.push({
        date: item.date,
        flowstation: item.flowStation,
        ...production,
      });

      const date = new Date(item.date);

      // Aggregation Monthly Data based on Drainage Point
      const monthYear = `${date.getFullYear()}-${date.getUTCMonth() + 1}`;
      const key = `${production.productionString}-${monthYear}`;
      if (!monthlyMap.has(key)) {
        const uptime = Number(production.uptimeProduction || 0);
        monthlyData.push({
          date: `${monthYear}-01`,
          flowstation: item.flowStation,
          thp: production.thp || 0,
          bean: production.bean || 0,
          uptimeProduction: uptime,
          ...production,
        });
        monthlyMap.set(key, monthlyIndex);
        monthlyIndex++;
      } else {
        let index = monthlyMap.get(key);
        const uptime = Number(production.uptimeProduction || 0);
        const prev = Number(monthlyData[index]["uptimeProduction"]);
        monthlyData[index]["uptimeProduction"] = uptime + prev;
        monthlyData[index].gross += production.gross || 0;
        monthlyData[index].oil += production.oil || 0;
        monthlyData[index].gas += production.gas || 0;
        monthlyData[index].water += production.water || 0;
        monthlyData[index].thp = production.thp || 0;
        monthlyData[index].bean = production.bean || 0;
      }
    }
  }
  return {
    dailyData,
    monthlyData,
  };
}

const aggregateOperationsData = (liquidVolumes, gasVolumes, production) => {
  // Volumes Data Prep and Aggregate
  let oilProduced = [];
  let gasProduced = [];
  let gasExported = [];
  let gasFlared = [];
  let gasUtilised = [];

  let totalGross = 0;
  let totalOil = 0;
  let totalGas = 0;
  let totalFlaredGas = 0;
  let totalExportGas = 0;
  let totalUtilisedGas = 0;

  const flowstationsMap = new Map();
  let flowstationIndex = 0;

  const len = liquidVolumes.length;

  let facilities = [];

  for (let i = 0; i < len; i++) {
    const oil = {};
    const gas = { date: gasVolumes[i].date };
    const gExport = { date: gasVolumes[i].date };
    const flared = { date: gasVolumes[i].date };
    const utilised = { date: gasVolumes[i].date };

    for (let flowstation of gasVolumes[i].flowstations) {
      gas[[flowstation.name]] = flowstation?.subtotal?.totalGas || 0;
      gExport[[flowstation.name]] = flowstation?.subtotal?.export || 0;
      flared[[flowstation.name]] = flowstation?.subtotal?.gasFlaredUSM || 0;
      utilised[[flowstation.name]] = flowstation?.subtotal?.gasFlaredUSM || 0;

      totalGas += flowstation?.subtotal?.totalGas || 0;
      totalExportGas += flowstation?.subtotal?.export || 0;
      totalFlaredGas += flowstation?.subtotal?.gasFlaredUSM || 0;
      totalUtilisedGas += flowstation?.subtotal?.gasFlaredUSM || 0;
    }

    for (let flowstation of liquidVolumes[i].flowstations) {
      oil[[flowstation.name]] = flowstation?.subtotal?.netProduction || 0;

      totalOil += flowstation?.subtotal?.netProduction || 0;
      totalGross += flowstation?.subtotal?.gross || 0;
    }
    oilProduced.push(oil);
    gasProduced.push(gas);
    gasExported.push(gExport);
    gasFlared.push(flared);
    gasUtilised.push(utilised);

    if (i === len - 1) {
      const liquid = liquidVolumes[i];
      const gas = gasVolumes[i];

      // Add the data in the oil flowstations to the facilities
      for (let flowstation in liquid.flowstations) {
        const name = flowstation.name;

        facilities.push({
          flowstation: name,
          gross: flowstation?.subtotal?.gross || 0,
          net: flowstation?.subtotal?.netProduction || 0,
          bsw: flowstation?.subtotal?.bsw || 0,
        });
        flowstationsMap.set(name, flowstationIndex);
        flowstationIndex++;
      }

      // Loop through the gas data to add the gas flowstation data to corresponding oil flowstations
      for (let flowstation in gas.flowstations) {
        const name = flowstation.name;
        if (flowstationIndex.has(name)) {
          const index = flowstationsMap.get(name);
          facilities[index]["producedGas"] =
            flowstation?.subtotal?.totalGas || 0;
          facilities[index]["utilisedGas"] =
            flowstation?.subtotal?.fuelGas || 0;
          facilities[index]["flaredGas"] =
            flowstation?.subtotal?.gasFlaredUSM || 0;
          facilities[index]["exportGas"] =
            flowstation?.subtotal?.exportGas || 0;
        } else {
          facilities.push({
            flowstation: name,
            producedGas: flowstation?.subtotal?.totalGas || 0,
            utilisedGas: flowstation?.subtotal?.fuelGas || 0,
            flaredGas: flowstation?.subtotal?.gasFlaredUSM || 0,
            exportGas: flowstation?.subtotal?.exportGas || 0,
          });
          flowstationsMap.set(name, flowstationIndex);
          flowstationIndex++;
        }
      }
    }
  }

  const summary = {
    totalGross,
    totalOil,
    totalGas,
    totalFlaredGas,
    totalExportGas,
    totalUtilisedGas,
    bsw: ((totalGross - totalOil) * 100) / totalGross,
  };

  // Actual Production Aggregation
  let sortedProduction = {};

  for (let data of production) {
    const flowstation = data?.flowStation;
    if (flowstation in sortedProduction) {
      sortedProduction[[flowstation]] = [
        ...sortedProduction[flowstation],
        ...data?.productionData,
      ];
    } else {
      sortedProduction[[flowstation]] = [...data?.productionData];
    }
  }
  return {
    summary,
    facilities,
    oilProduced,
    gasProduced,
    gasExported,
    gasFlared,
    sortedProduction,
  };
};

module.exports = {
  getDatesForCurrentMonth,
  getDatesBetween,
  aggregateDeferment,
  aggregateActualProduction,
  getStartOfMonth,
  aggregateOperationsData,
};
