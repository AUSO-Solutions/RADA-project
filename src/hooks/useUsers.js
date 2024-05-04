import { firebaseFunctions } from "Services"
import { useEffect, useState } from "react"

export const useUsers = () => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            try {
                const res = await firebaseFunctions('getUsers')
                setUsers(res?.data)

            } catch (error) {

            } finally {
                setLoading(false)
            }
        }
        getUsers()
    }, [])

    return {
        users,
        loading
    }

}