import { firebaseFunctions } from "Services";

export default async function deleteGroup (groupId, onComplete = () => null) {
    try {
        await firebaseFunctions('deleteGroup', { groupId })
        onComplete()
    } catch (error) {

    }
}