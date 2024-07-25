import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

export const useAssetByName = (name) => {
    const { data } = useFetch({ firebaseFunction: 'getAssetByName', payload: { name } })
    // console.log({data})
    const [assetData, setAssetData] = useState([])
    const [items, setItems] = useState({
        flowStations: [],
        wells: []
    })
    useEffect(() => {
        // const names = data
        // console.log(names)
        const set = new Set(data)
        setAssetData(Array.from(set))
        const flowStations = Array.from(new Set(assetData?.map(datum => datum?.flowStation)))
        // console.log({flowStations})
        setItems({...items, flowStations})
    }, [data,name])

    return {
        assetData,...items
    }
}