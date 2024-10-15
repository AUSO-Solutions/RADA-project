
export const getChokeFthpPoints = (list) => {
    const fthpPoints = list?.map((data, i) => ({ x: data?.oilRate || 0, y: data?.fthp || 0}))
    const chokePoints = list?.map((data, i) => ({ x: data?.oilRate || 0, y: data?.chokeSize || 0 }))
    return { fthpPoints, chokePoints }
}