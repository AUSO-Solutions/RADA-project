
const admin = require("firebase-admin");
// const { getFirestore } = require("firebase-admin/firestore");
// const logger = require("firebase-functions/logger");
// const { onCall } = require("firebase-functions/v2/https");
const { login, createUser, getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers } = require("./admin/auth");

const { getGroups, createGroup, addMembersToGroup, deleteGroupMember, deleteGroup, deleteGroupAsset, assignAssetsToGroup } = require("./admin/auth/group");
const { createAsset, getAssetByName, updateAssetById, deleteAssetById, getAssets, getAssetsName, importMasterXY } = require('./admin/assets')
const { createRole, updateRole, deleteRole, getRoles, getRole, assignPermissionToRole } = require('./admin/rolesandpermissions');
const { createSetup, deleteSetup, getSetups, updateSetup, getSetup } = require("./fielddatacapturesetup/volumemeasurementsetup");
const { captureOilOrCondensate, captureGas, updateOilOrCondensate, getOilOrCondensateVolumeByID, deleteOilOrCondensateVolumeByID, getOilOrCondensateVolumesByAsset } = require("./fielddatacapturesetup/volume.measurement");
const { createMerSchedule } = require("./fielddatacapturesetup/merdataSetup");
const { processIPSC } = require('./fielddatacapturesetup/oilandgasaccounting/')
const { getInsight } = require('./admin/insights')
const { getInsights } = require('./admin/insights/index2')
// const { setupWellTestData, getSetups, updateWellTestData, deleteWellTestDataSetup } = require('./fielddatacapturesetup/welltestsetup')

admin.initializeApp()

const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });


module.exports = {
  createUser, login, getUsers, getUserByUid, deleteUserByUid, updateUserByUid, createUsers,

  createGroup, addMembersToGroup, getGroups, deleteGroup, deleteGroupMember, assignAssetsToGroup, deleteGroupAsset,

  createAsset, getAssetByName, updateAssetById, deleteAssetById, getAssets, getAssetsName, importMasterXY,

  createRole, updateRole, deleteRole, getRoles, getRole, assignPermissionToRole,

  createSetup, deleteSetup, getSetups, updateSetup, getSetup,

  // setupWellTestData, getSetups, updateWellTestData, deleteWellTestDataSetup,

  captureOilOrCondensate,
  captureGas,
  updateOilOrCondensate,
  getOilOrCondensateVolumeByID,
  getOilOrCondensateVolumesByAsset,
  deleteOilOrCondensateVolumeByID,

  createMerSchedule,
  processIPSC,
  getInsight, getInsights
}