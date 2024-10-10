import { Button } from 'Components'
import { ArrowDown2 } from 'iconsax-react'
import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Actions({ actions, children }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <div  onClick={handleClick} >

                {children || <Button id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined} width={120} >Actions <ArrowDown2 /></Button>}
            </div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >

                {actions.map(action => <MenuItem onClick={() => { handleClose(); action?.onClick() }}>{action?.name}</MenuItem>)
                }
            </Menu>
        </div>
    );
}