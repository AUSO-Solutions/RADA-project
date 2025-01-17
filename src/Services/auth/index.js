import { apiRequest } from "Services";
import passwordManagement from "./passwordManagement";


async function login({ email, password }) {
    try {
        const res = await apiRequest({
            method: 'post',
            url: '/users/login',
            payload: {
                "email": "emmanueloludairo61@gmail.com",
                "password": "izfc7ysF"
            }
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}

/**
 * @param {Object} createFOPayload
 * @param {string} createFOPayload.adminEmail
 * @param {string} createFOPayload.fieldOperatorEmail
 * @param {string} createFOPayload.fieldOperatorFirstName
 * @param {string} createFOPayload.fieldOperatorLastName
 * @param {string} createFOPayload.assetType
 * @return {void} 
 **/
const createFieldOperator = async (createFOPayload) => {
    try {
        const res = await apiRequest({
            method: 'post',
            url: '/api/admin/create-fieldOperator',
            payload: createFOPayload
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}

/**
 * @param {Object} createQaQcPayload
 * @param {string} createQaQcPayload.adminEmail
 * @param {string} createQaQcPayload.qaqcEmail
 * @param {string} createQaQcPayload.qaqcFirstName 
 * @param {string} createQaQcPayload.qaqcLastName
 * @param {string} createQaQcPayload.assetType
 * @return {void} 
 **/
const createQaQc = async (createQaQcPayload) => {
    try {
        const res = await apiRequest({
            method: 'post',
            url: '/api/admin/create-qaQc',
            payload: createQaQcPayload
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}


export {
    login,
    createFieldOperator,
    createQaQc,
    passwordManagement
}