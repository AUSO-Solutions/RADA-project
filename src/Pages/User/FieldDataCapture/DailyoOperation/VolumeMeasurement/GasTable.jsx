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

export default function GasTable({ currReport , date}) {
  //  const isGas = currReport === "Gas"
  // const isNet = currReport === "Net Oil/ Condensate"
  //  const isGross = currReport === 'Gross Liquid'

  const setup = React.useMemo(() => store.getState().setup, [])

  const [tableValues, setTableValues] = React.useState({})
  const [totals, setTotals] = React.useState({
    netProductionTotal: 0,
    netTargetTotal: 0,
    bswTotal: 0,
    grossTotal: 0,
  })
  const gasTypes = ["Gas Flared USM", "Fuel Gas", "Export Gas"]
  const gasTypesColors = {
    "Gas Flared USM": "white",
    "Fuel Gas": "white",
    "Export Gas": "white"
  }

  const handleChange = ({ flowStation, field, value, readingIndex, flowStationField, gasType }) => {

    //careful, to also have the value updated before calculated
    const flowStationSetup = setup?.flowStations?.find(({ name }) => name === flowStation)
    const meterFactor = flowStationSetup?.measurementType === "Metering" ? parseInt(flowStationSetup?.readings?.[readingIndex]?.meterFactor || 0) : 1

    setTableValues(prev => {
      const prevFlowStation = prev?.[flowStation]
      const prevFlowStationList = prevFlowStation?.meters
      const prevFlowStationListIndexValues = prevFlowStation?.meters?.[readingIndex]
      const finalBbls = field === "finalBbls" ? value : (prevFlowStationListIndexValues?.finalBbls || 0)
      const initialBbls = field === "initialBbls" ? value : (prevFlowStationListIndexValues?.initialBbls || 0)
      const difference = Math.abs(parseFloat(finalBbls) - parseFloat(initialBbls))
      const netProduction = difference * parseInt(meterFactor || 0)

      // const gross = difference * parseInt(meterFactor || 0)
      const isNum = typeof readingIndex === 'number'
      let updatedMeters = prevFlowStationList
      if (field && isNum) {
        // let updatedGasType = {}
        gasTypes.forEach((type) => {

        })
        updatedMeters = isNum ? {
          ...prevFlowStationList,
          [readingIndex]: {
            ...prevFlowStationListIndexValues,
            [field]: parseInt(value || 0),
            netProduction,
            gasType,

            serialNumber:flowStationSetup?.readings?.[readingIndex]?.serialNumber
            // [gasType]: parseInt(value)
            // gross
          }
        } : prevFlowStationList
      }
      console.log(updatedMeters)
      let updatedFlowStation = {
        ...prevFlowStation,
        meters: updatedMeters,
        // deductionTotal,
        subTotal: sum(Object.values(updatedMeters || {}).map(value => value.netProduction)),
      }
      if (flowStationField) {
        updatedFlowStation = {
          ...updatedFlowStation,
          [flowStationField]: parseFloat(value)
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

  const save = (e) => {
    e.preventDefault()
    const flowStations = Object.entries(tableValues).map(value => ({
      name: value[0],
      ...value[1]
    }))


    const payload = {
      flowStations,
      asset:setup?.asset,
      setupId:setup?.id,
      timeFrame:setup?.timeFrame,
      date,
      reportType:"Gas",
      ...totals
    }
    console.log(payload)

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
                      <TableCell align="left" rowSpan={3 * (readings?.length + 1)} colSpan={3}>
                        {name}
                      </TableCell>
                    </TableRow>

                    {
                      // ["Gas Flared USM","Fuel Gas","Export Gas"].map(item => )
                    }
                    {
                      new Array(parseInt(numberOfUnits)).fill(0).map(
                        (meter, readingIndex) => {
                          const gasType = tableValues?.[name]?.meters?.[readingIndex]?.gasType
                          const initialBbls = tableValues?.[name]?.meters?.[readingIndex]?.initialBbls
                          const finalBbls = tableValues?.[name]?.meters?.[readingIndex]?.finalBbls
                          const netProduction = tableValues?.[name]?.meters?.[readingIndex]?.netProduction
                          return <>
                            {gasTypes.map((item, i) => <TableRow sx={{ bgcolor: gasTypesColors[item], borderTop: i === 0 ? '2px black solid' : '' }}>
                              <TableCell align="center">
                                {item}
                              </TableCell>
                              <TableCell align="center">
                                {/* {tableValues?.[name]?.meters?.[readingIndex]?.gasType} */}
                                <TableInput
                                  value={readings?.[readingIndex]?.serialNumber} required={gasType === item || !gasType}
                                  onChange={(e) => updateFlowstationReading(flowStationIndex, readingIndex, 'serialNumber', e.target.value)}
                                />
                              </TableCell>

                              <TableCell align="center">
                                <TableInput value={gasType === item ? initialBbls : ""} required={gasType === item || !gasType}
                                  onChange={(e) => handleChange({ flowStation: name, field: 'initialBbls', value: e.target.value, readingIndex: readingIndex, gasType: item })} />
                              </TableCell>
                              <TableCell align="center">
                                <TableInput value={gasType === item ? finalBbls : ""} required={gasType === item || !gasType}
                                  onChange={(e) => handleChange({ flowStation: name, field: 'finalBbls', value: e.target.value, readingIndex: readingIndex, gasType: item })} />
                              </TableCell>
                              <TableCell align="center" colSpan={2}> {gasType === item ? netProduction : 0} </TableCell>

                            </TableRow>)}

                          </>
                        }
                      )
                    }

                    <TableRow key={name}>
                      <TableCell sx={{ bgcolor: '#8080807a' }} align="left" className='pl-5 !bg-[#8080807a]' colSpan={4}><div > Total Gas Production</div></TableCell>
                      <TableCell sx={{ bgcolor: '#8080807a' }} align="center">
                        {(tableValues?.[name]?.subTotal || 0)}
                      </TableCell>
                    </TableRow>


                  </TableBody>
                )
              }
            )
          }
          <TableBody>
            <TableRow >
              <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={7}>{"Total Net Production"}</TableCell>
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