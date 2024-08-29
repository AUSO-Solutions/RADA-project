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
// import { updateFlowstationReading } from './helper';
import { toast } from 'react-toastify';
import { camelize } from './helper';
import { useSelector } from 'react-redux';


const TableInput = (props) => {
  return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
}

export default function GasTable({ currReport, date }) {
  //  const isGas = currReport === "Gas"
  // const isNet = currReport === "Net Oil/ Condensate"
  //  const isGross = currReport === 'Gross Liquid'
  const roundUp = (num) => Math.round(num * 100) / 100

  const setup = useSelector(state => state.setup)

  const [tableValues, setTableValues] = React.useState({})
  const [totals, setTotals] = React.useState({
    netProductionTotal: 0,
    netTargetTotal: 0,
    bswTotal: 0,
    grossTotal: 0,
  })
  // const gasTypes = ["Gas Flared USM", "Fuel Gas", "Export Gas"]
  const gasTypes = ["Gas Flared USM", "Fuel Gas", "Export Gas"].map(type => ({ label: type, value: camelize(type) }))
  // const gasTypesColors = {
  //   "Gas Flared USM": "white",
  //   "Fuel Gas": "white",
  //   "Export Gas": "white"
  // }

  const handleChange = ({ flowStation, field, value, readingIndex, flowStationField, gasType }) => {
    console.log({ flowStation, field, value, readingIndex, flowStationField, gasType })
    //careful, to also have the value updated before calculated
    const flowStationSetup = setup?.flowStations?.find(({ name }) => name === flowStation)
    const meterFactor = parseFloat(flowStationSetup?.readings?.[readingIndex]?.meterFactor || 1)

    setTableValues(prev => {
      const prevFlowStation = prev?.[flowStation]
      const prevFlowStationList = prevFlowStation?.meters
      const prevFlowStationListIndexValues = prevFlowStation?.meters?.[readingIndex]
      const finalBbls = field === "finalBbls" ? value : (prevFlowStationListIndexValues?.finalBbls || 0)
      const initialBbls = field === "initialBbls" ? value : (prevFlowStationListIndexValues?.initialBbls || 0)
      const difference = roundUp(Math.abs(parseFloat(finalBbls) - parseFloat(initialBbls)))
      console.log({ difference, meterFactor })
      let meterTotal = prevFlowStationListIndexValues?.meterTotal
      // meterTotal = (field === "meterTotal" ? value : (|| 0))
      if (field === "meterTotal") { meterTotal = value } else { meterTotal = difference * parseFloat(meterFactor || 0) }
      console.log({ finalBbls, initialBbls, meterTotal })

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
            difference,
            serialNumber: flowStationSetup?.readings?.[readingIndex]?.serialNumber
          }
        } : prevFlowStationList
      }

      // console.log(updatedMeters)
      let updatedFlowStation = {
        ...prevFlowStation,
        meters: updatedMeters,
        subTotal: sum(Object.values(updatedMeters || {}).map(value => value.meterTotal)),
      }
      if (flowStationField) {
        updatedFlowStation = {
          ...updatedFlowStation,
          [flowStationField]: parseFloat(value),
          // [`${gasType}-meterTotal`]:parseFloat(value)
        }
      }

      // console.log(({ updatedFlowStation }))
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
    }
    setTotals(calcs)
  }, [tableValues])

  React.useEffect(() => {
    console.log('----')
    setup?.flowStations.forEach((flowStation, flowStationIndex) => {
      const readings = flowStation?.readings || []
      readings.forEach((reading, readingIndex) => {
        const finalReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.finalReading) || 0
        const initialReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.initialReading) || 0
        // const deductionInitialReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.deductionInitialReading) || 0
        // const deductionFinalReading = parseFloat(tableValues?.[flowStation?.name]?.meters[readingIndex]?.deductionFinalReading) || 0
        const isNum = (num) => !isNaN(num)
        if (isNum(initialReading) || isNum(finalReading)) handleChange({ flowStation: flowStation?.name, field: 'finalReading', value: finalReading, readingIndex })
        // if (isNum(deductionInitialReading) || isNum(deductionFinalReading)) handleChange({ flowStation: flowStation?.name, field: 'deductionFinalReading', value: deductionFinalReading, readingIndex })

      });

    });
    // eslint-disable-next-line
  }, [setup])


  const save = (e) => {
    e.preventDefault()
    const flowStations = Object.entries(tableValues).map(value => ({
      name: value[0],
      ...value[1]
    }))
    const payload = {
      flowStations,
      asset: setup?.asset,
      setupId: setup?.id,
      timeFrame: setup?.timeFrame,
      date,
      reportType: "Gas",
      ...totals
    }
    console.log(payload)
    toast.success("Successful")
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
              <TableCell align="center">Initial (bbls)</TableCell>
              <TableCell align="center">Final (bbls)</TableCell>
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
                        // let usedIndexs = []
                        const readingAtIndex = readings?.find(reading => reading?.gasType === gasType.value)
                        let readingIndex = readings?.findIndex(reading => reading?.gasType === gasType.value)
                        if (readingIndex === -1 ) readingIndex = i + readings?.length
                        if (!readings) readingIndex = i
                        // usedIndexs.push(readingIndex)
                        // console.log({usedIndexs})
                        // usedIndexs.push(readingIndex)
                        // console.log(readings,readingIndex,i)

                        const initialBbls = tableValues?.[name]?.meters?.[readingIndex]?.initialBbls
                        const finalBbls = tableValues?.[name]?.meters?.[readingIndex]?.finalBbls
                        const meterTotal = tableValues?.[name]?.meters?.[readingIndex]?.meterTotal
                        return (<TableRow  >
                          <TableCell align="center">
                            {gasType.label}
                          </TableCell>
                          <TableCell align="center">
                            {readingAtIndex?.serialNumber} {readingIndex}
                          </TableCell>

                          <TableCell align="center">

                            <TableInput value={readingAtIndex ? initialBbls : "-"}
                              disabled={!readingAtIndex} type={'number'}
                              onChange={(e) => handleChange({ flowStation: name, field: 'initialBbls', value: e.target.value, readingIndex, gasType: gasType.value })} />
                          </TableCell>
                          <TableCell align="center">
                            <TableInput value={readingAtIndex ? finalBbls : "-"}
                              disabled={!readingAtIndex} type={'number'}
                              onChange={(e) => handleChange({ flowStation: name, field: 'finalBbls', value: e.target.value, readingIndex, gasType: gasType.value })} />
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
              <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={7}>{"Total Gas Production"}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{totals?.netProductionTotal}</TableCell>
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