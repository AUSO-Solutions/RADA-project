import { firebaseFunctions } from "Services"
import { store } from "Store"

export const logActivity = async ({ message }) => {
    try {
        const user = store.getState().auth.user
        console.log(user)
        await firebaseFunctions('logActivity', { message, user })
    } catch (error) {

    }
}