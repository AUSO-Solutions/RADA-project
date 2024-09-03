
import Setup from "./setup"
import { useDispatch, useSelector } from "react-redux"
import { useAssetNames } from "hooks/useAssetNames"
import { setSetupData } from "Store/slices/setupSlice"
import CheckInput from "Components/Input/CheckInput"
import { Input } from "Components"
import { useCallback, useMemo } from "react"
import styles from './welltest.module.scss'
import { useFetch } from "hooks/useFetch"
import Text from "Components/Text"



const createOpt = item => ({ label: item, value: item })
const optList = arr => arr?.length ? arr?.map(createOpt) : []
const genList = (assets, name) => {
    let filtered = assets?.filter(asset => asset?.assetName === name)
    return {
        fields: optList(filtered?.map(asset => asset?.field)),
        productionStrings: optList(filtered?.map(asset => asset?.productionString)),
        wells: optList(filtered?.map(asset => asset?.well)),
        reserviors: optList(filtered?.map(asset => asset?.reservoir)),
    }
}

const SelectAsset = () => {
    const setupData = useSelector(state => state.setup)
    // console.log(setupData)
    const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })
    const assetData = useMemo(() => genList(assets, setupData?.asset), [assets, setupData?.asset])
    const { assetNames } = useAssetNames()
    const dispatch = useDispatch()
    const onSelectAsset = useCallback((e) => {
        // console.log('first')
        // if(e.value ===)
        dispatch(setSetupData({ name: 'asset', value: e.value }))
        dispatch(setSetupData({ name: 'field', value: '' }))
        dispatch(setSetupData({ name: 'productionStrings', value: null }))
        dispatch(setSetupData({ name: 'wellsData', value: {} }))
    }, [dispatch])


    return <>
        <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
            label={'Assets'} type='select' options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
            onChange={onSelectAsset}
        />
        <Input key={setupData?.asset + 'fields'} defaultValue={{ label: setupData?.field, value: setupData?.field }}
            label={'Field'} type='select' options={assetData.fields}
            onChange={(e) => dispatch(setSetupData({ name: 'field', value: e?.value }))}
        />
        <Input key={setupData?.asset + "prodString"} defaultValue={setupData?.productionStrings?.map(createOpt)}
            label={'Production String'} type='select' options={assetData.productionStrings} isMulti
            onChange={(e) => dispatch(setSetupData({ name: 'productionStrings', value: e }))}
        />
    </>
}

