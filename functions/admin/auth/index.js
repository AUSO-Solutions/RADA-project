
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
const { currentTime } = require("../../helpers");
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");


const hash = (password) => {
    const secret = "ped-application"
    return crypto.createHash("sha256", secret)
        .update(password).digest("hex")
}
function generatePass() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
}


const genUid = async (email, password) => {
    // check if user exists
    const db = admin.firestore()
    const userExists = (await db.collection('users').where('email', "==", email).get())?.docs[0]?.exists
    logger.log('userExists', { userExists })
    if (userExists) throw { code: 'already-exists', message: 'This email is taken' }
    const { uid } = await admin.auth().createUser({ email, password })
    return { uid }
}

const saveUserInDb = async (data, uid) => {
    const db = admin.firestore()
    let user = data
    const passwordHash = hash(user.password)
    delete user.password
    const created = currentTime
    await db.collection("users").doc(uid).set({ ...user, status: 'offline', uid, passwordHash, created })
    return { user }
}

const createUser = onCall(async (request) => {
    try {
        let { data } = request

        logger.log('data ----', { data })
        const { email, password } = data

        const db = admin.firestore()
        const { uid } = await genUid(email, password)
        logger.log({ uid })
        const { user } = await saveUserInDb(data, uid)
        return { status: 'success', message: 'User created successfully', data: user }

    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});

const createUsers = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const { users } = data
        const db = admin.firestore()


        const allFilled = (data, fields = []) => fields.every(field => data?.[field])
        const listCompete = users?.every(user => allFilled(user, ['firstName', 'lastName', 'email']))

        if (!listCompete) throw { code: 'cancelled', message: 'some fields are missing' }

        const chechDuplicateEmails = (list = []) => {
            let alreadySeen = {}, res = false;
            list.forEach(function (str = '') {
                if (alreadySeen[String(str).toLowerCase()]) { res = true }
                else { alreadySeen[String(str).toLowerCase()] = true; }
            });
            return res
        }
        const hasDuplicateEmail = chechDuplicateEmails(users?.map(user => user?.email))
        if (hasDuplicateEmail) throw { code: 'cancelled', message: 'Duplicate email found' }


        // return { status: 'success', data: {}, message: 'Users added successfully' }
        let success = 0
        for (let i = 0; i < users.length; i++) {

            let user = { ...users[i], password: generatePass() };
            logger.log(user)
            const { email, password } = user
            genUid(email, password)
                .then((res) => {
                    const uid = res.uid
                    saveUserInDb(user, uid).then(() => {
                        success++
                    }).catch(err => logger.log('Error in saveUserInDb', err))
                }).catch(err => logger.log('Error in genUid', err))
        }
        return { status: 'success', data: {}, message: 'Users added successfully' }


    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});
const login = onCall(async ({ data, auth }) => {

    try {
        const { email, password } = data
        logger.log({ data })
        const passwordHash = hash(password)
        // logger.log({ uid, passwordHash, passwordSalt, password_Hash })  
        const db = admin.firestore()
        // const auth = admin.auth()

        const user = (await db.collection('users').where("email", "==", email).where("passwordHash", "==", passwordHash).get())?.docs[0]
        if (!user?.exists) throw ({ code: "permission-denied", message: "Account does not exist" })
        logger.log("user => ", user)

        // const userauth = (await auth.getUser(user?.data().uid))
        return {
            status: 'success', data: user.data(), userauth
        }
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
        const roles = (await db.collection("roles").get()).docs.map(doc => doc.data())
        let userRole = [], lastSigned = []
        data.forEach(async (user, i) => {
            const roleIds = user?.roles
            if (roleIds?.length) {
                userRole[i] = roles.filter(role => roleIds.includes(role?.id))
            }
            lastSigned[i] = (await admin.auth().getUserByEmail(user?.email)).metadata.lastSignInTime
        })
        logger.log(userRole, 'ddd')
        const result = data?.map((user, i) => ({ ...user, roles: userRole[i], lastSigned: lastSigned[i] }))

        return { status: 'success', data: result }
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
            // const roles = [...data?.roles]?.map(async (role) => {
            //     return
            // })

            let roles = []
            for (let roleIndex = 0; roleIndex < data?.roles.length; roleIndex++) {
                try {
                    const role = data?.roles[roleIndex];
                    roles.push((await db.collection('roles').doc(role).get()).data())
                } catch (error) {
                    console.log(error)
                    throw error
                }
            }


            return { status: 'success', data: { ...data, roles } }
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


const updateUserStatusByUid = onCall(async (request) => {
    try {
        let { data } = request
        logger.log('data ----', { data })
        const { uid, status } = data
        const db = admin.firestore()
        if (uid) {
            await db.collection("users").doc(uid).update({ status })
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

const forgotPassword = onCall(async (request) => {
    try {
        let { email } = request.data
        // logger.log('data ----', { data })
        // const { uid } = data
        // const db = admin.firestore()
        const defaultPassword = "password123"
        if (email) {
            await admin.auth().generatePasswordResetLink(email)
            // await db.collection("users").doc(uid).delete()
            // return { status: 'success', message: 'User deleted successfully' }
        } else {
            throw { code: 'cancelled', message: 'Error deleting user.' }
        }
    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});




module.exports = { login, createUser, getUsers, updateUserByUid, deleteUserByUid, getUserByUid, createUsers, updateUserStatusByUid }