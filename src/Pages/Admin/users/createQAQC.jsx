
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';
import React from 'react'

import { useSelector } from 'react-redux';
import { asset_types } from 'util/assetType';

const CreateQAQC = () => {

    // const navigate = useNavigate();
    const state = useSelector(state => state.auth)
    console.log(state?.user)

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    return (
        <RadaForm validationSchema={schema}  btnClass={'w-[fit-content]'} btnText={'Create QA/QC'} url={'/api/admin/create-qaQc'} method={'post'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={''} name='superAdminEmail' hidden value={state?.user?.data?.email} />
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='asset' type='select' options={Object.values(asset_types).map(type => ({ label: type.name, value: type.value }))} />
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

export default CreateQAQC