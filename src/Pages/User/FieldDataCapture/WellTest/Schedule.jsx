import Text from "Components/Text"
import Setup from "./setup"
import { useDispatch, useSelector } from "react-redux"
import { useAssetNames } from "hooks/useAssetNames"
import { setSetupData } from "Store/slices/setupSlice"
import CheckInput from "Components/Input/CheckInput"
import { Input } from "Components"
import { useCallback, useEffect, useMemo } from "react"
import styles from './welltest.module.scss'
import { useFetch } from "hooks/useFetch"


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
        console.log('first')
        // if(e.value ===)
        dispatch(setSetupData({ name: 'asset', value: e.value }))
        dispatch(setSetupData({ name: 'field', value: '' }))
        dispatch(setSetupData({ name: 'productionStrings', value: null }))
    }, [dispatch])
useEffect(()=>{

    console.log(setupData)
},[setupData])

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

const DefineSchedule = ({ asset, }) => {
    const dispatch = useDispatch()
    const setupData = useSelector(state => state.setup)

    const { data: assets } = useFetch({ firebaseFunction: 'getAssets' })
    const assetData = useMemo(() => genList(assets, setupData?.asset), [assets, setupData?.asset])
    const timeFrames = ["Daily", "Weekly", "Monthly"]

    const handleCheck = (name, event) => {
        const checked = event.target.checked
        let selectedReportTypes = setupData?.reportTypes || []
        if (checked) {
            selectedReportTypes = Array.from(new Set([...selectedReportTypes, name]))
        } else {
            selectedReportTypes = selectedReportTypes.filter(reportType => reportType !== name)
        }
        dispatch(setSetupData({ name: 'well', value: selectedReportTypes }))
    }

    return <>
        <div className='flex justify-between !w-[100%]'>
            <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} defaultValue={asset} disabled />
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
                        assetData.wells.map((well, i) =>
                            <tr className="border-b " >
                                <td className="w-full" >
                                    <CheckInput defaultChecked={setupData?.reportTypes?.includes(well.value)} onChange={(e) => handleCheck(well.value, e)} label={well.label} />
                                </td>
                                <td>
                                    {assetData.reserviors[i].label}
                                </td>
                                <td>
                                    <Input type='select' placeholder={"Select"} options={[{ label: 'Oil & Gas', value: 'Oil & Gas' }, { label: 'Gross Liquid', value: 'Gross Liquid' }]} containerClass="" defaultValue={""} />
                                </td>
                                <td>
                                    <Text size={'18px'}>{'1'}</Text>
                                </td>
                                <td  >
                                    <div className="border-2 px-2 rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                        <Text size={'18px'}>{'24'}</Text>
                                    </div>
                                </td>
                                <td>
                                    <div className="border-2 px-2 rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                        <Text size={'18px'}>{new Date().toLocaleDateString()}</Text>
                                    </div>
                                </td>
                                <td>
                                    <div className="border-2 px-2 rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                        <Text size={'18px'}>{new Date().toLocaleDateString()}</Text>
                                    </div>
                                </td>
                                <td>
                                    <div className="border-2  rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                        <Text size={'18px'}>{'24'}</Text>
                                    </div>
                                </td>
                            </tr>
                        )
                    }


                </tbody>
            </table>

        </div>

    </>
}




const Schedule = () => {
    return (
        <>
            {
                <Setup
                    title={'Setup Well Test Schedule'}
                    steps={["Select Asset", "Define Schedule", "Preview"]}
                    stepComponents={[
                        <SelectAsset />,
                        <DefineSchedule />,
                        <DefineSchedule />
                    ]}
                />
            }
        </>
    )


}

export default Schedule
