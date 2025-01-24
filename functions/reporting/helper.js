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

  let totalOil = 0;
  let totalGas = 0;
  let dailyAggregate = [];
  let monthlyAggregate = [];
  let monthlyAggregateMap = new Map();
  let monthlyAggregateIndex = 0;
  let yearlyAggregate = [];
  let yearlyAggregateMap = new Map();
  let yearlyAggregateIndex = 0;

  for (let item of data) {
    // Add the total
    totalOil += item.totalOilDeferment || 0;
    totalGas += item.totalGasDeferment || 0;

    for (let deferment of item.deferment.drainagePoints) {
      // Create the daily data
      dailyData.push({
        date: item.date,
        flowstation: item.flowStation,
        ...deferment,
      });

      const date = new Date(item.date);

      // Aggregation Monthly Data based on Drainage Point
      const monthYear = `${date.getUTCMonth() + 1}-${date.getFullYear()}`;
      const key = `${deferment.productionString}-${deferment.defermentCategory}-${deferment.defermentSubCategory}-${monthYear}`;
      if (!monthlyMap.has(key)) {
        monthlyData.push({
          date: `01-${monthYear}`,
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
          date: `01-01-${year}`,
          flowstation: item.flowStation,
          ...deferment,
        });
        yearlyMap.set(key, yearlyIndex);
        yearlyIndex++;
      } else {
        let yearIndex = yearlyMap.get(yearKey);
        yearlyData[yearIndex].downtime += deferment.downtime || 0;
        yearlyData[yearIndex].gross += deferment.gross;
        yearlyData[yearIndex].oil += deferment.oil;
        yearlyData[yearIndex].gas += deferment.gas;
      }
    }

    let res = {
      date: item.date,
      totalOilScheduled: 0,
      totalOilUnscheduled: 0,
      totalOilThirdParty: 0,
      totalGasScheduled: 0,
      totalGasUnscheduled: 0,
      totalGasThirdParty: 0,
      subOilScheduled: {},
      subGasScheduled: {},
      subOilUnscheduled: {},
      subGasUnscheduled: {},
      subOilThirdParty: {},
      subGasThirdParty: {},
    };

    res.totalOilScheduled = item.oilScheduledDeferment?.total || 0;
    res.totalOilUnscheduled = item.oilUnscheduledDeferment?.total || 0;
    res.totalOilThirdParty = item.oilThirdPartyDeferment?.total || 0;
    res.totalGasScheduled = item.gasScheduledDeferment?.total || 0;
    res.totalGasUnscheduled = item.gasUnscheduledDeferment?.total || 0;
    res.totalGasThirdParty = item.gasThirdPartyDeferment?.total || 0;

    let keys = Object.keys(item.oilScheduledDeferment?.subcategories || {});
    keys.forEach((key) => {
      res.subOilScheduled[key] = item.oilScheduledDeferment.subcategories[key];
    });

    keys = Object.keys(item.oilUnscheduledDeferment?.subcategories || {});
    keys.forEach((key) => {
      res.subOilUnscheduled[key] =
        item.oilUnscheduledDeferment.subcategories[key];
    });

    keys = Object.keys(item.oilThirdPartyDeferment?.subcategories || {});
    keys.forEach((key) => {
      res.subOilUnscheduled[key] =
        item.oilThirdPartyDeferment.subcategories[key];
    });

    keys = Object.keys(item.gasScheduledDeferment?.subcategories || {});
    keys.forEach((key) => {
      res.subGasScheduled[key] = item.gasScheduledDeferment.subcategories[key];
    });

    keys = Object.keys(item.gasUnscheduledDeferment?.subcategories || {});
    keys.forEach((key) => {
      res.subGasUnscheduled[key] =
        item.gasUnscheduledDeferment.subcategories[key];
    });

    keys = Object.keys(item.oilThirdPartyDeferment?.subcategories || {});
    keys.forEach((key) => {
      res.subOilUnscheduled[key] =
        item.oilThirdPartyDeferment.subcategories[key];
    });

    dailyAggregate.push(res);
  }

  for (let item of dailyAggregate) {
    const date = new Date(item.date);
    const monthYear = `${date.getUTCMonth() + 1}-${date.getFullYear()}`;
    if (!monthlyAggregateMap.has(monthYear)) {
      monthlyAggregate.push(item);
      monthlyMap.set(monthYear, monthlyAggregateIndex);
      monthlyAggregateIndex++;
    } else {
      let index = monthlyAggregateMap.get(monthYear);
      monthlyAggregate[index].totalOilScheduled += item.totalOilScheduled;
      monthlyAggregate[index].totalOilUnscheduled += item.totalOilUnscheduled;
      monthlyAggregate[index].totalOilThirdParty += item.totalOilThirdParty;
      monthlyAggregate[index].totalGasScheduled += item.totalGasScheduled;
      monthlyAggregate[index].totalGasUnscheduled += item.totalGasUnscheduled;
      monthlyAggregate[index].totalGasThirdParty += item.totalGasThirdParty;

      let keys = Object.keys(item.subOilScheduled);
      keys.forEach((key) => {
        if (key in monthlyAggregate[index].subOilScheduled) {
          monthlyAggregate[index].subOilScheduled[key] +=
            item.subOilScheduled[key];
        } else {
          monthlyAggregate[index].subOilScheduled[key] =
            item.subOilScheduled[key];
        }
      });

      keys = Object.keys(item.subOilUnscheduled);
      keys.forEach((key) => {
        if (key in monthlyAggregate[index].subOilUnscheduled) {
          monthlyAggregate[index].subOilUnscheduled[key] +=
            item.subOilUnscheduled[key];
        } else {
          monthlyAggregate[index].subOilUnscheduled[key] =
            item.subOilUnscheduled[key];
        }
      });

      keys = Object.keys(item.subOilThirdParty);
      keys.forEach((key) => {
        if (key in monthlyAggregate[index].subOilThirdParty) {
          monthlyAggregate[index].subOilThirdParty[key] +=
            item.subOilThirdParty[key];
        } else {
          monthlyAggregate[index].subOilThirdParty[key] =
            item.subOilThirdParty[key];
        }
      });

      keys = Object.keys(item.subGasScheduled);
      keys.forEach((key) => {
        if (key in monthlyAggregate[index].subGasScheduled) {
          monthlyAggregate[index].subGasScheduled[key] +=
            item.subGasScheduled[key];
        } else {
          monthlyAggregate[index].subGasScheduled[key] =
            item.subGasScheduled[key];
        }
      });

      keys = Object.keys(item.subGasUnscheduled);
      keys.forEach((key) => {
        if (key in monthlyAggregate[index].subGasUnscheduled) {
          monthlyAggregate[index].subGasUnscheduled[key] +=
            item.subGasUnscheduled[key];
        } else {
          monthlyAggregate[index].subGasUnscheduled[key] =
            item.subGasUnscheduled[key];
        }
      });

      keys = Object.keys(item.subGasThirdParty);
      keys.forEach((key) => {
        if (key in monthlyAggregate[index].subGasThirdParty) {
          monthlyAggregate[index].subGasThirdParty[key] +=
            item.subGasThirdParty[key];
        } else {
          monthlyAggregate[index].subGasThirdParty[key] =
            item.subGasThirdParty[key];
        }
      });
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
      yearlyAggregate[index].totalOilScheduled += item.totalOilScheduled;
      yearlyAggregate[index].totalOilUnscheduled += item.totalOilUnscheduled;
      yearlyAggregate[index].totalOilThirdParty += item.totalOilThirdParty;
      yearlyAggregate[index].totalGasScheduled += item.totalGasScheduled;
      yearlyAggregate[index].totalGasUnscheduled += item.totalGasUnscheduled;
      yearlyAggregate[index].totalGasThirdParty += item.totalGasThirdParty;

      let keys = Object.keys(item.subOilScheduled);
      keys.forEach((key) => {
        if (key in yearlyAggregate[index].subOilScheduled) {
          yearlyAggregate[index].subOilScheduled[key] +=
            item.subOilScheduled[key];
        } else {
          yearlyAggregate[index].subOilScheduled[key] =
            item.subOilScheduled[key];
        }
      });

      keys = Object.keys(item.subOilUnscheduled);
      keys.forEach((key) => {
        if (key in yearlyAggregate[index].subOilUnscheduled) {
          yearlyAggregate[index].subOilUnscheduled[key] +=
            item.subOilUnscheduled[key];
        } else {
          yearlyAggregate[index].subOilUnscheduled[key] =
            item.subOilUnscheduled[key];
        }
      });

      keys = Object.keys(item.subOilThirdParty);
      keys.forEach((key) => {
        if (key in yearlyAggregate[index].subOilThirdParty) {
          yearlyAggregate[index].subOilThirdParty[key] +=
            item.subOilThirdParty[key];
        } else {
          yearlyAggregate[index].subOilThirdParty[key] =
            item.subOilThirdParty[key];
        }
      });

      keys = Object.keys(item.subGasScheduled);
      keys.forEach((key) => {
        if (key in yearlyAggregate[index].subGasScheduled) {
          yearlyAggregate[index].subGasScheduled[key] +=
            item.subGasScheduled[key];
        } else {
          yearlyAggregate[index].subGasScheduled[key] =
            item.subGasScheduled[key];
        }
      });

      keys = Object.keys(item.subGasUnscheduled);
      keys.forEach((key) => {
        if (key in yearlyAggregate[index].subGasUnscheduled) {
          yearlyAggregate[index].subGasUnscheduled[key] +=
            item.subGasUnscheduled[key];
        } else {
          yearlyAggregate[index].subGasUnscheduled[key] =
            item.subGasUnscheduled[key];
        }
      });

      keys = Object.keys(item.subGasThirdParty);
      keys.forEach((key) => {
        if (key in yearlyAggregate[index].subGasThirdParty) {
          yearlyAggregate[index].subGasThirdParty[key] +=
            item.subGasThirdParty[key];
        } else {
          yearlyAggregate[index].subGasThirdParty[key] =
            item.subGasThirdParty[key];
        }
      });
    }
  }

  return {
    dailyData,
    monthlyData,
    yearlyData,
    dailyAggregate,
    monthlyAggregate,
    yearlyAggregate,
    totalOil,
    totalGas,
  };
}

module.exports = {
  getDatesForCurrentMonth,
  getDatesBetween,
  aggregateDeferment,
};
