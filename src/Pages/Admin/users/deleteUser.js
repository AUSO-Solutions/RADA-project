import { firebaseFunctions } from "Services"

export const deleteUser = async (uid, onSuccess=()=>null) => {
    try {
       await firebaseFunctions('deleteUserByUid', { uid })
       onSuccess()

    } catch (error) {
throw error
    }
}