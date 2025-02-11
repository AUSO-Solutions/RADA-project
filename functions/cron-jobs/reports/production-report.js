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
  { schedule: "every 1 hours", timeZone: "Africa/Lagos" },
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

    if (hour !== currNigerianTime.hour()) return;

    const date = dayjs(getPreviousData).format("YYYY-MM-DD");

    const assets = await getAssets();

    for (let asset of assets) {
      const reportData = await getOperationsReportData(asset, date);
      await sendOperationsReport(reportData, asset, date);
    }
  } catch (error) {
    console.log(error);
  }
};

const sendOperationsReport = async (data, asset, date) => {
  const doc = new PDFDocument({ margin: 50, font: "Courier", size: "A4" });

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
      .text(`${asset} Production Report for ${date}`, 50, {
        width: 495,
        align: "center",
      });

    doc.moveDown(2);

    // drawHorizontalLine(doc, currentYPosition);

    doc
      .fontSize(16)
      .fillColor("#000000")
      .text("RADA AMS Daily Production Data Report", 50, {
        width: 495,
        align: "center",
      });

    doc.moveDown(3);

    // Production Summary
    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("A2D2FF")
      .text(`${asset} Production Summary`, 50, {
        width: 495,
        align: "center",
      });
    const summaryData = getOperationsSummaryData(data);
    doc.moveDown(1);

    // Summary Table Header
    doc
      .fontSize(14)
      .font("Courier-Bold")
      .text("VARIABLE", 50, { width: 200, align: "left" })
      .text("VALUE", 250, { width: 295, align: "left" });
    doc.moveDown(1);

    for (let i = 0; i < summaryData.length; i++) {
      doc
        .fontSize(12)
        .font("Courier")
        .text(summaryData[i].name, 50, {
          width: 200,
          align: "left",
        })
        .text(summaryData[i].value, 250, {
          width: 295,
          align: "left",
        });
      doc.moveDown(1);
    }

    doc.moveDown(2);

    // Facilites summary
    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("A2D2FF")
      .text(`${asset} Daily Production Report`, 50, {
        width: 495,
        align: "center",
      });
    doc.moveDown(2);

    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("A2D2FF")
      .text(`Production Per Facility`, 50, {
        width: 495,
        align: "center",
      });
    doc.moveDown(2);

    const { header, facilitiesData } = getFacilitiesSummaryData(
      data?.facilities || []
    );

    // Header
    doc.fontSize(12).font("Courier");
    let horizontalPosition = 50;
    for (let i = 0; i < header; i++) {
      let width = i === 0 ? 75 : 52.5;
      doc.text(header[i], horizontalPosition, {
        width: width,
        align: "left",
      });
      horizontalPosition += width;
    }
    doc.moveDown(1);

    // Body
    for (let i = 0; i < facilitiesData.length; i++) {
      doc
        .fontSize(12)
        .font("Courier")
        .text(facilitiesData[i].flowstation, 50, {
          width: 75,
          align: "left",
        })
        .text(facilitiesData[i].gross, 125, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].net, 177.5, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].water, 230, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].bsw, 282.5, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].producedGas, 335, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].utilisedGas, 387.5, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].exportGas, 440, {
          width: 52.5,
          align: "left",
        })
        .text(facilitiesData[i].flaredGas, 492.5, {
          width: 52.5,
          align: "left",
        });
      doc.moveDown(1);
    }

    doc.moveDown(2);

    // Production Per String
    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("#A2D2FF")
      .text(`PRODUCTION PER STRING`, 50, {
        width: 495,
        align: "center",
      });
    doc.moveDown(2);

    const facilitiesProdData = getFlowstationsProduction(
      data.sortedProduction || {}
    );

    for (let facility of facilitiesProdData) {
      const { flowstation, header, data } = facility;
      doc
        .fontSize(16)
        .font("Courier-Bold")
        .fillColor("#A2D2FF")
        .text(`${flowstation.toUpperCase()} Flowstation`, 50, {
          width: 495,
          align: "center",
        });
      doc.moveDown(1);

      let horizontalPosition = 50;
      for (let i = 0; i < header; i++) {
        let width = i === 0 ? 105 : 65;
        doc.fontSize(12).font("Courier").text(header[i], horizontalPosition, {
          width: width,
          align: "left",
        });
        horizontalPosition += width;
      }
      doc.moveDown(1);
      for (let prodString of data) {
        doc
          .fontSize(12)
          .font("Courier")
          .text(prodString.productionString, 50, {
            width: 105,
            align: "left",
          })
          .text(prodString.gross, 155, {
            width: 65,
            align: "left",
          })
          .text(prodString.oil, 220, {
            width: 65,
            align: "left",
          })
          .text(prodString.water, 285, {
            width: 65,
            align: "left",
          })
          .text(prodString.bsw, 350, {
            width: 65,
            align: "left",
          })
          .text(prodString.thp, 415, {
            width: 65,
            align: "left",
          })
          .text(prodString.bean, 480, {
            width: 65,
            align: "left",
          });

        doc.moveDown(2);
      }
    }

    // Key Highlights
    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("#A2D2FF")
      .text(`KEY HIGHLIGHTS - OIL FACILITIES`, 50, {
        width: 495,
        align: "center",
      });
    doc.moveDown(2);

    Object.entries(data?.oilHightlights).forEach(([key, value]) => {
      const highlights = Array.isArray(value) ? value : [];
      if (highlights.length > 0) {
        doc
          .fontSize(16)
          .font("Courier-Bold")
          .fillColor("#A2D2FF")
          .text(`${key.toUpperCase()}`, 50, {
            width: 495,
            align: "center",
          });
        doc.moveDown(1);

        for (let highlight of highlights) {
          doc
            .fontSize(12)
            .font("Courier")
            .text(highlight.name, 50, {
              width: 110,
              align: "left",
            })
            .text(highlight.value, 160, {
              width: 385,
              align: "left",
            });

          doc.moveDown(2);
        }
      }
    });

    doc
      .fontSize(16)
      .font("Courier-Bold")
      .fillColor("#A2D2FF")
      .text(`KEY HIGHLIGHTS - GAS FACILITIES`, 50, {
        width: 495,
        align: "center",
      });
    doc.moveDown(2);

    Object.entries(data?.gasHightlights).forEach(([key, value]) => {
      const highlights = Array.isArray(value) ? value : [];
      if (highlights.length > 0) {
        doc
          .fontSize(16)
          .font("Courier-Bold")
          .fillColor("#A2D2FF")
          .text(`${key.toUpperCase()}`, 50, {
            width: 495,
            align: "center",
          });

        doc.moveDown(2);
        for (let highlight of highlights) {
          doc
            .fontSize(12)
            .font("Courier")
            .text(highlight.name, 50, {
              width: 110,
              align: "left",
            })
            .text(highlight.value, 160, {
              width: 385,
              align: "left",
            });

          doc.moveDown(2);
        }
      }
    });

    const stackedBarData = [
      data?.oilProductionChart,
      data?.gasProductionChart,
      data?.gasExportChart,
      data?.gasFlaredChart,
    ];

    stackedBarData.forEach((chartData, index) => {
      doc.addPage();
      // Create a chart title
      doc.fontSize(16).text(`Chart ${index}`, { align: "center" });
      const chartImageBuffer = generateProductionChart(chartData);
      doc.image(chartImageBuffer, { width: 600, align: "center" });
    });

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
    { name: "Gross (blpd)", value: (data?.summary?.totalGross).toFixed(2) },
    { name: "Net Oil (bopd)", value: (data?.summary?.totalOil).toFixed(2) },
    { name: "BS&W (%)", value: (data?.summary?.bsw).toFixed(2) },
    {
      name: "Produced Gas (MMscf/d)",
      value: (data?.summary?.totalGas).toFixed(2),
    },
    {
      name: "Flared Gas (MMscf/d)",
      value: (data?.summary?.totalFlaredGas).toFixed(2),
    },
    {
      name: "Export Gas (MMscf/d)",
      value: (data?.summary?.totalExport).toFixed(2),
    },
    {
      name: "Utilized Gas (MMscf/d)",
      value: (data?.summary?.totalUtilisedGas).toFixed(2),
    },
  ];
};

