import { Button } from 'Components'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import Text from 'Components/Text';
import {  Divider } from '@mui/material';
import { colors } from 'Assets';
import { MdOutlineCheck } from 'react-icons/md';
import SelectGroup from 'Partials/BroadCast/SelectGroup';
import { updateSetupStatus } from './updateSetupStatus';

export const Approve = ({title, header, setupType, id, pagelink, onQuery = () => null }) => {
    const [approved, setApproved] = React.useState(false)
    const formdata = useSelector(state => state?.formdata)
    const approveWelltest =async () => {
        // if (curr === screens.length - 2) {
            await updateSetupStatus({ id, setupType, status: 'approved', subject: 'Approved WellTest Data', groups: formdata?.selectedGroups, users: formdata?.selectedUsers, title, pagelink })
            setApproved(true)
        //     setCurr(prev => prev + 1)
        // } else {
        //     setCurr(prev => prev + 1)
        // }
    }
    const dispatch = useDispatch()
    return <div className='w-[500px] p-3 h-fit'>
        <Text size={24}>{header}</Text>

        <Divider className='mt-5' />
        {!approved ?
            <div >
                <div>
                    <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
                        <div className='h-[70px] flex items-center'>
                            <Text weight={600} color={colors.rada_blue}>{title}</Text>
                        </div>
                    </div>
                    
                </div>
                <SelectGroup/>
                <div className='flex h-[70px] items-center mt-2' >
                        <Text align={'center'} >
                            Are you sure you want to approve this Well Test result? Click the “Approve” button to continue, to cancel, click the “Close” button above.
                        </Text>
                    </div>
                <Button width={100} onClick={approveWelltest} className={' float-right mt-4'}>
                    Approve
                </Button>
            </div>
            :
            <> <div className='mt-20 p-2 rounded bg-[#F9FAFA] flex justify-center items-center h-72'>
                <div className='h-[100px] flex flex-col items-center justify-center'>
                    <div className='bg-[#D5EDFF]  py-5 px-5 rounded-[50%]'>
                        <MdOutlineCheck color='#00A3FF' size={30} />
                    </div>
                    <Text weight={500} size={20} className='pt-5 ' >Approve Successful</Text>
                    <div className='mt-5 flex items-center justify-center' >
                        <Text align={'center'} weight={400} color={colors.rada_black}> You have Successfully approved <span style={{ fontWeight: '700' }} >
                            {title}</span></Text>
                    </div>

                </div>

            </div>

                <Button  onClick={()=>dispatch(closeModal())} className={'float-right mt-4'}>
                    Done
                </Button></>}

    </div>
}