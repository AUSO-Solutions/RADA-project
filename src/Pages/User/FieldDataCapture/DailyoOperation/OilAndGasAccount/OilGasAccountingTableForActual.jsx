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
import { firebaseFunctions } from 'Services';
import { toast } from 'react-toastify';
import { Button } from 'Components';
import { roundUp, sum } from 'utils';

export default function OilGasAccountingTableForActual({ IPSC, flowStation, date = '' }) {
    const [searchParams] = useSearchParams()
    // const statusArray = ['Producing', 'Closed In']
    const defermentCategoryArray = ['Scheduled Deferment', 'Unscheduled Deferment', 'Third-Party Deferment', 'N/A']
    // const defermentDescriptionArray = ['Export Line Sabotage/ Leak', 'Flow station Engine Failure', 'Flowline Leak', 'Flow Station Trip', 'Logistic Problem']
    const Description = {
        'Scheduled Deferment': [
            'Well Test', 'Wellhead Maintenance', 'Flowline Maintenance', 'Bean Change / Check', 'Well Services', 'Data Acquisition', 'Facility Shutdown'
        ],
        'Unscheduled Deferment': [
            'Engine Failure', 'Pump Failure', 'Well No - Flow', 'Mismatch'
        ],
        'Third-Party Deferment': [
            'TFP Outage', 'Export Line Issues', 'Flowline Issue', 'Ovade GP', 'Community Interruption'
        ],

    }

    const [wellTestResultData, setWellTestResultData] = useState({})
    const [results, setResults] = useState(null)

    useEffect(() => {
        if (!results) {
            setWellTestResultData(IPSC?.wellTestResultData)
            setWellTestResultData(prev => {
                let updated = IPSC?.wellTestResultData
                for (const key in IPSC?.wellTestResultData) {
                    updated[key].defermentCategory = 'Unscheduled Deferment'
                    updated[key].defermentSubCategory = 'Mismatch'
                    updated[key].uptimeProduction = '0'
                    updated[key].remark = ''
                }
                return updated
            })
        }
        console.log('-----')
    }, [IPSC, results])

    // const viewPotential = () => {
    //     setCalculated(!calculated)
    //     setWellTestResultData(IPSC?.wellTestResultData)
    // }
    const viewResult = async (type) => {
        try {
            if (!flowStation) {
                toast.error('Flowstation must be provided')
                return
            }
            const payload = {
                flowStation: flowStation,
                date: dayjs(date).format('YYYY-MM-DD'),
                asset: IPSC.asset,
                type,
                potentialTestData: Object.values(IPSC?.wellTestResultData || {}).map(result => ({
                    productionString: result?.productionString,
                    gross: result?.gross || 0,
                    oilRate: result?.oilRate || 0,
                    gasRate: result?.gasRate || 0,
                    bsw: result?.bsw || 0,
                    reservoir: result?.reservoir,
                    uptimeProduction: wellTestResultData?.[result?.productionString]?.uptimeProduction || 0,
                    // downtime: 24 - wellTestResultData?.[result?.productionString]?.uptimeProduction || 0,
                    status: result?.status,
                    defermentCategory: wellTestResultData?.[result?.productionString]?.defermentCategory,
                    defermentSubCategory: wellTestResultData?.[result?.productionString]?.defermentSubCategory,
                    remark: wellTestResultData?.[result?.productionString]?.remark
                }))
            };
            // console.log(payload)
            const { data } = await firebaseFunctions('processIPSC', payload, false, { loadingScreen: true })
            setResults(JSON.parse(data))
            console.log(JSON.parse(data))
            toast.success(`Data ${type}d successfully!`)
        } catch (error) {
            console.log(error)
            toast.error(error?.message)
        }
    }

    const onSave = (e) => {
        e.preventDefault()
        viewResult('save')
    }
    const onCalculate = () => {
        viewResult('calculate')
    }


    const getTotalOf = (key) => {
        const res = Object.values(wellTestResultData || {})
        const total = sum(res?.map(item => parseFloat(item?.[key] || 0)))
        return total
    }

    useEffect(() => {
        if (results) {
            console.log({ results })
            const actualProduction = results?.actualProduction || []
            const deferment = results?.deferment?.drainagePoints || []
            if (searchParams.get('table') === 'actual-production') {
                // console.log(deferment)
                const res = Object.fromEntries(actualProduction.map(data => {
                    const thisDeferment = deferment?.find(defermentData => defermentData?.productionString === data?.productionString)
                    // console.log({ thisDeferment })
                    return [data?.productionString, {
                        ...wellTestResultData[data?.productionString],
                        defermentCategory: thisDeferment?.defermentCategory,
                        defermentSubCategory: thisDeferment?.defermentSubCategory,
                        ...data
                    }]
                }))
                // console.log(res)
                setWellTestResultData(res)
            }
            if (searchParams.get('table') === 'deferred-production') {
                const res = Object.fromEntries(deferment.map(data => {
                    return [data?.productionString, { ...wellTestResultData[data?.productionString], ...data }]
                }))
                setWellTestResultData(res)
            }
        }
        // eslint-disable-next-line
    }, [results, searchParams])

    useEffect(() => {
        const getSavedResult = async () => {
            setResults(null)
            try {
                const res = await firebaseFunctions('getOilAndGasAccounting', { asset: IPSC?.asset, flowStation, date }, false, { loadingScreen: true })
                const account = (JSON.parse(res?.data))
                const savedResult = {
                    actualProduction: account?.actualProduction?.productionData,
                    deferment: account?.deferment?.deferment
                }
                // console.log({savedResult})actualProduction
                if (res) setResults(savedResult)
            } catch (error) {
                setResults(null)
            }
        }
        getSavedResult()
    }, [IPSC, flowStation, date, searchParams])

    // console.log(results)
    return (
        <TableContainer sx={{ maxHeight: 700 }} component={'form'} onSubmit={onSave} className={`m-auto  ${tableStyles.borderedMuiTable}`}>
            <Table stickyHeader sx={{ minWidth: 700 }} >
                <TableHead >
                    <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >
                            Flow stations ID
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                            {searchParams.get('table') === 'deferred-production' ? "Downtime" : "Uptime"} Production
                        </TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={searchParams.get('table') === 'actual-production' ? 9 : 7} >
                            {searchParams.get('table') === 'actual-production' && "Actual Production "}
                            {searchParams.get('table') === 'deferred-production' && "Deferred Production "}
                            {/* <Text size={14} onClick={viewPotential} className={'cursor-pointer'} color='blue'>View Test Data</Text> */}
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
                        {searchParams.get('table') === 'actual-production' && <TableCell style={{ fontWeight: '600' }} align="center">Water rate<br />  (bbls)</TableCell>}
                        {searchParams.get('table') === 'actual-production' && <TableCell style={{ fontWeight: '600' }} align="center">Status</TableCell>}
                        <> <TableCell style={{ fontWeight: '600' }} align="center">Deferment Category</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Deferment Description</TableCell></>
                        {searchParams.get('table') === 'actual-production' && <TableCell style={{ fontWeight: '600' }} align="center">Remarks</TableCell>}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Object.values(wellTestResultData || {})?.sort((a, b) => a?.productionString - b?.productionString)?.map((well, i) => {
                        const handleChange = (e) => {
                            const name = e.target.name
                            const value = e.target.value
                            let status = name === 'uptimeProduction' ? { status: parseInt(value) === 0 ? 'Closed In' : 'Producing' } : {}
                            console.log({ name, value })
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
                            {searchParams.get('table') === 'actual-production' && <TableCell align="center">
                                <input onChange={handleChange} step={'any'} value={well?.uptimeProduction} required name='uptimeProduction' className='border outline-none px-2 w-[100px] text-center' type='number' max={24} min={0} />
                            </TableCell>}
                            {searchParams.get('table') === 'deferred-production' && <TableCell align="center">
                                <input disabled value={well?.downtime} required className='border outline-none px-2 w-[100px] text-center' type='number' max={24} min={0} />
                            </TableCell>}
                            <TableCell align="center">{roundUp(results ? well?.gross || 0 : 0)}</TableCell>
                            <TableCell align="center">{roundUp(results ? well?.oil || 0 : 0)}</TableCell>
                            <TableCell align="center">{roundUp(results ? well?.gas || 0 : 0)}</TableCell>
                            {searchParams.get('table') === 'actual-production' && <TableCell align="center">{roundUp(results ? well?.water || 0 : 0)}</TableCell>}
                            {searchParams.get('table') === 'actual-production' && <TableCell style={{ color: 'white', fontWeight: "600", background: parseInt(well?.uptimeProduction) === 0 || !well?.uptimeProduction ? '#FF5252' : '#A0E967' }} align="center">
                                {(parseInt(well?.uptimeProduction) === 0 || !well?.uptimeProduction) ? 'Closed In' : 'Producing'}
                            </TableCell>}

                            {
                                <> <TableCell style={{ background: '#D9E3F9' }} align="center">
                                    {/* {well?.defermentCategory}  */}
                                    <select disabled={searchParams.get('table') === 'deferred-production'} className='bg-[inherit] outline-none' value={well?.defermentCategory} defaultValue='Unscheduled Deferment' onChange={handleChange} name='defermentCategory' >
                                        {defermentCategoryArray?.map(category => <option value={category}>{category}</option>)}
                                    </select>
                                </TableCell>
                                    <TableCell style={{ background: '#E6E4F9' }} align="center">
                                        <select disabled={searchParams.get('table') === 'deferred-production'} className='bg-[inherit] outline-none' name='defermentSubCategory' value={well.defermentSubCategory} onChange={handleChange}>
                                            {Description[well?.defermentCategory]?.map(desc => <option value={desc}>{desc}</option>)}
                                        </select>
                                    </TableCell></>
                            }           {searchParams.get('table') === 'actual-production' && <TableCell rowSpan={1} align="center">
                                <textarea onChange={handleChange} name='remark' className='border outline-none p-2' value={well?.remark}>

                                </textarea>
                            </TableCell>}
                        </TableRow>
                    })}

                    <TableRow sx={{ backgroundColor: '#00A3FF4D' }}>
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={3} >Totals </TableCell>
                        {/* <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('uptimeProduction')}</TableCell> */}
                        <TableCell style={{ fontWeight: '600' }} align="center">{results ? getTotalOf('gross') : 0}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center">{results ? getTotalOf('oil') : 0}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >{results ? getTotalOf('gas') : 0}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >{results ? getTotalOf('water') : 0}</TableCell>
                        {/* <TableCell style={{ fontWeight: '600' }} align="center" >{results ? getTotalOf('gross') - getTotalOf('oil') : 0} </TableCell> */}
                        <TableCell style={{ fontWeight: '600' }} align="center" colSpan={5}></TableCell>
                        {/* <TableCell style={{ fontWeight: '600' }} align="center" >-</TableCell> */}
                        {/* <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('bsw')}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('oilRate')}</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('gasRate')}</TableCell> */}

                    </TableRow>

                </TableBody>

            </Table>
            <div className='justify-end flex gap-2 my-2'>
                <Button className={'my-3'} type='button' onClick={onCalculate} width={150}>Calculate</Button>
                <Button className={'my-3'} type='submit' width={150}>Save</Button>
            </div>
        </TableContainer >

    );
}