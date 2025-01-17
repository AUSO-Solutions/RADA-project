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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';
import dayjs from 'dayjs';
import { firebaseFunctions } from 'Services';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Actions from 'Partials/Actions/Actions';
import { createWellTitle } from 'utils';
import { Approve } from 'Partials/Actions/Approve';
import { Query } from 'Partials/Actions/Query';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';
import { useMe } from 'hooks/useMe';
import { getAssetByName } from 'hooks/useAssetByName';
import UploadTAR from './UploadTAR';


const SaveAs = ({ defaultValue, onSave = () => null, loading }) => {
    const [title, setTitle] = useState(defaultValue)
    return <div className='bg-[white] w-[400px]'>
        <Text size={24}>Save TAR Result as</Text>

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

export default function TARTable() {

    const { user } = useMe()
    const { pathname, search } = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [tarResult, setTarResult] = useState({})
    const id = useMemo(() => new URLSearchParams(search).get('id'), [search])
    const merResultId = useMemo(() => new URLSearchParams(search).get('merResultId'), [search])
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'merResult', id: merResultId || id } })
    const { data: res2 } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'tarResult', id }, dontFetch: !id })
    const [title, setTitle] = useState('')
    const isEdit = useMemo(() => { return !merResultId }, [merResultId])


    useEffect(() => {
        const inheritMerResult = async () => {
            const asset_ = await getAssetByName(res?.asset, { loadingScreen: true })
            const flowstations = asset_.flowStations
            for (const productionString in res?.merResultData) {
                const flowstation = asset_.assetData?.find(item => item?.wellId)?.flowstation
                res.merResultData[productionString].flowstation = flowstation
            }
            const tarResultData = {}
            Object.values(res?.merResultData || {}).forEach((item) => {
                tarResultData[item?.productionString] = { productionString: item?.productionString }
            })
            setTarResult({
                title: "",
                tarResultData,
                // field: res?.field,
                merResultId: res?.id,
                asset: res?.asset,
                month: dayjs().format('YYYY-MM'),
                flowstations
            })
        }
        if (res) inheritMerResult()
    }, [res])

    useEffect(() => { if (isEdit) setTarResult(res2); setTitle(res2?.title) }, [res2, isEdit])

    const save = async (title) => {
        if (!title) {
            toast.info('Please provide a title')
            return;
        }
        setLoading(true)
        try {
            dispatch(setLoadingScreen({ open: true }))
            if (isEdit) {
                const payload = { ...tarResult, title, setupType: 'tarResult', id, }
                console.log(payload)
                await firebaseFunctions('updateSetup', payload)
            } else {
                const payload = { ...tarResult, title, setupType: 'tarResult' }
                console.log(payload)

                const { data } = await firebaseFunctions('createSetup', payload)
                navigate(`/users/fdc/mer-data/tar-table?id=${data?.id}`)
            }
            dispatch(closeModal())
            toast.success('Data saved to MER test result')
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setLoadingScreen({ open: false }))
        }
    }

    const getFileData = async (data) => {
        console.log(data)
        setTarResult(prev => {
            return { ...prev, tarResultData: data }
        })
        toast.success('Data imported successfully!')
        dispatch(closeModal())
    }
    return (
        <>
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
                        {!isEdit && <UploadTAR asset={tarResult?.asset} merResult={res} onProceed={getFileData} />}
                        {isEdit && <div className='flex gap-2' >
                            {<Actions tarResult={tarResult} title={title} actions={[
                                { name: 'Query Result', onClick: () => dispatch(openModal({ component: <Query header={'Query TAR Data'} setupType={'tarResult'} id={tarResult?.id} title={createWellTitle(tarResult)} pagelink={pathname + search} /> })) },
                                { name: 'Approve', onClick: () => dispatch(openModal({ component: <Approve header={'Approve TAR Data'} setupType={'tarResult'} id={tarResult?.id} title={createWellTitle(tarResult)} pagelink={pathname + search} /> })) },
                           
                            ]} />}
                        </div>}
                        {/* {isEdit && <div className='border border-[#00A3FF] px-3 py-1 rounded-md cursor-pointer' onClick={() => setShowChart(true)} >
                            <Chart color='#00A3FF' />
                        </div>} */}
                    </div>
                </div>
                <div className='border rounded flex gap-3 p-2 my-2'>
                    {createWellTitle(tarResult)}
                </div>
                <TableContainer sx={{ maxHeight: 700 }} className={`m-auto border  pr-5 ${tableStyles.borderedMuiTable}`}>
                    <Table stickyHeader sx={{ minWidth: 700 }} >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: '600' }} align="center" >Reservoir </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center" >Production string </TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Field</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Start Date</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">End Date</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Duration(HRS)</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Fluid Type</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Rada MER</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">TAR MER</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align="center">Approved TAR (bopd)</TableCell>
                            </TableRow>
                        </TableHead>
                        {
                            Object.values(tarResult?.tarResultData || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((mer, i) => {
                                const handleChange = (name, value) => {
                                    setTarResult(prev => ({
                                        ...prev,
                                        tarResultData: {
                                            ...prev?.tarResultData,
                                            [mer?.productionString]: {
                                                ...prev?.tarResultData?.[mer?.productionString],
                                                [name]: value
                                            }
                                        }
                                    }))
                                }
                                const handleExtraChange = (e) => { const name = e.target.name; const value = e.target.value; handleChange(name, value); }
                                return <TableBody className={tableStyles.tableBody}>
                                    <TableRow key={mer?.productionString}>
                                        <TableCell rowSpan={4} align="center">
                                            {mer?.reservoir}
                                        </TableCell>
                                        <TableCell rowSpan={4} align="center">
                                            {mer?.productionString}
                                        </TableCell>
                                        <TableCell rowSpan={4} align="center">
                                            {mer?.field}
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>

                                            <TableInput type='datetime-local' onChange={handleExtraChange} name='startDate' value={dayjs(mer?.startDate).format("YYYY-MM-DDTHH:mm")} />
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>

                                            <TableInput type='datetime-local' onChange={handleExtraChange} name='endDate' value={dayjs(mer?.endDate).format("YYYY-MM-DDTHH:mm")} />
                                        </TableCell>
                                        <TableCell align="center" className={`${tableStyles.cellNoPadding} `}>
                                            <TableInput onChange={handleExtraChange} type='text' value={`${dayjs(mer?.endDate).diff(mer?.startDate, "months")} months`} />
                                        </TableCell>
                                        <TableCell align="center" >
                                            <select className='p-3 outline-none h-full' onChange={handleExtraChange} name='fluidType'  >
                                                <option selected={!mer?.fluidType} value="">Select fluid type</option>
                                                <option selected={mer?.fluidType === "Oil"} value="Oil">Oil</option>
                                                <option selected={mer?.fluidType === "Gas"} value="Gas">Gas</option>
                                                <option selected={mer?.fluidType === "Condensate"} value="Condensate">Condensate</option>
                                            </select>
                                        </TableCell>
                                        <TableCell align="center" >
                                            <TableInput type='number' className='p-3 outline-none h-full' onChange={handleExtraChange} name='RADA_MER' defaultValue={mer?.RADA_MER} />
                                        </TableCell>
                                        <TableCell align="center" >
                                            <TableInput type='number' className='p-3 outline-none h-full' onChange={handleExtraChange} name='TAR_MER' defaultValue={mer?.TAR_MER} />
                                        </TableCell>

                                        <TableCell align="center" >
                                            <TableInput type='number' className='p-3 outline-none h-full' onChange={handleExtraChange} name='approvedTar' defaultValue={mer?.approvedTar} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            })
                        }

                    </Table>
                </TableContainer>
                {user.permitted.createAndeditMERdata &&
                    <div className='flex justify-end py-2'>
                        <Button width={120} type='submit' >Commit</Button>
                    </div>
                }
            </form>
        </>
    );
}