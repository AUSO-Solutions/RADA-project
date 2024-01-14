import React, { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import AnimateHeight from 'react-animate-height'
import styles from './dropdown.module.scss'

const Dropdown = ({ header, children }) => {

    const [toggle, setToggle] = useState(false)

    return (
        <div className={styles.body} >
            <div className={styles.container} >
                <ul className={styles.ulist}>
                    <li className={styles.list} >
                        <div className={styles.toggle} onClick={() => setToggle(!toggle)}>
                            <p   >{header}</p>
                            <BsChevronDown style={{ cursor: 'pointer', display: 'block', color: 'white' }} />
                        </div>
                    </li>
                </ul>
                <AnimateHeight
                    id="example-panel"
                    duration={500}
                    height={toggle ? 'auto' : 0} // see props documentation below
                >

                    <div style={{ padding: '10px 20px 10px 30px', backgroundColor: 'white', borderRadius: '10px'  }} >
                        {children}
                    </div>


                </AnimateHeight>
            </div>

        </div>
    )
}

export default Dropdown