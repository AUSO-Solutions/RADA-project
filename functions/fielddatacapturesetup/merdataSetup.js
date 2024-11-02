const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const { generateRandomID } = require("../helpers");
const csv = require("csvtojson");
const dayjs = require("dayjs");

const validateProductionStringsChokeSizesFile = async (JSONs, masterxy = []) => {
    try {
        // const JSONs = await csv().fromStream(fileStream)
        const assets = JSONs.map(json => json?.Asset)
        const asset = Array.from(new Set(assets))[0]
        const isSingleAsset = Array.from(new Set(assets)).length == 1
        if (!isSingleAsset) {
            throw ({ message: 'Choke size file can only contain single asset', code: 'cancelled' })
        }

        let errors = []
        const firstJson = JSONs[0]
        if ('Asset' in firstJson && 'Field' in firstJson && 'Reservoir' in firstJson && 'Production String' in firstJson && 'Choke' in firstJson && 'Start Date and Time' in firstJson && 'End Date and Time' in firstJson) {
            // errors.push('All headers must match Asset, Field, Reservoir, Production String, Choke, Start Date and Time, End Date and Time ')

            JSONs.forEach((json, i) => {
                const asset = json?.Asset
                const field = json?.Field
                const reservoir = json?.Reservoir
                const productionString = json?.["Production String"]
                const choke = json?.Choke
                const startDate = json?.["Start Date and Time"]
                const endDate = json?.["End Date and Time"]
                // if (asset && field && productionString && reservoir && choke && startDate && endDate) {
                const masterxyAssets = masterxy.filter(xy => xy?.assetName === asset)
                if (masterxyAssets.length) {

                    if (!masterxyAssets.find(xy => xy?.wellId === productionString)) errors.push(`Production String ${productionString} does not exist in asset ${asset} `)
                    if (!masterxyAssets.find(xy => xy?.field === field)) errors.push(`Field ${field} does not exist in asset ${asset} `)
                    if (!masterxyAssets.find(xy => xy?.reservoir === reservoir)) errors.push(`Reservior ${reservoir} does not exist in asset ${asset} `)
                    if (typeof parseInt(choke) !== 'number') errors.push(`choke size ${choke} must be a number `)
                    if (!dayjs(startDate).isValid()) errors.push(`Invalid start date and time ${startDate}  in ${productionString}   `)
                    if (!dayjs(endDate).isValid()) errors.push(`Invalid end date and time ${endDate} in ${productionString}   `)

                } else {
                    errors.push(`Asset ${asset} does not exist`)
                }

            })
        } else {
            errors.push('All headers must match Asset, Field, Reservoir, Production String, Choke, Start Date and Time, End Date and Time ')
        }
        if (errors.length) throw errors
        if (!errors.length) {
            let results = {}

            const uniqueProdStrings = Array.from(new Set(JSONs.map(json => json?.["Production String"])))
            uniqueProdStrings.forEach((productionString) => {
                const details = JSONs.filter(json => json?.["Production String"] === productionString).map(json => {
                    const asset = json?.Asset
                    const field = json?.Field
                    const reservoir = json?.Reservoir
                    const productionString = json?.["Production String"]
                    const choke = json?.Choke
                    const startDate = json?.["Start Date and Time"]
                    const endDate = json?.["End Date and Time"]
                    return { asset, field, reservoir, productionString, choke, startDate, endDate }
                })
                results[productionString] = {
                    productionString,
                    reservoir: details[0].reservoir,
                    onProgram:details?.map(detail => detail?.choke)?.length?true:false,
                    chokes: details.map(detail => ({ chokeSize: detail.choke, startDate: detail.startDate, endDate: detail.endDate }))
                }
            });
            return {
                asset: asset,
                merScheduleData: results,
            }
        }
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError('cancelled', JSON.stringify(error));
    }
};
const validateReservoirStaticParameters = async (JSONs, masterxy) => {
    try {
        // const JSONs = await csv().fromStream(fileStream)
        const assets = JSONs.map(json => json?.Asset)
        const asset = Array.from(new Set(assets))[0]
        const isSingleAsset = Array.from(new Set(assets)).length == 1
        if (!isSingleAsset) {
            throw ({ message: 'Static Parameters file can only contain single asset', code: 'cancelled' })
        }
        let errors = []
        let result = {}
        console.log({ JSONs })
        const firstJson = JSONs[0]
        if ('Asset' in firstJson && 'Field' in firstJson && 'Reservoir' in firstJson && 'Production String' in firstJson && 'Date' in firstJson && 'Initial GOR (scf/stb)' in firstJson && 'Initial Reservoir Pressure (psia)' in firstJson && 'Current Reservoir Pressure (psia)' in firstJson && 'FBHP (psia)' in firstJson) {


            JSONs.forEach(json => {
                const asset = json?.['Asset']
                const field = json?.['Field']
                const reservoir = json?.['Reservoir']
                const productionString = json?.['Production String']
                const date = json?.['Date']
                const initialGor = json?.['Initial GOR (scf/stb)']
                const initialReservoirPressure = json?.['Initial Reservoir Pressure (psia)']
                const currentReservoirPressure = json?.['Current Reservoir Pressure (psia)']
                const fbhp = json?.['FBHP (psia)']

                // if (asset && field && reservoir && productionString && date && initialGor && initialReservoirPressure && currentReservoirPressure && fbhp) {
                const masterxyAssets = masterxy.filter(xy => xy?.assetName === asset)
                if (masterxyAssets.length) {
                    if (!masterxyAssets.find(xy => xy?.wellId === productionString)) errors.push(`Production String ${productionString} does not exist in asset ${asset} `)
                    if (!masterxyAssets.find(xy => xy?.field === field)) errors.push(`Field ${field} does not exist in asset ${asset} `)
                    if (!masterxyAssets.find(xy => xy?.reservoir === reservoir)) errors.push(`Reservior ${reservoir} does not exist in asset ${asset} `)
                    result[reservoir] = ({
                        asset, field, reservoir, productionString, date, initialGor, initialReservoirPressure, currentReservoirPressure, fbhp
                    })
                    // if (typeof parseInt(choke) !== 'number') errors.push(`choke size ${choke} must be a number `)
                    // if (!dayjs(startDate).isValid()) errors.push(`Invalid start date and time ${startDate}  in ${productionString}   `)
                    // if (!dayjs(endDate).isValid()) errors.push(`Invalid end date and time ${endDate} in ${productionString}   `)
                } else {
                    errors.push(`Asset ${asset} does not exist`)
                }


            })
        } else {
            errors.push('All headers must match Asset, Field, Reservoir, Production String, Date, Initial GOR (scf/stb), Initial Reservoir Pressure (psia), Current Reservoir Pressure (psia), FBHP (psia) ')
        }

        if (errors.length) throw errors
        if (!errors.length) {
            return result
        }

    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError('cancelled', JSON.stringify(error));
    }
};


const createMerSchedule = onCall(async (request) => {
    try {
        const db = admin.firestore()
        let { data } = request;
        const { title, chokeSizes, staticParameters, date, month } = data

        // const bucket = admin.storage().bucket('ped-application-4d196.appspot.com');// initialize storage as admin
        // const chokesSizeStream = bucket.file(chokeSizesFileName).createReadStream();//create stream of the file in bucket
        // const staticParameterStream = bucket.file(reservoirStaticParametersFileName).createReadStream();//create stream of the file in bucket
        const masterxy = (await db.collectionGroup("assetList").get()).docs.map(doc => doc.data())
        const res = await validateProductionStringsChokeSizesFile(chokeSizes, masterxy)
        const res2 = await validateReservoirStaticParameters(staticParameters, masterxy)
        // await bucket.file(chokeSizesFileName).delete()
        // await bucket.file(reservoirStaticParametersFileName).delete()
        const id = generateRandomID()
        const combined = Object.fromEntries(Object.values(res.merScheduleData || {}).map(item => ([
            item?.productionString,
            {
                ...item,
                initialReservoirPressure: res2[item?.reservoir]?.initialReservoirPressure,
                currentReservoirPressure: res2[item?.reservoir]?.currentReservoirPressure,
                fbhp: res2[item?.reservoir]?.fbhp,
                initialGor: res2[item?.reservoir]?.initialGor,
                currentReservoirPressure: res2[item?.reservoir]?.currentReservoirPressure,
            }
        ])))
        console.log({ combined })
        const setup = {
            asset: res.asset,
            merScheduleData: combined,
            staticParameters: res2,
            title,
            date: dayjs(date || "").format('DD/MM/YYYY'),
            id,
            month
        }
        await db.collection("setups").doc('merSchedule').collection('setupList').doc(id).set(setup)
        console.log("----", res)
        return { status: 'sccuessfull' }
    } catch (error) {
        console.log(error)
        throw error

    }
})

module.exports = {
    createMerSchedule,
};
