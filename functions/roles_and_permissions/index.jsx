
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto')
// const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");


const hash = (password) => {
    const secret = "ped-application"
    return crypto.createHash("sha256", secret)
        .update(password).digest("hex")
}

const createRole = onCall(async (request) => {
  
});

const getRoles = onCall(async ({ }) => {
  

})

const getRole = onCall(async ({ }) => {
   

})


module.exports = { login, createUser, getUsers }