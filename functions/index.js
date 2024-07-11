
const admin = require("firebase-admin");
// const { getFirestore } = require("firebase-admin/firestore");
// const logger = require("firebase-functions/logger");
// const { onCall } = require("firebase-functions/v2/https");
const { login, createUser, getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers } = require("./admin/auth");

const { getGroups, createGroup, addMembersToGroup, deleteGroupMember, deleteGroup, deleteGroupAsset, assignAssetsToGroup } = require("./admin/auth/group");
const { createAsset, getAssetById, updateAssetById, deleteAssetById, getAssets } = require('./admin/assets')
const  { createRole, updateRole, deleteRole, getRoles, getRole, assignPermissionToRole } = require('./admin/rolesandpermissions')

admin.initializeApp()

const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });


module.exports = {
  createUser, login, getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers,

  createGroup, addMembersToGroup, getGroups, deleteGroup, deleteGroupMember, assignAssetsToGroup, deleteGroupAsset,

  createAsset, getAssetById, updateAssetById, deleteAssetById, getAssets,

  createRole, updateRole, deleteRole, getRoles, getRole, assignPermissionToRole
}