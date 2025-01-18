import { Input, RadaForm } from 'Components'
import Text from 'Components/Text'
import React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const UserDetails = () => {
    const user = useSelector(state => state.auth?.user?.data)
    console.log(user)
    const schema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        firstName: Yup.string().required('First name is required').min(),
        lastName: Yup.string().required('Last name is required').min(),
    })
    return (
        <div className='m-5'>
            <RadaForm
                className={'w-[500px]'}
                validationSchema={schema}
                noToken
                btnText={'Submit'}
                btnClass={'w-[100%] flex justify-center'}
                url={'updateUserByUid'} method={'post'}
                onSuccess={() => {
                    toast.success('Details updated successfully!')
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
                {/* <Stack direction={'row'} spacing={1}> */}
                <Input label={'First Name'} name='firstName' defaultValue={user?.firstName} />
                <Input label={'Last Name'} name='lastName' defaultValue={user?.lastName} />
                {/* </Stack> */}
                <Input label={'Email'} name='email' defaultValue={user?.email} />

                <div className='flex flex-col mt-4 gap-3'>
                    <Text size={15} display={'block'} weight={600} >Group: {user?.groups?.join(', ')}</Text>
                    <Text size={15} display={'block'} weight={600} >Assets: {user?.assets?.join(', ')}</Text>
                    <Text size={15} display={'block'} weight={600} > My roles: {user?.roles?.map(role => role?.roleName)?.join(', ')}</Text>
                </div>
                {/* {!user?.email && <Input label={'Password'} name='password' value={generatePass()} />} */}
                {user?.email && <Input hidden label={''} name='uid' value={user?.uid} />}

            </RadaForm>

        </div>
    )
}

export default UserDetails