import React, { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { store } from 'Store';
import tableStyles from '../table.module.scss'
import { bsw, sum } from 'utils';
import { Button } from 'Components';
import { camelize, updateFlowstationReading } from './helper';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import RadioSelect from '../RadioSelect';
import RadaDatePicker from 'Components/Input/RadaDatePicker';
import { MdOutlineSettings } from 'react-icons/md';
import Text from 'Components/Text';
import RadaSwitch from 'Components/Input/RadaSwitch';
import VolumeSettings from './VolumeSettings';
import { colors } from 'Assets';
import { useFetch } from 'hooks/useFetch';
import { setWholeSetup } from 'Store/slices/setupSlice';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { firebaseFunctions } from 'Services';
import AttachSetup from './AttachSetup';
import { Alert } from '@mui/material';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';
import Note from '../Note';
import { useGetSetups } from 'hooks/useSetups';
import { useMe } from 'hooks/useMe';
import { closeModal } from 'Store/slices/modalSlice';
// import {  permissions } from 'Assets/permissions';


const TableInput = (props) => {
  return <input className='p-1 text-center w-[70px] border outline-none' required {...props} step={'any'}
    onKeyPress={(e) => {
      const reg = e.target.value?.includes('.') ? /[0-9]/ : /^[0-9]*\.?[0-9]*$/
      if (!reg.test(e.key) && props.type === 'number') {
        e.preventDefault();
      }
    }}
  />
}

export default function VolumeMeasurementTable() {

  const { search } = useLocation()
  const { user } = useMe()

  const dispatch = useDispatch()
  const [setup, setSetup] = useState({})
  const id = useMemo(() => new URLSearchParams(search).get('id'), [search])
  const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id } })
  // const [tableKey, setTableKey] = useState

  const { data: attacmentSetup } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id: res?.attachmentId }, dontFetch: !res?.attachmentId/* */ })
  useEffect(() => { setSetup(res) }, [res])

  const [showSettings, setShowSettings] = useState(false)
  const [currReport, setCurrReport] = useState(setup?.reportTypes?.[0])
  const [searchParams, setSearchParams] = useSearchParams()
  const [captureData, setCaptureData] = useState(null)

  const date = searchParams.get('date')
  useEffect(() => {
    const currReport__ = searchParams.get('reportType')
    setCurrReport(currReport__ || setup?.reportTypes?.[0])
    dispatch(setWholeSetup(setup))
  }, [setup, dispatch, searchParams])

  //  const isGas = currReport === "Gas"
  const isNet = currReport === "Net Oil/ Condensate"
  const isGross = currReport === 'Gross Liquid'

  const { setups: IPSCs } = useGetSetups("IPSC")
  const IPSC = IPSCs?.find(IPSC => IPSC?.month === dayjs(date).format('YYYY-MM') && IPSC?.asset === setup?.asset)
  const flowstationsTargets = IPSC?.flowstationsTargets

  const [tableValues, setTableValues] = useState({})
  const [totals, setTotals] = useState({
    netProductionTotal: 0,
    netTargetTotal: 0,
    bswTotal: 0,
    grossTotal: 0,
  })

  const handleChange = ({ flowStation, field, value, readingIndex, flowStationField }) => {
    // set
    //careful, to also have the value updated before calculated

    const flowStationSetup = setup?.flowStations?.find(({ name }) => name === flowStation)
    const meterFactor = parseFloat(flowStationSetup?.readings?.[readingIndex]?.meterFactor || 1)
    const deductionMeterFactor = parseFloat(flowStationSetup?.deductionMeterFactor || 1)
    setTableValues(prev => {
      const prevFlowStation = prev?.[flowStation]
      const prevFlowStationList = prevFlowStation?.meters
      const prevFlowStationListIndexValues = prevFlowStation?.meters?.[readingIndex]
      const finalReading = field === "finalReading" ? value : parseFloat(prevFlowStationListIndexValues?.finalReading || 0)
      const initialReading = field === "initialReading" ? value : parseFloat(prevFlowStationListIndexValues?.initialReading || 0)
      const deductionFinalReading = flowStationField === "deductionFinalReading" ? value : (prevFlowStation?.deductionFinalReading || 0)
      const deductionInitialReading = flowStationField === "deductionInitialReading" ? value : (prevFlowStation?.deductionInitialReading || 0)
      const difference = (((parseFloat(finalReading) - parseFloat(initialReading))))
      const deductionDiference = (parseFloat(deductionFinalReading || 0) - parseFloat(deductionInitialReading || 0))
      const netProduction = (difference * parseFloat(meterFactor || 0))
      const deductionTotal = (deductionDiference * parseFloat(deductionMeterFactor || 0))
      const gross = (difference.toFixed(5) * parseFloat(meterFactor || 0).toFixed(5))
      const measurementType = camelize(flowStationSetup?.measurementType) || 'metering'
      const isNum = typeof readingIndex === 'number'
      let updatedMeters = prevFlowStationList
      if (field && isNum) {
        updatedMeters = isNum ? {
          ...prevFlowStationList,
          [readingIndex]: {
            ...prevFlowStationListIndexValues,
            [field]: value,
            netProduction,
            gross,
            serialNumber: flowStationSetup?.readings?.[readingIndex]?.serialNumber,
            reportType: currReport,
            meterFactor: meterFactor,

          }
        } : prevFlowStationList
      }
      let deduction = {
        initialReading: deductionInitialReading,
        finalReading: deductionFinalReading,
        meterFactor,
        netProduction: deductionDiference
      }

      const subTotal =(parseFloat(sum(Object.values(updatedMeters || {}).map(value => parseFloat(value.netProduction)))) + parseFloat(deductionTotal.toFixed(5) || 0))
      let updatedFlowStation = {
        ...prevFlowStation,
        meters: updatedMeters,
        deductionTotal,
        subTotal,
        reportType: currReport,
        measurementType
      }
      if (flowStationField) {
        updatedFlowStation = {
          ...updatedFlowStation,
          [flowStationField]: parseFloat(value),
          deduction
        }
      }
      return {
        ...prev,
        [flowStation]: updatedFlowStation,
      }
    })

  }

  useEffect(() => {
    const values = (Object.values(tableValues))
    // console.log(values, sum(values.map(value => calculatedGrossOrnNet(value?.subTotal, value?.bsw, 'gross'))))
    const netProductionTotal = isNet ? sum(Object.values(values || {}).map(item => item?.subTotal || 0)) : sum(values.map(value => calculatedGrossOrnNet(value?.subTotal, value?.bsw, 'gross')));
    const grossTotal = isGross ? sum(Object.values(values || {}).map(item => item?.subTotal || 0)) : sum(values.map(value => calculatedGrossOrnNet(value?.subTotal, value?.bsw, 'net')))
    const netTargetTotal = sum(Object.values(flowstationsTargets || {}).map(target => target?.oilRate))
    const grossTargetTotal = sum(Object.values(flowstationsTargets || {}).map(target => target?.gross))
    const calcs = {
      netProductionTotal,
      netTargetTotal,
      grossTargetTotal,
      bswTotal: bsw({ gross: grossTotal, oil: netProductionTotal }),
      grossTotal,
    }
    setTotals(calcs)
  }, [tableValues, isGross, isNet, flowstationsTargets])

  useEffect(() => {
    const getDayCapture = async () => {
      try {
        const { data } = await firebaseFunctions('getOilOrCondensateVolumeByDateAndAsset', { asset: setup?.asset, date: date }, false, { loadingScreen: true })
        setCaptureData(data)
        // console.log(JSON.stringify(tableValues), data?.flowstations)
        const dayTableValues = Object.fromEntries((data?.flowstations || [])?.map(flowstation => {
          return [flowstation?.name, {
            "meters": flowstation?.meters?.map(meter => ({
              "finalReading": meter?.finalReading || 0,
              "netProduction": meter?.netProduction || 0,
              "gross": meter?.gross || 0,
              "serialNumber": meter?.serialNumber || 0,
              "reportType": flowstation?.reportType === "netProduction" ? "Net Oil/ Condensate" : 'Gross Liquid',
              "meterFactor": meter?.meterFactor || 1,
              "deductionFinalReading": 0,
              "initialReading": meter?.initialReading || 0
            })),
            "deductionTotal": flowstation?.deduction?.netProduction || 0,
            "subTotal": flowstation?.reportType === "netProduction" ? flowstation?.subtotal?.netProduction : flowstation?.subtotal?.gross,
            "reportType": flowstation?.reportType === "netProduction" ? "Net Oil/ Condensate" : 'Gross Liquid',
            "measurementType": flowstation?.measurementType,
            "deductionInitialReading": flowstation?.deduction?.initialReading,
            "deduction": flowstation?.deduction,
            "deductionFinalReading": flowstation?.deduction?.finalReading,
            "bsw": flowstation?.subtotal?.bsw || 0
          }]
        }))
        setTableValues(dayTableValues)

      } catch (error) {
        console.log(error)
      }
    }
    if (setup?.asset) getDayCapture()
  }, [date, setup?.asset])


  useEffect(() => {
    setup?.flowStations?.forEach((flowStation, flowStationIndex) => {
      const readings = flowStation?.readings || []
      readings.forEach((reading, readingIndex) => {
        const finalReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.finalReading) || 0
        const initialReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.initialReading) || 0
        const deductionInitialReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.deductionInitialReading) || 0
        const deductionFinalReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.deductionFinalReading) || 0
        const isNum = (num) => !isNaN(num)
        if (isNum(initialReading) || isNum(finalReading)) handleChange({ flowStation: flowStation?.name, field: 'finalReading', value: finalReading, readingIndex })
        if (isNum(deductionInitialReading) || isNum(deductionFinalReading)) handleChange({ flowStation: flowStation?.name, field: 'deductionFinalReading', value: deductionFinalReading, readingIndex })
      });
    });
    // eslint-disable-next-line
  }, [setup])

  const calculatedGrossOrnNet = (subTotal, bsw, type = 'net') => {
    let netResult = (subTotal * (1 - bsw / 100)).toFixed(3) //for net (Gross* (1-bsw/100))
    let grossResult = (subTotal / (1 - bsw / 100)).toFixed(3) //for gross
    if (type === 'gross') return netResult
    if (type === 'net') return grossResult
    if (isNaN(netResult || netResult)) return 0
  }

  const addNote = async (note) => {
    dispatch(setLoadingScreen({ open: true }))
    try {
      await firebaseFunctions('addNoteToVolumeCapture', { date: captureData?.date, asset: captureData?.asset, note, type: 'liquid' })
      setCaptureData(prev => ({ ...prev, note }))
      toast.success('Note added successfully')
      dispatch(closeModal())
    } catch (error) {

    } finally {
      dispatch(setLoadingScreen({ open: false }))
    }
  }

  const averageTarget = IPSC?.averageTarget
  const save = async (e) => {
    e.preventDefault()
    const setup = store.getState().setup
    const flowStations = Object.entries(tableValues).map(value => ({
      name: value[0],
      ...value[1]
    }))
    const reportTypes = {
      "Gross Liquid": "gross", "Net Oil/ Condensate": "netProduction"
    }
    const payload = {
      date: date,
      asset: setup.asset,
      fluidType: currReport,
      totals,
      setupId: setup?.id,
      averageTarget,
      note: captureData?.note,
      flowstations: flowStations.map(flowStation => {
        const addDeduction = flowStation?.measurementType === 'tankDipping' ? {
          deduction: {
            initialReading: flowStation?.deductionInitialReading,
            finalReading: flowStation?.deductionFinalReading,
            meterFactor: flowStation?.deduction?.meterFactor,
            // gross: 500,
            netProduction: flowStation?.deductionTotal,
          }
        } : {}
        return {
          name: flowStation?.name,
          reportType: reportTypes[currReport],
          measurementType: flowStation?.measurementType,
          subtotal: {
            gross: isGross ? flowStation?.subTotal : calculatedGrossOrnNet(flowStation?.subTotal, flowStation?.bsw, 'net'),
            bsw: flowStation?.bsw,
            netProduction: isNet ? flowStation?.subTotal : calculatedGrossOrnNet(flowStation?.subTotal, flowStation?.bsw, 'gross'),
            netTarget: flowstationsTargets?.[flowStation?.name]?.oilRate,
            grossTarget: flowstationsTargets?.[flowStation?.name]?.gross,
          },
          meters: Object.values(flowStation?.meters || {})?.map(meter => ({
            serialNumber: meter?.serialNumber,
            initialReading: meter?.initialReading,
            finalReading: meter?.finalReading,
            meterFactor: meter?.meterFactor,
            gross: meter?.netProduction,
            netProduction: meter?.netProduction,
          })),
          ...addDeduction

        }
      }),
    };
    dispatch(setLoadingScreen({ open: true }))
    try {
      // console.log(payload)
      await firebaseFunctions('captureOilOrCondensate', payload)
      toast.success("Successful")
    } catch (error) {
      console.log(error)
      toast.error(error?.message)
    } finally {
      dispatch(setLoadingScreen({ open: false }))
    }
  }
  const navigate = useNavigate()
  const onSelectReportType = (e) => {
    if (e === 'Gas') {
      const proceed = window.confirm("Proceed without saving changes ?")
      if (proceed) navigate(`/users/fdc/daily/gas-table?id=${attacmentSetup?.id}&date=${date}`)
    }
    else {
      setCurrReport(e)
      setSearchParams(prev => {
        prev.set("reportType", e)
        return prev
      })
    }
  }
  useEffect(() => {
    setSearchParams(prev => {
      if (!prev.get("date")) prev.set('date', dayjs().subtract(1, 'days').format("YYYY-MM-DD"))
      return prev
    })
  }, [setSearchParams])
  const onDateChange = (value) => {
    setTableValues({})
    setSearchParams(prev => {
      prev.set('date', value)
      return prev
    })
  }

  return (
    <>
      <div className='flex justify-between my-2 px-2 items-center'>
        <div className='flex gap-4 items-center'>
          {currReport ? <RadioSelect key={currReport} onChange={onSelectReportType} defaultValue={currReport} list={setup?.reportTypes?.concat(attacmentSetup?.reportTypes)} /> : 'Loading report...'} <RadaSwitch label="Edit Table" labelPlacement="left" />
        </div>
        <div className='flex items-center gap-2 '>
          <Note title='Volume measurement Highlight' onSave={addNote} defaultValue={captureData?.note} />
          <AttachSetup setup={setup} />
          <Link to={'/users/fdc/daily?tab=volume-measurement'}>
            <Text className={'cursor-pointer'} color={colors.rada_blue}>View setups</Text>
          </Link>
          <RadaDatePicker onChange={onDateChange} value={date} max={dayjs().format('YYYY-MM-DD')} />
          <div onClick={() => setShowSettings(true)} style={{ borderColor: 'rgba(0, 163, 255, 1)' }} className='border cursor-pointer px-3 py-1 rounded-[8px]'>
            <MdOutlineSettings color='rgba(0, 163, 255, 1)' />
          </div>
        </div>
      </div>

      {showSettings && <VolumeSettings onClickOut={() => setShowSettings(false)} onComplete={setSetup} />}
      < form className='px-3 ' onSubmit={save} >
        <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`} >
          {!IPSC && <Alert severity='error' className='my-2' hidden={!IPSC}>
            No IPSC for this {setup?.asset} this month
          </Alert>}
          <Table sx={{ minWidth: 700 }} key={date}Yes >
            <TableHead >
              <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                <TableCell align="left" colSpan={3} >
                  Flow stations {date}
                </TableCell>
                <TableCell align="center" colSpan={3} >
                  Meter/Tank Readings
                </TableCell>
                <TableCell align="center">Net Production</TableCell>
                <TableCell align="center">{isNet ? 'Net' : 'Gross'} Target</TableCell>
                <TableCell align="center">BS&W</TableCell>
                <TableCell align="center">Gross</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" colSpan={3} >
                  Input Values for each flow station
                </TableCell>
                <TableCell align="center"> Meter/Tank Name</TableCell>
                <TableCell align="center">Initial (bbls)</TableCell>
                <TableCell align="center">Final (bbls)</TableCell>
                <TableCell align="center">bbls</TableCell>
                <TableCell align="center">bbls</TableCell>
                <TableCell align="center">%</TableCell>
                <TableCell align="center">bbls</TableCell>
              </TableRow>
            </TableHead>
            {
              setup?.flowStations
                ?.toSorted((a, b) => a?.name?.localeCompare(b?.name))
                ?.map(
                  ({ name, numberOfUnits, measurementType, readings, ...rest }, flowStationIndex) => {
                    return (
                      <TableBody key={name}> 
                        <TableRow key={name}>
                          <TableCell align="left" rowSpan={parseFloat(numberOfUnits) + ((!measurementType || measurementType === "Metering") ? 2 : 3)} colSpan={3}>
                            {name} ({measurementType || "Metering"}) {measurementType}
                          </TableCell>
                        </TableRow>
                        {
                          new Array(parseFloat(numberOfUnits)).fill(0).map(
                            (meter, readingIndex) => <>
                              <TableRow>
                                <TableCell align="center">

                                  <TableInput
                                    value={readings?.[readingIndex]?.serialNumber}
                                    onChange={(e) => updateFlowstationReading(flowStationIndex, readingIndex, 'serialNumber', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  <TableInput type='number' value={tableValues?.[name]?.meters?.[readingIndex]?.initialReading} onChange={(e) => handleChange({ flowStation: name, field: 'initialReading', value: e.target.value, readingIndex: readingIndex })} />
                                </TableCell>
                                <TableCell align="center">
                                  <TableInput type='number' value={tableValues?.[name]?.meters?.[readingIndex]?.finalReading} onChange={(e) => handleChange({ flowStation: name, field: 'finalReading', value: e.target.value, readingIndex: readingIndex })} />
                                </TableCell>
                                <TableCell align="center"> {isNet ? tableValues?.[name]?.meters?.[readingIndex]?.netProduction : "-"} </TableCell>
                                <TableCell align="center">-</TableCell>
                                <TableCell align="center">-</TableCell>
                                <TableCell align="center">{isGross ? tableValues?.[name]?.meters?.[readingIndex]?.gross : "-"}</TableCell>
                              </TableRow>
                            </>
                          )
                        }
                        {
                          measurementType === "Tank Dipping" && <TableRow>
                            <TableCell align="center">Export</TableCell>
                            <TableCell align="center">
                              <TableInput type='number'
                                value={tableValues?.[name]?.deductionInitialReading}
                                onChange={(e) => handleChange({ flowStation: name, flowStationField: 'deductionInitialReading', value: e.target.value, readingIndex: null })}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TableInput type='number'
                                value={tableValues?.[name]?.deductionFinalReading}
                                onChange={(e) => handleChange({ flowStation: name, flowStationField: 'deductionFinalReading', value: e.target.value, readingIndex: null })}
                              />
                            </TableCell>
                            <TableCell align="center">
                              {isNet ? tableValues?.[name]?.deductionTotal : "-"}
                            </TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">{isGross ? tableValues?.[name]?.deductionTotal : "-"}</TableCell>
                          </TableRow>}

                        <TableRow key={name}>
                          <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="left" className='pl-5 !bg-[rgba(178, 181, 182, 0.2)]' colSpan={3}><div className='pl-[30px]'> Sub total</div></TableCell>
                          <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="center">
                            {isNet ? (tableValues?.[name]?.subTotal || 0) : calculatedGrossOrnNet(tableValues?.[name]?.subTotal, tableValues?.[name]?.bsw, 'gross')}
                          </TableCell>
                          <TableCell align="center"><TableInput type='number' disabled value={isNet ? flowstationsTargets?.[name]?.oilRate : flowstationsTargets?.[name]?.gross} /></TableCell>
                          <TableCell align="center">
                            <TableInput type='number' value={tableValues?.[name]?.bsw} onChange={(e) => handleChange({ flowStation: name, flowStationField: 'bsw', value: e.target.value, readingIndex: null })} />
                          </TableCell>
                          <TableCell align="center">
                            {isGross ? (tableValues?.[name]?.subTotal || 0) : calculatedGrossOrnNet(tableValues?.[name]?.subTotal, tableValues?.[name]?.bsw, 'net')}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )
                  }
                )
            }
            <TableBody>
              <TableRow >
                <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={6}>{"Total Net Production"}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{totals?.netProductionTotal}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{isNet ? sum(Object.values(flowstationsTargets || {}).map(target => target?.oilRate)) : sum(Object.values(flowstationsTargets || {}).map(target => target?.gross))}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.bswTotal}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.grossTotal}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {user.permitted.createAndeditDailyOperation && <div className='justify-end flex my-2'>
          <Button className={'my-3'} type='submit' disabled={!IPSC} width={150}>Save</Button>
        </div>}
      </form></>
  );
}