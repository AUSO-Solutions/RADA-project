import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import tableStyles from '../table.module.scss'
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

export default function OilGasAccountingTableForActual({ wellTestResult }) {
    const [searchParams] = useSearchParams()
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
                            {searchParams.get('table') === 'actual-production' && "Actual"}  {searchParams.get('table') === 'deferred-production' && "Deferred"} Production
                        </TableCell>

                    </TableRow>
                    <TableRow>

                        <TableCell style={{ fontWeight: '600' }} align="center" >
                            Production String
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >
                            Reservoir
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >
                            (Hours)
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Gross<br /> (bbls)</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Net Oil<br />  (bbls)</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">Gas<br />  (mmscf/)</TableCell>
                        {searchParams.get('table') === 'actual-production' && <TableCell style={{ fontWeight: '600' }} align="center">Status</TableCell>}
                        {searchParams.get('table') === 'actual-production' && <TableCell style={{ fontWeight: '600' }} align="center">Remarks</TableCell>}
                        {searchParams.get('table') === 'deferred-production' && <> <TableCell style={{ fontWeight: '600' }} align="center">Deferment Category</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Deferment Description</TableCell></>}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Object.values(wellTestResult?.wellTestResultData || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((well, i) => {
                        return <TableRow>
                            <TableCell align="center">{well?.productionString}
                            </TableCell>
                            <TableCell align="center">
                                {well?.reservoir}
                            </TableCell>
                            <TableCell align="center">
                                {dayjs(well?.endDate).diff(well?.startDate, "hours")}

                            </TableCell>
                            <TableCell align="center">{well?.gross}</TableCell>
                            {/* <TableCell align="center">{well?.bsw}</TableCell> */}
                            <TableCell align="center">{well?.oilRate}</TableCell>
                            <TableCell align="center">{well?.gasRate}</TableCell>
                            {searchParams.get('table') === 'actual-production' && <TableCell style={{ color: 'white', background: '#A0E967' }} align="center">

                                {'Producing'}
                            </TableCell>}
                            {searchParams.get('table') === 'actual-production' && <TableCell rowSpan={1} align="center">{'Hi, This is a remark. Please make a remark here'}</TableCell>}
                            {
                                searchParams.get('table') === 'deferred-production' && <> <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                                    <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell></>
                            }
                        </TableRow>
                    })}

                </TableBody>

            </Table>
        </TableContainer >

    );
}