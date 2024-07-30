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


const TableInput = () => {
  return <input className='p-1 text-center w-[70px] border outline-none' />
}

export default function VolumeMeasurementTable() {
  const setup = React.useMemo(() => {
    return store.getState().setup

  }, [])
  console.log(setup)
  return (
    < div className='px-3'>
      <RadioSelect list={setup?.reportTypes} />
      <TableContainer className={`m-auto border ${tableStyles.borderedMuiTable}`}>
        <Table sx={{ minWidth: 700 }} >
          <TableHead >
            <TableRow sx={{ bgcolor: `rgba(239, 239, 239, 1) !important`, color: 'black', fontWeight: 'bold  !important' }}>
              <TableCell align="left" colSpan={3} >
                Flow stations
              </TableCell>
              <TableCell align="center" colSpan={3} >
                Meter Readings
              </TableCell>
              <TableCell align="center">Net Production</TableCell>
              <TableCell align="center">Net Target</TableCell>
              <TableCell align="center">BS&W</TableCell>
              <TableCell align="center">Gross</TableCell>
            </TableRow>
            <TableRow>

              <TableCell align="left" colSpan={3} >
                Input Values for each flow station
              </TableCell>
              <TableCell align="center">Meter Name</TableCell>
              <TableCell align="center">Initial (bbls)</TableCell>
              <TableCell align="center">Final (bbls)</TableCell>
              <TableCell align="center">bbls</TableCell>
              <TableCell align="center">bbls</TableCell>
              <TableCell align="center">%</TableCell>
              <TableCell align="center">bbls</TableCell>
            </TableRow>
          </TableHead>
          {
            setup?.flowStations?.map(
              (flowStation) => {
                return (
                  <TableBody>
                    <TableRow key={flowStation}>
                      <TableCell align="left" rowSpan={parseInt(setup?.measurementTypeNumber[flowStation]) + 2} colSpan={3}>{flowStation}</TableCell>
                    </TableRow>
                    {
                      new Array(parseInt(setup?.measurementTypeNumber[flowStation])).fill(0).map(
                        (meter, i) => <TableRow>
                          <TableCell align="center">Meter {i + 1}</TableCell>
                          <TableCell align="center"><TableInput /></TableCell>
                          <TableCell align="center"><TableInput /></TableCell>
                          <TableCell align="center">100</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell align="center">-</TableCell>
                        </TableRow>
                      )
                    }
                    <TableRow key={flowStation}>
                      <TableCell align="left" className='pl-5 bg-[rgba(239, 239, 239, 1)]' colSpan={3}>Sub total</TableCell>
                      <TableCell align="center">100</TableCell>
                      <TableCell align="center">100</TableCell>
                      <TableCell align="center">100</TableCell>
                      <TableCell align="center">100</TableCell>
                    </TableRow>
                  </TableBody>
                )
              }
            )
          }

        </Table>
      </TableContainer>
    </div>
  );
}