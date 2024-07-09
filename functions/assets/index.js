
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
const { currentTime } = require("../helpers");
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");


const createAsset = onCall(async (request) => {
    try {
        let { data } = request

        logger.log('data ----', { data })
        const { name, field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate } = data
        const db = admin.firestore()
        const id = crypto.randomBytes(8).toString("hex");
        const payload = { id, name, field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate, created: currentTime }
        logger.log('PAYLOAD ----', payload)
        await db.collection('assets').doc(id).set(payload)
        return { status: 'success', message: 'Asset created successfully', data }

    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});

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

    try {
        const db = admin.firestore()
        const res = await db.collection('assets').get()
        const data = res?.docs?.map(doc => doc.data()) || []
        return { status: 'success', data }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})
const getAssetById = onCall(async ({ data }) => {
    const limit = 10
    const { id } = data

    try {
        if (id) {
            const db = admin.firestore()
            const res = await db.collection('assets').doc(id).get()
            const data = res.data()
            return { status: 'success', data }
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
        const { assetId } = data
        const { name, field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate } = data
        const db = admin.firestore()
        if (assetId) {
            await db.collection("assets").doc(assetId).update({ name, field, well, productionString, reservoir, flowStation, surfaceXcoordinate, surfaceYcoordinate })
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





module.exports = { createAsset, getAssetById, updateAssetById, deleteAssetById, getAssets }