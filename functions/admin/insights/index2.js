const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const dayjs = require("dayjs");

const getInsights = onCall(async (request) => {


    try {
        const { data } = request;
        logger.log("Data ----", { data });
        const { asset, flowstation, startDate, endDate } = data;
        if (!asset) throw { code: 'cancelled', messsage: 'Please provide asset' }
        if (!startDate || !endDate) throw { code: "cancelled", message: "Please provide start or end dates", };
        if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid()) throw { code: "cancelled", message: "Invalid start or end dates" };

        const db = admin.firestore();
        const startDate_ = dayjs(startDate).toISOString()
        const endDate_ = dayjs(endDate).toISOString()

        let noOfDays = dayjs(endDate).diff(startDate, 'days') // get the number of days
        let noOfMonths = dayjs(endDate).diff(startDate, 'months') // get the number of months
        let format = 'DD/MM/YYYY'
        console.log({noOfDays,noOfMonths})
        let frame = [] // placeholder for the days or months
        if (noOfDays < 32) {
            format = 'DD/MM/YYYY'
            for (let day = 0; day < noOfDays; day++) {
                frame.push(dayjs(startDate).add(day, 'days'))
            }
        }
        else {
            format = 'MM/YYYY'
            for (let day = 0; day < noOfMonths; day++) {
                frame.push(dayjs(startDate).add(day, 'months'))

            }
        }

        // query by start and end dates 
        const oilStartEndData = db
            .collection("liquidVolumes")
            .where('date', '>=', startDate_)
            .where('date', '<=', endDate_)
            .where('asset', '==', asset)

        const gasStartEndData = db
            .collection("gasVolumes")
            .where('date', '>=', startDate_)
            .where('date', '<=', endDate_)
            .where('asset', '==', asset)

        const oilQuery = (await oilStartEndData.get()).docs.map(doc => doc?.data() || {})
        const gasQuery = (await gasStartEndData.get()).docs.map(doc => doc?.data() || {})
        const queryResult = { oilQuery, gasQuery }

        let result = {
            oilProduced: 0,
            gasProduced: 0,
            gasExported: 0,
            gasFlared: 0,
            gasUtilized: 0,
            assetOilProduction: {},
            assetGasProduction: {}
        }
        //flat map all flowstations within the date range and add the capture date to its body- { date: item?.date, ...flowstation }
        let oilFlowstations = queryResult.oilQuery
            ?.flatMap(item => item?.flowstations?.map(flowstation => ({ date: item?.date, ...flowstation })))
            ?.filter(flowstation_ => (flowstation ? flowstation_?.name === flowstation : true))
        let gasFlowstations = queryResult.gasQuery
            ?.flatMap(item => item?.flowstations?.map(flowstation => ({ date: item?.date, ...flowstation })))
            ?.filter(flowstation_ => (flowstation ? flowstation_?.name === flowstation : true))

        const sum = (array = []) => {
            if (Array.isArray(array) && array?.length) return parseFloat(array.reduce((a, b) => parseFloat(a) + parseFloat(b)))
            return 0
        }
        // const getValueFromFlowstationSubtotal = key => flowstation?.subtotal?.netProduction
        result.oilProduced = sum(oilFlowstations.map(flowstation => flowstation?.subtotal?.netProduction))
        result.gasProduced = sum(gasFlowstations.map(flowstation => flowstation?.subtotal?.totalGas))
        result.gasExported = sum(gasFlowstations.map(flowstation => flowstation?.subtotal?.exportGas))
        result.gasFlared = sum(gasFlowstations.map(flowstation => flowstation?.subtotal?.gasFlaredUSM))
        result.gasUtilized = sum(gasFlowstations.map(flowstation => flowstation?.subtotal?.fuelGas))

        // result.assetOilProduction = frame.map()
        console.log(frame)
        frame.forEach((time) => {
            const format_ = time.format(format) //
            console.log(format_)
            const filterByTimeFrameFormat = (flowstation) => dayjs(flowstation?.date).format(format) === format_
            result.assetOilProduction[time.format(format)] = {
                netProduction: sum(oilFlowstations.filter(filterByTimeFrameFormat).map(flowstation => flowstation?.subtotal?.netProduction)),
                x: time.format(format)
            }
            result.assetGasProduction[time.format(format)] = {
                
                totalGas: sum(gasFlowstations.filter(filterByTimeFrameFormat).map(flowstation => flowstation?.subtotal?.totalGas)),
                exportGas: sum(gasFlowstations.filter(filterByTimeFrameFormat).map(flowstation => flowstation?.subtotal?.exportGas)),
                gasFlaredUSM: sum(gasFlowstations.filter(filterByTimeFrameFormat).map(flowstation => flowstation?.subtotal?.gasFlaredUSM)),
                fuelGas: sum(gasFlowstations.filter(filterByTimeFrameFormat).map(flowstation => flowstation?.subtotal?.fuelGas)),
                x: time.format(format)
            }

        })

        /* 
          oil subtotal format
          "subtotal": {
                    "gross": 557.8947368421053,
                    "netProduction": 530,
                    "bsw": 5,
                    "netTarget": 700,
                    "grossTarget": 900
                }
          gas subtotal format
         "subtotal": {
                    "totalGas": "1450.00000",
                    "fuelGas": 650,
                    "gasFlaredUSM": 400,
                    "totalGasTarget": 500,
                    "exportGas": 400,
                    "exportGasTarget": 350,
                    "fuelGasTarget": 100,
                    "gasFlaredUSMTarget": 50
                }
        */

        console.log({ oilFlowstations, gasFlowstations })
        // if (flowstation) {
        //     oilFlowstations = queryResult.oilQuery?.map(item => item?.flowstations)?.filter(flowstation_ => flowstation_?.name === flowstation)
        //     gasFlowstations = queryResult.gasQuery?.map(item => item?.flowstations)?.filter(flowstation_ => flowstation_?.name === flowstation)
        // }
        return {
            result,
            oilFlowstations, gasFlowstations, frame
        }

    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});

module.exports = {
    getInsights,
};
