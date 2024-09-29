import * as React from 'react';
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { store } from 'Store';
import AttachSetup from './AttachSetup';


const TableInput = ({ type = '', ...props }) => {
  return <input className='p-1 text-center w-[70px] border outline-none' step="any" type={type} {...props} />
}

export default function GasTable() {
  const { search } = useLocation()
  const dispatch = useDispatch()
  const [setup, setSetup] = React.useState({})
  const [showSettings, setShowSettings] = React.useState(false)
  const [date, setDate] = React.useState(dayjs().format("DD/MM/YYYY"))
  const id = React.useMemo(() => new URLSearchParams(search).get('id'), [search])
  const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id } })
  const { data: attacmentSetup } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'volumeMeasurement', id: res?.attachmentId }, dontFetch: !res?.attachmentId/* */ })

  React.useEffect(() => { setSetup(res) }, [res])
  React.useEffect(() => {
    dispatch(setWholeSetup(setup))
  }, [setup, dispatch])

  const roundUp = (num, places = 2) => {
    return Math.round(num * 10000) / 10000
  }

  const { data: IPSCs } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: 'IPSC' } })
  console.log(IPSCs)
  const IPSC = IPSCs?.find(IPSC => IPSC?.month === dayjs().format('YYYY-MM'))
  const targets =  IPSC?.totals

  const [tableValues, setTableValues] = React.useState({})
  const [totals, setTotals] = React.useState({
    netProductionTotal: 0,
    netTargetTotal: 0,
    bswTotal: 0,
    grossTotal: 0,
  })
  const gasTypes = ["Gas Flared USM", "Fuel Gas", "Export Gas"].map(type => ({ label: type, value: camelize(type) }))

  const handleChange = ({ flowStation, field, value, readingIndex, flowStationField, gasType }) => {

    //careful, to also have the value updated before calculated
    const flowStationSetup = setup?.flowStations?.find(({ name }) => name === flowStation)
    const meterFactor = parseFloat(flowStationSetup?.readings?.[readingIndex]?.meterFactor || 1).toFixed(5)

    setTableValues(prev => {
      const prevFlowStation = prev?.[flowStation]
      const prevFlowStationList = prevFlowStation?.meters
      const prevFlowStationListIndexValues = prevFlowStation?.meters?.[readingIndex]
      const finalReading = field === "finalReading" ? value : (prevFlowStationListIndexValues?.finalReading || 0)
      const initialReading = field === "initialReading" ? value : (prevFlowStationListIndexValues?.initialReading || 0)
      const difference = roundUp(Math.abs(parseFloat(finalReading) - parseFloat(initialReading)))
      let meterTotal = prevFlowStationListIndexValues?.meterTotal
      if (field === "meterTotal") { meterTotal = parseFloat(value) } else { meterTotal = (difference * parseFloat(meterFactor || 0).toFixed(5)) }

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
        subTotal: sum(Object.values(updatedMeters || {}).map(value => value.meterTotal)).toFixed(5),
      }
      if (flowStationField) {
        updatedFlowStation = {
          ...updatedFlowStation,
          [flowStationField]: parseFloat(value),
        }
      }
      return {
        ...prev,
        [flowStation]: updatedFlowStation,
      }
    })

  }
  React.useEffect(() => {
    const values = (Object.values(tableValues))
    const calcs = {
      netProductionTotal: sum(Object.values(values || {}).map(item => item?.subTotal || 0))?.toFixed(5),
    }
    setTotals(calcs)
  }, [tableValues])

  React.useEffect(() => {
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
    const flowStations = Object.entries(tableValues).map(value => ({
      name: value[0],
      ...value[1]
    }))
    // console.log(flowStations)
    const payload = {
      date: dayjs(date).format("DD/MM/YYYY"),
      asset: setup.asset,
      fluidType: 'gas',
      totals,
      setupId: setup?.id,
      flowstations: flowStations,
      targets
    };
    try {
console.log(payload)
      // await firebaseFunctions('captureGas', payload)
      toast.success("Successful")
    } catch (error) {
      console.log(error)
      toast.error(error?.message)
    }

  }
  const navigate = useNavigate()
  const onSelectReportType = (e) => {
    if (e !== 'Gas') navigate(`/users/fdc/daily/volume-measurement-table?id=${attacmentSetup?.id}&reportType=${e}`)
  }
  const reportTypes__ = React.useMemo(() => {
    return (attacmentSetup?.reportTypes || [])?.concat(setup?.reportTypes)
  }, [attacmentSetup?.reportTypes, setup?.reportTypes])
  return (

    <> <div className='flex justify-between my-2 px-2 items-center'>
      <div className='flex gap-4 items-center'>
        {reportTypes__?.length && <RadioSelect defaultValue={setup?.reportTypes?.[0]} list={reportTypes__} onChange={onSelectReportType} />} <RadaSwitch label="Edit Table" labelPlacement="left" />
      </div>
      <div className='flex items-center gap-2 '>
        <AttachSetup setup={setup} />
        <Link to={'/users/fdc/daily?tab=volume-measurement'}>   <Text className={'cursor-pointer'} color={colors.rada_blue}>View setups</Text></Link>
        <RadaDatePicker onChange={setDate} disabled />
        <div onClick={() => setShowSettings(true)} style={{ borderColor: 'rgba(0, 163, 255, 1)' }} className='border cursor-pointer px-3 py-1 rounded-[8px]'>
          <MdOutlineSettings color='rgba(0, 163, 255, 1)' />
        </div>
      </div>
    </div>
      {showSettings && <VolumeSettings onClickOut={() => setShowSettings(false)} onComplete={setSetup} />}

      < form className='px-3 ' onSubmit={save} >
        <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
          <Table sx={{ minWidth: 700 }} >
            <TableHead >
              <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                <TableCell align="left" colSpan={3} >
                  Flow stations
                </TableCell>
                <TableCell align="center" colSpan={4} >
                  Gas Readings
                </TableCell>
                <TableCell align="center" colSpan={4}>Total</TableCell>
              </TableRow>
              <TableRow>

                <TableCell align="left" colSpan={3} >
                  Input Values for each flow station
                </TableCell>
                <TableCell align="center"> Property</TableCell>
                <TableCell align="center"> Meter Name</TableCell>
                <TableCell align="center">Initial (mmscf)</TableCell>
                <TableCell align="center">Final (mmscf)</TableCell>
                <TableCell align="center" colSpan={2}>mmscf</TableCell>
              </TableRow>
            </TableHead>
            {
              setup?.flowStations?.map(
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
                          return (<TableRow  >
                            <TableCell align="center">
                              {gasType.label}
                            </TableCell>
                            <TableCell align="center">
                              {readingAtIndex?.serialNumber}
                            </TableCell>

                            <TableCell align="center">

                              <TableInput value={readingAtIndex ? initialReading : "-"}
                                disabled={!readingAtIndex} type={'number'}
                                onChange={(e) => handleChange({ flowStation: name, field: 'initialReading', value: e.target.value, readingIndex, gasType: gasType.value })} />
                            </TableCell>
                            <TableCell align="center">
                              <TableInput value={readingAtIndex ? finalReading : "-"}
                                disabled={!readingAtIndex} type={'number'}
                                onChange={(e) => handleChange({ flowStation: name, field: 'finalReading', value: e.target.value, readingIndex, gasType: gasType.value })} />
                            </TableCell>
                            <TableCell align="center" colSpan={2}>
                              {readingAtIndex ? meterTotal :
                                <TableInput
                                  disabled={readingAtIndex} type={'number'}
                                  onChange={(e) => handleChange({ flowStation: name, field: `meterTotal`, value: e.target.value, readingIndex, gasType: gasType.value })} />}
                            </TableCell>

                          </TableRow>)
                        }
                        )}
                        <TableRow key={name}>
                          <TableCell sx={{ bgcolor: '#8080807a' }} align="left" className='pl-5 !bg-[#8080807a]' colSpan={4}><div > Total Gas Produced</div></TableCell>
                          <TableCell sx={{ bgcolor: '#8080807a' }} align="center">{(tableValues?.[name]?.subTotal || 0)}

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
              <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={6}>{"Total Gas Production"}</TableCell>
              <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={1}>Gas Target : {targets?.gasRate}</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{totals?.netProductionTotal}</TableCell>
              </TableRow>
            </TableBody>

          </Table>
        </TableContainer>
        <div className='justify-end flex my-2'>
          <Button className={'my-3'} type='submit' width={150}>Save</Button>
        </div>
      </form></>
  );
}