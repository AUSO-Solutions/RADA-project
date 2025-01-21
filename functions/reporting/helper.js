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
  //   const dailyData = { ...data, deferment: [...data.deferment] };
  const monthlyMap = new Map();
  let monthlyIndex = 0;
  let monthlyData = [];
  const monthlyAggregateMap = new Map();
  let monthlyAggregateIndex = 0;
  let monthlyAggregate = [];

  const yearlyMap = new Map();
  let yearlyIndex = 0;
  let yearlyData = [];
  const yearlyAggregateMap = new Map();
  let yearlyAggregateIndex = 0;
  let yearlyAggregate = [];

  for (let item of data) {
    for (let deferment of item.deferment) {
      const date = new Date(item.date);

      // Aggregation Monthly Data based on Drainage Point
      const monthYear = `${date.getUTCMonth() + 1}-${date.getFullYear()}`;
      const key = `${deferment.productString}-${deferment.defermentCategory}-${deferment.defermentSubCategory}-${monthYear}`;
      if (!monthlyMap.has(key)) {
        monthlyData.push({ date: monthYear, ...deferment });
        monthlyMap.set(key, monthlyIndex);
        monthlyIndex++;
      } else {
        let index = monthlyMap.get(key);
        monthlyData[index].downtime += deferment.downtime;
        monthlyData[index].gross += deferment.gross;
        monthlyData[index].oil += deferment.oil;
        monthlyData[index].gas += deferment.gas;
      }

      // Aggregation monthly data based on Deferment Category and Subcategory
      const aggregateKey = `${deferment.defermentCategory}-${monthYear}`;
      if (!monthlyAggregateMap.has(aggregateKey)) {
        // If the key does not exist, then no entry has been made for this deferment category
        const result = {
          date: monthYear,
          // Create the first instance of categories and subcategories
          categories: {
            [String(deferment.defermentCategory)]: {
              oil: deferment.oil,
              gas: deferment.gas,
              gross: deferment.gross,
              downtime: deferment.downtime,
              subcategories: {
                [String(deferment.defermentSubCategory)]: {
                  oil: deferment.oil,
                  gas: deferment.gas,
                  gross: deferment.gross,
                  downtime: deferment.downtime,
                },
              },
            },
          },
          // Create the first instance of subtotals
          subtotals: {
            oil: deferment.oil,
            gas: deferment.gas,
            gross: deferment.gross,
            downtime: deferment.downtime,
          },
        };
        monthlyAggregate.push(result);
        monthlyAggregateMap.set(key, monthlyAggregateIndex);
        monthlyAggregateIndex++;
      } else {
        let index = monthlyAggregateMap.get(aggregateKey);

        // Add to existing subtotals
        monthlyAggregate[index].subtotals.oil += deferment.oil;
        monthlyAggregate[index].subtotals.gross += deferment.gross;
        monthlyAggregate[index].subtotals.gas += deferment.gas;
        monthlyAggregate[index].subtotals.downtime += deferment.downtime;

        // Add to existing category
        monthlyAggregate[index].categories[deferment.defermentCategory].oil +=
          deferment.oil;
        monthlyAggregate[index].categories[deferment.defermentCategory].gas +=
          deferment.gas;
        monthlyAggregate[index].categories[deferment.defermentCategory].gross +=
          deferment.gross;
        monthlyAggregate[index].categories[
          deferment.defermentCategory
        ].downtime += deferment.downtime;

        // If this subcategory already exists, then add to it. Else, create a new subcategory
        if (
          monthlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories.hasOwnProperty(deferment.defermentSubCategory)
        ) {
          monthlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].oil += deferment.oil;
          monthlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].gas += deferment.gas;
          monthlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].gross +=
            deferment.gross;
          monthlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].downtime +=
            deferment.downtime;
        } else {
          monthlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory] = {
            oil: deferment.oil,
            gas: deferment.gas,
            gross: deferment.gross,
            downtime: deferment.downtime,
          };
        }
      }

      // Aggregation yearly based on Drainage Point
      const year = date.getFullYear();
      const yearKey = `${deferment.productString}-${deferment.defermentCategory}-${deferment.defermentSubCategory}-${year}`;
      if (!yearlyMap.has(key)) {
        yearlyData.push({ date: year, ...deferment });
        yearlyMap.set(key, yearlyIndex);
        yearlyIndex++;
      } else {
        let yearIndex = yearlyMap.get(yearKey);
        yearlyData[yearIndex].downtime += deferment.downtime;
        yearlyData[yearIndex].gross += deferment.gross;
        yearlyData[yearIndex].oil += deferment.oil;
        yearlyData[yearIndex].gas += deferment.gas;
      }

      // Aggregation yearly based on Deferment Category and Subcategory
      const yearlyAggregateKey = `${deferment.defermentCategory}-${year}`;
      if (!yearlyAggregateMap.has(yearlyAggregateKey)) {
        const result = {
          date: year,
          categories: {
            [String(deferment.defermentCategory)]: {
              oil: deferment.oil,
              gas: deferment.gas,
              gross: deferment.gross,
              downtime: deferment.downtime,
              subcategories: {
                [String(deferment.defermentSubCategory)]: {
                  oil: deferment.oil,
                  gas: deferment.gas,
                  gross: deferment.gross,
                  downtime: deferment.downtime,
                },
              },
            },
          },
          subtotals: {
            oil: deferment.oil,
            gas: deferment.gas,
            gross: deferment.gross,
            downtime: deferment.downtime,
          },
        };
        yearlyAggregate.push(result);
        yearlyAggregateMap.set(key, yearlyAggregateIndex);
        yearlyAggregateIndex++;
      } else {
        let index = yearlyMap.get(yearlyAggregateKey);

        yearlyAggregate[index].subtotals.oil += deferment.oil;
        yearlyAggregate[index].subtotals.gross += deferment.gross;
        yearlyAggregate[index].subtotals.gas += deferment.gas;
        yearlyAggregate[index].subtotals.downtime += deferment.downtime;

        yearlyAggregate[index].categories[deferment.defermentCategory].oil +=
          deferment.oil;
        yearlyAggregate[index].categories[deferment.defermentCategory].gas +=
          deferment.gas;
        yearlyAggregate[index].categories[deferment.defermentCategory].gross +=
          deferment.gross;
        yearlyAggregate[index].categories[
          deferment.defermentCategory
        ].downtime += deferment.downtime;

        if (
          yearlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories.hasOwnProperty(deferment.defermentSubCategory)
        ) {
          yearlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].oil += deferment.oil;
          yearlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].gas += deferment.gas;
          yearlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].gross +=
            deferment.gross;
          yearlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory].downtime +=
            deferment.downtime;
        } else {
          yearlyAggregate[index].categories[
            deferment.defermentCategory
          ].subcategories[deferment.defermentSubCategory] = {
            oil: deferment.oil,
            gas: deferment.gas,
            gross: deferment.gross,
            downtime: deferment.downtime,
          };
        }
      }
    }
  }

  return {
    dailyData: data,
    monthlyData: { core: monthlyData, aggregate: monthlyAggregate },
    yearlyData: { core: yearlyData, aggregate: yearlyAggregate },
  };
}

module.exports = {
  getDatesForCurrentMonth,
  getDatesBetween,
  aggregateDeferment,
};
