
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setUser } from 'Store/slices/auth';
import { useDispatch } from 'react-redux';

const UserLogin = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required().min(8),
    })

    return (
        <RadaForm
            validationSchema={schema}
            btnClass={'w-[100%] '}
            className={'w-[500px]'}
            btnText={'Login'}
            url={'/users/login'}
            method={'post'}
            onSuccess={(res) => {
                dispatch(setUser(res))
                navigate('/admin/create-users')
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '700px', gap: '20px' }}
        >
            <Input label={'Email'} name='email' />
            <Input label={'Password'} name='password' />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '300px' }} >
                {/* <Button width={'100px'} shadow onClick={() => window.location.pathname.includes('152') ? navigate('/152/register') : window.location.pathname.includes('147') ? navigate('/147/register') : navigate('/24/register')} >
                    Register
                </Button> */}
                {/* <Button width={'100px'} shadow onClick={() => login({ email: '', "password": "" })} >
                    Login
                </Button> */}
            </div>

            <Link to={'/forgot-password'} className='flex cursor-pointer'>
                Forget password?
            </Link>
        </RadaForm>
    )
}

export default UserLogin