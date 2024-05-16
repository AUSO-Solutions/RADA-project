
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import React from 'react'
import { useSelector } from 'react-redux';
import { asset_types } from 'util/assetType';

const CreateFieldOperator = () => {
    const state = useSelector(state => state.auth?.user)
    const schema = Yup.object().shape({
        email: Yup.string().required(),
    })

    return (
        <RadaForm
            btnClass={'w-[fit-content]'}
            className={'flex flex-col justify-center'}
            validationSchema={schema} btnText={'Create Field Operator'} url={'/api/admin/create-field-operator'}
            method={'post'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={''} name='superAdminEmail' hidden value={state?.data?.email} />
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />

            <Input label={'Asset'} name='assetType' type='select' options={Object.values(asset_types).map(type => ({ label: type.value, value: type.value }))} />
        </RadaForm>
    )
}

export default CreateFieldOperator