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

export default function OilGasAccountingTableForActual() {
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

    const statusArray = ['Producing', 'Closed In']
    const defermentCategoryArray = ['Scheduled Deferment', 'Unscheduled Deferment', 'Third-Party Deferment', 'N/A']
    const defermentDescriptionArray = ['Export Line Sabotage/ Leak', 'Flow station Engine Failure', 'Flowline Leak', 'Flow Station Trip', 'Logistic Problem']


    return (
        < div className='px-3'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <RadioSelect list={setup?.reportTypes} /> <RadaSwitch label="Edit Table" labelPlacement="left" />
                </div>
                <RadaDatePicker />
            </div>
            <TableContainer className={`m-auto border  ${tableStyles.borderedMuiTable}`}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead >
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }}  align="center" colSpan={2} >
                                Flow stations ID
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center" colSpan={1} >
                                Uptime Production
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center" colSpan={7} >
                                Actual Production
                            </TableCell>
                            
                            
                            {/* <TableCell align="center">Net Target</TableCell>
              <TableCell align="center">BS&W</TableCell>
              <TableCell align="center">Gross</TableCell> */}
                        </TableRow>
                        <TableRow>

                            <TableCell style={{ fontWeight: '600' }}  align="center" >
                                Wells
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center" >
                                (Hours)
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center">Gross (bbls)</TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center">Net Oil (bbls)</TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center">Gas (mmscf/)</TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center">Status</TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center">Remarks</TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center">Deferment Category</TableCell>
                            <TableCell style={{ fontWeight: '600' }}  align="center">Deferment Description</TableCell>
                            
                            

                        </TableRow>
                    </TableHead>



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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#FF5252'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Closed In'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white',background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#FF5252'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Closed In'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white',background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell style={{color:'white', background:'#A0E967'}} align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                {'Producing'}
                            </TableCell>
                            <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                            <TableCell style={{background:'#D9E3F9'}} align="center">{'Scheduled Deferment'}</TableCell>
                            <TableCell style={{background:'#E6E4F9'}} align="center">{'N/A'}</TableCell>
                          
                        
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