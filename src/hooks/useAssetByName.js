import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

export const useAssetByName = (name) => {
    const { data } = useFetch({ firebaseFunction: 'getAssetByName', payload: {name} })
    const [assetData, setAssetData] = useState([])
    useEffect(() => {
        // const names = data
        // console.log(names)
        const set = new Set(data)
        setAssetData(Array.from(set))
    }, [data])

    return {
        assetData
    }
}