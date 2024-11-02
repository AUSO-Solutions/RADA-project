import CheckInput from 'Components/Input/CheckInput'
import { useFetch } from 'hooks/useFetch'
import { useUsers } from 'hooks/useUsers'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFormdata } from 'Store/slices/formdataSlice'

const SelectGroup = ({ onChange = () => null }) => {
    const dispatch = useDispatch()
    const formdata = useSelector(state => state.formdata)
    const { data: groups } = useFetch({ firebaseFunction: 'getGroups' })
    const { users } = useUsers()
    // console.log(users)
    const [selectedGroups, setSelectedGroups] = useState(formdata?.selectedGroups || [])
    const [selectedUsers, setSelectedUsers] = useState(formdata?.selectedUsers || [])
    const singleUser = (user) => ({ name: `${user?.firstName} ${user?.lastName}`, email: user?.email, uid: user?.uid })
    const selectAllGroups = () => {
        setSelectedGroups(prev => {
            if (prev.length === groups.length) return []
            return groups
        })
    }
    const selectAllUsers = () => {
        setSelectedUsers(prev => {
            if (prev.length === users.length) return []
            return users.map(singleUser)
        })
    }
    const selectGroup = (group) => {
        setSelectedGroups(prev => {
            if (prev.map(gr => gr?.id).includes(group?.id)) return prev.filter(group_ => group_?.id !== group?.id)
            return [...prev, group]
        })
    }
    const selectUsers = (user) => {
        setSelectedUsers(prev => {
            if (prev.map(user => user?.uid).includes(user?.uid)) return prev?.map(singleUser)?.filter(user_ => user_?.uid !== user?.uid)
            return [...prev, singleUser(user)]
        })
    }
    useEffect(() => {
        onChange(selectedGroups)
        dispatch(setFormdata({ name: 'selectedGroups', value: selectedGroups }))
        dispatch(setFormdata({ name: 'selectedUsers', value: selectedUsers }))
        // eslint-disable-next-line
    }, [selectedGroups, selectedUsers, dispatch])
    const [searchWord, setSearchWord] = useState('')

    const searchIn = (key, item) => {
        return item?.[key]?.toLowerCase()?.includes(searchWord?.toLowerCase())
    }
    // console.log(users)

    return (
        <div className='min-w-[400px]'>

            <input className='bg-[lightgray] rounded border outline-none p-2   w-[300px]' placeholder='Search group' onChange={e => setSearchWord(e.target.value)} />
            <div className='border-b py-2'>
                <CheckInput label={'Select all groups'} checked={selectedGroups.length === groups.length} onChange={() => {
                    selectAllGroups()
                    onChange(selectedGroups)
                }} />
                <CheckInput label={'Select all users'} checked={selectedUsers.length === users.length} onChange={() => {
                    selectAllUsers()
                    onChange(selectedUsers)
                }} />
            </div>
            <div className='flex flex-col !h-[300px] !overflow-y-scroll'>
                <br />
                Groups : <br />
                {
                    groups.filter(group => group?.groupName.toLowerCase()?.includes(searchWord?.toLowerCase())).map(group => <div className='border-b py-2'>
                        <CheckInput label={group?.groupName} key={group?.id} checked={selectedGroups?.map(({ id }) => id).includes(group?.id)} onChange={() => {
                            selectGroup(group)
                        }} />
                    </div>)
                }<br />
                Users : <br />
                {
                    users
                        .filter(user => {
                            return searchIn('firstName', user) || searchIn('lastName', user) || searchIn('email', user)
                        })
                        .map(user => <div className='border-b py-2'>
                            <CheckInput label={`${user?.firstName} ${user?.lastName}`} key={user?.uid} checked={selectedUsers?.map(({ uid }) => uid).includes(user?.uid)} onChange={() => {
                                selectUsers(user)
                            }} />
                        </div>)
                }
            </div>

        </div>
    )
}

export default SelectGroup