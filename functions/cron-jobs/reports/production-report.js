const { formatNumber } = require("../../helpers");

const PDFDocument = require("pdfkit");
const { getOperationsReportSchedule } = require("../schedules");
const { getOperationsReportData, getAssets } = require("../data");
const { transporter } = require("../../helpers");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone.js");
const { Chart } = require("chart.js/auto");
const { createCanvas } = require("canvas");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall } = require("firebase-functions/https");
const getUsersPerAsset = require("../../helpers/getUsersPerAsset");

dayjs.extend(utc);
dayjs.extend(timezone);

const operationsReportScheduler = onSchedule(
  { schedule: "every 5 minutes", timeZone: "Africa/Lagos" },
  async (context) => {
    console.log("Running cron job");
    await generateOperationsReport();
  }
);

module.exports = { operationsReportScheduler };

const generateOperationsReport = async () => {
  try {
    const schedule = await getOperationsReportSchedule();
    if (!schedule) return;
    const { hour } = schedule;
    const currNigerianTime = dayjs().tz("Africa/Lagos");
    console.log({ currNigerianTime, hour });

    if (hour !== currNigerianTime.hour()) return;

    const date = "2025-02-12"; // dayjs(getPreviousData()).format("YYYY-MM-DD");

    const usersPerAssets = await getUsersPerAsset()
    console.log({ usersPerAssets })
    Object.entries(usersPerAssets).forEach(async (item) => {
      const asset = item[0]
      const usersInAsset = item[1]
      const mailList = usersInAsset.map(user => user?.email)
      const reportData = await getOperationsReportData(asset, date);
      //['kehindesalaudeen222@gmail.com', 'emma.osademe@gmail.com', 'emmanueloludairo61@gmail.com', 'geediegramgu@gmail.com']
      await sendOperationsReport(reportData, asset, date, mailList)
    })
  } catch (error) {
    console.log(error);
  }
};

