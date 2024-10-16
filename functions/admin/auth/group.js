
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
const dayjs = require("dayjs");
const { currentTime } = require("../../helpers");


const createGroup = onCall(async (request) => {
    try {
        const { data } = request
        const { groupName, members } = data
        if (!groupName) throw { code: 'cancelled', message: 'Group name is missing' }
        if (!members.length) throw { code: 'cancelled', message: 'Members should be an array of users uid\'' }
        const db = admin.firestore()

        const nameIsTaken = (await db.collection('groups').where("groupName", "==", groupName).get())?.docs[0]?.exists

        if (nameIsTaken) throw { code: 'cancelled', message: 'Group name is taken' }

        const created = currentTime
        const id = crypto.randomBytes(8).toString("hex");
        await db.collection("groups").doc(id).set({ groupName, members, created, id })
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
const assignAssetsToGroup = onCall(async ({ data }) => {

    try {
        const { groupId, assets } = data
        if (!groupId) throw { code: 'cancelled', message: 'Group id is missing' }
        if (!assets.length) throw { code: 'cancelled', message: 'Assets should be an array of users uid\'' }
        const db = admin.firestore()
        const res = (await db.collection("groups").doc(groupId).get()).data()
        logger.log("group => ", res)
        let groupAssets = res?.assets || []
        let message = ''
        assets.forEach(asset => {
            if (!groupAssets.includes(asset)) groupAssets.push(asset)
        });
        await db.collection("groups").doc(groupId).update({ assets: groupAssets })
        return { status: 'success', data: {}, message: 'Assets added successfully' }
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


const deleteGroupAsset = onCall(async ({ data }) => {
    try {
        const { groupId, asset } = data
        if (!groupId) throw { code: 'cancelled', message: 'Group id is missing' }
        if (!asset) throw { code: 'cancelled', message: 'No asset provided' }

        const db = admin.firestore()
        const res = (await db.collection("groups").doc(groupId).get()).data()
        let groupAssets = res?.assets || []

        await db.collection("groups").doc(groupId).update({ assets: groupAssets?.filter(groupAsset => groupAsset !== asset) })
        return { status: 'success', data: {}, message: 'Asset deleted successfully' }
    } catch (error) {
        logger.log("error => ", error)
        throw new HttpsError(error?.code, error?.message)
    }

})


const getGroups = onCall(async (request) => {
    const limit = 10
    try {
        const { groupId } = request.data
        const db = admin.firestore()
        let res = []
        logger.log(groupId)
        if (groupId) {
            res = (await db.collection('groups').where("id", "==", groupId).get())
            logger.log("res => ", res?.docs[0])
            if (!res?.docs[0]) throw { code: 'cancelled', message: 'Group not found' }
        } else {
            res = (await db.collection('groups').get())
        }

        let groups = res?.docs.map(doc => doc?.data())
        let groupMembersFullDetails = {};

        // logger.log('groupMembersFullDetails => ', groupMembersFullDetails)
        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            const group = groups[groupIndex]
            const members = group?.members || []
            // const assets = group?.assets || []
            groupMembersFullDetails[groupIndex] = []
            // groupAssetsFullDetails[groupIndex] = []
            if (members?.length) for (let i = 0; i < members?.length; i++) {
                const member = members[i];
                const memberDetails = member ? (await db.collection('users').doc(member).get()).data() : {}
                logger.log('memberDetails => ', memberDetails)
                if (memberDetails?.uid) {
                    groupMembersFullDetails[groupIndex].push({
                        name: memberDetails?.firstName + " " + memberDetails?.lastName,
                        email: memberDetails?.email,
                        uid: memberDetails?.uid,
                    })
                }
            }
            // if (assets?.length) for (let i = 0; i < assets?.length; i++) {
            //     const asset = assets[i];
            //     const assetDetails = asset ? (await db.collection('assets').doc(asset).get()).data() : {}
            //     logger.log('assetDetails => ', assetDetails)
            //     if (assetDetails?.id) {
            //         groupAssetsFullDetails[groupIndex].push(assetDetails)
            //     }
            // }

        }
        let result = []
        if (groupId) {
            result = {
                ...groups[0],
                members: groupMembersFullDetails[0],
                // assets: groupAssetsFullDetails[0]
            }
        } else {
            result = groups.map((group, i) => ({
                ...group,
                members: groupMembersFullDetails[i],
                // assets: groupAssetsFullDetails[i]
            }))
        }
        return {
            status: 'success',
            data: result
        }
    } catch (error) {
        logger.log('error=>', error)
        return { status: 'failed', error }
    }

})


module.exports = { createGroup, addMembersToGroup, getGroups, deleteGroup, deleteGroupMember, assignAssetsToGroup, deleteGroupAsset }