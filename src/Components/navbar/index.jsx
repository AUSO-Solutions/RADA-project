import React from 'react';
import styles from './navbar.module.scss'
import { BsChevronDown } from 'react-icons/bs'
import { Box, Typography } from '@mui/material';
import ClickAway from '../clickaway';
import { useState } from 'react';
// import { useNavigate } from 'react-router';
import {  useSelector } from 'react-redux';
// import { logout } from 'Store/slices/auth';
// import { getAuth, signOut } from 'firebase/auth';
// import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';
import { logout_ } from 'utils/logout';

function Navbar() {
    const [drop, setDrop] = useState(false)
    // const dispatch = useDispatch()
    // const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    // console.log(user)

    return (
        <div className={` ${styles.body}`}>
            <Typography fontSize={"24px"} fontWeight={600} style={{ color: '#000000' }} >Welcome {user?.data?.firstName}</Typography>
            <Box className={styles.rightContain} >
                <div className={styles.circle} onClick={() => setDrop(true)}  > {user?.data?.firstName[0] + user?.data?.lastName[0]} </div>
                <BsChevronDown onClick={() => setDrop(true)} />
                {drop && <ClickAway onClickAway={() => setDrop(false)} showshadow={true}
                >
                    <div onClick={() => logout_()}
                        className={`shadow ${styles.dropdown}`}
                    >
                        <Typography className='font-bold cursor-pointer py-1 relative  z-[100]'

                        >
                            Logout</Typography>
                    </div>
                </ClickAway>}
            </Box>
        </div>
    )
}

export default Navbar