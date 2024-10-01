import { Button } from 'Components'
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import Text from 'Components/Text';
import {  Divider } from '@mui/material';
import { colors } from 'Assets';
import { useFetch } from 'hooks/useFetch';
import CheckInput from 'Components/Input/CheckInput';
import { Query } from './Query';

export const SendTo = ({ title }) => {
    const dispatch = useDispatch()
    const { data: groups } = useFetch({ firebaseFunction: 'getGroups' })
    const [selectedGroups, setSelectedGroups] = React.useState([])
    const back = async () => {
        dispatch(closeModal())
        dispatch(openModal({ component: <Query /> }))
    }
    const selectGrroup = (group) => {
        setSelectedGroups(prev => {
            if (prev.map(group => group?.groupName).includes(group?.groupName)) {
                return prev.filter(prevGroup => prevGroup?.groupName !== group?.groupName)
            }
            return [...prev, group]
        })
    }
    const send = async () => {
        console.log(selectedGroups)
        dispatch(closeModal())
        dispatch(openModal({ component: <Query done /> }))
    }
    return <div className='w-[500px] p-1 h-[600px]'>
        <Text size={24}>Send to</Text>

        <Divider className='!mt-[40px]' />

        <input type="search" className='border bg-[#FAFAFAFA] px-2 py-1 w-[200px] mt-4 rounded' placeholder='Search group' />
        <div className='mt-5 p-2  !h-[100px] f'>
            < div className='py-2 border-b'>
                <CheckInput label={'Select all group'} key={selectedGroups.length} checked={selectedGroups.length === groups.length} onChange={(e) => {
                    setSelectedGroups(prev => {
                        console.log(prev.length === groups.length)
                        return prev.length === groups.length ? [] : groups
                    })
                }} />
            </div>
            <div className='flex flex-col'>
                {
                    groups.map(group => <div className='py-2 border-b'>
                        <CheckInput onChange={() => selectGrroup(group)} checked={selectedGroups.includes(group)} key={group?.groupName} label={group.groupName} />
                    </div>)
                }
            </div>



            <Button onClick={back} color={colors.rada_blue} bgcolor={'white'} width={100} className={`float-left border !border-[${colors.rada_blue}] mt-[50px]`}>
                Back
            </Button>
            <Button onClick={send} width={100} className={'float-right mt-[50px]'}>
                Send
            </Button>
        </div>

    </div>
}
