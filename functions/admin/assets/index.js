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

;

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

    await db.collection('assets')
      .doc(name)
      .collection("assetList")
      .doc(id)
      .set(payload);
    return { status: "success", message: "Asset created successfully", data };
  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
});

const importMasterXY = onCall(async (request) => {
  try {
    let { data } = request;
    const db = admin.firestore();
    const dataList = data.dataList
    const promises = dataList.map(async (dataListItem) => {
      const {
        name,
        ...rest
      } = dataListItem;
      const id = crypto.randomBytes(8).toString("hex");
      const payload = {
        listId: id,
        assetName: name,
        ...rest
      };
      if (name) {
        return await db.collection('assets')
          .doc(name)
          .collection("assetList")
          .doc(id)
          .set(payload);
      }
    });
    await Promise.all(promises)
    return { status: "success", message: "Master xy is being processed" };

  } catch (error) {
    logger.log("error ===> ", error);
    throw new HttpsError(error?.code, error?.message);
  }
})

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
    const db = admin.firestore()
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

const getAssets = onCall(async (request) => {
  // const limit = 10;
  const idToken = request.data?.idToken
  try {
    const db = admin.firestore();
    const uid = (await admin.auth().verifyIdToken(idToken)).uid
    const groups = (await db.collection('groups').where('members', 'array-contains', uid).get()).docs.map(doc => doc.data())
    const assets = Array.from(new Set(groups.flatMap(group => group?.assets)))
    const res = await db.collectionGroup("assetList").where('asset', 'in', assets).get()
    // const size = res.size
    // const perpage = size / count
    const docs = res.docs;
    // const paginated = await db.collectionGroup("assetList").orderBy().startAt(page).limit(perpage).get()

    return { status: "success", data: docs.map((doc) => doc.data()) };
  } catch (error) {
    logger.log("error=>", error);
    return { status: "failed", error };
  }
});
const getAssetsName = onCall(async (request) => {
  const limit = 10;
  logger.log("------");
  const idToken = request.data?.idToken
  const getAll = request.data?.getAll
  try {
    const db = admin.firestore();
    let names = []
    if (getAll) {
      const docs = (await db.collectionGroup("assetList").get()).docs;
      console.log(docs.map((doc) => doc.data()))
      names = docs.map((doc) => doc.data()).map(item => item?.assetName)
    } else {
      const uid = (await admin.auth().verifyIdToken(idToken)).uid
      const groups = (await db.collection('groups').where('members', 'array-contains', uid).get()).docs.map(doc => doc.data())
      const assets = Array.from(new Set(groups.flatMap(group => group?.assets)))
      names = assets
    }

    // const list = getAll ?  : ;

    return { status: "success", data: names };
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
    const { listId, assetName } = data;
    const db = admin.firestore();
    if (listId) {
      await db
        .collection("assets")
        .doc(assetName)
        .collection("assetList")
        .doc(listId).delete();
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
  createAsset2,
  importMasterXY
};
