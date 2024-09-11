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


const Query = () => {
    return <div className='w-[500px] p-2 h-[600px]'>
        <Text size={24}>Query Well Test Data Result</Text>
        <Divider />
        <div className='mt-5 rounded bg-light'>
dd
        </div>

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
                <MenuItem onClick={handleClose}>Approve Result</MenuItem>
            </Menu>
        </div>
    );
}
