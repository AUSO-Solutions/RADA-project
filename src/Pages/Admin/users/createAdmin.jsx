
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import React from 'react'


const CreateAdmin = () => {


    const schema= Yup.object().shape({
        email: Yup.string().required(),

    })

    return (
        <RadaForm validationSchema={schema} btnText={'Create Admin'} url={'/admin/create-admin'} method={'post'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '20px' }} >
            <Input label={'First Name'} name='firstname' />
            <Input label={'Last Name'} name='firstname' />
            <Input label={'Username'} name='email' />
            <Input label={'Asset'} name='asset' />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '300px' }} >
               
            </div>

          
        </RadaForm>
    )
}

export default CreateAdmin