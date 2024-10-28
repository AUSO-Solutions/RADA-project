import { firebaseFunctions } from "Services"
import { store } from "Store"
import { setLoadingScreen } from "Store/slices/loadingScreenSlice"

export const updateSetupStatus = async ({ id, setupType, status, statusMessage, subject, groups = [], users = [], title, pagelink }) => {

    try {
        store.dispatch(setLoadingScreen({ open: true }))
        if (!id || !setupType || !status) throw 'Missing field required'
        await firebaseFunctions('updateSetupStatus', { id, setupType, status, statusMessage, subject, groups, users, title, pagelink })
    } catch (error) {
        throw error
    } finally {
        store.dispatch(setLoadingScreen({ open: false }))
    }

}