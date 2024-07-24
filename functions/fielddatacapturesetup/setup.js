const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onCall } = require('firebase-functions/v1/https');
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
    try{
        let { data } = request;

        const { asset, reportTypes, numberOfFlowStations, numberOfMeters, volumeMeasurementType, creator, created } = data;

        const validAssets = ['OML24', 'OML152', 'OML147'];
        if (!validAssets.includes(asset)) {
            return { message: 'Invalid asset'};
        }

        const validReportTypes = ['Gross Liquid', 'Net Oil/ Condensate', 'Gas'];
        if (!Array.isArray(reportTypes) || reportTypes.length !== 2 || !reportTypes.every(type => validReportTypes.includes(type))) {
            return { message: 'Invalid report types'};
        }

        const validVolumeMeasurementTypes = ['Metering', 'Tank Dipping'];
        if (!validVolumeMeasurementTypes.includes(measurementType)) {
            return { message: 'Invalid measurement type'};
        }


        if (![2, 3].includes(numberOfFlowStations)) {
            return { message: 'Invalid number of flow stations'};
        }

        if (!validVolumeMeasurementTypes.includes(volumeMeasurementType)) {
            return { message: 'Invalid volume measurement type'};
        }

        if (!creator || !created) {
            return { message: 'Creator and created fields are required'};
        }

        const flowStations = [];
        for (let i = 0; i < numberOfFlowStations; i++) {
            flowStations.push({
                flowStationName: `Flow Station ${i + 1}`,
                flowStationId: `FS-${i + 1}`,
                meters: generateSerialNumbers(numberOfMeters)
            });    
        }

        const docRef = await db.collection('volumeMeasurements').add({
            asset,
            reportTypes,
            flowStations,
            volumeMeasurementType,
            creator,
            created
        });
        
        return { message: `Document created with ID: ${docRef.id}`};

    }catch (error) {
        console.error('Error adding document: ', error);
        return { message: 'Internal Server Error'};
    }
});


module.exports = { setupVolumeMeasurement }
