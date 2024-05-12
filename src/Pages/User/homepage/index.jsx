import React from 'react'
import styles from './homepage.module.scss'
// import { images } from 'Assets'
// import { useNavigate } from 'react-router-dom'
import UserLogin from '../Auth/Login'
// import Text from 'Components/Text'


const Homepage = () => {



  return (

    <div className={styles.body} >
      <div className={styles.ped} >
        <p style={{ fontWeight: 'bold', fontSize: '26px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', color:'white' }}>PED WEB APPLICATION</p>
        {/* <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>CHOOSE YOUR ASSET</p> */}
      </div>
      <div className={styles.comp} >

        


        <UserLogin />
      </div>


    </div>

  )
}

export default Homepage