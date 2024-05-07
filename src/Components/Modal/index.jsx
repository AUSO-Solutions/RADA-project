import { closeModal } from 'Store/slices/modalSlice'
import React from 'react'
import styles from './modal.module.scss'
import { useDispatch, useSelector } from 'react-redux'

const Modal = () => {
    const { component, title } = useSelector(state => state.modal)
    console.log(component)
    const dispatch = useDispatch()
    return (
        component && <>
            <div className='h-[100vh] bg-[black] w-[100vw] top-0 left-0  fixed' onClick={() => dispatch(closeModal(false))}></div>
            <div className={`${styles.inset_center} 'rounded min-w-[400px]  bg-[black]'`}>
                {title}

                {component}
            </div>
        </>
    )
}

export default Modal