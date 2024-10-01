
import { useDispatch, useSelector } from "react-redux"
// import { useAssetNames } from "hooks/useAssetNames"
import { clearSetup, setSetupData } from "Store/slices/setupSlice"
// import CheckInput from "Components/Input/CheckInput"
import { Input } from "Components"
import { useEffect, useState } from "react"
// import styles from '../merdata.module.scss'
import { useFetch } from "hooks/useFetch"
import Text from "Components/Text"
import { closeModal } from "Store/slices/modalSlice"
import { store } from "Store"
import { firebaseFunctions } from "Services"
import { toast } from "react-toastify"
import Setup from "Partials/setup"
// import { useAssetByName } from "hooks/useAssetByName"
// import { Chip } from "@mui/material"
// import dayjs from "dayjs"
import Files from "Partials/Files"
import { createWellTitle } from "utils"
import { BsPlus } from "react-icons/bs"
import dayjs from "dayjs"
import ExcelToCsv from "Partials/ExcelToCSV"



const ImporFiles = () => {
    const dispatch = useDispatch()
    const handleFiles = async (name,jsonData) => {

        try {
            console.log({name,jsonData})
            dispatch(setSetupData({ name, value: jsonData }))
        } catch (error) {
            console.log(error)
        }
    }
    const setupData = useSelector(state => state.setup)

    return (
        <div className="w-full  flex ">
            <ExcelToCsv className="block  border w-[50%] rounded m-3 p-3" onComplete={jsonData => handleFiles('chokeSizes', jsonData)}>

                    <BsPlus size={50} className="mx-auto" />
                    {setupData?.chokeSizes?.name || " Import file for production strings chokes"}

            </ExcelToCsv>
            {/* <input name="chokeSizes" type="file" hidden onChange={handleFiles} id="chokeSizes" /> */}


            {/* <input t name="staticParameters" type="file" hidden onChange={handleFiles} id="reserviorParaemters" /> */}
            <ExcelToCsv  className="block border w-[50%] rounded m-3 p-3" onComplete={jsonData => handleFiles('staticParameters', jsonData)}>

                    <BsPlus size={50} className="mx-auto" />
                    {setupData?.staticParameters?.name || "Import file for Reservoir Parameters"}

            </ExcelToCsv>
        </div>
    )
}

const SaveAs = () => {
    const setupData = useSelector(state => state.setup)
    const dispatch = useDispatch()
    return (
        <div className="h-[300px] flex flex-col  w-[400px] mx-auto gap-1 justify-center">
            <Text weight={600} size={24}>Save Schedule as</Text>
            <Input label={''} required defaultValue={setupData?.title} onChange={(e) => dispatch(setSetupData({ name: 'title', value: e.target.value }))} />
        </div>
    )
}
const Exists = () => {

    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "merSchedule" } })

    return (
        <div className=" flex flex-wrap gap-4 m-5 ">

            <Files name={(file) => `${createWellTitle(file, 'MER Data Schedule')}`} files={data} actions={[
                { name: 'Remark', to: (file) => `/users/fdc/mer-data/schedule-table?id=${file?.id}` },
                { name: 'MER DATA Result', to: (file) => `/users/fdc/mer-data/mer-data-result-table?scheduleId=${file?.id}` },
            ]} />

        </div>
    )
}

const Schedule = () => {
    // const setupData = useSelector(state => state.setup)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(clearSetup())
    }, [dispatch])
    const save = async () => {
        try {
            setLoading(true)
            const setupData = store.getState().setup
            const chokeSizes = setupData?.chokeSizes
            const staticParameters = setupData?.staticParameters

            const payload = {
                title: setupData?.title, chokeSizes, staticParameters, date: dayjs().format("DD/MM/YYYY")
            }
            await firebaseFunctions('createMerSchedule', payload)
            // console.log({ data }, '----')

            // dispatch(setWholeSetup(data))
            dispatch(closeModal())

        } catch (error) {
            toast.error(error?.message)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            {
                <Setup
                    title={'Setup MER Data Schedule'}
                    steps={["Import files", "Save As"]}
                    onSave={save}
                    rightLoading={loading}
                    existing={<Exists />}
                    stepComponents={[
                        // <SelectAsset />,
                        // <DefineSchedule />,
                        // <StaticParameters />,
                        <ImporFiles />,
                        <SaveAs />
                    ]}
                />
            }
        </>
    )


}

export default Schedule
