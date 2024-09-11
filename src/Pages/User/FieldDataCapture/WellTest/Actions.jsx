import { Button } from 'Components'
import { ArrowDown2 } from 'iconsax-react'
// import React from 'react'

// const Actions = () => {
//   return (
//     <div>
//     </div>
//   )
// }

// export default Actions

import * as React from 'react';
// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from 'Store/slices/modalSlice';
import Text from 'Components/Text';
import { Avatar, Divider } from '@mui/material';
import { colors } from 'Assets';
import { useFetch } from 'hooks/useFetch';
import CheckInput from 'Components/Input/CheckInput';
import { toast } from 'react-toastify';
import { CheckOutlined } from '@mui/icons-material';


const SendTo = ({ title }) => {
    const dispatch = useDispatch()
    const { data: groups } = useFetch({ firebaseFunction: 'getGroups' })
    const [selectedGroups, setSelectedGroups] = React.useState([])
    const back = async () => {
        dispatch(closeModal())
        dispatch(openModal({ component: <Query /> }))
    }
    const selectGrroup = (group) => {
        setSelectedGroups(prev => {
            if (prev.map(group => group?.groupName).includes(group?.groupName)) {
                return prev.filter(prevGroup => prevGroup?.groupName !== group?.groupName)
            }
            return [...prev, group]
        })
    }
    const send = async () => {
        console.log(selectedGroups)
        dispatch(closeModal())
        dispatch(openModal({ component: <Query done /> }))
    }
    return <div className='w-[500px] p-1 h-[600px]'>
        <Text size={24}>Send to</Text>

        <Divider className='!mt-[40px]' />

        <input type="search" className='border bg-[#FAFAFAFA] px-2 py-1 w-[200px] mt-4 rounded' placeholder='Search group' />
        <div className='mt-5 p-2  !h-[100px] f'>
            < div className='py-2 border-b'>
                <CheckInput label={'Select all group'} key={selectedGroups.length} checked={selectedGroups.length === groups.length} onChange={(e) => {
                    setSelectedGroups(prev => {
                        console.log(prev.length === groups.length)
                        return prev.length === groups.length ? [] : groups
                    })
                }} />
            </div>
            <div className='flex flex-col'>
                {
                    groups.map(group => <div className='py-2 border-b'>
                        <CheckInput onChange={() => selectGrroup(group)} checked={selectedGroups.includes(group)} key={group?.groupName} label={group.groupName} />
                    </div>)
                }
            </div>



            <Button onClick={back} color={colors.rada_blue} bgcolor={'white'} width={100} className={`float-left border !border-[${colors.rada_blue}] mt-[50px]`}>
                Back
            </Button>
            <Button onClick={send} width={100} className={'float-right mt-[50px]'}>
                Send
            </Button>
        </div>

    </div>
}
const Query = ({ title, done }) => {
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
                <CheckOutlined sx={{ color:'#00A3FF'}} />
            </Avatar>
            <Text size={24}>
                Query Sent
            </Text>
            <Text align={'center'} className={'block w-[85%] text-center'}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024 query has been sent successfully to the Field Engineers Group.</Text>
        </div>}

    </div>
}

// const Approve =()=>{
//     return <div className='w-[500px] p-1 h-[600px]'>
//     <Text size={24}>Query Well Test Data Result</Text>

//     <Divider className='mt-5' />
//     <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
//         <div className='h-[100px] flex items-center'>
//             <Text weight={600} color={colors.rada_blue}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024</Text>
//         </div>

//         <textarea rows={10} className='w-full p-3'>

//         </textarea>

//         <Button className={'float-right mt-4'}>
//             Send
//         </Button>
//     </div>

// </div>
// }

export default function Actions({ wellTestResult, title }) {
    console.log({ title })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const dispatch = useDispatch()

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined} onClick={handleClick} width={120} >Actions <ArrowDown2 /></Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Query wellTestResult={wellTestResult} title={title} /> })) }}>Query Result</MenuItem>
                <MenuItem onClick={handleClose}>Approve Result</MenuItem>
            </Menu>
        </div>
    );
}
