import React, { useEffect, useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'
import RadaSwitch from 'Components/Input/RadaSwitch';
import { ArrowBack } from '@mui/icons-material';
import Text from 'Components/Text';
import { Button, Input } from 'Components';
import { Setting2 } from 'iconsax-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';
import dayjs from 'dayjs';
import { firebaseFunctions } from 'Services';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Actions from 'Partials/Actions/Actions';
import { createWellTitle, genRandomNumber } from 'utils';
import { Approve } from 'Partials/Actions/Approve';
import { Query } from 'Partials/Actions/Query';
import ExtractWellTest from './ExtractWellTest';
import MerChart from './MerChart';


const SaveAs = ({ defaultValue, onSave = () => null, loading }) => {
    const [title, setTitle] = useState(defaultValue)
    return <div className='bg-[white] w-[400px]'>
        <Text size={24}>Save MER Result as</Text>

        <Input defaultValue={defaultValue} className='w-full' onChange={(e) => setTitle(e.target.value)} />
        <Button loading={loading} className='float-right mt-4' onClick={() => {
            onSave(title)
        }} width={100}>
            Save
        </Button>
    </div>
}


const TableInput = ({ type = 'number', onChange = () => null, ...props }) => {
    return <input type={type} className='py-2 !border-none' onChange={onChange} {...props} />
}

export default function MERDataTable() {

    const { search } = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    // const [merSchedule, setMerSchedule] =  useState({})
    const [merResult, setMerResult] = useState({})
    const id = useMemo(() => new URLSearchParams(search).get('id'), [search])
    const scheduleId = useMemo(() => new URLSearchParams(search).get('scheduleId'), [search])
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'merSchedule', id: scheduleId || id } })
    const { data: res2 } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'merResult', id }, dontFetch: !id })
    const [title, setTitle] = useState('')
    const isEdit = useMemo(() => { return !scheduleId }, [scheduleId])
    const [showChart, setShowChart] = useState(false)
    useEffect(() => {
        console.log(res)
        if (res) setMerResult({
            title: res?.title,
            merResultData: res?.merScheduleData,
            field: res?.field,
            scheduleId: res?.id,
            asset: res?.asset
        })
    }, [res])

    useEffect(() => { if (isEdit) setMerResult(res2); setTitle(res2?.title) }, [res2, isEdit])
    // useEffect(() => {
    //     const chokeFields = ['gross', 'oilRate', 'bsw', 'gor', 'gasRate', 'sand', 'fthp']
    //     const extraFields = ['drawdown', 'api', 'mer']
    //     setMerResult(prev => {
    //         let updates = {}
    //         const productionStrings = Object.values(prev.merResultData || {})
    //         productionStrings.forEach(productionString => {
    //             const randomExtraValues = Object.fromEntries(extraFields.map(extraField => ([extraField, genRandomNumber()])))
    //             updates[productionString?.productionString] = {
    //                 ...productionString,
    //                 ...randomExtraValues,
    //                 chokes: productionString.chokes.map(choke => {
    //                     const randomChokeValues = Object.fromEntries(chokeFields.map(chokeField => ([chokeField, genRandomNumber()])))
    //                     return { ...choke, ...randomChokeValues }
    //                 })
    //             }
    //         })
    //         return {
    //             ...prev,
    //             merResultData: updates
    //         }
    //     })

    // }, [res, res2])

    const save = async (title) => {
        if (!title) {
            toast.info('Please provide a title')
            return;
        }
        setLoading(true)
        try {
            if (isEdit) {
                const payload = { ...merResult, title, setupType: 'merResult', id, }
                console.log(payload)
                await firebaseFunctions('updateSetup', payload)
            } else {
                const payload = { ...merResult, title, setupType: 'merResult' }
                console.log(payload)
                const { data } = await firebaseFunctions('createSetup', payload)
                navigate(`/users/fdc/mer-data/mer-data-result-table?id=${data?.id}`)

            }
            dispatch(closeModal())
            toast.success('Data saved to MER test result')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');



    return (
        <>
            {showChart && <MerChart merResult={merResult} onClickOut={() => setShowChart(false)} />}
            < form className='w-[80vw] px-3' onSubmit={(e) => {
                e.preventDefault()
                dispatch(openModal({ component: <SaveAs defaultValue={res2?.title} onSave={save} loading={loading} /> }))

            }}>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 items-center'>
                        <Link to='/users/fdc/mer-data' className='flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md' >
                            <ArrowBack />
                            <Text>Files</Text>
                        </Link>
                        <RadaSwitch label="Edit Table" labelPlacement="left" />
                    </div>
                    <div className='flex justify-end py-2 items-center gap-3'>
                        <div className='flex gap-2' >
                            {<Actions merResult={merResult} title={title} actions={[
                                { name: 'Query Result', onClick: () => dispatch(openModal({ component: <Query /> })) },
                                { name: 'Approve', onClick: () => dispatch(openModal({ component: <Approve /> })) },
                                {
                                    name: 'Extract Well Test', onClick: () => {
                                        dispatch(openModal({
                                            component: <ExtractWellTest merResult={merResult}

                                            />
                                        }))
                                    }
                                }
                            ]} />}
                        </div>
                        <div className='border border-[#00A3FF] px-3 py-1 rounded-md' onClick={() => setShowChart(true)} >
                            <Setting2 color='#00A3FF' />
                        </div>
                    </div>
                </div>
                <div className='border rounded flex gap-3 p-2 my-2'>
                    {/* <Text>  MER schedule: {merResult?.title}</Text>
                <Text>Asset: {merResult?.asset}</Text> */}
                    {createWellTitle(merResult)}
                    {/* <Text>Field: {merResult?.field}</Text>  */}
                </div>
                <TableContainer className={`m-auto border  pr-5 ${tableStyles.borderedMuiTable}`}>
                    <Table sx={{ minWidth: 700 }} >
                        <TableHead>
                            <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >Field 1</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Choke </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={3} > Test Date  </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} ></TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Oil Rate</TableCell>

                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >BS&W</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Initial GOR</TableCell>

                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Current GOR</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Gas Rate</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Sandcut</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Initial Reservoir Pressure</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Current Reservoir Pressure</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FBHP</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FTHP</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >DrawDown</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >API</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Fluid Type</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >MER</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Remark</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: '600' }} align="center" >Reservoir </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" >Production string </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Size(64")</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Start Date</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">End Date</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Duration(HRS)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(blpd)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(bopd)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(%)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Scf/Stb)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Scf/Stb)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(MMscf/day)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Lb/Kbbls)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center"> </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center"> </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(bopd{/*  */}) </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center"> </TableCell>
                            </TableRow>
                        </TableHead>

                        {
                            Object.values(merResult?.merResultData || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((mer, i) => {
                                const handleChange = (name, value) => {
                                    setMerResult(prev => ({
                                        ...prev,
                                        merResultData: {
                                            ...prev?.merResultData,
                                            [mer?.productionString]: {
                                                ...prev?.merResultData?.[mer?.productionString],
                                                [name]: value
                                            }
                                        }
                                    }))
                                }
                                const handleExtraChange = (e) => { const name = e.target.name; const value = e.target.value; handleChange(name, value); }
                                const chokes = mer?.chokes
                                const handleChokeItemChange = (e, i) => {
                                    const name = e.target.name
                                    const value = e.target.value
                                    let newChokeValues = chokes
                                    newChokeValues[i][name] = value
                                    handleChange('chokes', newChokeValues)
                                }


                                return <TableBody className={tableStyles.tableBody}>
                                    <TableRow key={mer?.productionString}>
                                        <TableCell rowSpan={4} align="center">
                                            {mer?.reservoir}
                                        </TableCell>
                                        <TableCell rowSpan={4} align="center">
                                            {mer?.productionString}
                                        </TableCell>
                                        <TableCell align="center" className={tableStyles.cellNoPadding}>
                                            {chokes?.map((choke, i) =>
                                                (<div className={`border-b py-2`}>{choke?.chokeSize}</div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={tableStyles.cellNoPadding}>
                                            {chokes?.map((choke, i) =>
                                            (<div className={`border-b py-2`}>
                                                <TableInput onChange={(e) => setStartDate({ startDate: e.target.value })} type='date' defaultValue={dayjs(choke?.startDate).format("YYYY-MM-DD")} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={tableStyles.cellNoPadding}>
                                            {chokes?.map((choke, i) =>
                                            (<div className={`border-b py-2`}>
                                                <TableInput onChange={(e) => setEndDate({ endDate: e.target.value })} type='date' defaultValue={dayjs(choke?.endDate).format("YYYY-MM-DD")} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={tableStyles.cellNoPadding}>
                                            {chokes?.map((choke, i) =>
                                                (<div className={`border-b py-2`}>{dayjs(choke?.endDate).diff(choke?.startDate, "hours")}</div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            {chokes?.map((choke, i) =>
                                            (<div className='border-b'>
                                                <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='gross' defaultValue={choke?.gross} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            {chokes?.map((choke, i) =>
                                            (<div className='border-b'>
                                                <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='oilRate' defaultValue={choke?.oilRate} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            {chokes?.map((choke, i) =>
                                            (<div className='border-b'>
                                                <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='bsw' defaultValue={choke?.bsw} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='initialGor' defaultValue={mer?.initialGor} />
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            {chokes?.map((choke, i) =>
                                            (<div className='border-b'>
                                                <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='gor' defaultValue={choke?.gor} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            {chokes?.map((choke, i) =>
                                            (<div className='border-b'>
                                                <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='gasRate' defaultValue={choke?.gasRate} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            {chokes?.map((choke, i) =>
                                            (<div className='border-b'>
                                                <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='sand' defaultValue={choke?.sand} />
                                            </div>)
                                            )}
                                        </TableCell>

                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='initialReservoirPressure' defaultValue={mer?.initialReservoirPressure} />
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='currentReservoirPressure' defaultValue={mer?.currentReservoirPressure} />
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='fbhp' defaultValue={mer?.fbhp} />
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            {chokes?.map((choke, i) =>
                                            (<div className='border-b'>
                                                <TableInput onChange={(e) => handleChokeItemChange(e, i)} name='fthp' defaultValue={choke?.fthp} />
                                            </div>)
                                            )}
                                        </TableCell>
                                        <TableCell align="center" >
                                            <TableInput type='number' className='p-3 outline-none h-full' onChange={handleExtraChange} name='drawdown' defaultValue={mer?.currentReservoirPressure - mer?.fbhp} />
                                        </TableCell>
                                        <TableCell align="center" >
                                            <TableInput type='number' className='p-3 outline-none h-full' onChange={handleExtraChange} name='api' defaultValue={mer?.api} />
                                        </TableCell>
                                        <TableCell align="center" >
                                            <select className='p-3 outline-none h-full' onChange={handleExtraChange} name='fluidType' defaultValue={mer?.fluidType} >
                                                <option value=""></option>
                                                <option value="Oil">Oil</option>
                                                <option value="Gas">Gas</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="center" >
                                            <TableInput type='number' className='p-3 outline-none h-full' onChange={handleExtraChange} name='mer' defaultValue={mer?.mer} />
                                        </TableCell>

                                        <TableCell align="center" sx={{ minWidth: '200px' }} colSpan={3}>
                                            <textarea defaultValue={mer.remark} onChange={handleExtraChange} name='remark' className='border outline-none p-1' rows={2} cols={20}>
                                            </textarea>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            })
                        }

                    </Table>
                </TableContainer>
                <div className='flex justify-end py-2'>
                    <Button width={120} type='submit' >Commit</Button>
                </div>
            </form></>
    );
}