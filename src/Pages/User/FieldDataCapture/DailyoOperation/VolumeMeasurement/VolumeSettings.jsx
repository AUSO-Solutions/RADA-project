import { Box } from '@mui/material'
import Text from 'Components/Text'
import React from 'react'
import { useSelector } from 'react-redux'
// import { setSetupData } from 'Store/slices/setupSlice'
import { updateFlowstation, updateFlowstationReading } from './helper'
import { Button } from 'Components'
import { firebaseFunctions } from 'Services'
import { store } from 'Store'
import { Close } from '@mui/icons-material'

const VolumeSettings = ({ onClickOut = () => null }) => {
  const setupData = useSelector(state => state.setup)
  console.log(setupData)


  const save = async () => {
    try {

      const _setupData = store.getState().setup
      await firebaseFunctions('updateVolumeMeasurement', { ..._setupData })
    } catch (error) {

      console.log(error)
    }
  }


  return (
    <>
      <div className='h-[100vh] w-[100vw] fixed ' onClick={onClickOut}></div>
      <div className='fixed bottom-2 right-8 p-4 w-[500px] drop-shadow border p-2 rounded bg-white p'>

        <div className='flex justify-between'>
          <Text weight={600} size={18}>  Table Settings</Text>
          <Close onClick={onClickOut} />
        </div> <br />  <br />
        <Text weight={600} size={14} color={'rgba(78, 78, 78, 0.5)'}>  Manage Meters</Text>
        <br />
        <Box className='!border-t  border-b border-b-black !border-t-black flex justify-between py-3' >
          <Text weight={600} size={14} className={'w-[30%]'}>  Manage Meters</Text>
          <Text weight={600} size={14} className={'w-[30%] !text-center'}> Meter/Tank Name</Text>
          <Text weight={600} size={14} className={'w-[30%] !text-right'}>  Meter Factor</Text>
        </Box>
        {

          setupData?.flowStations?.map((flowStation, flowStationIndex) => (
            <Box className=' flex justify-between py-3 items-center border-b border-b-grey' >
              <Text size={14} className={'w-[30%] flex items-center'}>  {flowStation?.name}</Text>
              <Text size={14} className={'w-[30%] flex flex-col !text-center'}>
                {
                  new Array(parseInt(flowStation?.numberOfUnits)).fill(0).map((meter, readingIndex) => (

                    <input className='border text-center outline-none px-2 w-[98px] h-[30px] rounded my-1'
                      value={flowStation?.readings?.[readingIndex]?.serialNumber}
                      onChange={(e) => updateFlowstationReading(flowStationIndex, readingIndex, 'serialNumber', e.target.value)}
                    />

                  ))
                }
                {
                  flowStation?.measurementType === 'Tank Dipping' && <input className='border text-center outline-none px-2 w-[98px] h-[30px] rounded my-1'
                    value={"Deduction"} disabled
                  //  onChange={(e) => updateFlowstationReading(flowStationIndex, readingIndex, 'serialNumber', e.target.value)}
                  />
                }
              </Text>
              <Text size={14} className={'w-[30%] !text-right'}>
                {
                  new Array(parseInt(flowStation?.numberOfUnits)).fill(0).map((meter, readingIndex) => (
                 <> <input type='number'
                      disabled={flowStation?.measurementType === 'Tank Dipping'}
                      defaultValue={flowStation?.measurementType === 'Metering'  || !flowStation?.measurementType  ? (flowStation?.readings?.[readingIndex]?.meterFactor || 1) : 1}
                      onChange={(e) => updateFlowstationReading(flowStationIndex, readingIndex, 'meterFactor', e.target.value)}
                      min={1} className='border text-center outline-none px-2 w-[98px] h-[30px] my-1' /></> 

                  ))
                }
                {
                  flowStation?.measurementType === 'Tank Dipping' && <input type='number'
                    value={flowStation?.deductionMeterFactor}
                    onChange={(e) => updateFlowstation(flowStationIndex, 'deductionMeterFactor', e.target.value)}
                    min={1} className='border outline-none text-center px-2 w-[98px] h-[30px] my-1' />
                }
              </Text>
            </Box>
          ))
        }

        <Button className={'w-[200px] mx-auto mt-5 '} onClick={save}>
          Save
        </Button>
      </div>
    </>
  )
}

export default VolumeSettings