import React from 'react';
import styles from './navbar.module.scss'
import { BsChevronDown } from 'react-icons/bs'
import { Box, Typography } from '@mui/material';
// import ClickAway from '../clickaway';
import { useState } from 'react';
import {  useSelector } from 'react-redux';
import ProfilePopup from 'Pages/Profile/ProfilePopup';

function Navbar() {
    const [drop, setDrop] = useState(false)
    // const dispatch = useDispatch()
    // const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    // console.log(user)
console.log(drop)
    return (
        <div className={` ${styles.body}`}>
            <Typography fontSize={"24px"} fontWeight={600} style={{ color: '#000000' }} >Welcome {user?.data?.firstName}</Typography>
            <Box className={styles.rightContain} >
                <div  onClick={() => setDrop(true)} className={styles.circle}  > {user?.data?.firstName[0] + user?.data?.lastName[0]} </div>
                <BsChevronDown    onClick={() => setDrop(true)}/>
                {drop && <><div  onClick={() => setDrop(false)} className='bg-[black] z-[1000] fixed h-[100vh] w-[100vw] opacity-[.1] left-0 top-0'></div>
                    <ProfilePopup onEdit={() => setDrop(false)}/>
                </>}
            </Box>
        </div>
    )
}

export default Navbar