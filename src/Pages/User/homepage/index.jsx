import React from 'react'
import styles from './homepage.module.scss'
import { Layout } from 'Partials'
import { images } from 'Assets'
import { useNavigate } from 'react-router-dom'


const Homepage = () => {

  const navigate = useNavigate();


  const HomeCard = ({img, text, color, onClick}) => {

    return(
      <div style={{ width: '100%', cursor: 'pointer', }} onClick={onClick} >
          <img src={img} alt='' />
          <button  style={{ position: 'absolute', top: '66.4%', borderRadius: '5px', backgroundColor: color, color:'white', height: '100px', width: '321px',  fontSize: '23px', boxShadow: '0px 8px 25px 0px #BDDEF3',
           }} >{text}</button>
        </div>
    )

  }
  return (

    <div className={styles.body} >
      <div className={styles.ped} >
        <p style={{ fontWeight: 'bold', fontSize: '36px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>PED WEB APPLICATION</p>
        <p style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>CHOOSE YOUR ASSET</p>
      </div>
      <div className={styles.comp} >

        <HomeCard img={images.oml152} color={'#0274BD'} text={'OML 152'} onClick={() => navigate('/152/login')} />
        <HomeCard img={images.oml147} color={'#E51E3F'} text={'OML 147'} onClick={() => navigate('/147/login')}/>
        <HomeCard img={images.oml24} text={'OML 24'} color={'#2B1870'}onClick={() => navigate('/24/login')} />
      </div>


    </div>

  )
}

export default Homepage