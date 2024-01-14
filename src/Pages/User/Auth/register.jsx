
import { Input, Button } from 'Components'

import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {

    const navigate = useNavigate();



    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '30px' }} >
            <p style={{fontSize: '24px', fontWeight: 'normal'}}>
                REGISTER NEW USER
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', gap:'30px'}} > 
                    <Input label={'First Name'} />
                    <Input label={'Last Name'} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', gap:'30px'}} > 
                    <Input label={'Email Address'} />
                    <Input label={'Username'} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', gap:'30px'}} > 
                    <Input label={'Password'} />
                    <Input label={'Confirm Password'} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <Button width={'100px'} shadow  
                    onClick={() => window.location.pathname.includes('152') ? navigate('/152/login') :window.location.pathname.includes('147') ? navigate('/147/login') : navigate('/24/login')}
                     >
                        Register
                    </Button>

                </div>
            </div>
        </div>
    )
}

export default UserRegister