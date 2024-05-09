import React from 'react'
import styles from './layout.module.scss'
import { images } from 'Assets'


const Layout = ({ children }) => {



    return (
        <div className={styles.layout}>
            <div className={styles.content} >
                <img src={window.location.pathname.includes('152') ? images.newcross152 : window.location.pathname.includes('147') ? images.panocean147 : window.location.pathname.includes('24') ? images.nepl24 : images.logo} alt="" />
            </div>
            {children}

        </div>
    )
}

export default Layout