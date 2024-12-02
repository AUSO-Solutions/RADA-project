import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import tableStyles from '../table.module.scss'
// import RadaSwitch from 'Components/Input/RadaSwitch';
// import { ArrowBack } from '@mui/icons-material';
// import Text from 'Components/Text';
// import { Button, Input } from 'Components';
// import { Setting2 } from 'iconsax-react';
// import { Link, useLocation } from 'react-router-dom';
// import { useFetch } from 'hooks/useFetch';
import dayjs from 'dayjs';
import { Button, Input } from 'Components';
import Text from 'Components/Text';
import { useDispatch, useSelector } from 'react-redux';
import { setSetupData } from 'Store/slices/setupSlice';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import { firebaseFunctions } from 'Services';
import { toast } from 'react-toastify';
import { sum } from 'utils';
import { getAssetByName } from 'hooks/useAssetByName';

const SaveAs = () => {
    const setupData = useSelector(state => state.setup)
    const dispatch = useDispatch()
    const save = async () => {
        try {
            // console.log(setupData)
            const asset_ = await getAssetByName(setupData?.asset)
            console.log(asset_.flowStations)
            const arr = Object.values(setupData?.wellTestResultData || {})
            // console.log(arr)
            const flowstations = asset_.flowStations
            const totals = {
                gross: sum(arr.map(item => item?.gross || 0)),
                oilRate: sum(arr.map(item => item?.oilRate || 0)),
                gasRate: sum(arr.map(item => item?.gasRate || 0)),
                exportGas: null,
                flaredGas: null,
                fuelGas: null
            }
            console.log(setupData?.wellTestResultData, totals, flowstations)
            await firebaseFunctions('createSetup', { ...setupData, setupType: 'wellTestResult', totals, flowstations   })
            toast.success('Successfully uploaded')
            dispatch(closeModal())
        } catch (error) {

        }

    }
    return (
        <div className="h-fit flex flex-col  w-[400px] mx-auto gap-1 justify-center">
            <Text weight={600} size={24}>Save Well Test Result as</Text>
            <Input label={''} required defaultValue={setupData?.title} onChange={(e) => dispatch(setSetupData({ name: 'title', value: e.target.value }))} />
            <Button className={'w-[100px] mt-5 px-3'} onClick={save}>
                Save
            </Button>
        </div>
    )
}

const WellTestCommitTable = ({ wellTestResult, merResult }) => {
    const fields = [
        { name: 'gross', type: "number" },
        { name: 'oilRate', type: "number" },
        { name: 'waterRate', type: "number" },
        { name: 'gasRate', type: "number" },
        { name: 'bsw', type: "number" },
        // { name: 'wgr', type: "number" },
        { name: 'gor', type: "number" },
        { name: 'fthp', type: "number" },
        { name: 'flp', type: "number" },
        { name: 'chp', type: "number" },
        { name: 'staticPressure', type: "number" },
        { name: 'orificePlateSize', type: "number" },
        { name: 'sand', type: "number" },
    ]
    const dispatch = useDispatch()
    return (

        <div className='mx-auto w-[80vw]'>
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
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Gas Rate</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >BS&W</TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >WGR</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >GOR</TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Total Gas</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FTHP</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >FLP</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >CHP</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Static Pressure</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Orifice Plate Size</TableCell>
                            <TableCell style={{ fontWeight: '600' }} align="center" colSpan={1} >Sand</TableCell>
                            <TableCell style={{ fontWeight: '600', height: '100%' }} align="center" colSpan={3} >Remark</TableCell>
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
                            {/* <TableCell style={{ fontWeight: '600' }} align="center">(Stb/MMscf)</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center">(Scf/Stb)</TableCell>
                            {/* <TableCell style={{ fontWeight: '600' }} align="center">(MMscf/day)</TableCell> */}
                            <TableCell style={{ fontWeight: '600' }} align="center">(Psia)</TableCell>
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
                            Object.values(wellTestResult || {}).sort((a, b) => ((b?.isSelected ? 1 : 0) - (a?.isSelected ? 1 : 0)))?.map((well, i) => {
                                const handleChange = (name, value) => {
                                    // setWellTestResult(prev => ({
                                    //     ...prev,
                                    //     [well?.productionString]: {
                                    //         ...prev?.[well?.productionString],
                                    //         [name]: value
                                    //     }
                                    // }))
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
                                            {well?.[field.name]}
                                            {/* <TableInput type='number' required={well.isSelected} defaultValue={well?.[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} /> */}
                                        </TableCell>)
                                    }
                                    <TableCell align="center" sx={{ minWidth: '200px' }} colSpan={3}>
                                        <textarea defaultValue={well.remark} onChange={(e) => handleChange("remark", e.target.value)} className='border outline-none p-1' rows={2} cols={20}>
                                        </textarea>
                                    </TableCell>
                                </TableRow>
                            })
                        }

                    </TableBody>

                </Table>
            </TableContainer>

            <div className='flew w-full my-3 float-right '>
                <Button onClick={() => dispatch(openModal({ component: <SaveAs /> }))} className={'px-3'}>
                    Commit
                </Button>
            </div>
        </div>
    )
}

export default WellTestCommitTable