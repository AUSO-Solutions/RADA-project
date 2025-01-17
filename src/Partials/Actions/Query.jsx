import { Button } from 'Components'
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Text from 'Components/Text';
import { Avatar, Divider } from '@mui/material';
import { colors } from 'Assets';
import { CheckOutlined } from '@mui/icons-material';
import { setFormdata } from 'Store/slices/formdataSlice';
import SelectGroup from 'Partials/BroadCast/SelectGroup';
// import { firebaseFunctions } from 'Services';
import { updateSetupStatus } from './updateSetupStatus';
import { CloseCircle } from 'iconsax-react';


export const Query = ({ title, header, setupType, id, pagelink, onQuery = () => null }) => {
    const screens = [
        { name: 'query', },
        { name: 'selectGroup' },
        { name: 'sent' },
    ]
    const [curr, setCurr] = useState(0)
    const dispatch = useDispatch()
    const formdata = useSelector(state => state?.formdata)


    const send = async () => {
        try {
            if (curr === screens.length - 2) {
                await updateSetupStatus({ id, setupType, status: 'queried', statusMessage: formdata?.query, subject: 'Queried WellTest Data', groups: formdata?.selectedGroups, users: formdata?.selectedUsers, title, pagelink })
                onQuery()
                setCurr(prev => prev + 1)
            } else {
                setCurr(prev => prev + 1)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return <div className='w-[500px] p-1 h-[600px]'>
        <div className='flex items-center justify-between' >
            <Text size={24}>{header}</Text>
            <CloseCircle className='text-red-500' />
        </div>

        <Divider className='!mt-[40px]' />
        {
            screens[curr].name === 'selectGroup' && <>
                {/* <Text size={20} className={'my-3 block  '}>Select Group</Text> */}
                <br /> <br />
                <SelectGroup /></>
        }
        {
            screens[curr].name === 'query' && <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
                <div className='h-[100px] flex items-center'>
                    <Text weight={600} color={colors.rada_blue}>{title}</Text>
                </div>

                <textarea placeholder='Add a query message' onChange={(e) => dispatch(setFormdata({ name: 'query', value: e.target.value }))} rows={10} className='w-full font-[20px] p-3'>

                </textarea>


            </div>
        }

        <div className='flex h-[70px] items-center mt-2' >
            <Text align={'center'} >
                Are you sure you want to Query this result? Click the “Proceed” button to continue, or click the close icon or outside the modal to close.
            </Text>
        </div>
        {
            screens[curr].name === 'sent' && <div className='mt-[100px] h-[300px] border gap-2 flex flex-col items-center justify-center p-2 rounded bg-[#F9FAFA]'>

                <Avatar sx={{ bgcolor: '#00A3FF0D' }}>
                    <CheckOutlined sx={{ color: '#00A3FF' }} />
                </Avatar>
                <Text size={24}>
                    Query Sent
                </Text>
                <Text align={'center'} className={'block w-[85%] text-center'}>{title} query has been sent successfully to the {formdata?.selectedGroups?.map(group => group?.groupName).join(',  ')}</Text>
            </div>
        }
        {curr !== screens.length - 1 && <Button onClick={send} width={100} className={'float-right mt-[50px]'}>
            {curr === screens.length - 2 ? "Send" : 'Proceed'}
        </Button>}
    </div>
}

