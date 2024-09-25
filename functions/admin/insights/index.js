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
        const assetVolume = (
          await db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
        ).docs.map((doc) => doc.data());

        const flowstation = assetVolume.find(
          (station) => station.name === flowstation
        );
        const target = flowstation.subtotal.target;
        const netProduction = flowstation.subtotal.netProduction;

        return {
          status: "success",
          data: JSON.stringify({
            target,
            netProduction,
            flowstation,
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

        let result = [];
        let runningNetOil = 0;
        let runningTarget = 0;

        for (let date of dates) {
          const assetVolume = db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
            .docs.map((doc) => doc.data());

          const flowstation = assetVolume.find(
            (station) => station.name === flowstation
          );

          const target = flowstation.subtotal.target;
          const netProduction = flowstation.subtotal.netProduction;

          runningTarget += target;
          runningNetOil += netProduction;

          result.push({ date, target, netProduction });

          runningNetOil += netProduction;
          runningTarget += target;
        }

        const aggregatedResult = await Promise.all(result);
        return {
          status: "success",
          data: JSON.stringify({
            target: runningTarget,
            netProduction: runningNetOil,
            oilProduced: aggregatedResult,
            flowstation,
          }),
        };
      }
    } else {
      // Getting data for OML
      if (frequency === "daily") {
        const assetVolume = (
          await db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
        ).docs.map((doc) => doc.data());

        let target = 0;
        let netProduction = 0;
        let oilProduced = [];

        for (let flowstation of assetVolume) {
          const oilProduction = flowstation.subtotal.netProduction;
          target += flowstation.subtotal.netTarget;
          netProduction += oilProduction;
          oilProduced.push({
            flowstation: flowstation.name,
            oilProduction: oilProduction,
          });
        }

        return {
          status: "success",
          data: JSON.stringify({
            target,
            netProduction,
            oilProduced,
            asset,
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

        let result = [];
        let runningNetOil = 0;
        let runningTarget = 0;

        for (let date of dates) {
          const assetVolume = db
            .collection("liquidVolumes")
            .where("date", "==", date)
            .where("asset", "==", asset)
            .get()
            .docs.map((doc) => doc.data());

          let target = 0;
          let netProduction = 0;
          let oilProduced = [];

          for (let flowstation of assetVolume) {
            const oilProduction = flowstation.subtotal.netProduction;
            target += flowstation.subtotal.netTarget;
            netProduction += oilProduction;
            oilProduced.push({
              flowstation: flowstation.name,
              oilProduction: oilProduction,
            });
          }

          result.push({ date, target, netProduction, oilProduced });

          runningNetOil += netProduction;
          runningTarget += target;
        }

        const aggregatedResult = await Promise.all(result);
        return {
          status: "success",
          data: JSON.stringify({
            target: runningTarget,
            netProduction: runningNetOil,
            oilProduced: aggregatedResult,
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
