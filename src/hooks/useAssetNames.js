import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"
import { store } from "Store"

export const useAssetNames = () => {
    const user = store.getState().auth.user
    // const myAssets = (user?.data?.assets)
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