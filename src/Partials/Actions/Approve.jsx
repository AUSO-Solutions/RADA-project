import { Button } from 'Components'
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from 'Store/slices/modalSlice';
import Text from 'Components/Text';
import {  Divider } from '@mui/material';
import { colors } from 'Assets';
import { MdOutlineCheck } from 'react-icons/md';

export const Approve = () => {
    const [approved, setApproved] = React.useState(false)
    const approveWelltest = () => {
        setApproved(true)
    }
    const dispatch = useDispatch()
    return <div className='w-[500px] p-1 h-[600px]'>
        <Text size={24}>Approve Well Test Result</Text>

        <Divider className='mt-5' />
        {!approved ?
            <div >
                <div>
                    <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
                        <div className='h-[100px] flex items-center'>
                            <Text weight={600} color={colors.rada_blue}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024</Text>
                        </div>
                    </div>
                    <div className='flex h-[150px] items-center mt-5' >
                        <Text align={'center'} >
                            Are you sure you want to approve this Well Test result? Click the “Approve” button to continue, to cancel, click the “Close” button above.
                        </Text>
                    </div>
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
                        <Text align={'center'} weight={400} color={colors.rada_black}> You have Successfully approved <span style={{ fontWeight: '700' }} >Well Test DATA-OML99/Field1/Wells Schedule/July,2024</span></Text>
                    </div>

                </div>

            </div>

                <Button  onClick={()=>dispatch(closeModal())} className={'float-right mt-4'}>
                    Done
                </Button></>}

    </div>
}