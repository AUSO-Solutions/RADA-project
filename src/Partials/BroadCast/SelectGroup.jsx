import CheckInput from 'Components/Input/CheckInput'
import { useFetch } from 'hooks/useFetch'
import React, { useEffect, useRef, useState } from 'react'
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
            return groups
        })
    }
    const selectGroup = (group) => {
        setSelectedGroups(prev => {
            if (prev.map(gr => gr?.id).includes(group?.id)) return prev.filter(group_ => group_?.id !== group?.id)
            return [...prev, group]
        })
    }
    useEffect(() => {
        onChange(selectedGroups)
        dispatch(setFormdata({ name: 'selectedGroups', value: selectedGroups }))
        // eslint-disable-next-line
    }, [selectedGroups, dispatch])
    const [searchWord,setSearchWord] = useState('')

    return (
        <div>

            <input className='bg-[lightgray] rounded border outline-none p-2   w-[300px]' placeholder='Search group' onChange={e => setSearchWord(e.target.value)} />
            <div className='flex flex-col'>
                <div className='border-b py-2'>
                    <CheckInput label={'Selete all'} checked={selectedGroups.length === groups.length} onChange={() => {
                        selectAll()
                        onChange(selectedGroups)
                    }} />
                </div>
                {
                    groups.filter(group =>  group?.groupName.toLowerCase()?.includes(searchWord?.toLowerCase())).map(group => <div className='border-b py-2'>
                        <CheckInput label={group?.groupName} key={group?.id} checked={selectedGroups?.map(({ id }) => id).includes(group?.id)} onChange={() => {
                            selectGroup(group)
                        }} />
                    </div>)
                }
            </div>

        </div>
    )
}

export default SelectGroup