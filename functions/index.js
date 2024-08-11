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
  getAssets2,
  createAsset2,
} = require("./admin/assets");

const {
  createRole,
  updateRole,
  deleteRole,
  getRoles,
  getRole,
  assignPermissionToRole,
} = require("./admin/rolesandpermissions");

const {
  setupVolumeMeasurement,
} = require("./fielddatacapturesetup/volumemeasurementsetup");

const {
  captureOilOrCondensateVolume,
  captureGasVolume,
  updateOilOrCondensateVolume,
  getOilOrCondensateVolumeByID,
  getOilOrCondensateVolumeByAsset,
  deleteOilOrCondensateVolumeByID,
  updateGasVolume,
  getGasVolumeByAsset,
  getGasVolumeByID,
  deleteGasVolumeByID,
} = require("./fielddatacapturesetup/volume.measurement");

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

  createGroup,
  addMembersToGroup,
  getGroups,
  deleteGroup,
  deleteGroupMember,
  assignAssetsToGroup,
  deleteGroupAsset,

  createAsset,
  createAsset2,
  getAssetByName,
  updateAssetById,
  deleteAssetById,
  getAssets,
  getAssetsName,
  getAssets2,

  createRole,
  updateRole,
  deleteRole,
  getRoles,
  getRole,
  assignPermissionToRole,

  setupVolumeMeasurement,

  captureOilOrCondensateVolume,
  captureGasVolume,
  updateOilOrCondensateVolume,
  getOilOrCondensateVolumeByID,
  getOilOrCondensateVolumeByAsset,
  deleteOilOrCondensateVolumeByID,
  updateGasVolume,
  getGasVolumeByAsset,
  getGasVolumeByID,
  deleteGasVolumeByID,
};
