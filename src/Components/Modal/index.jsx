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
            <div className='h-[100vh] bg-[black] z-[10] w-[100vw] top-0 left-0  opacity-[.3] fixed' onClick={() => dispatch(closeModal(false))}></div>
            <div className={`${styles.modal} rounded min-w-[400px] p-3  max-w-[fit-content] !bg-[white]`}>
                <Text size={20} weight={600} align={'center'}  className={'text-center mx-auto !w-[100%] border-b mb-4'}>
                    {title}
                </Text> <br />

                {component}
            </div>
        </>
    )
}

export default Modal