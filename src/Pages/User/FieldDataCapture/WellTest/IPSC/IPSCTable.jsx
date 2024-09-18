import React, { useState, useEffect, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'
import RadaSwitch from 'Components/Input/RadaSwitch';
import { ArrowBack, ArrowRight } from '@mui/icons-material';
import Text from 'Components/Text';
import { Button, Input } from 'Components';
import { Setting2 } from 'iconsax-react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';
import dayjs from 'dayjs';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { BsThreeDots } from 'react-icons/bs';
import { createWellTitle, getWellLastTestResult } from 'utils';
import IPSCAnalytics from './IPSCAnalytics';
import ToleranceSettiings from './ToleranceSettiings';
import { firebaseFunctions } from 'Services';

// const TableInput = (props) => {
//     return <input className='p-1 text-center w-[80px] h-[100%] border outline-none ' required {...props} />
// }

const SaveAs = ({ defaultValue, onSave = () => null, loading }) => {
    const [title, setTitle] = useState(defaultValue)
    return <div className='bg-[white] w-[400px]'>
        <Text size={24}>Save Well Test Result as</Text>
        <Input defaultValue={defaultValue} className='w-full' onChange={(e) => setTitle(e.target.value)} />
        <Button loading={loading} className='float-right mt-4' onClick={() => {
            onSave(title)
        }} width={100}>
            Save
        </Button>
    </div>
}

export default function IPSCTable() {

    const { search } = useLocation()
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [ipscData, setIpscData] = useState({})
    const id = useMemo(() => new URLSearchParams(search).get('id'), [search])
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'IPSC', id: id } })
    useEffect(() => { setIpscData(res) }, [res])
    const { data: wellTestResult___ } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'wellTestResult', id: res?.wellTestResult1?.id, }, dontFetch: !res?.wellTestResult1?.id })
    const { data: wellTestResults } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: 'wellTestResult', } })
    const [showSettings, setShowSettings] = useState(false)
    const [wellTestResult, setWellTestResult] = useState(wellTestResult___)
    useEffect(() => { setWellTestResult(wellTestResult___) }, [wellTestResult___])

    const bringForward = (wellTestResults, wellTestResult, productionString) => {
        const data = getWellLastTestResult(wellTestResults, wellTestResult, productionString)
        console.log(data, wellTestResult)
        setIpscData(prev => {
            return {
                ...prev, wellTestResultData: {
                    ...prev.wellTestResultData,
                    [productionString]: data.productionStringData
                }
            }
        })
    }


    const save = async (title) => {
        if (!title) {
            toast.info('Please provide a title')
            return;
        }
        setLoading(true)
        try {
            // console.log(wellTestResult?.wellTestResultData)

            // if (isEdit) {
            const payload = { title: title, setupType: 'IPSC', wellTestResultData: ipscData?.wellTestResultData, id }
            console.log(payload)
            await firebaseFunctions('updateSetup', payload)
            // } else {
            //     const payload = { title, asset: wellTest?.asset, field: wellTest?.field, wellTestScheduleId: wellTest?.id, setupType: 'wellTestResult', wellTestResultData: wellTestResult }
            //     console.log(payload)
            //     await firebaseFunctions('createSetup', payload)

            // }
            dispatch(closeModal())
            toast.success('Data saved to IPSC')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fields = [
        { name: 'gross', type: "number" },
        { name: 'oilRate', type: "number" },
        { name: 'waterRate', type: "number" },
        { name: 'gasRate', type: "number" },
        { name: 'bsw', type: "number" },
        { name: 'wgr', type: "number" },
        { name: 'gor', type: "number" },
        // { name: 'totalGas', type: "number" },
        { name: 'fthp', type: "number" },
        { name: 'flp', type: "number" },
        { name: 'chp', type: "number" },
        { name: 'staticPressure', type: "number" },
        { name: 'orificePlateSize', type: "number" },
        { name: 'sand', type: "number" },
    ]

    return (
        < div className=' w-[80vw] px-3'>
            {showSettings && <ToleranceSettiings onClickOut={() => setShowSettings(false)} />}
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 min-w-fit items-center'>
                    <Link to='/users/fdc/well-test-data/' className='flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md' >
                        <ArrowBack />
                        <Text>Files</Text>
                    </Link>
                    <RadaSwitch label="Edit Table" labelPlacement="left" />
                </div>
                <Text display={'block'} className={'w-full'} align={'center'}> {createWellTitle(ipscData)}</Text>

                <div className='flex justify-end py-2 items-center gap-3'>

                    {
                        searchParams.get('show-analytics') && <div onClick={() => setSearchParams(prev => {
                            if (prev.get('show-tolerance')) prev.delete('show-tolerance')
                            else { prev.set('show-tolerance', 'yes') }
                            return prev
                        })} className='bg-[#E0E0E0] text-[#4E4E4E] cursor-pointer float-right rounded min-w-fit px-2 py-1' >
                            {searchParams.get('show-tolerance') ? 'Hide' : 'Show'}  Tolerance
                        </div>
                    }
                    <div onClick={() => setSearchParams(prev => {
                        if (prev.get('show-analytics')) prev.delete('show-analytics')
                        else { prev.set('show-analytics', 'yes') }
                        return prev
                    })} className='bg-[#E0E0E0] text-[#4E4E4E] cursor-pointer float-right rounded min-w-fit px-2 py-1' >
                        {searchParams.get('show-analytics') ? 'Hide' : 'Show'} Analytics
                    </div>
                    <div className='border border-[#00A3FF] px-3 py-1 rounded-md' onClick={() => setShowSettings(prev => !prev)} >
                        <Setting2 color='#00A3FF' />
                    </div>
                </div>
            </div>

            {searchParams.get('show-analytics') ?
                <IPSCAnalytics /> :

                <TableContainer className={`m-auto border  pr-5 ${tableStyles.borderedMuiTable}`}>
                    <Table sx={{ minWidth: 700 }} >
                        <TableHead>
                            <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >Field 1</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Choke </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Latest Test Date  </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Fluid Type  </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Prod. Method</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Gross</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Oil Rate</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Water Rate</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} > Gas Rate</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >BS&W</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >WGR</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >GOR</TableCell>
                                {/* <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Total Gas</TableCell> */}
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FTHP</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FLP</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >CHP</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Static Pressure</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Orifice Plate Size</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Sand</TableCell>
                                <TableCell style={{ fontWeight: '600', height: '100%' }} align="center" colSpan={3} >Remark</TableCell>
                                <TableCell style={{ fontWeight: '600', height: '100%' }} align="center" colSpan={1} ><ArrowRight /></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ fontWeight: '600' }} align="center" >Reservoir </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" >Production string </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Size(64")</TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(blpd)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(bopd)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(bwpd)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(MMscf/day)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(%)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Stb/MMscf)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Scf/Stb)</TableCell>
                                {/* <TableCell style={{ fontWeight: '600' }} align="center">(MMscf/day)</TableCell> */}
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(Inches)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">(pptb)</TableCell>
                                <TableCell style={{ fontWeight: '600', minWidth: '200px' }} colSpan={3} align="center"></TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                Object.values(ipscData?.wellTestResultData || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((well, i) => {

                                    return <TableRow key={well?.productionString}>
                                        <TableCell align="center">
                                            {well?.reservoir}
                                        </TableCell>
                                        <TableCell align="center">
                                            {well?.productionString}
                                        </TableCell>
                                        <TableCell align="center">
                                            {well?.chokeSize}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dayjs(well?.endDate).format("DD/MMM/YYYY")}
                                        </TableCell>
                                        <TableCell align="center">
                                            {well?.fluidType}
                                        </TableCell>
                                        <TableCell align="center">
                                            NF
                                        </TableCell>
                                        {
                                            fields.map(field => <TableCell align="center">
                                                {well?.[field.name] ?? "-"}
                                                {/* <TableInput type='number' defaultValue={well?.[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} /> */}
                                            </TableCell>)
                                        }
                                        <TableCell align="center" sx={{ minWidth: '200px' }} colSpan={3}>
                                            {well?.remark || "No remark"}
                                            {/* <textarea defaultValue={well.remark} onChange={(e) => handleChange("remark", e.target.value)} className='border outline-none p-1' rows={2} cols={20}>
                                        </textarea> */}
                                        </TableCell>
                                        <TableCell align="center" colSpan={1}>
                                            {
                                                well?.isSelected ? '-' : <BsThreeDots onClick={() => bringForward(wellTestResults, wellTestResult, well.productionString)} className='cursor-pointer' />
                                            }

                                        </TableCell>
                                    </TableRow>
                                })
                            }

                        </TableBody>

                    </Table>
                </TableContainer>}
            {!searchParams.get('show-analytics') && <div className='flex justify-end py-2'>
                <Button width={120} onClick={() => {
                    dispatch(openModal({ component: <SaveAs defaultValue={res?.title} onSave={save} loading={loading} /> }))
                }} >Commit</Button>
            </div>}
        </div>
    );
}