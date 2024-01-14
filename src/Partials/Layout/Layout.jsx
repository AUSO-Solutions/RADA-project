import React from 'react'
import styles from './layout.module.scss'
import { images } from 'Assets'

const Layout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <div className='flex border w-full justify-center'>
                <img src={images.logo} alt="" />
            </div>
            {children}
        </div>
    )
}

export default Layout