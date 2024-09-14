import React, { useState, useEffect, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'
import { useSearchParams } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';

import { createWellTitle } from 'utils';

export default function IPSCAnalytics() {

    const [searchParams,] = useSearchParams()
    // const { search } = useLocation()
    const [ipsc, setIpscData] = useState({})
    const id = searchParams.get('id')
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'IPSC', id: id } })
    useEffect(() => { setIpscData(res) }, [res])
    const { data: wellTestResult1 } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'wellTestResult', id: res?.wellTestResult1?.id, }, dontFetch: !res?.wellTestResult1?.id })
    const { data: wellTestResult2 } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'wellTestResult', id: res?.wellTestResult2?.id, }, dontFetch: !res?.wellTestResult2?.id })
    const showTolerance = useMemo(() => searchParams.get('show-tolerance'), [searchParams])



    const diff = (value1 = 0, value2 = 0) => {
        return Math.abs(parseFloat(value1) - parseFloat(value2))
    }


    const fields = [
        { title: "Gross", name: 'gross', type: "number", unit: 'blpd' },
        { title: "Oil Rate", name: 'oilRate', type: "number", unit: "bopd" },
        { title: "Water Rate", name: 'waterRate', type: "number", unit: "bwpd" },
        { title: "Gas Rate", name: 'gasRate', type: "number", unit: "MMscf/day" },
        { title: "BSW", name: 'bsw', type: "number", unit: "%" },
    ]

    return (
        < >

            <TableContainer className={`m-auto border  pr-5 ${tableStyles.borderedMuiTable}`}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead>
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }} align="center" > </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" > </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={fields.length}> {createWellTitle(wellTestResult1)} </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={fields.length}>
                                {showTolerance ? "% Tolerance" : createWellTitle(wellTestResult2)}
                            </TableCell>

                        </TableRow>
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Reservoir</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Production String</TableCell>
                            {
                                fields.map(field => {
                                    return <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} > {field.title} <br /> ({field.unit}) </TableCell>
                                })
                            }
                            {
                                fields.map(field => {
                                    return showTolerance ? <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} > {field.title} <br /> (%Difference) </TableCell>
                                        : <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} > {field.title} <br /> ({field.unit}) </TableCell>
                                })
                            }
                        </TableRow>

                    </TableHead>
                    <TableBody>
                        {
                            Object.values(wellTestResult1?.wellTestResultData || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((well, i) => {

                                return <TableRow key={well?.productionString}>
                                    <TableCell align="center">
                                        {well?.reservoir}
                                    </TableCell>
                                    <TableCell align="center">
                                        {well?.productionString}
                                    </TableCell>
                                    {
                                        fields.map(field => <TableCell align="center">
                                            {well?.[field.name] ?? "-"}

                                        </TableCell>)
                                    }
                                    {
                                        fields.map(field => {
                                            const difference = diff(well?.[field.name], wellTestResult2?.wellTestResultData?.[well.productionString]?.[field.name])
                                            const tolerate = (ipsc?.toleranceValues?.[field.name] ?? 0 ) > difference
                                            return showTolerance ?
                                                <TableCell  style={{ backgroundColor: tolerate ? '#FF5252' : '#A7EF6F', width: '97%', height: '97% !important'  }} align="center">
                                                    <div style={{ backgroundColor: tolerate ? '#FF5252' : '#A7EF6F', width: '97%', height: '97% !important'  }}>
                                                        {difference ?? "-"}</div>
                                                </TableCell>
                                                :
                                                <TableCell align="center">{wellTestResult2?.wellTestResultData?.[well.productionString]?.[field.name] ?? "-"}
                                                </TableCell>
                                        })
                                    }


                                </TableRow>
                            })
                        }

                    </TableBody>

                </Table>
            </TableContainer>

        </>
    );
}