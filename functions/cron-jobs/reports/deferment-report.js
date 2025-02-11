const PDFDocument = require("pdfkit");
const { transporter } = require("../../helpers");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone.js");
const { getDefermentReportSchedule } = require("../schedules");
const { getDefermentReportData, getAssets } = require("../data");
const Chart = require("chart.js");
const { createCanvas } = require("canvas");
const { onSchedule } = require("firebase-functions/v2/scheduler");

dayjs.extend(utc);
dayjs.extend(timezone);

const defermentReportScheduler = onSchedule(
  { schedule: "every 1 hours", timeZone: "Africa/Lagos" },
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

    if (hour !== currNigerianTime.hour() || day !== currNigerianTime.date())
      return;

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

    const assets = await getAssets();

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
  const doc = new PDFDocument({ margin: 50, font: "Courier", size: "A4" });
  const pdfBuffer = await new Promise((resolve, reject) => {
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (error) => reject(error));

    const monthlyOilBuffer = getVolumesChartConfig(
      data.liquidData,
      asset,
      "Net Oil/Condensate",
      date
    );
    doc.image(monthlyOilBuffer, {
      fit: [500, 300],
      align: "center",
      valign: "center",
    });

    doc.addPage();

    const monthlyGasBuffer = getVolumesChartConfig(
      data.gasData,
      asset,
      "Gas",
      date
    );
    doc.image(monthlyGasBuffer, {
      fit: [500, 300],
      align: "center",
      valign: "center",
    });

    doc.addPage();

    const oilProductionBuffer = generateProductionStackedBarChart(
      data.monthlyAggregate || [],
      "Oil/Condensate",
      asset,
      date
    );
    doc.image(oilProductionBuffer, {
      fit: [500, 300],
      align: "center",
      valign: "center",
    });

    doc.addPage();

    const gasProductionBuffer = generateProductionStackedBarChart(
      data.monthlyAggregate || [],
      "Gas",
      asset,
      date
    );
    doc.image(gasProductionBuffer, {
      fit: [500, 300],
      align: "center",
      valign: "center",
    });

    doc.addPage();

    const gasScheduledDefermentBuffer = generatePieChartBuffer(
      data,
      asset,
      "Gas",
      "Scheduled Deferment"
    );
    if (gasScheduledDefermentBuffer) {
      doc.image(gasScheduledDefermentBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      doc.addPage();
    }

    const gasUnscheduledDefermentBuffer = generatePieChartBuffer(
      data,
      asset,
      "Gas",
      "Unscheduled Deferment"
    );
    if (gasUnscheduledDefermentBuffer) {
      doc.image(gasUnscheduledDefermentBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      doc.addPage();
    }

    const gasThirdPartyDefermentBuffer = generatePieChartBuffer(
      data,
      asset,
      "Gas",
      "Third Party Deferment"
    );
    if (gasThirdPartyDefermentBuffer) {
      doc.image(gasThirdPartyDefermentBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      doc.addPage();
    }

    const oilScheduledDefermentBuffer = generatePieChartBuffer(
      data,
      asset,
      "Net Oil/Condensate",
      "Scheduled Deferment"
    );
    if (oilScheduledDefermentBuffer) {
      doc.image(oilScheduledDefermentBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      doc.addPage();
    }

    const oilUnscheduledDefermentBuffer = generatePieChartBuffer(
      data,
      asset,
      "Net Oil/Condensate",
      "Unscheduled Deferment"
    );
    if (oilUnscheduledDefermentBuffer) {
      doc.image(oilUnscheduledDefermentBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      doc.addPage();
    }

    const oilThirdPartyDefermentBuffer = generatePieChartBuffer(
      data,
      asset,
      "Net Oil/Condensate",
      "Third Party Deferment"
    );
    if (oilThirdPartyDefermentBuffer) {
      doc.image(oilThirdPartyDefermentBuffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });

      doc.addPage();
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
    subject: `${asset} Daily Production Report_${date}`,
    html: `<b>Hello</b> <br>
      <p>Attached is the production report for <b>${asset}</b> for ${date}.
      <br> <br>
      You are receiving this email because you are registered to the PEF application under ${asset} asset group.
      </p>
      `,
    attachments: [
      {
        filename: `${asset} Production Report_${date}.pdf`,
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
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  let config = null;

  if (fluidType === "Oil/Condensate") {
    config = getStackedBarConfigurationOil(chartData, asset, format, month);
  } else {
    config = getStackedBarConfigurationGas(chartData, asset, format, month);
  }

  new Chart(context, config);

  return canvas.toBuffer();
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

  const title = `${asset} ${fluidType} ${defermentType} (${
    fluidType === "Net Oil/Condensate" ? "bopd" : "MMscf/d"
  })`;

  if (labels.length === 0) return null;

  const colors = labels.map(() => getRandomColor());

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

const getVolumesChartConfig = (data, asset, fluidType, month) => {
  const date = data.date || [];

  const datasets = {};

  const title = `${asset} ${fluidType} Production Profile for ${month} `;

  Object.entries(data).forEach(([key, value]) => {
    if (key !== "date") {
      datasets.push({
        label: key,
        data: value,
        backgroundColor: getRandomColor(),
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
            text: `${
              fluidType ? "Oil/Condensate rate (bopd)" : "Gas rate (MMscf/d)"
            }`,
            font: { size: 14 },
          },
        },
      },
    },
  };
  return configuration;
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

  new Chart(context, config);

  return canvas.toBuffer("image/png");
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
