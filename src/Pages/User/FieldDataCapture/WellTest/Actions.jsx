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
import { Divider } from '@mui/material';
import { colors } from 'Assets';
import { MdOutlineCheck } from 'react-icons/md';
import { useFetch } from 'hooks/useFetch';
import CheckInput from 'Components/Input/CheckInput';
import { toast } from 'react-toastify';


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
        dispatch(openModal({ component: <Query /> }))
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



            <Button onClick={back} color={colors.rada_blue} bgcolor={'white'}  width={100} className={`float-left border !border-[${colors.rada_blue}] mt-[50px]`}>
                Back
            </Button>
            <Button onClick={send} width={100} className={'float-right mt-[50px]'}>
                Send
            </Button>
        </div>

    </div>
}
const Query = ({ title }) => {
    const [query, setQuery] = React.useState('')
    const dispatch = useDispatch()
    const send = async () => {
       if(query){
        dispatch(closeModal())
        dispatch(openModal({ component: <SendTo /> }))
       }else{
        toast.info("Please a query!")
       }
    }
    return <div className='w-[500px] p-1 h-[600px]'>
        <Text size={24}>Query Well Test Data Result</Text>

        <Divider className='!mt-[40px]' />
        <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
            <div className='h-[100px] flex items-center'>
                <Text weight={600} color={colors.rada_blue}>{title}</Text>
            </div>

            <textarea onChange={(e) => setQuery(e.target.value)} rows={10} className='w-full p-3'>

            </textarea>

            <Button onClick={send} width={100} className={'float-right mt-[50px]'}>
                Send
            </Button>
        </div>

    </div>
}

const Approve = () => {
    return <div className='w-[500px] p-1 h-[600px]'>
        <Text size={24}>Approve Well Test Result</Text>

        <Divider className='mt-5' />

        <div>
            <div>
                <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
                    <div className='h-[100px] flex items-center'>
                        <Text weight={600} color={colors.rada_blue}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024</Text>
                    </div>
                </div>
                <div className='flex items-center mt-5' >
                    <Text align={'center'} >
                        Are you sure you want to approve this Well Test result? Click the “Approve” button to continue, to cancel, click the “Close” button above.
                    </Text>
                </div>
            </div>

            <Button className={' float-right mt-4'}>
                Approve
            </Button>
        </div>

        {/* <div className='mt-20 p-2 rounded bg-[#F9FAFA] flex justify-center items-center h-72'>
            <div className='h-[100px] flex flex-col items-center justify-center'>
                <div className='bg-[#D5EDFF]  py-5 px-5 rounded-[50%]'>
                    <MdOutlineCheck color='#00A3FF' size={30} />
                </div>
                <Text weight={500} size={20} className='pt-5 ' >Approve Successful</Text>
                <div className='mt-5 flex items-center justify-center' >
                    <Text align={'center'}  weight={400} color={colors.rada_black}> You have Successfully approved <span style={{ fontWeight: '700' }} >Well Test DATA-OML99/Field1/Wells Schedule/July,2024</span></Text>
                </div>

            </div>

        </div> */}

        {/* <Button className={'float-right mt-4'}>
            Done
        </Button> */}

    </div>
}

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
                {/* <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Query /> })) }}>Query Result</MenuItem> */}
                <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Approve /> })) }}>Approve Result</MenuItem>
                <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Query wellTestResult={wellTestResult} title={title} /> })) }}>Query Result</MenuItem>
            </Menu>
        </div>
    );
}
