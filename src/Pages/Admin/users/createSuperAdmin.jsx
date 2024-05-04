
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'

const CreateSuperAdmin = () => {

    // const navigate = useNavigate();

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    return (
        <RadaForm
            validationSchema={schema}
            btnText={'Create Super Admin'}
            url={'/users/create'} method={'post'} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='assetType' />
            <Input label={'Password'} name='password' />
        </RadaForm>
    )
}

export default CreateSuperAdmin