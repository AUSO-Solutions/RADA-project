
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');

const createSetup = onCall(async (request) => {

    try {
        let { data } = request;

        const { asset, setupType, ...rest } = data;
        // const validAssets = ['OML 24', 'OML 155', 'OML 147', "OML 45"];
        // if (!validAssets.includes(asset)) {
        //     throw { message: 'Invalid asset', code: 'cancelled' };
        // }

        const id = crypto.randomBytes(8).toString("hex");
        const db = admin.firestore();
        const payload = {
            asset,
            id,
            created: Date.now(),
            ...rest
        }

        await db.collection('setups').doc(setupType).collection("setupList").doc(id).set(payload);

        return { message: `Document created`, data: payload };

    } catch (error) {
        console.error('Error adding document: ', error);
        throw new HttpsError(error)
    }
});

const updateSetup = onCall(async (request) => {

    try {
        let { data } = request;

        const { id, setupType, ...rest } = data;
        if (!id) {
            throw { message: 'Provide a setup id', code: 'cancelled' };
        }
        // const validReportTypes = ['Gross Liquid', 'Net Oil/ Condensate', 'Gas'];
        // if (!Array.isArray(reportTypes) || !reportTypes.filter(reportType => validReportTypes.includes(reportType)).length) {
        //     throw { message: 'Invalid report types', code: 'cancelled' };
        // }
        const db = admin.firestore();
        await db.collection('setups').doc(setupType).collection("setupList").doc(id).update({

            ...rest
        });

        return { message: `Setup updated` };

    } catch (error) {
        console.error('Error adding document: ', error);
        // return { message: 'Internal Server Error' };
        throw new HttpsError(error)
    }
});

const deleteSetup = onCall(async (request) => {

    try {
        let { data } = request;


        const { id, setupType } = data;
        if (!id) {
            throw { message: 'Provide a setup id', code: 'cancelled' };
        }

        const db = admin.firestore();
        await db.collection('setups').doc(setupType).collection("setupList").doc(id).delete()

        return { message: `Setup deleted` };

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
    return { message: "Successful ", data: res.docs.sort((a, b) => b.created - a.created).map(doc => ({ ...doc.data() })) }
})
const getSetup = onCall(async (request) => {
    const { data } = request
    const { setupType, id } = data
    const db = admin.firestore();
    const res = await db.
        collection('setups')
        .doc(setupType)
        .collection('setupList')
        .doc(id).get()
    return { message: "Successful ", data: res?.data() }
})


module.exports = { createSetup, getSetups, updateSetup, getSetup, deleteSetup }
