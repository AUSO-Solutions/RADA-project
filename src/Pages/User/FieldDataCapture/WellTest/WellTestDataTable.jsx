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
import { Button } from 'Components';
import { ArrowDown2, Setting2 } from 'iconsax-react';
import { Link, useLocation } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';
// import styles from './welltest.module.scss'

const TableInput = (props) => {
    return <input className='p-1 text-center w-[70px] border outline-none' required {...props}
    // onKeyPress={(e) => {
    //   if (!/[0-9]/.test(e.key) && props.type === 'number') {
    //     e.preventDefault();
    //   }
    // }}
    />
}

export default function WellTestDataTable() {

    const { search } = useLocation()
    const [wellTest, setWellTest] = React.useState({})
    const id = React.useMemo(() => new URLSearchParams(search).get('id'), [search])
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { setupType: 'wellTestSchedule', id } })
    React.useEffect(() => { setWellTest(res) }, [res])

    return (
        < div className='px-3'>
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
                        <Button width={120} >Actions <ArrowDown2 /></Button>
                    </div>
                    <div className='border border-[#00A3FF] px-3 py-1 rounded-md' >
                        <Setting2 color='#00A3FF' />
                    </div>
                </div>
            </div>
            <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
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
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Remark</TableCell>

                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Well
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

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.values(wellTest?.wellsData || {})?.filter(item => item?.isSelected)?.map((well, i) => {
                                return <TableRow>
                                    <TableCell align="center">
                                        {well?.reservoir}
                                    </TableCell>
                                    <TableCell align="center">
                                        {well?.well}
                                    </TableCell>
                                    <TableCell align="center">
                                        {well?.chokeSize}
                                    </TableCell>
                                    <TableCell align="center">
                                        {'---'}
                                    </TableCell>
                                    <TableCell align="center">
                                        {well?.fluidType}
                                    </TableCell>
                                    <TableCell align="center">
                                        NF
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TableInput />
                                    </TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                    <TableCell align="center">    <TableInput /></TableCell>
                                </TableRow>
                            })
                        }

                    </TableBody>

                </Table>
            </TableContainer>
            <div className='flex justify-end py-2'>
                <Button width={120} >Commit</Button>
            </div>
        </div>
    );
}