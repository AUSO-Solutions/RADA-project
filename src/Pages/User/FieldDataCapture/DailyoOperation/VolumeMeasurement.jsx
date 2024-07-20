import React from 'react'
import Setup from './setup'
import { Input } from 'Components'

const SelectAsset = () => {
  return <>
    <Input  label={'Assets'} type='select' />
  </>
}
const DefineReport = () => {
  return <>
    <Input type='select' placeholder="OML 999" containerClass={'h-[39px] !w-[150px]'}/>
  </>
}
const NoUnits = () => {
  return <>
    NoUnits
  </>
}

const VolumeMeasurement = () => {

  return (
    < >
      <Setup
        title={'Setup Volume Measurement Parameters'}
        steps={["Select Asset", "Define Report", "No. of Units"]}
        stepComponents={
          [
            <SelectAsset />,
            <DefineReport />,
            <NoUnits />
          ]
        }
      />
    </>
  )
}

export default VolumeMeasurement