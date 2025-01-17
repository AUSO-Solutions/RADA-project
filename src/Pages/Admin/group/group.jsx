import React, { useEffect, useMemo, useState } from 'react'
import { Input, RadaForm } from 'Components'
// import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import { toast } from 'react-toastify';
import { useUsers } from 'hooks/useUsers';
import Text from 'Components/Text';
import { Box, Divider } from '@mui/material';
import { IoCloseCircle, } from 'react-icons/io5';
import { firebaseFunctions } from 'Services';
import { useParams } from 'react-router-dom';
import { useFetch } from 'hooks/useFetch';
import { useAssetNames } from 'hooks/useAssetNames';



const Group = () => {
    const { groupId } = useParams()
    const [refetch,setRefetch]=useState(null)

    const { data: group } = useFetch({ firebaseFunction: 'getGroups', payload: { groupId },refetch })
    const { assetNames } = useAssetNames({getAll:true})
    const { users } = useUsers()
    const [deleteLoading, setDeleteLoading] = useState(false)

    const deleteMember = async ({ groupId, member }) => {
        setDeleteLoading(true)
        try {
            await firebaseFunctions('deleteGroupMember', { groupId, member })
            setMembers(prev => prev.filter(prev => prev?.uid !== member))
            setRefetch(Math.random())
        } catch (error) {

        } finally {
            setDeleteLoading(false)
        }
    }


    const deleteAsset = async ({ groupId, asset }) => {
        setDeleteLoading(true)
        try {
            await firebaseFunctions('deleteGroupAsset', { groupId, asset })
            // setMembers(prev => prev.filter(prev => prev?.id !== asset))
            setRefetch(Math.random())
            setGroupDetail(prev => ({ ...prev, assets: prev?.assets?.filter(assetDetail => assetDetail !== asset) }))
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
    }, [group, users])
    const assetsAddable = useMemo(() => {
        return Array.from(new Set(assetNames))
            .filter(assetName => !group?.assets?.includes(assetName))
            .map(assetName => ({ label: assetName, value: assetName }))
    }, [group, assetNames])


    const [members, setMembers] = useState(group?.members)
    const [groupDetails, setGroupDetail] = useState(group)
    useEffect(() => {
        setMembers(group?.members)
        setGroupDetail(group)
    }, [group])
    return (
        <Box component={'div'} className='p-3'>

            <Text weight={'600'} size={'20px'}> {group?.groupName}</Text>
            <Divider />
            <br />

            <div>
                <Text weight={'600'} size={'16px'}>    Current Members ({members?.length})</Text>  double click <IoCloseCircle className='inline' /> button to remove member from group
            </div>
            <div className='flex flex-wrap mt-1 gap-2 max-w-[800px]'>
                {members?.length ?
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
                    }) : "No members present "
                }

            </div>
            <br />

            <div>
                <Text weight={'600'} size={'16px'}>    Current Assets ({groupDetails?.assets?.length})</Text>  double click <IoCloseCircle className='inline' /> button to remove asset from group
            </div>
            <div className='flex flex-wrap mt-1 gap-2 max-w-[800px]'>
                {groupDetails?.assets?.length ?
                    groupDetails?.assets?.map((assetName) => {
                        return (
                            <>
                                <Text className={' rounded p-1 items-center gap-3  !flex border'}>
                                    {assetName} {
                                        deleteLoading ? null : <IoCloseCircle onDoubleClick={() => deleteAsset({ groupId: group?.id, asset: assetName })} className='cursor-pointer' />
                                    }
                                </Text>

                            </>
                        )
                    }) : "No assets present "
                }

            </div>
            <br /> <br />
            <Text weight={'600'} size={'16px'}> Add member </Text>
            <RadaForm
                // validationSchema={schema} 
                key={group?.members?.length}
                noToken
                btnText={'Submit'}
                btnClass={'w-[100%] flex justify-center'}
                url={"addMembersToGroup"}
                onSubmit={console.log}
                method={'post'}
                className={'w-[400px]'}
                onSuccess={() => {
                    setRefetch(Math.random())
                    toast.success('Successful')
                    dispatch(closeModal())
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
                {/* <Text size={'20px'} weight={600}>{group?.groupName}</Text> */}
                <Input name='groupId' hidden value={group?.id} />
                <Input label={'Members'} name='members' type='select' isMulti options={usersAddable} />

            </RadaForm>
            <br />

            <Text weight={'600'} size={'16px'}> Assign asset </Text>
            <RadaForm
                // validationSchema={schema}
                key={group?.assets?.length}
                noToken
                btnText={'Submit'}
                btnClass={'w-[100%] flex justify-center'}
                url={"assignAssetsToGroup"}
                onSubmit={console.log}
                method={'post'}
                className={'w-[400px]'}
                onSuccess={() => {
                    setRefetch(Math.random())
                    toast.success('Successful')
                    dispatch(closeModal())
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '600px', gap: '20px' }} >
                {/* <Text size={'20px'} weight={600}>{group?.groupName}</Text> */}
                <Input name='groupId' hidden value={group?.id} />
                <Input label={'Assets'} name='assets' type='select' isMulti options={assetsAddable} />

            </RadaForm>
        </Box>
    )
}

export default Group