import { Checkbox, FormControlLabel } from '@mui/material'
import { TickSquare } from 'iconsax-react'
import React from 'react'

const CheckInput = ({ name, onChange, label, ...rest }) => {
    return (
        <>
            {/* <input type="checkbox" name="" id="" /> */}
            <FormControlLabel control={<Checkbox  checkedIcon={<TickSquare />} required={rest?.required}  name={name} onChange={onChange} {...rest} />} label={label} />
        </>
    )
}

export default CheckInput