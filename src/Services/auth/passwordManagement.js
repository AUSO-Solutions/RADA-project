import { apiRequest } from "Services"

/**
 * @param {Object} changePasswordPayload
 * @param {string} changePasswordPayload.email
 * @param {string} changePasswordPayload.initialPassword
 * @param {string} changePasswordPayload.newPassword
 * @param {string} changePasswordPayload.confirmPassword
 * @return {void} 
 **/
const changePassword = async (changePasswordPayload) => {
    try {
        const res = await apiRequest({
            method: 'post',
            url: '/users/change-password',
            payload: changePasswordPayload
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}

/**
 * @param {number} otp
 * @return {void} 
 **/
const validatePassword = async (otp) => {
    try {
        const res = await apiRequest({ url: `/validate-otp?otp=${otp}` })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}

/**
 * @param {string} email
 * @return {void} 
 **/
const forcePasswordRequest = async (email = "emmanueloludairo61@gmail.com") => {
    try {
        const res = await apiRequest({
            method: 'post', url: `/forgot-password`, payload: {
                email
            }
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}

/**
 * @param {Object} forgotPasswordPayload
 * @param {string} forgotPasswordPayload.email
 * @param {number} forgotPasswordPayload.otp
 * @param {string} forgotPasswordPayload.newPassword
 * @param {string} forgotPasswordPayload.confirmPassword
 * @return {void} 
 **/
const forgotPassword = async (forgotPasswordPayload) => {
    try {
        const res = await apiRequest({
            method: 'put', url: `/forgot-password`, payload:
                forgotPasswordPayload

        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}

const passwordManagement = {
    changePassword,
    validatePassword,
    forcePasswordRequest,
    forgotPassword
}
export default passwordManagement