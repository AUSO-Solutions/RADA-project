import { store } from 'Store';
import { reuse, setUser } from 'Store/slices/auth';
import axios from 'axios'
import { project_functions } from 'firebase-config';
import { httpsCallable } from 'firebase/functions';
import handleError from './handleError';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';
// import { logout_ } from 'utils/logout';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
// import { getAuth } from 'firebase/auth';

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
        const token = store.getState().auth?.user?.token
        if (options?.loadingScreen) store.dispatch(setLoadingScreen({ open: true }))
        const call = httpsCallable(project_functions, functionName)
        const res = (await call({ ...payload, idToken: token })).data
        return res
    } catch (error) {
        if (error?.message?.includes("token has expired")) {
            console.log("token has expired")
            getAuth().onIdTokenChanged((snap) => {
                snap?.getIdToken(true).then(res => {
                    store.dispatch(setUser({ ...store.getState().auth.user, token: res }))
                })
                // window.location.reload()
            })
        }
        if (hideError) handleError(error)
        throw error
    } finally {
        if (options?.loadingScreen) store.dispatch(setLoadingScreen({ open: false }))
    }
}

export { baseURL, apiRequest, firebaseFunctions }