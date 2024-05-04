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
    console.log(token)

    const axiosInstance = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": contentType,
            // "Accept": "application/json",
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
        if (error?.message) toast.error(error.message)
        throw error
    }
}

export { baseURL, apiRequest }