import React, { useMemo } from 'react';
import styles from './navbar.module.scss'
import { BsChevronDown } from 'react-icons/bs'
import { Box, Typography } from '@mui/material';
// import ClickAway from '../clickaway';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProfilePopup from 'Pages/Profile/ProfilePopup';
import { Chart } from 'iconsax-react';
import { colors } from 'Assets';
import { useLocation, useNavigate } from 'react-router-dom';
import { GrUserAdmin } from 'react-icons/gr';

function Navbar() {
    const [drop, setDrop] = useState(false)
    // const dispatch = useDispatch()
    // const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    // console.log(user)
    // console.log(user)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const isAdmin = useMemo(() => {
        return (pathname.split('/')[1]) === 'admin'
    }, [pathname])
    const onGo = () => {
        if (isAdmin) {
            navigate('/users/dashboard')
            // toast.info('You are now in the user section!')
        } else {
            navigate('/admin/users')
            // toast.info('You are now in the admin section!')
        }
    }
    return (
        <div className={` ${styles.body}`}>
            <Typography fontSize={"24px"} fontWeight={600} style={{ color: '#000000' }} >Welcome {user?.data?.firstName}</Typography>
            <div className='flex gap-3 items-center'>
                {user?.data?.roles?.map(role => role?.roleName)?.includes('Admin') &&<Box borderColor={colors.rada_blue} className='p-1 border rounded' onClick={onGo}>{isAdmin?<Chart color={colors.rada_blue} />:<GrUserAdmin size={20}  color={colors.rada_blue}/>}</Box>}
                <Box className={styles.rightContain} >
                    <div onClick={() => setDrop(true)} className={styles.circle}  > {user?.data?.firstName[0] + user?.data?.lastName[0]} </div>
                    <BsChevronDown onClick={() => setDrop(true)} />
                    {drop && <><div onClick={() => setDrop(false)} className='bg-[black] z-[1000] fixed h-[100vh] w-[100vw] opacity-[.1] left-0 top-0'></div>
                        <ProfilePopup onEdit={() => setDrop(false)} />
                    </>}
                </Box>
            </div>
        </div>
    )
}

export default Navbar