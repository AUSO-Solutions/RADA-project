import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import tableStyles from './table.module.scss'
import RadaSwitch from 'Components/Input/RadaSwitch';
import { ArrowBack } from '@mui/icons-material';
import Text from 'Components/Text';
import { Button, Input } from 'Components';
import { Setting2 } from 'iconsax-react';
import { Link, useLocation } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';
import dayjs from 'dayjs';
import { firebaseFunctions } from 'Services';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Actions from './Actions';
// import styles from './welltest.module.scss'

const TableInput = (props) => {
    return <input className='p-1 text-center w-[80px] h-[100%] border outline-none ' required {...props}
    // onKeyPress={(e) => {
    //     if (!/[0-9]/.test(e.key) && props.type === 'number') {
    //         e.preventDefault();
    //     }
    // }}
    />
}

export default function WellTestDataTable() {

    const { search } = useLocation()
    const dispatch = useDispatch()
    const [loading, setLoading] = React.useState(false)
    const [wellTest, setWellTest] = React.useState({})
    const [wellTestResult, setWellTestResult] = React.useState({})
    const id = React.useMemo(() => new URLSearchParams(search).get('id'), [search])
    const scheduleId = React.useMemo(() => new URLSearchParams(search).get('scheduleId'), [search])
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'wellTestSchedule', id: scheduleId || id } })
    const { data: res2 } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'wellTestResult', id } })
    const [title, setTitle] = React.useState('')
    const isEdit = React.useMemo(() => { return scheduleId }, [scheduleId])
    React.useEffect(() => { setWellTest(res) }, [res])
    React.useEffect(() => { if (!isEdit) setWellTestResult(wellTest?.wellsData) }, [wellTest.wellsData, isEdit])
    React.useEffect(() => { if (isEdit) setWellTestResult(res2?.wellTestResultData); setTitle(res2?.title) }, [res2, isEdit])
    React.useEffect(() => { }, [])
    // 
    const save = async () => {
        setLoading(true)
        try {

            if (isEdit) {
                const payload = { title: title, asset: wellTest?.asset, field: wellTest?.field, wellTestScheduleId: wellTest?.id, setupType: 'wellTestResult', wellTestResultData: wellTestResult, id }
                console.log(payload)
                await firebaseFunctions('updateSetup', payload)
            } else {
                const payload = { title, asset: wellTest?.asset, field: wellTest?.field, wellTestScheduleId: wellTest?.id, setupType: 'wellTestResult', wellTestResultData: wellTestResult }
                await firebaseFunctions('createSetup', payload)
            }
            dispatch(closeModal())


            toast.success('Data saved to well test result')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const SaveAs = () => {

        return <div className='bg-[white] w-[400px]'>
            <Text size={24}>Save Well Test Result as</Text>

            <Input defaultValue={res2?.title} className='w-full' onChange={(e) => setTitle(e.target.value)} />
            <Button loading={loading} className='float-right mt-4' onClick={save} width={100}>
                Save
            </Button>
        </div>
    }

    const fields = [
        { name: 'gross', type: "number" },
        { name: 'oilRate', type: "number" },
        { name: 'waterRate', type: "number" },
        { name: 'bsw', type: "number" },
        { name: 'wgr', type: "number" },
        { name: 'gor', type: "number" },
        { name: 'formationGas', type: "number" },
        { name: 'totalGas', type: "number" },
        { name: 'fthp', type: "number" },
        { name: 'flp', type: "number" },
        { name: 'staticPressure', type: "number" },
        { name: 'orificePlateSize', type: "number" },
        { name: 'sand', type: "number" },
    ]

    return (
        < div className=' w-[80vw] px-3'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <Link to='/users/fdc/well-test-data/' className='flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md' >
                        <ArrowBack />
                        <Text>Files</Text>
                    </Link>
                    <RadaSwitch label="Edit Table" labelPlacement="left" />
                </div>
                <div className='flex justify-end py-2 items-center gap-3'>
                    <div className='flex gap-2' >
                        <Actions wellTestResult={wellTestResult} title={title} />
                    </div>
                    <div className='border border-[#00A3FF] px-3 py-1 rounded-md' >
                        <Setting2 color='#00A3FF' />
                    </div>
                </div>
            </div>
            <div className='border rounded flex gap-3 p-2 my-2'>
                <Text>Well test schedule: {wellTest?.title}</Text>
                <Text>   Asset: {wellTest?.asset}</Text>
                <Text>   Field: {wellTest?.field}</Text>
            </div>
            <TableContainer className={`m-auto border  pr-5 ${tableStyles.borderedMuiTable}`}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead >
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={2} >
                                Field 1
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                                Choke
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                                Latest Test Date
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >
                                Fluid Type
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Prod. Method</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Gross</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Oil Rate</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Water Rate</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >BS&W</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >WGR</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >GOR</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Formation Gas</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Total Gas</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FTHP</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FLP</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Static Pressure</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Orifice Plate Size</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Sand</TableCell>
                            <TableCell style={{ fontWeight: '600', height: '100%' }} align="center" colSpan={3} >Remark</TableCell>

                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Production string
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Size(64")</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(blpd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(bopd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(bwpd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(%)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(Stb/MMscf)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(Scf/Stb)</TableCell>

                            <TableCell style={{ fontWeight: '600' }} align="center">(MMscf/day)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(MMscf/day)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(Inches)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">(pptb)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center"></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.values(wellTestResult || {})?.map((well, i) => {
                                const handleChange = (name, value) => {
                                    setWellTestResult(prev => ({
                                        ...prev,
                                        [well?.productionString]: {
                                            ...prev?.[well?.productionString],
                                            [name]: value
                                        }
                                    }))
                                }
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
                                            <TableInput type='number' defaultValue={well?.[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} />
                                        </TableCell>)
                                    }
                                    {/* <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("gross", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("oilRate", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("waterRate", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("bsw", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("wgr", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("gor", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("formationGas", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("totalGas", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("fthp", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("flp", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("staticPressure", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("orificePlateSize", e.target.value)} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput type='number' onChange={(e) => handleChange("sand", e.target.value)} />
                                    </TableCell> */}
                                    <TableCell align="center" sx={{ minWidth: '200px' }} colSpan={3}>
                                        {/* <TableInput className='w-full outline-none border p-2' /> */}
                                        <textarea defaultValue={well.remark} onChange={(e) => handleChange("remark", e.target.value)} className='border outline-none p-1' rows={2} cols={20}>

                                        </textarea>
                                    </TableCell>
                                </TableRow>
                            })
                        }

                    </TableBody>

                </Table>
            </TableContainer>
            <div className='flex justify-end py-2'>
                <Button width={120} onClick={() => {

                    dispatch(openModal({ component: <SaveAs /> }))

                }} >Commit</Button>
            </div>
        </div>
    );
}