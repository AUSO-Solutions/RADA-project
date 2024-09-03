import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { store } from 'Store';
import tableStyles from './table.module.scss'
import RadioSelect from './RadioSelect';
import { Switch } from '@mui/material';
import RadaSwitch from 'Components/Input/RadaSwitch';
import RadaDatePicker from 'Components/Input/RadaDatePicker';
import { sum } from 'utils';
import { ArrowBack } from '@mui/icons-material';
import Text from 'Components/Text';
import { Button } from 'Components';
import { ArrowDown, ArrowDown2, Setting, Setting2 } from 'iconsax-react';


const TableInput = (props) => {
    return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
}

export default function WellTestDataTable() {
    const setup = React.useMemo(() => {
        return store.getState().setup

    }, [])

    return (
        < div className='px-3'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <div className='flex flex-row gap-2 bg-[#EFEFEF] px-4 py-1 rounded-md' >
                        <ArrowBack />
                        <Text>Files</Text>
                    </div>
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
                            {/* <TableCell align="center">Net Target</TableCell>
              <TableCell align="center">BS&W</TableCell>
              <TableCell align="center">Gross</TableCell> */}
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

                        </TableRow>
                    </TableHead>



                    <TableBody>

                        <TableRow>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                Well 2L
                            </TableCell>
                            <TableCell align="center">
                                16
                            </TableCell>
                            <TableCell align="center">
                                {new Date().toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                                Oil
                            </TableCell>
                            <TableCell align="center">
                                NF
                            </TableCell>
                            <TableCell align="center">
                                353,000
                            </TableCell>
                            <TableCell align="center">
                                393,080
                            </TableCell>
                            <TableCell align="center">
                                0.31
                            </TableCell>
                            <TableCell align="center">
                                0.10
                            </TableCell>
                            <TableCell align="center">
                                0.08
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                Well 2L
                            </TableCell>
                            <TableCell align="center">
                                16
                            </TableCell>
                            <TableCell align="center">
                                {new Date().toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                                Oil
                            </TableCell>
                            <TableCell align="center">
                                NF
                            </TableCell>
                            <TableCell align="center">
                                353,000
                            </TableCell>
                            <TableCell align="center">
                                393,080
                            </TableCell>
                            <TableCell align="center">
                                0.31
                            </TableCell>
                            <TableCell align="center">
                                0.10
                            </TableCell>
                            <TableCell align="center">
                                0.08
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="center">
                                Res4321
                            </TableCell>
                            <TableCell align="center">
                                Well 2L
                            </TableCell>
                            <TableCell align="center">
                                16
                            </TableCell>
                            <TableCell align="center">
                                {new Date().toLocaleDateString()}
                            </TableCell>
                            <TableCell align="center">
                                Oil
                            </TableCell>
                            <TableCell align="center">
                                NF
                            </TableCell>
                            <TableCell align="center">
                                353,000
                            </TableCell>
                            <TableCell align="center">
                                393,080
                            </TableCell>
                            <TableCell align="center">
                                0.31
                            </TableCell>
                            <TableCell align="center">
                                0.10
                            </TableCell>
                            <TableCell align="center">
                                0.08
                            </TableCell>
                            <TableCell align="center">265230.0</TableCell>
                        </TableRow>

                    </TableBody>







                </Table>
            </TableContainer>
            <div className='flex justify-end py-2'>
                <Button width={120} >Commit</Button>
            </div>
        </div>
    );
}