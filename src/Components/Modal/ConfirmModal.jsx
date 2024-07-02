import { Stack } from '@mui/material'
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
    onCancel = () => null
}) => {
    const dispatch = useDispatch()
    return (
        <div className='text-center'>
            <Text size={'16px'} weight={'400'} className={'mb-4 '}>{message}</Text>
            <Stack direction={'row'} justifyContent={'center'} mt={3}  spacing={2}>
                <Button bgcolor={'white'} color={'red'} className={'border px-3 border-[red] text-[red]'} onClick={() => {
                    onCancel()
                    dispatch(closeModal())
                }} >
                    {leftText}
                </Button>
                <Button onClick={onProceed}  bgcolor={'red'} className={'px-3'}>
                    {rightText}
                </Button>
            </Stack>
        </div>
    )
}

export default ConfirmModal