const getFacilitiesSummaryData = (data) => {
  const result = [];

  for (let facility of data) {
    result.push({
      flowstation: facility.flowstation,
      gross: (facility.gross || 0).toFixed(2),
      net: (facility.net || 0).toFixed(2),
      water: (facility.gross || 0 * facility.bsw || 0 * 0.01).toFixed(2),
      bsw: (facility.bsw || 0).toFixed(2),
      producedGas: (facility.producedGas || 0).toFixed(2),
      utilisedGas: (facility.utilisedGas || 0).toFixed(),
      exportGas: (facility.exportGas || 0).toFixed(2),
      flaredGas: (facility.flaredGas || 0).toFixed(2),
    });
  }
  const header = [
    "",
    "Gross (blpd)",
    "Net (bopd)",
    "Water (bwpd)",
    "Produced Gas (MMscf/d)",
    "Utilised Gas (MMscf/d)",
    "Export Gas (MMscf/d)",
    "Flared Gas (MMscf/d)",
  ];
  return { header, facilitiesData: result };
};

const getFlowstationsProduction = (data) => {
  return Object.entries(data).map(([key, value]) => {
    const prodData = Array.isArray(value) ? value : [];
    const header = [
      key,
      "Gross (blpd)",
      "Net (bopd)",
      "Water (bwpd)",
      "BS&W (%)",
      "THP (psi)",
      "Choke Size (/64)",
    ];
    const body = prodData.map((prodString) => ({
      productionString: prodString.productionString,
      gross: (prodString.gross || 0).toFixed(2),
      oil: (prodString.oil || 0).Fixed(2),
      water: (prodString.water || 0).toFixed(2),
      bsw: (
        ((prodString.water || 0) * 100) /
        ((prodString.oil || 0) + (prodString.water || 0))
      ).toFixed(2),
      thp: prodString.thp ? prodString.thp.toFixed(2) : "",
      bean: prodString.bean || "",
    }));

    return { header, flowstation: key, data: body };
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
