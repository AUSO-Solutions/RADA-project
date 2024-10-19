import { useEffect, useState } from "react"
import { firebaseFunctions } from "Services"

export const useAssetNames = (options) => {
    // const myAssets = (user?.data?.assets)
    // const { data } = useFetch({ firebaseFunction: 'getAssetsName', useToken: true, payload: { getAll: options?.getAll } })

    const [assetNames, setAssetames] = useState([])
    console.log('----')

    useEffect(() => {
        // const names = data?.map(datum => datum)
        // console.log(',,,,,',data)
        // const set = new Set(names)

        const getData = async () => {
            try {
                const { data } = await firebaseFunctions('getAssetsName', { getAll: options?.getAll }, false, { useToken: true })
                console.log(data)
                setAssetames(data)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    return {
        assetNames
    }
}