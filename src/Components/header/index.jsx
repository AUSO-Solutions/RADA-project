import React from 'react';
import styles from './header.module.scss'
import { BsChevronDown } from 'react-icons/bs'
import { Box, Typography } from '@mui/material';
// import ClickAway from '../clickaway';
import { Divider } from "@mui/material";
import { useState } from 'react';
import { useNavigate } from 'react-router';
// import { useDispatch, useSelector } from 'react-redux';
// import { logOutUser } from "../../store/reducers/user";
// import ClickAwayListener from 'react-click-away-listener';



function Header() {
    // const user = useSelector(state => state.user.data.details)
    const [drop, setDrop] = useState(false)
    // console.log(user)
    // const { data } = useSelector(state => state.user)
    // const user = data?.user_data
    // const dispatch = useDispatch()


    // const dispatch = useDispatch()
    // const navigate = useNavigate()

    // const logout = () => {
    //     dispatch(logOutUser())
    //     // dispatch(setId(null))
    //     navigate('/')
    // }
    // console.log(user)


    return (
        <div className={styles.body}>
            {/* <Typography size='17px' weight='500' > {`Welcome ${'Jane Doe'}!`} </Typography>
            <Box sx={{ width: '30%' }}>
               
            </Box> */}
            <Typography variant='h6' style={{color: '#143f2a'}} >RADA ADMIN PORTAL</Typography>
            <Box className={styles.right}>
                <div className={styles.circle} onClick={() => setDrop(true)} > {'EO'} </div>
                {/* {drop && <ClickAwayListener onClickAway={() => setDrop(false)} showshadow={true}
                > */}
                    {/* <div
                        className={styles.dropdown}
                    > */}
                        {/* <Typography
                            onClick={() => window.location.assign('/')}
                            className='font-bold cursor-pointer py-2'>
                            Home
                        </Typography> */}
                       
                        {/* <Divider /> */}
                        {/* <Typography className='font-bold cursor-pointer py-2'
                            onClick={() => logout()}
                            >
                            Logout</Typography> */}
                    {/* </div> */}
                {/* </ClickAwayListener>} */}
            </Box>
        </div>
    )
}

export default Header