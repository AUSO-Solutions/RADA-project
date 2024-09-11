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
import { openModal } from 'Store/slices/modalSlice';
import Text from 'Components/Text';
import { Divider } from '@mui/material';
import { colors } from 'Assets';
import { MdOutlineCheck } from 'react-icons/md';


const Query = () => {
    return <div className='w-[500px] p-1 h-[600px]'>
        <Text size={24}>Query Well Test Data Result</Text>

        <Divider className='mt-5' />
        <div className='mt-5 p-2 rounded bg-[#F9FAFA]'>
            <div className='h-[100px] flex items-center'>
                <Text weight={600} color={colors.rada_blue}>Well Test DATA-OML99/Field1/Wells Schedule/July,2024</Text>
            </div>

            <textarea rows={10} className='w-full p-3'>

            </textarea>

            <Button className={'float-right mt-4'}>
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

export default function Actions() {
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
                <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Query /> })) }}>Query Result</MenuItem>
                <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Approve /> })) }}>Approve Result</MenuItem>
            </Menu>
        </div>
    );
}
