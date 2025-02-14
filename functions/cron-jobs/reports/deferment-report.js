const PDFDocument = require("pdfkit");
const { transporter } = require("../../helpers");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone.js");
const { getDefermentReportSchedule } = require("../schedules");
const { getDefermentReportData, getAssets } = require("../data");
const { Chart } = require("chart.js/auto");
const { createCanvas } = require("canvas");
const { onSchedule } = require("firebase-functions/v2/scheduler");

dayjs.extend(utc);
dayjs.extend(timezone);

const defermentReportScheduler = onSchedule(
  { schedule: "every 5 minutes", timeZone: "Africa/Lagos" },
  async (context) => {
    console.log("Running cron job");
    await generateDefermentReport();
  }
);

module.exports = { defermentReportScheduler };

const generateDefermentReport = async () => {
  try {
    const { hour, day } = await getDefermentReportSchedule();
    if (!hour || !day) return;

    const currNigerianTime = dayjs().tz("Africa/Lagos");

    // if (hour !== currNigerianTime.hour() || day !== currNigerianTime.date())
    //   return;

    const startDate = currNigerianTime
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");

    const endDate = currNigerianTime
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const reportMonth = currNigerianTime
      .subtract(1, "month")
      .startOf("month")
      .format("MM-YYYY");

    const assets = ["OML 24"]; //await getAssets();

    for (let asset of assets) {
      const reportData = await getDefermentReportData(
        asset,
        startDate,
        endDate
      );
      await sendDefermentReport(reportData, asset, reportMonth);
    }
  } catch (error) {
    console.log(error);
  }
};

