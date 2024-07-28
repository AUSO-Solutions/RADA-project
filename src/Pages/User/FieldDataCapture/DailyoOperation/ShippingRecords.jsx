import React, { useEffect } from 'react'
import Setup from './setup'
// import { useAssetNames } from 'hooks/useAssetNames'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from 'Components'
import { setSetupData } from 'Store/slices/setupSlice'
import { useAssetByName } from 'hooks/useAssetByName'
import Text from 'Components/Text'

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

const ShippingRecords = () => {
  return (
    <>
      <Setup
        title={'Setup Shipping Records Parameters'}
        steps={["Shipping Method", "Define Report", "Preview"]}
        stepComponents={[<NoUnits />,]}
      />
    </>
  )
}

export default ShippingRecords