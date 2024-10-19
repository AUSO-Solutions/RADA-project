import { store } from 'Store';
import { reuse } from 'Store/slices/auth';
import axios from 'axios'
import {  project_functions } from 'firebase-config';
import { httpsCallable } from 'firebase/functions';
import handleError from './handleError';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';
import { getAuth } from 'firebase/auth';
// import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_BASE_URL
const baseFirebaseUrl = process.env.REACT_APP_FIREBASE_URL

const apiRequest = async ({
    method = 'get',
    url,
    payload,
    params,  // pass url search parameters as object 
    contentType = "application/json", noToken
}) => {
    const state = store.getState().auth.user
    const token = noToken ? '' : state.access_token
    // console.log(token)

    const axiosInstance = axios.create({
        baseFirebaseUrl,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": contentType,
            "Accept": "application/json",
        }
    });
    store.dispatch(reuse())
    try {
        const { data } = await axiosInstance({
            method,
            url,
            data: payload,//
            params
        })
        return data
    } catch (error) {
        // console.error(error);
        // const err_code = error?.response?.status
        // const data = error?.response?.data
        // console.log(err_code)
        // const is_403 = err_code === 403
        // if (is_403) toast.error('Unauthorized')
        // if (error?.message && !is_403) toast.error(error.message)
        throw error

    }
}

const firebaseFunctions = async (functionName, payload, hideError = false, options) => {
    try {
        // const currentUser =
        // console.log({ currentUser })
        const token = options?.useToken ? { idToken: await getAuth().currentUser.getIdToken(false) } : {}
        if (options?.loadingScreen) store.dispatch(setLoadingScreen({ open: true }))
        const call = httpsCallable(project_functions, functionName)
        const res = (await call({ ...payload, ...token })).data
        // toast.success(res?.message)
        return res
    } catch (error) {
        console.log(error)
        if (hideError) handleError(error)
        throw error
    } finally {
        if (options?.loadingScreen) store.dispatch(setLoadingScreen({ open: false }))
    }
}

export { baseURL, apiRequest, firebaseFunctions }