
import { Input, Button, RadaForm } from 'Components'
import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CreateFieldOPerator = () => {

    // const navigate = useNavigate();

    const schema= Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    return (
        <RadaForm btnClass={'w-[fit-content]'} className={'flex flex-col justify-center'} validationSchema={schema} btnText={'Create Field Operator'} url={'/admin/create-fieldOperator'} method={'post'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={'First Name'} name='adminEmail' hidden value={'eoludairo61@gmail.com'} />  
             <Input label={'First Name'} name='firstname' />
            <Input label={'Last Name'} name='firstname' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='asset' />      
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '300px' }} >
                {/* <Button width={'100px'} shadow onClick={() => window.location.pathname.includes('152') ? navigate('/152/register') : window.location.pathname.includes('147') ? navigate('/147/register') : navigate('/24/register')} >
                    Register
                </Button> */}
                {/* <Button width={'100px'} shadow onClick={() => login({ email: '', "password": "" })} >
                    Login
                </Button> */}
            </div>

          
        </RadaForm>
    )
}

export default CreateFieldOPerator