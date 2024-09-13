
import { useDispatch, useSelector } from "react-redux"
import { useAssetNames } from "hooks/useAssetNames"
import { clearSetup, setSetupData, setWholeSetup } from "Store/slices/setupSlice"
import CheckInput from "Components/Input/CheckInput"
import { Input } from "Components"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from '../welltest.module.scss'
import { useFetch } from "hooks/useFetch"
import Text from "Components/Text"
import { closeModal } from "Store/slices/modalSlice"
import { store } from "Store"
import { firebaseFunctions } from "Services"
import { toast } from "react-toastify"
import Setup from "Partials/setup"
import { useAssetByName } from "hooks/useAssetByName"
import { Chip } from "@mui/material"
import dayjs from "dayjs"
import Files from "Partials/Files"



const createOpt = item => ({ label: item, value: item })
const optList = arr => arr?.length ? arr?.map(createOpt) : []
const genList = (assets) => {
    // console.log({assets})
    // let filtered = assets?.filter(asset => asset?.assetName === name)
    return {
        fields: optList((assets?.fields)),
        productionStrings: optList((assets?.productionStrings)),
        wells: optList((assets?.wells)),
        reservoirs: optList((assets?.reservoirs)),
    }
}

const SelectAsset = () => {
    const dispatch = useDispatch()

    const setupData = useSelector(state => state.setup)
    const { data: wellTestResults } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "wellTestResult" } })
    return <div className="flex flex-col gap-5">
        <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.month, value: setupData?.month }}
            label={'Month'} type='month' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
            onChange={(e) => dispatch(setSetupData({ name: 'month', value: e?.target.value }))}
        />
        <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.wellTestResult1, value: setupData?.wellTestResult1 }}
            label={'Well Test Result 1'} type='select' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
            onChange={(e) => dispatch(setSetupData({ name: 'wellTestResult1', value: e?.value }))}
        />
        <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.wellTestResult2, value: setupData?.wellTestResult2 }}
            label={'Well Test Result 2'} type='select' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
            onChange={(e) => dispatch(setSetupData({ name: 'wellTestResult2', value: e?.value }))}
        />

    </div>
}


const Preview = () => {

    const dispatch = useDispatch()

    const setupData = useSelector(state => state.setup)
    const { data: wellTestResults } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "wellTestResult" } })
    return <div className="flex flex-col gap-5">
        <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.month, value: setupData?.month }}
            label={'Month'} type='month' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
            disabled // onChange={(e) => dispatch(setSetupData({ name: 'month', value: e?.target.value }))}
        />
        <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.wellTestResult1, value: setupData?.wellTestResult1 }}
            label={'Well Test Result 1'} type='select' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
            disabled // onChange={(e) => dispatch(setSetupData({ name: 'wellTestResult1', value: e?.value }))}
        />
        <Input key={setupData?.asset + 'fields'} required defaultValue={{ label: setupData?.wellTestResult2, value: setupData?.wellTestResult2 }}
            label={'Well Test Result 2'} type='select' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
            disabled // onChange={(e) => dispatch(setSetupData({ name: 'wellTestResult2', value: e?.value }))}
        />

    </div>
}


const SaveAs = () => {
    const setupData = useSelector(state => state.setup)
    const dispatch = useDispatch()
    return (
        <div className="h-[300px] flex flex-col  w-[400px] mx-auto gap-1 justify-center">
            <Text weight={600} size={24}>Save Schedule as</Text>
            <Input label={''} defaultValue={setupData?.title} onChange={(e) => dispatch(setSetupData({ name: 'title', value: e.target.value }))} />
        </div>
    )
}
const Exists = () => {

    const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "wellTestSchedule" } })

    return (
        <div className=" flex flex-wrap gap-4 m-5 ">

            <Files files={data} actions={[
                { name: 'Remark', to: (file) => `/users/fdc/well-test-data/schedule-table?id=${file?.id}` },
                { name: 'Well Test Result', to: (file) => `/users/fdc/well-test-data/well-test-table?id=${file?.id}` },
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

            const { data } = await firebaseFunctions('createSetup', { ...setupData, setupType: 'wellTestSchedule' })
            console.log({ data }, '----')

            dispatch(setWholeSetup(data))
            dispatch(closeModal())
            // setSetupTable(true)
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
                    title={'Setup Well Test Schedule'}
                    steps={["Select Well Test", "Preview", "Save As"]}
                    onSave={save}
                    rightLoading={loading}
                    existing={<Exists />}
                    stepComponents={[
                        <SelectAsset />,

                        <Preview />,
                        <SaveAs />
                    ]}
                />
            }
        </>
    )


}

export default Schedule
