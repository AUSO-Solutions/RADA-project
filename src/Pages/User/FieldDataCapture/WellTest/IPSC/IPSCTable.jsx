import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import { store } from 'Store';
import tableStyles from '../table.module.scss'
// import RadioSelect from './RadioSelect';
// import { Switch } from '@mui/material';
import RadaSwitch from 'Components/Input/RadaSwitch';
// import RadaDatePicker from 'Components/Input/RadaDatePicker';
// import { sum } from 'utils';
import { ArrowBack } from '@mui/icons-material';
import Text from 'Components/Text';
import { Button } from 'Components';
import { Setting2 } from 'iconsax-react';


// const TableInput = (props) => {
//     return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
// }

export default function IPSCTable() {
    // const setup = React.useMemo(() => {
    //     return store.getState().setup

    // }, [])

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
                    <div className='bg-[#EFEFEF] py-1 px-2 rounded-md flex ' >
                        <Text>Show Analytics</Text>
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
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={12} >
                            IPSC-OML99/Field1/July-2024
                            </TableCell>
                        </TableRow>
                        
                        <TableRow>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Reservoir
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" >
                                Well
                            </TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Choke Size (64")</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Last Test Date</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Fluid Type</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Prod. Method</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Gross (blpd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Oil Rate (bopd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">Water Rate (bwpd)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">BS&W (%)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">WGR (Stb/MMscf)</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center">GOR (Scf/Stb)</TableCell>

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
                                193,080
                            </TableCell>
                            <TableCell align="center">
                                0.31
                            </TableCell>
                            <TableCell align="center">
                                0.107
                            </TableCell>
                            <TableCell align="center">
                                0.089
                            </TableCell>
                            <TableCell align="center">12,090</TableCell>
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
                                553,000
                            </TableCell>
                            <TableCell align="center">
                                393,080
                            </TableCell>
                            <TableCell align="center">
                                0.315
                            </TableCell>
                            <TableCell align="center">
                                0.190
                            </TableCell>
                            <TableCell align="center">
                                0.081
                            </TableCell>
                            <TableCell align="center">26,522</TableCell>
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
                            <TableCell align="center">11,023</TableCell>
                        </TableRow>
                        <TableRow sx={{ bgcolor: `#D5ECFF`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell style={{ fontWeight: '600' }} align="start" colSpan={6} >
                                String Totals
                            </TableCell>
                          
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >250,000</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >2,500</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >68</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >2.48</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >2.75</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >9</TableCell>
                            
                        </TableRow>

                    </TableBody>

                </Table>
            </TableContainer>
            <div className='flex justify-end py-2'>
                <Button width={120} >Save</Button>
            </div>
        </div>
    );
}