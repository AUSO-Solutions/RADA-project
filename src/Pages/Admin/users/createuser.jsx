import React from 'react'
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { toast } from 'react-toastify';




/* Function to generate combination of password */
function generatePass() {
    let pass = '';
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 8; i++) {
        let char = Math.floor(Math.random()
            * str.length + 1);

        pass += str.charAt(char)
    }

    return pass;
}

// console.log(generatePass())

const CreateUser = ({updateUserId=null, defaultValues}) => {

    // console.log(defaultValues)
    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })

    const dispatch = useDispatch()
    return (
        <RadaForm
            validationSchema={schema}
            noToken
            btnText={'Submit'}
            btnClass={'w-[100%] flex justify-center'}
            url={defaultValues?'updateUserByUid':"createUser"} method={'post'}
            onSuccess={() => {
                toast.success('Successfully')
                dispatch(closeModal())
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
            <Stack direction={'row'} spacing={1}>
                <Input label={'First Name'} name='firstName' defaultValue={defaultValues?.firstName}  />
                <Input label={'Last Name'} name='lastName' defaultValue={defaultValues?.lastName}  />
            </Stack>
            <Input label={'Email'} name='email'  defaultValue={defaultValues?.email} />
            <Input label={'Roles'} name='roles' />
            {!defaultValues?.email && <Input label={'Password'} name='password' value={generatePass()} />}
            {defaultValues?.email && <Input hidden label={''} name='uid' value={defaultValues?.uid} />}

        </RadaForm>
    )
}

export default CreateUser