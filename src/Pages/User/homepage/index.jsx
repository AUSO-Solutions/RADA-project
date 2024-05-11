import React from 'react'
import styles from './homepage.module.scss'
// import { images } from 'Assets'
// import { useNavigate } from 'react-router-dom'
import UserLogin from '../Auth/Login'


const Homepage = () => {



  return (

    <div className={styles.body} >
      <div className={styles.ped} >
        <p style={{ fontWeight: 'bold', fontSize: '26px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>PED WEB APPLICATION</p>
        {/* <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>CHOOSE YOUR ASSET</p> */}
      </div>
      <div className={styles.comp} >

        <div>
          ldldl
        </div>
        <div>
          kdkfk
        </div>


        <UserLogin />
      </div>


    </div>

  )
}

export default Homepage