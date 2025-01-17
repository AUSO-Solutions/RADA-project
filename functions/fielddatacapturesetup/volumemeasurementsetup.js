
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
const { frontendUrl, transporter, sender } = require("../helpers");

const createSetup = onCall(async (request) => {

    try {
        let { data } = request;
        // delete data.idToken
        const { asset, setupType, ...rest } = data;
        // const validAssets = ['OML 24', 'OML 155', 'OML 147', "OML 45"];
        // if (!validAssets.includes(asset)) {
        //     throw { message: 'Invalid asset', code: 'cancelled' };
        // }

        const id = crypto.randomBytes(8).toString("hex");
        const db = admin.firestore();
        const payload = {
            asset,
            id,
            created: Date.now(),
            ...rest
        }

        await db.collection('setups').doc(setupType).collection("setupList").doc(id).set(payload);

        return { message: `Document created`, data: payload };

    } catch (error) {
        console.error('Error adding document: ', error);
        throw new HttpsError(error)
    }
});

const updateSetup = onCall(async (request) => {

    try {
        let { data } = request;

        const { id, setupType, ...rest } = data;
        if (!id) {
            throw { message: 'Provide a setup id', code: 'cancelled' };
        }
        // const validReportTypes = ['Gross Liquid', 'Net Oil/ Condensate', 'Gas'];
        // if (!Array.isArray(reportTypes) || !reportTypes.filter(reportType => validReportTypes.includes(reportType)).length) {
        //     throw { message: 'Invalid report types', code: 'cancelled' };
        // }
        const db = admin.firestore();
        await db.collection('setups').doc(setupType).collection("setupList").doc(id).update({

            ...rest
        });

        return { message: `Setup updated` };

    } catch (error) {
        console.error('Error adding document: ', error);
        // return { message: 'Internal Server Error' };
        throw new HttpsError(error)
    }
});

const updateSetupStatus = onCall(async (request) => {

    try {
        let { data } = request;

        const db = admin.firestore();
        const { id, setupType, status, statusMessage, subject, groups = [], users = [], title, pagelink } = data;
        if (!id) throw { message: 'Provide a setup id ', code: 'cancelled' };
        if (!status) throw { message: 'Provide a status ', code: 'cancelled' };
        if (!setupType) throw { message: 'Provide a setupType ', code: 'cancelled' };
        const statuses = ['approved', 'rolled back', 'queried']
        if (!statuses.includes(status)) throw { message: `allowed status includes ${statuses?.join(', ')}`, code: 'cancelled' }
        const members = groups.flatMap(group => (group?.members.map(member => ({ group: group?.groupName, ...member }))))
        const emailAddresses = Array.from(new Set(members?.map(member => member?.email)?.concat(users?.map(user => user?.email))))
        var maillist = emailAddresses .join(',');
        console.log(maillist)

        var msg = {
            from: sender, // sender address
            to: maillist,
            subject, // Subject line
            html: `<b>Hello</b> <br>
            <p>
                ${title} has been ${status?.toLowerCase()}<br> <br>
                ${statusMessage}<br />
                <a href="${frontendUrl + pagelink}">View in app </a><br>
                <br> <br>
                You are receiving this email because you are registered to the PED Application 
            </p>`
        }
        // await transporter().sendMultiple(msg)
        transporter.sendMail(msg, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        await db.collection('setups').doc(setupType).collection("setupList").doc(id).update({
            status: status?.toLowerCase(), statusMessage
        });

        return { message: `Setup updated` };

    } catch (error) {
        console.error('===> ', error);
        // return { message: 'Internal Server Error' };
        throw new HttpsError(error)
    }
});

const deleteSetup = onCall(async (request) => {

    try {
        let { data } = request;
        const { id, setupType } = data;
        if (!id) {
            throw { message: 'Provide a setup id', code: 'cancelled' };
        }

        const db = admin.firestore();
        await db.collection('setups').doc(setupType).collection("setupList").doc(id).delete()

        return { message: `Setup deleted` };

    } catch (error) {
        console.error('Error adding document: ', error);
        // return { message: 'Internal Server Error' };
        throw new HttpsError(error)
    }
});

const getSetups = onCall(async (request) => {
    try {
        const { data } = request
        const setupType = data?.setupType
        const db = admin.firestore();

        const uid = (await admin.auth().verifyIdToken(data?.idToken)).uid
        const groups = (await db.collection('groups').where('members', 'array-contains', uid).get()).docs.map(doc => doc.data())
        const assets = Array.from(new Set(groups.flatMap(group => group?.assets)))
        const res = await db.collection('setups').doc(setupType).collection('setupList').where('asset', 'in', assets).get()
        return { message: "Successful ", data: res.docs.sort((a, b) => b.created - a.created).map(doc => ({ ...doc.data() })) }
    } catch (error) {

    }
})
const getSetup = onCall(async (request) => {
    const { data } = request
    const { setupType, id } = data
    const db = admin.firestore();
    const res = await db.
        collection('setups')
        .doc(setupType)
        .collection('setupList')
        .doc(id).get()
    return { message: "Successful ", data: res?.data() }
})
const getSetupByMonth = onCall(async (request) => {
    const { data } = request
    const { setupType, month } = data
    const db = admin.firestore();
    const res = await db.
        collection('setups')
        .doc(setupType)
        .collection('setupList').where("month", '==', month)
        .get()
    return { message: "Successful ", data: res?.docs?.map(doc => doc.data()) }
})


module.exports = { createSetup, getSetups, updateSetup, getSetup, deleteSetup, getSetupByMonth, updateSetupStatus }
