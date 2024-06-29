
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto')
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");


const saveUserInAuth = async (email, password) => {
    try {
        // const { uid } = await admin.auth().getUserByEmail(email)
        // logger.log({ uid, message: 'user exists', email })
        // if (uid) return { uid: false, message: 'User already exists' }
        const db = admin.firestore()
        const userExists = (await db.collection('users').where('email', "==", email).get()).docs[0].exists()
        if (userExists) return { status: 'failed', message: 'Email is taken' }
        const user = await admin.auth().createUser({ email, password })
        return { status: 'success', message: 'User created successfully', user }

    } catch (error) {
        return ({ error, message: 'Error ' })
    }
}

const saveUserInFirestore = async ({ firstName = '', lastName, email, role, emailVerifed = false, uid }) => {
    try {
        const db = admin.firestore()
        await db.collection("users").doc(uid).set({
            firstName, lastName, email, role, emailVerifed, uid
        })
    } catch (error) {
        return ({ error, message: 'Error writing to db' })
    }

}

const createUser = onCall(async (request) => {
    try {
        const { data } = request
        logger.log({ data })
        const res = await saveUserInAuth(data?.email, data?.password)
        const user =  res?.user
        // logger.log({ user })
        if (user?.uid) {
            await saveUserInFirestore({ ...data, uid: user.uid })
            return { status: 'success', data, message: 'User created successfully' }
        }else{
            return { status: 'failed', message: 'This email is taken' }
        }
    } catch (error) {
        return { status: 'failed', error }
    }
});
const login = onCall(async ({ data }) => {

    try {

        const db = getFirestore()
        // const res = await db.collection('users').get()

        return { status: 'success', data }
    } catch (error) {
        return { status: 'failed', error }
    }

})

module.exports = { login, createUser }