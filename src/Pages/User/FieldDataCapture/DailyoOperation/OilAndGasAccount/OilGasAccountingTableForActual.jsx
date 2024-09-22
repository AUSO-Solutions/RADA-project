import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import tableStyles from '../table.module.scss'
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import Text from 'Components/Text';
import { firebaseFunctions } from 'Services';
import { toast } from 'react-toastify';
import { Button } from 'Components';

export default function OilGasAccountingTableForActual({ IPSC, flowStation, date = '' }) {
    const [searchParams] = useSearchParams()
    // const statusArray = ['Producing', 'Closed In']
    // const defermentCategoryArray = ['Scheduled Deferment', 'Unscheduled Deferment', 'Third-Party Deferment', 'N/A']
    // const defermentDescriptionArray = ['Export Line Sabotage/ Leak', 'Flow station Engine Failure', 'Flowline Leak', 'Flow Station Trip', 'Logistic Problem']
    const [wellTestResultData, setWellTestResultData] = useState({})
    const [calculated, setCalculated] = useState(false)
    const [, setResults] = useState({})

    useEffect(() => {
        setWellTestResultData(IPSC?.wellTestResultData)
    }, [IPSC])

    const viewPotential = () => {
        setCalculated(!calculated)
        setWellTestResultData(IPSC?.wellTestResultData)
    }
    const viewResult = async () => {
        try {
            if (!flowStation) {
                toast.error('Flowstation must be provided')
                return
            }
            // if (!date) {
            //     toast.error('Date must be provided')
            //     return
            // }
            const payload = {
                flowStation: flowStation,
                date: dayjs(date).format("DD/MM/YYYY"),
                asset: IPSC.asset,

                potentialTestData: Object.values(wellTestResultData || {}).map(result => ({
                    productionString: result?.productionString,
                    gross: result?.gross || 1,
                    oilRate: result?.oilRate || 1,
                    gasRate: result?.gasRate || 1,
                    reservoir: result?.reservoir,
                    uptimeProduction: dayjs(result?.endDate).diff(result?.startDate, "hours"),
                    status: result?.status || 'Producing'
                }))
            };
            console.log(payload)
            const { data } = await firebaseFunctions('processIPSC', payload)
            setResults(data)
            const actualProduction = (JSON.parse(data))?.actualProduction
            console.log(actualProduction)

            const res = Object.fromEntries(actualProduction.map(data => {
                return [data?.productionString, { ...wellTestResultData[data?.productionString], ...data }]
            }))
            setWellTestResultData(res)
            setCalculated(!calculated)
        } catch (error) {
            console.log(error)
        }
    }
    const calculate = e =>{
        e.preventDefault()
    }

    return (
        <TableContainer component={'form'} onSubmit={calculate} className={`m-auto  ${tableStyles.borderedMuiTable}`}>
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
                            {
                                calculated ?
                                    <>

                                        {searchParams.get('table') === 'actual-production' && "Actual Production "}
                                        {searchParams.get('table') === 'deferred-production' && "Deferred Production "}
                                        <Text size={14} onClick={viewPotential} className={'cursor-pointer'} color='blue'>View Test Data</Text>
                                    </>
                                    : <>

                                        Potential Test Data  <Text size={14} onClick={viewResult} className={'cursor-pointer'} color='blue'>View Result</Text>
                                    </>
                            }
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
                        <TableCell style={{ fontWeight: '600' }} align="center">Water rate<br />  (bbls)</TableCell>
                        {searchParams.get('table') === 'actual-production' && <TableCell style={{ fontWeight: '600' }} align="center">Status</TableCell>}
                        {searchParams.get('table') === 'actual-production' && <TableCell style={{ fontWeight: '600' }} align="center">Remarks</TableCell>}
                        {searchParams.get('table') === 'deferred-production' && <> <TableCell style={{ fontWeight: '600' }} align="center">Deferment Category</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Deferment Description</TableCell></>}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Object.values(wellTestResultData || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((well, i) => {
                        const handleChange = (e) => {
                            const name = e.target.name
                            const value = e.target.value
                            let status = name === 'uptimeProduction' ? { status: parseInt(value) === 0 ? 'Closed In' : 'Producing' } : {}
                            setWellTestResultData(prev => ({
                                ...prev,
                                [well?.productionString]: {
                                    ...well,
                                    ...status,
                                    [name]: value,
                                }
                            }))
                        }
                        return <TableRow>
                            <TableCell align="center">{well?.productionString}
                            </TableCell>
                            <TableCell align="center">
                                {well?.reservoir}
                            </TableCell>
                            <TableCell align="center">
                                {/* {well?.uptimeProduction || dayjs(well?.endDate).diff(well?.startDate, "hours")} */}
                                <input onChange={handleChange} defaultValue={0} required name='uptimeProduction' className='border outline-none px-2 w-[100px] text-center' type='number' max={24} min={0} />

                            </TableCell>
                            <TableCell align="center">{well?.gross}</TableCell>
                            {/* <TableCell align="center">{well?.bsw}</TableCell> */}
                            <TableCell align="center">{well?.oilRate}</TableCell>
                            <TableCell align="center">{well?.gasRate}</TableCell>
                            <TableCell align="center">{well?.waterRate}</TableCell>
                            {searchParams.get('table') === 'actual-production' && <TableCell style={{ color: 'white', fontWeight: "600", background: well?.status === 'Producing' ?  '#A0E967' : '#FF5252' }} align="center">
                                {well?.status || "Closed In"}
                                {/* <select name='status' className='p-3 outline-none' style={{ color: 'white', background: 'inherit' }} onChange={handleChange} >
                                    {
                                        statusArray.map(status => (<option value={status}>{status}</option>))
                                    }
                                </select> */}
                            </TableCell>}
                            {searchParams.get('table') === 'actual-production' && <TableCell rowSpan={1} align="center">{'No Remark'}</TableCell>}
                            {
                                searchParams.get('table') === 'deferred-production' && <> <TableCell style={{ background: '#D9E3F9' }} align="center">{'Scheduled Deferment'}</TableCell>
                                    <TableCell style={{ background: '#E6E4F9' }} align="center">{'N/A'}</TableCell></>
                            }
                        </TableRow>
                    })}

                </TableBody>

            </Table>
            <div className='justify-end flex my-2'>
          <Button className={'my-3'} type='submit' width={150}>Calculate</Button>
        </div>
        </TableContainer >

    );
}