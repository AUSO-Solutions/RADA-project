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
import { Button } from 'Components';
import Text from 'Components/Text';


const TableInput = (props) => {
    return <input className='p-1 text-center w-[70px] border outline-none' {...props} />
}

export default function GasTable() {
    const setup = React.useMemo(() => {
        return store.getState().setup

    }, [])
    // console.log(setup)
    const [tableValues, setTableValues] = React.useState({})
    const [totals, setTotals] = React.useState({
        netProductionTotal: 0,
        netTargetTotal: 0,
        bswTotal: 0,
        grossTotal: 0,
    })

    const handleChange = ({ flowStation, field, measurementTypeValue, measurementTypeIndex, flowStationField }) => {
        //careful, to also have the value updated before calculated
        setTableValues(prev => {
            const prevFlowStation = prev?.[flowStation]
            const prevFlowStationList = prevFlowStation?.list
            const prevFlowStationListIndexValues = prevFlowStation?.list?.[measurementTypeIndex]
            const finalBbls = field === "finalBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.finalBbls || 0)
            const initialBbls = field === "initialBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.initialBbls || 0)
            const deductionFinalBbls = field === "deductionFinalBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.deductionFinalBbls || 0)
            const deductionInitialBbls = field === "deductionInitialBbls" ? measurementTypeValue : (prevFlowStationListIndexValues?.deductionInitialBbls || 0)
            const netProduction = Math.abs(parseFloat(finalBbls) - parseFloat(initialBbls))
            const deductionNetProduction = Math.abs(parseFloat(deductionFinalBbls) - parseFloat(deductionInitialBbls))
            // console.log(measurementTypeIndex, isNaN(measurementTypeIndex))
            const isNum = typeof measurementTypeIndex === 'number'
            const updatedList = isNum ? {
                ...prevFlowStationList,
                [measurementTypeIndex]: {
                    ...prevFlowStationListIndexValues,
                    [field]: measurementTypeValue,
                    netProduction,
                    deductionNetProduction
                }
            } : prevFlowStationList


            const updatedFlowStation = {
                ...prevFlowStation,
                list: updatedList,
                ['subTotal']: sum(Object.values(updatedList || {}).map(value => value.netProduction)) - sum(Object.values(updatedList || {}).map(value => value.deductionNetProduction)),
                netTarget: field === "netTarget" ? parseFloat(measurementTypeValue) : prevFlowStation?.netTarget,
                bsw: field === "bsw" ? parseFloat(measurementTypeValue) : prevFlowStation?.bsw,
                gross: field === "gross" ? parseFloat(measurementTypeValue) : prevFlowStation?.gross
            }
            // console.log((updatedFlowStation))
            return {
                ...prev,
                [flowStation]: updatedFlowStation,
            }
        })

    }
    React.useEffect(() => {
        const values = (Object.values(tableValues))
        // console.log(values)
        const calcs = {
            netProductionTotal: sum(Object.values(values || {}).map(item => item?.subTotal || 0)),
            netTargetTotal: sum(Object.values(values || {}).map(item => item?.netTarget || 0)),
            bswTotal: sum(Object.values(values || {}).map(item => item?.bsw || 0)),
            grossTotal: sum(Object.values(values || {}).map(item => item?.gross || 0)),
        }
        setTotals(calcs)
    }, [tableValues])

    const save = () => {
        // const flowStationsData = tableValues
        console.log({ totals, tableValues })

    }
    return (
        < div className='px-3 '>
            {/* <div className='flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <RadioSelect list={setup?.reportTypes} /> <RadaSwitch label="Edit Table" labelPlacement="left" />
        </div>
        <RadaDatePicker />
      </div> */}
            <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
                <Table sx={{ minWidth: 700 }} >
                    <TableHead >
                        <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
                            <TableCell align="left" colSpan={2} >
                                Flow stations
                            </TableCell>
                            <TableCell align="center" colSpan={4} >
                                Gas Readings
                            </TableCell>
                            <TableCell colSpan={2} align="center">Total</TableCell>
                        </TableRow>
                        <TableRow>

                            <TableCell align="left" colSpan={2} >
                                Input Values for each flow station
                            </TableCell>
                            <TableCell align="center">Property</TableCell>
                            <TableCell align="center">Meter Name</TableCell>
                            <TableCell align="center">Initial (mmscf)</TableCell>
                            <TableCell align="center">Final (mmscf)</TableCell>
                            <TableCell colSpan={2} align="center">mmscf</TableCell>
                            {/* <TableCell align="center">bbls</TableCell> */}
                            {/* <TableCell align="center">%</TableCell> */}
                            {/* <TableCell align="center">bbls</TableCell> */}
                        </TableRow>
                    </TableHead>
                    {
                        setup?.flowStations?.map(
                            ({ flowStation, name, numberOfUnits, measurementType }) => {
                                return (
                                    <TableBody>
                                        <TableRow key={flowStation}>
                                            <TableCell align="left" rowSpan={parseInt(numberOfUnits) + (measurementType === "Metering" ? 3*3 : 3 * 2)} colSpan={2}>{name}</TableCell>
                                        </TableRow>
                                        {
                                            new Array(parseInt(numberOfUnits)).fill(0).map(
                                                (meter, i) => <>
                                                <TableRow>
                                                    <TableCell  >
                                                        <Text>Gas Flared USM</Text>
                                                        {/* <Text>Fuel Gas</Text> */}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <TableInput
                                                            onChange={(e) => handleChange({ flowStation, field: 'serialNumber', measurementTypeValue: e.target.value, measurementTypeIndex: i })}
                                                            defaultValue={(measurementType === "Metering" ? "Meter" : "Tank") + (i + 1)}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'initialBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} />

                                                    </TableCell>
                                                    <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'finalBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} />

                                                    </TableCell>
                                                    {/* <TableCell align="center"> {tableValues?.[flowStation]?.list?.[i]?.netProduction} </TableCell> */}
                                                    <TableCell colSpan={2} align="center">-</TableCell>
                                                    {/* <TableCell align="center">-</TableCell>
                                                    <TableCell align="center">-</TableCell> */}
                                                </TableRow>
                                                    <TableRow>
                                                        <TableCell  >
                                                            <Text>Flared Gas</Text>
                                                            {/* <Text>Fuel Gas</Text> */}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TableInput
                                                                onChange={(e) => handleChange({ flowStation, field: 'serialNumber', measurementTypeValue: e.target.value, measurementTypeIndex: i })}
                                                                defaultValue={(measurementType === "Metering" ? "Meter" : "Tank") + (i + 1)}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'initialBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} />

                                                        </TableCell>
                                                        <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'finalBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} />

                                                        </TableCell>
                                                        {/* <TableCell align="center"> {tableValues?.[flowStation]?.list?.[i]?.netProduction} </TableCell> */}
                                                        <TableCell colSpan={2} align="center">12,9023</TableCell>
                                                        {/* <TableCell align="center">-</TableCell>
                                                        <TableCell align="center">-</TableCell> */}
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell  >
                                                            <Text>Export Gas</Text>
                                                            {/* <Text>Fuel Gas</Text> */}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <TableInput
                                                                onChange={(e) => handleChange({ flowStation, field: 'serialNumber', measurementTypeValue: e.target.value, measurementTypeIndex: i })}
                                                                defaultValue={(measurementType === "Metering" ? "Meter" : "Tank") + (i + 1)}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'initialBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} />

                                                        </TableCell>
                                                        <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'finalBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} />

                                                        </TableCell>
                                                        {/* <TableCell align="center"> {tableValues?.[flowStation]?.list?.[i]?.netProduction} </TableCell> */}
                                                        <TableCell colSpan={2} align="center">12,900000000</TableCell>
                                                        {/* <TableCell align="center">-</TableCell>
                                                        <TableCell align="center">-</TableCell> */}
                                                    </TableRow>
                                                    {
                                                        measurementType === "Tank Dipping" && <TableRow>
                                                            <TableCell align="center">Deduction</TableCell>
                                                            <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'deductionInitialBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} /></TableCell>
                                                            <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'deductionFinalBbls', measurementTypeValue: e.target.value, measurementTypeIndex: i })} /></TableCell>
                                                            <TableCell align="center">{tableValues?.[flowStation]?.list?.[i]?.deductionNetProduction}</TableCell>
                                                            <TableCell align="center">-</TableCell>
                                                            <TableCell align="center">-</TableCell>
                                                            <TableCell align="center">-</TableCell>
                                                        </TableRow>}
                                                </>
                                            )
                                        }

                                        <TableRow key={flowStation}>
                                            <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="left" className='pl-5 !bg-[rgba(178, 181, 182, 0.2)]' colSpan={4}><div className='pl-[30px]'> Total Gas Produced</div></TableCell>
                                            <TableCell sx={{ bgcolor: 'rgba(178, 181, 182, 0.2)' }} align="center">
                                                {tableValues?.[flowStation]?.subTotal || 0}
                                            </TableCell>
                                            {/* <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'netTarget', measurementTypeValue: e.target.value, measurementTypeIndex: null })} /></TableCell> */}
                                            {/* <TableCell align="center"><TableInput onChange={(e) => handleChange({ flowStation, field: 'bsw', measurementTypeValue: e.target.value, measurementTypeIndex: null })} />

                                            </TableCell> */}
                                            {/* <TableCell align="center">
                                                <TableInput onChange={(e) => handleChange({ flowStation, field: 'gross', measurementTypeValue: e.target.value, measurementTypeIndex: null })} />

                                            </TableCell> */}
                                        </TableRow>


                                    </TableBody>
                                )
                            }
                        )
                    }
                    <TableBody>
                        <TableRow >
                            <TableCell align="left" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} className='bg-[rgba(0, 163, 255, 0.3)]' colSpan={6}>{"Total Net Production"}</TableCell>
                            <TableCell  align="center" sx={{ bgcolor: 'rgba(0, 163, 255, 0.3)' }} >{totals?.netProductionTotal}</TableCell>
                            {/* <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.netTargetTotal}</TableCell>
                            <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.bswTotal}</TableCell> */}
                            {/* <TableCell align="center" sx={{ bgcolor: 'rgba(249, 249, 249, 1)' }}>{totals?.grossTotal}</TableCell> */}
                        </TableRow>
                    </TableBody>

                </Table>
            </TableContainer>
            <div className='justify-end flex my-2'>
                <Button className={'my-3'} onClick={save} width={150}>Save</Button>
            </div>
        </div>
    );
}