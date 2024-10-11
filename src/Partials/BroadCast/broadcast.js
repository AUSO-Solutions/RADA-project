import { firebaseFunctions } from "Services"

export const broadcast =async  ()=>{
    try {
        await firebaseFunctions('broadcast',{})
    } catch (error) {
        
    }
}