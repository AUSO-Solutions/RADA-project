import React, { useState } from 'react'
import Layout from 'Components/layout'
import Tab from 'Components/tab'
import UserData from '../usersdata'

const Reports = () => {


  const [tab, setTab] = useState(0)

  const tabs = [

    'Production Volume',
    'Cumulative Production',
    'Well Flow',


  ]

  const update_column = (columns = []) => {
    return columns.map(column => {
      if (column.key === 'wellIdentity') return ({ ...column, key: 'wellID' })
      return column
    })
  }

  return (
    <Layout name={"FIELD REPORTS"}>
      <div style={{ padding: '20px', width: '100%' }}>
        < tabs style={{ display: 'flex', gap: '20px' }} >
          {tabs.map((x, i) => <Tab key={i} text={x} active={i === tab} onClick={() => setTab(i)} />)}
        </ tabs>


        {(tab === 0) && <UserData url={'/fields/get-all-production-volume'} header={'Production Volume'} fn={(data) => update_column(data)} />}
        {(tab === 1) && <UserData url={'fields/get-all-cumulative-production'} header={'Cumulative Production'} fn={(data) => update_column(data)} />}
        {(tab === 2) && <UserData url={'fields/get-all-well-flow'} header={'Well Flow'} fn={(data) => update_column(data)} />}

      </div>
    </Layout>
  )
}

export default Reports