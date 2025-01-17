// import { redirect } from "react-router-dom"
import { setUser } from "Store/slices/auth"
import { getAuth, signOut } from 'firebase/auth';
import { setLoadingScreen } from "Store/slices/loadingScreenSlice";
import { updateStatus } from "./updateUserStatus";

const { store } = require("Store")

export const logout_ = async () => {
    console.log('first')
    try {
        store.dispatch(setLoadingScreen({ open: true }))
        await updateStatus('offline')
        store.dispatch(setUser({ }))
        const auth = getAuth()
        await signOut(auth)
        window.location.assign('/')
    } catch (error) {
        console.log(error)
    } finally {
        store.dispatch(setLoadingScreen({ open: false }))
    }
}