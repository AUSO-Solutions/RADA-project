import { FormControlLabel, Switch } from '@mui/material'
import React from 'react'

const RadaSwitch = ({ label, }) => {
    return (

        <FormControlLabel
            value="top"
            control={<Switch color="primary" />}
            label={label}
            labelPlacement="start"
        />


    )
}

export default RadaSwitch