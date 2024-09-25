import * as React from 'react';
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
import { Button } from 'Components';
import { Link, useLocation } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';
import dayjs from 'dayjs';
import { firebaseFunctions } from 'Services';
import { toast } from 'react-toastify';


export default function MERScheduleTable() {


    const { search } = useLocation()
    const [loading, setLoading] = React.useState(false)
    const [merSchedule, setMerSchedule] = React.useState({})
    const id = React.useMemo(() => new URLSearchParams(search).get('id'), [search])
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'merSchedule', id } })
    React.useEffect(() => { setMerSchedule(res) }, [res])
    const save = async () => {
        setLoading(true)
        try {
            await firebaseFunctions('updateSetup', { id, setupType: 'merSchedule', ...merSchedule })
            toast.success("Remark saved successfully")
            console.log(res, merSchedule)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    return (
        < div className='px-3'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 py-4 items-center'>
                    <Link to={'/users/fdc/well-test-data/'} className='flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md' >
                        <ArrowBack />
                        <Text>Files</Text>
                    </Link>
                    <RadaSwitch label="Edit Table" labelPlacement="left" />
                </div>
            </div>
            <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead >
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={11} >
                                MER DATA-{merSchedule?.asset}/Mer Schedule/{dayjs(merSchedule?.created).format('MMM YYYY')}
                            </TableCell>

                        </TableRow>
                        <TableRow>

                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                S/N
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Production string</TableCell>

                            <TableCell style={{ fontWeight: '600' }} colSpan={1} align="center">Remarks</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Test Choke (/64")</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">On Program</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Start Date</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">End Date</TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center">Stabilization Duration (Hrs)</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center">Test Duration (Hrs)</TableCell>
                        </TableRow>
                    </TableHead>

                    {
                        Object.values(merSchedule?.merScheduleData || {}).map((mer, i) => {
                            return <>
                                <TableBody className='flex w-fit'>
                                    <TableRow >
                                        <TableCell rowSpan={mer?.chokes?.length + 1} align="center">
                                            {i + 1}

                                        </TableCell>
                                        <TableCell rowSpan={mer?.chokes?.length + 1} align="center">
                                            {mer?.reservoir}
                                        </TableCell>
                                        <TableCell rowSpan={mer?.chokes?.length + 1} align="center">
                                            {mer?.productionString}
                                        </TableCell>
                                        <TableCell rowSpan={mer?.chokes?.length + 1} colSpan={1} align="center">

                                            <textarea className='border outline-none px-2 !h-[100%] py-1' defaultValue={mer?.remark || 'No Remark'} onChange={(e) => {
                                                setMerSchedule(prev => ({
                                                    ...prev,
                                                    merScheduleData: {
                                                        ...prev?.merScheduleData,
                                                        [mer?.productionString]: { ...prev?.merScheduleData?.[mer?.productionString], remark: e.target.value }
                                                    }
                                                }))
                                            }} />

                                        </TableCell>
                                    </TableRow>

                                    {
                                        mer?.chokes?.map(choke => <TableRow >
                                            <TableCell align="center">  {choke?.chokeSize || '-'}  </TableCell>
                                            <TableCell bgcolor={mer?.isSelected ? '#A7EF6F' : "#FF5252"} align="center">{mer?.isSelected ? 'YES' : 'NO'}</TableCell>
                                            <TableCell align="center">{dayjs(choke?.startDate).format('DD MMM YYYY. hh:mmA')}</TableCell>
                                            <TableCell align="center">{dayjs(choke?.endDate).format('DD MMM YYYY. hh:mmA')}</TableCell>
                                            <TableCell align="center">{dayjs(choke?.endDate).diff(choke?.startDate, 'hours')}</TableCell>
                                        </TableRow>)
                                    }
                                </TableBody>
                            </>
                        })
                    }




                </Table>
            </TableContainer>

            <div className='flex justify-end py-1'>
                <Button loading={loading} onClick={save} width={120} >Save</Button>
            </div>
        </div>
    );
}