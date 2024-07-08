import React from 'react'
import { Input, RadaForm } from 'Components'
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { toast } from 'react-toastify';
import { useUsers } from 'hooks/useUsers';
import Text from 'Components/Text';
import { Divider } from '@mui/material';


const AddMemberstoGroup = ({ group }) => {
    const schema = Yup.object().shape({
        groupName: Yup.string().required(),
    })
    const { users } = useUsers()

    const dispatch = useDispatch()
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
                <Input name='groupId' hidden value={group?.id}/>
                <Input label={'Members'} name='members' type='select' isMulti options={users?.map(user => ({ label: user?.firstName + " " + user?.lastName, value: user?.uid }))} />

            </RadaForm>
            <br />
            <Divider />
            <br />
            <Text>
                Current Members ({group?.members?.length})
            </Text>

        </>
    )
}

export default AddMemberstoGroup