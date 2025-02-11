const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require("crypto");
// const { currentTime } = require("../../helpers");
// const {
//   getFieldIDOrCreate,
//   getFlowstationIDOrCreate,
//   getReservoirIDOrCreate,
//   getWellIDOrCreate,
//   createDrainagePoint,
//   getOMLIDOrCreate,
// } = require("./helpers");
// const { getUserGroups } = require("../../helpers/user");
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");

;

const createDefermentCategory = onCall(async (request) => {
    try {
        // let { data } = request;
        const db = admin.firestore();

        const id = crypto.randomBytes(8).toString("hex");
        const { name } = request.data
        const exists = (await db.collection('defermentCategories').where('name', "==", name).get()).docs
        if (exists.length) throw ({ code: 'cancelled', message: 'This name is taken' })
        await db.collection('defermentCategories')
            .doc(id)
            .set({
                id,
                name,
                subCategories: []
            })

        return { status: "success", message: "Deferment category created successfully" };
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});
const createDefermentSubCategory = onCall(async (request) => {
    try {
        // let { data } = request;
        const db = admin.firestore();
        const { id, subCategory } = request.data
        const prevsubCategories = (await db.collection('defermentCategories').doc(id).get()).data()?.subCategories
        if (prevsubCategories.includes(subCategory)) throw ({ code: 'cancelled', message: 'This name is taken' })
        const subCategories = [...prevsubCategories, subCategory]
        await db.collection('defermentCategories')
            .doc(id)
            .update({ subCategories })

        return { status: "success", message: "Deferment category update successfully" };
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});

const getDefermentCategories = onCall(async (request) => {
    // const limit = 10;
    // const idToken = request.data?.idToken
    try {
        const db = admin.firestore();
        const data = (await db.collection("defermentCategories").get()).docs.map(doc => doc.data())
        return { status: "success", data };
    } catch (error) {
        logger.log("error=>", error);
        return { status: "failed", error };
    }
});


const deleteCategory = onCall(async (request) => {
    try {
        let { data } = request;
        const { id } = data;
        const db = admin.firestore();
        if (id) {
            await db
                .collection("defermentCategories").doc(id).delete()
            // .doc(assetName)
            // .collection("assetList")
            // .doc(listId).delete();
            return { status: "success", message: "Deferment category deleted successfully" };
        } else {
            throw { code: "cancelled", message: "Error deleting deferment category." };
        }
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});
const deleteSubCategory = onCall(async (request) => {
    try {
        const db = admin.firestore();

        const { id, subCategory } = request.data
        const prevsubCategories = (await db.collection('defermentCategories').doc(id).get()).data()?.subCategories

        const subCategories = prevsubCategories.filter(prevSubCategory => prevSubCategory !== subCategory)
        await db.collection('defermentCategories')
            .doc(id)
            .update({ subCategories })

        return { status: "success", message: "Deferment sub category deleted successfully" };
        // } else {
        //     throw { code: "cancelled", message: "Error deleting deferment category." };
        // }
    } catch (error) {
        logger.log("error ===> ", error);
        throw new HttpsError(error?.code, error?.message);
    }
});

module.exports = {
    createDefermentCategory,
    createDefermentSubCategory,
    getDefermentCategories,
    deleteCategory,
    deleteSubCategory
};
