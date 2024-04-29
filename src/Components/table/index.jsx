import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import styles from './table.module.scss'
import { Pagination, TablePagination } from '@mui/material';
import { BsSearch, BsSortUpAlt } from 'react-icons/bs';
import Skeleton from '@mui/material/Skeleton';

// import PageLoader from 'next/dist/client/page-loader';

function Component({ columns, data= { Name : 'Emmanuel',
NetOil : '98',
} }) {


    
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, } = useTable({ columns, data, })

    return (
        <table className={styles.table} {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
const precolumns = [
    {
        Header: 'Transaction Date',
        accessor: 'firstName',

    },
    {
        Header: 'Learner',
        accessor: 'lastName',
    },
]
function Table({ columns = precolumns, data = [], handleChangePage, page, count = 10, size = 5, handleChangeRowsPerPage, onSearch = () => null, searchValue ,placeholder='Search'}) {
    const [processedData, setProcessedData] = useState(data)
    // const [search, setSearch] = useState('')
    useEffect(() => {
        setProcessedData(data)
    }, [data])

    return (
        <div className={styles.container}>
            <div className={styles.tablesearch}>
                <searchicon>
                    <BsSearch />
                </searchicon>
                <input placeholder={placeholder} value={searchValue} onChange={onSearch} />
                <sorticon>
                    <BsSortUpAlt />
                </sorticon>
            </div>
            {/* {processedData.length ? <Component columns={columns} data={processedData} /> : (
                processedData.length === 0 ?   'No data' : 'Loading...'
            )} */}
            {
                data ? (processedData.length ? (<Component columns={columns} data={processedData} />)
                    :     <Skeleton variant="rectangular" width={'auto'} height={700} />
                    )
                    : ('Loading...')
            }
            {/* <Divider/> */}
            <div className={styles.pagination}>
                <TablePagination
                    className={styles.rowPerpage}
                    component="div"
                    count={count}
                    page={page}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    onPageChange={(event, value) => handleChangePage(value - 1)}
                    rowsPerPage={size}
                    onRowsPerPageChange={(event) => handleChangeRowsPerPage(event.target.value)}
                    backIconButtonProps={{ style: { display: 'none' } }}
                    nextIconButtonProps={{ style: { display: 'none' } }}
                />
                <Pagination count={Math.floor(count / size) + 1} page={page + 1} onChange={(event, value) => handleChangePage(value - 1)} />
            </div>
        </div>
    )
}
export default Table
