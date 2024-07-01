
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

const createRole = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const { name, password } = data
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

const getRoles = onCall(async ({ }) => {
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

const getRole = onCall(async ({ }) => {
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


module.exports = { login, createUser, getUsers }