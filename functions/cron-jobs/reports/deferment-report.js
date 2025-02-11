const PDFDocument = require("pdfkit");
const functions = require("firebase-functions");
const { transporter } = require("../../helpers");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone.js");
const { getDefermentReportSchedule } = require("../schedules");
const { getDefermentReportData, getAssets } = require("../data");
const { onSchedule } = require("firebase-functions/v2/scheduler");

dayjs.extend(utc);
dayjs.extend(timezone);

// const defermentReportScheduler = functions.pubsub
//   .schedule("8 am every day")
//   .timezone("Africa/Lagos")
//   .onRun(async (context) => {
//     console.log("Running deferment report cron job");
//     await generateDefermentReport();
//   });

  const defermentReportScheduler = onSchedule(
    { schedule: "8 am every day", timeZone: "Africa/Lagos" },
    async (context) => {
          console.log("Running deferment report cron job");
      await  generateDefermentReport();
    })

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
  console.log(data, asset, date);
  const pdfBuffer = await new Promise((resolve, reject) => {
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (error) => reject(error));
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
