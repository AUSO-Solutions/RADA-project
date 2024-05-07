
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'
import { asset_types } from 'util/assetType';


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
            btnClass={'w-[fit-content]'}
            url={'/users/create'} method={'post'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='asset' type='select' options={Object.values(asset_types).map(type => ({ label: type.name, value: type.value }))} />
            <Input label={'Password'} name='password' />
        </RadaForm>
    )
}

export default CreateSuperAdmin