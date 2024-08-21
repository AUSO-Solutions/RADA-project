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
import { camelize, updateFlowstation, updateFlowstationReading } from './helper'
import GasTable from './GasTable'



const gasTypes = ["Gas Flared USM", "Fuel Gas", "Export Gas"].map(type => ({ label: type, key: camelize(type) }))


const SelectedReportTypes = ({ list = [] }) => {
  const setupData = useSelector(state => state.setup)
  // console.log(setupData.reportTypes)

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
  useEffect(() => {
    if (!setupData?.fluidType) dispatch(setSetupData({ name: 'fluidType', value: "Gas" }))
    // eslint-disable-next-line
  }, [dispatch])

  return <>
    <Input defaultValue={{ label: setupData?.asset, value: setupData?.asset }}
      label={'Assets'} type='select'
      options={assetNames?.map(assetName => ({ value: assetName, label: assetName }))}
      onChange={(e) => dispatch(setSetupData({ name: 'asset', value: e.value }))} />

    <div className=' mt-5'>
      <Text display={'block'} className={'mt-3'}>
        Select fluid type
      </Text>
      <RadioSelect onChange={(e) => dispatch(setSetupData({ name: 'fluidType', value: e }))} defaultValue={setupData?.fluidType || 'Gas'} list={['Gas', 'Gross & Oil/Condesate']} />

    </div>
  </>
}

const DefineReport = ({ asset, }) => {
  const dispatch = useDispatch()
  const setupData = useSelector(state => state.setup)
  const timeFrames = ["Daily", "Weekly", "Monthly"]
  const reportTypes = useMemo(() => {
    if (setupData?.fluidType === "Gas") {
      return [{ value: 'Gas', label: 'Gas' }]
    }
    return [
      { value: 'Gross Liquid', label: 'Gross Liquid' },
      { value: 'Net Oil/ Condensate', label: 'Net Oil/ Condensate' }
    ]
  }, [setupData?.fluidType])
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
        <CheckInput defaultChecked={setupData?.reportTypes?.length === reportTypes.length} onChange={(e) => checkAll(e)} label={'Select All'} />

      </div>
      {
        reportTypes.map(repoortType => <div className='flex border-b px-3'>
          <CheckInput defaultChecked={setupData?.reportTypes?.includes(repoortType.value)} onChange={(e) => handleCheck(repoortType.value, e)} label={repoortType.label} />
        </div>)
      }
    </div>

  </>
}

const SelectMeasurementType = () => {
  const measureMenntTypes = ['Metering', 'Tank Dipping']
  const setupData = useSelector(state => state.setup)
  const { flowStations } = useAssetByName(setupData?.asset)
  const dispatch = useDispatch()
  useEffect(() => {
    if (flowStations.length) {
      dispatch(setSetupData({
        name: 'flowStations',
        value: flowStations.map((flowStation, i) => ({ ...setupData?.flowStations?.[i], name: flowStation }))
      }))
    }
    // eslint-disable-next-line
  }, [flowStations])
  return <>
    <div className='flex justify-between !w-[100%]'>
      <Input type='select' placeholder={setupData?.asset} containerClass={'h-[39px] !w-[150px]'} disabled />
      <Input type='select' placeholder={setupData?.timeFrame} containerClass={'h-[39px] !w-[150px]'} disabled />
    </div>

    <div className='flex flex-col mt-[24px] rounded-[8px] gap-[14px]'>
      <div className='flex border-b justify-between p-3'>
        <Text weight={600} size={"16px"}>Flow Station</Text>
        <Text weight={600} size={"16px"}>Volume Measurement Type</Text>
        <Text weight={600} size={"16px"}>No of units</Text>
      </div>
      {
        flowStations.map((flowStation, i) => {
          const defaultValue = { label: setupData?.flowStations?.[i]?.measurementType || 'Metering', value: setupData?.flowStations?.[i]?.measurementType || 'Metering' }

          return (<div className='flex justify-between items-center p-3'>
            <Input containerClass={'h-[39px] !w-[fit-content]'} type='text' value={flowStation} disabled />
            <Input containerClass={'h-[39px] !w-[150px]'} type='select'
              defaultValue={defaultValue}
              onChange={(e) => updateFlowstation(i, 'measurementType', e.value)}
              disabled={setupData?.fluidType === 'Gas'}
              options={measureMenntTypes.map(type => ({ label: type, value: type }))} />
            <Input type='number' containerClass={'!w-[150px]'} inputClass={'!text-center'}
              defaultValue={setupData?.flowStations?.[i].numberOfUnits}
              onChange={(e) => updateFlowstation(i, "numberOfUnits", e.target.value)}
            />
          </div>)
        })
      }
    </div>
    <SelectedReportTypes />
  </>
}

