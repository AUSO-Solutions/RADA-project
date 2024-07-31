import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { store } from 'Store';
import tableStyles from './table.module.scss'
import RadioSelect from './RadioSelect';
import { Switch } from '@mui/material';
import RadaSwitch from 'Components/Input/RadaSwitch';
import RadaDatePicker from 'Components/Input/RadaDatePicker';
import { sum } from 'utils';


const TableInput = (props) => {
  return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
}

export default function OilGasAccountingTable() {
  const setup = React.useMemo(() => {
    return store.getState().setup

  }, [])
  // console.log(setup)
//   const [tableValues, setTableValues] = React.useState({})

  const handleChange = ({ flowStation, field, measurementTypeValue, measurementTypeIndex }) => {
    // setTableValues(prev => {
    //   const prevFlowStation = prev?.[flowStation]
    //   const prevFlowStationList = prevFlowStation?.list
    //   const prevFlowStationListIndexValues = prevFlowStation?.list?.[measurementTypeIndex]
    //   const finalBbls = field === "finalBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.finalBbls || 0)
    //   const initialBbls = field === "initialBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.initialBbls || 0)
    //   const deductionFinalBbls = field === "deductionFinalBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.deductionFinalBbls || 0)
    //   const deductionInitialBbls = field === "deductionInitialBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.deductionInitialBbls || 0)
    //   const netProduction = finalBbls - initialBbls
    //   const deductionNetProduction = deductionFinalBbls - deductionInitialBbls
    //   // const subTotal = 0
    //   return {
    //     ...prev,
    //     [flowStation]: {
    //       ...prevFlowStation,
    //       list: {
    //         ...prevFlowStationList,
    //         [measurementTypeIndex]: {
    //           ...prevFlowStationListIndexValues,
    //           [field]: measurementTypeValue,
    //           netProduction,
    //           deductionNetProduction
    //         }
    //       },
    //       ['subTotal']: sum(Object.values(prevFlowStationList || {}).map(value => value.netProduction)) - sum(Object.values(prevFlowStationList || {}).map(value => value.deductionNetProduction)),
    //       netTarget: field === "netTarget" ? measurementTypeValue : 0,
    //       bsw: field === "bsw" ? measurementTypeValue : 0,
    //       gross: field === "gross" ? measurementTypeValue : 0,
    //     },
    //     totals: {
          
    //     }
    //   }
    // })

  }
  return (
    < div className='px-3'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <RadioSelect list={setup?.reportTypes} /> <RadaSwitch label="Edit Table" labelPlacement="left" />
        </div>
        <RadaDatePicker />
      </div>
      <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
        <Table sx={{ minWidth: 700 }} >
          <TableHead >
            <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
              <TableCell align="left" colSpan={3} >
                Flow stations
              </TableCell>
              <TableCell align="center" colSpan={3} >
                {setup.measurementType === "Metering" ? "Meter" : "Tank"} Readings
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
              <TableCell align="center">{setup.measurementType === "Metering" ? "Meter" : "Tank"} Name</TableCell>
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
              (flowStation) => {
                return (
                  <TableBody>
                    <TableRow key={flowStation}>
                      <TableCell align="left" rowSpan={parseInt(setup?.measurementTypeNumber[flowStation]) + (setup.measurementType === "Metering" ? 2 : 3 * 2)} colSpan={3}>{flowStation}</TableCell>
                    </TableRow>
                    {
                      new Array(parseInt(setup?.measurementTypeNumber[flowStation])).fill(0).map(
                        (meter, i) => <>
                          <TableRow>
                            <TableCell align="center">
                              <TableInput
                                onChange={(e) => handleChange({ flowStation, field: 'serialNumber', measurementTypeValue: e.target.value, measurementTypeIndex: i })}
                                defaultValue={(setup.measurementType === "Metering" ? "Meter" : "Tank") + (i + 1)}
                              />
                            </TableCell>
                            <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'initialBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} /></TableCell>
                            <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'finalBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} /></TableCell>
                            <TableCell align="center"> {tableValues?.[flowStation]?.list?.[i]?.netProduction} </TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">-</TableCell>
                            <TableCell align="center">-</TableCell>
                          </TableRow>
                          {
                            setup.measurementType === "Tank Dipping" && <TableRow>
                              <TableCell align="center">Deduction</TableCell>
                              <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'deductionInitialBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} /></TableCell>
                              <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'deductionFinalBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} /></TableCell>
                              <TableCell align="center">{tableValues?.[flowStation]?.list?.[i]?.deductionNetProduction}</TableCell>
                              <TableCell align="center">-</TableCell>
                              <TableCell align="center">-</TableCell>
                              <TableCell align="center">-</TableCell>
                            </TableRow>}
                        </>
                      )
                    }

                    <TableRow key={flowStation}>
                      <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="left" className='pl-5 !bg-[rgba(178, 181, 182, 0.2)]' colSpan={3}><div className='pl-[30px]'> Sub total</div></TableCell>
                      <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="center">
                        {sum(Object.values(tableValues?.[flowStation]?.list || {})?.map(item => item?.netProduction)) - sum(Object.values(tableValues?.[flowStation]?.list || {})?.map(item => item?.deductionNetProduction))}
                      </TableCell>
                      <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'netTarget', measurementTypeValue: e.target.value, measurementTypeIndex: null })} /></TableCell>
                      <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'bsw', measurementTypeValue: e.target.value, measurementTypeIndex: null })} /></TableCell>
                      <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'gross', measurementTypeValue: e.target.value, measurementTypeIndex: null })} /></TableCell>
                    </TableRow>


                  </TableBody>
                )
              }
            )
          }
          <TableBody>
            <TableRow >
              <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={6}>{"Total Net Production"}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >bbls</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>bbls</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>%</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>bbls</TableCell>
            </TableRow>
          </TableBody>

        </Table>
      </TableContainer>
    </div>
  );
}