
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
const dayjs = require("dayjs");


const createGroup = onCall(async (request) => {
    try {
        const { data } = request
        const { groupName, members } = data
        if (!groupName) throw { code: 'cancelled', message: 'Group name is missing' }
        if (!members.length) throw { code: 'cancelled', message: 'Members should be an array of users uid\'' }
        const db = admin.firestore()

        const nameIsTaken = (await db.collection('groups').where("groupName", "==", groupName).get())?.docs[0]?.exists

        if (nameIsTaken) throw { code: 'cancelled', message: 'Group name is taken' }

        const dateCreated = dayjs().format("MMM DD, YYYY. hh:mmA")
        const id = crypto.randomBytes(8).toString("hex");
        await db.collection("groups").doc(id).set({ groupName, members, dateCreated, id })
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
        logger.log("group => ", res)
        let groupMembers = res?.members || []
        let message = ''
        members.forEach(member => {
            if (!groupMembers.includes(member)) groupMembers.push(member)
        });
        await db.collection("groups").doc(groupId).update({ members: groupMembers })
        return { status: 'success', data: {}, message: 'Members added successfully' }
    } catch (error) {
        logger.log("error => ", error)
        throw new HttpsError(error?.code, error?.message)
    }

})
const deleteGroup = onCall(async ({ data }) => {
    try {
        const { groupId } = data
        if (!groupId) throw { code: 'cancelled', message: 'Group id is missing' }

        const db = admin.firestore()

        await db.collection("groups").doc(groupId).delete()
        return { status: 'success', data: {}, message: 'Members deleted successfully' }
    } catch (error) {
        logger.log("error => ", error)
        throw new HttpsError(error?.code, error?.message)
    }

})
const deleteGroupMember = onCall(async ({ data }) => {
    try {
        const { groupId, member } = data
        if (!groupId) throw { code: 'cancelled', message: 'Group id is missing' }
        if (!member) throw { code: 'cancelled', message: 'No member provided' }

        const db = admin.firestore()
        const res = (await db.collection("groups").doc(groupId).get()).data()
        let groupMembers = res?.members || []

        await db.collection("groups").doc(groupId).update({ members: groupMembers?.filter(groupMember => groupMember !== member) })
        return { status: 'success', data: {}, message: 'Member deleted successfully' }
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

        let groups = res?.docs.map(doc => doc?.data())
        let groupMembersFullDetails = {}

        // logger.log('groupMembersFullDetails => ', groupMembersFullDetails)
        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            const group = groups[groupIndex]
            const members = group?.members
            logger.log('group => ', group)
            logger.log('members => ', members)
            groupMembersFullDetails[groupIndex] = []
            for (let i = 0; i < members.length; i++) {
                const member = members[i];
                const memberDetails = member ? (await db.collection('users').doc(member).get()).data() : {}
                logger.log('memberDetails => ', memberDetails)
                groupMembersFullDetails[groupIndex].push({
                    name: memberDetails?.firstName + " " + memberDetails?.lastName,
                    email: memberDetails?.email,
                    uid: memberDetails?.uid,
                })
            }
            logger.log('groupMembersFullDetails => ', groupMembersFullDetails)

        }
        return { status: 'success', data: groups.map((group, i) => ({ ...group, members: groupMembersFullDetails[i] })) }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})


module.exports = { createGroup, addMembersToGroup, getGroups, deleteGroup, deleteGroupMember }