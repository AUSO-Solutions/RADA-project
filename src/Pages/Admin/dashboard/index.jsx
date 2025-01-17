import React from 'react'
import Layout from 'Components/layout'
import styles from './dashboard.module.scss'
import Text from 'Components/Text'
import { useQuery } from 'react-query'


const Dashboard = () => {



  const InfoCard = ({ url, name }) => {

    const { data } = useQuery(url)


    return (
      <div className={styles.card} >
        <Text color='#FFF' >
          {name}
        </Text>
        <Text size={'28px'} color='#FFF' >
          {data ? data.length : 0}
        </Text>
      </div>
    )
  }


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
            <InfoCard url={'get-all-production-volume'} name={'Total Production Volume'} />
            <InfoCard url={'get-all-cumulative-production'} name={'Total Cumulative Production'} />
            <InfoCard url={'get-all-well-flow'} name={'Total Well Flow'} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard