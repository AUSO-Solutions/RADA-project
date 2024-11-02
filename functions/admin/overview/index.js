/* eslint-disable no-throw-literal */
const dayjs = require("dayjs");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const getOverviewData = onCall(async (request) => {
    try {
        // const { data } = request;
        const { month, asset, flowstation } = request.data

        if (!month) {
            throw {
                message: 'Please provide a month',
                code: 'cancelled'
            }
        }
        const db = admin.firestore();

        const result = {
            assets: 0,
            flowstations: 0,
            wells: 0,
            producingReservoir: 0,
            producingWells: 0,
            shutinWells: 0
        }


        let masterxyQuery = db.collection('assetList')
        if (asset) masterxyQuery = masterxyQuery.where('asset', '==', asset)
        if (asset && flowstation) masterxyQuery = masterxyQuery.where('flowStation', '==', flowstation)

        const masterxy = (await masterxyQuery.get())?.docs?.map(doc => doc?.data())

        const getUniques = (arr = []) => Array.from(new Set(arr))
        result.assets = getUniques(masterxy?.map(xy => xy?.assets)).length
        result.flowstations = getUniques(masterxy?.map(xy => xy?.flowstations))
        result.wells = getUniques(masterxy?.map(xy => xy?.wellId)).length

        const startDate = dayjs(month).startOf('month').format('YYYY-MM-DD')
        const endDate = dayjs(month).endOf('month').format('YYYY-MM-DD')

        let oilAccountingQuery = db
            .collection('actualProduction')
            .where('date', '>=', startDate)
            .where('date', '<=', endDate)

        if (asset) oilAccountingQuery = oilAccountingQuery.where('asset', '==', asset)
        if (asset && flowstation) oilAccountingQuery = oilAccountingQuery.where('flowStation', '==', flowstation)

        const oilAccounting = (await oilAccountingQuery.get())?.docs?.map(doc => doc?.data())

        result.producingReservoir =  oilAccounting

        return { data: JSON.stringify(result) };
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});

module.exports = {
    getOverviewData
};
