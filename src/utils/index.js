import dayjs from "dayjs"

export const sum = (array = []) => {
    if (Array.isArray(array) && array?.length) return array.reduce((a, b) => parseFloat(a) + parseFloat(b))
    return 0
}
export const createTitle = (setup, type) => {
    const field = setup?.field ? `/${setup?.field}/` : '/'
    return `${setup?.title} ${setup?.asset}${field}${dayjs(setup?.created).format("MMM-YYYY")}`
}