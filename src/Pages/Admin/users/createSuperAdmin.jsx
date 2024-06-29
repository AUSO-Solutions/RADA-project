
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'

const CreateSuperAdmin = () => {

    // const navigate = useNavigate();

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    return (
        <RadaForm
            validationSchema={schema}
            noToken
            btnText={'Create Super Admin'}
            btnClass={'w-[fit-content]'}
            url={'createSuperAdmin'} method={'post'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />
            <Input label={'Password'} name='password' />
        </RadaForm>
    )
}

export default CreateSuperAdmin