
import { Input, Button, RadaForm } from 'Components'
import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const CreateQA_QC = () => {

    // const navigate = useNavigate();
    const state = useSelector(state => state.auth)
    console.log(state.user)

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    return (
        <RadaForm validationSchema={schema} btnText={'Create QA/QC'} url={'/api/admin/create-qaQc'} method={'post'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={''} name='superAdminEmail' hidden value={state.user?.data?.email} />
            <Input label={'First Name'} name='firstname' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='assetType' />


        </RadaForm>
    )
}

export default CreateQA_QC