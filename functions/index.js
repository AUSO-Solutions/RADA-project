
const admin = require("firebase-admin");
// const { getFirestore } = require("firebase-admin/firestore");
// const logger = require("firebase-functions/logger");
// const { onCall } = require("firebase-functions/v2/https");
const { login, createUser, getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers } = require("./auth");

const { getGroups, createGroup, addMembersToGroup, deleteMembersToGroup } = require("./auth/group");

admin.initializeApp()


module.exports = {
  createUser,
  login,
  getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers,

  getGroups, createGroup, addMembersToGroup, deleteMembersToGroup
}