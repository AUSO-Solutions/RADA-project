// import { firebaseFunctions } from "Services"
import { store } from "Store"

export const broadcast = async ({ link }) => {
    try {
        const formdata = store.getState().formdata
        console.log(formdata, link)
        // await firebaseFunctions('broadcast',{})
    } catch (error) {

    }
}