import React from 'react'
import styles from './layout.module.scss'
import { images } from 'Assets'
import { useSelector } from 'react-redux'
import img from '../../Assets/images/newcrossfield.jpg'


const Layout = ({ children }) => {

    const state = useSelector(state => state.auth.user.data)
    console.log(state)



    return (
        <div className={styles.layout} >

            <div style={{ backgroundImage: `url(${img})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover', height: "100vh", width: "100vw", backgroundBlendMode: 'multiply', color:'' }} className='!bg-[darkslategray] absolute z-[1] opacity-[.9]' >

            </div>

            <div className={`absolute z-[10] flex flex-col h-full -center ${styles.content}`}>
                <div className='z-[1] flex flex-col justify-center  items-center'>
                    <div>
                        <img src={state?.assetType === 'OML_152' ? images.newcross152 : state?.assetType === 'OML_147' ? images.panocean147 : state?.assetType === 'OML_24' ? images.nepl24 : images.logo} alt="" />
                    </div>
                    {/* <div style={{ display: 'flex', gap: '100px', padding: '10px', borderRadius: '5px' }} >
                        <Text weight={'600'} color={'#0274bd'} size={'18px'} > Hi, {state?.firstName}</Text>
                        <Text weight={'600'} color={'#0274bd'} size={'18px'} > {state?.email} </Text>
                    </div> */}
                </div>
                {children}
            </div>
        </div>
    )
}

export default Layout