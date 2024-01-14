import { Typography } from '@mui/material'
import React from 'react'

const Text = ({ children, size, color, weight, className, display, align,lH }) => {
    return (
        <Typography
            sx={{
                color,
                fontSize: size,
                fontWeight: weight,
                display: display || 'inline',
                textAlign: align || 'left',
                lineHeight:lH
            }}
            className={className}
        >
            {children}
        </Typography>
    )
}

export default Text