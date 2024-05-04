
import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

export default function OTPInput({ onChange = () => null, name }) {
    const [otp, setOtp] = useState('');

    useEffect(() => {
        onChange(otp)
    }, [otp,onChange])

    return (<>
        <input hidden  name={name} value={otp} onChange={()=>null} />
        <OtpInput
            value={otp}
            containerStyle={{ width: '100%' }}
            inputStyle={{ width: '100%', border: '1px solid lightgray', borderRadius: '8px', height: '50px' }}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<div className='mx-2'> </div>}
            renderInput={(props) => <input {...props} />}
        />
    </>
    );
}