const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require("crypto");
const { currentTime } = require("../../helpers");
const {
  getFieldIDOrCreate,
  getFlowstationIDOrCreate,
  getReservoirIDOrCreate,
  getWellIDOrCreate,
  createDrainagePoint,
  getOMLIDOrCreate,
} = require("./helpers");
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

const db = admin.firestore();

const createAsset = onCall(async (request) => {
  try {
    let { data } = request;
    logger.log("data ----", { data });
    const db = admin.firestore();
    const {
      name,
      field,
      well,
      productionString,
      reservoir,
      flowStation,
      surfaceXcoordinate,
      surfaceYcoordinate,
    } = data;
    const id = crypto.randomBytes(8).toString("hex");
    const payload = {
      listId: id,
      assetName: name,
      field,
      well,
      productionString,
      reservoir,
      flowStation,
      surfaceXcoordinate,
      surfaceYcoordinate,
      created: currentTime,
    };

    if (!name) {
      throw { code: "cancelled", message: "Please provide asset name" };
    }

    await db
      .collection("assets")
      .doc(name)
      .collection("assetList")
      .doc(id)
      .set(payload);
    logger.log("PAYLOAD ----", payload);
    // await db.collection('assets').doc(name).set(payload)
    return { status: "success", message: "Asset created successfully", data };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const createAsset2 = onCall(async (request) => {
  try {
    let { data } = request;
    logger.log("data ----", { data });
    const {
      name,
      field,
      well,
      productionString,
      reservoir,
      flowStation,
      surfaceXcoordinate,
      surfaceYcoordinate,
    } = data;

    await getOMLIDOrCreate(name);
    await getFieldIDOrCreate(field, name);

    await getReservoirIDOrCreate(reservoir, field);
    await getWellIDOrCreate(
      well,
      field,
      surfaceXcoordinate,
      surfaceYcoordinate
    );
    getFlowstationIDOrCreate(flowStation);

    await createDrainagePoint(
      productionString,
      reservoir,
      well,
      field,
      flowStation,
      name
    );

    logger.log("PAYLOAD ----", data);
    return { status: "success", message: "Asset created successfully", data };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const getAssets2 = onCall(async () => {
  try {
    const drainagePointDocs = await db.collection("drainagePoints").get().docs;
    return {
      status: "success",
      data: drainagePointDocs.map((doc) => doc.data()),
    };
  } catch (error) {
    logger.log("error=>", error);
    return { status: "failed", error };
  }
});

const getAssets = onCall(async ({}) => {
  const limit = 10;
  logger.log("------");
  try {
    const db = admin.firestore();
    const docs = (await db.collectionGroup("assetList").get()).docs;

    return { status: "success", data: docs.map((doc) => doc.data()) };
  } catch (error) {
    logger.log("error=>", error);
    return { status: "failed", error };
  }
});
const getAssetsName = onCall(async ({}) => {
  const limit = 10;
  logger.log("------");
  try {
    const db = admin.firestore();
    const docs = (await db.collectionGroup("assets").get()).docs;
    const list = docs.map((doc) => doc.id);

    return { status: "success", data: list };
  } catch (error) {
    logger.log("error=>", error);
    return { status: "failed", error };
  }
});
const getAssetByName = onCall(async ({ data }) => {
  const limit = 10;
  const { name } = data;

  try {
    if (name) {
      const db = admin.firestore();
      const docs = (
        await db.collection("assets").doc(name).collection("assetList").get()
      ).docs;
      const data = docs.map((doc) => doc.data());
      return { status: "success", data };
    } else {
      throw { code: "cancelled", message: "Please provide asset name" };
    }
  } catch (error) {
    logger.log("error=>", error);
    return { status: "failed", error };
  }
});

const updateAssetById = onCall(async (request) => {
  try {
    let { data } = request;
    logger.log("data ----", { data });
    // const { assetId } = data
    const {
      name,
      field,
      listId,
      well,
      productionString,
      reservoir,
      flowStation,
      surfaceXcoordinate,
      surfaceYcoordinate,
    } = data;
    const db = admin.firestore();
    if (name) {
      await db
        .collection("assets")
        .doc(name)
        .collection("assetList")
        .doc(listId)
        .update({
          field,
          well,
          productionString,
          reservoir,
          flowStation,
          surfaceXcoordinate,
          surfaceYcoordinate,
        });
      return { status: "success", data, message: "Asset updated successfully" };
    } else {
      throw { code: "cancelled", message: "Error updating Asset." };
    }
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const deleteAssetById = onCall(async (request) => {
  try {
    let { data } = request;
    logger.log("data ----", { data });
    const { id } = data;
    const db = admin.firestore();
    if (id) {
      await db.collection("assets").doc(id).delete();
      return { status: "success", message: "Asset deleted successfully" };
    } else {
      throw { code: "cancelled", message: "Error deleting asset." };
    }
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

module.exports = {
  createAsset,
  getAssetByName,
  updateAssetById,
  deleteAssetById,
  getAssets,
  getAssetsName,
  getAssets2,
};
