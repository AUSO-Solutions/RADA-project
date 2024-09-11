import React, { useEffect, useMemo, useState } from 'react'
import Setup from '../setup'
import { Input } from 'Components'
import { useAssetNames } from 'hooks/useAssetNames'
import { useDispatch, useSelector } from 'react-redux'
import { clearSetup, setSetupData, setWholeSetup } from 'Store/slices/setupSlice'
import CheckInput from 'Components/Input/CheckInput'
import Text from 'Components/Text'
import { useAssetByName } from 'hooks/useAssetByName'
import { store } from 'Store'
import { firebaseFunctions } from 'Services'

import { closeModal } from 'Store/slices/modalSlice'
import RadioSelect from '../RadioSelect'

import { toast } from 'react-toastify'
import { images } from 'Assets'

import { camelize, updateFlowstation, updateFlowstationReading } from './helper'

// import RadaTable from 'Components/RadaTable'
// import { BsChevronRight } from 'react-icons/bs'
// import dayjs from 'dayjs'
import { useFetch } from 'hooks/useFetch'
import { Link, useNavigate } from 'react-router-dom'



const gasTypes = ["Gas Flared USM", "Fuel Gas", "Export Gas"].map(type => ({ label: type, value: camelize(type) }))


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
      label={'Assets'} type='select' required
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
      <Input type='select' placeholder="Daily" containerClass={'h-[39px] !w-[150px]'} required
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
          <CheckInput required={!setupData?.reportTypes?.length} defaultChecked={setupData?.reportTypes?.includes(repoortType.value)} onChange={(e) => handleCheck(repoortType.value, e)} label={repoortType.label} />
        </div>)
      }
    </div>

  </>
}

