const { data } = require("autoprefixer");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
admin.initializeApp();
const db = admin.firestore();


const setUpOilGasAccount = onCall(async (request) => {
    try{
        let { data } = request;

        const { wellTestData, selectedParameters, creator, created } = data;

        if (!wellTestData || !Array.isArray(selectedParameters) || selectedParameters.length === 0) {
            return { message: 'Invalid input data' };
        }

        const docRef = await db.collection('oilGasAccountingParameters').add({
            wellTestData,
            selectedParameters,
            creator,
            created
        });

        return { message: 'Document created with ID: ${docRef.id}' };
    } catch (error) {
        console.error('Error saving document: ', error);
    }

})