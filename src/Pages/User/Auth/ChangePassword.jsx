import { Input, RadaForm } from 'Components'
import Text from 'Components/Text'
import React from 'react'

const ChangePassword = () => {
  const formClass = 'w-[400px] h-[100%] flex flex-col items-center  pt-[7%]'
  return (
    <RadaForm
      className={formClass}
      btnText={'Submit'} url={'/users/change-password'}
      method={'put'} validationSchema={null}

    >
      <Text size={20} weight={600} className={'text-center'}>
        Change password
      </Text>

      <div className='w-[400px] mt-[30px]'>
        <Input type='email' name='email'   value={'kehindesalaudee22@gmail.com'}/>
        <Input label={'Current password'} name='initialPassword' />
        <Input label={'New password'} name={'newPassword'}/>
        <Input label={'Confirm password'} name={'confirmPassword'} />

      </div>


    </RadaForm>
  )
}

export default ChangePassword