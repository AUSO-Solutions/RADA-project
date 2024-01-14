import React from 'react';
import styles from './input.module.scss'
import { Box } from '@mui/material';

const Input = ({ label, type = 'text', containerClass }) => {

    const input_id = 'input-id'

    return (
        <Box className={`${styles.container} ${containerClass}`}>
            <Box component={'label'} htmlFor={input_id}>
                {label}
            </Box>
            <Box
                component={'input'}
                type={type}
                id={input_id}
            />
        </Box>
    )
}

export default Input