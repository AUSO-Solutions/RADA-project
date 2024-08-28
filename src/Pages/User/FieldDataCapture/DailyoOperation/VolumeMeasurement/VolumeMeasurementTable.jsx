import * as React from 'react';
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
import { updateFlowstationReading } from './helper';
import { toast } from 'react-toastify';


const TableInput = (props) => {
  return <input className='p-1 text-center w-[70px] border outline-none' required {...props}
  //  onKeyPress={(e) => {
  //   if (!/[0-9]/.test(e.key) && props.type === 'number') {
  //     e.preventDefault();
  //   }
  // }}
  />
}

export default function VolumeMeasurementTable({ currReport, date }) {
  //  const isGas = currReport === "Gas"
  const isNet = currReport === "Net Oil/ Condensate"
  const isGross = currReport === 'Gross Liquid'

  const setup = React.useMemo(() => store.getState().setup, [])

  const [tableValues, setTableValues] = React.useState({})
  const [totals, setTotals] = React.useState({
    netProductionTotal: 0,
    netTargetTotal: 0,
    bswTotal: 0,
    grossTotal: 0,
  })

  const handleChange = ({ flowStation, field, value, readingIndex, flowStationField }) => {
    // console.log({ flowStation, field, value, readingIndex, flowStationField })
    //careful, to also have the value updated before calculated
    const flowStationSetup = setup?.flowStations?.find(({ name }) => name === flowStation)
    console.log(setup)
    const meterFactor = parseFloat(flowStationSetup?.readings?.[readingIndex]?.meterFactor || 1)
    const deductionMeterFactor = parseFloat(flowStationSetup?.deductionMeterFactor || 1)

    setTableValues(prev => {
      const prevFlowStation = prev?.[flowStation]
      const prevFlowStationList = prevFlowStation?.meters
      const prevFlowStationListIndexValues = prevFlowStation?.meters?.[readingIndex]
      const finalReading = field === "finalReading" ? value : (prevFlowStationListIndexValues?.finalReading || 0)
      const initialReading = field === "initialReading" ? value : (prevFlowStationListIndexValues?.initialReading || 0)
      const deductionFinalReading = flowStationField === "deductionFinalReading" ? value : (prevFlowStation?.deductionFinalReading || 0)
      const deductionInitialReading = flowStationField === "deductionInitialReading" ? value : (prevFlowStation?.deductionInitialReading || 0)
      const difference = (Math.abs(parseFloat(finalReading) - parseFloat(initialReading)))
      const deductionDiference = (Math.abs(parseFloat(deductionFinalReading || 0) - parseFloat(deductionInitialReading || 0)))
      const netProduction = (difference * parseFloat(meterFactor || 0))
      const deductionTotal = (deductionDiference * parseFloat(deductionMeterFactor || 0))
      // console.log({deductionFinalReading,deductionInitialReading, deductionDiference,deductionMeterFactor})
      const gross = (difference * parseFloat(meterFactor || 0))
      console.log({meterFactor})
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
            reportType: currReport
          }
        } : prevFlowStationList
      }
      let deduction = {
        initialReading: deductionInitialReading,
        finalReading: deductionFinalReading,
        meterFactor,
        netProduction: deductionDiference
      }
      let updatedFlowStation = {
        ...prevFlowStation,
        meters: updatedMeters,
        deductionTotal,
        subTotal: sum(Object.values(updatedMeters || {}).map(value => value.netProduction)) + deductionTotal,
        reportType: currReport
      }
      if (flowStationField) {
        updatedFlowStation = {
          ...updatedFlowStation,
          [flowStationField]: parseFloat(value),
          deduction

        }
      }
      console.log({ updatedFlowStation })
      return {
        ...prev,
        [flowStation]: updatedFlowStation,
      }
    })

  }
  React.useEffect(() => {
    const values = (Object.values(tableValues))
    // console.log(values)
    const calcs = {
      netProductionTotal: sum(Object.values(values || {}).map(item => item?.subTotal || 0)),
      netTargetTotal: sum(Object.values(values || {}).map(item => item?.netTarget || 0)),
      bswTotal: sum(Object.values(values || {}).map(item => item?.bsw || 0)),
      grossTotal: sum(Object.values(values || {}).map(item => item?.subTotal || 0)),
    }
    setTotals(calcs)
  }, [tableValues])

  const save = async (e) => {
    e.preventDefault()
    const flowStations = Object.entries(tableValues).map(value => ({
      name: value[0],
      ...value[1]
    }))
    const payload = {
      flowStations,
      date,
      asset: setup?.asset,
      setupId: setup?.id,
      timeFrame: setup?.timeFrame,
      reportType: currReport,

      ...totals
    }
    console.log(payload)

    toast.success("Successful")

  }
  const calculatedGrossOrnNet = (subTotal, bsw) => {
    const result = (subTotal / (1 - (0.01 * bsw))).toFixed(3)
    if(isNaN(result)) return 0
    return  result
  }
  return (
    < form className='px-3 ' onSubmit={save} >
      <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
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
              <TableCell align="center">Net Target</TableCell>
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
                      <TableCell align="left" rowSpan={parseFloat(numberOfUnits) + (measurementType === "Metering" ? 2 : 3)} colSpan={3}>
                        {name} ({measurementType || "Metering"})
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
                        {isNet ? (tableValues?.[name]?.subTotal || 0) : calculatedGrossOrnNet(tableValues?.[name]?.subTotal, tableValues?.[name]?.bsw)}
                      </TableCell>
                      <TableCell align="center"><TableInput type='number' onChange={(e) => handleChange({ flowStation: name, flowStationField: 'netTarget', value: e.target.value, readingIndex: null })} /></TableCell>
                      <TableCell align="center"><TableInput type='number' onChange={(e) => handleChange({ flowStation: name, flowStationField: 'bsw', value: e.target.value, readingIndex: null })} /></TableCell>
                      <TableCell align="center">
                        {/* <TableInput onChange={(e) => handleChange({ flowStation: name, field: 'gross', value: e.target.value, readingIndex: null })} /> */}
                        {isGross ? (tableValues?.[name]?.subTotal || 0) : calculatedGrossOrnNet(tableValues?.[name]?.subTotal, tableValues?.[name]?.bsw)}
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
              <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{isNet ? totals?.netProductionTotal : "-"}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.netTargetTotal}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.bswTotal}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{isGross ? totals?.grossTotal : "-"}</TableCell>
            </TableRow>
          </TableBody>

        </Table>
      </TableContainer>
      <div className='justify-end flex my-2'>
        <Button className={'my-3'} type='submit' width={150}>Save</Button>
      </div>
    </form>
  );
}