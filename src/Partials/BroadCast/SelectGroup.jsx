import CheckInput from 'Components/Input/CheckInput'
import { useFetch } from 'hooks/useFetch'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFormdata } from 'Store/slices/formdataSlice'

const SelectGroup = ({ onChange = () => null }) => {
    const dispatch = useDispatch()
    const formdata = useSelector(state => state.formdata)
    const { data: groups } = useFetch({ firebaseFunction: 'getGroups' })
    const [selectedGroups, setSelectedGroups] = useState(formdata?.selectedGroups || [])
    const selectAll = () => {
        setSelectedGroups(prev => {
            if (prev.length === groups.length) return []
            return groups.map(group => group?.id)
        })
    }
    const selectGroup = (id) => {
        setSelectedGroups(prev => {
            if (prev.includes(id)) return prev.filter(groupId => groupId !== id)
            return [...prev, id]
        })
    }
    useEffect(() => {
        onChange(selectedGroups)
        console.log(selectedGroups)
        dispatch(setFormdata({ name: 'selectedGroups', value: selectedGroups }))
    }, [selectedGroups, dispatch])

    return (
        <div>

            <input className='bg-[lightgray] rounded border outline-none p-2   w-[300px]' placeholder='Seearch group' />
            <div className='flex flex-col'>
                <div className='border-b py-2'>
                    <CheckInput label={'Group name'} checked={selectedGroups.length === groups.length} onChange={() => {
                        selectAll()
                        onChange(selectedGroups)
                    }} />
                </div>
                {
                    groups.map(group => <div className='border-b py-2'>
                        <CheckInput label={group?.groupName} key={group?.id} checked={selectedGroups.includes(group?.id)} onChange={() => {
                            selectGroup(group?.id)
                        }} />
                    </div>)
                }
            </div>

        </div>
    )
}

export default SelectGroup