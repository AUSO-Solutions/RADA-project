import React, { useMemo, useState } from 'react'
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
      // { value: 'All', label: 'Select Report Type' },
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
  const measureMenntTypes = ['Metering', 'Tanking Drip']
  const setupData = useSelector(state => state.setup)
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
        <Input containerClass={'h-[39px] !w-[150px]'} type='number' />
        <Input containerClass={'h-[39px] !w-[150px]'} type='select' options={measureMenntTypes.map(type => ({ label: type, value: type }))} />
      </div>
    </div>
  </>
}

const SelectFlowStation = () => {
  const setupData = useSelector(state => state.setup)
  const { assetData } = useAssetByName(setupData?.asset)
  console.log(assetData)

  return <>

    <div className='border mt-3 !rounded-[8px]'>
      <div className='flex justify-between p-3'>
        <Text weight={600} size={"16px"}>Flow stations</Text>
        <Text weight={600} size={"16px"}>Number of Meters</Text>
      </div>
      <div className='flex justify-between p-3'>
        {/* <Text weight={600} size={"16px"}>Flow stations</Text> */}
        <Input type='select' containerClass={'!w-[150px]'} options={assetData?.map(asset => ({ label: `${asset?.flowStation} ${asset?.productionString}`, value: '' }))} />
        <Input type='number' containerClass={'!w-[150px]'} />

      </div>
    </div>

    <div className='flex w-full rounded-[8px]'>

    </div>
  </>
}


const VolumeMeasurement = () => {
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
  return (
    < >
      <Setup
        title={'Setup Volume Measurement Parameters'}
        steps={["Select Asset", "Define Report", "No. of Units", "Select Flowstations"]}
        stepComponents={
          [
            <SelectAsset getAsset={(asset) => handleChange('asset', asset)} />,
            <DefineReport asset={formData.asset} />,
            <NoUnits />,
            <SelectFlowStation />
          ]
        }
      />
    </>
  )
}

export default VolumeMeasurement