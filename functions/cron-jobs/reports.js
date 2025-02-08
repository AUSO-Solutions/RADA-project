const functions = require("firebase-functions");
const admin = require("firebase-admin");
const PDFDocument = require("pdfkit");
const { getOperationsReportSchedule } = require("./schedules");
const { getOperationsReportData } = require("./data");

const generateOperationsReport = functions.pubsub
  .schedule("every 10 minutes")
  .onRun(async (context) => {
    try {
      const schedules = await getOperationsReportSchedule();
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      for (let schedule of schedules) {
        const { minute, hour, asset } = schedule;
        if (minute === currentMinute && hour === currentHour) {
          const reportData = await getOperationsReportData(asset);
          await sendOperationsReport(reportData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

const sendOperationsReport = async (data, asset, date) => {
  const doc = new PDFDocument({ margin: 50, font: "Courier", size: "A$" });
  let currentYPosition = 50;

  // Header
  doc
    .fontSize(16)
    .font("Courier-Bold")
    .fillColor("#000000")
    .text(`${asset} Production Report for ${date}`, 50, currentYPosition, {
      width: 590,
      align: "center",
    });

  currentYPosition += 10;

  drawHorizontalLine(doc, currentYPosition);
  currentYPosition += 10;

  doc
    .fontSize(16)
    .fillColor("#000000")
    .text("RADA AMS Daily Production Data Report", 50, currentYPosition, {
      width: 590,
      align: "center",
    });

  currentYPosition += 20;

  // Production Summary
  doc
    .fontSize(16)
    .font("Courier-Bold")
    .fillColor("A2D2FF")
    .text(`${asset} Production Summary`, 50, currentYPosition, {
      width: 590,
      align: "center",
    });
  const summaryData = getOperationsSummaryData(data);
  currentYPosition += 20;

  // Summary Table Header
  doc
    .fontSize(14)
    .font("Courier-Bold")
    .text("VARIABLE", 50, currentYPosition, { width: 200, align: "left" })
    .text("VALUE", 200, currentYPosition, { width: 390, align: "left" });
  currentYPosition += 20;

  for (let i = 0; i < summaryData.length; i++) {
    doc
      .fontSize(12)
      .font("Courier")
      .text(summaryData[i].name, 50, currentYPosition, {
        width: 200,
        align: "left",
      })
      .text(summaryData[i].value, 200, currentYPosition, {
        width: 390,
        align: "left",
      });
    currentYPosition += 20;
  }

  currentYPosition += 20;

  // Facilites summary
  doc
    .fontSize(16)
    .font("Courier-Bold")
    .fillColor("A2D2FF")
    .text(`${asset} Daily Production Report`, 50, currentYPosition, {
      width: 590,
      align: "center",
    });
  currentYPosition += 30;

  doc
    .fontSize(16)
    .font("Courier-Bold")
    .fillColor("A2D2FF")
    .text(`Production Per Facility`, 50, currentYPosition, {
      width: 590,
      align: "center",
    });
  currentYPosition += 20;

  const { header, facilitiesData } = getFacilitiesSummaryData(
    data?.facilities || []
  );

  // Header
  doc.fontSize(12).font("Courier");
  for (let i = 0; i < header; i++) {
    doc.text(header[i], i === 0 ? 110 : 60, currentYPosition, {
      width: i === 0 ? 110 : 60,
      align: "left",
    });
  }
  currentYPosition += 20;
  // Body
  for (let i = 0; i < facilitiesData.length; i++) {
    doc
      .fontSize(12)
      .font("Courier")
      .text(facilitiesData[i].flowstation, 110, currentYPosition, {
        width: 110,
        align: "left",
      })
      .text(facilitiesData[i].gross, 60, currentYPosition, {
        width: 60,
        align: "left",
      })
      .text(facilitiesData[i].net, 60, currentYPosition, {
        width: 60,
        align: "left",
      })
      .text(facilitiesData[i].water, 60, currentYPosition, {
        width: 60,
        align: "left",
      })
      .text(facilitiesData[i].bsw, 60, currentYPosition, {
        width: 60,
        align: "left",
      })
      .text(facilitiesData[i].producedGas, 60, currentYPosition, {
        width: 60,
        align: "left",
      })
      .text(facilitiesData[i].utilisedGas, 60, currentYPosition, {
        width: 60,
        align: "left",
      })
      .text(facilitiesData[i].exportGas, 60, currentYPosition, {
        width: 60,
        align: "left",
      })
      .text(facilitiesData[i].flaredGas, 60, currentYPosition, {
        width: 60,
        align: "left",
      });
    currentYPosition += 20;
  }
};

const drawHorizontalLine = (doc, verticalPosition) => {
  doc
    .strokeColor("#000000")
    .linewidth(1)
    .moveTo(50, verticalPosition)
    .lineTo(550, verticalPosition)
    .stroke();
};

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

module.exports = {
  generateOperationsReport,
};
