import React, { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { store } from 'Store';
import tableStyles from '../table.module.scss'
import { sum } from 'utils';
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


const TableInput = (props) => {
  return <input className='p-1 text-center w-[70px] border outline-none' required {...props}
  // onKeyPress={(e) => {
  //   if (!/[0-9]/.test(e.key) && props.type === 'number') {
  //     e.preventDefault();
  //   }
  // }}
  />
}

export default function VolumeMeasurementTable() {

  const { search } = useLocation()
  const dispatch = useDispatch()
  const [setup, setSetup] = useState({})
  const id = useMemo(() => new URLSearchParams(search).get('id'), [search])
  const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id } })

  const { data: attacmentSetup } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id: res?.attachmentId }, dontFetch: !res?.attachmentId/* */ })
  useEffect(() => { setSetup(res) }, [res])

  const [showSettings, setShowSettings] = useState(false)
  const [currReport, setCurrReport] = useState(setup?.reportTypes?.[0])
  const [searchParams, setSearchParams] = useSearchParams()


  const [, setDate] = useState(dayjs().format(""))

  useEffect(() => {
    const currReport__ = searchParams.get('reportType')
    setCurrReport(currReport__ || setup?.reportTypes?.[0])
    dispatch(setWholeSetup(setup))
  }, [setup, dispatch, searchParams])

  //  const isGas = currReport === "Gas"
  const isNet = currReport === "Net Oil/ Condensate"
  const isGross = currReport === 'Gross Liquid'

  const [tableValues, setTableValues] = useState({})
  const [totals, setTotals] = useState({
    netProductionTotal: 0,
    netTargetTotal: 0,
    bswTotal: 0,
    grossTotal: 0,
  })


  const handleChange = ({ flowStation, field, value, readingIndex, flowStationField }) => {
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
      const difference = ((Math.abs(parseFloat(finalReading) - parseFloat(initialReading))))
      const deductionDiference = ((Math.abs(parseFloat(deductionFinalReading || 0) - parseFloat(deductionInitialReading || 0))))
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

      const subTotal = parseFloat(sum(Object.values(updatedMeters || {}).map(value => parseFloat(value.netProduction)))) + parseFloat(deductionTotal.toFixed(5) || 0)
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
    const calcs = {
      netProductionTotal: sum(Object.values(values || {}).map(item => item?.subTotal || 0)),
      netTargetTotal: sum(Object.values(values || {}).map(item => item?.netTarget || 0)),
      bswTotal: sum(Object.values(values || {}).map(item => item?.bsw || 0)),
      grossTotal: sum(Object.values(values || {}).map(item => item?.subTotal || 0)),
    }
    setTotals(calcs)
  }, [tableValues])

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
    let netResult = subTotal / ((1 - (0.01 * bsw))).toFixed(3) //for net
    let grossResult = subTotal * ((1 - (0.01 * bsw))).toFixed(3) //for gross
    if (type === 'net') return netResult
    if (type === 'gross') return grossResult
    if (isNaN(netResult || netResult)) return 0
  }

  const { data: IPSCs } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: 'IPSC' } })
  // console.log(IPSCs)
  const IPSC = IPSCs?.find(IPSC => IPSC?.month === dayjs().format('YYYY-MM') && IPSC?.asset === setup?.asset)
  const flowstationsTargets = IPSC?.flowstationsTargets
  const averageTarget = IPSC?.averageTarget
  const save = async (e) => {
    // if(!flowstationsTargets?.oilRate || flowstationsTargets?.gross)

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
      date: dayjs().toISOString(),
      asset: setup.asset,
      fluidType: currReport,
      totals,
      setupId: setup?.id,
      averageTarget,
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
      console.log(payload)
      await firebaseFunctions('captureOilOrCondensate', payload)
      toast.success("Successful")
    } catch (error) {
      console.log(error)
      toast.error(error?.message)
    }finally{
      dispatch(setLoadingScreen({ open: false }))
    }
  }
  const navigate = useNavigate()
  const onSelectReportType = (e) => {
    if (e === 'Gas') navigate(`/users/fdc/daily/gas-table?id=${attacmentSetup?.id}`)
    else {
      setCurrReport(e)
      setSearchParams(prev => {
        prev.set("reportType", e)
        return prev
      })
    }
  }
  return (
    <>
      <div className='flex justify-between my-2 px-2 items-center'>
        <div className='flex gap-4 items-center'>
          {currReport ? <RadioSelect key={currReport} onChange={onSelectReportType} defaultValue={currReport} list={setup?.reportTypes?.concat(attacmentSetup?.reportTypes)} /> : 'Loading report...'} <RadaSwitch label="Edit Table" labelPlacement="left" />
        </div>
        <div className='flex items-center gap-2 '>
          <AttachSetup setup={setup} />
          <Link to={'/users/fdc/daily?tab=volume-measurement'}>
            <Text className={'cursor-pointer'} color={colors.rada_blue}>View setups</Text>
          </Link>
          <RadaDatePicker onChange={setDate} disabled />
          <div onClick={() => setShowSettings(true)} style={{ borderColor: 'rgba(0, 163, 255, 1)' }} className='border cursor-pointer px-3 py-1 rounded-[8px]'>
            <MdOutlineSettings color='rgba(0, 163, 255, 1)' />
          </div>
        </div>
      </div>

      {showSettings && <VolumeSettings onClickOut={() => setShowSettings(false)} onComplete={setSetup} />}
      < form className='px-3 ' onSubmit={save} >
        <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
          {!IPSC && <Alert severity='info' className='my-2' hidden={!IPSC}>
            No IPSC for this {setup?.asset} this month
          </Alert>}
          <Table sx={{ minWidth: 700 }} >
            <TableHead >
              <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                <TableCell align="left" colSpan={3} >
                  Flow stations
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
              setup?.flowStations?.map(
                ({ name, numberOfUnits, measurementType, readings, ...rest }, flowStationIndex) => {
                  return (
                    <TableBody>
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
                              <TableCell align="center"><TableInput type='number' onChange={(e) => handleChange({ flowStation: name, field: 'initialReading', value: e.target.value, readingIndex: readingIndex })} /></TableCell>
                              <TableCell align="center"><TableInput type='number' onChange={(e) => handleChange({ flowStation: name, field: 'finalReading', value: e.target.value, readingIndex: readingIndex })} /></TableCell>
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
                          <TableCell align="center">Deduction</TableCell>
                          <TableCell align="center">
                            <TableInput type='number'
                              onChange={(e) => handleChange({ flowStation: name, flowStationField: 'deductionInitialReading', value: e.target.value, readingIndex: null })}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <TableInput type='number'
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
                        <TableCell align="center"><TableInput type='number' onChange={(e) => handleChange({ flowStation: name, flowStationField: 'bsw', value: e.target.value, readingIndex: null })} /></TableCell>
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
                <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{isNet ? totals?.netProductionTotal : calculatedGrossOrnNet(totals?.netProductionTotal, totals?.bswTotal, 'gross')}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{isNet ? averageTarget?.oilRate : averageTarget?.gross}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.bswTotal}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{isGross ? totals?.grossTotal : calculatedGrossOrnNet(totals?.grossTotal, totals?.bswTotal, 'net')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div className='justify-end flex my-2'>
          <Button className={'my-3'} type='submit' disabled={!IPSC} width={150}>Save</Button>
        </div>
      </form></>
  );
}