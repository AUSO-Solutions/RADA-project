import { useDispatch, useSelector } from "react-redux"
import { useAssetNames } from "hooks/useAssetNames"
import { clearSetup, setSetupData, setWholeSetup } from "Store/slices/setupSlice"
import CheckInput from "Components/Input/CheckInput"
import { Input } from "Components"
import { useCallback, useEffect, useState } from "react"
import styles from '../welltest.module.scss'
import Text from "Components/Text"
import { closeModal, openModal } from "Store/slices/modalSlice"
import { store } from "Store"
import { firebaseFunctions } from "Services"
import { toast } from "react-toastify"
import Setup from "Partials/setup"
import { getAssetByName, useAssetByName } from "hooks/useAssetByName"
import { Chip } from "@mui/material"
import dayjs from "dayjs"
import Files from "Partials/Files"
import { createWellTitle } from "utils"
import { setLoadingScreen } from "Store/slices/loadingScreenSlice"
import { ImportWellTestSchedule } from "../ImportWellTestFile"
import BroadCast from "Partials/BroadCast"
import BroadCastSuccessfull from "Partials/BroadCast/BroadCastSuccessfull"
import SelectGroup from "Partials/BroadCast/SelectGroup"
import Attachment from "Partials/BroadCast/Attachment"
import { useGetSetups } from "hooks/useSetups"
import { useMe } from "hooks/useMe"
import SetupStatus from "Partials/SetupStatus"
import { deleteSetup } from "utils/deleteSetup"

const SelectAsset = () => {

    const setupData = useSelector(state => state.setup)
    const [asset, setAsset] = useState()
    const { assetNames } = useAssetNames()
    const dispatch = useDispatch()
    const onSelectAsset = useCallback(async (e) => {
        dispatch(setSetupData({ name: 'asset', value: e.value }))
        const asset_ = await getAssetByName(e.value)
        setAsset(asset_)
        dispatch(setSetupData({ name: 'productionStrings', value: null }))
        dispatch(setSetupData({ name: 'wellsData', value: {} }))
        dispatch(setSetupData({ name: 'flowstations', value: asset_?.flowStations }))
    }, [dispatch])
    useEffect(() => {
        const fetchAssetOnBack = async () => {
            const asset_ = await getAssetByName(setupData?.asset)
            setAsset(asset_)
        }
        if (setupData?.asset || !asset) fetchAssetOnBack()
        // eslint-disable-next-line
    }, [setupData?.asset])
    const [searchProdString, setSearchProdString] = useState('')
    const selectProdString = (productionString) => {
        const prevProductionstring = setupData?.productionStrings || []
        let newlist = []
        if (prevProductionstring.includes(productionString)) { newlist = prevProductionstring.filter(selected => selected !== productionString) }
        else { newlist = [...prevProductionstring, productionString] }
        dispatch(setSetupData({ name: 'productionStrings', value: newlist }))
    }
    const selectFlowstations = (e, flowStation) => {
        const checked = e.target.checked
        const prevFlowstations = setupData?.flowstations
        if (prevFlowstations?.length === 1 && !checked) { toast.info('You must have atleast one flowstation'); return; }
        if (checked) dispatch(setSetupData({ name: 'flowstations', value: [...prevFlowstations, flowStation] }))
        if (!checked) dispatch(setSetupData({ name: 'flowstations', value: prevFlowstations?.filter(flow => flow !== flowStation) }))
    }
    return <>
        <Input required defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
            label={'Assets'} type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
            onChange={(e) => onSelectAsset(e)}
        />
        <ImportWellTestSchedule />

        <br />  Flow stations ({setupData?.flowstations?.length}) <br />
        {
            asset?.flowStations?.map(flowStation => <> <CheckInput checked={setupData?.flowstations?.includes(flowStation)} onChange={(e) => selectFlowstations(e, flowStation)} label={flowStation} /> </>)
        }
        <div className="mt-3 p-1 border rounded">
            <Text>Production Strings</Text><br />
            <input type="search" placeholder="Search for production string" className="w-1/2 border py-1 mt-3 px-2 rounded" onChange={(e) => setSearchProdString(e.target.value)} />
            <div className="flex gap-1 mt-3 flex-wrap p-1  rounded">
                {
                    asset?.assetData
                        ?.filter((item) => setupData?.flowstations?.includes(item.flowStation))
                        ?.filter((item) => {
                            if (!searchProdString) return item?.wellId
                            return item?.wellId?.toLowerCase()?.includes(searchProdString?.toLowerCase())
                        })?.map(item => <Chip onClick={() => selectProdString(item?.wellId)} color="primary" variant={setupData?.productionStrings?.includes(item?.wellId) ? "filled" : "outlined"} className="cursor-pointer" label={item?.wellId} />)
                }
            </div>
        </div>
    </>
}

