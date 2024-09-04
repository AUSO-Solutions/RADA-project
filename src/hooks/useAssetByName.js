// import { useState } from "react"
import { useEffect, useState } from "react"
// import { useFetch } from "./useFetch"
import { firebaseFunctions } from "Services"

export const useAssetByName = (name) => {
    // const { data } = useFetch({ firebaseFunction: 'getAssetByName', payload: { name } })

    const [assetData, setAssetData] = useState([])
    const [items, setItems] = useState({
        flowStations: [],
        wells: []
    })
    // useEffect(() => {
        // const set = new Set(data)
        // const uniques = (Array.from(set))
        // const flowStations = Array.from(new Set(uniques?.map(datum => datum?.flowStation)))
        // // setAssetData(uniques)
        // // setItems(prev => ({ ...prev, flowStations }))

    // }, [name])


    // const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                const res = await firebaseFunctions('getAssetByName', { name })
                // setData(res?.data)
                const set = new Set(res?.data)
                const uniques = (Array.from(set))
                const flowStations = Array.from(new Set(uniques?.map(datum => datum?.flowStation)))
                setAssetData(uniques)
                setItems(prev => ({ ...prev, flowStations }))

            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        getData()
        // eslint-disable-next-line
    }, [])

    // return {
    //     data,
    //     loading
    // }

    return {
        assetData, loading,...items
    }
}