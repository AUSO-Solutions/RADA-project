const admin = require("firebase-admin");
const { HttpsError } = require("firebase-functions/v2/https");

const getOperationsReportSchedule = async () => {
  try {
    const db = admin.firestore();
    const schedules = (
      await db.collection("dailyReportSchedule").get()
    ).docs.map((doc) => doc.data());
    return schedules;
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
};

const getDefermentReportSchedule = async () => {
  try {
    const db = admin.firestore();
    const schedules = (
      await db.collection("monthlyReportSchedule").get()
    ).docs.map((doc) => doc.data());
    return schedules;
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
};

module.exports = {
  getDefermentReportSchedule,
  getOperationsReportSchedule,
};
