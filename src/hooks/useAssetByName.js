import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

export const useAssetByName = (name) => {
    const { data } = useFetch({ firebaseFunction: 'getAssetByName', payload: { name } })

    const [assetData, setAssetData] = useState([])
    const [items, setItems] = useState({
        flowStations: [],
        wells: []
    })
    useEffect(() => {
        const set = new Set(data)
        const uniques = (Array.from(set))
        const flowStations = Array.from(new Set(uniques?.map(datum => datum?.flowStation)))
        setAssetData(uniques)
        setItems(prev => ({ ...prev, flowStations }))
    }, [data, name])

    return {
        assetData, ...items
    }
}