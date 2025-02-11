const PDFDocument = require("pdfkit");
const functions = require("firebase-functions");
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

    doc.end();
  });

  sendEmail(pdfBuffer, ["emma.osademe@gmail.com"], asset, date);
};

const sendEmail = (pdfBuffer, mailList, asset, date) => {
  // Add the attachment to other configurations
  const mailOptions = {
    from: "emmanuel",
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
    backgroundColor: colors[key],
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
    backgroundColor: colors[key],
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

const getPieChartConfig = (data, title) => {
  const config = {
    type: "pie",
    data: {
      labels: [],
      dataset: data,
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

const generateChartBuffer = async (data, title) => {
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const config = getPieChartConfig(data, title);

  new Chart(context, config);

  return canvas.toBuffer("image/png");
};

const colors = {
  "Ekulama 1 Flowstation": "green",
  "Ekulama 2 Flowstation": "blue",
  "Awoba Flowstation": "red",
  "EFE Flowstation": "purple",
  "OML 147 Flowstation": "orange",
};
