import { Stack } from '@mui/material'
import { colors } from 'Assets'
import { Button } from 'Components'
import Text from 'Components/Text'
import { closeModal } from 'Store/slices/modalSlice'
import React from 'react'
import { useDispatch } from 'react-redux'

const ConfirmModal = ({
    message = 'Are you sure you want to proceed?',
    leftText = 'Cancel',
    rightText = 'Proceed',
    onProceed = () => null,
    onCancel = () => null, children,
    color=colors.rada_blue, loading
}) => {
    const dispatch = useDispatch()
    return (
        <div >
            {
                message && <div className='text-center'>
                    <Text size={'16px'} weight={'400'} className={'mb-4 text-center '} block>{message}</Text>
                </div>
            }
            {children}
            <Stack direction={'row'} justifyContent={'center'} mt={3} spacing={2}>
                <Button style={{borderColor:color}} bgcolor={'white'} color={color}  className={'border px-3 '} onClick={() => {
                    onCancel()
                    dispatch(closeModal())
                }} >
                    {leftText}
                </Button>
                <Button onClick={onProceed} disabled={loading} bgcolor={color} className={'px-3'}>
                    {loading ? 'Loading...' : rightText}
                </Button>
            </Stack>
        </div>
    )
}

export default ConfirmModal