const SelectFlowStation = () => {
  const setupData = useSelector(state => state.setup)
  // console.log(setupData)

  return <>
    <div className='border mt-3 !rounded-[8px]'>
      <div className='flex justify-between border-b p-3'>
        <Text weight={600} size={"16px"}>Flow stations</Text>
        <Text weight={600} size={"16px"}> Meter/Tank name</Text>
      </div>
      {
        setupData?.flowStations?.map((flowStation, i) => {
          return (
            setupData?.fluidType === 'Gas' ?
              <>
                <div className={`${setupData?.flowStations.length === i + 1 ? "" : "border-b"}`}>
                  <Text weight={600} className={'pl-3'}>{flowStation?.name} </Text>
                  {/* <hr className='px-5' /> */}
                  {
                    new Array(parseInt(flowStation?.numberOfUnits)).fill(0)
                      .map((reading, readingIndex) => (
                        <>
                          {gasTypes?.map((gasType) => (
                            <div className={`flex items-center justify-between my-1 px-3`} >
                              <Text>{gasType.label}</Text>
                              <Input containerClass={'!w-[150px]'}
                                value={flowStation?.readings?.[readingIndex]?.gasType === gasType.key ? flowStation?.readings?.[readingIndex]?.serialNumber : ""}
                                onChange={(e) => {
                                  updateFlowstationReading(i, readingIndex, 'serialNumber', e.target.value?.toUpperCase())
                                  updateFlowstationReading(i, readingIndex, 'gasType', gasType.key)
                                  updateFlowstationReading(i, readingIndex, 'gasTypeLabel', gasType.label)
                                }}
                              />
                            </div>

                          ))}
                          <hr />
                        </>
                      ))
                  }
                </div>
                <hr />
              </>
              :
              new Array(parseInt(flowStation?.numberOfUnits)).fill(0).map((reading, readingIndex) => <div className={`flex items-center ${setupData?.flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
                <Text>{flowStation?.name} (Meter {readingIndex + 1})</Text>
                <Input containerClass={'!w-[150px]'}
                  defaultValue={flowStation?.readings?.[readingIndex]?.serialNumber}
                  value={flowStation?.readings?.[readingIndex]?.serialNumber}
                  onChange={(e) => updateFlowstationReading(i, readingIndex, 'serialNumber', e.target.value?.toUpperCase())}
                />
              </div>)
          )
        })
      }
    </div>

    <SelectedReportTypes />
  </>
}


const Preview = () => {
  const setupData = useSelector(state => state.setup)
  // const { flowStations } = useAssetByName(setupData?.asset)
  return <>
    <div className='border mt-3 !rounded-[8px]'>
      <div className='flex justify-between border-b p-3'>
        <Text weight={600} className='w-1/3' size={"16px"}>Flow stations</Text>
        {<Text weight={600} className={'!text-center w-1/3'} size={"16px"}>Type</Text>}
        <Text weight={600} className='w-1/3 !text-right' size={"16px"}>Serial Number</Text>
      </div>
      {
        setupData?.flowStations?.map((flowStation, i) => {
          return (
            setupData?.fluidType === 'Gas'
              ?
              //  <div className='pl-3'>
              //   <Text weight={600}>{flowStation?.name}</Text>
              //   {
              //     gasTypes.map(gasType => (
              //       <div className={`flex items-center ${flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
              //         <Text className={'w-1/3 '}>{gasType.label}</Text>
              //         {/* <Text className={'w-1/3   !text-center'}>Metering</Text> */}
              //         <Text className='w-1/3 text-left !text-right'>{flowStation?.[gasType.key] || "N/A"}</Text>
              //       </div>
              //     ))
              //   }
              // </div>
              <div className={`${setupData?.flowStations.length === i + 1 ? "" : "border-b"}`}>
                {/* <Text weight={600} className={'pl-3'}>{flowStation?.name} (Meter {i + 1}) </Text>
                <Text weight={600} className={'pl-3'}>{flowStation?.name} (Meter {i + 1}) </Text>
                <Text weight={600} className={'pl-3'}>{flowStation?.name} (Meter {i + 1}) </Text> */}
                {/* <hr className='px-5' /> */}
                {
                  new Array(parseInt(flowStation?.numberOfUnits)).fill(0)
                    .map((reading, readingIndex) => (
                      <>
                        {/* {gasTypes?.map((gasType) => ( */}
                        <div className={`flex items-center justify-between my-1 p-3`} >

                          <Text className={'pl-3'}>{flowStation?.name} (Meter {readingIndex + 1}) </Text>
                          <Text>{flowStation?.readings?.[readingIndex]?.gasTypeLabel}</Text>
                          <Text>{flowStation?.readings?.[readingIndex]?.serialNumber}</Text>
                          {/* <Input containerClass={'!w-[150px]'}
                            value={flowStation?.readings?.[readingIndex]?.gasType === gasType.key ? flowStation?.readings?.[readingIndex]?.serialNumber : ""}
                            onChange={(e) => {
                              updateFlowstationReading(i, readingIndex, 'serialNumber', e.target.value?.toUpperCase())
                              updateFlowstationReading(i, readingIndex, 'gasType', gasType.key)
                            }}
                          /> */}
                        </div>

                        {/* ))} */}
                        <hr />
                      </>
                    ))
                }
              </div>
              :
              // <div className={`flex items-center ${flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
              //   <Text className={'w-1/3 '}>{flowStation?.name} (Meter ${}) </Text>
              //   <Text className={'w-1/3   !text-center'}>{flowStation?.measurementType}</Text>
              //   <Text className='w-1/3 text-left !text-right'>{flowStation?.numberOfUnits}</Text>
              // </div>

              new Array(parseInt(flowStation?.numberOfUnits)).fill(0).map((reading, readingIndex) => <div className={`flex items-center ${setupData?.flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
                <Text>{flowStation?.name} (Meter {readingIndex + 1})</Text>
                <Text> {flowStation?.measurementType} </Text>
                <Text>{flowStation?.readings?.[readingIndex]?.serialNumber}</Text>
              </div>)


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

  }
  const setupData = useSelector(state => state.setup)
  // console.log(setupData?.reportTypes)

  const [currReport, setCurrReport] = useState(setupData?.reportTypes?.[0])
  useEffect(() => {
    // console.log(setupData?.reportTypes?.[0])
    setCurrReport(setupData?.reportTypes?.[0])
  }, [setupData?.reportTypes, setupTable])
  const [date, setDate] = useState()
  useEffect(() => {
    dispatch(clearSetup({}))
  }, [dispatch])

  useEffect(() => {
    console.log({ currReport })
  }, [currReport])

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
                <Text className={'cursor-pointer'} onClick={() => setSetupTable(false)} color={colors.rada_blue}>View setups</Text>
                <RadaDatePicker onChange={setDate} />
                <div onClick={() => setShowSettings(true)} style={{ borderColor: 'rgba(0, 163, 255, 1)' }} className='border cursor-pointer px-3 py-1 rounded-[8px]'>
                  <MdOutlineSettings color='rgba(0, 163, 255, 1)' />
                </div>
              </div>
            </div>
            {showSettings && <VolumeSettings onClickOut={() => setShowSettings(false)} />}
        
            {
              currReport ? (currReport === 'Gas' ? <GasTable /> : <VolumeMeasurementTable currReport={currReport} date={date} />) : ""
            }

          </>
          : <Setup
            title={'Setup Volume Measurement Parameters'}
            steps={["Select Asset", "Define Report", "Measurement Type", "Select Flowstations", "Preview"]}
            type={'volumeMeasurement'}
            rightBtnLoading={loading}
            onSetWholeSetup={() => setSetupTable(true)}
            stepComponents={
              [
                <SelectAsset />,
                <DefineReport />,
                <SelectMeasurementType />,
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