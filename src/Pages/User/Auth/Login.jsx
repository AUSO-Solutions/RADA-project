
import { Input, Button } from 'Components'

import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserLogin = () => {

    const navigate = useNavigate();


    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={'Username'} />
            <Input label={'Password'} />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '300px' }} >
                <Button width={'100px'} shadow onClick={() => window.location.pathname.includes('152') ? navigate('/152/register') :window.location.pathname.includes('147') ? navigate('/147/register') : navigate('/24/register')  } >
                    Register
                </Button>
                <Button width={'100px'} shadow onClick={() => navigate('/152/form')} >
                    Login
                </Button>
            </div>
        </div>
    )
}

export default UserLogin