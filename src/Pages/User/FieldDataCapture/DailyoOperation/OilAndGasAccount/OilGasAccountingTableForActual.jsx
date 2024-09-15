import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import tableStyles from '../table.module.scss'

export default function OilGasAccountingTableForActual() {

    // const statusArray = ['Producing', 'Closed In']
    // const defermentCategoryArray = ['Scheduled Deferment', 'Unscheduled Deferment', 'Third-Party Deferment', 'N/A']
    // const defermentDescriptionArray = ['Export Line Sabotage/ Leak', 'Flow station Engine Failure', 'Flowline Leak', 'Flow Station Trip', 'Logistic Problem']


    return (
        <TableContainer className={`m-auto border  ${tableStyles.borderedMuiTable}`}>
            <Table sx={{ minWidth: 700 }} >
                <TableHead >
                    <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >
                            Flow stations ID
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                            Uptime Production
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={7} >
                            Actual Production
                        </TableCell>

                    </TableRow>
                    <TableRow>

                        <TableCell style={{ fontWeight: '600' }} align="center" >
                            Wells
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >
                            Reservoir
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >
                            (Hours)
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Gross (bbls)</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Net Oil (bbls)</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Gas (mmscf/)</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Status</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Remarks</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Deferment Category</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Deferment Description</TableCell>
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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#FF5252' }} align="center">

                            {'Closed In'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#FF5252' }} align="center">

                            {'Closed In'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


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
                        <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                            {'Producing'}
                        </TableCell>
                        <TableCell rowSpan={2} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>
                        <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                        <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell>


                    </TableRow>

                </TableBody>

            </Table>
        </TableContainer>

    );
}