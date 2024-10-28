import { firebaseFunctions } from "Services"
import { store } from "Store"
import { setLoadingScreen } from "Store/slices/loadingScreenSlice"

export const updateSetupStatus = async ({ setupType, id, status, queryMessage = '' }) => {

    try {
        store.dispatch(setLoadingScreen({ open: true }))
        if (!id || !setupType || !status) throw 'Missing field required'
        await firebaseFunctions('updateSetup', { id, setupType, status, queryMessage })
    } catch (error) {
        throw error
    } finally {
        store.dispatch(setLoadingScreen({ open: false }))
    }

}