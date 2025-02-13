const { formatNumber } = require("../../helpers");

const PDFDocument = require("pdfkit");
const { getOperationsReportSchedule } = require("../schedules");
const { getOperationsReportData, getAssets } = require("../data");
const { transporter } = require("../../helpers");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone.js");
const Chart = require("chart.js");
const { createCanvas } = require("canvas");
const { onSchedule } = require("firebase-functions/v2/scheduler");

dayjs.extend(utc);
dayjs.extend(timezone);

const operationsReportScheduler = onSchedule(
  { schedule: "every 10 minutes", timeZone: "Africa/Lagos" },
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

    const date = "2025-02-04"; // dayjs(getPreviousData()).format("YYYY-MM-DD");

    const assets = ["OML 24"]; //await getAssets();

    for (let asset of assets) {
      const reportData = await getOperationsReportData(asset, date);
      console.log(reportData);
      // todo: Fetch the list of broadcast people, save as maillist. eg [emma.osademe@gmail.com, hilary.iyiebu@gmail]. The function will receive asset_name as argument, and return a list of all members within broadcast.
      await sendOperationsReport(reportData, asset, date);
    }
  } catch (error) {
    console.log(error);
  }
};

const sendOperationsReport = async (
  data,
  asset = "OML 24",
  date = "2025-02-02"
) => {
  const doc = new PDFDocument({ margin: 50, font: "Courier", size: "A4" });
  let verticalPosition = 50;

  // Create a PDF Buffer in Memory
  const pdfBuffer = await new Promise((resolve, reject) => {
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (error) => reject(error));

    // REPORT HEADER
    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("#000000")
      .text(`${asset} Production Report for ${date}`, 50, verticalPosition, {
        width: 495,
        align: "center",
      });
    // doc.moveDown(2);

    verticalPosition += 20;

    // drawHorizontalLine(doc, currentYPosition);

    doc
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
      .font("Courier-Bold")
      .fillColor("#000000")
      .text(`${asset} Production Summary`, 50, verticalPosition, {
        width: 495,
        align: "left",
      });
    const summaryData = getOperationsSummaryData(data);
    // doc.moveDown(1);
    verticalPosition += 20;

    // Summary Table Header
    doc
      .fontSize(14)
      .font("Courier")
      .text("VARIABLE", 50, verticalPosition, { width: 200, align: "left" })
      .text("VALUE", 250, verticalPosition, { width: 295, align: "left" });
    // doc.moveDown(1);

    for (let i = 0; i < summaryData.length; i++) {
      verticalPosition += 20;
      doc
        .fontSize(12)
        .font("Courier")
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
    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("#000000")
      .text(`${asset} Daily Production Report`, 50, verticalPosition, {
        width: 495,
        align: "left",
      });
    // doc.moveDown(2);
    verticalPosition += 20;

    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("#000000")
      .text(`Production Per Facility`, 50, verticalPosition, {
        width: 495,
        align: "left",
      });
    verticalPosition += 20;
    // doc.moveDown(2);

    const { header, units, facilitiesData } = getFacilitiesSummaryData(
      data?.facilities || []
    );

    // Header
    doc.fontSize(9).font("Courier");
    let horizontalPosition = 50;
    for (let i = 0; i < header.length; i++) {
      let width = i === 0 ? 75 : 52.5;
      doc.text(header[i], horizontalPosition, verticalPosition, {
        width: width,
        align: "left",
      });
      horizontalPosition += width;
    }
    verticalPosition += 30;

    doc.fontSize(9).font("Courier");
    horizontalPosition = 50;
    for (let i = 0; i < units.length; i++) {
      let width = i === 0 ? 75 : 52.5;
      doc.text(units[i], horizontalPosition, verticalPosition, {
        width: width,
        align: "left",
      });
      horizontalPosition += width;
    }
    // doc.moveDown(1);

    // Body
    for (let i = 0; i < facilitiesData.length; i++) {
      verticalPosition += 30;
      doc
        .fontSize(9)
        .font("Courier")
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
            align: "left",
          }
        )
        .text(facilitiesData[i].net || 0, 177.5, verticalPosition, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].water || 0, 230, verticalPosition, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].bsw || 0, 282.5, verticalPosition, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].producedGas || 0, 335, verticalPosition, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].utilisedGas || 0, 387.5, verticalPosition, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].exportGas || 0, 440, verticalPosition, {
          width: 52.5,
          align: "left",
        })
        .text(
          facilitiesData[i].flaredGas
            ? Number(facilitiesData[i].flaredGas).toFixed(2)
            : 0,
          492.5,
          verticalPosition,
          {
            width: 52.5,
            align: "left",
          }
        );
      // doc.moveDown(1);
    }

    // doc.moveDown(2);
    verticalPosition += 40;

    // Production Per String
    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("#000000")
      .text(`PRODUCTION PER STRING`, 50, verticalPosition, {
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
        .font("Courier-Bold")
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

      doc.fontSize(9).font("Courier");
      let horizontalPosition = 50;
      for (let i = 0; i < header.length; i++) {
        let width = i === 0 ? 105 : 65;
        doc
          .fontSize(9)
          .font("Courier")
          .text(header[i], horizontalPosition, verticalPosition, {
            width: width,
            align: "left",
          });
        horizontalPosition += width;
      }

      doc.fontSize(9).font("Courier");
      horizontalPosition = 50;
      verticalPosition += 20;
      resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;
      if (resetData.moveToNextPage) doc.addPage();
      for (let i = 0; i < units.length; i++) {
        let width = i === 0 ? 105 : 65;
        doc.text(units[i], horizontalPosition, verticalPosition, {
          width: width,
          align: "left",
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
          .font("Courier")
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
              align: "left",
            }
          )
          .text(prodString.oil || 0, 220, verticalPosition, {
            width: 65,
            align: "left",
          })
          .text(prodString.water || 0, 285, verticalPosition, {
            width: 65,
            align: "left",
          })
          .text(prodString.bsw || 0, 350, verticalPosition, {
            width: 65,
            align: "left",
          })
          .text(prodString.thp || "", 415, verticalPosition, {
            width: 65,
            align: "left",
          })
          .text(prodString.bean || "", 480, verticalPosition, {
            width: 65,
            align: "left",
          });

        // doc.moveDown(2);
        // verticalPosition += 40;
      }

      verticalPosition += 40;
      resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;
    }

    // Key Highlights
    if (Object.keys(data.oilHightlights || {}).length > 0) {
      doc
        .fontSize(16)
        .font("Courier-Bold")
        .fillColor("#A2D2FF")
        .text(`KEY HIGHLIGHTS - OIL FACILITIES`, 50, verticalPosition, {
          width: 495,
          align: "center",
        });
      // doc.moveDown(2);
      verticalPosition += 20;

      let resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;

      Object.entries(data.oilHightlights || {}).forEach(([key, value]) => {
        const highlights = Array.isArray(value) ? value : [];
        if (highlights.length > 0) {
          doc
            .fontSize(16)
            .font("Courier-Bold")
            .fillColor("#A2D2FF")
            .text(`${key.toUpperCase()}`, 50, verticalPosition, {
              width: 495,
              align: "left",
            });
          // doc.moveDown(1);
          verticalPosition += 20;

          for (let highlight of highlights) {
            doc
              .fontSize(12)
              .font("Courier")
              .text(highlight.name, 50, verticalPosition, {
                width: 110,
                align: "left",
              })
              .text(highlight.value, 160, verticalPosition, {
                width: 385,
                align: "left",
              });

            // doc.moveDown(2);
            verticalPosition += 40;
          }
        }
      });
    }

    // verticalPosition += 40
    if (Object.keys(data.gasHightlights || {}).length > 0) {
      doc
        .fontSize(16)
        .font("Courier-Bold")
        .fillColor("#A2D2FF")
        .text(`KEY HIGHLIGHTS - GAS FACILITIES`, 50, verticalPosition, {
          width: 495,
          align: "left",
        });
      // doc.moveDown(2);
      verticalPosition += 20;
      let resetData = resetVerticalPosition(verticalPosition);
      verticalPosition = resetData.newVerticalPosition;

      Object.entries(data.gasHightlights || {}).forEach(([key, value]) => {
        const highlights = Array.isArray(value) ? value : [];
        if (highlights.length > 0) {
          doc
            .fontSize(16)
            .font("Courier-Bold")
            .fillColor("#A2D2FF")
            .text(`${key.toUpperCase()}`, 50, verticalPosition, {
              width: 495,
              align: "left",
            });

          // doc.moveDown(2);
          verticalPosition += 20;
          resetData = resetVerticalPosition(verticalPosition);
          verticalPosition = resetData.newVerticalPosition;
          for (let highlight of highlights) {
            doc
              .fontSize(12)
              .font("Courier")
              .text(highlight.name, 50, verticalPosition, {
                width: 110,
                align: "left",
              })
              .text(highlight.value, 160, verticalPosition, {
                width: 385,
                align: "left",
              });

            // doc.moveDown(2);
            verticalPosition += 40;
          }
        }
      });
    }

    let resetData = resetVerticalPosition(verticalPosition);
    verticalPosition = resetData.newVerticalPosition;
    const stackedBarData = [
      data?.oilProductionChart,
      data?.gasProductionChart,
      data?.gasExportChart,
      data?.gasFlaredChart,
    ];
    console.log({
      oil: data.oilProductionChart,
      gas: data.gasProductionChart,
      flared: data.gasFlaredChart,
      export: data.gasExportChart,
    });

    // stackedBarData.forEach((chartData, index) => {
    //   doc.addPage();
    //   // Create a chart title
    //   doc.fontSize(16).text(`Chart ${index}`, { align: "center" });
    //   const chartImageBuffer = generateProductionChart(chartData);
    //   doc.image(chartImageBuffer, { width: 600, align: "center" });
    // });

    doc.end();
  });

  sendEmail(pdfBuffer, ["emma.osademe@gmail.com"], asset, date);
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
    "Produced Gas",
    "Utilised Gas",
    "Export Gas",
    "Flared Gas",
  ];
  const units = [
    "",
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
      "ProdString",
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

const getStackedBarConfiguration = (data) => {
  const datasets = [];

  Object.entries(data || {}).forEach(([key, value]) => {
    if (key !== "date") {
      datasets.push({
        label: key,
        data: value,
        backgroundColor: getRandomColor(),
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
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
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: true,
        },
      },
    },
  };
  return configuration;
};

const generateProductionChart = async (chartData) => {
  const width = 600;
  const height = 400;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const config = getStackedBarConfiguration(chartData);

  new Chart(context, config);

  return canvas.toBuffer();
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

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const resetVerticalPosition = (verticalPosition) => {
  const moveToNextPage = verticalPosition >= 740;
  const newVerticalPosition = verticalPosition >= 740 ? 50 : verticalPosition;
  return { newVerticalPosition, moveToNextPage };
};
