export const sum = (array = []) => {
    if (Array.isArray(array) && array?.length) return array.reduce((a, b) => parseFloat(a) + parseFloat(b))
    return 0
}