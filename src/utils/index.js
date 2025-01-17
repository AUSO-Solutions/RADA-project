import dayjs from "dayjs";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { project_storage } from "firebase-config";
import { store } from "Store";
// import { findLineByLeastSquares } from "./findLineByLeastSquares";
import { intersect } from "mathjs";

export const sum = (array = []) => {
    if (Array.isArray(array) && array?.length) return roundUp(parseFloat(array.reduce((a, b) => parseFloat(a) + parseFloat(b))))
    return 0
}
export const createWellTitle = (setup, type) => {
  const field = setup?.field ? `/${setup?.field}/` : "/";
  return `${setup?.title || ""} ${setup?.asset}${field}${dayjs(
    setup?.month
  ).format("MMM-YYYY")}`;
};

export const getWellLastTestResult = (
  wellTestResults,
  wellTestResult,
  productionString
) => {
  if (!wellTestResults || !wellTestResult || !productionString) return;
  // console.log(wellTestResults);
  let lastTestResult = null,
    productionStringData = null;
  const remainingWellTestRessults = wellTestResults
    .filter((result) => {
      return result?.month < wellTestResult?.month;
    })
    .filter(
      (result) =>
        result?.id !== wellTestResult?.id &&
        result?.asset === wellTestResult?.asset
    );
  // ?.filter(result => result.wellTestResultData[productionString])
  const matches = remainingWellTestRessults.sort((a, b) => b?.month - a?.month);
  // console.log(matches)
  for (let index = 0; index < matches.length; index++) {
    const match = matches[index];
    // console.log(match.wellTestResultData)
    const wellTestResultData = match.wellTestResultData;
    const isTested = wellTestResultData[productionString]?.isSelected;
    if (isTested) {
      // console.log(tests)
      productionStringData = wellTestResultData[productionString];
      lastTestResult = match;
      break;
    }
  }
  if (!lastTestResult) {
    return null;
    // ('No previous tests found for this well')
  }
  // console.log(lastTestResult, productionStringData)
  return { wellTestResult: lastTestResult, productionStringData };
};

function getMonthYear() {
  const date = new Date();
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  return `${year}-${month}`;
}

export const getWellLastTestResult2 = (
  wellTestResults,
  asset,
  productionString
) => {
  if (!wellTestResults || !asset || !productionString) return;
  const monthYear = getMonthYear();
  let lastTestResult = null,
    productionStringData = null;
  const remainingWellTestRessults = wellTestResults.filter((result) => {
    return result?.month < monthYear && asset === result.asset;
  });

  // ?.filter(result => result.wellTestResultData[productionString])
  const matches = remainingWellTestRessults.sort((a, b) => b?.month - a?.month);
  for (let index = 0; index < matches.length; index++) {
    const match = matches[index];
    // console.log(match.wellTestResultData)
    const wellTestResultData = match.wellTestResultData;
    const isTested = wellTestResultData[productionString]?.isSelected;
    if (isTested) {
      // console.log(tests)
      productionStringData = wellTestResultData[productionString];
      // console.log(productionStringData);
      lastTestResult = match;
      break;
    }
  }
  if (!lastTestResult) {
    return null;
    // ('No previous tests found for this well')
  }
  return { wellTestResult: lastTestResult, productionStringData };
};

