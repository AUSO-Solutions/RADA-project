const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require("crypto");
const { getUser } = require("../helpers/user");
const dayjs = require("dayjs");

const logActivity_ = async (request) => {
    try {
        // let { data } = request;
        const db = admin.firestore();

        const { idToken, message } = request
        const user = await getUser(idToken)
        const name = `${user?.firstName} ${user?.lastName}`
        const userId = user?.uid
        const logTime = dayjs().toISOString()
        const id = crypto.randomBytes(8).toString("hex");
        await db.collection('activityLogs')
            .doc(id)
            .set({
                id,
                userId,
                user: name,
                message,
                logTime
            })

        return { status: "success", message: "Saved to activity log!" };
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
}

const logActivity = onCall(logActivity_);

const getLogs = onCall(async (request) => {
    // const limit = 10;
    // const idToken = request.data?.idToken
    try {
        const db = admin.firestore();
        const data = (await db.collection("activityLogs").get()).docs.map(doc => doc.data())
        return { status: "success", data };
    } catch (error) {
        logger.log("error=>", error);
        return { status: "failed", error };
    }
});



module.exports = {
    logActivity,
    getLogs,
    logActivity_
};
