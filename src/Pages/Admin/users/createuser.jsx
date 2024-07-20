import React, { useMemo } from 'react'
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { useFetch } from 'hooks/useFetch';

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


const CreateUser = ({ updateUserId = null, defaultValues }) => {

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        // password: Yup.string().required().min(8),
    })
    const { data: roles } = useFetch({ firebaseFunction: 'getRoles' })
    const roleList = useMemo(() => {
        return roles.map(role => ({ value: role?.id, label: role?.roleName }))
    }, [roles])

    const dispatch = useDispatch()
    return (
        <RadaForm
            validationSchema={schema}
            noToken
            btnText={'Submit'}
            btnClass={'w-[100%] flex justify-center'}
            url={defaultValues ? 'updateUserByUid' : "createUser"} method={'post'}
            onSuccess={() => {
                // toast.success('Successfully')
                dispatch(closeModal())
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
            <Stack direction={'row'} spacing={1}>
                <Input label={'First Name'} name='firstName' defaultValue={defaultValues?.firstName} />
                <Input label={'Last Name'} name='lastName' defaultValue={defaultValues?.lastName} />
            </Stack>
            <Input label={'Email'} name='email' defaultValue={defaultValues?.email} />
            <Input label={'Roles'} name='roles' type='select' options={roleList} isMulti defaultValue={defaultValues?.roles?.map(role => ({ value: role?.id, label: role?.roleName }))} />
            {!defaultValues?.email && <Input label={'Password'} name='password' value={generatePass()} />}
            {defaultValues?.email && <Input hidden label={''} name='uid' value={defaultValues?.uid} />}

        </RadaForm>
    )
}

export default CreateUser