import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

export const useAssetNames = (options) => {
    // const myAssets = (user?.data?.assets)
    const { data } = useFetch({ firebaseFunction: 'getAssetsName', useToken: true, payload: { getAll: options?.getAll } })
    // console.log(',,,,,',data)
    const [assetNames, setAssetames] = useState([])
    useEffect(() => {
        const names = data?.map(datum => datum)
        // console.log(names)
        const set = new Set(names)
        setAssetames(Array.from(set))
    }, [data])

    return {
        assetNames
    }
}