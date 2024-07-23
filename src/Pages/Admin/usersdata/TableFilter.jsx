import { Checkbox } from '@mui/material';
import React, { useState } from 'react'
import { IoFilterOutline } from "react-icons/io5";

const TableFilter = () => {

    const [showFilter, setShowFilter] = useState(false)
    return (
        <div className='float-right flex items-center w-[fit-content] px-2 relative'>
            {
                showFilter
                &&
                <div className='w-[400px] border absolute top-[-30px] shadow z-[1000] right-[30px]'>
                    <input type="search" name="" id="" />
                    <Checkbox  />
                </div>
            }
            <IoFilterOutline className='cursor-pointer' onClick={()=>setShowFilter(prev => !prev)} />
        </div>
    )
}

export default TableFilter