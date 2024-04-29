import { apiRequest } from "Services";

const createCumulativeProduction = async (payload, email) => {
    try {
        const res = await apiRequest({
            method: 'post',
            url: `/create-cumulative-production-field?email=${email}`,
            payload
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}
const createProductionVolume = async (payload, email) => {
    try {
        const res = await apiRequest({
            method: 'post',
            url: `/create-production-volume-field?email=${email}`,
            payload
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}
const createWellFlow = async (payload, email) => {
    try {
        const res = await apiRequest({
            method: 'post',
            url: `/create-well-flow-field?email=${email}`,
            payload
        })
        console.log(res)
        //do something with res
    } catch (error) {

    }
}

export {
    createCumulativeProduction,
    createProductionVolume,
    createWellFlow
}