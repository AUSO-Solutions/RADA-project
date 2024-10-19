import { Input, RadaForm } from 'Components'
import Text from 'Components/Text'
import React from 'react'
import { useSelector } from 'react-redux'

const UserDetails = () => {
    const user = useSelector(state => state.auth?.user?.data)
console.log(user)
    return (
        <div className='m-5'>

            <RadaForm  className='flex flex-col w-[40%] gap-5' btnText={'Save'}>
                <Input label={'First Name'} defaultValue={user?.firstName}/>
                <Input label={'Last Name'} defaultValue={user?.lastName}/>
                <Input label={'Email'} defaultValue={user?.email} disabled/>
               
             <div className='flex flex-col mt-4 gap-3'>
             <Text size={15} display={'block'} weight={600} >Group: {user?.groups?.join(', ')}</Text>
                <Text size={15} display={'block'} weight={600} >Assets: {user?.assets?.join(', ')}</Text>
                <Text size={15} display={'block'} weight={600} > My roles: {user?.roles?.map(role =>role?.roleName)?.join(', ')}</Text>
             </div>
                {/* <div className='mt-5 flex justify-end' >
                    <Button width={150}>Save</Button>
                </div> */}
            </RadaForm>


        </div>
    )
}

export default UserDetails