
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import React from 'react'

const CreateFieldOPerator = () => {

    // const navigate = useNavigate();

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    return (
        <RadaForm btnClass={'w-[fit-content]'} className={'flex flex-col justify-center'} validationSchema={schema} btnText={'Create Field Operator'} url={'/admin/create-fieldOperator'} method={'post'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input name='superAdminEmail' hidden value={'kehindesalaudeen222@gmail.com'} />
            <Input label={'First Name'} name='firstName' />
            <Input label={'Last Name'} name='lastName' />
            <Input label={'Email'} name='email' />
            <Input label={'Asset'} name='assetType' />



        </RadaForm>
    )
}

export default CreateFieldOPerator