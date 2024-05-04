
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { crypto } = require('crypto')


const createGroup = onCall(async (request) => {
    try {
        const { data } = request
        const { groupName, members } = data
        if (!groupName) throw { code: 'cancelled', message: 'Group name is missing' }
        if (!members.length) throw { code: 'cancelled', message: 'Members should be an array of users uid\'' }
        const dateCreated = Date.now()
        const db = admin.firestore()
        const id = crypto.randomBytes(8).toString("hex");
        await db.collection("groups").doc(id).set({ groupName, members: [], dateCreated, id })
        return { status: 'success', data, message: 'Group created successfully' }
    } catch (error) {
        logger.log('error ===> ', error)
        throw new HttpsError(error?.code, error?.message)
    }
});
const addMembersToGroup = onCall(async ({ data }) => {

    try {
        const { groupId, members } = data
        if (!groupId) throw { code: 'cancelled', message: 'Group id is missing' }
        if (!members.length) throw { code: 'cancelled', message: 'Members should be an array of users uid\'' }
        const db = admin.firestore()
        const res = (await db.collection("groups").doc(groupId).get()).data()
        let groupMembers = res?.members || []
        let message = ''
        members.forEach(member => {
            if (!groupMembers.includes(member)) groupMembers.push(uid)
        });
        await db.collection("groups").doc(groupId).update({ members })
        return { status: 'success', data: {}, message: 'Members added successfully' }
    } catch (error) {
        logger.log("error => ", error)
        throw new HttpsError(error?.code, error?.message)
    }

})
const deleteMembersToGroup = onCall(async ({ data }) => {

    try {


        const { groupId, members } = data
        if (!groupId) throw { code: 'cancelled', message: 'Group id is missing' }
        if (!members.length) throw { code: 'cancelled', message: 'Members should be an array of users uid\'' }

        const db = admin.firestore()
        const res = (await db.collection("groups").doc(groupId).get()).data()
        let groupMembers = res?.members || []
        let message = ''

        members.forEach(member => {
            if (groupMembers.includes(member)) groupMembers.filter(memUid => memUid === member)
        });
        await db.collection("groups").doc(groupId).update({ members })
        return { status: 'success', data: {}, message: 'Members deleted successfully' }
    } catch (error) {
        logger.log("error => ", error)
        throw new HttpsError(error?.code, error?.message)
    }

})


const getGroups = onCall(async ({ }) => {
    const limit = 10

    try {
        const db = admin.firestore()
        const res = await db.collection('groups').get()

        const data = res?.docs?.map(doc => doc.data()) || []
        return { status: 'success', data }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})


module.exports = { createGroup, addMembersToGroup, getGroups, deleteMembersToGroup }