
import { useDispatch, useSelector } from "react-redux"
import { clearSetup, setSetupData, setWholeSetup } from "Store/slices/setupSlice"
import { Input } from "Components"
import { useEffect, useMemo, useState } from "react"
import { useFetch } from "hooks/useFetch"
import Text from "Components/Text"
import { store } from "Store"
import { toast } from "react-toastify"
import Setup from "Partials/setup"
import Files from "Partials/Files"
import { useLocation, useSearchParams } from "react-router-dom"
import { firebaseFunctions } from "Services"
import { closeModal, openModal } from "Store/slices/modalSlice"
import { createWellTitle } from "utils"
import dayjs from "dayjs"
import { setLoadingScreen } from "Store/slices/loadingScreenSlice"
import BroadCast from "Partials/BroadCast"
import SelectGroup from "Partials/BroadCast/SelectGroup"
import Attachment from "Partials/BroadCast/Attachment"
import BroadCastSuccessfull from "Partials/BroadCast/BroadCastSuccessfull"
import { useGetSetups } from "hooks/useSetups"


const SelectAsset = () => {
    const dispatch = useDispatch()
    const setupData = useSelector(state => state.setup)

    const { setups: wellTestResults } = useGetSetups("wellTestResult")
    const { search } = useLocation()

    const wellTestResult1Id = useMemo(() => new URLSearchParams(search).get("well-test-result-id"), [search])
    const { data: wellTestResult1 } = useFetch({ firebaseFunction: 'getSetup', payload: { id: wellTestResult1Id, setupType: 'wellTestResult' } })
    useEffect(() => {
        if (wellTestResult1?.id) {
            dispatch(setSetupData({ name: 'wellTestResult1', value: { title: wellTestResult1?.title, id: wellTestResult1?.id } }))
            dispatch(setSetupData({ name: 'month', value: dayjs(wellTestResult1?.month).add(1, 'month').format("YYYY-MM") }))
        }
    }, [wellTestResult1, dispatch])

    return <div className="flex flex-col gap-5">
        <Input value={setupData?.month} name='month' disabled
            label={'Month'} type='month'
        // onChange={(e) => dispatch(setSetupData({ name: 'month', value: e?.target.value }))}
        />
        <Input disabled={wellTestResult1?.id} key={wellTestResult1?.id} required={!wellTestResult1?.id} value={{ label: setupData?.wellTestResult1?.title, value: setupData?.wellTestResult1?.id }}
            label={'Well Test Result 1'} type='select' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
            onChange={(e) => dispatch(setSetupData({ name: 'wellTestResult1', value: { id: e.value, title: e.label } }))} name='wellTestResult1'
        />
        <Input required defaultValue={{ label: setupData?.wellTestResult2?.title, value: setupData?.wellTestResult2?.id }}
            label={'Well Test Result 2'} type='select' options={wellTestResults.filter(result => (result.id !== setupData?.wellTestResult1?.id))?.map(result => ({ label: result.title, value: result.id }))}
            onChange={(e) => dispatch(setSetupData({ name: 'wellTestResult2', value: { id: e.value, title: e.label } }))} name='wellTestResult2'
        />

    </div>
}

const Preview = () => {

    const setupData = useSelector(state => state.setup)
    const { setups: wellTestResults } = useGetSetups("wellTestResult")
    return <div className="flex flex-col gap-5">
        <Input key={setupData?.asset + 'fields'} disabled defaultValue={setupData?.month}
            label={'Month'} type='month' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
        />
        <Input key={setupData?.asset + 'fields'} disabled defaultValue={{ label: setupData?.wellTestResult1?.title, value: setupData?.wellTestResult1?.id }}
            label={'Well Test Result 1'} type='select' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
        />
        <Input key={setupData?.asset + 'fields'} disabled defaultValue={{ label: setupData?.wellTestResult2?.title, value: setupData?.wellTestResult2?.id }}
            label={'Well Test Result 2'} type='select' options={wellTestResults?.map(result => ({ label: result.title, value: result.id }))}
        />

    </div>
}


const SaveAs = () => {
    const setupData = useSelector(state => state.setup)
    const dispatch = useDispatch()


    return (
        <div className="h-[300px] flex flex-col  w-[400px] mx-auto gap-1 justify-center">
            <Text weight={600} size={24}>Save IPSC as</Text>
            <Input label={''} defaultValue={setupData?.title} required onChange={(e) => dispatch(setSetupData({ name: 'title', value: e.target.value }))} />
        </div>
    )
}
const Exists = () => {
    const { setups: data } = useGetSetups("IPSC")
    const dispatch = useDispatch()

    return (
        <div className=" flex flex-wrap gap-4 m-5 ">
            <Files files={data} actions={[
                { name: 'View', to: (file) => `/users/fdc/well-test-data/ipsc-table?id=${file?.id}` },
                { name: 'Edit', to: (file) => `/users/fdc/well-test-data/well-test-table?id=${file?.id}` },
                {
                    name: 'Broadcast', to: (file) => null, onClick: (file) => dispatch(openModal({
                        title: '',
                        component: <BroadCast
                            link={`/users/fdc/well-test-data/ipsc-table?id=${file?.id}`}
                            type={'Well Test IPSC'}
                            date={dayjs(file?.month).format('MMM/YYYY')}
                            title='Broadcast Well Test IPSC'
                            subject={`${file?.asset} Well Test IPSC ${dayjs(file?.month).format('MMM/YYYY')}`}
                            steps={['Select Group', 'Attachment', 'Broadcast']}
                            stepsComponents={[
                                <SelectGroup />,
                                <Attachment details={`${file?.asset} Well Test IPSC ${dayjs(file?.startDate).format('MMM/YYYY')}`} />,
                                <BroadCastSuccessfull details={`${file?.asset} Well Test IPSC ${dayjs(file?.startDate).format('MMM/YYYY')}`} />]} />
                    }))
                },
            ]} name={(file) => `${createWellTitle(file, 'Well Test Result')}`}
            />
        </div>
    )
}

const Schedule = () => {
    const [loading] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(clearSetup())
    }, [dispatch])
    const [searchParams] = useSearchParams()
    const wellTestResult1Id = (searchParams.get("well-test-result-id"))
    const { setups: IPSCs } = useGetSetups("IPSC")
    const save = async () => {
        try {
            dispatch(setLoadingScreen({ open: true }))
            const { data: wellTestResult1 } = await firebaseFunctions('getSetup', { id: wellTestResult1Id, setupType: 'wellTestResult' })
            
            // console.log(IPSCs, wellTestResult1)
            const setupData = store.getState().setup

            const created = IPSCs.find(ipsc => ipsc.month === dayjs(wellTestResult1?.month).add(1, 'month'))
            // console.log(created)
            if (created) {
                toast.info(`IPSC for the month ${wellTestResult1?.month} is already created`)
                return
            }

            const { data } = await firebaseFunctions('createSetup', { ...setupData, setupType: 'IPSC', asset: wellTestResult1?.asset, flowstations: wellTestResult1?.flowstations, wellTestResultData: wellTestResult1?.wellTestResultData, })
            dispatch(setWholeSetup(data))
            dispatch(closeModal())

        } catch (error) {
            toast.error(error?.message)
        }
        finally {
            dispatch(setLoadingScreen({ open: false }))
        }
    }
    return (
        <>
            {
                <Setup
                    title={'Setup IPSC'}
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
