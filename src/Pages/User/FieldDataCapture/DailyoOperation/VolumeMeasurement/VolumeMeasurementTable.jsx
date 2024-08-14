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


const TableInput = (props) => {
  return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
}

export default function VolumeMeasurementTable({ currReport }) {
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
    // console.log(flowStationSetup)
    const meterFactor = flowStationSetup?.measurementType === "Metering" ? parseInt(flowStationSetup?.readings?.[readingIndex]?.meterFactor || 0) : 1
    const deductionMeterFactor = parseInt(flowStationSetup?.deductionMeterFactor || 1)

    setTableValues(prev => {
      const prevFlowStation = prev?.[flowStation]
      const prevFlowStationList = prevFlowStation?.list
      const prevFlowStationListIndexValues = prevFlowStation?.list?.[readingIndex]
      const finalBbls = field === "finalBbls" ? value : (prevFlowStationListIndexValues?.finalBbls || 0)
      const initialBbls = field === "initialBbls" ? value : (prevFlowStationListIndexValues?.initialBbls || 0)
      const deductionFinalBbls = flowStationField === "deductionFinalBbls" ? value : (prevFlowStation?.deductionFinalBbls || 0)
      const deductionInitialBbls = flowStationField === "deductionInitialBbls" ? value : (prevFlowStation?.deductionInitialBbls || 0)
      const difference = Math.abs(parseFloat(finalBbls) - parseFloat(initialBbls))
      const deductionDiference =  Math.abs(parseFloat(deductionFinalBbls || 0) - parseFloat(deductionInitialBbls || 0)) 
      const netProduction = difference * parseInt(meterFactor || 0)
      const deductionTotal = deductionDiference * parseInt(deductionMeterFactor || 0)
      console.log({deductionFinalBbls,deductionInitialBbls, deductionDiference,deductionMeterFactor})
      const gross = difference * parseInt(meterFactor || 0)
      const isNum = typeof readingIndex === 'number'
      let updatedList = prevFlowStationList
      if (field && isNum) {
        updatedList = isNum ? {
          ...prevFlowStationList,
          [readingIndex]: {
            ...prevFlowStationListIndexValues,
            [field]: value,
            netProduction,
            gross
          }
        } : prevFlowStationList
      }
      let updatedFlowStation = {
        ...prevFlowStation,
        list: updatedList,
        deductionTotal,
        subTotal: sum(Object.values(updatedList || {}).map(value => value.netProduction)) + deductionTotal,

      }
      if (flowStationField) {
        updatedFlowStation = {
          // ...prevFlowStation,
          // list: updatedList,
          // subTotal: sum(Object.values(updatedList || {}).map(value => value.netProduction)),
          // netTarget: field === "netTarget" ? parseFloat(value) : prevFlowStation?.netTarget,
          // bsw: field === "bsw" ? parseFloat(value) : prevFlowStation?.bsw,
          // gross: field === "gross" ? parseFloat(value) : prevFlowStation?.gross,
          ...updatedFlowStation,
          [flowStationField]: parseFloat(value)
        }
      }

      console.log(({ updatedFlowStation }))
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

  const save = () => {
    // const flowStationsData = tableValues
    console.log({ totals, tableValues })

  }
  return (
    < div className='px-3 '>
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
                      <TableCell align="left" rowSpan={parseInt(numberOfUnits) + (measurementType === "Metering" ? 2 : 3)} colSpan={3}>
                        {name} ({measurementType})
                        </TableCell>
                    </TableRow>
                    {
                      new Array(parseInt(numberOfUnits)).fill(0).map(
                        (meter, readingIndex) => <>
                          <TableRow>
                            <TableCell align="center">

                              <TableInput
                                value={readings?.[readingIndex]?.serialNumber}
                                onChange={(e) => updateFlowstationReading(flowStationIndex, readingIndex, 'serialNumber', e.target.value)}
                              />
                            </TableCell>
                            <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation: name, field: 'initialBbls', value: e.target.value, readingIndex: readingIndex })} /></TableCell>
                            <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation: name, field: 'finalBbls', value: e.target.value, readingIndex: readingIndex })} /></TableCell>
                            <TableCell align="center"> { isNet ? tableValues?.[name]?.list?.[readingIndex]?.netProduction : "-"} </TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">{isGross? tableValues?.[name]?.list?.[readingIndex]?.gross : "-"}</TableCell>
                          </TableRow>
                        </>
                      )
                    }
                    {
                      measurementType === "Tank Dipping" && <TableRow>
                        <TableCell align="center">Deduction</TableCell>
                        <TableCell align="center">
                          <TableInput
                            onChange={(e) => handleChange({ flowStation: name, flowStationField: 'deductionInitialBbls', value: e.target.value, readingIndex: null })}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TableInput
                            onChange={(e) => handleChange({ flowStation: name, flowStationField: 'deductionFinalBbls', value: e.target.value, readingIndex: null })}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* {((tableValues?.[name]?.deductionFinalBbls || 0) - (tableValues?.[name]?.deductionInitialBbls || 0)) * parseInt(rest?.deductionMeterFactor || 0)} */}
                          {/* == */}
                          {isNet? tableValues?.[name]?.deductionTotal : "-"}

                        </TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">{isGross? tableValues?.[name]?.deductionTotal : "-"}</TableCell>
                      </TableRow>}

                    <TableRow key={name}>
                      <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="left" className='pl-5 !bg-[rgba(178, 181, 182, 0.2)]' colSpan={3}><div className='pl-[30px]'> Sub total</div></TableCell>
                      <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="center">
                        {isNet ? (tableValues?.[name]?.subTotal || 0 ): "-"} 
                      </TableCell>
                      <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation: name, flowStationField: 'netTarget', value: e.target.value, readingIndex: null })} /></TableCell>
                      <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation: name, flowStationField: 'bsw', value: e.target.value, readingIndex: null })} /></TableCell>
                      <TableCell align="center">
                        {/* <TableInput onChange={(e) => handleChange({ flowStation: name, field: 'gross', value: e.target.value, readingIndex: null })} /> */}
                        {isGross ? (tableValues?.[name]?.subTotal || 0 ): "-"}
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
              <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{isNet?totals?.netProductionTotal:"-"}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.netTargetTotal}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.bswTotal}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{isGross? totals?.grossTotal : "-"}</TableCell>
            </TableRow>
          </TableBody>

        </Table>
      </TableContainer>
      <div className='justify-end flex my-2'>
        <Button className={'my-3'} onClick={save} width={150}>Save</Button>
      </div>
    </div>
  );
}