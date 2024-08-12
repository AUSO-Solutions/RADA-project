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
import RadaSwitch from 'Components/Input/RadaSwitch';
import RadaDatePicker from 'Components/Input/RadaDatePicker';
// import { sum } from 'utils';


// const TableInput = (props) => {
//     return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
// }

export default function OilGasAccountingTable() {
    const setup = React.useMemo(() => {
        return store.getState().setup

    }, [])
    // console.log(setup)
    //   const [tableValues, setTableValues] = React.useState({})

    //   const handleChange = ({ flowStation, field, measurementTypeValue, measurementTypeIndex }) => {
    //     setTableValues(prev => {
    //       const prevFlowStation = prev?.[flowStation]
    //       const prevFlowStationList = prevFlowStation?.list
    //       const prevFlowStationListIndexValues = prevFlowStation?.list?.[measurementTypeIndex]
    //       const finalBbls = field === "finalBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.finalBbls || 0)
    //       const initialBbls = field === "initialBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.initialBbls || 0)
    //       const deductionFinalBbls = field === "deductionFinalBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.deductionFinalBbls || 0)
    //       const deductionInitialBbls = field === "deductionInitialBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.deductionInitialBbls || 0)
    //       const netProduction = finalBbls - initialBbls
    //       const deductionNetProduction = deductionFinalBbls - deductionInitialBbls
    //       // const subTotal = 0
    //       return {
    //         ...prev,
    //         [flowStation]: {
    //           ...prevFlowStation,
    //           list: {
    //             ...prevFlowStationList,
    //             [measurementTypeIndex]: {
    //               ...prevFlowStationListIndexValues,
    //               [field]: measurementTypeValue,
    //               netProduction,
    //               deductionNetProduction
    //             }
    //           },
    //           ['subTotal']: sum(Object.values(prevFlowStationList || {}).map(value => value.netProduction)) - sum(Object.values(prevFlowStationList || {}).map(value => value.deductionNetProduction)),
    //           netTarget: field === "netTarget" ? measurementTypeValue : 0,
    //           bsw: field === "bsw" ? measurementTypeValue : 0,
    //           gross: field === "gross" ? measurementTypeValue : 0,
    //         },
    //         totals: {

    //         }
    //       }
    //     })

    //   }

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
                            <TableCell align="center" colSpan={2} >
                                Flow stations ID
                            </TableCell>
                            <TableCell align="center" colSpan={1} >
                                CITHP
                            </TableCell>
                            <TableCell align="center" colSpan={4} >Potentials (Test Data)</TableCell>
                            {/* <TableCell align="center">Net Target</TableCell>
              <TableCell align="center">BS&W</TableCell>
              <TableCell align="center">Gross</TableCell> */}
                        </TableRow>
                        <TableRow>

                            <TableCell align="center" >
                                Wells
                            </TableCell>
                            <TableCell align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell align="center">(Psi)</TableCell>
                            <TableCell align="center">Gross (blpd)</TableCell>
                            <TableCell align="center">BS&W (bbls)</TableCell>
                            <TableCell align="center">Net Oil (bopd)</TableCell>
                            <TableCell align="center">Gas (mmscf/d)</TableCell>

                        </TableRow>
                    </TableHead>



                    <TableBody>
                        {/* <TableRow >
                      <TableCell align="left"  colSpan={1}>ll</TableCell>
                    </TableRow> */}
                        {/* {
                      new Array(parseInt(setup?.measurementTypeNumber[flowStation])).fill(0).map(
                        (meter, i) => <> */}
                        <TableRow>
                            <TableCell align="center">
                                Well 2L

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>
                        {/* <TableRow >
                      <TableCell align="left"  colSpan={1}>ll</TableCell>
                    </TableRow> */}
                        {/* {
                      new Array(parseInt(setup?.measurementTypeNumber[flowStation])).fill(0).map(
                        (meter, i) => <> */}
                        <TableRow>
                            <TableCell align="center">
                                Well 2S

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>
                        {/* <TableRow >
                      <TableCell align="left"  colSpan={1}>ll</TableCell>
                    </TableRow> */}
                        {/* {
                      new Array(parseInt(setup?.measurementTypeNumber[flowStation])).fill(0).map(
                        (meter, i) => <> */}
                        <TableRow>
                            <TableCell align="center">
                                Well 3L

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>
                        {/* <TableRow >
                      <TableCell align="left"  colSpan={1}>ll</TableCell>
                    </TableRow> */}
                        {/* {
                      new Array(parseInt(setup?.measurementTypeNumber[flowStation])).fill(0).map(
                        (meter, i) => <> */}
                        <TableRow>
                            <TableCell align="center">
                                Well 4L

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>
                        {/* <TableRow >
                      <TableCell align="left"  colSpan={1}>ll</TableCell>
                    </TableRow> */}
                        {/* {
                      new Array(parseInt(setup?.measurementTypeNumber[flowStation])).fill(0).map(
                        (meter, i) => <> */}
                        <TableRow>
                            <TableCell align="center">
                                Well 4S

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                Well 5L

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                Well 5S

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                Well 6L

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                Well 6S

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                Well 2L

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>
                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                Well 2S

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                265230.0

                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>

                    {/* <TableBody>
            <TableRow >
              <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={6}>{"Total Net Production"}</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >bbls</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>bbls</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>%</TableCell>
              <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>bbls</TableCell>
            </TableRow>
          </TableBody> */}

                </Table>
            </TableContainer>
        </div>
    );
}