import Text from "Components/Text"
import Setup from "./setup"
import { useDispatch, useSelector } from "react-redux"
import { useAssetNames } from "hooks/useAssetNames"
import { setSetupData } from "Store/slices/setupSlice"
import { useAssetByName } from "hooks/useAssetByName"
import CheckInput from "Components/Input/CheckInput"
import { Input } from "Components"
import { useMemo } from "react"

const Schedule = () => {

    const SelectAsset = () => {
        const { assetNames } = useAssetNames()
        const setupData = useSelector(state => state.setup)
        const dispatch = useDispatch()
        return <>
            <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
                label={'Assets'} type='select'
                options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))} />
            <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
                label={'Field'} type='select'
                options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))} />
            <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
                label={'Production String'} type='select'
                options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
                onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))} />
        </>
    }

    const DefineSchedule = ({ asset, }) => {
        const dispatch = useDispatch()
        const setupData = useSelector(state => state.setup)
        const timeFrames = ["Daily", "Weekly", "Monthly"]
        const wellTypes = useMemo(() => {
            return [
                { value: 'Well 2L', label: 'Well 2L' },
                { value: 'Well 5L', label: 'Well 5L' },
                { value: 'Well 5S', label: 'Well 5S' },
                { value: 'Well 9L', label: 'Well 5S' },
                { value: 'Well 17L', label: 'Well 5S' },
            ]
        }, [setupData?.reportTypes])

        const reservoirType = [
            { value: "Res4321", label: "Res4321" },
            { value: "Res4321", label: "Res4321" },
            { value: "Res4321", label: "Res4321" },
            { value: "Res4321", label: "Res4321" },
            { value: "Res4321", label: "Res4321" },
        ]
        const handleCheck = (name, event) => {
            const checked = event.target.checked
            let selectedReportTypes = setupData?.reportTypes || []
            if (checked) {
                selectedReportTypes = Array.from(new Set([...selectedReportTypes, name]))
            } else {
                selectedReportTypes = selectedReportTypes.filter(reportType => reportType !== name)
            }
            dispatch(setSetupData({ name: 'reportTypes', value: selectedReportTypes }))
        }

        const checkAll = (e) => {
            const checked = e.target.checked
            dispatch(setSetupData({ name: 'reportTypes', value: [] }))
            if (checked) dispatch(setSetupData({ name: 'reportTypes', value: wellTypes.filter(reportType => wellTypes.value !== 'All').map(reportType => wellTypes.value) }))
        }
        return <>
            <div className='flex justify-between !w-[100%]'>
                <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} defaultValue={asset} disabled />
                <Input type='select' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
                    defaultValue={{ label: setupData?.timeFrame, value: setupData?.timeFrame }}
                    onChange={(e) => dispatch(setSetupData({ name: 'timeFrame', value: e.value }))}
                    options={timeFrames?.map(timeFrame => ({ value: timeFrame, label: timeFrame }))} />
            </div>

            <div key={setupData?.reportTypes?.length} className='w-auto flex flex-col mt-[24px] rounded-[8px]  border overflow-scroll'>
                {/* <div className='flex border-b px-3'>
              <CheckInput defaultChecked={setupData?.reportTypes?.length === wellTypes.length} onChange={(e) => checkAll(e)} label={'Select Report Type'} />
      
            </div> */}
                <table className="min-w-full ">
                    <thead className=" mt-5">
                        <tr className="pt-4 w-full text-left" >
                            <th className="pl-3">Wells</th>
                            <th className="px-2" >Reservoir</th>
                            <th className="px-2">Fluid Type</th>
                            <th className="px-2">No of Chokes</th>
                            <th className="px-2"> Chokes Size(/64")</th>
                            <th className="px-2"> Start Date</th>
                            <th className="px-2"> End Date</th>
                            <th className="px-2"> Duration (Hrs)</th>
                            <th className="px-2"> Stabilization Duration (Hrs)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b " >
                            <td className="w-full" >
                                {
                                    wellTypes.map(repoortType => <div className='flex w-full px-2'>
                                        <CheckInput defaultChecked={setupData?.reportTypes?.includes(repoortType.value)} onChange={(e) => handleCheck(repoortType.value, e)} label={repoortType.label} />
                                    </div>)
                                }
                            </td>
                            <td>
                                {
                                    reservoirType?.map((item, i) => <div className="py-2 px-2" >
                                        <Text size={'18px'}>{item?.label}</Text>
                                    </div>)
                                }
                            </td>
                            <td>
                                <div className="px-2 w-full" >
                                    <Input type='select' placeholder={"Select"} containerClass="" defaultValue={""} />
                                </div>
                                {/* <div className="px-2 w-full" >
                                    <Input type='select' placeholder={"Select"} containerClass="" defaultValue={""} />
                                </div> */}
                            </td>
                            <td className="px-2 w-auto">
                                <div className="border-2 px-2 rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                    <Text size={'18px'}>{'1'}</Text>
                                </div>
                            </td>
                            <td className="px-2" >
                                <div className="border-2 px-2 rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                    <Text size={'18px'}>{'24'}</Text>
                                </div>
                            </td>
                            <td className="px-2" >
                                <div className="border-2 px-2 rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                    <Text size={'18px'}>{new Date().toLocaleDateString()}</Text>
                                </div>
                            </td>
                            <td className="px-2" >
                                <div className="border-2 px-2  rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                    <Text size={'18px'}>{new Date().toLocaleDateString()}</Text>
                                </div>
                            </td>
                            <td className="px-2" >
                                <div className="border-2  rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                    <Text size={'18px'}>{'24'}</Text>
                                </div>
                            </td>
                            <td className="px-2" >
                                <div className="border-2  rounded-md  border-[#EAEAEF] flex justify-center items-center">
                                    <Text size={'18px'}>{'24'}</Text>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>

        </>
    }

    const Preview = () => {
        const setupData = useSelector(state => state.setup)
        const { flowStations } = useAssetByName(setupData?.asset)
        return <>
            <div className='border mt-3 !rounded-[8px]'>
                <div className='flex justify-between border-b p-3'>
                    <Text weight={600} className='w-1/3' size={"16px"}>Flow stations</Text>
                    <Text weight={600} className={'!text-center w-1/3'} size={"16px"}>Type</Text>
                    <Text weight={600} className='w-1/3 !text-right' size={"16px"}>Number of Meters/Tanks</Text>
                </div>
                {
                    setupData?.flowStations?.map((flowStation, i) => {
                        return (
                            <div className={`flex items-center ${flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
                                <Text className={'w-1/3 '}>{flowStation?.name}</Text>
                                <Text className={'w-1/3   !text-center'}>{flowStation?.measurementType}</Text>
                                <Text className='w-1/3 text-left !text-right'>{flowStation?.numberOfUnits}</Text>
                            </div>
                        )
                    })
                }
            </div>
        </>
    }

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
