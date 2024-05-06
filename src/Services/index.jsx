import { store } from 'Store';
import axios from 'axios'
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_BASE_URL
const apiRequest = async ({
    method = 'get',
    url,
    payload,
    params,  // pass url search parameters as object 
    contentType = "application/json"
}) => {
    const state = store.getState().auth.user
    const token = state.access_token
    // console.log(token)

    const axiosInstance = axios.create({
        baseURL,
        // timeout: 10000,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": contentType,
            "Accept": "application/json",
        }
    });
    try {
        const { data } = await axiosInstance({
            method,
            url,
            data: payload,//
            params
        })
        return data
    } catch (error) {
        console.error(error);
        const err_code = error?.response?.status
        // console.log(err_code)
        const is_403 = err_code === 403
        if (is_403) toast.error('Unauthorized')
        if (error?.message && !is_403) toast.error(error.message)
        throw error
    }
}

export { baseURL, apiRequest }