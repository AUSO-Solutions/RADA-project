import { closeModal } from 'Store/slices/modalSlice'
import React from 'react'
import styles from './modal.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import Text from 'Components/Text'

const Modal = () => {
    const { component, title } = useSelector(state => state.modal)

    const dispatch = useDispatch()
    return (
        component && <>
            <div className='h-[100vh] bg-[black] z-[10] w-[100vw] top-0 left-0   opacity-[.3] fixed' onClick={() => dispatch(closeModal(false))}></div>
            <div className={`${styles.modal} rounded-[12px]  p-[24px]   max-h-[700px]  !bg-[white]`}>
                <div className='flex justify-center'>
                    <Text size={20} weight={600} align={'center'} className={'text-center mx-auto !mb-[0px]'}>
                        {title}
                    </Text>
                </div>
                <br />

                {component}
            </div>
        </>
    )
}

export default Modal