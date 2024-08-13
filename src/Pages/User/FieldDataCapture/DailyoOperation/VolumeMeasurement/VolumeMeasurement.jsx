import React, { useEffect, useMemo, useState } from 'react'
import Setup from '../setup'
import { Input } from 'Components'
import { useAssetNames } from 'hooks/useAssetNames'
import { useDispatch, useSelector } from 'react-redux'
import { clearSetup, setSetupData } from 'Store/slices/setupSlice'
import CheckInput from 'Components/Input/CheckInput'
import Text from 'Components/Text'
import { useAssetByName } from 'hooks/useAssetByName'
import { store } from 'Store'
import { firebaseFunctions } from 'Services'
import VolumeMeasurementTable from './VolumeMeasurementTable'
import { closeModal } from 'Store/slices/modalSlice'
import RadioSelect from '../RadioSelect'
import RadaSwitch from 'Components/Input/RadaSwitch'
import RadaDatePicker from 'Components/Input/RadaDatePicker'
// import GasTable from './GasTable'
import { toast } from 'react-toastify'
import { colors } from 'Assets'
import { MdOutlineSettings } from "react-icons/md";
import VolumeSettings from './VolumeSettings'
import { updateFlowstation } from './helper'
import GasTable from './GasTable'


const SelectedReportTypes = ({ list = [] }) => {
  const setupData = useSelector(state => state.setup)
  console.log(setupData.reportTypes)

  return <div className='rounded flex border my-3 justify-evenly !w-[100%]'>
    {setupData?.reportTypes?.map((item, i) => {
      const isEven = i % 2 === 0
      return <div style={{ backgroundColor: isEven ? 'rgba(218, 225, 229, 1)' : 'rgba(243, 244, 246, .9)', height: '40px' }} className='text-center py-1 flex items-center justify-center !w-[100%] px-3'> {item} </div>
    })}
  </div>
}

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
  }, [])
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
  console.log(setupData, 'jj')
  useEffect(() => {
    if (flowStations.length) {
      dispatch(setSetupData({
        name: 'flowStations',
        value: flowStations.map((flowStation, i) => ({ ...setupData?.flowStations?.[i], name: flowStation }))
      }))
    }
  }, [flowStations,dispatch,setupData?.flowStations])
  // const updateFlowstation = (e, i) => {
  //   if (setupData?.flowStations?.length) {
  //     let measurementType = e.value
  //     let prevFlowstations = [...setupData?.flowStations]
  //     prevFlowstations[i] = { ...prevFlowstations[i], measurementType }
  //     if (measurementType) {
  //       dispatch(setSetupData({
  //         name: 'flowStations',
  //         value: prevFlowstations
  //       }))
  //     }
  //   }
  // }
  return <>
    <div className='flex justify-between !w-[100%]'>
      <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
      <Input type='select' placeholder={setupData?.timeFrame} containerClass={'h-[39px] !w-[150px]'} disabled />
    </div>

    <div className='flex flex-col mt-[24px] rounded-[8px] gap-[14px] border'>
      <div className='flex border-b justify-between p-3'>
        <Text weight={600} size={"16px"}>Flow Station</Text>
        <Text weight={600} size={"16px"}>Volume Measurement Type</Text>
      </div>
      {
        flowStations.map((flowStation, i) => (<div className='flex justify-between p-3'>
          <Input containerClass={'h-[39px] !w-[fit-content]'} type='text' value={flowStation} disabled />
          <Input containerClass={'h-[39px] !w-[150px]'} type='select'
            defaultValue={{ label: setupData?.flowStations?.[i]?.measurementType, value: setupData?.flowStations?.[i]?.measurementType }}
            // onChange={e => updateFlowstation(e, i)}
            onChange={(e) => updateFlowstation(i, 'measurementType', e.value)}
            options={measureMenntTypes.map(type => ({ label: type, value: type }))} />

        </div>))
      }
    </div>
    <SelectedReportTypes />
  </>
}

