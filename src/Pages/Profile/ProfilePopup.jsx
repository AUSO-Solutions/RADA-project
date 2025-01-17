import { colors } from 'Assets'
import { Button } from 'Components'
import Text from 'Components/Text'
import { useMe } from 'hooks/useMe'
import React from 'react'
// import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout_ } from 'utils/logout'

const ProfilePopup = ({onEdit=()=>null}) => {
    // const user = useSelector(state => state.auth?.user?.data)
    const {user} = useMe()

const navigate = useNavigate()
    return (
    
            <div 
                className={`shadow fixed right-[20px] z-[100000]  top-[50px] h-[fit-content] flex flex-col gap-3 rounded-[12px] px-5 py-3 w-[300px] bg-[white]`}
            >
                <Text className={'block'} display={'block'} weight={600} size={18}>{user?.firstName}   {user?.lastName}</Text>
                <Text className={'block'} display={'block'} weight={600} size={18}>{user?.email}</Text>
                <hr />
                <Text size={15} display={'block'} weight={600} >Group: {user?.groups?.join(', ')}</Text>
                <Text size={15} display={'block'} weight={600} >Assets: {user?.assets?.join(', ')}</Text>
                <Text size={15} display={'block'} weight={600} > My roles: {user?.roles?.map(role =>role?.roleName)?.join(', ')}</Text>
                <div className='flex justify-between w-full mt-4'>
                    <Button width={'50%'} className='font-bold cursor-pointer py-1 relative ' onClick={()=>{onEdit();navigate('/users/settings');}}
                    >
                        Edit</Button>    <Button onClick={() => logout_()} bgcolor={colors.rada_red} width={'48%'} className='font-bold cursor-pointer py-1 relative '
                        >
                        Logout</Button>
                </div>
            </div>
    )
}

export default ProfilePopup