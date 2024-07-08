import React from 'react'
import { Input, RadaForm } from 'Components'
// import { login } from 'Services/auth';
import * as Yup from 'yup';

import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { toast } from 'react-toastify';
import { useUsers } from 'hooks/useUsers';



// console.log(generatePass())

const CreateGroup = ({ }) => {

    // console.log(defaultValues)
    const schema = Yup.object().shape({
        groupName: Yup.string().required(),
        // members: Yup.array().required(),
        // password: Yup.string().required().min(8),
    })
    const { users } = useUsers()
    // console.log(users)

    const dispatch = useDispatch()
    return (
        <RadaForm
            validationSchema={schema}
            noToken
            btnText={'Submit'}
            btnClass={'w-[100%] flex justify-center'}
            url={"createGroup"} 
            onSubmit={console.log}
            method={'post'}
            className={'w-[400px]'}
            onSuccess={() => {
                toast.success('Successful')
                dispatch(closeModal())
            }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >

            <Input label={'Group Name'} name='groupName' />
            <Input label={'Members'} name='members' type='select' isMulti options={users?.map(user => ({ label: user?.firstName + " " + user?.lastName, value: user?.uid }))} />

        </RadaForm>
    )
}

export default CreateGroup