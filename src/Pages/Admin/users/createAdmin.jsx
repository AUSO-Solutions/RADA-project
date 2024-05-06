
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import React from 'react'
import { useSelector } from 'react-redux';
import { asset_types } from 'util/assetType';


const CreateAdmin = () => {

    const state = useSelector(state => state.auth?.user)
    const schema = Yup.object().shape({
        email: Yup.string().required(),

    })

    return (
        <RadaForm validationSchema={schema}  btnClass={'w-[fit-content]'} btnText={'Create Admin'} url={'/admin/create-admin'} method={'post'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={''} name='superAdminEmail' hidden value={state?.data?.email} />
            <Input label={'First Name'} name='firstname' />
            <Input label={'Last Name'} name='firstname' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='asset' type='select' options={Object.values(asset_types).map(type => ({ label: type.name, value: type.value }))} />



        </RadaForm>
    )
}

export default CreateAdmin