
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");




const createGroup = onCall(async (request) => {
    // try {
    //     let { data } = request
    //     const name = data?.group_name
    //     const dateCreated = Date.now()
    //     await db.collection("groups").doc(name).set({ group_name, members: [], dateCreated })
    //     return { status: 'success', data, message: 'User created successfully' }

    // } catch (error) {
    //     logger.log('error ===> ', error)
    //     throw new HttpsError(error?.code, error?.message)
    // }
});
const addMembersToGroup = onCall(async ({ data }) => {

    // try {
    //     const { email, password } = data
    //     logger.log({ data })
    //     const passwordHash = hash(password)
    //     // logger.log({ uid, passwordHash, passwordSalt, password_Hash })  
    //     const db = admin.firestore()
    //     const user = (await db.collection('users').where("email", "==", email).where("passwordHash", "==", passwordHash).get())?.docs[0]
    //     if (!user.exists) throw ({ code: "permission-denied", message: "Account does not exist" })
    //     logger.log("user => ", user)
    //     return { status: 'success', data: user.data() }
    // } catch (error) {
    //     logger.log("error => ", error)
    //     throw new HttpsError(error?.code, error?.message)
    // }

})

const getGroups = onCall(async ({ }) => {
    // const limit = 10

    // try {
    //     const db = admin.firestore()
    //     const res = await db.collection('users').get()
    //     const data = res?.docs?.map(doc => doc.data()) || []
    //     return { status: 'success', data }
    // } catch (error) {
    //     logger.log('error=>', error)
    //     return { status: 'failed', error }
    // }

})


// module.exports = { login, createUser, getUsers },xw