export const firebaseFileUpload = async (
  file,
  name = Date.now() + Math.random()
) => {
  try {
    const storageRef = ref(project_storage, name);
    const snapshot = await uploadBytes(storageRef, file);
    // console.log('Uploaded a blob or file!', snapshot);
    // console.log('Uploaded a blob or file!', snapshot);
    return snapshot.ref.fullPath;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const firebaseGetUploadedFile = async (path) => {
  try {
    // const storage = getStorage();
    const url = await getDownloadURL(ref(project_storage, path));
    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const genRandomNumber = () => {
  return Math.floor(Math.random() * 100) + 1;
};

export const roundUp = (number) => {
    if (isNaN(Number(number))) return number;
    const decimalPlaces = store.getState().decimalPlaces;
    const factor = Math.pow(10, decimalPlaces);
    return (Math.ceil(Number(number) * factor) / factor).toFixed(decimalPlaces);
};


const getLineDetails = (line, at1, at2) => {
  const x1 = line[at1]?.x,
    x2 = line[at2]?.x,
    y1 = line[at1]?.y,
    y2 = line[at2]?.y;
  const point1 = { y: y1, x: x1 };
  const point2 = { y: y2, x: x2 };
  const slope = (y2 - y1) / (x2 - x1);
  // y = mx + c
  const c = y1 - slope * x1;
  return {
    x1,
    x2,
    y1,
    y2,
    point1,
    point2,
    slope,
    c,
  };
};

/**
 * @param {Object} point
 * @param {Array} line1
 * @param {Array} line2
 */
export const getIntersectionBetweenTwoLines = (
  line1,
  line2,
  at1 = 0,
  at2 = 1
) => {
  // console.log(first)
  if (!line1.length || !line1.length)
    return {
      x: 0,
      y: 0,
    };
  // console.log(line1?.map(line => line?.x), line1?.map(line => line?.y))
  // const res = findLineByLeastSquares(line1?.map(line => line?.x), line1?.map(line => line?.y))
  // console.log({lineOfBestFit :  res})
  // console.log([line1[0].x, line1[0].y, 'line1point1'], [line1[1].x, line1[1].y, 'line1point2'], [line2[0].x, line2[0].y, 'line2point1'], [line2[1].x, line2[1].y, 'line2point2'])
  const tbj = intersect(
    [line1[0].x, line1[0].y],
    [line1[1].x, line1[1].y],
    [line2[0].x, line2[0].y],
    [line2[1].x, line2[1].y]
  );

  console.log({ tbj });
  // function checkLineIntersection(
  //   line1StartX,
  //   line1StartY,
  //   line1EndX,
  //   line1EndY,
  //   line2StartX,
  //   line2StartY,
  //   line2EndX,
  //   line2EndY
  // ) {
  //   // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  //   var denominator,
  //     a,
  //     b,
  //     numerator1,
  //     numerator2,
  //     result = {
  //       x: null,
  //       y: null,
  //       onLine1: false,
  //       onLine2: false,
  //     };
  //   denominator =
  //     (line2EndY - line2StartY) * (line1EndX - line1StartX) -
  //     (line2EndX - line2StartX) * (line1EndY - line1StartY);
  //   if (denominator === 0) {
  //     return result;
  //   }
  //   a = line1StartY - line2StartY;
  //   b = line1StartX - line2StartX;
  //   numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
  //   numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
  //   a = numerator1 / denominator;
  //   b = numerator2 / denominator;

  //   // if we cast these lines infinitely in both directions, they intersect here:
  //   result.x = line1StartX + a * (line1EndX - line1StartX);
  //   result.y = line1StartY + a * (line1EndY - line1StartY);

  //   // if line1 is a segment and line2 is infinite, they intersect if:
  //   if (a > 0 && a < 1) {
  //     result.onLine1 = true;
  //   }
  //   // if line2 is a segment and line1 is infinite, they intersect if:
  //   if (b > 0 && b < 1) {
  //     result.onLine2 = true;
  //   }
  //   // if line1 and line2 are segments, they intersect if both of the above are true
  //   return result;
  // }
  // console.log({ line1, line2 })
  // const res = checkLineIntersection(
  //   line1[0].x,
  //   line1[0].y,
  //   line1[1].x,
  //   line1[1].y,
  //   line2[0].x,
  //   line2[0].y,
  //   line2[1].x,
  //   line2[1].y
  // );
  // console.log(res)
  const line1Details = getLineDetails(line1, at1, line1.length - 1);
  const line2Details = getLineDetails(line2, at1, line2.length - 1);
  const x =
    (line2Details.c - line1Details.c) /
    (line1Details.slope - line2Details.slope);
  const y =
    (line1Details.c * line2Details.slope -
      line2Details.c * line1Details.slope) /
    (line1Details.slope - line2Details.slope);
  return {
    line1Details,
    line2Details,
    x,
    y,
  };
  // Math.sin
};
export const bsw = ({ gross, oil, water }) => {
    let water__ = (water || 0) || parseFloat(gross || 0) - parseFloat(oil || 0)
    const result = ((water__ / (parseFloat(oil || 0) + water__)) * 100).toFixed(4)


    return isNaN(result) ? '' : roundUp(result)

}

export const getHeights = () => {
  const wH = window.innerHeight;
  const pH = window.parent.innerHeight;
  const tH = window.top.innerHeight;
  return { wH, pH, tH };
};
