import React, { useState } from 'react'
import styles from './tableaction.module.scss'

import { BsThreeDotsVertical } from 'react-icons/bs';
function TableAction({ actions = [] , data }) {
    const [show, setShow] = useState(false)
    return (
        <>
            <div className={styles.actionstyle}>
                <BsThreeDotsVertical size={20} onClick={() => setShow(!show)} />
            </div>
            {show && <div className={styles.popup}>
                {actions.map(({ text, onClick = () => null }) => {
                    return <div onClick={()=>onClick(data)}>{text}</div>
                })}
            </div>}
            {
                show && <div className={styles.outside} onClick={() => setShow(false)}>

                </div>
            }
        </>
    )
}

export default TableAction