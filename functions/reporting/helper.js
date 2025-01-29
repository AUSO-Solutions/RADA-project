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

module.exports = {
  getDatesForCurrentMonth,
  getDatesBetween,
  aggregateDeferment,
};
