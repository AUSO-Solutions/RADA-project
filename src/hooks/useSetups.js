import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "firebase-config";
export const useGetSetups = (setupType, extras) => {

    const [setups, setSetups] = useState([])
    const [refetch, setRefetch] = useState()

    useEffect(() => {
        const q = query(collection(db, "setups", setupType, "setupList"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // console.log(snapshot.docChanges().map(item => item?.doc?.data()))
            console.log('changes')
            setRefetch(Math.random())
        });
        return () => unsubscribe()
    }, [setupType])

    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType, ...extras }, useToken: true, refetch })
    useEffect(() => {
        setSetups(data)
    }, [data,])

    return {
        setups
    }
}