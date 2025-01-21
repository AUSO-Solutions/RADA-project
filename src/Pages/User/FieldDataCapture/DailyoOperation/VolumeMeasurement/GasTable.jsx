import React, { useEffect, useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'
import { sum } from 'utils';
import { Button } from 'Components';
import { toast } from 'react-toastify';
import { camelize } from './helper';
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
import { store } from 'Store';
import AttachSetup from './AttachSetup';
import { Alert } from '@mui/material';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';
import { firebaseFunctions } from 'Services';
import { useGetSetups } from 'hooks/useSetups';
import { useMe } from 'hooks/useMe';
import { permissions } from 'Assets/permissions';
import { closeModal } from 'Store/slices/modalSlice';
import Highlight from '../Highlight';

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

export default function GasTable() {
  const { search } = useLocation()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [setup, setSetup] = useState({})

  const [captureData, setCaptureData] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  // const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"))
  const date = useMemo(() => searchParams.get('date'), [searchParams])
  const id = useMemo(() => new URLSearchParams(search).get('id'), [search])
  const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id } })
  const { data: attacmentSetup } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id: res?.attachmentId }, dontFetch: !res?.attachmentId/* */ })
  const { user } = useMe()

  useEffect(() => { setSetup(res) }, [res])
  useEffect(() => {
    dispatch(setWholeSetup(setup))
  }, [setup, dispatch])

  const roundUp = (num, places = 2) => {
    return Math.round(num * 10000) / 10000
  }

  const { setups: IPSCs } = useGetSetups("IPSC")

  const IPSC = useMemo(() => IPSCs?.find(IPSC => IPSC?.month === dayjs(date).format('YYYY-MM') && IPSC?.asset === setup?.asset), [IPSCs, setup?.asset, date])

  const flowstationsTargets = IPSC?.flowstationsTargets
  const averageTarget = IPSC?.averageTarget
  // console.log(flowstationsTargets)
  const totalGasTarget = useMemo(() => {
    if (flowstationsTargets) {
      const flowstationsTargetsList = Object.values(flowstationsTargets || {})
      const total = sum(flowstationsTargetsList.map(item => item?.gasRate))
      return total
    }
    return 0
  }, [flowstationsTargets])

  const [tableValues, setTableValues] = useState({})
  // const [loading, setLoading] = useState(false)
  const [totals, setTotals] = useState({
    totalGasProduced: 0,
  })
  const gasTypes = ["Gas Flared USM", "Fuel Gas", "Export Gas"].map(type => ({ label: type, value: camelize(type) }))

  const handleChange = ({ flowStation, field, value, readingIndex, flowStationField, gasType }) => {

    //careful, to also have the value updated before calculated
    const flowStationSetup = setup?.flowStations?.find(({ name }) => name === flowStation)
    const meterFactor = parseFloat(flowStationSetup?.readings?.[readingIndex]?.meterFactor || 1)

    setTableValues(prev => {
      const prevFlowStation = prev?.[flowStation]
      const prevFlowStationList = prevFlowStation?.meters
      const prevFlowStationListIndexValues = prevFlowStation?.meters?.[readingIndex]
      const finalReading = field === "finalReading" ? value : (prevFlowStationListIndexValues?.finalReading || 0)
      const initialReading = field === "initialReading" ? value : (prevFlowStationListIndexValues?.initialReading || 0)
      const difference = roundUp(Math.abs(parseFloat(finalReading) - parseFloat(initialReading)))
      let meterTotal = prevFlowStationListIndexValues?.meterTotal
      if (field === "meterTotal") { meterTotal = parseFloat(value) } else { meterTotal = (difference * parseFloat(meterFactor || 0)) }

      const isNum = typeof readingIndex === 'number'
      let updatedMeters = prevFlowStationList
      if (field && isNum) {
        updatedMeters = isNum ? {
          ...prevFlowStationList,
          [readingIndex]: {
            ...prevFlowStationListIndexValues,
            [field]: parseFloat(value || 0),
            meterTotal,
            gasType,
            // difference,
            serialNumber: flowStationSetup?.readings?.[readingIndex]?.serialNumber
          }
        } : prevFlowStationList
      }
      let updatedFlowStation = {
        ...prevFlowStation,
        meters: updatedMeters,
        totalGas: sum(Object.values(updatedMeters || {}).map(value => value.meterTotal)),
      }
      if (flowStationField) {
        updatedFlowStation = {
          ...updatedFlowStation,
          [flowStationField]: isNaN(parseFloat(value)) ? value : parseFloat(value),
        }
      }
      return {
        ...prev,
        [flowStation]: updatedFlowStation,
      }
    })

  }
  const addHighlight = async (highlightData) => {
    Object.entries(highlightData).map(entry => {
      const flowStation = entry[0]
      const value = entry[1]
      handleChange({ flowStation, 'flowStationField': `highlight`, value, readingIndex: null })
      return null
    })
    // save()
    dispatch(closeModal())
  };
  useEffect(() => {
    const values = (Object.values(tableValues))
    const calcs = {
      totalGasProduced: sum(Object.values(values || {}).map(item => item?.totalGas || 0)),
    }
    setTotals(calcs)
  }, [tableValues])

  useEffect(() => {
    const getDayCapture = async () => {
      try {
        const { data } = await firebaseFunctions('getGasVolumeByDateAndAsset', { asset: setup?.asset, date: date }, false, { loadingScreen: true })
        // console.log(data)
        setCaptureData(data)
        const dayTableValues = Object.fromEntries((data?.flowstations || [])?.map(flowstation => {
          return [flowstation?.name, {
            "meters": Object.fromEntries(Object.entries(flowstation?.meters || {}).map(meter => (
              [
                meter[0],
                {
                  "finalReading": meter[1]?.finalReading || null,
                  "meterTotal": meter[1]?.meterTotal,
                  "gasType": meter[1]?.gasType,
                  "serialNumber": meter[1]?.serialNumber || null,
                  "initialReading": meter[1]?.initialReading || null
                }
              ]
            ))),
            "totalGas": flowstation?.subtotal?.totalGas,
            "highlight":flowstation?.highlight
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
  useEffect(() => {
    setup?.flowStations?.forEach((flowStation, flowStationIndex) => {
      const readings = flowStation?.readings || []
      readings.forEach((reading, readingIndex) => {
        const finalReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.finalReading) || 0
        const initialReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.initialReading) || 0
        const isNum = (num) => !isNaN(num)
        if (isNum(initialReading) || isNum(finalReading)) handleChange({ flowStation: flowStation?.name, field: 'finalReading', value: finalReading, readingIndex })
      });

    });
    // eslint-disable-next-line
  }, [setup])


  const save = async (e) => {

    e.preventDefault()
    const setup = store.getState().setup
    const flowStations = Object.entries(tableValues).map(value => {

      console.log(value)
      return {
        name: value[0],
        subtotal: {
          gasFlaredUSMTarget: flowstationsTargets?.[value[0]]?.gasFlaredUSM,
          exportGasTarget: flowstationsTargets?.[value[0]]?.exportGas,
          fuelGasTarget: flowstationsTargets?.[value[0]]?.fuelGas,
          fuelGas: Object.values(value[1]?.meters || {})?.find(meter => meter?.gasType === 'fuelGas')?.meterTotal,
          exportGas: Object.values(value[1]?.meters || {})?.find(meter => meter?.gasType === 'exportGas')?.meterTotal,
          gasFlaredUSM: Object.values(value[1]?.meters || {})?.find(meter => meter?.gasType === 'gasFlaredUSM')?.meterTotal,
          totalGasTarget: flowstationsTargets?.[value[0]]?.gasFlaredUSM + flowstationsTargets?.[value[0]]?.exportGas + flowstationsTargets?.[value[0]]?.fuelGas,
          totalGas: value[1]?.totalGas
        },
        ...value[1]
      }
    })
    // console.log(flowStations)
    const payload = {
      date: date,
      asset: setup.asset,
      note: captureData?.note,
      fluidType: 'gas',
      totalGasProduced: totals.totalGasProduced,
      setupId: setup?.id,
      flowstations: flowStations,
      averageTarget
    };
    try {
      dispatch(setLoadingScreen({ open: true }))
      console.log(payload)
      await firebaseFunctions('captureGas', payload)
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
    if (e !== 'Gas') {
      const proceed = window.confirm("Proceed without saving changes ?")
      if (proceed) navigate(`/users/fdc/daily/volume-measurement-table?id=${attacmentSetup?.id}&reportType=${e}&date=${date}`)
    }
  }
  const reportTypes__ = useMemo(() => {
    return (attacmentSetup?.reportTypes || [])?.concat(setup?.reportTypes)
  }, [attacmentSetup?.reportTypes, setup?.reportTypes])
  return (

    <> <div className='flex justify-between my-2 px-2 items-center'>
      <div className='flex gap-4 items-center'>
        {reportTypes__?.length && <RadioSelect defaultValue={setup?.reportTypes?.[0]} list={reportTypes__} onChange={onSelectReportType} />} <RadaSwitch label="Edit Table" labelPlacement="left" />
      </div>
      <div className='flex items-center gap-2 '>

        {/* <Note title='Volume measurement Highlight' onSave={addNote} defaultValue={captureData?.note} /> */}

        <Highlight
          title="Volume measurement Highlight"
          onSave={addHighlight}
          captureData={tableValues}
        />
        <AttachSetup setup={setup} />
        <Link to={'/users/fdc/daily?tab=volume-measurement'}>   <Text className={'cursor-pointer'} color={colors.rada_blue}>View setups</Text></Link>
        <RadaDatePicker onChange={onDateChange} value={date} max={dayjs().format('YYYY-MM-DD')} />
        <div onClick={() => setShowSettings(true)} style={{ borderColor: 'rgba(0, 163, 255, 1)' }} className='border cursor-pointer px-3 py-1 rounded-[8px]'>
          <MdOutlineSettings color='rgba(0, 163, 255, 1)' />
        </div>
      </div>
    </div>
      {showSettings && <VolumeSettings onClickOut={() => setShowSettings(false)} onComplete={setSetup} />}

      < form className='px-3 ' onSubmit={save} >
        <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
          {!IPSC && <Alert severity='error' className='my-2' hidden={!IPSC}>
            No IPSC for this {setup?.asset} this month
          </Alert>}
          <Table sx={{ minWidth: 700 }} key={date}>
            <TableHead >
              <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                <TableCell align="left" colSpan={3} >
                  Flow stations
                </TableCell>
                <TableCell align="center" colSpan={5} >
                  Gas Readings
                </TableCell>
                <TableCell align="center" colSpan={3}>Total</TableCell>
              </TableRow>
              <TableRow>

                <TableCell align="left" colSpan={3} >
                  Input Values for each flow station
                </TableCell>
                <TableCell align="center"> Property</TableCell>
                <TableCell align="center"> Meter Name</TableCell>
                <TableCell align="center">Initial (mmscf)</TableCell>
                <TableCell align="center">Final (mmscf)</TableCell>
                <TableCell align="center">Gas Target</TableCell>
                <TableCell align="center" colSpan={3}>mmscf</TableCell>
              </TableRow>
            </TableHead>
            {
              setup?.flowStations
                ?.toSorted((a, b) => a?.name?.localeCompare(b?.name))
                ?.map(
                  ({ name, numberOfUnits, measurementType, readings, ...rest }, flowStationIndex) => {
                    return (
                      <TableBody>
                        <TableRow key={name}>
                          <TableCell align="left" rowSpan={4 * numberOfUnits + 2} colSpan={3}>
                            {name}
                          </TableCell>
                        </TableRow>
                        <>
                          {gasTypes.map((gasType, i) => {
                            const readingAtIndex = readings?.find(reading => reading?.gasType === gasType.value)
                            let readingIndex = readings?.findIndex(reading => reading?.gasType === gasType.value)
                            if (readingIndex === -1) readingIndex = i + readings?.length
                            if (!readings) readingIndex = i

                            const initialReading = tableValues?.[name]?.meters?.[readingIndex]?.initialReading
                            const finalReading = tableValues?.[name]?.meters?.[readingIndex]?.finalReading
                            const meterTotal = tableValues?.[name]?.meters?.[readingIndex]?.meterTotal
                            // console.log(tableValues?.[name]?.meters?.[readingIndex])
                            return (<TableRow  >
                              <TableCell align="center">
                                {gasType.label}
                              </TableCell>
                              <TableCell align="center">
                                {readingAtIndex?.serialNumber}
                              </TableCell>

                              <TableCell align="center">

                                <TableInput value={readingAtIndex ? (initialReading || 0) : "-"}
                                  disabled={!readingAtIndex} type={'number'}
                                  onChange={(e) => handleChange({ flowStation: name, field: 'initialReading', value: e.target.value, readingIndex, gasType: gasType.value })} />
                              </TableCell>
                              <TableCell align="center">
                                <TableInput value={readingAtIndex ? finalReading : "-"}
                                  disabled={!readingAtIndex} type={'number'}
                                  onChange={(e) => handleChange({ flowStation: name, field: 'finalReading', value: e.target.value, readingIndex, gasType: gasType.value })} />
                              </TableCell>
                              <TableCell align="center">
                                <TableInput value={roundUp(flowstationsTargets?.[name]?.[gasType.value])}
                                  disabled type={'number'}
                                />
                              </TableCell>
                              <TableCell align="center" colSpan={3}>
                                {readingAtIndex ? meterTotal || 0 :
                                  <TableInput
                                    disabled={readingAtIndex} type={'number'} value={meterTotal || 0}
                                    onChange={(e) => handleChange({ flowStation: name, field: `meterTotal`, value: e.target.value, readingIndex, gasType: gasType.value })} />}
                              </TableCell>

                            </TableRow>)
                          }
                          )}
                          <TableRow key={name}>
                            <TableCell sx={{ bgcolor: '#8080807a' }} align="left" className='pl-5 !bg-[#8080807a]' colSpan={5}><div > Total Gas Produced</div></TableCell>
                            <TableCell sx={{ bgcolor: '#8080807a' }} align="center" colSpan={3}>{(roundUp(tableValues?.[name]?.totalGas || 0))}

                            </TableCell>
                          </TableRow>
                        </>
                      </TableBody>
                    )
                  }
                )
            }
            <TableBody>
              <TableRow >
                <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={7}>{"Total Gas Production"}</TableCell>
                {/* <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={1}> {roundUp(averageTarget?.gasRate)}</TableCell> */}
                <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={1}> {roundUp(totalGasTarget)}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{roundUp(totals?.totalGasProduced)}</TableCell>
                {/* <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{totals?.totalGasProduced}</TableCell> */}
              </TableRow>
            </TableBody>

          </Table>
        </TableContainer>
        {user.permissions.includes(permissions.createAndeditDailyOperation) && <div className='justify-end flex my-2'>
          <Button className={'my-3'} disabled={!IPSC} type='submit' width={150}>Save</Button>
        </div>}
      </form></>
  );
}