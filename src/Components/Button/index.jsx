import React from 'react'
import styles from './button.module.scss'
import { Box } from '@mui/material'
import { colors } from 'Assets'

const Button = ({ children, r, className, bgcolor, color, shadow, height, width, onClick, loading = false, disabled, type = 'button' }) => {
    return (
        <Box
            className={`${styles.button} px-2 ${className}`}
            component={'button'}
            style={{
                whiteSpace: 'nowrap',
                borderRadius: r || '10px',
                backgroundColor: bgcolor || colors.rada_blue,
                color: color || 'white',
                boxShadow: shadow ? `0px 8px 25px 0px ${shadow || colors.rada_light_blue}` : '',
                height: height || '41px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width, cursor: 'pointer',
                fontWeight: '600',
                opacity: loading ? .4 : 1,

            }}
            disabled={disabled}
            onClick={onClick}
            type={type}
        >
            {loading ? 'Loading...' : children}
        </Box>
    )
}

export default Button