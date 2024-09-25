import { Button } from 'Components'
import { ArrowDown2 } from 'iconsax-react'
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import { useDispatch } from 'react-redux';
// import { closeModal, openModal } from 'Store/slices/modalSlice';
// import Text from 'Components/Text';
// import { Avatar, Divider } from '@mui/material';
// import { colors } from 'Assets';
// import { useFetch } from 'hooks/useFetch';
// import CheckInput from 'Components/Input/CheckInput';
// import { toast } from 'react-toastify';
// import { CheckOutlined } from '@mui/icons-material';



export default function Actions({ wellTestResult, title , actions}) {
    // console.log({ title })
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // const dispatch = useDispatch()

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

                {
                    actions.map(action =>  <MenuItem onClick={() => { handleClose(); action?.onClick() }}>{action?.name}</MenuItem>)
                }
                {/* <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Approve /> })) }}>Approve Result</MenuItem>
                <MenuItem onClick={() => { handleClose(); dispatch(openModal({ component: <Query wellTestResult={wellTestResult} title={title} /> })) }}>Query Result</MenuItem> */}
            </Menu>
        </div>
    );
}
