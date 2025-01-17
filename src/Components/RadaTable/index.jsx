import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import { BsThreeDots } from 'react-icons/bs';
import { useMemo } from 'react';
// import TableFilter from 'Pages/Admin/usersdata/TableFilter';
// import { RadaForm } from 'Components';
import TableSearch from './TableSearch';
import { firebaseFunctions } from 'Services';
import { useSelector } from 'react-redux';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.common.white,    
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        wordBreak: 'keep-all !important',
        // color:'red'
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },

    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    // border:'1px dashed grey'
}));



export default function RadaTable({ data = [], columns = [], noNumbers, fn = () => null, actions = () => null, noaction, idKey = "id", noSearch, searchKey = 'search', firebaseApi = '', headBgColor ='white' }) {
    const updatec = useMemo(() => {
        return fn() ? fn(columns) : columns
    }, [columns, fn])
    const [showAction, setShowAction] = React.useState(false)
    // console.log(showAction)
    const [search, setSearch] = React.useState('')
    const [resFromBackend, setResFromBackend] = React.useState([])
    // const []
    const { isOpen } = useSelector(state => state.modal)
    React.useEffect(() => {
        const fetch = async () => {
            if (firebaseApi) {
                const res = await firebaseFunctions(firebaseApi,{},false,{useToken:true})
                if (res?.data?.length) setResFromBackend(res?.data)
            }
        }
       if(!isOpen) fetch()
    }, [firebaseApi,isOpen])


    const tableData = useMemo(() => {
        let result = resFromBackend.length? resFromBackend : data
        if (search) result = (result.filter(datum => Object.values(datum).some(field => String(field).toLowerCase().includes(search))))
        return result
    }, [data, search, resFromBackend, ])

    return (
        <TableContainer component={'div'} sx={{ overflowX: 'auto' }} className='px-3 w-full'>
            { !noSearch && <TableSearch onChange={(e) => setSearch(e.target.value?.toLowerCase())} />}
            {/* <TableFilter /> */}
            <Table  sx={{ minWidth: 700, bgcolor: 'white' }} className='' aria-label="customized table">
                <TableHead sx={{  "& th": {bgcolor: `${headBgColor} !important`, color: 'black', fontWeight:'bold'} }} className='border-t '>
                    <TableRow >
                        { !noNumbers && <StyledTableCell>S/N</StyledTableCell>}
                        {
                            updatec.map((column, i) => <StyledTableCell  key={i} >{column.name}</StyledTableCell>)
                        }
                        {!noaction && <StyledTableCell>Action</StyledTableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((row, i) => (
                        <React.Fragment key={i}>
                            <StyledTableRow>
                                {!noNumbers && <StyledTableCell align="left">{i + 1} </StyledTableCell>}
                                {
                                    updatec.map((column, inner_index) => <StyledTableCell key={i + inner_index} align="left">
                                        {column?.render ? column?.render(row) : row[column.key]}
                                    </StyledTableCell>)

                                }
                                {!noaction && <StyledTableCell sx={{position:'relative !important'}} align="right">
                                    <BsThreeDots color='black' className='cursor-pointer' onClick={() => setShowAction(i)} />
                                    {
                                        (showAction === i) && <>
                                            <div className='h-[100vh] w-[100vw] top-0 left-0  !fixed' onClick={() => setShowAction(false)}></div>
                                            <div className='!absolute flex flex-col !top-0 bg-white shadow-md rounded-[8px]  min-w-[100px] text-left right-[50px]'>

                                                {actions(row, i)}

                                            </div>
                                        </>
                                    }
                                </StyledTableCell>}
                            </StyledTableRow>
                        </React.Fragment>

                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
