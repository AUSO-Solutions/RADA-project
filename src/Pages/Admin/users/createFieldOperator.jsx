
<<<<<<< HEAD
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import React from 'react'
import { useSelector } from 'react-redux';
import { asset_types } from 'util/assetType';

const CreateFieldOperator = () => {
    const state = useSelector(state => state.auth?.user)
    const schema = Yup.object().shape({
        email: Yup.string().required(),
=======
import { Input, Button, RadaForm } from 'Components'
import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CreateFieldOPerator = () => {

    // const navigate = useNavigate();

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
>>>>>>> bf0b1ac (fixes to form etc)
    })

    return (
        <RadaForm
            btnClass={'w-[fit-content]'}
            className={'flex flex-col justify-center'}
<<<<<<< HEAD
            validationSchema={schema} btnText={'Create Field Operator'} url={'/api/admin/create-field-operator'}
=======
            validationSchema={schema} btnText={'Create Field Operator'} url={'/api/admin/create-fieldOperator'}
>>>>>>> bf0b1ac (fixes to form etc)
            method={'post'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={''} name='superAdminEmail' hidden value={state?.data?.email} />
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />
<<<<<<< HEAD

            <Input label={'Asset'} name='assetType' type='select' options={Object.values(asset_types).map(type => ({ label: type.value, value: type.value }))} />
=======
            <Input label={'Asset'} name='asset' />


>>>>>>> bf0b1ac (fixes to form etc)
        </RadaForm>
    )
}

<<<<<<< HEAD
export default CreateFieldOperator
=======
export default CreateFieldOPerator
>>>>>>> bf0b1ac (fixes to form etc)
