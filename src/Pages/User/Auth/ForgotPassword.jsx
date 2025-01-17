import { Input, RadaForm } from 'Components'
import OTPInput from 'Components/Input/OTPInput';
import Text from 'Components/Text'
import React, { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useDispatch } from 'react-redux';
import { setLoadingScreen } from 'Store/slices/loadingScreenSlice';

const ForgotPassword = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState()
    // const onSuccess = () => {
    //     toast.success('Code sent to your email. ')
    //     navigate(`/forgot-password?page=otp&email=${email}`)
    // }
    // const schema = Yup.object().shape({
    //     email: Yup.string().required(),
    // });
    const { search } = useLocation()
    const dispatch = useDispatch()

    const forms = useMemo(() => {
        return {
            "default": {
                header: 'Forgot Password',
                btnText: 'Send',
                // url: '/forgot-password',
                method: 'post',
                onSubmit: async (data) => {
                    dispatch(setLoadingScreen({ open: true }))
                    try {
                        const auth = getAuth()
                        await sendPasswordResetEmail(auth, data?.email)
                        toast.success(`Code sent to your email ${data?.email}`)
                        navigate(`/`)
                    } catch (error) {

                    } finally {
                        dispatch(setLoadingScreen({ open: false }))
                    }
                },
                // onSuccess: (res, req) => {
                //     console.log({ res, req })
                //     toast.success(`Code sent to your email ${req?.email}`)
                //     navigate(`/forgot-password?page=validate-otp&email=${req?.email}`)
                // },
                schema: Yup.object().shape({
                    email: Yup.string().required(),
                }),
                fields: [{ type: 'email', name: 'email', label: 'Email', onChange: (e) => setEmail(e.target.value) }]
            },
            "validate-otp": {
                header: 'OTP',
                btnText: 'Validate',
                url: '/validate-otp',
                method: 'get',
                onSuccess: (res, req) => {
                    toast.success('OTP validated successfully.')
                    navigate(`/forgot-password?page=change-password&email=${email}&otp=${req?.otp}`)
                },
                schema: Yup.object().shape({
                    otp: Yup.string().required(),
                }),
                fields: [],
                Component: <div className='w-100 flex !justify-center'><OTPInput onChange={setOtp} name={'otp'} /></div>
            },
            "change-password": {
                header: 'Enter new Password',
                btnText: 'Validate',
                url: '/forgot-password/reset',
                method: 'put',
                onSuccess: () => {
                    toast.success('Password reset successful.')
                    navigate(`/login`)
                },
                schema: Yup.object().shape({
                    newPassword: Yup.string().required(),
                    confirmPassword: Yup.string().required(),
                }),
                fields: [
                    { hidden: true, type: 'email', name: 'email', value: email },
                    { hidden: true, type: 'number', name: 'otp', value: otp },
                    { type: 'password', name: 'newPassword', label: 'New password' },
                    { type: 'password', name: 'confirmPassword', label: 'Confirm passwoord' },
                ]
            }
        }
    }, [email, otp, navigate, dispatch])

    const currentForm = useMemo(() => {
        const searchParams = new URLSearchParams(search)
        const page = Object.fromEntries(searchParams).page?.toLowerCase()
        console.log(page)
        if (page && forms[page]) return forms[page]
        return forms.default
        // eslint-disable-next-line
    }, [search])

    const formClass = 'w-[500px] mx-auto flex flex-col items-center justify-center bg-[white] p-[50px] shadow rounded-[5px] '
    return (
        <div className='h-[100vh] flex items-center'>

            <RadaForm
                className={formClass}
                btnClass={'w-[200px]'}
                btnText={currentForm.btnText} onSubmit={currentForm.onSubmit}
                method={currentForm.method} validationSchema={currentForm.schema}

            >
                <Text size={20} weight={600} className={'text-center'}>
                    {currentForm.header}
                </Text>

                <div className='w-[400px] mt-[30px]'>
                    {
                        currentForm.fields.map(field => <Input key={field.label} {...field} />)
                    }
                    {
                        currentForm.Component
                    }
                </div>

                <div className='flex w-[100%] mt-3'>
                    <Link to={'/'}>login</Link>
                </div>
            </RadaForm>
        </div>
    )
}

export default ForgotPassword