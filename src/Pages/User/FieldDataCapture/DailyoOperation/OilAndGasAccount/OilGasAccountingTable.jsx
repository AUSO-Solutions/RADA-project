import React, { useEffect, useState } from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import { store } from 'Store';
// import tableStyles from '../table.module.scss'
import RadioSelect from '../RadioSelect';
import RadaSwitch from 'Components/Input/RadaSwitch';
import RadaDatePicker from 'Components/Input/RadaDatePicker';
import { useSearchParams } from 'react-router-dom';
import OilGasAccountingIPSCTable from './OilAndGasAccountingIPSC';
import OilGasAccountingTableForActual from './OilGasAccountingTableForActual';
import { useFetch } from 'hooks/useFetch';
import dayjs from 'dayjs';
import { Alert } from '@mui/material';
import { Input } from 'Components';
import { useAssetByName } from 'hooks/useAssetByName';
import { useGetSetups } from 'hooks/useSetups';

const tables = ['IPSC', 'Actual Production', 'Deferred Production']

export default function OilGasAccountingTable() {

    const [searchParams, setSearchParams] = useSearchParams()
    const [flowStation, setFlowStation] = useState('')
    const { data: res } = useFetch({ firebaseFunction: 'getSetup', payload: { id: searchParams.get('id'), setupType: 'oilAndGasAccounting' } })
    const { setups: IPSCs } = useGetSetups("IPSC")
    const [date, setDate] = useState(dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
    const matchingIPSC = React.useMemo(() => {
        const gotten = IPSCs?.find(IPSC => IPSC.asset === res.asset && IPSC.month === dayjs(date).format("YYYY-MM"))
        const wellTestResultData = Object.values(gotten?.wellTestResultData || {}).filter(item => item?.flowstation === flowStation)

        const newWellTestResultData = Object.fromEntries(
            wellTestResultData
                .sort((a, b) => a?.productionString.localeCompare(b?.productionString))
                ?.map(item => ([item?.productionString, item])))
        return { ...gotten, wellTestResultData: newWellTestResultData }
    }, [res, IPSCs, flowStation,date])

    const { flowStations } = useAssetByName(matchingIPSC?.asset)

    useEffect(() => {
        setFlowStation(flowStations[0])
    }, [flowStations])


    return (
        < div className='px-3 w-full overflow-hidden'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <RadioSelect list={tables} defaultValue={tables.find(table => searchParams.get('table') === table.replaceAll(' ', '-').toLowerCase()) || tables[0]} onChange={(value) => setSearchParams(prev => {
                        prev.set('table', value.replaceAll(' ', '-').toLowerCase())
                        return prev
                    })} /> <RadaSwitch label="Edit Table" labelPlacement="left" />
                </div>
                <div className='flex gap-2 items-center'>
                    <RadaDatePicker onChange={setDate} value={date} max={dayjs().format('YYYY-MM-DD')} />
                    <Input disabled={flowStations.length === 1} value={{ label: flowStation, value: flowStation }} containerClass='!w-[200px]' type='select' options={flowStations?.map(flowStation => ({ label: flowStation, value: flowStation }))} onChange={e => setFlowStation(e.value)} />
                </div>
            </div>

            {
                matchingIPSC ?
                    <>
                        {(!searchParams.get('table') || searchParams.get('table') === 'ipsc') && <OilGasAccountingIPSCTable IPSC={matchingIPSC} />}
                        {(searchParams.get('table') === 'actual-production' || searchParams.get('table') === 'deferred-production') && <OilGasAccountingTableForActual IPSC={matchingIPSC} flowStation={flowStation} date={date} />}

                    </> : <>
                        <Alert severity='info' > No IPSC for {res.asset} in the month {dayjs().format("YYYY-MM")} </Alert>
                    </>
            }

        </div>
    );
}