import { Button } from 'Components'
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import Text from 'Components/Text';
import { Avatar, Divider } from '@mui/material';
import { colors } from 'Assets';
import { toast } from 'react-toastify';
import { CheckOutlined } from '@mui/icons-material';
import { SendTo } from './SendTo';


export const Query = ({ title, done }) => {
    const [query, setQuery] = React.useState('')
    const dispatch = useDispatch()
    const send = async () => {
        if (query) {
            dispatch(closeModal())
            dispatch(openModal({ component: <SendTo /> }))
        } else {
            toast.info("Please a query!")
        }
    }
    return <div className='w-[500px] p-1 h-[600px]'>
        <Text size={24}>Query Well Test Data Result</Text>

        <Divider className='!mt-[40px]' />
        {!done ? <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
            <div className='h-[100px] flex items-center'>
                <Text weight={600} color={colors.rada_blue}>{title}</Text>
            </div>

            <textarea onChange={(e) => setQuery(e.target.value)} rows={10} className='w-full p-3'>

            </textarea>

            <Button onClick={send} width={100} className={'float-right mt-[50px]'}>
                Send
            </Button>
        </div> : <div className='mt-[100px] h-[300px] border gap-2 flex flex-col items-center justify-center p-2 rounded bg-[#F9FAFA]'>

            <Avatar sx={{ bgcolor: '#00A3FF0D' }}>
                <CheckOutlined sx={{ color: '#00A3FF' }} />
            </Avatar>
            <Text size={24}>
                Query Sent
            </Text>
            <Text align={'center'} className={'block w-[85%] text-center'}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024 query has been sent successfully to the Field Engineers Group.</Text>
        </div>}

    </div>
}

