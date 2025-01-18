const admin = require("firebase-admin");
// const { getFirestore } = require("firebase-admin/firestore");
// const logger = require("firebase-functions/logger");
// const { onCall } = require("firebase-functions/v2/https");
const {
  login,
  createUser,
  getUsers,
  getUserByUid,
  deleteUserByUid,
  updateUserByUid,
  createUsers,
  updateUserStatusByUid,
  changePassword,
} = require("./admin/auth");

const {
  getGroups,
  createGroup,
  addMembersToGroup,
  deleteGroupMember,
  deleteGroup,
  deleteGroupAsset,
  assignAssetsToGroup,
} = require("./admin/auth/group");
const {
  createAsset,
  getAssetByName,
  updateAssetById,
  deleteAssetById,
  getAssets,
  getAssetsName,
  importMasterXY,
} = require("./admin/assets");
const {
  createRole,
  updateRole,
  deleteRole,
  getRoles,
  getRole,
  assignPermissionToRole,
  getPermissions,
} = require("./admin/rolesandpermissions");
const {
  createSetup,
  deleteSetup,
  getSetups,
  updateSetup,
  getSetup,
  getSetupByMonth,
  updateSetupStatus,
} = require("./fielddatacapturesetup/volumemeasurementsetup");
const {
  captureOilOrCondensate,
  captureGas,
  updateOilOrCondensate,
  getGasVolumeByDateAndAsset,
  deleteOilOrCondensateVolumeByID,
  getOilOrCondensateVolumeByDateAndAsset,
  addNoteToVolumeCapture,
} = require("./fielddatacapturesetup/volume.measurement");
const { createMerSchedule } = require("./fielddatacapturesetup/merdataSetup");
const {
  processIPSC,
  getOilAndGasAccounting,
} = require("./fielddatacapturesetup/oilandgasaccounting/");
const { fetchDefermentData } = require("./reporting");
const { getInsight } = require("./admin/insights");
const { getInsights } = require("./admin/insights/index2");
const { getSurveillanceData } = require("./admin/surveillance/index2");
const { getOverviewData } = require("./admin/overview/index");
const { broadcast } = require("./broadcast/index");
// const { setupWellTestData, getSetups, updateWellTestData, deleteWellTestDataSetup } = require('./fielddatacapturesetup/welltestsetup')

admin.initializeApp();

const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

module.exports = {
  createUser,
  login,
  getUsers,
  getUserByUid,
  deleteUserByUid,
  updateUserByUid,
  createUsers,
  updateUserStatusByUid,
  changePassword,

  createGroup,
  addMembersToGroup,
  getGroups,
  deleteGroup,
  deleteGroupMember,
  assignAssetsToGroup,
  deleteGroupAsset,

  createAsset,
  getAssetByName,
  updateAssetById,
  deleteAssetById,
  getAssets,
  getAssetsName,
  importMasterXY,

  createRole,
  updateRole,
  deleteRole,
  getRoles,
  getRole,
  assignPermissionToRole,
  getPermissions,

  createSetup,
  deleteSetup,
  getSetups,
  updateSetup,
  getSetup,
  getSetupByMonth,
  updateSetupStatus,

  captureOilOrCondensate,
  captureGas,
  updateOilOrCondensate,
  getOilOrCondensateVolumeByDateAndAsset,
  getGasVolumeByDateAndAsset,
  deleteOilOrCondensateVolumeByID,
  addNoteToVolumeCapture,

  createMerSchedule,
  processIPSC,
  getOilAndGasAccounting,
  getInsight,
  getInsights,
  broadcast,
  getSurveillanceData,
  getOverviewData,

  fetchDefermentData,
};
