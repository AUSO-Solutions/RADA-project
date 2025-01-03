const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { appLogo, supportEmail } = require("../helpers");
const { sendEmail, generateEmail } = require("../helpers/nodemailer/config");
const { broadcastMail } = require("../helpers/nodemailer/templates");

const broadcast = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const {
      attachment,
      asset,
      groups = [],
      pagelink,
      subject,
      broadcastType,
      date,
      users = [],
    } = data;
    const db = admin.firestore();
    const members = groups.flatMap((group) =>
      group?.members.map((member) => ({ group: group?.groupName, ...member }))
    );

    const emailAddresses = Array.from(
      new Set(
        members
          ?.map((member) => member?.email)
          ?.concat(users?.map((user) => user?.email))
      )
    );

    let message = "";
    if (broadcastType === "wellTestandMer") {
      message = `<p>Please find attached ${asset} daily production report for 24hrs period starting 0600hr, ${date}.</p>`;
    } else {
      message = `<p>The production report(s) for ${asset} is/are already based on the producing strings for ${date}.</p>`;
    }

    const link = "https://ped-application-4d196.web.app";

    async function sendBulkEmails() {
      for (let address of emailAddresses) {
        const name =
          members?.find((member) => member?.email === address)?.name ||
          users?.find((user) => user?.email === address)?.name;

        const content = await generateEmail(
          {
            date,
            pageLink: link + pagelink,
            attachedFile: attachment,
            name,
            asset,
            appLogo,
            supportEmail,
            message,
          },
          broadcastMail
        );

        const mailSent = await sendEmail(address, content, subject);
        console.log(mailSent);
      }
    }

    await sendBulkEmails();

    // emailAddresses.forEach((address) => {
    //   const name =
    //     members?.find((member) => member?.email === address)?.name ||
    //     users?.find((user) => user?.email === address)?.name;
    //   var msg = {
    //     from: sender, // sender address
    //     to: address,
    //     subject, // Subject line
    //     html: broadcastTemplate({
    //       date,
    //       pageLink: link + pagelink,
    //       attactedFile: attachment,
    //       name,
    //       asset,
    //       broadcastType,
    //     }),
    //   };

    //   transporter.sendMail(msg, function (error, info) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log("Email sent: " + info.response);
    //     }
    //   });
    // });

    await db.collection("broadcast").add({
      attachment,
      groups,
      pagelink,
    });

    return {
      attachment,
      groups,
      pagelink,
    };
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

module.exports = {
  broadcast,
};