const DefineSchedule = () => {
    const dispatch = useDispatch()
    const setupData = useSelector(state => state.setup)
    const asset = useAssetByName(setupData?.asset)

    const getReservoirByProdString = (productionString) => {
        return asset.assetData?.find(asset => asset?.wellId === productionString)?.reservoir
    }
    const getFlowstationByProdString = (productionString) => {
        return asset.assetData?.find(asset => asset?.wellId === productionString)?.flowstation
    }

    const storeWellChanges = (productionString, name, value, i) => {
        let updates = { ...setupData?.wellsData } || []
        const prev = updates[productionString]
        let duration = 0
        updates[productionString] = {
            ...prev,
            [name]: value
        }
        if (prev?.startDate && prev?.endDate) {
            duration = dayjs(prev?.endDate).diff(prev?.startDate, 'hours')
            console.log(duration)
        }
        dispatch(setSetupData({ name: 'wellsData', value: updates }))
    }

    useEffect(() => {
        let updates = { ...setupData?.wellsData }

        asset?.assetData
            ?.filter(item => setupData?.flowstations?.includes(item?.flowstation))
            .forEach(({ productionString }) => {
                updates[productionString] = {
                    ...updates[productionString],
                    productionString,
                    reservoir: getReservoirByProdString(productionString),
                    flowstation: getFlowstationByProdString(productionString),
                    isSelected: setupData?.productionStrings?.includes(productionString)
                }
            })
        dispatch(setSetupData({ name: 'wellsData', value: updates }))
        // eslint-disable-next-line 
    }, [asset?.productionStrings, setupData?.productionStrings])

    return <>
        <div className='flex justify-between !w-[100%]'>
            <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
            <Input type='month' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
                defaultValue={setupData?.month} required
                onChange={(e) => dispatch(setSetupData({ name: 'month', value: e.target.value }))} />
        </div>

        <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

            <table className={styles.table}>
                <thead className=" mt-5">
                    <tr className="pt-4 w-full text-left" >
                        <th className="pl-3 text-left !min-w-[200px]">Production String</th>
                        <th >Reservoir</th>
                        <th>Fluid Type</th>
                        <th>No of Chokes</th>
                        <th> Chokes Size(/64")</th>
                        <th> Start Date</th>
                        <th> End Date</th>
                        <th> Duration (Hrs)</th>
                        <th> Stabilization Duration (Hrs)</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        asset?.assetData
                            ?.filter(item => setupData?.flowstations?.includes(item?.flowstation))
                            .sort((a, b) => {
                                return ((setupData?.productionStrings?.includes(b?.productionString) ? 1 : 0) - (setupData?.productionStrings?.includes(a?.productionString) ? 1 : 0))
                            })
                            .map(({ productionString, flowStation, flowstation }, i) => {

                                const handleWellChanges = (e) => {
                                    const isCheckBox = (e.target.type === 'checkbox')
                                    const name = (e.target.name)
                                    const value = isCheckBox ? e.target.checked : e.target.value
                                    storeWellChanges(productionString, name, value, i)
                                }
                                const handleFluidTypeChange = (e) => {
                                    storeWellChanges(productionString, 'fluidType', e.value, i)
                                }
                                const col = setupData?.wellsData[productionString]

                                return (
                                    <tr className="border-b " key={col?.productionString} >
                                        <td className="!min-w-[200px] text-left block pl-2 " >
                                            <CheckInput key={(col?.isSelected ? 1 : 0) + col?.productionString} name={'isSelected'} defaultChecked={col?.isSelected} onChange={handleWellChanges} label={productionString} />
                                        </td>
                                        <td>
                                            {getReservoirByProdString(productionString)} {flowstation}
                                        </td>
                                        <td>
                                            <Input type='select' placeholder={"Select"} required={col?.isSelected} disabled={!col?.isSelected}
                                                name="fluidType" onChange={handleFluidTypeChange} defaultValue={{ label: col?.fluidType, value: col?.fluidType }}
                                                options={[{ label: 'Oil', value: 'Oil' }, { label: 'Gas', value: 'Gas' }]} />
                                        </td>
                                        <td>
                                            <input required={col?.isSelected} disabled={!col?.isSelected} type="number" className={styles.inputBox} defaultValue={col?.noOfChokes} name="noOfChokes" onChange={handleWellChanges} />
                                        </td>
                                        <td >
                                            <input required={col?.isSelected} disabled={!col?.isSelected} type="number" className={styles.inputBox} defaultValue={col?.chokeSize} name="chokeSize" onChange={handleWellChanges} />
                                        </td>
                                        <td className="min-w-[230px]">
                                            <input required={col?.isSelected} disabled={!col?.isSelected} /* min={dayjs().format("YYYY-MM-DDTHH:mm")} */ type="datetime-local" className={styles.inputBox} defaultValue={col?.startDate} name="startDate" onChange={handleWellChanges} />
                                        </td>
                                        <td className="min-w-[230px]">
                                            <input required={col?.isSelected} disabled={!col?.isSelected} key={col?.startDate} /* min={dayjs(col?.startDate).format("YYYY-MM-DDTHH:mm")} */ type="datetime-local" className={styles.inputBox} defaultValue={col?.endDate} name="endDate" onChange={handleWellChanges} />
                                        </td>
                                        <td>
                                            <input className={styles.inputBox} required={col?.isSelected} disabled={!col?.isSelected} type='number' value={dayjs(col?.endDate).diff(col?.startDate, 'hours')} name="duration" />
                                        </td>
                                        <td>
                                            <input className={styles.inputBox} required={col?.isSelected} disabled={!col?.isSelected} type='number' defaultValue={col?.stabilizatonDuration} name="stabilizatonDuration" onChange={handleWellChanges} />
                                        </td>
                                    </tr>
                                )
                            }
                            )
                    }


                </tbody>
            </table>

        </div>

    </>
}
const Preview = () => {
    const setupData = useSelector(state => state.setup)
    return <>
        <div className='flex justify-between !w-[100%]'>
            <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
        </div>

        <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

            <table className={styles.table}>
                <thead className=" mt-5">
                    <tr className="pt-4 w-full text-left" >
                        <th className="pl-3">Production String</th>
                        <th >Reservoir</th>
                        <th>Fluid Type</th>
                        <th>No of Chokes</th>
                        <th> Chokes Size(/64")</th>
                        <th> Start Date</th>
                        <th> End Date</th>
                        <th> Duration (Hrs)</th>
                        <th> Stabilization Duration (Hrs)</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.values(setupData?.wellsData || {})?.filter(item => setupData?.flowstations?.includes(item?.flowstation))
                            .sort((a, b) => {
                                return ((setupData?.productionStrings?.includes(b?.productionString) ? 1 : 0) - (setupData?.productionStrings?.includes(a?.productionString) ? 1 : 0))
                            }).map((wellData, i) => {
                                const col = wellData
                                // if (!col?.isSelected) return null
                                return (
                                    <tr className="border-b " >
                                        <td className="w-full" >
                                            {col?.productionString}
                                        </td>
                                        <td>
                                            {col?.reservoir}
                                        </td>
                                        <td>
                                            <input type="text" className={styles.inputBox} defaultValue={col?.fluidType} disabled />
                                        </td>
                                        <td>
                                            <input type="number" className={styles.inputBox} defaultValue={col?.noOfChokes} disabled />
                                        </td>
                                        <td  >
                                            <input type="number" className={styles.inputBox} defaultValue={col?.chokeSize} disabled />
                                        </td>
                                        <td>
                                            <input type="datetime-local" className={styles.inputBox} defaultValue={col?.startDate} disabled />
                                        </td>
                                        <td>
                                            <input type="datetime-local" className={styles.inputBox} defaultValue={col?.endDate} disabled />
                                        </td>
                                        <td>
                                            <input className={styles.inputBox} type='number' value={dayjs(col?.endDate).diff(col?.startDate, 'hours')} disabled />
                                        </td>
                                        <td>
                                            <input className={styles.inputBox} type='number' defaultValue={col?.stabilizatonDuration} disabled />
                                        </td>
                                    </tr>
                                )
                            }
                            )
                    }

                </tbody>
            </table>

        </div>

    </>
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

    const { setups: data } = useGetSetups("wellTestSchedule")
    const dispatch = useDispatch()
    const { user } = useMe()

    return (
        <div className=" flex flex-wrap gap-4 m-5 ">

            <Files name={(file) => `${createWellTitle(file, 'Well Test Schedule')}`} files={data} actions={[
                { name: 'View', to: (file) => `/users/fdc/well-test-data/schedule-table?id=${file?.id}`, permitted: true },
                {
                    name: 'CreateWell Test',
                    to: (file) => `/users/fdc/well-test-data/well-test-table?id=${file?.id}`,
                    // permitted: user.permitted.createAndeditWellTestResult,
                    hidden: (file) => user.permitted.createAndeditWellTestResult && file?.status === 'approved'
                },
                {
                    name: 'Broadcast', to: (file) => null, onClick: (file) => dispatch(openModal({
                        title: '',
                        component: <BroadCast
                            link={`/users/fdc/well-test-data/well-test-table?id=${file?.id}`}
                            type={'MER Data'}
                            date={dayjs(file?.month).format('MMM/YYYY')}
                            title='Broadcast Well Test Schedule'
                            subject={`${file?.asset} Well Test ${dayjs(file?.month).format('MMM/YYYY')}`}
                            steps={['Select Group', 'Attachment', 'Broadcast']}
                            stepsComponents={[
                                <SelectGroup />,
                                <Attachment details={`${file?.asset} Well Test ${dayjs(file?.startDate).format('MMM/YYYY')}`} />,
                                <BroadCastSuccessfull details={`${file?.asset} Well Test ${dayjs(file?.startDate).format('MMM/YYYY')}`} />]} />
                    })),
                    // permitted: user.permitted.broadcastData,
                    hidden: (file) => user.permitted.broadcastData && file?.status === 'approved'
                },
                {
                    name: 'Delete', onClick: (file) => deleteSetup({ id: file?.id, setupType: 'wellTestSchedule' }), to: () => null,
                    hidden: (file) => user.permitted.remarkWellTestSchedule && file?.status !== 'approved'
                },
            ]}
                bottomRight={(file) => <SetupStatus setup={file} />} />

        </div>
    )
}

const Schedule = () => {
    // const setupData = useSelector(state => state.setup)
    const [loading] = useState(false)
    const { user } = useMe()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(clearSetup())
    }, [dispatch])
    const save = async () => {
        try {
            dispatch(setLoadingScreen({ open: true }))
            const setupData = store.getState().setup
            const { data } = await firebaseFunctions('createSetup', { ...setupData, setupType: 'wellTestSchedule' })

            dispatch(setWholeSetup(data))
            dispatch(closeModal())
            // setSetupTable(true)
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
                    title={'Setup Well Test Schedule'}
                    steps={["Select Asset", "Define Schedule", "Preview", "Save As"]}
                    onSave={save}
                    rightLoading={loading}
                    existing={<Exists />}
                    hideCreateSetupButton={!user.permitted.createWellTestSchedule}
                    stepComponents={[
                        <SelectAsset />,
                        <DefineSchedule />,
                        <Preview />,
                        <SaveAs />
                    ]}
                />
            }

        </>
    )


}

export default Schedule
