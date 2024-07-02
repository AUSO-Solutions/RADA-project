
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto')
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");


const hash = (password) => {
    const secret = "ped-application"
    return crypto.createHash("sha256", secret)
        .update(password).digest("hex")
}

const createUser = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const { email, password } = data
        const db = admin.firestore()

        // check if user exists
        const userExists = (await db.collection('users').where('email', "==", email).get())?.docs[0]?.exists
        logger.log('userExists', { userExists })
        if (userExists) throw { code: 'already-exists', message: 'This email is taken' }

        const { uid } = await admin.auth().createUser({ email, password })
        // const { uid } = await admin.auth().createCustomToken({ email, password })

        logger.log({ uid })
        if (uid) {
            const passwordHash = hash(data.password)
            delete data.password
            await db.collection("users").doc(uid).set({ ...data, status: 'offline', uid, passwordHash })
            return { status: 'success', data, message: 'User created successfully' }
        } else {
            throw { code: 'cancelled', message: 'Error creating user.' }
        }
    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});
const login = onCall(async ({ data }) => {

    try {
        const { email, password } = data
        logger.log({ data })
        const passwordHash = hash(password)
        // logger.log({ uid, passwordHash, passwordSalt, password_Hash })  
        const db = admin.firestore()
        const user = (await db.collection('users').where("email", "==", email).where("passwordHash", "==", passwordHash).get())?.docs[0]
        if (!user.exists) throw ({ code: "permission-denied", message: "Account does not exist" })
        logger.log("user => ", user)
        return { status: 'success', data: user.data() }
    } catch (error) {
        logger.log("error => ", error)
        throw new HttpsError(error?.code, error?.message)
    }

})

const getUsers = onCall(async ({ }) => {
    const limit = 10

    try {
        const db = admin.firestore()
        const res = await db.collection('users').get()
        const data = res?.docs?.map(doc => doc.data()) || []
        return { status: 'success', data }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})
const getUserByUid = onCall(async ({ data }) => {
    const limit = 10
    const { uid } = data

    try {
        if (uid) {
            const db = admin.firestore()
            const res = await db.collection('users').doc(uid).get()
            const data = res.data()
            return { status: 'success', data }
        }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})

const updateUserByUid = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const { email, uid, firstName, lastName, roles } = data
        const db = admin.firestore()
        if (uid) {
            await db.collection("users").doc(uid).update({ firstName, lastName, email, roles })
            return { status: 'success', data, message: 'User updated successfully' }
        } else {
            throw { code: 'cancelled', message: 'Error updating user.' }
        }
    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});


const deleteUserByUid = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const { uid } = data
        const db = admin.firestore()
        if (uid) {
            await admin.auth().deleteUser(uid)
            await db.collection("users").doc(uid).delete()
            return { status: 'success', message: 'User deleted successfully' }
        } else {
            throw { code: 'cancelled', message: 'Error deleting user.' }
        }
    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});




module.exports = { login, createUser, getUsers, updateUserByUid, deleteUserByUid, getUserByUid }