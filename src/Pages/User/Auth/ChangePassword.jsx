import { Input, RadaForm } from 'Components'
import React from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const ChangePassword = () => {
  const formClass = 'w-[500px] mx-auto flex flex-col items-center justify-center p-[50px] shadow-[_5px_5px_4px_rgba(0,0,0,0.25)] rounded-[5px]'
  const user = useSelector(state => state?.auth?.user)

  const schema = Yup.object().shape({
    email: Yup.string().required(),
    initialPassword: Yup.string().required().min(8),
    newPassword: Yup.string().required().min(8),
    confirmPassword: Yup.string().required().min(8),
})
  return (
    <RadaForm
      className={formClass}
      btnText={'Submit'} url={'/users/change-password'}
      method={'put'} validationSchema={schema}
      onError={err => {
        console.log(err)
        if (err?.response?.status === 403) {
          toast.error('Current password in correct')
        }
      }}
    >
      {/* <Text size={20} weight={600} className={'text-center'}>
        Change password
      </Text> */}

      <div className='w-[500px]'>
        <Input type='email' name='email'   value={user?.data?.email}/>
        <Input label={'Current password'} name='initialPassword' />
        <Input label={'New password'} name={'newPassword'}/>
        <Input label={'Confirm password'} name={'confirmPassword'} />

      </div>


    </RadaForm>
  )
}

export default ChangePassword