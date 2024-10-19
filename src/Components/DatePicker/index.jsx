import { DateRangePicker as Comp } from 'rsuite';

import React from 'react'

const DateRangePicker = ({ onChange = () => null, defaultStartDate, defaultEndDate }) => {
    return (

        <Comp format="MMMM dd, yyyy" defaultValue={[
            defaultStartDate, defaultEndDate
        ]} className=' rounded' onChange={e => onChange({ startDate: e?.[0], endDate: e?.[1] })} />
    )
}

export default DateRangePicker