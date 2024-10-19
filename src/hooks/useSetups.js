import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

export const useGetSetups = (setupType, extras) => {

    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType, ...extras } ,useToken:true})
    console.log(',,,,,', data)
    const [setups, setSetups] = useState([])
    useEffect(() => {
        // const names = data?.map(datum => datum)
        // console.log(names)
        // const set = new Set(names)
        setSetups(data)
    }, [data])

    return {
        setups
    }
}