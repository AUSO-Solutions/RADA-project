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

            <div style={{ backgroundImage: `url(${img})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover', height: "100vh", width: "100vw", backgroundBlendMode: 'multiply', overlay: '' }} className=' absolute z-[1] opacity-[.5]' >

            </div>

            <div className={`absolute z-[10] ${styles.content}`}>
                <div className='z-[1] flex  justify-between items-center shadow-[_0px_5px_4px_rgba(0,0,0,0.25)] bg-[white] w-[100%] pl-[20px] pr-[20px] fixed top-0'>

                    <div>
                        <p style={{ fontWeight: 'bold', fontSize: '26px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}>PED WEB APPLICATION</p>

                    </div>

                    <div >
                        <img style={{ filter: 'drop-shadow(0.13rem 0.13rem  white)', width: '200px', height: '100px', }} src={state?.assetType === 'OML_152' ? images.newcross152 : state?.assetType === 'OML_147' ? images.panocean147 : state?.assetType === 'OML_24' ? images.nepl24 : images.logo} alt="" />
                    </div>
                    {/* <div style={{ display: 'flex', gap: '100px', padding: '10px', borderRadius: '5px' }} >
                        <Text weight={'600'} color={'#0274bd'} size={'18px'} > Hi, {state?.firstName}</Text>
                        <Text weight={'600'} color={'#0274bd'} size={'18px'} > {state?.email} </Text>
                    </div> */}
                </div>
                <div className=' flex flex-col  justify-center items-center w-[100%] !h-[100%]' >
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout