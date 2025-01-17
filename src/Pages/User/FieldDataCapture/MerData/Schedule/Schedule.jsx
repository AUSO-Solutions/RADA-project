import { useDispatch, useSelector } from "react-redux"
import { clearSetup, setSetupData } from "Store/slices/setupSlice"
import { Button, Input } from "Components"
import { useEffect, useState } from "react"
import Text from "Components/Text"
import { closeModal, openModal } from "Store/slices/modalSlice"
import { store } from "Store"
import { firebaseFunctions } from "Services"
import { toast } from "react-toastify"
import Setup from "Partials/setup"
import Files from "Partials/Files"
import { createWellTitle } from "utils"
import { BsPlus } from "react-icons/bs"
import dayjs from "dayjs"
import ExcelToCsv from "Partials/ExcelToCSV"
import { TickCircle } from "iconsax-react"
import { colors } from "Assets"
import { setLoadingScreen } from "Store/slices/loadingScreenSlice"
import BroadCast from "Partials/BroadCast"
import SelectGroup from "Partials/BroadCast/SelectGroup"
import Attachment from "Partials/BroadCast/Attachment"
import BroadCastSuccessfull from "Partials/BroadCast/BroadCastSuccessfull"
import { useGetSetups } from "hooks/useSetups"
import { useMe } from "hooks/useMe"
import SetupStatus from "Partials/SetupStatus"

const ImporFiles = () => {
    const dispatch = useDispatch()
    const [, setFiles] = useState({})
    const handleFiles = async (name, jsonData) => {

        try {
            console.log({ name, jsonData })
            dispatch(setSetupData({ name, value: jsonData }))
        } catch (error) {
            console.log(error)
        }
    }
    const setupData = useSelector(state => state.setup)
    return (
        <div>
            <Input type='month' label={'MER Month'} onChange={e => dispatch(setSetupData({ name: 'month', value: e.target.value }))} defaultValue={{ label: setupData?.month, value: setupData?.month }} containerClass={'!w-fit self-right  p-2'} />
            <div className="w-full flex justify-between">
                <div className="w-[50%] flex flex-col items-center">
                    <ExcelToCsv className="block  border  text-center rounded m-3 p-3" onComplete={(jsonData, file) => {
                        handleFiles('chokeSizes', jsonData)
                        setFiles({ chokeFile: file })
                    }}>
                        {setupData?.chokeSizes ?
                            <><TickCircle color={colors.rada_blue} className="mx-auto" size={50} /> Choke sizes file uploaded</>
                            : <>
                                <BsPlus size={50} className="mx-auto" />
                                Import file for production strings chokes
                            </>}

                    </ExcelToCsv>
                    <Button width={150} >
                        <a href={'/DownloadTemplates/MERSchedule.xlsx'} download>Download Template</a>
                    </Button>
                </div>
                <div className="w-[50%] flex flex-col items-center">
                    <ExcelToCsv className="block border  rounded m-3 p-3" onComplete={jsonData => handleFiles('staticParameters', jsonData)}>
                        {setupData?.staticParameters ?
                            <>
                                <TickCircle color={colors.rada_blue} className="mx-auto" size={50} />
                                Reservoir Parameterss file uploaded
                            </>
                            :
                            <>
                                <BsPlus color={colors.rada_blue} size={50} className="mx-auto" />
                                Import file for Reservoir Parameters
                            </>}
                    </ExcelToCsv>
                    <Button width={150}  >
                        <a href={'/DownloadTemplates/ReservoirData.xlsx'} download>Download Template</a>
                    </Button>
                </div>
            </div>
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
    const { setups: data } = useGetSetups("merSchedule")
    const dispatch = useDispatch()
    const { user } = useMe()

    return (
        <>
            <div className="flex flex-wrap gap-4 m-5 ">
                <Files name={(file) => `${createWellTitle(file, 'MER Data Schedule')}`} files={data} actions={[
                    { name: 'View', to: (file) => `/users/fdc/mer-data/schedule-table?id=${file?.id}` },
                    {
                        name: 'MER DATA Result',
                        to: (file) => `/users/fdc/mer-data/mer-data-result-table?scheduleId=${file?.id}`,
                        // permitted: user.permitted.createAndeditMERdata
                        hidden: (file) => user.permitted.createAndeditMERdata && file?.status === 'approved'
                    },
                    {
                        name: user.permitted.broadcastData ? 'Broadcast' : "Share", to: (file) => null, onClick: (file) => dispatch(openModal({
                            title: '',
                            component: <BroadCast
                                setup={file}
                                link={`/users/fdc/mer-data/mer-data-result-table?scheduleId=${file?.id}`}
                                type={'MER Data'}
                                date={dayjs(file?.month).format('MMM/YYYY')}
                                title='Broadcast MER Data'
                                subject={`${file?.asset} MER Data ${dayjs(file?.month).format('MMM/YYYY')}`}
                                steps={['Select Group', 'Attachment', 'Broadcast']}
                                stepsComponents={[
                                    <SelectGroup />,
                                    <Attachment details={`${file?.asset} MER Data ${dayjs(file?.startDate).format('MMM/YYYY')}`} />,
                                    <BroadCastSuccessfull details={`${file?.asset} MER Data ${dayjs(file?.startDate).format('MMM/YYYY')}`} />]} />
                        })),
                        hidden: (file) =>(user.permitted.broadcastData || user.permitted.shareData) && file?.status === 'approved'
                    },



                ]} bottomRight={(file) => <SetupStatus setup={file} />} />
            </div>
        </>

    )
}

const Schedule = () => {
    const [loading,] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(clearSetup())
    }, [dispatch])
    const { user } = useMe()
    const save = async () => {
        try {
            dispatch(setLoadingScreen({ open: true }))
            const setupData = store.getState().setup
            const chokeSizes = setupData?.chokeSizes
            const staticParameters = setupData?.staticParameters

            const payload = {
                title: setupData?.title, chokeSizes, staticParameters, date: dayjs().format("DD/MM/YYYY"), month: setupData?.month
            }
            await firebaseFunctions('createMerSchedule', payload)
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
                    title={'Setup MER Data Schedule'}
                    steps={["Import files", "Save As"]}
                    onSave={save}
                    rightLoading={loading}
                    existing={<Exists />}
                    hideCreateSetupButton={!user.permitted.createMERschedule}
                    stepComponents={[
                        <ImporFiles />,
                        <SaveAs />
                    ]}
                />
            }
        </>
    )


}

export default Schedule
