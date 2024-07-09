
const admin = require("firebase-admin");
// const { getFirestore } = require("firebase-admin/firestore");
// const logger = require("firebase-functions/logger");
// const { onCall } = require("firebase-functions/v2/https");
const { login, createUser, getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers } = require("./auth");

const { getGroups, createGroup, addMembersToGroup, deleteGroupMember, deleteGroup } = require("./auth/group");
const { createAsset, getAssetById, updateAssetById, deleteAssetById, getAssets } = require('./assets')

admin.initializeApp()

const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });


module.exports = {
  createUser,
  login,
  getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers,

  getGroups, createGroup, addMembersToGroup, deleteGroupMember, deleteGroup,

  createAsset, getAssetById, updateAssetById, deleteAssetById, getAssets
}