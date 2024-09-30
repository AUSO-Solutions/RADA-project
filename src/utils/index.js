import dayjs from "dayjs"

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { project_storage } from "firebase-config";

export const sum = (array = []) => {
    if (Array.isArray(array) && array?.length) return parseFloat(array.reduce((a, b) => parseFloat(a) + parseFloat(b)))
    return 0
}
export const createWellTitle = (setup, type) => {
    const field = setup?.field ? `/${setup?.field}/` : '/'
    return `${setup?.title} ${setup?.asset}${field}${dayjs(setup?.month).format("MMM-YYYY")}`
}

export const getWellLastTestResult = (wellTestResults, wellTestResult, productionString) => {
    if (!wellTestResults || !wellTestResult || !productionString) return
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
        return null;
        // ('No previous tests found for this well')
    }
    // console.log(lastTestResult, productionStringData)
    return { wellTestResult: lastTestResult, productionStringData }
}

export const firebaseFileUpload = async (file, name = Date.now() + Math.random()) => {
    try {
        const storageRef = ref(project_storage, name);
        const snapshot = await uploadBytes(storageRef, file)
        // console.log('Uploaded a blob or file!', snapshot);
        return snapshot.ref.fullPath
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const firebaseGetUploadedFile = async (path) => {
    try {
        // const storage = getStorage();
        const url = await getDownloadURL(ref(project_storage, 'images/stars.jpg'))
        return url
    } catch (error) {
        console.log(error)
        throw error
    }
}
export const genRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1
}