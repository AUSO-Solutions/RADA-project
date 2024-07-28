import React, { useEffect, useMemo, useState } from 'react'
import Setup from './setup'
import { Input } from 'Components'
import { useAssetNames } from 'hooks/useAssetNames'
import { useDispatch, useSelector } from 'react-redux'
import { setSetupData } from 'Store/slices/setupSlice'
import CheckInput from 'Components/Input/CheckInput'
import Text from 'Components/Text'
import { useAssetByName } from 'hooks/useAssetByName'

const SelectAsset = () => {
  const { assetNames } = useAssetNames()
  const setupData = useSelector(state => state.setup)
  const dispatch = useDispatch()
  return <>
    <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
      label={'Assets'} type='select'
      options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
      onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))} />
  </>
}

const DefineReport = ({ asset, }) => {
  const dispatch = useDispatch()
  const setupData = useSelector(state => state.setup)
  const timeFrames = ["Daily", "Weekly", "Monthly"]
  const reportTypes = useMemo(() => {
    return [
      { value: 'Gross Liquid', label: 'Gross Liquid' },
      { value: 'Net Oil/ Condensate', label: 'Net Oil/ Condensate' },
      { value: 'Gas', label: 'Gas' }
    ]
  }, [setupData?.reportTypes])
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
    if (checked) dispatch(setSetupData({ name: 'reportTypes', value: reportTypes.filter(reportType => reportType.value !== 'All').map(reportType => reportType.value) }))
  }
  return <>
    <div className='flex justify-between !w-[100%]'>
      <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} defaultValue={asset} disabled />
      <Input type='select' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'}
        defaultValue={{ label: setupData?.timeFrame, value: setupData?.timeFrame }}
        onChange={(e) => dispatch(setSetupData({ name: 'timeFrame', value: e.value }))}
        options={timeFrames?.map(timeFrame => ({ value: timeFrame, label: timeFrame }))} />
    </div>

    <div key={setupData?.reportTypes?.length} className='flex flex-col mt-[24px] rounded-[8px] gap-[24px] border'>
      <div className='flex border-b px-3'>
        <CheckInput defaultChecked={setupData?.reportTypes?.length === reportTypes.length} onChange={(e) => checkAll(e)} label={'Select Report Type'} />

      </div>
      {
        reportTypes.map(repoortType => <div className='flex border-b px-3'>
          <CheckInput defaultChecked={setupData?.reportTypes?.includes(repoortType.value)} onChange={(e) => handleCheck(repoortType.value, e)} label={repoortType.label} />
        </div>)
      }
    </div>

  </>
}

const NoUnits = () => {
  const measureMenntTypes = ['Metering', 'Tank Dipping']
  const setupData = useSelector(state => state.setup)
  const { flowStations } = useAssetByName(setupData?.asset)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setSetupData({ name: 'flowStations', value: flowStations }))
  }, [flowStations])
  return <>
    <div className='flex justify-between !w-[100%]'>
      <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
      <Input type='select' placeholder={setupData?.timeFrame} containerClass={'h-[39px] !w-[150px]'} disabled />
    </div>

    <div className='flex flex-col mt-[24px] rounded-[8px] gap-[14px] border'>
      <div className='flex border-b justify-between p-3'>
        <Text weight={600} size={"16px"}>Number of Flow Station</Text>
        <Text weight={600} size={"16px"}>Volume Measurement Type</Text>
      </div>
      <div className='flex justify-between p-3'>
        <Input containerClass={'h-[39px] !w-[150px]'} type='number' value={flowStations.length} disabled />
        <Input containerClass={'h-[39px] !w-[150px]'} type='select'
          defaultValue={{ label: setupData?.measurementType, value: setupData?.measurementType }}
          onChange={(e) => dispatch(setSetupData({ name: 'measurementType', value: e.value }))}
          options={measureMenntTypes.map(type => ({ label: type, value: type }))} />
      </div>
    </div>
  </>
}

const SelectFlowStation = () => {
  const setupData = useSelector(state => state.setup)
  const dispatch = useDispatch()
  const { flowStations } = useAssetByName(setupData?.asset)
  return <>
    <div className='border mt-3 !rounded-[8px]'>
      <div className='flex justify-between border-b p-3'>
        <Text weight={600} size={"16px"}>Flow stations</Text>
        <Text weight={600} size={"16px"}>Number of {setupData?.measurementType === "Metering" ? "Meter(s)" : "Tank(s)"}</Text>
      </div>
      {
        flowStations.map((flowStation, i) => {
          return (
            <div className={`flex items-center ${flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
              <Text>{flowStation}</Text>
              <Input type='number' containerClass={'!w-[150px]'} inputClass={'!text-center'}
                defaultValue={setupData?.measurementTypeNumber[flowStation]}
                onChange={(e) => dispatch(setSetupData({
                  name: 'measurementTypeNumber',
                  value: { ...setupData?.measurementTypeNumber, [flowStation]: e.target.value }
                }))} />
            </div>
          )
        })
      }
    </div>
  </>
}


const Preview = () => {
  const setupData = useSelector(state => state.setup)
  const { flowStations } = useAssetByName(setupData?.asset)
  return <>
    <div className='border mt-3 !rounded-[8px]'>
      <div className='flex justify-between border-b p-3'>
        <Text weight={600} size={"16px"}>Flow stations</Text>
        <Text weight={600} size={"16px"}>Number of Meters</Text>
      </div>
      {
        flowStations.map((flowStation, i) => {
          return (
            <div className={`flex items-center ${flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
              <Text>{flowStation}</Text>
              <Text className={'text-center'}>{setupData?.measurementTypeNumber[flowStation]}</Text>
            </div>
          )
        })
      }
    </div>
  </>
}


const VolumeMeasurement = () => {
  const setupData = useSelector(state => state.setup)
  const [formData, setFormData] = useState({
    asset: "",
    timeFrame: "",
    flowStations: [

    ],
    reportTypes: ['']
  })
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))

  }

  const save = async () => {
    console.log(setupData)
  }

  return (
    < >
      <Setup
        title={'Setup Volume Measurement Parameters'}
        steps={["Select Asset", "Define Report", "No. of Units", "Select Flowstations", "Preview"]}
        stepComponents={
          [
            <SelectAsset getAsset={(asset) => handleChange('asset', asset)} />,
            <DefineReport asset={formData.asset} />,
            <NoUnits />,
            <SelectFlowStation />,
            <Preview />
          ]
        }
        onSave={save}
      />
    </>
  )
}

export default VolumeMeasurement