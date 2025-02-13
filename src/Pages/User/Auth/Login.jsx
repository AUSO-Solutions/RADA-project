
import { Input, RadaForm } from 'Components'
// import { images } from 'Assets'
import * as Yup from 'yup';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setUser } from 'Store/slices/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Grid } from '@mui/material';
import Text from 'Components/Text';
import img from 'Assets/images/newcrossfield.jpg'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseFunctions } from 'Services';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';
import { updateStatus } from 'utils/updateUserStatus';
import newLogoo from 'Assets/images/radaNewLogoo.svg'

const UserLogin = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const schema = Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required().min(8),
    })

    return (
        <Grid
            container
            md={12}
            sx={{
                display: 'flex',
                height: '100vh',
                // flexDirection:'column',
                // bgcolor: "red !important",
                width: '100% !important',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Grid item className='flex justify-center items-center' sx={{ backgroundImage: `url(${img})`, height: '100vh', backgroundSize: 'cover', backgroundPosition: 'top', backgroundRepeat: 'no-repeat', }} md={12} >
                {/* <img style={{ filter: 'drop-shadow(0.13rem 0.13rem  white)', width: '200px', height: '100px', }} src={images.logo} alt="" /> */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    zIndex: 1
                }}></div>
                <Grid style={{ position: 'relative', zIndex: 2 }} >
                    <RadaForm
                        validationSchema={schema}
                        btnClass={'w-[100%] '}
                        className={'w-[500px] mx-auto text-[black] bg-[#ffffff]  p-[50px] shadow  rounded-[5px]'}
                        // #0274bd
                        // bg-[rgba(255, 255, 255, 0.5)]
                        btnText={'Login'}
                        // url={'login'}
                        method={'post'}
                        noToken
                        onSubmit={async (data) => {
                            try {
                                dispatch(setLoadingScreen({ open: true }))
                                const auth = getAuth()
                                const { user } = await signInWithEmailAndPassword(auth, data?.email, data?.password)
                                const details = await firebaseFunctions('getUserByUid', { uid: user?.uid })
                                const token = (await user.getIdToken())
                                const roles = details?.data?.roles?.map(role => role?.roleName)
                                console.log(roles)
                                dispatch(setUser({ ...details, token }))
                                // if (!roles?.length) toast.error('Please request role assignment from admin')
                                updateStatus("online")
                                if (roles?.includes('Admin')) {
                                    navigate('/admin/users')
                                } else {
                                    navigate('/users/fdc/daily')
                                }

                            } catch (error) {
                                console.log(error?.message)
                                toast.error(error?.code)
                                if (error?.code === 'auth/invalid-credential') {
                                    toast.error('Invalid credentials!')
                                }
                            } finally {
                                dispatch(setLoadingScreen({ open: false }))
                            }
                        }}
                        onSuccess={(res) => {
                            // const user = (res?.data)
                            // console.log(user)
                            // dispatch(setUser(user))
                            // navigate('/admin/users')
                            // const role = res?.data?.roles[0]
                            // const roles_login_paths = {
                            //     "SUPER_ADMIN": "/admin/home",
                            //     "FIELD_OPERATOR": "/data-form",
                            //     "QUALITY_CONTROLLER": '/admin/home'
                            // }
                            // 

                            // s01MdWjT
                        }}

                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '700px', gap: '20px' }}
                    >
                        <div className='mb-10' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                            <img height={150} width={150} alt='logo' src={newLogoo} />
                            <Text size={'28px'} weight={800} >RADA AMS</Text>
                            <Text size={'16px'} weight={600} >ASSET MANAGEMENT SOLUTION</Text>
                        </div>
                        <Text className={'w-[100%] !flex justify-center'} size={'20px'} weight={'600'}>
                            Sign in
                        </Text>
                        <Input label={'Email'} className='!bg-light' name='email' placeholder={"johndoe@gmail.com"} />
                        <Input label={'Password'} className='!bg-light' name='password' placeholder={'password'} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '300px' }} >
                            {/* <Button width={'100px'} shadow onClick={() => window.location.pathname.includes('152') ? navigate('/152/register') : window.location.pathname.includes('147') ? navigate('/147/register') : navigate('/24/register')} >
                    Register
                </Button> */}
                            {/* <Button width={'100px'} shadow onClick={() => login({ email: '', "password": "" })} >
                    Login
                </Button> */}
                        </div>

                        <Link to={'/forgot-password'} className='flex cursor-pointer'>
                            Forget password?
                        </Link>
                    </RadaForm>
                </Grid>
            </Grid>

        </Grid>
    )
}

export default UserLogin