const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall, HttpsError } = require('firebase-functions/v1/https');
admin.initializeApp();
const db = admin.firestore();

const generateSerialNumbers = (count) => {
    const serialNumbers = [];
    for (let i = 0; i < count; i++) {
        serialNumbers.push(`SN-${Math.random().toString(36).substr(2, 9)}`);
    }
    return serialNumbers;
};

const setupVolumeMeasurement = onCall(async (request) => {
    try {
        let { data } = request;

        const { asset, reportTypes, flowStations, measurementTypeNumber, timeFrame, measurementType } = data;

        const validAssets = ['OML24', 'OML152', 'OML147'];
        if (!validAssets.includes(asset)) {
            return { message: 'Invalid asset', code: 'cancelled' };
        }

        const validReportTypes = ['Gross Liquid', 'Net Oil/ Condensate', 'Gas'];
        if (!Array.isArray(reportTypes) || reportTypes.length !== 2 || !reportTypes.every(type => validReportTypes.includes(type))) {
            return { message: 'Invalid report types', code: 'cancelled' };
        }

        const validVolumeMeasurementTypes = ['Metering', 'Tank Dipping'];
        if (!validVolumeMeasurementTypes.includes(measurementType)) {
            return { message: 'Invalid measurement type', code: 'cancelled' };
        }

        // if (![2, 3].includes(numberOfFlowStations)) {
        //     return { message: 'Invalid number of flow stations', code: 'cancelled' };
        // }

        // if (!validVolumeMeasurementTypes.includes(measurementType)) {
        //     return { message: 'Invalid volume measurement type', code: 'cancelled' };
        // }

        // if (|| !created) {
        //     return { message: 'Creator and created fields are required', code: 'cancelled' };
        // }

        // const flowStations = [];
        // for (let i = 0; i < numberOfFlowStations; i++) {
        //     flowStations.push({
        //         flowStationName: `Flow Station ${i + 1}`,
        //         flowStationId: `FS-${i + 1}`,
        //         meters: generateSerialNumbers(numberOfMeters)
        //     });
        // }
    
        const docRef = await db.collection('setups').doc('volumeMeasurement').collection("setupList").doc().set({
            asset,
            reportTypes,
            flowStations,
            measurementType,
            measurementTypeNumber,
            timeFrame,
        });

        return { message: `Document created with ID: ${docRef.id}` };

    } catch (error) {
        console.error('Error adding document: ', error);
        // return { message: 'Internal Server Error' };
        throw new HttpsError(error)
    }
});


module.exports = { setupVolumeMeasurement }
