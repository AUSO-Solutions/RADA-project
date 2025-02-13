import { permissions } from "Assets"
import { firebaseFunctions } from "Services"
import { store } from "Store"
import { useEffect, useState } from "react"

export const useMe = () => {

    const [user, setUser] = useState({
        assets: [],
        created: "",
        email: "",
        firstName: "",
        groups: [],
        lastName: "",
        roles: [],
        status: "",
        uid: "",
        permissions: [],
        permitted: {
            "viewDashboard": false,
            "broadcastData":false,
            "shareData":false,
            "createAndeditDailyOperation": false,
            "createAndeditDailyOperationSETUP": false,
            "createWellTestSchedule": false,
            "remarkWellTestSchedule": false,
            "createAndeditWellTestResult": false,
            "createAndeditIPSC": false,
            "createMERschedule": false,
            "remarkMERschedule": false,
            "createAndeditMERdata": false,
            "createAndeditFGSGsurvey": false,
            "approveData": false,
            "queryData": false,
            "rollBackData": false,
            "reportsSchedule": false,
        }
    })
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getUser = async () => {
            const uid = store.getState().auth.user?.data?.uid
            // console.log(uid)
            setLoading(true)
            // const permitted = Object.entires(permissions).map(entry => {
            //     return [entry[0], {
            //         state: false
            //     }]
            // })\
            // [ [3,6], [], 5 , [  []  ]  ]  = 


            try {
                const res = await firebaseFunctions('getUserByUid', { uid })
                const myPermissions = res?.data?.roles?.flatMap(role => role?.permissions)
                const permitted = Object.fromEntries(Object.entries(permissions).map(entry => {
                    return [entry[0], myPermissions?.includes(entry[1])]
                }))
                // console.log(JSON.stringify(Object.fromEntries(Object.entries(permissions).map(entry => {
                //     return [entry[0], myPermissions?.includes(entry[1])]
                // }))))
                setUser({
                    ...res?.data,
                    permissions: myPermissions,
                    permitted
                })

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getUser()
    }, [])

    return {
        user,
        loading
    }

}
