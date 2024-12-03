
import { useEffect, useState } from "react"
import { firebaseFunctions } from "Services"

export const useAssetByName = (name) => {

    const [assetData, setAssetData] = useState([])
    const [items, setItems] = useState({
        flowStations: [],
        fields: [],
        productionStrings: [],
        wells: [],
        reservoirs:[]
    })

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                const res = await firebaseFunctions('getAssetByName', { name })

                const set = new Set(res?.data)
                const uniques = (Array.from(set))
                const flowStations = Array.from(new Set(uniques?.map(datum => datum?.flowStation)))
                const fields = Array.from(new Set(uniques?.map(datum => datum?.field)))
                const reservoirs = Array.from(new Set(uniques?.map(datum => datum?.reservoir)))
                const productionStrings = Array.from(new Set(uniques?.map(datum => datum?.wellId)))
                const wells = Array.from(new Set(uniques?.map(datum => datum?.wellbore)))
                setAssetData(uniques.map(unique => ({ ...unique, productionString: unique?.wellId })))
                setItems(prev => ({ ...prev, flowStations, fields, reservoirs, productionStrings, wells }))

            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        getData()

    }, [name])
    return {
        assetData, loading, ...items
    }
}

export const getAssetByName = async (name, {loadingScreen=false}) => {
    try {
        const res = await firebaseFunctions('getAssetByName', { name }, false, { loadingScreen })

        const set = new Set(res?.data)
        const uniques = (Array.from(set))
        const flowStations = Array.from(new Set(uniques?.map(datum => datum?.flowStation)))
        const fields = Array.from(new Set(uniques?.map(datum => datum?.field)))
        const reservoirs = Array.from(new Set(uniques?.map(datum => datum?.reservoir)))
        const productionStrings = Array.from(new Set(uniques?.map(datum => datum?.wellId)))
        const wells = Array.from(new Set(uniques?.map(datum => datum?.wellbore)))
        // setItems(prev => ())
        return { assetData: uniques, flowStations, fields, reservoirs, productionStrings, wells }
    } catch (error) {

    } finally {
    }

}