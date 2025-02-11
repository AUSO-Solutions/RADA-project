import React, { useState } from 'react';
import styles from './input.module.scss'
import { Box } from '@mui/material';
import OtpInput from 'react-otp-input';
import RadaSelect from './Select';
// import CheckInput from './CheckInput';

const OTPInput = (props) => {
    const [otp, setOtp] = useState()
    return <OtpInput
        value={otp}
        onChange={setOtp}
        containerStyle={{ width: '100%' }}
        inputStyle={{ width: '100%', color: 'red' }}
        {...props}
        numInputs={4}
        shouldAutoFocus
        skipDefaultStyles
        renderSeparator={<span className='mx-3'></span>}
        renderInput={(inputProps) => <input   {...inputProps} />}
    />

}


const Input = ({
    label,
    type = 'text',
    containerClass,
    onChange = () => null,
    getObj = () => null,
    inputClass,
    ...props
}) => {
    const change = (e) => {

        onChange(e)
        getObj({ [e.target.name]: e.target.value })
    }

    const input_id = 'input-id'
    const defaults = ['text', 'password', 'email', 'number','date','month', 'time']
    return (
        <Box className={`${styles.container} ${containerClass}`}>
            <Box component={'label'} htmlFor={input_id}>
                {label}
            </Box>
            {type === 'otp' && <OTPInput
                onChange={change}
                {...props}
            />}
            {type === 'select' && <RadaSelect {...props} onChange={onChange} />}
            {/* {type === 'checkbox' && <CheckInput {...props} />} */}
            {defaults.includes(type) && <input
                type={type}
                onChange={change}
                className={inputClass}
                {...props}
            />}
        </Box>
    )
}

export default Input