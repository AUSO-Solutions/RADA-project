import { firebaseFunctions } from "Services"
import { useEffect, useState } from "react"

export const useFetch = ({ firebaseFunction = '', payload = {}, dontFetch }) => {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                const res = await firebaseFunctions(firebaseFunction, payload)
                setData(res?.data)

            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        if (!dontFetch) getData()
        // eslint-disable-next-line
    }, [dontFetch])

    return {
        data,
        loading
    }

}