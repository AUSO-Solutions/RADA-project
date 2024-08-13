// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const { onCall, HttpsError } = require('firebase-functions/v1/https');
// const db = admin.firestore();


const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
// const { currentTime } = require("../../helpers"); 

const generateSerialNumbers = (count) => {
    const serialNumbers = [];
    for (let i = 0; i < count; i++) {
        serialNumbers.push(`SN-${Math.random().toString(36).substring(2, 9)}`);
    }
    return serialNumbers;
};

const setupVolumeMeasurement = onCall(async (request) => {

    try {
        let { data } = request;

        const { asset, reportTypes, flowStations, timeFrame } = data;

        // const validAssets = ['OML24', 'OML152', 'OML147' ];
        const oml = await db.collection("olms").where("name", "==", asset).get()
        if (!oml.includes(asset)) {
            return { message: 'Invalid asset', code: 'cancelled' };
        }

        const validReportTypes = ['Gross Liquid', 'Net Oil/ Condensate', 'Gas'];
        if (!Array.isArray(reportTypes) || reportTypes.length !== 2 || !reportTypes.every(type => validReportTypes.includes(type))) {
            return { message: 'Invalid report types', code: 'cancelled' };
        }

        const id = crypto.randomBytes(8).toString("hex");
        const db = admin.firestore();

        const docRef = await db.collection('setups').doc('volumeMeasurement').collection("setupList").doc(id).set({
            asset,
            reportTypes,
            flowStations,
            timeFrame, id
        });

        return { message: `Document created` };

    } catch (error) {
        console.error('Error adding document: ', error);
        // return { message: 'Internal Server Error' };
        throw new HttpsError(error)
    }
});

const updateVolumeMeasurement = onCall(async (request) => {

    try {
        let { data } = request;
     

        const { reportTypes, flowStations, timeFrame, id } = data;
        if(!id){
            throw { message: 'Provide a setup id', code: 'cancelled' };
        }
        const validReportTypes = ['Gross Liquid', 'Net Oil/ Condensate', 'Gas'];
        if (!Array.isArray(reportTypes) || reportTypes.length !== 2 || !reportTypes.every(type => validReportTypes.includes(type))) {
            throw { message: 'Invalid report types', code: 'cancelled' };
        }
        const db = admin.firestore();
        await db.collection('setups').doc('volumeMeasurement').collection("setupList").doc(id).update({
            reportTypes,
            flowStations,
            timeFrame
        });

        return { message: `Document update` };

    } catch (error) {
        console.error('Error adding document: ', error);
        // return { message: 'Internal Server Error' };
        throw new HttpsError(error)
    }
});

const getSetups = onCall(async (request) => {
    const { data } = request
    const setupType = data?.setupType
    const db = admin.firestore();
    const res = await db.collection('setups').doc(setupType).collection('setupList').get()
    return { message: "Successful ", data: res.docs.map(doc => doc.data()) }
})


module.exports = { setupVolumeMeasurement, getSetups, updateVolumeMeasurement }
