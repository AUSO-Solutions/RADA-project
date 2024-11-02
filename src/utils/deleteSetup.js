import ConfirmModal from "Components/Modal/ConfirmModal"
import { toast } from "react-toastify"
import { firebaseFunctions } from "Services"
import { store } from "Store"
import { setLoadingScreen } from "Store/slices/loadingScreenSlice"
import { closeModal, openModal } from "Store/slices/modalSlice"

export const deleteSetup = ({
    id,
    setupType,
    title = "Delete Setup",
    message='Are you sure you want to delete '
}) => {

    const proceed = async () => {
        try {
            store.dispatch(setLoadingScreen({ open: true }))
            await firebaseFunctions('deleteSetup', { id, setupType })
            toast.success('Delete Successful!')

            store.dispatch(closeModal())
        } catch (error) {
            console.log(error)
        } finally {

            store.dispatch(setLoadingScreen({ open: false }))
        }
    }

    store.dispatch(openModal({ component: <ConfirmModal color="red" message={message} rightText="Delete" onProceed={proceed} />, title }))

}