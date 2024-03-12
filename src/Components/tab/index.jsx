import React from 'react'
import styles from './tab.module.scss'

const Tab = ({ text, number = null, active = true, onClick = () => null }) => {
    return (
        <div className={`${styles.button} ${active && styles.borderb}`} onClick={onClick}>
            <div className={`${styles.textTab} ${active ? styles.textActive : styles.textInactive}`}>{text}</div>
            {number !== null && <div className={styles.numberText}>{number}</div>}
        </div>
    )
}

export default Tab