const sendDefermentReport = async (data, asset, date) => {
  const font = { bold: "Helvetica-bold", normal: "Helvetica" };
  const doc = new PDFDocument({ margin: 50, font: font.normal, size: "A4" });
  const monthlyOilBuffer = await getVolumesChartBuffer(
    data.liquidData || {},
    asset,
    "Net Oil/Condensate",
    date
  );

  const monthlyGasBuffer = await getVolumesChartBuffer(
    data.gasData || {},
    asset,
    "Gas",
    date
  );

  const oilProductionBuffer = await generateProductionStackedBarChart(
    data.monthlyAggregate || [],
    "Oil/Condensate",
    asset,
    date
  );

  const gasProductionBuffer = await generateProductionStackedBarChart(
    data.monthlyAggregate || [],
    "Gas",
    asset,
    date
  );

  const gasScheduledDefermentBuffer = await generatePieChartBuffer(
    data,
    asset,
    "Gas",
    "Scheduled Deferment"
  );

  const oilScheduledDefermentBuffer = await generatePieChartBuffer(
    data,
    asset,
    "Net Oil/Condensate",
    "Scheduled Deferment"
  );

  const oilUnscheduledDefermentBuffer = await generatePieChartBuffer(
    data,
    asset,
    "Net Oil/Condensate",
    "Unscheduled Deferment"
  );

  const oilThirdPartyDefermentBuffer = await generatePieChartBuffer(
    data,
    asset,
    "Net Oil/Condensate",
    "Third Party Deferment"
  );

  const gasUnscheduledDefermentBuffer = await generatePieChartBuffer(
    data,
    asset,
    "Gas",
    "Unscheduled Deferment"
  );

  const gasThirdPartyDefermentBuffer = await generatePieChartBuffer(
    data,
    asset,
    "Gas",
    "Third Party Deferment"
  );

  const pdfBuffer = await new Promise((resolve, reject) => {
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (error) => reject(error));

    let verticalPosition = 50;

    if (monthlyOilBuffer) {
      doc.image(monthlyOilBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
      verticalPosition += 320;
    }

    let verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (monthlyGasBuffer) {
      doc.image(monthlyGasBuffer, 50, verticalPosition, {
        fit: [500, 30],
        align: "center",
        valign: "center",
      });
      verticalPosition += 320;
    }

    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (oilProductionBuffer) {
      doc.image(oilProductionBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
      verticalPosition += 320;
    }

    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (gasProductionBuffer) {
      doc.image(gasProductionBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
      verticalPosition += 20;
    }

    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (oilScheduledDefermentBuffer) {
      doc.image(oilScheduledDefermentBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      verticalPosition += 320;
    }

    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (oilUnscheduledDefermentBuffer) {
      doc.image(oilUnscheduledDefermentBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      verticalPosition += 320;
    }
    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (oilThirdPartyDefermentBuffer) {
      doc.image(oilThirdPartyDefermentBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      verticalPosition += 320;
    }

    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (gasScheduledDefermentBuffer) {
      doc.image(gasScheduledDefermentBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      verticalPosition += 320;
    }
    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (gasUnscheduledDefermentBuffer) {
      doc.image(gasUnscheduledDefermentBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      verticalPosition += 320;
    }
    if (verticalChecker.moveToNextPage) {
      doc.addPage();
      verticalChecker = 50;
    }

    if (gasThirdPartyDefermentBuffer) {
      doc.image(gasThirdPartyDefermentBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    }

    doc.end();
  });

  sendEmail(pdfBuffer, ["emma.osademe@gmail.com"], asset, date);
};

const sendEmail = (pdfBuffer, mailList, asset, date) => {
  // Add the attachment to other configurations
  const mailOptions = {
    from: "rada.apps@gmail.com",
    to: mailList.join(","),
    subject: `${asset} Monthly Deferment Report_${date}`,
    html: `<b>Hello</b> <br>
      <p>Attached is the production report for <b>${asset}</b> for ${date}.
      <br> <br>
      You are receiving this email because you are registered to the PEF application under ${asset} asset group.
      </p>
      `,
    attachments: [
      {
        filename: `${asset} Monthly Deferment Data_${date}.pdf`,
        content: pdfBuffer,
        encodign: "base64",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`An Error occurred: ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  console.log(mailOptions);
};

const getStackedBarConfigurationOil = (data, asset, format, month) => {
  const datasets = {
    "Scheduled Deferment": [],
    "Unscheduled Deferment": [],
    "Third-Party Deferment": [],
  };
  const date = [];

  data.forEach((item) => {
    date.push(dayjs(item.date).format(format));
    datasets["Scheduled Deferment"].push(item.totalOilScheduled.toFixed(2));
    datasets["Unscheduled Deferment"].push(item.totalOilUnscheduled.toFixed(2));
    datasets["Third-Party Deferment"].push(item.totalOilThirdParty.toFixed(2));
  });

  const res = Object.entries(datasets || {}).map(([key, value], index) => ({
    label: key,
    data: value,
    backgroundColor: getRandomColor(index),
    borderColor: "rgba(0, 0, 0, 1)",
    borderWidth: 1,
  }));

  const configuration = {
    type: "bar",
    data: {
      labels: date,
      datasets: res,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${asset} Oil/Condensate Production for ${month}`,
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          stacked: false,
          title: {
            display: true,
            text: "Date",
            font: { size: 14 },
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Oil Produced (bopd)",
            font: { size: 14 },
          },
        },
      },
    },
  };
  return configuration;
};

const getStackedBarConfigurationGas = (data, asset, format, month) => {
  const datasets = {
    "Scheduled Deferment": [],
    "Unscheduled Deferment": [],
    "Third-Party Deferment": [],
  };
  const date = [];

  data.forEach((item) => {
    date.push(dayjs(item.date).format(format));
    datasets["Scheduled Deferment"].push(item.totalGasScheduled.toFixed(2));
    datasets["Unscheduled Deferment"].push(item.totalGasUnscheduled.toFixed(2));
    datasets["Third-Party Deferment"].push(item.totalGasThirdParty.toFixed(2));
  });

  const res = Object.entries(datasets || {}).map(([key, value]) => ({
    label: key,
    data: value,
    backgroundColor: ["#9A031E", "#03045E", "#344E41"],
    borderColor: "rgba(0, 123, 255, 1)",
    borderWidth: 1,
  }));

  const configuration = {
    type: "bar",
    data: {
      labels: date,
      datasets: res,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${asset} Oil/Condensate Production for ${month}`,
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          stacked: false,
          title: {
            display: true,
            text: "Date",
            font: { size: 14 },
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: "Gas Produced (MMscf/d)",
            font: { size: 14 },
          },
        },
      },
    },
  };
  return configuration;
};

const generateProductionStackedBarChart = async (
  chartData,
  fluidType,
  asset,
  format,
  month
) => {
  if (chartData.length === 0) return null;
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  if (fluidType === "Oil/Condensate") {
    const config = getStackedBarConfigurationOil(
      chartData,
      asset,
      format,
      month
    );

    console.log(config);
    new Chart(context, config);

    return canvas.toBuffer("image/png");
  } else {
    const config = getStackedBarConfigurationGas(
      chartData,
      asset,
      format,
      month
    );
    new Chart(context, config);
    console.log(config);

    return canvas.toBuffer("image/png");
  }
};

const getPieChartConfig = (data, asset, fluidType, defermentType) => {
  const labels = [];
  const values = [];

  if (defermentType === "Scheduled Deferment") {
    if (fluidType === "Net Oil/Condensate") {
      Object.entries(data.oilScheduledDeferment.subs || []).forEach(
        ([key, value]) => {
          labels.push(key);
          values.push(value);
        }
      );
    } else {
      Object.entries(data.gasScheduledDeferment.subs || []).forEach(
        ([key, value]) => {
          labels.push(key);
          values.push(value);
        }
      );
    }
  } else if (defermentType === "Unscheduled Deferment") {
    if (fluidType === "Net Oil/Condensate") {
      Object.entries(data.oilUnscheduledDeferment.subs || []).forEach(
        ([key, value]) => {
          labels.push(key);
          values.push(value);
        }
      );
    } else {
      Object.entries(data.gasUnscheduledDeferment.subs || []).forEach(
        ([key, value]) => {
          labels.push(key);
          values.push(value);
        }
      );
    }
  } else {
    if (fluidType === "Net Oil/Condensate") {
      Object.entries(data.oilThirdPartyDeferment.subs || []).forEach(
        ([key, value]) => {
          labels.push(key);
          values.push(value);
        }
      );
    } else {
      Object.entries(data.gasThirdPartyDeferment.subs || []).forEach(
        ([key, value]) => {
          labels.push(key);
          values.push(value);
        }
      );
    }
  }

  if (values.length === 0) return null;

  const title = `${asset} ${fluidType} ${defermentType} (${
    fluidType === "Net Oil/Condensate" ? "bopd" : "MMscf/d"
  })`;

  if (labels.length === 0) return null;

  const colors = labels.map((_, index) => getRandomColor(index));

  const config = {
    type: "pie",
    data: {
      labels: labels,
      dataset: [
        {
          data: values,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ": " + tooltipItem.raw;
            },
          },
        },
      },
    },
  };
  return config;
};

const getVolumesChartBuffer = async (data, asset, fluidType, month) => {
  const date = [month];

  const datasets = [];

  const title = `${asset} ${fluidType} Production Profile for ${month} `;

  Object.entries(data).forEach(([key, value], index) => {
    if (key !== "date") {
      datasets.push({
        label: key,
        data: value,
        backgroundColor: getRandomColor(index),
        borderWidth: 1,
      });
    }
  });

  const configuration = {
    type: "bar",
    data: {
      labels: date,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: "Date",
            font: { size: 14 },
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: `${
              fluidType === "Net Oil/Condensate"
                ? "Oil/Condensate rate (bopd)"
                : "Gas rate (MMscf/d)"
            }`,
            font: { size: 14 },
          },
        },
      },
    },
  };

  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  new Chart(context, configuration);
  return canvas.toBuffer("image/png");
};

const generatePieChartBuffer = async (
  data,
  asset,
  fluidType,
  defermentType
) => {
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const config = getPieChartConfig(data, asset, fluidType, defermentType);
  if (!config) return null;

  new Chart(context, config);

  return canvas.toBuffer("image/png");
};

const getRandomColor = (index) => {
  return index < colors.length ? colors[index] : "#CAD2C5";
};

const colors = [
  "#023047",
  "#264653",
  "#283618",
  "#3A5A40",
  "#03045E",
  "#432818",
  "#386641",
];

const resetImageVerticalPosition = (verticalPosition) => {
  const moveToNextPage = 390 - verticalPosition < 0;
  const newVerticalPosition = moveToNextPage ? 50 : verticalPosition;
  return { moveToNextPage, newVerticalPosition };
};
