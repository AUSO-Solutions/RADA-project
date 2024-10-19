import { Input, RadaForm } from 'Components'
import Text from 'Components/Text'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { firebaseFunctions } from 'Services';
import * as Yup from 'yup';

const ChangePassword = () => {
    const user = useSelector(state => state.auth?.user?.data)
    console.log(user)
    const schema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        currentPassword: Yup.string().required('current password is required'),
        confirmPassword: Yup.string().required('confirm password is required').oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
        newPassword: Yup.string().required('New password is required').min(8),
    })
    const changePass = async (e) => {
        try {
            const auth = getAuth()
            await signInWithEmailAndPassword(auth, e?.email, e?.currentPassword)
            await firebaseFunctions('changePassword', { email: e?.email, uid: e?.uid, oldPassword: e?.oldPassword, newPassword: e?.newPassword })

            toast.success('Password changed successfully')
        } catch (error) {
            toast.error(error?.message)
        }
    }
    return (
        <div className='m-5'>
            <RadaForm
                className={'w-[500px]'}
                validationSchema={schema}
                noToken
                btnText={'Submit'}
                btnClass={'w-[100%] flex justify-center'}
                method={'post'}
                onSubmit={changePass}
                extraFields={{ email: user?.email }}
                // onSuccess={() => {
                //     toast.success('Password updated successfully!')
                // }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
                <Input label={'Email'} name='email' value={user?.email} disabled />

                <Input label={'Old password'} name='currentPassword' />
                <Input label={'New password '} name='newPassword' />
                <Input label={'Confirm password '} name='confirmPassword' />

                {user?.email && <Input hidden label={''} name='uid' value={user?.uid} />}

            </RadaForm>

        </div>
    )
}

export default ChangePassword