const DefineSchedule = () => {
    const dispatch = useDispatch()
    const setupData = useSelector(state => state.setup)

    const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })
    const assetData = useMemo(() => genList(assets, setupData?.asset), [assets, setupData?.asset])
    const timeFrames = ["Daily", "Weekly", "Monthly"]

    // const [wellsChanges, setWellChanges] = useState([])

    const storeWellChanges = (well, name, value, i) => {
        let updates = { ...setupData?.wellsData } || []
        updates[well] = { ...updates[well], well, reservoir: assetData.reserviors[i].label, [name]: value }
        console.log(updates)
        dispatch(setSetupData({ name: 'wellsData', value: updates }))
    }


    return <>
        <div className='flex justify-between !w-[100%]'>
            <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
            <Input type='select' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
                defaultValue={{ label: setupData?.timeFrame, value: setupData?.timeFrame }}
                onChange={(e) => dispatch(setSetupData({ name: 'timeFrame', value: e.value }))}
                options={timeFrames?.map(timeFrame => ({ value: timeFrame, label: timeFrame }))} />
        </div>

        <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

            <table className={styles.table}>
                <thead className=" mt-5">
                    <tr className="pt-4 w-full text-left" >
                        <th className="pl-3">Wells</th>
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
                        assetData.wells.map((well, i) => {

                            const handleWellChanges = (e) => {
                                const isCheckBox = (e.target.type === 'checkbox')
                                const name = (e.target.name)
                                const value = isCheckBox ? e.target.checked : e.target.value
                                storeWellChanges(well.value, name, value, i)
                                // storeWellChanges(well.value, 'well', well.value, i)
                                // storeWellChanges(well.value, 'reservior', assetData.reserviors[i].label, i)
                            }
                            const handleFluidTypeChange = (e) => {
                                storeWellChanges(well.value, 'fluidType', e.value, i)
                            }
                            const col = setupData?.wellsData[well.value]
                            return (
                                <tr className="border-b " >
                                    <td className="w-full" >
                                        <CheckInput name={'isSelected'} defaultChecked={col?.isSelected} onChange={handleWellChanges} label={well.label} />
                                    </td>
                                    <td>
                                        {assetData.reserviors[i].label}
                                    </td>
                                    <td>
                                        <Input type='select' placeholder={"Select"} required={col?.isSelected}
                                            name="fluidType" onChange={handleFluidTypeChange} defaultValue={{ label: col?.fluidType, value: col?.fluidType }}
                                            options={[{ label: 'Oil & Gas', value: 'Oil & Gas' }, { label: 'Gross Liquid', value: 'Gross Liquid' }]} />
                                    </td>
                                    <td>
                                        <input required={col?.isSelected} type="number" className={styles.inputBox} defaultValue={col?.noOfChokes} name="noOfChokes" onChange={handleWellChanges} />
                                    </td>
                                    <td >
                                        <input required={col?.isSelected} type="number" className={styles.inputBox} defaultValue={col?.chokeSize} name="chokeSize" onChange={handleWellChanges} />
                                    </td>
                                    <td>
                                        <input required={col?.isSelected} type="date" className={styles.inputBox} defaultValue={col?.startDate} name="startDate" onChange={handleWellChanges} />
                                    </td>
                                    <td>
                                        <input required={col?.isSelected} type="date" className={styles.inputBox} defaultValue={col?.endDate} name="endDate" onChange={handleWellChanges} />
                                    </td>
                                    <td>
                                        <input className={styles.inputBox} required={col?.isSelected} type='number' defaultValue={col?.duration} name="duration" onChange={handleWellChanges} />
                                    </td>
                                    <td>
                                        <input className={styles.inputBox} required={col?.isSelected} type='number' defaultValue={col?.stabilizatonDuration} name="stabilizatonDuration" onChange={handleWellChanges} />
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
    const dispatch = useDispatch()
    const setupData = useSelector(state => state.setup)

    // const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })
    // const assetData = useMemo(() => genList(assets, setupData?.asset), [assets, setupData?.asset])
    const timeFrames = ["Daily", "Weekly", "Monthly"]

    // const [wellsChanges, setWellChanges] = useState([])

    // const storeWellChanges = (well, name, value, i) => {
    //     let updates = [...setupData?.wellsData] || []
    //     updates[well] = { ...updates[well], [name]: value }
    //     // console.log(updates)
    //     dispatch(setSetupData({ name: 'wellsData', value: updates }))
    // }
    // console.log(setupData?.wellsData)

    return <>
        <div className='flex justify-between !w-[100%]'>
            <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
            <Input type='select' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
                defaultValue={{ label: setupData?.timeFrame, value: setupData?.timeFrame }}
                onChange={(e) => dispatch(setSetupData({ name: 'timeFrame', value: e.value }))}
                options={timeFrames?.map(timeFrame => ({ value: timeFrame, label: timeFrame }))} />
        </div>

        <div key={setupData?.reportTypes?.length} className={styles.tableContainer}>

            <table className={styles.table}>
                <thead className=" mt-5">
                    <tr className="pt-4 w-full text-left" >
                        <th className="pl-3">Wells</th>
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
                        Object.values(setupData?.wellsData || {}).map((wellData, i) => {
                            const col = wellData
                            if (!col?.isSelected) return null
                            return (
                                <tr className="border-b " >
                                    <td className="w-full" >
                                        {/* <CheckInput name={'isSelected'} defaultChecked={col?.isSelected} disabled label={well.label} /> */}
                                        {col?.well}
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
                                        <input type="date" className={styles.inputBox} defaultValue={col?.startDate} disabled />
                                    </td>
                                    <td>
                                        <input type="date" className={styles.inputBox} defaultValue={col?.endDate} disabled />
                                    </td>
                                    <td>
                                        <input className={styles.inputBox} type='number' defaultValue={col?.duration} disabled />
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

const Schedule = () => {
    // const setupData = useSelector(state => state.setup)
    const save = () => {

    }
    return (
        <>
            {
                <Setup
                    title={'Setup Well Test Schedule'}
                    steps={["Select Asset", "Define Schedule", "Preview", "Save As"]}
                    onSave={save}
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
