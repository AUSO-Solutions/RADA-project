
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import React from 'react'
import { useSelector } from 'react-redux';

const CreateFieldOPerator = () => {

    // const navigate = useNavigate();
    const state = useSelector(state => state.auth?.user)
    // console.log(state)

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    return (
        <RadaForm
            btnClass={'w-[fit-content]'}
            className={'flex flex-col justify-center'}
            validationSchema={schema} btnText={'Create Field Operator'} url={'/api/admin/create-fieldOperator'}
            method={'post'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={''} name='superAdminEmail' hidden value={state?.data?.email} />
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='asset' />


        </RadaForm>
    )
}

export default CreateFieldOPerator