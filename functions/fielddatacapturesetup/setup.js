const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const generateSerialNumbers = (count) => {
    const serialNumbers = [];
    for (let i = 0; i < count; i++) {
        serialNumbers.push(`SN-${Math.random().toString(36).substr(2, 9)}`);
    }
    return serialNumbers;
};

exports.setupVolumeMeasurement = functions.https.onRequest(async (req, res) => {

    const { asset, reportTypes, numberOfFlowStations, numberOfMeters, volumeMeasurementType, creator, created } = req.body;

    const validAssets = ['OML24', 'OML152', 'OML147'];
    const validReportTypes = ['Gross Liquid', 'Net Oil/ Condensate', 'Gas'];
    const validVolumeMeasurementTypes = ['Metering', 'Tank Dipping'];

    if (!validAssets.includes(asset)) {
        return res.status(400).send('Invalid asset');
    }

    if (reportTypes.length !== 2 || !reportTypes.every(rt => validReportTypes.includes(rt))) {
        return res.status(400).send('Invalid report types');
    }

    if (![2, 3].includes(numberOfFlowStations)) {
        return res.status(400).send('Invalid number of flow stations');
    }

    if (!validVolumeMeasurementTypes.includes(volumeMeasurementType)) {
        return res.status(400).send('Invalid volume measurement type');
    }

    if (!creator || !created) {
        return res.status(400).send('Creator and created fields are required');
    }

    const flowStations = [];
    for (let i = 0; i < numberOfFlowStations; i++) {
        flowStations.push({
            flowStationName: `Flow Station ${i + 1}`,
            flowStationId: `FS-${i + 1}`,
            meters: generateSerialNumbers(numberOfMeters)
        });
    }

    try {
        const docRef = await db.collection('volumeMeasurements').add({
            asset,
            reportTypes,
            flowStations,
            volumeMeasurementType,
            creator,
            created
        });
        return res.status(201).send(`Document created with ID: ${docRef.id}`);
    } catch (error) {
        console.error('Error adding document: ', error);
        return res.status(500).send('Internal Server Error');
    }
});
