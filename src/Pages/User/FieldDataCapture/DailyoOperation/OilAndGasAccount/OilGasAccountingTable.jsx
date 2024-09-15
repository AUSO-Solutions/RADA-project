import * as React from 'react';
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

const tables = ['IPSC', 'Actual Production', 'Deferred Production']

export default function OilGasAccountingTable() {
    const [searchParams, setSearchParams] = useSearchParams()


    return (
        < div className='px-3 w-full'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <RadioSelect list={tables} defaultValue={tables.find(table => searchParams.get('table') === table.replaceAll(' ', '-').toLowerCase()) || tables[0]} onChange={(value) => setSearchParams(prev => {
                        prev.set('table', value.replaceAll(' ', '-').toLowerCase())
                        return prev
                    })} /> <RadaSwitch label="Edit Table" labelPlacement="left" />
                </div>
                <RadaDatePicker  disabled />
            </div>

            {(!searchParams.get('table') || searchParams.get('table') === 'ipsc') && <OilGasAccountingIPSCTable />}
          {(searchParams.get('table') === 'actual-production' || searchParams.get('table') === 'deferred-production') &&  <OilGasAccountingTableForActual />}
        </div>
    );
}