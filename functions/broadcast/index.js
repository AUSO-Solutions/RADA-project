
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: "smtp.example.com",
    // port: 587,
    // secure: false, // upgrade later with STARTTLS
    auth: {
        user: 'kehindesalaudeen222@gmail.com',
        pass: 'nffa llda lyrf jzle'
    }
});

const broadcast = onCall(async (request) => {
    try {
        const { data } = request;
        logger.log("Data ----", { data });
        const { attachment, groups, pagelink, subject, type, date } = data;
        const db = admin.firestore()
        // console.log(typeof groups, groups?.length)
        const members = groups.flatMap(group => (group?.members.map(member => ({ group: group?.groupName, ...member }))))

        var maillist = members?.map(member => member?.email).join(',');

        // console.log(members, maillist)

        const link = 'https://ped-application-4d196.web.app'
        var msg = {
            from: "kehindesalaudeen222@gmail.com'", // sender address
            to: maillist,
            subject, // Subject line
            // text: " Hello you are receiving this broadcast from Rada Application ", // plaintext body
            html: `<b>Hello</b> <br>
<p>
    This is ${type} broadcast for ${date} <br> <br>
    
    <a href="${link + pagelink}">View in app </a><br>
    <a href="${attachment}">View attached file</a><br>

    <br> <br>
    You are receiving this email because you are registered to the PED Application 

</p>` // html body
        }

        await transporter.sendMail(msg, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        await db.collection('broadcast').add({
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
    broadcast,
};