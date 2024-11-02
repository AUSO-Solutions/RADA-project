import { DateRangePicker as Comp } from 'rsuite';

import React from 'react'

const DateRangePicker = ({ onChange = () => null, startDate, endDate }) => {
    // console.log(startDate, endDate)
    return (

        <Comp format="MMMM dd, yyyy" defaultValue={[new Date(startDate),new Date(endDate)]}  className=' w-fit rounded' onChange={e => onChange({ startDate: e?.[0], endDate: e?.[1] })} />
    )
}

export default DateRangePicker