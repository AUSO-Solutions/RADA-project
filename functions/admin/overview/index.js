/* eslint-disable no-throw-literal */
const dayjs = require("dayjs");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const getOverviewData = onCall(async (request) => {
    try {
        // const { data } = request;
        const { date = dayjs().format('YYYY-MM-DD'), asset, flowstation } = request.data

        // if (!month) {
        //     throw {
        //         message: 'Please provide a month',
        //         code: 'cancelled'
        //     }
        // }
        const db = admin.firestore();

        const result = {
            assets: 0,
            flowstations: 0,
            reservoirs: 0,
            wells: 0,
            producingReservoir: 0,
            shutinReservoir: 0,
            producingWells: 0,
            shutinWells: 0
        }

        let masterxyQuery = db.collectionGroup('assetList')
        if (asset) masterxyQuery = masterxyQuery.where('asset', '==', asset)
        if (flowstation) masterxyQuery = masterxyQuery.where('flowStation', '==', flowstation)

        const masterxy = (await masterxyQuery.get())?.docs?.map(doc => doc?.data())

        const getUniques = (arr = []) => Array.from(new Set(arr))

        const assets = getUniques(masterxy?.map(xy => xy?.asset))
        const flowstations = getUniques(masterxy?.map(xy => xy?.flowstation))
        const wells = getUniques(masterxy?.map(xy => xy?.wellId))
        const reservoirs = getUniques(masterxy?.map(xy => xy?.reservoir))

        let oilAccountingQuery = db
            .collection('actualProduction')
            .where('date', '==', dayjs(date).format('YYYY-MM-DD')) //actualProduction for this day
        // if (asset) oilAccountingQuery = oilAccountingQuery.where('asset', '==', asset)
        // if (asset && flowstation) oilAccountingQuery = oilAccountingQuery.where('flowStation', '==', flowstation)
        const oilAccounting = (await oilAccountingQuery.get())?.docs?.map(doc => doc?.data())

        // flowstations.forEach((flowstation) => {

        //     const flowstationAccount = oilAccounting.find(account => account?.flowStation === flowstation)
        //     const productionData = flowstationAccount?.productionData || []

        //     productionData.forEach((stringData) => {
        //         if (stringData?.uptimeProduction > 0) {
        //             result.producingWells++
        //         }else{

        //         }
        //     })

        const allProductionData = oilAccounting?.flatMap(account => account?.productionData) || []

        wells.forEach((well) => {
            const stringData = allProductionData?.find(data => data?.productionString === well)
            if (stringData?.uptimeProduction > 0) result.producingWells++
            else result.shutinWells++
        })
        reservoirs.forEach((reservoir) => {
            const stringData = allProductionData?.filter(data => data?.reservoir === reservoir) || []
            if (stringData?.some(stringDatum => stringDatum?.uptimeProduction > 0)) result.producingReservoir++
            else result.shutinReservoir++
        })

        // })

        result.assets = assets.length
        result.flowstations = flowstations.length
        result.wells = wells.length
        result.reservoirs = reservoirs.length

        return { data: JSON.stringify(result) };
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});

module.exports = {
    getOverviewData
};
