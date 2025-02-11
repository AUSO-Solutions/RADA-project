const admin = require("firebase-admin");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

const getOperationsReportSchedule = async () => {
  try {
    const db = admin.firestore();
    const collectionRef = db.collection("dailyReportSchedule");
    const snapshot = await collectionRef.limit(1).get();

    const schedule = snapshot.empty() ? null : snapshot.docs[0].data();
    return schedule;
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
};

const upsertOperationsReportSchedule = onCall(async (request) => {
  try {
    const { data } = request;
    const { hour } = data;

    const db = admin.firestore();
    const collectionRef = db.collection("dailyReportSchedule");
    const snapshot = await collectionRef.get();

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ hour: hour });
      console.log("Production report schedule updated");
    } else {
      await collectionRef.add({ hour: hour });
      console.log("Production report schedule created");
    }
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

const upsertDefermentReportSchedule = onCall(async (request) => {
  try {
    const { data } = request;
    const { hour, day } = data;

    const db = admin.firestore();
    const collectionRef = db.collection("monthlyReportSchedule");
    const snapshot = await collectionRef.get();

    console.log({ hour, day }, snapshot.empty)
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ hour, day });
      console.log("Deferment report schedule updated");
    } else {
      await collectionRef.add({ hour, day });
      console.log("Deferment report schedule created");
    }
    return { data: null, message: 'Successfull' }
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
});

const getDefermentReportSchedule = async () => {
  try {
    const db = admin.firestore();
    const collectionRef = db.collection("monthlyReportSchedule");
    const snapshot = await collectionRef.limit(1).get();

    const schedule = snapshot.empty() ? null : snapshot.docs[0].data();
    return schedule;
  } catch (error) {
    console.log({ error });
    if (error.message) throw new HttpsError(error?.code, error?.message);
    throw error;
  }
};

module.exports = {
  getDefermentReportSchedule,
  getOperationsReportSchedule,
  upsertOperationsReportSchedule,
  upsertDefermentReportSchedule,
};
