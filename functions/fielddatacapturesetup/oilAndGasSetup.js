const functions =require('firebase-functions')
const admin = require('firebase-admin')
const { onCall, HttpsError} = require('firebase-functions/v1/https');
admin.initializeApp();
const db = admin.firestore();






const oilAndGasSetup = onCall(async( request ) =>{
    try{

        let {data} = request

        const { wellTestData, wellTestParameters  } = data;

        //well Test Data 
        const verifiedData = ['Well Test -OML99', 'Well Test -OML32', 'Well Test -OML21', 'Well Test -OML999']
        if(!verifiedData.includes(wellTestData)){
            return ({message : 'Invalid Data ', code : 'cancelled'});
        }

 
        //Well Test Parameters
        const parameters = ['Pressure', 'Seperator Static', 'Choke', 'Closed-in Tubing Head Pressure']
        if(!Array.isArray(wellTestParameters) || parameters.length >= 1 || !parameters.every( type => wellTestParameters.includes(type))) {
            return ({message : 'Invalid Test Parameters'})
        }

        //checking for more backend code 

        const docRef = db.collection('setups').doc('oilAndGas').collection('setupList').doc.set({
            wellTestData,
            wellTestParameters
        });

        return { message: `Document Created with ID: ${docRef.id}`}

    }
    catch(err) {
        console.log(err)
        throw new HttpsError(err)
    }
})

module.exports = { oilAndGasSetup }