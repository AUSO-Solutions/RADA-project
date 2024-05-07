import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BsThreeDots } from 'react-icons/bs';
import { useMemo } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



export default function RadaTable({ data = [], columns = [], fn = () => null, actions = () => null, noaction, idKey = "id" }) {
    const updatec = useMemo(() => {
        return fn() ? fn(columns) : columns
    }, [columns,fn])
    const [showAction, setShowAction] = React.useState(false)


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>S/N</StyledTableCell>
                        {
                            updatec.map((column,i) => <StyledTableCell key={i} >{column.name}</StyledTableCell>)
                        }
                        <StyledTableCell>Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { data.map((row, i) => (
                        <React.Fragment   key={i}>
                            <StyledTableRow>
                                <StyledTableCell align="right">{i + 1} </StyledTableCell>
                                {
                                    updatec.map((column,inner_index) => <StyledTableCell key={i+inner_index} align="left">{row[column.key]}</StyledTableCell>)

                                }
                                {!noaction && <StyledTableCell align="right">
                                    <BsThreeDots color='black' className='cursor-pointer' onClick={() => setShowAction(true)} />
                                    {
                                        showAction && <>
                                        <div className='h-[100vh] w-[100vw] top-0 left-0  fixed' onClick={()=>setShowAction(false)}></div>
                                            <div className='absolute flex flex-col bg-white shadow rounded-[8px]  min-w-[100px] text-left right-[50px]'>
                                                {actions(data[i], i)}

                                            </div>
                                            </>
                                    }
                                </StyledTableCell>}
                            </StyledTableRow>
                        </React.Fragment>

                    )) }
                </TableBody>
            </Table>
        </TableContainer>
    );
}
