import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'


export default function OilGasAccountingIPSCTable({ IPSC }) {
    // const [searchParams,] = useSearchParams()
    // const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { id: searchParams.get('id'), setupType: 'oilAndGasAccounting' } })
    // const { data: IPSCs } = useFetch({ firebaseFunction: 'getSetups', payload: { id: searchParams.get('id'), setupType: 'IPSC' } })

    // const matchingIPSC = useMemo(() => {
    //     return IPSCs.find(IPSC => IPSC.asset === res.asset && IPSC.month === dayjs().format("YYYY-MM"))
    // }, [res, IPSCs])

    // const { data: wellTestResult } = useFetch({ firebaseFunction: 'getSetup', payload: { id: matchingIPSC?.wellTestResult1?.id, setupType: 'wellTestResult', }, dontFetch: !matchingIPSC?.wellTestResult1?.id })
    // console.log(wellTestResult)

    return (
        <TableContainer className={`m-auto border  ${tableStyles.borderedMuiTable}`}>
            <Table sx={{ minWidth: 700 }} >
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
                        <TableCell style={{ fontWeight: '600' }} align="center">BS&W<br />  (bbls)</TableCell>
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
                                {well?.fthp}
                            </TableCell>
                            <TableCell align="center">{well?.chp}</TableCell>
                            <TableCell align="center">{well?.flp}</TableCell>
                            {/* <TableCell align="center">{well?.mlp}</TableCell> */}
                            <TableCell align="center">
                                {well?.staticPressure}
                            </TableCell>
                            {/* <TableCell align="center">{well?.lp}</TableCell> */}
                            <TableCell align="center">{well?.chokeSize}</TableCell>
                            {/* <TableCell align="center">{well?.whTemperature}</TableCell> */}
                            {/* <TableCell align="center">{well?.CITHP}</TableCell> */}
                            <TableCell align="center">{well?.gross}</TableCell>
                            <TableCell align="center">{well?.bsw}</TableCell>
                            <TableCell align="center">{well?.oilRate}</TableCell>
                            <TableCell align="center">{well?.gasRate}</TableCell>
                        </TableRow>
                    })}
                </TableBody>

            </Table>
        </TableContainer>
    );
}