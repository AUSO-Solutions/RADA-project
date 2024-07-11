import { Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'

const CheckInput = ({ name, onChange, label, ...rest }) => {
    return (
        <>
            {/* <input type="checkbox" name="" id="" /> */}
            <FormControlLabel control={<Checkbox name={name} onChange={onChange} {...rest} />} label={label} />
        </>
    )
}

export default CheckInput