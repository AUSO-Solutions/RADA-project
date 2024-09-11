// import { useState } from "react"
import { useEffect, useState } from "react"
// import { useFetch } from "./useFetch"
import { firebaseFunctions } from "Services"

export const useAssetByName = (name) => {
    // const { data } = useFetch({ firebaseFunction: 'getAssetByName', payload: { name } })

    const [assetData, setAssetData] = useState([])
    const [items, setItems] = useState({
        flowStations: [],
        fields: [],
        productionStrings: [],
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
                // console.log(res.data?.filter(t => !t?.wellId))
                const set = new Set(res?.data)
                const uniques = (Array.from(set))
                const flowStations = Array.from(new Set(uniques?.map(datum => datum?.flowStation)))
                const fields = Array.from(new Set(uniques?.map(datum => datum?.field)))
                const reservoirs = Array.from(new Set(uniques?.map(datum => datum?.reservoir)))
                const productionStrings = Array.from(new Set(uniques?.map(datum => datum?.wellId)))
                const wells = Array.from(new Set(uniques?.map(datum => datum?.wellbore)))
                setAssetData(uniques)
                setItems(prev => ({ ...prev, flowStations, fields, reservoirs, productionStrings, wells }))

            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        getData()

    }, [name])

    // return {
    //     data,
    //     loading
    // }

    return {
        assetData, loading, ...items
    }
}