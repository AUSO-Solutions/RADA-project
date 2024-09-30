const getMonthIndexAndDays = (month, year) => {
  month = month.upperCase();

  switch (month) {
    case "JANUARY":
      return { monthIndex: 0, daysInMonth: 31 };
    case "FEBRUARY":
      const daysInMonth =
        year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
      return { monthIndex: 1, daysInMonth };
    case "MARCH":
      return { monthIndex: 2, daysInMonth: 31 };
    case "APRIL":
      return { monthIndex: 3, daysInMonth: 30 };
    case "MAY":
      return { monthIndex: 4, daysInMonth: 31 };
    case "JUNE":
      return { monthIndex: 5, daysInMonth: 30 };
    case "JULY":
      return { monthIndex: 6, daysInMonth: 31 };
    case "AUGUST":
      return { monthIndex: 7, daysInMonth: 31 };
    case "SEPTEMBER":
      return { monthIndex: 8, daysInMonth: 30 };
    case "OCTOBER":
      return { monthIndex: 9, daysInMonth: 31 };
    case "NOVEMBER":
      return { monthIndex: 10, daysInMonth: 30 };
    case "DECEMBER":
      return { monthIndex: 11, daysInMonth: 31 };
    default:
      return -1;
  }
};

const getDates = (month, year) => {
  let { monthIndex, daysInMonth } = getMonthIndexAndDays(month, year);
  const today = new Date();

  // Year is ahead of the current year
  if (year > today.getUTCFullYear()) {
    return [];
  }

  if (year === today.getUTCFullYear() && monthIndex === today.getMonth()) {
    daysInMonth = today.getDate() - 1;
  }

  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.append(new Date(year, monthIndex, i));
  }
  return dates;
};

module.exports = {
  getDates,
};
