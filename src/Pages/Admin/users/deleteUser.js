import { firebaseFunctions } from "Services"
import { store } from "Store"
import { setLoadingScreen } from "Store/slices/loadingScreenSlice"

export const deleteUser = async (uid, onSuccess = () => null) => {
    store.dispatch(setLoadingScreen({ open: true }))
    try {
        await firebaseFunctions('deleteUserByUid', { uid })
        onSuccess()

    } catch (error) {
        throw error
    }finally{
        store.dispatch(setLoadingScreen({ open: false }))
    }
}