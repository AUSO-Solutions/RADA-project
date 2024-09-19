const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const { generateRandomID } = require("../helpers");
const csv = require("csvtojson");

const validateProductionStringsChokeSizesFile = onCall(async (request) => {
    try {
        let { data } = request;
        logger.log("data ----", { data });

        const { filename } = data;

        const bucket = admin.storage().bucket('ped-application-4d196.appspot.com');                   // initialize storage as admin
        const stream = bucket.file(filename).createReadStream();    // create stream of the file in bucket
        const JSONs = await csv().fromStream(stream)
        console.log(JSONs)
        const assets = JSONs.map(json => json?.Asset)
        // if(assets.length === JSONs.length)
        const asset = Array.from(new Set(assets))[0]
        const isSingleAsset = Array.from(new Set(assets)).length == 1
        if (!isSingleAsset) {
            throw ({ message: 'File can only contain single asset', code: 'cancelled' })
        }
        // const fields = JSONs.map(json => json?.Fields)
        // const reservoir = JSONs.map(json => json?.Reservoir)
        // const productionString = JSONs.map(json => json?.["Production String"])
        // const choke = JSONs.map(json => json?.Choke)
        // const startDate = JSONs.map(json => json?.["Start Date and Time"])
        // const endDate = JSONs.map(json => json?.["End Date and Time"])

        const db = admin.firestore()
        const masterxy = (await db.collectionGroup("assetList").get()).docs.map(doc => doc.data())
        // if (masterxy)
        let errors = []
        JSONs.forEach((json, i) => {
            const asset = json?.Asset
            const field = json?.Field
            const reservoir = json?.Reservoir
            const productionString = json?.["Production String"]
            const choke = json?.Choke
            const startDate = json?.["Start Date and Time"]
            const endDate = json?.["End Date and Time"]
            if (asset && field && productionString && reservoir && choke && startDate && endDate) {
                const masterxyAssets = masterxy.filter(xy => xy?.assetName === asset)
                if (masterxyAssets.length) {

                    if (!masterxyAssets.find(xy => xy?.wellId === productionString)) errors.push(`Field ${productionString} does not exist in asset ${asset} `)
                    if (!masterxyAssets.find(xy => xy?.field === field)) errors.push(`Field ${field} does not exist in asset ${asset} `)
                    if (!masterxyAssets.find(xy => xy?.reservoir === reservoir)) errors.push(`Field ${reservoir} does not exist in asset ${asset} `)
                    if (typeof parseInt(choke) !== 'number') errors.push(`choke size ${choke} must be a number `)

                } else {
                    errors.push(`Asset ${asset} does not exist`)
                }

            } else {
                errors.push('All headers must match Asset, Field, Reservoir, Production String, Choke, Start Date and Time, End Date and Time ')
            }
        })
        if (errors.length) throw errors
        if (!errors.length) {
            // db.collection("setup").doc()
            return { status: "succes", message : 'File processed successfully' }
        }

        // const db = admin.firestore();
        // await db.collection("liquidVolumes").doc(id).set(dbData);

    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError('cancelled', JSON.stringify(error));
    }
});




module.exports = {
    validateProductionStringsChokeSizesFile
};
