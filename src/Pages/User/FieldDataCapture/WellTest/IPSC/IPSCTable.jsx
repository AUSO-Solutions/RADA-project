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
import { bsw, createWellTitle, getWellLastTestResult, sum } from 'utils';
import IPSCAnalytics from './IPSCAnalytics';
import ToleranceSettiings from './ToleranceSettiings';
import { firebaseFunctions } from 'Services';
import Actions from 'Partials/Actions/Actions';
import { Box, Tooltip } from '@mui/material';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';

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

    const [ipscData, setIpscData] = useState({})

    const [flowstationsTargets, setFlowstationTragets] = useState({})
    const [currFlowstation, setCurrFlowstation] = useState()
    useEffect(() => {
        setCurrFlowstation(ipscData?.flowstations?.[0])
    }, [ipscData?.flowstations])
    // console.log({ flowstationsTargets })
    const id = useMemo(() => new URLSearchParams(search).get('id'), [search])
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'IPSC', id: id } })
    // console.log(res)
    useEffect(() => { setIpscData(res); setFlowstationTragets(res?.flowstationsTargets) }, [res])
    const { data: wellTestResult___ } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'wellTestResult', id: res?.wellTestResult1?.id, }, dontFetch: !res?.wellTestResult1?.id })
    const { data: wellTestResults } = useFetch({ firebaseFunction: 'getSetups', payload: { setupType: 'wellTestResult', } })
    const [showSettings, setShowSettings] = useState(false)
    const [wellTestResult, setWellTestResult] = useState(wellTestResult___)
    useEffect(() => { setWellTestResult(wellTestResult___) }, [wellTestResult___])

    const bringForward = (wellTestResults, wellTestResult, productionString) => {
        const data = getWellLastTestResult(wellTestResults, wellTestResult, productionString)
        console.log(data)
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
        dispatch(setLoadingScreen({ open: true }))
        try {

            const arr = Object.values(flowstationsTargets || {})
            const len = arr.length
            const averageTarget = {
                gross: sum(arr.map(item => item?.gross || 0)) / len,
                oilRate: sum(arr.map(item => item?.oilRate || 0)) / len,
                gasRate: sum(arr.map(item => item?.gasRate || 0)) / len,
                exportGas: sum(arr.map(item => item?.exportGas || 0)) / len,
                fuelGas: sum(arr.map(item => item?.fuelGas || 0)) / len,
                gasFlaredUSM: sum(arr.map(item => item?.gasFlaredUSM || 0)) / len,
            }
            const payload = { title: title, setupType: 'IPSC', wellTestResultData: ipscData?.wellTestResultData, id, flowstationsTargets, averageTarget }
            // if (payload.totals.gasRate !== payload.totals.exportGas + payload.totals.gasFlaredUSM + payload.totals.fuelGas) {
            //     toast.error("Gas rate total must be equal to the summation of the gas types ")
            //     return
            // }
            console.log(payload)
            await firebaseFunctions('updateSetup', payload)
            dispatch(closeModal())
            toast.success('Data saved to IPSC')
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setLoadingScreen({ open: false }))
        }
    }

    const fields = [
        { name: 'gross', type: "number", fn: () => null },
        { name: 'oilRate', type: "number", fn: () => null },
        // { name: 'waterRate', type: "number",fn: () => null  },
        { name: 'waterRate', type: "number", fn: (value) => (value.gross || 0) - (value.oilRate || 0), disabled: true },
        { name: 'gasRate', type: "number", fn: () => null },
        { name: 'bsw', type: "number", fn: (value) => bsw({ gross: value.gross, oil: value.oilRate }) },
        { name: 'wgr', type: "number", fn: () => null },
        { name: 'gor', type: "number", fn: () => null },
        // { name: 'totalGas', type: "number",fn: () => null  },
        { name: 'fthp', type: "number", fn: () => null },
        { name: 'flp', type: "number", fn: () => null },
        { name: 'chp', type: "number", fn: () => null },
        { name: 'staticPressure', type: "number", fn: () => null },
        { name: 'orificePlateSize', type: "number", fn: () => null },
        { name: 'sand', type: "number", fn: () => null },
    ]
    const getTotalOf = (key, flowstation) => {
        const res = Object.values(ipscData?.wellTestResultData || {})?.filter(item => flowstation ? item?.flowstation === flowstation : true)
        const total = sum(res?.map(item => parseFloat(item?.[key] || 0)))
        return total
    }


    useEffect(() => {
        const ipscResults = Object.values(ipscData?.wellTestResultData || {})
        const flowstations = Array.from(new Set(ipscResults.map(item => item?.flowstation)))
        setFlowstationTragets((prev) => {
            let targets = {}
            flowstations.forEach((flowstation) => {
                const results = ipscResults?.filter(result => result.flowstation === flowstation)
                const getTotalOfinFlowstation = (key) => sum(results?.map(result => result?.[key] || 0))

                targets[flowstation] = {
                    ...prev?.[flowstation],
                    flowstation,
                    // target: {
                    oilRate: getTotalOfinFlowstation('oilRate'),
                    gasRate: getTotalOfinFlowstation('gasRate'),
                    gross: getTotalOfinFlowstation('gross'),
                    // }
                }
            })
            return targets
        })

    }, [ipscData?.wellTestResultData])
    // console.log(flowstationsTargets)
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
                </div>{currFlowstation}
                <Text display={'block'} className={'w-full'} align={'center'}> {createWellTitle(ipscData)}</Text>

                <div className='flex justify-end py-2 items-center gap-3'>
                    <Input type='select' placeholder='Flowstation'
                        onChange={e => setCurrFlowstation(e.value)}
                        containerClass={'!w-[250px]'} value={{ label: currFlowstation, value: currFlowstation }}
                        options={ipscData?.flowstations?.map(flowstation => ({ label: flowstation, value: flowstation }))} />


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
                                Object.values(ipscData?.wellTestResultData || {})
                                    .sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))
                                    ?.filter(well => well?.flowstation === currFlowstation)
                                    ?.map((well, i) => { 

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
                                                    {field.fn(well) || (well?.[field.name] ?? "-")}
                                                {/* <TableInput type='number' defaultValue={well?.[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} /> */}
                                            </TableCell>)
                                        }
                                        <TableCell align="center" sx={{ minWidth: '200px' }} colSpan={3}>
                                            {well?.remark || "No remark"}
                                            {/* <textarea defaultValue={well.remark} onChange={(e) => handleChange("remark", e.target.value)} className='border outline-none p-1' rows={2} cols={20}>
                                        </textarea> */}
                                        </TableCell>
                                        <TableCell align="center" colSpan={1}>
                                            <Actions actions={[
                                                { name: `Forward from ${getWellLastTestResult(wellTestResults, wellTestResult, well.productionString)?.wellTestResult?.month || "-"}`, onClick: () => bringForward(wellTestResults, wellTestResult, well.productionString) },
                                            ]} >

                                                {
                                                    well?.isSelected ? '-' : <Tooltip title="Delete"><BsThreeDots className='cursor-pointer w-full ' /></Tooltip>
                                                }
                                            </Actions>
                                        </TableCell>
                                    </TableRow>
                                })
                            }

                            <TableRow sx={{ backgroundColor: '#00A3FF4D' }}>
                                <TableCell style={{ fontWeight: '600' }} align="center" colSpan={6} >String Totals </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('gross', currFlowstation,)}</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">{getTotalOf('oilRate', currFlowstation)}</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">{getTotalOf('gross', currFlowstation) - getTotalOf('oilRate', currFlowstation)}</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('gasRate', currFlowstation)}</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" >{getTotalOf('bsw', currFlowstation)}</TableCell>

                                <TableCell align="center" colSpan={10}></TableCell>
                                <TableCell style={{ fontWeight: '600', minWidth: '200px' }} colSpan={3} align="center"></TableCell>
                            </TableRow>
                        </TableBody>

                    </Table>
                </TableContainer>}
            <div className='flex  justify-between py-2'>
                <Text weight={600}>
                    {/* Flowstations */}
                </Text>
                <div>
                    <Text weight={600}>
                        Enter Gas values ({currFlowstation})
                    </Text><br />
                    {
                        Object.values(flowstationsTargets || {}).map(flowstationsTarget => {
                            const curr = flowstationsTarget?.flowstation === currFlowstation
                            return <>
                                {/* {flowstationsTarget?.flowstation} */}

                                {curr && <Box component={'div'} className='flex gap-2' >
                                    <div>
                                        Export Gas (MMscf/day)
                                        <Input min={0} defaultValue={flowstationsTargets?.[flowstationsTarget?.flowstation]?.exportGas} containerClass={'w-[100px]'}
                                            onChange={(e) => setFlowstationTragets((prev) => ({
                                                ...prev,
                                                [flowstationsTarget?.flowstation]: {
                                                    ...prev?.[flowstationsTarget?.flowstation],
                                                    exportGas: parseFloat(e.target.value),
                                                    gasFlaredUSM: prev?.[flowstationsTarget?.flowstation]?.gasRate - parseFloat(e.target.value || 0) - (prev?.[flowstationsTarget?.flowstation]?.fuelGas || 0)
                                                }
                                            }))} />
                                    </div>
                                    <div>
                                        Fuel Gas (MMscf/day)
                                        <Input min={0} defaultValue={flowstationsTargets?.[flowstationsTarget?.flowstation]?.fuelGas} containerClass={'w-[100px]'}
                                            onChange={(e) => setFlowstationTragets((prev) => ({
                                                ...prev,
                                                [flowstationsTarget?.flowstation]: {
                                                    ...prev?.[flowstationsTarget?.flowstation],
                                                    fuelGas: parseFloat(e.target.value),
                                                    gasFlaredUSM: prev?.[flowstationsTarget?.flowstation]?.gasRate - parseFloat(e.target.value || 0) - (prev?.[flowstationsTarget?.flowstation]?.exportGas || 0)
                                                }
                                            }))} />
                                    </div>
                                    <div>
                                        Flared Gas (MMscf/day)
                                        <Input min={0} containerClass={'w-[100px]'} disabled value={flowstationsTargets?.[flowstationsTarget?.flowstation]?.gasFlaredUSM} />
                                    </div>
                                </Box>}
                            </>
                        })
                    }
                </div>
            </div>
            {
                !searchParams.get('show-analytics') && <div className='flex justify-end py-2'>
                    <Button width={120} onClick={() => {
                        dispatch(openModal({ component: <SaveAs defaultValue={res?.title} onSave={save} /> }))
                    }} >Commit</Button>
                </div>
            }
        </div >
    );
}