import { firebaseFunctions } from "Services"
import { useEffect, useState } from "react"

export const useFetch = ({firebaseFunction='',}) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                const res = await firebaseFunctions(firebaseFunction)
                setData(res?.data)

            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [firebaseFunctions])

    return {
        data,
        loading
    }

}