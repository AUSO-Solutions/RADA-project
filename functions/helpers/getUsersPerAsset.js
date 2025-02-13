
const admin = require("firebase-admin");
module.exports = async () => {

    try {
        const db = admin.firestore();
        const assets = (await db.collection('assets').listDocuments()).map(doc => doc.id)
        const assetsMembersUid = {}, assetsUsers = {}
        const assetsPromise = assets.map(async asset => {
            const groups = (await (db.collection("groups").where('assets', 'array-contains', asset).get())).docs.map(doc => doc.data())

            const allMembersUID = Array.from(new Set(groups?.flatMap(group => group?.members)))
            allMembersUID.forEach(uid => {
                if (assetsMembersUid[asset]?.length) {
                    if (!assetsMembersUid[asset].includes(uid)) assetsMembersUid[asset].push(uid)
                } else {
                    assetsMembersUid[asset] = [uid]
                }
            })
            const assetUsers = (await Promise.all(assetsMembersUid[asset]?.map(async (member) => (await db.collection("users").doc(member).get()).data()))).filter(user => user?.email)
            // const mailList = assetUsers.map(user => user?.email)
            assetsUsers[asset] = assetUsers
            return assetUsers

        })
        await Promise.all(assetsPromise)
        return assetsUsers
    } catch (error) {
        console.log(error)
        throw error
    }
}