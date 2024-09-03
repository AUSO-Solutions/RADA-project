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
import { ArrowBack } from '@mui/icons-material';
import Text from 'Components/Text';
import { Button } from 'Components';


const TableInput = (props) => {
    return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
}

export default function ScheduleTable() {
    const setup = React.useMemo(() => {
        return store.getState().setup

    }, [])

    return (
        < div className='px-3'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 py-4 items-center'>
                    {/* <RadioSelect list={setup?.reportTypes} />  */}
                    <div className='flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md' >
                        <ArrowBack />
                        <Text>Files</Text>
                    </div>
                    <RadaSwitch label="Edit Table" labelPlacement="left" />
                </div>
                {/* <RadaDatePicker /> */}
            </div>
            <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead >
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{fontWeight:'600'}} align="center" colSpan={12} >
                                Well Test Data-OML99/Field1/Wells Schedule/July-2024
                            </TableCell>

                            {/* <TableCell align="center">Net Target</TableCell>
              <TableCell align="center">BS&W</TableCell>
              <TableCell align="center">Gross</TableCell> */}
                        </TableRow>
                        <TableRow>

                            <TableCell style={{fontWeight:'600'}} align="center" >
                                S/N
                            </TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center">Well</TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center">Test Choke (/64")</TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center">On Program</TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center">Start Date</TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center">End Date</TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center">Stabilization Duration (Hrs)</TableCell>
                            <TableCell style={{fontWeight:'600'}} align="center">Test Duration (Hrs)</TableCell>
                            <TableCell style={{fontWeight:'600'}} colSpan={3} align="center">Remarks</TableCell>
                        </TableRow>
                    </TableHead>



                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                1

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                Well 2L
                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                18
                            </TableCell>
                            <TableCell bgcolor='#A7EF6F' align="center">YES</TableCell>
                            <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                            <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                            <TableCell align="center">2</TableCell>
                            <TableCell align="center">26</TableCell>
                            <TableCell colSpan={3} align="center">Hi, this Schedule was notdone properly. Please revisit and revert. Thanks</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">
                                2

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                Well 2L
                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                18
                            </TableCell>
                            <TableCell bgcolor='#A7EF6F' align="center">YES</TableCell>
                            <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                            <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                            <TableCell align="center">2</TableCell>
                            <TableCell align="center">26</TableCell>
                            <TableCell colSpan={3} align="center">Hi, this Schedule was notdone properly. Please revisit and revert. Thanks</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">
                                3

                            </TableCell>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                Well 2L
                            </TableCell>
                            <TableCell align="center">
                                {/* {tableValues?.[flowStation]?.list?.[i]?.netProduction}  */}
                                18
                            </TableCell>
                            <TableCell bgcolor='#FF5252' align="center">NO</TableCell>
                            <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                            <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                            <TableCell align="center">2</TableCell>
                            <TableCell align="center">26</TableCell>
                            <TableCell colSpan={3} align="center">Hi, this Schedule was notdone properly. Please revisit and revert. Thanks</TableCell>
                        </TableRow>

                    </TableBody>










                </Table>
            </TableContainer>

            <div className='flex justify-end py-1'>
            <Button width={120} >Save</Button>
            </div>
        </div>
    );
}