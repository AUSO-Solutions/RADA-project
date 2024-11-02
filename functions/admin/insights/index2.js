/* eslint-disable no-throw-literal */
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

const dayjs = require("dayjs");

const getInsights = onCall(async (request) => {
    try {
        const { data } = request;
        logger.log("Data ----", { data });
        const {
            asset,
            flowstation,
            startDate = dayjs(),
            endDate = dayjs(),
        } = data;
        // if (!asset) throw { code: "cancelled", messsage: "Please provide asset" };
        if (!startDate || !endDate)
            throw { code: "cancelled", message: "Please provide start or end dates" };
        if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid())
            throw { code: "cancelled", message: "Invalid start or end dates" };

        const db = admin.firestore();
        const startDate_ = dayjs(startDate).format("YYYY-MM-DD");
        const endDate_ = dayjs(endDate).format("YYYY-MM-DD");

        let noOfDays = dayjs(endDate).diff(startDate, "days"); // get the number of days
        let noOfMonths = dayjs(endDate).diff(startDate, "months"); // get the number of months
        let format = "DD/MM/YYYY";
        console.log({ noOfDays, noOfMonths });
        let frame = []; // placeholder for the days or months
        // if (noOfDays === 0) frame.push(dayjs(startDate));
        if (noOfDays >= 0) {
            format = "DD/MM/YYYY";
            for (let day = 0; day <= noOfDays; day++) {
                frame.push(dayjs(startDate).add(day, "days"));
            }
        }
        // if (noOfDays >= 32) {
        //     format = "MM/YYYY";
        //     for (let day = 0; day <= noOfMonths; day++) {
        //         frame.push(dayjs(startDate).add(day, "months"));
        //     }
        // }
        // console.log(frame)

        // query by start and end dates
        let oilStartEndData = db
            .collection("liquidVolumes")
            .where("date", ">=", startDate_)
            .where("date", "<=", endDate_)
        if (asset) oilStartEndData = oilStartEndData.where("asset", "==", asset);

        let gasStartEndData = db
            .collection("gasVolumes")
            .where("date", ">=", startDate_)
            .where("date", "<=", endDate_)
        if (asset) gasStartEndData = gasStartEndData.where("asset", "==", asset);

        let defermentStartEndData = db
            .collection("deferments")
            .where("date", ">=", startDate_)
            .where("date", "<=", endDate_)
        if (asset) defermentStartEndData = defermentStartEndData.where("asset", "==", asset);

        const ipscTarget = (await db.collection('setups').doc('IPSC')
            .collection("setupList")
            .where("asset", "==", asset)
            .where('month', '>=', dayjs(startDate).format("YYYY-MM"))
            .where('month', '<=', dayjs(endDate).format("YYYY-MM"))
            .get())?.docs.map(doc => doc?.data())

        const oilQuery = (await oilStartEndData.get()).docs.map(
            (doc) => doc?.data() || {}
        );
        const gasQuery = (await gasStartEndData.get()).docs.map(
            (doc) => doc?.data() || {}
        );
        const defermentQuery = (await defermentStartEndData.get()).docs.map(
            (doc) => doc?.data() || {}
        );
        console.log({ oilQuery, gasQuery, defermentQuery });
        const queryResult = { oilQuery, gasQuery, defermentQuery };

        let result = {
            grossProduction: 0,
            grossTarget: 0,
            oilProduced: 0,
            oilTarget: 0,
            gasProduced: 0,
            gasExported: 0,
            gasFlared: 0,
            gasUtilized: 0,
            gasProducedTarget: 0,
            flowstations: [],
            bsw: 0,
            exportGasTarget: 0,
            gasFlaredTarget: 0,
            gasUtilizedTarget: 0,
            assetOilProduction: {},
            assetGasProduction: {},
            totalOilDeferment: 0,
            totalGasDeferment: 0,
            oilScheduledDeferment: { total: 0, subcategories: {} },
            gasScheduledDeferment: { total: 0, subcategories: {} },
            oilUnscheduledDeferment: { total: 0, subcategories: {} },
            gasUnscheduledDeferment: { total: 0, subcategories: {} },
            oilThirdPartyDeferment: { total: 0, subcategories: {} },
            gasThirdPartyDeferment: { total: 0, subcategories: {} },
            ipscTarget: {}
        };

        // Get the deferment subcategories and initialise them in the result
        const scheduledDefermentCategetories = Array.from(
            new Set(
                defermentQuery.flatMap(({ deferment }) =>
                    Object.keys(deferment?.oilScheduledDeferment?.subcategories || {})
                )
            )
        );

        const unscheduledDefermentCategetories = Array.from(
            new Set(
                defermentQuery.flatMap(({ deferment }) =>
                    Object.keys(deferment?.oilUnscheduledDeferment?.subcategories || {})
                )
            )
        );

        const thirdPartyDefermentCategetories = Array.from(
            new Set(
                defermentQuery.flatMap(({ deferment }) =>
                    Object.keys(deferment?.oilThirdPartyDeferment?.subcategories || {})
                )
            )
        );

        console.log({ scheduledDefermentCategetories, unscheduledDefermentCategetories, thirdPartyDefermentCategetories })
        //flat map all flowstations within the date range and add the capture date to its body- { date: item?.date, ...flowstation }
        let oilFlowstationsData = queryResult.oilQuery
            ?.flatMap((item) =>
                item?.flowstations?.map((flowstation) => ({
                    date: item?.date,
                    ...flowstation,
                }))
            )
            ?.filter((flowstation_) =>
                flowstation ? flowstation_?.name === flowstation : true
            );
        let gasFlowstationsData = queryResult.gasQuery
            ?.flatMap((item) =>
                item?.flowstations?.map((flowstation) => ({
                    date: item?.date,
                    ...flowstation,
                }))
            )
            ?.filter((flowstation_) =>
                flowstation ? flowstation_?.name === flowstation : true
            );

        const sum = (array = []) => {
            if (Array.isArray(array) && array?.length)
                return parseFloat(
                    array.reduce((a, b) => parseFloat(a) + parseFloat(b))
                ).toFixed(4);
            return 0;
        };
        const flowstations = Array.from(
            new Set(oilFlowstationsData?.map((flowstation) => flowstation?.name))
        );

        result.flowstations = flowstations;
        //Oil and Oil Target
        result.grossProduction = sum(
            oilFlowstationsData.map((flowstation) => flowstation?.subtotal?.gross || 0)
        );
        result.grossTarget =
            sum(
                oilFlowstationsData.map(
                    (flowstation) => flowstation?.subtotal?.grossTarget || 0
                )
            );
        result.oilProduced = sum(
            oilFlowstationsData.map(
                (flowstation) => flowstation?.subtotal?.netProduction || 0
            )
        );
        result.oilTarget =
            sum(
                oilFlowstationsData.map(
                    (flowstation) => flowstation?.subtotal?.netTarget || 0
                )
            );
        //BSW
        result.bsw = sum(
            oilFlowstationsData.map((flowstation) => flowstation?.subtotal?.bsw || 0)
        );
        //Gases
        result.gasProduced = sum(
            gasFlowstationsData.map((flowstation) => flowstation?.subtotal?.totalGas || 0)
        );
        result.gasExported = sum(
            gasFlowstationsData.map((flowstation) => flowstation?.subtotal?.exportGas || 0)
        );
        result.gasFlared = sum(
            gasFlowstationsData.map((flowstation) => flowstation?.subtotal?.gasFlaredUSM || 0)
        );
        result.gasUtilized = sum(
            gasFlowstationsData.map((flowstation) => flowstation?.subtotal?.fuelGas || 0)
        );
        //Gases Targets
        result.gasProducedTarget =
            sum(
                gasFlowstationsData.map(
                    (flowstation) => flowstation?.subtotal?.totalGasTarget || 0
                )
            );
        result.exportGasTarget =
            sum(
                gasFlowstationsData.map(
                    (flowstation) => flowstation?.subtotal?.exportGasTarget || 0
                )
            );
        result.gasFlaredTarget =
            sum(
                gasFlowstationsData.map(
                    (flowstation) => flowstation?.subtotal?.gasFlaredUSMTarget || 0
                )
            );
        result.gasUtilizedTarget =
            sum(
                gasFlowstationsData.map(
                    (flowstation) => flowstation?.subtotal?.fuelGasTarget || 0
                )
            );
        //Deferments
        result.totalOilDeferment = sum(
            defermentQuery.map((item) => item?.deferment?.totalOilDeferment)
        );

        result.totalGasDeferment = sum(
            defermentQuery.map((item) => item?.deferment?.totalGasDeferment)
        );

        result.oilScheduledDeferment.total = sum(
            defermentQuery.map((item) => item?.deferment?.oilScheduledDeferment?.total)
        );

        result.oilUnscheduledDeferment.total = sum(
            defermentQuery.map((item) => item?.deferment?.oilUnscheduledDeferment?.total)
        );

        result.oilThirdPartyDeferment.total = sum(
            defermentQuery.map((item) => item?.deferment?.oilThirdPartyDeferment?.total)
        );

        result.gasScheduledDeferment.total = sum(
            defermentQuery.map((item) => item?.deferment?.gasScheduledDeferment?.total)
        );

        result.gasUnscheduledDeferment.total = sum(
            defermentQuery.map((item) => item?.deferment?.gasUnscheduledDeferment?.total)
        );

        result.gasThirdPartyDeferment.total = sum(
            defermentQuery.map((item) => item?.deferment?.gasThirdPartyDeferment?.total)
        );

        scheduledDefermentCategetories.forEach((category) => {
            result.oilScheduledDeferment.subcategories[category] = sum(
                defermentQuery.map(
                    (item) => item?.deferment?.oilScheduledDeferment?.subcategories[category]
                )
            );

            result.gasScheduledDeferment.subcategories[category] = sum(
                defermentQuery.map(
                    (item) => item?.deferment?.gasScheduledDeferment?.subcategories[category]
                )
            );
        });

        unscheduledDefermentCategetories.forEach((category) => {
            result.oilUnscheduledDeferment.subcategories[category] = sum(
                defermentQuery.map(
                    (item) => item?.deferment?.oilUnscheduledDeferment?.subcategories[category]
                )
            );

            result.gasUnscheduledDeferment.subcategories[category] = sum(
                defermentQuery.map(
                    (item) => item?.deferment?.gasUnscheduledDeferment?.subcategories[category]
                )
            );
        });

        thirdPartyDefermentCategetories.forEach((category) => {
            result.oilThirdPartyDeferment.subcategories[category] = sum(
                defermentQuery.map(
                    (item) => item?.deferment?.oilThirdPartyDeferment?.subcategories[category]
                )
            );

            result.gasUnscheduledDeferment.subcategories[category] = sum(
                defermentQuery.map(
                    (item) => item?.deferment?.gasThirdPartyDeferment?.subcategories[category]
                )
            );
        });

        //get data from each day/month in the timeframe
        frame.forEach((time) => {
            const format_ = time.format(format); //
            const filterByTimeFrameFormat = (flowstation) =>
                dayjs(flowstation?.date).format(format) === format_;
            flowstations.forEach((flowstation___) => {
                result.assetOilProduction[time.format(format)] = {
                    ...result.assetOilProduction[time.format(format)],
                    [flowstation___]: sum(
                        oilFlowstationsData
                            .filter(filterByTimeFrameFormat)
                            .filter((flowstation) => flowstation?.name === flowstation___)
                            .map((flowstation) => flowstation?.subtotal?.netProduction)
                    ),
                    x: time.format(format),
                };
            });

            result.assetGasProduction[time.format(format)] = {
                // ['Total Gas']: sum(gasFlowstationsData.filter(filterByTimeFrameFormat).map(flowstation => flowstation?.subtotal?.totalGas)),
                "Export Gas": sum(
                    gasFlowstationsData
                        .filter(filterByTimeFrameFormat)
                        .map((flowstation) => flowstation?.subtotal?.exportGas || 0)
                ),
                "Flared Gas": sum(
                    gasFlowstationsData
                        .filter(filterByTimeFrameFormat)
                        .map((flowstation) => flowstation?.subtotal?.gasFlaredUSM || 0)
                ),
                "Fuel Gas": sum(
                    gasFlowstationsData
                        .filter(filterByTimeFrameFormat)
                        .map((flowstation) => flowstation?.subtotal?.fuelGas || 0)
                ),
                x: time.format(format),
            };
        });
        if (ipscTarget) {
            result.ipscTarget = ipscTarget
        }

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
        return { data: JSON.stringify(result) };
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});

module.exports = {
    getInsights,
};
