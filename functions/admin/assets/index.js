
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
const { currentTime } = require("../../helpers");
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");


const createAsset = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const db = admin.firestore()
        const { name, field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate } = data
        const id = crypto.randomBytes(8).toString("hex");
        const payload = { listId: id, assetName: name, field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate, created: currentTime }

        if (!name) {
            throw { code: 'cancelled', message: 'Please provide asset name' }
        }

        await db.collection('assets').doc(name).collection("assetList").doc(id).set(payload)
        logger.log('PAYLOAD ----', payload)
        // await db.collection('assets').doc(name).set(payload)
        return { status: 'success', message: 'Asset created successfully', data }

    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});
// const updateAsset = onCall(async (request) => {
//     try {
//         let { data } = request

//         logger.log('data ----', { data })
//         const db = admin.firestore()
//         const { name,
//              field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate 
//         } = data
//         const nameIsTaken = (await db.collection("assets").where("name", "==", name).get()).docs[0].exists
//         if (!nameIsTaken) throw { code: "cancelled", message: "Asset not found!" }
//         // const id = crypto.randomBytes(8).toString("hex");
//         const payload = {  name, 
//             // field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate,
//              created: currentTime }
//         logger.log('PAYLOAD ----', payload)
//         await db.collection('assets').doc(name).set(payload)
//         return { status: 'success', message: 'Asset created successfully', data }

//     } catch (error) {
//         logger.log('error ===> ', error)
//         throw new HttpsError(error?.code, error?.message)
//     }
// });

// const createAssets = onCall(async (request) => {
//     try {
//         let { data } = request
//         logger.log('data ----', { data })
//         const { users } = data
//         const db = admin.firestore()


//         const allFilled = (data, fields = []) => fields.every(field => data?.[field])
//         const listCompete = users?.every(user => allFilled(user, ['firstName', 'lastName', 'email']))

//         if (!listCompete) throw { code: 'cancelled', message: 'some fields are missing' }

//         const chechDuplicateEmails = (list = []) => {
//             let alreadySeen = {}, res = false;
//             list.forEach(function (str = '') {
//                 if (alreadySeen[String(str).toLowerCase()]) { res = true }
//                 else { alreadySeen[String(str).toLowerCase()] = true; }
//             });
//             return res
//         }
//         const hasDuplicateEmail = chechDuplicateEmails(users?.map(user => user?.email))
//         if (hasDuplicateEmail) throw { code: 'cancelled', message: 'Duplicate email found' }


//         // return { status: 'success', data: {}, message: 'Users added successfully' }
//         let success = 0
//         for (let i = 0; i < users.length; i++) {

//             // let user = { ...users[i], password: generatePass() };
//             // logger.log(user)
//             // const { email, password } = user
//             // genUid(email, password)
//             //     .then((res) => {
//             //         const uid = res.uid
//             //         saveUserInDb(user, uid).then(() => {
//             //             success++
//             //         }).catch(err => logger.log('Error in saveUserInDb', err))
//             //     }).catch(err => logger.log('Error in genUid', err))
//         }
//         return { status: 'success', data: {}, message: 'Users added successfully' }


//     } catch (error) {
//         logger.log('error ===> ', error)
//         throw new HttpsError(error?.code, error?.message)
//     }
// });
const getAssets = onCall(async ({ }) => {
    const limit = 10
    logger.log("------")
    try {
        const db = admin.firestore()
        const docs = (await db.collectionGroup('assetList').get()).docs
        // logger.log("docs =>", docs.map(doc => doc.data()))
        // let list = []
        // // for (let i = 0; i < docs.length; i++) {
        // //     const doc = docs[i];
        // //     logger.log("asset : => ",doc.data())
        // //     const assetData = (await doc.ref.collection('assetList').get()).docs.map(doc => doc.data())
        // //     logger.log({assetData})
        // //     list.push(assetData)
        // // }

        return { status: 'success', data: docs.map(doc => doc.data()) }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})
const getAssetsName = onCall(async ({ }) => {
    const limit = 10
    logger.log("------")
    try {
        const db = admin.firestore()
        const docs = (await db.collectionGroup('assets').get()).docs
        const list = docs.map(doc => doc.id)
      
        return { status: 'success', data: list}
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})
const getAssetByName = onCall(async ({ data }) => {
    const limit = 10
    const { name } = data

    try {
        if (name) {
            const db = admin.firestore()
            const docs = (await db.collection('assets').doc(name).collection('assetList').get()).docs
            const data = docs.map(doc => doc.data())
            return { status: 'success', data }
        }else{
            throw { code: 'cancelled', message: 'Please provide asset name' }
        }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})

const updateAssetById = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        // const { assetId } = data
        const { name, field, listId, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate } = data
        const db = admin.firestore()
        if (name) {
            await db.collection("assets").doc(name).collection("assetList").doc(listId).update({ field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate })
            return { status: 'success', data, message: 'Asset updated successfully' }
        } else {
            throw { code: 'cancelled', message: 'Error updating Asset.' }
        }
    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});


const deleteAssetById = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const { id } = data
        const db = admin.firestore()
        if (id) {
            await db.collection("assets").doc(id).delete()
            return { status: 'success', message: 'Asset deleted successfully' }
        } else {
            throw { code: 'cancelled', message: 'Error deleting asset.' }
        }
    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});





module.exports = { createAsset, getAssetByName, updateAssetById, deleteAssetById, getAssets, getAssetsName }