const sendOperationsReport = async (
  data,
  asset = "OML 24",
  date = "2025-02-02",
  mailList = []
) => {
  const font = {
    bold: "Helvetica-Bold",
    normal: "Helvetica",
  };
  const doc = new PDFDocument({ margin: 50, font: font.bold, size: "A4" });
  let verticalPosition = 50;

  const oilChartBuffer = await generateProductionChart(
    data.oilProductionChart || {},
    `Daily Oil Production for ${asset}`,
    "Date",
    "Oil Produced (bopd)"
  );

  const gasChartBuffer = await generateProductionChart(
    data.gasProductionChart || {},
    `Daily Gas Production for ${asset}`,
    "Date",
    "Gas Produced (MMscf/d)"
  );

  const gasFlaredChartBuffer = await generateProductionChart(
    data.gasFlaredChart || {},
    `Daily Gas Flared for ${asset}`,
    "Date",
    "Gas Flared (MMscf/d)"
  );

  const gasExportChartBuffer = await generateProductionChart(
    data.gasProductionChart || {},
    `Daily Gas Exported for ${asset}`,
    "Date",
    "Gas Exported (MMscf/d)"
  );
  // Create a PDF Buffer in Memory
  const pdfBuffer = await new Promise((resolve, reject) => {
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (error) => reject(error));

    // REPORT HEADER
    doc
      .fontSize(16)
      .font(font.bold)
      .fillColor("#000000")
      .text(`${asset} Production Report for ${date}`, 50, verticalPosition, {
        width: 495,
        align: "center",
      });
    // doc.moveDown(2);

    verticalPosition += 20;

    // drawHorizontalLine(doc, currentYPosition);

    doc
      .font(font.normal)
      .fontSize(16)
      .fillColor("#000000")
      .text("RADA AMS Daily Production Data Report", 50, verticalPosition, {
        width: 495,
        align: "center",
      });

    verticalPosition += 40;
    // doc.moveDown(3);

    // Production Summary
    doc
      .fontSize(16)
      .font(font.bold)
      .fillColor("#000000")
      .text(`Production Summary`, 50, verticalPosition, {
        width: 495,
        align: "left",
      });
    const summaryData = getOperationsSummaryData(data);
    // doc.moveDown(1);
    // verticalPosition += 20;

    // Summary Table Header
    // doc
    //   .fontSize(14)
    //   .font(font.normal)
    //   .text("VARIABLE", 50, verticalPosition, { width: 200, align: "left" })
    //   .text("VALUE", 250, verticalPosition, { width: 295, align: "left" });
    // doc.moveDown(1);

    for (let i = 0; i < summaryData.length; i++) {
      verticalPosition += 20;
      doc
        .fontSize(10)
        .font(font.normal)
        .text(summaryData[i].name, 50, verticalPosition, {
          width: 200,
          align: "left",
        })
        .text(summaryData[i].value || 0, 250, verticalPosition, {
          width: 295,
          align: "left",
        });
    }

    verticalPosition += 40;

    // Facilites summary
    // doc
    //   .fontSize(16)
    //   .font(font.bold)
    //   .fillColor("#000000")
    //   .text(`Daily Production Report`, 50, verticalPosition, {
    //     width: 495,
    //     align: "left",
    //   });
    // // doc.moveDown(2);
    // verticalPosition += 20;

    doc
      .fontSize(16)
      .font(font.bold)
      .fillColor("#000000")
      .text(`Flowstations Summary`, 50, verticalPosition, {
        width: 495,
        align: "left",
      });
    verticalPosition += 20;
    // doc.moveDown(2);

    const { header, units, facilitiesData } = getFacilitiesSummaryData(
      data?.facilities || []
    );

    // Header
    doc.fontSize(9).font(font.normal);
    let horizontalPosition = 50;
    for (let i = 0; i < header.length; i++) {
      let width = i === 0 ? 75 : 52.5;
      doc.text(header[i], horizontalPosition, verticalPosition, {
        width: width,
        align: `${i === 0 ? "left" : "center"}`,
      });
      horizontalPosition += width;
    }
    verticalPosition += 30;

    doc.fontSize(8).font(font.normal);
    horizontalPosition = 50;
    for (let i = 0; i < units.length; i++) {
      let width = i === 0 ? 75 : 52.5;
      doc.text(units[i], horizontalPosition, verticalPosition, {
        width: width,
        align: `${i === 0 ? "left" : "center"}`,
      });
      horizontalPosition += width;
    }
    // doc.moveDown(1);

    // Body
    for (let i = 0; i < facilitiesData.length; i++) {
      verticalPosition += 30;
      doc
        .fontSize(8)
        .font(font.normal)
        .text(facilitiesData[i].flowstation, 50, verticalPosition, {
          width: 75,
          align: "left",
        })
        .text(
          facilitiesData[i].gross
            ? Number(facilitiesData[i].gross).toFixed(2)
            : 0,
          125,
          verticalPosition,
          {
            width: 52.5,
            align: "center",
          }
        )
        .text(facilitiesData[i].net || 0, 177.5, verticalPosition, {
          width: 52.5,
          align: "center",
        })
        .text(facilitiesData[i].water || 0, 230, verticalPosition, {
          width: 52.5,
          align: "center",
        })
        .text(facilitiesData[i].bsw || 0, 282.5, verticalPosition, {
          width: 52.5,
          align: "center",
        })
        .text(facilitiesData[i].producedGas || 0, 335, verticalPosition, {
          width: 52.5,
          align: "center",
        })
        .text(facilitiesData[i].utilisedGas || 0, 387.5, verticalPosition, {
          width: 52.5,
          align: "center",
        })
        .text(facilitiesData[i].exportGas || 0, 440, verticalPosition, {
          width: 52.5,
          align: "center",
        })
        .text(
          facilitiesData[i].flaredGas
            ? Number(facilitiesData[i].flaredGas).toFixed(2)
            : 0,
          492.5,
          verticalPosition,
          {
            width: 52.5,
            align: "center",
          }
        );
      // doc.moveDown(1);
    }

    // doc.moveDown(2);
    verticalPosition += 40;

    // Production Per String
    doc
      .fontSize(16)
      .font(font.bold)
      .fillColor("#000000")
      .text(`PRODUCTION PER FLOWSTATION`, 50, verticalPosition, {
        width: 495,
        align: "left",
      });
    // doc.moveDown(2);
    verticalPosition += 20;

    // verticalPosition = 50;

    const facilitiesProdData = getFlowstationsProduction(
      data.sortedProduction || {}
    );

    for (let facility of facilitiesProdData) {
      const { flowstation, header, data, units } = facility;
      doc
        .fontSize(16)
        .font(font.bold)
        .fillColor("#000000")
        .text(`${flowstation.toUpperCase()}`, 50, verticalPosition, {
          width: 495,
          align: "left",
        });
      // doc.moveDown(1);
      verticalPosition += 20;
      let resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;
      if (resetData.moveToNextPage) doc.addPage();

      doc.fontSize(9).font(font.normal);
      let horizontalPosition = 50;
      for (let i = 0; i < header.length; i++) {
        let width = i === 0 ? 105 : 65;
        doc
          .fontSize(9)
          .font(font.normal)
          .text(header[i], horizontalPosition, verticalPosition, {
            width: width,
            align: `${i === 0 ? "left" : "center"}`,
          });
        horizontalPosition += width;
      }

      doc.fontSize(9).font(font.normal);
      horizontalPosition = 50;
      verticalPosition += 20;
      resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;
      if (resetData.moveToNextPage) doc.addPage();
      for (let i = 0; i < units.length; i++) {
        let width = i === 0 ? 105 : 65;
        doc.text(units[i], horizontalPosition, verticalPosition, {
          width: width,
          align: `${i === 0 ? "left" : "center"}`,
        });
        horizontalPosition += width;
      }
      // doc.moveDown(1);

      for (let prodString of data) {
        verticalPosition += 20;
        resetData = resetVerticalPosition(verticalPosition);
        verticalPosition = resetData.newVerticalPosition;
        if (resetData.moveToNextPage) doc.addPage();
        doc
          .fontSize(9)
          .font(font.normal)
          .text(prodString.productionString, 50, verticalPosition, {
            width: 105,
            align: "left",
          })
          .text(
            (Number(prodString.gross) || 0).toFixed(2),
            155,
            verticalPosition,
            {
              width: 65,
              align: "center",
            }
          )
          .text(prodString.oil || 0, 220, verticalPosition, {
            width: 65,
            align: "center",
          })
          .text(prodString.water || 0, 285, verticalPosition, {
            width: 65,
            align: "center",
          })
          .text(prodString.bsw || 0, 350, verticalPosition, {
            width: 65,
            align: "center",
          })
          .text(prodString.thp || "", 415, verticalPosition, {
            width: 65,
            align: "center",
          })
          .text(prodString.bean || "", 480, verticalPosition, {
            width: 65,
            align: "center",
          });

        // doc.moveDown(2);
        // verticalPosition += 40;
      }

      verticalPosition += 40;
      resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;
      if (resetData.moveToNextPage) doc.addPage();
    }

    // Key Highlights
    if (Object.keys(data.oilHightlights || {}).length > 0) {
      doc
        .fontSize(16)
        .font(font.bold)
        .fillColor("#A2D2FF")
        .text(`KEY HIGHLIGHTS - OIL FACILITIES`, 50, verticalPosition, {
          width: 495,
          align: "center",
        });
      // doc.moveDown(2);
      verticalPosition += 20;

      let resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;
      if (resetData.moveToNextPage) doc.addPage();

      Object.entries(data.oilHightlights || {}).forEach(([key, value]) => {
        const highlights = Array.isArray(value) ? value : [];
        if (highlights.length > 0) {
          doc
            .fontSize(16)
            .font(font.bold)
            .fillColor("#A2D2FF")
            .text(`${key.toUpperCase()}`, 50, verticalPosition, {
              width: 495,
              align: "center",
            });
          // doc.moveDown(1);
          verticalPosition += 20;
          resetData = resetVerticalPosition(verticalPosition);
          if (resetData.moveToNextPage) doc.addPage();

          for (let highlight of highlights) {
            doc
              .fontSize(12)
              .font(font.normal)
              .text(highlight.name, 50, verticalPosition, {
                width: 110,
                align: "center",
              })
              .text(highlight.value, 160, verticalPosition, {
                width: 385,
                align: "center",
              });

            const numOfLines = estimateNumberOfLines(highlight.value);

            // doc.moveDown(2);
            verticalPosition += numOfLines * 20;
            resetData = resetVerticalPosition(verticalPosition);
            if (resetData.moveToNextPage) doc.addPage();
          }
        }
      });
      verticalPosition += 40;
    }

    // verticalPosition += 40
    if (Object.keys(data.gasHightlights || {}).length > 0) {
      doc
        .fontSize(16)
        .font(font.bold)
        .fillColor("#000000")
        .text(`KEY HIGHLIGHTS - GAS FACILITIES`, 50, verticalPosition, {
          width: 495,
          align: "center",
        });
      // doc.moveDown(2);
      verticalPosition += 20;
      let resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;
      if (resetData.moveToNextPage) doc.addPage();

      Object.entries(data.gasHightlights || {}).forEach(([key, value]) => {
        const highlights = Array.isArray(value) ? value : [];
        if (highlights.length > 0) {
          doc
            .fontSize(16)
            .font(font.bold)
            .fillColor("#000000")
            .text(`${key.toUpperCase()}`, 50, verticalPosition, {
              width: 495,
              align: "center",
            });

          // doc.moveDown(2);
          verticalPosition += 20;
          resetData = resetVerticalPosition(verticalPosition);
          verticalPosition = resetData.newVerticalPosition;
          if (resetData.moveToNextPage) doc.addPage();
          for (let highlight of highlights) {
            doc
              .fontSize(12)
              .font(font.normal)
              .text(highlight.name, 50, verticalPosition, {
                width: 110,
                align: "center",
              })
              .text(highlight.value, 160, verticalPosition, {
                width: 385,
                align: "center",
              });

            const numOfLines = estimateNumberOfLines(highlight.value);

            // doc.moveDown(2);
            verticalPosition += numOfLines * 20;
            resetData = resetVerticalPosition(verticalPosition);
            if (resetData.moveToNextPage) doc.addPage();
          }
        }
      });
    }

    let resetData = resetVerticalPosition(verticalPosition);
    verticalPosition = resetData.newVerticalPosition;
    if (resetData.moveToNextPage) doc.addPage();

    let verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (oilChartBuffer) {
      if (verticalChecker.moveToNextPage) {
        doc.addPage();
        verticalPosition = 50;
      }

      doc.image(oilChartBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
      verticalPosition += 320;
    }

    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (gasChartBuffer) {
      if (verticalChecker.moveToNextPage) {
        doc.addPage();
        verticalPosition = 50;
      }
      doc.image(gasChartBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
      verticalPosition += 320;
    }
    verticalChecker = resetImageVerticalPosition(verticalPosition);
    if (gasFlaredChartBuffer) {
      if (verticalChecker.moveToNextPage) {
        doc.addPage();
        verticalPosition = 50;
      }
      doc.image(gasFlaredChartBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
      verticalPosition += 320;
    }

    verticalChecker = resetImageVerticalPosition(verticalPosition);

    if (gasExportChartBuffer) {
      if (verticalChecker.moveToNextPage) {
        doc.addPage();
        verticalPosition = 50;
      }
      doc.image(gasExportChartBuffer, 50, verticalPosition, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    }

    doc.end();
  });

  sendEmail(pdfBuffer, mailList, asset, date);
};

// const drawHorizontalLine = (doc, verticalPosition) => {
//   doc
//     .strokeColor("#000000")
//     .linewidth(1)
//     .moveTo(50, verticalPosition)
//     .lineTo(545, verticalPosition)
//     .stroke();
// };

const getOperationsSummaryData = (data) => {
  return [
    {
      name: "Gross (blpd)",
      value: data.summary.totalGross
        ? Number(data.summary.totalGross).toFixed(2)
        : 0,
    },
    {
      name: "Net Oil (bopd)",
      value: data?.summary?.totalOil || 0,
    },
    { name: "BS&W (%)", value: data?.summary?.bsw || 0 },
    {
      name: "Produced Gas (MMscf/d)",
      value: data?.summary?.totalGas || 0,
    },
    {
      name: "Flared Gas (MMscf/d)",
      value: data.summary.totalFlaredGas
        ? Number(data.summary.totalFlaredGas).toFixed(2)
        : 0,
    },
    {
      name: "Export Gas (MMscf/d)",
      value: data?.summary?.totalExport || 0,
    },
    {
      name: "Utilized Gas (MMscf/d)",
      value: data?.summary?.totalUtilisedGas || 0,
    },
  ];
};

const getFacilitiesSummaryData = (data) => {
  const result = [];

  for (let facility of data) {
    result.push({
      flowstation: facility.flowstation,
      gross: facility.gross || 0,
      net: facility.net || 0,
      water: (facility.gross * facility.bsw * 0.01).toFixed(2) || 0,
      bsw: facility.bsw || 0,
      producedGas: facility.producedGas || 0,
      utilisedGas: facility.utilisedGas || 0,
      exportGas: facility.exportGas || 0,
      flaredGas: facility.flaredGas || 0,
    });
  }
  const header = [
    "",
    "Gross",
    "Net",
    "Water",
    "BS&W",
    "Total Gas",
    "Fuel Gas",
    "Export Gas",
    "Flared Gas",
  ];
  const units = [
    "Flowstation",
    "(blpd)",
    "(bopd)",
    "(bwpd)",
    "(%)",
    "(MMscf/d)",
    "(MMscf/d)",
    "(MMscf/d)",
    "(MMscf/d)",
  ];
  return { header, units, facilitiesData: result };
};

const getFlowstationsProduction = (data) => {
  return Object.entries(data).map(([key, value]) => {
    const prodData = Array.isArray(value) ? value : [];
    const header = ["", "Gross", "Net", "Water", "BS&W", "THP", "Bean"];

    const units = [
      "Production String",
      "(blpd)",
      "(bopd)",
      "(bwpd)",
      "(%)",
      "(psi)",
      "(/64)",
    ];

    const body = prodData.map((prodString) => ({
      productionString: prodString.productionString,
      gross: formatNumber(prodString.gross),
      oil: formatNumber(prodString.oil),
      water: formatNumber(prodString.water),
      bsw: Number(
        formatNumber(prodString.water * 100) /
        (prodString.oil + prodString.water)
      ).toFixed(2),
      thp: prodString.thp ? prodString.thp.toFixed(2) : "",
      bean: prodString.bean || "",
    }));

    return { header, flowstation: key, data: body, units };
  });
};

const getStackedBarConfiguration = (data, title, xlabel, ylabel) => {
  const datasets = [];

  Object.entries(data || {}).forEach(([key, value], index) => {
    if (key !== "date") {
      datasets.push({
        label: key,
        data: value,
        backgroundColor: getRandomColor(index),
        borderColor: "rgba(0, 0, 0, 1)",
        // borderWidth: 1,
      });
    }
  });

  const configuration = {
    type: "bar",
    data: {
      labels: data.date,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${title}`,
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
            text: `${xlabel}`,
            font: { size: 14 },
          },
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: `${ylabel}`,
            font: { size: 14 },
          },
        },
      },
    },
  };
  return configuration;
};

const generateProductionChart = async (chartData, title, xlabel, ylabel) => {
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const config = getStackedBarConfiguration(chartData, title, xlabel, ylabel);

  config.options.plugins["beforeDraw"] = function (chart) {
    const context = chart.context;
    const chartArea = chart.chartArea;
    const padding = 10;

    context.save();
    context.lineWidth = 5;
    context.strokeStyle = "rgba(0, 0, 0, 1)";

    context.beginPath();
    context.rect(
      chartArea.left - padding,
      chartArea.top - padding,
      chartArea.right - chartArea.left + 2 * padding,
      chartArea.bottom - chartArea.top + 2 * padding
    );
    context.stroke();
    context.restore();
  };

  new Chart(context, config);

  return canvas.toBuffer("image/png");
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

const getPreviousData = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today;
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

const resetVerticalPosition = (verticalPosition) => {
  const moveToNextPage = verticalPosition >= 740;
  const newVerticalPosition = verticalPosition >= 740 ? 50 : verticalPosition;
  return { newVerticalPosition, moveToNextPage };
};

const resetImageVerticalPosition = (verticalPosition) => {
  const moveToNextPage = 390 - verticalPosition < 0;
  const newVerticalPosition = moveToNextPage ? 50 : verticalPosition;
  return { moveToNextPage, newVerticalPosition };
};

const estimateNumberOfLines = (words) => {
  return Math.ceil(words.length / 80) + 1;
};
