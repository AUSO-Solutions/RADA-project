import dayjs from "dayjs"

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { project_storage } from "firebase-config";
import { findLineByLeastSquares } from "./findLineByLeastSquares";

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

const getLineDetails = (line, at1, at2) => {
    const x1 = line[at1]?.x,
        x2 = line[at2]?.x,
        y1 = line[at1]?.y,
        y2 = line[at2]?.y;
    const point1 = { y: y1, x: x1 }
    const point2 = { y: y2, x: x2 }
    const slope = (y2 - y1) / (x2 - x1)
    // y = mx + c
    const c = y1 - (slope * x1)
    return {
        x1, x2, y1, y2, point1, point2, slope, c
    }
}

/**
 * @param {Object} point
 * @param {Array} line1
 * @param {Array} line2
 */
export const getIntersectionBetweenTwoLines = (line1, line2, at1 = 0, at2 = 1) => {
    if (!line1.length || !line1.length) return {
        x: 0, y: 0
    }
    // console.log(line1?.map(line => line?.x), line1?.map(line => line?.y))
    // const res = findLineByLeastSquares(line1?.map(line => line?.x), line1?.map(line => line?.y))
    // console.log({lineOfBestFit :  res})
    const line1Details = getLineDetails(line1, at1, at2)
    const line2Details = getLineDetails(line2, at1, at2)
    const x = (line2Details.c - line1Details.c) / (line1Details.slope - line2Details.slope)
    const y = ((line1Details.c * line2Details.slope) - (line2Details.c * line1Details.slope)) / (line1Details.slope - line2Details.slope)
    return {
        line1Details, line2Details, x, y
    }

}

