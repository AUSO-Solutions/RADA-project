
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const crypto = require('crypto');
const { currentTime } = require("../../helpers");


const createRole = onCall(async (request) => {
    try {
        let { data } = request;
        const { roleName, permissions } = data;

        const db = admin.firestore();

        const roleExists = (await db.collection('roles').where("roleName", "==", roleName).get())?.docs[0]?.exists;

        if (roleExists) {
            throw { code: 'already-exists', message: 'Role already exists' };
        }

        const roleId = crypto.randomBytes(8).toString("hex");

        await db.collection('roles').doc(roleId).set({ id: roleId, roleName, permissions, created: currentTime });

        return { status: 'success', message: 'Role created successfully', data: { roleName, permissions } }
    } catch (error) {
        logger.log('error ===> ', error);
        throw new HttpsError(error?.code, error?.message);
    }
});

const updateRole = onCall(async (request) => {
    try {
        let { data } = request;
        const { roleId, roleName, permissions } = data;

        const db = admin.firestore();
        const roleRef = db.collection('roles').doc(roleId);
        const role = await roleRef.get();

        if (!role.exists) {
            throw { code: 'not-found', message: 'Role not found' };
        }

        // const newRoleRef = db.collection('roles').doc(roleName);
        const isPreviousName = role.data()?.roleName?.toLowerCase() === roleName?.toLowerCase()
        const newRoleExist = (await db.collection('roles').where('roleName', '==', roleName).get())?.docs[0]?.exists;

        if (newRoleExist && !isPreviousName) {
            throw { code: 'already-exists', message: 'New role name already exists' };
        }

        await roleRef.update({ roleName, permissions });

        return { status: 'success', message: 'Role renamed successfully', data: { roleId, roleName, permissions } };
    } catch (error) {
        logger.log('error ===> ', error);
        throw new HttpsError(error?.code, error?.message);
    }
});

const deleteRole = onCall(async (request) => {
    try {
        let { data } = request;
        const { roleId } = data;

        const db = admin.firestore();
        const roleRef = db.collection('roles').doc(roleId);
        const role = await roleRef.get();

        if (!role.exists) {
            throw { code: 'not-found', message: 'Role not found' };
        }

        await roleRef.delete();

        return { status: 'success', message: 'Role deleted successfully', data: { roleName } };
    } catch (error) {
        logger.log('error ===> ', error);
        throw new HttpsError(error?.code, error?.message)
    }
});


const getRoles = onCall(async ({ }) => {
    try {
        const db = admin.firestore();
        const res = await db.collection('roles').get();

        const roles = res.docs.map(doc => doc.data());

        return { status: 'success', data: roles };
    } catch (error) {
        logger.log('error ===> ', error);
        return { status: 'failed', error }
    }
})
const getPermissions = onCall(async ({ }) => {
    try {
        const db = admin.firestore();
        const res = await db.collection('permissions').get();
        const permissions = res.docs.map(doc => doc.data());
        return { status: 'success', data: permissions };
    } catch (error) {
        logger.log('error ===> ', error);
        return { status: 'failed', error }
    }
})


const getRole = onCall(async ({ data }) => {
    try {
        const { roleId } = data;
        if (!roleId) {
            throw { code: 'invalid-argument', message: 'RoleId is required' };
        }

        const db = admin.firestore();
        const roleRef = db.collection('roles').doc(roleId);
        const roleDoc = await roleRef.get();

        if (!roleDoc.exists) {
            throw { code: 'not-found', message: 'Role not found' };
        }

        const role = roleDoc.data();

        return { status: 'success', data: role };
    } catch (error) {
        logger.log('error ===> ', error);
        throw new HttpsError(error?.code || 'unknown', error?.message || 'Failed to fetch role');
    }

})


const assignPermissionToRole = onCall(async (request) => {
    try {
        let { data } = request;
        const { roleId, permissions } = data;

        if (!roleId || (!Array.isArray(permissions) && typeof permissions !== 'string')) {
            throw { code: 'invalid-argument', message: 'RoleId and permission are required' };
        }

        const db = admin.firestore();
        const roleRef = db.collection('roles').doc(roleId);
        const roleDoc = await roleRef.get();

        if (!roleDoc.exists) {
            throw { code: 'not-found', message: 'Role not found' };
        }

        const currentPermissions = roleDoc.data().permissions || [];
        const newPermissions = Array.isArray(permissions) ? permissions : [permissions];
        const updatedPermissions = [...new Set([...currentPermissions, ...newPermissions])];

        await roleRef.update({ permissions: updatedPermissions });

        return { status: 'success', message: 'Permissions assigned successfully', data: { roleId, permissions: updatedPermissions } };
    } catch (error) {
        logger.log('error ===> ', error);
        throw new HttpsError(error?.code || 'unknown', error?.message || 'Failed to assign permissions');
    }

})


module.exports = { createRole, updateRole, deleteRole, getRoles, getRole, assignPermissionToRole, getPermissions }