/* eslint-disable no-throw-literal */

const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getDates } = require("./helpers");

const getInsight = onCall(async (request) => {
  try {
    const { data } = request;
    logger.log("Data ----", { data });
    const { asset, date, frequency, flowstation, month, year } = data;
    if (
      !asset ||
      !date ||
      !frequency ||
      !["daily", "monthly"].includes(frequency)
    ) {
      throw {
        code: "cancelled",
        message: "Missing required fields",
      };
    }

    const db = admin.firestore();

    if (flowstation) {
      // Getting data for a particular flow station
      if (frequency === "daily") {
        const liquidVolume = (
          await db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
        ).docs.map((doc) => doc.data());

        const gasVolume = (
          await db
            .collection("gasVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
        ).docs.map((doc) => doc.data());

        const flowstationOil = liquidVolume[liquidVolume.length - 1]?.flowstations?.find(
          (station) => station?.name === flowstation
        );
        console.log({liquidVolume,flowstationOil})

        const flowstationGas = gasVolume[gasVolume.length - 1]?.flowstations.find(
          (station) => station?.name === flowstation
        );
        console.log({gasVolume,flowstationGas})
        const targetOil = flowstationOil?.subtotal?.netTarget;
        const netProduction = flowstationOil?.subtotal?.netProduction;
        const targetTotalGas = flowstationGas?.subtotal?.totalGasTarget;
        const targetFuelGas = flowstationGas?.subtotal?.fuelGasTarget;
        const targetExportGas = flowstationGas?.subtotal?.exportGasTarget;
        const targetFlaredGas = flowstationGas?.subtotal?.gasFlaredUSMTarget;
        const totalGas = flowstationGas?.subtotal?.totalGas;
        const fuelGas = flowstationGas?.subtotal?.fuelGas;
        const exportGas = flowstationGas?.subtotal?.exportGas;
        const flaredGas = flowstationGas?.subtotal?.gasFlaredUSM;

        return {
          status: "success",
          data: ({
            targetOil,
            netOil: netProduction,
            targetTotalGas,
            targetFuelGas,
            targetExportGas,
            targetFlaredGas,
            totalGas,
            fuelGas,
            exportGas,
            flaredGas,
            flowstation,
            date,
          }),
        };
      } else {
        if (!month || !year) {
          throw {
            code: "cancelled",
            message: "Missing month or year",
          };
        }
        const dates = getDates(month, year);

        if (dates.length === 0) {
          throw {
            code: "cancelled",
            message: "Error generating dates for aggregation",
          };
        }

        let aggregatePromises = [];
        let runningNetOil = 0;
        let runningTargetOil = 0;
        let runningTotalGas = 0;
        let runningFuelGas = 0;
        let runningExportGas = 0;
        let runningFlaredGas = 0;
        let runningTargetTotalGas = 0;
        let runningTargetFuelGas = 0;
        let runningTargetExportGas = 0;
        let runningTargetFlaredGas = 0;

        for (let date of dates) {
          const assetOilVolume =  await db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
            .docs.map((doc) => doc.data());
          const assetGasVolume = await db
            .collection("gasVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
            .docs.map((doc) => doc.data());

          const oilVolumes = assetOilVolume?.flowstations?.find(
            (station) => station?.name === flowstation
          );

          const gasVolumes = assetGasVolume?.flowstations?.find(
            (station) => station?.name === flowstation
          );

          const targetOil = oilVolumes?.subtotal?.netTarget;
          const netOil = oilVolumes?.subtotal?.netProduction;
          const targetTotalGas = gasVolumes?.subtotal?.totalGasTarget;
          const targetFuelGas = gasVolumes?.subtotal?.fuelGasTarget;
          const targetExportGas = gasVolumes?.subtotal?.exportGasTarget;
          const targetFlaredGas = gasVolumes?.subtotal?.gasFlaredUSMTarget;
          const totalGas = gasVolumes?.subtotal?.totalGas;
          const fuelGas = gasVolumes?.subtotal?.fuelGas;
          const exportGas = gasVolumes?.subtotal?.exportGas;
          const flaredGas = gasVolumes?.subtotal?.gasFlaredUSM;

          runningTargetOil += targetOil;
          runningNetOil += netOil;
          runningTargetTotalGas += targetTotalGas;
          runningTargetFuelGas += targetFuelGas;
          runningTargetExportGas += targetExportGas;
          runningTargetFlaredGas += targetFlaredGas;
          runningTotalGas += totalGas;
          runningFuelGas += fuelGas;
          runningExportGas += exportGas;
          runningFlaredGas += flaredGas;

          aggregatePromises.push({
            date,
            targetOil,
            netOil,
            targetTotalGas,
            targetExportGas,
            targetFlaredGas,
            targetFuelGas,
            totalGas,
            fuelGas,
            exportGas,
            flaredGas,
          });
        }

        const aggregate = await Promise.all(aggregatePromises);
        return {
          status: "success",
          data: ({
            targetOil: runningTargetOil,
            netOil: runningNetOil,
            targetTotalGas: runningTargetTotalGas,
            targetFuelGas: runningTargetFuelGas,
            targetFlaredGas: runningTargetFlaredGas,
            targetExportGas: runningTargetExportGas,
            totalGas: runningTotalGas,
            fuelGas: runningFuelGas,
            flaredGas: runningFlaredGas,
            exportGas: runningExportGas,
            aggregate,
            flowstation,
          }),
        };
      }
    } else {
      // Getting data for OML
      if (frequency === "daily") {
        const oilVolumes = (
          await db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
        ).docs.map((doc) => doc.data());

        const gasVolumes = (
          await db
            .collection("gasVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
        ).docs.map((doc) => doc.data());

        let runningTargetOil = 0;
        let runningNetOil = 0;
        let runningTargetTotalGas = 0;
        let runningTargetFuelGas = 0;
        let runningTargetFlaredGas = 0;
        let runningTargetExportGas = 0;
        let runningTotalGas = 0;
        let runningFuelGas = 0;
        let runningFlaredGas = 0;
        let runningExportGas = 0;
        let oilAggregate = [];
        let gasAggregate = [];

    
        oilVolumes?.[oilVolumes.length-1]?.flowstations?.forEach(flowstation => {
          const oilProduction = flowstation?.subtotal?.netProduction;
          const targetOil = flowstation?.subtotal?.netTarget;
          runningTargetOil += targetOil;
          runningNetOil += oilProduction;
          oilAggregate.push({
            flowstation: flowstation?.name,
            netOil: oilProduction,
            targetOil,
          });
        });

        // for (let flowstationGas of gasVolumes) {
         
        // }
        gasVolumes[gasVolumes.length-1]?.flowstations?.forEach(flowstationGas => {
          const targetTotalGas = flowstationGas?.subtotal?.totalGasTarget;
          const targetFuelGas = flowstationGas?.subtotal?.fuelGasTarget;
          const targetExportGas = flowstationGas?.subtotal?.exportGasTarget;
          const targetFlaredGas = flowstationGas?.subtotal?.gasFlaredUSMTarget;
          const totalGas = flowstationGas?.subtotal?.totalGas;
          const fuelGas = flowstationGas?.subtotal?.fuelGas;
          const exportGas = flowstationGas?.subtotal?.exportGas;
          const flaredGas = flowstationGas?.subtotal?.gasFlaredUSM;

          runningTargetTotalGas += targetTotalGas;
          runningTargetFuelGas += targetFuelGas;
          runningTargetExportGas += targetExportGas;
          runningTargetFlaredGas += targetFlaredGas;
          runningTotalGas += totalGas;
          runningFuelGas += fuelGas;
          runningExportGas += exportGas;
          runningFlaredGas += flaredGas;

          gasAggregate.push({
            flowstation: flowstation?.name,
            totalGas,
            flaredGas,
            exportGas,
            fuelGas,
            targetTotalGas,
            targetFuelGas,
            targetFlaredGas,
            targetExportGas,
          });
        });

        return {
          status: "success",
          data: ({
            targetOil: runningTargetOil,
            netOil: runningNetOil,
            targetTotalGas: runningTargetTotalGas,
            targetFuelGas: runningTargetFuelGas,
            targetExportGas: runningTargetExportGas,
            targetFlaredGas: runningTargetFlaredGas,
            totalGas: runningTotalGas,
            fuelGas: runningFuelGas,
            exportGas: runningExportGas,
            flaredGas: runningFlaredGas,
            aggregate: {
              oilAggregate,
              gasAggregate,
            },
            asset,
            date,
          }),
        };
      } else {
        if (!month || !year) {
          throw {
            code: "cancelled",
            message: "Missing month or year",
          };
        }
        const dates = getDates(month, year);

        if (dates.length === 0) {
          throw {
            code: "cancelled",
            message: "Error generating dates for aggregation",
          };
        }

        let aggregatePromise = [];
        let runningNetOil = 0;
        let runningTargetOil = 0;
        let runningTargetTotalGas = 0;
        let runningTargetFuelGas = 0;
        let runningTargetFlaredGas = 0;
        let runningTargetExportGas = 0;
        let runningTotalGas = 0;
        let runningFuelGas = 0;
        let runningFlaredGas = 0;
        let runningExportGas = 0;

        for (let date of dates) {
          const oilVolumes = await db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
            .docs.map((doc) => doc.data());

          let dailyTargetOil = 0;
          let dailyNetOil = 0;
          let oilAggregate = [];

          // for (let flowstation of oilVolumes?.flowstations) {
            
          // }
          oilVolumes?.flowstations.forEach(flowstation => {
            const oilProduction = flowstation?.subtotal?.netProduction;
            const targetOil = flowstation?.subtotal?.netTarget;
            dailyTargetOil += targetOil;
            dailyNetOil += oilProduction;
            oilAggregate.push({
              flowstation: flowstation?.name,
              netOil: oilProduction,
              targetOil,
            });
          });

          let dailyTargetTotalGas = 0;
          let dailyTargetFuelGas = 0;
          let dailyTargetFlaredGas = 0;
          let dailyTargetExportGas = 0;
          let dailyTotalGas = 0;
          let dailyFuelGas = 0;
          let dailyFlaredGas = 0;
          let dailyExportGas = 0;
          let gasAggregate = [];

          const gasVolumes = db
            .collection("gasVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
            .docs.map((doc) => doc.data());

          for (let flowstationGas of gasVolumes?.flowstations) {
            const targetTotalGas = flowstationGas?.subtotal?.totalGasTarget;
            const targetFuelGas = flowstationGas?.subtotal?.fuelGasTarget;
            const targetExportGas = flowstationGas?.subtotal?.exportGasTarget;
            const targetFlaredGas = flowstationGas?.subtotal?.gasFlaredUSMTarget;
            const totalGas = flowstationGas?.subtotal?.totalGas;
            const fuelGas = flowstationGas?.subtotal?.fuelGas;
            const exportGas = flowstationGas?.subtotal?.exportGas;
            const flaredGas = flowstationGas?.subtotal?.gasFlaredUSM;

            dailyTargetTotalGas += targetTotalGas;
            dailyTargetFuelGas += targetFuelGas;
            dailyTargetExportGas += targetExportGas;
            dailyTargetFlaredGas += targetFlaredGas;
            dailyTotalGas += totalGas;
            dailyFuelGas += fuelGas;
            dailyExportGas += exportGas;
            dailyFlaredGas += flaredGas;

            gasAggregate.push({
              flowstation: flowstation?.name,
              targetTotalGas,
              targetFuelGas,
              targetFlaredGas,
              targetExportGas,
              totalGas,
              flaredGas,
              fuelGas,
              exportGas,
            });
          }

          aggregatePromise.push({
            date,
            targetOil: dailyTargetOil,
            netOil: dailyNetOil,
            targetTotalGas: dailyTargetTotalGas,
            targetFuelGas: dailyTargetFuelGas,
            targetFlaredGas: dailyTargetFlaredGas,
            targetExportGas: dailyTargetExportGas,
            totalGas: dailyTotalGas,
            flaredGas: dailyFlaredGas,
            fuelGas: dailyFuelGas,
            exportGas: dailyExportGas,
            oilAggregate,
            gasAggregate,
          });

          runningNetOil += dailyNetOil;
          runningTargetOil += dailyTargetOil;
          runningTargetTotalGas += dailyTargetTotalGas;
          runningTargetExportGas += dailyTargetExportGas;
          runningTargetFlaredGas += dailyTargetFlaredGas;
          runningTargetFuelGas += dailyTargetFuelGas;
          runningTotalGas += dailyTotalGas;
          runningExportGas += dailyExportGas;
          runningFuelGas += dailyFuelGas;
          runningFlaredGas += dailyFlaredGas;
        }

        const aggregate = await Promise.all(aggregatePromise);
        return {
          status: "success",
          data: ({
            targetOil: runningTargetOil,
            netOil: runningNetOil,
            targetTotalGas: runningTargetTotalGas,
            targetFuelGas: runningTargetFuelGas,
            targetExportGas: runningTargetExportGas,
            targetFlaredGas: runningTargetFlaredGas,
            totalGas: runningTotalGas,
            fuelGas: runningFuelGas,
            exportGas: runningExportGas,
            flaredGas: runningFlaredGas,
            aggregate,
            asset,
          }),
        };
      }
    }
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

module.exports = {
  getInsight,
};
