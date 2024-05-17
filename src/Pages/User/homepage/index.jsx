import React from 'react'
import styles from './homepage.module.scss'
// import { images } from 'Assets'
// import { useNavigate } from 'react-router-dom'
import UserLogin from '../Auth/Login'
// import Text from 'Components/Text'


const Homepage = () => {



  return (

    <div className={styles.body} >
      {/* <div className={styles.ped} >
      </div> */}
      <div className={styles.comp} >

        


        <UserLogin />
      </div>


    </div>

  )
}

export default Homepage