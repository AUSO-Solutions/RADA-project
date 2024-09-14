import dayjs from "dayjs"
import { toast } from "react-toastify"

export const sum = (array = []) => {
    if (Array.isArray(array) && array?.length) return array.reduce((a, b) => parseFloat(a) + parseFloat(b))
    return 0
}
export const createWellTitle = (setup, type) => {
    const field = setup?.field ? `/${setup?.field}/` : '/'
    return `${setup?.title} ${setup?.asset}${field}${dayjs(setup?.month).format("MMM-YYYY")}`
}

export const getWellLastTestResult = (wellTestResults, wellTestResult, productionString,) => {
    let lastTestResult = null, productionStringData = null
    const remainingWellTestRessults = wellTestResults
        .filter(result => {
            return result?.month < wellTestResult?.month
        })
        .filter(result => result?.id !== wellTestResult?.id && result?.asset === wellTestResult?.asset)
    // ?.filter(result => result.wellTestResultData[productionString])
    const matches = (remainingWellTestRessults.sort((a, b) => b?.month - a?.month))
    // console.log(matches)
    for (let index = 0; index < matches.length; index++) {
        const match = matches[index];
        // console.log(match.wellTestResultData)
        const wellTestResultData = match.wellTestResultData
        const isTested = wellTestResultData[productionString].isSelected
        if (isTested) {
            // console.log(tests)
            productionStringData = wellTestResultData[productionString]
            lastTestResult = match
            break
        }

    }
    if (!lastTestResult) {
        toast.info('No previous tests found for this well')
    }
    // console.log(lastTestResult, productionStringData)
    return { wellTestResult: lastTestResult, productionStringData }
}