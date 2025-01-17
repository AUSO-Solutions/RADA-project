const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { currentTime, generateRandomID } = require("../../helpers");



const getOMLIDOrCreate = async (name) => {
  const db = admin.firestore();
  name = name.toUpperCase();

  try {
    // Fetch the ID if the OML exists
    const existingId = (
      await db.collection("omls").where("name", "==", name).get()
    ).data().id;

    if (existingId) {
      return existingId;
    }

    // Create new OML
    if (name.substring(3) !== "OML") {
      throw new Error({ code: "Cancelled", message: "Invalid OML provided" });
    }

    const id = generateRandomID();
    const data = { id, name };
    await db.collection("omls").doc(id).set(data);
    return id;
  } catch (error) {
    logger.log("error=>", error);
  }
};

const getFieldIDOrCreate = async (fieldName, omlName) => {
  const db = admin.firestore();
  try {
    if (!fieldName || !omlName) {
      throw new Error({
        code: "Cancelled",
        message: "Missing field or oml name",
      });
    }

    // Fetch the ID if the field exists
    const existingId = (
      await db.collection("fields").where("name", "==", fieldName).get()
    ).data().id;

    if (existingId) {
      return existingId;
    }

    const id = generateRandomID();
    const omlId = await getOMLIDOrCreate(omlName);
    const data = { id, omlId, name: fieldName };
    await await db.collection("fields").doc(id).set(data);
    return id;
  } catch (error) {
    logger.log("error=>", error);
  }
};

const getReservoirIDOrCreate = async (reservoirName, fieldName) => {
  const db = admin.firestore();
  try {
    if (!reservoirName || !fieldName) {
      throw new Error({
        code: "Cancelled",
        message: "Missing field or reservoir name",
      });
    }

    // Fetch the ID if the reservoir already exists
    const existingId = (
      await db.collection("reservoirs").where("name", "==", fieldName).get()
    ).data().id;

    if (existingId) {
      return existingId;
    }

    const id = generateRandomID();
    const fieldId = await getFieldIDOrCreate();
    const data = { id, fieldId, name: reservoirName };
     await db.collection("reserviors").doc(id).set(data);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
  }
};

const getWellIDOrCreate = async (
  wellName,
  fieldName,
  surfaceXCoordinate,
  surfaceYCoordinate
) => {
  try {
    if (!wellName || !fieldName || !surfaceXCoordinate || !surfaceYCoordinate) {
      throw new Error({
        code: "Cancelled",
        message: "Missing well, field, or surface coordinates",
      });
    }

    // Fetch the ID if the field exists
    const existingId = (
      await db.collection("wells").where("name", "==", wellName).get()
    ).data().id;

    if (existingId) {
      return existingId;
    }

    const id = generateRandomID();
    const fieldId = await getFieldIDOrCreate(fieldName);
    const data = {
      id,
      fieldId,
      name: wellName,
      surfaceXCoordinate,
      surfaceYCoordinate,
    };

    await db.collection("wells").doc(id).set(data);
    return id;
  } catch (error) {
    logger.log("error ===> ", error);
  }
};

const getFlowstationIDOrCreate = async (name) => {
  const db = admin.firestore();
  try {
    // Fetch the ID if the OML exists
    const existingId = (
      await db.collection("flowstations").where("name", "==", name).get()
    ).data().id;

    if (existingId) {
      return existingId;
    }

    const id = generateRandomID();
    const data = { id, name };
    await db.collection("flowstations").doc(id).set(data);
    return id;
  } catch (error) {
    logger.log("error=>", error);
  }
};

const createDrainagePoint = async (
  productionString,
  reservoir,
  well,
  field,
  flowstation,
  oml
) => {
  try {
    const db = admin.firestore();
    const drainagePointExists = (
      await db
        .collection("drainagePoints")
        .where("name", "==", productionString)
        .get()
    )?.docs[0]?.exists;

    if (drainagePointExists) {
      return;
    }

    const id = generateRandomID();
    const data = {
      id,
      name: productionString,
      reservoir,
      well,
      field,
      flowstation,
      oml,
      created: currentTime,
    };
    await db.collection("drainagePoints").doc(id).set(data);
  } catch (error) {
    logger.log("error=>", error);
  }
};

const getWellData = async (wellId) => {
  try {
    const db = admin.firestore();
    if (!wellId) {
      throw new Error("Well ID is missing");
    }

    const wellDoc = await db.collection("wells").doc(wellId).get();
    if (!wellDoc.exists) {
      throw new Error({ code: "not-found", module: "Well not found" });
    }

    return wellDoc.data();
  } catch (error) {
    logger.log("error=>", error);
  }
};

const getReservoirData = async (reservoirId) => {
  try {
    const db = admin.firestore();
    if (!reservoirId) {
      throw new Error("Well ID is missing");
    }

    const reservoirDoc = await db
      .collection("reservoirs")
      .doc(reservoirId)
      .get();
    if (!reservoirDoc.exists) {
      throw new Error({ code: "not-found", module: "Reservoir not found" });
    }

    return reservoirDoc.data();
  } catch (error) {
    logger.log("error=>", error);
  }
};

const getFieldData = async (fieldId) => {
  try {
    const db = admin.firestore();
    if (!fieldId) {
      throw new Error("Field ID is missing");
    }

    const fieldDoc = await db.collection("fieldss").doc(fieldId).get();
    if (!fieldDoc.exists) {
      throw new Error({ code: "not-found", module: "Well not found" });
    }

    return fieldDoc.data();
  } catch (error) {
    logger.log("error=>", error);
  }
};

const getOMLData = async (omlId) => {
  try {
    const db = admin.firestore();
    if (!omlId) {
      throw new Error("OML ID is missing");
    }

    const omlDoc = await db.collection("omls").doc(omlId).get();
    if (!omlDoc.exists) {
      throw new Error({ code: "not-found", module: "OML not found" });
    }

    return omlDoc.data();
  } catch (error) {
    logger.log("error=>", error);
  }
};

const getFlowstationData = async (flowstationId) => {
  try {
    const db = admin.firestore();
    if (!flowstationId) {
      throw new Error("Flowstation ID is missing");
    }

    const flowstationDoc = await db
      .collection("wells")
      .doc(flowstationId)
      .get();
    if (!flowstationDoc.exists) {
      throw new Error({ code: "not-found", module: "Well not found" });
    }

    return flowstationDoc.data();
  } catch (error) {
    logger.log("error=>", error);
  }
};

module.exports = {
  getFieldIDOrCreate,
  getFlowstationIDOrCreate,
  getReservoirIDOrCreate,
  getWellIDOrCreate,
  getOMLIDOrCreate,
  getOMLData,
  createDrainagePoint,
  getWellData,
  getReservoirData,
  getFieldData,
  getFlowstationData,
};
