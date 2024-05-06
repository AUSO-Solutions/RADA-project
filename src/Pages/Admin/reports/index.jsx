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
    // 'OFM Sys Configuration',
    // 'OFM Sys Date Range',
    // 'OFM Sys Field Production',
    // 'OFM Sys Multipliers',
    // 'OFM Sys Parser',
    // 'OFM Sys Table Info',
    // 'OFM Sys Table Map',
    // 'OFM Sys Units',
    // 'Buttom Head Pressure',
    // 'Deviation Data',
    // 'OFM Data DCA Ratio',
    // 'OFM Data DCA RadioForecast',

  ]

  return (
    <Layout name={"FIELD REPORTS"}>
      <div style={{ padding: '20px', width: '100%' }}>
        < tabs style={{ display: 'flex', gap: '20px' }} >
          {tabs.map((x, i) => <Tab key={i} text={x} active={i === tab} onClick={() => setTab(i)} />)}
        </ tabs>

        {(tab === 0) && <UserData url={'/fields/get-all-production-volume'} header={'Production Volume'} />}
        {(tab === 1) && <UserData url={'fields/get-all-cumulative-production'} header={'Cumulative Production'} />}
        {(tab === 2) && <UserData url={'fields/get-all-well-flow'} header={'Well Flow'} />}

      </div>
    </Layout>
  )
}

export default Reports