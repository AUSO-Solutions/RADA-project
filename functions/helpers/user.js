const admin = require("firebase-admin");

const getUidByIdtoken = async (idToken) => {
    try {
        if (!idToken) throw { message: 'Please provide user idToken', code: 'cancelled' }
        const userAuth = await admin.auth().verifyIdToken(idToken)
        return userAuth
    } catch (error) {
        throw error
    }
}

const getUser = async (idToken) => {
    try {
        const db = admin.firestore()
        const { uid } = await getUidByIdtoken(idToken)
        const user = (await db.collection('users').doc(uid).get())?.data()
        // console.log(user)
        return user
    } catch (error) {
        console.log(error)
        throw { message: 'An  error occured!', code: 'cancelled' }
    }
}
const getPermissions = async (idToken, { check = [] }) => {
    try {
        const db = admin.firestore()
        const user = await getUser(idToken)
        const userRoles = user?.roles
        const roles = (await db.collection('roles').where('id', 'in', userRoles).get())?.docs?.map(doc => doc?.data())
        const roleNames = roles?.map(role => role?.roleName)
        const permissions = roles?.flatMap(role => role?.permissions)
        console.log(roles, permissions)
        if (check?.length) {
            const isPermitted = permissions.some(permitted => check.includes(permitted))
            if (!isPermitted) throw { message: 'User is not authenticated', code: 'cancelled' }
        }
        return { roleNames, permissions }
    } catch (error) {
        console.log(error, 'getPermissions')
        throw error
    }
}
const getUserGroups = async (idToken) => {

    try {
        const db = admin.firestore()
        const { uid } = await getUidByIdtoken(idToken)
        const groups = (await db.collection('groups').where('members', 'array-contains', uid).get()).docs.map(doc => doc.data())
        const assets = Array.from(new Set(groups.flatMap(group => group?.assets)))

        return { groups, assets }

    } catch (error) {
        throw error
    }
}

// const getGroup = async (idToken) => {

//     try {
//         const db = admin.firestore()
//         const { uid } = await getUidByIdtoken(idToken)
//         const groups = (await db.collection('groups').where('members', 'array-contains', uid).get()).docs.map(doc => doc.data())
//         const assets = Array.from(new Set(groups.flatMap(group => group?.assets)))

//         return { groups, assets }

//     } catch (error) {
//         throw error
//     }
// }


exports.getUser = getUser
exports.getPermissions = getPermissions
exports.getUserGroups = getUserGroups
