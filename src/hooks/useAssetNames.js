import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

export const useAssetNames = () => {
    const { data } = useFetch({ firebaseFunction: 'getAssets' })
    const [assetNames, setAssetames] = useState([])
    useEffect(() => {
        const names = data?.map(datum => datum.assetName)
        // console.log(names)
        const set = new Set(names)
        setAssetames(Array.from(set))
    }, [data])

    return {
        assetNames
    }
}