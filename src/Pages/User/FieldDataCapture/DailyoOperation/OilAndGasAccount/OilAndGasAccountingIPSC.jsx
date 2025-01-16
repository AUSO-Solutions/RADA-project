import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'
import { bsw, roundUp, sum } from 'utils';
import { Paper } from '@mui/material';



export default function OilGasAccountingIPSCTable({ IPSC }) {

    const getTotalOf = (key) => {
        const res = Object.values(IPSC?.wellTestResultData || {})
        const total = sum(res?.map(item => parseFloat(item?.[key] || 0)))
        return total
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', height: '700px' }}>
            <TableContainer sx={{ maxHeight: 700 }} className={`m-auto border  ${tableStyles.borderedMuiTable}`}>
                <Table stickyHeader sx={{ minWidth: 700 }} >
                    <TableHead >
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >Flow stations ID </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={3} >Pressures </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Separator Static </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Choke  </TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >WH Temperature</TableCell> */}
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >CITHP</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={4} >Potentials (Test Data)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight: '600' }} align="center" >  Production String</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >Reservoir</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >FTHP <br /> (Psi)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >CHP <br /> (Psi)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >FLP <br /> (Psi)</TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" >MLP <br /> (Psi)</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center" >Static Pressure <br /> (Psi)</TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" >LP<br />  (Psi)</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center" >Size (64")</TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" >Degree F </TableCell> */}
                            {/* <TableCell style={{ fontWeight: '600' }} align="center">(Psi)</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center">Gross<br />  (blpd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">BS&W<br />  (%)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Net Oil<br />  (bopd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Gas<br />  (mmscf/d)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(IPSC?.wellTestResultData || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((well, i) => {

                            return <TableRow>
                                <TableCell align="center">{well?.productionString}
                                </TableCell>
                                <TableCell align="center">
                                    {well?.reservoir}
                                </TableCell>
                                <TableCell align="center">
                                    {roundUp(well?.fthp)}
                                </TableCell>
                                <TableCell align="center">{well?.chp}</TableCell>
                                <TableCell align="center">{roundUp(well?.flp)}</TableCell>
                                {/* <TableCell align="center">{well?.mlp}</TableCell> */}
                                <TableCell align="center">
                                    {well?.staticPressure}
                                </TableCell>
                                {/* <TableCell align="center">{well?.lp}</TableCell> */}
                                <TableCell align="center">{well?.chokeSize}</TableCell>
                                {/* <TableCell align="center">{well?.whTemperature}</TableCell> */}
                                {/* <TableCell align="center">{well?.CITHP}</TableCell> */}
                                <TableCell align="center">{roundUp(well?.gross)}</TableCell>
                                <TableCell align="center">{well?.bsw}</TableCell>
                                <TableCell align="center">{roundUp(well?.oilRate)}</TableCell>
                                <TableCell align="center">{well?.gasRate}</TableCell>
                            </TableRow>
                        })}
                        <TableRow sx={{ backgroundColor: '#00A3FF4D' }}>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >Totals </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={5} ></TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('fthp')}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">{getTotalOf('chp')}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">{getTotalOf('flp')}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('staticPressure')}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('chokeSize')}</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('gross')}</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >{bsw({ gross: getTotalOf('gross'), oil: getTotalOf('oilRate') })}</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('oilRate')}</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('gasRate')}</TableCell>
                        </TableRow>
                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
    );
}