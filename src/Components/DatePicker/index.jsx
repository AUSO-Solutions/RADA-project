import { DateRangePicker as Comp } from 'rsuite';

import React from 'react'

const DateRangePicker = ({ onChange = () => null, startDate, endDate }) => {
    // console.log(startDate, endDate)
    return (

        <Comp format="MMMM dd, yyyy" 
        value={[new Date(startDate|| ""),new Date(endDate||"")]} 
         className='text-[10px] !w-[fit-content] rounded' onChange={e => onChange({ startDate: e?.[0], endDate: e?.[1] })} />
    )
}

export default DateRangePicker