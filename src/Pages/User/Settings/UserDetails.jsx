import { Button, Input } from 'Components'
import React from 'react'

const UserDetails = () => {

    // const user = useSelector(state => state.user)
    // console.log(user)


    return (
        <div className='m-5'>

            <div className='flex flex-col w-[40%] gap-[5]'>
                <Input label={'Name'} />
                <Input label={'Email'} />
                <Input label={'Role'} />
                <Input label={'Asset'} />
                <Input label={'Group'} />
                <div className='mt-5 flex justify-end' >
                    <Button>Save</Button>
                </div>
            </div>


        </div>
    )
}

export default UserDetails