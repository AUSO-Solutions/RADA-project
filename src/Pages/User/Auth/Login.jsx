
import { Input, Button } from 'Components'
import { login } from 'Services/auth';


import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserLogin = () => {

    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={'Username'} />
            <Input label={'Password'} />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '300px' }} >
                <Button width={'100px'} shadow onClick={() => window.location.pathname.includes('152') ? navigate('/152/register') : window.location.pathname.includes('147') ? navigate('/147/register') : navigate('/24/register')} >
                    Register
                </Button>
                <Button width={'100px'} shadow onClick={() => login({ email: '', "password": "" })} >
                    Login
                </Button>
            </div>

            <Link to={'/forgot-password'} className='flex cursor-pointer'>
                Forget password?
            </Link>
        </div>
    )
}

export default UserLogin