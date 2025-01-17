import { Typography } from '@mui/material'
import React from 'react'

const Text = ({ children, size, color, weight, className, display, align,lH, onClick=()=>null }) => {
    return (
        <Typography
            sx={{
                color,
                fontSize: size,
                fontWeight: weight,

                fontFamily:'Poppins',
                display: display || 'inline',
                textAlign: align || 'left',
                lineHeight:lH
            }}
            className={className}
            onClick={onClick}
        >
            {children}
        </Typography>
    )
}

export default Text