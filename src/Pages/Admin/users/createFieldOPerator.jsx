
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
<<<<<<< HEAD
        <RadaForm btnClass={'w-[fit-content]'} className={'flex flex-col justify-center'} validationSchema={schema} btnText={'Create Field Operator'} url={'/admin/create-fieldOperator'} method={'post'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input name='superAdminEmail' hidden value={'kehindesalaudeen222@gmail.com'} />
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Email'} name='email' />
            <Input label={'Asset'} name='assetType' />



=======
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
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '300px' }} >
                {/* <Button width={'100px'} shadow onClick={() => window.location.pathname.includes('152') ? navigate('/152/register') : window.location.pathname.includes('147') ? navigate('/147/register') : navigate('/24/register')} >
                    Register
                </Button> */}
                {/* <Button width={'100px'} shadow onClick={() => login({ email: '', "password": "" })} >
                    Login
                </Button> */}
            </div>


>>>>>>> 2e597d89edd36066ddb874aa10cf7b4563846cc9
        </RadaForm>
    )
}

export default CreateFieldOPerator