const SelectMeasurementType = () => {
  const measureMenntTypes = ['Metering', 'Tank Dipping']
  const setupData = useSelector(state => state.setup)
  const { flowStations } = useAssetByName(setupData?.asset)
  console.log(flowStations, setupData?.asset)
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
            <Input type='number' containerClass={'!w-[150px]'} inputClass={'!text-center'} required
              defaultValue={setupData?.flowStations?.[i]?.numberOfUnits} min={1} max={setupData?.fluidType === 'Gas' ? 3 : 10}
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
  console.log(setupData)

  return <>
    <div className='border mt-3 !rounded-[8px]'>
      <div className='flex justify-between border-b p-3'>
        <Text weight={600} size={"16px"}>Flow stations</Text>
        <Text weight={600} size={"16px"}> Meter/Tank name</Text>
        {setupData?.fluidType === 'Gas' && <Text weight={600} size={"16px"}> Gas Type</Text>}
      </div>
      {
        setupData?.flowStations?.map((flowStation, i) => {
          return (
            setupData?.fluidType === 'Gas' ?
              <>
                {
                  new Array(parseInt(flowStation?.numberOfUnits)).fill(0).map((reading, readingIndex) => <div className={`flex items-center ${setupData?.flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
                    <Text>{flowStation?.name}  (Meter {readingIndex + 1})</Text>
                    <Input containerClass={'!w-[150px]'}
                      defaultValue={flowStation?.readings?.[readingIndex]?.serialNumber}
                      value={flowStation?.readings?.[readingIndex]?.serialNumber} required
                      onChange={(e) => updateFlowstationReading(i, readingIndex, 'serialNumber', e.target.value?.toUpperCase())}
                    />
                    <Input containerClass={'!w-[150px]'}
                      type='select' required
                      options={gasTypes.filter(gasType => !flowStation?.readings?.map(reading => reading?.gasType).includes(gasType.value))}
                      defaultValue={gasTypes.find(gasType => flowStation?.readings?.[readingIndex]?.gasType === gasType.value)} isClearable
                      value={gasTypes.find(gasType => flowStation?.readings?.[readingIndex]?.gasType === gasType.value)}
                      onChange={(e) => updateFlowstationReading(i, readingIndex, 'gasType', e?.value)}
                    />
                  </div>)
                }
              </>
              :
              new Array(parseInt(flowStation?.numberOfUnits)).fill(0).map((reading, readingIndex) => <div className={`flex items-center ${setupData?.flowStations.length === i + 1 ? "" : "border-b"} justify-between p-3`}>
                <Text>{flowStation?.name} ({!flowStation?.measurementType || flowStation?.measurementType === 'Metering' ? "Meter" : "Tank"} {readingIndex + 1})</Text>
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
    <div className='border mt-3 !rounded-[8px] w-full'>
      <div className='flex justify-between border-b p-3'>
        <Text weight={600} className='w-[33%]' size={"16px"}>Flow stations</Text>
        {<Text weight={600} className={'!text-center w-[33%]'} size={"16px"}>Type</Text>}
        <Text weight={600} className='w-[33%] !text-right' size={"16px"}>Serial Number</Text>
      </div>
      {
        setupData?.flowStations?.map((flowStation, i) => {
          return (
            setupData?.fluidType === 'Gas'
              ?
              <div className={` ${setupData?.flowStations.length === i + 1 ? "" : "border-b border-black"}`}>

                {
                  new Array(parseInt(flowStation?.numberOfUnits)).fill(0)
                    .map((reading, readingIndex) => (
                      <>
                        {/* {gasTypes?.map((gasType) => ( */}
                        <div className={`flex w-[100%] items-center justify-between my-1 p-3`} >

                          <Text className={'pl-3 w-[33%] '}>{flowStation?.name} (Meter {readingIndex + 1}) </Text>
                          <Text display={'block'} className={'w-[33%] !text-center'}>{flowStation?.readings?.[readingIndex]?.gasType}</Text>
                          <Text display={'block'} className={'w-[33%] !text-right'}>{flowStation?.readings?.[readingIndex]?.serialNumber}</Text>

                        </div>

                        {/* ))} */}
                        <hr />
                      </>
                    ))
                }
              </div>
              :

              new Array(parseInt(flowStation?.numberOfUnits)).fill(0).map((reading, readingIndex) => <div className={`flex items-center ${setupData?.flowStations.length === i + 1 ? "" : "border-b"} justify-between !w-[100%] p-3`}>
                <Text className={'!w-[33%] '} display={'block'}>{flowStation?.name} ({!flowStation?.measurementType || flowStation?.measurementType === 'Metering' ? "Meter" : "Tank"} {readingIndex + 1})</Text>
                <Text className={'!w-[33%]   !text-center'} display={'block'}> {!flowStation?.measurementType || flowStation?.measurementType === 'Metering' ? "Metering" : flowStation?.measurementType} </Text>
                <Text className={'!w-[33%]   !text-right'} display={'block'}>{flowStation?.readings?.[readingIndex]?.serialNumber}</Text>
              </div>)
          )
        })
      }
    </div>
  </>
}

const SaveAs = () => {
  const setupData = useSelector(state => state.setup)
  const dispatch = useDispatch()
  return (
    <div className="h-[300px] flex flex-col  w-[400px] mx-auto gap-1 justify-center">
      <Text weight={600} size={24}>Save Setup as</Text>
      <Input label={''} defaultValue={setupData?.title} onChange={(e) => dispatch(setSetupData({ name: 'title', value: e.target.value }))} />
    </div>
  )
}

const Existing = ({ onSelect = () => null }) => {
  const { data } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: "volumeMeasurement" } })
  const [menuViewed, setMenuViewed] = useState(null)
  const viewMenu = (i) => {
    setMenuViewed(prev => {
      if (prev === i) return null
      return i
    })
  }
  return (
    <div className=" flex flex-wrap gap-4 m-5 ">
      {data?.map((datum, i) => <div onClick={() => viewMenu(i)} className="w-[250px] relative shadow rounded-[8px] px-3 flex items-center gap-3">
        <img src={images.file} alt="" width={100} />   <Text size={18}> {datum?.title || 'No name'}</Text>
        {
          menuViewed === i && <div className="absolute w-[100px] flex flex-col gap-2 px-2 right-[-50px] border rounded shadow bottom-[-30px] bg-[white]">
            <Link to={`/users/fdc/daily/${datum?.reportTypes?.[0] === 'Gas' ? 'gas-table' : 'volume-measurement-table'}?id=${datum?.id}`}  >View</Link>
            <div>Delete</div>
          </div>
        }
      </div>)}
    </div>
  )
}


const VolumeMeasurement = () => {

  const [setupTable, setSetupTable] = useState(false)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  // const [showSettings, setShowSettings] = useState(false)
  const navigate = useNavigate()
  const save = async () => {
    try {
      setLoading(true)
      const setupData = store.getState().setup
      // console.log(setupData)
      const { data } = await firebaseFunctions('createSetup', { ...setupData, setupType: 'volumeMeasurement' })
      console.log({ data }, '----')

      dispatch(setWholeSetup(data))
      dispatch(closeModal())
      if (setupData?.reportTypes?.[0] === 'Gas') navigate(`/users/fdc/daily/gas-table?id=${data?.id}`)
      else { navigate(`/users/fdc/daily/volume-measurement-table?id=${data?.id}`) }
      // setSetupTable(true)
    } catch (error) {
      toast.error(error?.message)
    }
    finally {
      setLoading(false)
    }

  }
  // const setupData = useSelector(state => state.setup)
  // console.log(setupData?.reportTypes)

  // const [, setCurrReport] = useState(setupData?.reportTypes?.[0])
  // useEffect(() => {
  //   // console.log(setupData?.reportTypes?.[0])
  //   // setCurrReport(setupData?.reportTypes?.[0])
  // }, [setupData?.reportTypes, setupTable])
  // const [date, setDate] = useState()
  useEffect(() => {
    dispatch(clearSetup({}))
  }, [dispatch])



  return (
    < >
      {
        setupTable ?
          <>
            {/* <div className='flex justify-between my-2 px-2 items-center'>
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
            {showSettings && <VolumeSettings onClickOut={() => setShowSettings(false)} />} */}

            {/* {
              currReport ? (currReport === 'Gas' ? <GasTable /> : <VolumeMeasurementTable currReport={currReport} date={date} />) : ""
            } */}

          </>
          : <Setup
            title={'Setup Volume Measurement Parameters'}
            steps={["Select Asset", "Define Report", "Measurement Type", "Select Flowstations", "Preview", "SaveAs"]}
            // type={'volumeMeasurement'}
            existing={<Existing onSelect={() => setSetupTable(true)} />}
            rightBtnLoading={loading}
            // onSetWholeSetup={}
            stepComponents={
              [
                <SelectAsset />,
                <DefineReport />,
                <SelectMeasurementType />,
                <SelectFlowStation />,
                <Preview />, <SaveAs />
              ]
            }
            onSave={save}
          />
      }
    </>
  )
}

export default VolumeMeasurement