import React, { useMemo } from 'react';
import styles from './header.module.scss'
import { BsChevronDown } from 'react-icons/bs'
import { Box, Typography } from '@mui/material';
import ClickAway from '../clickaway';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
// import { logOutUser } from "../../store/reducers/user";
// import ClickAwayListener from 'react-click-away-listener';



function Header() {
    const user = useSelector(state => state.auth.user.data)
    const [drop, setDrop] = useState(false)
    // console.log(user)




    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logout = () => {
        dispatch()
        // dispatch(setId(null))
        navigate('/')
    }
    // console.log(user)

    const initials = useMemo(() => `${[...user?.firstName][0]} ${[...user?.lastName][0]}`.toUpperCase(), [user?.firstName, user?.lastName])


    return (
        <div className={` ${styles.body}`}>
            {/* <Typography size='17px' weight='500' > {`Welcome ${'Jane Doe'}!`} </Typography>
            <Box sx={{ width: '30%' }}>
               
            </Box> */}
            <Typography variant='h6' style={{ color: '#0274bd' }} >RADA ADMIN PORTAL</Typography>
            <Box className={`${styles.right}`}>
                <div className={styles.circle} onClick={() => setDrop(true)} > {initials} </div><BsChevronDown onClick={() => setDrop(true)} />
                {drop && <ClickAway onClickAway={() => setDrop(false)} showshadow={true}
                >
                    <div
                        className={`shadow ${styles.dropdown}`}
                    >
                        {/* <Typography
                            onClick={() => window.location.assign('/')}
                            className='font-bold cursor-pointer py-2'>
                            Home
                        </Typography> */}

                        {/* <Divider /> */}
                        <Typography className='font-bold cursor-pointer py-1'
                            onClick={() => logout()}
                        >
                            Logout</Typography>
                    </div>
                </ClickAway>}
            </Box>
        </div>
    )
}

export default Header