const SelectFlowStation = () => {
  const setupData = useSelector(state => state.setup)
  // const dispatch = useDispatch()
  // const { flowStations } = useAssetByName(setupData?.asset)
  // const updateFlowstation = (e, i) => {
  //   if (setupData?.flowStations?.length) {
  //     let numberOfUnits = e.target.value
  //     let prevFlowstations = [...setupData?.flowStations]
  //     prevFlowstations[i] = { ...prevFlowstations[i], numberOfUnits }
  //     if (numberOfUnits) {
  //       dispatch(setSetupData({
  //         name: 'flowStations',
  //         value: prevFlowstations
  //       }))
  //     }
  //   }
  // }
  return <>
    <div className='border mt-3 !rounded-[8px]'>
      <div className='flex justify-between border-b p-3'>
        <Text weight={600} size={"16px"}>Flow stations</Text>
        <Text weight={600} size={"16px"}>Number of Meter(s) / Tank(s)</Text>
      </div>
      {
        setupData?.flowStations?.map((flowStation, i) => {
          return (
            <div className={`flex items-center ${setupData?.flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
              <Text>{flowStation?.name}</Text>
              <Input type='number' containerClass={'!w-[150px]'} inputClass={'!text-center'}
                defaultValue={setupData?.flowStations?.[i].numberOfUnits}
                // onChange={(e) => updateFlowstation(e, i)} 
                onChange={(e) => updateFlowstation(i,"numberOfUnits",e.target.value)}
                />
            </div>
          )
        })
      }
    </div>

    <SelectedReportTypes />
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


const VolumeMeasurement = () => {

  const [setupTable, setSetupTable] = useState(false)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const save = async () => {
    try {
      setLoading(true)
      const setupData = store.getState().setup
      // console.log(setupData)
      await firebaseFunctions('setupVolumeMeasurement', { ...setupData })
      dispatch(closeModal())
      setSetupTable(true)
    } catch (error) {
      toast.error(error?.message)
    }
    finally {
      setLoading(false)
    }

    // await firebaseFunctions("")
  }
  const setupData = useSelector(state => state.setup)
  // console.log(setupData?.reportTypes)

  const [currReport, setCurrReport] = useState(setupData?.reportTypes?.[0])
  useEffect(() => {
    dispatch(clearSetup({}))
  }, [dispatch])
  useEffect(()=>{
    setCurrReport(setupData?.reportTypes?.[0])
  },[setupData?.reportTypes,setupTable])

  return (
    < >
      {
        setupTable ?
          <>
            <div className='flex justify-between my-2 px-2 items-center'>
              <div className='flex gap-4 items-center'>
                <RadioSelect onChange={setCurrReport} defaultValue={setupData?.reportTypes?.[0]} list={setupData?.reportTypes} /> <RadaSwitch label="Edit Table" labelPlacement="left" />
              </div>
              <div className='flex items-center gap-2 '>
                <Text className={'cursor-pointer'} onClick={()=> setSetupTable(false)} color={colors.rada_blue}>View setups</Text>
                <RadaDatePicker />
                <div onClick={()=>setShowSettings(true)} style={{borderColor:'rgba(0, 163, 255, 1)'}} className='border cursor-pointer px-3 py-1 rounded-[8px]'>
                <MdOutlineSettings color='rgba(0, 163, 255, 1)' />
                </div>
              </div>
            </div>
           {showSettings && <VolumeSettings onClickOut={()=>setShowSettings(false)} />}

            {
              currReport === 'Gas' ? <GasTable /> :

                <VolumeMeasurementTable currReport={currReport} />
            }

          </>
          : <Setup
            title={'Setup Volume Measurement Parameters'}
            steps={["Select Asset", "Define Report", "No. of Units", "Select Flowstations", "Preview"]}
            type={'volumeMeasurement'}
            rightBtnLoading={loading}
            onSetWholeSetup={() => setSetupTable(true)}
            stepComponents={
              [
                <SelectAsset />,
                <DefineReport />,
                <NoUnits />,
                <SelectFlowStation />,
                <Preview />
              ]
            }
            onSave={save}
          />
      }
    </>
  )
}

export default VolumeMeasurement