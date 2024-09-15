import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'

export default function OilGasAccountingIPSCTable() {

    return (

        
            <TableContainer className={`m-auto border  ${tableStyles.borderedMuiTable}`}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead >
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >
                                Flow stations ID
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={4} >
                                Pressures
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >
                                Separator Static
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                                Choke
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                                WH Temperature
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                                CITHP
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={4} >Potentials (Test Data)</TableCell>
     
                        </TableRow>
                        <TableRow>

                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Wells
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                FTHP (Psi)
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                CHP (Psi)
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                FLP (Psi)
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                MLP (Psi)
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                HP (Psi)
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                LP (Psi)
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Size (64")
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Degree F
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(Psi)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Gross (blpd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">BS&W (bbls)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Net Oil (bopd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Gas (mmscf/d)</TableCell>

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
                            <TableCell align="center">
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">

                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">

                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">

                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">

                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">

                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">

                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
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
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">
                                265230.0
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265.50</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

    );
}