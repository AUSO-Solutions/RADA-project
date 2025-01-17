import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';

export default function Loading() {
    const state = useSelector(state => state?.loadingScreen?.isOpen)
    return (
        state ? <>

            <div className='   z-[100000] w-[100vw] top-0 left-[50%] top-[50%] fixed'>
                {/* <Box sx={{ display: 'flex' }}> */}
                <CircularProgress title='loadding' className='' />
                {/* </Box> */}
            </div>

            <div className='h-[100vh] bg-[black] z-[10000] w-[100vw] top-0 left-0   opacity-[.5] fixed' ></div>
        </>
            : <></>
    );
}