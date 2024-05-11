import React from 'react'
import styles from './layout.module.scss'
import { images } from 'Assets'
import { useSelector } from 'react-redux'
import Text from 'Components/Text'


const Layout = ({ children }) => {

    const state = useSelector(state => state.auth.user.data)
    console.log(state)



    return (
        <div className={styles.layout}>
            <div>
                <img src={state?.assetType === 'OML_152' ? images.newcross152 : state?.assetType === 'OML_147' ? images.panocean147 : state?.assetType === 'OML_24' ? images.nepl24 : images.logo} alt="" />
            </div>
            <div style={{ display: 'flex', gap: '100px' }} >
                <Text weight={'600'} color={'#000'} size={'18px'} > Hi, {state?.firstName}</Text>
                <Text weight={'600'} color={'#000'} size={'18px'} > {state?.email} </Text>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}

export default Layout