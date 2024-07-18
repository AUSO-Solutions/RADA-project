import React, { useMemo } from 'react';
import styles from './navbar.module.scss'
import { BsChevronDown } from 'react-icons/bs'
import { Box, Typography } from '@mui/material';
import ClickAway from '../clickaway';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'Store/slices/auth';
// import { logOutUser } from "../../store/reducers/user";
// import ClickAwayListener from 'react-click-away-listener';



function Navbar() {
    // const user = useSelector(state => state.auth.user.data)
    const [drop, setDrop] = useState(false)
    // console.log(user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logout_ = () => {
        dispatch(logout())
        // dispatch(setId(null))
        navigate('/')
    }
    // console.log(user)

    // const initials = useMemo(() => `${[...user?.firstName][0]} ${[...user?.lastName][0]}`.toUpperCase(), [user?.firstName, user?.lastName])


    return (
        <div className={` ${styles.body}`}>
            {/* <Typography size='17px' weight='500' > {`Welcome ${'Jane Doe'}!`} </Typography>
            <Box sx={{ width: '30%' }}>
               
            </Box> */}
            <Typography fontSize={"24px"} fontWeight={600} style={{ color: '#000000' }} >Welcome Hillary</Typography>
            <Box className={styles.rightContain} >
                {/* <Box className={`${styles.right}`}>

                </Box> */}
                <div className={styles.circle} onClick={() => setDrop(true)} > { } </div><BsChevronDown onClick={() => setDrop(true)} />
                {drop && <ClickAway onClickAway={() => setDrop(false)} showshadow={true}
                >
                    <div
                        className={`shadow ${styles.dropdown}`}
                    >

                        <Typography className='font-bold cursor-pointer py-1 relative z-[100]'
                            onClick={() => logout_()}
                        >
                            Logout</Typography>
                    </div>
                </ClickAway>}
            </Box>
        </div>
    )
}

export default Navbar