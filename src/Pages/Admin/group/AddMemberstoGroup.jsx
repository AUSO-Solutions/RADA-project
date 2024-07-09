import React, { useMemo, useState } from 'react'
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { toast } from 'react-toastify';
import { useUsers } from 'hooks/useUsers';
import Text from 'Components/Text';
import { Divider } from '@mui/material';
import { IoCloseCircle, IoLogoClosedCaptioning } from 'react-icons/io5';
import { firebaseFunctions } from 'Services';



const AddMemberstoGroup = ({ group }) => {
    const schema = Yup.object().shape({
        groupName: Yup.string().required(),
    })
    const { users } = useUsers()
    const [deleteLoading, setDeleteLoading] = useState(false)

    const deleteMember = async ({ groupId, member }) => {
        setDeleteLoading(true)
        try {
            await firebaseFunctions('deleteGroupMember', { groupId, member })
            setMembers(prev => prev.filter(prev => prev?.uid !== member))

        } catch (error) {

        } finally {
            setDeleteLoading(false)
        }
    }

    const dispatch = useDispatch()
    const usersAddable = useMemo(() => {
        return users
            .filter(user => !group?.members
                ?.map(member => member?.uid)
                ?.includes(user?.uid))
            .map(user => ({ label: user?.firstName + " " + user?.lastName, value: user?.uid }))
    })
    const [members, setMembers] = useState(group.members)
    return (
        <>
            <RadaForm
                // validationSchema={schema}
                noToken
                btnText={'Submit'}
                btnClass={'w-[100%] flex justify-center'}
                url={"addMembersToGroup"}
                onSubmit={console.log}
                method={'post'}
                className={'w-[400px]'}
                onSuccess={() => {
                    toast.success('Successful')
                    dispatch(closeModal())
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
                <Text size={'20px'} weight={600}>{group?.groupName}</Text>
                <Input name='groupId' hidden value={group?.id} />
                <Input label={'Members'} name='members' type='select' isMulti options={usersAddable} />

            </RadaForm>
            <br />
            <Divider />
            <br />
            <Text>
                Current Members ({members?.length}) <br />
                double click <IoCloseCircle className='inline' /> button to remove member from group
            </Text>
            <div className='flex flex-wrap mt-1 gap-2 max-w-[400px]'>
                {
                    members?.map(({ name, uid }) => {
                        return (
                            <>
                                <Text className={' rounded p-1 items-center gap-3  !flex border'}>
                                    {name} {
                                        deleteLoading ? null : <IoCloseCircle onDoubleClick={() => deleteMember({ groupId: group?.id, member: uid })} className='cursor-pointer' />
                                    }
                                </Text>

                            </>
                        )
                    })
                }

            </div>

        </>
    )
}

export default AddMemberstoGroup