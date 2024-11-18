
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { transporter, sender, frontendUrl } = require("../helpers");

const updateStatus = onCall(async (request) => {
    try {
        const { data } = request;
        logger.log("Data ----", { data });
        const { status, query, groups, pagelink, type, date, users, setupType, setup } = data;
        const db = admin.firestore()
        const members = groups.flatMap(group => (group?.members.map(member => ({ group: group?.groupName, ...member }))))?.concat(users?.map(user => user?.email))

        var maillist = members?.map(member => member?.email).join(',');
        let html = '', subject = ''
        const details = ` ${setup?.asset}/${type}/${setup?.month} `
        if (status === 'query') {
            subject = `${details} Queried`
            html = `<b>Hello</b> <br>
            <p>
                This is ${type} for ${date} has just been queried <br> <br>
                Query : ${query}
                <a href="${frontendUrl + pagelink}">View in app </a><br>
                <br> <br>
                You are receiving this email because you are registered to the PED Application 

            </p>`
        }
        if (status === 'approved') {
            subject = `${details}  Approved`
            html = `<b>Hello</b> <br>
            <p>
                This is ${type} for ${date} has just been Approved <br> <br>
          
                <a href="${frontendUrl + pagelink}">View in app </a><br>
                <br> <br>
                You are receiving this email because you are registered to the PED Application 

            </p>`
        } if (status === 'rolled-back') {
            subject = `${details}  Rolled Back`
            html = `<b>Hello</b> <br>
            <p>
                This is ${type} for ${date} has just been Rolled Back <br> <br>
           
                <a href="${frontendUrl + pagelink}">View in app </a><br>
                <br> <br>
                You are receiving this email because you are registered to the PED Application 

            </p>`
        }

        var msg = {
            from: sender, // sender address
            to: maillist,
            subject,
            html
        }

        // transporter.sendMail(msg, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //     }
        // });

        await transporter().send(msg)

        await db.collection('setup').doc(setupType).update({ status, query: query || null })
        await db.collection('queries').add({
            attachment, groups, pagelink
        })

        return {
            attachment, groups, pagelink
        }
        // return { status: "success", data: JSON.stringify(result) };
    } catch (error) {
        console.log({ error })
        if (error.message) throw new HttpsError(error?.code, error?.message);
        throw error;
    }
});




module.exports = {
    updateStatus,
};
