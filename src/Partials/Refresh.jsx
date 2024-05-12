import { refreshToken } from 'Services/refreshToken';
import { logout, reuse } from 'Store/slices/auth';
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';


let timer = 0;
const Refresh = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state?.auth?.user)
    const {pathname} =  useLocation()
    // console.log(dayjs(state?.lastUsedApp).format('YYYY MMM DD hh:mm:ssA'))
    useEffect(() => {
        // refreshToken()
        timer = setInterval(() => {
            const time_spent_after_login = dayjs().diff(state?.loggedInAt, 'seconds')
            const time_spent_without_activity = dayjs().diff(state?.lastUsedApp, 'seconds')

            console.log({ time_spent_after_login, time_spent_without_activity })
            if (time_spent_after_login > 28 * 60) {
                if (time_spent_without_activity > 28 * 60) {
                    dispatch(logout())
                } else {
                  if(pathname !== '/login')  refreshToken()
                }
            }

        }, 5000)

        window.addEventListener('focus', () => {
            dispatch(reuse())
        })
        return () => {
            clearInterval(timer)
            window.removeEventListener('focus', () => {

            })
        }
    }, [state?.loggedInAt, dispatch, state?.lastUsedApp,pathname])

    return (
        ''
    )
}

export default Refresh