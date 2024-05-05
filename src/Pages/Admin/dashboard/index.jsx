import React from 'react'
import Layout from 'Components/layout'
import styles from './dashboard.module.scss'

const Dashboard = () => {


  return (
    <Layout name='HOME'  >
      <div style={{
        display: "flex",
        justifyContent: "start",
        gap: "5%",
        padding: "30px 10px",
      }}  >
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              Production Volume
              (50)
            </div>
            <div>
              Production Volume
            </div>
            <div>
              Production Volume
            </div>
          </div>
          <div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard